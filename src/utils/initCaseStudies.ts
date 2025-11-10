import { caseStudies } from "./caseStudiesData";
import { projectId, publicAnonKey } from "./supabase/info";
import { filterDeletedCaseStudies, getDeletedCaseStudies } from "./permanentlyDeleteCaseStudy";

/**
 * Initialise les case studies dans la base de données Supabase
 * Cette fonction peut être appelée depuis la console pour synchroniser
 * les données statiques avec la base de données
 * 
 * ⚠️ RESPECTE LES SUPPRESSIONS PERMANENTES - Ne recrée pas les case studies supprimés
 */
export async function initCaseStudies() {
  console.log("🚀 Initialisation des case studies...");

  // Filtrer les case studies supprimés définitivement
  const deletedIds = getDeletedCaseStudies();
  if (deletedIds.length > 0) {
    console.log(`⚠️ ${deletedIds.length} case studies supprimés définitivement seront ignorés:`, deletedIds);
  }
  
  const caseStudiesToInit = filterDeletedCaseStudies(caseStudies);
  console.log(`📊 ${caseStudiesToInit.length}/${caseStudies.length} case studies à initialiser`);

  try {
    for (const caseStudy of caseStudiesToInit) {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/case-studies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            ...caseStudy,
            id: caseStudy.id, // Garder l'ID original
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Case study initialisé: ${caseStudy.title}`);
      } else {
        const errorText = await response.text();
        console.error(
          `❌ Erreur lors de l'initialisation de ${caseStudy.title}:`,
          errorText
        );
      }
    }

    console.log("✅ Initialisation des case studies terminée!");
    console.log(`📊 ${caseStudiesToInit.length} études de cas ont été synchronisées.`);
    if (deletedIds.length > 0) {
      console.log(`🗑️ ${deletedIds.length} case studies supprimés définitivement ont été ignorés`);
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des case studies:", error);
  }
}

// Rendre la fonction disponible dans la console globale
if (typeof window !== "undefined") {
  (window as any).initCaseStudies = initCaseStudies;
  console.log(
    "💡 Fonction initCaseStudies() disponible dans la console pour synchroniser les case studies avec la base de données"
  );
}
