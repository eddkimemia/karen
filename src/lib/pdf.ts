import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { prisma } from "@/lib/prisma";
import { formatPrice, img } from "@/lib/utils";
import { CONTACT_EMAIL, WHATSAPP_DISPLAY } from "@/lib/site";

/* Brand palette — matches the site (navy + gold + ivory). */
const NAVY = "#071a33";
const NAVY_SOFT = "#123a63";
const GOLD = "#c9a227";
const GOLD_SOFT = "#e8d7a8";
const IVORY = "#f8f5ed";
const SAND = "#f3efe4";
const INK = "#1c1c1c";
const MUTED = "#8a7f63";

/** The booking shape the invoice is rendered from (a Prisma Booking subset). */
export type BookingPdfSource = {
  reference: string;
  adventureSlug: string | null;
  adventureTitle: string;
  destination: string | null;
  destinations: string[];
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

/** Load the logo from public/images (best-effort — falls back to a wordmark). */
function loadLogo(): Buffer | null {
  const candidates = [
    path.join(process.cwd(), "public", "images", "logo.png"),
    path.join(process.cwd(), "public", "logo.png"),
  ];
  for (const p of candidates) {
    try {
      return fs.readFileSync(p);
    } catch {
      /* keep trying */
    }
  }
  return null;
}

/** Fetch remote image bytes (Unsplash) — best-effort for the invoice hero. */
async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

/**
 * Build a rich, branded A4 invoice PDF for a booking.
 *
 * Enriches the booking with the linked adventure's itinerary (highlights) and
 * a hero photograph of the primary destination, then renders:
 *   header w/ logo · guest & journey summary · destinations · itinerary ·
 *   totals · footer. Every asset is best-effort — missing logo/images degrade
 *   gracefully to a clean text layout.
 */
export async function buildBookingPdf(b: BookingPdfSource): Promise<Buffer> {
  const primaryName = b.destinations[0] ?? b.destination ?? "";
  const [adventure, destination] = await Promise.all([
    b.adventureSlug
      ? prisma.adventure
          .findUnique({ where: { slug: b.adventureSlug } })
          .catch(() => null)
      : Promise.resolve(null),
    // Only look up a hero destination when the booking names one — an empty
    // `contains` match would return a random destination (and its photo).
    primaryName
      ? prisma.destination
          .findFirst({
            where: { name: { contains: primaryName, mode: "insensitive" } },
          })
          .catch(() => null)
      : Promise.resolve(null),
  ]);

  const itinerary = adventure?.highlights ?? [];
  // pdfkit embeds JPEG/PNG only — pin fm=jpg so Unsplash's `auto=format` can't
  // hand us a WebP/AVIF the PDF engine can't render.
  const heroUrl = destination?.image
    ? `${img(destination.image, 1000, 72)}&fm=jpg`
    : adventure?.image
      ? `${img(adventure.image, 1000, 72)}&fm=jpg`
      : null;
  const [logo, hero] = await Promise.all([
    Promise.resolve(loadLogo()),
    heroUrl ? fetchImageBuffer(heroUrl) : Promise.resolve(null),
  ]);

  const primaryDestination = b.destinations[0] ?? b.destination ?? "Kenya";
  const destinationList = b.destinations.length
    ? b.destinations
    : b.destination
      ? [b.destination]
      : [];

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
    const M = 48;

    /* ------------------------------------------------------------ header */
    const headerH = 132;
    doc.rect(0, 0, W, headerH).fill(NAVY);
    doc.rect(0, headerH - 5, W, 5).fill(GOLD);

    // Logo (or wordmark fallback)
    if (logo) {
      try {
        doc.image(logo, M, 32, { height: 68, fit: [200, 68] });
      } catch {
        doc
          .font("Helvetica-Bold")
          .fontSize(24)
          .fillColor(IVORY)
          .text("Karen Adventures", M + 2, 44);
      }
    } else {
      doc
        .font("Helvetica-Bold")
        .fontSize(24)
        .fillColor(IVORY)
        .text("Karen Adventures", M + 2, 44);
    }
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(GOLD_SOFT)
      .text("DISCOVER KENYA · BEYOND THE ORDINARY", M + 2, 104, {
        characterSpacing: 2,
      });

    // Invoice type + reference (right-aligned block)
    const rightX = W - M - 230;
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(IVORY)
      .text(
        b.status === "confirmed" ? "BOOKING CONFIRMATION" : "BOOKING RESERVATION",
        rightX,
        34,
        { width: 230, align: "right" },
      );
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(GOLD)
      .text(`REF  ${b.reference}`, rightX, 58, { width: 230, align: "right" });
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(IVORY)
      .text(`Issued ${fmtDate(b.createdAt)}`, rightX, 76, {
        width: 230,
        align: "right",
      });
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(IVORY)
      .text(`Travelers  ${b.travelers}`, rightX, 94, {
        width: 230,
        align: "right",
      });

    /* -------------------------------------------------------- hero image */
    let y = headerH + 26;
    if (hero) {
      try {
        const heroW = W - M * 2;
        const heroH = 168;
        doc
          .save()
          .rect(M, y, heroW, heroH)
          .clip()
          .image(hero, M, y, { fit: [heroW, heroH] })
          .restore();
        doc.rect(M, y, heroW, heroH).lineWidth(1).stroke("#ddd0b8");
        // Dark gradient scrim + destination label over the image
        doc.rect(M, y + heroH - 46, heroW, 46).fillOpacity(0.55).fill(NAVY).fillOpacity(1);
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor(IVORY)
          .text(destinationList.length ? destinationList.join("  ·  ") : primaryDestination, M + 18, y + heroH - 34, {
            width: heroW - 36,
          });
        y += heroH + 22;
      } catch {
        y += 10;
      }
    }

    /* --------------------------------------------------- greeting + meta */
    doc
      .font("Times-Bold")
      .fontSize(21)
      .fillColor(NAVY)
      .text("Karibu — welcome.", M, y);
    y += 30;

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
    y += 62;

    /* ---------------------------------------------------- journey box */
    const boxW = W - M * 2;
    const boxH = 84;
    doc.roundedRect(M, y, boxW, boxH, 4).fill(SAND);
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
        .text(text, x, yy + 15, { width: colW - 8 });

    label(M + 20, y + 16, "Journey");
    value(M + 20, y + 16, b.adventureTitle);
    label(M + 20 + colW, y + 16, "Primary destination");
    value(M + 20 + colW, y + 16, primaryDestination);
    label(M + 20 + colW * 2, y + 16, "Travelers");
    value(
      M + 20 + colW * 2,
      y + 16,
      `${b.travelers} guest${b.travelers === 1 ? "" : "s"}`,
    );
    y += boxH + 24;

    /* -------------------------------------------------- booking details */
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(MUTED)
      .text("BOOKING DETAILS", M, y, { characterSpacing: 2 });
    y += 15;

    const rows: [string, string][] = [
      ["Guest", b.name],
      ["Email", b.email],
      ["Phone / WhatsApp", b.phone ?? "—"],
      ["Start date", b.startDate ? fmtDate(b.startDate) : "Flexible — to be agreed"],
      ["Estimated total", `${formatPrice(b.priceEstimate)}`],
      ["Status", b.status],
    ];

    const rowH = 23;
    for (const [k, v] of rows) {
      if (y + rowH > doc.page.height - 78) {
        doc.addPage();
        y = 48;
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

    /* ---------------------------------------------------- destinations */
    if (destinationList.length > 1) {
      y += 8;
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(MUTED)
        .text("DESTINATIONS IN YOUR JOURNEY", M, y, { characterSpacing: 2 });
      y += 16;
      doc
        .font("Helvetica")
        .fontSize(10.5)
        .fillColor(NAVY)
        .text(destinationList.join("   ·   "), M, y, { width: W - M * 2 });
      y += 26;
    }

    /* ------------------------------------------------------ itinerary */
    if (itinerary.length) {
      if (y + 40 > doc.page.height - 90) {
        doc.addPage();
        y = 48;
      }
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(MUTED)
        .text("PROPOSED ITINERARY HIGHLIGHTS", M, y, { characterSpacing: 2 });
      y += 18;

      itinerary.forEach((h, i) => {
        if (y + 24 > doc.page.height - 90) {
          doc.addPage();
          y = 48;
          doc
            .font("Helvetica-Bold")
            .fontSize(8)
            .fillColor(MUTED)
            .text("PROPOSED ITINERARY HIGHLIGHTS (cont.)", M, y, { characterSpacing: 2 });
          y += 18;
        }
        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor(GOLD)
          .text(String(i + 1).padStart(2, "0"), M, y + 2, { width: 30 });
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(INK)
          .text(h, M + 34, y, { width: W - M * 2 - 34 });
        y += 22;
      });
      y += 10;
    }

    if (b.notes) {
      y += 6;
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(MUTED)
        .text("PLANNER NOTES", M, y, { characterSpacing: 2 });
      y += 15;
      doc
        .font("Helvetica-Oblique")
        .fontSize(10)
        .fillColor(INK)
        .text(b.notes, M, y, { width: W - M * 2, lineGap: 3 });
      y += 38;
    }

    /* ----------------------------------------------------- totals strip */
    if (y + 70 > doc.page.height - 20) {
      doc.addPage();
      y = 48;
    }
    const stripY = doc.page.height - 92;
    doc.rect(M, stripY, boxW, 56).fill(NAVY);
    doc.rect(M, stripY, 5, 56).fill(GOLD);
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(GOLD_SOFT)
      .text("ESTIMATED JOURNEY TOTAL (USD)", M + 20, stripY + 14, { characterSpacing: 1.5 });
    doc
      .font("Times-Bold")
      .fontSize(22)
      .fillColor(IVORY)
      .text(formatPrice(b.priceEstimate), M + 20, stripY + 24);
    doc
      .font("Helvetica")
      .fontSize(7.5)
      .fillColor(GOLD_SOFT)
      .text(
        "Indicative estimate — final balance confirmed with your itinerary.",
        W - M - 190,
        stripY + 20,
        { width: 190, align: "right" },
      );

    /* ---------------------------------------------------------- footer */
    const footerTop = doc.page.height - 24;
    doc.rect(0, footerTop - 2, W, 26).fill(NAVY_SOFT);
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(IVORY)
      .text(
        `Karen Adventures · Karen, Nairobi, Kenya     ${WHATSAPP_DISPLAY}     ${CONTACT_EMAIL}     karenadventures.com`,
        M,
        footerTop + 6,
        { width: W - M * 2, align: "center" },
      );

    doc.end();
  });
}
