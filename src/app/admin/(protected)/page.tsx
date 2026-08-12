import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  Coins,
  Inbox,
  Mail,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  AdminCard,
  AdminHeader,
  Field,
  StatCard,
  StatusPill,
} from "@/components/admin/ui";
import { formatPrice } from "@/lib/utils";

const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(d));

export default async function AdminDashboardPage() {
  const [
    newInquiries,
    totalInquiries,
    totalBookings,
    pendingBookings,
    revenue,
    subscribers,
    recentInquiries,
    recentBookings,
  ] = await Promise.all([
    prisma.inquiry.count({ where: { status: "new" } }),
    prisma.inquiry.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.booking.aggregate({
      where: { status: { in: ["confirmed", "completed"] } },
      _sum: { priceEstimate: true },
    }),
    prisma.subscriber.count(),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="A live overview of enquiries, reservations and subscribers."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="New inquiries"
          value={newInquiries}
          sub="Awaiting your first reply"
          icon={Inbox}
        />
        <StatCard
          label="Total inquiries"
          value={totalInquiries}
          icon={Users}
        />
        <StatCard
          label="Pending bookings"
          value={pendingBookings}
          sub={`${totalBookings} bookings total`}
          icon={CalendarCheck2}
        />
        <StatCard
          label="Confirmed revenue"
          value={formatPrice(revenue._sum.priceEstimate ?? 0)}
          sub="Confirmed & completed bookings"
          icon={Coins}
        />
        <StatCard
          label="Subscribers"
          value={subscribers}
          icon={Mail}
        />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Recent inquiries */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-medium text-ivory">
              Recent inquiries
            </h2>
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center gap-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:text-gold-soft"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentInquiries.length === 0 && (
              <AdminCard className="px-6 py-10 text-center text-sm text-ivory/45">
                No inquiries yet.
              </AdminCard>
            )}
            {recentInquiries.map((q) => (
              <AdminCard key={q.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-lg font-medium text-ivory">
                      {q.name}
                    </p>
                    <p className="mt-0.5 text-xs text-ivory/45">
                      {fmtDate(q.createdAt)} · {q.destination ?? "Anywhere in Kenya"}
                    </p>
                  </div>
                  <StatusPill status={q.status} />
                </div>
                <p className="mt-3 line-clamp-2 text-sm italic leading-relaxed text-ivory/55">
                  “{q.message}”
                </p>
              </AdminCard>
            ))}
          </div>
        </section>

        {/* Recent bookings */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-medium text-ivory">
              Recent bookings
            </h2>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:text-gold-soft"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentBookings.length === 0 && (
              <AdminCard className="px-6 py-10 text-center text-sm text-ivory/45">
                No bookings yet.
              </AdminCard>
            )}
            {recentBookings.map((b) => (
              <AdminCard key={b.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-lg font-medium text-ivory">
                      {b.adventureTitle}
                    </p>
                    <p className="mt-0.5 text-xs text-ivory/45">
                      {b.reference} · {b.name}
                    </p>
                  </div>
                  <StatusPill status={b.status} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Field label="Travelers">{b.travelers}</Field>
                  <Field label="Estimate">{formatPrice(b.priceEstimate)}</Field>
                </div>
              </AdminCard>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
