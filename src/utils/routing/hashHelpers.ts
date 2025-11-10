/**
 * Helpers for HashRouter navigation
 * HashRouter uses window.location.hash instead of pathname
 */

/**
 * Get current language from hash
 * @returns 'fr' or 'en'
 */
export function getLanguageFromHash(): string {
  const hash = window.location.hash; // Ex: #/fr/projects ou #/en
  const match = hash.match(/#\/(en|fr)(\/|$)/);
  return match ? match[1] : 'fr';
}

/**
 * Get current page from hash (without language prefix)
 * @returns page path without language, ex: '/projects' or ''
 */
export function getPageFromHash(): string {
  const hash = window.location.hash; // Ex: #/fr/projects
  const withoutLang = hash.replace(/#\/(en|fr)/, ''); // Remove #/fr or #/en
  return withoutLang || '/';
}

/**
 * Build a navigation path with language prefix
 * @param page - page name like 'projects', 'about', 'home'
 * @param lang - optional language, will use current if not provided
 * @returns ABSOLUTE path for navigation, ex: '/fr/projects'
 * 
 * IMPORTANT: HashRouter needs ABSOLUTE paths (starting with /) to avoid duplication
 */
export function buildHashPath(page: string, lang?: string): string {
  const currentLang = lang || getLanguageFromHash();
  
  // Special routes without language prefix (absolute path needed!)
  if (page === 'dashboard' || page === 'login') {
    return `/${page}`; // Leading / makes it absolute in HashRouter
  }
  
  // Home page - ABSOLUTE path
  if (page === 'home') {
    return `/${currentLang}`;
  }
  
  // All other pages with language prefix - ABSOLUTE paths
  return `/${currentLang}/${page}`;
}
