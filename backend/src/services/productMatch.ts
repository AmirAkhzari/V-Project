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

export function matchItemsByBarcode(
  items: SwitchItemInput[],
  catalog: CatalogProduct[],
): SwitchItemResult[] {
  const byBarcode = new Map<string, CatalogProduct[]>();
  for (const product of catalog) {
    if (product.barcode == null) continue;
    const list = byBarcode.get(product.barcode) ?? [];
    list.push(product);
    byBarcode.set(product.barcode, list);
  }

  return items.map((item) => {
    if (item.barcode == null) {
      return {
        ...item,
        productId: null,
        unitPrice: new Prisma.Decimal(0),
        availability: "unavailable",
      };
    }
    const matches = byBarcode.get(item.barcode) ?? [];
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
