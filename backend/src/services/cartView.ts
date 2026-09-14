import { Prisma } from "@prisma/client";
import { money, toIsoDate } from "../serialize";

export type CartItemView = {
  id: string;
  product_id: string | null;
  barcode: string | null;
  name: string | null;
  qty: number;
  unit_price: string;
  availability: "available" | "unavailable";
  min_order_qty: number | null;
  units_per_case: number | null;
  stock_in_cases: number | null;
};

export type CartView = {
  id: string | null;
  shopkeeper_id: string;
  distributor_id: string | null;
  delivery_date: string | null;
  items: CartItemView[];
  totals: {
    cases: number;
    amount: string;
  };
};

type CartRecord = {
  id: string;
  shopkeeperId: string;
  distributorId: string;
  deliveryDate: Date | null;
  items: Array<{
    id: string;
    productId: string | null;
    barcode: string | null;
    qty: number;
    unitPrice: Prisma.Decimal;
    availability: "available" | "unavailable";
    product: {
      name: string;
      minOrderQty: number;
      unitsPerCase: number;
      stockInCases: number;
    } | null;
  }>;
};

export function emptyCart(shopkeeperId: string): CartView {
  return {
    id: null,
    shopkeeper_id: shopkeeperId,
    distributor_id: null,
    delivery_date: null,
    items: [],
    totals: { cases: 0, amount: money(0) },
  };
}

export function presentCart(cart: CartRecord): CartView {
  const items: CartItemView[] = cart.items.map((item) => ({
    id: item.id,
    product_id: item.productId,
    barcode: item.barcode,
    name: item.product?.name ?? null,
    qty: item.qty,
    unit_price: money(item.unitPrice),
    availability: item.availability,
    min_order_qty: item.product?.minOrderQty ?? null,
    units_per_case: item.product?.unitsPerCase ?? null,
    stock_in_cases: item.product?.stockInCases ?? null,
  }));

  const available = items.filter((item) => item.availability === "available");
  const cases = available.reduce((sum, item) => sum + item.qty, 0);
  const amount = available.reduce(
    (sum, item) => sum.add(new Prisma.Decimal(item.unit_price).mul(item.qty)),
    new Prisma.Decimal(0),
  );

  return {
    id: cart.id,
    shopkeeper_id: cart.shopkeeperId,
    distributor_id: cart.distributorId,
    delivery_date: cart.deliveryDate ? toIsoDate(cart.deliveryDate) : null,
    items,
    totals: { cases, amount: money(amount) },
  };
}
