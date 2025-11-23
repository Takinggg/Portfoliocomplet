import type { Project, ServicePack } from "./types";

export const redesignProjects: Project[] = [
  {
    id: 1,
    title: "Velvet Finance",
    title_en: "Velvet Finance",
    client: "Velvet Bank",
    category: "Fintech",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
    description: "Architecture complète d'une banque mobile nouvelle génération.",
    description_en: "Complete architecture for a next-gen mobile banking app.",
    challenge: "Velvet voulait disrupter le marché bancaire avec une approche mobile-first.",
    challenge_en: "Velvet wanted to disrupt the banking market with a mobile-first approach.",
    solution: "Une architecture headless séparant la logique bancaire de l'UI pour une sécurité maximale.",
    solution_en: "A headless architecture separating banking logic from UI for maximum security.",
    tags: ["Mobile", "React Native", "Supabase"],
    link: "#",
    stats: [
      { label: "Utilisateurs", label_en: "Users", value: "50k+" },
      { label: "Note App Store", label_en: "App Store Rating", value: "4.9" }
    ],
    techStack: [
      { name: "React Native", category: "Mobile" },
      { name: "Supabase", category: "Backend" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2564&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2600&auto=format&fit=crop"
    ]
  },
  {
    id: 2,
    title: "Chronos SaaS",
    title_en: "Chronos SaaS",
    client: "Chronos Tech",
    category: "SaaS",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    description: "Plateforme d'analytics B2B avec visualisation complexe.",
    description_en: "B2B analytics platform with complex visualization.",
    tags: ["React", "D3.js", "Node.js"],
    link: "#",
    stats: [
      { label: "Volume de données", label_en: "Data", value: "1TB/j" },
      { label: "Clients actifs", label_en: "Clients", value: "120" }
    ],
    techStack: [
      { name: "D3.js", category: "Viz" },
      { name: "Node.js", category: "Backend" }
    ],
    challenge: "Visualiser des téraoctets de données sans sacrifier les performances.",
    challenge_en: "Visualize terabytes of data without sacrificing performance.",
    solution: "Pipeline de streaming + rendu WebGL pour maintenir 60fps.",
    solution_en: "Streaming pipeline + WebGL rendering to maintain 60fps.",
    gallery: [
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: 3,
    title: "Maison Noire",
    title_en: "Black House",
    client: "LVMH Group",
    category: "E-Commerce",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2670&auto=format&fit=crop",
    description: "Flagship digital immersif en WebGL.",
    description_en: "Immersive WebGL digital flagship.",
    tags: ["WebGL", "Shopify", "Motion"],
    link: "#",
    stats: [
      { label: "Conversion", label_en: "Conversion", value: "+45%" },
      { label: "Récompenses", label_en: "Awards", value: "Awwwards" }
    ],
    techStack: [
      { name: "WebGL", category: "3D" },
      { name: "Shopify", category: "CMS" }
    ],
    challenge: "Allier luxe et performance sur mobile.",
    challenge_en: "Blend luxury and performance on mobile.",
    solution: "Moteur 3D custom + streaming adaptatif des assets.",
    solution_en: "Custom 3D engine + adaptive asset streaming.",
    gallery: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2600&auto=format&fit=crop"
    ]
  }
];

export const redesignServices: ServicePack[] = [
  {
    id: "starter",
    title: "Landing Pack",
    title_en: "Landing Pack",
    price: "À partir de 3k€",
    price_en: "From 3k€",
    description: "Idéal pour lancer un produit ou tester une idée rapidement.",
    description_en: "Ideal for launching a product or testing an idea quickly.",
    features: [
      "Design UI/UX sur-mesure",
      "Développement React/Next.js",
      "Animations Motion",
      "Optimisation SEO de base",
      "Livraison en 2 semaines"
    ],
    features_en: [
      "Custom UI/UX Design",
      "React/Next.js Development",
      "Motion Animations",
      "Basic SEO",
      "2 Weeks Delivery"
    ]
  },
  {
    id: "pro",
    title: "Ecosystem",
    title_en: "Ecosystem",
    price: "Sur Devis",
    price_en: "Custom Quote",
    description: "Une solution complète : Site vitrine + Dashboard/CRM + Intégrations.",
    description_en: "A complete solution: Website + Dashboard/CRM + Integrations.",
    features: [
      "Architecture Full Stack",
      "Backend Supabase",
      "CMS Personnalisé",
      "Auth & Rôles",
      "Analytics avancées",
      "Support 3 mois"
    ],
    features_en: [
      "Full Stack Architecture",
      "Supabase Backend",
      "Custom CMS",
      "Auth & Roles",
      "Advanced Analytics",
      "3 Months Support"
    ],
    popular: true
  },
  {
    id: "scale",
    title: "Scale-Up",
    title_en: "Scale-Up",
    price: "TJM / Retainer",
    price_en: "Daily Rate",
    description: "Accompagnement long terme pour équipes produit.",
    description_en: "Long term support for product teams.",
    features: [
      "Design System",
      "Refonte UX continue",
      "Audit de performance",
      "Consulting Technique",
      "Workshops équipe"
    ],
    features_en: [
      "Design System",
      "Continuous UX",
      "Performance Audit",
      "Tech Consulting",
      "Team Workshops"
    ]
  }
];
