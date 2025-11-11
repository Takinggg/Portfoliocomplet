/**
 * Local Data Storage - Fallback local pour toutes les données
 * Fournit des données de démonstration quand le serveur n'est pas disponible
 */

// ==================== CASE STUDIES ====================

export interface LocalCaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  client: string;
  category: string;
  tags: string[];
  thumbnail: string;
  images?: string[];
  challenge: string;
  solution: string;
  results: string[];
  metrics?: Array<{ label: string; value: string }>;
  testimonial?: {
    content: string;
    author: string;
    role: string;
  };
  duration?: string;
  technologies?: string[];
  link?: string;
  featured?: boolean;
  createdAt: string;
}

const demoCaseStudies: LocalCaseStudy[] = [
  {
    id: "case-1",
    slug: "ecommerce-fashion-store",
    title: "E-commerce Fashion Store",
    subtitle: "Plateforme complète de vente en ligne",
    client: "Fashion Brand Co.",
    category: "E-commerce",
    tags: ["React", "Node.js", "Stripe", "PWA"],
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    ],
    challenge: "Créer une expérience d'achat fluide avec performances optimales.",
    solution: "Architecture PWA avec React, paiements Stripe intégrés, et système de gestion de stock en temps réel.",
    results: [
      "Augmentation de 150% des ventes en ligne",
      "Temps de chargement réduit de 60%",
      "Taux de conversion amélioré de 45%",
    ],
    metrics: [
      { label: "Ventes", value: "+150%" },
      { label: "Performance", value: "95/100" },
      { label: "Conversion", value: "+45%" },
    ],
    testimonial: {
      content: "Une solution e-commerce moderne qui a transformé notre activité.",
      author: "Marie Dubois",
      role: "CEO, Fashion Brand Co.",
    },
    duration: "3 mois",
    technologies: ["React", "Node.js", "MongoDB", "Stripe API", "PWA"],
    featured: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "case-2",
    slug: "saas-project-management",
    title: "SaaS Project Management",
    subtitle: "Outil de gestion de projets collaboratif",
    client: "TechStart Inc.",
    category: "SaaS",
    tags: ["Vue.js", "Python", "PostgreSQL", "WebSocket"],
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    challenge: "Développer un outil collaboratif temps réel pour équipes distribuées.",
    solution: "Application SaaS avec synchronisation temps réel, tableaux Kanban, et intégrations multiples.",
    results: [
      "2000+ utilisateurs actifs en 6 mois",
      "Taux de satisfaction de 92%",
      "0.1% de downtime",
    ],
    metrics: [
      { label: "Utilisateurs", value: "2000+" },
      { label: "Satisfaction", value: "92%" },
      { label: "Uptime", value: "99.9%" },
    ],
    duration: "4 mois",
    technologies: ["Vue.js", "Python/Flask", "PostgreSQL", "WebSocket"],
    featured: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "case-3",
    slug: "mobile-fitness-app",
    title: "Mobile Fitness App",
    subtitle: "Application de coaching sportif personnalisé",
    client: "FitLife Studio",
    category: "Mobile",
    tags: ["React Native", "Firebase", "AI/ML"],
    thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    challenge: "Créer une app mobile engageante avec suivi personnalisé.",
    solution: "Application React Native avec algorithmes de recommandation, tracking GPS, et gamification.",
    results: [
      "50 000+ téléchargements",
      "4.8/5 étoiles sur les stores",
      "80% de rétention à 30 jours",
    ],
    metrics: [
      { label: "Téléchargements", value: "50K+" },
      { label: "Note", value: "4.8/5" },
      { label: "Rétention", value: "80%" },
    ],
    duration: "5 mois",
    technologies: ["React Native", "Firebase", "TensorFlow", "Maps API"],
    featured: false,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function getLocalCaseStudies(): LocalCaseStudy[] {
  const stored = localStorage.getItem("local_case_studies");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Si les données existent et ne sont pas vides, les retourner
      if (parsed && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn("Erreur parsing case studies locales, retour tableau vide");
    }
  }
  // Retourner un tableau vide par défaut (plus de données de démo obsolètes)
  console.log("📭 Aucune case study dans localStorage - utilisez le bouton 'Initialiser'");
  return [];
}

