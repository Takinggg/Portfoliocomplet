/**
 * Language Routing Utilities
 * Handles language-prefixed URLs for bilingual site
 */

export type Language = 'fr' | 'en';

/**
 * Get current language from URL
 */
export function getLanguageFromURL(): Language {
  const pathname = window.location.pathname;
  const match = pathname.match(/^\/(en|fr)(\/|$)/);
  if (match) {
    return match[1] as Language;
  }
  return 'fr'; // Default to French
}

/**
 * Build a path with language prefix
 */
export function buildPath(path: string, language?: Language): string {
  const lang = language || getLanguageFromURL();
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Don't add language prefix to special routes
  const specialRoutes = ['dashboard', 'login', 'newsletter-debug', 'server-diagnostic', 'sync-dashboard'];
  const isSpecialRoute = specialRoutes.some(route => cleanPath === route || cleanPath.startsWith(`${route}/`));
  
  if (isSpecialRoute) {
    return `/${cleanPath}`;
  }
  
  // Add language prefix
  return `/${lang}/${cleanPath}`;
}

/**
 * Navigate with language prefix
 */
export function navigateWithLanguage(navigate: (path: string) => void, path: string, language?: Language) {
  const fullPath = buildPath(path, language);
  navigate(fullPath);
}

/**
 * Get path without language prefix
 */
export function getPathWithoutLanguage(path: string): string {
  return path.replace(/^\/(en|fr)(\/|$)/, '/');
}

/**
 * Switch language while keeping the same page
 */
export function switchLanguage(currentPath: string, newLanguage: Language): string {
  const pathWithoutLang = getPathWithoutLanguage(currentPath);
  return buildPath(pathWithoutLang, newLanguage);
}

/**
 * Get all page names for routing
 */
export const pageNames = [
  'home',
  'projects',
  'services',
  'about',
  'contact',
  'booking',
  'blog',
  'case-studies',
  'faq',
  'resources',
  'testimonials'
] as const;

export type PageName = typeof pageNames[number];

/**
 * Map page names to paths
 */
export const pagePaths: Record<PageName, string> = {
  'home': '',
  'projects': 'projects',
  'services': 'services',
  'about': 'about',
  'contact': 'contact',
  'booking': 'booking',
  'blog': 'blog',
  'case-studies': 'case-studies',
  'faq': 'faq',
  'resources': 'resources',
  'testimonials': 'testimonials'
};
