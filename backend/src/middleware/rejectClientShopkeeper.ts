import { FastifyInstance, FastifyRequest } from "fastify";
import { containsShopkeeperId } from "../clientPrice";
import { apiError } from "../errors";

export async function registerRejectClientShopkeeper(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", async (request: FastifyRequest) => {
    const query = request.query as Record<string, unknown> | undefined;
    if (query && ("shopkeeper_id" in query || "shopkeeperId" in query)) {
      throw apiError(401, "UNAUTHORIZED", "shopkeeper_id must come from the auth token");
    }
    if (containsShopkeeperId(request.body)) {
      throw apiError(401, "UNAUTHORIZED", "shopkeeper_id must come from the auth token");
    }
  });
}
