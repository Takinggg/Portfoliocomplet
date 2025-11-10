// Seed real professional resources
// Usage in browser console: await window.seedRealResources()

import { createClient } from "./supabase/client";
import { projectId, publicAnonKey } from "./supabase/info";

const REAL_RESOURCES = [
  {
    title: "Guide Complet - Tarification Freelance 2025 (50+ pages)",
    description: "Guide professionnel exhaustif de 50+ pages pour maîtriser votre tarification freelance. Apprenez à calculer votre TJM avec la formule complète, découvrez les différents modèles de tarification (temps, valeur, packages, retainer), comprenez comment justifier vos tarifs et négocier efficacement. Inclut des exemples concrets, grilles tarifaires 2025 par secteur, calculateurs, et un plan d'action pour augmenter vos revenus de 30-40% en 12 mois.",
    category: "guides",
    tags: ["freelance", "tarification", "business", "tjm", "value-pricing", "négociation"],
    coverImage: "https://images.unsplash.com/photo-1623679116710-78b05d2fe2f3?w=800",
    fileUrl: `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources/files/guide-tarification-freelance-complet.html`,
    isPublished: true
  },
  {
    title: "Guide Complet - Rédiger un Cahier des Charges Parfait (60+ pages)",
    description: "Guide ultra-complet de 60+ pages pour rédiger des cahiers des charges professionnels qui évitent 90% des problèmes projet. Découvrez la structure idéale, 100+ questions à poser aux clients, comment écrire des spécifications fonctionnelles claires, les clauses juridiques essentielles, et des templates prêts à l'emploi par type de projet. Inclut exemples concrets, wireframes, cas d'usage détaillés, et checklist de validation. Transformez vos briefs vagues en CDC béton.",
    category: "guides",
    tags: ["cahier-des-charges", "gestion-projet", "specs-fonctionnelles", "méthodologie", "client"],
    coverImage: "https://images.unsplash.com/photo-1644352739408-a191ed85e513?w=800",
    fileUrl: `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources/files/guide-cahier-des-charges-complet.html`,
    isPublished: true
  },
  {
    title: "Checklist Lancement Site Web - 150+ Points de Contrôle",
    description: "La checklist la plus complète du web : 150+ points de vérification avant lancement. Couvre 13 catégories essentielles : contenu, images, fonctionnalités, responsive design, performance (Lighthouse), SEO complet, sécurité, RGPD, hébergement, analytics, accessibilité, documentation, et post-lancement. Chaque section est classée par priorité (Essentiel/Important/Recommandé). Inclut timeline J-14 à J+7, tests multi-navigateurs, outils recommandés, et procédures d'urgence. Format imprimable pro.",
    category: "checklists",
    tags: ["checklist", "lancement", "seo", "performance", "rgpd", "accessibilité", "qualité"],
    coverImage: "https://images.unsplash.com/photo-1754548930515-ac7eb978280d?w=800",
    fileUrl: `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources/files/checklist-lancement-site-complete.html`,
    isPublished: true
  },
  {
    title: "Template - Cahier des Charges Pro à Remplir",
    description: "Template professionnel de Cahier des Charges avec 17 sections structurées prêtes à remplir. Couvre page de garde, historique versions, contexte business, périmètre scope, spécifications fonctionnelles et techniques, design UI/UX, planning détaillé, budget, livrables, modalités collaboration, garanties, clauses juridiques. Format imprimable avec champs à compléter, exemples inline, et conseils experts. Gain de temps immédiat : 5-10h de travail économisées.",
    category: "templates",
    tags: ["template", "cahier-des-charges", "planning", "gestion-projet", "business"],
    coverImage: "https://images.unsplash.com/photo-1625009431843-18569fd7331b?w=800",
    fileUrl: `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources/files/template-cahier-des-charges.html`,
    isPublished: true
  }
];

async function seedRealResources() {
  console.log("🌱 Starting REAL resources seeding...");
  
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("❌ You must be logged in to seed resources");
      console.log("💡 Please login to the dashboard first");
      console.log("   → Go to /login");
      console.log("   → Email: admin@maxence.design");
      console.log("   → Password: Admin123!");
      return;
    }

    console.log(`📤 Creating ${REAL_RESOURCES.length} professional resources...`);

    let successCount = 0;
    let errorCount = 0;

    for (const resource of REAL_RESOURCES) {
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
          console.log(`  ✅ ${resource.title}`);
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
    console.log(`  📚 Total: ${REAL_RESOURCES.length}`);
    
    if (successCount > 0) {
      console.log("\n🎉 Real professional resources created!");
      console.log("💡 Visit /resources to see them");
      console.log("💡 Or Dashboard → Contenu → Ressources to manage them");
      console.log("\n📝 Resources created:");
      console.log("   1. Guide - Comment Préparer un Cahier des Charges");
      console.log("   2. Template - Cahier des Charges à Remplir");
      console.log("   3. Checklist - Lancement de Site Web (100+ points)");
      console.log("   4. Guide - Calculer ses Tarifs Freelance");
      console.log("\n💡 These are REAL, downloadable resources!");
      console.log("   → HTML files ready to be converted to PDF");
      console.log("   → Professional content with your branding");
      console.log("   → Ready for lead generation!");
    }

  } catch (error) {
    console.error("❌ Error seeding resources:", error);
  }
}

// Quick info function
function resourcesInfo() {
  console.log("📚 Real Resources Available:");
  console.log("\n1️⃣  Guide - Comment Préparer un Cahier des Charges");
  console.log("    → 6 chapitres, exemples, checklists");
  console.log("    → /resources/guide-cahier-des-charges.html");
  
  console.log("\n2️⃣  Template - Cahier des Charges à Remplir");
  console.log("    → 9 sections structurées avec champs à remplir");
  console.log("    → /resources/template-cahier-des-charges.html");
  
  console.log("\n3️⃣  Checklist - Lancement de Site Web");
  console.log("    → 100+ points : SEO, perf, a11y, sécurité, RGPD");
  console.log("    → /resources/checklist-lancement-site.html");
  
  console.log("\n4️⃣  Guide - Calculer ses Tarifs Freelance");
  console.log("    → Formule complète, calculateur, grilles tarifaires");
  console.log("    → /resources/guide-tarification-freelance.html");
  
  console.log("\n💡 Commands:");
  console.log("   await seedRealResources()  // Create in database");
  console.log("   resourcesInfo()            // Show this info");
}

// Make functions available globally
if (typeof window !== "undefined") {
  (window as any).seedRealResources = seedRealResources;
  (window as any).resourcesInfo = resourcesInfo;
  
  console.log("📚 Real Resources seeder loaded!");
  console.log("💡 Run: await seedRealResources()");
  console.log("💡 Info: resourcesInfo()");
}

export { seedRealResources, resourcesInfo, REAL_RESOURCES };
