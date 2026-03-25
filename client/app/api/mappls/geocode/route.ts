import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address)
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  const key = process.env.NEXT_PUBLIC_MAPPLS_KEY || "ee287c1a53dc92e27751abf2375968ef";

  const url = `https://apis.mappls.com/advancedmaps/v1/${key}/geo_code?address=${encodeURIComponent(address)}`;

  const r = await fetch(url);
  const data = await r.json();

  return NextResponse.json(data);
}