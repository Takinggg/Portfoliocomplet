/**
 * Sitemap Helpers - Console utilities
 * Expose sitemap generation functions to window for easy testing
 */

import { generateSitemap, downloadSitemap } from './sitemapGenerator';
import { generateStaticSitemap, downloadStaticSitemap } from './generateStaticSitemap';

/**
 * Generate and display full sitemap in console
 */
async function generateSitemapToConsole() {
  console.log('🗺️ Generating complete sitemap (static + dynamic pages)...');
  try {
    const xml = await generateSitemap();
    console.log('✅ Sitemap generated successfully!');
    console.log('\n📄 Sitemap Preview (first 1000 chars):\n');
    console.log(xml.substring(0, 1000) + '...\n');
    console.log(`📊 Total length: ${xml.length} characters`);
    console.log('\n💡 To download the file, use: window.downloadSitemap()');
    return xml;
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    throw error;
  }
}

/**
 * Generate and display static sitemap in console
 */
function generateStaticSitemapToConsole() {
  console.log('🗺️ Generating static sitemap (pages only, no dynamic content)...');
  try {
    const xml = generateStaticSitemap();
    console.log('✅ Static sitemap generated successfully!');
    console.log('\n📄 Sitemap Preview (first 1000 chars):\n');
    console.log(xml.substring(0, 1000) + '...\n');
    console.log(`📊 Total length: ${xml.length} characters`);
    console.log('\n💡 To download the file, use: window.downloadStaticSitemap()');
    return xml;
  } catch (error) {
    console.error('❌ Error generating static sitemap:', error);
    throw error;
  }
}

/**
 * Show available sitemap commands
 */
function showSitemapHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║              🗺️  SITEMAP GENERATOR - AIDE                   ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  📄 GÉNÉRER & AFFICHER                                       ║
║  ━━━━━━━━━━━━━━━━━━━━━                                       ║
║  window.generateSitemap()                                    ║
║    → Génère sitemap complet (pages + blog + projets)        ║
║    → Affiche un aperçu dans la console                      ║
║                                                              ║
║  window.generateStaticSitemap()                              ║
║    → Génère sitemap pages statiques seulement               ║
║    → Affiche un aperçu dans la console                      ║
║                                                              ║
║  📥 TÉLÉCHARGER                                              ║
║  ━━━━━━━━━━━━━                                               ║
║  window.downloadSitemap()                                    ║
║    → Télécharge sitemap.xml complet                         ║
║                                                              ║
║  window.downloadStaticSitemap()                              ║
║    → Télécharge sitemap.xml pages statiques                 ║
║                                                              ║
║  ℹ️  AIDE                                                    ║
║  ━━━━━━━                                                     ║
║  window.sitemapHelp()                                        ║
║    → Affiche cette aide                                     ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  💡 CONSEILS                                                 ║
║  • Utilisez generateSitemap() pour voir le contenu          ║
║  • Utilisez downloadSitemap() pour télécharger le fichier   ║
║  • Placez sitemap.xml dans /public/ pour production         ║
║  • Ajoutez l'URL dans robots.txt et Google Search Console   ║
╚══════════════════════════════════════════════════════════════╝
  `);
}

// Declare global types
declare global {
  interface Window {
    generateSitemap: () => Promise<string>;
    generateStaticSitemap: () => string;
    sitemapHelp: () => void;
  }
}

// Expose functions to window only in browser
if (typeof window !== 'undefined') {
  window.generateSitemap = generateSitemapToConsole;
  window.generateStaticSitemap = generateStaticSitemapToConsole;
  window.sitemapHelp = showSitemapHelp;

  // Show available commands on load (delayed)
  setTimeout(() => {
    console.log('🗺️ Sitemap utilities loaded!');
    console.log('💡 Type window.sitemapHelp() for available commands');
  }, 1000);
}

export {
  generateSitemapToConsole,
  generateStaticSitemapToConsole,
  showSitemapHelp,
};
