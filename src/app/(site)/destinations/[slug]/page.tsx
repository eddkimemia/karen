import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Compass,
  Globe2,
  MapPin,
  Mountain,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ensureCatalogSeeded } from "@/lib/self-seed";
import { img } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { CtaSection } from "@/components/cta-section";
import { AdventureCard } from "@/components/adventure-card";
import { DestinationGallery } from "@/components/destination-gallery";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = await prisma.destination.findUnique({
    where: { slug },
    select: { name: true, region: true, country: true, description: true, image: true },
  });
  if (!destination) return { title: "Destination not found" };
  return {
    title: `${destination.name} — Destinations`,
    description: destination.description,
    openGraph: {
      title: `${destination.name} — Karen Adventures`,
      description: destination.description,
      images: [{ url: img(destination.image, 1200) }],
    },
  };
}

export default async function DestinationPage({ params }: Props) {
  // Self-heal an empty catalog (fresh production DB) on first visit.
  await ensureCatalogSeeded();

  const { slug } = await params;
  const destination = await prisma.destination.findUnique({
    where: { slug },
    include: {
      recommendedTrips: {
        orderBy: { startingPrice: "asc" },
      },
    },
  });
  if (!destination) notFound();

  const photos = [
    { id: destination.image, alt: destination.imageAlt },
    ...destination.images
      .filter((id) => id !== destination.image)
      .map((id, i) => ({
        id,
        alt: `${destination.name} — gallery ${i + 1}`,
      })),
  ];

  const neighbors = await prisma.destination.findMany({
    where: { id: { not: destination.id }, country: destination.country },
    orderBy: { name: "asc" },
    take: 3,
    select: { slug: true, name: true, country: true, image: true, imageAlt: true },
  });

  return (
    <>
      <PageHeader
        eyebrow={`${destination.country} · ${destination.region}`}
        title={destination.name}
        description={destination.description}
        image={destination.image}
        imageAlt={destination.imageAlt}
        compact
      />

      {/* Facts bar */}
      <section className="border-b border-midnight/10 bg-white">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-px overflow-hidden sm:grid-cols-4">
          {[
            {
              icon: MapPin,
              label: "Country",
              value: destination.country,
            },
            {
              icon: Compass,
              label: "Region",
              value: destination.region,
            },
            {
              icon: Globe2,
              label: "Coordinates",
              value: `${destination.latitude.toFixed(2)}° ${destination.longitude.toFixed(2)}°`,
            },
            {
              icon: Sparkles,
              label: "Experiences",
              value: `${destination.bestExperiences.length} signature moments`,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 px-4 py-7 text-center"
            >
              <Icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
              <p className="text-[0.5625rem] font-medium uppercase tracking-[0.3em] text-midnight/45">
                {label}
              </p>
              <p className="text-sm font-medium text-midnight">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story + best experiences */}
      <section className="bg-ivory py-16 sm:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <p className="eyebrow">The Place</p>
            <h2 className="mt-5 font-serif text-3xl font-medium leading-snug text-midnight sm:text-4xl">
              {destination.name}, in its own words
            </h2>
            <div className="mt-6 space-y-5 leading-[1.9] text-midnight/75">
              <p>{destination.description}</p>
              <p>
                Part of the {destination.region} — a region we know road by
                road, camp by camp. Our planners live close enough to this
                landscape that every journey here is designed with the detail
                only locals carry.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/#explore"
                className="group inline-flex items-center gap-2.5 bg-gold px-7 py-3.5 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-midnight transition-colors hover:bg-gold-soft"
              >
                Explore on the map
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2.5 border border-midnight/25 px-7 py-3.5 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-midnight transition-colors hover:border-gold hover:text-gold"
              >
                Plan a trip here
              </Link>
            </div>
          </div>

          <aside className="border border-midnight/10 bg-white p-7 shadow-sm lg:sticky lg:top-24 lg:self-start">
            <p className="text-[0.625rem] font-medium uppercase tracking-[0.3em] text-gold">
              Best experiences
            </p>
            <ul className="mt-5 space-y-4">
              {destination.bestExperiences.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span className="text-sm leading-relaxed text-midnight/75">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* Gallery — images managed by the admin */}
      <DestinationGallery photos={photos} name={destination.name} />

      {/* Recommended journeys */}
      {destination.recommendedTrips.length > 0 && (
        <section className="bg-ivory py-16 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">The Journeys</p>
                <h2 className="mt-5 font-serif text-3xl font-medium text-midnight sm:text-4xl">
                  Journeys Through {destination.name}
                </h2>
              </div>
              <Link
                href="/adventures"
                className="text-[0.6875rem] font-medium uppercase tracking-[0.25em] text-gold transition-colors hover:text-midnight"
              >
                All adventures →
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {destination.recommendedTrips.map((trip) => (
                <AdventureCard key={trip.slug} adventure={trip} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Neighbours */}
      {neighbors.length > 0 && (
        <section className="border-t border-midnight/10 bg-sand py-16 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <p className="flex items-center gap-2 text-[0.625rem] font-medium uppercase tracking-[0.3em] text-gold">
              <Mountain className="h-4 w-4" /> More of {destination.country}
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {neighbors.map((n) => (
                <Link
                  key={n.slug}
                  href={`/destinations/${n.slug}`}
                  className="group flex items-center gap-4 overflow-hidden border border-midnight/10 bg-white p-3 shadow-sm transition-shadow duration-500 hover:shadow-lg"
                >
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden">
                    <Image
                      src={img(n.image, 400, 65)}
                      alt={n.imageAlt}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-midnight transition-colors group-hover:text-gold">
                      {n.name}
                    </h3>
                    <p className="mt-1 text-[0.625rem] font-medium uppercase tracking-[0.22em] text-midnight/45">
                      {n.country}
                    </p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-gold/60 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection />
    </>
  );
}