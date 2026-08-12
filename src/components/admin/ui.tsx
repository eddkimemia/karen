import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <span className="eyebrow">Admin Console</span>
        <h1 className="mt-4 font-serif text-4xl font-medium text-ivory sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ivory/55">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="border border-gold/15 bg-midnight p-6">
      <div className="flex items-center justify-between">
        <p className="text-[0.625rem] font-medium uppercase tracking-[0.28em] text-gold/80">
          {label}
        </p>
        <Icon className="h-4 w-4 text-gold/60" strokeWidth={1.5} />
      </div>
      <p className="mt-4 font-serif text-4xl font-medium text-ivory">{value}</p>
      {sub && <p className="mt-2 text-xs text-ivory/45">{sub}</p>}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  new: "border-gold/40 bg-gold/10 text-gold",
  pending: "border-gold/40 bg-gold/10 text-gold",
  planned: "border-champagne/40 bg-champagne/10 text-champagne",
  confirmed: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  completed: "border-teal-400/40 bg-teal-400/10 text-teal-300",
  cancelled: "border-red-400/40 bg-red-400/10 text-red-300",
  archived: "border-ivory/25 bg-ivory/5 text-ivory/50",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-[0.18em]",
        STATUS_STYLES[status] ?? "border-ivory/25 bg-ivory/5 text-ivory/60",
      )}
    >
      {status}
    </span>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border border-ivory/10 bg-midnight", className)}>
      {children}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[0.5625rem] font-medium uppercase tracking-[0.25em] text-gold/70">
        {label}
      </p>
      <div className="mt-1 text-sm text-ivory/75">{children}</div>
    </div>
  );
}

export function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="border border-dashed border-ivory/15 px-8 py-16 text-center">
      <p className="font-serif text-2xl font-medium text-ivory/80">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ivory/45">{copy}</p>
    </div>
  );
}
