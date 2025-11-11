/**
 * ScrollToTop - Scroll automatique en haut de page à chaque changement de route
 * 
 * Ce composant écoute les changements de route et scroll automatiquement
 * vers le haut de la page pour une meilleure UX.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top instantly when route changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
