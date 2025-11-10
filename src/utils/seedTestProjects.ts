/**
 * SEED TEST PROJECTS - Projets de Test Bilingues
 * 
 * Ce script génère des projets de test pour démontrer
 * l'intégration complète Supabase + Bilinguisme
 */

import * as unifiedService from "./unifiedDataService";

const TEST_PROJECTS: Array<Omit<unifiedService.BilingualProject, "id" | "createdAt" | "updatedAt">> = [
  {
    // Project 1: E-commerce Platform
    name_fr: "Plateforme E-commerce Moderne",
    name_en: "Modern E-commerce Platform",
    description_fr: "Développement d'une plateforme e-commerce complète avec gestion des stocks, paiement en ligne et tableau de bord analytique.",
    description_en: "Development of a complete e-commerce platform with inventory management, online payment and analytics dashboard.",
    tags_fr: ["E-commerce", "React", "Node.js", "Stripe", "PostgreSQL"],
    tags_en: ["E-commerce", "React", "Node.js", "Stripe", "PostgreSQL"],
    duration_fr: "4 mois",
    duration_en: "4 months",
    challenges_fr: "Intégration de multiples systèmes de paiement, optimisation des performances pour un catalogue de 10 000+ produits, et mise en place d'un système de recommandations personnalisées.",
    challenges_en: "Integration of multiple payment systems, performance optimization for a catalog of 10,000+ products, and implementation of a personalized recommendation system.",
    solutions_fr: "Utilisation de Redis pour le cache, mise en place d'un CDN pour les images, et algorithme de recommandation basé sur l'IA utilisant les données de navigation.",
    solutions_en: "Use of Redis for caching, CDN setup for images, and AI-based recommendation algorithm using browsing data.",
    results_fr: "Augmentation de 45% du taux de conversion, réduction de 60% du temps de chargement, et satisfaction client de 4.8/5.",
    results_en: "45% increase in conversion rate, 60% reduction in loading time, and customer satisfaction of 4.8/5.",
    category_fr: "web",
    category_en: "web",
    status: "completed",
    budget: 35000,
    spent: 32500,
    startDate: "2024-01-15",
    endDate: "2024-05-20",
    imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
    isPinned: true,
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Docker", "AWS"],
    projectUrl: "https://example-ecommerce.com",
    imageGallery: [
      "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=600&fit=crop"
    ],
    testimonial: {
      text: "Excellent travail ! La plateforme dépasse toutes nos attentes.",
      author: "Marie Dubois",
      role: "CEO, ShopTech"
    }
  },
  {
    // Project 2: Mobile App
    name_fr: "Application Mobile Fitness",
    name_en: "Fitness Mobile App",
    description_fr: "Application mobile iOS/Android pour le suivi d'entraînements avec coach virtuel IA et communauté intégrée.",
    description_en: "iOS/Android mobile app for workout tracking with AI virtual coach and integrated community.",
    tags_fr: ["Mobile", "React Native", "IA", "Fitness", "Santé"],
    tags_en: ["Mobile", "React Native", "AI", "Fitness", "Health"],
    duration_fr: "6 mois",
    duration_en: "6 months",
    challenges_fr: "Synchronisation offline/online des données d'entraînement, intégration avec Apple Health et Google Fit, et création d'un algorithme d'IA pour personnaliser les programmes.",
    challenges_en: "Offline/online synchronization of workout data, integration with Apple Health and Google Fit, and creation of an AI algorithm to personalize programs.",
    solutions_fr: "Architecture offline-first avec SQLite, API GraphQL pour la synchronisation, et modèle ML TensorFlow Lite pour les recommandations.",
    solutions_en: "Offline-first architecture with SQLite, GraphQL API for synchronization, and TensorFlow Lite ML model for recommendations.",
    results_fr: "50 000+ téléchargements en 3 mois, note de 4.7/5 sur les stores, et 80% de rétention à 30 jours.",
    results_en: "50,000+ downloads in 3 months, 4.7/5 rating on stores, and 80% retention at 30 days.",
    category_fr: "mobile",
    category_en: "mobile",
    status: "completed",
    budget: 48000,
    spent: 47200,
    startDate: "2023-08-01",
    endDate: "2024-02-01",
    imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=600&fit=crop",
    isPinned: true,
    technologies: ["React Native", "TypeScript", "GraphQL", "TensorFlow", "Firebase"],
    projectUrl: "https://apps.apple.com/app/fitness-app",
    imageGallery: [
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop"
    ],
    testimonial: {
      text: "L'app qui a révolutionné notre business model !",
      author: "Thomas Martin",
      role: "Fondateur, FitLife"
    }
  },
  {
    // Project 3: SaaS Dashboard
    name_fr: "Tableau de Bord SaaS Analytique",
    name_en: "SaaS Analytics Dashboard",
    description_fr: "Dashboard SaaS complet avec visualisations en temps réel, rapports personnalisés et intégrations multiples.",
    description_en: "Complete SaaS dashboard with real-time visualizations, custom reports and multiple integrations.",
    tags_fr: ["SaaS", "Analytics", "Dashboard", "React", "Data Viz"],
    tags_en: ["SaaS", "Analytics", "Dashboard", "React", "Data Viz"],
    duration_fr: "5 mois",
    duration_en: "5 months",
    challenges_fr: "Gestion de gros volumes de données en temps réel, création de visualisations interactives performantes, et architecture multi-tenant sécurisée.",
    challenges_en: "Handling large volumes of real-time data, creating performant interactive visualizations, and secure multi-tenant architecture.",
    solutions_fr: "Utilisation de WebSockets pour le temps réel, D3.js et Recharts pour les visualisations, et architecture microservices avec Kubernetes.",
    solutions_en: "Use of WebSockets for real-time, D3.js and Recharts for visualizations, and microservices architecture with Kubernetes.",
    results_fr: "Traitement de 10M+ d'événements par jour, 99.9% d'uptime, et ROI positif en 8 mois pour le client.",
    results_en: "Processing 10M+ events per day, 99.9% uptime, and positive ROI in 8 months for the client.",
    category_fr: "web",
    category_en: "web",
    status: "completed",
    budget: 62000,
    spent: 59800,
    startDate: "2023-06-01",
    endDate: "2023-11-15",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    isPinned: false,
    technologies: ["React", "TypeScript", "Node.js", "Kubernetes", "MongoDB", "Redis", "D3.js"],
    projectUrl: "https://analytics-dashboard.example.com",
    imageGallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
    ],
    testimonial: {
      text: "Un outil indispensable pour notre prise de décision data-driven.",
      author: "Sophie Laurent",
      role: "CTO, DataCorp"
    }
  },
  {
    // Project 4: Corporate Website
    name_fr: "Site Vitrine Corporate",
    name_en: "Corporate Website",
    description_fr: "Site vitrine multilingue avec CMS headless, optimisation SEO avancée et animations immersives.",
    description_en: "Multilingual corporate website with headless CMS, advanced SEO optimization and immersive animations.",
    tags_fr: ["Web Design", "CMS", "SEO", "Next.js", "Animations"],
    tags_en: ["Web Design", "CMS", "SEO", "Next.js", "Animations"],
    duration_fr: "3 mois",
    duration_en: "3 months",
    challenges_fr: "Performances élevées malgré les animations complexes, SEO international, et gestion de contenu multi-langue pour 5 marchés.",
    challenges_en: "High performance despite complex animations, international SEO, and multi-language content management for 5 markets.",
    solutions_fr: "Next.js avec SSG/ISR, Strapi comme CMS headless, Framer Motion pour les animations, et architecture CDN global.",
    solutions_en: "Next.js with SSG/ISR, Strapi as headless CMS, Framer Motion for animations, and global CDN architecture.",
    results_fr: "Score Lighthouse 95+, positionnement top 3 sur mots-clés stratégiques, et taux de rebond réduit de 35%.",
    results_en: "Lighthouse score 95+, top 3 ranking on strategic keywords, and 35% reduction in bounce rate.",
    category_fr: "design",
    category_en: "design",
    status: "completed",
    budget: 22000,
    spent: 21500,
    startDate: "2024-03-01",
    endDate: "2024-06-01",
    imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
    isPinned: false,
    technologies: ["Next.js", "React", "TypeScript", "Strapi", "Tailwind CSS"],
    projectUrl: "https://corporate-site.example.com",
    imageGallery: [
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop"
    ],
    testimonial: {
      text: "Un site qui reflète parfaitement notre image de marque premium.",
      author: "Jean Dupont",
      role: "Directeur Marketing"
    }
  },
  {
    // Project 5: API Platform
    name_fr: "Plateforme API RESTful",
    name_en: "RESTful API Platform",
    description_fr: "Infrastructure API complète avec documentation interactive, gestion des versions et monitoring avancé.",
    description_en: "Complete API infrastructure with interactive documentation, version management and advanced monitoring.",
    tags_fr: ["API", "Backend", "Microservices", "Documentation", "DevOps"],
    tags_en: ["API", "Backend", "Microservices", "Documentation", "DevOps"],
    duration_fr: "4 mois",
    duration_en: "4 months",
    challenges_fr: "Scalabilité pour 1000+ requêtes/seconde, versioning sans casser les clients existants, et sécurité enterprise-grade.",
    challenges_en: "Scalability for 1000+ requests/second, versioning without breaking existing clients, and enterprise-grade security.",
    solutions_fr: "Architecture microservices avec API Gateway, rate limiting avec Redis, OAuth2/JWT, et monitoring avec Prometheus + Grafana.",
    solutions_en: "Microservices architecture with API Gateway, rate limiting with Redis, OAuth2/JWT, and monitoring with Prometheus + Grafana.",
    results_fr: "99.99% SLA respecté, support de 5000+ requêtes/seconde, et adoption par 200+ clients en 6 mois.",
    results_en: "99.99% SLA met, support for 5000+ requests/second, and adoption by 200+ clients in 6 months.",
    category_fr: "consulting",
    category_en: "consulting",
    status: "in_progress",
    budget: 75000,
    spent: 52000,
    startDate: "2024-07-01",
    endDate: "2024-11-01",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
    isPinned: false,
    technologies: ["Node.js", "TypeScript", "Docker", "Kubernetes", "PostgreSQL", "Redis", "Prometheus"],
    imageGallery: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop"
    ]
  },
  {
    // Project 6: Design System
    name_fr: "Système de Design UI/UX",
    name_en: "UI/UX Design System",
    description_fr: "Création d'un design system complet avec composants React, guidelines et documentation Storybook.",
    description_en: "Creation of a complete design system with React components, guidelines and Storybook documentation.",
    tags_fr: ["Design System", "UI/UX", "React", "Storybook", "Figma"],
    tags_en: ["Design System", "UI/UX", "React", "Storybook", "Figma"],
    duration_fr: "3 mois",
    duration_en: "3 months",
    challenges_fr: "Cohérence entre 20+ produits existants, accessibilité WCAG 2.1 AA, et adoption par 50+ développeurs.",
    challenges_en: "Consistency across 20+ existing products, WCAG 2.1 AA accessibility, and adoption by 50+ developers.",
    solutions_fr: "Atomic design methodology, tokens de design avec Style Dictionary, et workshops de formation pour les équipes.",
    solutions_en: "Atomic design methodology, design tokens with Style Dictionary, and training workshops for teams.",
    results_fr: "Réduction de 40% du temps de développement UI, amélioration du score d'accessibilité à 95%, et adoption complète en 4 mois.",
    results_en: "40% reduction in UI development time, accessibility score improved to 95%, and full adoption in 4 months.",
    category_fr: "design",
    category_en: "design",
    status: "review",
    budget: 38000,
    spent: 35000,
    startDate: "2024-08-01",
    endDate: "2024-10-31",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    isPinned: true,
    technologies: ["React", "TypeScript", "Storybook", "Figma", "Style Dictionary"],
    projectUrl: "https://design-system.example.com",
    githubUrl: "https://github.com/example/design-system",
    imageGallery: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop"
    ]
  }
];

