import { useState, useEffect } from 'react';

export type TransitionState = 'idle' | 'loading' | 'loaded';

export interface PageTransitionOptions {
  minLoadingTime?: number; // Temps minimum d'affichage du loading (ms)
  fadeDelay?: number; // Délai avant le fade-in du contenu (ms)
}

/**
 * Hook pour gérer les transitions fluides entre pages
 * avec état de chargement et animations
 */
export function usePageTransition(options: PageTransitionOptions = {}) {
  const { minLoadingTime = 500, fadeDelay = 150 } = options;

  const [state, setState] = useState<TransitionState>('idle');
  const [showContent, setShowContent] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  /**
   * Démarre une transition de page
   * Retourne une promesse qui se résout quand le loading minimum est atteint
   */
  const startTransition = async () => {
    setState('loading');
    setShowContent(false);
    setLoadingProgress(0);

    // Simule une progress bar fluide
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) return prev; // Cap à 90% jusqu'à finishTransition
        return prev + Math.random() * 15;
      });
    }, 100);

    // Attendre le temps minimum
    await new Promise(resolve => setTimeout(resolve, minLoadingTime));
    
    clearInterval(progressInterval);
    setLoadingProgress(100);

    return () => clearInterval(progressInterval);
  };

  /**
   * Termine la transition et affiche le contenu
   */
  const finishTransition = () => {
    setLoadingProgress(100);
    setState('loaded');
    
    // Petit délai avant d'afficher le contenu pour une transition douce
    setTimeout(() => {
      setShowContent(true);
      setState('idle');
    }, fadeDelay);
  };

  /**
   * Réinitialise l'état
   */
  const resetTransition = () => {
    setState('idle');
    setShowContent(false);
    setLoadingProgress(0);
  };

  return {
    state,
    showContent,
    loadingProgress,
    isLoading: state === 'loading',
    isLoaded: state === 'loaded',
    startTransition,
    finishTransition,
    resetTransition,
  };
}

/**
 * Hook simplifié pour les composants qui chargent des données
 */
export function useLoadingState(initialLoading = true) {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<Error | null>(null);

  const startLoading = () => {
    setIsLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const setLoadingError = (err: Error) => {
    setIsLoading(false);
    setError(err);
  };

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError: setLoadingError,
  };
}

/**
 * Hook pour débouncer les états de chargement
 * Évite les flashes de loading pour les requêtes rapides
 */
export function useDebouncedLoading(isLoading: boolean, delay = 300) {
  const [debouncedLoading, setDebouncedLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      // Si on commence à charger, attendre le delay avant d'afficher le loader
      const timeout = setTimeout(() => {
        setDebouncedLoading(true);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      // Si on arrête de charger, cacher le loader immédiatement
      setDebouncedLoading(false);
    }
  }, [isLoading, delay]);

  return debouncedLoading;
}
