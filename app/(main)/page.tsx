"use client";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Globe, Languages } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

  const features = [
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "Summarize Documents",
      description:
        "Upload PDFs, DOCX, and other documents for instant AI-powered summaries.",
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Summarize Websites",
      description:
        "Paste any URL to get concise summaries of web pages and articles.",
    },
    {
      icon: <Languages className="w-8 h-8 text-primary" />,
      title: "Translate Instantly",
      description:
        "Convert summaries to any language with our advanced translation engine.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="flex-1 min-h-[70vh] flex flex-col items-center justify-center px-4">
        {/* Background Hero Image */}
        <div className="absolute inset-0 -z-10 opacity-5">
          {/* <img
            src={heroBanner}
            alt="AI Summarization"
            className="w-full h-full object-cover"
          /> */}
        </div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-center tracking-tight mb-6">
            Transform lengthy content into{" "}
            <span className="text-gradient">actionable insights</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            AI-powered summarization for documents, web pages, and text. Save
            time and focus on what matters most.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild className="shadow-elegant" size="lg">
              <Link href="/input">Try for Free</Link>
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to summarize smarter
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful AI tools designed for modern productivity
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="p-6 h-full shadow-soft hover:shadow-elegant transition-smooth">
                <CardContent className="p-0 text-center">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
