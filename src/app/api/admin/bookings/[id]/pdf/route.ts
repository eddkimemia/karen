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

  const pdf = await buildBookingPdf(booking);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="karen-adventures-booking-${booking.reference}.pdf"`,
      "Content-Length": String(pdf.length),
      "Cache-Control": "private, no-store",
    },
  });
}
