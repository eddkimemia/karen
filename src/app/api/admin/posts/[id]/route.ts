import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/admin";

export const dynamic = "force-dynamic";

const clean = (v: unknown, max = 10000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 120);

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
  const data: Record<string, unknown> = {};

  if (b.title !== undefined) {
    const title = clean(b.title, 160);
    if (title.length < 3) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    data.title = title;
  }
  if (b.slug !== undefined) {
    const slug = slugify(clean(b.slug, 120)) || undefined;
    if (slug) {
      const existing = await prisma.blogPost.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: "A post with this slug already exists." },
          { status: 409 },
        );
      }
      data.slug = slug;
    }
  }
  if (b.excerpt !== undefined) {
    data.excerpt = clean(b.excerpt, 400) || undefined;
  }
  if (b.content !== undefined) {
    const content = clean(b.content, 50000);
    if (content.length < 10) {
      return NextResponse.json({ error: "Content is required." }, { status: 400 });
    }
    data.content = content;
  }
  if (b.category !== undefined) data.category = clean(b.category, 60) || "Journal";
  if (b.author !== undefined) data.author = clean(b.author, 80) || "Karen Adventures";
  if (b.image !== undefined) data.image = clean(b.image, 300) || "1547471080-7cc2caa01a7e";
  if (b.imageAlt !== undefined) data.imageAlt = clean(b.imageAlt, 300);
  if (b.published !== undefined) data.published = b.published === true;
  if (b.publishedAt !== undefined) {
    const d =
      typeof b.publishedAt === "string" && !Number.isNaN(Date.parse(b.publishedAt))
        ? new Date(b.publishedAt)
        : undefined;
    if (d) data.publishedAt = d;
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data,
    select: { id: true, slug: true, title: true, updatedAt: true },
  });
  return NextResponse.json({ post });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
