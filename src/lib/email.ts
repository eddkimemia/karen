import nodemailer from "nodemailer";
import { formatPrice } from "@/lib/utils";
import { buildBookingPdf } from "@/lib/pdf";
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/site";

/* Subsets of the Prisma models — enough to build every email. */
type InquiryLike = {
  name: string;
  email: string;
  phone: string | null;
  destination: string | null;
  tripType: string | null;
  travelers: string | null;
  travelDate: string | null;
  message: string;
};

type BookingLike = {
  reference: string;
  adventureSlug?: string | null;
  adventureTitle: string;
  name: string;
  email: string;
  phone: string | null;
  destination: string | null;
  destinations?: string[];
  travelers: number;
  startDate: Date | null;
  priceEstimate: number;
  status: string;
  notes: string | null;
  createdAt?: Date;
};

/* ------------------------------------------------------------------ */
/*  Configuration (from environment)                                   */
/* ------------------------------------------------------------------ */

/** True when SMTP_HOST + SMTP_USER are set — otherwise emails are skipped. */
export function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);
}

/** Where team notifications go (contact form, bookings, subscribers). */
export function teamEmail() {
  return process.env.MAIL_TO?.trim() || CONTACT_EMAIL;
}

function fromAddress() {
  return (
    process.env.MAIL_FROM?.trim() ||
    `"Karen Adventures" <${process.env.SMTP_USER ?? teamEmail()}>`
  );
}

function transporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER ?? "",
      pass: process.env.SMTP_PASS ?? "",
    },
  });
}

type MailOptions = {
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: { filename: string; content: Buffer }[];
};

/**
 * Send an email. Returns false (and logs) if SMTP isn't configured or the
 * send fails — callers should never let email break the main flow.
 */
export async function sendMail({
  to,
  subject,
  text,
  html,
  attachments,
}: MailOptions) {
  if (!smtpConfigured()) {
    console.warn(
      "[mail] SMTP not configured (SMTP_HOST/SMTP_USER) — email skipped.",
    );
    return false;
  }
  try {
    await transporter().sendMail({
      from: fromAddress(),
      to,
      subject,
      text,
      html,
      attachments,
    });
    return true;
  } catch (err) {
    console.error("[mail] Failed to send email:", err);
    return false;
  }
}

/* ------------------------------------------------------------------ */
/*  Branded email shell                                                */
/* ------------------------------------------------------------------ */

const NAVY = "#071a33";
const GOLD = "#c9a227";

