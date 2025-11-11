/**
 * 🔍 DIAGNOSTIC ULTIME - TROUVE LE VRAI PROBLÈME
 * 
 * Ce script teste TOUT et donne un diagnostic PRÉCIS
 */

interface DiagnosticTestResult {
  status?: number;
  exists?: boolean;
  contentType?: string | null;
  hasRoot?: boolean;
  size?: number;
  content?: unknown;
  isHTML?: boolean;
  error?: string;
}

interface DiagnosticResults {
  url: string;
  pathname: string;
  hostname: string;
  timestamp: string;
  tests: Record<string, DiagnosticTestResult>;
  recommendation: string;
}

export async function runUltimateDiagnostic() {
  console.clear();
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00FFC2; font-weight: bold;');
  console.log('%c🔍 DIAGNOSTIC ULTIME - DÉTECTION DU PROBLÈME 404', 'color: #00FFC2; font-size: 20px; font-weight: bold;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00FFC2; font-weight: bold;');
  console.log('');

  const results: DiagnosticResults = {
    url: window.location.href,
    pathname: window.location.pathname,
    hostname: window.location.hostname,
    timestamp: new Date().toISOString(),
    tests: {},
    recommendation: '',
  };

  // ═══════════════════════════════════════════════════════════
  // TEST 1 : Vérifier les fichiers de config
  // ═══════════════════════════════════════════════════════════
  console.log('%c📋 TEST 1 : Fichiers de configuration', 'color: #00ccff; font-size: 16px; font-weight: bold;');
  console.log('');

  try {
    const res200 = await fetch('/200.html');
    results.tests.file200 = {
      status: res200.status,
      exists: res200.status === 200,
      contentType: res200.headers.get('content-type'),
    };
    console.log('  200.html:', res200.status === 200 ? '✅ EXISTE' : '❌ MANQUANT', `(${res200.status})`);
    
    if (res200.status === 200) {
      const html = await res200.text();
      results.tests.file200.hasRoot = html.includes('id="root"');
      results.tests.file200.size = html.length;
      console.log('    → Contient <div id="root">:', html.includes('id="root"') ? '✅ OUI' : '❌ NON');
      console.log('    → Taille:', html.length, 'bytes');
    }
  } catch (e) {
    results.tests.file200 = { error: e.message };
    console.log('  200.html: ❌ ERREUR', e.message);
  }

  try {
    const resIndex = await fetch('/index.html');
    results.tests.indexHtml = {
      status: resIndex.status,
      exists: resIndex.status === 200,
    };
    console.log('  index.html:', resIndex.status === 200 ? '✅ EXISTE' : '❌ MANQUANT', `(${resIndex.status})`);
  } catch (e) {
    results.tests.indexHtml = { error: e.message };
    console.log('  index.html: ❌ ERREUR', e.message);
  }

  try {
    const resVercel = await fetch('/vercel.json');
    results.tests.vercelJson = {
      status: resVercel.status,
      exists: resVercel.status === 200,
    };
    console.log('  vercel.json:', resVercel.status === 200 ? '⚠️ EXISTE (Figma Make devrait ignorer)' : '✅ 404 (Normal avec Figma Make)', `(${resVercel.status})`);
    
    if (resVercel.status === 200) {
      const json = await resVercel.json();
      results.tests.vercelJson.content = json;
      console.log('    → Contenu:', JSON.stringify(json, null, 2));
    }
  } catch (e) {
    results.tests.vercelJson = { error: e.message };
    console.log('  vercel.json: ❌ ERREUR', e.message);
  }

  console.log('');

  // ═══════════════════════════════════════════════════════════
  // TEST 2 : Tester les routes existantes
  // ═══════════════════════════════════════════════════════════
  console.log('%c🛣️ TEST 2 : Routes existantes', 'color: #00ccff; font-size: 16px; font-weight: bold;');
  console.log('');

  const routesToTest = ['/', '/fr', '/en', '/fr/projects', '/test-inexistant-12345'];
  
  for (const route of routesToTest) {
    try {
      const res = await fetch(route);
      const html = await res.text();
      const isHTML = html.includes('<html') || html.includes('<!DOCTYPE');
      const hasRoot = html.includes('id="root"');
      
      results.tests[`route_${route.replace(/\//g, '_')}`] = {
        status: res.status,
        isHTML,
        hasRoot,
      };
      
      console.log(`  ${route}:`);
      console.log(`    → Status: ${res.status}`);
      console.log(`    → Est HTML: ${isHTML ? '✅ OUI' : '❌ NON'}`);
      console.log(`    → Contient <div id="root">: ${hasRoot ? '✅ OUI' : '❌ NON'}`);
      
      if (res.status === 404) {
        console.log(`    → ⚠️ ROUTE RETOURNE 404 !`);
      }
    } catch (e) {
      results.tests[`route_${route.replace(/\//g, '_')}`] = { error: e.message };
      console.log(`  ${route}: ❌ ERREUR`, e.message);
    }
  }

  console.log('');

  // ═══════════════════════════════════════════════════════════
  // TEST 3 : Vérifier l'environnement
  // ═══════════════════════════════════════════════════════════
  console.log('%c⚙️ TEST 3 : Environnement', 'color: #00ccff; font-size: 16px; font-weight: bold;');
  console.log('');

  results.environment = {
    isProduction: window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1'),
    isVercel: window.location.hostname.includes('vercel.app') || window.location.hostname.includes('maxence.design'),
    isLocalhost: window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1'),
    protocol: window.location.protocol,
    userAgent: navigator.userAgent,
  };

  console.log('  Production:', results.environment.isProduction ? '✅ OUI' : '❌ NON (localhost)');
  console.log('  Vercel:', results.environment.isVercel ? '✅ OUI' : '❌ NON');
  console.log('  Localhost:', results.environment.isLocalhost ? '✅ OUI' : '❌ NON');
  console.log('  Protocol:', results.environment.protocol);

  console.log('');

  // ═══════════════════════════════════════════════════════════
  // TEST 4 : Vérifier le routing React
  // ═══════════════════════════════════════════════════════════
  console.log('%c⚛️ TEST 4 : React Router', 'color: #00ccff; font-size: 16px; font-weight: bold;');
  console.log('');

  const rootElement = document.getElementById('root');
  results.reactRouter = {
    rootExists: !!rootElement,
    hasChildren: rootElement ? rootElement.children.length > 0 : false,
    innerHTML: rootElement ? rootElement.innerHTML.length : 0,
  };

  console.log('  <div id="root"> existe:', results.reactRouter.rootExists ? '✅ OUI' : '❌ NON');
  console.log('  React a monté des composants:', results.reactRouter.hasChildren ? '✅ OUI' : '❌ NON');
  console.log('  Taille du contenu:', results.reactRouter.innerHTML, 'bytes');

  console.log('');

  // ═══════════════════════════════════════════════════════════
  // ANALYSE ET RECOMMANDATION
  // ═══════════════════════════════════════════════════════════
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00FFC2; font-weight: bold;');
  console.log('%c📊 ANALYSE ET RECOMMANDATION', 'color: #00FFC2; font-size: 18px; font-weight: bold;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00FFC2; font-weight: bold;');
  console.log('');

  // Analyser les résultats
  const file200Exists = results.tests.file200?.exists;
  const file200HasRoot = results.tests.file200?.hasRoot;
  const routesFail = results.tests.route__fr?.status === 404 || results.tests.route__en?.status === 404;
  const isProduction = results.environment.isProduction;

  if (!isProduction) {
    console.log('%c⚠️ TU ES EN LOCALHOST !', 'color: #ff9900; font-size: 16px; font-weight: bold;');
    console.log('');
    console.log('Le problème 404 concerne seulement la PRODUCTION (Vercel).');
    console.log('En localhost, le dev server de Vite gère automatiquement les routes.');
    console.log('');
    console.log('✅ ACTION : PUSH sur GitHub et teste sur Vercel !');
    results.recommendation = 'LOCALHOST_OK_TEST_PRODUCTION';
  } else if (file200Exists && file200HasRoot && routesFail) {
    console.log('%c❌ PROBLÈME IDENTIFIÉ : 200.html EXISTE MAIS N\'EST PAS UTILISÉ !', 'color: #ff0000; font-size: 16px; font-weight: bold;');
    console.log('');
    console.log('Diagnostic :');
    console.log('  ✅ Le fichier 200.html existe');
    console.log('  ✅ Le fichier contient <div id="root">');
    console.log('  ❌ Mais les routes retournent quand même 404');
    console.log('');
    console.log('Cause probable :');
    console.log('  → Figma Make ou Vercel a une configuration qui empêche 200.html de fonctionner');
    console.log('  → Le fichier vercel.json est peut-être ignoré ou mal configuré');
    console.log('');
    console.log('%c🎯 RECOMMANDATION : PASSER AU HASH ROUTING', 'color: #00FFC2; font-size: 16px; font-weight: bold;');
    console.log('');
    console.log('Le Hash Routing (#/fr au lieu de /fr) fonctionne à 100% sans aucune config serveur !');
    console.log('');
    console.log('URLs :');
    console.log('  ❌ Avant : https://maxence.design/fr');
    console.log('  ✅ Après : https://maxence.design/#/fr');
    console.log('');
    console.log('Modification : 2 lignes de code dans AppWithRouter.tsx');
    results.recommendation = 'USE_HASH_ROUTING';
  } else if (!file200Exists) {
    console.log('%c❌ PROBLÈME : 200.html N\'EXISTE PAS SUR LE SERVEUR !', 'color: #ff0000; font-size: 16px; font-weight: bold;');
    console.log('');
    console.log('Le fichier existe dans le code mais n\'a pas été déployé.');
    console.log('');
    console.log('Causes possibles :');
    console.log('  1. Le build Vite n\'a pas copié le fichier');
    console.log('  2. Figma Make a un système de build qui ignore certains fichiers');
    console.log('  3. Le fichier est dans /public mais n\'arrive pas dans /build');
    console.log('');
    console.log('%c🎯 RECOMMANDATION : VÉRIFIER LE BUILD', 'color: #00FFC2; font-size: 16px; font-weight: bold;');
    console.log('');
    console.log('1. Va sur Vercel Dashboard → Deployments');
    console.log('2. Clique sur le dernier déploiement');
    console.log('3. Regarde les Build Logs');
    console.log('4. Cherche la ligne : "Created 200.html for Vercel SPA routing"');
    console.log('');
    console.log('Si tu ne la trouves pas → Le plugin Vite ne fonctionne pas');
    console.log('');
    console.log('SOLUTION ALTERNATIVE : Passer au Hash Routing (fonctionne sans config)');
    results.recommendation = 'CHECK_BUILD_LOGS_OR_HASH_ROUTING';
  } else if (!routesFail) {
    console.log('%c✅ TOUT FONCTIONNE ! AUCUN PROBLÈME DÉTECTÉ !', 'color: #00ff00; font-size: 16px; font-weight: bold;');
    console.log('');
    console.log('Toutes les routes fonctionnent correctement :');
    console.log('  ✅ /fr retourne du HTML avec <div id="root">');
    console.log('  ✅ /en retourne du HTML avec <div id="root">');
    console.log('  ✅ React Router gère les routes');
    console.log('');
    console.log('Si tu vois quand même une page 404, c\'est probablement un problème de cache.');
    console.log('');
    console.log('SOLUTION :');
    console.log('  1. Vide le cache du navigateur (Ctrl+Shift+Delete)');
    console.log('  2. Force un refresh (Ctrl+Shift+R)');
    console.log('  3. Teste en navigation privée (Ctrl+Shift+N)');
    results.recommendation = 'ALL_OK_CLEAR_CACHE';
  } else {
    console.log('%c❓ PROBLÈME INCONNU', 'color: #ff9900; font-size: 16px; font-weight: bold;');
    console.log('');
    console.log('Le diagnostic n\'a pas pu identifier le problème exact.');
    console.log('');
    console.log('%c🎯 RECOMMANDATION : HASH ROUTING (SOLUTION GARANTIE)', 'color: #00FFC2; font-size: 16px; font-weight: bold;');
    console.log('');
    console.log('Le Hash Routing fonctionne à 100% dans TOUS les cas.');
    results.recommendation = 'USE_HASH_ROUTING_FALLBACK';
  }

  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00FFC2; font-weight: bold;');
  console.log('');
  console.log('%c📋 RAPPORT COMPLET :', 'color: #00ccff; font-size: 14px; font-weight: bold;');
  console.log('');
  console.log(JSON.stringify(results, null, 2));
  console.log('');
  console.log('%c💾 COPIE CE RAPPORT ET ENVOIE-LE MOI POUR ANALYSE !', 'color: #ff00ff; font-size: 14px; font-weight: bold;');
  console.log('');

  return results;
}

// Auto-exécution si en production
if (typeof window !== 'undefined') {
  const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
  
  if (isProduction) {
    console.log('%c🔍 DIAGNOSTIC AUTOMATIQUE EN PRODUCTION', 'color: #00FFC2; font-size: 14px; font-weight: bold;');
    console.log('Le diagnostic va se lancer dans 3 secondes...');
    console.log('Pour le lancer maintenant, tape : runUltimateDiagnostic()');
    console.log('');
    
    // @ts-ignore
    window.runUltimateDiagnostic = runUltimateDiagnostic;
    
    setTimeout(() => {
      runUltimateDiagnostic();
    }, 3000);
  } else {
    console.log('%c🏠 MODE LOCALHOST', 'color: #00ccff; font-size: 14px;');
    console.log('Le diagnostic automatique ne se lance qu\'en production.');
    console.log('Pour le lancer manuellement, tape : runUltimateDiagnostic()');
    console.log('');
    
    // @ts-ignore
    window.runUltimateDiagnostic = runUltimateDiagnostic;
  }
}

