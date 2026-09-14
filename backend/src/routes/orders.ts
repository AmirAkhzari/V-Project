import { FastifyInstance } from "fastify";
import { containsClientPrice } from "../clientPrice";
import { apiError } from "../errors";
import { OrderService } from "../services/orderService";

export async function registerOrderRoutes(app: FastifyInstance, orders: OrderService): Promise<void> {
  app.post("/orders", async (request, reply) => {
    const keyHeader = request.headers["idempotency-key"];
    const idempotencyKey = Array.isArray(keyHeader) ? keyHeader[0] : keyHeader;
    if (!idempotencyKey) {
      throw apiError(400, "IDEMPOTENCY_KEY_REQUIRED");
    }
    if (containsClientPrice(request.body)) {
      throw apiError(400, "CLIENT_PRICE_REJECTED");
    }
    const body = (request.body ?? {}) as { delivery_date?: string };
    if (typeof body.delivery_date !== "string") {
      throw apiError(400, "INVALID_DATE", "delivery_date is required (Gregorian YYYY-MM-DD)");
    }
    const { order, replayed } = await orders.placeOrder(
      request.shopkeeperId,
      idempotencyKey,
      { delivery_date: body.delivery_date },
    );
    return reply.code(replayed ? 200 : 201).send(order);
  });
}
