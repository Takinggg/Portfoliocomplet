/**
 * SEO Startup Message
 * Inform user about available sitemap commands
 */

if (typeof window !== 'undefined') {
  // Wait for all modules to load
  setTimeout(() => {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║           🗺️  SYSTÈME SEO MULTILINGUE CHARGÉ                 ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  ✅ Balises hreflang automatiques activées                    ║
║  ✅ URLs multilingues (/fr/, /en/) détectées                  ║
║  ✅ Générateur de sitemap.xml prêt                            ║
║                                                               ║
║  📋 COMMANDES DISPONIBLES                                     ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━                                      ║
║                                                               ║
║  window.sitemapHelp()          → Afficher l'aide complète     ║
║  window.generateSitemap()      → Voir aperçu sitemap         ║
║  window.downloadSitemap()      → Télécharger sitemap.xml     ║
║                                                               ║
║  📖 Guide: /SEO_QUICK_START.md                                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `);
  }, 1500); // Wait 1.5s to ensure all modules loaded
}

export {};