function shell(title: string, body: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f3efe4;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3efe4;padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e4dcc8;border-top:4px solid ${GOLD};">
          <tr>
            <td style="background:${NAVY};padding:28px 32px;">
              <p style="margin:0;color:#f8f5ed;font-size:22px;letter-spacing:0.02em;">
                Karen Adventures<span style="color:${GOLD};">.</span>
              </p>
              <p style="margin:6px 0 0;color:#e8d7a8;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;">Discover Kenya · Beyond the Ordinary</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px;color:${NAVY};font-size:24px;font-weight:600;">${title}</h1>
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #eee5d2;color:#8a7f63;font-size:12px;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
              Karen Adventures · Karen, Nairobi, Kenya<br/>
              ${WHATSAPP_DISPLAY} · <a href="mailto:${CONTACT_EMAIL}" style="color:${GOLD};">${CONTACT_EMAIL}</a>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function detailRow(label: string, value: string) {
  return `<tr>
    <td style="padding:7px 0;color:#8a7f63;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;width:140px;font-family:Arial,Helvetica,sans-serif;">${label}</td>
    <td style="padding:7px 0;color:#1c1c1c;font-size:15px;">${value}</td>
  </tr>`;
}

/* ------------------------------------------------------------------ */
/*  Notifications                                                      */
/* ------------------------------------------------------------------ */

/** New contact-form inquiry → the team. */
export async function notifyNewInquiry(i: InquiryLike) {
  const body = `
    <p style="margin:0 0 20px;color:#444;font-size:15px;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
      A new journey enquiry just came in through the website.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
      ${detailRow("Name", i.name)}
      ${detailRow("Email", `<a href="mailto:${i.email}" style="color:${GOLD};">${i.email}</a>`)}
      ${detailRow("Phone", i.phone ?? "—")}
      ${detailRow("Destination", i.destination ?? "Anywhere in Kenya")}
      ${detailRow("Journey", i.tripType ?? "Still deciding")}
      ${detailRow("Travelers", i.travelers ?? "—")}
      ${detailRow("Dates", i.travelDate ?? "Flexible")}
    </table>
    <p style="margin:18px 0 6px;color:#8a7f63;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-family:Arial,Helvetica,sans-serif;">Message</p>
    <blockquote style="margin:0;padding:14px 18px;background:#f8f5ed;border-left:3px solid ${GOLD};color:#333;font-size:15px;line-height:1.7;font-style:italic;">“${i.message}”</blockquote>
    <p style="margin:24px 0 0;font-family:Arial,Helvetica,sans-serif;">
      <a href="${process.env.APP_URL ?? "http://localhost:3000"}/admin/inquiries" style="background:${GOLD};color:${NAVY};padding:12px 20px;text-decoration:none;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">Open in admin</a>
    </p>`;

  return sendMail({
    to: teamEmail(),
    subject: `New enquiry from ${i.name}`,
    text: `New enquiry from ${i.name} (${i.email}) — ${i.destination ?? "Anywhere in Kenya"}. ${i.message}`,
    html: shell("A new journey enquiry", body),
  });
}

/** New booking (reservation, with or without deposit) → the team. */
export async function notifyNewBooking(b: BookingLike) {
  const body = `
    <p style="margin:0 0 20px;color:#444;font-size:15px;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
      A guest placed a booking reservation on the website.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
      ${detailRow("Reference", b.reference)}
      ${detailRow("Journey", b.adventureTitle)}
      ${detailRow("Guest", b.name)}
      ${detailRow("Email", `<a href="mailto:${b.email}" style="color:${GOLD};">${b.email}</a>`)}
      ${detailRow("Phone", b.phone ?? "—")}
      ${detailRow("Destinations", (b.destinations?.length ? b.destinations : b.destination ? [b.destination] : []).join(", ") || "—")}
      ${detailRow("Travelers", String(b.travelers))}
      ${detailRow("Start date", b.startDate ? b.startDate.toISOString().slice(0, 10) : "Flexible")}
      ${detailRow("Estimate", b.priceEstimate > 0 ? `${formatPrice(b.priceEstimate)} (KES ${Math.round(b.priceEstimate * (Number(process.env.USD_TO_KES_RATE) || 130)).toLocaleString("en-KE")})` : "To be designed")}
      ${detailRow("Status", b.status)}
    </table>
    ${b.notes ? `<p style="margin:18px 0 6px;color:#8a7f63;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-family:Arial,Helvetica,sans-serif;">Notes</p><p style="margin:0;color:#333;font-size:15px;line-height:1.7;">${b.notes}</p>` : ""}
    <p style="margin:24px 0 0;font-family:Arial,Helvetica,sans-serif;">
      <a href="${process.env.APP_URL ?? "http://localhost:3000"}/admin/bookings" style="background:${GOLD};color:${NAVY};padding:12px 20px;text-decoration:none;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">Open in admin</a>
    </p>`;

  return sendMail({
    to: teamEmail(),
    subject: `New booking ${b.reference} — ${b.adventureTitle}`,
    text: `New booking ${b.reference} from ${b.name} (${b.email}) for ${b.adventureTitle}.`,
    html: shell("A new booking reservation", body),
  });
}

/**
 * Confirmation to the guest once their deposit is confirmed — includes the
 * branded booking PDF as an attachment (never blocks on PDF failures).
 */
export async function sendBookingConfirmation(b: BookingLike) {
  const body = `
    <p style="margin:0 0 20px;color:#444;font-size:15px;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
      Karibu — welcome. Your deposit has been received and your journey is confirmed.
      A Karen Adventures planner will email your detailed itinerary within one working day.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
      ${detailRow("Booking ref", b.reference)}
      ${detailRow("Journey", b.adventureTitle)}
      ${detailRow("Destinations", (b.destinations?.length ? b.destinations : b.destination ? [b.destination] : []).join(", ") || "—")}
      ${detailRow("Travelers", String(b.travelers))}
      ${detailRow("Start date", b.startDate ? b.startDate.toISOString().slice(0, 10) : "Flexible")}
      ${detailRow("Estimate", b.priceEstimate > 0 ? formatPrice(b.priceEstimate) : "To be designed")}
    </table>
    <p style="margin:22px 0 0;color:#444;font-size:14px;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
      A copy of your booking confirmation — including your destinations and
      itinerary highlights — is attached as a PDF. Questions in the meantime?
      Chat with us on WhatsApp at <a href="${whatsappLink()}" style="color:${GOLD};">${WHATSAPP_DISPLAY}</a> or reply to this email.
    </p>`;

  // Generate the branded PDF (best-effort — a failure shouldn't block email).
  let pdf: Buffer | null = null;
  try {
    pdf = await buildBookingPdf({
      reference: b.reference,
      adventureSlug: b.adventureSlug ?? null,
      adventureTitle: b.adventureTitle,
      destination: b.destination,
      destinations: b.destinations ?? [],
      name: b.name,
      email: b.email,
      phone: b.phone,
      travelers: b.travelers,
      startDate: b.startDate,
      priceEstimate: b.priceEstimate,
      status: b.status,
      notes: b.notes,
      createdAt: b.createdAt ?? new Date(),
    });
  } catch (err) {
    console.error("[mail] Failed to generate booking PDF:", err);
  }

  return sendMail({
    to: b.email,
    subject: `Your Karen Adventures booking is confirmed (${b.reference})`,
    text: `Karibu! Your booking ${b.reference} for ${b.adventureTitle} is confirmed. A planner will be in touch within one working day.`,
    html: shell("Karibu — you're booked.", body),
    attachments: pdf
      ? [
          {
            filename: `karen-adventures-booking-${b.reference}.pdf`,
            content: pdf,
          },
        ]
      : undefined,
  });
}

/**
 * Team copy of a paid booking — the invoice PDF attached for records.
 * Sent alongside the guest confirmation when a deposit clears.
 */
export async function notifyTeamBookingPaid(b: BookingLike) {
  const body = `
    <p style="margin:0 0 20px;color:#444;font-size:15px;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
      A deposit has been received and this booking is now confirmed. The
      customer&rsquo;s branded invoice is attached for your records.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
      ${detailRow("Booking ref", b.reference)}
      ${detailRow("Journey", b.adventureTitle)}
      ${detailRow("Guest", b.name)}
      ${detailRow("Email", `<a href="mailto:${b.email}" style="color:${GOLD};">${b.email}</a>`)}
      ${detailRow("Phone", b.phone ?? "—")}
      ${detailRow("Destinations", (b.destinations?.length ? b.destinations : b.destination ? [b.destination] : []).join(", ") || "—")}
      ${detailRow("Travelers", String(b.travelers))}
      ${detailRow("Start date", b.startDate ? b.startDate.toISOString().slice(0, 10) : "Flexible")}
      ${detailRow("Estimate", b.priceEstimate > 0 ? formatPrice(b.priceEstimate) : "To be designed")}
    </table>
    <p style="margin:24px 0 0;font-family:Arial,Helvetica,sans-serif;">
      <a href="${process.env.APP_URL ?? "http://localhost:3000"}/admin/bookings" style="background:${GOLD};color:${NAVY};padding:12px 20px;text-decoration:none;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">Open in admin</a>
    </p>`;

  // Same branded PDF as the guest receives (best-effort).
  let pdf: Buffer | null = null;
  try {
    pdf = await buildBookingPdf({
      reference: b.reference,
      adventureSlug: b.adventureSlug ?? null,
      adventureTitle: b.adventureTitle,
      destination: b.destination,
      destinations: b.destinations ?? [],
      name: b.name,
      email: b.email,
      phone: b.phone,
      travelers: b.travelers,
      startDate: b.startDate,
      priceEstimate: b.priceEstimate,
      status: b.status,
      notes: b.notes,
      createdAt: b.createdAt ?? new Date(),
    });
  } catch (err) {
    console.error("[mail] Failed to generate team invoice PDF:", err);
  }

  return sendMail({
    to: teamEmail(),
    subject: `Invoice paid — ${b.reference} (${b.adventureTitle})`,
    text: `Deposit received for ${b.reference} — ${b.adventureTitle}. Invoice attached.`,
    html: shell("Invoice received", body),
    attachments: pdf
      ? [
          {
            filename: `karen-adventures-booking-${b.reference}.pdf`,
            content: pdf,
          },
        ]
      : undefined,
  });
}

/** New newsletter subscriber → the team. */
export async function notifyNewSubscriber(email: string) {
  return sendMail({
    to: teamEmail(),
    subject: `New newsletter subscriber: ${email}`,
    text: `New newsletter subscriber: ${email}`,
    html: shell(
      "New subscriber",
      `<p style="margin:0;color:#444;font-size:15px;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">A new reader joined The Dispatches: <a href="mailto:${email}" style="color:${GOLD};">${email}</a></p>`,
    ),
  });
}

/** Welcome email to a new subscriber. */
export async function sendSubscriberWelcome(email: string) {
  return sendMail({
    to: email,
    subject: "Welcome to The Dispatches",
    text: "Karibu! You're on the list — occasional letters from the road, no spam, ever.",
    html: shell(
      "Welcome to The Dispatches",
      `<p style="margin:0;color:#444;font-size:15px;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
        Karibu! You're on the list. Expect occasional letters from the road —
        journeys, wildlife and the quiet corners of Kenya. No spam, ever.
      </p>`,
    ),
  });
}
