/**
 * Notice displayed ONLY on production (not localhost)
 * Explains why URLs don't have language prefix yet
 */

const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const hasPrefix = window.location.pathname.match(/^\/(en|fr)(\/|$)/) !== null;

if (isProduction && !hasPrefix) {
  // Production site without bilingual URLs yet
  setTimeout(() => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  🌐 MAXENCE.DESIGN - URLs Bilingues en Préparation            ║
║                                                                ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  👀 Tu vois une URL comme "/blog" sans préfixe ?              ║
║                                                                ║
║  C'EST NORMAL ! Les URLs bilingues sont prêtes en LOCAL       ║
║  mais pas encore déployées en production.                     ║
║                                                                ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  📍 PROCHAINE MISE À JOUR:                                    ║
║                                                                ║
║  Les URLs deviendront:                                        ║
║  • ${window.location.origin}/blog → ${window.location.origin}/fr/blog      ║
║  • ${window.location.origin}/services → ${window.location.origin}/fr/services ║
║  • ${window.location.origin}/en/blog → Version anglaise       ║
║                                                                ║
║  ✅ Avantages:                                                ║
║  • Meilleur SEO (Google indexe chaque langue)                ║
║  • URLs claires et professionnelles                          ║
║  • Navigation cohérente                                      ║
║                                                                ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  🔧 POUR LES DÉVELOPPEURS:                                    ║
║                                                                ║
║  Les changements sont prêts dans le code local.              ║
║  Voir les docs:                                              ║
║  • /README_URLS_BILINGUES.md                                 ║
║  • /TESTER_MAINTENANT.md                                     ║
║  • /POURQUOI_PAS_DURLF.md                                    ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);
  }, 2000);
} else if (isProduction && hasPrefix) {
  // Production site WITH bilingual URLs - success!
  setTimeout(() => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  ✅ URLs BILINGUES ACTIVES EN PRODUCTION !                    ║
║                                                                ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  🎉 Le système d'URLs bilingues est maintenant déployé !      ║
║                                                                ║
║  📍 URLs actuelles:                                           ║
║  • /fr/blog, /fr/services, /fr/projects...                   ║
║  • /en/blog, /en/services, /en/projects...                   ║
║                                                                ║
║  ✅ Chaque langue a ses propres URLs                          ║
║  ✅ Optimisé pour le SEO international                        ║
║  ✅ Expérience utilisateur améliorée                          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);
  }, 2000);
}

export {};
