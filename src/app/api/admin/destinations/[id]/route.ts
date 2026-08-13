import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/admin";

export const dynamic = "force-dynamic";

const clean = (v: unknown, max = 5000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const parseList = (v: unknown) =>
  (typeof v === "string" ? v : "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 12);

/** Image list (one per line, Unsplash IDs) — keeps the first as the hero. */
const parseImages = (v: unknown) =>
  (typeof v === "string" ? v : "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 8);

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

  if (b.name !== undefined) {
    const name = clean(b.name, 120);
    if (name.length < 2) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    data.name = name;
  }
  if (b.region !== undefined) {
    const region = clean(b.region, 120);
    if (region.length < 2) {
      return NextResponse.json({ error: "Region is required." }, { status: 400 });
    }
    data.region = region;
  }
  if (b.country !== undefined) {
    const country = clean(b.country, 80) || "Kenya";
    data.country = country;
  }
  if (b.description !== undefined) {
    const description = clean(b.description, 2000);
    if (description.length < 10) {
      return NextResponse.json(
        { error: "Please write a short description (at least 10 characters)." },
        { status: 400 },
      );
    }
    data.description = description;
  }
  if (b.image !== undefined) data.image = clean(b.image, 200);
  if (b.imageAlt !== undefined) data.imageAlt = clean(b.imageAlt, 200);
  if (b.images !== undefined) {
    const images = parseImages(b.images);
    data.images = images;
    // The first gallery image is the hero — keep image in sync when provided.
    if (images.length) data.image = images[0];
  }

  if (b.latitude !== undefined || b.longitude !== undefined) {
    const lat = b.latitude !== undefined ? Number(b.latitude) : null;
    const lon = b.longitude !== undefined ? Number(b.longitude) : null;
    if (lat !== null && (!Number.isFinite(lat) || lat < -90 || lat > 90)) {
      return NextResponse.json({ error: "Invalid latitude." }, { status: 400 });
    }
    if (lon !== null && (!Number.isFinite(lon) || lon < -180 || lon > 180)) {
      return NextResponse.json({ error: "Invalid longitude." }, { status: 400 });
    }
    if (lat !== null) data.latitude = lat;
    if (lon !== null) data.longitude = lon;
  }

  if (b.bestExperiences !== undefined) {
    data.bestExperiences = parseList(b.bestExperiences);
  }

  if (b.trips !== undefined) {
    const tripSlugs = parseList(b.trips).slice(0, 8);
    const tripsToLink = tripSlugs.length
      ? await prisma.adventure.findMany({
          where: { slug: { in: tripSlugs } },
          select: { id: true },
        })
      : [];
    // The relation set helper needs the full field name here.
    (data as { recommendedTrips?: { set: { id: string }[] } }).recommendedTrips = {
      set: tripsToLink.map((t) => ({ id: t.id })),
    };
  }

  try {
    const destination = await prisma.destination.update({ where: { id }, data });
    return NextResponse.json({ ok: true, destination });
  } catch (err) {
    const isDuplicate =
      err instanceof Error && "code" in err && (err as { code?: string }).code === "P2002";
    if (isDuplicate) {
      return NextResponse.json(
        { error: "A destination with this slug already exists." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Destination not found." }, { status: 404 });
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
    await prisma.destination.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Destination not found." }, { status: 404 });
  }
}
