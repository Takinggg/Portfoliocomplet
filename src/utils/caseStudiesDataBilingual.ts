import { CaseStudy } from './freelanceConfig';

// Interface pour les données bilingues
interface BilingualCaseStudy extends Omit<CaseStudy, 'title' | 'tagline' | 'description' | 'challenge' | 'solution' | 'results' | 'testimonial' | 'process'> {
  title: { fr: string; en: string };
  tagline: { fr: string; en: string };
  description: { fr: string; en: string };
  challenge: {
    title: { fr: string; en: string };
    description: { fr: string; en: string };
    painPoints: { fr: string[]; en: string[] };
  };
  solution: {
    title: { fr: string; en: string };
    description: { fr: string; en: string };
    approach: { fr: string[]; en: string[] };
    technologies: string[];
  };
  results: {
    title: { fr: string; en: string };
    description: { fr: string; en: string };
    metrics: Array<{
      label: { fr: string; en: string };
      value: string;
      change: string;
      positive: boolean;
    }>;
  };
  testimonial: {
    quote: { fr: string; en: string };
    author: string;
    role: { fr: string; en: string };
    company: string;
  };
  process: Array<{
    phase: string;
    title: { fr: string; en: string };
    description: { fr: string; en: string };
    duration: { fr: string; en: string };
  }>;
}

// Fonction pour convertir les données bilingues vers une langue spécifique
export function getCaseStudiesForLanguage(language: 'fr' | 'en'): CaseStudy[] {
  return bilingualCaseStudies.map(cs => ({
    ...cs,
    title: cs.title[language],
    tagline: cs.tagline[language],
    description: cs.description[language],
    challenge: {
      title: cs.challenge.title[language],
      description: cs.challenge.description[language],
      painPoints: cs.challenge.painPoints[language]
    },
    solution: {
      title: cs.solution.title[language],
      description: cs.solution.description[language],
      approach: cs.solution.approach[language],
      technologies: cs.solution.technologies
    },
    results: {
      title: cs.results.title[language],
      description: cs.results.description[language],
      metrics: cs.results.metrics.map(m => ({
        ...m,
        label: m.label[language]
      }))
    },
    testimonial: {
      quote: cs.testimonial.quote[language],
      author: cs.testimonial.author,
      role: cs.testimonial.role[language],
      company: cs.testimonial.company
    },
    process: cs.process.map(p => ({
      phase: p.phase,
      title: p.title[language],
      description: p.description[language],
      duration: p.duration[language]
    }))
  }));
}

