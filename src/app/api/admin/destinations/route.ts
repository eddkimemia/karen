import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/admin";

export const dynamic = "force-dynamic";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const clean = (v: unknown, max = 5000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const parseList = (v: unknown) =>
  (typeof v === "string" ? v : "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 12);

function validLatLng(body: Record<string, unknown>) {
  const lat = Number(body.latitude);
  const lon = Number(body.longitude);
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) return null;
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) return null;
  return { lat, lon };
}

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" },
    include: { recommendedTrips: { select: { id: true, slug: true, title: true } } },
  });
  return NextResponse.json({ destinations });
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
  const name = clean(b.name, 120);
  const region = clean(b.region, 120);
  const description = clean(b.description, 2000);
  const image = clean(b.image, 200);
  const imageAlt = clean(b.imageAlt, 200);
  const coords = validLatLng(b);

  if (name.length < 2) {
    return NextResponse.json({ error: "Destination name is required." }, { status: 400 });
  }
  if (region.length < 2) {
    return NextResponse.json({ error: "Region is required." }, { status: 400 });
  }
  if (description.length < 10) {
    return NextResponse.json(
      { error: "Please write a short description (at least 10 characters)." },
      { status: 400 },
    );
  }
  if (!coords) {
    return NextResponse.json(
      { error: "Please provide valid latitude and longitude values." },
      { status: 400 },
    );
  }

  const slug = slugify(clean(b.slug, 160)) || slugify(name);
  const bestExperiences = parseList(b.bestExperiences);

  // Link recommended trips by adventure slug (best-effort).
  const tripSlugs = parseList(b.trips).slice(0, 8);
  const tripsToLink = tripSlugs.length
    ? await prisma.adventure.findMany({
        where: { slug: { in: tripSlugs } },
        select: { id: true },
      })
    : [];

  try {
    const destination = await prisma.destination.create({
      data: {
        slug,
        name,
        region,
        description,
        image,
        imageAlt,
        latitude: coords.lat,
        longitude: coords.lon,
        bestExperiences,
        recommendedTrips: { connect: tripsToLink.map((t) => ({ id: t.id })) },
      },
    });
    return NextResponse.json({ ok: true, destination }, { status: 201 });
  } catch (err) {
    const isDuplicate =
      err instanceof Error && "code" in err && (err as { code?: string }).code === "P2002";
    if (isDuplicate) {
      return NextResponse.json(
        { error: "A destination with this slug already exists — try a different name." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "We couldn't save the destination — please try again." },
      { status: 500 },
    );
  }
}
