/**
 * URL Helpers for SEO-friendly multilingual routing
 * Utilities to generate clean URLs with language prefixes
 */

import { Language } from '../i18n/LanguageContext';

/**
 * Get the current language from the URL path
 * /en/blog -> 'en'
 * /fr/about -> 'fr'
 * /blog -> 'fr' (default)
 */
export function getLanguageFromPath(pathname: string): Language {
  const match = pathname.match(/^\/(en|fr)(\/|$)/);
  if (match) {
    return match[1] as Language;
  }
  return 'fr'; // Default language
}

/**
 * Remove language prefix from path
 * /en/blog -> /blog
 * /fr/about -> /about
 */
export function removeLanguagePrefix(pathname: string): string {
  return pathname.replace(/^\/(en|fr)(\/|$)/, '/');
}

/**
 * Add language prefix to path
 * HashRouter: blog + 'en' -> en/blog (pas de / au début)
 * BrowserRouter: /blog + 'en' -> /en/blog
 */
export function addLanguagePrefix(path: string, language: Language): string {
  // Remove any existing language prefix first
  const cleanPath = removeLanguagePrefix(path);
  
  // HashRouter: pas de / au début
  if (cleanPath === '/' || cleanPath === '') {
    return language;
  }
  
  // Si le path commence par /, on le garde (pour les sous-routes)
  if (cleanPath.startsWith('/')) {
    return `${language}${cleanPath}`;
  }
  
  return `${language}/${cleanPath}`;
}

/**
 * Get alternate URL for the other language
 * /fr/blog -> /en/blog
 * /en/blog -> /fr/blog
 */
export function getAlternateUrl(pathname: string, targetLanguage: Language): string {
  const cleanPath = removeLanguagePrefix(pathname);
  return addLanguagePrefix(cleanPath, targetLanguage);
}

/**
 * Generate full URL for sitemap
 */
export function getFullUrl(path: string, language: Language): string {
  // Use window.location.origin in browser context, import.meta.env in build context
  let baseUrl = 'https://maxenss.com'; // Default fallback
  
  if (typeof window !== 'undefined' && window.location) {
    baseUrl = window.location.origin;
  } else if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) {
    baseUrl = import.meta.env.VITE_SITE_URL;
  }
  
  const localizedPath = addLanguagePrefix(path, language);
  return `${baseUrl}${localizedPath}`;
}

/**
 * Convert page type to URL path
 */
export function pageToPath(page: string, id?: string): string {
  switch (page) {
    case 'home':
      return '/';
    case 'projects':
      return '/projects';
    case 'project-detail':
      return id ? `/projects/${id}` : '/projects';
    case 'services':
      return '/services';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    case 'booking':
      return '/booking';
    case 'blog':
      return '/blog';
    case 'blog-post':
      return id ? `/blog/${id}` : '/blog';
    case 'case-studies':
      return '/case-studies';
    case 'case-study':
      return id ? `/case-studies/${id}` : '/case-studies';
    case 'faq':
      return '/faq';
    case 'resources':
      return '/resources';
    case 'testimonials':
      return '/testimonials';
    default:
      return '/';
  }
}

/**
 * Convert URL path to page type and id
 */
export function pathToPage(pathname: string): { page: string; id?: string } {
  const cleanPath = removeLanguagePrefix(pathname);
  
  // Remove trailing slash
  const path = cleanPath.replace(/\/$/, '') || '/';
  
  // Match patterns
  if (path === '/') return { page: 'home' };
  if (path === '/projects') return { page: 'projects' };
  if (path.startsWith('/projects/')) return { page: 'project-detail', id: path.split('/')[2] };
  if (path === '/services') return { page: 'services' };
  if (path === '/about') return { page: 'about' };
  if (path === '/contact') return { page: 'contact' };
  if (path === '/booking') return { page: 'booking' };
  if (path === '/blog') return { page: 'blog' };
  if (path.startsWith('/blog/')) return { page: 'blog-post', id: path.split('/')[2] };
  if (path === '/case-studies') return { page: 'case-studies' };
  if (path.startsWith('/case-studies/')) return { page: 'case-study', id: path.split('/')[2] };
  if (path === '/faq') return { page: 'faq' };
  if (path === '/resources') return { page: 'resources' };
  if (path === '/testimonials') return { page: 'testimonials' };
  if (path === '/login') return { page: 'login' };
  if (path === '/dashboard') return { page: 'dashboard' };
  
  return { page: 'home' }; // Default fallback
}

/**
 * Generate hreflang links for a page
 */
export function generateHrefLangLinks(pathname: string): Array<{ lang: Language; url: string }> {
  const cleanPath = removeLanguagePrefix(pathname);
  
  return [
    { lang: 'fr', url: getFullUrl(cleanPath, 'fr') },
    { lang: 'en', url: getFullUrl(cleanPath, 'en') },
  ];
}
