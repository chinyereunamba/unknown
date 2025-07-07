"use client";

const globalTranslationCache: Record<string, string> = {};
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TranslatedTextProps {
  children: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  fallback?: string;
}

export const TranslatedText = ({
  children,
  className,
  as: Component = "span",
  fallback,
}: TranslatedTextProps) => {
  const { translateUI, language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(children);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (language === "en") {
      setTranslatedText(children);
      return;
    }

    const cacheKey = `${children}_${language}`;
    if (globalTranslationCache[cacheKey]) {
      setTranslatedText(globalTranslationCache[cacheKey]);
      return;
    }

    setIsLoading(true);
    translateUI(children)
      .then((translated) => {
        globalTranslationCache[cacheKey] = translated;
        setTranslatedText(translated);
      })
      .catch(() => setTranslatedText(fallback || children))
      .finally(() => setIsLoading(false));
  }, [children, language, translateUI, fallback]);

  return (
    <Component className={className}>
      {isLoading ? fallback || children : translatedText}
    </Component>
  );
};
