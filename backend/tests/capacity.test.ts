import { describe, expect, it } from "vitest";
import { CAPACITY_UNAVAILABLE_MESSAGE } from "../src/constants";
import {
  authHeader,
  seedCapacity,
  seedDistributor,
  seedProduct,
  seedShopkeeper,
  startApp,
} from "./helpers";

describe("delivery capacity", () => {
  it("returns the exact Persian message when capacity is empty", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const dist = await seedDistributor("A");
      const res = await app.inject({
        method: "GET",
        url: `/delivery-capacity?distributor_id=${dist.id}&date=2026-09-24`,
        headers: authHeader(shop.token),
      });
      expect(res.statusCode).toBe(409);
      expect(res.json().error).toBe("CAPACITY_UNAVAILABLE");
      expect(res.json().message).toBe(CAPACITY_UNAVAILABLE_MESSAGE);
      expect(res.json().message).toBe(
        "سرویس توزیع در دسترس برای تاریخ انتخابی موجود نیست، لطفا تاریخ دیگری را انتخاب کنید",
      );
    } finally {
      await app.close();
    }
  });

  it("returns the same message for zero slots_remaining and when placing an order", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const dist = await seedDistributor("A");
      const product = await seedProduct({
        distributorId: dist.id,
        name: "Flour",
        pricePerCase: "3000",
        stockInCases: 20,
      });
      await seedCapacity(dist.id, "2026-09-24", 0);

      const get = await app.inject({
        method: "GET",
        url: `/delivery-capacity?distributor_id=${dist.id}&date=2026-09-24`,
        headers: authHeader(shop.token),
      });
      expect(get.json().message).toBe(CAPACITY_UNAVAILABLE_MESSAGE);

      await app.inject({
        method: "POST",
        url: "/cart/items",
        headers: authHeader(shop.token),
        payload: { product_id: product.id, qty: 1 },
      });
      const order = await app.inject({
        method: "POST",
        url: "/orders",
        headers: {
          ...authHeader(shop.token),
          "idempotency-key": "cap-1",
        },
        payload: { delivery_date: "2026-09-24" },
      });
      expect(order.statusCode).toBe(409);
      expect(order.json().error).toBe("CAPACITY_UNAVAILABLE");
      expect(order.json().message).toBe(
        "سرویس توزیع در دسترس برای تاریخ انتخابی موجود نیست، لطفا تاریخ دیگری را انتخاب کنید",
      );
    } finally {
      await app.close();
    }
  });

  it("returns remaining slots when capacity exists", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const dist = await seedDistributor("A");
      await seedCapacity(dist.id, "2026-09-25", 7);
      const res = await app.inject({
        method: "GET",
        url: `/delivery-capacity?distributor_id=${dist.id}&date=2026-09-25`,
        headers: authHeader(shop.token),
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual({
        distributor_id: dist.id,
        date: "2026-09-25",
        slots_remaining: 7,
      });
    } finally {
      await app.close();
    }
  });
});
