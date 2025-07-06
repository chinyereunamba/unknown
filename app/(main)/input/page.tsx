"use client";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Globe, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type InputMode = "url" | "file";

export default function InputPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputMode, setInputMode] = useState<InputMode>("url");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [fileLoading, setFileLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview("");
      setFileLoading(true);
      // Immediately upload and extract
      try {
        const formData = new FormData();

        formData.append("file", selectedFile);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.text) {
          setFilePreview(data.text);
        } else {
          setFilePreview("Could not extract text from this file.");
        }
      } catch (err) {
        setFilePreview("Error extracting file text.");
      } finally {
        setFileLoading(false);
      }
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSummarize = async (e: FormEvent) => {
    e.preventDefault();

    if (inputMode === "url" && !url) {
      alert("Please enter a website URL");

      return;
    }

    if (inputMode === "file" && !file) {
      alert("Please upload a file");

      return;
    }

    setLoading(true);

    try {
      if (inputMode === "url") {
        const res = await fetch("/api/firecrawl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const data = await res.json();

        if (data.success && data.data?.markdown) {
          localStorage.setItem("summaryText", data.data.markdown);
          router.push("/summary");
        } else {
          console.error("Firecrawl API error:", data);
          alert("Failed to extract text from URL. Please try again.");
        }
      } else if (inputMode === "file") {
        // Use already-extracted preview text
        if (filePreview) {
          localStorage.setItem("summaryText", filePreview);
          router.push("/summary");
        } else {
          alert("No extracted text available for this file.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              Summarize Content
            </CardTitle>
            <CardDescription>
              Choose your input method and get AI-powered summaries instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              className="w-full"
              value={inputMode}
              onValueChange={(value) => setInputMode(value as InputMode)}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger className="flex items-center gap-2" value="url">
                  <Globe className="w-4 h-4" />
                  Website URL
                </TabsTrigger>
                <TabsTrigger className="flex items-center gap-2" value="file">
                  <FileText className="w-4 h-4" />
                  Upload File
                </TabsTrigger>
              </TabsList>

              <form className="mt-6 space-y-4" onSubmit={handleSummarize}>
                <TabsContent className="space-y-4" value="url">
                  <div className="space-y-2">
                    <Label htmlFor="url">Website URL</Label>
                    <Input
                      className="w-full"
                      id="url"
                      placeholder="https://example.com"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                </TabsContent>

                <TabsContent className="space-y-4" value="file">
                  <div className="space-y-2">
                    <Label>Upload Document</Label>
                    <input
                      ref={fileInputRef}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                      onClick={handleFileUploadClick}
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {file
                          ? `Selected: ${file.name}`
                          : "Drop PDF or DOCX files here, or click to browse"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Max file size: 10MB
                      </p>
                    </div>
                    {fileLoading && (
                      <div className="text-sm text-blue-600">
                        Extracting text from file...
                      </div>
                    )}
                    {filePreview && !fileLoading && (
                      <div className="bg-gray-50 rounded p-4 text-sm max-h-48 overflow-y-auto border">
                        <div className="font-semibold mb-2">Preview:</div>
                        <div className="text-gray-700 whitespace-pre-wrap">
                          {filePreview.slice(0, 500)}
                          {filePreview.length > 500 && (
                            <span className="text-gray-400">
                              ... (truncated)
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <Button
                  className="w-full"
                  disabled={loading || fileLoading}
                  size="lg"
                  type="submit"
                >
                  {loading ? "Processing..." : "Get My Summary"}
                </Button>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
