import { projectId, publicAnonKey } from "./supabase/info";

/**
 * Suppression PERMANENTE d'un case study
 * - Supprime du serveur
 * - Ajoute à la liste des suppressions permanentes
 * - Empêche la recréation lors de l'initialisation
 */

const DELETED_CASE_STUDIES_KEY = "deleted_case_studies";

export function getDeletedCaseStudies(): string[] {
  if (typeof window === "undefined") return [];
  const deleted = localStorage.getItem(DELETED_CASE_STUDIES_KEY);
  return deleted ? JSON.parse(deleted) : [];
}

export function markCaseStudyAsDeleted(id: string) {
  if (typeof window === "undefined") return;
  const deleted = getDeletedCaseStudies();
  if (!deleted.includes(id)) {
    deleted.push(id);
    localStorage.setItem(DELETED_CASE_STUDIES_KEY, JSON.stringify(deleted));
    console.log(`🗑️ Case study "${id}" marqué comme supprimé définitivement`);
  }
}

export async function permanentlyDeleteCaseStudy(id: string): Promise<boolean> {
  console.log(`🗑️ Suppression PERMANENTE du case study: ${id}`);
  
  try {
    // 1. Supprimer du serveur
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/case-studies/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    // 2. Marquer comme supprimé définitivement (empêche la recréation)
    markCaseStudyAsDeleted(id);

    console.log(`✅ Case study "${id}" supprimé définitivement`);
    console.log(`⚠️ Il ne sera PAS recréé lors de l'initialisation`);
    
    return true;
  } catch (error: any) {
    console.error(`❌ Erreur lors de la suppression permanente:`, error);
    return false;
  }
}

// Fonction pour filtrer les case studies supprimés lors de l'init
export function filterDeletedCaseStudies<T extends { id: string }>(caseStudies: T[]): T[] {
  const deleted = getDeletedCaseStudies();
  if (deleted.length === 0) return caseStudies;
  
  const filtered = caseStudies.filter(cs => !deleted.includes(cs.id));
  
  if (filtered.length < caseStudies.length) {
    console.log(`🗑️ ${caseStudies.length - filtered.length} case studies supprimés définitivement ignorés`);
  }
  
  return filtered;
}

// Expose globally for console use
if (typeof window !== "undefined") {
  (window as any).permanentlyDeleteCaseStudy = permanentlyDeleteCaseStudy;
  (window as any).getDeletedCaseStudies = getDeletedCaseStudies;
  (window as any).clearDeletedCaseStudies = () => {
    localStorage.removeItem(DELETED_CASE_STUDIES_KEY);
    console.log("✅ Liste des case studies supprimés effacée");
  };
  
  console.log("💡 Fonctions de suppression permanente disponibles:");
  console.log("   permanentlyDeleteCaseStudy('id') - Supprime définitivement");
  console.log("   getDeletedCaseStudies() - Liste des IDs supprimés");
  console.log("   clearDeletedCaseStudies() - Réinitialise la liste");
}
