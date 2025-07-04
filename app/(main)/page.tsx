"use client";
import { FormEvent, useRef, useState } from "react";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSummarize = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      alert("Failed to extract text");
    }

    setLoading(false);
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
            Paste a link or upload a file. Get clarity, simplicity, and
            action—tailored to you.
          </p>
          <form
            onSubmit={handleSummarize}
            className="w-full flex flex-col gap-4"
          >
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
            <div className="space-y-6">
              <div className="flex flex-col items-start">
                <label className="block text-base font-medium mb-2">
                  Upload Document
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  ref={fileInputRef}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-gray-300 transition-colors cursor-pointer w-full items-center">
                  <div className="icon-upload text-2xl mb-2"></div>
                  <p className="">
                    Drop PDF or DOCX files here, or click to browse
                  </p>
                  <p className="text-sm mt-1">Max file size: 10MB</p>
                </div>
              </div>
            </div>
            <Button
              type="submit"
              radius="full"
              color="primary"
              className="w-full py-4 mt-2 text-lg font-bold shadow-lg"
            >
              Get My Summary
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
            <div className="w-12 h-6 rounded flex items-center justify-center text-xs">
              Firecrawl
            </div>
            <div className="w-12 h-6 rounded flex items-center justify-center text-xs">
              Lingo
            </div>
            <div className="w-12 h-6 rounded flex items-center justify-center text-xs">
              Tambo
            </div>
            <div className="w-12 h-6 rounded flex items-center justify-center text-xs">
              Autumn
            </div>
            <div className="w-12 h-6 rounded flex items-center justify-center text-xs">
              Resend
            </div>
            <div className="w-12 h-6 rounded flex items-center justify-center text-xs">
              BetterAuth
            </div>
          </div>
          <div className="text-xs">
            © {new Date().getFullYear()} WebWhisper AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
