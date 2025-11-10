import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * HashRedirectHandler - Redirects hash URLs to clean URLs
 * Handles old email links like /#/invoice/token → /invoice/token
 */
export function HashRedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if URL contains a hash with a path
    const hash = window.location.hash;
    
    if (hash && hash.startsWith('#/')) {
      // Extract the path after the hash
      const path = hash.substring(1); // Remove the # to get /invoice/token
      
      console.log('🔄 Redirecting from hash URL:', hash, '→', path);
      
      // Clean the URL and navigate
      window.history.replaceState(null, '', path);
      navigate(path, { replace: true });
    }
  }, [navigate]);

  return null; // This component doesn't render anything
}
