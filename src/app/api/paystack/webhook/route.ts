import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { notifyTeamBookingPaid, sendBookingConfirmation } from "@/lib/email";
import { paystackWebhookSecret } from "@/lib/paystack";

/**
 * Paystack webhook — confirms bookings asynchronously.
 * Signature: HMAC-SHA512 of the raw request body using the secret key.
 * Docs: https://paystack.com/docs/payments/webhooks/
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";
  const secret = paystackWebhookSecret();

  if (!secret || !signature) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hash = createHmac("sha512", secret).update(raw).digest("hex");
  const expected = Buffer.from(hash, "hex");
  const provided = Buffer.from(signature, "hex");
  if (
    provided.length !== expected.length ||
    !timingSafeEqual(expected, provided)
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event.event === "charge.success" && event.data?.reference) {
    // Confirm the booking, then email the guest their branded confirmation PDF.
    // The status filter keeps this idempotent — a webhook retry (or a race with
    // the success page) won't re-confirm or re-email an already-confirmed booking.
    const updated = await prisma.booking.updateMany({
      where: { reference: event.data.reference, status: { not: "confirmed" } },
      data: { status: "confirmed" },
    });
    if (updated.count > 0) {
      const booking = await prisma.booking.findUnique({
        where: { reference: event.data.reference },
      });
      if (booking) {
        await sendBookingConfirmation(booking);
        await notifyTeamBookingPaid(booking);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
