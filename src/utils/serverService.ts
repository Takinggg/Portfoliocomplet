/**
 * Server Service - Service central pour la détection et gestion du serveur
 * MODE SERVEUR UNIQUEMENT - AUCUN FALLBACK LOCAL
 * VERSION PRODUCTION: Toutes les données doivent être dans Supabase
 */

import { projectId, publicAnonKey } from "./supabase/info";
import { getErrorMessage, type ValidationResult } from './types/shared';

export type ServerMode = "server" | "local" | "checking";

// ============================================================================
// MODE DEVELOPMENT: FALLBACK LOCAL SI SERVEUR INDISPONIBLE
// ============================================================================
const forceServerMode = (import.meta.env.VITE_FORCE_SERVER_MODE ?? "").toString().toLowerCase();
const PRODUCTION_MODE = forceServerMode === "true"
  ? true
  : forceServerMode === "false"
    ? false
    : import.meta.env.PROD;

let currentMode: ServerMode = "checking"; // Démarrer en mode checking
let serverAvailable: boolean = false; // Détecter automatiquement
let lastCheck: number = 0;
const CHECK_INTERVAL = 30000; // 30 secondes

// Verrou pour éviter les appels parallèles
let checkPromise: Promise<boolean> | null = null;

// Flag pour savoir si on a déjà fait une première vérification
let firstCheckDone = PRODUCTION_MODE; // true en production

/**
 * Vérifie si le serveur est disponible (avec verrou anti-parallèle)
 */
export async function checkServerAvailability(): Promise<boolean> {
  // En mode production, toujours considérer le serveur comme disponible
  if (PRODUCTION_MODE) {
    serverAvailable = true;
    currentMode = "server";
    firstCheckDone = true;
    return true;
  }

  // Cache le résultat pendant 30 secondes
  const now = Date.now();
  if (firstCheckDone && now - lastCheck < CHECK_INTERVAL) {
    return serverAvailable;
  }

  // Si c'est le premier check, on lance la vérification au lieu de retourner false directement
  // (sinon le dashboard utilise toujours le mode local au premier chargement)
  if (!firstCheckDone) {
    firstCheckDone = true; // Marquer comme fait pour éviter les boucles
  }

  // Si une vérification est déjà en cours, attendre son résultat
  if (checkPromise !== null) {
    return checkPromise;
  }

  // Créer une nouvelle vérification
  checkPromise = (async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
          signal: AbortSignal.timeout(5000), // 5 secondes timeout
        }
      );

      serverAvailable = response.ok;
      lastCheck = Date.now();
      currentMode = response.ok ? "server" : "local";
      
      if (response.ok && window.location.hostname === "localhost") {
        console.log("✅ Serveur disponible");
      }
      
      return response.ok;
    } catch (error) {
      serverAvailable = false;
      lastCheck = Date.now();
      currentMode = "local";
      return false;
    } finally {
      checkPromise = null;
    }
  })();

  return checkPromise;
}

/**
 * Obtient le mode actuel du serveur
 */
export function getServerMode(): ServerMode {
  return currentMode;
}

/**
 * Force un nouveau check du serveur
 */
export function resetServerCheck(): void {
  if (PRODUCTION_MODE) {
    // En production, ne jamais reset le serveur
    return;
  }
  
  serverAvailable = false;
  lastCheck = 0;
  currentMode = "checking";
  firstCheckDone = false;
}

/**
 * Force une vérification immédiate du serveur (ignore le cache)
 * Utilisé par les boutons "Rafraîchir"
 */
export async function forceCheckServer(): Promise<boolean> {
  if (PRODUCTION_MODE) {
    console.log("🔒 Mode production: serveur toujours disponible");
    return true;
  }

  firstCheckDone = true;
  lastCheck = 0;
  return checkServerAvailability();
}

/**
 * Wrapper générique pour les appels API avec fallback local
 * EN MODE PRODUCTION: AUCUN FALLBACK, THROW ERROR SI SERVEUR INDISPONIBLE
 */
