import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import frTranslations from './translations/fr';
import enTranslations from './translations/en';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Record<string, any>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Map des traductions
const translationsMap = {
  fr: frTranslations,
  en: enTranslations,
};

// Détection de la langue depuis l'URL ou navigateur
const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'fr';
  
  // Check URL first (priority for SEO)
  const pathname = window.location.pathname;
  const match = pathname.match(/^\/(en|fr)(\/|$)/);
  if (match) {
    const detectedLang = match[1] as Language;
    // Sync to localStorage
    localStorage.setItem('language', detectedLang);
    return detectedLang;
  }
  
  // Then check localStorage
  const stored = localStorage.getItem('language');
  if (stored === 'fr' || stored === 'en') return stored as Language;
  
  // Finally, use browser language
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'en' ? 'en' : 'fr';
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [translations, setTranslations] = useState<Record<string, any>>(
    translationsMap[getInitialLanguage()]
  );

  // Charger les traductions
  useEffect(() => {
    setTranslations(translationsMap[language]);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    localStorage.setItem('preferredLanguage', lang); // Sync for geo-redirect
    
    // Update URL with new language
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const match = pathname.match(/^\/(en|fr)(\/|$)/);
      
      if (match) {
        // Replace language in URL
        const newPath = pathname.replace(/^\/(en|fr)(\/|$)/, `/${lang}$2`);
        window.history.pushState({}, '', newPath);
      } else {
        // Add language prefix
        const newPath = `/${lang}${pathname}`;
        window.history.pushState({}, '', newPath);
      }
    }
  };

  // Fonction de traduction avec support des clés imbriquées
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation missing for key: ${key} (${language})`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
