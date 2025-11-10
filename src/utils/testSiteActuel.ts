// 🔍 TEST AUTOMATIQUE : État actuel du site

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║          🔍 TEST AUTOMATIQUE : État du site 🔍               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

🎯 URL actuelle : ${window.location.href}
🌍 Hostname : ${window.location.hostname}
📍 Pathname : ${window.location.pathname}
🔤 Language détectée : ${window.location.pathname.startsWith('/fr') ? 'Français 🇫🇷' : window.location.pathname.startsWith('/en') ? 'English 🇬🇧' : 'Aucune (root)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ DIAGNOSTIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${window.location.pathname === '/' ? '⚠️  Tu es sur la racine (/) - Tu devrais être redirigé vers /fr' : ''}
${window.location.pathname.startsWith('/fr') || window.location.pathname.startsWith('/en') ? '✅ Tu es sur une URL avec préfixe de langue (bon !)' : ''}
${!window.location.pathname.startsWith('/fr') && !window.location.pathname.startsWith('/en') && window.location.pathname !== '/' ? '❌ URL sans préfixe de langue - Problème de routing' : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 TESTS DISPONIBLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tape ces commandes dans la console pour tester :

1️⃣ testRouting()
   → Teste toutes les routes (FR + EN)
   
2️⃣ testNavigation()
   → Teste les liens de navigation
   
3️⃣ testRefresh()
   → Simule une actualisation (F5)
   
4️⃣ diagnosticComplet()
   → Diagnostic complet (toutes les infos)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SI TU AS UNE ERREUR 404
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 Ouvre ce fichier : /DEBUG_404_MAINTENANT.md

Il contient un questionnaire pour diagnostiquer ton problème exact.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 RAPPEL IMPORTANT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ Tu N'AS PAS besoin de créer _redirects manuellement !
✅ Le fichier vercel.json à la racine SUFFIT !

Vérifie juste :
  1. vercel.json existe (sur GitHub)
  2. Vercel a redéployé (status "Ready")
  3. Cache navigateur vidé

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Fonction de test du routing
(window as any).testRouting = () => {
  console.log('\n🧪 TEST : Routes disponibles\n');
  
  const routes = [
    '/fr',
    '/fr/projects',
    '/fr/services',
    '/fr/about',
    '/fr/contact',
    '/fr/blog',
    '/fr/case-studies',
    '/fr/faq',
    '/fr/resources',
    '/fr/testimonials',
    '/en',
    '/en/projects',
    '/en/services',
    '/en/about',
    '/en/contact',
    '/en/blog',
    '/en/case-studies',
    '/en/faq',
    '/en/resources',
    '/en/testimonials',
  ];
  
  console.log('📋 Routes configurées dans React Router :\n');
  routes.forEach(route => {
    console.log(`  ✅ ${route}`);
  });
  
  console.log('\n💡 Pour tester une route, va sur :');
  console.log(`   ${window.location.origin}/fr/projects`);
};

// Fonction de test de navigation
(window as any).testNavigation = () => {
  console.log('\n🧪 TEST : Navigation\n');
  console.log('Clique sur un lien dans le menu de navigation.');
  console.log('Si ça fonctionne → ✅ React Router OK');
  console.log('Si ça ne fonctionne pas → ❌ Problème de routing');
};

// Fonction de test d'actualisation
(window as any).testRefresh = () => {
  console.log('\n🧪 TEST : Actualisation (F5)\n');
  console.log('1. Va sur une page (ex: /fr/projects)');
  console.log('2. Appuie sur F5');
  console.log('3. Si tu vois une 404 → ❌ Problème Vercel (vercel.json ou _redirects)');
  console.log('4. Si la page se recharge → ✅ Tout fonctionne');
};

// Fonction de diagnostic complet
(window as any).diagnosticComplet = () => {
  console.log('\n🔍 DIAGNOSTIC COMPLET\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('📍 URL actuelle :');
  console.log(`   ${window.location.href}\n`);
  
  console.log('🌍 Détails :');
  console.log(`   Protocol : ${window.location.protocol}`);
  console.log(`   Hostname : ${window.location.hostname}`);
  console.log(`   Port : ${window.location.port || '(default)'}`);
  console.log(`   Pathname : ${window.location.pathname}`);
  console.log(`   Search : ${window.location.search || '(none)'}`);
  console.log(`   Hash : ${window.location.hash || '(none)'}\n`);
  
  console.log('🔤 Langue détectée :');
  if (window.location.pathname.startsWith('/fr')) {
    console.log('   🇫🇷 Français');
  } else if (window.location.pathname.startsWith('/en')) {
    console.log('   🇬🇧 English');
  } else if (window.location.pathname === '/') {
    console.log('   ⚠️  Root (/) - Devrait rediriger vers /fr');
  } else {
    console.log('   ❌ Aucun préfixe de langue détecté');
  }
  console.log('');
  
  console.log('🧪 React Router :');
  console.log(`   Status : ${typeof (window as any).React !== 'undefined' ? '✅ Actif' : '❌ Non chargé'}\n`);
  
  console.log('📦 Vercel Configuration :');
  console.log('   vercel.json : Devrait être à la racine du projet');
  console.log('   _redirects : Optionnel (vercel.json suffit)\n');
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('💡 Problèmes détectés :\n');
  
  const problems = [];
  
  if (!window.location.pathname.startsWith('/fr') && !window.location.pathname.startsWith('/en') && window.location.pathname !== '/') {
    problems.push('❌ URL sans préfixe de langue (/fr ou /en)');
  }
  
  if (window.location.pathname === '/') {
    problems.push('⚠️  Tu es sur la racine (/) - Devrait rediriger vers /fr automatiquement');
  }
  
  if (problems.length === 0) {
    console.log('   ✅ Aucun problème détecté !');
  } else {
    problems.forEach(problem => console.log(`   ${problem}`));
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🆘 Besoin d\'aide ?\n');
  console.log('   📖 Ouvre : /DEBUG_404_MAINTENANT.md');
  console.log('   → Questionnaire pour diagnostiquer ton problème exact\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

console.log('💡 Commandes de test chargées !');
console.log('   Tape : testRouting(), testNavigation(), testRefresh(), diagnosticComplet()');
