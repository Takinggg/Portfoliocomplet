import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Redirect root path to appropriate language
 * Detects browser language preference
 */
export function LanguageRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage first
    const storedLang = localStorage.getItem('language');
    if (storedLang === 'en' || storedLang === 'fr') {
      // HashRouter: pas de / au début
      navigate(storedLang, { replace: true });
      return;
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    const targetLang = browserLang === 'en' ? 'en' : 'fr';
    
    // Save preference
    localStorage.setItem('language', targetLang);
    
    // Redirect (HashRouter: pas de / au début)
    navigate(targetLang, { replace: true });
  }, [navigate]);

  return null;
}
