"use client";

import { createContext, useContext, useState, useEffect } from "react";

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const storedLang = localStorage.getItem("language");
    if (storedLang) setLanguage(storedLang);
  }, []);

  const updateLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: updateLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
