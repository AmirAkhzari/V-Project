import { Prisma, PrismaClient } from "@prisma/client";
import { CAPACITY_UNAVAILABLE_MESSAGE } from "../constants";
import { apiError } from "../errors";
import { advisoryLockKey, money, parseIsoDate, requestHash, toIsoDate } from "../serialize";
import { withTenant } from "../tenant";

type LockedProduct = {
  id: string;
  barcode: string | null;
  price_per_case: Prisma.Decimal;
  stock_in_cases: number;
  min_order_qty: number;
};

type LockedCapacity = {
  id: string;
  slots_remaining: number;
};

export type OrderView = {
  id: string;
  shopkeeper_id: string;
  distributor_id: string;
  delivery_date: string;
  status: "placed";
  total: string;
  items: Array<{
    product_id: string;
    barcode: string | null;
    qty: number;
    unit_price: string;
  }>;
};

export class OrderService {
  constructor(private readonly prisma: PrismaClient) {}

  async placeOrder(
    shopkeeperId: string,
    idempotencyKey: string,
    body: { delivery_date: string },
  ): Promise<{ order: OrderView; replayed: boolean }> {
    const deliveryDate = parseIsoDate(body.delivery_date);
    const hash = requestHash(body);
    const lockKey = advisoryLockKey(shopkeeperId, idempotencyKey);

    return withTenant(this.prisma, { shopkeeperId }, async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${lockKey})`;

      const existing = await tx.orderIdempotency.findUnique({
        where: {
          shopkeeperId_idempotencyKey: { shopkeeperId, idempotencyKey },
        },
      });
      if (existing) {
        if (existing.requestHash !== hash) {
          throw apiError(409, "IDEMPOTENCY_KEY_REUSE");
        }
        if (!existing.orderId) {
          throw apiError(409, "IDEMPOTENCY_KEY_REUSE");
        }
        const order = await this.loadOrder(tx, existing.orderId);
        return { order, replayed: true };
      }

      const cart = await tx.cart.findUnique({
        where: { shopkeeperId },
        include: {
          items: { include: { product: true }, orderBy: { createdAt: "asc" } },
        },
      });
      if (!cart || cart.items.length === 0) {
        throw apiError(400, "CART_EMPTY");
      }

      await tx.$executeRaw`SELECT set_config('app.distributor_id', ${cart.distributorId}, true)`;

      if (cart.items.some((item) => item.availability === "unavailable" || item.productId == null)) {
        throw apiError(409, "UNAVAILABLE_ITEMS");
      }

      const productIds = cart.items.map((item) => item.productId as string).sort();
      const lockedProducts = await tx.$queryRaw<LockedProduct[]>`
        SELECT id, barcode, price_per_case, stock_in_cases, min_order_qty
        FROM products
        WHERE distributor_id = ${cart.distributorId}::uuid
          AND id IN (${Prisma.join(productIds)})
        ORDER BY id
        FOR UPDATE
      `;
      const productById = new Map(
        lockedProducts.map((row) => [
          row.id,
          { ...row, price_per_case: new Prisma.Decimal(row.price_per_case) },
        ]),
      );

      for (const item of cart.items) {
        const product = productById.get(item.productId as string);
        if (!product || product.stock_in_cases < item.qty) {
          throw apiError(409, "UNAVAILABLE_ITEMS");
        }
        if (item.qty < product.min_order_qty) {
          throw apiError(400, "MOQ_NOT_MET");
        }
        if (!product.price_per_case.eq(item.unitPrice)) {
          throw apiError(409, "PRICE_CHANGED");
        }
      }

      const lockedCapacity = await tx.$queryRaw<LockedCapacity[]>`
        SELECT id, slots_remaining
        FROM delivery_capacity
        WHERE distributor_id = ${cart.distributorId}::uuid
          AND date = ${deliveryDate}
        FOR UPDATE
      `;
      const capacity = lockedCapacity[0];
      if (!capacity || capacity.slots_remaining <= 0) {
        throw apiError(409, "CAPACITY_UNAVAILABLE", CAPACITY_UNAVAILABLE_MESSAGE);
      }

      const total = cart.items.reduce(
        (sum, item) =>
          sum.add(productById.get(item.productId as string)!.price_per_case.mul(item.qty)),
        new Prisma.Decimal(0),
      );

      const order = await tx.order.create({
        data: {
          shopkeeperId,
          distributorId: cart.distributorId,
          deliveryDate,
          total,
          status: "placed",
          items: {
            create: cart.items.map((item) => {
              const product = productById.get(item.productId as string)!;
              return {
                productId: product.id,
                barcode: product.barcode,
                qty: item.qty,
                unitPrice: product.price_per_case,
              };
            }),
          },
          payments: {
            create: {
              amount: total,
              status: "pending",
            },
          },
        },
        include: { items: true },
      });

      for (const item of cart.items) {
        const product = productById.get(item.productId as string)!;
        const updated = await tx.product.updateMany({
          where: {
            id: product.id,
            distributorId: cart.distributorId,
            stockInCases: { gte: item.qty },
          },
          data: { stockInCases: { decrement: item.qty } },
        });
        if (updated.count !== 1) {
          throw apiError(409, "UNAVAILABLE_ITEMS");
        }
      }

      const slots = await tx.deliveryCapacity.updateMany({
        where: {
          id: capacity.id,
          distributorId: cart.distributorId,
          slotsRemaining: { gt: 0 },
        },
        data: { slotsRemaining: { decrement: 1 } },
      });
      if (slots.count !== 1) {
        throw apiError(409, "CAPACITY_UNAVAILABLE", CAPACITY_UNAVAILABLE_MESSAGE);
      }

      await tx.orderIdempotency.create({
        data: {
          shopkeeperId,
          idempotencyKey,
          requestHash: hash,
          orderId: order.id,
        },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return { order: presentOrder(order), replayed: false };
    });
  }

  private async loadOrder(tx: Prisma.TransactionClient, orderId: string): Promise<OrderView> {
    const order = await tx.order.findUniqueOrThrow({
      where: { id: orderId },
      include: { items: true },
    });
    return presentOrder(order);
  }
}

function presentOrder(order: {
  id: string;
  shopkeeperId: string;
  distributorId: string;
  deliveryDate: Date;
  status: "placed";
  total: Prisma.Decimal;
  items: Array<{
    productId: string;
    barcode: string | null;
    qty: number;
    unitPrice: Prisma.Decimal;
  }>;
}): OrderView {
  return {
    id: order.id,
    shopkeeper_id: order.shopkeeperId,
    distributor_id: order.distributorId,
    delivery_date: toIsoDate(order.deliveryDate),
    status: order.status,
    total: money(order.total),
    items: order.items.map((item) => ({
      product_id: item.productId,
      barcode: item.barcode,
      qty: item.qty,
      unit_price: money(item.unitPrice),
    })),
  };
}
