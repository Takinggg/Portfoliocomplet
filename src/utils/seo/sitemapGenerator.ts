/**
 * Sitemap Generator for SEO
 * Generates dynamic sitemap.xml with all pages in both languages
 */

import { getFullUrl } from '../routing/urlHelpers';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: Array<{ hreflang: string; href: string }>;
}

/**
 * Generate static pages for sitemap
 */
export function getStaticPages(): SitemapUrl[] {
  const now = new Date().toISOString().split('T')[0];
  
  const staticRoutes = [
    { path: '', changefreq: 'daily' as const, priority: 1.0 }, // Home page
    { path: 'projects', changefreq: 'weekly' as const, priority: 0.9 },
    { path: 'services', changefreq: 'monthly' as const, priority: 0.8 },
    { path: 'about', changefreq: 'monthly' as const, priority: 0.7 },
    { path: 'contact', changefreq: 'monthly' as const, priority: 0.8 },
    { path: 'booking', changefreq: 'monthly' as const, priority: 0.8 },
    { path: 'blog', changefreq: 'daily' as const, priority: 0.9 },
    { path: 'case-studies', changefreq: 'weekly' as const, priority: 0.9 },
    { path: 'faq', changefreq: 'monthly' as const, priority: 0.6 },
    { path: 'resources', changefreq: 'monthly' as const, priority: 0.7 },
    { path: 'testimonials', changefreq: 'weekly' as const, priority: 0.6 },
  ];

  const urls: SitemapUrl[] = [];

  // Generate URLs for both languages with prefixes
  for (const route of staticRoutes) {
    // French version with /fr/ prefix
    const frUrl = getFullUrl(`/${route.path}`, 'fr');
    const enUrl = getFullUrl(`/${route.path}`, 'en');

    urls.push({
      loc: frUrl,
      lastmod: now,
      changefreq: route.changefreq,
      priority: route.priority,
      alternates: [
        { hreflang: 'fr', href: frUrl },
        { hreflang: 'en', href: enUrl },
        { hreflang: 'x-default', href: frUrl }, // Default language
      ],
    });

    // English version with /en/ prefix
    urls.push({
      loc: enUrl,
      lastmod: now,
      changefreq: route.changefreq,
      priority: route.priority, // Same priority for both languages
      alternates: [
        { hreflang: 'fr', href: frUrl },
        { hreflang: 'en', href: enUrl },
        { hreflang: 'x-default', href: frUrl },
      ],
    });
  }

  return urls;
}

/**
 * Get dynamic URLs from server (blog posts, projects, case studies)
 */
export async function getDynamicPages(): Promise<SitemapUrl[]> {
  const urls: SitemapUrl[] = [];

  try {
    // Fetch blog posts
    const blogPosts = await fetchBlogPosts();
    for (const post of blogPosts) {
      const frUrl = getFullUrl(`/blog/${post.slug}`, 'fr');
      const enUrl = getFullUrl(`/blog/${post.slug}`, 'en');
      
      urls.push({
        loc: frUrl,
        lastmod: post.updated_at || post.created_at,
        changefreq: 'monthly',
        priority: 0.8,
        alternates: [
          { hreflang: 'fr', href: frUrl },
          { hreflang: 'en', href: enUrl },
          { hreflang: 'x-default', href: frUrl },
        ],
      });

      urls.push({
        loc: enUrl,
        lastmod: post.updated_at || post.created_at,
        changefreq: 'monthly',
        priority: 0.7,
        alternates: [
          { hreflang: 'fr', href: frUrl },
          { hreflang: 'en', href: enUrl },
          { hreflang: 'x-default', href: frUrl },
        ],
      });
    }

    // Fetch projects
    const projects = await fetchProjects();
    for (const project of projects) {
      const frUrl = getFullUrl(`/projects/${project.id}`, 'fr');
      const enUrl = getFullUrl(`/projects/${project.id}`, 'en');
      
      urls.push({
        loc: frUrl,
        lastmod: project.updated_at || project.created_at,
        changefreq: 'monthly',
        priority: 0.7,
        alternates: [
          { hreflang: 'fr', href: frUrl },
          { hreflang: 'en', href: enUrl },
          { hreflang: 'x-default', href: frUrl },
        ],
      });

      urls.push({
        loc: enUrl,
        lastmod: project.updated_at || project.created_at,
        changefreq: 'monthly',
        priority: 0.6,
        alternates: [
          { hreflang: 'fr', href: frUrl },
          { hreflang: 'en', href: enUrl },
          { hreflang: 'x-default', href: frUrl },
        ],
      });
    }

    // Fetch case studies
    const caseStudies = await fetchCaseStudies();
    for (const study of caseStudies) {
      const frUrl = getFullUrl(`/case-studies/${study.id}`, 'fr');
      const enUrl = getFullUrl(`/case-studies/${study.id}`, 'en');
      
      urls.push({
        loc: frUrl,
        lastmod: study.updated_at || study.created_at,
        changefreq: 'monthly',
        priority: 0.8,
        alternates: [
          { hreflang: 'fr', href: frUrl },
          { hreflang: 'en', href: enUrl },
          { hreflang: 'x-default', href: frUrl },
        ],
      });

      urls.push({
        loc: enUrl,
        lastmod: study.updated_at || study.created_at,
        changefreq: 'monthly',
        priority: 0.7,
        alternates: [
          { hreflang: 'fr', href: frUrl },
          { hreflang: 'en', href: enUrl },
          { hreflang: 'x-default', href: frUrl },
        ],
      });
    }
  } catch (error) {
    console.error('Error fetching dynamic pages for sitemap:', error);
  }

  return urls;
}

