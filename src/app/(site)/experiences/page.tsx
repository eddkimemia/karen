import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Users,
  Gem,
  Briefcase,
  CalendarDays,
  Wand2,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn, img } from "@/lib/utils";
import { Reveal } from "@/components/reveal";
import { PageHeader } from "@/components/page-header";
import { CtaSection } from "@/components/cta-section";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "Six ways to travel with Karen Adventures — private adventures, group expeditions, luxury getaways, corporate retreats, weekend escapes and custom experiences.",
};

const ICONS: Record<string, LucideIcon> = {
  Compass,
  Users,
  Gem,
  Briefcase,
  CalendarDays,
  Wand2,
};

/* tripTypes that define each experience style */
const STYLE_TRIP_TYPES: Record<string, string[]> = {
  "private-adventures": ["Safari", "Luxury"],
  "group-expeditions": ["Safari", "Adventure"],
  "luxury-getaways": ["Luxury", "Coastal"],
  "corporate-retreats": ["Luxury"],
  "weekend-escapes": ["Adventure"],
  "custom-experiences": ["Safari", "Adventure", "Coastal", "Cultural", "Luxury", "Expedition"],
};

/* representative imagery per experience */
const STYLE_IMAGE: Record<string, { id: string; alt: string }> = {
  "private-adventures": {
    id: "1516426122078-c23e76319801",
    alt: "Elephants beneath Kilimanjaro at dusk",
  },
  "group-expeditions": {
    id: "1529156069898-49953e39b3ac",
    alt: "Guests sharing a journey together",
  },
  "luxury-getaways": {
    id: "1520250497591-112f2f40a3f4",
    alt: "A conservancy pool at golden hour",
  },
  "corporate-retreats": {
    id: "1543269865-cbf427effbad",
    alt: "A team gathering in the highlands",
  },
  "weekend-escapes": {
    id: "1523293182086-7651a899d37f",
    alt: "A tent camp beneath the mountains",
  },
  "custom-experiences": {
    id: "1503220317375-aaad61436b1b",
    alt: "Plotting the next journey",
  },
};

export default async function ExperiencesPage() {
  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
  });
  const adventures = await prisma.adventure.findMany({
    orderBy: { startingPrice: "asc" },
    select: {
      slug: true,
      title: true,
      tripType: true,
      startingPrice: true,
      duration: true,
      location: true,
    },
  });

  return (
    <>
      <PageHeader
        eyebrow="Ways To Travel"
        title={
          <>
            Experiences,{" "}
            <em className="font-serif italic text-gold">Perfected.</em>
          </>
        }
        description="Six ways of experiencing Kenya, each one designed around you — your dates, your pace, and the story you want to tell."
        image="1500382017468-9049fed747ef"
        imageAlt="Golden light across the savannah at dusk"
        align="center"
      />

      <section className="bg-ivory py-20 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="space-y-20 sm:space-y-28">
            {experiences.map((exp, i) => {
              const Icon = ICONS[exp.icon] ?? Compass;
              const reversed = i % 2 === 1;
              const styleTrips = adventures.filter((a) =>
                STYLE_TRIP_TYPES[exp.slug]?.includes(a.tripType),
              );
              const image = STYLE_IMAGE[exp.slug];

              return (
                <div
                  key={exp.slug}
                  id={exp.slug}
                  className={cn(
                    "grid scroll-mt-24 items-center gap-10 lg:grid-cols-2 lg:gap-16",
                  )}
                >
                  <Reveal className={cn(reversed && "lg:order-2")}>
                    <div className="relative">
                      <div
                        className={cn(
                          "absolute -top-4 hidden h-full w-full border border-gold/40 lg:block",
                          reversed ? "-right-4" : "-left-4",
                        )}
                      />
                      <div className="relative aspect-[16/11] overflow-hidden">
                        {image && (
                          <Image
                            src={img(image.id, 1100, 76)}
                            alt={image.alt}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                          />
                        )}
                        <div className="img-frame absolute inset-0" />
                        <span className="absolute bottom-4 right-5 font-serif text-6xl font-light text-ivory/25">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={0.12} className={cn(reversed && "lg:order-1")}>
                    <span className="flex h-14 w-14 items-center justify-center border border-gold/50 text-gold">
                      <Icon className="h-6 w-6" strokeWidth={1.25} />
                    </span>
                    <h2 className="mt-6 font-serif text-3xl font-medium text-midnight sm:text-4xl">
                      {exp.title}
                    </h2>
                    <div className="hairline mt-5 !w-20" />
                    <p className="mt-5 text-base leading-relaxed text-midnight/70">
                      {exp.description}
                    </p>

                    {styleTrips.length > 0 && (
                      <div className="mt-7">
                        <p className="text-[0.625rem] font-medium uppercase tracking-[0.3em] text-midnight/45">
                          Journeys in this style
                        </p>
                        <ul className="mt-3 space-y-2.5">
                          {styleTrips.slice(0, 3).map((t) => (
                            <li key={t.slug}>
                              <Link
                                href={`/adventures/${t.slug}`}
                                className="group flex items-center justify-between border-b border-midnight/12 pb-2.5 text-sm text-midnight/75 transition-colors hover:text-gold"
                              >
                                <span>{t.title}</span>
                                <ArrowRight className="h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-1" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Link
                      href="/contact"
                      className="group mt-7 inline-flex items-center gap-2.5 bg-midnight px-7 py-3.5 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold hover:text-midnight"
                    >
                      Enquire about {exp.title.toLowerCase()}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
