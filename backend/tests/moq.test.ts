import { describe, expect, it } from "vitest";
import { authHeader, seedDistributor, seedProduct, seedShopkeeper, selectDistributor, startApp } from "./helpers";

describe("MOQ and cases-only", () => {
  it("rejects qty below min_order_qty with MOQ_NOT_MET", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const dist = await seedDistributor("A");
      const product = await seedProduct({
        distributorId: dist.id,
        name: "Bulk oil",
        pricePerCase: "50000",
        stockInCases: 100,
        minOrderQty: 5,
        unitsPerCase: 12,
      });

      await selectDistributor(app, shop.token, dist.id);

      const res = await app.inject({
        method: "POST",
        url: "/cart/items",
        headers: authHeader(shop.token),
        payload: { product_id: product.id, qty: 4 },
      });
      expect(res.statusCode).toBe(400);
      expect(res.json().error).toBe("MOQ_NOT_MET");
    } finally {
      await app.close();
    }
  });

  it("accepts qty equal to min_order_qty in cases and ignores units_per_case", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const dist = await seedDistributor("A");
      const product = await seedProduct({
        distributorId: dist.id,
        name: "Bulk oil",
        pricePerCase: "50000",
        stockInCases: 100,
        minOrderQty: 5,
        unitsPerCase: 12,
      });

      await selectDistributor(app, shop.token, dist.id);

      const res = await app.inject({
        method: "POST",
        url: "/cart/items",
        headers: authHeader(shop.token),
        payload: { product_id: product.id, qty: 5 },
      });
      expect(res.statusCode).toBe(200);
      expect(res.json().items[0].qty).toBe(5);
      expect(res.json().items[0].units_per_case).toBe(12);
      expect(res.json().totals.cases).toBe(5);
    } finally {
      await app.close();
    }
  });

  it("rejects non-integer qty as CASES_ONLY", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const dist = await seedDistributor("A");
      const product = await seedProduct({
        distributorId: dist.id,
        name: "Sugar",
        pricePerCase: "1000",
        stockInCases: 10,
      });
      const res = await app.inject({
        method: "POST",
        url: "/cart/items",
        headers: authHeader(shop.token),
        payload: { product_id: product.id, qty: 1.5 },
      });
      expect(res.statusCode).toBe(400);
      expect(res.json().error).toBe("CASES_ONLY");
    } finally {
      await app.close();
    }
  });
});
