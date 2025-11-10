// 🔍 SCRIPT DE DIAGNOSTIC AUTOMATIQUE
// Copie-colle ce code dans la console du navigateur sur https://www.maxence.design/fr

(async function diagnosticComplet() {
  console.log('%c🔍 DIAGNOSTIC AUTOMATIQUE DÉMARRÉ', 'color: #00ff00; font-size: 20px; font-weight: bold;');
  console.log('');
  
  // Test 1 : URL actuelle
  console.log('%c1️⃣ URL ACTUELLE', 'color: #00ccff; font-size: 16px; font-weight: bold;');
  console.log('  Pathname:', window.location.pathname);
  console.log('  Hostname:', window.location.hostname);
  console.log('  Full URL:', window.location.href);
  console.log('');
  
  // Test 2 : React Router
  console.log('%c2️⃣ REACT ROUTER', 'color: #00ccff; font-size: 16px; font-weight: bold;');
  const rootElement = document.getElementById('root');
  if (rootElement) {
    console.log('  ✅ Element #root trouvé');
    console.log('  Contenu:', rootElement.innerHTML.substring(0, 100) + '...');
  } else {
    console.log('  ❌ Element #root NOT FOUND !');
  }
  console.log('');
  
  // Test 3 : Tester vercel.json
  console.log('%c3️⃣ TEST VERCEL.JSON', 'color: #00ccff; font-size: 16px; font-weight: bold;');
  try {
    const vercelJsonResponse = await fetch('/vercel.json');
    if (vercelJsonResponse.ok) {
      const vercelJson = await vercelJsonResponse.json();
      console.log('  ✅ vercel.json accessible !');
      console.log('  Contenu:', JSON.stringify(vercelJson, null, 2));
    } else {
      console.log('  ❌ vercel.json retourne:', vercelJsonResponse.status);
    }
  } catch (error) {
    console.log('  ❌ Erreur lors du fetch de vercel.json:', error.message);
  }
  console.log('');
  
  // Test 4 : Tester une route qui n'existe pas
  console.log('%c4️⃣ TEST ROUTE INEXISTANTE', 'color: #00ccff; font-size: 16px; font-weight: bold;');
  try {
    const testResponse = await fetch('/test-route-qui-existe-pas-12345');
    console.log('  Status Code:', testResponse.status);
    if (testResponse.status === 200) {
      console.log('  ✅ Retourne 200 (les rewrites fonctionnent !)');
    } else if (testResponse.status === 404) {
      console.log('  ❌ Retourne 404 (les rewrites NE fonctionnent PAS !)');
    }
  } catch (error) {
    console.log('  ❌ Erreur:', error.message);
  }
  console.log('');
  
  // Test 5 : Vérifier les scripts chargés
  console.log('%c5️⃣ SCRIPTS CHARGÉS', 'color: #00ccff; font-size: 16px; font-weight: bold;');
  const scripts = document.querySelectorAll('script');
  console.log('  Nombre de scripts:', scripts.length);
  scripts.forEach((script, index) => {
    if (script.src) {
      console.log(`  Script ${index + 1}:`, script.src);
    }
  });
  console.log('');
  
  // Test 6 : Vérifier les erreurs réseau
  console.log('%c6️⃣ VÉRIFICATION ERREURS RÉSEAU', 'color: #00ccff; font-size: 16px; font-weight: bold;');
  console.log('  Ouvre l\'onglet "Network" (Réseau) dans les DevTools');
  console.log('  Cherche les requêtes en rouge (erreurs 404, 500, etc.)');
  console.log('');
  
  // Test 7 : Environment
  console.log('%c7️⃣ ENVIRONMENT', 'color: #00ccff; font-size: 16px; font-weight: bold;');
  console.log('  User Agent:', navigator.userAgent);
  console.log('  Online:', navigator.onLine);
  console.log('  Language:', navigator.language);
  console.log('');
  
  // Test 8 : Résumé
  console.log('%c═══════════════════════════════════════', 'color: #ffff00; font-weight: bold;');
  console.log('%c📋 RÉSUMÉ DU DIAGNOSTIC', 'color: #ffff00; font-size: 18px; font-weight: bold;');
  console.log('%c═══════════════════════════════════════', 'color: #ffff00; font-weight: bold;');
  console.log('');
  console.log('Copie-colle TOUT le texte ci-dessus et envoie-le moi !');
  console.log('');
  console.log('%cActions recommandées :', 'color: #ff9900; font-size: 14px; font-weight: bold;');
  console.log('  1. Si vercel.json retourne 404 → Le fichier n\'a pas été déployé');
  console.log('  2. Si la route inexistante retourne 404 → Les rewrites ne fonctionnent pas');
  console.log('  3. Si #root est vide → React ne se charge pas correctement');
  console.log('');
})();
