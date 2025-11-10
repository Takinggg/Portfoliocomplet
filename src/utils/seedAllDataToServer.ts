/**
 * Seed ALL Data to Supabase Server
 * Crée toutes les données professionnelles dans la base Supabase
 */

import { projectId, publicAnonKey } from "./supabase/info";

const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${publicAnonKey}`,
};

// ============================================================================
// PROJECTS
// ============================================================================

const projects = [
  {
    id: "project_ecommerce_luxe",
    title: "E-commerce Luxe Premium",
    slug: "ecommerce-luxe-premium",
    shortDescription: "Plateforme e-commerce haut de gamme avec expérience utilisateur exceptionnelle",
    description: "Création d'une boutique en ligne complète pour une marque de luxe internationale. Système de panier intelligent, paiements sécurisés Stripe, gestion des stocks en temps réel, et recommandations personnalisées par IA.",
    category: "E-commerce",
    technologies: ["React", "Next.js 14", "Stripe", "Tailwind CSS", "PostgreSQL"],
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=90",
    featured: true,
    pinned: true,
    status: "completed",
    client: "Boutique Élégance Paris",
    duration: "3 mois",
    year: 2024,
    metrics: {
      performance: "+150%",
      conversion: "+85%",
      satisfaction: "98%"
    }
  },
  {
    id: "project_saas_mobile",
    title: "Application SaaS Mobile",
    slug: "application-saas-mobile",
    shortDescription: "Application mobile de gestion de projets pour équipes distribuées",
    description: "Développement d'une application mobile SaaS complète permettant aux équipes de collaborer en temps réel avec tableaux Kanban, chat intégré, vidéoconférence, et notifications push intelligentes.",
    category: "Application Mobile",
    technologies: ["React Native", "Firebase", "Node.js", "MongoDB", "WebRTC"],
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=90",
    featured: true,
    pinned: true,
    status: "completed",
    client: "TeamFlow Solutions",
    duration: "4 mois",
    year: 2024,
    metrics: {
      users: "10k+",
      rating: "4.8/5",
      retention: "92%"
    }
  },
  {
    id: "project_dashboard_ia",
    title: "Dashboard Analytics IA",
    slug: "dashboard-analytics-ia",
    shortDescription: "Interface d'analyse de données avec insights générés par intelligence artificielle",
    description: "Création d'un dashboard analytics avancé intégrant l'IA pour générer des insights automatiques, prédictions de tendances, et recommandations basées sur les données métier en temps réel.",
    category: "Dashboard & BI",
    technologies: ["React", "TypeScript", "Python", "TensorFlow", "D3.js", "Redis"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=90",
    featured: true,
    pinned: true,
    status: "completed",
    client: "DataCorp Analytics",
    duration: "5 mois",
    year: 2024,
    metrics: {
      accuracy: "96%",
      timeSaved: "-70%",
      insights: "500+/jour"
    }
  }
];

// ============================================================================
// BLOG POSTS
// ============================================================================

const blogPosts = [
  {
    slug: "tendances-web-design-2024",
    title: "Les Tendances Web Design Incontournables en 2024",
    excerpt: "Découvrez les nouvelles tendances qui façonnent le design web moderne : minimalisme, animations micro-interactions, et accessibilité.",
    content: `# Les Tendances Web Design Incontournables en 2024

Le design web évolue constamment. Voici les tendances majeures de 2024 :

## 1. Minimalisme & Espaces Blancs

Le design épuré reste roi. Les interfaces modernes privilégient les espaces blancs pour améliorer la lisibilité.

## 2. Animations Micro-Interactions

Les animations subtiles améliorent l'expérience utilisateur sans surcharger l'interface.

## 3. Mode Sombre par Défaut

De plus en plus de sites offrent le mode sombre nativement pour réduire la fatigue oculaire.

## 4. Accessibilité d'Abord

