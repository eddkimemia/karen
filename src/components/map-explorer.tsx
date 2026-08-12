"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Compass, X } from "lucide-react";
import { cn, img } from "@/lib/utils";
import { SectionHeading, Em } from "@/components/ui";

export type DestinationProp = {
  slug: string;
  name: string;
  region: string;
  description: string;
  image: string;
  imageAlt: string;
  latitude: number;
  longitude: number;
  bestExperiences: string[];
  recommendedTrips: { slug: string; title: string }[];
  /** slugified adventure region of the first recommended trip (for filtering) */
  journeyRegion: string | null;
};


/* Projection bounds for Kenya (lon/lat -> percentage of map panel) */
const LON_MIN = 33.5;
const LON_MAX = 42.2;
const LAT_MAX = 5.2;
const LAT_MIN = -4.9;

const px = (lon: number) => ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * 100;
const py = (lat: number) => ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100;

/* Crude Natural-Earth-derived Kenya outline (decorative, low opacity) */
const KENYA_PATH =
  "M550.83,326.52l2.66,5.19l-3.19,6.69l-0.42,2.03l15.93,9.85l4.94-7.76l-2.5-2.03l-0.05-10.22l3.13-3.42l-4.99,1.66l-3.77,0.05l-5.9-4.98l-1.86-0.8l-3.45,0.32l-0.61,1.02Z";

const GRID_LINES = {
  vertical: [12.5, 25, 37.5, 50, 62.5, 75, 87.5],
  horizontal: [10, 20, 30, 40, 50, 60, 70, 80, 90],
};

const BORDER_LABELS = [
  { x: 14, y: 4, text: "ETHIOPIA" },
  { x: 82, y: 12, text: "SOMALIA" },
  { x: 30, y: 6, text: "SUDAN" },
  { x: 2, y: 42, text: "UGANDA" },
  { x: 3, y: 92, text: "TANZANIA" },
  { x: 88, y: 68, text: "INDIAN OCEAN" },
];

