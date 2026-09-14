import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { apiError } from "./errors";

export function isCasesQty(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1;
}

export function toIsoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function parseIsoDate(value: unknown): Date {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw apiError(400, "INVALID_DATE", "delivery dates must be Gregorian ISO 8601 (YYYY-MM-DD)");
  }
  return new Date(`${value}T00:00:00.000Z`);
}

export function money(value: Prisma.Decimal | string | number): string {
  return new Prisma.Decimal(value).toFixed(2);
}

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

export function requestHash(body: unknown): string {
  return createHash("sha256").update(stableStringify(body ?? {})).digest("hex");
}

export function advisoryLockKey(shopkeeperId: string, idempotencyKey: string): number {
  const digest = createHash("sha256")
    .update(`${shopkeeperId}:${idempotencyKey}`)
    .digest();
  return digest.readInt32BE(0);
}
