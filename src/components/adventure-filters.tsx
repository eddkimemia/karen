"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { AdventureCard } from "@/components/adventure-card";
import { cn } from "@/lib/utils";

type AdventureProp = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  duration: string;
  startingPrice: number;
  location: string;
  region: string;
  tripType: string;
};

type Props = {
  adventures: AdventureProp[];
  initialType?: string;
  initialRegion?: string;
};

export function AdventureFilters({ adventures, initialType, initialRegion }: Props) {
  const types = useMemo(
    () => ["All", ...Array.from(new Set(adventures.map((a) => a.tripType)))],
    [adventures],
  );

  const [type, setType] = useState<string>(
    initialType && types.includes(initialType) ? initialType : "All",
  );
  const [region, setRegion] = useState<string | null>(initialRegion ?? null);

  const filtered = useMemo(
    () =>
      adventures.filter((a) => {
        const matchesType = type === "All" || a.tripType === type;
        const slugified = a.region.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const matchesRegion = !region || slugified === region;
        return matchesType && matchesRegion;
      }),
    [adventures, type, region],
  );

  return (
    <div>
      {region && (
        <div className="mb-8 flex items-center justify-between border border-gold/30 bg-gold/10 px-5 py-4">
          <p className="text-sm text-champagne">
            Showing journeys in{" "}
            <span className="font-medium uppercase tracking-[0.18em]">
              {region.replace(/-/g, " ")}
            </span>
          </p>
          <button
            type="button"
            onClick={() => setRegion(null)}
            className="flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-ivory/70 transition-colors hover:text-gold"
          >
            Clear <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2.5">
        {types.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={cn(
              "border px-5 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.22em] transition-all duration-300",
              type === t
                ? "border-gold bg-gold text-midnight"
                : "border-ivory/20 text-ivory/65 hover:border-gold/60 hover:text-champagne",
            )}
          >
            {t}
          </button>
        ))}
        <span className="ml-auto hidden self-center text-xs text-ivory/45 sm:block">
          {filtered.length} {filtered.length === 1 ? "journey" : "journeys"}
        </span>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <AdventureCard key={a.slug} adventure={a} aspect="square" />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-sm text-ivory/50">
          No journeys match that filter yet — but custom journeys are our
          speciality.{" "}
          <a href="/contact" className="text-gold underline underline-offset-4">
            Tell us what you&rsquo;re dreaming of
          </a>
          .
        </p>
      )}
    </div>
  );
}
