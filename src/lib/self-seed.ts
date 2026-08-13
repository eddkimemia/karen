import { prisma } from "@/lib/prisma";

/**
 * Runtime self-healing for the catalog.
 *
 * If any seed destinations are missing (a fresh production database, a
 * build-time seed that was skipped or failed, or seed destinations added in a
 * later deploy), the first request to a data page fills in the missing rows on
 * demand — so new destinations appear without a manual re-seed. Idempotent and
 * cheap: one count query, then a seed that only creates missing rows. A shared
 * promise prevents concurrent double-seeds.
 */
let seedPromise: Promise<unknown> | null = null;

export async function ensureCatalogSeeded(): Promise<void> {
  try {
    if (!seedPromise) {
      // Dynamic import keeps the large seed dataset out of the page bundle.
      seedPromise = import("../../prisma/seed")
        .then(async (m) => {
          const seedSlugs = m.destinations.map(
            (d: { slug: string }) => d.slug,
          );
          const present = await prisma.destination.count({
            where: { slug: { in: seedSlugs } },
          });
          if (present < seedSlugs.length) {
            await m.runSeed();
          }
        })
        .catch((err) => {
          console.error("[self-seed] Automatic seed failed:", err);
        })
        .finally(() => {
          seedPromise = null;
        });
    }
    await seedPromise;
  } catch (err) {
    // Never let a missing catalog block the page — log and continue.
    console.error("[self-seed] Could not check catalog:", err);
  }
}