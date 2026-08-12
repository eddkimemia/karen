import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = "https://karenadventures.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/adventures`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/destinations`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/experiences`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/booking`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.7 },
  ];

  let adventureRoutes: MetadataRoute.Sitemap = [];
  try {
    const adventures = await prisma.adventure.findMany({
      select: { slug: true, createdAt: true },
    });
    adventureRoutes = adventures.map((a) => ({
      url: `${BASE}/adventures/${a.slug}`,
      lastModified: a.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB unavailable at build time — serve static routes only.
  }

  return [...staticRoutes, ...adventureRoutes];
}
