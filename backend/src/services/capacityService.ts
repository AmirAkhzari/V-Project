import { PrismaClient } from "@prisma/client";
import { CAPACITY_UNAVAILABLE_MESSAGE } from "../constants";
import { apiError } from "../errors";
import { parseIsoDate, toIsoDate } from "../serialize";
import { withTenant } from "../tenant";

export class CapacityService {
  constructor(private readonly prisma: PrismaClient) {}

  async getCapacity(shopkeeperId: string, distributorId: string, dateValue: string) {
    const date = parseIsoDate(dateValue);
    return withTenant(this.prisma, { shopkeeperId, distributorId }, async (tx) => {
      const row = await tx.deliveryCapacity.findUnique({
        where: {
          distributorId_date: { distributorId, date },
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
