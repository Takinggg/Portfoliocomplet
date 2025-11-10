/**
 * Configuration SEO centralisée pour toutes les pages
 * Facilite la gestion des meta tags et OG images
 */

export interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
}

// Configuration SEO par défaut
export const defaultSEO: PageSEO = {
  title: "Portfolio Freelance & CRM - Solutions Web sur mesure",
  description: "Création de sites web, applications et automatisations pour entreprises ambitieuses. Dashboard CRM intégré pour gérer votre activité freelance.",
  keywords: [
    "freelance",
    "web development",
    "design",
    "crm",
    "automation",
    "portfolio",
    "react",
    "tailwind"
  ],
  ogImage: "/og-default.jpg",
};

// Configuration SEO pour chaque page
export const pageSEO: Record<string, PageSEO> = {
  home: {
    title: "Accueil - Portfolio Freelance & CRM",
    description: "Créons ensemble votre projet web. Expert en développement, design et automatisation avec un CRM intégré pour gérer votre activité.",
    keywords: ["accueil", "portfolio", "freelance", "web", "développement"],
    ogImage: "/og-home.jpg",
  },

  services: {
    title: "Services - Développement Web & Design",
    description: "Découvrez mes services : développement web, design UI/UX, automatisation, CRM et solutions sur mesure pour votre entreprise.",
    keywords: ["services", "développement web", "design", "ui/ux", "crm", "automatisation"],
    ogImage: "/og-services.jpg",
  },

  projects: {
    title: "Projets - Portfolio de Réalisations",
    description: "Explorez mes projets récents : sites web, applications, automatisations et solutions CRM pour clients variés.",
    keywords: ["projets", "portfolio", "réalisations", "case studies"],
    ogImage: "/og-projects.jpg",
  },

  blog: {
    title: "Blog - Articles & Tutoriels Web",
    description: "Articles techniques, tutoriels et conseils sur le développement web, design, freelancing et gestion de projets.",
    keywords: ["blog", "articles", "tutoriels", "web development", "conseils"],
    ogImage: "/og-blog.jpg",
  },

  "case-studies": {
    title: "Case Studies - Études de Cas Détaillées",
    description: "Découvrez mes études de cas approfondies avec résultats mesurables, processus et retours clients.",
    keywords: ["case studies", "études de cas", "résultats", "témoignages"],
    ogImage: "/og-case-studies.jpg",
  },

  about: {
    title: "À Propos - Qui suis-je ?",
    description: "Développeur freelance passionné, spécialisé en React, Node.js et solutions CRM. Découvrez mon parcours et mes valeurs.",
    keywords: ["à propos", "freelance", "développeur", "parcours", "compétences"],
    ogImage: "/og-about.jpg",
  },

  contact: {
    title: "Contact - Discutons de votre projet",
    description: "Prenez contact pour discuter de votre projet. Réponse garantie sous 24h. Formulaire, email, téléphone.",
    keywords: ["contact", "devis", "projet", "collaboration"],
    ogImage: "/og-contact.jpg",
  },

  booking: {
    title: "Réserver un Appel - Consultation Gratuite",
    description: "Réservez un créneau dans mon agenda pour un appel découverte de 30 minutes. Consultation gratuite et sans engagement.",
    keywords: ["réservation", "appel", "consultation", "rendez-vous"],
    ogImage: "/og-booking.jpg",
  },

  resources: {
    title: "Ressources Gratuites - Guides & Templates",
    description: "Téléchargez gratuitement mes guides, templates et ressources pour freelances et entrepreneurs web.",
    keywords: ["ressources", "guides", "templates", "gratuit", "téléchargement"],
    ogImage: "/og-resources.jpg",
  },

  faq: {
    title: "FAQ - Questions Fréquentes",
    description: "Trouvez les réponses à toutes vos questions sur mes services, processus, tarifs et délais.",
    keywords: ["faq", "questions", "réponses", "aide"],
    ogImage: "/og-faq.jpg",
  },

  testimonials: {
    title: "Témoignages - Avis Clients",
    description: "Découvrez ce que mes clients disent de mon travail. Témoignages authentiques et retours d'expérience.",
    keywords: ["témoignages", "avis", "clients", "reviews"],
    ogImage: "/og-testimonials.jpg",
  },

  dashboard: {
    title: "Dashboard CRM - Gestion Complète",
    description: "Tableau de bord CRM pour gérer vos leads, clients, projets, factures et campagnes.",
    keywords: ["dashboard", "crm", "gestion", "analytics"],
  },
};

/**
 * Génère les meta tags SEO pour une page donnée
 */
export function getPageSEO(pageName: string, customData?: Partial<PageSEO>): PageSEO {
  const baseSEO = pageSEO[pageName] || defaultSEO;
  
  if (customData) {
    return {
      ...baseSEO,
      ...customData,
      keywords: customData.keywords || baseSEO.keywords,
    };
  }
  
  return baseSEO;
}

/**
 * Génère le SEO pour un article de blog
 */
export function getBlogPostSEO(post: {
  title: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
  publishedAt?: string;
  updatedAt?: string;
  slug: string;
}): PageSEO & { publishedTime?: string; modifiedTime?: string; ogType: "article" } {
  return {
    title: `${post.title} - Blog`,
    description: post.excerpt,
    keywords: post.tags || ["blog", "article"],
    ogImage: post.coverImage || "/og-blog.jpg",
    canonical: `/blog/${post.slug}`,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    ogType: "article",
  };
}

/**
 * Génère le SEO pour un projet
 */
export function getProjectSEO(project: {
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  slug: string;
}): PageSEO {
  return {
    title: `${project.title} - Projet`,
    description: project.description,
    keywords: [...(project.tags || []), "projet", "réalisation"],
    ogImage: project.image || "/og-projects.jpg",
    canonical: `/projects/${project.slug}`,
  };
}

/**
 * Génère le SEO pour une case study
 */
export function getCaseStudySEO(caseStudy: {
  clientName: string;
  title: string;
  challenge: string;
  image?: string;
  id: string;
}): PageSEO {
  return {
    title: `${caseStudy.clientName} - Case Study`,
    description: `Découvrez comment j'ai aidé ${caseStudy.clientName} : ${caseStudy.challenge}`,
    keywords: ["case study", "étude de cas", caseStudy.clientName],
    ogImage: caseStudy.image || "/og-case-studies.jpg",
    canonical: `/case-studies/${caseStudy.id}`,
  };
}

/**
 * Génère une URL canonique complète
 */
export function getCanonicalURL(path: string): string {
  // À remplacer par votre domaine réel
  const domain = "https://votredomaine.com";
  return `${domain}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Génère l'URL d'une OG image complète
 */
export function getOGImageURL(imagePath: string): string {
  // À remplacer par votre domaine réel
  const domain = "https://votredomaine.com";
  
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  
  return `${domain}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
}
