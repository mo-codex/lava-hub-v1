import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from './en.ts';
import { so } from './so.ts';

export type Language = 'en' | 'so';
type TranslationKey = keyof typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('lavahub_lang');
      if (stored === 'en' || stored === 'so') {
        return stored;
      }
    } catch {
      // LocalStorage not available
    }
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem('lavahub_lang', language);
    } catch {
      // ignore
    }
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'so' : 'en'));
  };

  const t = (key: TranslationKey, fallback?: string): string => {
    const dict = language === 'so' ? so : en;
    const value = dict[key];
    if (value) return value;
    return fallback ?? en[key] ?? String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useT must be used within a LanguageProvider');
  }
  return context;
}
