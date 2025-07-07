"use client";

import { createContext, useContext, useState, useEffect } from "react";

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  translateText: (text: string) => Promise<string>;
  translateUI: (text: string) => Promise<string>;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  translateText: async () => "",
  translateUI: async () => "",
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState("en");
  const [translationCache, setTranslationCache] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const storedLang = localStorage.getItem("language");
    if (storedLang) setLanguage(storedLang);
  }, []);

  const updateLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    // Clear cache when language changes
    setTranslationCache({});
  };

  const translateText = async (text: string): Promise<string> => {
    if (language === "en") return text;

    // Check cache first
    const cacheKey = `${text}_${language}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          targetLanguage: language,
          sourceLocale: "en",
        }),
      });

      const data = await response.json();
      const translatedText = data.translatedText || text;

      // Cache the translation
      setTranslationCache((prev) => ({
        ...prev,
        [cacheKey]: translatedText,
      }));

      return translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Fallback to original text
    }
  };

  const translateUI = async (text: string): Promise<string> => {
    return await translateText(text);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: updateLanguage,
        translateText,
        translateUI,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
