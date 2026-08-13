import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { cn, img } from "@/lib/utils";
import { Price } from "@/components/currency";

type AdventureCardProps = {
  adventure: {
    slug: string;
    title: string;
    tagline: string;
    description: string;
    image: string;
    imageAlt: string;
    duration: string;
    startingPrice: number;
    location: string;
    tripType: string;
  };
  aspect?: "cinema" | "tall" | "square";
  className?: string;
};

const aspects = {
  cinema: "aspect-[16/10]",
  tall: "aspect-[3/4]",
  square: "aspect-[4/3]",
};

export function AdventureCard({
  adventure: a,
  aspect = "cinema",
  className,
}: AdventureCardProps) {
  return (
    <Link
      href={`/adventures/${a.slug}`}
      className={cn("group relative block overflow-hidden bg-royal", className)}
      aria-label={`${a.title} — discover journey`}
    >
      <div className={cn("relative overflow-hidden", aspects[aspect])}>
        <Image
          src={img(a.image, 1400, 78)}
          alt={a.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
        />

        {/* Grade */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/95 via-midnight/25 to-midnight/10 transition-opacity duration-700 group-hover:from-midnight" />
        <div className="img-frame absolute inset-0" />

        {/* Type chip */}
        <span className="absolute left-5 top-5 border border-champagne/35 bg-midnight/40 px-3 py-1.5 text-[0.625rem] font-medium uppercase tracking-[0.28em] text-champagne backdrop-blur-sm">
          {a.tripType}
        </span>

        {/* Body */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
          <p className="text-[0.625rem] font-medium uppercase tracking-[0.32em] text-gold">
            {a.location}
          </p>
          <h3 className="mt-2 font-serif text-2xl font-medium leading-tight text-ivory transition-colors duration-500 group-hover:text-champagne sm:text-[1.75rem]">
            {a.title}
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ivory/70 line-clamp-2">
            {a.tagline} — {a.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ivory/15 pt-4">
            <span className="flex items-center gap-2 text-xs text-ivory/75">
              <Clock className="h-3.5 w-3.5 text-gold" />
              {a.duration}
            </span>
            <span className="text-xs text-ivory/75">
              From{" "}
              <span className="font-medium text-champagne">
                <Price usd={a.startingPrice} />
              </span>
            </span>
            <span className="ml-auto inline-flex translate-y-1 items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-gold opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
              Discover Journey
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
