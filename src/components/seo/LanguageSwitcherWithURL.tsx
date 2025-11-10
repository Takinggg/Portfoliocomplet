/**
 * Language Switcher with URL update
 * Changes language AND updates URL even in current system
 */

import { Globe } from 'lucide-react';
import { useLanguage } from '../../utils/i18n/LanguageContext';

export function LanguageSwitcherWithURL() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLang: 'fr' | 'en') => {
    if (newLang === language) return;

    // Update language context
    setLanguage(newLang);

    // Update URL to reflect language change (for SEO)
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const currentSearch = window.location.search;

    // Simple approach: add language as query parameter
    // This allows Google to see different URLs even without React Router
    const newUrl = new URL(window.location.href);
    
    if (newLang === 'fr') {
      // French is default, remove lang parameter
      newUrl.searchParams.delete('lang');
    } else {
      // Add lang parameter for non-default language
      newUrl.searchParams.set('lang', newLang);
    }

    // Update URL without page reload
    window.history.pushState({}, '', newUrl.toString());

    // Dispatch event so other components can react
    window.dispatchEvent(new PopStateEvent('popstate'));

    console.log(`🌍 Language changed to ${newLang.toUpperCase()}, URL updated for SEO`);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-[#F4F4F4]/60" />
      <div className="flex gap-1">
        <button
          onClick={() => handleLanguageChange('fr')}
          className={`px-3 py-1 rounded text-sm transition-all ${
            language === 'fr'
              ? 'bg-[#00FFC2] text-[#0C0C0C]'
              : 'bg-[#F4F4F4]/10 text-[#F4F4F4]/60 hover:bg-[#F4F4F4]/20'
          }`}
          aria-label="Français"
          aria-pressed={language === 'fr'}
        >
          FR
        </button>
        <button
          onClick={() => handleLanguageChange('en')}
          className={`px-3 py-1 rounded text-sm transition-all ${
            language === 'en'
              ? 'bg-[#00FFC2] text-[#0C0C0C]'
              : 'bg-[#F4F4F4]/10 text-[#F4F4F4]/60 hover:bg-[#F4F4F4]/20'
          }`}
          aria-label="English"
          aria-pressed={language === 'en'}
        >
          EN
        </button>
      </div>
    </div>
  );
}
