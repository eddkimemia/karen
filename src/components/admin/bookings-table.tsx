"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Save, Trash2 } from "lucide-react";
import { AdminCard, EmptyState, Field, StatusPill } from "@/components/admin/ui";
import { formatPrice } from "@/lib/utils";

export type BookingRow = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string | null;
  adventureTitle: string;
  destination: string | null;
  destinations: string[];
  travelers: number;
  adults: number;
  children: number;
  startDate: string | null;
  endDate: string | null;
  pickupLocation: string | null;
  pickupTime: string | null;
  dropoffLocation: string | null;
  dropoffTime: string | null;
  accommodation: string | null;
  transport: string | null;
  depositPaidKes: number | null;
  priceEstimate: number;
  status: string;
  notes: string | null;
  createdAt: string;
};

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

const fmtDate = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(iso))
    : "Flexible";

export function BookingsTable({
  bookings,
  usdToKesRate = 130,
}: {
  bookings: BookingRow[];
  usdToKesRate?: number;
}) {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function downloadPdf(b: BookingRow) {
    setSavingId(b.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${b.id}/pdf`);
      if (!res.ok) {
        throw new Error((await res.text()) || "PDF download failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `karen-adventures-booking-${b.reference}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "PDF download failed");
    } finally {
      setSavingId(null);
    }
  }

  async function updateStatus(id: string, status: string) {
    setSavingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
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
      const res = await fetch(`/api/admin/bookings/${id}`, {
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
    if (!confirm("Delete this booking permanently?")) return;
    const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError((await res.json()).error ?? "Delete failed");
      return;
    }
    router.refresh();
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        title="No bookings yet"
        copy="Reservations placed through the booking page — with or without a deposit — will appear here."
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
      {bookings.map((b) => (
        <AdminCard key={b.id} className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-3 font-serif text-xl font-medium text-ivory">
                {b.adventureTitle}
              </p>
              <p className="mt-1 text-xs text-ivory/45">
                {b.reference} · booked {fmtDate(b.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => downloadPdf(b)}
                disabled={savingId === b.id}
                className="inline-flex items-center gap-2 border border-ivory/20 px-3 py-1.5 text-xs text-ivory/70 transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
                title="Download booking PDF"
              >
                <FileText className="h-3.5 w-3.5" />
                {savingId === b.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "PDF"
                )}
              </button>
              <StatusPill status={b.status} />
              <select
                value={b.status}
                disabled={savingId === b.id}
                onChange={(e) => updateStatus(b.id, e.target.value)}
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
            <Field label="Guest">
              <p className="text-ivory">{b.name}</p>
              <p className="mt-0.5 text-xs text-ivory/45">
                {b.email}
                {b.phone ? ` · ${b.phone}` : ""}
              </p>
            </Field>
            <Field label="Destination">
              {b.destinations.length > 0
                ? b.destinations.join(", ")
                : (b.destination ?? "—")}
            </Field>
            <Field label="Travelers">
              {b.travelers} total · {b.adults} adult{b.adults === 1 ? "" : "s"}
              {b.children ? `, ${b.children} child${b.children === 1 ? "" : "ren"}` : ""}
            </Field>
            <Field label="Dates">
              {b.endDate ? `${fmtDate(b.startDate)} — ${fmtDate(b.endDate)}` : fmtDate(b.startDate)}
            </Field>
            <Field label="Pick-up / drop-off">
              {[b.pickupLocation, b.pickupTime].filter(Boolean).join(" · ") ||
                [b.dropoffLocation, b.dropoffTime].filter(Boolean).join(" · ") ||
                "—"}
            </Field>
            <Field label="Accommodation">{b.accommodation ?? "—"}</Field>
            <Field label="Transport">{b.transport ?? "—"}</Field>
            <Field label="Deposit (KES)">
              {b.depositPaidKes && b.depositPaidKes > 0
                ? `Paid — ${b.depositPaidKes.toLocaleString("en-KE")}`
                : b.status === "confirmed" || b.status === "completed"
                  ? "Paid (webhook)"
                  : "Awaiting"}
            </Field>
            <Field label="Estimate (USD)">{formatPrice(b.priceEstimate)}</Field>
            <Field label="Estimate (KES)">
              KES {Math.round(b.priceEstimate * usdToKesRate).toLocaleString("en-KE")}
            </Field>
          </div>

          <div className="mt-5 border-t border-ivory/10 pt-4">
            <NotesEditor
              id={b.id}
              initial={b.notes ?? ""}
              saving={savingId === b.id}
              onSave={saveNotes}
              onDelete={() => remove(b.id)}
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
          placeholder="Internal notes about this booking…"
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
            aria-label="Delete booking"
            className="inline-flex items-center border border-red-400/40 px-3.5 text-red-300 transition-colors hover:bg-red-400/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
