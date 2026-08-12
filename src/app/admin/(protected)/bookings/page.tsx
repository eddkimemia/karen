import Link from "next/link";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/ui";
import { usdToKesRate } from "@/lib/paystack";
import {
  BookingsTable,
  type BookingRow,
} from "@/components/admin/bookings-table";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = FILTERS.some((f) => f.value === status) ? status! : "all";

  const rows = await prisma.booking.findMany({
    where: filter === "all" ? undefined : { status: filter },
    orderBy: { createdAt: "desc" },
  });

  const bookings: BookingRow[] = rows.map((b) => ({
    id: b.id,
    reference: b.reference,
    name: b.name,
    email: b.email,
    phone: b.phone,
    adventureTitle: b.adventureTitle,
    destination: b.destination,
    destinations: b.destinations,
    travelers: b.travelers,
    adults: b.adults,
    children: b.children,
    startDate: b.startDate?.toISOString() ?? null,
    endDate: b.endDate?.toISOString() ?? null,
    pickupLocation: b.pickupLocation,
    pickupTime: b.pickupTime,
    dropoffLocation: b.dropoffLocation,
    dropoffTime: b.dropoffTime,
    accommodation: b.accommodation,
    transport: b.transport,
    depositPaidKes: b.depositPaidKes,
    priceEstimate: b.priceEstimate,
    status: b.status,
    notes: b.notes,
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <>
      <AdminHeader
        title="Bookings"
        description="Reservations from the booking page — including deposit status."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/admin/bookings" : `/admin/bookings?status=${f.value}`}
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

      <BookingsTable bookings={bookings} usdToKesRate={usdToKesRate()} />
    </>
  );
}