export function saveLocalCaseStudies(caseStudies: LocalCaseStudy[]): void {
  localStorage.setItem("local_case_studies", JSON.stringify(caseStudies));
}

export function getLocalCaseStudyBySlug(slug: string): LocalCaseStudy | null {
  const caseStudies = getLocalCaseStudies();
  return caseStudies.find((cs) => cs.slug === slug) || null;
}

export function seedLocalCaseStudies(): void {
  console.warn("⚠️ seedLocalCaseStudies() est obsolète - utilisez initBilingualCaseStudies() à la place");
  console.log("📍 Pour charger les case studies bilingues, tapez: initBilingualCaseStudies()");
}

// ==================== FAQ ====================

export interface LocalFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order?: number;
  popular?: boolean;
}

const demoFAQs: LocalFAQ[] = [
  {
    id: "faq-1",
    question: "Quels sont vos tarifs ?",
    answer: "Mes tarifs varient selon la complexité du projet. Un site vitrine commence à partir de 1500€, une application web à partir de 5000€. Je propose toujours un devis gratuit personnalisé.",
    category: "Tarifs",
    order: 1,
    popular: true,
  },
  {
    id: "faq-2",
    question: "Quel est le délai de réalisation ?",
    answer: "Le délai dépend de l'envergure du projet. Un site vitrine prend généralement 2-3 semaines, une application web 2-3 mois. Je fournis toujours un planning détaillé.",
    category: "Délais",
    order: 2,
    popular: true,
  },
  {
    id: "faq-3",
    question: "Proposez-vous la maintenance ?",
    answer: "Oui, je propose des contrats de maintenance mensuelle incluant mises à jour, sauvegardes, et support technique. C'est optionnel mais fortement recommandé.",
    category: "Services",
    order: 3,
    popular: true,
  },
  {
    id: "faq-4",
    question: "Travaillez-vous à distance ?",
    answer: "Oui, je travaille principalement à distance mais je peux me déplacer pour les réunions importantes si vous êtes dans ma région.",
    category: "Pratique",
    order: 4,
    popular: false,
  },
  {
    id: "faq-5",
    question: "Quelles technologies utilisez-vous ?",
    answer: "Je travaille principalement avec React, TypeScript, Node.js, et des bases de données modernes. Je choisis toujours la stack la plus adaptée à vos besoins.",
    category: "Technique",
    order: 5,
    popular: false,
  },
];

export function getLocalFAQs(): LocalFAQ[] {
  const stored = localStorage.getItem("local_faqs");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn("Erreur parsing FAQs locales, utilisation des données de démo");
    }
  }
  return demoFAQs;
}

export function saveLocalFAQs(faqs: LocalFAQ[]): void {
  localStorage.setItem("local_faqs", JSON.stringify(faqs));
}

export function seedLocalFAQs(): void {
  saveLocalFAQs(demoFAQs);
}

// ==================== RESOURCES ====================