L'accessibilité n'est plus une option mais une nécessité. WCAG 2.1 AA devient le standard.`,
    category: "Design",
    tags: ["design", "ux", "tendances", "2024"],
    author: "Maxence",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=90",
    readTime: 8,
    published: true,
    featured: true,
    views: 1250,
    likes: 89,
    language: "fr"
  },
  {
    slug: "optimiser-performances-react",
    title: "Guide Complet : Optimiser les Performances React",
    excerpt: "Techniques avancées pour accélérer vos applications React : code splitting, lazy loading, memoization et plus.",
    content: `# Guide Complet : Optimiser les Performances React

Optimiser React est essentiel pour des apps rapides et performantes.

## Code Splitting avec React.lazy()

\`\`\`javascript
const Dashboard = React.lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}
\`\`\`

## Memoization avec useMemo et useCallback

Évitez les re-renders inutiles :

\`\`\`javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
\`\`\`

## Virtualisation pour Grandes Listes

Utilisez react-window pour les longues listes.`,
    category: "Développement",
    tags: ["react", "performance", "optimization", "javascript"],
    author: "Maxence",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=90",
    readTime: 12,
    published: true,
    featured: true,
    views: 2340,
    likes: 156,
    language: "fr"
  },
  {
    slug: "freelance-tarification-guide",
    title: "Freelance : Comment Fixer Ses Tarifs en 2024",
    excerpt: "Guide complet pour définir vos tarifs freelance : calcul du TJM, positionnement, et négociation avec les clients.",
    content: `# Freelance : Comment Fixer Ses Tarifs en 2024

Fixer ses tarifs est un challenge pour tout freelance.

## Calcul du Taux Journalier Moyen (TJM)

Formule simple :

**TJM = (Salaire annuel souhaité + Charges) / Nombre de jours travaillés**

Exemple : (60 000€ + 20 000€) / 200 jours = **400€/jour**

## Facteurs à Considérer

- Votre expérience (junior, senior, expert)
- La complexité du projet
- Les délais
- Votre spécialisation
- Le marché local

## Positionnement Stratégique

Ne vous bradez pas ! Un tarif trop bas signale un manque d'expertise.`,
    category: "Business",
    tags: ["freelance", "tarifs", "business", "tjm"],
    author: "Maxence",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=90",
    readTime: 10,
    published: true,
    featured: false,
    views: 890,
    likes: 67,
    language: "fr"
  }
];

// ============================================================================
// CASE STUDIES
// ============================================================================

const caseStudies = [
  {
    id: "cs_ecommerce_luxury",
    title: "Refonte Complète E-commerce Luxe",
    client: "Maison Élégance",
    industry: "Mode & Luxe",
    challenge: "Un site e-commerce vieillissant avec taux de conversion faible (0.8%) et expérience mobile médiocre.",
    solution: "Refonte complète avec Next.js 14, design premium, optimisation mobile-first, et intégration Stripe pour paiements simplifiés.",
    results: {
      conversionRate: "+185%",
      mobileTraffic: "+230%",
      averageOrderValue: "+45%",
      pageSpeed: "Score 95/100"
    },
    technologies: ["Next.js", "TypeScript", "Stripe", "Tailwind", "Vercel"],
    duration: "3 mois",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=90",
    testimonial: {
      text: "Notre chiffre d'affaires en ligne a doublé en 6 mois. L'équipe a été exceptionnelle.",
      author: "Sophie Laurent",
      role: "CEO, Maison Élégance"
    },
    featured: true
  },
  {
    id: "cs_saas_platform",
    title: "Plateforme SaaS de Gestion de Projets",
    client: "TeamFlow",
    industry: "SaaS & Productivité",
    challenge: "Créer une plateforme collaborative from scratch pour concurrencer Asana et Monday.",
    solution: "Architecture scalable avec React + Node.js, système de temps réel avec WebSockets, et UX ultra-intuitive.",
    results: {
      users: "10 000+ utilisateurs",
      retention: "92% rétention",
      satisfaction: "4.8/5 étoiles",
      funding: "Series A levée"
    },
    technologies: ["React", "Node.js", "Socket.io", "PostgreSQL", "AWS"],
    duration: "6 mois",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=90",
    testimonial: {
      text: "Cette plateforme a transformé notre startup. Nous avons levé 2M€ grâce à ce produit.",
      author: "Marc Dubois",
      role: "Founder, TeamFlow"
    },
    featured: true
  },
  {
    id: "cs_analytics_dashboard",
    title: "Dashboard Analytics Temps Réel avec IA",
    client: "DataCorp",
    industry: "Analytics & BI",
    challenge: "Analyser 500K+ événements/jour et générer des insights automatiques pour les équipes marketing.",
    solution: "Dashboard React avec backend Python/TensorFlow, visualisations D3.js, et modèles ML pour prédictions.",
    results: {
      dataProcessed: "500K+ events/day",
      accuracy: "96% précision ML",
      timeSaved: "-70% temps d'analyse",
      roi: "300% ROI en 1 an"
    },
    technologies: ["React", "Python", "TensorFlow", "D3.js", "Redis", "PostgreSQL"],
    duration: "5 mois",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=90",
    testimonial: {
      text: "L'IA génère des insights que nous n'aurions jamais détectés manuellement. Révolutionnaire.",
      author: "Julie Martin",
      role: "CMO, DataCorp"
    },
    featured: true
  }
];

