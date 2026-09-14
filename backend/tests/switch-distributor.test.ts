import { describe, expect, it } from "vitest";
import { authHeader, seedDistributor, seedProduct, seedShopkeeper, startApp } from "./helpers";

describe("POST /cart/switch-distributor", () => {
  it("matches by barcode and recalculates prices from the new distributor DB row", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const distA = await seedDistributor("A");
      const distB = await seedDistributor("B");
      const productA = await seedProduct({
        distributorId: distA.id,
        name: "Cola A",
        barcode: "6260000000012",
        pricePerCase: "20000",
        stockInCases: 10,
      });
      const productB = await seedProduct({
        distributorId: distB.id,
        name: "Cola B",
        barcode: "6260000000012",
        pricePerCase: "25000",
        stockInCases: 10,
      });

      await app.inject({
        method: "POST",
        url: "/cart/items",
        headers: authHeader(shop.token),
        payload: { product_id: productA.id, qty: 2 },
      });

      const switched = await app.inject({
        method: "POST",
        url: "/cart/switch-distributor",
        headers: authHeader(shop.token),
        payload: { distributor_id: distB.id },
      });
      expect(switched.statusCode).toBe(200);
      const body = switched.json();
      expect(body.distributor_id).toBe(distB.id);
      expect(body.items).toHaveLength(1);
      expect(body.items[0].product_id).toBe(productB.id);
      expect(body.items[0].availability).toBe("available");
      expect(body.items[0].unit_price).toBe("25000.00");
      expect(body.items[0].qty).toBe(2);
      expect(body.totals.amount).toBe("50000.00");
    } finally {
      await app.close();
    }
  });

  it("marks null-barcode items unavailable and does not clear the cart", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const distA = await seedDistributor("A");
      const distB = await seedDistributor("B");
      const productA = await seedProduct({
        distributorId: distA.id,
        name: "Loose tea",
        barcode: null,
        pricePerCase: "9000",
        stockInCases: 10,
      });
      await seedProduct({
        distributorId: distB.id,
        name: "Other",
        barcode: "626999",
        pricePerCase: "1000",
        stockInCases: 10,
      });

      await app.inject({
        method: "POST",
        url: "/cart/items",
        headers: authHeader(shop.token),
        payload: { product_id: productA.id, qty: 3 },
      });

      const switched = await app.inject({
        method: "POST",
        url: "/cart/switch-distributor",
        headers: authHeader(shop.token),
        payload: { distributor_id: distB.id },
      });
      expect(switched.statusCode).toBe(200);
      const body = switched.json();
      expect(body.items).toHaveLength(1);
      expect(body.items[0].availability).toBe("unavailable");
      expect(body.items[0].product_id).toBeNull();
      expect(body.items[0].qty).toBe(3);
      expect(body.totals.amount).toBe("0.00");
    } finally {
      await app.close();
    }
  });

  it("marks unmatched barcodes unavailable", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const distA = await seedDistributor("A");
      const distB = await seedDistributor("B");
      const productA = await seedProduct({
        distributorId: distA.id,
        name: "Unique SKU",
        barcode: "ONLY-A",
        pricePerCase: "1000",
        stockInCases: 5,
      });
      await seedProduct({
        distributorId: distB.id,
        name: "Different SKU",
        barcode: "ONLY-B",
        pricePerCase: "1000",
        stockInCases: 5,
      });

      await app.inject({
        method: "POST",
        url: "/cart/items",
        headers: authHeader(shop.token),
        payload: { product_id: productA.id, qty: 1 },
      });

      const switched = await app.inject({
        method: "POST",
        url: "/cart/switch-distributor",
        headers: authHeader(shop.token),
        payload: { distributor_id: distB.id },
      });
      expect(switched.json().items[0].availability).toBe("unavailable");
    } finally {
      await app.close();
    }
  });

  it("clear cart is a separate DELETE and is not part of switch", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const distA = await seedDistributor("A");
      const distB = await seedDistributor("B");
      const productA = await seedProduct({
        distributorId: distA.id,
        name: "Item",
        barcode: "X1",
        pricePerCase: "1000",
        stockInCases: 5,
      });
      await seedProduct({
        distributorId: distB.id,
        name: "Item B",
        barcode: "X1",
        pricePerCase: "2000",
        stockInCases: 5,
      });

      await app.inject({
        method: "POST",
        url: "/cart/items",
        headers: authHeader(shop.token),
        payload: { product_id: productA.id, qty: 1 },
      });
      await app.inject({
        method: "POST",
        url: "/cart/switch-distributor",
        headers: authHeader(shop.token),
        payload: { distributor_id: distB.id },
      });
      const stillThere = await app.inject({
        method: "GET",
        url: "/cart",
        headers: authHeader(shop.token),
      });
      expect(stillThere.json().items).toHaveLength(1);

      const cleared = await app.inject({
        method: "DELETE",
        url: "/cart",
        headers: authHeader(shop.token),
      });
      expect(cleared.json().items).toHaveLength(0);
      expect(cleared.json().id).toBeNull();
    } finally {
      await app.close();
    }
  });
});

describe("barcode uniqueness", () => {
  it("enforces UNIQUE(distributor_id, barcode) WHERE barcode IS NOT NULL", async () => {
    const dist = await seedDistributor("Dup");
    await seedProduct({
      distributorId: dist.id,
      name: "One",
      barcode: "DUP-1",
      pricePerCase: "1",
      stockInCases: 1,
    });
    await expect(
      seedProduct({
        distributorId: dist.id,
        name: "Two",
        barcode: "DUP-1",
        pricePerCase: "2",
        stockInCases: 1,
      }),
    ).rejects.toThrow();
  });

  it("allows multiple null barcodes on the same distributor", async () => {
    const dist = await seedDistributor("Nulls");
    await seedProduct({
      distributorId: dist.id,
      name: "N1",
      barcode: null,
      pricePerCase: "1",
      stockInCases: 1,
    });
    await expect(
      seedProduct({
        distributorId: dist.id,
        name: "N2",
        barcode: null,
        pricePerCase: "2",
        stockInCases: 1,
      }),
    ).resolves.toBeTruthy();
  });
});
