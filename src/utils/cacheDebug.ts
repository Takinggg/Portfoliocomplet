/**
 * Debug utility to inspect and manage API cache
 * Only available in development mode
 */

import { apiCache } from './apiCache';

// Expose cache management to window object in development
if (import.meta.env.DEV) {
  (window as any).__API_CACHE__ = {
    /**
     * Clear all cache
     */
    clearAll: () => {
      apiCache.clear();
      console.log('✅ All cache cleared');
    },
    
    /**
     * Invalidate specific cache key
     */
    invalidate: (key: string) => {
      apiCache.invalidate(key);
      console.log(`✅ Cache invalidated: ${key}`);
    },
    
    /**
     * Invalidate all projects cache
     */
    clearProjects: () => {
      apiCache.invalidate('projects_en');
      apiCache.invalidate('projects_fr');
      console.log('✅ Projects cache cleared');
    },
    
    /**
     * Invalidate all blog cache
     */
    clearBlog: () => {
      apiCache.invalidate('blog_posts_en');
      apiCache.invalidate('blog_posts_fr');
      console.log('✅ Blog cache cleared');
    },
    
    /**
     * Show help
     */
    help: () => {
      console.log(`
🔧 API Cache Debug Utility

Available commands:
  __API_CACHE__.clearAll()        - Clear all cache
  __API_CACHE__.clearProjects()   - Clear projects cache (EN + FR)
  __API_CACHE__.clearBlog()       - Clear blog cache (EN + FR)
  __API_CACHE__.invalidate(key)   - Clear specific cache key
  __API_CACHE__.help()            - Show this help

Cache keys:
  - projects_en / projects_fr
  - blog_posts_en / blog_posts_fr
  - resources_en / resources_fr
      `);
    }
  };
  
  console.log('🔧 API Cache debug utility loaded. Type __API_CACHE__.help() for commands');
}

export {};
