"use client";
import { FormEvent, useRef, useState } from "react";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";

type InputMode = "url" | "file";

export default function Home() {
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

  const handleModeChange = (mode: InputMode) => {
    setInputMode(mode);
    // Clear other mode's data when switching
    if (mode === "url") {
      setFile(null);
      setFilePreview("");
    } else {
      setUrl("");
    }
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

        if (data.text) {
          localStorage.setItem("summaryText", data.text);
          router.push("/summary");
        } else {
          alert("Failed to extract text from URL");
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
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl flex flex-col items-center justify-center text-center gap-8 py-16">
          <h1 className="font-extrabold text-5xl md:text-6xl leading-tight tracking-tight mb-2">
            Understand Any Website or Document Instantly.
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Choose your input method and get clarity, simplicity, and
            action—tailored to you.
          </p>

          {/* Input Mode Selector */}
          <div className="w-full mb-6">
            <div className="flex bg-neutral-100 rounded-lg p-1 w-full max-w-md mx-auto">
              <button
                type="button"
                onClick={() => handleModeChange("url")}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                  inputMode === "url"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                🌐 Website URL
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("file")}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                  inputMode === "file"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                📄 Upload File
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSummarize}
            className="w-full flex flex-col gap-4"
          >
            {inputMode === "url" ? (
              <div className="flex w-full flex-col items-start">
                <label className="block text-base font-medium mb-2">
                  Website URL
                </label>
                <Input
                  type="url"
                  variant="bordered"
                  placeholder="https://example.com"
                  classNames={{
                    inputWrapper: "rounded-xl p-4",
                    input: "text-base",
                  }}
                  onChange={(e) => setUrl(e.target.value)}
                  value={url}
                />
              </div>
            ) : (
              <div className="flex flex-col items-start">
                <label className="block text-base font-medium mb-2">
                  Upload Document
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={handleFileUploadClick}
                  className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-gray-300 transition-colors cursor-pointer w-full items-center"
                >
                  <div className="icon-upload text-2xl mb-2"></div>
                  <p className="">
                    {file
                      ? `Selected: ${file.name}`
                      : "Drop PDF or DOCX files here, or click to browse"}
                  </p>
                  <p className="text-sm mt-1">Max file size: 10MB</p>
                </div>
                {fileLoading && (
                  <div className="mt-2 text-blue-600 text-sm">
                    Extracting text from file...
                  </div>
                )}
                {filePreview && !fileLoading && (
                  <div className="mt-4 w-full bg-neutral-100 rounded p-4 text-left text-sm max-h-48 overflow-y-auto border border-neutral-200">
                    <div className="font-semibold mb-2 text-neutral-700">
                      Preview:
                    </div>
                    <div className="text-neutral-700 whitespace-pre-wrap">
                      {filePreview.slice(0, 500)}
                      {filePreview.length > 500 && (
                        <span className="text-neutral-400">
                          ... (truncated)
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              type="submit"
              radius="full"
              color="primary"
              className="w-full py-4 mt-2 text-lg font-bold shadow-lg"
              disabled={loading || fileLoading}
            >
              {loading ? "Processing..." : "Get My Summary"}
            </Button>
          </form>
        </div>
      </main>

      {/* How It Works Section */}
      <section className="w-full max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 py-16 px-4">
        <Card className="flex-1 flex flex-col items-center text-center gap-2 py-6 bg-transparent shadow-none">
          <span className="text-5xl mb-2">🔗</span>
          <span className="font-semibold text-lg">Paste or Upload</span>
        </Card>
        <Card className="flex-1 flex flex-col items-center text-center gap-2 py-6 bg-transparent shadow-none">
          <span className="text-5xl mb-2">🤖</span>
          <span className="font-semibold text-lg">AI Simplifies</span>
        </Card>
        <Card className="flex-1 flex flex-col items-center text-center gap-2 py-6 bg-transparent shadow-none">
          <span className="text-5xl mb-2">⚡</span>
          <span className="font-semibold text-lg">You Take Action</span>
        </Card>
      </section>

      {/* Minimal Footer */}
      <footer className="w-full py-6 mt-auto">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex gap-3 mb-2">
            <div className="w-12 h-6 rounded flex items-center justify-center text-xs text-neutral-100">
              Firecrawl
            </div>
            <div className="w-12 h-6 rounded flex items-center justify-center text-xs text-neutral-100">
              Lingo
            </div>
            <div className="w-12 h-6 rounded flex items-center justify-center text-xs text-neutral-100">
              Tambo
            </div>
            <div className="w-12 h-6 rounded flex items-center justify-center text-xs text-neutral-100">
              Autumn
            </div>
            <div className="w-12 h-6 rounded flex items-center justify-center text-xs text-neutral-100">
              Resend
            </div>
            <div className="w-12 h-6 rounded flex items-center justify-center text-xs text-neutral-100">
              BetterAuth
            </div>
          </div>
          <div className="text-xs text-neutral-400">
            © {new Date().getFullYear()} WebWhisper AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
