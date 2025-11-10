/**
 * Accessibilité - Focus Styles
 * Styles de focus cohérents et visibles pour tous les éléments interactifs
 */

// Focus visible universel pour tous les éléments interactifs
export const focusClasses = {
  // Focus principal avec ring mint
  default: "focus:outline-none focus:ring-4 focus:ring-[#00FFC2]/50 focus:ring-offset-2 focus:ring-offset-[#0C0C0C]",
  
  // Focus pour éléments sur fond clair
  onLight: "focus:outline-none focus:ring-4 focus:ring-[#00FFC2]/50 focus:ring-offset-2 focus:ring-offset-white",
  
  // Focus pour éléments sur fond sombre
  onDark: "focus:outline-none focus:ring-4 focus:ring-[#00FFC2]/50 focus:ring-offset-2 focus:ring-offset-[#0C0C0C]",
  
  // Focus pour boutons primaires (mint)
  primary: "focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#00FFC2]",
  
  // Focus pour liens inline
  inline: "focus:outline-none focus:underline focus:underline-offset-4 focus:decoration-2 focus:decoration-[#00FFC2]",
  
  // Focus pour cartes et zones cliquables
  card: "focus:outline-none focus:ring-4 focus:ring-[#00FFC2]/40 focus:ring-offset-2 focus:ring-offset-[#0C0C0C]",
  
  // Focus pour inputs
  input: "focus:outline-none focus:ring-2 focus:ring-[#00FFC2] focus:border-[#00FFC2]",
  
  // Focus pour navigation
  nav: "focus:outline-none focus:bg-[#00FFC2]/10 focus:text-[#00FFC2]",
};

// Classe CSS pour ajouter automatiquement le focus visible
export const focusVisibleClass = `
  /* Focus visible automatique pour tous les éléments interactifs */
  *:focus-visible {
    outline: 2px solid #00FFC2;
    outline-offset: 2px;
  }
  
  /* Supprime le focus pour les clics souris (garde pour clavier uniquement) */
  *:focus:not(:focus-visible) {
    outline: none;
  }
`;

// Helper pour combiner les classes de focus avec d'autres classes
export function withFocus(classes: string, focusType: keyof typeof focusClasses = "default"): string {
  return `${classes} ${focusClasses[focusType]}`;
}

// Focus trap pour modales et dialogs
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  };
  
  element.addEventListener('keydown', handleTabKey);
  
  // Focus le premier élément
  firstFocusable?.focus();
  
  // Retourne une fonction pour nettoyer
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

// Restore focus après fermeture de modal
export function createFocusManager() {
  let previousFocus: HTMLElement | null = null;
  
  return {
    save: () => {
      previousFocus = document.activeElement as HTMLElement;
    },
    restore: () => {
      previousFocus?.focus();
      previousFocus = null;
    }
  };
}
