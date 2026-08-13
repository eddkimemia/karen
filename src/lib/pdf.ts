import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { prisma } from "@/lib/prisma";
import { depositPercent, usdToKesRate } from "@/lib/paystack";
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
  adults?: number | null;
  children?: number | null;
  startDate: Date | null;
  endDate?: Date | null;
  pickupLocation?: string | null;
  pickupTime?: string | null;
  dropoffLocation?: string | null;
  dropoffTime?: string | null;
  accommodation?: string | null;
  transport?: string | null;
  depositPaidKes?: number | null;
  priceEstimate: number;
  status: string;
  notes: string | null;
  createdAt: Date;
};

const fmtDate = (d: Date | null | undefined) =>
  d
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(d))
    : "Flexible — to be agreed";

/** Human status label for the spec: Pending / Confirmed / Paid / Cancelled. */
const statusLabel = (s: string, depositPaid: number) => {
  if (s === "cancelled") return "CANCELLED";
  if (s === "completed") return "COMPLETED";
  if (depositPaid > 0) return s === "confirmed" ? "CONFIRMED · PAID" : "PAID";
  return s === "confirmed" ? "CONFIRMED" : "PENDING";
};

/** Fill/ink colors for the status pill (gold when settled, muted when pending). */
const statusPillColors = (s: string, depositPaid: number) => {
  if (s === "cancelled") return { fill: "#9d3a34", ink: "#f8f5ed" };
  if (s === "completed" || s === "confirmed" || depositPaid > 0)
    return { fill: GOLD, ink: NAVY };
  return { fill: "#e3dcc8", ink: NAVY_SOFT };
};

