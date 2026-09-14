export const config = {
  databaseUrl:
    process.env.DATABASE_URL ??
    "postgresql://vproject_app:vproject_app@127.0.0.1:5432/vproject",
  databaseAdminUrl:
    process.env.DATABASE_ADMIN_URL ??
    process.env.DATABASE_URL ??
    "postgresql://vproject:vproject@127.0.0.1:5432/vproject",
  authSecret: process.env.AUTH_SECRET ?? "dev-secret",
  port: Number(process.env.PORT ?? 3000),
};
