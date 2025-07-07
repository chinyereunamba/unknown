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
  Loader2,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

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
import { Progress } from "@/components/ui/progress";
import { TranslatedText } from "@/components/TranslatedText";

interface SummaryData {
  summary: string;
  originalLength: number;
  summaryLength: number;
  reductionPercentage: number;
}

type LoadingStep = "initializing" | "processing" | "generating" | "finalizing";

export default function SummaryPage() {
  const [extractedText, setExtractedText] = useState<string>("");
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);

  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState<LoadingStep>("initializing");
  const [loadingProgress, setLoadingProgress] = useState(0);
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

  const simulateLoadingProgress = () => {
    const steps = [
      { step: "initializing" as LoadingStep, duration: 1000, progress: 25 },
      { step: "processing" as LoadingStep, duration: 2000, progress: 50 },
      { step: "generating" as LoadingStep, duration: 3000, progress: 80 },
      { step: "finalizing" as LoadingStep, duration: 1000, progress: 100 },
    ];

    let currentStepIndex = 0;

    const progressInterval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        const currentStep = steps[currentStepIndex];
        setLoadingStep(currentStep.step);
        setLoadingProgress(currentStep.progress);

        setTimeout(() => {
          currentStepIndex++;
          if (currentStepIndex >= steps.length) {
            clearInterval(progressInterval);
          }
        }, currentStep.duration);
      }
    }, 100);
  };

  const getLoadingMessage = (step: LoadingStep) => {
    switch (step) {
      case "initializing":
        return "Preparing your document for analysis...";
      case "processing":
        return "Analyzing content structure and key themes...";
      case "generating":
        return "Creating your AI-powered summary...";
      case "finalizing":
        return "Finalizing and optimizing your summary...";
      default:
        return "Processing your request...";
    }
  };

  const getLoadingIcon = (step: LoadingStep) => {
    switch (step) {
      case "initializing":
        return <FileText className="w-6 h-6 animate-pulse" />;
      case "processing":
        return <BarChart3 className="w-6 h-6 animate-pulse" />;
      case "generating":
        return <Sparkles className="w-6 h-6 animate-pulse" />;
      case "finalizing":
        return <CheckCircle className="w-6 h-6 animate-pulse" />;
      default:
        return <Loader2 className="w-6 h-6 animate-spin" />;
    }
  };

  const summarizeText = async (text: string) => {
    try {
      setLoading(true);
      setError("");
      setLoadingStep("initializing");
      setLoadingProgress(0);

      // Start the loading progress simulation
      simulateLoadingProgress();

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

      // Ensure we show 100% progress before setting the data
      setLoadingStep("finalizing");
      setLoadingProgress(100);

      // Small delay to show the finalizing step
      setTimeout(() => {
        setSummaryData(data);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error("Summarization error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during summarization"
      );
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-4"
        >
          <Card className="shadow-elegant border-0">
            <CardContent className="p-8 text-center">
              {/* Loading Icon */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-6"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    {getLoadingIcon(loadingStep)}
                  </div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
                </div>
              </motion.div>

              {/* Loading Title */}
              <motion.h2
                key={loadingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200"
              >
                {loadingStep.charAt(0).toUpperCase() + loadingStep.slice(1)}...
              </motion.h2>

              {/* Loading Message */}
              <motion.p
                key={loadingStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-gray-600 dark:text-gray-400 mb-6"
              >
                {getLoadingMessage(loadingStep)}
              </motion.p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{loadingProgress}%</span>
                </div>
                <Progress value={loadingProgress} className="h-2" />
              </div>

              {/* Loading Steps */}
              <div className="space-y-2">
                {[
                  { step: "initializing", label: "Initialize" },
                  { step: "processing", label: "Process" },
                  { step: "generating", label: "Generate" },
                  { step: "finalizing", label: "Finalize" },
                ].map((stepInfo) => (
                  <div
                    key={stepInfo.step}
                    className={`flex items-center space-x-2 text-sm ${
                      loadingStep === stepInfo.step
                        ? "text-blue-600 dark:text-blue-400"
                        : loadingProgress >=
                            (stepInfo.step === "initializing"
                              ? 25
                              : stepInfo.step === "processing"
                                ? 50
                                : stepInfo.step === "generating"
                                  ? 80
                                  : 100)
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {loadingStep === stepInfo.step ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : loadingProgress >=
                      (stepInfo.step === "initializing"
                        ? 25
                        : stepInfo.step === "processing"
                          ? 50
                          : stepInfo.step === "generating"
                            ? 80
                            : 100) ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" />
                    )}
                    <span>{stepInfo.label}</span>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  💡 Tip: Longer documents may take a bit more time to process
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <Card className="shadow-elegant border-0">
            <CardContent className="p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-red-500 text-6xl mb-4"
              >
                ⚠️
              </motion.div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                <TranslatedText>Summarization Failed</TranslatedText>
              </h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="font-semibold"
                  onClick={() => summarizeText(extractedText)}
                >
                  <Loader2 className="w-4 h-4 mr-2" />
                  <TranslatedText>Try Again</TranslatedText>
                </Button>
                <Button
                  className="font-semibold"
                  variant="outline"
                  onClick={() => router.push("/")}
                >
                  <TranslatedText>Start Over</TranslatedText>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl flex flex-col items-center justify-center text-center gap-8 py-12"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-extrabold text-4xl md:text-5xl mb-2">
            <TranslatedText>Here's Your Summary</TranslatedText>
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            <TranslatedText>
              We've simplified the content for you—see the key points below.
            </TranslatedText>
          </p>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">
              <TranslatedText>Summary</TranslatedText>{" "}
              <span className="text-gradient">
                <TranslatedText>Generated</TranslatedText>
              </span>
            </h1>
            <p className="text-muted-foreground">
              <TranslatedText>
                Your document has been successfully summarized
              </TranslatedText>
            </p>
          </div>

          {/* Summary Statistics */}
          {summaryData && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 justify-center"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="text-center shadow-soft">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {summaryData.originalLength.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <TranslatedText>Original Words</TranslatedText>
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center shadow-soft">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {summaryData.summaryLength.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <TranslatedText>Summary Words</TranslatedText>
                  </div>
                </CardContent>
              </Card>
              {summaryData.reductionPercentage > 0 && (
                <Card className="text-center shadow-soft">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {summaryData.reductionPercentage}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <TranslatedText>Reduction</TranslatedText>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Card className="text-center shadow-soft">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {/* {stats.readingTime} */}2 mins
                    {/* TODO: Calculate reading time */}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <TranslatedText>Reading Time</TranslatedText>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Summary Card */}

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span>
                    <TranslatedText>AI-Generated Summary</TranslatedText>
                  </span>
                  <Badge className="ml-auto">
                    <TranslatedText>Ready</TranslatedText>
                  </Badge>
                </CardTitle>
                <CardDescription>
                  <TranslatedText>
                    Condensed version highlighting the key points
                  </TranslatedText>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-gradient-subtle text-lg text-left leading-relaxed rounded-lg border-l-4 border-l-primary">
                  <p className="whitespace-pre-line leading-relaxed text-base">
                    {summaryData?.summary || "No summary available"}
                  </p>
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
                        <SelectValue
                          placeholder={
                            <TranslatedText>Translate to...</TranslatedText>
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <TranslatedText>Translate</TranslatedText>
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      className="p-2"
                      size="sm"
                      variant="ghost"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <span className="text-sm font-semibold">
                          <TranslatedText>Copied!</TranslatedText>
                        </span>
                      ) : (
                        <Copy size={20} />
                      )}
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      <TranslatedText>Download</TranslatedText>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Original Text Preview */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 w-full"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-soft w-full">
              <Collapsible
                open={isOriginalOpen}
                onOpenChange={setIsOriginalOpen}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-smooth">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>
                          <TranslatedText>Original Text</TranslatedText>
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${isOriginalOpen ? "rotate-180" : ""}`}
                      />
                    </CardTitle>
                    <CardDescription>
                      <TranslatedText>
                        Click to view the original document content
                      </TranslatedText>
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 text-left w-full">
                    <div className="p-4 bg-muted/30 rounded-lg text-sm leading-relaxed">
                      {extractedText.slice(0, 300)}
                      {extractedText.length > 300 && (
                        <span className="text-muted-foreground">
                          <TranslatedText>... (truncated)</TranslatedText>
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
                <TranslatedText>What would you like to do next?</TranslatedText>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="font-semibold"
                  onClick={() => router.push("/input")}
                >
                  <TranslatedText>Create New Summary</TranslatedText>
                </Button>
                <Button className="font-semibold" variant="outline">
                  <TranslatedText>Save Summary</TranslatedText>
                </Button>
                <Button className="font-semibold" variant="outline">
                  <TranslatedText>Share Summary</TranslatedText>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
