import { execSync } from "node:child_process";
import path from "node:path";

export default async function globalSetup(): Promise<void> {
  const backendRoot = path.resolve(__dirname, "..");
  const adminUrl =
    process.env.DATABASE_ADMIN_URL ??
    "postgresql://vproject:vproject@127.0.0.1:5432/vproject_test";
  execSync("npx prisma migrate deploy", {
    cwd: backendRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: adminUrl,
    },
  });
  execSync("npx prisma generate", {
    cwd: backendRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: adminUrl,
    },
  });
}
