import jwt from "jsonwebtoken";
import { config } from "./config";
import { apiError } from "./errors";

type TokenPayload = {
  shopkeeper_id?: string;
  sub?: string;
};

export function signShopkeeperToken(shopkeeperId: string): string {
  return jwt.sign({ shopkeeper_id: shopkeeperId }, config.authSecret, {
    expiresIn: "7d",
  });
}

export function shopkeeperIdFromToken(token: string): string {
  try {
    const payload = jwt.verify(token, config.authSecret) as TokenPayload;
    const shopkeeperId = payload.shopkeeper_id ?? payload.sub;
    if (!shopkeeperId) {
      throw apiError(401, "UNAUTHORIZED", "shopkeeper_id missing from token");
    }
    return shopkeeperId;
  } catch (err) {
    if (err instanceof Error && err.name === "ApiError") throw err;
    throw apiError(401, "UNAUTHORIZED", "invalid token");
  }
}
