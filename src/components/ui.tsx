import Link from "next/link";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Buttons                                                            */
/* ------------------------------------------------------------------ */
type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "gold" | "ghost" | "dark" | "outline-ivory";
  size?: "md" | "lg";
  className?: string;
  ariaLabel?: string;
};

const variants: Record<NonNullable<ButtonLinkProps["variant"]>, string> = {
  gold: "bg-gold text-midnight hover:bg-gold-soft",
  ghost:
    "border border-gold/60 text-champagne hover:border-gold hover:bg-gold hover:text-midnight",
  dark: "bg-midnight text-ivory hover:bg-royal",
  "outline-ivory":
    "border border-ivory/35 text-ivory hover:border-gold hover:text-gold",
};

const sizes: Record<NonNullable<ButtonLinkProps["size"]>, string> = {
  md: "px-7 py-3 text-[0.8125rem]",
  lg: "px-9 py-4 text-sm",
};

export function ButtonLink({
  href,
  children,
  variant = "gold",
  size = "md",
  className,
  ariaLabel,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "group inline-flex items-center justify-center gap-2.5 font-medium uppercase tracking-[0.18em] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Section heading                                                    */
/* ------------------------------------------------------------------ */
type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light"; // dark = on light bg, light = on dark bg
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto flex flex-col items-center text-center",
        className,
      )}
    >
      <span
        className={cn(
          "eyebrow",
          align === "center" && "eyebrow--center",
        )}
      >
        {eyebrow}
      </span>
      <h2
        className={cn(
          "mt-5 font-serif text-4xl leading-[1.08] font-medium text-balance sm:text-5xl lg:text-[3.4rem]",
          tone === "dark" ? "text-midnight" : "text-ivory",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-6 max-w-xl text-[0.9375rem] leading-relaxed sm:text-base",
            tone === "dark" ? "text-midnight/70" : "text-ivory/65",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/** Serif italic gold emphasis inside headings. */
export function Em({ children }: { children: React.ReactNode }) {
  return <em className="font-serif italic text-gold">{children}</em>;
}