/**
 * Seed les projets de test dans Supabase
 * Nécessite un accessToken valide (admin)
 */
export async function seedTestProjects(accessToken: string): Promise<void> {
  console.log("🌱 Début du seeding des projets de test...");
  
  let successCount = 0;
  let errorCount = 0;

  for (const project of TEST_PROJECTS) {
    try {
      const created = await unifiedService.createProject(project, accessToken);
      console.log(`✅ Projet créé: ${created.name_fr}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Erreur création projet ${project.name_fr}:`, error);
      errorCount++;
    }
  }

  console.log(`\n📊 Résumé du seeding:`);
  console.log(`   ✅ Succès: ${successCount}/${TEST_PROJECTS.length}`);
  console.log(`   ❌ Erreurs: ${errorCount}/${TEST_PROJECTS.length}`);
}

/**
 * Supprime tous les projets de test
 * Nécessite un accessToken valide (admin)
 */
export async function clearTestProjects(accessToken: string): Promise<void> {
  console.log("🗑️ Suppression des projets de test...");
  
  try {
    const projects = await unifiedService.fetchProjects();
    
    for (const project of projects) {
      try {
        await unifiedService.deleteProject(project.id, accessToken);
        console.log(`✅ Projet supprimé: ${project.name_fr}`);
      } catch (error) {
        console.error(`❌ Erreur suppression projet ${project.id}:`, error);
      }
    }
    
    console.log("✅ Tous les projets ont été supprimés");
  } catch (error) {
    console.error("❌ Erreur lors de la suppression:", error);
  }
}

export { TEST_PROJECTS };
