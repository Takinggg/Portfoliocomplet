/**
 * Fix Orphaned FAQ Questions
 * 
 * Assigne les questions FAQ orphelines à une catégorie par défaut
 * au lieu de les supprimer (approche plus sûre)
 */

import { projectId, publicAnonKey } from './supabase/info';

export async function fixOrphanedFAQQuestions(options: {
  deleteOrphans?: boolean; // Si true, supprime au lieu de réassigner
  defaultCategoryId?: string; // Catégorie par défaut pour réassigner
} = {}) {
  const { deleteOrphans = false, defaultCategoryId } = options;
  
  console.log("🔧 Starting fix of orphaned FAQ questions...");
  console.log(`   Mode: ${deleteOrphans ? 'DELETE' : 'REASSIGN'}`);
  
  try {
    // Get admin session from localStorage
    const sessionStr = localStorage.getItem('admin_session');
    if (!sessionStr) {
      console.error("❌ No admin session found. Please login first.");
      return { success: false, error: "Not authenticated" };
    }
    
    const session = JSON.parse(sessionStr);
    const accessToken = session.access_token;
    
    // Step 1: Load all categories
    console.log("📦 Loading FAQ categories...");
    const categoriesResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-categories`,
      {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      }
    );
    
    if (!categoriesResponse.ok) {
      throw new Error("Failed to load categories");
    }
    
    const categoriesData = await categoriesResponse.json();
    const categories = categoriesData.categories || [];
    const validCategoryIds = new Set(categories.map((cat: any) => cat.id));
    
    console.log(`✅ Found ${categories.length} valid categories:`, Array.from(validCategoryIds));
    
    // Find or create "General" category if we're reassigning
    let targetCategoryId = defaultCategoryId;
    if (!deleteOrphans && !targetCategoryId) {
      // Try to find a "General" or "Autre" category
      const generalCategory = categories.find((cat: any) => 
        cat.name.toLowerCase().includes('général') || 
        cat.name.toLowerCase().includes('general') ||
        cat.name.toLowerCase().includes('autre') ||
        cat.id === 'cat_general'
      );
      
      if (generalCategory) {
        targetCategoryId = generalCategory.id;
        console.log(`✅ Using existing category: ${generalCategory.name} (${targetCategoryId})`);
      } else {
        // Create a default category
        console.log("📦 Creating default 'General' category...");
        const createResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-categories`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: "Général",
              name_en: "General",
              icon: "HelpCircle",
              order: 999,
            }),
          }
        );
        
        if (createResponse.ok) {
          const newCategory = await createResponse.json();
          targetCategoryId = newCategory.category.id;
          console.log(`✅ Created default category: ${targetCategoryId}`);
        } else {
          throw new Error("Failed to create default category");
        }
      }
    }
    
    // Step 2: Load all questions
    console.log("📦 Loading FAQ questions...");
    const questionsResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq`,
      {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      }
    );
    
    if (!questionsResponse.ok) {
      throw new Error("Failed to load questions");
    }
    
    const questionsData = await questionsResponse.json();
    const questions = questionsData.faqs || [];
    
    console.log(`📋 Found ${questions.length} total questions`);
    
    // Step 3: Find orphaned questions
    const orphanedQuestions = questions.filter((q: any) => {
      const categoryId = q.category || q.categoryId;
      const isOrphaned = !validCategoryIds.has(categoryId);
      
      if (isOrphaned) {
        console.log(`❌ Orphaned question found: "${q.question}" (invalid category: ${categoryId})`);
      }
      
      return isOrphaned;
    });
    
    console.log(`🔧 Found ${orphanedQuestions.length} orphaned questions`);
    
    if (orphanedQuestions.length === 0) {
      console.log("✅ No orphaned questions found. Database is clean!");
      return { success: true, fixed: 0, message: "No orphaned questions found" };
    }
    
    // Step 4: Fix orphaned questions
    console.log(`🔧 ${deleteOrphans ? 'Deleting' : 'Reassigning'} ${orphanedQuestions.length} orphaned questions...`);
    
    let fixedCount = 0;
    let failedCount = 0;
    
    for (const question of orphanedQuestions) {
      try {
        if (deleteOrphans) {
          // DELETE MODE
          console.log(`  🗑️  Deleting: ${question.id} - "${question.question}"`);
          
          const deleteResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-questions/${question.id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          
          if (deleteResponse.ok) {
            console.log(`  ✅ Deleted: ${question.id}`);
            fixedCount++;
          } else {
            console.error(`  ❌ Failed to delete: ${question.id}`);
            failedCount++;
          }
        } else {
          // REASSIGN MODE
          console.log(`  🔧 Reassigning: ${question.id} - "${question.question}" to ${targetCategoryId}`);
          
          const updateResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-questions/${question.id}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...question,
                category: targetCategoryId,
                categoryId: targetCategoryId,
              }),
            }
          );
          
          if (updateResponse.ok) {
            console.log(`  ✅ Reassigned: ${question.id}`);
            fixedCount++;
          } else {
            console.error(`  ❌ Failed to reassign: ${question.id}`);
            failedCount++;
          }
        }
      } catch (error) {
        console.error(`  ❌ Error processing ${question.id}:`, error);
        failedCount++;
      }
    }
    
    console.log(`\n✅ Fix complete!`);
    console.log(`   Fixed: ${fixedCount}`);
    console.log(`   Failed: ${failedCount}`);
    console.log(`   Total processed: ${orphanedQuestions.length}`);
    
    return {
      success: true,
      fixed: fixedCount,
      failed: failedCount,
      total: orphanedQuestions.length,
      message: `${deleteOrphans ? 'Deleted' : 'Reassigned'} ${fixedCount} orphaned questions`
    };
    
  } catch (error: unknown) {
    console.error("❌ Error during fix:", error);
    return { success: false, error: error.message };
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).fixOrphanedFAQQuestions = fixOrphanedFAQQuestions;
  
  // Helper functions
  (window as any).deleteOrphanedFAQQuestions = () => {
    return fixOrphanedFAQQuestions({ deleteOrphans: true });
  };
  
  (window as any).reassignOrphanedFAQQuestions = () => {
    return fixOrphanedFAQQuestions({ deleteOrphans: false });
  };
}

