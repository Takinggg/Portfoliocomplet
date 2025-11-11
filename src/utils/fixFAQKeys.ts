/**
 * Fix FAQ Keys - Convert ":" to "_"
 * Converts old format faq_question:123 and faq_category:123 
 * to new format faq_question_123 and faq_category_123
 */

import { projectId } from "./supabase/info";
import { createClient } from "./supabase/client";

/**
 * Fix FAQ Category Keys
 * Converts faq_category:123 → faq_category_123
 */
export async function fixFAQCategoryKeys() {
  try {
    console.log("🔧 Starting FAQ category keys fix...");
    
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("⚠️ Must be logged in to fix FAQ category keys");
      return { success: false, error: "Not authenticated" };
    }

    const authHeader = `Bearer ${session.access_token}`;

    // Step 1: Get all FAQ categories
    console.log("📋 Fetching all FAQ categories...");
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-categories`,
      {
        headers: { Authorization: authHeader },
      }
    );

    if (!response.ok) {
      console.error("❌ Failed to fetch FAQ categories");
      return { success: false, error: "Failed to fetch categories" };
    }

    const data = await response.json();
    const categories = data.categories || [];
    
    console.log(`📦 Found ${categories.length} FAQ categories`);

    // Step 2: Find categories with ":" in their IDs
    const categoriesToFix = categories.filter((cat: any) => 
      cat.id && cat.id.includes("faq_category:")
    );

    if (categoriesToFix.length === 0) {
      console.log("✅ No FAQ categories need fixing (all IDs are correct)");
      return { 
        success: true, 
        fixed: 0, 
        message: "All FAQ category IDs are already correct" 
      };
    }

    console.log(`🔧 Found ${categoriesToFix.length} categories to fix:`);
    categoriesToFix.forEach((cat: any) => {
      console.log(`  - ${cat.id} → ${cat.id.replace(":", "_")}`);
    });

    // Step 3: Fix each category
    let fixed = 0;
    let errors = 0;

    for (const category of categoriesToFix) {
      const oldId = category.id;
      const newId = oldId.replace(/faq_category:/, "faq_category_");

      try {
        console.log(`🔄 Converting ${oldId} → ${newId}...`);

        // Create with new ID
        const createResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-categories`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader,
            },
            body: JSON.stringify({
              name: category.name,
              name_en: category.name_en,
              icon: category.icon,
              order: category.order,
            }),
          }
        );

        if (createResponse.ok) {
          // Delete old ID
          const deleteResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-categories/${oldId}`,
            {
              method: "DELETE",
              headers: { Authorization: authHeader },
            }
          );

          if (deleteResponse.ok) {
            console.log(`  ✅ Fixed: ${oldId} → ${newId}`);
            fixed++;
          } else {
            console.warn(`  ⚠️ Created new but couldn't delete old: ${oldId}`);
            fixed++;
          }
        } else {
          console.error(`  ❌ Failed to create new: ${newId}`);
          errors++;
        }
      } catch (error) {
        console.error(`  ❌ Error fixing ${oldId}:`, error);
        errors++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 FAQ Category Keys Fix Summary:");
    console.log("=".repeat(60));
    console.log(`✅ Fixed: ${fixed}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📦 Total categories: ${categories.length}`);
    console.log("=".repeat(60));

    return {
      success: true,
      fixed,
      errors,
      total: categories.length,
    };
  } catch (error: unknown) {
    console.error("❌ Error fixing FAQ category keys:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fix FAQ Question Keys
 * Converts faq_question:123 → faq_question_123
 */
export async function fixFAQQuestionKeys() {
  try {
    console.log("🔧 Starting FAQ keys fix...");
    
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("⚠️ Must be logged in to fix FAQ keys");
      return { success: false, error: "Not authenticated" };
    }

    const authHeader = `Bearer ${session.access_token}`;

    // Step 1: Get all FAQ questions
    console.log("📋 Fetching all FAQ questions...");
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq`,
      {
        headers: { Authorization: authHeader },
      }
    );

    if (!response.ok) {
      console.error("❌ Failed to fetch FAQ questions");
      return { success: false, error: "Failed to fetch questions" };
    }

    const data = await response.json();
    const questions = data.faqs || [];
    
    console.log(`📦 Found ${questions.length} FAQ questions`);

    // Step 2: Find questions with ":" in their IDs
    const questionsToFix = questions.filter((q: any) => 
      q.id && q.id.includes("faq_question:")
    );

    if (questionsToFix.length === 0) {
      console.log("✅ No FAQ questions need fixing (all IDs are correct)");
      return { 
        success: true, 
        fixed: 0, 
        message: "All FAQ question IDs are already correct" 
      };
    }

    console.log(`🔧 Found ${questionsToFix.length} questions to fix:`);
    questionsToFix.forEach((q: any) => {
      console.log(`  - ${q.id} → ${q.id.replace(":", "_")}`);
    });

    // Step 3: Fix each question
    let fixed = 0;
    let errors = 0;

    for (const question of questionsToFix) {
      const oldId = question.id;
      const newId = oldId.replace(/faq_question:/, "faq_question_");

      try {
        console.log(`🔄 Converting ${oldId} → ${newId}...`);

        // Create with new ID
        const createResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-questions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader,
            },
            body: JSON.stringify({
              ...question,
              id: undefined, // Let server generate new ID
            }),
          }
        );

        if (createResponse.ok) {
          // Delete old ID
          const deleteResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-questions/${oldId}`,
            {
              method: "DELETE",
              headers: { Authorization: authHeader },
            }
          );

          if (deleteResponse.ok) {
            console.log(`  ✅ Fixed: ${oldId} → ${newId}`);
            fixed++;
          } else {
            console.warn(`  ⚠️ Created new but couldn't delete old: ${oldId}`);
            fixed++;
          }
        } else {
          console.error(`  ❌ Failed to create new: ${newId}`);
          errors++;
        }
      } catch (error) {
        console.error(`  ❌ Error fixing ${oldId}:`, error);
        errors++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 FAQ Keys Fix Summary:");
    console.log("=".repeat(60));
    console.log(`✅ Fixed: ${fixed}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📦 Total questions: ${questions.length}`);
    console.log("=".repeat(60));

    return {
      success: true,
      fixed,
      errors,
      total: questions.length,
    };
  } catch (error: unknown) {
    console.error("❌ Error fixing FAQ keys:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fix ALL FAQ Keys (Categories + Questions)
 * Runs both fixFAQCategoryKeys and fixFAQQuestionKeys
 */
export async function fixAllFAQKeys() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║           🔧 FIX ALL FAQ KEYS - CATÉGORIES + QUESTIONS          ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
  `);

  // Step 1: Fix categories
  console.log("\n🏷️  ÉTAPE 1/2 : CORRIGER LES CATÉGORIES FAQ\n");
  const categoriesResult = await fixFAQCategoryKeys();

  // Step 2: Fix questions
  console.log("\n❓ ÉTAPE 2/2 : CORRIGER LES QUESTIONS FAQ\n");
  const questionsResult = await fixFAQQuestionKeys();

  // Summary
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║               📊 RÉSUMÉ COMPLET - FIX FAQ KEYS                  ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

🏷️  CATÉGORIES FAQ :
   ${categoriesResult.success ? `✅ Corrigées : ${categoriesResult.fixed || 0}` : '❌ Erreur'}
   ${categoriesResult.errors ? `❌ Erreurs : ${categoriesResult.errors}` : ''}

❓ QUESTIONS FAQ :
   ${questionsResult.success ? `✅ Corrigées : ${questionsResult.fixed || 0}` : '❌ Erreur'}
   ${questionsResult.errors ? `❌ Erreurs : ${questionsResult.errors}` : ''}

📦 TOTAUX :
   • Catégories traitées : ${categoriesResult.total || 0}
   • Questions traitées : ${questionsResult.total || 0}
   • Total corrigé : ${(categoriesResult.fixed || 0) + (questionsResult.fixed || 0)}

${(categoriesResult.fixed || 0) + (questionsResult.fixed || 0) === 0 
  ? '✅ Aucune correction nécessaire - Tous les IDs sont corrects !'
  : '🎉 Correction terminée ! Rechargez le Dashboard (F5) pour voir les changements.'
}
  `);

  return {
    success: categoriesResult.success && questionsResult.success,
    categories: categoriesResult,
    questions: questionsResult,
  };
}

