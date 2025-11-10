/**
 * Détecte le pays de l'utilisateur
 * Utilise plusieurs méthodes par ordre de priorité
 */

export async function detectUserCountry(): Promise<'fr' | 'en'> {
  try {
    // 1. Vérifier la préférence sauvegardée (priorité à preferredLanguage, puis language)
    const preferredLanguage = localStorage.getItem('preferredLanguage');
    const savedLanguage = localStorage.getItem('language');
    const cachedLang = preferredLanguage || savedLanguage;
    
    if (cachedLang === 'fr' || cachedLang === 'en') {
      console.log(`🌍 Langue préférée (cache): ${cachedLang}`);
      return cachedLang;
    }

    // 2. Essayer de récupérer les headers Vercel (si disponibles)
    // Note: Ceci fonctionne uniquement en production sur Vercel
    if (typeof window !== 'undefined' && (window as any).__VERCEL_GEO) {
      const country = (window as any).__VERCEL_GEO.country;
      const language = country === 'FR' ? 'fr' : 'en';
      console.log(`🌍 Pays détecté (Vercel): ${country} → ${language}`);
      localStorage.setItem('preferredLanguage', language);
      return language;
    }

    // 3. Utiliser l'API de géolocalisation IP (avec timeout manuel pour compatibilité)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    try {
      const response = await fetch('https://ipapi.co/json/', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const countryCode = data.country_code;
        const language = countryCode === 'FR' ? 'fr' : 'en';
        
        console.log(`🌍 Pays détecté (IP): ${countryCode} (${data.country_name}) → ${language}`);
        localStorage.setItem('preferredLanguage', language);
        return language;
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      // Si l'API échoue, continuer vers le fallback
      console.log('⚠️ API géolocalisation inaccessible (VPN/Firewall?)');
    }

    // 4. Fallback: langue du navigateur
    throw new Error('API unavailable');
  } catch (error) {
    console.log('⚠️ Géolocalisation impossible, utilisation langue navigateur');
    const browserLang = navigator.language.split('-')[0];
    const language = browserLang === 'fr' ? 'fr' : 'en';
    
    console.log(`🌍 Langue navigateur: ${navigator.language} → ${language}`);
    localStorage.setItem('preferredLanguage', language);
    return language;
  }
}

/**
 * Méthode alternative utilisant uniquement la langue du navigateur
 * Plus rapide mais moins précise
 */
export function detectBrowserLanguage(): 'fr' | 'en' {
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'fr' ? 'fr' : 'en';
}

/**
 * Récupère la langue préférée sauvegardée
 */
export function getSavedLanguage(): 'fr' | 'en' | null {
  const saved = localStorage.getItem('preferredLanguage');
  if (saved === 'fr' || saved === 'en') {
    return saved;
  }
  return null;
}

/**
 * Sauvegarde la langue préférée
 */
export function saveLanguagePreference(language: 'fr' | 'en'): void {
  localStorage.setItem('preferredLanguage', language);
  console.log(`💾 Langue sauvegardée: ${language}`);
}

/**
 * Efface la langue préférée sauvegardée
 */
export function clearLanguagePreference(): void {
  localStorage.removeItem('preferredLanguage');
  console.log('🗑️ Préférence de langue effacée');
}