// ============================================================================
// FAQ
// ============================================================================

const faqs = [
  {
    id: "faq_services",
    category: "Services",
    question: "Quels types de projets acceptez-vous ?",
    answer: "J'accepte principalement des projets de développement web (sites vitrine, e-commerce, applications web), d'applications mobiles (React Native), et de dashboards analytics. Je privilégie les projets avec un budget minimum de 5000€ et une durée de 1 mois minimum.",
    order: 1,
    language: "fr"
  },
  {
    id: "faq_tarifs",
    category: "Tarifs",
    question: "Quels sont vos tarifs ?",
    answer: "Mon TJM (Taux Journalier Moyen) est de 500€/jour pour les projets standards. Pour les projets au forfait, je fournis un devis détaillé après analyse du cahier des charges. Les projets complexes ou urgents peuvent avoir un tarif majoré de 20-30%.",
    order: 2,
    language: "fr"
  },
  {
    id: "faq_delais",
    category: "Process",
    question: "Quels sont les délais moyens ?",
    answer: "Les délais dépendent de la complexité : site vitrine (2-3 semaines), e-commerce (4-8 semaines), application web complexe (8-16 semaines). Je fournis toujours un planning détaillé avec jalons et deadlines claires avant de commencer.",
    order: 3,
    language: "fr"
  },
  {
    id: "faq_process",
    category: "Process",
    question: "Comment se déroule un projet type ?",
    answer: "1) Brief et cahier des charges (1 semaine), 2) Design et validation (1-2 semaines), 3) Développement avec points hebdomadaires (4-12 semaines), 4) Tests et ajustements (1 semaine), 5) Formation et livraison (1 semaine). Vous êtes impliqué à chaque étape.",
    order: 4,
    language: "fr"
  },
  {
    id: "faq_technologies",
    category: "Technique",
    question: "Quelles technologies utilisez-vous ?",
    answer: "Je suis spécialisé en React/Next.js pour le frontend, Node.js/Python pour le backend, et PostgreSQL/MongoDB pour les bases de données. J'utilise aussi Tailwind CSS, TypeScript, et les meilleures pratiques modernes (CI/CD, tests automatisés, etc.).",
    order: 5,
    language: "fr"
  },
  {
    id: "faq_maintenance",
    category: "Maintenance",
    question: "Proposez-vous de la maintenance ?",
    answer: "Oui ! Je propose des contrats de maintenance mensuels incluant : corrections de bugs, mises à jour de sécurité, optimisations, et évolutions mineures. Les tarifs démarrent à 300€/mois selon les besoins.",
    order: 6,
    language: "fr"
  },
  {
    id: "faq_paiement",
    category: "Tarifs",
    question: "Quelles sont les modalités de paiement ?",
    answer: "Pour les projets au forfait : 30% à la signature, 40% à mi-parcours, 30% à la livraison. Pour les missions en régie (TJM) : facturation mensuelle à 30 jours. Paiement par virement bancaire ou Stripe.",
    order: 7,
    language: "fr"
  },
  {
    id: "faq_garantie",
    category: "Services",
    question: "Y a-t-il une garantie ?",
    answer: "Oui, tous mes projets incluent une garantie de 3 mois couvrant les bugs et dysfonctionnements. Au-delà, un contrat de maintenance peut prendre le relais. Je m'engage sur la qualité et la pérennité du code livré.",
    order: 8,
    language: "fr"
  }
];

