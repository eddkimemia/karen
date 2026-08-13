"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { img } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "16%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-6%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-midnight"
    >
      {/* Cinematic backdrop with slow ken-burns + scroll parallax */}
      <motion.div style={{ y }} className="absolute inset-0">
        <div className="absolute inset-0 animate-kenburns">
          <Image
            src={img("1516426122078-c23e76319801", 2400, 75)}
            alt="Elephants crossing the plains of Amboseli beneath Kilimanjaro at dusk"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </motion.div>

      {/* Graded overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/85 via-midnight/25 to-midnight" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 60% at 50% 42%, transparent 40%, rgba(7,26,51,0.55) 100%)",
        }}
      />
      <div className="grain absolute inset-0" />

      {/* Gold frame */}
      <div className="pointer-events-none absolute inset-4 z-20 hidden border border-gold/15 lg:inset-6 lg:block" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-24 pb-28 text-center sm:px-8"
      >
        <motion.span
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="eyebrow eyebrow--center"
        >
          Nairobi · East Africa — Private Adventures
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, delay: 0.35, ease }}
          className="mt-7 font-serif text-[2.9rem] leading-[1.02] font-medium text-ivory text-balance sm:text-7xl lg:text-[5.6rem]"
        >
          Discover East Africa.
          <span className="block font-serif italic text-gold">
            Beyond the Ordinary.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.6, ease }}
          className="mt-7 max-w-xl text-base leading-relaxed text-ivory/80 sm:text-lg"
        >
          Curated adventures, unforgettable escapes, and extraordinary
          experiences across East Africa.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.8, ease }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href="#journeys"
            className="group flex items-center gap-2.5 bg-gold px-9 py-4 text-sm font-medium uppercase tracking-[0.18em] text-midnight transition-colors duration-300 hover:bg-gold-soft"
          >
            Explore Adventures
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="/booking"
            className="group flex items-center gap-2.5 border border-ivory/40 px-9 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ivory transition-all duration-300 hover:border-gold hover:text-gold"
          >
            Reserve Your Journey
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[0.5625rem] font-medium uppercase tracking-[0.5em] text-champagne/70">
          Scroll
        </span>
        <span className="relative h-12 w-px overflow-hidden bg-ivory/20">
          <span className="absolute inset-x-0 top-0 h-4 animate-scroll-cue bg-gold" />
        </span>
      </motion.div>
    </section>
  );
}
