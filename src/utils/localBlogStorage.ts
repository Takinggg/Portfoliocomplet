/**
 * Local Blog Storage - Fallback quand le serveur n'est pas disponible
 * Permet au blog de fonctionner en mode "local" avec localStorage
 */

import { BlogPost } from "../components/blog/BlogPostCard";

const STORAGE_KEY = "local_blog_posts";
const STORAGE_VERSION = "v1";

// Blog post category type
export type BlogCategory = "development" | "design" | "business" | "marketing" | "other";

// Author type - can be string or object
export type BlogAuthor = string | {
  name: string;
  avatar?: string;
  bio?: string;
  role?: string;
};

export interface LocalBlogPost {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  title_fr?: string;
  excerpt: string;
  excerpt_en?: string;
  excerpt_fr?: string;
  content: string;
  content_en?: string;
  content_fr?: string;
  coverImage: string;
  category: BlogCategory;
  tags: string[];
  author?: BlogAuthor;
  publishedAt: string;
  readTime?: number; // Compatible avec BlogPost
  readingTime?: number; // Pour rétrocompatibilité
  status: "published" | "draft";
  views?: number;
  featured?: boolean;
}

/**
 * Normalise un article pour compatibilité avec BlogPost
 */
function normalizePost(post: LocalBlogPost): LocalBlogPost {
  return {
    ...post,
    // Assurer readTime existe (alias de readingTime)
    readTime: post.readTime || post.readingTime || 5,
    // Assurer author est une string si c'est un objet
    author: typeof post.author === 'object' && post.author !== null ? post.author.name : post.author,
  };
}

/**
 * Récupère tous les articles depuis localStorage (avec déduplication automatique)
 */
export function getLocalPosts(): LocalBlogPost[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const data = JSON.parse(stored);
    if (data.version !== STORAGE_VERSION) {
      console.log("⚠️ Local storage version mismatch, clearing...");
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    
    const posts = data.posts || [];
    
    // Dédupliquer automatiquement
    const seen = new Set<string>();
    const deduplicatedPosts = posts.filter((post: LocalBlogPost) => {
      if (seen.has(post.id)) {
        return false;
      }
      seen.add(post.id);
      return true;
    });
    
    // Si on a trouvé des doublons, sauvegarder la version nettoyée
    if (deduplicatedPosts.length < posts.length) {
      saveLocalPosts(deduplicatedPosts);
    }
    
    return deduplicatedPosts.map(normalizePost);
  } catch (error) {
    console.error("Error reading local posts:", error);
    return [];
  }
}

/**
 * Sauvegarde les articles dans localStorage (avec déduplication automatique)
 */
