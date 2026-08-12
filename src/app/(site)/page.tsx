import { prisma } from "@/lib/prisma";
import { ensureCatalogSeeded } from "@/lib/self-seed";
import { Hero } from "@/components/hero";
import { Journeys } from "@/components/journeys";
import { ExperiencesSection } from "@/components/experiences-section";
import { WhyKaren } from "@/components/why-karen";
import { MapExplorer } from "@/components/map-explorer";
import { Testimonials } from "@/components/testimonials";
import { Gallery } from "@/components/gallery";
import { CtaSection } from "@/components/cta-section";

export const revalidate = 60;

export default async function Home() {
  // Self-heal an empty catalog (fresh production DB) on first visit.
  await ensureCatalogSeeded();

  const [featured, experiences, destinations, testimonials, gallery] =
    await Promise.all([
      prisma.adventure.findMany({
        where: { featured: true },
        orderBy: { startingPrice: "asc" },
        take: 5,
      }),
      prisma.experience.findMany({ orderBy: { order: "asc" } }),
      prisma.destination.findMany({
        orderBy: { name: "asc" },
        include: {
          recommendedTrips: {
            select: { slug: true, title: true, region: true },
            orderBy: { startingPrice: "asc" },
          },
        },
      }),
      prisma.testimonial.findMany(),
      prisma.galleryItem.findMany({ orderBy: { order: "asc" } }),
    ]);

  return (
    <>
      <Hero />
      <Journeys adventures={featured} />
      <ExperiencesSection experiences={experiences} />
      <WhyKaren />
      <MapExplorer
        destinations={destinations.map((d) => ({
          ...d,
          journeyRegion: d.recommendedTrips[0]?.region
            ? d.recommendedTrips[0].region.toLowerCase().replace(/[^a-z0-9]+/g, "-")
            : null,
        }))}
      />
      <Testimonials items={testimonials} />
      <Gallery items={gallery} />
      <CtaSection />
    </>
  );
}
