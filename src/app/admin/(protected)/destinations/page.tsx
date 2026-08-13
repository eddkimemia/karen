import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/ui";
import {
  DestinationsManager,
  type DestinationRow,
} from "@/components/admin/destinations-manager";

export default async function AdminDestinationsPage() {
  const rows = await prisma.destination.findMany({
    orderBy: { name: "asc" },
    include: {
      recommendedTrips: { select: { slug: true, title: true } },
    },
  });

  const journeys = await prisma.adventure.findMany({
    orderBy: { title: "asc" },
    select: { slug: true, title: true },
  });

  const destinations: DestinationRow[] = rows.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    region: d.region,
    country: d.country || "Kenya",
    description: d.description,
    image: d.image,
    imageAlt: d.imageAlt,
    images: d.images,
    latitude: d.latitude,
    longitude: d.longitude,
    bestExperiences: d.bestExperiences,
    trips: d.recommendedTrips.map((t) => t.slug),
  }));

  return (
    <>
      <AdminHeader
        title="Destinations"
        description="Create and edit the places on East Africa's map — parks, lakes, mountains and the coast."
      />
      <DestinationsManager
        destinations={destinations}
        journeys={journeys.map((j) => ({ slug: j.slug, title: j.title }))}
      />
    </>
  );
}
