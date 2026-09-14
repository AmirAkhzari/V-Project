import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      AUTH_SECRET: "test-secret",
      DATABASE_URL:
        process.env.DATABASE_URL ??
        "postgresql://vproject_app:vproject_app@127.0.0.1:5432/vproject_test",
      DATABASE_ADMIN_URL:
        process.env.DATABASE_ADMIN_URL ??
        "postgresql://vproject:vproject@127.0.0.1:5432/vproject_test",
    },
    globalSetup: "./tests/global-setup.ts",
    setupFiles: ["./tests/setup.ts"],
    fileParallelism: false,
    sequence: { concurrent: false },
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
