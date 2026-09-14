import { describe, expect, it } from "vitest";
import { authHeader, seedDistributor, seedProduct, seedShopkeeper, selectDistributor, startApp } from "./helpers";

describe("distributor lock", () => {
  it("rejects adding a product from outside cart.distributor_id", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const distA = await seedDistributor("A");
      const distB = await seedDistributor("B");
      const productA = await seedProduct({
        distributorId: distA.id,
        name: "Rice A",
        pricePerCase: "100000",
        stockInCases: 20,
      });
      const productB = await seedProduct({
        distributorId: distB.id,
        name: "Rice B",
        pricePerCase: "110000",
        stockInCases: 20,
      });

      await selectDistributor(app, shop.token, distA.id);

      const first = await app.inject({
        method: "POST",
        url: "/cart/items",
        headers: authHeader(shop.token),
        payload: { product_id: productA.id, qty: 1 },
      });
      expect(first.statusCode).toBe(200);
      expect(first.json().distributor_id).toBe(distA.id);

      const blocked = await app.inject({
        method: "POST",
        url: "/cart/items",
        headers: authHeader(shop.token),
        payload: { product_id: productB.id, qty: 1 },
      });
      expect(blocked.statusCode).toBe(400);
      expect(blocked.json().error).toBe("DISTRIBUTOR_LOCKED");
    } finally {
      await app.close();
    }
  });

  it("returns 401 when the client sends shopkeeper_id in the body", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const dist = await seedDistributor("A");
      const product = await seedProduct({
        distributorId: dist.id,
        name: "Oil",
        pricePerCase: "1",
        stockInCases: 5,
      });
      const res = await app.inject({
        method: "POST",
        url: "/cart/items",
        headers: authHeader(shop.token),
        payload: { product_id: product.id, qty: 1, shopkeeper_id: shop.id },
      });
      expect(res.statusCode).toBe(401);
      expect(res.json().error).toBe("UNAUTHORIZED");
    } finally {
      await app.close();
    }
  });
});
