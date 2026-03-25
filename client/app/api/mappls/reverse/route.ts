import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lng = req.nextUrl.searchParams.get("lng");

  if (!lat || !lng)
    return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });

  const key = process.env.NEXT_PUBLIC_MAPPLS_KEY || "ee287c1a53dc92e27751abf2375968ef";
  const url = `https://apis.mappls.com/advancedmaps/v1/${key}/rev_geocode?lat=${lat}&lng=${lng}`;

  const r = await fetch(url);
  const data = await r.json();

  return NextResponse.json(data);
}