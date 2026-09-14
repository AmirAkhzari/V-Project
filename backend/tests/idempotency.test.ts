import { describe, expect, it } from "vitest";
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

describe("order idempotency", () => {
  it("replays the original order for the same key and body", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const dist = await seedDistributor("A");
      const product = await seedProduct({
        distributorId: dist.id,
        name: "Water",
        pricePerCase: "8000",
        stockInCases: 50,
      });
      await seedCapacity(dist.id, "2026-09-22", 4);

      await selectDistributor(app, shop.token, dist.id);
      await app.inject({
        method: "POST",
        url: "/cart/items",
        headers: authHeader(shop.token),
        payload: { product_id: product.id, qty: 2 },
      });

      const first = await app.inject({
        method: "POST",
        url: "/orders",
        headers: {
          ...authHeader(shop.token),
          "idempotency-key": "same-key",
        },
        payload: { delivery_date: "2026-09-22" },
      });
      expect(first.statusCode).toBe(201);
      const firstBody = first.json();

      const replay = await app.inject({
        method: "POST",
        url: "/orders",
        headers: {
          ...authHeader(shop.token),
          "idempotency-key": "same-key",
        },
        payload: { delivery_date: "2026-09-22" },
      });
      expect(replay.statusCode).toBe(200);
      expect(replay.json().id).toBe(firstBody.id);
      expect(replay.json().total).toBe("16000.00");

      const stock = await prismaAdmin.product.findUniqueOrThrow({ where: { id: product.id } });
      expect(stock.stockInCases).toBe(48);
      const slots = await prismaAdmin.deliveryCapacity.findFirstOrThrow({
        where: { distributorId: dist.id },
      });
      expect(slots.slotsRemaining).toBe(3);
    } finally {
      await app.close();
    }
  });

  it("returns 409 IDEMPOTENCY_KEY_REUSE when the same key is reused with a different body", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const dist = await seedDistributor("A");
      const product = await seedProduct({
        distributorId: dist.id,
        name: "Water",
        pricePerCase: "8000",
        stockInCases: 50,
      });
      await seedCapacity(dist.id, "2026-09-22", 4);
      await seedCapacity(dist.id, "2026-09-23", 4);

      await selectDistributor(app, shop.token, dist.id);
      await app.inject({
        method: "POST",
        url: "/cart/items",
        headers: authHeader(shop.token),
        payload: { product_id: product.id, qty: 2 },
      });

      const first = await app.inject({
        method: "POST",
        url: "/orders",
        headers: {
          ...authHeader(shop.token),
          "idempotency-key": "reuse-key",
        },
        payload: { delivery_date: "2026-09-22" },
      });
      expect(first.statusCode).toBe(201);

      const conflict = await app.inject({
        method: "POST",
        url: "/orders",
        headers: {
          ...authHeader(shop.token),
          "idempotency-key": "reuse-key",
        },
        payload: { delivery_date: "2026-09-23" },
      });
      expect(conflict.statusCode).toBe(409);
      expect(conflict.json().error).toBe("IDEMPOTENCY_KEY_REUSE");
    } finally {
      await app.close();
    }
  });
});
