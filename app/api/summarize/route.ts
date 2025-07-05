import { NextRequest, NextResponse } from "next/server";
import { franc } from "franc";

interface SummarizeRequest {
  extractedText: string;
  targetLanguage?: string;
  role?: string;
}

interface SummarizeResponse {
  summary: string;
  originalLength: number;
  summaryLength: number;
  reductionPercentage: number;
}

export async function POST(req: NextRequest) {
  let extractedText = "";
  let targetLanguage = "en";
  let role = "business_user";

  try {
    const requestData: SummarizeRequest = await req.json();
    extractedText = requestData.extractedText;
    role = requestData.role || "business_user";

    // 1️⃣ Auto Detect Language
    const langCode = franc(extractedText, { minLength: 10 }); // returns ISO 639-3 code
    const langMap: Record<string, string> = {
      eng: "en",
      fra: "fr",
      deu: "de",
      spa: "es",
    };
    targetLanguage = langMap[langCode] || "en";

    // Input validation
    if (!extractedText || typeof extractedText !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid extractedText parameter" },
        { status: 400 }
      );
    }

    if (extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: "Extracted text cannot be empty" },
        { status: 400 }
      );
    }

    if (extractedText.length > 5000) {
      return NextResponse.json(
        { error: "Text too long. Maximum 5,000 characters allowed." },
        { status: 400 }
      );
    }

    // Check if OpenRouter API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY not configured");
      return NextResponse.json(
        { error: "Summarization service not configured" },
        { status: 500 }
      );
    }

    // Create a role-specific prompt
    const rolePrompts = {
      business_user:
        "Summarize this text for a business professional. Focus on key insights, main points, and actionable information. Keep it concise and professional.",
      student:
        "Summarize this text for a student. Focus on main concepts, key facts, and important details for learning purposes.",
      researcher:
        "Summarize this text for a researcher. Focus on methodology, findings, conclusions, and implications.",
      general:
        "Provide a clear and concise summary of this text, highlighting the main points and key information.",
    };

    const prompt =
      rolePrompts[role as keyof typeof rolePrompts] || rolePrompts.general;

    // Call OpenRouter API for AI summarization
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://webwhisper-ai.vercel.app",
          "X-Title": "WebWhisper AI",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          messages: [
            {
              role: "system",
              content:
                "You are a professional summarization assistant. Create clear, concise, and accurate summaries that capture the essential information from the provided text.",
            },
            {
              role: "user",
              content: `${prompt}\n\nText to summarize:\n${extractedText}`,
            },
          ],
          max_tokens: 500,
          temperature: 0.3,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API error:", response.status, errorData);

      return NextResponse.json(
        {
          error: "Failed to generate summary",
          details: errorData.error?.message || `HTTP ${response.status}`,
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    const summary = result.choices?.[0]?.message?.content?.trim();

    if (!summary) {
      return NextResponse.json(
        { error: "No summary generated from the API" },
        { status: 500 }
      );
    }

    // Calculate statistics
    const originalLength = extractedText.length;
    const summaryLength = summary.length;
    const reductionPercentage = Math.round(
      ((originalLength - summaryLength) / originalLength) * 100
    );

    const responseData: SummarizeResponse = {
      summary,
      originalLength,
      summaryLength,
      reductionPercentage,
    };

    console.log(
      `AI Summarization completed: ${originalLength} → ${summaryLength} chars (${reductionPercentage}% reduction)`
    );

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Summarization API error:", error);
    console.error("Request details:", {
      textLength: extractedText?.length || 0,
      targetLanguage,
      role,
    });

    return NextResponse.json(
      {
        error: "Internal server error during summarization",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
