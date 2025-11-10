import { CaseStudy } from './freelanceConfig';

// Études de cas détaillées
export const caseStudies: CaseStudy[] = [
  {
    id: "plateforme-ecommerce-luxe",
    title: "Refonte complète d'une plateforme e-commerce luxe",
    client: "Maison Beaumont",
    category: "E-commerce",
    year: "2024",
    featured: true,
    thumbnail: "luxury ecommerce",
    tagline: "Transformation digitale d'une maison de luxe centenaire",
    description: "Refonte complète de l'expérience e-commerce avec focus sur la performance et l'expérience utilisateur premium.",
    tags: ["React", "Next.js", "Shopify", "Performance", "UX/UI"],
    
    challenge: {
      title: "Un site obsolète qui freinait la croissance",
      description: "La plateforme e-commerce existante datait de 2015, souffrait de problèmes de performance majeurs et ne reflétait pas le positionnement premium de la marque. Le taux de conversion stagnait à 0.8% et le taux d'abandon panier atteignait 78%.",
      painPoints: [
        "Temps de chargement > 8 secondes sur mobile",
        "Taux de conversion de 0.8% (bien en-dessous de la moyenne du secteur)",
        "Design obsolète ne reflétant pas l'image premium",
        "Processus de checkout complexe avec 6 étapes",
        "Aucune personnalisation de l'expérience utilisateur",
        "Backend difficile à maintenir et à faire évoluer"
      ]
    },
    
    solution: {
      title: "Une refonte complète axée performance et conversion",
      description: "Nous avons repensé l'ensemble de l'expérience utilisateur en mettant l'accent sur la performance, la simplicité et l'élégance. L'architecture technique a été modernisée avec Next.js pour garantir des temps de chargement ultra-rapides.",
      approach: [
        "Audit UX/UI complet et benchmark concurrentiel",
        "Refonte du design system avec composants réutilisables",
        "Migration vers Next.js avec SSR et ISR pour la performance",
        "Simplification du tunnel de conversion (de 6 à 2 étapes)",
        "Implémentation d'un système de personnalisation IA",
        "Optimisation SEO technique et sémantique",
        "Tests A/B continus sur les points de friction"
      ],
      technologies: ["Next.js 14", "React", "TypeScript", "Shopify API", "Tailwind CSS", "Vercel", "Analytics"]
    },
    
    results: {
      title: "Des résultats mesurables dès le premier mois",
      description: "La nouvelle plateforme a dépassé tous les objectifs fixés, avec une amélioration spectaculaire des KPIs business et techniques.",
      metrics: [
        { label: "Taux de conversion", value: "3.2%", change: "+300%", positive: true },
        { label: "Temps de chargement", value: "1.2s", change: "-85%", positive: true },
        { label: "Revenus mensuels", value: "+420K€", change: "+215%", positive: true },
        { label: "Taux d'abandon panier", value: "32%", change: "-59%", positive: true },
        { label: "Score Performance", value: "98/100", change: "+75pts", positive: true },
        { label: "Panier moyen", value: "340€", change: "+48%", positive: true }
      ]
    },
    
    testimonial: {
      quote: "Maxence a transformé notre présence digitale. Non seulement le site est magnifique, mais les résultats business ont dépassé toutes nos attentes. Notre CA en ligne a plus que doublé en 3 mois.",
      author: "Sophie Beaumont",
      role: "Directrice E-commerce",
      company: "Maison Beaumont"
    },
    
    process: [
      {
        phase: "Phase 1",
        title: "Découverte & Audit",
        description: "Analyse approfondie de l'existant, entretiens utilisateurs, benchmark concurrentiel et définition des objectifs business.",
        duration: "2 semaines"
      },
      {
        phase: "Phase 2",
        title: "Design & Prototypage",
        description: "Création du design system, maquettes haute-fidélité, prototypes interactifs et tests utilisateurs.",
        duration: "3 semaines"
      },
      {
        phase: "Phase 3",
        title: "Développement",
        description: "Développement front-end avec Next.js, intégration API Shopify, optimisations performance et SEO.",
        duration: "6 semaines"
      },
      {
        phase: "Phase 4",
        title: "Tests & Optimisation",
        description: "Tests multi-navigateurs, tests de charge, optimisation des conversions et ajustements basés sur les données.",
        duration: "2 semaines"
      },
      {
        phase: "Phase 5",
        title: "Lancement & Suivi",
        description: "Migration progressive, monitoring en temps réel, ajustements post-lancement et formation de l'équipe.",
        duration: "1 semaine"
      }
    ],
    
    images: ["luxury shopping", "online store", "modern retail"],
    video: "ecommerce-demo"
  },
  {
    id: "application-saas-gestion",
    title: "Application SaaS de gestion de projets",
    client: "TaskFlow",
    category: "SaaS",
    year: "2024",
    featured: true,
    thumbnail: "project management",
    tagline: "De l'idée au produit : création d'un SaaS moderne",
    description: "Conception et développement complet d'une application SaaS de gestion de projets avec tableau de bord temps réel.",
    tags: ["React", "Node.js", "WebSocket", "PostgreSQL", "Design System"],
    
    challenge: {
      title: "Créer un MVP en temps record",
      description: "TaskFlow avait besoin de lancer rapidement son MVP pour valider son marché. Le défi était de créer une application complète, performante et scalable en seulement 8 semaines, tout en gardant une expérience utilisateur irréprochable.",
      painPoints: [
        "Délai très court (8 semaines pour le MVP)",
        "Aucune infrastructure technique existante",
        "Besoin d'un design system complet et cohérent",
        "Collaboration temps réel entre utilisateurs requise",
        "Objectif de 1000 utilisateurs dans les 3 premiers mois",
        "Budget limité de startup"
      ]
    },
    
    solution: {
      title: "Architecture moderne et méthodologie agile",
      description: "J'ai proposé une approche agile avec des sprints de 2 semaines, en privilégiant les fonctionnalités core et en utilisant des technologies éprouvées pour garantir la fiabilité et la scalabilité.",
      approach: [
        "Architecture modulaire avec micro-services",
        "Design system atomique pour accélérer le développement",
        "WebSocket pour la collaboration temps réel",
        "CI/CD automatisé dès le jour 1",
        "Tests automatisés pour garantir la qualité",
        "Documentation technique complète",
        "Formation de l'équipe aux bonnes pratiques"
      ],
      technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "WebSocket", "Docker", "AWS"]
    },
    
    results: {
      title: "MVP livré en avance et adoption rapide",
      description: "Le projet a été livré avec 1 semaine d'avance. L'application a séduit les early adopters et a rapidement dépassé les objectifs d'adoption.",
      metrics: [
        { label: "Délai de livraison", value: "7 semaines", change: "-12.5%", positive: true },
        { label: "Utilisateurs actifs", value: "2,450", change: "+145%", positive: true },
        { label: "NPS Score", value: "72/100", change: "Premier mois", positive: true },
        { label: "Uptime", value: "99.8%", change: "Premier trimestre", positive: true },
        { label: "Taux d'adoption", value: "89%", change: "Onboarding", positive: true },
        { label: "Levée de fonds", value: "500K€", change: "Série A", positive: true }
      ]
    },
    
    testimonial: {
      quote: "Maxence a été bien plus qu'un développeur. Il nous a aidés à structurer notre produit, à prioriser les fonctionnalités et a livré un MVP de qualité qui nous a permis de lever des fonds. Un vrai partenaire.",
      author: "Thomas Mercier",
      role: "CEO & Co-fondateur",
      company: "TaskFlow"
    },
    
    process: [
      {
        phase: "Sprint 0",
        title: "Setup & Architecture",
        description: "Définition de l'architecture technique, setup des environnements, CI/CD et création du design system.",
        duration: "1 semaine"
      },
      {
        phase: "Sprints 1-2",
        title: "Features Core",
        description: "Développement des fonctionnalités essentielles : authentification, création de projets, gestion des tâches.",
        duration: "4 semaines"
      },
      {
        phase: "Sprint 3",
        title: "Collaboration Temps Réel",
        description: "Implémentation de la collaboration temps réel avec WebSocket, notifications et synchronisation.",
        duration: "2 semaines"
      },
      {
        phase: "Sprint 4",
        title: "Polish & Tests",
        description: "Optimisations performance, tests automatisés, correction des bugs et amélioration UX.",
        duration: "1 semaine"
      }
    ],
    
    images: ["task management", "team collaboration", "data analytics"],
    video: "saas-demo"
  },
  {
    id: "site-vitrine-architecte",
    title: "Site vitrine premium pour cabinet d'architecture",
    client: "Atelier Blanc",
    category: "Website",
    year: "2023",
    featured: false,
    thumbnail: "modern architecture",
    tagline: "Un portfolio digital à l'image de l'excellence architecturale",
    description: "Création d'un site vitrine premium mettant en valeur le portfolio d'un cabinet d'architecture de renom.",
    tags: ["Design", "Next.js", "Animation", "Performance", "Photography"],
    
    challenge: {
      title: "Sublimer un portfolio architectural",
      description: "Atelier Blanc souhaitait un site web qui reflète l'excellence de leur travail architectural, avec une mise en valeur exceptionnelle de leurs projets et une performance irréprochable.",
      painPoints: [
        "Site existant peu qualitatif et non responsive",
        "Images haute résolution mal optimisées",
        "Aucune mise en valeur des projets",
        "Navigation confuse et peu intuitive",
        "Mauvais référencement naturel",
        "Pas adapté aux tablettes"
      ]
    },
    
    solution: {
      title: "Design épuré et focus sur le contenu",
      description: "J'ai créé une expérience immersive mettant en avant chaque projet avec des animations subtiles et une navigation fluide. L'optimisation des images a été cruciale pour maintenir des performances excellentes.",
      approach: [
        "Direction artistique minimaliste et élégante",
        "Système de galerie avec zoom et navigation tactile",
        "Optimisation automatique des images (WebP, AVIF)",
        "Animations GSAP pour les transitions fluides",
        "Architecture Next.js pour le SEO",
        "Mode sombre/clair adaptatif",
        "Expérience tactile premium sur tablette"
      ],
      technologies: ["Next.js", "React", "TypeScript", "GSAP", "Sharp", "Vercel", "Contentful"]
    },
    
    results: {
      title: "Un impact immédiat sur la perception de marque",
      description: "Le nouveau site a transformé la présence digitale du cabinet, générant plus de leads qualifiés et renforçant leur positionnement premium.",
      metrics: [
        { label: "Temps de chargement", value: "0.9s", change: "-87%", positive: true },
        { label: "Leads qualifiés/mois", value: "45", change: "+280%", positive: true },
        { label: "Temps de session", value: "4m 32s", change: "+195%", positive: true },
        { label: "Taux de rebond", value: "22%", change: "-68%", positive: true },
        { label: "Score Lighthouse", value: "99/100", change: "Performance", positive: true },
        { label: "Projets visionnés", value: "8.2", change: "Par session", positive: true }
      ]
    },
    
    testimonial: {
      quote: "Notre nouveau site est une vitrine digne de nos projets. Les clients nous disent régulièrement être impressionnés par la qualité de la présentation. Maxence a parfaitement compris notre univers.",
      author: "Claire Dubois",
      role: "Associée fondatrice",
      company: "Atelier Blanc"
    },
    
    process: [
      {
        phase: "Phase 1",
        title: "Immersion & Inspiration",
        description: "Visite du cabinet, étude des projets, immersion dans l'univers architectural et définition de la direction artistique.",
        duration: "1 semaine"
      },
      {
        phase: "Phase 2",
        title: "Design UI/UX",
        description: "Création des maquettes, design system, prototypes interactifs et validation avec le client.",
        duration: "2 semaines"
      },
      {
        phase: "Phase 3",
        title: "Développement",
        description: "Intégration front-end, animations, optimisation des images et développement du CMS headless.",
        duration: "3 semaines"
      },
      {
        phase: "Phase 4",
        title: "Lancement",
        description: "Tests finaux, migration du contenu, SEO on-page et mise en production.",
        duration: "1 semaine"
      }
    ],
    
    images: ["modern building", "architectural design", "interior space"]
  }
];
