import { NextResponse } from "next/server";
import { usdToKesRate } from "@/lib/paystack";

export const dynamic = "force-dynamic";

/** Visitor currency detection — Kenyans see KES, everyone else USD. */
export async function GET(req: Request) {
  const country =
    req.headers.get("x-vercel-ip-country")?.toUpperCase() ||
    // Local dev and non-Vercel hosts: default to Kenya so testing matches the
    // domestic experience; production traffic on Vercel is geolocated.
    "KE";

  return NextResponse.json({
    country,
    currency: country === "KE" ? "KES" : "USD",
    usdToKes: usdToKesRate(),
  });
}