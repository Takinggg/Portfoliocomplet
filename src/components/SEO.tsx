import { useEffect } from "react";
import { useLanguage } from "../utils/i18n/LanguageContext";
import { generateHrefLangLinks } from "../utils/routing/urlHelpers";

interface SEOProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  canonical?: string;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

export function SEO({
  title = "Portfolio Freelance & CRM - Solutions Web sur mesure",
  description = "CrÃ©ation de sites web, applications et automatisations pour entreprises ambitieuses. Dashboard CRM intÃ©grÃ© pour gÃ©rer votre activitÃ©.",
  ogTitle,
  ogDescription,
  ogImage = "/og-image.jpg",
  ogType = "website",
  canonical,
  keywords = ["freelance", "web development", "design", "crm", "automation"],
  author = "Freelance Portfolio",
  publishedTime,
  modifiedTime,
  noindex = false,
}: SEOProps) {
  const { language } = useLanguage();
  
  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper function to set or update meta tag
    const setMeta = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    // Helper function to set link tag
    const setLink = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      
      element.setAttribute("href", href);
    };

    // Basic meta tags
    setMeta("description", description);
    setMeta("keywords", keywords.join(", "));
    setMeta("author", author);

    // Robots
    if (noindex) {
      setMeta("robots", "noindex, nofollow");
    } else {
      setMeta("robots", "index, follow");
    }

    // Open Graph
    setMeta("og:title", ogTitle || title, true);
    setMeta("og:description", ogDescription || description, true);
    setMeta("og:image", ogImage, true);
    setMeta("og:type", ogType, true);
    setMeta("og:url", canonical || window.location.href, true);
    setMeta("og:site_name", "Portfolio Freelance", true);

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", ogTitle || title);
    setMeta("twitter:description", ogDescription || description);
    setMeta("twitter:image", ogImage);

    // Article specific
    if (ogType === "article") {
      if (publishedTime) {
        setMeta("article:published_time", publishedTime, true);
      }
      if (modifiedTime) {
        setMeta("article:modified_time", modifiedTime, true);
      }
      setMeta("article:author", author, true);
    }

    // Canonical URL
    if (canonical) {
      setLink("canonical", canonical);
    }

    // Hreflang tags for multilingual SEO
    const pathname = window.location.pathname;
    const hrefLangLinks = generateHrefLangLinks(pathname);
    
    // Remove existing hreflang links
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    
    // Add new hreflang links
    hrefLangLinks.forEach(({ lang, url }) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = url;
      document.head.appendChild(link);
    });
    
    // Add x-default for default language (French)
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = hrefLangLinks.find(l => l.lang === 'fr')?.url || window.location.href;
    document.head.appendChild(defaultLink);

    // Language meta tag
    setMeta("language", language.toUpperCase());
    document.documentElement.lang = language;

    // Viewport (ensure it's set)
    setMeta("viewport", "width=device-width, initial-scale=1, maximum-scale=5");

    // Theme color
    setMeta("theme-color", "#CCFF00");

  }, [title, description, ogTitle, ogDescription, ogImage, ogType, canonical, keywords, author, publishedTime, modifiedTime, noindex, language]);

  return null; // This component doesn't render anything
}
