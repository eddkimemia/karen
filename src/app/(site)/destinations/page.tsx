import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ensureCatalogSeeded } from "@/lib/self-seed";
import { img } from "@/lib/utils";
import { Reveal } from "@/components/reveal";
import { PageHeader } from "@/components/page-header";
import { CtaSection } from "@/components/cta-section";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Explore East Africa's destinations — the Maasai Mara, Amboseli, Serengeti, Kilimanjaro, Zanzibar, the Great Rift Valley lakes and craters, the national parks and marine reserves, and the Indian Ocean coast.",
};

export default async function DestinationsPage() {
  // Self-heal an empty catalog (fresh production DB) on first visit.
  await ensureCatalogSeeded();

  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" },
    include: {
      recommendedTrips: {
        select: { slug: true, title: true },
        orderBy: { startingPrice: "asc" },
      },
    },
  });

  return (
    <>
      <PageHeader
        eyebrow="The Map of East Africa"
        title={
          <>
            {destinations.length} Worlds,{" "}
            <em className="font-serif italic text-gold">One Region.</em>
          </>
        }
        description="From Nairobi's green suburbs to the jade waters of Turkana, from the calderas of the Rift to the reefs of the Indian Ocean — the destinations we know best, and the journeys that belong to each one."
        image="1547721064-da6cfb341d50"
        imageAlt="A giraffe reaching into acacia trees at golden hour"
        align="center"
      />

      <section className="bg-ivory py-20 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d, i) => (
              <Reveal key={d.slug} delay={(i % 3) * 0.08}>
                <article className="group flex h-full flex-col overflow-hidden border border-midnight/10 bg-white transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-28px_rgba(7,26,51,0.4)]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={img(d.image, 900, 75)}
                      alt={d.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight/85 via-midnight/10 to-transparent" />
                    <div className="img-frame absolute inset-0" />
                    <p className="absolute left-4 top-4 flex items-center gap-1.5 border border-champagne/40 bg-midnight/40 px-2.5 py-1 text-[0.5625rem] font-medium uppercase tracking-[0.26em] text-champagne backdrop-blur-sm">
                      <MapPin className="h-3 w-3 text-gold" />
                      {d.region}
                    </p>
                    <span className="absolute right-4 top-4 border border-champagne/40 bg-midnight/40 px-2.5 py-1 text-[0.5625rem] font-medium uppercase tracking-[0.26em] text-champagne backdrop-blur-sm">
                      {d.country}
                    </span>
                    <h2 className="absolute bottom-4 left-4 font-serif text-3xl font-medium text-ivory">
                      <Link
                        href={`/destinations/${d.slug}`}
                        className="transition-colors duration-300 hover:text-champagne"
                      >
                        {d.name}
                      </Link>
                    </h2>
                  </div>

                  {d.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-1 p-1">
                      {d.images.slice(1, 4).map((id, i) => (
                        <Image
                          key={`${id}-${i}`}
                          src={img(id, 300, 55)}
                          alt={`${d.name} — gallery ${i + 2}`}
                          width={300}
                          height={180}
                          className="aspect-[5/3] w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-sm leading-relaxed text-midnight/65">
                      {d.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {d.bestExperiences.slice(0, 3).map((b) => (
                        <span
                          key={b}
                          className="border border-midnight/12 px-2.5 py-1 text-[0.6875rem] text-midnight/60"
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5">
                      <Link
                        href={`/destinations/${d.slug}`}
                        className="inline-flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-gold transition-colors hover:text-midnight"
                      >
                        View destination
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    <div className="mt-auto space-y-2.5 border-t border-midnight/10 pt-5">
                      {d.recommendedTrips.slice(0, 2).map((t) => (
                        <Link
                          key={t.slug}
                          href={`/adventures/${t.slug}`}
                          className="group/link flex items-center justify-between text-sm text-midnight/75 transition-colors hover:text-gold"
                        >
                          {t.title}
                          <ArrowRight className="h-4 w-4 text-gold transition-transform duration-300 group-hover/link:translate-x-1" />
                        </Link>
                      ))}
                      <Link
                        href="/#explore"
                        className="mt-2 inline-flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight transition-colors hover:text-gold"
                      >
                        Explore on the map
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
