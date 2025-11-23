/**
 * Sitemap Route Component
 * Serves the sitemap.xml dynamically
 */

import { useEffect, useState } from 'react';
import { generateSitemap } from '../../utils/seo/sitemapGenerator';

export function SitemapRoute() {
  const [sitemap, setSitemap] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSitemap = async () => {
      try {
        const xml = await generateSitemap();
        setSitemap(xml);
        
        // Set response headers for XML
        // Note: This won't work in a SPA, needs server-side rendering or static file
        console.log('ðŸ“„ Sitemap generated successfully');
        console.log('âš ï¸  For production, serve this as a static file at /public/sitemap.xml');
      } catch (error) {
        console.error('Error generating sitemap:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSitemap();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CCFF00] mx-auto mb-4"></div>
          <p className="text-[#F4F4F4]">Generating sitemap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#F4F4F4] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl mb-4">Sitemap XML</h1>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
            <p className="text-yellow-500 text-sm">
              âš ï¸ <strong>Important pour la production:</strong> Ce sitemap doit Ãªtre servi comme un fichier statique.
            </p>
            <p className="text-[#F4F4F4]/70 text-sm mt-2">
              Copiez le contenu ci-dessous dans <code>/public/sitemap.xml</code> ou configurez votre serveur 
              pour servir ce contenu Ã  l'URL <code>/sitemap.xml</code> avec le type MIME <code>application/xml</code>.
            </p>
          </div>
          <button
            onClick={() => {
              const blob = new Blob([sitemap], { type: 'application/xml' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'sitemap.xml';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="bg-[#CCFF00] text-[#0C0C0C] px-4 py-2 rounded hover:bg-[#CCFF00]/90 transition-colors"
          >
            ðŸ“¥ TÃ©lÃ©charger sitemap.xml
          </button>
        </div>
        
        <div className="bg-[#F4F4F4]/5 rounded-lg p-6 overflow-auto">
          <pre className="text-xs text-[#F4F4F4]/80 whitespace-pre-wrap break-all">
            {sitemap}
          </pre>
        </div>
        
        <div className="mt-8 p-6 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-lg">
          <h2 className="text-xl mb-4 text-[#CCFF00]">Instructions de dÃ©ploiement</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>TÃ©lÃ©chargez le fichier sitemap.xml avec le bouton ci-dessus</li>
            <li>Placez le fichier dans le dossier <code className="bg-[#0C0C0C] px-2 py-1 rounded">/public/</code> de votre projet</li>
            <li>VÃ©rifiez que le fichier est accessible Ã  <code className="bg-[#0C0C0C] px-2 py-1 rounded">https://votredomaine.com/sitemap.xml</code></li>
            <li>Soumettez l'URL du sitemap dans Google Search Console</li>
            <li>Mettez Ã  jour le fichier robots.txt avec l'URL correcte du sitemap</li>
          </ol>
          
          <div className="mt-6 p-4 bg-[#0C0C0C] rounded">
            <p className="text-xs text-[#F4F4F4]/70 mb-2">Ajoutez dans robots.txt:</p>
            <code className="text-[#CCFF00] text-xs">
              Sitemap: https://votredomaine.com/sitemap.xml
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
