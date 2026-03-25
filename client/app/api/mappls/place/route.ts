import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const eloc = req.nextUrl.searchParams.get("eloc");
  if (!eloc) return NextResponse.json({ error: "Missing eloc" }, { status: 400 });

  const key = process.env.NEXT_PUBLIC_MAPPLS_KEY || "ee287c1a53dc92e27751abf2375968ef";
  const url = `https://apis.mappls.com/advancedmaps/v1/${key}/place/detail?eloc=${eloc}`;

  const r = await fetch(url);
  const data = await r.json();

  return NextResponse.json(data);
}