"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

type Props = {
  destinations: Option[];
  journeys: Option[];
  preselectedDestination?: string;
  preselectedJourney?: string;
};

const TRAVELERS = ["1 – 2", "3 – 4", "5 – 8", "9 or more"];
const inputClass =
  "w-full border border-midnight/15 bg-ivory px-4 py-3 text-sm text-midnight placeholder:text-midnight/35 transition-colors focus:border-gold focus:outline-none";

export function ContactForm({
  destinations,
  journeys,
  preselectedDestination,
  preselectedJourney,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [reference, setReference] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    if (String(payload.message ?? "").trim().length < 10) {
      setFormError("A few more details about your dream journey help us plan better.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setReference(data.id);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setFormError(
        err instanceof Error
          ? err.message
          : "We couldn't save your enquiry right now — please try again.",
      );
    }
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center border border-gold/40 bg-ivory px-8 py-16 text-center">
        <CheckCircle2 className="h-12 w-12 text-gold" strokeWidth={1.25} />
        <h2 className="mt-6 font-serif text-3xl font-medium text-midnight">
          Thank you — the journey has begun.
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-midnight/65">
          Your enquiry has been received{reference ? ` (ref. ${reference.slice(-6).toUpperCase()})` : ""}.
          A Karen Adventures planner will be in touch within one working day
          with first thoughts on your journey.
        </p>
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
      <div className="grid gap-5 sm:grid-cols-2">
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
        <div>
          <label htmlFor="phone" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
            Phone / WhatsApp
          </label>
          <input id="phone" name="phone" maxLength={30} placeholder="+254 …" className={inputClass} />
        </div>
        <div>
          <label htmlFor="destination" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
            Destination of interest
          </label>
          <select
            id="destination"
            name="destination"
            defaultValue={preselectedDestination ?? ""}
            className={cn(inputClass, "appearance-none")}
          >
            <option value="">Anywhere in East Africa</option>
            {destinations.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="journey" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
            Journey of interest
          </label>
          <select
            id="journey"
            name="journey"
            defaultValue={preselectedJourney ?? ""}
            className={cn(inputClass, "appearance-none")}
          >
            <option value="">Still deciding</option>
            {journeys.map((j) => (
              <option key={j.value} value={j.label}>{j.label}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="travelers" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
              Travelers
            </label>
            <select id="travelers" name="travelers" defaultValue="" className={cn(inputClass, "appearance-none")}>
              <option value="">Select</option>
              {TRAVELERS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="travelDate" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
              Preferred dates
            </label>
            <input id="travelDate" name="travelDate" type="month" className={inputClass} />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-midnight/55">
            Your dream journey *
          </label>
          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            maxLength={2000}
            rows={5}
            placeholder="Tell us where you'd like to go, what moves you, and anything that would make this trip unforgettable…"
            className={cn(inputClass, "resize-y")}
          />
        </div>
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
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Plan My Adventure
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </button>
      <p className="mt-4 text-center text-[0.6875rem] leading-relaxed text-midnight/45">
        No payment is taken here. This is the start of a conversation.
      </p>
    </form>
  );
}
