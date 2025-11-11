import { projectId, publicAnonKey } from "./supabase/info";

/**
 * Diagnostic complet du KV store pour les case studies
 * Aide à identifier pourquoi les suppressions ne fonctionnent pas
 */

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${publicAnonKey}`,
};

export async function diagnosticCaseStudiesKV() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  🔍 DIAGNOSTIC CASE STUDIES KV STORE                            ║
╚══════════════════════════════════════════════════════════════════╝
`);

  try {
    // 1. Récupérer depuis l'API publique
    console.log("1️⃣ Récupération depuis l'API publique /case-studies...");
    const publicResponse = await fetch(`${API_BASE}/case-studies`, {
      headers,
    });

    if (publicResponse.ok) {
      const publicData = await publicResponse.json();
      console.log(`✅ API publique retourne: ${publicData.caseStudies?.length || 0} case studies`);
      if (publicData.caseStudies && publicData.caseStudies.length > 0) {
        console.table(
          publicData.caseStudies.map((cs) => ({
            id: cs.id,
            title: cs.title?.fr || cs.title?.en || "NO TITLE",
            published: cs.published !== false ? "Oui" : "Non",
          }))
        );
      }
    } else {
      console.error("❌ Erreur API publique:", publicResponse.status);
    }

    // 2. Vérifier localStorage
    console.log("\n2️⃣ Vérification localStorage (suppressions permanentes)...");
    const deletedIds = localStorage.getItem("deleted_case_studies");
    if (deletedIds) {
      const parsed = JSON.parse(deletedIds);
      console.log(`🗑️ Case studies marqués comme supprimés: ${parsed.length}`);
      console.log(parsed);
    } else {
      console.log("✅ Aucun case study marqué comme supprimé");
    }

    // 3. Vérifier les clés KV directement
    console.log("\n3️⃣ Test de clé KV directe...");
    console.log("⚠️ Pour vérifier directement le KV store, utilisez la console Supabase");
    console.log("   Vous pouvez aussi appeler /kv/get avec une clé spécifique");

    // 4. Recommandations
    console.log("\n4️⃣ RECOMMANDATIONS:");
    console.log("─────────────────────────────────────────────────────────────────");
    
    if (publicData?.caseStudies?.length > 0) {
      const deleted = deletedIds ? JSON.parse(deletedIds) : [];
      const shouldBeDeleted = publicData.caseStudies.filter((cs) => 
        deleted.includes(cs.id)
      );
      
      if (shouldBeDeleted.length > 0) {
        console.log("❌ PROBLÈME DÉTECTÉ:");
        console.log(`   ${shouldBeDeleted.length} case studies devraient être supprimés mais sont toujours présents:`);
        shouldBeDeleted.forEach((cs) => {
          console.log(`   - ${cs.id}: ${cs.title?.fr || cs.title?.en}`);
        });
        console.log("\n💡 SOLUTION:");
        console.log("   1. Vérifiez les logs serveur lors de la suppression");
        console.log("   2. Utilisez deleteAllCaseStudies() puis reinitCaseStudies()");
        console.log("   3. Vérifiez que kv.del() fonctionne correctement côté serveur");
      } else {
        console.log("✅ Aucun problème détecté - Les suppressions sont cohérentes");
      }
    }

  } catch (error: unknown) {
    console.error("❌ Erreur lors du diagnostic:", error);
  }

  console.log(`
══════════════════════════════════════════════════════════════════
`);
}

/**
 * Supprime TOUS les case studies du serveur (pour réinitialisation complète)
 */
export async function deleteAllCaseStudies() {
  console.log("🗑️ Suppression de TOUS les case studies...");
  
  try {
    // Récupérer tous les case studies
    const response = await fetch(`${API_BASE}/case-studies`, { headers });
    const data = await response.json();
    
    if (!data.caseStudies || data.caseStudies.length === 0) {
      console.log("✅ Aucun case study à supprimer");
      return;
    }

    console.log(`🗑️ Suppression de ${data.caseStudies.length} case studies...`);
    
    // Supprimer chaque case study
    for (const cs of data.caseStudies) {
      const deleteResponse = await fetch(`${API_BASE}/case-studies/${cs.id}`, {
        method: "DELETE",
        headers,
      });

      if (deleteResponse.ok) {
        console.log(`✅ Supprimé: ${cs.id}`);
      } else {
        console.error(`❌ Échec suppression: ${cs.id}`);
      }
    }

    console.log("✅ Suppression terminée!");
    console.log("💡 Vous pouvez maintenant appeler initCaseStudies() pour réinitialiser");
    
  } catch (error: unknown) {
    console.error("❌ Erreur lors de la suppression:", error);
  }
}

/**
 * Réinitialise complètement les case studies (supprime tout + recrée)
 */
export async function reinitCaseStudies() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  🔄 RÉINITIALISATION COMPLÈTE DES CASE STUDIES                  ║
╚══════════════════════════════════════════════════════════════════╝
`);

  // 1. Effacer la liste des suppressions permanentes
  localStorage.removeItem("deleted_case_studies");
  console.log("✅ Liste des suppressions permanentes effacée");

  // 2. Supprimer tous les case studies
  await deleteAllCaseStudies();

  // 3. Réinitialiser depuis les données statiques
  console.log("\n🌱 Réinitialisation depuis les données statiques...");
  if ((window as any).initCaseStudies) {
    await (window as any).initCaseStudies();
  } else {
    console.log("⚠️ initCaseStudies() non disponible");
  }

  console.log(`
══════════════════════════════════════════════════════════════════
✅ Réinitialisation terminée ! Rechargez la page pour voir les changements.
══════════════════════════════════════════════════════════════════
`);
}

// Expose globally for console use
if (typeof window !== "undefined") {
  (window as any).diagnosticCaseStudiesKV = diagnosticCaseStudiesKV;
  (window as any).deleteAllCaseStudies = deleteAllCaseStudies;
  (window as any).reinitCaseStudies = reinitCaseStudies;
  
  console.log(`
💡 FONCTIONS DE DIAGNOSTIC DISPONIBLES:

   diagnosticCaseStudiesKV()
   → Diagnostic complet du KV store

   deleteAllCaseStudies()
   → Supprime TOUS les case studies du serveur

   reinitCaseStudies()
   → Réinitialisation complète (efface tout + recrée)

══════════════════════════════════════════════════════════════════
  `);
}


