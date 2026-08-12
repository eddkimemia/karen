import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  appUrl,
  depositPercent,
  initializePaystackPayment,
  paystackSecretKey,
  usdToKesRate,
} from "@/lib/paystack";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Generate a human-friendly booking reference, e.g. KAR-20260812-A3F2 */
function makeReference() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KAR-${date}-${suffix}`;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const name = clean(b.name).slice(0, 120);
  const email = clean(b.email).slice(0, 160).toLowerCase();
  const phone = clean(b.phone).slice(0, 30) || null;
  const adventureSlug = clean(b.adventureSlug).slice(0, 160) || null;
  const destination = clean(b.destination).slice(0, 120) || null;
  const notes = clean(b.notes).slice(0, 2000) || null;
  const startDateRaw = clean(b.startDate).slice(0, 20);
  const travelers = Number(b.travelers);

  if (name.length < 2) {
    return NextResponse.json({ error: "Please tell us your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }
  if (!Number.isInteger(travelers) || travelers < 1 || travelers > 40) {
    return NextResponse.json(
      { error: "Please tell us how many travelers (1 – 40)." },
      { status: 400 },
    );
  }
  const startDate = startDateRaw ? new Date(`${startDateRaw}T00:00:00Z`) : null;
  if (startDateRaw && Number.isNaN(startDate?.getTime())) {
    return NextResponse.json(
      { error: "Please choose a valid start date." },
      { status: 400 },
    );
  }

  const adventure = adventureSlug
    ? await prisma.adventure.findUnique({ where: { slug: adventureSlug } })
    : null;

  // Estimate is the total journey cost in USD (per-person × travelers).
  const priceEstimate = adventure ? adventure.startingPrice * travelers : 0;
  const reference = makeReference();

  let booking: {
    id: string;
    reference: string;
    priceEstimate: number;
    adventureTitle: string;
  };
  try {
    booking = await prisma.booking.create({
      data: {
        reference,
        name,
        email,
        phone,
        adventureSlug: adventure?.slug ?? null,
        adventureTitle:
          adventure?.title ??
          (destination ? `${destination} — custom journey` : "Custom journey"),
        destination: adventure?.location ?? destination,
        travelers,
        startDate,
        priceEstimate,
        status: "pending",
        notes,
      },
      select: {
        id: true,
        reference: true,
        priceEstimate: true,
        adventureTitle: true,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "We couldn't save your booking right now — please try again." },
      { status: 500 },
    );
  }

  // If Paystack is configured and there's an amount, collect a deposit now.
  if (paystackSecretKey() && priceEstimate > 0) {
    const rate = usdToKesRate();
    const percent = depositPercent();
    const depositKes = Math.max(
      3,
      Math.round(((priceEstimate * percent) / 100) * rate),
    );
    try {
      const pay = await initializePaystackPayment({
        email,
        amountKes: depositKes,
        reference,
        callbackUrl: `${appUrl()}/booking/success?reference=${reference}`,
        metadata: {
          bookingId: booking.id,
          custom_fields: [
            { display_name: "Booking reference", variable_name: "booking_ref", value: reference },
            { display_name: "Journey", variable_name: "journey", value: booking.adventureTitle },
          ],
        },
      });
      return NextResponse.json({
        ok: true,
        booking,
        payment: {
          enabled: true,
          authorizationUrl: pay.authorization_url,
          currency: "KES",
          depositKes,
          depositPercent: percent,
          estimateUsd: priceEstimate,
          rate,
        },
      });
    } catch {
      // Payment init failed — keep the reservation and arrange payment by hand.
      return NextResponse.json({
        ok: true,
        booking,
        payment: {
          enabled: false,
          note: "Online payment is temporarily unavailable — a planner will contact you to arrange the deposit.",
        },
      });
    }
  }

  return NextResponse.json({
    ok: true,
    booking,
    payment: { enabled: false },
  });
}
