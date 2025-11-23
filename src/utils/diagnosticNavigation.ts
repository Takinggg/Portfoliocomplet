/**
 * DIAGNOSTIC NAVIGATION - Outils chargÃ©s IMMÃ‰DIATEMENT
 */

// âœ… CHARGER LES FONCTIONS IMMÃ‰DIATEMENT (pas dans setTimeout)

// 1. Show current state
(window as any).showCurrentState = () => {
  const pathname = window.location.pathname;
  const lang = pathname.match(/^\/(en|fr)/)?.[1];
  const isHome = pathname === `/${lang}` || pathname === `/${lang}/`;
  const currentPage = pathname.split('/').filter(Boolean).slice(1).join('/') || 'home';

  console.log(`%c
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘                 Ã‰TAT ACTUEL DE LA NAVIGATION                  â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

ðŸ“ URL : ${window.location.href}
ðŸ“‚ Path : ${pathname}
ðŸŒ Langue : ${lang || 'âŒ Non dÃ©tectÃ©e'}
ðŸ“„ Page : ${currentPage}
ðŸ  Page d'accueil ? ${isHome ? 'âœ… OUI' : 'âŒ NON'}

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

âœ… DIAGNOSTIC :

${lang ? 'âœ… Langue dÃ©tectÃ©e correctement' : 'âŒ PROBLÃˆME : Langue non dÃ©tectÃ©e'}
${pathname.includes('/services') ? 'âœ… URL contient /services' : pathname.includes('/blog') ? 'âœ… URL contient /blog' : pathname.includes('/projects') ? 'âœ… URL contient /projects' : 'âš ï¸  URL ne contient pas de page spÃ©cifique'}

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

ðŸ’¡ ACTIONS DISPONIBLES :

â€¢ showCurrentState() - Afficher l'Ã©tat actuel
â€¢ checkNavigation() - VÃ©rifier la navigation
â€¢ forceNavigateToServices() - Aller sur Services
â€¢ testAllPages() - Lister toutes les URLs

  `, 'color: #F4F4F4; font-size: 13px; background: #1a1a1a; padding: 15px; border-left: 5px solid #CCFF00;');
};

// 2. Check navigation
(window as any).checkNavigation = () => {
  const pathname = window.location.pathname;
  const lang = pathname.match(/^\/(en|fr)/)?.[1];
  const page = pathname.split('/').filter(Boolean).slice(1).join('/') || 'home';

  console.log(`%c
ðŸ” VÃ‰RIFICATION DE LA NAVIGATION

URL complÃ¨te : ${window.location.href}
Pathname : ${pathname}
Langue dÃ©tectÃ©e : ${lang || 'âŒ AUCUNE'}
Page actuelle : ${page}

âœ… Tests :
- PrÃ©fixe langue prÃ©sent ? ${lang ? 'âœ… OUI' : 'âŒ NON'}
- URL bilingue valide ? ${lang && (lang === 'fr' || lang === 'en') ? 'âœ… OUI' : 'âŒ NON'}
- Page identifiÃ©e ? ${page ? 'âœ… OUI' : 'âŒ NON'}

${lang ? 'âœ… LA NAVIGATION SEMBLE FONCTIONNER' : 'âŒ PROBLÃˆME: Pas de prÃ©fixe de langue dans l\'URL'}

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

  `, 'color: #F4F4F4; font-size: 13px; background: #1a1a1a; padding: 12px; border-left: 4px solid #CCFF00;');
};

// 3. Force navigate to services
(window as any).forceNavigateToServices = () => {
  const currentLang = window.location.pathname.match(/^\/(en|fr)/)?.[1] || 'fr';
  const targetURL = `/${currentLang}/services`;
  
  console.log(`%c
ðŸš€ NAVIGATION FORCÃ‰E

Langue actuelle : ${currentLang}
URL cible : ${targetURL}

â³ Redirection en cours...

  `, 'color: #CCFF00; font-size: 14px; background: #0a2520; padding: 10px;');
  
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
ðŸ§ª TEST DE NAVIGATION - TOUTES LES PAGES

Langue actuelle : ${currentLang}

URLs disponibles :
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
  `, 'color: #CCFF00; font-size: 14px;');

  pages.forEach((page, index) => {
    const url = `${window.location.origin}/${currentLang}/${page}`;
    console.log(`${index + 1}. ${url}`);
  });

  console.log(`
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

ðŸ’¡ Pour tester une page, copie-colle l'URL dans le navigateur
   Ou clique sur les liens du menu !

ðŸ’¡ Pour aller directement sur Services :
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

// âœ… Message de confirmation immÃ©diat
console.log(`%c
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘                                                               â•‘
â•‘          âœ… OUTILS DE DIAGNOSTIC CHARGÃ‰S                     â•‘
â•‘                                                               â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

ðŸ”§ FONCTIONS DISPONIBLES :

â€¢ showCurrentState() 
  â†’ Affiche l'Ã©tat actuel de la navigation

â€¢ checkNavigation()
  â†’ VÃ©rifie si la navigation fonctionne

â€¢ forceNavigateToServices()
  â†’ Va directement sur la page Services

â€¢ testAllPages()
  â†’ Liste toutes les URLs disponibles

â€¢ goToServices() / goToBlog() / goToProjects()
  â†’ Navigation rapide

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

ðŸŽ¯ COMMENCER PAR :

showCurrentState()

Puis clique sur "Services" dans le menu et exÃ©cute Ã  nouveau :

showCurrentState()

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

`, 'color: #CCFF00; font-size: 14px; background: #0a2520; padding: 15px; border: 2px solid #CCFF00;');

// Display detailed info after 2 seconds
setTimeout(() => {
  const pathname = window.location.pathname;
  const lang = pathname.match(/^\/(en|fr)/)?.[1];
  
  console.log(`%c
ðŸ“ INFO AUTOMATIQUE

URL actuelle : ${window.location.href}
Pathname : ${pathname}
Langue : ${lang || 'Non dÃ©tectÃ©e'}

${lang ? 'âœ… Tu es sur une URL bilingue' : 'âš ï¸  URL sans prÃ©fixe de langue'}

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

ðŸ’¡ Pour plus d'infos, exÃ©cute : showCurrentState()

  `, 'color: #F4F4F4; font-size: 13px; background: #1a1a1a; padding: 10px;');
}, 2000);

export {};
