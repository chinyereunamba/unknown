import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  try {
    const firecrawlRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url: url,
      }),
      cache: "no-store",
    });

    const data = await firecrawlRes.json();

    if (!firecrawlRes.ok) {
      console.error("Firecrawl error:", data);
      return NextResponse.json(
        { error: data.error || "Failed to fetch data" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Server error. Try again." },
      { status: 500 }
    );
  }
}
