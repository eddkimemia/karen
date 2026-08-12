import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { ButtonLink } from "@/components/ui";
import { img } from "@/lib/utils";

/** Dramatic navy-and-gold closing CTA. */
export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-royal-deep">
      <div className="absolute inset-0">
        <Image
          src={img("1534177616072-ef7dc120449d", 2400, 70)}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-royal-deep via-royal-deep/70 to-royal-deep" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 60% at 50% 100%, rgba(201,162,39,0.12), transparent)",
          }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-5 py-28 text-center sm:px-8 sm:py-36">
        <Reveal>
          <span className="eyebrow eyebrow--center">Begin The Journey</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-7 font-serif text-4xl font-medium leading-[1.05] text-ivory text-balance sm:text-6xl lg:text-7xl">
            Your Next Adventure
            <span className="block font-serif italic text-gold">
              Starts Here.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-ivory/70 sm:text-lg">
            Tell us where you want to go. We&rsquo;ll help you create the
            experience — from a first phone call to the final farewell.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-11 flex flex-col items-center gap-4 sm:flex-row">
            <ButtonLink href="/booking" size="lg">
              Reserve Your Journey →
            </ButtonLink>
            <ButtonLink href="/adventures" variant="ghost" size="lg">
              Browse Journeys
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
