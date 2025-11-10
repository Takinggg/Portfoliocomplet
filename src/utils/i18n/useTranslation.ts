import { useLanguage } from './LanguageContext';

export function useTranslation() {
  const { t: tFunction, language, setLanguage, translations } = useLanguage();
  
  // Create a combined t object that can be used both as function and object
  // Function: t('nav.home')
  // Object: t.resources.hero.title
  const t = Object.assign(tFunction, {
    ...translations,
    locale: language // Add locale for compatibility
  });
  
  return {
    t,
    language,
    setLanguage,
    isEnglish: language === 'en',
    isFrench: language === 'fr',
  };
}
