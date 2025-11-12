/**
 * Lazy loading with automatic retry on chunk load failure
 * 
 * When a user has an old cached version of the app and tries to load
 * a chunk with an old hash, this utility will:
 * 1. Catch the chunk load error
 * 2. Force reload the page to get the new index.html with updated hashes
 * 3. Retry the import after reload
 * 
 * This prevents the "Failed to fetch dynamically imported module" error
 * caused by deployment updates while users have cached old versions.
 */

interface LazyRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
}

const defaultOptions: Required<LazyRetryOptions> = {
  maxRetries: 1,
  retryDelay: 1000,
};

/**
 * Enhanced lazy loading with retry mechanism for chunk failures
 * 
 * @example
 * const MyPage = lazyRetry(() => import('./components/pages/MyPage'));
 */
export function lazyRetry<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyRetryOptions = {}
): React.LazyExoticComponent<T> {
  const opts = { ...defaultOptions, ...options };
  
  return React.lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await importFn();
      
      // Success - clear any refresh flag
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      
      return component;
    } catch (error) {
      // If the error is a chunk load error and we haven't refreshed yet
      if (!pageHasAlreadyBeenForceRefreshed && error instanceof Error) {
        const isChunkError = 
          error.message.includes('Failed to fetch dynamically imported module') ||
          error.message.includes('Importing a module script failed') ||
          error.message.includes('error loading dynamically imported module');
        
        if (isChunkError) {
          console.warn('🔄 Chunk load failed, reloading page to get latest version...');
          
          // Mark that we've already refreshed to prevent infinite loops
          window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
          
          // Delay slightly to allow any error logging
          await new Promise(resolve => setTimeout(resolve, opts.retryDelay));
          
          // Hard reload to get the new index.html with updated chunk hashes
          window.location.reload();
          
          // Return a dummy component to satisfy TypeScript (page will reload anyway)
          return { default: (() => null) as any as T };
        }
      }
      
      // If it's not a chunk error or we already tried refreshing, rethrow
      throw error;
    }
  });
}

/**
 * React namespace for TypeScript
 */
import * as React from 'react';
