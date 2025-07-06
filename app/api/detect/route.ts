import { NextRequest, NextResponse } from "next/server";
import { lingo } from "@/lib/lingo";

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  try {
    const locale = await lingo.recognizeLocale(text);
    return NextResponse.json({ language: locale });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Detection failed" }, { status: 500 });
  }
}
