/**
 * Seed projects sur le serveur Supabase
 */

import { projectId, publicAnonKey } from "./supabase/info";

const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;

const demoProjects = [
  {
    id: "project_demo_1",
    title: "E-commerce Luxe",
    slug: "ecommerce-luxe",
    shortDescription: "Boutique en ligne haut de gamme avec expérience utilisateur premium",
    description: "Création d'une plateforme e-commerce complète pour une marque de luxe, avec panier intelligent, paiements sécurisés et gestion des stocks en temps réel.",
    category: "E-commerce",
    technologies: ["React", "Next.js", "Stripe", "Tailwind CSS"],
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    featured: true,
    pinned: true,
    status: "completed",
    client: "Boutique Élégance",
    duration: "3 mois",
    year: 2024,
    metrics: {
      performance: "+150%",
      conversion: "+85%",
      satisfaction: "98%"
    },
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "project_demo_2",
    title: "Application Mobile SaaS",
    slug: "app-mobile-saas",
    shortDescription: "Application mobile de gestion de projets pour équipes distribuées",
    description: "Développement d'une application mobile SaaS permettant aux équipes de collaborer en temps réel, avec tableaux Kanban, chat intégré et notifications push.",
    category: "Application Mobile",
    technologies: ["React Native", "Firebase", "Node.js", "MongoDB"],
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    featured: true,
    pinned: true,
    status: "completed",
    client: "TeamFlow",
    duration: "4 mois",
    year: 2024,
    metrics: {
      users: "10k+",
      rating: "4.8/5",
      retention: "92%"
    },
    createdAt: new Date("2024-03-10").toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "project_demo_3",
    title: "Dashboard Analytics IA",
    slug: "dashboard-analytics-ia",
    shortDescription: "Interface d'analyse de données avec insights générés par IA",
    description: "Création d'un dashboard analytics avancé intégrant l'IA pour générer des insights automatiques et des recommandations basées sur les données métier.",
    category: "Dashboard",
    technologies: ["React", "TypeScript", "Python", "TensorFlow", "D3.js"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    featured: true,
    pinned: true,
    status: "completed",
    client: "DataCorp",
    duration: "5 mois",
    year: 2024,
    metrics: {
      accuracy: "96%",
      timesSaved: "-70%",
      insights: "500+/jour"
    },
    createdAt: new Date("2024-02-20").toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function seedServerProjects() {
  console.log("🌱 Seeding projects to server...");

  try {
    for (const project of demoProjects) {
      const response = await fetch(`${serverUrl}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        console.error(`❌ Failed to seed project ${project.id}:`, await response.text());
        continue;
      }

      const result = await response.json();
      console.log(`✅ Seeded project: ${project.title}`, result);
    }

    console.log("✅ All projects seeded successfully!");
    return { success: true, count: demoProjects.length };
  } catch (error) {
    console.error("❌ Error seeding projects:", error);
    return { success: false, error };
  }
}

// Auto-run si appelé directement
if (typeof window !== "undefined" && (window as any).__SEED_PROJECTS__) {
  seedServerProjects();
}
