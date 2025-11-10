/**
 * ClientSideFallback - Gestion des 404 côté client
 * 
 * Ce composant gère le routing SPA quand le serveur ne peut pas
 * servir index.html pour toutes les routes (limitation Figma Make).
 * 
 * Il détecte si l'utilisateur est arrivé sur une route inexistante
 * et le redirige vers la bonne page.
 */

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function ClientSideFallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const pathname = location.pathname;

    // Si on est sur la page d'accueil, pas besoin de redirection
    if (pathname === '/' || pathname === '/fr' || pathname === '/en' || pathname === '/home') {
      return;
    }

    // Liste des routes valides
    const validRoutes = [
      // Routes françaises
      '/fr', '/fr/projects', '/fr/services', '/fr/about', '/fr/contact',
      '/fr/booking', '/fr/blog', '/fr/case-studies', '/fr/faq',
      '/fr/resources', '/fr/testimonials', '/fr/example', '/fr/seed-data',
      // Routes anglaises
      '/en', '/en/projects', '/en/services', '/en/about', '/en/contact',
      '/en/booking', '/en/blog', '/en/case-studies', '/en/faq',
      '/en/resources', '/en/testimonials', '/en/example', '/en/seed-data',
      // Routes sans langue
      '/dashboard', '/login', '/home',
      // Routes invoice (public, sécurisées par token)
      '/invoice',
      // Routes newsletter
      '/newsletter',
    ];

    // Vérifier si la route actuelle est valide (ou une sous-route valide)
    const isValidRoute = validRoutes.some(route => {
      if (route === pathname) return true;
      // Vérifier les routes dynamiques comme /fr/projects/123
      if (pathname.startsWith(route + '/')) return true;
      return false;
    });

    // Si la route n'est pas valide, on ne fait rien
    // React Router affichera la route catch-all qui redirige
    if (!isValidRoute) {
      console.log('⚠️ Route non reconnue:', pathname);
    }

    // Log pour debugging
    console.log('🔍 ClientSideFallback check:', {
      pathname,
      isValidRoute,
      hash: location.hash,
      search: location.search
    });
  }, [location, navigate]);

  // Ce composant ne rend rien, il fait juste de la logique de routing
  return null;
}
