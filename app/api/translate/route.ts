import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: "Missing text or language" }, { status: 400 });
    }

    const response = await fetch("https://api.lingo.dev/v1/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LINGODOTDEV_API_KEY}`,
      },
      body: JSON.stringify({
        text,
        target_language: targetLanguage, // e.g., "fr" or "es"
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: "Translation failed", details: error }, { status: 500 });
    }

    const result = await response.json();
    const translatedText = result.translated_text;

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
