/**
 * Affiche un message de bienvenue stylisé dans la console
 * avec des instructions de déploiement si nécessaire
 */

export function showConsoleWelcome() {
  const styles = {
    title: 'color: #00FFC2; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px rgba(0,255,194,0.5);',
    error: 'color: #ef4444; font-weight: bold; font-size: 14px;',
    success: 'color: #22c55e; font-weight: bold;',
    info: 'color: #60a5fa; font-weight: bold;',
    warning: 'color: #fbbf24; font-weight: bold;',
    step: 'color: #00FFC2; font-weight: bold;',
    normal: 'color: #F4F4F4;',
    code: 'background: #000; color: #00FFC2; padding: 2px 4px; border-radius: 3px;',
  };

  console.log('%c🚀 Dashboard CRM - Maxence Design', styles.title);
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', styles.info);
  
  console.log('\n%c⚠️ ERREURS DÉTECTÉES', styles.error);
  console.log('%c❌ TypeError: posts.map is not a function', styles.normal);
  console.log('%c❌ Error: 404 Not Found', styles.normal);
  console.log('%c❌ Catégories vides (Projets, Blog, Études de cas)', styles.normal);
  
  console.log('\n%c✅ SOLUTION PRÊTE', styles.success);
  console.log('%cLe serveur n\'est PAS déployé. Déployez-le maintenant !', styles.warning);
  
  console.log('\n%c📋 ÉTAPES RAPIDES (2 min 30 sec)', styles.step);
  console.log('%c1️⃣ Déployer le serveur', styles.step);
  console.log('%c   • Ouvrir : %c/supabase/functions/server/index-complete.tsx', styles.normal, styles.code);
  console.log('%c   • Copier tout (Ctrl+A, Ctrl+C)', styles.normal);
  console.log('%c   • Supabase Dashboard → Edge Functions → Deploy', styles.normal);
  console.log('%c   • Attendre 2 minutes ⏱️', styles.normal);
  
  console.log('\n%c2️⃣ Initialiser les données', styles.step);
  console.log('%c   • Cliquer "🔍 Tester Connexion" (alerte verte en haut)', styles.normal);
  console.log('%c   • Cliquer "🌱 Initialiser les Données"', styles.normal);
  console.log('%c   • Rafraîchir (F5)', styles.normal);
  
  console.log('\n%c📖 GUIDES DISPONIBLES', styles.info);
  console.log('%c   🚀 Guide Interactif : %c/public/guide-deploiement-express.html', styles.normal, styles.code);
  console.log('%c   📚 Index des guides : %c/public/index-guides.html', styles.normal, styles.code);
  console.log('%c   📝 Guide rapide : %c/DEPLOYER_MAINTENANT.md', styles.normal, styles.code);
  console.log('%c   ✅ Résumé technique : %c/ERREURS_RESOLUES.md', styles.normal, styles.code);
  console.log('%c   🌱 Guide seed : %c/INITIALISER_DONNEES.md', styles.normal, styles.code);
  console.log('%c   📄 Résumé complet : %c/LIRE_MAINTENANT_FIX.md', styles.normal, styles.code);
  
  console.log('\n%c🎯 ACTIONS RAPIDES', styles.info);
  console.log('%cChoisissez une option :', styles.normal);
  
  console.log('\n%c   Option 1 : Guide Interactif (RECOMMANDÉ)', styles.success);
  console.log('%c   window.open("/guide-deploiement-express.html", "_blank")', styles.code);
  
  console.log('\n%c   Option 2 : Ouvrir Supabase Dashboard', styles.success);
  console.log('%c   window.open("https://supabase.com/dashboard", "_blank")', styles.code);
  
  console.log('\n%c   Option 3 : Lire LIRE_MAINTENANT_FIX.md', styles.success);
  console.log('%c   Ouvrez le fichier dans votre éditeur', styles.normal);
  
  console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', styles.info);
  console.log('%c📦 Données de démo qui seront créées :', styles.info);
  console.log('%c   ✅ 3 projets (E-commerce, Fitness, Dashboard)', styles.success);
  console.log('%c   ✅ 3 articles de blog (React, Tailwind, Freelance)', styles.success);
  console.log('%c   ✅ 2 études de cas (FinTech, Santé)', styles.success);
  console.log('%c   ✅ 2 témoignages (5 étoiles)', styles.success);
  
  console.log('\n%c🔧 Fichiers modifiés :', styles.info);
  console.log('%c   ✅ /supabase/functions/server/index-complete.tsx (v2)', styles.success);
  console.log('%c   ✅ /utils/unifiedDataService.ts (fix posts.map)', styles.success);
  console.log('%c   ✅ /components/dashboard/QuotesDeploymentAlert.tsx (boutons)', styles.success);
  
  console.log('\n%c⏱️ Temps estimé : 2 minutes 30 secondes', styles.warning);
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', styles.info);
}

/**
 * Version courte pour la page d'accueil
 */
export function showConsoleWelcomeShort() {
  console.log(
    '%c🚀 Dashboard CRM %c- %cDéployez maintenant !',
    'color: #00FFC2; font-size: 16px; font-weight: bold;',
    'color: #F4F4F4;',
    'color: #fbbf24; font-weight: bold;'
  );
  console.log(
    '%cOuvrez : %c/public/guide-deploiement-express.html',
    'color: #F4F4F4;',
    'background: #000; color: #00FFC2; padding: 2px 4px; border-radius: 3px;'
  );
}
