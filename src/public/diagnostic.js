/**
 * SCRIPT DE DIAGNOSTIC - Ã€ exÃ©cuter dans la console du navigateur
 * Copie-colle ce fichier dans la console pour diagnostiquer les problÃ¨mes
 */

(function() {
  console.clear();
  console.log('%cðŸ” DIAGNOSTIC PORTFOLIO MAXENCE', 'color: #CCFF00; font-size: 24px; font-weight: bold;');
  console.log('');
  
  // 1. Environnement
  console.log('%c1ï¸âƒ£ ENVIRONNEMENT', 'color: #CCFF00; font-size: 18px; font-weight: bold;');
  console.log('URL actuelle:', window.location.href);
  console.log('Hostname:', window.location.hostname);
  console.log('Pathname:', window.location.pathname);
  console.log('Est dans iframe Figma:', window.location.hostname.includes('figma'));
  console.log('');
  
  // 2. Langue
  console.log('%c2ï¸âƒ£ LANGUE', 'color: #CCFF00; font-size: 18px; font-weight: bold;');
  console.log('Langue navigateur:', navigator.language);
  console.log('Langue sauvegardÃ©e:', localStorage.getItem('preferredLanguage') || 'Aucune');
  console.log('Langue URL:', window.location.pathname.split('/')[1] || 'Aucune');
  console.log('');
  
  // 3. Storage
  console.log('%c3ï¸âƒ£ STORAGE', 'color: #CCFF00; font-size: 18px; font-weight: bold;');
  console.log('LocalStorage keys:', Object.keys(localStorage));
  console.log('PWA dismissed:', localStorage.getItem('pwa-install-dismissed') || 'Non');
  console.log('');
  
  // 4. Service Worker
  console.log('%c4ï¸âƒ£ SERVICE WORKER', 'color: #CCFF00; font-size: 18px; font-weight: bold;');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log('Registrations:', registrations.length);
      registrations.forEach((reg, i) => {
        console.log(`  - SW ${i + 1}:`, reg.scope);
      });
    });
  } else {
    console.log('Service Worker non supportÃ©');
  }
  console.log('');
  
  // 5. Fetch requests
  console.log('%c5ï¸âƒ£ NETWORK MONITORING', 'color: #CCFF00; font-size: 18px; font-weight: bold;');
  console.log('Monitoring fetch requests...');
  
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    console.log('%câ†’ FETCH:', 'color: #CCFF00;', args[0]);
    return originalFetch.apply(this, arguments);
  };
  console.log('âœ… Fetch interceptor installÃ©');
  console.log('');
  
  // 6. Routes
  console.log('%c6ï¸âƒ£ TEST ROUTES', 'color: #CCFF00; font-size: 18px; font-weight: bold;');
  const routes = ['/', '/fr', '/en', '/fr/contact', '/en/contact'];
  console.log('Routes Ã  tester:');
  routes.forEach(route => {
    console.log(`  - ${route}`);
  });
  console.log('');
  
  // 7. Erreurs
  console.log('%c7ï¸âƒ£ ERROR MONITORING', 'color: #CCFF00; font-size: 18px; font-weight: bold;');
  
  window.addEventListener('error', (e) => {
    console.error('%câŒ ERROR:', 'color: red; font-weight: bold;', e.message, e.filename, e.lineno);
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    console.error('%câŒ UNHANDLED REJECTION:', 'color: red; font-weight: bold;', e.reason);
  });
  
  console.log('âœ… Error listeners installÃ©s');
  console.log('');
  
  // 8. RÃ©sumÃ©
  console.log('%cðŸ“Š RÃ‰SUMÃ‰', 'color: #CCFF00; font-size: 18px; font-weight: bold;');
  
  const isFigmaPreview = window.location.hostname.includes('figma');
  const isProduction = window.location.hostname.includes('maxence.design');
  const currentLang = window.location.pathname.split('/')[1];
  const hasLanguageInURL = currentLang === 'fr' || currentLang === 'en';
  
  console.log(`Environnement: ${isFigmaPreview ? 'ðŸ”§ Figma Preview' : isProduction ? 'ðŸš€ Production' : 'ðŸ’» DÃ©veloppement'}`);
  console.log(`Langue dans URL: ${hasLanguageInURL ? 'âœ… Oui (' + currentLang + ')' : 'âŒ Non'}`);
  console.log(`Langue dÃ©tectÃ©e: ${localStorage.getItem('preferredLanguage') || 'Aucune'}`);
  console.log('');
  
  // 9. Actions recommandÃ©es
  console.log('%cðŸŽ¯ ACTIONS RECOMMANDÃ‰ES', 'color: #CCFF00; font-size: 18px; font-weight: bold;');
  
  if (!hasLanguageInURL && !isFigmaPreview) {
    console.warn('âš ï¸ Pas de langue dans l\'URL !');
    console.log('â†’ L\'application devrait rediriger vers /fr ou /en');
  }
  
  if (isFigmaPreview) {
    console.log('âœ… Mode preview dÃ©tectÃ© - PWA dÃ©sactivÃ©e');
    console.log('â„¹ï¸  L\'erreur 404 sur figmaiframepreview est normale et sans impact');
  }
  
  if (isProduction && !hasLanguageInURL) {
    console.error('âŒ PROBLÃˆME: Production sans langue dans URL !');
    console.log('â†’ VÃ©rifie la configuration Vercel');
    console.log('â†’ Lis /SOLUTION_ROUTES_404.md');
  }
  
  console.log('');
  console.log('%câœ… Diagnostic terminÃ© !', 'color: #CCFF00; font-size: 18px; font-weight: bold;');
  console.log('');
  
  // Return useful info
  return {
    environment: isFigmaPreview ? 'figma-preview' : isProduction ? 'production' : 'dev',
    url: window.location.href,
    language: currentLang,
    hasLanguageInURL,
    savedLanguage: localStorage.getItem('preferredLanguage'),
    serviceWorkerSupported: 'serviceWorker' in navigator,
    online: navigator.onLine
  };
})();
