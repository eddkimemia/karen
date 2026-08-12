import Image from "next/image";
import { cn, img } from "@/lib/utils";
import { Reveal } from "@/components/reveal";
import { SectionHeading, Em } from "@/components/ui";

type Props = {
  items: {
    image: string;
    alt: string;
    category: string;
    width: number;
    height: number;
  }[];
};

/** "See Kenya Differently." — editorial masonry gallery on midnight. */
export function Gallery({ items }: Props) {
  return (
    <section className="relative overflow-hidden bg-royal-deep py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          tone="light"
          eyebrow="The Gallery"
          title={
            <>
              See Kenya <Em>Differently.</Em>
            </>
          }
          description="Frames from the road — wildlife, mountains, campfires, coastlines and the people who make it all feel like home."
        />

        <div className="mt-14 grid auto-flow-dense grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {items.map((g, i) => {
            const wide = g.width >= g.height;
            return (
              <Reveal
                key={i}
                delay={(i % 4) * 0.06}
                className={cn(
                  "group relative overflow-hidden bg-royal",
                  wide ? "col-span-2 aspect-[3/2]" : "col-span-1 aspect-[2/3]",
                )}
              >
                <Image
                  src={img(g.image, wide ? 1200 : 800, 75)}
                  alt={g.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 30vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/85 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="img-frame absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-5">
                  <p className="text-[0.5625rem] font-medium uppercase tracking-[0.3em] text-gold">
                    {g.category}
                  </p>
                  <p className="mt-1 font-serif text-base leading-snug text-ivory sm:text-lg">
                    {g.alt}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
