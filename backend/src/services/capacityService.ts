import { PrismaClient } from "@prisma/client";
import { CAPACITY_UNAVAILABLE_MESSAGE } from "../constants";
import { apiError } from "../errors";
import { parseIsoDate, toIsoDate } from "../serialize";
import { withTenant } from "../tenant";

export class CapacityService {
  constructor(private readonly prisma: PrismaClient) {}

  async getCapacity(shopkeeperId: string, distributorId: string, dateValue: string) {
    const date = parseIsoDate(dateValue);
    return withTenant(this.prisma, { shopkeeperId }, async (tx) => {
      const cart = await tx.cart.findUnique({ where: { shopkeeperId } });
      if (cart && cart.distributorId !== distributorId) {
        throw apiError(
          409,
          "DISTRIBUTOR_MISMATCH",
          "distributor_id does not match the selected cart distributor",
        );
      }
      if (!cart) {
        throw apiError(409, "CAPACITY_UNAVAILABLE", CAPACITY_UNAVAILABLE_MESSAGE);
      }
      await tx.$executeRaw`SELECT set_config('app.distributor_id', ${cart.distributorId}, true)`;
      const row = await tx.deliveryCapacity.findUnique({
        where: {
          distributorId_date: { distributorId: cart.distributorId, date },
        },
      });
      if (!row || row.slotsRemaining <= 0) {
        throw apiError(409, "CAPACITY_UNAVAILABLE", CAPACITY_UNAVAILABLE_MESSAGE);
      }
      return {
        distributor_id: row.distributorId,
        date: toIsoDate(row.date),
        slots_remaining: row.slotsRemaining,
      };
    });
  }
}
