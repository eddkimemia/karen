"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/admin/ui";

export type SubscriberRow = {
  id: string;
  email: string;
  createdAt: string;
};

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

export function SubscribersTable({
  subscribers,
}: {
  subscribers: SubscriberRow[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function remove(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    const res = await fetch(`/api/admin/subscribers/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Delete failed");
      return;
    }
    router.refresh();
  }

  if (subscribers.length === 0) {
    return (
      <EmptyState
        title="No subscribers yet"
        copy="Newsletter sign-ups from the footer will appear here."
      />
    );
  }

  return (
    <div className="border border-ivory/10 bg-midnight">
      {error && (
        <p className="border-b border-red-500/40 bg-red-950/40 px-5 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
      {subscribers.map((s, i) => (
        <div
          key={s.id}
          className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 ${
            i > 0 ? "border-t border-ivory/10" : ""
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Mail className="h-4 w-4 shrink-0 text-gold/70" />
            <div className="min-w-0">
              <p className="truncate text-sm text-ivory">{s.email}</p>
              <p className="text-xs text-ivory/40">Joined {fmtDate(s.createdAt)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => remove(s.id)}
            aria-label={`Remove ${s.email}`}
            className="inline-flex items-center border border-red-400/40 px-3 py-2 text-red-300 transition-colors hover:bg-red-400/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
