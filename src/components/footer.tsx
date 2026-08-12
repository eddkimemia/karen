import Link from "next/link";
import { cache } from "react";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
  XIcon,
} from "@/components/social-icons";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { prisma } from "@/lib/prisma";
import { NewsletterForm } from "@/components/newsletter-form";
import { whatsappLink, WHATSAPP_DISPLAY, CONTACT_EMAIL } from "@/lib/site";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/adventures", label: "Adventures" },
  { href: "/destinations", label: "Destinations" },
  { href: "/experiences", label: "Experiences" },
  { href: "/booking", label: "Book" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const SOCIALS = [
  { label: "Instagram", icon: InstagramIcon, href: "#" },
  { label: "Facebook", icon: FacebookIcon, href: "#" },
  { label: "YouTube", icon: YoutubeIcon, href: "#" },
  { label: "X", icon: XIcon, href: "#" },
  { label: "WhatsApp", icon: WhatsAppIcon, href: whatsappLink() },
];

const getJourneys = cache(async () => {
  try {
    return await prisma.adventure.findMany({
      where: { featured: true },
      orderBy: { startingPrice: "asc" },
      take: 4,
      select: { slug: true, title: true },
    });
  } catch {
    return [];
  }
});

export async function Footer() {
  const journeys = await getJourneys();

  return (
    <footer className="relative border-t border-gold/15 bg-royal-deep">
      {/* Gold hairline */}
      <div className="hairline absolute inset-x-0 top-0" />

      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-16 sm:px-8 sm:pt-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center border border-gold/60 font-serif text-2xl font-medium text-gold">
                K
              </span>
              <span className="font-serif text-2xl font-medium text-ivory">
                Karen Adventures<span className="text-gold">.</span>
              </span>
            </div>
            <p className="mt-4 font-serif text-lg italic text-champagne/90">
              Discover Kenya. Beyond the Ordinary.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/55">
              A Nairobi-based house of curated travel — private safaris,
              mountain expeditions, coastal escapes and experiences designed by
              people who know the land.
            </p>
            <div className="mt-7 flex gap-3">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center border border-ivory/15 text-ivory/70 transition-all duration-300 hover:border-gold hover:text-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-2">
            <h3 className="text-[0.6875rem] font-medium uppercase tracking-[0.35em] text-gold">
              Explore
            </h3>
            <ul className="mt-6 space-y-3.5">
              {NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-ivory/65 transition-colors hover:text-champagne"
                  >
                    <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Journeys */}
          <div className="md:col-span-3">
            <h3 className="text-[0.6875rem] font-medium uppercase tracking-[0.35em] text-gold">
              Signature Journeys
            </h3>
            <ul className="mt-6 space-y-3.5">
              {journeys.map((j) => (
                <li key={j.slug}>
                  <Link
                    href={`/adventures/${j.slug}`}
                    className="group inline-flex items-center gap-2 text-sm text-ivory/65 transition-colors hover:text-champagne"
                  >
                    <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-4" />
                    {j.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/adventures"
                  className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-gold transition-colors hover:text-gold-soft"
                >
                  All journeys <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact + newsletter */}
          <div className="md:col-span-3">
            <h3 className="text-[0.6875rem] font-medium uppercase tracking-[0.35em] text-gold">
              Contact
            </h3>
            <ul className="mt-6 space-y-3.5 text-sm text-ivory/65">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" />
                Karen, Nairobi, Kenya
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition-colors hover:text-champagne"
                >
                  <Phone className="h-4 w-4 shrink-0 text-gold/80" />
                  {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-3 transition-colors hover:text-champagne"
                >
                  <Mail className="h-4 w-4 shrink-0 text-gold/80" />
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
            <h3 className="mt-8 text-[0.6875rem] font-medium uppercase tracking-[0.35em] text-gold">
              The Dispatches
            </h3>
            <p className="mb-4 mt-2 text-xs leading-relaxed text-ivory/50">
              Occasional letters from the road — no spam, ever.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-ivory/10 pt-7">
          <div className="flex flex-col items-center justify-between gap-4 text-xs tracking-wide text-ivory/45 sm:flex-row">
            <p>© {new Date().getFullYear()} Karen Adventures. All rights reserved.</p>
            <p className="font-medium uppercase tracking-[0.3em] text-gold/70">
              karenadventures.com
            </p>
            <div className="flex gap-6">
              <a href="#" className="transition-colors hover:text-champagne">
                Privacy
              </a>
              <a href="#" className="transition-colors hover:text-champagne">
                Terms
              </a>
              <a href="#" className="transition-colors hover:text-champagne">
                Careers
              </a>
              <Link
                href="/admin"
                className="text-ivory/30 transition-colors hover:text-champagne"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
