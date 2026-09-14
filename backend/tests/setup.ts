import { afterAll, beforeEach } from "vitest";
import { prisma, prismaAdmin } from "../src/db";

export async function truncateAll(): Promise<void> {
  await prismaAdmin.$executeRawUnsafe(`
    TRUNCATE TABLE
      cart_items,
      carts,
      order_items,
      payments,
      order_idempotency,
      orders,
      delivery_capacity,
      products,
      shopkeepers,
      distributors
    RESTART IDENTITY CASCADE
  `);
}

beforeEach(async () => {
  await truncateAll();
});

afterAll(async () => {
  await prisma.$disconnect();
  await prismaAdmin.$disconnect();
});
