import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { Prisma } from "@prisma/client";
import { buildApp } from "../src/app";
import { signShopkeeperToken } from "../src/auth";
import { prismaAdmin } from "../src/db";

export async function startApp(): Promise<FastifyInstance> {
  const app = await buildApp();
  await app.ready();
  return app;
}

export async function seedShopkeeper(name = "فروشگاه تست") {
  const id = randomUUID();
  await prismaAdmin.shopkeeper.create({ data: { id, name } });
  return { id, token: signShopkeeperToken(id) };
}

export async function seedDistributor(name: string) {
  const id = randomUUID();
  await prismaAdmin.distributor.create({ data: { id, name } });
  return { id, name };
}

export async function seedProduct(input: {
  distributorId: string;
  name: string;
  barcode?: string | null;
  pricePerCase: string | number;
  stockInCases: number;
  minOrderQty?: number;
  unitsPerCase?: number;
}) {
  const id = randomUUID();
  await prismaAdmin.product.create({
    data: {
      id,
      distributorId: input.distributorId,
      name: input.name,
      barcode: input.barcode === undefined ? `barcode-${id.slice(0, 8)}` : input.barcode,
      pricePerCase: new Prisma.Decimal(input.pricePerCase),
      stockInCases: input.stockInCases,
      minOrderQty: input.minOrderQty ?? 1,
      unitsPerCase: input.unitsPerCase ?? 12,
    },
  });
  return { id };
}

export async function seedCapacity(distributorId: string, date: string, slotsRemaining: number) {
  const id = randomUUID();
  await prismaAdmin.deliveryCapacity.create({
    data: {
      id,
      distributorId,
      date: new Date(`${date}T00:00:00.000Z`),
      slotsRemaining,
    },
  });
  return { id };
}

export function authHeader(token: string): { authorization: string } {
  return { authorization: `Bearer ${token}` };
}
