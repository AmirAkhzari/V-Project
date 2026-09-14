import { buildApp } from "./app";
import { config } from "./config";
import { prisma, prismaAdmin } from "./db";

async function main(): Promise<void> {
  const app = await buildApp();
  await app.listen({ port: config.port, host: "0.0.0.0" });
  app.log.info(`V-Project API listening on ${config.port}`);
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  await prismaAdmin.$disconnect();
  process.exit(1);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  await prismaAdmin.$disconnect();
  process.exit(0);
});
