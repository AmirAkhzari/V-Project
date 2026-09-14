import { describe, expect, it } from "vitest";
import { prisma } from "../src/db";
import { withTenant } from "../src/tenant";
import {
  authHeader,
  seedCapacity,
  seedDistributor,
  seedProduct,
  seedShopkeeper,
  selectDistributor,
  startApp,
} from "./helpers";
import { CAPACITY_UNAVAILABLE_MESSAGE } from "../src/constants";

describe("catalog and capacity scoped to selected distributor", () => {
  it("before selection, shopkeepers can list distributors but not products or capacity", async () => {
    const shop = await seedShopkeeper();
    const distA = await seedDistributor("A");
    const distB = await seedDistributor("B");
    await seedProduct({
      distributorId: distA.id,
      name: "A1",
      barcode: "A1",
      pricePerCase: "1",
      stockInCases: 5,
    });
    await seedProduct({
      distributorId: distB.id,
      name: "B1",
      barcode: "B1",
      pricePerCase: "1",
      stockInCases: 5,
    });
    await seedCapacity(distA.id, "2026-09-26", 3);
    await seedCapacity(distB.id, "2026-09-26", 9);

    await withTenant(prisma, { shopkeeperId: shop.id }, async (tx) => {
      const distributors = await tx.distributor.findMany();
      expect(distributors.map((row) => row.id).sort()).toEqual([distA.id, distB.id].sort());
      expect(await tx.product.findMany()).toEqual([]);
      expect(await tx.deliveryCapacity.findMany()).toEqual([]);
    });
  });

  it("after selection, products and delivery_capacity are only readable for that distributor_id", async () => {
    const app = await startApp();
    try {
      const shop = await seedShopkeeper();
      const distA = await seedDistributor("A");
      const distB = await seedDistributor("B");
      const productA = await seedProduct({
        distributorId: distA.id,
        name: "A1",
        barcode: "A1",
        pricePerCase: "1",
        stockInCases: 5,
      });
      await seedProduct({
        distributorId: distB.id,
        name: "B1",
        barcode: "B1",
        pricePerCase: "2",
        stockInCases: 5,
      });
      await seedCapacity(distA.id, "2026-09-26", 3);
      await seedCapacity(distB.id, "2026-09-26", 9);

      const selected = await selectDistributor(app, shop.token, distA.id);
      expect(selected.statusCode).toBe(200);

      await withTenant(prisma, { shopkeeperId: shop.id }, async (tx) => {
        const products = await tx.product.findMany();
        expect(products.map((row) => row.id)).toEqual([productA.id]);
        expect(products.every((row) => row.distributorId === distA.id)).toBe(true);
        const capacity = await tx.deliveryCapacity.findMany();
        expect(capacity).toHaveLength(1);
        expect(capacity[0].distributorId).toBe(distA.id);
        expect(capacity[0].slotsRemaining).toBe(3);
      });

      const otherCapacity = await app.inject({
        method: "GET",
        url: `/delivery-capacity?distributor_id=${distB.id}&date=2026-09-26`,
        headers: authHeader(shop.token),
      });
      expect(otherCapacity.statusCode).toBe(409);
      expect(otherCapacity.json().error).toBe("DISTRIBUTOR_MISMATCH");
      expect(otherCapacity.json().message).toBe(
        "distributor_id does not match the selected cart distributor",
      );
      expect(otherCapacity.json().message).not.toBe(CAPACITY_UNAVAILABLE_MESSAGE);

      const ownCapacity = await app.inject({
        method: "GET",
        url: `/delivery-capacity?distributor_id=${distA.id}&date=2026-09-26`,
        headers: authHeader(shop.token),
      });
      expect(ownCapacity.statusCode).toBe(200);
      expect(ownCapacity.json().slots_remaining).toBe(3);
    } finally {
      await app.close();
    }
  });
});
