import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from '../../utils/i18n/useTranslation';
import { detectUserCountry } from '../../utils/routing/detectCountry';

/**
 * GeoRedirect - Détecte le pays de l'utilisateur et redirige vers la langue appropriée
 * - France (FR) → fr (HashRouter: pas de / au début)
 * - Autres pays → en
 */
export function GeoRedirect() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const { setLanguage } = useTranslation();

  useEffect(() => {
    const detectAndRedirect = async () => {
      try {
        const detectedLanguage = await detectUserCountry();
        setLanguage(detectedLanguage);
        // HashRouter: DOIT avoir / au début pour un chemin absolu
        setRedirectTo(`/${detectedLanguage}`);
      } catch (error) {
        // En cas d'erreur, rediriger vers fr par défaut
        console.error('Erreur lors de la détection:', error);
        setLanguage('fr');
        setRedirectTo('/fr');
      }
    };

    // Sécurité: Timeout de 3 secondes max pour éviter de bloquer
    const timeoutId = setTimeout(() => {
      if (!redirectTo) {
        console.log('⚠️ Timeout détection → Redirection fr');
        setLanguage('fr');
        setRedirectTo('/fr');
      }
    }, 3000);

    detectAndRedirect();

    return () => clearTimeout(timeoutId);
  }, [setLanguage, redirectTo]);

  // Afficher un loader pendant la détection
  if (!redirectTo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C0C0C]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-mint border-r-transparent mb-4"></div>
          <p className="text-neutral-400 text-sm">Détection de votre localisation...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers la langue appropriée
  return <Navigate to={redirectTo} replace />;
}
