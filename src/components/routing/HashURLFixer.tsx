/**
 * HashURLFixer - Corrige les URLs sans hash pour HashRouter
 * 
 * Problème : Si l'utilisateur arrive sur /fr ou /en (sans le #),
 * HashRouter ne peut pas gérer l'URL.
 * 
 * Solution : Détecter les URLs sans hash et rediriger vers /#/fr ou /#/en
 */

import { useEffect } from 'react';

export function HashURLFixer() {
  useEffect(() => {
    const currentURL = window.location.href;
    const hash = window.location.hash;
    const pathname = window.location.pathname;
    
    // Si l'URL contient déjà un hash valide, ne rien faire
    if (hash && hash.match(/#\/(fr|en)/)) {
      console.log('✅ HashURLFixer: URL déjà correcte', hash);
      return;
    }
    
    // Détecter si l'URL a un pathname avec langue (/fr, /en, /fr/projects, etc.)
    const pathLangMatch = pathname.match(/^\/(fr|en)(\/.*)?$/);
    
    if (pathLangMatch) {
      const [, lang, restOfPath] = pathLangMatch;
      const newHash = `#/${lang}${restOfPath || ''}`;
      
      console.log('🔧 HashURLFixer: Correction URL');
      console.log('  ❌ Avant:', currentURL);
      console.log('  ✅ Après:', `${window.location.origin}/${newHash}`);
      
      // Rediriger vers la bonne URL avec hash
      window.location.replace(`${window.location.origin}/${newHash}`);
      return;
    }
    
    // Si pathname est juste "/" ou vide, vérifier le hash
    if (pathname === '/' || pathname === '') {
      // Si pas de hash du tout, rediriger vers /#/fr par défaut
      if (!hash || hash === '#/' || hash === '#') {
        console.log('🔧 HashURLFixer: Ajout hash par défaut /#/fr');
        window.location.replace(`${window.location.origin}/#/fr`);
        return;
      }
    }
    
    // Si pathname inconnu (ni /, ni /fr, ni /en), rediriger vers 404
    if (pathname !== '/' && pathname !== '' && !pathLangMatch) {
      // C'est probablement une vraie 404, laisser HashRouter gérer
      console.log('⚠️ HashURLFixer: Pathname inconnu, redirection vers /#/fr');
      window.location.replace(`${window.location.origin}/#/fr`);
    }
  }, []); // Exécuter une seule fois au montage

  return null; // Ce composant ne rend rien
}
