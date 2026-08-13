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


/* Projection bounds for East Africa (lon/lat -> percentage of map panel) */
const LON_MIN = 23.5;
const LON_MAX = 52.0;
const LAT_MAX = 18.5;
const LAT_MIN = -12.5;

const px = (lon: number) => ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * 100;
const py = (lat: number) => ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100;

/* Natural-Earth-derived East Africa outlines (decorative, low opacity) */
const EAST_AFRICA_OUTLINE = [
  { name: "Burundi", d: "M20.5,74.2L20.3,70.3L19.4,68.8L21.5,69.1L22.6,67.3L24.5,67.5L24.7,68.7L25.4,69.5L25.4,70.5L24.6,71.2L23.2,72.9L21.9,74L20.5,74.2Z" },
  { name: "Djibouti", d: "M68.7,18.7L69.5,19.7L69.4,21L67.4,21.8L68.9,22.7L67.6,24.4L66.9,23.9L66,24.1L64.1,24L64,23L63.7,22.2L64.9,20.6L66.1,19.2L67.6,19.5L68.7,18.7Z" },
  { name: "Eritrea", d: "M66.1,19.2L64.9,18.2L63.5,16.3L61.9,15.2L61,14.1L58,12.8L55.6,12.8L54.7,12.1L52.7,12.9L50.5,11.4L49.5,13.8L45.4,13.2L45,11.9L46.5,7.1L46.9,5L48,4L50.5,3.5L52.3,1.6L54.4,5.4L55.3,8.3L57.2,9.9L62,12.9L64,14.8L65.9,16.6L67,17.7L68.7,18.7L67.6,19.5L66.1,19.2Z" },
  { name: "Ethiopia", d: "M50.5,11.4L52.7,12.9L54.7,12.1L55.6,12.8L58,12.8L61,14.1L61.9,15.2L63.5,16.3L64.9,18.2L66.1,19.2L64.9,20.6L63.7,22.2L64,23L64.1,24L66,24.1L66.9,23.9L67.6,24.4L66.9,25.6L68.2,27.3L69.5,28.9L70.8,30.1L82.3,33.9L85.2,33.9L75.3,43.5L70.7,43.7L67.6,46L65.4,46L64.4,47L62,47L60.6,45.9L57.4,47.3L56.3,48.6L54,48.4L53.2,48L52.4,48.1L51.3,48.1L46.9,45.3L44.4,45.3L43.2,44.3L43.2,42.5L41.4,41.9L39.3,38.4L37.7,37.7L37.1,36.4L35.3,34.8L33.2,34.6L34.4,32.7L36.2,32.6L36.8,31.7L36.7,28.8L37.7,25.4L39.4,24.5L39.8,23.2L41.3,20.7L43.4,19.1L44.8,15.9L45.4,13.2L49.5,13.8L50.5,11.4Z" },
  { name: "Kenya", d: "M61.4,62.4L63.5,65.1L61,66.4L60.1,67.7L58.8,68L58.3,70.3L57.2,71.6L56.5,73.7L55.1,74.8L50.1,71.5L49.8,69.7L37.1,63.1L36.5,62.7L36.5,59.3L37.5,58L39.2,55.9L40.5,53.5L38.9,49.8L38.5,48.2L36.9,46L39,44L41.4,41.9L43.2,42.5L43.2,44.3L44.4,45.3L46.9,45.3L51.3,48.1L52.4,48.1L53.2,48L54,48.4L56.3,48.6L57.4,47.3L60.6,45.9L62,47L64.4,47L61.3,50.7L61.4,62.4Z" },
  { name: "Rwanda", d: "M24.3,63.3L25.7,65.2L25.5,67.1L24.5,67.5L22.6,67.3L21.5,69.1L19.4,68.8L19.7,67.1L20.2,66.8L20.3,64.9L21.3,64L22.2,64.3L24.3,63.3Z" },
  { name: "South Sudan", d: "M36.7,29.1L36.8,31.7L36.2,32.6L34.4,32.7L33.2,34.6L35.3,34.8L37.1,36.4L37.7,37.7L39.3,38.4L41.4,41.9L39,44L36.9,46L34.7,47.5L32.2,47.4L29.4,48.2L27.2,47.5L25.7,48.4L22.6,46.2L21.8,44.8L19.9,45.5L18.2,45.3L17.3,45.8L15.7,45.5L13.6,42.8L13,41.8L10.4,40.5L9.5,38.6L8.1,37.2L5.7,35.5L5.7,34.4L3.7,33.1L1.4,31.9L2.4,31.5L3.6,30.9L4.5,28L5.5,26.5L8,26.1L8.6,27L10.4,28.9L11.4,29.1L12.7,28.6L15.2,28.7L15.7,29.4L19.2,29.4L19.3,28.7L21.1,28.1L21.5,27.1L22.8,26.5L25.7,28.4L27.6,28L29.3,25.7L31.2,23.9L30.9,22L30.1,21.1L32.2,20.9L32.4,20.2L34.1,20.4L33.6,22.8L34.1,25.1L35.9,26.4L36.3,27.5L36.2,29.1L36.7,29.1Z" },
  { name: "Somalia", d: "M92,22.3L93.9,22L95.6,20.9L96.9,20.9L97,21.8L96.6,23.7L96.7,25.4L95.9,26.5L94.9,30L93.2,33.6L91.1,37.7L88.1,42.5L85.1,46.1L80.9,50.5L77.4,53.1L72.2,56.3L68.9,58.7L65.1,62.6L64.2,64.3L63.5,65.1L61.4,62.4L61.3,50.7L64.4,47L65.4,46L67.6,46L70.7,43.7L75.3,43.5L85.2,33.9L87.7,31.2L89.3,29.2L89.3,27.5L89.3,24.3L89.3,22.9L89.3,22.9L90.4,22.8L92,22.3Z" },
  { name: "Tanzania", d: "M36.5,62.7L37.1,63.1L49.8,69.7L50.1,71.5L55.1,74.8L53.5,78.7L53.7,80.6L55.9,81.7L56,82.6L55.1,84.5L55.3,85.5L55,87.1L56.3,89.1L57.7,92.3L59,93L56.2,94.8L52.4,96.1L50.3,96L49,97L46.6,97.1L45.7,97.5L41.4,96.6L38.8,96.8L37.8,92.5L36.6,90.9L35.9,90.1L32.5,89.5L30.5,88.5L28.3,87.9L26.9,87.4L25.4,86.6L23.5,82.5L21.5,80.7L20.8,78.8L21.1,77.2L20.5,74.2L21.9,74L23.2,72.9L24.6,71.2L25.4,70.5L25.4,69.5L24.7,68.7L24.5,67.5L25.5,67.1L25.7,65.2L24.3,63.3L25.5,63L29.4,63L36.5,62.7Z" },
  { name: "Uganda", d: "M29.4,63L25.5,63L24.3,63.3L22.2,64.3L21.3,64L21.4,61.6L22.2,60.3L22.4,57.8L23.1,56.3L24.5,54.6L25.8,53.7L26.9,52.6L25.5,52.1L25.7,48.4L27.2,47.5L29.4,48.2L32.2,47.4L34.7,47.5L36.9,46L38.5,48.2L38.9,49.8L40.5,53.5L39.2,55.9L37.5,58L36.5,59.3L36.5,62.7L29.4,63Z" },
];