export function MapExplorer({ destinations }: { destinations: DestinationProp[] }) {
  const [selected, setSelected] = useState<DestinationProp | null>(
    destinations[0] ?? null,
  );

  const sorted = useMemo(
    () => [...destinations].sort((a, b) => a.latitude - b.latitude),
    [destinations],
  );

  return (
    <section id="explore" className="relative overflow-hidden bg-royal py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(18,58,99,0.6), transparent), radial-gradient(ellipse 50% 40% at 85% 80%, rgba(201,162,39,0.07), transparent)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          tone="light"
          eyebrow="Destination Explorer"
          title={
            <>
              Explore <Em>Kenya</Em>
            </>
          }
          description="From the jade waters of Turkana to the white sands of the coast — select a destination and step into its world."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-5 lg:gap-12">
          {/* ------------------------------------------------- map ---- */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[5/6] w-full overflow-hidden border border-gold/20 bg-royal-deep sm:aspect-[4/5]">
              {/* graticule + contours + silhouette */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                aria-hidden
              >
                {GRID_LINES.vertical.map((v) => (
                  <line key={`v${v}`} x1={v} y1={0} x2={v} y2={100} stroke="rgba(248,245,237,0.045)" strokeWidth={0.18} />
                ))}
                {GRID_LINES.horizontal.map((h) => (
                  <line key={`h${h}`} x1={0} y1={h} x2={100} y2={h} stroke="rgba(248,245,237,0.045)" strokeWidth={0.18} />
                ))}
                <path
                  d="M-5,28 C 12,10 30,14 44,6 C 58,-2 74,4 82,18 M 18,95 C 34,82 58,88 74,76"
                  fill="none"
                  stroke="rgba(201,162,39,0.12)"
                  strokeWidth={0.3}
                />
                <g
                  transform="translate(-22025.6 -12936.2) scale(40)"
                  opacity={0.16}
                >
                  <path
                    d={KENYA_PATH}
                    fill="rgba(201,162,39,0.16)"
                    stroke="rgba(232,215,168,0.7)"
                    strokeWidth={0.12}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
                {BORDER_LABELS.map((l) => (
                  <text
                    key={l.text}
                    x={l.x}
                    y={l.y}
                    fontSize={2.4}
                    letterSpacing={0.7}
                    fill="rgba(248,245,237,0.22)"
                    fontFamily="var(--font-inter)"
                  >
                    {l.text}
                  </text>
                ))}
              </svg>

              {/* corner ticks */}
              <span className="absolute left-3 top-3 h-3 w-3 border-l border-t border-gold/50" />
              <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-gold/50" />
              <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-gold/50" />
              <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-gold/50" />

              {/* markers */}
              {sorted.map((d) => {
                const active = selected?.slug === d.slug;
                return (
                  <button
                    key={d.slug}
                    type="button"
                    aria-label={`Open ${d.name}`}
                    aria-pressed={active}
                    onClick={() => setSelected(d)}
                    className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${px(d.longitude)}%`,
                      top: `${py(d.latitude)}%`,
                    }}
                  >
                    <span className="relative flex h-4 w-4 items-center justify-center">
                      {active && (
                        <span className="absolute inline-flex h-4 w-4 animate-marker-ping rounded-full bg-gold/60" />
                      )}
                      <span
                        className={cn(
                          "relative h-2.5 w-2.5 rounded-full border transition-all duration-300",
                          active
                            ? "border-midnight bg-gold shadow-[0_0_12px_rgba(201,162,39,0.9)]"
                            : "border-gold/80 bg-gold/40 group-hover:bg-gold group-hover:shadow-[0_0_10px_rgba(201,162,39,0.7)]",
                        )}
                      />
                    </span>
                    <span
                      className={cn(
                        "pointer-events-none absolute left-1/2 whitespace-nowrap border px-2.5 py-1 text-[0.5625rem] font-medium uppercase tracking-[0.22em] transition-all duration-300",
                        py(d.latitude) > 20
                          ? "bottom-full mb-2"
                          : "top-full mt-2",
                        px(d.longitude) > 76
                          ? "-translate-x-[90%]"
                          : "-translate-x-1/2",
                        active
                          ? "border-gold bg-midnight text-champagne opacity-100"
                          : "border-ivory/15 bg-midnight/80 text-ivory/70 opacity-0 group-hover:opacity-100",
                      )}
                    >
                      {d.name}
                    </span>
                  </button>
                );
              })}

              {/* watermark */}
              <span className="pointer-events-none absolute bottom-2 right-3 font-serif text-sm italic text-ivory/25">
                Kenya, the Great Rift
              </span>
            </div>
            <p className="mt-4 text-center text-xs leading-relaxed text-ivory/45">
              <Compass className="mr-1.5 inline h-3.5 w-3.5 text-gold/70" />
              Select a gold marker to open the destination
            </p>
          </div>

          {/* ------------------------------------------------- preview ---- */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="border border-ivory/10 bg-midnight/40 backdrop-blur-sm"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={img(selected.image, 1200, 78)}
                      alt={selected.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/20 to-transparent" />
                    <div className="img-frame absolute inset-0" />
                    <span className="absolute left-5 top-5 border border-champagne/40 bg-midnight/50 px-3 py-1.5 text-[0.625rem] font-medium uppercase tracking-[0.28em] text-champagne backdrop-blur-sm">
                      {selected.region}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      aria-label="Close destination preview"
                      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:border-gold hover:text-gold"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <h3 className="absolute bottom-4 left-5 font-serif text-4xl font-medium text-ivory sm:text-5xl">
                      {selected.name}
                    </h3>
                  </div>

                  <div className="p-6 sm:p-8">
                    <p className="text-sm leading-relaxed text-ivory/70">
                      {selected.description}
                    </p>

                    <div className="mt-7">
                      <h4 className="text-[0.625rem] font-medium uppercase tracking-[0.32em] text-gold">
                        Best Experiences
                      </h4>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {selected.bestExperiences.map((b) => (
                          <li
                            key={b}
                            className="border border-ivory/15 px-3.5 py-1.5 text-xs text-ivory/80"
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-7">
                      <h4 className="text-[0.625rem] font-medium uppercase tracking-[0.32em] text-gold">
                        Recommended Journeys
                      </h4>
                      <ul className="mt-3 space-y-2.5">
                        {selected.recommendedTrips.map((t) => (
                          <li key={t.slug}>
                            <Link
                              href={`/adventures/${t.slug}`}
                              className="group flex items-center justify-between border-b border-ivory/10 pb-2.5 text-sm text-ivory/80 transition-colors hover:text-champagne"
                            >
                              <span>{t.title}</span>
                              <ArrowRight className="h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4">
                      <Link
                        href={`/contact?destination=${selected.slug}`}
                        className="group inline-flex items-center gap-2.5 bg-gold px-8 py-3.5 text-[0.8125rem] font-medium uppercase tracking-[0.18em] text-midnight transition-colors hover:bg-gold-soft"
                      >
                        Plan a trip to {selected.name}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                      <Link
                        href={
                          selected.journeyRegion
                            ? `/adventures?region=${selected.journeyRegion}`
                            : "/adventures"
                        }
                        className="inline-flex items-center gap-2.5 border border-ivory/30 px-8 py-3.5 text-[0.8125rem] font-medium uppercase tracking-[0.18em] text-ivory transition-colors hover:border-gold hover:text-gold"
                      >
                        Browse journeys
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex h-full min-h-[320px] flex-col items-center justify-center border border-dashed border-gold/25 bg-midnight/30 p-10 text-center"
                >
                  <Compass className="h-10 w-10 text-gold/60" strokeWidth={1} />
                  <h3 className="mt-5 font-serif text-2xl text-ivory">
                    Choose a destination
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/55">
                    Tap a gold marker on the map to reveal its landscapes, best
                    experiences and the journeys we run there.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
