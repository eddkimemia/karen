"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
} from "@/components/social-icons";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/adventures", label: "Adventures" },
  { href: "/destinations", label: "Destinations" },
  { href: "/experiences", label: "Experiences" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const LOGO = {
  src: "/images/logo.png",
  width: 612,
  height: 408,
  alt: "Karen Adventures",
};

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const closeMenu = useCallback(() => setOpen(false), []);

  // Focus the close button and support Escape while the menu is open
  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeMobileMenu = () => {
    setOpen(false);
    document.getElementById("menu-open")?.focus();
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-gold/15 bg-midnight/90 py-3 backdrop-blur-md"
            : "border-b border-transparent bg-transparent py-5",
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Wordmark */}
          <Link
            href="/"
            className="group flex items-center"
            aria-label="Karen Adventures — home"
          >
            <Image
              {...LOGO}
              alt={LOGO.alt}
              priority
              className="h-16 w-auto object-contain transition-opacity duration-300 group-hover:opacity-85 sm:h-20"
            />
          </Link>

          {/* Desktop links */}
          <nav
            className="hidden items-center gap-4 lg:flex xl:gap-6"
            aria-label="Primary"
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative py-2 text-[0.75rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300",
                  isActive(link.href)
                    ? "text-champagne"
                    : "text-ivory/75 hover:text-ivory",
                )}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isActive(link.href) ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/booking"
              className="group hidden items-center gap-2 border border-gold/60 px-6 py-2.5 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-champagne transition-all duration-300 hover:border-gold hover:bg-gold hover:text-midnight xl:inline-flex"
            >
              Reserve Your Journey
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <button
              id="menu-open"
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex h-11 w-11 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:border-gold hover:text-gold lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] flex flex-col bg-midnight lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex items-center justify-between px-5 py-5">
              <span className="flex items-center">
                <Image
                  {...LOGO}
                  className="h-14 w-auto object-contain"
                  alt={LOGO.alt}
                />
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center border border-ivory/25 text-ivory hover:border-gold hover:text-gold"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav
              id="mobile-menu"
              className="flex flex-1 flex-col justify-center gap-1 px-8"
              aria-label="Mobile"
            >
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "group flex items-center justify-between border-b border-ivory/10 py-5 font-serif text-3xl font-light transition-colors",
                      isActive(link.href)
                        ? "text-gold"
                        : "text-ivory hover:text-champagne",
                    )}
                  >
                    {link.label}
                    <ArrowRight className="h-5 w-5 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex flex-col gap-6 px-8 pb-10"
            >
              <Link
                href="/booking"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 bg-gold px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-midnight"
              >
                Reserve Your Journey <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex items-center justify-center gap-6 text-ivory/60">
                {[
                  {
                    label: "Instagram",
                    href: "https://instagram.com/karenadventures",
                    Icon: InstagramIcon,
                  },
                  {
                    label: "Facebook",
                    href: "https://facebook.com/karenadventures",
                    Icon: FacebookIcon,
                  },
                  {
                    label: "YouTube",
                    href: "https://youtube.com/@karenadventures",
                    Icon: YoutubeIcon,
                  },
                ].map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="transition-colors hover:text-gold"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
                <span className="text-[0.625rem] uppercase tracking-[0.35em] text-gold">
                  @karenadventures
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
