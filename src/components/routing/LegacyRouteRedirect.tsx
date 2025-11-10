import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Redirect legacy routes (without language prefix) to new bilingual routes
 * Example: /blog -> /fr/blog or /en/blog
 */
export function LegacyRouteRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    
    // Skip root path (handled by Navigate)
    if (pathname === '/') return;
    
    // SPECIAL CASE: Figma Make preview iframe loads on /preview_page.html
    // Redirect directly to home instead of treating it as a legacy route
    if (pathname === '/preview_page.html' || pathname.startsWith('/preview_page')) {
      const storedLang = localStorage.getItem('language') || 'fr';
      const browserLang = navigator.language.split('-')[0];
      const targetLang = storedLang === 'en' || storedLang === 'fr' ? storedLang : (browserLang === 'en' ? 'en' : 'fr');
      console.log(`🎯 Figma Preview detected: ${pathname} → ${targetLang}`);
      // HashRouter: pas de / au début
      navigate(targetLang, { replace: true });
      return;
    }
    
    // Skip protected routes
    const protectedRoutes = ['/dashboard', '/login', '/newsletter-debug', '/server-diagnostic', '/sync-dashboard', '/newsletter'];
    if (protectedRoutes.some(route => pathname.startsWith(route))) return;
    
    // Skip if already has language prefix
    if (pathname.match(/^\/(en|fr)(\/|$)/)) return;
    
    // Determine target language
    const storedLang = localStorage.getItem('language') || 'fr';
    const browserLang = navigator.language.split('-')[0];
    const targetLang = storedLang === 'en' || storedLang === 'fr' ? storedLang : (browserLang === 'en' ? 'en' : 'fr');
    
    // Special case: /home redirects to language root (not /fr/home)
    if (pathname === '/home') {
      console.log(`🔄 Legacy route detected: ${pathname} → ${targetLang}`);
      navigate(targetLang, { replace: true });
      return;
    }
    
    // This is a legacy route! Redirect to language-prefixed version
    // Build new path with language prefix (HashRouter: pas de / au début)
    const newPath = `${targetLang}${pathname}`;
    
    console.log(`🔄 Legacy route detected: ${pathname} → ${newPath}`);
    
    // Redirect to new path
    navigate(newPath, { replace: true });
  }, [location.pathname, navigate]);

  return null;
}
