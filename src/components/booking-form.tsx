"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Lock,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn, formatPrice } from "@/lib/utils";
import { useCurrency, PricePair } from "@/components/currency";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { whatsappLink } from "@/lib/site";

type Journey = { value: string; label: string; price: number };
type Destination = { value: string; label: string; country: string };

const DESTINATION_LIMIT = 8;

const COUNTRY_ORDER = [
  "Kenya",
  "Tanzania",
  "Uganda",
  "Rwanda",
  "Burundi",
  "Ethiopia",
  "South Sudan",
  "DRC",
  "Djibouti",
  "Somalia",
  "Eritrea",
];

type Props = {
  journeys: Journey[];
  destinations: Destination[];
  preselectedJourney?: string;
  preselectedDestination?: string;
  depositPercent: number;
};

const inputClass =
  "w-full border border-midnight/15 bg-ivory px-4 py-3 text-sm text-midnight placeholder:text-midnight/35 transition-colors focus:border-gold focus:outline-none";

export function BookingForm({
  journeys,
  destinations,
  preselectedJourney,
  preselectedDestination,
  depositPercent,
}: Props) {
  const { currency, usdToKes } = useCurrency();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    reference: string;
    estimateUsd: number;
    paymentNote?: string;
  } | null>(null);
  const [journey, setJourney] = useState(preselectedJourney ?? "");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const travelers = Math.max(1, adults + children);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    () =>
      preselectedDestination
        ? destinations
            .filter((d) => d.value === preselectedDestination)
            .map((d) => d.label)
        : [],
  );
  const [destOpen, setDestOpen] = useState(false);
  const [destQuery, setDestQuery] = useState("");
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!destOpen) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setDestOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDestOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [destOpen]);

  const grouped = useMemo(() => {
    const q = destQuery.trim().toLowerCase();
    const list = destinations.filter(
      (d) =>
        !q ||
        d.label.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q),
    );
    const groups = new Map<string, Destination[]>();
    for (const d of list) {
      const country = d.country || "Other";
      if (!groups.has(country)) groups.set(country, []);
      groups.get(country)!.push(d);
    }
    return [...groups.entries()].sort((a, b) => {
      const ia = COUNTRY_ORDER.indexOf(a[0]);
      const ib = COUNTRY_ORDER.indexOf(b[0]);
      return (ia === -1 ? COUNTRY_ORDER.length : ia) -
        (ib === -1 ? COUNTRY_ORDER.length : ib);
    });
  }, [destinations, destQuery]);

  const ACCOMMODATION_OPTIONS = [
    "Safari lodge",
    "Luxury tented camp",
    "Eco-camp / mobile camp",
    "Beach villa / resort",
    "Boutique hotel",
    "Mountain lodge / trekking hut",
  ];
  const TRANSPORT_OPTIONS = [
    "Private 4×4 Land Cruiser",
    "Safari van (pop-up roof)",
    "Private vehicle + light aircraft",
    "Dhow & boat transfers",
    "Expedition 4WD",
  ];

  const toggleDestination = (label: string) => {
    setSelectedDestinations((prev) => {
      if (prev.includes(label)) return prev.filter((d) => d !== label);
      if (prev.length >= DESTINATION_LIMIT) return prev;
      return [...prev, label];
    });
  };

  const selected = useMemo(
    () => journeys.find((j) => j.value === journey) ?? null,
    [journeys, journey],
  );

  const estimateUsd = selected ? selected.price * travelers : 0;
  const depositUsd = Math.round(estimateUsd * (depositPercent / 100));

  const fmtJourneyPrice = (usd: number) =>
    currency === "KES"
      ? `KES ${Math.round(usd * usdToKes).toLocaleString("en-KE")}`
      : formatPrice(usd);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    const fd = new FormData(e.currentTarget);

    if (!selected && selectedDestinations.length === 0) {
      setFormError(
        "Pick a journey or choose at least one destination — or select 'Custom journey' and we'll design it together.",
      );
      return;
    }
    // Record selected locations (one per line) for the API.
    fd.set("destinations", selectedDestinations.join("\n"));

    setStatus("loading");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

      if (data.payment?.enabled) {
        // Off to Paystack's hosted checkout.
        window.location.assign(data.payment.authorizationUrl);
        return;
      }
      setResult({
        reference: data.booking.reference,
        estimateUsd: data.booking.priceEstimate,
        paymentNote: data.payment?.note,
      });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setFormError(
        err instanceof Error
          ? err.message
          : "We couldn't save your booking right now — please try again.",
      );
    }
  }

  if (status === "done" && result) {
    return (
      <div className="flex flex-col items-center border border-gold/40 bg-ivory px-8 py-16 text-center">
        <CheckCircle2 className="h-12 w-12 text-gold" strokeWidth={1.25} />
        <h2 className="mt-6 font-serif text-3xl font-medium text-midnight">
          Your reservation is secured.
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-midnight/65">
          Booking reference{" "}
          <span className="font-semibold text-midnight">
            {result.reference}
          </span>{" "}
          has been received. A Karen Adventures planner will be in touch within
          one working day to refine the details.
        </p>
        {result.paymentNote && (
          <p className="mt-4 max-w-md border border-gold/40 bg-sand/60 px-5 py-3 text-sm text-midnight/75">
            {result.paymentNote}
          </p>
        )}
        <p className="mt-6 font-serif text-lg italic text-gold">
          Karibu — welcome.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border border-midnight/10 bg-white p-7 shadow-[0_28px_70px_-32px_rgba(7,26,51,0.4)] sm:p-10"
      noValidate
    >
      {/* Journey */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="journey" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
            Journey of interest *
          </label>
          <select
            id="journey"
            name="adventureSlug"
            value={journey}
            onChange={(e) => setJourney(e.target.value)}
            className={cn(inputClass, "appearance-none")}
          >
            <option value="">Custom journey — design it with us</option>
            {journeys.map((j) => (
              <option key={j.value} value={j.value}>
                {j.label} · {fmtJourneyPrice(j.price)} / person
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="destinations-trigger"
            className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55"
          >
            Destinations{" "}
            <span className="font-sans text-[0.625rem] normal-case tracking-normal text-midnight/40">
              (choose one or more)
            </span>
          </label>

          <div ref={destRef} className="relative">
            <button
              id="destinations-trigger"
              type="button"
              onClick={() => {
                setDestOpen((o) => !o);
                setDestQuery("");
              }}
              aria-expanded={destOpen}
              aria-haspopup="listbox"
              className={cn(
                inputClass,
                "flex items-center justify-between gap-3 text-left",
              )}
            >
              <span
                className={cn(
                  "truncate",
                  selectedDestinations.length === 0 && "text-midnight/35",
                )}
              >
                {selectedDestinations.length === 0
                  ? "Select your destinations"
                  : `${selectedDestinations.length} ${
                      selectedDestinations.length === 1
                        ? "destination"
                        : "destinations"
                    } selected${
                      selectedDestinations.length >= DESTINATION_LIMIT
                        ? " (max reached)"
                        : ""
                    }`}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-gold transition-transform duration-300",
                  destOpen && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence>
              {destOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  role="listbox"
                  aria-label="Destinations"
                  className="absolute left-0 right-0 top-full z-30 mt-2 border border-gold/40 bg-white shadow-[0_30px_60px_-20px_rgba(7,26,51,0.35)]"
                >
                  <div className="relative border-b border-midnight/10">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight/35" />
                    <input
                      type="search"
                      value={destQuery}
                      onChange={(e) => setDestQuery(e.target.value)}
                      placeholder="Search by destination or country…"
                      className="w-full bg-transparent py-3.5 pl-11 pr-4 text-sm text-midnight placeholder:text-midnight/35 focus:outline-none"
                    />
                  </div>

                  <div className="max-h-72 overflow-y-auto overscroll-contain">
                    {grouped.length === 0 ? (
                      <p className="px-5 py-6 text-center text-sm text-midnight/45">
                        No destinations match — we can design around your dream
                        anyway.
                      </p>
                    ) : (
                      grouped.map(([country, items]) => (
                        <div key={country}>
                          <p className="sticky top-0 z-10 border-y border-midnight/5 bg-sand/95 px-5 py-2 text-[0.5625rem] font-medium uppercase tracking-[0.28em] text-midnight/50 backdrop-blur-sm">
                            {country}
                            <span className="ml-2 normal-case tracking-normal text-midnight/35">
                              {items.length}
                            </span>
                          </p>
                          <ul>
                            {items.map((d) => {
                              const active = selectedDestinations.includes(d.label);
                              const disabled =
                                !active &&
                                selectedDestinations.length >= DESTINATION_LIMIT;
                              return (
                                <li key={d.value}>
                                  <button
                                    type="button"
                                    role="option"
                                    aria-selected={active}
                                    disabled={disabled}
                                    onClick={() => toggleDestination(d.label)}
                                    className={cn(
                                      "flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm transition-colors",
                                      active
                                        ? "bg-gold/10 text-midnight"
                                        : "text-midnight/70 hover:bg-sand/70",
                                      disabled && "cursor-not-allowed opacity-40",
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-colors",
                                        active
                                          ? "border-gold bg-gold text-midnight"
                                          : "border-midnight/25",
                                      )}
                                    >
                                      {active && <Check className="h-3 w-3" />}
                                    </span>
                                    <span className="flex-1 truncate">
                                      {d.label}
                                    </span>
                                    {active && (
                                      <span className="text-[0.625rem] uppercase tracking-[0.18em] text-gold">
                                        Selected
                                      </span>
                                    )}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-midnight/10 bg-ivory px-5 py-3">
                    <p className="text-[0.6875rem] text-midnight/50">
                      Up to {DESTINATION_LIMIT} destinations · or leave empty
                      for a surprise
                    </p>
                    <button
                      type="button"
                      onClick={() => setDestOpen(false)}
                      className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-midnight/70 transition-colors hover:text-gold"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {selectedDestinations.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedDestinations.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 border border-gold/50 bg-gold/10 px-3 py-1.5 text-xs font-medium text-midnight"
                >
                  {label}
                  <button
                    type="button"
                    aria-label={`Remove ${label}`}
                    onClick={() => toggleDestination(label)}
                    className="text-midnight/50 transition-colors hover:text-midnight"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="mt-2 text-[0.6875rem] text-midnight/45">
            {selectedDestinations.length === 0
              ? "Anywhere in East Africa — tell us your dream and we'll plan around it."
              : "Choose as many as you like — each one becomes a chapter of your journey."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="adults" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
              Adults *
            </label>
            <input
              id="adults"
              name="adults"
              type="number"
              min={1}
              max={40}
              value={adults}
              onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="children" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
              Children
            </label>
            <input
              id="children"
              name="children"
              type="number"
              min={0}
              max={20}
              value={children}
              onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))}
              className={inputClass}
            />
            <p className="mt-1.5 text-[0.625rem] text-midnight/40">
              {travelers} traveler{travelers === 1 ? "" : "s"} total
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="startDate" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
              Start date
            </label>
            <input id="startDate" name="startDate" type="date" className={inputClass} />
          </div>
          <div>
            <label htmlFor="endDate" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
              End date
            </label>
            <input id="endDate" name="endDate" type="date" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="pickupLocation" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
              Pick-up location
            </label>
            <input
              id="pickupLocation"
              name="pickupLocation"
              maxLength={160}
              placeholder="e.g. Jomo Kenyatta Intl. Airport"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="pickupTime" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
              Pick-up time
            </label>
            <input id="pickupTime" name="pickupTime" type="time" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="dropoffLocation" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
              Drop-off location
            </label>
            <input
              id="dropoffLocation"
              name="dropoffLocation"
              maxLength={160}
              placeholder="e.g. Wilson Airport, Nairobi"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="dropoffTime" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
              Drop-off time
            </label>
            <input id="dropoffTime" name="dropoffTime" type="time" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="accommodation" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
              Accommodation style
            </label>
            <select id="accommodation" name="accommodation" defaultValue="" className={cn(inputClass, "appearance-none")}>
              <option value="">Let us choose — surprise me</option>
              {ACCOMMODATION_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="transport" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
              Transport preference
            </label>
            <select id="transport" name="transport" defaultValue="" className={cn(inputClass, "appearance-none")}>
              <option value="">Let us plan it</option>
              {TRANSPORT_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="name" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
            Full name *
          </label>
          <input id="name" name="name" required minLength={2} maxLength={120} placeholder="Your name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
            Email *
          </label>
          <input id="email" name="email" type="email" required maxLength={160} placeholder="you@email.com" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="phone" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
            Phone / WhatsApp
          </label>
          <input id="phone" name="phone" maxLength={30} placeholder="+254 …" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="notes" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
            Special requests
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            maxLength={2000}
            placeholder="Dietary needs, accessibility, occasions, travel style…"
            className={cn(inputClass, "resize-y")}
          />
        </div>
      </div>

      {/* Estimate */}
      <div className="mt-7 border border-gold/40 bg-sand/60 px-5 py-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.625rem] font-medium uppercase tracking-[0.28em] text-midnight/50">
              Estimated journey total
            </p>
            <p className="mt-1 font-serif text-3xl font-medium text-midnight">
              {estimateUsd > 0 ? (
                <PricePair
                  usd={estimateUsd}
                  secondaryClassName="text-sm font-sans text-midnight/50"
                />
              ) : (
                "To be designed"
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[0.625rem] font-medium uppercase tracking-[0.28em] text-midnight/50">
              Deposit due now · {depositPercent}%
            </p>
            <p className="mt-1 text-sm font-medium text-midnight">
              {depositUsd > 0 ? (
                <PricePair
                  usd={depositUsd}
                  secondaryClassName="text-midnight/55"
                />
              ) : (
                "Confirmed after design"
              )}
            </p>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-2 border-t border-midnight/10 pt-3 text-[0.6875rem] leading-relaxed text-midnight/55">
          <Lock className="h-3.5 w-3.5 shrink-0 text-gold" />
          Secure deposit via Paystack (M-Pesa or card). Balance is settled after
          your itinerary is confirmed — the estimate is indicative, not final.
        </p>
      </div>

      {formError && (
        <p className="mt-5 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="group mt-7 flex w-full items-center justify-center gap-2.5 bg-gold px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-midnight transition-colors hover:bg-gold-soft disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Securing your journey…
          </>
        ) : (
          <>
            Reserve &amp; Pay Deposit
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </button>

      <div className="mt-4 flex flex-col items-center gap-2 text-[0.6875rem] text-midnight/45 sm:flex-row sm:justify-center sm:gap-5">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-gold" /> 256-bit encrypted checkout
        </span>
        <a
          href={whatsappLink("Hello! I have a question before booking.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-midnight/55 transition-colors hover:text-gold"
        >
          <WhatsAppIcon className="h-3.5 w-3.5" /> Prefer to chat first? WhatsApp us
        </a>
      </div>
    </form>
  );
}
