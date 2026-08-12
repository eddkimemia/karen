import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Users,
  Wallet,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import {
  paystackSecretKey,
  usdToKesRate,
  verifyPaystackTransaction,
} from "@/lib/paystack";
import { whatsappLink, WHATSAPP_DISPLAY } from "@/lib/site";

const fmtDate = (d: Date | null) =>
  d
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(d))
    : "Flexible — to be agreed";

function ReceiptRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
      <div>
        <p className="text-[0.5625rem] font-medium uppercase tracking-[0.28em] text-midnight/45">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-midnight/80">{value}</p>
      </div>
    </div>
  );
}

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  if (!reference) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-ivory px-6">
        <div className="max-w-xl text-center">
          <span className="eyebrow eyebrow--center">Missing Reference</span>
          <h1 className="mt-7 font-serif text-4xl font-medium text-midnight">
            We couldn&rsquo;t find that booking.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-midnight/65">
            If you just completed a payment, the reference may have been lost in
            the redirect — your reservation is safe, and a planner will reach
            out. Otherwise, start a new booking below.
          </p>
          <Link
            href="/booking"
            className="mt-9 inline-flex items-center gap-2.5 bg-gold px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-midnight transition-colors hover:bg-gold-soft"
          >
            Back to Booking <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  const booking = await prisma.booking.findUnique({ where: { reference } });

  if (!booking) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-ivory px-6">
        <div className="max-w-xl text-center">
          <span className="eyebrow eyebrow--center">Not Found</span>
          <h1 className="mt-7 font-serif text-4xl font-medium text-midnight">
            Booking {reference} doesn&rsquo;t exist.
          </h1>
          <Link
            href="/booking"
            className="mt-9 inline-flex items-center gap-2.5 bg-gold px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-midnight transition-colors hover:bg-gold-soft"
          >
            Back to Booking <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  // Verify the Paystack transaction (if configured) and confirm the booking.
  let paid = booking.status === "confirmed";
  let paidKes: number | null = null;
  let verifyError: string | null = null;

  if (paystackSecretKey() && !paid) {
    try {
      const v = await verifyPaystackTransaction(reference);
      if (v.data?.status === "success") {
        paid = true;
        paidKes = v.data.amount / 100;
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "confirmed" },
        });
      } else {
        verifyError = v.data?.gateway_response ?? null;
      }
    } catch {
      verifyError = "Payment status could not be verified right now.";
    }
  }

  const rate = usdToKesRate();

  return (
    <section className="bg-ivory py-20 sm:py-28">
      <div className="mx-auto w-full max-w-2xl px-5 sm:px-8">
        <div className="border border-midnight/10 bg-white p-7 text-center shadow-[0_28px_70px_-32px_rgba(7,26,51,0.4)] sm:p-12">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
              paid ? "bg-gold/15 text-gold" : "border border-gold/40 text-gold"
            }`}
          >
            <CheckCircle2 className="h-9 w-9" strokeWidth={1.25} />
          </div>

          <h1 className="mt-6 font-serif text-4xl font-medium text-midnight">
            {paid ? "Karibu — you're booked." : "Reservation received."}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-midnight/65">
            {paid ? (
              <>
                Your deposit has been received and your journey is confirmed.
                A planner will email your detailed itinerary within one working
                day.
              </>
            ) : (
              <>
                We&rsquo;ve saved your reservation.{" "}
                {verifyError
                  ? "Your payment wasn&rsquo;t completed, but your place is held — a planner will contact you."
                  : "A planner will contact you shortly to arrange your deposit and confirm the details."}
              </>
            )}
          </p>

          {/* Reference */}
          <div className="mt-7 inline-block border border-gold/50 bg-sand/60 px-6 py-3">
            <p className="text-[0.5625rem] font-medium uppercase tracking-[0.3em] text-midnight/45">
              Booking reference
            </p>
            <p className="mt-1 font-serif text-2xl font-medium tracking-wide text-midnight">
              {booking.reference}
            </p>
          </div>

          {/* Receipt */}
          <div className="mt-8 space-y-4 border-t border-midnight/10 pt-7 text-left">
            <ReceiptRow icon={CalendarDays} label="Journey" value={booking.adventureTitle} />
            {booking.destination && (
              <ReceiptRow icon={Users} label="Destination" value={booking.destination} />
            )}
            <ReceiptRow icon={Users} label="Travelers" value={`${booking.travelers} guest${booking.travelers === 1 ? "" : "s"}`} />
            <ReceiptRow icon={Clock} label="Start date" value={fmtDate(booking.startDate)} />
            <ReceiptRow
              icon={Wallet}
              label="Estimated total"
              value={
                booking.priceEstimate > 0 ? (
                  <>
                    {formatPrice(booking.priceEstimate)}{" "}
                    <span className="text-midnight/50">
                      (≈ KES {Math.round(booking.priceEstimate * rate).toLocaleString("en-KE")})
                    </span>
                  </>
                ) : (
                  "To be designed with your planner"
                )
              }
            />
            {paidKes !== null && (
              <ReceiptRow
                icon={Wallet}
                label="Deposit paid"
                value={`KES ${paidKes.toLocaleString("en-KE")} via Paystack`}
              />
            )}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={whatsappLink(`Hello! I just booked (${booking.reference}) and would love to finalise the details.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] px-7 py-3.5 text-[0.8125rem] font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
            >
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp {WHATSAPP_DISPLAY}
            </a>
            <Link
              href="/adventures"
              className="inline-flex items-center justify-center gap-2.5 border border-midnight/20 px-7 py-3.5 text-[0.8125rem] font-medium uppercase tracking-[0.18em] text-midnight transition-all hover:border-gold hover:text-gold"
            >
              Browse More Journeys <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
