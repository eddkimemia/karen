import type { Metadata } from "next";
import { MapPin, Mail, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/reveal";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
  XIcon,
} from "@/components/social-icons";
import {
  whatsappLink,
  WHATSAPP_DISPLAY,
  CONTACT_EMAIL,
} from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us where you want to go. A Karen Adventures planner will design the experience around you — no payment until the plan is yours.",
};

const STEPS = [
  {
    n: "01",
    title: "Tell us the dream",
    copy: "A destination, a feeling, a date — or just 'surprise us'. Every conversation starts somewhere simple.",
  },
  {
    n: "02",
    title: "We design it together",
    copy: "A planner drafts your journey by hand — routes, lodges, guides, timing — and we refine it until it feels like yours.",
  },
  {
    n: "03",
    title: "You travel, we handle the rest",
    copy: "Transfers, bookings, permits, and the small details you didn't know existed. You arrive with nothing but anticipation.",
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string; adventure?: string }>;
}) {
  const [{ destination, adventure }, destinations, journeys] = await Promise.all([
    searchParams,
    prisma.destination.findMany({
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
    prisma.adventure.findMany({
      orderBy: { startingPrice: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  const preselectedJourney = adventure
    ? journeys.find((j) => j.slug === adventure)?.title
    : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Begin The Journey"
        title={
          <>
            Your Next Adventure
            <br />
            <em className="font-serif italic text-gold">Starts Here.</em>
          </>
        }
        description="Tell us where you want to go. We'll help you create the experience — from a first phone call to the final farewell."
        image="1507525428034-b723cf961d3e"
        imageAlt="White sand and palm trees on the Kenyan coast"
        align="left"
        compact
      />

      <section className="bg-ivory py-16 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Info column */}
            <div className="lg:col-span-2">
              <Reveal>
                <span className="eyebrow">How It Works</span>
                <h2 className="mt-5 font-serif text-3xl font-medium text-midnight sm:text-4xl">
                  Three steps to{" "}
                  <em className="font-serif italic text-gold">Kenya.</em>
                </h2>
                <div className="mt-8 space-y-7">
                  {STEPS.map((s) => (
                    <div key={s.n} className="flex gap-5">
                      <span className="font-serif text-2xl font-light text-gold">
                        {s.n}
                      </span>
                      <div>
                        <h3 className="font-serif text-lg font-medium text-midnight">
                          {s.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-midnight/60">
                          {s.copy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 space-y-4 border-t border-midnight/10 pt-8">
                  {[
                    { icon: MapPin, label: "Visit", value: "Karen, Nairobi, Kenya", href: undefined },
                    {
                      icon: WhatsAppIcon,
                      label: "Call / WhatsApp",
                      value: WHATSAPP_DISPLAY,
                      href: whatsappLink(),
                    },
                    {
                      icon: Mail,
                      label: "Email",
                      value: CONTACT_EMAIL,
                      href: `mailto:${CONTACT_EMAIL}`,
                    },
                    { icon: Clock, label: "Hours", value: "Mon – Sat · 8:00 – 18:00 EAT", href: undefined },
                  ].map(({ icon: Icon, label, value, href }) => {
                    const inner = (
                      <>
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                        <div>
                          <p className="text-[0.5625rem] font-medium uppercase tracking-[0.28em] text-midnight/45">
                            {label}
                          </p>
                          <p className="mt-0.5 text-sm text-midnight/80">{value}</p>
                        </div>
                      </>
                    );
                    return href ? (
                      <a
                        key={label}
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-start gap-3.5 transition-colors hover:text-gold"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div key={label} className="flex items-start gap-3.5">
                        {inner}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex gap-3">
                  {[
                    { label: "Instagram", Icon: InstagramIcon, href: undefined },
                    { label: "Facebook", Icon: FacebookIcon, href: undefined },
                    { label: "YouTube", Icon: YoutubeIcon, href: undefined },
                    { label: "X", Icon: XIcon, href: undefined },
                    { label: "WhatsApp", Icon: WhatsAppIcon, href: whatsappLink() },
                  ].map(({ label, Icon, href }) => (
                    <a
                      key={label}
                      href={href ?? "#"}
                      target={href?.startsWith("http") ? "_blank" : undefined}
                      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center border border-midnight/15 text-midnight/60 transition-all hover:border-gold hover:text-gold hover:bg-gold hover:text-midnight"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Form column */}
            <Reveal delay={0.1} className="lg:col-span-3">
              <ContactForm
                destinations={destinations.map((d) => ({ value: d.name, label: d.name }))}
                journeys={journeys.map((j) => ({ value: j.slug, label: j.title }))}
                preselectedDestination={
                  destination
                    ? destinations.find((d) => d.slug === destination)?.name
                    : undefined
                }
                preselectedJourney={preselectedJourney}
              />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
