/**
 * Seed Projects to Server
 * Utilitaire pour peupler la database avec des projets exemple
 */

import { projectId, publicAnonKey } from './supabase/info';

const DEMO_PROJECTS = [
  {
    id: "1",
    title: "E-commerce Platform",
    slug: "ecommerce-platform",
    category: "Web Development",
    description: "Plateforme e-commerce moderne avec dashboard admin complet",
    longDescription: "Développement d'une plateforme e-commerce complète avec gestion des produits, paiements en ligne, système de livraison et dashboard d'administration avancé.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
    technologies: ["React", "Node.js", "Stripe", "MongoDB"],
    link: "#",
    featured: true,
    client: "TechStore Inc.",
    duration: "3 mois",
    year: 2024,
    results: [
      "+250% de conversions",
      "Temps de chargement réduit de 60%",
      "Interface mobile-first"
    ],
    language: "fr",
    status: "completed"
  },
  {
    id: "2",
    title: "Mobile Banking App",
    slug: "mobile-banking-app",
    category: "Mobile Development",
    description: "Application bancaire mobile sécurisée et intuitive",
    longDescription: "Application mobile de gestion bancaire avec authentification biométrique, virements instantanés, et suivi des dépenses en temps réel.",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=600&fit=crop",
    technologies: ["React Native", "Firebase", "Stripe", "Face ID"],
    link: "#",
    featured: true,
    client: "SecureBank",
    duration: "4 mois",
    year: 2024,
    results: [
      "100K+ téléchargements",
      "4.8/5 sur l'App Store",
      "Sécurité bancaire certifiée"
    ],
    language: "fr",
    status: "completed"
  },
  {
    id: "3",
    title: "SaaS Analytics Dashboard",
    slug: "saas-analytics-dashboard",
    category: "Web Development",
    description: "Dashboard analytics temps réel pour entreprises SaaS",
    longDescription: "Tableau de bord d'analytics complet avec visualisations interactives, rapports personnalisables et intégrations API multiples.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    technologies: ["Next.js", "TypeScript", "D3.js", "PostgreSQL"],
    link: "#",
    featured: true,
    client: "DataCorp",
    duration: "2 mois",
    year: 2024,
    results: [
      "Traitement de 1M+ événements/jour",
      "Dashboard temps réel",
      "API REST complète"
    ],
    language: "fr",
    status: "completed"
  },
  {
    id: "4",
    title: "Portfolio Website",
    slug: "portfolio-website",
    category: "Web Design",
    description: "Site portfolio minimaliste pour designer",
    longDescription: "Site web portfolio avec animations avancées, galerie interactive et blog intégré.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
    technologies: ["React", "Tailwind CSS", "Framer Motion"],
    link: "#",
    featured: false,
    client: "Creative Studio",
    duration: "1 mois",
    year: 2023,
    results: [
      "Design primé",
      "Performance 100/100",
      "+300% engagement"
    ],
    language: "fr",
    status: "completed"
  },
  {
    id: "5",
    title: "CRM System",
    slug: "crm-system",
    category: "Web Development",
    description: "Système CRM complet pour PME",
    longDescription: "Solution CRM complète avec gestion des leads, clients, projets, factures et rapports.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop",
    technologies: ["Vue.js", "Laravel", "MySQL", "Redis"],
    link: "#",
    featured: false,
    client: "BusinessPro",
    duration: "5 mois",
    year: 2023,
    results: [
      "Automatisation 80%",
      "ROI +200%",
      "Support multi-utilisateurs"
    ],
    language: "fr",
    status: "completed"
  }
];

/**
 * Seed projects to the server
 */
export async function seedProjects() {
  console.log("🌱 Starting projects seed...");
  
  try {
    const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;
    
    for (const project of DEMO_PROJECTS) {
      try {
        const key = `project_${project.id}`;
        
        // Use KV store to save
        const response = await fetch(`${baseUrl}/kv/set`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            key,
            value: project
          })
        });

        if (response.ok) {
          console.log(`✅ Project seeded: ${project.title}`);
        } else {
          const error = await response.text();
          console.error(`❌ Failed to seed ${project.title}:`, error);
        }
      } catch (error) {
        console.error(`❌ Error seeding ${project.title}:`, error);
      }
    }

    console.log("🎉 Projects seed completed!");
    return { success: true, count: DEMO_PROJECTS.length };
  } catch (error) {
    console.error("❌ Projects seed failed:", error);
    return { success: false, error };
  }
}

/**
 * Vérifier les projets existants
 */
export async function checkProjects() {
  try {
    const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;
    
    const response = await fetch(`${baseUrl}/projects`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      }
    });

    if (response.ok) {
      const projects = await response.json();
      console.log(`📂 Projects in database: ${projects.length}`);
      return projects;
    } else {
      console.error("❌ Failed to fetch projects");
      return [];
    }
  } catch (error) {
    console.error("❌ Error checking projects:", error);
    return [];
  }
}

// Expose functions to window for console access
if (typeof window !== 'undefined') {
  (window as any).seedProjects = seedProjects;
  (window as any).checkProjects = checkProjects;
  
  console.log("📂 Projects utilities loaded:");
  console.log("   • seedProjects() - Peupler la base avec des projets exemple");
  console.log("   • checkProjects() - Vérifier les projets existants");
}