export interface LocalResource {
  id: string;
  title: string;
  description: string;
  category: "templates" | "guides" | "checklists" | "tools";
  fileUrl: string;
  coverImage?: string;
  tags: string[];
  isPublished: boolean;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

const demoResources: LocalResource[] = [
  {
    id: "res-1",
    title: "Guide de Tarification Freelance",
    description: "Guide complet pour fixer vos tarifs et optimiser votre rentabilité en freelance.",
    category: "guides",
    fileUrl: "/resources/guide-tarification-freelance.html",
    coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
    tags: ["freelance", "tarification", "business"],
    isPublished: true,
    downloads: 234,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "res-2",
    title: "Guide du Cahier des Charges",
    description: "Tout ce qu'il faut savoir pour rédiger un cahier des charges efficace.",
    category: "guides",
    fileUrl: "/resources/guide-cahier-des-charges.html",
    coverImage: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80",
    tags: ["projet", "cahier des charges", "documentation"],
    isPublished: true,
    downloads: 189,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "res-3",
    title: "Checklist de Lancement de Site",
    description: "Liste complète des vérifications avant de lancer votre site web.",
    category: "checklists",
    fileUrl: "/resources/checklist-lancement-site.html",
    coverImage: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
    tags: ["lancement", "checklist", "SEO"],
    isPublished: true,
    downloads: 167,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function getLocalResources(): LocalResource[] {
  const stored = localStorage.getItem("local_resources");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn("Erreur parsing resources locales, utilisation des données de démo");
    }
  }
  return demoResources;
}

export function saveLocalResources(resources: LocalResource[]): void {
  localStorage.setItem("local_resources", JSON.stringify(resources));
}

export function getLocalResourceBySlug(slug: string): LocalResource | null {
  const resources = getLocalResources();
  // Le slug peut être l'id pour la compatibilité
  return resources.find((r) => r.id === slug) || null;
}

export function seedLocalResources(): void {
  saveLocalResources(demoResources);
}

// ==================== DASHBOARD DATA ====================

export interface LocalDashboardData {
  leads: Array<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
    status: "new" | "contacted" | "qualified" | "converted" | "lost";
    source: string;
    createdAt: string;
  }>;
  clients?: Array<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    status?: "active" | "inactive";
    createdAt: string;
  }>;
  bookings?: Array<{
    id: string;
    name: string;
    email: string;
    date: string;
    time: string;
    serviceType: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    createdAt: string;
  }>;
  stats?: {
    totalLeads: number;
    newLeads: number;
    conversionRate: number;
    totalRevenue: number;
  };
}

const demoDashboardData: LocalDashboardData = {
  leads: [
    {
      id: "lead-1",
      name: "Sophie Martin",
      email: "sophie.martin@example.com",
      phone: "06 12 34 56 78",
      company: "TechCorp",
      message: "Besoin d'un site e-commerce",
      status: "new",
      source: "Website",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "lead-2",
      name: "Thomas Dubois",
      email: "thomas.dubois@example.com",
      company: "StartupX",
      message: "Refonte application web",
      status: "contacted",
      source: "LinkedIn",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  stats: {
    totalLeads: 24,
    newLeads: 3,
    conversionRate: 35,
    totalRevenue: 45000,
  },
};

export function getLocalDashboardData(): LocalDashboardData {
  const stored = localStorage.getItem("local_dashboard_data");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn("Erreur parsing dashboard data, utilisation des données de démo");
    }
  }
  return demoDashboardData;
}

export function saveLocalDashboardData(data: LocalDashboardData): void {
  localStorage.setItem("local_dashboard_data", JSON.stringify(data));
}

export function seedLocalDashboardData(): void {
  saveLocalDashboardData(demoDashboardData);
}

// ==================== SUBSCRIBERS ====================

export interface LocalSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: "active" | "unsubscribed";
  subscribedAt: string;
  tags?: string[];
}

const demoSubscribers: LocalSubscriber[] = [
  {
    id: "sub-1",
    email: "marie.dupont@example.com",
    firstName: "Marie",
    lastName: "Dupont",
    status: "active",
    subscribedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["newsletter"],
  },
  {
    id: "sub-2",
    email: "pierre.martin@example.com",
    firstName: "Pierre",
    lastName: "Martin",
    status: "active",
    subscribedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["newsletter", "blog"],
  },
];

export function getLocalSubscribers(): LocalSubscriber[] {
  const stored = localStorage.getItem("local_subscribers");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn("Erreur parsing subscribers locaux, utilisation des données de démo");
    }
  }
  return demoSubscribers;
}

export function saveLocalSubscribers(subscribers: LocalSubscriber[]): void {
  localStorage.setItem("local_subscribers", JSON.stringify(subscribers));
}

export function seedLocalSubscribers(): void {
  saveLocalSubscribers(demoSubscribers);
}

// ==================== UTILITY ====================

export function isLocalMode(): boolean {
  return !navigator.onLine || localStorage.getItem("force_local_mode") === "true";
}

export function seedAllLocalData(): void {
  console.log("🌱 Initialisation de toutes les données locales...");
  seedLocalCaseStudies();
  seedLocalFAQs();
  seedLocalResources();
  seedLocalDashboardData();
  seedLocalSubscribers();
  console.log("✅ Toutes les données locales initialisées !");
}