// Données bilingues des études de cas
const bilingualCaseStudies: BilingualCaseStudy[] = [
  {
    id: "plateforme-ecommerce-luxe",
    title: {
      fr: "Refonte complète d'une plateforme e-commerce luxe",
      en: "Complete redesign of a luxury e-commerce platform"
    },
    client: "Maison Beaumont",
    category: "E-commerce",
    year: "2024",
    featured: true,
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80&auto=format&fit=crop",
    tagline: {
      fr: "Transformation digitale d'une maison de luxe centenaire",
      en: "Digital transformation of a century-old luxury house"
    },
    description: {
      fr: "Refonte complète de l'expérience e-commerce avec focus sur la performance et l'expérience utilisateur premium.",
      en: "Complete redesign of the e-commerce experience focused on performance and premium user experience."
    },
    tags: ["React", "Next.js", "Shopify", "Performance", "UX/UI"],
    
    challenge: {
      title: {
        fr: "Un site obsolète qui freinait la croissance",
        en: "An outdated website hampering growth"
      },
      description: {
        fr: "La plateforme e-commerce existante datait de 2015, souffrait de problèmes de performance majeurs et ne reflétait pas le positionnement premium de la marque. Le taux de conversion stagnait à 0.8% et le taux d'abandon panier atteignait 78%.",
        en: "The existing e-commerce platform dated back to 2015, suffered from major performance issues and did not reflect the brand's premium positioning. Conversion rate stagnated at 0.8% and cart abandonment reached 78%."
      },
      painPoints: {
        fr: [
          "Temps de chargement > 8 secondes sur mobile",
          "Taux de conversion de 0.8% (bien en-dessous de la moyenne du secteur)",
          "Design obsolète ne reflétant pas l'image premium",
          "Processus de checkout complexe avec 6 étapes",
          "Aucune personnalisation de l'expérience utilisateur",
          "Backend difficile à maintenir et à faire évoluer"
        ],
        en: [
          "Loading time > 8 seconds on mobile",
          "Conversion rate of 0.8% (well below industry average)",
          "Outdated design not reflecting premium image",
          "Complex checkout process with 6 steps",
          "No user experience personalization",
          "Backend difficult to maintain and evolve"
        ]
      }
    },
    
    solution: {
      title: {
        fr: "Une refonte complète axée performance et conversion",
        en: "A complete redesign focused on performance and conversion"
      },
      description: {
        fr: "Nous avons repensé l'ensemble de l'expérience utilisateur en mettant l'accent sur la performance, la simplicité et l'élégance. L'architecture technique a été modernisée avec Next.js pour garantir des temps de chargement ultra-rapides.",
        en: "We rethought the entire user experience with a focus on performance, simplicity and elegance. The technical architecture was modernized with Next.js to ensure ultra-fast loading times."
      },
      approach: {
        fr: [
          "Audit UX/UI complet et benchmark concurrentiel",
          "Refonte du design system avec composants réutilisables",
          "Migration vers Next.js avec SSR et ISR pour la performance",
          "Simplification du tunnel de conversion (de 6 à 2 étapes)",
          "Implémentation d'un système de personnalisation IA",
          "Optimisation SEO technique et sémantique",
          "Tests A/B continus sur les points de friction"
        ],
        en: [
          "Complete UX/UI audit and competitive benchmarking",
          "Design system redesign with reusable components",
          "Migration to Next.js with SSR and ISR for performance",
          "Conversion funnel simplification (from 6 to 2 steps)",
          "Implementation of an AI personalization system",
          "Technical and semantic SEO optimization",
          "Continuous A/B testing on friction points"
        ]
      },
      technologies: ["Next.js 14", "React", "TypeScript", "Shopify API", "Tailwind CSS", "Vercel", "Analytics"]
    },
    
    results: {
      title: {
        fr: "Des résultats mesurables dès le premier mois",
        en: "Measurable results from the first month"
      },
      description: {
        fr: "La nouvelle plateforme a dépassé tous les objectifs fixés, avec une amélioration spectaculaire des KPIs business et techniques.",
        en: "The new platform exceeded all set objectives, with spectacular improvement in business and technical KPIs."
      },
      metrics: [
        { label: { fr: "Taux de conversion", en: "Conversion rate" }, value: "3.2%", change: "+300%", positive: true },
        { label: { fr: "Temps de chargement", en: "Loading time" }, value: "1.2s", change: "-85%", positive: true },
        { label: { fr: "Revenus mensuels", en: "Monthly revenue" }, value: "+420K€", change: "+215%", positive: true },
        { label: { fr: "Taux d'abandon panier", en: "Cart abandonment" }, value: "32%", change: "-59%", positive: true },
        { label: { fr: "Score Performance", en: "Performance score" }, value: "98/100", change: "+75pts", positive: true },
        { label: { fr: "Panier moyen", en: "Average cart" }, value: "340€", change: "+48%", positive: true }
      ]
    },
    
    testimonial: {
      quote: {
        fr: "Maxence a transformé notre présence digitale. Non seulement le site est magnifique, mais les résultats business ont dépassé toutes nos attentes. Notre CA en ligne a plus que doublé en 3 mois.",
        en: "Maxence transformed our digital presence. Not only is the site beautiful, but the business results exceeded all our expectations. Our online revenue more than doubled in 3 months."
      },
      author: "Sophie Beaumont",
      role: {
        fr: "Directrice E-commerce",
        en: "E-commerce Director"
      },
      company: "Maison Beaumont"
    },
    
    process: [
      {
        phase: "Phase 1",
        title: {
          fr: "Découverte & Audit",
          en: "Discovery & Audit"
        },
        description: {
          fr: "Analyse approfondie de l'existant, entretiens utilisateurs, benchmark concurrentiel et définition des objectifs business.",
          en: "In-depth analysis of existing solution, user interviews, competitive benchmarking and business objectives definition."
        },
        duration: {
          fr: "2 semaines",
          en: "2 weeks"
        }
      },
      {
        phase: "Phase 2",
        title: {
          fr: "Design & Prototypage",
          en: "Design & Prototyping"
        },
        description: {
          fr: "Création du design system, maquettes haute-fidélité, prototypes interactifs et tests utilisateurs.",
          en: "Design system creation, high-fidelity mockups, interactive prototypes and user testing."
        },
        duration: {
          fr: "3 semaines",
          en: "3 weeks"
        }
      },
      {
        phase: "Phase 3",
        title: {
          fr: "Développement",
          en: "Development"
        },
        description: {
          fr: "Développement front-end avec Next.js, intégration API Shopify, optimisations performance et SEO.",
          en: "Front-end development with Next.js, Shopify API integration, performance and SEO optimizations."
        },
        duration: {
          fr: "6 semaines",
          en: "6 weeks"
        }
      },
      {
        phase: "Phase 4",
        title: {
          fr: "Tests & Optimisation",
          en: "Testing & Optimization"
        },
        description: {
          fr: "Tests multi-navigateurs, tests de charge, optimisation des conversions et ajustements basés sur les données.",
          en: "Cross-browser testing, load testing, conversion optimization and data-driven adjustments."
        },
        duration: {
          fr: "2 semaines",
          en: "2 weeks"
        }
      },
      {
        phase: "Phase 5",
        title: {
          fr: "Lancement & Suivi",
          en: "Launch & Monitoring"
        },
        description: {
          fr: "Migration progressive, monitoring en temps réel, ajustements post-lancement et formation de l'équipe.",
          en: "Progressive migration, real-time monitoring, post-launch adjustments and team training."
        },
        duration: {
          fr: "1 semaine",
          en: "1 week"
        }
      }
    ],
    
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80"
    ]
  },
  {
    id: "application-saas-gestion",
    title: {
      fr: "Application SaaS de gestion de projets",
      en: "Project management SaaS application"
    },
    client: "TaskFlow",
    category: "SaaS",
    year: "2024",
    featured: true,
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop",
    tagline: {
      fr: "De l'idée au produit : création d'un SaaS moderne",
      en: "From idea to product: creating a modern SaaS"
    },
    description: {
      fr: "Conception et développement complet d'une application SaaS de gestion de projets avec tableau de bord temps réel.",
      en: "Complete design and development of a project management SaaS application with real-time dashboard."
    },
    tags: ["React", "Node.js", "WebSocket", "PostgreSQL", "Design System"],
    
    challenge: {
      title: {
        fr: "Créer un MVP en temps record",
        en: "Create an MVP in record time"
      },
      description: {
        fr: "TaskFlow avait besoin de lancer rapidement son MVP pour valider son marché. Le défi était de créer une application complète, performante et scalable en seulement 8 semaines, tout en gardant une expérience utilisateur irréprochable.",
        en: "TaskFlow needed to quickly launch its MVP to validate its market. The challenge was to create a complete, performant and scalable application in just 8 weeks, while maintaining an impeccable user experience."
      },
      painPoints: {
        fr: [
          "Délai très court (8 semaines pour le MVP)",
          "Aucune infrastructure technique existante",
          "Besoin d'un design system complet et cohérent",
          "Collaboration temps réel entre utilisateurs requise",
          "Objectif de 1000 utilisateurs dans les 3 premiers mois",
          "Budget limité de startup"
        ],
        en: [
          "Very short deadline (8 weeks for MVP)",
          "No existing technical infrastructure",
          "Need for complete and consistent design system",
          "Real-time collaboration between users required",
          "Goal of 1000 users in the first 3 months",
          "Limited startup budget"
        ]
      }
    },
    
    solution: {
      title: {
        fr: "Architecture moderne et méthodologie agile",
        en: "Modern architecture and agile methodology"
      },
      description: {
        fr: "J'ai proposé une approche agile avec des sprints de 2 semaines, en privilégiant les fonctionnalités core et en utilisant des technologies éprouvées pour garantir la fiabilité et la scalabilité.",
        en: "I proposed an agile approach with 2-week sprints, prioritizing core features and using proven technologies to ensure reliability and scalability."
      },
      approach: {
        fr: [
          "Architecture modulaire avec micro-services",
          "Design system atomique pour accélérer le développement",
          "WebSocket pour la collaboration temps réel",
          "CI/CD automatisé dès le jour 1",
          "Tests automatisés pour garantir la qualité",
          "Documentation technique complète",
          "Formation de l'équipe aux bonnes pratiques"
        ],
        en: [
          "Modular architecture with micro-services",
          "Atomic design system to accelerate development",
          "WebSocket for real-time collaboration",
          "Automated CI/CD from day 1",
          "Automated testing to ensure quality",
          "Complete technical documentation",
          "Team training in best practices"
        ]
      },
      technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "WebSocket", "Docker", "AWS"]
    },
    
    results: {
      title: {
        fr: "MVP livré en avance et adoption rapide",
        en: "MVP delivered ahead of schedule with rapid adoption"
      },
      description: {
        fr: "Le projet a été livré avec 1 semaine d'avance. L'application a séduit les early adopters et a rapidement dépassé les objectifs d'adoption.",
        en: "The project was delivered 1 week ahead of schedule. The application won over early adopters and quickly exceeded adoption goals."
      },
      metrics: [
        { label: { fr: "Délai de livraison", en: "Delivery time" }, value: "7 weeks", change: "-12.5%", positive: true },
        { label: { fr: "Utilisateurs actifs", en: "Active users" }, value: "2,450", change: "+145%", positive: true },
        { label: { fr: "Score NPS", en: "NPS Score" }, value: "72/100", change: "First month", positive: true },
        { label: { fr: "Disponibilité", en: "Uptime" }, value: "99.8%", change: "First quarter", positive: true },
        { label: { fr: "Taux d'adoption", en: "Adoption rate" }, value: "89%", change: "Onboarding", positive: true },
        { label: { fr: "Levée de fonds", en: "Fundraising" }, value: "500K€", change: "Series A", positive: true }
      ]
    },
    
    testimonial: {
      quote: {
        fr: "Maxence a été bien plus qu'un développeur. Il nous a aidés à structurer notre produit, à prioriser les fonctionnalités et a livré un MVP de qualité qui nous a permis de lever des fonds. Un vrai partenaire.",
        en: "Maxence was much more than a developer. He helped us structure our product, prioritize features and delivered a quality MVP that allowed us to raise funds. A true partner."
      },
      author: "Thomas Mercier",
      role: {
        fr: "CEO & Co-fondateur",
        en: "CEO & Co-founder"
      },
      company: "TaskFlow"
    },
    
    process: [
      {
        phase: "Sprint 0",
        title: {
          fr: "Setup & Architecture",
          en: "Setup & Architecture"
        },
        description: {
          fr: "Définition de l'architecture technique, setup des environnements, CI/CD et création du design system.",
          en: "Technical architecture definition, environment setup, CI/CD and design system creation."
        },
        duration: {
          fr: "1 semaine",
          en: "1 week"
        }
      },
      {
        phase: "Sprints 1-2",
        title: {
          fr: "Features Core",
          en: "Core Features"
        },
        description: {
          fr: "Développement des fonctionnalités essentielles : authentification, création de projets, gestion des tâches.",
          en: "Development of essential features: authentication, project creation, task management."
        },
        duration: {
          fr: "4 semaines",
          en: "4 weeks"
        }
      },
      {
        phase: "Sprint 3",
        title: {
          fr: "Collaboration Temps Réel",
          en: "Real-Time Collaboration"
        },
        description: {
          fr: "Implémentation de la collaboration temps réel avec WebSocket, notifications et synchronisation.",
          en: "Implementation of real-time collaboration with WebSocket, notifications and synchronization."
        },
        duration: {
          fr: "2 semaines",
          en: "2 weeks"
        }
      },
      {
        phase: "Sprint 4",
        title: {
          fr: "Polish & Tests",
          en: "Polish & Testing"
        },
        description: {
          fr: "Optimisations performance, tests automatisés, correction des bugs et amélioration UX.",
          en: "Performance optimizations, automated testing, bug fixes and UX improvements."
        },
        duration: {
          fr: "1 semaine",
          en: "1 week"
        }
      }
    ],
    
    images: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
    ]
  },
  {
    id: "site-vitrine-architecte",
    title: {
      fr: "Site vitrine premium pour cabinet d'architecture",
      en: "Premium showcase website for architecture firm"
    },
    client: "Atelier Blanc",
    category: "Website",
    year: "2023",
    featured: false,
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80&auto=format&fit=crop",
    tagline: {
      fr: "Un portfolio digital à l'image de l'excellence architecturale",
      en: "A digital portfolio reflecting architectural excellence"
    },
    description: {
      fr: "Création d'un site vitrine premium mettant en valeur le portfolio d'un cabinet d'architecture de renom.",
      en: "Creation of a premium showcase website highlighting the portfolio of a renowned architecture firm."
    },
    tags: ["Design", "Next.js", "Animation", "Performance", "Photography"],
    
    challenge: {
      title: {
        fr: "Sublimer un portfolio architectural",
        en: "Enhance an architectural portfolio"
      },
      description: {
        fr: "Atelier Blanc souhaitait un site web qui reflète l'excellence de leur travail architectural, avec une mise en valeur exceptionnelle de leurs projets et une performance irréprochable.",
        en: "Atelier Blanc wanted a website that reflects the excellence of their architectural work, with exceptional showcasing of their projects and impeccable performance."
      },
      painPoints: {
        fr: [
          "Site existant peu qualitatif et non responsive",
          "Images haute résolution mal optimisées",
          "Aucune mise en valeur des projets",
          "Navigation confuse et peu intuitive",
          "Mauvais référencement naturel",
          "Pas adapté aux tablettes"
        ],
        en: [
          "Existing low-quality and non-responsive site",
          "Poorly optimized high-resolution images",
          "No project showcasing",
          "Confusing and unintuitive navigation",
          "Poor natural referencing",
          "Not adapted to tablets"
        ]
      }
    },
    
    solution: {
      title: {
        fr: "Design épuré et focus sur le contenu",
        en: "Clean design with content focus"
      },
      description: {
        fr: "J'ai créé une expérience immersive mettant en avant chaque projet avec des animations subtiles et une navigation fluide. L'optimisation des images a été cruciale pour maintenir des performances excellentes.",
        en: "I created an immersive experience highlighting each project with subtle animations and smooth navigation. Image optimization was crucial to maintain excellent performance."
      },
      approach: {
        fr: [
          "Direction artistique minimaliste et élégante",
          "Système de galerie avec zoom et navigation tactile",
          "Optimisation automatique des images (WebP, AVIF)",
          "Animations GSAP pour les transitions fluides",
          "Architecture Next.js pour le SEO",
          "Mode sombre/clair adaptatif",
          "Expérience tactile premium sur tablette"
        ],
        en: [
          "Minimalist and elegant art direction",
          "Gallery system with zoom and touch navigation",
          "Automatic image optimization (WebP, AVIF)",
          "GSAP animations for smooth transitions",
          "Next.js architecture for SEO",
          "Adaptive dark/light mode",
          "Premium touch experience on tablet"
        ]
      },
      technologies: ["Next.js", "React", "TypeScript", "GSAP", "Sharp", "Vercel", "Contentful"]
    },
    
    results: {
      title: {
        fr: "Un impact immédiat sur la perception de marque",
        en: "Immediate impact on brand perception"
      },
      description: {
        fr: "Le nouveau site a transformé la présence digitale du cabinet, générant plus de leads qualifiés et renforçant leur positionnement premium.",
        en: "The new site transformed the firm's digital presence, generating more qualified leads and strengthening their premium positioning."
      },
      metrics: [
        { label: { fr: "Temps de chargement", en: "Loading time" }, value: "0.9s", change: "-87%", positive: true },
        { label: { fr: "Leads qualifiés/mois", en: "Qualified leads/month" }, value: "45", change: "+280%", positive: true },
        { label: { fr: "Temps de session", en: "Session time" }, value: "4m 32s", change: "+195%", positive: true },
        { label: { fr: "Taux de rebond", en: "Bounce rate" }, value: "22%", change: "-68%", positive: true },
        { label: { fr: "Score Lighthouse", en: "Lighthouse score" }, value: "99/100", change: "Performance", positive: true },
        { label: { fr: "Projets visionnés", en: "Projects viewed" }, value: "8.2", change: "Per session", positive: true }
      ]
    },
    
    testimonial: {
      quote: {
        fr: "Notre nouveau site est une vitrine digne de nos projets. Les clients nous disent régulièrement être impressionnés par la qualité de la présentation. Maxence a parfaitement compris notre univers.",
        en: "Our new site is a showcase worthy of our projects. Clients regularly tell us they are impressed by the quality of the presentation. Maxence perfectly understood our universe."
      },
      author: "Claire Dubois",
      role: {
        fr: "Associée fondatrice",
        en: "Founding Partner"
      },
      company: "Atelier Blanc"
    },
    
    process: [
      {
        phase: "Phase 1",
        title: {
          fr: "Immersion & Inspiration",
          en: "Immersion & Inspiration"
        },
        description: {
          fr: "Visite du cabinet, étude des projets, immersion dans l'univers architectural et définition de la direction artistique.",
          en: "Firm visit, project study, immersion in architectural world and art direction definition."
        },
        duration: {
          fr: "1 semaine",
          en: "1 week"
        }
      },
      {
        phase: "Phase 2",
        title: {
          fr: "Design UI/UX",
          en: "UI/UX Design"
        },
        description: {
          fr: "Création des maquettes, design system, prototypes interactifs et validation avec le client.",
          en: "Mockup creation, design system, interactive prototypes and client validation."
        },
        duration: {
          fr: "2 semaines",
          en: "2 weeks"
        }
      },
      {
        phase: "Phase 3",
        title: {
          fr: "Développement",
          en: "Development"
        },
        description: {
          fr: "Intégration front-end, animations, optimisation des images et développement du CMS headless.",
          en: "Front-end integration, animations, image optimization and headless CMS development."
        },
        duration: {
          fr: "3 semaines",
          en: "3 weeks"
        }
      },
      {
        phase: "Phase 4",
        title: {
          fr: "Lancement",
          en: "Launch"
        },
        description: {
          fr: "Tests finaux, migration du contenu, SEO on-page et mise en production.",
          en: "Final testing, content migration, on-page SEO and production deployment."
        },
        duration: {
          fr: "1 semaine",
          en: "1 week"
        }
      }
    ],
    
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80"
    ]
  }
];

export { bilingualCaseStudies };
