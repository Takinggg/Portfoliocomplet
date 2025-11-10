/**
 * DIAGNOSTIC NAVIGATION - Outils chargés IMMÉDIATEMENT
 */

// ✅ CHARGER LES FONCTIONS IMMÉDIATEMENT (pas dans setTimeout)

// 1. Show current state
(window as any).showCurrentState = () => {
  const pathname = window.location.pathname;
  const lang = pathname.match(/^\/(en|fr)/)?.[1];
  const isHome = pathname === `/${lang}` || pathname === `/${lang}/`;
  const currentPage = pathname.split('/').filter(Boolean).slice(1).join('/') || 'home';

  console.log(`%c
╔═══════════════════════════════════════════════════════════════╗
║                 ÉTAT ACTUEL DE LA NAVIGATION                  ║
╚═══════════════════════════════════════════════════════════════╝

📍 URL : ${window.location.href}
📂 Path : ${pathname}
🌍 Langue : ${lang || '❌ Non détectée'}
📄 Page : ${currentPage}
🏠 Page d'accueil ? ${isHome ? '✅ OUI' : '❌ NON'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ DIAGNOSTIC :

${lang ? '✅ Langue détectée correctement' : '❌ PROBLÈME : Langue non détectée'}
${pathname.includes('/services') ? '✅ URL contient /services' : pathname.includes('/blog') ? '✅ URL contient /blog' : pathname.includes('/projects') ? '✅ URL contient /projects' : '⚠️  URL ne contient pas de page spécifique'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 ACTIONS DISPONIBLES :

• showCurrentState() - Afficher l'état actuel
• checkNavigation() - Vérifier la navigation
• forceNavigateToServices() - Aller sur Services
• testAllPages() - Lister toutes les URLs

  `, 'color: #F4F4F4; font-size: 13px; background: #1a1a1a; padding: 15px; border-left: 5px solid #00FFC2;');
};

// 2. Check navigation
(window as any).checkNavigation = () => {
  const pathname = window.location.pathname;
  const lang = pathname.match(/^\/(en|fr)/)?.[1];
  const page = pathname.split('/').filter(Boolean).slice(1).join('/') || 'home';

  console.log(`%c
🔍 VÉRIFICATION DE LA NAVIGATION

URL complète : ${window.location.href}
Pathname : ${pathname}
Langue détectée : ${lang || '❌ AUCUNE'}
Page actuelle : ${page}

✅ Tests :
- Préfixe langue présent ? ${lang ? '✅ OUI' : '❌ NON'}
- URL bilingue valide ? ${lang && (lang === 'fr' || lang === 'en') ? '✅ OUI' : '❌ NON'}
- Page identifiée ? ${page ? '✅ OUI' : '❌ NON'}

${lang ? '✅ LA NAVIGATION SEMBLE FONCTIONNER' : '❌ PROBLÈME: Pas de préfixe de langue dans l\'URL'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  `, 'color: #F4F4F4; font-size: 13px; background: #1a1a1a; padding: 12px; border-left: 4px solid #00FFC2;');
};

// 3. Force navigate to services
(window as any).forceNavigateToServices = () => {
  const currentLang = window.location.pathname.match(/^\/(en|fr)/)?.[1] || 'fr';
  const targetURL = `/${currentLang}/services`;
  
  console.log(`%c
🚀 NAVIGATION FORCÉE

Langue actuelle : ${currentLang}
URL cible : ${targetURL}

⏳ Redirection en cours...

  `, 'color: #00FFC2; font-size: 14px; background: #0a2520; padding: 10px;');
  
  window.location.href = targetURL;
};

// 4. Test all pages
(window as any).testAllPages = () => {
  const currentLang = window.location.pathname.match(/^\/(en|fr)/)?.[1] || 'fr';
  const pages = [
    'services',
    'projects',
    'blog',
    'about',
    'contact',
    'booking',
    'case-studies',
    'faq',
    'resources',
    'testimonials'
  ];

  console.log(`%c
🧪 TEST DE NAVIGATION - TOUTES LES PAGES

Langue actuelle : ${currentLang}

URLs disponibles :
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `, 'color: #00FFC2; font-size: 14px;');

  pages.forEach((page, index) => {
    const url = `${window.location.origin}/${currentLang}/${page}`;
    console.log(`${index + 1}. ${url}`);
  });

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Pour tester une page, copie-colle l'URL dans le navigateur
   Ou clique sur les liens du menu !

💡 Pour aller directement sur Services :
   forceNavigateToServices()
  `);
};

// 5. Quick fix function
(window as any).goToServices = () => {
  const lang = window.location.pathname.match(/^\/(en|fr)/)?.[1] || 'fr';
  window.location.href = `/${lang}/services`;
};

(window as any).goToBlog = () => {
  const lang = window.location.pathname.match(/^\/(en|fr)/)?.[1] || 'fr';
  window.location.href = `/${lang}/blog`;
};

(window as any).goToProjects = () => {
  const lang = window.location.pathname.match(/^\/(en|fr)/)?.[1] || 'fr';
  window.location.href = `/${lang}/projects`;
};

// ✅ Message de confirmation immédiat
console.log(`%c
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║          ✅ OUTILS DE DIAGNOSTIC CHARGÉS                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

🔧 FONCTIONS DISPONIBLES :

• showCurrentState() 
  → Affiche l'état actuel de la navigation

• checkNavigation()
  → Vérifie si la navigation fonctionne

• forceNavigateToServices()
  → Va directement sur la page Services

• testAllPages()
  → Liste toutes les URLs disponibles

• goToServices() / goToBlog() / goToProjects()
  → Navigation rapide

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 COMMENCER PAR :

showCurrentState()

Puis clique sur "Services" dans le menu et exécute à nouveau :

showCurrentState()

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`, 'color: #00FFC2; font-size: 14px; background: #0a2520; padding: 15px; border: 2px solid #00FFC2;');

// Display detailed info after 2 seconds
setTimeout(() => {
  const pathname = window.location.pathname;
  const lang = pathname.match(/^\/(en|fr)/)?.[1];
  
  console.log(`%c
📍 INFO AUTOMATIQUE

URL actuelle : ${window.location.href}
Pathname : ${pathname}
Langue : ${lang || 'Non détectée'}

${lang ? '✅ Tu es sur une URL bilingue' : '⚠️  URL sans préfixe de langue'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Pour plus d'infos, exécute : showCurrentState()

  `, 'color: #F4F4F4; font-size: 13px; background: #1a1a1a; padding: 10px;');
}, 2000);

export {};
