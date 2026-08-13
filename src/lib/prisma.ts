import { PrismaClient } from "@prisma/client";

// On Vercel the DB URL arrives as Vercel Postgres vars (POSTGRES_PRISMA_URL /
// POSTGRES_URL_NON_POOLING / POSTGRES_URL) rather than DATABASE_URL. Map them
// onto DATABASE_URL before the client resolves the schema's env("DATABASE_URL").
process.env.DATABASE_URL ??=
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.POSTGRES_URL;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
