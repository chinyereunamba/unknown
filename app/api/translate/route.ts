import { NextRequest, NextResponse } from "next/server";
import { lingo } from "@/lib/lingo";

export async function POST(req: NextRequest) {
  const {
    text,
    targetLocale,
    targetLanguage,
    sourceLocale = null,
  } = await req.json();

  const targetLang = targetLocale || targetLanguage;

  if (!text || !targetLang) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const result = await lingo.localizeText(text, {
      sourceLocale,
      targetLocale: targetLang,
    });

    return NextResponse.json({ translatedText: result });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
