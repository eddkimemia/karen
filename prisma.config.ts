import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma CLI config.
 *
 * On Vercel, projects with linked Vercel Postgres get POSTGRES_PRISMA_URL /
 * POSTGRES_URL_NON_POOLING / POSTGRES_URL instead of DATABASE_URL. This
 * config maps those onto the schema's datasource so `prisma generate`,
 * `prisma migrate deploy` and `prisma db seed` work in the build without
 * a manually-added DATABASE_URL. Local development keeps using DATABASE_URL
 * from .env (loaded via dotenv above).
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url:
      process.env.DATABASE_URL ??
      process.env.PRISMA_DATABASE_URL ??
      process.env.POSTGRES_PRISMA_URL ??
      process.env.POSTGRES_URL_NON_POOLING ??
      process.env.POSTGRES_URL ??
      "",
    // Migrations prefer a direct (non-pooled) connection when one exists.
    directUrl:
      process.env.DIRECT_URL ??
      process.env.POSTGRES_URL_NON_POOLING ??
      undefined,
  },
});
