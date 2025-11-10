/**
 * Language Route Synchronization Component
 * Synchronizes the language context with URL-based language routing
 * ADAPTED FOR HASHROUTER
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../utils/i18n/LanguageContext';

export function LanguageRouteSync() {
  const location = useLocation();
  const { language, setLanguage } = useLanguage();

  // Sync language from Hash URL to context on mount and hash change
  useEffect(() => {
    // Get language from hash (HashRouter)
    const hash = window.location.hash; // Ex: #/fr/projects
    
    // Skip if no hash or root hash
    if (!hash || hash === '#/' || hash === '#') return;
    
    // Extract language from hash
    const hashMatch = hash.match(/^#\/(fr|en)(\/|$)/);
    const urlLanguage = hashMatch ? hashMatch[1] as 'fr' | 'en' : 'fr';
    
    // Update language context if different
    if (urlLanguage !== language) {
      console.log('🔄 LanguageRouteSync: Updating language from URL:', urlLanguage);
      setLanguage(urlLanguage);
    }
  }, [location]); // Re-run when location changes (HashRouter triggers this)

  return null; // This component doesn't render anything
}
