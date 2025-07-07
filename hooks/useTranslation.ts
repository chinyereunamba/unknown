"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const useTranslation = () => {
  const { language, translateUI } = useLanguage();
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const t = async (key: string, fallback: string): Promise<string> => {
    // Check if we already have this translation cached
    if (translations[key]) {
      return translations[key];
    }

    // Get translation
    const translated = await translateUI(key, fallback);

    // Cache the translation
    setTranslations((prev) => ({
      ...prev,
      [key]: translated,
    }));

    return translated;
  };

  const tSync = (key: string, fallback: string): string => {
    // For immediate use, return cached translation or fallback
    return translations[key] || fallback;
  };

  // Clear translations when language changes
  useEffect(() => {
    setTranslations({});
  }, [language]);

  return { t, tSync, language };
};
