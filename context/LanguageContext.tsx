import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { en } from '../translations/en';
import { id } from '../translations/id';

export type Locale = 'en' | 'id';
export type TranslationKey = keyof typeof id;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, fallback?: string) => string;
}

const translations = { en, id };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const storedLang = localStorage.getItem('locale');
    return (storedLang === 'en' || storedLang === 'id') ? storedLang : 'id'; // Default to 'id'
  });

  const setLocale = (newLocale: Locale) => {
    localStorage.setItem('locale', newLocale);
    setLocaleState(newLocale);
  };

  const t = useCallback((key: TranslationKey, fallback?: string): string => {
      // Use Indonesian as the primary source of keys.
      // If a key exists in 'id' but not in 'en', it will fall back to the 'id' value.
      const idTranslation = translations.id[key];
      const enTranslation = translations.en[key];

      if (locale === 'en') {
          return enTranslation || idTranslation || fallback || String(key);
      }
      return idTranslation || fallback || String(key);
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
