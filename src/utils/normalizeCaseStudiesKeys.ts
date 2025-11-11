import { projectId, publicAnonKey } from "./supabase/info";

/**
 * Normalise toutes les clés des case studies dans la DB
 * Convertit toutes les clés au format standard: case_study_{id}
 */

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;

export async function normalizeCaseStudiesKeys() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  🔧 NORMALISATION DES CLÉS CASE STUDIES                         ║
╚══════════════════════════════════════════════════════════════════╝
`);

  try {
    // 1. Récupérer tous les case studies
    console.log("1️⃣ Récupération de tous les case studies...");
    const response = await fetch(`${API_BASE}/case-studies/normalize-keys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to normalize keys");
    }

    const result = await response.json();
    
    console.log(`
✅ NORMALISATION RÉUSSIE !
═══════════════════════════════════════════════════════════════════

📊 Résultats:
   - Case studies analysés: ${result.analyzed}
   - Clés normalisées: ${result.normalized}
   - Clés déjà OK: ${result.alreadyOk}
   - Clés supprimées (anciennes): ${result.deleted}

🔑 Ancien format → Nouveau format:
`);

    if (result.changes && result.changes.length > 0) {
      result.changes.forEach((change) => {
        console.log(`   ${change.oldKey} → ${change.newKey}`);
      });
    } else {
      console.log("   (Aucun changement nécessaire)");
    }

    console.log(`
══════════════════════════════════════════════════════════════════
  `);

    return result;
  } catch (error: unknown) {
    console.error(`
❌ ERREUR lors de la normalisation:
   ${error.message}
    `);
    throw error;
  }
}

// Expose globally
if (typeof window !== "undefined") {
  (window as any).normalizeCaseStudiesKeys = normalizeCaseStudiesKeys;
}


