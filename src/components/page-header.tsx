import Image from "next/image";
import { cn, img } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  image?: string;
  imageAlt?: string;
  align?: "left" | "center";
  compact?: boolean;
};

/** Cinematic header band for inner pages. */
export function PageHeader({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  align = "left",
  compact = false,
}: Props) {
  return (
    <section
      className={cn(
        "relative flex items-center overflow-hidden bg-midnight",
        compact ? "min-h-[46vh] py-28" : "min-h-[56vh] py-32 sm:min-h-[60vh]",
      )}
    >
      {image && (
        <>
          <Image
            src={img(image, 2400, 70)}
            alt={imageAlt ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/80 via-midnight/55 to-midnight" />
          <div className="grain absolute inset-0" />
        </>
      )}

      <div
        className={cn(
          "relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8",
          align === "center" && "flex flex-col items-center text-center",
        )}
      >
        <Reveal>
          <span className={cn("eyebrow", align === "center" && "eyebrow--center")}>
            {eyebrow}
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-6 max-w-3xl font-serif text-5xl font-medium leading-[1.02] text-ivory text-balance sm:text-6xl lg:text-7xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.2}>
            <p
              className={cn(
                "mt-6 max-w-2xl text-base leading-relaxed text-ivory/70 sm:text-lg",
                align === "center" && "mx-auto",
              )}
            >
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