// ============================================================================
// TESTIMONIALS
// ============================================================================

const testimonials = [
  {
    id: "testimonial_sophie",
    name: "Sophie Laurent",
    role: "CEO",
    company: "Maison Élégance",
    text: "Maxence a transformé notre boutique en ligne. Les ventes ont doublé en 6 mois et nos clients adorent la nouvelle expérience. Un vrai professionnel !",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    featured: true,
    language: "fr"
  },
  {
    id: "testimonial_marc",
    name: "Marc Dubois",
    role: "Founder",
    company: "TeamFlow",
    text: "La plateforme développée par Maxence nous a permis de lever 2M€. Son expertise technique et sa compréhension du business sont exceptionnelles.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    featured: true,
    language: "fr"
  },
  {
    id: "testimonial_julie",
    name: "Julie Martin",
    role: "CMO",
    company: "DataCorp",
    text: "Le dashboard analytics avec IA a révolutionné notre façon de travailler. Nous gagnons 70% de temps sur l'analyse des données. Incroyable !",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    featured: true,
    language: "fr"
  },
  {
    id: "testimonial_thomas",
    name: "Thomas Bernard",
    role: "CTO",
    company: "InnovateTech",
    text: "Code propre, documentation complète, et respect des délais. Maxence est le freelance le plus professionnel avec qui j'ai travaillé.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    featured: false,
    language: "fr"
  },
  {
    id: "testimonial_emma",
    name: "Emma Rousseau",
    role: "Marketing Director",
    company: "GrowthCo",
    text: "Notre site génère maintenant 5x plus de leads qualifiés. L'optimisation SEO et les landing pages sont parfaites. Merci Maxence !",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    featured: false,
    language: "fr"
  }
];

// ============================================================================
// RESOURCES
// ============================================================================

