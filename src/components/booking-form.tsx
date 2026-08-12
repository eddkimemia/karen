"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { whatsappLink } from "@/lib/site";

type Journey = { value: string; label: string; price: number };
type Destination = { value: string; label: string };

const DESTINATION_LIMIT = 8;

type Props = {
  journeys: Journey[];
  destinations: Destination[];
  preselectedJourney?: string;
  depositPercent: number;
  usdToKesRate: number;
};

const inputClass =
  "w-full border border-midnight/15 bg-ivory px-4 py-3 text-sm text-midnight placeholder:text-midnight/35 transition-colors focus:border-gold focus:outline-none";

export function BookingForm({
  journeys,
  destinations,
  preselectedJourney,
  depositPercent,
  usdToKesRate,
}: Props) {
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
  const [travelers, setTravelers] = useState(2);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);

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
  const depositKes = Math.round(depositUsd * usdToKesRate);

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
                {j.label} · {formatPrice(j.price)} / person
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
            Destinations{" "}
            <span className="font-sans text-[0.625rem] normal-case tracking-normal text-midnight/40">
              (choose one or more)
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {destinations.map((d) => {
              const active = selectedDestinations.includes(d.label);
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleDestination(d.label)}
                  aria-pressed={active}
                  className={cn(
                    "border px-3.5 py-2 text-xs font-medium transition-all duration-200",
                    active
                      ? "border-gold bg-gold/15 text-midnight"
                      : "border-midnight/15 bg-white text-midnight/60 hover:border-gold/60 hover:text-midnight",
                  )}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[0.6875rem] text-midnight/45">
            {selectedDestinations.length === 0
              ? "Anywhere in Kenya — tell us your dream and we'll plan around it."
              : `${selectedDestinations.length} selected${
                  selectedDestinations.length >= DESTINATION_LIMIT
                    ? ` (max ${DESTINATION_LIMIT})`
                    : ""
                } — pick up to ${DESTINATION_LIMIT} locations.`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="travelers" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
              Travelers *
            </label>
            <input
              id="travelers"
              name="travelers"
              type="number"
              min={1}
              max={40}
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value) || 1)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="startDate" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
              Start date
            </label>
            <input id="startDate" name="startDate" type="date" className={inputClass} />
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
            Anything we should know
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            maxLength={2000}
            placeholder="Special occasions, travel style, flexibility on dates…"
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
              {estimateUsd > 0 ? formatPrice(estimateUsd) : "To be designed"}
              {estimateUsd > 0 && (
                <span className="text-sm font-sans text-midnight/50">
                  {" "}
                  ≈ KES{" "}
                  {Math.round(estimateUsd * usdToKesRate).toLocaleString("en-KE")}
                </span>
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[0.625rem] font-medium uppercase tracking-[0.28em] text-midnight/50">
              Deposit due now · {depositPercent}%
            </p>
            <p className="mt-1 text-sm font-medium text-midnight">
              {depositUsd > 0 ? (
                <>
                  {formatPrice(depositUsd)}{" "}
                  <span className="text-midnight/55">
                    (KES {depositKes.toLocaleString("en-KE")})
                  </span>
                </>
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
