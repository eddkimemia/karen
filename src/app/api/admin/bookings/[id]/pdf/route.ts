import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/admin";
import { buildBookingPdf } from "@/lib/pdf";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthed())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return new Response("Booking not found", { status: 404 });
  }

  // Build a fresh PDF from the DB record (logo, itinerary & images best-effort).
  const pdf = await buildBookingPdf({
    reference: booking.reference,
    adventureSlug: booking.adventureSlug,
    adventureTitle: booking.adventureTitle,
    destination: booking.destination,
    destinations: booking.destinations,
    name: booking.name,
    email: booking.email,
    phone: booking.phone,
    travelers: booking.travelers,
    startDate: booking.startDate,
    priceEstimate: booking.priceEstimate,
    status: booking.status,
    notes: booking.notes,
    createdAt: booking.createdAt,
  });

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="karen-adventures-booking-${booking.reference}.pdf"`,
      "Content-Length": String(pdf.length),
      "Cache-Control": "private, no-store",
    },
  });
}
