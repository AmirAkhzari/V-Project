import { PRICE_BODY_KEYS } from "./constants";

export function containsClientPrice(body: unknown): boolean {
  if (body == null || typeof body !== "object") return false;
  if (Array.isArray(body)) return body.some(containsClientPrice);
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    if (PRICE_BODY_KEYS.has(key)) return true;
    if (containsClientPrice(value)) return true;
  }
  return false;
}

export function containsShopkeeperId(body: unknown): boolean {
  if (body == null || typeof body !== "object") return false;
  if (Array.isArray(body)) return body.some(containsShopkeeperId);
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    if (key === "shopkeeper_id" || key === "shopkeeperId") return true;
    if (containsShopkeeperId(value)) return true;
  }
  return false;
}
