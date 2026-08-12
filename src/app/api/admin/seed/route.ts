import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin";
import { runSeed } from "../../../../../prisma/seed";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * On-demand database seeding for the admin console.
 * Fixes an empty production database (e.g. fresh Vercel DB) without waiting
 * for a redeploy — the same runSeed() the build pipeline executes.
 */
export async function POST() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runSeed();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[seed] Failed to seed database:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error ? err.message : "Seeding failed — check server logs.",
      },
      { status: 500 },
    );
  }
}
