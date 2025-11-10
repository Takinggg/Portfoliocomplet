/**
 * Helper pour gérer les fetch avec fallback et gestion d'erreurs améliorée
 */

import { toast } from "sonner@2.0.3";

export interface FetchOptions extends RequestInit {
  showErrorToast?: boolean;
  errorMessage?: string;
  timeout?: number;
}

/**
 * Fetch avec timeout et gestion d'erreurs améliorée
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    showErrorToast = false,
    errorMessage = "Erreur de connexion",
    timeout = 10000,
    ...fetchOptions
  } = options;

  // Créer un AbortController pour le timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    // Gérer différents types d'erreurs
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error("Request timeout:", url);
        if (showErrorToast) {
          toast.error("Délai d'attente dépassé", {
            description: "Le serveur ne répond pas. Vérifiez votre connexion.",
          });
        }
        throw new Error("Request timeout");
      }

      // Erreur réseau (serveur inaccessible)
      if (error.message === "Failed to fetch") {
        console.error("Network error:", url);
        if (showErrorToast) {
          toast.error(errorMessage, {
            description: "Impossible de se connecter au serveur. Utilisation des données locales.",
          });
        }
        throw new Error("Network error: Server unavailable");
      }
    }

    // Autre erreur
    console.error("Fetch error:", error);
    if (showErrorToast) {
      toast.error(errorMessage);
    }
    throw error;
  }
}

/**
 * Fetch avec retry automatique
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {},
  maxRetries = 3,
  retryDelay = 1000
): Promise<Response> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, {
        ...options,
        // Afficher le toast d'erreur seulement au dernier essai
        showErrorToast: options.showErrorToast && attempt === maxRetries - 1,
      });

      // Si la réponse est OK, retourner immédiatement
      if (response.ok) {
        return response;
      }

      // Si erreur serveur (5xx), réessayer
      if (response.status >= 500 && attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)));
        continue;
      }

      // Si erreur client (4xx), ne pas réessayer
      return response;
    } catch (error) {
      lastError = error as Error;

      // Si c'est le dernier essai, lancer l'erreur
      if (attempt === maxRetries - 1) {
        throw lastError;
      }

      // Attendre avant de réessayer
      await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)));
    }
  }

  throw lastError || new Error("Max retries exceeded");
}

/**
 * Vérifie si le serveur est disponible
 */
export async function checkServerHealth(baseUrl: string): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(`${baseUrl}/health`, {
      method: "GET",
      timeout: 5000,
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Fetch avec fallback local
 */
export async function fetchWithLocalFallback<T>(
  url: string,
  options: FetchOptions,
  fallbackData: () => T | Promise<T>,
  cacheKey?: string
): Promise<{ data: T; fromCache: boolean }> {
  try {
    const response = await fetchWithRetry(url, options, 2, 1000);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Sauvegarder en cache si une clé est fournie
    if (cacheKey) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (error) {
        console.warn("Failed to cache data:", error);
      }
    }

    return { data, fromCache: false };
  } catch (error) {
    console.warn("Fetch failed, using fallback:", error);

    // Essayer de récupérer du cache d'abord
    if (cacheKey) {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          return { data: JSON.parse(cached), fromCache: true };
        }
      } catch (error) {
        console.warn("Failed to read cache:", error);
      }
    }

    // Utiliser les données de fallback
    const data = await fallbackData();
    return { data, fromCache: true };
  }
}
