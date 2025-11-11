import { projectId, publicAnonKey } from "./supabase/info";

/**
 * Test pour vérifier si kv.del() fonctionne correctement
 * Ce test va créer un case study temporaire, le supprimer, et vérifier
 */

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;

export async function testKVDeletion() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  🧪 TEST KV DELETION - Case Studies                             ║
╚══════════════════════════════════════════════════════════════════╝
`);

  try {
    // 1. Récupérer la liste AVANT
    console.log("1️⃣ Récupération des case studies AVANT le test...");
    const beforeResponse = await fetch(`${API_BASE}/case-studies`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });
    const beforeData = await beforeResponse.json();
    const countBefore = beforeData.caseStudies?.length || 0;
    console.log(`✅ ${countBefore} case studies présents AVANT le test`);
    
    const idsBefore = beforeData.caseStudies?.map((cs: any) => cs.id) || [];
    console.log("📋 IDs AVANT:", idsBefore);

    // 2. Créer un case study de test
    console.log("\n2️⃣ Création d'un case study de test...");
    const testCaseStudy = {
      id: `test-kv-deletion-${Date.now()}`,
      title: "Test KV Deletion",
      title_en: "Test KV Deletion EN",
      client: "Test Client",
      category: "Test",
      category_en: "Test",
      year: "2025",
      featured: false,
      thumbnail: "https://via.placeholder.com/400x300",
      tagline: "Test tagline",
      tagline_en: "Test tagline EN",
      description: "Test description",
      description_en: "Test description EN",
      tags: ["test"],
      tags_en: ["test"],
      challenge: {
        title: "Test Challenge",
        title_en: "Test Challenge EN",
        description: "Test",
        description_en: "Test",
        painPoints: ["Test"],
        painPoints_en: ["Test"],
      },
      solution: {
        title: "Test Solution",
        title_en: "Test Solution EN",
        description: "Test",
        description_en: "Test",
        approach: ["Test"],
        approach_en: ["Test"],
        technologies: ["Test"],
      },
      results: {
        title: "Test Results",
        title_en: "Test Results EN",
        description: "Test",
        description_en: "Test",
        metrics: [],
      },
      testimonial: {
        quote: "Test",
        quote_en: "Test",
        author: "Test",
        role: "Test",
        role_en: "Test",
        company: "Test",
      },
      process: [],
      images: [],
      published: true,
    };

    const createResponse = await fetch(`${API_BASE}/case-studies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(testCaseStudy),
    });

    if (!createResponse.ok) {
      throw new Error("Échec de la création du case study de test");
    }

    console.log(`✅ Case study de test créé: ${testCaseStudy.id}`);

    // 3. Vérifier qu'il existe
    console.log("\n3️⃣ Vérification de l'existence du case study...");
    const afterCreateResponse = await fetch(`${API_BASE}/case-studies`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });
    const afterCreateData = await afterCreateResponse.json();
    const foundAfterCreate = afterCreateData.caseStudies?.find(
      (cs: any) => cs.id === testCaseStudy.id
    );

    if (!foundAfterCreate) {
      console.error("❌ Case study de test NON trouvé après création!");
      return;
    }

    console.log("✅ Case study de test trouvé après création");
    console.log(`📊 Total case studies après création: ${afterCreateData.caseStudies?.length}`);

    // 4. SUPPRIMER le case study
    console.log("\n4️⃣ Suppression du case study de test...");
    const deleteResponse = await fetch(`${API_BASE}/case-studies/${testCaseStudy.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    const deleteData = await deleteResponse.json();
    console.log("📡 Réponse de suppression:", deleteData);

    // AFFICHER LES LOGS DE DIAGNOSTIC
    if (deleteData.diagnosticLogs && deleteData.diagnosticLogs.length > 0) {
      console.log("\n🔍 LOGS DE DIAGNOSTIC DU SERVEUR:");
      console.log("─────────────────────────────────────────────────────────────────");
      deleteData.diagnosticLogs.forEach((log: string) => {
        console.log(log);
      });
      console.log("─────────────────────────────────────────────────────────────────");
    }

    if (!deleteResponse.ok) {
      console.error("❌ Échec de la suppression:", deleteData);
      
      if (deleteData.stillPresent) {
        console.error(`
❌ PROBLÈME CRITIQUE DÉTECTÉ !
═══════════════════════════════════════════════════════════════════

Le case study a été supprimé avec kv.del() mais il est TOUJOURS 
présent dans getByPrefix() !

Cela signifie que kv.del() ne fonctionne PAS correctement ou que
le prefix utilisé dans getByPrefix() ne correspond pas à la clé
utilisée dans kv.del().

Case study encore présent:
`, deleteData.stillPresent);
      }
      
      return;
    }

    // 5. Vérifier qu'il n'existe PLUS
    console.log("\n5️⃣ Vérification de la suppression...");
    const afterDeleteResponse = await fetch(`${API_BASE}/case-studies`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });
    const afterDeleteData = await afterDeleteResponse.json();
    const foundAfterDelete = afterDeleteData.caseStudies?.find(
      (cs: any) => cs.id === testCaseStudy.id
    );

    console.log(`📊 Total case studies après suppression: ${afterDeleteData.caseStudies?.length}`);
    
    const idsAfter = afterDeleteData.caseStudies?.map((cs: any) => cs.id) || [];
    console.log("📋 IDs APRÈS:", idsAfter);

    if (foundAfterDelete) {
      console.error(`
❌ TEST ÉCHOUÉ !
═══════════════════════════════════════════════════════════════════

Le case study de test est TOUJOURS présent après suppression !

Case study trouvé:`, foundAfterDelete);
      
      console.error(`
💡 CAUSE PROBABLE:
   - kv.del() ne supprime pas réellement les données
   - OU le prefix dans getByPrefix() ne correspond pas à la clé dans del()
   - OU il y a un cache qui n'est pas invalidé
      `);
      
    } else {
      console.log(`
✅ TEST RÉUSSI !
═══════════════════════════════════════════════════════════════════

Le case study de test a été correctement supprimé !
Il n'apparaît plus dans getByPrefix().

Nombre avant: ${countBefore}
Nombre après création: ${afterCreateData.caseStudies?.length}
Nombre après suppression: ${afterDeleteData.caseStudies?.length}

La suppression fonctionne correctement !
      `);
    }

  } catch (error: unknown) {
    console.error("❌ Erreur lors du test:", error);
  }

  console.log(`
══════════════════════════════════════════════════════════════════
  `);
}

// Expose globally
if (typeof window !== "undefined") {
  (window as any).testKVDeletion = testKVDeletion;
  
  console.log(`
🧪 FONCTION DE TEST DISPONIBLE:

   testKVDeletion()
   → Teste la suppression KV avec un case study temporaire

══════════════════════════════════════════════════════════════════
  `);
}

