"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Phone, Save, Trash2 } from "lucide-react";
import { AdminCard, EmptyState, Field, StatusPill } from "@/components/admin/ui";

export type InquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  destination: string | null;
  tripType: string | null;
  travelers: string | null;
  travelDate: string | null;
  message: string;
  status: string;
  notes: string | null;
  createdAt: string;
};

const STATUSES = ["new", "planned", "confirmed", "archived"];

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

export function InquiriesTable({ inquiries }: { inquiries: InquiryRow[] }) {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setSavingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Update failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSavingId(null);
    }
  }

  async function saveNotes(id: string, notes: string) {
    setSavingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this inquiry permanently?")) return;
    const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError((await res.json()).error ?? "Delete failed");
      return;
    }
    router.refresh();
  }

  if (inquiries.length === 0) {
    return (
      <EmptyState
        title="No inquiries yet"
        copy="When guests send enquiries through the contact page, they'll appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
      {inquiries.map((q) => (
        <AdminCard key={q.id} className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-serif text-xl font-medium text-ivory">{q.name}</p>
              <p className="mt-1 text-xs text-ivory/45">{fmtDate(q.createdAt)}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusPill status={q.status} />
              <select
                value={q.status}
                disabled={savingId === q.id}
                onChange={(e) => updateStatus(q.id, e.target.value)}
                aria-label="Change status"
                className="border border-ivory/20 bg-royal-deep px-2.5 py-1.5 text-xs text-ivory transition-colors focus:border-gold focus:outline-none disabled:opacity-50"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 grid gap-4 border-t border-ivory/10 pt-5 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Email">
              <a
                href={`mailto:${q.email}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-gold"
              >
                <Mail className="h-3.5 w-3.5 text-gold/70" /> {q.email}
              </a>
            </Field>
            <Field label="Phone">
              {q.phone ? (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-gold/70" /> {q.phone}
                </span>
              ) : (
                <span className="text-ivory/35">—</span>
              )}
            </Field>
            <Field label="Destination">{q.destination ?? "Anywhere in East Africa"}</Field>
            <Field label="Journey">{q.tripType ?? "Still deciding"}</Field>
            <Field label="Travelers">{q.travelers ?? "—"}</Field>
            <Field label="Preferred dates">{q.travelDate ?? "Flexible"}</Field>
          </div>

          <blockquote className="mt-5 border-l-2 border-gold/50 bg-royal-deep/60 px-5 py-4 font-serif text-[0.9375rem] italic leading-relaxed text-champagne/90">
            “{q.message}”
          </blockquote>

          <div className="mt-5 border-t border-ivory/10 pt-4">
            <NotesEditor
              id={q.id}
              initial={q.notes ?? ""}
              saving={savingId === q.id}
              onSave={saveNotes}
              onDelete={() => remove(q.id)}
            />
          </div>
        </AdminCard>
      ))}
    </div>
  );
}

function NotesEditor({
  id,
  initial,
  saving,
  onSave,
  onDelete,
}: {
  id: string;
  initial: string;
  saving: boolean;
  onSave: (id: string, notes: string) => void;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState(initial);

  return (
    <div>
      <label
        htmlFor={`notes-${id}`}
        className="text-[0.5625rem] font-medium uppercase tracking-[0.25em] text-gold/70"
      >
        Planner notes
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <textarea
          id={`notes-${id}`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          maxLength={2000}
          placeholder="Internal notes about this enquiry…"
          className="flex-1 resize-y border border-ivory/15 bg-royal-deep/60 px-3.5 py-2.5 text-sm text-ivory placeholder:text-ivory/30 transition-colors focus:border-gold focus:outline-none"
        />
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onSave(id, notes)}
            disabled={saving}
            className="inline-flex items-center gap-2 border border-gold/50 px-4 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold hover:text-midnight disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Save
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete inquiry"
            className="inline-flex items-center border border-red-400/40 px-3.5 text-red-300 transition-colors hover:bg-red-400/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
