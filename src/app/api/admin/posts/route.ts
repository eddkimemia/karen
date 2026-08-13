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

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      image: true,
      imageAlt: true,
      published: true,
      publishedAt: true,
      updatedAt: true,
    },
  });
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const title = clean(b.title, 160);
  if (title.length < 3) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  const content = clean(b.content, 50000);
  if (content.length < 10) {
    return NextResponse.json({ error: "Content is required." }, { status: 400 });
  }
  const slug =
    clean(b.slug, 120) ||
    slugify(title) ||
    `post-${Date.now().toString(36)}`;

  const category = clean(b.category, 60) || "Journal";
  const author = clean(b.author, 80) || "Karen Adventures";
  const image = clean(b.image, 300) || "1547471080-7cc2caa01a7e";
  const imageAlt = clean(b.imageAlt, 300) || title;

  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json(
      { error: "A post with this slug already exists." },
      { status: 409 },
    );
  }

  const publishedAt =
    typeof b.publishedAt === "string" && !Number.isNaN(Date.parse(b.publishedAt))
      ? new Date(b.publishedAt)
      : new Date();

  const post = await prisma.blogPost.create({
    data: {
      slug,
      title,
      excerpt: clean(b.excerpt, 400) || title,
      content,
      category,
      author,
      image,
      imageAlt,
      publishedAt,
      published: b.published !== false,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
