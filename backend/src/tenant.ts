import { Prisma, PrismaClient } from "@prisma/client";

type Tenant = {
  shopkeeperId: string;
  distributorId?: string | null;
};

export type TenantTx = Prisma.TransactionClient;

export async function withTenant<T>(
  prisma: PrismaClient,
  tenant: Tenant,
  fn: (tx: TenantTx) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.shopkeeper_id', ${tenant.shopkeeperId}, true)`;
    await tx.$executeRaw`SELECT set_config('app.distributor_id', ${tenant.distributorId ?? ""}, true)`;
    return fn(tx);
  });
}
