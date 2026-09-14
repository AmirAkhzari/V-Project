import { PrismaClient } from "@prisma/client";
import { apiError } from "../errors";
import { isCasesQty, parseIsoDate } from "../serialize";
import { TenantTx, withTenant } from "../tenant";
import { emptyCart, presentCart, CartView } from "./cartView";
import { matchItemsByBarcode } from "./productMatch";

const cartInclude = {
  items: {
    include: { product: true },
    orderBy: { createdAt: "asc" as const },
  },
};

export class CartService {
  constructor(private readonly prisma: PrismaClient) {}

  async getCart(shopkeeperId: string): Promise<CartView> {
    return withTenant(this.prisma, { shopkeeperId }, async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { shopkeeperId },
        include: cartInclude,
      });
      if (!cart) return emptyCart(shopkeeperId);
      await this.refreshAvailability(tx, cart.distributorId, cart.items);
      const refreshed = await tx.cart.findUniqueOrThrow({
        where: { id: cart.id },
        include: cartInclude,
      });
      return presentCart(refreshed);
    });
  }

  async patchCart(
    shopkeeperId: string,
    body: {
      delivery_date?: string | null;
      items?: Array<{ id?: string; product_id?: string; qty: number }>;
    },
  ): Promise<CartView> {
    return withTenant(this.prisma, { shopkeeperId }, async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { shopkeeperId },
        include: cartInclude,
      });
      if (!cart) throw apiError(404, "CART_NOT_FOUND");

      if (Object.prototype.hasOwnProperty.call(body, "delivery_date")) {
        const deliveryDate =
          body.delivery_date == null ? null : parseIsoDate(body.delivery_date);
        await tx.cart.update({
          where: { id: cart.id },
          data: { deliveryDate },
        });
      }

      if (body.items) {
        for (const patch of body.items) {
          if (!isCasesQty(patch.qty)) {
            throw apiError(400, "CASES_ONLY", "qty must be an integer number of cases");
          }
          const item = cart.items.find(
            (row) => row.id === patch.id || (patch.product_id && row.productId === patch.product_id),
          );
          if (!item) throw apiError(404, "CART_ITEM_NOT_FOUND");
          if (item.availability === "available" && item.product && patch.qty < item.product.minOrderQty) {
            throw apiError(400, "MOQ_NOT_MET");
          }
          await tx.cartItem.update({
            where: { id: item.id },
            data: { qty: patch.qty },
          });
        }
      }

      const updated = await tx.cart.findUniqueOrThrow({
        where: { id: cart.id },
        include: cartInclude,
      });
      await this.refreshAvailability(tx, updated.distributorId, updated.items);
      const refreshed = await tx.cart.findUniqueOrThrow({
        where: { id: cart.id },
        include: cartInclude,
      });
      return presentCart(refreshed);
    });
  }

  async addItem(
    shopkeeperId: string,
    productId: string,
    qty: number,
  ): Promise<CartView> {
    if (!isCasesQty(qty)) {
      throw apiError(400, "CASES_ONLY", "qty must be an integer number of cases");
    }

    return withTenant(this.prisma, { shopkeeperId }, async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw apiError(404, "PRODUCT_NOT_FOUND");

      if (qty < product.minOrderQty) {
        throw apiError(400, "MOQ_NOT_MET");
      }

      let cart = await tx.cart.findUnique({
        where: { shopkeeperId },
        include: cartInclude,
      });

      if (cart && cart.distributorId !== product.distributorId) {
        throw apiError(400, "DISTRIBUTOR_LOCKED", "one cart = one distributor");
      }

      if (!cart) {
        cart = await tx.cart.create({
          data: {
            shopkeeperId,
            distributorId: product.distributorId,
          },
          include: cartInclude,
        });
      }

      const existing = cart.items.find((item) => item.productId === product.id);
      const nextQty = existing ? existing.qty + qty : qty;
      if (nextQty < product.minOrderQty) {
        throw apiError(400, "MOQ_NOT_MET");
      }

      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: {
            qty: nextQty,
            unitPrice: product.pricePerCase,
            barcode: product.barcode,
            availability: "available",
          },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId: product.id,
            barcode: product.barcode,
            qty: nextQty,
            unitPrice: product.pricePerCase,
            availability: "available",
          },
        });
      }

      const updated = await tx.cart.findUniqueOrThrow({
        where: { id: cart.id },
        include: cartInclude,
      });
      await this.refreshAvailability(tx, updated.distributorId, updated.items);
      const refreshed = await tx.cart.findUniqueOrThrow({
        where: { id: cart.id },
        include: cartInclude,
      });
      return presentCart(refreshed);
    });
  }

  async switchDistributor(shopkeeperId: string, distributorId: string): Promise<CartView> {
    return withTenant(this.prisma, { shopkeeperId, distributorId }, async (tx) => {
      const distributor = await tx.distributor.findUnique({ where: { id: distributorId } });
      if (!distributor) throw apiError(404, "DISTRIBUTOR_NOT_FOUND");

      const catalog = await tx.product.findMany({
        where: { distributorId },
      });

      const cart = await tx.cart.findUnique({
        where: { shopkeeperId },
        include: cartInclude,
      });

      if (!cart) {
        const created = await tx.cart.create({
          data: { shopkeeperId, distributorId },
          include: cartInclude,
        });
        return presentCart(created);
      }

      const matched = matchItemsByBarcode(
        cart.items.map((item) => ({
          id: item.id,
          barcode: item.barcode,
          qty: item.qty,
        })),
        catalog.map((product) => ({
          id: product.id,
          barcode: product.barcode,
          pricePerCase: product.pricePerCase,
        })),
      );

      await tx.cart.update({
        where: { id: cart.id },
        data: { distributorId },
      });

      for (const item of matched) {
        await tx.cartItem.update({
          where: { id: item.id },
          data: {
            productId: item.productId,
            barcode: item.barcode,
            qty: item.qty,
            unitPrice: item.unitPrice,
            availability: item.availability,
          },
        });
      }

      const updated = await tx.cart.findUniqueOrThrow({
        where: { id: cart.id },
        include: cartInclude,
      });
      return presentCart(updated);
    });
  }

  async clearCart(shopkeeperId: string): Promise<CartView> {
    return withTenant(this.prisma, { shopkeeperId }, async (tx) => {
      const cart = await tx.cart.findUnique({ where: { shopkeeperId } });
      if (cart) {
        await tx.cart.delete({ where: { id: cart.id } });
      }
      return emptyCart(shopkeeperId);
    });
  }

  private async refreshAvailability(
    tx: TenantTx,
    distributorId: string,
    items: Array<{
      id: string;
      productId: string | null;
      qty: number;
      availability: "available" | "unavailable";
      product: { stockInCases: number; distributorId: string } | null;
    }>,
  ): Promise<void> {
    for (const item of items) {
      const product =
        item.productId == null
          ? null
          : await tx.product.findFirst({
              where: { id: item.productId, distributorId },
            });
      const available = product != null && product.stockInCases >= item.qty;
      const next: "available" | "unavailable" = available ? "available" : "unavailable";
      if (next !== item.availability || (product == null && item.productId != null)) {
        await tx.cartItem.update({
          where: { id: item.id },
          data: {
            availability: next,
            productId: product == null ? null : item.productId,
          },
        });
      }
    }
  }
}
