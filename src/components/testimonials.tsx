"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui";

type Props = {
  items: {
    name: string;
    location: string;
    tripType: string;
    quote: string;
    rating: number;
  }[];
};

/** "Stories From The Journey" — auto-advancing editorial testimonial. */
export function Testimonials({ items }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 7000);
    return () => clearInterval(t);
  }, [paused, count]);

  if (count === 0) return null;
  const item = items[index];

  return (
    <section className="bg-ivory py-24 sm:py-32">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Guest Stories"
          title={
            <>
              Stories From <em className="font-serif italic text-gold">The Journey</em>
            </>
          }
        />

        <div
          className="relative mt-14 text-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[70%] font-serif text-[7rem] leading-none text-gold/25 select-none sm:text-[9rem]"
          >
            &ldquo;
          </span>

          <div className="min-h-[280px] sm:min-h-[250px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto max-w-3xl"
              >
                <div className="flex justify-center gap-1.5">
                  {Array.from({ length: item.rating }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="mt-7 font-serif text-2xl font-light leading-snug text-midnight text-balance sm:text-[2rem]">
                  {item.quote}
                </p>
                <footer className="mt-9">
                  <p className="font-serif text-xl font-medium text-midnight">
                    {item.name}
                  </p>
                  <p className="mt-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-midnight/50">
                    {item.location} · {item.tripType}
                  </p>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => setIndex((index - 1 + count) % count)}
              aria-label="Previous story"
              className="flex h-11 w-11 items-center justify-center border border-midnight/20 text-midnight transition-all hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Story ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i === index
                      ? "w-8 bg-gold"
                      : "w-1.5 bg-midnight/25 hover:bg-midnight/50",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIndex((index + 1) % count)}
              aria-label="Next story"
              className="flex h-11 w-11 items-center justify-center border border-midnight/20 text-midnight transition-all hover:border-gold hover:text-gold"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