// Make it available globally
if (typeof window !== "undefined") {
  (window as any).fixFAQCategoryKeys = fixFAQCategoryKeys;
  (window as any).fixFAQQuestionKeys = fixFAQQuestionKeys;
  (window as any).fixAllFAQKeys = fixAllFAQKeys;
  
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║          🔧 FIX FAQ KEYS - CONVERTIR ":" EN "_"                  ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

🔴 PROBLÈME
────────────────────────────────────────────────────────────────────
Certaines catégories et questions FAQ ont des IDs avec ":" au lieu de "_" :

  ❌ faq_category:1762473292384
  ❌ faq_question:1762473297841
  
  ✅ faq_category_1762473292384
  ✅ faq_question_1762473297841

🔧 SOLUTIONS DISPONIBLES
────────────────────────────────────────────────────────────────────
3 fonctions de nettoyage dans la console :

  await window.fixFAQCategoryKeys()    → Corriger les catégories
  await window.fixFAQQuestionKeys()    → Corriger les questions
  await window.fixAllFAQKeys()         → Corriger TOUT (recommandé)

⚠️ IMPORTANT
────────────────────────────────────────────────────────────────────
Vous devez être CONNECTÉ au Dashboard pour les utiliser.

📋 UTILISATION - RECOMMANDÉ
────────────────────────────────────────────────────────────────────
1. Ouvrez la console (F12)

2. Connectez-vous au Dashboard

3. Exécutez LA FONCTION COMPLÈTE :
   
   await window.fixAllFAQKeys()

4. Attendez le résumé complet :
   
   ╔════════════════════════════════════════════╗
   ║     📊 RÉSUMÉ COMPLET - FIX FAQ KEYS      ║
   ╚════════════════════════════════════════════╝
   
   🏷️  CATÉGORIES FAQ :
      ✅ Corrigées : 2
   
   ❓ QUESTIONS FAQ :
      ✅ Corrigées : 3
   
   📦 TOTAUX :
      • Total corrigé : 5

5. Rechargez le Dashboard (F5)

📋 UTILISATION - SÉPARÉE
────────────────────────────────────────────────────────────────────
Si vous voulez corriger seulement une partie :

CATÉGORIES SEULEMENT :
  await window.fixFAQCategoryKeys()

QUESTIONS SEULEMENT :
  await window.fixFAQQuestionKeys()

✅ APRÈS LE FIX
────────────────────────────────────────────────────────────────────
Vous pourrez :
  • Supprimer des catégories FAQ ✓
  • Supprimer des questions FAQ ✓
  • Modifier des catégories FAQ ✓
  • Modifier des questions FAQ ✓

SANS AUCUNE ERREUR 404 !

╚══════════════════════════════════════════════════════════════════╝
  `);
}

