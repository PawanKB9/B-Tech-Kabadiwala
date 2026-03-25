import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q");
    if (!q) return NextResponse.json([]);

    const key = process.env.NEXT_PUBLIC_MAPPLS_KEY;

    if (!key) {
      return NextResponse.json(
        { error: "Missing MAPPLS key" },
        { status: 500 }
      );
    }

    // ⭐ Use service area center or user location
    const location = "26.4983,80.3081"; // Kanpur example

    const url =
      "https://search.mappls.com/search/places/autosuggest/json" +
      `?query=${encodeURIComponent(q)}` +
      `&location=${location}` +
      `&access_token=${key}`;

    const r = await fetch(url);

    const text = await r.text();

    if (!r.ok) {
      console.error("Mappls error:", text);
      return NextResponse.json([], { status: r.status });
    }

    const data = JSON.parse(text);

    // ⭐ Return ONLY suggestions
    return NextResponse.json(data?.suggestedLocations || []);
  } catch (e: any) {
    console.error("Autosuggest crash:", e);
    return NextResponse.json([]);
  }
}