"use client";
import { useRef } from "react";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Link as HeroLink } from "@heroui/link";
import { Logo } from "@/components/icons";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen flex flex-col text-neutral-100">
      {/* Top Navbar */}
      <nav className="w-full flex items-center justify-between px-8">
        <div className="text-2xl font-extrabold tracking-tight">
          WebWhisper <span className="text-primary">AI</span>
        </div>
        <Button
          radius="full"
          className="font-semibold"
          color="default"
          variant="flat"
        >
          Login with BetterAuth
        </Button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl flex flex-col items-center justify-center text-center gap-8 py-16">
          <h1 className="font-extrabold text-5xl md:text-6xl leading-tight tracking-tight mb-2">
            Understand Any Website or Document Instantly.
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 mb-6">
            Paste a link or upload a file. Get clarity, simplicity, and
            action—tailored to you.
          </p>
          <form className="w-full flex flex-col gap-4">
            <div className="flex w-full gap-2">
              <Input
                type="url"
                placeholder="Paste a website link..."
                classNames={{
                  inputWrapper: "rounded-xl",
                  input: "text-lg px-6 py-4",
                }}
              />
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                ref={fileInputRef}
                className="hidden"
              />
              <Button
                type="button"
                radius="full"
                color="default"
                variant="flat"
                className="font-semibold px-5 py-4"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload
              </Button>
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
