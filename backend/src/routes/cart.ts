import { FastifyInstance } from "fastify";
import { containsClientPrice } from "../clientPrice";
import { apiError } from "../errors";
import { CartService } from "../services/cartService";

export async function registerCartRoutes(app: FastifyInstance, carts: CartService): Promise<void> {
  app.get("/cart", async (request) => {
    return carts.getCart(request.shopkeeperId);
  });

  app.patch("/cart", async (request) => {
    if (containsClientPrice(request.body)) {
      throw apiError(400, "CLIENT_PRICE_REJECTED");
    }
    const body = (request.body ?? {}) as {
      delivery_date?: string | null;
      items?: Array<{ id?: string; product_id?: string; qty: number }>;
    };
    return carts.patchCart(request.shopkeeperId, body);
  });

  app.post("/cart/items", async (request) => {
    if (containsClientPrice(request.body)) {
      throw apiError(400, "CLIENT_PRICE_REJECTED");
    }
    const body = (request.body ?? {}) as { product_id?: string; qty?: number };
    if (typeof body.product_id !== "string" || body.product_id.length === 0) {
      throw apiError(404, "PRODUCT_NOT_FOUND");
    }
    return carts.addItem(request.shopkeeperId, body.product_id, body.qty as number);
  });

  app.post("/cart/switch-distributor", async (request) => {
    if (containsClientPrice(request.body)) {
      throw apiError(400, "CLIENT_PRICE_REJECTED");
    }
    const body = (request.body ?? {}) as { distributor_id?: string };
    if (typeof body.distributor_id !== "string" || body.distributor_id.length === 0) {
      throw apiError(400, "DISTRIBUTOR_NOT_FOUND");
    }
    return carts.switchDistributor(request.shopkeeperId, body.distributor_id);
  });

  app.delete("/cart", async (request, reply) => {
    const cart = await carts.clearCart(request.shopkeeperId);
    return reply.code(200).send(cart);
  });
}
