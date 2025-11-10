/**
 * INITIALISATION AUTOMATIQUE DU COMPTE ADMIN
 * 
 * Ce module s'assure que le compte admin existe dans Supabase Auth
 * Il l'appelle au premier chargement de l'application
 */

import { projectId, publicAnonKey } from "./supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;

let initialized = false;

/**
 * Initialise le compte admin si nécessaire
 * Cette fonction est idempotente et peut être appelée plusieurs fois
 */
export async function initAdminAccount(): Promise<void> {
  // Ne l'exécuter qu'une seule fois par session
  if (initialized) {
    return;
  }

  try {
    console.log("🔐 Initialisation du compte admin...");
    
    const response = await fetch(`${BASE_URL}/auth/init-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.warn("⚠️ Impossible d'initialiser le compte admin (serveur non déployé?)");
      return;
    }

    const data = await response.json();
    
    if (data.success) {
      console.log("✅ Compte admin:", data.message);
      console.log("   Email:", data.email);
      initialized = true;
    } else {
      console.error("❌ Erreur init admin:", data.error);
    }
  } catch (error) {
    // Silently fail - le serveur n'est peut-être pas encore déployé
    console.debug("Init admin failed (serveur non disponible?):", error);
  }
}

/**
 * Hook pour initialiser l'admin au chargement de l'app
 */
export function useInitAdmin() {
  if (typeof window !== "undefined" && !initialized) {
    // Appeler après un petit délai pour ne pas bloquer le rendu
    setTimeout(() => {
      initAdminAccount();
    }, 1000);
  }
}
