/**
 * Accessibilité - ARIA Labels
 * Labels ARIA cohérents et localisés pour tous les composants
 */

export const ariaLabels = {
  // Navigation
  nav: {
    main: "Navigation principale",
    skip: "Aller au contenu principal",
    breadcrumb: "Fil d'ariane",
    pagination: "Navigation par pagination",
    language: "Sélection de la langue",
  },
  
  // Boutons
  buttons: {
    close: "Fermer",
    open: "Ouvrir",
    menu: "Menu",
    search: "Rechercher",
    filter: "Filtrer",
    sort: "Trier",
    expand: "Développer",
    collapse: "Réduire",
    more: "Voir plus",
    less: "Voir moins",
    next: "Suivant",
    previous: "Précédent",
    submit: "Envoyer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    save: "Enregistrer",
    download: "Télécharger",
    share: "Partager",
    copy: "Copier",
    like: "J'aime",
    bookmark: "Ajouter aux favoris",
  },
  
  // Formulaires
  forms: {
    required: "Champ obligatoire",
    optional: "Champ optionnel",
    error: "Erreur de validation",
    success: "Validation réussie",
    loading: "Chargement en cours",
    email: "Adresse email",
    password: "Mot de passe",
    name: "Nom",
    message: "Message",
    phone: "Numéro de téléphone",
    date: "Date",
    time: "Heure",
  },
  
  // États
  states: {
    loading: "Chargement en cours",
    error: "Une erreur est survenue",
    success: "Opération réussie",
    empty: "Aucun résultat",
    selected: "Sélectionné",
    expanded: "Développé",
    collapsed: "Réduit",
    disabled: "Désactivé",
    checked: "Coché",
    unchecked: "Non coché",
    current: "Page actuelle",
  },
  
  // Médias
  media: {
    image: "Image",
    video: "Vidéo",
    audio: "Audio",
    play: "Lecture",
    pause: "Pause",
    stop: "Arrêter",
    mute: "Couper le son",
    unmute: "Activer le son",
    fullscreen: "Plein écran",
    exitFullscreen: "Quitter le plein écran",
  },
  
  // Notifications
  notifications: {
    info: "Information",
    warning: "Avertissement",
    error: "Erreur",
    success: "Succès",
  },
  
  // Dialog/Modal
  dialog: {
    close: "Fermer la boîte de dialogue",
    confirm: "Confirmer",
    cancel: "Annuler",
  },
  
  // Social
  social: {
    facebook: "Partager sur Facebook",
    twitter: "Partager sur Twitter",
    linkedin: "Partager sur LinkedIn",
    email: "Partager par email",
    whatsapp: "Partager sur WhatsApp",
  },
  
  // Dashboard
  dashboard: {
    menu: "Menu du tableau de bord",
    logout: "Se déconnecter",
    profile: "Mon profil",
    settings: "Paramètres",
    notifications: "Notifications",
  },
  
  // Blog
  blog: {
    readMore: "Lire la suite",
    readingTime: "Temps de lecture",
    publishedOn: "Publié le",
    category: "Catégorie",
    tags: "Étiquettes",
    author: "Auteur",
    comments: "Commentaires",
    shareArticle: "Partager l'article",
  },
  
  // Newsletter
  newsletter: {
    subscribe: "S'abonner à la newsletter",
    email: "Votre adresse email pour la newsletter",
    success: "Inscription réussie",
    error: "Erreur lors de l'inscription",
    unsubscribe: "Se désabonner de la newsletter",
  },
  
  // Projets
  projects: {
    viewProject: "Voir le projet",
    viewDetails: "Voir les détails",
    gallery: "Galerie d'images du projet",
    technologies: "Technologies utilisées",
    client: "Client",
    date: "Date de réalisation",
  },
};

// Helper pour générer des labels ARIA dynamiques
export function generateAriaLabel(
  template: string,
  values: Record<string, string | number>
): string {
  return Object.entries(values).reduce(
    (label, [key, value]) => label.replace(`{${key}}`, String(value)),
    template
  );
}

// Helper pour les états de chargement
export function getLoadingAriaProps(isLoading: boolean) {
  return isLoading
    ? {
        "aria-busy": "true" as const,
        "aria-live": "polite" as const,
      }
    : {};
}

// Helper pour les états d'erreur
export function getErrorAriaProps(error: string | null, errorId?: string) {
  return error
    ? {
        "aria-invalid": "true" as const,
        "aria-describedby": errorId,
      }
    : {};
}

// Helper pour les éléments requis
export function getRequiredAriaProps(isRequired: boolean) {
  return isRequired
    ? {
        "aria-required": "true" as const,
        required: true,
      }
    : {};
}

// Helper pour les tooltips
export function getTooltipAriaProps(id: string) {
  return {
    "aria-describedby": id,
  };
}

// Helper pour les modales
export function getModalAriaProps(titleId: string, descId?: string) {
  return {
    role: "dialog" as const,
    "aria-modal": "true" as const,
    "aria-labelledby": titleId,
    ...(descId && { "aria-describedby": descId }),
  };
}

// Helper pour les listes
export function getListAriaProps(itemCount: number) {
  return {
    role: "list" as const,
    "aria-label": `Liste de ${itemCount} éléments`,
  };
}

// Helper pour les accordéons
export function getAccordionAriaProps(
  id: string,
  isExpanded: boolean,
  controlsId: string
) {
  return {
    button: {
      "aria-expanded": isExpanded,
      "aria-controls": controlsId,
      id,
    },
    panel: {
      id: controlsId,
      role: "region" as const,
      "aria-labelledby": id,
    },
  };
}

// Helper pour les onglets
export function getTabsAriaProps(
  tabId: string,
  panelId: string,
  isSelected: boolean,
  index: number,
  total: number
) {
  return {
    tab: {
      role: "tab" as const,
      id: tabId,
      "aria-selected": isSelected,
      "aria-controls": panelId,
      tabIndex: isSelected ? 0 : -1,
      "aria-posinset": index + 1,
      "aria-setsize": total,
    },
    panel: {
      role: "tabpanel" as const,
      id: panelId,
      "aria-labelledby": tabId,
      tabIndex: 0,
    },
  };
}
