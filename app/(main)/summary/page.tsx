"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Copy,
  Download,
  Languages,
  FileText,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { motion } from "framer-motion";

interface SummaryData {
  summary: string;
  originalLength: number;
  summaryLength: number;
  reductionPercentage: number;
}

export default function SummaryPage() {
  const [extractedText, setExtractedText] = useState<string>("");
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);

  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("spanish");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const [copied, setCopied] = useState(false);

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
        method: "POST",
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

  const copyToClipboard = () => {
    if (!summaryData) return;
    navigator.clipboard.writeText(summaryData.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg mb-2">Generating your summary...</p>
          <p className="text-sm text-muted-foreground">
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
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => summarizeText(extractedText)}
              className="font-semibold"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
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
      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl flex flex-col items-center justify-center text-center gap-8 py-12"
        >
          <h1 className="font-extrabold text-4xl md:text-5xl mb-2">
            Here's Your Summary
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            We've simplified the content for you—see the key points below.
          </p>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">
              Summary <span className="text-gradient">Generated</span>
            </h1>
            <p className="text-muted-foreground">
              Your document has been successfully summarized
            </p>
          </div>

          {/* Summary Statistics */}
          {summaryData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <Card className="text-center shadow-soft">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {summaryData.originalLength.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Original Words
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center shadow-soft">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {summaryData.summaryLength.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Summary Words
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center shadow-soft">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {summaryData.reductionPercentage}%
                  </div>
                  <div className="text-sm text-muted-foreground">Reduction</div>
                </CardContent>
              </Card>
              <Card className="text-center shadow-soft">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {/* {stats.readingTime} */}2 mins
                    {/* TODO: Calculate reading time */}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Reading Time
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Summary Card */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span>AI-Generated Summary</span>
                  <Badge className="ml-auto">Ready</Badge>
                </CardTitle>
                <CardDescription>
                  Condensed version highlighting the key points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-gradient-subtle text-lg leading-relaxed rounded-lg border-l-4 border-l-primary">
                  {summaryData?.summary || "No summary available"}
                </div>

                <Separator className="my-6" />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center space-x-2 flex-1">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    <Select
                      value={targetLanguage}
                      onValueChange={setTargetLanguage}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Translate to..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="italian">Italian</SelectItem>
                        <SelectItem value="portuguese">Portuguese</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">Translate</Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={copyToClipboard}
                      variant="ghost"
                      size="sm"
                      className="p-2"
                    >
                      {copied ? (
                        <span className="text-sm font-semibold">Copied!</span>
                      ) : (
                        <Copy size={20} />
                      )}
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Original Text Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="shadow-soft">
              <Collapsible
                open={isOriginalOpen}
                onOpenChange={setIsOriginalOpen}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-smooth">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>Original Text</span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${isOriginalOpen ? "rotate-180" : ""}`}
                      />
                    </CardTitle>
                    <CardDescription>
                      Click to view the original document content
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="p-4 bg-muted/30 rounded-lg text-sm leading-relaxed">
                      {extractedText.slice(0, 300)}
                      {extractedText.length > 300 && (
                        <span className="text-muted-foreground">
                          ... (truncated)
                        </span>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </motion.div>

          {/* Action Steps Card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center">
                What would you like to do next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push("/input")}
                  className="font-semibold"
                >
                  Create New Summary
                </Button>
                <Button variant="outline" className="font-semibold">
                  Save Summary
                </Button>
                <Button variant="outline" className="font-semibold">
                  Share Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