const GRID_LINES = {
  vertical: [12.5, 25, 37.5, 50, 62.5, 75, 87.5],
  horizontal: [10, 20, 30, 40, 50, 60, 70, 80, 90],
};

const BORDER_LABELS = [
  { x: 30, y: 33, text: "SOUTH SUDAN" },
  { x: 57, y: 12, text: "ERITREA" },
  { x: 55, y: 30, text: "ETHIOPIA" },
  { x: 66, y: 24, text: "DJIBOUTI" },
  { x: 83, y: 38, text: "SOMALIA" },
  { x: 50, y: 55, text: "KENYA" },
  { x: 30, y: 47, text: "UGANDA" },
  { x: 23, y: 69, text: "RWANDA & BURUNDI" },
  { x: 37, y: 82, text: "TANZANIA" },
  { x: 78, y: 93, text: "INDIAN OCEAN" },
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
              Explore <Em>East Africa</Em>
            </>
          }
          description="From the peaks of Kilimanjaro to the gorges of the Rift, from Zanzibar's coral sands to the rock churches of Lalibela — select a destination and step into its world."
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
                <g opacity={0.16}>
                  {EAST_AFRICA_OUTLINE.map((c) => (
                    <path
                      key={c.name}
                      d={c.d}
                      fill="rgba(201,162,39,0.16)"
                      stroke="rgba(232,215,168,0.7)"
                      strokeWidth={0.12}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
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
                East Africa, the Great Rift
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
