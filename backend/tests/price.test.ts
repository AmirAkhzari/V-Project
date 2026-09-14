import { describe, expect, it } from "vitest";
import { Prisma } from "@prisma/client";
import { prismaAdmin } from "../src/db";
import {
  authHeader,
  seedCapacity,
  seedDistributor,
  seedProduct,
  seedShopkeeper,
  selectDistributor,
  startApp,
} from "./helpers";

describe("server-side prices", () => {
  it("rejects client prices with CLIENT_PRICE_REJECTED", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const res = await app.inject({
        method: "POST",
        url: "/orders",
        headers: {
          ...authHeader(shop.token),
          "idempotency-key": "price-1",
        },
        payload: {
          delivery_date: "2026-09-20",
          total: "1",
        },
      });
      expect(res.statusCode).toBe(400);
      expect(res.json().error).toBe("CLIENT_PRICE_REJECTED");
    } finally {
      await app.close();
    }
  });

  it("returns PRICE_CHANGED when DB price differs from the cart snapshot", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const dist = await seedDistributor("A");
      const product = await seedProduct({
        distributorId: dist.id,
        name: "Cheese",
        pricePerCase: "10000",
        stockInCases: 20,
      });
      await seedCapacity(dist.id, "2026-09-20", 3);

      await selectDistributor(app, shop.token, dist.id);
      const add = await app.inject({
        method: "POST",
        url: "/cart/items",
        headers: authHeader(shop.token),
        payload: { product_id: product.id, qty: 2 },
      });
      expect(add.statusCode).toBe(200);
      expect(add.json().items[0].unit_price).toBe("10000.00");

      await prismaAdmin.product.update({
        where: { id: product.id },
        data: { pricePerCase: new Prisma.Decimal("12000") },
      });

      const order = await app.inject({
        method: "POST",
        url: "/orders",
        headers: {
          ...authHeader(shop.token),
          "idempotency-key": "price-2",
        },
        payload: { delivery_date: "2026-09-20" },
      });
      expect(order.statusCode).toBe(409);
      expect(order.json().error).toBe("PRICE_CHANGED");
    } finally {
      await app.close();
    }
  });
});
