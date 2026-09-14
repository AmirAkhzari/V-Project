import { Prisma } from "@prisma/client";

export type Availability = "available" | "unavailable";

export type SwitchItemInput = {
  id: string;
  barcode: string | null;
  qty: number;
};

export type CatalogProduct = {
  id: string;
  barcode: string | null;
  pricePerCase: Prisma.Decimal;
};

export type SwitchItemResult = {
  id: string;
  barcode: string | null;
  qty: number;
  productId: string | null;
  unitPrice: Prisma.Decimal;
  availability: Availability;
};

export function usableBarcode(barcode: string | null): string | null {
  if (barcode == null) return null;
  const trimmed = barcode.trim();
  if (trimmed === "") return null;
  return trimmed;
}

export function matchItemsByBarcode(
  items: SwitchItemInput[],
  catalog: CatalogProduct[],
): SwitchItemResult[] {
  const byBarcode = new Map<string, CatalogProduct[]>();
  for (const product of catalog) {
    const barcode = usableBarcode(product.barcode);
    if (barcode == null) continue;
    const list = byBarcode.get(barcode) ?? [];
    list.push(product);
    byBarcode.set(barcode, list);
  }

  return items.map((item) => {
    const barcode = usableBarcode(item.barcode);
    if (barcode == null) {
      return {
        ...item,
        productId: null,
        unitPrice: new Prisma.Decimal(0),
        availability: "unavailable",
      };
    }
    const matches = byBarcode.get(barcode) ?? [];
    if (matches.length !== 1) {
      return {
        ...item,
        productId: null,
        unitPrice: new Prisma.Decimal(0),
        availability: "unavailable",
      };
    }
    const product = matches[0];
    return {
      ...item,
      productId: product.id,
      unitPrice: product.pricePerCase,
      availability: "available",
    };
  });
}
