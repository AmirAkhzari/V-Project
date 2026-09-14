import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { shopkeeperIdFromToken } from "../auth";
import { apiError } from "../errors";

declare module "fastify" {
  interface FastifyRequest {
    shopkeeperId: string;
  }
}

export async function registerAuth(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", async (request: FastifyRequest, _reply: FastifyReply) => {
    if (request.url.split("?")[0] === "/health") {
      return;
    }
    const header = request.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw apiError(401, "UNAUTHORIZED", "missing bearer token");
    }
    request.shopkeeperId = shopkeeperIdFromToken(header.slice("Bearer ".length));
  });
}
