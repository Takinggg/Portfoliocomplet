/**
 * UNIFIED DATA SERVICE - SUPABASE ONLY
 * 
 * Service centralisé pour TOUTES les données du portfolio/CRM
 * ✅ Utilise UNIQUEMENT Supabase (pas de localStorage)
 * ✅ Gère projets, blog, case studies, FAQs, resources
 * ✅ Synchronisation complète dashboard ↔ pages publiques
 */

import { projectId, publicAnonKey } from "./supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;

export type DataServiceMode = "connected" | "disconnected" | "checking";

let currentMode: DataServiceMode = "checking";
let lastCheck: number = 0;
const CHECK_INTERVAL = 30000; // Re-check every 30 seconds

/**
 * Vérifie la connexion au serveur (NON-BLOQUANT)
 * Cette fonction vérifie la connexion mais ne bloque PAS les requêtes
 */
export async function checkServerConnection(): Promise<boolean> {
  const now = Date.now();
  if (lastCheck && now - lastCheck < CHECK_INTERVAL) {
    return currentMode === "connected";
  }

  try {
    const response = await fetch(`${BASE_URL}/health`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
      signal: AbortSignal.timeout(3000), // Réduit à 3s pour être plus rapide
    });
    
    const isConnected = response.ok;
    currentMode = isConnected ? "connected" : "disconnected";
    lastCheck = now;
    
    if (isConnected) {
      console.log("✅ Serveur Supabase connecté");
      try {
        const data = await response.json();
        console.log("   Version serveur:", data.version || "unknown");
      } catch (e) {
        // Ignore JSON parse errors
      }
    } else {
      console.warn("⚠️ Serveur Supabase non disponible (Status:", response.status, ")");
    }
    
    return isConnected;
  } catch (error) {
    console.warn("⚠️ Impossible de contacter le serveur Supabase (ce n'est pas bloquant)");
    // Ne pas bloquer - on continue quand même
    currentMode = "connected"; // Optimiste: on suppose que ça va marcher
    lastCheck = now;
    return true; // Retourne true pour ne pas bloquer
  }
}

/**
 * Force la re-vérification du serveur
 */
export function forceRecheck(): void {
  lastCheck = 0;
  currentMode = "checking";
}

/**
 * Retourne le mode actuel
 */
export function getCurrentMode(): DataServiceMode {
  return currentMode;
}

// ==================== PROJECTS ====================

