import { describe, expect, it } from "vitest";
import {
  authHeader,
  seedCapacity,
  seedDistributor,
  seedProduct,
  seedShopkeeper,
  selectDistributor,
  startApp,
} from "./helpers";

describe("unavailable items block checkout", () => {
  it("returns UNAVAILABLE_ITEMS even though unavailable lines are excluded from totals", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const distA = await seedDistributor("A");
      const distB = await seedDistributor("B");
      const keep = await seedProduct({
        distributorId: distA.id,
        name: "Matched",
        barcode: "KEEP",
        pricePerCase: "1000",
        stockInCases: 10,
      });
      const drop = await seedProduct({
        distributorId: distA.id,
        name: "Unmatched",
        barcode: "DROP",
        pricePerCase: "4000",
        stockInCases: 10,
      });
      await seedProduct({
        distributorId: distB.id,
        name: "Matched B",
        barcode: "KEEP",
        pricePerCase: "1000",
        stockInCases: 10,
      });
      await seedCapacity(distB.id, "2026-09-21", 5);

      await selectDistributor(app, shop.token, distA.id);
      await app.inject({
        method: "POST",
        url: "/cart/items",
        headers: authHeader(shop.token),
        payload: { product_id: keep.id, qty: 2 },
      });
      await app.inject({
        method: "POST",
        url: "/cart/items",
        headers: authHeader(shop.token),
        payload: { product_id: drop.id, qty: 1 },
      });
      const switched = await app.inject({
        method: "POST",
        url: "/cart/switch-distributor",
        headers: authHeader(shop.token),
        payload: { distributor_id: distB.id },
      });
      const cart = switched.json();
      expect(cart.items.some((item: { availability: string }) => item.availability === "unavailable")).toBe(
        true,
      );
      expect(cart.totals.amount).toBe("2000.00");

      const order = await app.inject({
        method: "POST",
        url: "/orders",
        headers: {
          ...authHeader(shop.token),
          "idempotency-key": "unavail-1",
        },
        payload: { delivery_date: "2026-09-21" },
      });
      expect(order.statusCode).toBe(409);
      expect(order.json().error).toBe("UNAVAILABLE_ITEMS");
    } finally {
      await app.close();
    }
  });
});
