/**
 * Hash URL Redirect Script
 * Executes BEFORE React loads to handle hash URLs immediately
 * Converts /#/invoice/token → /invoice/token
 */
(function() {
  // Check if URL has a hash with a path
  const hash = window.location.hash;
  
  if (hash && hash.startsWith('#/')) {
    // Extract the path after the hash
    const path = hash.substring(1); // Remove # to get /invoice/token
    
    console.log('🔄 Pre-React Hash Redirect');
    console.log('   From:', window.location.href);
    console.log('   To:', path);
    
    // Replace the current URL without adding to history
    window.history.replaceState(null, '', path);
    
    // Force a reload to let React Router handle the clean URL
    window.location.replace(path);
  }
})();