export async function fetchWithFallback<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackFn: () => Promise<T>
): Promise<{ data: T; mode: ServerMode }> {
  // En mode production, toujours essayer le serveur
  // ✅ SKIP le check de disponibilité pour éviter double timeout
  // const isAvailable = await checkServerAvailability();

  // if (!isAvailable && !PRODUCTION_MODE) {
  //   const data = await fallbackFn();
  //   return { data, mode: "local" };
  // }

  try {
    console.log(`🌐 [serverService] Calling ${endpoint}...`);
    const fetchStart = Date.now();
    
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5${endpoint}`,
      {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${publicAnonKey}`,
        },
        signal: AbortSignal.timeout(30000), // 30 secondes timeout pour dashboard stats
      }
    );
    
    const fetchTime = Date.now() - fetchStart;
    console.log(`⏱️ [serverService] ${endpoint} responded in ${fetchTime}ms (status: ${response.status})`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur serveur ${response.status} sur ${endpoint}:`, errorText);
      
      // En mode production, throw error au lieu de fallback
      if (PRODUCTION_MODE) {
        throw new Error(`Server error ${response.status}: ${errorText}`);
      }
      
      // En dev, fallback local
      const data = await fallbackFn();
      return { data, mode: "local" };
    }

    const jsonData = await response.json();
    
    // Le serveur complet retourne { success: true, [key]: data }
    // Extraire les données selon la structure
    let data;
    if (jsonData.caseStudies !== undefined) {
      data = jsonData.caseStudies;
    } else if (jsonData.faqs !== undefined) {
      data = jsonData.faqs;
    } else if (jsonData.resources !== undefined) {
      data = jsonData.resources;
    } else if (jsonData.testimonials !== undefined) {
      data = jsonData.testimonials;
    } else if (jsonData.posts !== undefined) {
      data = jsonData.posts;
    } else if (jsonData.subscribers !== undefined) {
      data = jsonData.subscribers;
    } else if (jsonData.leads !== undefined && jsonData.clients !== undefined) {
      // ✅ Dashboard stats retourne { leads, clients, bookings } - retourner l'objet complet
      data = jsonData;
    } else if (jsonData.leads !== undefined) {
      data = jsonData.leads;
    } else {
      // Sinon, retourner la réponse telle quelle
      data = jsonData;
    }
    
    console.log(`✅ Fetched from server: ${endpoint}`, {
      type: Array.isArray(data) ? 'array' : typeof data,
      count: Array.isArray(data) ? data.length : 'N/A'
    });
    
    return { data, mode: "server" };
  } catch (error: unknown) {
    console.error(`❌ Error fetching ${endpoint}:`, getErrorMessage(error));
    
    // En mode production, throw error
    if (PRODUCTION_MODE) {
      throw error;
    }
    
    // En dev, fallback local
    const data = await fallbackFn();
    return { data, mode: "local" };
  }
}

export interface ValidationResult {
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Vérifie que le serveur Supabase est bien déployé et accessible
 */
export async function validateServerDeployment(): Promise<ValidationResult> {
  console.log("🔍 Validation du déploiement serveur...");
  
  try {
    // 1. Health check
    const healthResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!healthResponse.ok) {
      return {
        success: false,
        message: `Health check failed: ${healthResponse.status} ${healthResponse.statusText}`,
      };
    }

    const healthData = await healthResponse.json();
    console.log("✅ Health check OK:", healthData);

    // 2. Vérifier que la table KV existe
    const projectsResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!projectsResponse.ok) {
      return {
        success: false,
        message: `Projects endpoint failed: ${projectsResponse.status}`,
      };
    }

    const projectsData = await projectsResponse.json();
    console.log("✅ Projects endpoint OK:", {
      count: Array.isArray(projectsData) ? projectsData.length : 'N/A'
    });

    return {
      success: true,
      message: "Serveur déployé et fonctionnel",
      details: {
        health: healthData,
        projectsCount: Array.isArray(projectsData) ? projectsData.length : 0,
      },
    };
  } catch (error: unknown) {
    console.error("❌ Erreur de validation:", getErrorMessage(error));
    return {
      success: false,
      message: `Erreur: ${getErrorMessage(error)}`,
    };
  }
}
