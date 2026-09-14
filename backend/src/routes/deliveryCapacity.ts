import { FastifyInstance } from "fastify";
import { apiError } from "../errors";
import { CapacityService } from "../services/capacityService";

export async function registerDeliveryCapacityRoutes(
  app: FastifyInstance,
  capacity: CapacityService,
): Promise<void> {
  app.get("/delivery-capacity", async (request) => {
    const query = request.query as { distributor_id?: string; date?: string };
    if (!query.distributor_id || !query.date) {
      throw apiError(400, "INVALID_DATE", "distributor_id and date (YYYY-MM-DD) are required");
    }
    return capacity.getCapacity(request.shopkeeperId, query.distributor_id, query.date);
  });
}
