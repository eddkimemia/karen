"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-midnight px-6">
      <div className="max-w-xl text-center">
        <span className="eyebrow eyebrow--center">Something Went Wrong</span>
        <h1 className="mt-7 font-serif text-4xl font-medium leading-tight text-ivory sm:text-6xl">
          The trail went{" "}
          <em className="font-serif italic text-gold">cold.</em>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ivory/65">
          A technical hiccup interrupted the journey. Our team has been
          notified — please try again, or head back to the plains.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="bg-gold px-9 py-4 text-sm font-medium uppercase tracking-[0.18em] text-midnight transition-colors hover:bg-gold-soft"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-ivory/35 px-9 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ivory transition-colors hover:border-gold hover:text-gold"
          >
            Return Home
          </Link>
        </div>
        {error.digest && (
          <p className="mt-8 text-[0.625rem] uppercase tracking-[0.3em] text-ivory/30">
            Reference · {error.digest}
          </p>
        )}
      </div>
    </section>
  );
}
