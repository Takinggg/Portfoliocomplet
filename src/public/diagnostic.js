/**
 * SCRIPT DE DIAGNOSTIC - À exécuter dans la console du navigateur
 * Copie-colle ce fichier dans la console pour diagnostiquer les problèmes
 */

(function() {
  console.clear();
  console.log('%c🔍 DIAGNOSTIC PORTFOLIO MAXENCE', 'color: #00FFC2; font-size: 24px; font-weight: bold;');
  console.log('');
  
  // 1. Environnement
  console.log('%c1️⃣ ENVIRONNEMENT', 'color: #00FFC2; font-size: 18px; font-weight: bold;');
  console.log('URL actuelle:', window.location.href);
  console.log('Hostname:', window.location.hostname);
  console.log('Pathname:', window.location.pathname);
  console.log('Est dans iframe Figma:', window.location.hostname.includes('figma'));
  console.log('');
  
  // 2. Langue
  console.log('%c2️⃣ LANGUE', 'color: #00FFC2; font-size: 18px; font-weight: bold;');
  console.log('Langue navigateur:', navigator.language);
  console.log('Langue sauvegardée:', localStorage.getItem('preferredLanguage') || 'Aucune');
  console.log('Langue URL:', window.location.pathname.split('/')[1] || 'Aucune');
  console.log('');
  
  // 3. Storage
  console.log('%c3️⃣ STORAGE', 'color: #00FFC2; font-size: 18px; font-weight: bold;');
  console.log('LocalStorage keys:', Object.keys(localStorage));
  console.log('PWA dismissed:', localStorage.getItem('pwa-install-dismissed') || 'Non');
  console.log('');
  
  // 4. Service Worker
  console.log('%c4️⃣ SERVICE WORKER', 'color: #00FFC2; font-size: 18px; font-weight: bold;');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log('Registrations:', registrations.length);
      registrations.forEach((reg, i) => {
        console.log(`  - SW ${i + 1}:`, reg.scope);
      });
    });
  } else {
    console.log('Service Worker non supporté');
  }
  console.log('');
  
  // 5. Fetch requests
  console.log('%c5️⃣ NETWORK MONITORING', 'color: #00FFC2; font-size: 18px; font-weight: bold;');
  console.log('Monitoring fetch requests...');
  
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    console.log('%c→ FETCH:', 'color: #00FFC2;', args[0]);
    return originalFetch.apply(this, arguments);
  };
  console.log('✅ Fetch interceptor installé');
  console.log('');
  
  // 6. Routes
  console.log('%c6️⃣ TEST ROUTES', 'color: #00FFC2; font-size: 18px; font-weight: bold;');
  const routes = ['/', '/fr', '/en', '/fr/contact', '/en/contact'];
  console.log('Routes à tester:');
  routes.forEach(route => {
    console.log(`  - ${route}`);
  });
  console.log('');
  
  // 7. Erreurs
  console.log('%c7️⃣ ERROR MONITORING', 'color: #00FFC2; font-size: 18px; font-weight: bold;');
  
  window.addEventListener('error', (e) => {
    console.error('%c❌ ERROR:', 'color: red; font-weight: bold;', e.message, e.filename, e.lineno);
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    console.error('%c❌ UNHANDLED REJECTION:', 'color: red; font-weight: bold;', e.reason);
  });
  
  console.log('✅ Error listeners installés');
  console.log('');
  
  // 8. Résumé
  console.log('%c📊 RÉSUMÉ', 'color: #00FFC2; font-size: 18px; font-weight: bold;');
  
  const isFigmaPreview = window.location.hostname.includes('figma');
  const isProduction = window.location.hostname.includes('maxence.design');
  const currentLang = window.location.pathname.split('/')[1];
  const hasLanguageInURL = currentLang === 'fr' || currentLang === 'en';
  
  console.log(`Environnement: ${isFigmaPreview ? '🔧 Figma Preview' : isProduction ? '🚀 Production' : '💻 Développement'}`);
  console.log(`Langue dans URL: ${hasLanguageInURL ? '✅ Oui (' + currentLang + ')' : '❌ Non'}`);
  console.log(`Langue détectée: ${localStorage.getItem('preferredLanguage') || 'Aucune'}`);
  console.log('');
  
  // 9. Actions recommandées
  console.log('%c🎯 ACTIONS RECOMMANDÉES', 'color: #00FFC2; font-size: 18px; font-weight: bold;');
  
  if (!hasLanguageInURL && !isFigmaPreview) {
    console.warn('⚠️ Pas de langue dans l\'URL !');
    console.log('→ L\'application devrait rediriger vers /fr ou /en');
  }
  
  if (isFigmaPreview) {
    console.log('✅ Mode preview détecté - PWA désactivée');
    console.log('ℹ️  L\'erreur 404 sur figmaiframepreview est normale et sans impact');
  }
  
  if (isProduction && !hasLanguageInURL) {
    console.error('❌ PROBLÈME: Production sans langue dans URL !');
    console.log('→ Vérifie la configuration Vercel');
    console.log('→ Lis /SOLUTION_ROUTES_404.md');
  }
  
  console.log('');
  console.log('%c✅ Diagnostic terminé !', 'color: #00FFC2; font-size: 18px; font-weight: bold;');
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
