import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  HeartHandshake,
  Leaf,
  Mountain,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { img } from "@/lib/utils";
import { Reveal } from "@/components/reveal";
import { PageHeader } from "@/components/page-header";
import { SectionHeading, Em } from "@/components/ui";
import { CtaSection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of Karen Adventures — born in the green suburbs of Karen, Nairobi, and devoted to showing Kenya the way it deserves to be seen.",
};

const VALUES: { icon: LucideIcon; title: string; copy: string }[] = [
  {
    icon: Compass,
    title: "Craft",
    copy: "Every itinerary is written by hand, walked by our team, and refined with every journey we run.",
  },
  {
    icon: HeartHandshake,
    title: "Care",
    copy: "Small groups, the same faces at every step, and people who remember your name at the next camp.",
  },
  {
    icon: Leaf,
    title: "The Land",
    copy: "We travel gently — conservancies over crowds, local guides over shortcuts, and always the long way home.",
  },
  {
    icon: Mountain,
    title: "Legacy",
    copy: "Kenya gives more than it takes. We work to keep it wild, welcoming, and worth coming back to.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title={
          <>
            Born in <em className="font-serif italic text-gold">Karen,</em>
            <br />
            Raised by Kenya.
          </>
        }
        description="We are a Nairobi house of curated travel — named for the green suburb of Karen, where the story of this land first reached the world."
        image="1439066615861-d1af74d74000"
        imageAlt="Morning light over the calm waters of the Rift Valley"
        align="left"
      />

      {/* Story */}
      <section className="bg-ivory py-20 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <div className="relative">
                <div className="absolute -left-4 -top-4 hidden h-full w-full border border-gold/40 sm:block" />
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={img("1441974231531-c6227db76b6e", 1100, 78)}
                    alt="Sunlight through the mountain forest of Kenya"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
                <p className="absolute -bottom-5 right-0 hidden border border-gold/40 bg-midnight px-5 py-3 font-serif text-sm italic text-champagne sm:block">
                  Karen — where the journey begins.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <span className="eyebrow">Why We Call It Karen</span>
              <h2 className="mt-5 font-serif text-4xl font-medium leading-tight text-midnight sm:text-5xl">
                The suburbs where
                <br />
                <em className="font-serif italic text-gold">
                  Out of Africa
                </em>{" "}
                began.
              </h2>
              <div className="hairline mt-7 !w-24" />
              <div className="mt-7 space-y-5 text-base leading-relaxed text-midnight/70">
                <p>
                  Karen is the green quarter of Nairobi named for Karen Blixen,
                  whose memoir <em className="font-serif italic text-midnight">Out of Africa</em>{" "}
                  told the world how this land can take hold of a person. We
                  chose the name deliberately — as a promise, not a theme.
                </p>
                <p>
                  Karen Adventures was born in that same shade, from a simple
                  belief: Kenya&rsquo;s greatest experiences belong to the people
                  who live here. Our guides grew up on these roads. Our
                  itineraries are written by hand, not copied from a brochure.
                  And every journey is measured by one thing — whether it
                  becomes the story you tell for the rest of your life.
                </p>
                <p>
                  Whether it&rsquo;s a lion pride at dawn in the Mara, a summit
                  sunrise on Mount Kenya, or a dhow sailing into the sunset off
                  Lamu — we design it around you, and we stay with you from the
                  first call to the last farewell.
                </p>
              </div>
              <Link
                href="/contact"
                className="group mt-9 inline-flex items-center gap-2.5 bg-midnight px-8 py-4 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold hover:text-midnight"
              >
                Begin your journey
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative overflow-hidden bg-royal-deep py-24 sm:py-32">
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(closest-side, rgba(201,162,39,0.12), transparent)",
          }}
        />
        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
          <SectionHeading
            align="center"
            tone="light"
            eyebrow="What We Stand For"
            title={
              <>
                The Values We <Em>Travel By</Em>
              </>
            }
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, copy }, i) => (
              <Reveal key={title} delay={0.07 * i}>
                <div className="group h-full border border-ivory/10 bg-ivory/[0.03] p-8 transition-all duration-500 hover:border-gold/40 hover:bg-ivory/[0.06]">
                  <Icon
                    className="h-7 w-7 text-gold"
                    strokeWidth={1.25}
                  />
                  <h3 className="mt-6 font-serif text-2xl font-medium text-ivory">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/60">
                    {copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The Karen Standard */}
      <section className="bg-sand py-20 sm:py-28">
        <div className="mx-auto w-full max-w-5xl px-5 text-center sm:px-8">
          <Reveal>
            <span className="eyebrow eyebrow--center">The Karen Standard</span>
            <blockquote className="mx-auto mt-8 max-w-3xl font-serif text-2xl font-light leading-snug text-midnight text-balance sm:text-4xl">
              “You will be met by a face you know, carried on roads we drive
              every week, and sent home with stories that sound like ours —
              because by then, they will be.”
            </blockquote>
            <p className="mt-6 text-[0.6875rem] font-medium uppercase tracking-[0.32em] text-midnight/50">
              The Karen Adventures promise
            </p>
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