const fmtKes = (n: number) =>
  `KES ${n.toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;

/** Load the logo from public/images (best-effort — falls back to a wordmark). */
function loadLogo(): Buffer | null {
  const candidates = [
    path.join(process.cwd(), "public", "images", "logo.png"),
    path.join(process.cwd(), "public", "logo.png"),
  ];
  for (const p of candidates) {
    try {
      return fs.readFileSync(/* turbopackIgnore: true */ p);
    } catch {
      /* keep trying */
    }
  }
  return null;
}

/** Fetch remote image bytes (Unsplash) — best-effort for the invoice photos. */
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
 * Build a rich, branded A4 invoice PDF for a booking, covering the full
 * spec: guest, travelers, journey, dates, pickup & drop-off, day-by-day
 * itinerary, accommodation, transport, inclusions & exclusions, status,
 * payment summary, special requests, terms, next steps and contact details.
 *
 * Enriches the booking with the linked adventure (itinerary, inclusions,
 * inclusions, accommodation, transport) and up to TWO destination photos
 * (hero + a second gallery shot). Every asset is best-effort — missing
 * images/lodges degrade gracefully to a clean text layout.
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

  // Day-by-day plan: adventure itinerary when available, else derive from highlights.
  let itinerary: { day: number; title: string; description: string }[] = [];
  if (Array.isArray(adventure?.itinerary)) {
    itinerary = (adventure?.itinerary as { day: number; title: string; description: string }[]).map(
      (d, i) => ({
        day: typeof d.day === "number" ? d.day : i + 1,
        title: d.title ?? "Day",
        description: d.description ?? "",
      }),
    );
  } else if (adventure?.highlights?.length) {
    itinerary = adventure.highlights.map((h, i) => ({
      day: i + 1,
      title: h,
      description: "",
    }));
  }

  const inclusions = adventure?.inclusions ?? [];
  const exclusions = adventure?.exclusions ?? [];
  const accommodation =
    b.accommodation || adventure?.accommodation || "To be confirmed by your planner";
  const transport =
    b.transport || adventure?.transport || "To be confirmed by your planner";

  // Up to 2 destination photos (logo is separate) — hero + one secondary shot.
  const galleryIds =
    destination && destination.images?.length
      ? destination.images.slice(0, 2)
      : [destination?.image ?? null, adventure?.image ?? null].filter(Boolean);
  const heroUrl = galleryIds[0] ? `${img(galleryIds[0], 1000, 72)}&fm=jpg` : null;
  const secondaryUrl = galleryIds[1]
    ? `${img(galleryIds[1], 500, 60)}&fm=jpg`
    : null;
  const [logo, hero, secondary] = await Promise.all([
    Promise.resolve(loadLogo()),
    heroUrl ? fetchImageBuffer(heroUrl) : Promise.resolve(null),
    secondaryUrl ? fetchImageBuffer(secondaryUrl) : Promise.resolve(null),
  ]);

  const primaryDestination = b.destinations[0] ?? b.destination ?? "East Africa";
  const destinationList = b.destinations.length
    ? b.destinations
    : b.destination
      ? [b.destination]
      : [];

  // Payment summary — totals & deposit status only, no itemized breakdown.
  const rate = usdToKesRate();
  const percent = depositPercent();
  const totalKes = Math.round(b.priceEstimate * rate);
  const depositPaidKes = b.depositPaidKes ?? 0;
  const depositDueKes = Math.round((b.priceEstimate * (percent / 100)) * rate);
  const depositStatus =
    b.status === "confirmed" || b.status === "completed" || depositPaidKes > 0
      ? `Paid — ${fmtKes(depositPaidKes)}`
      : `Awaiting — ${fmtKes(depositDueKes)} due on confirmation`;
  const balanceKes = Math.max(0, totalKes - depositPaidKes);

  // Terms + next-steps copy (measured before drawing so the payment strip never
  // overlaps the text above it).
  const TERMS_COPY =
    "Deposits are non-refundable and confirm your dates. 50% of the journey balance is due 45 days before departure and the remainder 14 days before. Cancellations more than 45 days out receive a full refund of the balance paid; within 45 days, balances are non-refundable. Karen Adventures reserves the right to adjust itineraries for safety, weather or wildlife movement. Travel insurance is strongly recommended.";
  const NEXT_STEPS_COPY =
    b.status === "confirmed" || b.status === "completed"
      ? "1. A planner emails your detailed day-by-day itinerary within one working day.  2. Review, then settle the balance by bank transfer or card.  3. We confirm your lodges, transfers and guides — then it's time to pack."
      : "1. A planner contacts you within one working day to confirm your deposit.  2. Pay the 20% deposit (M-Pesa or card via Paystack) to secure your dates.  3. We email your itinerary and confirm lodges, transfers and guides.";

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
    const C = W - M * 2; // content width

    /* ------------------------------------------------------------ header */
    const headerH = 128;
    doc.rect(0, 0, W, headerH).fill(NAVY);
    doc.rect(0, headerH - 5, W, 5).fill(GOLD);

    if (logo) {
      try {
        doc.image(logo, M, 30, { height: 64, fit: [190, 64] });
      } catch {
        doc
          .font("Helvetica-Bold")
          .fontSize(24)
          .fillColor(IVORY)
          .text("Karen Adventures", M + 2, 42);
      }
    } else {
      doc
        .font("Helvetica-Bold")
        .fontSize(24)
        .fillColor(IVORY)
        .text("Karen Adventures", M + 2, 42);
    }
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(GOLD_SOFT)
      .text("EAST AFRICA · BEYOND THE ORDINARY", M + 2, 100, {
        characterSpacing: 2,
      });

    const rightX = W - M - 230;
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(IVORY)
      .text(
        b.status === "confirmed" || b.status === "completed"
          ? "BOOKING CONFIRMATION"
          : "BOOKING RESERVATION",
        rightX,
        32,
        { width: 230, align: "right" },
      );
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(GOLD)
      .text(`REF  ${b.reference}`, rightX, 54, { width: 230, align: "right" });
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(IVORY)
      .text(`Issued ${fmtDate(b.createdAt)}`, rightX, 72, {
        width: 230,
        align: "right",
      });

    /* ------------------------------------------------- hero + secondary */
    let y = headerH + 20;
    if (hero) {
      const heroW = C;
      const heroH = 150;
      try {
        doc
          .save()
          .rect(M, y, heroW, heroH)
          .clip()
          .image(hero, M, y, { fit: [heroW, heroH] })
          .restore();
        doc.rect(M, y, heroW, heroH).lineWidth(1).stroke("#ddd0b8");
        doc.rect(M, y + heroH - 44, heroW, 44).fillOpacity(0.55).fill(NAVY).fillOpacity(1);
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor(IVORY)
          .text(
            destinationList.length ? destinationList.join("  ·  ") : primaryDestination,
            M + 18,
            y + heroH - 32,
            { width: heroW - 36 },
          );
        y += heroH + 10;
      } catch {
        y += 8;
      }
    }

    // Secondary photo — a small portrait chip to the right of the greeting.
    let greetingW = C;
    if (secondary) {
      const chipW = 132;
      const chipH = 92;
      try {
        doc
          .save()
          .rect(W - M - chipW, y, chipW, chipH)
          .clip()
          .image(secondary, W - M - chipW, y, { fit: [chipW, chipH] })
          .restore();
        doc.rect(W - M - chipW, y, chipW, chipH).lineWidth(1).stroke("#ddd0b8");
        greetingW = C - chipW - 18;
      } catch {
        /* ignore */
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
        b.status === "confirmed" || b.status === "completed"
          ? "Your deposit has been received and your journey is confirmed. A Karen Adventures planner will email your detailed itinerary within one working day."
          : "Thank you for reserving your journey with Karen Adventures. A planner will contact you shortly to confirm your deposit and finalise the details.",
        M,
        y,
        { width: greetingW, lineGap: 4 },
      );
    y += 52;

    /* ---------------------------------------------------- journey box */
    const boxW = C;
    const boxH = 92;
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
        .fontSize(10.5)
        .fillColor(NAVY)
        .text(text, x, yy + 15, { width: colW - 8 });

    label(M + 20, y + 16, "Journey");
    value(M + 20, y + 16, b.adventureTitle);
    label(M + 20 + colW, y + 16, "Primary destination");
    value(M + 20 + colW, y + 16, primaryDestination);
    label(M + 20 + colW * 2, y + 16, "Status");
    // Status pill — color-coded, centered under the label.
    const statusText = statusLabel(b.status, depositPaidKes);
    const { fill: statusFill, ink: statusInk } = statusPillColors(
      b.status,
      depositPaidKes,
    );
    const pillW = doc
      .font("Helvetica-Bold")
      .fontSize(7.5)
      .widthOfString(statusText) + 16;
    const pillH = 14;
    const pillY = y + 31;
    doc
      .roundedRect(M + 20 + colW * 2, pillY, pillW, pillH, 7)
      .fill(statusFill);
    doc
      .font("Helvetica-Bold")
      .fontSize(7.5)
      .fillColor(statusInk)
      .text(statusText, M + 20 + colW * 2 + 8, pillY + 3.5, {
        width: pillW - 16,
        align: "center",
        characterSpacing: 0.6,
      });

    // Second row: travelers breakdown + dates
    label(M + 20, y + 46, "Travelers");
    value(
      M + 20,
      y + 46,
      `${b.travelers} guest${b.travelers === 1 ? "" : "s"}${
        b.adults != null || b.children != null
          ? `  ·  ${b.adults ?? 0} adult${(b.adults ?? 0) === 1 ? "" : "s"}${b.children ? `, ${b.children} child${b.children === 1 ? "" : "ren"}` : ""}`
          : ""
      }`,
    );
    label(M + 20 + colW, y + 46, "Dates");
    value(
      M + 20 + colW,
      y + 46,
      b.endDate
        ? `${fmtDate(b.startDate)} — ${fmtDate(b.endDate)}`
        : fmtDate(b.startDate),
    );
    label(M + 20 + colW * 2, y + 46, "Duration");
    value(
      M + 20 + colW * 2,
      y + 46,
      adventure?.duration ?? "To be agreed",
    );
    y += boxH + 22;

    /* -------------------------------------------------- booking details */
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(MUTED)
      .text("GUEST & TRAVEL DETAILS", M, y, { characterSpacing: 2 });
    y += 14;

    const rows: [string, string][] = [
      ["Guest", b.name],
      ["Email", b.email],
      ["Phone / WhatsApp", b.phone ?? "—"],
      ["Pick-up", [b.pickupLocation, b.pickupTime].filter(Boolean).join(" · ") || "To be arranged"],
      ["Drop-off", [b.dropoffLocation, b.dropoffTime].filter(Boolean).join(" · ") || "To be arranged"],
      ["Accommodation", accommodation],
      ["Transport", transport],
    ];

    const rowH = 21;
    for (const [k, v] of rows) {
      if (y + rowH > doc.page.height - 84) {
        doc.addPage();
        y = 48;
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor(MUTED)
          .text("GUEST & TRAVEL DETAILS (cont.)", M, y, { characterSpacing: 2 });
        y += 14;
      }
      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor(MUTED)
        .text(k, M, y, { width: 150 });
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(INK)
        .text(v, M + 160, y, { width: W - M * 2 - 160 });
      y += rowH;
    }
    y += 8;

    /* ---------------------------------------------------- destinations */
    if (destinationList.length > 1) {
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(MUTED)
        .text("DESTINATIONS IN YOUR JOURNEY", M, y, { characterSpacing: 2 });
      y += 15;
      doc
        .font("Helvetica")
        .fontSize(10.5)
        .fillColor(NAVY)
        .text(destinationList.join("   ·   "), M, y, { width: C });
      y += 24;
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
        .text("DAY-BY-DAY ITINERARY", M, y, { characterSpacing: 2 });
      y += 16;

      itinerary.forEach((item) => {
        if (y + 26 > doc.page.height - 92) {
          doc.addPage();
          y = 48;
          doc
            .font("Helvetica-Bold")
            .fontSize(8)
            .fillColor(MUTED)
            .text("DAY-BY-DAY ITINERARY (cont.)", M, y, { characterSpacing: 2 });
          y += 16;
        }
        doc
          .font("Helvetica-Bold")
          .fontSize(9.5)
          .fillColor(GOLD)
          .text(`Day ${item.day}`, M, y, { width: 52 });
        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor(NAVY)
          .text(item.title, M + 56, y, { width: C - 56 });
        y += 15;
        if (item.description) {
          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor(INK)
            .text(item.description, M + 56, y, {
              width: C - 56,
              lineGap: 2,
            });
          y += doc.heightOfString(item.description, { width: C - 56 }) + 8;
        } else {
          y += 4;
        }
      });
      y += 10;
    }

    /* ------------------------------------------ inclusions / exclusions */
    if (inclusions.length || exclusions.length) {
      if (y + 40 > doc.page.height - 90) {
        doc.addPage();
        y = 48;
      }
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(MUTED)
        .text("INCLUSIONS & EXCLUSIONS", M, y, { characterSpacing: 2 });
      y += 16;

      const colHalf = (C - 20) / 2;
      let yL = y;
      let yR = y;
      const leftW = colHalf;
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(NAVY)
        .text("INCLUDED", M, yL);
      yL += 15;
      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(INK)
        .text(
          (inclusions.length ? inclusions : ["Journey as described in the itinerary"]).join("\n"),
          M,
          yL,
          { width: leftW, lineGap: 3 },
        );
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(NAVY)
        .text("NOT INCLUDED", M + colHalf + 20, yR);
      yR += 15;
      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(INK)
        .text(
          (exclusions.length ? exclusions : ["International flights", "Visas & insurance", "Tips"]).join("\n"),
          M + colHalf + 20,
          yR,
          { width: leftW, lineGap: 3 },
        );
      y = Math.max(
        yL + doc.heightOfString(inclusions.join("\n"), { width: leftW }),
        yR + doc.heightOfString(exclusions.join("\n"), { width: leftW }),
      ) + 20;
    }

    if (b.notes) {
      y += 4;
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(MUTED)
        .text("SPECIAL REQUESTS", M, y, { characterSpacing: 2 });
      y += 14;
      doc
        .font("Helvetica-Oblique")
        .fontSize(9.5)
        .fillColor(INK)
        .text(b.notes, M, y, { width: C, lineGap: 3 });
      y += doc.heightOfString(b.notes, { width: C }) + 16;
    }

    /* ----------------------------------------------------- payment strip */
    // The payment strip is pinned just above the footer. Terms & next steps are
    // measured first so they can move to a new page rather than overlap the
    // strip when the invoice is dense.
    const footerH = 26;
    const stripH = 62;
    const stripY = doc.page.height - footerH - stripH - 20;

    const termsHeaderH = 14;
    const termsBodyH = doc.heightOfString(TERMS_COPY, { width: C }) + 4;
    const nextHeaderH = 14;
    const nextBodyH = doc.heightOfString(NEXT_STEPS_COPY, { width: C }) + 4;
    const legalBlockH =
      termsHeaderH + termsBodyH + nextHeaderH + nextBodyH + 16;

    // If the terms block won't fit above the strip, push it to a new page.
    if (y + legalBlockH > stripY - 8) {
      doc.addPage();
      y = 48;
    }

    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(MUTED)
      .text("CANCELLATION & BOOKING TERMS", M, y, { characterSpacing: 2 });
    y += termsHeaderH;
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(INK)
      .text(TERMS_COPY, M, y, { width: C, lineGap: 3 });
    y += termsBodyH;

    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(MUTED)
      .text("NEXT STEPS", M, y, { characterSpacing: 2 });
    y += nextHeaderH;
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(INK)
      .text(NEXT_STEPS_COPY, M, y, { width: C, lineGap: 3 });
    y += nextBodyH;

    // Draw the strip on the current page (bottom area, above the footer).
    doc.rect(M, stripY, boxW, stripH).fill(NAVY);
    doc.rect(M, stripY, 5, stripH).fill(GOLD);
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(GOLD_SOFT)
      .text("PAYMENT SUMMARY", M + 20, stripY + 12, { characterSpacing: 1.5 });

    const payCols: [string, string][] = [
      ["Journey total", b.priceEstimate > 0 ? `${formatPrice(b.priceEstimate)}  ·  ${fmtKes(totalKes)}` : "To be designed"],
      ["Deposit", depositStatus],
      ["Balance due", b.priceEstimate > 0 ? fmtKes(balanceKes) : "To be confirmed"],
    ];
    const payColW = (boxW - 40 - 24) / 3;
    payCols.forEach(([k, v], i) => {
      const x = M + 20 + i * (payColW + 12);
      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(GOLD_SOFT)
        .text(k.toUpperCase(), x, stripY + 26, { width: payColW, characterSpacing: 1 });
      doc
        .font(i === 0 ? "Times-Bold" : "Helvetica")
        .fontSize(i === 0 ? 15 : 9.5)
        .fillColor(IVORY)
        .text(v, x, stripY + 38, { width: payColW });
    });

    /* ---------------------------------------------------------- footer */
    const footerTop = doc.page.height - footerH;
    doc.rect(0, footerTop - 2, W, footerH + 2).fill(NAVY_SOFT);
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(IVORY)
      .text(
        `Karen Adventures · Karen, Nairobi, Kenya     ${WHATSAPP_DISPLAY}     ${CONTACT_EMAIL}     karenadventures.com`,
        M,
        footerTop + 5,
        { width: C, align: "center" },
      );

    doc.end();
  });
}
