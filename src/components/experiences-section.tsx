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
import { Reveal } from "@/components/reveal";
import { SectionHeading, Em } from "@/components/ui";

const ICONS: Record<string, LucideIcon> = {
  Compass,
  Users,
  Gem,
  Briefcase,
  CalendarDays,
  Wand2,
};

type Props = {
  experiences: {
    slug: string;
    title: string;
    description: string;
    icon: string;
  }[];
};

/** "Travel, Reimagined." — dark navy signature experiences. */
export function ExperiencesSection({ experiences }: Props) {
  return (
    <section className="relative overflow-hidden bg-royal-deep py-24 sm:py-32">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, rgba(201,162,39,0.14), transparent)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          tone="light"
          eyebrow="The Karen Way"
          title={
            <>
              Travel, <Em>Reimagined.</Em>
            </>
          }
          description="Six ways of experiencing East Africa — each one designed around you, your pace, and the story you want to tell."
        />

        <div className="mt-16 grid gap-px overflow-hidden border border-ivory/10 bg-ivory/10 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp, i) => {
            const Icon = ICONS[exp.icon] ?? Compass;
            return (
              <Reveal
                key={exp.slug}
                delay={0.05 * (i % 3)}
                className="group relative bg-royal-deep p-8 transition-colors duration-500 hover:bg-royal/80 sm:p-10"
              >
                <span className="pointer-events-none absolute right-7 top-7 font-serif text-5xl font-light text-ivory/[0.06] transition-colors duration-500 group-hover:text-gold/15">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex h-14 w-14 items-center justify-center border border-gold/40 text-gold transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-midnight">
                  <Icon className="h-6 w-6" strokeWidth={1.25} />
                </span>
                <h3 className="mt-7 font-serif text-2xl font-medium text-ivory transition-colors duration-300 group-hover:text-champagne">
                  {exp.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/60">
                  {exp.description}
                </p>
                <Link
                  href={`/experiences#${exp.slug}`}
                  className="mt-6 inline-flex translate-y-1 items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-gold opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  Discover this style
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
