"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function TranslationComponent({ text }: { text: string }) {
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("fr");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto detect language on load
  useEffect(() => {
    const detect = async () => {
      const res = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setDetectedLanguage(data.language || "Unknown");
    };

    if (text) detect();
  }, [text]);

  const translate = async () => {
    setLoading(true);
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLanguage }),
    });
    const data = await res.json();
    setTranslatedText(data.translatedText || "Error");
    setLoading(false);
  };

  return (
    <div className="mt-6 space-y-4">
      <p className="text-sm text-muted-foreground">
        Detected: {detectedLanguage}
      </p>

      <Select value={targetLanguage} onValueChange={setTargetLanguage}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Choose language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fr">French</SelectItem>
          <SelectItem value="de">German</SelectItem>
          <SelectItem value="es">Spanish</SelectItem>
          <SelectItem value="zh">Chinese</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={translate} disabled={loading}>
        {loading ? "Translating..." : "Translate"}
      </Button>

      {translatedText && (
        <div className="p-4 mt-4 bg-muted rounded-lg">
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
}
