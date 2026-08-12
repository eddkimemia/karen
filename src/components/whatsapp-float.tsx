"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { whatsappLink, WHATSAPP_DISPLAY } from "@/lib/site";

/**
 * Floating WhatsApp button — fixed bottom-right on public pages.
 * Links out to wa.me with a pre-filled greeting.
 */
export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Never show over the admin dashboard
  if (pathname.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat with Karen Adventures on WhatsApp (${WHATSAPP_DISPLAY})`}
          title={`Chat on WhatsApp · ${WHATSAPP_DISPLAY}`}
          initial={{ opacity: 0, scale: 0.6, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="group fixed bottom-24 right-5 z-50 flex items-center gap-3 md:bottom-7 md:right-7"
        >
          {/* Label tooltip on hover */}
          <span className="pointer-events-none hidden translate-x-2 rounded-sm border border-gold/30 bg-midnight/95 px-4 py-2 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ivory opacity-0 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
            Chat with us
            <span className="mt-0.5 block text-[0.625rem] normal-case tracking-normal text-champagne/70">
              {WHATSAPP_DISPLAY}
            </span>
          </span>

          {/* Button */}
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.65)] transition-transform duration-300 group-hover:scale-110">
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping [animation-duration:2.4s]" />
            <WhatsAppIcon className="relative h-7 w-7" />
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