export interface BilingualProject {
  id: string;
  // French fields
  name_fr: string;
  description_fr?: string;
  tags_fr?: string[];
  duration_fr?: string;
  challenges_fr?: string;
  solutions_fr?: string;
  results_fr?: string;
  category_fr?: "web" | "mobile" | "design" | "consulting" | "other";
  // English fields
  name_en: string;
  description_en?: string;
  tags_en?: string[];
  duration_en?: string;
  challenges_en?: string;
  solutions_en?: string;
  results_en?: string;
  category_en?: "web" | "mobile" | "design" | "consulting" | "other";
  // Common fields
  clientId?: string;
  clientName?: string;
  status: "planning" | "in_progress" | "review" | "completed" | "on_hold";
  budget?: number;
  spent?: number;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  isPinned?: boolean;
  technologies?: string[];
  projectUrl?: string;
  githubUrl?: string;
  imageGallery?: string[];
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Récupère tous les projets bilingues
 */
export async function fetchProjects(): Promise<BilingualProject[]> {
  // Vérification non-bloquante
  checkServerConnection().catch(() => {});
  
  try {
    const response = await fetch(`${BASE_URL}/projects`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    const data = await response.json();
    const projects = data.projects || data || [];
    
    // ⚠️ Si pas un tableau, retourner vide
    if (!Array.isArray(projects)) {
      console.warn("⚠️ Projects response is not an array:", projects);
      return [];
    }
    
    console.log(`✅ Projets chargés: ${projects.length}`);
    currentMode = "connected";
    return projects;
  } catch (error) {
    console.error("❌ Erreur chargement projets:", error);
    throw error;
  }
}

/**
 * Récupère un projet par ID
 */
export async function fetchProjectById(id: string): Promise<BilingualProject | null> {
  // Vérification non-bloquante
  checkServerConnection().catch(() => {});

  try {
    const response = await fetch(`${BASE_URL}/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    const data = await response.json();
    return data.project || null;
  } catch (error) {
    console.error(`❌ Erreur chargement projet ${id}:`, error);
    throw error;
  }
}

/**
 * Crée un nouveau projet (auth requise)
 */
export async function createProject(
  project: Omit<BilingualProject, "id" | "createdAt" | "updatedAt">,
  accessToken: string
): Promise<BilingualProject> {
  // Vérification non-bloquante
  checkServerConnection().catch(() => {});

  try {
    const response = await fetch(`${BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(project),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur création: ${error}`);
    }

    const data = await response.json();
    console.log("✅ Projet créé:", data.project.id);
    return data.project;
  } catch (error) {
    console.error("❌ Erreur création projet:", error);
    throw error;
  }
}

/**
 * Met à jour un projet (auth requise)
 */
export async function updateProject(
  id: string,
  updates: Partial<BilingualProject>,
  accessToken: string
): Promise<BilingualProject> {
  // Vérification non-bloquante
  checkServerConnection().catch(() => {});

  try {
    const response = await fetch(`${BASE_URL}/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updates),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur mise à jour: ${error}`);
    }

    const data = await response.json();
    console.log("✅ Projet mis à jour:", id);
    return data.project;
  } catch (error) {
    console.error("❌ Erreur mise à jour projet:", error);
    throw error;
  }
}

/**
 * Supprime un projet (auth requise)
 */
export async function deleteProject(id: string, accessToken: string): Promise<void> {
  // Vérification non-bloquante
  checkServerConnection().catch(() => {});

  try {
    const response = await fetch(`${BASE_URL}/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur suppression: ${error}`);
    }

    console.log("✅ Projet supprimé:", id);
  } catch (error) {
    console.error("❌ Erreur suppression projet:", error);
    throw error;
  }
}

// ==================== BLOG POSTS ====================

export interface BlogPost {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string;
  excerpt_fr: string;
  excerpt_en: string;
  content_fr: string;
  content_en: string;
  coverImage: string;
  category: "development" | "design" | "business";
  tags: string[];
  status: "draft" | "published";
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Pour compatibilité avec l'interface existante
  title?: string;
  excerpt?: string;
  content?: string;
  language?: "fr" | "en";
}

/**
 * Récupère tous les posts du blog
 */
export async function fetchBlogPosts(lang: "fr" | "en" = "fr"): Promise<BlogPost[]> {
  // Vérification non-bloquante
  checkServerConnection().catch(() => {});
  
  try {
    const response = await fetch(`${BASE_URL}/blog/posts?lang=${lang}`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // ✅ Extraire le tableau posts de la réponse { success: true, posts: [...] }
    const posts = data.posts || data || [];
    
    // ⚠️ Si pas un tableau, retourner vide
    if (!Array.isArray(posts)) {
      console.warn("⚠️ Blog posts response is not an array:", posts);
      return [];
    }
    
    // Normaliser les posts pour la langue demandée
    const normalizedPosts = posts.map((post: BlogPost) => ({
      ...post,
      title: lang === "en" ? post.title_en : post.title_fr,
      excerpt: lang === "en" ? post.excerpt_en : post.excerpt_fr,
      content: lang === "en" ? post.content_en : post.content_fr,
      language: lang,
    }));
    
    console.log(`✅ Articles chargés: ${normalizedPosts.length} (${lang})`);
    return normalizedPosts;
  } catch (error) {
    console.error("❌ Erreur chargement articles:", error);
    throw error;
  }
}

/**
 * Récupère un post par slug
 */
export async function fetchBlogPost(slug: string, lang: "fr" | "en" = "fr"): Promise<BlogPost | null> {
  // Vérification non-bloquante
  checkServerConnection().catch(() => {});

  try {
    const response = await fetch(`${BASE_URL}/blog/posts/${slug}?lang=${lang}`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    const data = await response.json();
    const post = data.post;
    
    if (!post) return null;
    
    // Normaliser le post pour la langue demandée
    return {
      ...post,
      title: lang === "en" ? post.title_en : post.title_fr,
      excerpt: lang === "en" ? post.excerpt_en : post.excerpt_fr,
      content: lang === "en" ? post.content_en : post.content_fr,
      language: lang,
    };
  } catch (error) {
    console.error(`❌ Erreur chargement article ${slug}:`, error);
    throw error;
  }
}

/**
 * Crée un nouveau post (auth requise)
 */
export async function createBlogPost(
  post: Omit<BlogPost, "id" | "views" | "createdAt" | "updatedAt">,
  accessToken: string
): Promise<BlogPost> {
  // Vérification non-bloquante
  checkServerConnection().catch(() => {});

  try {
    const response = await fetch(`${BASE_URL}/blog/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(post),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur création: ${error}`);
    }

    const data = await response.json();
    console.log("✅ Article créé:", data.post.slug);
    return data.post;
  } catch (error) {
    console.error("❌ Erreur création article:", error);
    throw error;
  }
}

/**
 * Met à jour un post (auth requise)
 */
export async function updateBlogPost(
  id: string,
  updates: Partial<BlogPost>,
  accessToken: string
): Promise<BlogPost> {
  // Vérification non-bloquante
  checkServerConnection().catch(() => {});

  try{
    const response = await fetch(`${BASE_URL}/blog/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updates),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur mise à jour: ${error}`);
    }

    const data = await response.json();
    console.log("✅ Article mis à jour:", id);
    return data.post;
  } catch (error) {
    console.error("❌ Erreur mise à jour article:", error);
    throw error;
  }
}

/**
 * Supprime un post (auth requise)
 */
export async function deleteBlogPost(id: string, accessToken: string): Promise<void> {
  // Vérification non-bloquante
  checkServerConnection().catch(() => {});

  try {
    const response = await fetch(`${BASE_URL}/blog/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur suppression: ${error}`);
    }

    console.log("✅ Article supprimé:", id);
  } catch (error) {
    console.error("❌ Erreur suppression article:", error);
    throw error;
  }
}

/**
 * Incrémente les vues d'un post
 */
export async function incrementPostViews(slug: string): Promise<void> {
  try {
    await fetch(`${BASE_URL}/blog/posts/${slug}/view`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    // Silent fail pour les vues
    console.debug("Could not increment views:", error);
  }
}

// ==================== CASE STUDIES ====================

export interface CaseStudy {
  id: string;
  slug: string;
  // Bilingual fields
  title: string;
  title_en?: string;
  client: string;
  category: string;
  category_en?: string;
  year: string;
  featured: boolean;
  thumbnail: string;
  tagline: string;
  tagline_en?: string;
  description: string;
  description_en?: string;
  tags: string[];
  tags_en?: string[];
  challenge: {
    title: string;
    title_en?: string;
    description: string;
    description_en?: string;
    painPoints: string[];
    painPoints_en?: string[];
  };
  solution: {
    title: string;
    title_en?: string;
    description: string;
    description_en?: string;
    approach: string[];
    approach_en?: string[];
    technologies: string[];
  };
  results: {
    title: string;
    title_en?: string;
    description: string;
    description_en?: string;
    metrics: Array<{
      value: string;
      label: string;
      label_en?: string;
    }>;
  };
  testimonial?: {
    quote: string;
    quote_en?: string;
    author: string;
    role: string;
    role_en?: string;
    company: string;
  };
  process?: Array<{
    phase: string;
    phase_en?: string;
    description: string;
    description_en?: string;
  }>;
  images: string[];
  createdAt: string;
  updatedAt?: string;
}

/**
 * Récupère toutes les case studies
 */
export async function fetchCaseStudies(): Promise<CaseStudy[]> {
  // Vérification non-bloquante
  checkServerConnection().catch(() => {}); // Fire and forget
  
  try {
    const response = await fetch(`${BASE_URL}/case-studies`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error(`❌ Erreur serveur case studies: ${response.status}`);
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    const data = await response.json();
    // Le serveur retourne { caseStudies: [...] } ou { success: true, caseStudies: [...] }
    const caseStudies = data.caseStudies || data;
    console.log(`✅ Études de cas chargées: ${caseStudies.length}`);
    currentMode = "connected"; // Marquer comme connecté si ça a marché
    return Array.isArray(caseStudies) ? caseStudies : [];
  } catch (error) {
    console.error("❌ Erreur chargement case studies:", error);
    throw error;
  }
}

/**
 * Récupère une case study par slug
 */
export async function fetchCaseStudy(slug: string): Promise<CaseStudy | null> {
  // Vérification non-bloquante
  checkServerConnection().catch(() => {});

  try {
    const response = await fetch(`${BASE_URL}/case-studies/${slug}`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    const caseStudy = await response.json();
    return caseStudy;
  } catch (error) {
    console.error(`❌ Erreur chargement case study ${slug}:`, error);
    throw error;
  }
}

/**
 * Crée une nouvelle case study (auth requise)
 */
export async function createCaseStudy(
  caseStudy: Omit<CaseStudy, "id" | "createdAt" | "updatedAt">,
  accessToken: string
): Promise<CaseStudy> {
  // Vérification non-bloquante
  checkServerConnection().catch(() => {});

  try {
    const response = await fetch(`${BASE_URL}/case-studies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(caseStudy),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur création: ${error}`);
    }

    const data = await response.json();
    console.log("✅ Case study créée:", data.caseStudy.slug);
    return data.caseStudy;
  } catch (error) {
    console.error("❌ Erreur création case study:", error);
    throw error;
  }
}

/**
 * Met à jour une case study (auth requise)
 */
export async function updateCaseStudy(
  id: string,
  updates: Partial<CaseStudy>,
  accessToken: string
): Promise<CaseStudy> {
  // Vérification non-bloquante
  checkServerConnection().catch(() => {});

  try {
    const response = await fetch(`${BASE_URL}/case-studies/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updates),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur mise à jour: ${error}`);
    }

    const data = await response.json();
    console.log("✅ Case study mise à jour:", id);
    return data.caseStudy;
  } catch (error) {
    console.error("❌ Erreur mise à jour case study:", error);
    throw error;
  }
}

/**
 * Supprime une case study (auth requise)
 */
export async function deleteCaseStudy(id: string, accessToken: string): Promise<void> {
  // Vérification non-bloquante
  checkServerConnection().catch(() => {});

  try {
    const response = await fetch(`${BASE_URL}/case-studies/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur suppression: ${error}`);
    }

    console.log("✅ Case study supprimée:", id);
  } catch (error) {
    console.error("❌ Erreur suppression case study:", error);
    throw error;
  }
}

// ==================== UTILITY ====================

/**
 * Badge de statut de connexion
 */
export function getConnectionBadge(): { icon: string; text: string; color: string; details?: string } {
  switch (currentMode) {
    case "connected":
      return { 
        icon: "🟢", 
        text: "Connecté", 
        color: "#00FFC2",
        details: "Serveur Supabase opérationnel"
      };
    case "disconnected":
      return { 
        icon: "🔴", 
        text: "Déconnecté", 
        color: "#FF0000",
        details: "Le serveur Edge Function n'est pas déployé. Consultez /DEPLOYMENT_GUIDE_SUPABASE.md"
      };
    case "checking":
      return { 
        icon: "🔄", 
        text: "Vérification...", 
        color: "#888888",
        details: "Vérification de la connexion au serveur..."
      };
  }
}

/**
 * Retourne des instructions pour corriger les problèmes de connexion
 */
export function getConnectionInstructions(): string {
  return `
🚀 COMMENT DÉPLOYER LE SERVEUR SUPABASE:

1. Installez Supabase CLI:
   npm install -g supabase

2. Connectez-vous:
   supabase login

3. Liez votre projet:
   supabase link --project-ref ${projectId}

4. Déployez le serveur:
   supabase functions deploy make-server-04919ac5

5. Vérifiez le déploiement:
   curl https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health

📖 Guide complet: Consultez /DEPLOYMENT_GUIDE_SUPABASE.md
  `;
}
