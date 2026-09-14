import Fastify, { FastifyError, FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { prisma } from "./db";
import { ApiError } from "./errors";
import { registerAuth } from "./middleware/auth";
import { registerRejectClientShopkeeper } from "./middleware/rejectClientShopkeeper";
import { registerCartRoutes } from "./routes/cart";
import { registerDeliveryCapacityRoutes } from "./routes/deliveryCapacity";
import { registerOrderRoutes } from "./routes/orders";
import { CapacityService } from "./services/capacityService";
import { CartService } from "./services/cartService";
import { OrderService } from "./services/orderService";

export async function buildApp(client: PrismaClient = prisma): Promise<FastifyInstance> {
  const app = Fastify({
    logger: process.env.VITEST !== "true",
  });

  const carts = new CartService(client);
  const orders = new OrderService(client);
  const capacity = new CapacityService(client);

  app.get("/health", async () => ({ ok: true }));

  await registerAuth(app);
  await registerRejectClientShopkeeper(app);
  await registerCartRoutes(app, carts);
  await registerDeliveryCapacityRoutes(app, capacity);
  await registerOrderRoutes(app, orders);

  app.setErrorHandler((err: FastifyError | Error, request, reply) => {
    if (err instanceof ApiError) {
      return reply.code(err.statusCode).send({ error: err.code, message: err.message });
    }
    request.log.error(err);
    const status = (err as FastifyError).statusCode ?? 500;
    return reply.code(status).send({
      error: "INTERNAL",
      message: err.message,
    });
  });

  return app;
}
