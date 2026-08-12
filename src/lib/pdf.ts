import PDFDocument from "pdfkit";
import { formatPrice } from "@/lib/utils";
import { CONTACT_EMAIL, WHATSAPP_DISPLAY } from "@/lib/site";

/* Brand palette — matches the site (navy + gold + ivory). */
const NAVY = "#071a33";
const NAVY_SOFT = "#123a63";
const GOLD = "#c9a227";
const GOLD_SOFT = "#e8d7a8";
const IVORY = "#f8f5ed";
const INK = "#1c1c1c";
const MUTED = "#8a7f63";

export type BookingPdfData = {
  reference: string;
  adventureTitle: string;
  destination: string | null;
  name: string;
  email: string;
  phone: string | null;
  travelers: number;
  startDate: Date | null;
  priceEstimate: number;
  status: string;
  notes: string | null;
  createdAt: Date;
};

const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(d));

/** Build a branded A4 booking confirmation / invoice PDF. */
export function buildBookingPdf(b: BookingPdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      bufferPages: true,
      info: {
        Title: `Karen Adventures — Booking ${b.reference}`,
        Author: "Karen Adventures",
        Subject: `Booking confirmation ${b.reference}`,
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const W = doc.page.width; // 595.28
    const M = 52;

    /* ---------------------------------------------------------- header */
    const headerH = 118;
    doc.rect(0, 0, W, headerH).fill(NAVY);

    // Gold hairline under header
    doc.rect(0, headerH - 4, W, 4).fill(GOLD);

    doc
      .fillColor(GOLD)
      .rect(M, 34, 10, 52)
      .fill();

    doc
      .font("Helvetica-Bold")
      .fontSize(26)
      .fillColor(IVORY)
      .text("Karen Adventures", M + 26, 40, { width: 340 });
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(GOLD_SOFT)
      .text("DISCOVER KENYA · BEYOND THE ORDINARY", M + 27, 72, {
        characterSpacing: 2,
      });

    // Document type badge
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(NAVY)
      .text(
        b.status === "confirmed" ? "BOOKING CONFIRMATION" : "BOOKING RESERVATION",
        W - M - 220,
        42,
        { width: 220, align: "right" },
      );
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(GOLD_SOFT)
      .text(
        `Reference  ${b.reference}`,
        W - M - 220,
        62,
        { width: 220, align: "right" },
      );
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(IVORY)
      .text(`Issued ${fmtDate(b.createdAt)}`, W - M - 220, 80, {
        width: 220,
        align: "right",
      });

    /* ------------------------------------------------------- intro block */
    let y = headerH + 40;
    doc
      .font("Times-Bold")
      .fontSize(22)
      .fillColor(NAVY)
      .text("Karibu — welcome.", M, y);
    y += 32;

    doc
      .font("Helvetica")
      .fontSize(10.5)
      .fillColor(INK)
      .text(
        b.status === "confirmed"
          ? "Your deposit has been received and your journey is confirmed. A Karen Adventures planner will email your detailed itinerary within one working day."
          : "Thank you for reserving your journey with Karen Adventures. A planner will contact you shortly to confirm your deposit and finalise the details.",
        M,
        y,
        { width: W - M * 2, lineGap: 4 },
      );
    y += 64;

    /* ---------------------------------------------------- journey summary */
    const boxW = W - M * 2;
    const boxH = 88;
    doc.roundedRect(M, y, boxW, boxH, 4).fill(IVORY);
    doc.roundedRect(M, y, 5, boxH, 2).fill(GOLD);

    const colW = (boxW - 20) / 3;
    const label = (x: number, yy: number, text: string) =>
      doc
        .font("Helvetica-Bold")
        .fontSize(7.5)
        .fillColor(MUTED)
        .text(text.toUpperCase(), x, yy, { characterSpacing: 1.5 });

    const value = (x: number, yy: number, text: string) =>
      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor(NAVY)
        .text(text, x, yy + 14, { width: colW - 8 });

    label(M + 20, y + 18, "Journey");
    value(M + 20, y + 18, b.adventureTitle);
    label(M + 20 + colW, y + 18, "Destination");
    value(M + 20 + colW, y + 18, b.destination ?? "Kenya");
    label(M + 20 + colW * 2, y + 18, "Travelers");
    value(
      M + 20 + colW * 2,
      y + 18,
      `${b.travelers} guest${b.travelers === 1 ? "" : "s"}`,
    );
    y += boxH + 22;

    /* --------------------------------------------------------- details */
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(MUTED)
      .text("BOOKING DETAILS", M, y, { characterSpacing: 2 });
    y += 14;

    const rows: [string, string][] = [
      ["Guest", b.name],
      ["Email", b.email],
      ["Phone / WhatsApp", b.phone ?? "—"],
      ["Start date", b.startDate ? fmtDate(b.startDate) : "Flexible — to be agreed"],
      ["Estimated total", formatPrice(b.priceEstimate)],
      ["Status", b.status],
    ];

    const rowH = 24;
    for (const [k, v] of rows) {
      if (y + rowH > doc.page.height - 70) {
        doc.addPage();
        y = 50;
      }
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(MUTED)
        .text(k, M, y, { width: 150 });
      doc
        .font("Helvetica")
        .fontSize(10.5)
        .fillColor(INK)
        .text(v, M + 160, y, { width: W - M * 2 - 160 });
      y += rowH;
    }

    if (b.notes) {
      y += 10;
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(MUTED)
        .text("PLANNER NOTES", M, y, { characterSpacing: 2 });
      y += 16;
      doc
        .font("Helvetica-Oblique")
        .fontSize(10)
        .fillColor(INK)
        .text(b.notes, M, y, { width: W - M * 2, lineGap: 3 });
      y += 40;
    }

    /* --------------------------------------------------------- footer */
    const footerTop = doc.page.height - 88;
    doc.rect(0, footerTop - 14, W, 14).fill(NAVY_SOFT);
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(IVORY)
      .text(
        `Karen Adventures · Karen, Nairobi, Kenya   ·   ${WHATSAPP_DISPLAY}   ·   ${CONTACT_EMAIL}`,
        M,
        footerTop + 4,
        { width: W - M * 2, align: "center" },
      );
    doc
      .font("Helvetica")
      .fontSize(7.5)
      .fillColor(GOLD_SOFT)
      .text(
        "This document is a booking confirmation. The estimate shown is indicative; the final balance is confirmed with your itinerary.",
        M,
        footerTop + 24,
        { width: W - M * 2, align: "center" },
      );

    doc.end();
  });
}
