"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setState("done");
      setMessage("Welcome to the journey. You're on the list.");
    } catch {
      setState("error");
      setMessage("Couldn't subscribe right now — please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)} noValidate>
      <div className="flex border border-ivory/20 transition-colors focus-within:border-gold/70">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== "idle") setState("idle");
          }}
          placeholder="Your email address"
          aria-label="Email address"
          className="w-full bg-transparent px-4 py-3 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          aria-label="Subscribe"
          className="flex items-center justify-center bg-gold px-5 text-midnight transition-colors hover:bg-gold-soft disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      <p
        className={cn(
          "mt-2.5 min-h-5 text-xs tracking-wide",
          state === "error"
            ? "text-red-400"
            : state === "done"
              ? "text-champagne"
              : "text-ivory/50",
        )}
        aria-live="polite"
      >
        {state === "done" ? message : state === "error" ? message : "Journeys, dispatches and private offers. No noise."}
      </p>
    </form>
  );
}
