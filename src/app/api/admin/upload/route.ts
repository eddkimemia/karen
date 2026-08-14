import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { isAdminAuthed } from "@/lib/admin";

export const dynamic = "force-dynamic";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const MAX_BYTES = 6 * 1024 * 1024; // 6 MB

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function POST(req: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Could not read the upload." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPG, PNG, WebP, GIF and AVIF images are allowed." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image is too large — please keep it under 6 MB." },
      { status: 400 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const name = `${randomBytes(12).toString("hex")}.${EXT[file.type]}`;

  try {
    // Production: Vercel Blob (needs BLOB_READ_WRITE_TOKEN). Without the
    // token we fall back to a local public/uploads/ folder (dev only — the
    // Vercel filesystem is read-only at runtime).
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { url } = await put(`uploads/${name}`, bytes, {
        access: "public",
        contentType: file.type,
      });
      return NextResponse.json({ ok: true, url });
    }

    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), bytes);
    return NextResponse.json({ ok: true, url: `/uploads/${name}` });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[upload] Failed to store image:", detail);
    let message: string;
    if (/private store/i.test(detail)) {
      message =
        "Your Blob store is set to private. Open Vercel → Storage → your Blob store → Settings → Access, switch it to Public, then try again.";
    } else if (process.env.BLOB_READ_WRITE_TOKEN) {
      message = `Upload failed: ${detail}`;
    } else {
      message =
        "Blob storage is not configured — add BLOB_READ_WRITE_TOKEN to the Vercel environment, or use a link instead.";
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}