import { projectId, publicAnonKey } from "./supabase/info";
import { createClient } from "./supabase/client";

/**
 * Fix FAQ Category Not Found Error
 * Diagnostic et nettoyage des références orphelines
 */
export async function fixFAQCategoryNotFound() {
  try {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║      🔧 FIX FAQ CATEGORY NOT FOUND - DIAGNOSTIC ET SOLUTION     ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
    `);

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log(`
⚠️ AUTHENTIFICATION REQUISE
────────────────────────────────────────────────────────────────────

Vous devez être connecté au Dashboard pour utiliser cette fonction.

1. Allez sur /login
2. Connectez-vous avec vos identifiants
3. Re-exécutez : await window.fixFAQCategoryNotFound()
      `);
      return { error: "Not authenticated" };
    }

    const authHeader = `Bearer ${session.access_token}`;

    // Step 1: Get all FAQ categories
    console.log("📦 Étape 1/3 : Récupération des catégories FAQ existantes...\n");
    
    const categoriesResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-categories`,
      {
        headers: { Authorization: authHeader },
      }
    );

    if (!categoriesResponse.ok) {
      console.error("❌ Erreur lors de la récupération des catégories");
      console.error(`   Status: ${categoriesResponse.status}`);
      return { error: "Failed to fetch categories" };
    }

    const categoriesData = await categoriesResponse.json();
    const categories = categoriesData.categories || [];

    console.log(`✅ ${categories.length} catégories trouvées\n`);

    if (categories.length === 0) {
      console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║                    ⚠️ AUCUNE CATÉGORIE TROUVÉE                  ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

Le problème est que les catégories FAQ n'existent pas encore
dans la base de données.

🔧 SOLUTION IMMÉDIATE
────────────────────────────────────────────────────────────────────

Initialisez les catégories FAQ avec :

  await window.seedFAQData()

Cela va créer :
  • 6 catégories FAQ avec icônes
  • 37 questions FAQ bilingues (FR + EN)

Temps : 30 secondes
      `);
      
      return { 
        status: "no_categories",
        message: "No FAQ categories found. Run seedFAQData() to initialize."
      };
    }

    // Step 2: Get all FAQ questions
    console.log("📝 Étape 2/3 : Récupération des questions FAQ...\n");
    
    const questionsResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq`,
      {
        headers: { Authorization: authHeader },
      }
    );

    if (!questionsResponse.ok) {
      console.error("❌ Erreur lors de la récupération des questions");
      return { error: "Failed to fetch questions" };
    }

    const questionsData = await questionsResponse.json();
    const questions = questionsData.faqs || [];

    console.log(`✅ ${questions.length} questions trouvées\n`);

    // Step 3: Find orphaned questions (questions without valid category)
    console.log("🔍 Étape 3/3 : Recherche de questions orphelines...\n");

    const validCategoryIds = categories.map((c) => c.id);
    const orphanedQuestions = questions.filter((q) => {
      const categoryId = q.categoryId || q.category;
      return categoryId && !validCategoryIds.includes(categoryId);
    });

    console.log(`📊 Résultats :\n`);
    console.log(`   • Catégories valides : ${validCategoryIds.length}`);
    console.log(`   • Questions totales   : ${questions.length}`);
    console.log(`   • Questions orphelines: ${orphanedQuestions.length}\n`);

    if (orphanedQuestions.length === 0) {
      console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║                    ✅ TOUT EST EN ORDRE !                       ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

Toutes les questions FAQ sont liées à des catégories valides.

🎯 CATÉGORIES DISPONIBLES (${validCategoryIds.length})
────────────────────────────────────────────────────────────────────

${categories.map((c, i: number) => `${i + 1}. ${c.name || c.id} (${c.icon || 'no icon'})`).join('\n')}

📝 QUESTIONS (${questions.length})
────────────────────────────────────────────────────────────────────

Toutes correctement assignées à des catégories valides.

Si vous voyez toujours l'erreur "FAQ category not found",
c'est probablement une référence en cache dans le navigateur.

🔧 SOLUTION :
  1. Rechargez la page (F5)
  2. Videz le cache : Cmd+Shift+R (Mac) ou Ctrl+Shift+R (Windows)
  3. Vérifiez la console pour voir les logs de chargement
      `);
      
      return {
        status: "ok",
        categories: validCategoryIds.length,
        questions: questions.length,
        orphaned: 0
      };
    }

    // We have orphaned questions - offer to fix them
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║              ⚠️ QUESTIONS ORPHELINES DÉTECTÉES !                ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

${orphanedQuestions.length} question(s) référence(nt) des catégories
qui n'existent plus dans la base de données.

QUESTIONS ORPHELINES :
────────────────────────────────────────────────────────────────────
    `);

    orphanedQuestions.forEach((q, i: number) => {
      console.log(`
${i + 1}. Question : ${q.question || q.id}
   Catégorie manquante : ${q.categoryId || q.category}
      `);
    });

    console.log(`
🔧 OPTIONS DE CORRECTION
────────────────────────────────────────────────────────────────────

OPTION 1 - SUPPRIMER LES QUESTIONS ORPHELINES (Recommandé)
────────────────────────────────────────────────────────────────────

Supprime les questions qui référencent des catégories inexistantes.

  await window.deleteOrphanedFAQQuestions()


OPTION 2 - RÉASSIGNER À UNE CATÉGORIE EXISTANTE
────────────────────────────────────────────────────────────────────

Réassigne les questions orphelines à la première catégorie disponible.

  await window.reassignOrphanedFAQQuestions()


OPTION 3 - RÉINITIALISER COMPLÈTEMENT LES FAQ
────────────────────────────────────────────────────────────────────

Supprime TOUT et recrée 6 catégories + 37 questions.

  await window.resetFAQCompletely()
    `);

    return {
      status: "orphaned_questions_found",
      categories: validCategoryIds.length,
      questions: questions.length,
      orphaned: orphanedQuestions.length,
      orphanedQuestions: orphanedQuestions.map((q) => ({
        id: q.id,
        question: q.question,
        invalidCategory: q.categoryId || q.category
      }))
    };

  } catch (error: unknown) {
    console.error("❌ Erreur lors du diagnostic FAQ:", error);
    return { error: error.message };
  }
}

