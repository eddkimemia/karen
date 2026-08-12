import Link from "next/link";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/ui";
import {
  InquiriesTable,
  type InquiryRow,
} from "@/components/admin/inquiries-table";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "planned", label: "Planned" },
  { value: "confirmed", label: "Confirmed" },
  { value: "archived", label: "Archived" },
];

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = FILTERS.some((f) => f.value === status) ? status! : "all";

  const rows = await prisma.inquiry.findMany({
    where: filter === "all" ? undefined : { status: filter },
    orderBy: { createdAt: "desc" },
  });

  const inquiries: InquiryRow[] = rows.map((q) => ({
    id: q.id,
    name: q.name,
    email: q.email,
    phone: q.phone,
    destination: q.destination,
    tripType: q.tripType,
    travelers: q.travelers,
    travelDate: q.travelDate,
    message: q.message,
    status: q.status,
    notes: q.notes,
    createdAt: q.createdAt.toISOString(),
  }));

  return (
    <>
      <AdminHeader
        title="Inquiries"
        description="Questions and planning requests from the contact page."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/admin/inquiries" : `/admin/inquiries?status=${f.value}`}
            className={cn(
              "border px-4 py-2 text-[0.6875rem] font-medium uppercase tracking-[0.18em] transition-colors",
              filter === f.value
                ? "border-gold bg-gold/10 text-gold"
                : "border-ivory/15 text-ivory/55 hover:text-champagne",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <InquiriesTable inquiries={inquiries} />
    </>
  );
}