export function saveLocalPosts(posts: LocalBlogPost[]): void {
  try {
    // Dédupliquer automatiquement avant de sauvegarder
    const seen = new Set<string>();
    const deduplicatedPosts = posts.filter(post => {
      if (seen.has(post.id)) {
        return false;
      }
      seen.add(post.id);
      return true;
    });
    
    const data = {
      version: STORAGE_VERSION,
      posts: deduplicatedPosts,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // Log uniquement si on a dédupliqué des articles
    if (deduplicatedPosts.length < posts.length && window.location.hostname === "localhost") {
      console.log(`✅ Saved ${deduplicatedPosts.length} posts (removed ${posts.length - deduplicatedPosts.length} duplicates)`);
    }
  } catch (error) {
    console.error("Error saving local posts:", error);
  }
}

/**
 * Génère un ID unique pour un nouvel article
 */
function generateUniqueId(existingIds: Set<string>): string {
  let id: string;
  let attempts = 0;
  do {
    // Utilise timestamp + compteur + random pour éviter les collisions
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    id = `blog_post:${timestamp}_${random}`;
    attempts++;
    
    // Sécurité : si on a 100 tentatives, forcer un ID avec un compteur
    if (attempts > 100) {
      id = `blog_post:${timestamp}_${attempts}_${random}`;
      break;
    }
  } while (existingIds.has(id));
  
  return id;
}

/**
 * Ajoute un nouvel article
 */
export function addLocalPost(post: Omit<LocalBlogPost, "id">): LocalBlogPost {
  const posts = getLocalPosts();
  const existingIds = new Set(posts.map(p => p.id));
  
  const newPost: LocalBlogPost = {
    ...post,
    id: generateUniqueId(existingIds),
  };
  posts.push(newPost);
  saveLocalPosts(posts);
  return newPost;
}

/**
 * Met à jour un article existant
 */
export function updateLocalPost(id: string, updates: Partial<LocalBlogPost>): boolean {
  const posts = getLocalPosts();
  const index = posts.findIndex(p => p.id === id);
  
  if (index === -1) {
    console.error(`Post ${id} not found`);
    return false;
  }
  
  posts[index] = { ...posts[index], ...updates };
  saveLocalPosts(posts);
  return true;
}

/**
 * Supprime un article
 */
export function deleteLocalPost(id: string): boolean {
  const posts = getLocalPosts();
  const filtered = posts.filter(p => p.id !== id);
  
  if (filtered.length === posts.length) {
    console.error(`Post ${id} not found`);
    return false;
  }
  
  saveLocalPosts(filtered);
  return true;
}

/**
 * Récupère un article par son slug
 */
export function getLocalPostBySlug(slug: string): LocalBlogPost | null {
  const posts = getLocalPosts();
  return posts.find(p => p.slug === slug) || null;
}

/**
 * Incrémente les vues d'un article
 */
export function incrementLocalPostViews(slug: string): void {
  const posts = getLocalPosts();
  const post = posts.find(p => p.slug === slug);
  
  if (post) {
    post.views = (post.views || 0) + 1;
    saveLocalPosts(posts);
  }
}

/**
 * Initialise le localStorage avec des articles de démonstration
 */
export function seedLocalPosts(): { success: boolean; count: number } {
  const existingPosts = getLocalPosts();
  
  if (existingPosts.length > 0) {
    console.log(`ℹ️ Local storage already has ${existingPosts.length} posts`);
    return { success: true, count: existingPosts.length };
  }

  // Note: En mode local, on utilise la structure avec suffixes (_fr, _en)
  // Le blogService normalise automatiquement selon la langue
  const demoPosts: Omit<LocalBlogPost, "id">[] = [
    {
      slug: "guide-complet-nextjs-14",
      title: "Guide Complet Next.js 14 : App Router et Server Components",
      title_fr: "Guide Complet Next.js 14 : App Router et Server Components",
      title_en: "Complete Next.js 14 Guide: App Router and Server Components",
      excerpt: "Découvrez toutes les nouveautés de Next.js 14 : App Router, Server Components, streaming, et bien plus encore.",
      excerpt_fr: "Découvrez toutes les nouveautés de Next.js 14 : App Router, Server Components, streaming, et bien plus encore.",
      excerpt_en: "Discover all the new features of Next.js 14: App Router, Server Components, streaming, and much more.",
      content: `# Guide Complet Next.js 14

Next.js 14 apporte des changements majeurs avec l'App Router et les Server Components...

## Architecture App Router

L'App Router est une nouvelle façon de structurer vos applications Next.js...

## Server Components

Les Server Components permettent de rendre les composants côté serveur...

## Performances

Next.js 14 améliore drastiquement les performances grâce au streaming...`,
      content_fr: "# Guide Complet Next.js 14\n\nNext.js 14 apporte des changements majeurs...",
      content_en: "# Complete Next.js 14 Guide\n\nNext.js 14 brings major changes...",
      coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      category: "development",
      tags: ["Next.js", "React", "JavaScript", "TypeScript"],
      author: {
        name: "Maxence",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maxence",
        role: "Full-Stack Developer",
      },
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      readTime: 12,
      status: "published",
      views: 234,
      featured: true,
    },
    {
      slug: "typescript-tips-avances",
      title: "10 Tips TypeScript Avancés pour Développeurs Seniors",
      title_fr: "10 Tips TypeScript Avancés pour Développeurs Seniors",
      title_en: "10 Advanced TypeScript Tips for Senior Developers",
      excerpt: "Améliorez votre code TypeScript avec ces techniques avancées utilisées par les meilleurs développeurs.",
      excerpt_fr: "Améliorez votre code TypeScript avec ces techniques avancées utilisées par les meilleurs développeurs.",
      excerpt_en: "Improve your TypeScript code with these advanced techniques used by top developers.",
      content: `# 10 Tips TypeScript Avancés

TypeScript offre de nombreuses fonctionnalités avancées...

## 1. Conditional Types

Les types conditionnels permettent...

## 2. Template Literal Types

Créez des types dynamiques basés sur des chaînes...`,
      content_fr: "# 10 Tips TypeScript Avancés\n\nTypeScript offre de nombreuses fonctionnalités...",
      content_en: "# 10 Advanced TypeScript Tips\n\nTypeScript offers many advanced features...",
      coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
      category: "development",
      tags: ["TypeScript", "JavaScript", "Programming", "Best Practices"],
      author: {
        name: "Maxence",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maxence",
        role: "Full-Stack Developer",
      },
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      readTime: 8,
      status: "published",
      views: 156,
      featured: false,
    },
    {
      slug: "design-system-moderne",
      title: "Créer un Design System Moderne avec Tailwind CSS",
      title_fr: "Créer un Design System Moderne avec Tailwind CSS",
      title_en: "Building a Modern Design System with Tailwind CSS",
      excerpt: "Guide pratique pour créer un design system scalable et maintenable avec Tailwind CSS et React.",
      excerpt_fr: "Guide pratique pour créer un design system scalable et maintenable avec Tailwind CSS et React.",
      excerpt_en: "Practical guide to creating a scalable and maintainable design system with Tailwind CSS and React.",
      content: `# Design System Moderne

Un design system cohérent est essentiel...

## Tokens de Design

Commencez par définir vos tokens...

## Composants Réutilisables

Créez des composants qui respectent votre système...`,
      content_fr: "# Design System Moderne\n\nUn design system cohérent est essentiel...",
      content_en: "# Modern Design System\n\nA consistent design system is essential...",
      coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
      category: "design",
      tags: ["Design System", "Tailwind CSS", "UI/UX", "React"],
      author: {
        name: "Maxence",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maxence",
        role: "Full-Stack Developer",
      },
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      readTime: 15,
      status: "published",
      views: 312,
      featured: true,
    },
    {
      slug: "performance-web-2024",
      title: "Performance Web en 2024 : Core Web Vitals et Optimisations",
      title_fr: "Performance Web en 2024 : Core Web Vitals et Optimisations",
      title_en: "Web Performance in 2024: Core Web Vitals and Optimizations",
      excerpt: "Tout ce qu'il faut savoir sur les Core Web Vitals et comment optimiser les performances de votre site web.",
      excerpt_fr: "Tout ce qu'il faut savoir sur les Core Web Vitals et comment optimiser les performances de votre site web.",
      excerpt_en: "Everything you need to know about Core Web Vitals and how to optimize your website's performance.",
      content: `# Performance Web en 2024

Les Core Web Vitals sont devenus essentiels...

## LCP - Largest Contentful Paint

Optimisez le temps de chargement...

## CLS - Cumulative Layout Shift

Évitez les décalages de mise en page...`,
      content_fr: "# Performance Web en 2024\n\nLes Core Web Vitals sont devenus essentiels...",
      content_en: "# Web Performance in 2024\n\nCore Web Vitals have become essential...",
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      category: "development",
      tags: ["Web Performance", "Core Web Vitals", "SEO", "Optimization"],
      author: {
        name: "Maxence",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maxence",
        role: "Full-Stack Developer",
      },
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      readTime: 10,
      status: "published",
      views: 189,
      featured: false,
    },
    {
      slug: "react-19-nouveautes",
      title: "React 19 : Toutes les Nouveautés et Breaking Changes",
      title_fr: "React 19 : Toutes les Nouveautés et Breaking Changes",
      title_en: "React 19: All New Features and Breaking Changes",
      excerpt: "Découvrez React 19 avec le nouveau compilateur, les Server Components, et les améliorations de performances.",
      excerpt_fr: "Découvrez React 19 avec le nouveau compilateur, les Server Components, et les améliorations de performances.",
      excerpt_en: "Discover React 19 with the new compiler, Server Components, and performance improvements.",
      content: `# React 19 Nouveautés

React 19 apporte des changements majeurs...

## React Compiler

Le nouveau compilateur optimise automatiquement...

## Améliorations Concurrent

Les fonctionnalités concurrentes sont maintenant stables...`,
      content_fr: "# React 19 Nouveautés\n\nReact 19 apporte des changements majeurs...",
      content_en: "# React 19 New Features\n\nReact 19 brings major changes...",
      coverImage: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80",
      category: "development",
      tags: ["React", "JavaScript", "Web Development", "Frontend"],
      author: {
        name: "Maxence",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maxence",
        role: "Full-Stack Developer",
      },
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      readTime: 11,
      status: "published",
      views: 267,
      featured: false,
    },
  ];

  const postsWithIds = demoPosts.map((post, index) => ({
    ...post,
    id: `local_demo_${index + 1}`,
  }));

  saveLocalPosts(postsWithIds);
  console.log(`✅ Initialized ${postsWithIds.length} demo posts in local storage`);
  
  return { success: true, count: postsWithIds.length };
}

/**
 * Efface tous les articles locaux
 */
export function clearLocalPosts(): void {
  localStorage.removeItem(STORAGE_KEY);
  console.log("✅ Cleared local posts");
}

/**
 * Vérifie si le mode local est actif
 */
export function isLocalMode(): boolean {
  return getLocalPosts().length > 0;
}
