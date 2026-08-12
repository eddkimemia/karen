import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/admin";

const STATUSES = ["new", "planned", "confirmed", "archived"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const data: { status?: string; notes?: string | null } = {};

  if (b.status !== undefined) {
    if (typeof b.status !== "string" || !STATUSES.includes(b.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    data.status = b.status;
  }
  if (b.notes !== undefined) {
    data.notes =
      typeof b.notes === "string" ? b.notes.trim().slice(0, 2000) || null : null;
  }

  try {
    await prisma.inquiry.update({ where: { id }, data });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.inquiry.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
  }
}
