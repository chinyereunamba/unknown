"use client";
import { Card, Button } from "@/components";
import { Link as HeroLink } from "@heroui/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SummaryData {
  summary: string;
  originalLength: number;
  summaryLength: number;
  reductionPercentage: number;
}

export default function SummaryPage() {
  const [extractedText, setExtractedText] = useState<string>("");
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const text = localStorage.getItem("summaryText");
    if (text) {
      setExtractedText(text);
      // Call summarization API
      summarizeText(text);
    } else {
      // Redirect to home if no summary text is found
      router.push("/");
    }
  }, [router]);

  const summarizeText = async (text: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/summarize", {
        method: 'POST',
        body: JSON.stringify({
          extractedText: text,
          targetLanguage: "en",
          role: "business_user",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to summarize text");
      }

      setSummaryData(data);
    } catch (err) {
      console.error("Summarization error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during summarization"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewSummary = () => {
    localStorage.removeItem("summaryText");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg mb-2">Generating your summary...</p>
          <p className="text-sm text-neutral-500">
            This may take a few moments
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Summarization Failed</h2>
          <p className="text-neutral-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => summarizeText(extractedText)}
              color="primary"
              variant="solid"
              className="font-semibold"
            >
              Try Again
            </Button>
            <Button
              as={HeroLink}
              href="/"
              color="default"
              variant="bordered"
              className="font-semibold"
            >
              Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-4xl flex flex-col items-center justify-center text-center gap-8 py-12">
          <h1 className="font-extrabold text-4xl md:text-5xl mb-2">
            Here's Your Summary
          </h1>
          <p className="text-lg text-neutral-500 mb-6">
            We've simplified the content for you—see the key points below.
          </p>

          {/* Summary Statistics */}
          {summaryData && (
            <Card className="w-full rounded-xl shadow p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {summaryData.originalLength.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-500">
                    Original Characters
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {summaryData.summaryLength.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-500">
                    Summary Characters
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {summaryData.reductionPercentage}%
                  </div>
                  <div className="text-sm text-neutral-500">Reduction</div>
                </div>
              </div>
            </Card>
          )}

          {/* Summary Card */}
          <Card className="w-full rounded-xl shadow p-8 mb-6 text-left">
            <div className="text-lg">
              <span className="block font-semibold mb-4 text-xl">
                AI Summary:
              </span>
              <div className=" leading-relaxed whitespace-pre-wrap">
                {summaryData?.summary || "No summary available"}
              </div>
            </div>
          </Card>

          {/* Original Text Preview */}
          <Card className="w-full rounded-xl shadow p-6 mb-6">
            <div className="">
              <span className="block font-semibold mb-4 text-lg">
                Original Text Preview:
              </span>
              <div className="leading-relaxed whitespace-pre-wrap text-sm max-h-32 overflow-y-auto">
                {extractedText.slice(0, 300)}
                {extractedText.length > 300 && (
                  <span className="text-neutral-400">... (truncated)</span>
                )}
              </div>
            </div>
          </Card>

          {/* Action Steps Card */}
          <Card className="w-full rounded-xl shadow p-8 mb-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">
                What would you like to do next?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  as={HeroLink}
                  href="/"
                  color="primary"
                  variant="solid"
                  className="font-semibold"
                >
                  Create New Summary
                </Button>
                <Button
                  color="default"
                  variant="bordered"
                  className="font-semibold"
                >
                  Save Summary
                </Button>
                <Button
                  color="default"
                  variant="bordered"
                  className="font-semibold"
                >
                  Share Summary
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
