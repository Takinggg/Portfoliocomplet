/**
 * Hook to sync language from URL parameter
 * Allows SEO-friendly language detection even without React Router
 */

import { useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export function useLangFromURL() {
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    // Check URL for lang parameter on mount
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');

    if (langParam === 'en' || langParam === 'fr') {
      if (langParam !== language) {
        setLanguage(langParam);
        console.log(`🌍 Language set from URL: ${langParam.toUpperCase()}`);
      }
    }

    // Listen for popstate events (back/forward navigation)
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang') || 'fr';

      if ((langParam === 'en' || langParam === 'fr') && langParam !== language) {
        setLanguage(langParam);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
}
