import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyNewSubscriber, sendSubscriberWelcome } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = (
    typeof (body as { email?: unknown })?.email === "string"
      ? (body as { email: string }).email.trim().toLowerCase().slice(0, 160)
      : ""
  );

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  try {
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    await prisma.subscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    // Notify the team; welcome genuinely new subscribers.
    await notifyNewSubscriber(email);
    if (!existing) await sendSubscriberWelcome(email);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Couldn't subscribe right now — please try again." },
      { status: 500 },
    );
  }
}
