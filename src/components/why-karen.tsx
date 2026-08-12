import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading, Em } from "@/components/ui";
import { img } from "@/lib/utils";

const TRUST = [
  {
    title: "Curated Experiences",
    copy: "Every journey is thoughtfully designed — from the first conversation to the final sundowner.",
  },
  {
    title: "Local Expertise",
    copy: "Authentic Kenya, guided by people who know it best. Our team grew up on these roads.",
  },
  {
    title: "Seamless Planning",
    copy: "From departure to return, every detail is handled. You carry nothing but anticipation.",
  },
  {
    title: "Unforgettable Moments",
    copy: "Experiences designed to become lasting memories — the kind you retell for years.",
  },
];

/** "More Than a Trip." — editorial story + four trust points. */
export function WhyKaren() {
  return (
    <section className="bg-ivory py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Editorial collage */}
          <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -left-5 -top-5 hidden h-full w-full border border-gold/50 sm:block" />
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={img("1547721064-da6cfb341d50", 1100, 80)}
                alt="A giraffe reaching into acacia trees at golden hour"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-12 -right-4 hidden w-2/5 border-8 border-ivory sm:block">
              <Image
                src={img("1500382017468-9049fed747ef", 700, 80)}
                alt="Golden light over the savannah at dusk"
                width={560}
                height={420}
                className="h-auto w-full object-cover"
              />
            </div>
            <p className="absolute -bottom-6 left-0 hidden border border-gold/40 bg-midnight px-5 py-3 font-serif text-sm italic text-champagne sm:block">
              “Kenya is not a place. It is a feeling.”
            </p>
          </Reveal>

          {/* Copy + trust points */}
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Why Karen Adventures"
                title={
                  <>
                    More Than <Em>a Trip.</Em>
                  </>
                }
                description="Karen Adventures creates carefully curated experiences that combine adventure, culture, nature, comfort — and the moments in between that you'll carry home."
              />
            </Reveal>

            <div className="mt-10">
              {TRUST.map((item, i) => (
                <Reveal key={item.title} delay={0.06 * i}>
                  <div className="group flex gap-6 border-t border-midnight/10 py-6 transition-colors duration-300 first:border-t-0 hover:bg-sand/60 sm:px-4">
                    <span className="font-serif text-2xl font-light text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-serif text-xl font-medium text-midnight">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-midnight/65">
                        {item.copy}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <Link
                href="/about"
                className="group mt-8 inline-flex items-center gap-2.5 border-b border-gold/70 pb-1.5 text-[0.75rem] font-medium uppercase tracking-[0.22em] text-midnight transition-colors hover:text-gold"
              >
                The story behind the brand
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
