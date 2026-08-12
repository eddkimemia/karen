import { prisma } from "@/lib/prisma";

/**
 * Runtime self-healing for an empty catalog.
 *
 * If the destination table is empty (e.g. a fresh production database where
 * the build-time seed didn't complete), the first request to a data page seeds
 * the catalog on demand — so destinations appear even if the Vercel build seed
 * was skipped or failed. Idempotent and cheap: a count query, then a seed that
 * only creates missing rows. A shared promise prevents concurrent double-seeds.
 */
let seedPromise: Promise<unknown> | null = null;

export async function ensureCatalogSeeded(): Promise<void> {
  try {
    const count = await prisma.destination.count();
    if (count > 0) return;

    if (!seedPromise) {
      // Dynamic import keeps the large seed dataset out of the page bundle.
      seedPromise = import("../../prisma/seed")
        .then((m) => m.runSeed())
        .catch((err) => {
          console.error("[self-seed] Automatic seed failed:", err);
        })
        .finally(() => {
          seedPromise = null;
        });
    }
    await seedPromise;
  } catch (err) {
    // Never let an empty catalog block the page — log and continue.
    console.error("[self-seed] Could not check catalog:", err);
  }
}
