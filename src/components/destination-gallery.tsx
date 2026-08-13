"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { img } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Photo = { id: string; alt: string };

/** Gallery grid with a full-screen lightbox — images added by the admin. */
export function DestinationGallery({
  photos,
  name,
}: {
  photos: Photo[];
  name: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((i) =>
        i === null ? null : (i + dir + photos.length) % photos.length,
      ),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  if (photos.length === 0) return null;

  const [hero, ...rest] = photos;
  const showGrid = rest.length > 0;

  return (
    <section className="bg-sand py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <p className="text-[0.625rem] font-medium uppercase tracking-[0.3em] text-gold">
          Gallery
        </p>
        <h2 className="mt-2 font-serif text-3xl font-medium text-midnight sm:text-4xl">
          {name} in Pictures
        </h2>

        <div
          className={cn(
            "mt-10 grid gap-3",
            showGrid && "lg:grid-cols-2",
          )}
        >
          <button
            type="button"
            onClick={() => setOpen(0)}
            className="group relative aspect-[16/9] overflow-hidden border border-midnight/10 focus:outline-none"
            aria-label={`Open photo of ${hero.alt}`}
          >
            <Image
              src={img(hero.id, 1600, 75)}
              alt={hero.alt}
              fill
              priority
              sizes="(min-width: 1024px) 70vw, 100vw"
              className="object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            />
            <span className="absolute inset-0 bg-midnight/0 transition-colors duration-500 group-hover:bg-midnight/15" />
          </button>

          {showGrid && (
            <div className="grid grid-cols-2 gap-3">
              {rest.map((p, i) => (
                <button
                  key={`${p.id}-${i}`}
                  type="button"
                  onClick={() => setOpen(i + 1)}
                  className="group relative aspect-[16/10] overflow-hidden border border-midnight/10 focus:outline-none"
                  aria-label={`Open photo of ${p.alt}`}
                >
                  <Image
                    src={img(p.id, 800, 70)}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, 50vw"
                    className="object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                  />
                  <span className="absolute inset-0 bg-midnight/0 transition-colors duration-500 group-hover:bg-midnight/15" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {open !== null && photos[open] && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-midnight/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center border border-ivory/25 text-ivory/80 transition-colors hover:border-gold hover:text-gold"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center border border-ivory/25 text-ivory/80 transition-colors hover:border-gold hover:text-gold sm:left-8"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next photo"
            className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center border border-ivory/25 text-ivory/80 transition-colors hover:border-gold hover:text-gold sm:right-8"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <figure
            className="relative max-h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src={img(photos[open].id, 2000, 80)}
                alt={photos[open].alt}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-4 text-center text-sm text-ivory/60">
              {photos[open].alt}
              <span className="ml-3 text-ivory/35">
                {open + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}