/**
 * Fetch blog posts from server
 */
async function fetchBlogPosts(): Promise<any[]> {
  try {
    // Import Supabase info dynamically to avoid import.meta issues
    const { projectId: supabaseProjectId, publicAnonKey: supabaseAnonKey } = await import('../supabase/info');
    
    const response = await fetch(
      `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-04919ac5/blog`,
      {
        headers: { Authorization: `Bearer ${supabaseAnonKey}` },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.posts || [];
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }
  return [];
}

/**
 * Fetch projects from server
 */
async function fetchProjects(): Promise<any[]> {
  try {
    // Import Supabase info dynamically to avoid import.meta issues
    const { projectId: supabaseProjectId, publicAnonKey: supabaseAnonKey } = await import('../supabase/info');
    
    const response = await fetch(
      `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-04919ac5/projects`,
      {
        headers: { Authorization: `Bearer ${supabaseAnonKey}` },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.projects || [];
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
  return [];
}

/**
 * Fetch case studies from server
 */
async function fetchCaseStudies(): Promise<any[]> {
  try {
    // Import Supabase info dynamically to avoid import.meta issues
    const { projectId: supabaseProjectId, publicAnonKey: supabaseAnonKey } = await import('../supabase/info');
    
    const response = await fetch(
      `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-04919ac5/case-studies`,
      {
        headers: { Authorization: `Bearer ${supabaseAnonKey}` },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.caseStudies || [];
    }
  } catch (error) {
    console.error('Error fetching case studies:', error);
  }
  return [];
}

/**
 * Generate complete sitemap XML
 */
export async function generateSitemap(): Promise<string> {
  const staticPages = getStaticPages();
  const dynamicPages = await getDynamicPages();
  const allPages = [...staticPages, ...dynamicPages];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const page of allPages) {
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

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Make sitemap available in console for download
 */
export async function downloadSitemap() {
  console.log('🗺️ Generating sitemap...');
  const xml = await generateSitemap();
  
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
  
  console.log('✅ Sitemap downloaded!');
  console.log('📄 Preview:\n', xml.slice(0, 500) + '...');
}

// Declare global types
declare global {
  interface Window {
    downloadSitemap: () => Promise<void>;
    generateSitemapXML: () => Promise<string>;
  }
}

// Make functions available globally only in browser
if (typeof window !== 'undefined') {
  window.downloadSitemap = downloadSitemap;
  window.generateSitemapXML = generateSitemap;

  // Show help message after a delay
  setTimeout(() => {
    console.log('💡 Sitemap generator loaded! Run: window.downloadSitemap()');
  }, 1000);
}
