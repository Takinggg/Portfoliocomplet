/**
 * Check if Test URLs are loaded
 * Display diagnostic information
 */

if (typeof window !== 'undefined') {
  setTimeout(() => {
    const isLoaded = typeof (window as any).testAllURLs !== 'undefined';
    
    if (isLoaded) {
      console.log(`
╔════════════════════════════════════════════════════════════════╗
║              ✅ TEST URLS CHARGÉ AVEC SUCCÈS                   ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Les utilitaires de test sont maintenant disponibles !        ║
║                                                                ║
║  🎮 COMMANDE RAPIDE:                                           ║
║  ━━━━━━━━━━━━━━━━                                              ║
║                                                                ║
║  window.testAllURLs.printAllRoutes()                           ║
║                                                                ║
║  ➜ Affiche toutes vos URLs (FR + EN)                          ║
║                                                                ║
╠════════════════════════════════════════════════════════════════╣
║  🌳 STRUCTURE:                                                 ║
║  ━━━━━━━━━━━                                                   ║
║                                                                ║
║  window.testAllURLs.showURLStructure()                         ║
║                                                                ║
║  ➜ Vue arborescente des URLs                                  ║
║                                                                ║
╠════════════════════════════════════════════════════════════════╣
║  📊 INFOS:                                                     ║
║  ━━━━━━━━━                                                     ║
║                                                                ║
║  Type: typeof window.testAllURLs                               ║
║  ➜ Doit afficher: "object"                                    ║
║                                                                ║
║  Méthodes disponibles:                                        ║
║  • printAllRoutes()                                           ║
║  • showURLStructure()                                         ║
║  • allRoutes (array)                                          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
      `);
    } else {
      console.error(`
╔════════════════════════════════════════════════════════════════╗
║              ❌ TEST URLS NON CHARGÉ                           ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Les utilitaires de test ne sont pas encore disponibles.      ║
║                                                                ║
║  🔍 DIAGNOSTIC:                                                ║
║  ━━━━━━━━━━━━                                                  ║
║                                                                ║
║  1. Vérifiez qu'il n'y a pas d'erreurs dans la console        ║
║  2. Rechargez avec Ctrl+Shift+R                               ║
║  3. Attendez 5 secondes après le chargement                   ║
║  4. Retestez: typeof window.testAllURLs                       ║
║                                                                ║
║  📖 Guide: /FIX_FINAL_URLS.txt                                ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
      `);
    }
  }, 2000);
}