const resources = [
  {
    id: "resource_cahier_charges",
    title: "Guide Complet : Rédiger un Cahier des Charges",
    slug: "guide-cahier-des-charges",
    description: "Template et guide pour créer un cahier des charges professionnel pour votre projet web",
    category: "Templates",
    type: "pdf",
    downloadUrl: "/resources/guide-cahier-des-charges.html",
    coverImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
    downloads: 1245,
    featured: true,
    language: "fr"
  },
  {
    id: "resource_tarifs_freelance",
    title: "Calculateur de TJM Freelance",
    slug: "calculateur-tjm-freelance",
    description: "Outil Excel pour calculer votre Taux Journalier Moyen selon vos objectifs financiers",
    category: "Outils",
    type: "xlsx",
    downloadUrl: "/resources/guide-tarification-freelance.html",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    downloads: 892,
    featured: true,
    language: "fr"
  },
  {
    id: "resource_checklist_lancement",
    title: "Checklist de Lancement de Site Web",
    slug: "checklist-lancement-site",
    description: "Liste complète de vérifications avant de lancer votre site en production",
    category: "Checklists",
    type: "pdf",
    downloadUrl: "/resources/checklist-lancement-site.html",
    coverImage: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
    downloads: 756,
    featured: true,
    language: "fr"
  }
];

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedData() {
  console.log("🌱 SEEDING ALL DATA TO SUPABASE...\n");
  let successCount = 0;
  let errorCount = 0;

  // PROJECTS
  console.log("📁 Seeding Projects...");
  for (const project of projects) {
    try {
      const res = await fetch(`${serverUrl}/projects`, {
        method: "POST",
        headers,
        body: JSON.stringify(project),
      });
      if (res.ok) {
        successCount++;
        console.log(`  ✅ ${project.title}`);
      } else {
        errorCount++;
        console.log(`  ❌ ${project.title} - ${await res.text()}`);
      }
    } catch (error: any) {
      errorCount++;
      console.log(`  ❌ ${project.title} - ${error.message}`);
    }
  }

  // BLOG POSTS
  console.log("\n📝 Seeding Blog Posts...");
  for (const post of blogPosts) {
    try {
      const res = await fetch(`${serverUrl}/blog`, {
        method: "POST",
        headers,
        body: JSON.stringify(post),
      });
      if (res.ok) {
        successCount++;
        console.log(`  ✅ ${post.title}`);
      } else {
        errorCount++;
        console.log(`  ❌ ${post.title}`);
      }
    } catch (error: any) {
      errorCount++;
      console.log(`  ❌ ${post.title} - ${error.message}`);
    }
  }

  // CASE STUDIES
  console.log("\n📊 Seeding Case Studies...");
  for (const cs of caseStudies) {
    try {
      const res = await fetch(`${serverUrl}/case-studies`, {
        method: "POST",
        headers,
        body: JSON.stringify(cs),
      });
      if (res.ok) {
        successCount++;
        console.log(`  ✅ ${cs.title}`);
      } else {
        errorCount++;
        console.log(`  ❌ ${cs.title}`);
      }
    } catch (error: any) {
      errorCount++;
      console.log(`  ❌ ${cs.title} - ${error.message}`);
    }
  }

  // FAQ
  console.log("\n❓ Seeding FAQ...");
  for (const faq of faqs) {
    try {
      const res = await fetch(`${serverUrl}/faq`, {
        method: "POST",
        headers,
        body: JSON.stringify(faq),
      });
      if (res.ok) {
        successCount++;
        console.log(`  ✅ ${faq.question}`);
      } else {
        errorCount++;
        console.log(`  ❌ ${faq.question}`);
      }
    } catch (error: any) {
      errorCount++;
      console.log(`  ❌ ${faq.question} - ${error.message}`);
    }
  }

  // TESTIMONIALS
  console.log("\n⭐ Seeding Testimonials...");
  for (const testimonial of testimonials) {
    try {
      const res = await fetch(`${serverUrl}/testimonials`, {
        method: "POST",
        headers,
        body: JSON.stringify(testimonial),
      });
      if (res.ok) {
        successCount++;
        console.log(`  ✅ ${testimonial.name}`);
      } else {
        errorCount++;
        console.log(`  ❌ ${testimonial.name}`);
      }
    } catch (error: any) {
      errorCount++;
      console.log(`  ❌ ${testimonial.name} - ${error.message}`);
    }
  }

  // RESOURCES
  console.log("\n📚 Seeding Resources...");
  for (const resource of resources) {
    try {
      const res = await fetch(`${serverUrl}/resources`, {
        method: "POST",
        headers,
        body: JSON.stringify(resource),
      });
      if (res.ok) {
        successCount++;
        console.log(`  ✅ ${resource.title}`);
      } else {
        errorCount++;
        console.log(`  ❌ ${resource.title}`);
      }
    } catch (error: any) {
      errorCount++;
      console.log(`  ❌ ${resource.title} - ${error.message}`);
    }
  }

  console.log(`\n✅ SUCCESS: ${successCount} items created`);
  console.log(`❌ ERRORS: ${errorCount} items failed`);
  console.log("\n🎉 SEEDING COMPLETE!");
  
  return { success: successCount, errors: errorCount };
}

// Export for use in components
export { seedData };

// Auto-run if called directly
if (typeof window !== "undefined") {
  (window as any).seedAllData = seedData;
  console.log("💡 Run seedAllData() to populate Supabase with all data");
}
