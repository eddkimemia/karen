import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { AdventureCard } from "@/components/adventure-card";
import { SectionHeading } from "@/components/ui";

type Props = {
  adventures: {
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
  }[];
};

/** "Journeys Worth Remembering" — editorial featured adventures. */
export function Journeys({ adventures }: Props) {
  const [lead, ...rest] = adventures;

  return (
    <section id="journeys" className="bg-ivory py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Featured Journeys"
            title={
              <>
                Journeys Worth{" "}
                <em className="font-serif italic text-gold">Remembering</em>
              </>
            }
            description="Signature journeys from across the region — selected by the people who guide them, from the Mara to the Serengeti, Zanzibar to Lalibela."
          />
          <Reveal delay={0.15} className="shrink-0">
            <Link
              href="/adventures"
              className="group inline-flex items-center gap-2.5 border-b border-gold/60 pb-1.5 text-[0.75rem] font-medium uppercase tracking-[0.22em] text-midnight transition-colors hover:text-gold"
            >
              View all adventures
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {lead && (
            <Reveal className="md:col-span-7">
              <AdventureCard adventure={lead} aspect="cinema" />
            </Reveal>
          )}
          {rest[0] && (
            <Reveal delay={0.1} className="md:col-span-5">
              <AdventureCard adventure={rest[0]} aspect="cinema" />
            </Reveal>
          )}
          {rest.slice(1).map((a, i) => (
            <Reveal key={a.slug} delay={0.08 * i} className="md:col-span-4">
              <AdventureCard adventure={a} aspect="square" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
