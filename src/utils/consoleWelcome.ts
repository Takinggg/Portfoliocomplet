/**
 * Affiche un message de bienvenue stylisÃ© dans la console
 * avec des instructions de dÃ©ploiement si nÃ©cessaire
 */

export function showConsoleWelcome() {
  const styles = {
    title: 'color: #CCFF00; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px rgba(204, 255, 0,0.5);',
    error: 'color: #ef4444; font-weight: bold; font-size: 14px;',
    success: 'color: #22c55e; font-weight: bold;',
    info: 'color: #60a5fa; font-weight: bold;',
    warning: 'color: #fbbf24; font-weight: bold;',
    step: 'color: #CCFF00; font-weight: bold;',
    normal: 'color: #F4F4F4;',
    code: 'background: #000; color: #CCFF00; padding: 2px 4px; border-radius: 3px;',
  };

  console.log('%cðŸš€ Dashboard CRM - Maxence Design', styles.title);
  console.log('%câ”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”', styles.info);
  
  console.log('\n%câš ï¸ ERREURS DÃ‰TECTÃ‰ES', styles.error);
  console.log('%câŒ TypeError: posts.map is not a function', styles.normal);
  console.log('%câŒ Error: 404 Not Found', styles.normal);
  console.log('%câŒ CatÃ©gories vides (Projets, Blog, Ã‰tudes de cas)', styles.normal);
  
  console.log('\n%câœ… SOLUTION PRÃŠTE', styles.success);
  console.log('%cLe serveur n\'est PAS dÃ©ployÃ©. DÃ©ployez-le maintenant !', styles.warning);
  
  console.log('\n%cðŸ“‹ Ã‰TAPES RAPIDES (2 min 30 sec)', styles.step);
  console.log('%c1ï¸âƒ£ DÃ©ployer le serveur', styles.step);
  console.log('%c   â€¢ Ouvrir : %c/supabase/functions/server/index-complete.tsx', styles.normal, styles.code);
  console.log('%c   â€¢ Copier tout (Ctrl+A, Ctrl+C)', styles.normal);
  console.log('%c   â€¢ Supabase Dashboard â†’ Edge Functions â†’ Deploy', styles.normal);
  console.log('%c   â€¢ Attendre 2 minutes â±ï¸', styles.normal);
  
  console.log('\n%c2ï¸âƒ£ Initialiser les donnÃ©es', styles.step);
  console.log('%c   â€¢ Cliquer "ðŸ” Tester Connexion" (alerte verte en haut)', styles.normal);
  console.log('%c   â€¢ Cliquer "ðŸŒ± Initialiser les DonnÃ©es"', styles.normal);
  console.log('%c   â€¢ RafraÃ®chir (F5)', styles.normal);
  
  console.log('\n%cðŸ“– GUIDES DISPONIBLES', styles.info);
  console.log('%c   ðŸš€ Guide Interactif : %c/public/guide-deploiement-express.html', styles.normal, styles.code);
  console.log('%c   ðŸ“š Index des guides : %c/public/index-guides.html', styles.normal, styles.code);
  console.log('%c   ðŸ“ Guide rapide : %c/DEPLOYER_MAINTENANT.md', styles.normal, styles.code);
  console.log('%c   âœ… RÃ©sumÃ© technique : %c/ERREURS_RESOLUES.md', styles.normal, styles.code);
  console.log('%c   ðŸŒ± Guide seed : %c/INITIALISER_DONNEES.md', styles.normal, styles.code);
  console.log('%c   ðŸ“„ RÃ©sumÃ© complet : %c/LIRE_MAINTENANT_FIX.md', styles.normal, styles.code);
  
  console.log('\n%cðŸŽ¯ ACTIONS RAPIDES', styles.info);
  console.log('%cChoisissez une option :', styles.normal);
  
  console.log('\n%c   Option 1 : Guide Interactif (RECOMMANDÃ‰)', styles.success);
  console.log('%c   window.open("/guide-deploiement-express.html", "_blank")', styles.code);
  
  console.log('\n%c   Option 2 : Ouvrir Supabase Dashboard', styles.success);
  console.log('%c   window.open("https://supabase.com/dashboard", "_blank")', styles.code);
  
  console.log('\n%c   Option 3 : Lire LIRE_MAINTENANT_FIX.md', styles.success);
  console.log('%c   Ouvrez le fichier dans votre Ã©diteur', styles.normal);
  
  console.log('\n%câ”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”', styles.info);
  console.log('%cðŸ“¦ DonnÃ©es de dÃ©mo qui seront crÃ©Ã©es :', styles.info);
  console.log('%c   âœ… 3 projets (E-commerce, Fitness, Dashboard)', styles.success);
  console.log('%c   âœ… 3 articles de blog (React, Tailwind, Freelance)', styles.success);
  console.log('%c   âœ… 2 Ã©tudes de cas (FinTech, SantÃ©)', styles.success);
  console.log('%c   âœ… 2 tÃ©moignages (5 Ã©toiles)', styles.success);
  
  console.log('\n%cðŸ”§ Fichiers modifiÃ©s :', styles.info);
  console.log('%c   âœ… /supabase/functions/server/index-complete.tsx (v2)', styles.success);
  console.log('%c   âœ… /utils/unifiedDataService.ts (fix posts.map)', styles.success);
  console.log('%c   âœ… /components/dashboard/QuotesDeploymentAlert.tsx (boutons)', styles.success);
  
  console.log('\n%câ±ï¸ Temps estimÃ© : 2 minutes 30 secondes', styles.warning);
  console.log('%câ”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”\n', styles.info);
}

/**
 * Version courte pour la page d'accueil
 */
export function showConsoleWelcomeShort() {
  console.log(
    '%cðŸš€ Dashboard CRM %c- %cDÃ©ployez maintenant !',
    'color: #CCFF00; font-size: 16px; font-weight: bold;',
    'color: #F4F4F4;',
    'color: #fbbf24; font-weight: bold;'
  );
  console.log(
    '%cOuvrez : %c/public/guide-deploiement-express.html',
    'color: #F4F4F4;',
    'background: #000; color: #CCFF00; padding: 2px 4px; border-radius: 3px;'
  );
}
