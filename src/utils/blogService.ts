/**
 * Blog Service - Utilise UNIQUEMENT Supabase (plus de localStorage)
 * Si le serveur n'est pas disponible, affiche un message d'erreur
 */

import { projectId, publicAnonKey } from "./supabase/info";

export type BlogServiceMode = "server" | "unavailable" | "checking";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  title_fr?: string;
  title_en?: string;
  excerpt: string;
  excerpt_fr?: string;
  excerpt_en?: string;
  content: string;
  content_fr?: string;
  content_en?: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  readTime: string;
  image: string;
  views?: number;
  published?: boolean;
  featured?: boolean;
  // Additional properties for compatibility with BlogPostCard
  publishedAt: string; // Maps to 'date' 
  status: "draft" | "published"; // Maps to 'published' boolean
}

let currentMode: BlogServiceMode = "checking";
let serverAvailable: boolean | null = null;

/**
 * Vérifie si le serveur est disponible (utilise le service centralisé)
 */
async function checkServerAvailability(): Promise<boolean> {
  // Utiliser le service centralisé
  const { checkServerAvailability: centralCheck } = await import("./serverService");
  const isAvailable = await centralCheck();
  
  serverAvailable = isAvailable;
  currentMode = isAvailable ? "server" : "unavailable";
  
  return isAvailable;
}

/**
 * Normalise un article en fonction de la langue
 */
function normalizePostForLanguage(post: BlogPost, lang: string): BlogPost {
  const langSuffix = lang === "en" ? "_en" : "_fr";
  
  return {
    ...post,
    title: post[`title${langSuffix}`] || post.title,
    excerpt: post[`excerpt${langSuffix}`] || post.excerpt,
    content: post[`content${langSuffix}`] || post.content,
  };
}

/**
 * Déduplique les posts par ID (garde le premier exemplaire)
 */
function deduplicatePosts(posts: BlogPost[]): BlogPost[] {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  
  const deduplicated = posts.filter(post => {
    if (seen.has(post.id)) {
      duplicates.push(post.id);
      return false;
    }
    seen.add(post.id);
    return true;
  });
  
  // Log seulement si des doublons ont été trouvés ET qu'on est en dev
  if (duplicates.length > 0 && window.location.hostname === "localhost") {
    console.warn(`⚠️ ${duplicates.length} duplicate blog post(s) removed automatically`);
  }
  
  return deduplicated;
}

/**
 * Récupère tous les articles depuis Supabase
 */
export async function fetchBlogPosts(lang: string = "fr"): Promise<{
  posts: BlogPost[];
  mode: BlogServiceMode;
  error?: string;
}> {
  const isServerAvailable = await checkServerAvailability();

  if (!isServerAvailable) {
    console.warn("⚠️ Blog: Serveur Supabase non disponible");
    return { 
      posts: [], 
      mode: "unavailable",
      error: "Le serveur n'est pas disponible. Veuillez initialiser les données depuis le dashboard."
    };
  }

  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts?lang=${lang}`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (response.ok) {
      const data = await response.json();
      
      // Le serveur peut retourner soit un array directement, soit un objet { success, posts }
      const posts = Array.isArray(data) ? data : (data.posts || []);
      
      if (!Array.isArray(posts)) {
        console.error("❌ Blog: Format de réponse invalide, attendu un array mais reçu:", typeof posts);
        return { 
          posts: [], 
          mode: "unavailable",
          error: "Format de réponse invalide du serveur"
        };
      }
      
      const dedupedPosts = deduplicatePosts(posts);
      const normalizedPosts = dedupedPosts.map((p: BlogPost) => normalizePostForLanguage(p, lang));
      console.log(`✅ Blog: Chargé ${normalizedPosts.length} articles depuis Supabase (${lang})`);
      return { posts: normalizedPosts, mode: "server" };
    } else {
      const errorText = await response.text();
      console.error("❌ Blog: Erreur serveur:", response.status, errorText);
      return { 
        posts: [], 
        mode: "unavailable",
        error: `Erreur ${response.status}: ${errorText}`
      };
    }
  } catch (error) {
    console.error("❌ Blog: Erreur lors du chargement:", error);
    return { 
      posts: [], 
      mode: "unavailable",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    };
  }
}

/**
 * Récupère un article par slug depuis Supabase
 */
export async function fetchBlogPost(slug: string, lang: string = "fr"): Promise<{
  post: BlogPost | null;
  mode: BlogServiceMode;
  error?: string;
}> {
  const isServerAvailable = await checkServerAvailability();

  if (!isServerAvailable) {
    console.warn("⚠️ Blog: Serveur Supabase non disponible");
    return { 
      post: null, 
      mode: "unavailable",
      error: "Le serveur n'est pas disponible."
    };
  }

  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts/${slug}?lang=${lang}`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (response.ok) {
      const data = await response.json();
      
      // Le serveur peut retourner soit l'objet directement, soit { success, post }
      const post = data.post || (data.success !== false ? data : null);
      
      if (post && typeof post === 'object') {
        const normalizedPost = normalizePostForLanguage(post as BlogPost, lang);
        console.log(`✅ Blog: Article "${slug}" chargé depuis Supabase (${lang})`);
        return { post: normalizedPost, mode: "server" };
      }
    }
    
    return { 
      post: null, 
      mode: "unavailable", 
      error: `Article "${slug}" non trouvé` 
    };
  } catch (error) {
    console.error("❌ Blog: Erreur serveur:", error);
    return { 
      post: null, 
      mode: "unavailable",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    };
  }
}

/**
 * Incrémente les vues d'un article
 */
export async function incrementPostViews(slug: string): Promise<void> {
  const isServerAvailable = await checkServerAvailability();

  if (!isServerAvailable) {
    console.warn("⚠️ Blog: Impossible d'incrémenter les vues - serveur non disponible");
    return;
  }

  try {
    // Incrémenter les vues côté serveur
    await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts/${slug}/view`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        signal: AbortSignal.timeout(5000),
      }
    );
    console.log(`📊 Blog: Vue incrémentée pour "${slug}" (serveur)`);
  } catch (error) {
    console.error("❌ Blog: Erreur serveur pour incrémenter vues:", error);
  }
}

/**
 * Récupère le mode actuel
 */
export function getCurrentMode(): BlogServiceMode {
  return currentMode;
}

/**
 * Force le re-check du serveur
 */
export function recheckServer(): void {
  serverAvailable = null;
  currentMode = "checking";
}

/**
 * Initialise le blog (via le serveur Supabase uniquement)
 */
export async function initializeBlog(): Promise<{
  success: boolean;
  count: number;
  mode: BlogServiceMode;
  error?: string;
}> {
  const isServerAvailable = await checkServerAvailability();

  if (!isServerAvailable) {
    console.warn("⚠️ Serveur non disponible - utilisez le dashboard pour initialiser les données");
    return { 
      success: false, 
      count: 0, 
      mode: "unavailable",
      error: "Serveur non disponible. Utilisez le bouton 'Seed Data' dans le dashboard."
    };
  }

  console.log("✅ Serveur disponible - utilisez le bouton 'Seed Blog' dans le dashboard pour initialiser");
  return { success: true, count: 0, mode: "server" };
}
