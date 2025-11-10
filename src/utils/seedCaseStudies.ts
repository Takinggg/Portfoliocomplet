// Fonction pour charger les études de cas par défaut dans la base de données
import { projectId, publicAnonKey } from "./supabase/info";
import { caseStudies } from "./caseStudiesData";
import { filterDeletedCaseStudies, getDeletedCaseStudies } from "./permanentlyDeleteCaseStudy";

export async function seedCaseStudies() {
  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${publicAnonKey}`,
  };

  console.log("🌱 Chargement des études de cas par défaut...");

  // Filtrer les case studies supprimés définitivement
  const deletedIds = getDeletedCaseStudies();
  if (deletedIds.length > 0) {
    console.log(`⚠️ ${deletedIds.length} case studies supprimés définitivement seront ignorés:`, deletedIds);
  }
  
  const caseStudiesToSeed = filterDeletedCaseStudies(caseStudies);
  console.log(`📊 ${caseStudiesToSeed.length}/${caseStudies.length} case studies à charger`);

  try {
    for (const caseStudy of caseStudiesToSeed) {
      const response = await fetch(`${API_BASE}/case-studies`, {
        method: "POST",
        headers,
        body: JSON.stringify(caseStudy),
      });

      if (!response.ok) {
        console.error(`❌ Erreur lors du chargement de "${caseStudy.title}"`);
      } else {
        console.log(`✅ Étude de cas chargée: ${caseStudy.title}`);
      }
    }

    console.log(`🎉 ${caseStudiesToSeed.length} études de cas chargées avec succès !`);
    if (deletedIds.length > 0) {
      console.log(`🗑️ ${deletedIds.length} case studies supprimés définitivement ont été ignorés`);
    }
    return { success: true, count: caseStudiesToSeed.length };
  } catch (error) {
    console.error("❌ Erreur lors du chargement des études de cas:", error);
    return { success: false, error };
  }
}

// Expose globally for testing
if (typeof window !== "undefined") {
  (window as any).seedCaseStudies = seedCaseStudies;
}
