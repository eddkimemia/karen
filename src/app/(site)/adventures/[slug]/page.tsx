import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn, img } from "@/lib/utils";
import { PricePair } from "@/components/currency";
import { Reveal } from "@/components/reveal";
import { AdventureCard } from "@/components/adventure-card";
import { CtaSection } from "@/components/cta-section";

export const revalidate = 60;

export async function generateStaticParams() {
  const adventures = await prisma.adventure.findMany({
    select: { slug: true },
  });
  return adventures.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const adventure = await prisma.adventure.findUnique({
    where: { slug },
    select: { title: true, tagline: true, description: true, image: true },
  });
  if (!adventure) return {};
  return {
    title: adventure.title,
    description: adventure.description,
    openGraph: {
      title: `${adventure.title} · Karen Adventures`,
      description: adventure.tagline,
      images: [{ url: img(adventure.image, 1200, 80), width: 1200, height: 800 }],
    },
  };
}

export default async function AdventurePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [adventure, related] = await Promise.all([
    prisma.adventure.findUnique({
      where: { slug },
      include: {
        featuredIn: { select: { slug: true, name: true } },
      },
    }),
    prisma.adventure.findMany({
      where: { slug: { not: slug } },
      orderBy: [{ region: "asc" }, { startingPrice: "asc" }],
      take: 3,
    }),
  ]);

  if (!adventure) notFound();

  const facts = [
    { icon: Clock, label: "Duration", value: adventure.duration },
    { icon: Users, label: "Group size", value: adventure.groupSize ?? "2 – 8 guests" },
    { icon: CalendarDays, label: "Best season", value: adventure.bestSeason ?? "Year-round" },
    { icon: MapPin, label: "Location", value: adventure.location },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: adventure.title,
    description: adventure.tagline,
    image: img(adventure.image, 1200, 80),
    offers: {
      "@type": "Offer",
      price: adventure.startingPrice,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-midnight">
        <div className="absolute inset-0">
          <Image
            src={img(adventure.image, 2400, 74)}
            alt={adventure.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/45 to-midnight/25" />
          <div className="grain absolute inset-0" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 pt-40 sm:px-8 sm:pb-16">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ivory/60">
            <Link href="/" className="transition-colors hover:text-gold">Home</Link>
            <span className="text-gold">/</span>
            <Link href="/adventures" className="transition-colors hover:text-gold">Adventures</Link>
            <span className="text-gold">/</span>
            <span className="text-champagne">{adventure.title}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="border border-champagne/40 bg-midnight/40 px-3 py-1.5 text-[0.625rem] font-medium uppercase tracking-[0.28em] text-champagne backdrop-blur-sm">
              {adventure.tripType}
            </span>
            <span className="text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-gold">
              {adventure.location}
            </span>
          </div>

          <h1 className="mt-4 max-w-3xl font-serif text-5xl font-medium leading-[1.02] text-ivory text-balance sm:text-6xl lg:text-7xl">
            {adventure.title}
          </h1>
          <p className="mt-4 max-w-xl font-serif text-xl italic text-champagne/90 sm:text-2xl">
            {adventure.tagline}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="bg-ivory py-16 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid gap-14 lg:grid-cols-3 lg:gap-16">
            {/* Main */}
            <div className="lg:col-span-2">
              <Reveal>
                <h2 className="font-serif text-3xl font-medium text-midnight sm:text-4xl">
                  The Journey
                </h2>
                <div className="hairline mt-6 !w-24" />
                <p className="mt-6 text-base leading-relaxed text-midnight/75 sm:text-lg">
                  {adventure.description}
                </p>
                <p className="mt-5 text-base leading-relaxed text-midnight/75 sm:text-lg">
                  As with every Karen Adventures journey, this experience is
                  shaped around you — your dates, your pace, your appetite for
                  the wild. Tell us how you&rsquo;d like to travel and we&rsquo;ll
                  refine the details together.
                </p>
              </Reveal>

              <Reveal delay={0.1} className="mt-12">
                <h3 className="font-serif text-2xl font-medium text-midnight">
                  Highlights
                </h3>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {adventure.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 border border-midnight/10 bg-sand/50 px-5 py-4 text-sm text-midnight/80"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                      {h}
                    </li>
                  ))}
                </ul>
              </Reveal>

              {adventure.featuredIn.length > 0 && (
                <Reveal delay={0.15} className="mt-12">
                  <h3 className="font-serif text-2xl font-medium text-midnight">
                    Explore the region
                  </h3>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {adventure.featuredIn.map((d) => (
                      <Link
                        key={d.slug}
                        href={`/#explore`}
                        className="inline-flex items-center gap-2 border border-midnight/15 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-midnight/70 transition-all hover:border-gold hover:text-gold"
                      >
                        {d.name}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            {/* Sidebar */}
            <Reveal delay={0.15} className="lg:col-span-1">
              <aside className="border border-midnight/10 bg-white p-7 shadow-[0_24px_60px_-30px_rgba(7,26,51,0.35)] lg:sticky lg:top-24">
                <p className="text-[0.625rem] font-medium uppercase tracking-[0.32em] text-gold">
                  From
                </p>
                <p className="mt-2 font-serif text-5xl font-medium text-midnight">
                  <PricePair
                    usd={adventure.startingPrice}
                    secondaryClassName="text-base font-sans text-midnight/50"
                  />
                  <span className="text-base font-sans text-midnight/50">
                    {" "}
                    / person
                  </span>
                </p>

                <div className="mt-7 space-y-4 border-t border-midnight/10 pt-6">
                  {facts.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3.5">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                      <div>
                        <p className="text-[0.5625rem] font-medium uppercase tracking-[0.28em] text-midnight/45">
                          {label}
                        </p>
                        <p className="mt-0.5 text-sm text-midnight/80">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 space-y-3">
                  <Link
                    href={`/booking?adventure=${adventure.slug}`}
                    className="group flex items-center justify-center gap-2.5 bg-gold px-6 py-4 text-[0.8125rem] font-medium uppercase tracking-[0.18em] text-midnight transition-colors hover:bg-gold-soft"
                  >
                    Reserve This Journey
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center justify-center border border-midnight/20 px-6 py-4 text-[0.8125rem] font-medium uppercase tracking-[0.18em] text-midnight transition-all hover:border-gold hover:text-gold"
                  >
                    Ask a Question
                  </Link>
                </div>
                <p className="mt-5 text-center text-[0.6875rem] leading-relaxed text-midnight/45">
                  No payment is taken at enquiry stage. We plan first, together.
                </p>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-sand py-16 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <div className="flex items-end justify-between gap-6">
              <div>
                <span className="eyebrow">Keep Exploring</span>
                <h2 className={cn("mt-5 font-serif text-3xl font-medium text-midnight sm:text-4xl")}>
                  Journeys that pair well
                </h2>
              </div>
              <Link
                href="/adventures"
                className="group hidden shrink-0 items-center gap-2 border-b border-gold/60 pb-1 text-[0.75rem] font-medium uppercase tracking-[0.22em] text-midnight transition-colors hover:text-gold sm:inline-flex"
              >
                All adventures
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((r, i) => (
                <Reveal key={r.slug} delay={0.08 * i}>
                  <AdventureCard adventure={r} aspect="square" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection />
    </>
  );
}
