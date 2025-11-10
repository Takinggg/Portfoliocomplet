// Seed demo resources for testing
// Usage in browser console: await window.seedResources()

import { createClient } from "./supabase/client";
import { projectId, publicAnonKey } from "./supabase/info";

const DEMO_RESOURCES = [
  {
    title: "Guide Complet du Design Web Moderne",
    description: "Un guide exhaustif de 50 pages sur les principes du design web moderne, incluant la typographie, les couleurs, les espacements et l'accessibilité. Parfait pour les designers débutants et intermédiaires.",
    category: "guides",
    tags: ["design", "web", "ux", "ui", "guide"],
    coverImage: "https://images.unsplash.com/photo-1644352739408-a191ed85e513?w=800",
    fileUrl: "https://example.com/guide-design-web.pdf", // À remplacer par un vrai fichier
    isPublished: true
  },
  {
    title: "Template Site Portfolio Figma",
    description: "Template Figma complet d'un site portfolio moderne avec 15 pages, composants réutilisables et système de design intégré. Prêt à customiser et à exporter.",
    category: "templates",
    tags: ["figma", "template", "portfolio", "design system"],
    coverImage: "https://images.unsplash.com/photo-1625009431843-18569fd7331b?w=800",
    fileUrl: "https://www.figma.com/community/file/example", // À remplacer
    isPublished: true
  },
  {
    title: "Checklist Lancement de Site Web",
    description: "Checklist complète de 100 points à vérifier avant le lancement d'un site web : SEO, performance, accessibilité, sécurité, analytics, et plus encore.",
    category: "checklists",
    tags: ["checklist", "launch", "seo", "performance"],
    coverImage: "https://images.unsplash.com/photo-1754548930515-ac7eb978280d?w=800",
    fileUrl: "https://example.com/checklist-launch.pdf", // À remplacer
    isPublished: true
  },
  {
    title: "Calculateur de Prix Freelance",
    description: "Outil interactif pour calculer vos tarifs freelance en fonction de vos charges, du temps de travail souhaité et de votre objectif de revenus. Format Excel avec formules automatiques.",
    category: "tools",
    tags: ["freelance", "tarifs", "calculator", "business"],
    coverImage: "https://images.unsplash.com/photo-1623679116710-78b05d2fe2f3?w=800",
    fileUrl: "https://example.com/calculator-freelance.xlsx", // À remplacer
    isPublished: true
  },
  {
    title: "Kit de Branding Personnel",
    description: "Template complet pour créer votre identité de marque personnelle : logo, couleurs, typographies, cartes de visite, templates réseaux sociaux. Format Adobe Illustrator et Canva.",
    category: "templates",
    tags: ["branding", "identity", "logo", "template"],
    coverImage: "https://images.unsplash.com/photo-1625009431843-18569fd7331b?w=800",
    fileUrl: "https://example.com/branding-kit.zip", // À remplacer
    isPublished: true
  },
  {
    title: "Guide SEO pour Développeurs",
    description: "Guide pratique de 30 pages pour implémenter le SEO technique : meta tags, structured data, sitemap, robots.txt, performance, Core Web Vitals et plus.",
    category: "guides",
    tags: ["seo", "technical", "development", "optimization"],
    coverImage: "https://images.unsplash.com/photo-1644352739408-a191ed85e513?w=800",
    fileUrl: "https://example.com/guide-seo-dev.pdf", // À remplacer
    isPublished: true
  },
  {
    title: "Checklist Accessibilité WCAG 2.1",
    description: "Checklist détaillée des critères WCAG 2.1 niveaux A et AA pour rendre votre site accessible. Avec exemples de code et outils de test recommandés.",
    category: "checklists",
    tags: ["accessibility", "wcag", "a11y", "compliance"],
    coverImage: "https://images.unsplash.com/photo-1754548930515-ac7eb978280d?w=800",
    fileUrl: "https://example.com/checklist-wcag.pdf", // À remplacer
    isPublished: true
  },
  {
    title: "Template Proposition Commerciale",
    description: "Template professionnel de proposition commerciale en format Google Docs et Word. Sections pré-remplies : présentation, solution, timeline, tarifs, conditions.",
    category: "templates",
    tags: ["business", "proposal", "commercial", "template"],
    coverImage: "https://images.unsplash.com/photo-1625009431843-18569fd7331b?w=800",
    fileUrl: "https://example.com/proposal-template.docx", // À remplacer
    isPublished: true
  }
];

async function seedResources() {
  console.log("🌱 Starting resources seeding...");
  
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("❌ You must be logged in to seed resources");
      console.log("💡 Please login to the dashboard first");
      return;
    }

    console.log(`📤 Creating ${DEMO_RESOURCES.length} demo resources...`);

    let successCount = 0;
    let errorCount = 0;

    for (const resource of DEMO_RESOURCES) {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`
            },
            body: JSON.stringify(resource)
          }
        );

        const data = await response.json();

        if (data.success) {
          successCount++;
          console.log(`  ✅ Created: ${resource.title}`);
        } else {
          errorCount++;
          console.error(`  ❌ Failed: ${resource.title}`, data.error);
        }
      } catch (error) {
        errorCount++;
        console.error(`  ❌ Error creating ${resource.title}:`, error);
      }
    }

    console.log("\n📊 Seeding Summary:");
    console.log(`  ✅ Success: ${successCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  📚 Total: ${DEMO_RESOURCES.length}`);
    
    if (successCount > 0) {
      console.log("\n🎉 Demo resources created successfully!");
      console.log("💡 Visit /resources to see them");
      console.log("💡 Or Dashboard → Contenu → Ressources to manage them");
    }

  } catch (error) {
    console.error("❌ Error seeding resources:", error);
  }
}

// Make it available globally for console access
if (typeof window !== "undefined") {
  (window as any).seedResources = seedResources;
  console.log("💡 Resources seeder loaded! Run: await seedResources()");
}

export { seedResources };
