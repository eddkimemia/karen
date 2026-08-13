import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck2, Landmark, MessageCircle, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ensureCatalogSeeded } from "@/lib/self-seed";
import { Reveal } from "@/components/reveal";
import { PageHeader } from "@/components/page-header";
import { BookingForm } from "@/components/booking-form";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { depositPercent } from "@/lib/paystack";
import { whatsappLink, WHATSAPP_DISPLAY } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Book",
  description:
    "Reserve your East African journey in minutes. Choose a journey, tell us your dates, and secure it with a Paystack deposit — M-Pesa or card.",
};

const STEPS = [
  {
    icon: CalendarCheck2,
    title: "Reserve",
    copy: "Pick a journey, your travelers and preferred dates — or start completely custom.",
  },
  {
    icon: Landmark,
    title: "Secure with a deposit",
    copy: "A 20% deposit (M-Pesa or card via Paystack) holds your dates. No hidden fees.",
  },
  {
    icon: MessageCircle,
    title: "We refine it together",
    copy: "A planner confirms the itinerary, lodges and final balance within one working day.",
  },
];

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ adventure?: string; destination?: string }>;
}) {
  // Self-heal an empty catalog (fresh production DB) on first visit.
  await ensureCatalogSeeded();

  const [{ adventure, destination }, journeys, destinations] = await Promise.all([
    searchParams,
    prisma.adventure.findMany({
      orderBy: { startingPrice: "asc" },
      select: { slug: true, title: true, startingPrice: true },
    }),
    prisma.destination.findMany({
      orderBy: { name: "asc" },
      select: { slug: true, name: true, country: true },
    }),
  ]);

  const preselected =
    adventure && journeys.some((j) => j.slug === adventure)
      ? adventure
      : undefined;

  const preselectedDestination =
    destination && destinations.some((d) => d.slug === destination)
      ? destination
      : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Reserve Your Journey"
        title={
          <>
            Book Your
            <br />
            <em className="font-serif italic text-gold">East Africa.</em>
          </>
        }
        description="Choose a journey, tell us your dates, and secure your place with a small deposit. We handle everything after that."
        image="1500382017468-9049fed747ef"
        imageAlt="Golden light over the Kenyan savannah at sunset"
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
                  <em className="font-serif italic text-gold">the wild.</em>
                </h2>
                <div className="mt-8 space-y-7">
                  {STEPS.map(({ icon: Icon, title, copy }) => (
                    <div key={title} className="flex gap-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold/50 text-gold">
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </span>
                      <div>
                        <h3 className="font-serif text-lg font-medium text-midnight">
                          {title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-midnight/60">
                          {copy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 space-y-4 border-t border-midnight/10 pt-8">
                  <div className="flex items-start gap-3.5">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                    <div>
                      <p className="text-[0.5625rem] font-medium uppercase tracking-[0.28em] text-midnight/45">
                        Secure payment
                      </p>
                      <p className="mt-0.5 text-sm text-midnight/80">
                        Deposits are processed by Paystack — M-Pesa and all major
                        cards accepted.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <div>
                      <p className="text-[0.5625rem] font-medium uppercase tracking-[0.28em] text-midnight/45">
                        Need help booking?
                      </p>
                      <a
                        href={whatsappLink("Hello! I'd like help booking a journey.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 block text-sm text-midnight/80 transition-colors hover:text-gold"
                      >
                        Chat with us on WhatsApp · {WHATSAPP_DISPLAY}
                      </a>
                    </div>
                  </div>
                  <p className="pt-2 text-[0.6875rem] leading-relaxed text-midnight/50">
                    Prefer to explore first?{" "}
                    <Link
                      href="/contact"
                      className="font-medium text-gold underline underline-offset-2 transition-colors hover:text-gold-soft"
                    >
                      Ask a question instead
                    </Link>{" "}
                    — no payment needed.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Form column */}
            <Reveal delay={0.1} className="lg:col-span-3">
              <BookingForm
                journeys={journeys.map((j) => ({
                  value: j.slug,
                  label: j.title,
                  price: j.startingPrice,
                }))}
                destinations={destinations.map((d) => ({
                  value: d.slug,
                  label: d.name,
                  country: d.country || "Kenya",
                }))}
                preselectedJourney={preselected}
                preselectedDestination={preselectedDestination}
                depositPercent={depositPercent()}
              />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
