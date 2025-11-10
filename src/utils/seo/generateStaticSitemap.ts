/**
 * Generate Static Sitemap - One-time generator
 * Creates a sitemap.xml file ready to download
 */

import { getStaticPages } from './sitemapGenerator';

/**
 * Generate a basic static sitemap with just the main pages
 * This is useful for immediate deployment while dynamic content is being fetched
 */
export function generateStaticSitemap(): string {
  const staticPages = getStaticPages();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const page of staticPages) {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(page.loc)}</loc>\n`;
    
    if (page.lastmod) {
      xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    }
    
    if (page.changefreq) {
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    }
    
    if (page.priority !== undefined) {
      xml += `    <priority>${page.priority.toFixed(1)}</priority>\n`;
    }

    // Add hreflang alternates
    if (page.alternates) {
      for (const alt of page.alternates) {
        xml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeXml(alt.href)}" />\n`;
      }
    }

    xml += '  </url>\n';
  }

  xml += '</urlset>';

  return xml;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Download static sitemap immediately
 */
export function downloadStaticSitemap() {
  console.log('🗺️ Generating static sitemap (pages only)...');
  const xml = generateStaticSitemap();
  
  // Create downloadable file
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log('✅ Static sitemap downloaded!');
  console.log('📄 Includes all main pages in FR and EN');
  console.log('💡 Place this file in /public/sitemap.xml');
  
  return xml;
}

// Declare global types
declare global {
  interface Window {
    downloadStaticSitemap: () => string;
  }
}

// Make function available globally only in browser
if (typeof window !== 'undefined') {
  window.downloadStaticSitemap = downloadStaticSitemap;

  // Show help message after a delay
  setTimeout(() => {
    console.log('💡 Quick sitemap generator loaded! Run: window.downloadStaticSitemap()');
  }, 1000);
}
