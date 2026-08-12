import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyNewInquiry } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v: unknown) => (typeof v === "string" ? v.trim() : "");

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
  const message = clean(b.message).slice(0, 2000);
  const phone = clean(b.phone).slice(0, 30) || null;
  const destination = clean(b.destination).slice(0, 120) || null;
  const journey = clean(b.journey).slice(0, 160) || null;
  const travelers = clean(b.travelers).slice(0, 20) || null;
  const travelDate = clean(b.travelDate).slice(0, 40) || null;

  if (name.length < 2) {
    return NextResponse.json({ error: "Please tell us your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json(
      { error: "A few more details about your dream journey help us plan better." },
      { status: 400 },
    );
  }

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        destination,
        tripType: journey,
        travelers,
        travelDate,
        message,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        destination: true,
        tripType: true,
        travelers: true,
        travelDate: true,
        message: true,
      },
    });
    // Notify the team (never blocks the response on mail issues).
    await notifyNewInquiry(inquiry);
    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "We couldn't save your enquiry right now — please try again." },
      { status: 500 },
    );
  }
}