/**
 * Delete orphaned FAQ questions
 */
export async function deleteOrphanedFAQQuestions() {
  try {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║         🗑️ SUPPRESSION DES QUESTIONS ORPHELINES FAQ            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
    `);

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("⚠️ Vous devez être connecté");
      return;
    }

    const authHeader = `Bearer ${session.access_token}`;

    // Get categories and questions
    const categoriesRes = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-categories`,
      { headers: { Authorization: authHeader } }
    );
    const categoriesData = await categoriesRes.json();
    const categories = categoriesData.categories || [];
    const validCategoryIds = categories.map((c) => c.id);

    const questionsRes = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq`,
      { headers: { Authorization: authHeader } }
    );
    const questionsData = await questionsRes.json();
    const questions = questionsData.faqs || [];

    const orphanedQuestions = questions.filter((q) => {
      const categoryId = q.categoryId || q.category;
      return categoryId && !validCategoryIds.includes(categoryId);
    });

    if (orphanedQuestions.length === 0) {
      console.log("✅ Aucune question orpheline à supprimer");
      return { deleted: 0 };
    }

    console.log(`📦 ${orphanedQuestions.length} question(s) orpheline(s) trouvée(s)\n`);

    let deleted = 0;
    for (const question of orphanedQuestions) {
      console.log(`🗑️ Suppression : ${question.question}...`);
      
      const deleteRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq/${question.id}`,
        {
          method: "DELETE",
          headers: { Authorization: authHeader }
        }
      );

      if (deleteRes.ok) {
        console.log(`  ✅ Supprimée`);
        deleted++;
      } else {
        console.log(`  ❌ Erreur`);
      }
    }

    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║                   ✅ NETTOYAGE TERMINÉ !                        ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

🗑️ Questions supprimées : ${deleted}
📝 Questions restantes   : ${questions.length - deleted}

Rechargez la page (F5) pour voir les changements.
    `);

    return { deleted, remaining: questions.length - deleted };

  } catch (error: unknown) {
    console.error("❌ Erreur:", error);
    return { error: error.message };
  }
}

/**
 * Reset FAQ completely
 */
export async function resetFAQCompletely() {
  try {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║          🔄 RÉINITIALISATION COMPLÈTE DES FAQ                   ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

⚠️ ATTENTION : Cette action va :
  • Supprimer TOUTES les catégories FAQ
  • Supprimer TOUTES les questions FAQ
  • Recréer 6 catégories avec icônes
  • Recréer 37 questions bilingues (FR + EN)

Voulez-vous continuer ?
────────────────────────────────────────────────────────────────────

Pour confirmer, tapez :

  await window.confirmResetFAQ()
    `);

    return { 
      status: "confirmation_required",
      message: "Run confirmResetFAQ() to confirm"
    };

  } catch (error: unknown) {
    console.error("❌ Erreur:", error);
    return { error: error.message };
  }
}

/**
 * Confirm and execute FAQ reset
 */
export async function confirmResetFAQ() {
  try {
    console.log("🔄 Réinitialisation en cours...\n");

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("⚠️ Vous devez être connecté");
      return;
    }

    const authHeader = `Bearer ${session.access_token}`;

    // Delete all questions
    console.log("1️⃣ Suppression des questions...");
    const questionsRes = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq`,
      { headers: { Authorization: authHeader } }
    );
    const questionsData = await questionsRes.json();
    const questions = questionsData.faqs || [];

    for (const q of questions) {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq/${q.id}`,
        { method: "DELETE", headers: { Authorization: authHeader } }
      );
    }
    console.log(`   ✅ ${questions.length} questions supprimées\n`);

    // Delete all categories
    console.log("2️⃣ Suppression des catégories...");
    const categoriesRes = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-categories`,
      { headers: { Authorization: authHeader } }
    );
    const categoriesData = await categoriesRes.json();
    const categories = categoriesData.categories || [];

    for (const c of categories) {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-categories/${c.id}`,
        { method: "DELETE", headers: { Authorization: authHeader } }
      );
    }
    console.log(`   ✅ ${categories.length} catégories supprimées\n`);

    // Recreate with seedFAQData
    console.log("3️⃣ Recréation des catégories et questions...");
    
    // Import dynamically
    const { seedFAQData } = await import("./seedFAQ");
    await seedFAQData();

    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║              🎉 RÉINITIALISATION TERMINÉE !                     ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

✅ FAQ complètement réinitialisées avec :
  • 6 catégories avec icônes ✨💰⏰💬⚡🛡️
  • 37 questions bilingues (FR + EN)

Rechargez la page (F5) pour voir les changements.
    `);

    return { success: true };

  } catch (error: unknown) {
    console.error("❌ Erreur:", error);
    return { error: error.message };
  }
}

// Make available globally
if (typeof window !== "undefined") {
  (window as any).fixFAQCategoryNotFound = fixFAQCategoryNotFound;
  (window as any).deleteOrphanedFAQQuestions = deleteOrphanedFAQQuestions;
  (window as any).resetFAQCompletely = resetFAQCompletely;
  (window as any).confirmResetFAQ = confirmResetFAQ;
}



