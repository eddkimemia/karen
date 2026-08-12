"use client";

import { useState } from "react";
import { Database, Loader2 } from "lucide-react";

export function SeedButton() {
  const [state, setState] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function seed() {
    if (!confirm("Populate the database with the starter content (journeys, destinations, experiences)? Existing records are left untouched.")) return;
    setState("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Seeding failed");
      if (data.seeded) {
        setMessage(
          `Seeded ${data.adventures} journeys, ${data.destinations} destinations, ${data.experiences} experiences.`,
        );
      } else {
        setMessage(
          data.reason === "already-present"
            ? "Database already populated — nothing to seed."
            : "Seed complete.",
        );
      }
      setState("done");
    } catch (e) {
      setState("error");
      setMessage(e instanceof Error ? e.message : "Seeding failed");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={seed}
        disabled={state === "loading"}
        className="inline-flex items-center gap-2 border border-gold/50 px-4 py-2 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold hover:text-midnight disabled:opacity-60"
      >
        {state === "loading" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Database className="h-3.5 w-3.5" />
        )}
        {state === "loading" ? "Seeding…" : "Seed database"}
      </button>
      {message && (
        <p
          className={`text-xs ${
            state === "error" ? "text-red-300" : "text-ivory/55"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
