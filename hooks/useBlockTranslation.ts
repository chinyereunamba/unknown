import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function useBlockTranslation(blockKey: string, text: string) {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    const cacheKey = `${blockKey}_${language}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setTranslated(cached);
      return;
    }

    if (language === "en") {
      setTranslated(text);
      return;
    }

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        targetLanguage: language,
        sourceLocale: "en",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTranslated(data.translatedText || text);
        localStorage.setItem(cacheKey, data.translatedText || text);
      })
      .catch(() => setTranslated(text));
  }, [blockKey, text, language]);

  return translated;
}
