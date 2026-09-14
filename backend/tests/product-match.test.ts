import { describe, expect, it } from "vitest";
import { Prisma } from "@prisma/client";
import { matchItemsByBarcode, usableBarcode } from "../src/services/productMatch";

describe("matchItemsByBarcode", () => {
  it("matches only by barcode and recalculates price from the catalog", () => {
    const result = matchItemsByBarcode(
      [{ id: "item-1", barcode: "111", qty: 2 }],
      [
        {
          id: "p-new",
          barcode: "111",
          pricePerCase: new Prisma.Decimal("50.00"),
        },
      ],
    );
    expect(result[0]).toMatchObject({
      productId: "p-new",
      availability: "available",
    });
    expect(result[0].unitPrice.toFixed(2)).toBe("50.00");
  });

  it("marks null barcode as unavailable", () => {
    const result = matchItemsByBarcode(
      [{ id: "item-1", barcode: null, qty: 1 }],
      [{ id: "p-new", barcode: "111", pricePerCase: new Prisma.Decimal("10") }],
    );
    expect(result[0].availability).toBe("unavailable");
    expect(result[0].productId).toBeNull();
  });

  it("marks empty-string barcode as unavailable", () => {
    const result = matchItemsByBarcode(
      [{ id: "item-1", barcode: "", qty: 1 }],
      [{ id: "p-new", barcode: "", pricePerCase: new Prisma.Decimal("10") }],
    );
    expect(result[0].availability).toBe("unavailable");
    expect(result[0].productId).toBeNull();
  });

  it("treats whitespace-only barcodes as empty after trim", () => {
    expect(usableBarcode(" ")).toBeNull();
    expect(usableBarcode("\t\n")).toBeNull();
    expect(usableBarcode("  111  ")).toBe("111");

    const result = matchItemsByBarcode(
      [{ id: "item-1", barcode: " ", qty: 1 }],
      [{ id: "p-new", barcode: " ", pricePerCase: new Prisma.Decimal("10") }],
    );
    expect(result[0].availability).toBe("unavailable");
    expect(result[0].productId).toBeNull();
  });

  it("marks unmatched barcode as unavailable", () => {
    const result = matchItemsByBarcode(
      [{ id: "item-1", barcode: "999", qty: 1 }],
      [{ id: "p-new", barcode: "111", pricePerCase: new Prisma.Decimal("10") }],
    );
    expect(result[0].availability).toBe("unavailable");
  });

  it("marks duplicate barcode in the new distributor as unavailable", () => {
    const result = matchItemsByBarcode(
      [{ id: "item-1", barcode: "111", qty: 1 }],
      [
        { id: "p-a", barcode: "111", pricePerCase: new Prisma.Decimal("10") },
        { id: "p-b", barcode: "111", pricePerCase: new Prisma.Decimal("11") },
      ],
    );
    expect(result[0].availability).toBe("unavailable");
    expect(result[0].productId).toBeNull();
  });
});
