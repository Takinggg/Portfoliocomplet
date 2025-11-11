/**
 * Clean Orphaned FAQ Questions
 * 
 * Supprime les questions FAQ qui référencent des catégories inexistantes
 */

import { projectId, publicAnonKey } from './supabase/info';

export async function cleanOrphanedFAQQuestions() {
  console.log("🧹 Starting cleanup of orphaned FAQ questions...");
  
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
        console.log(`❌ Orphaned question found: "${q.question}" (category: ${categoryId})`);
      }
      
      return isOrphaned;
    });
    
    console.log(`🗑️  Found ${orphanedQuestions.length} orphaned questions`);
    
    if (orphanedQuestions.length === 0) {
      console.log("✅ No orphaned questions found. Database is clean!");
      return { success: true, deleted: 0, message: "No orphaned questions found" };
    }
    
    // Step 4: Delete orphaned questions
    console.log(`🗑️  Deleting ${orphanedQuestions.length} orphaned questions...`);
    
    let deletedCount = 0;
    let failedCount = 0;
    
    for (const question of orphanedQuestions) {
      try {
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
          deletedCount++;
        } else {
          console.error(`  ❌ Failed to delete: ${question.id}`);
          failedCount++;
        }
      } catch (error) {
        console.error(`  ❌ Error deleting ${question.id}:`, error);
        failedCount++;
      }
    }
    
    console.log(`\n✅ Cleanup complete!`);
    console.log(`   Deleted: ${deletedCount}`);
    console.log(`   Failed: ${failedCount}`);
    console.log(`   Total processed: ${orphanedQuestions.length}`);
    
    return {
      success: true,
      deleted: deletedCount,
      failed: failedCount,
      total: orphanedQuestions.length,
      message: `Deleted ${deletedCount} orphaned questions`
    };
    
  } catch (error: unknown) {
    console.error("❌ Error during cleanup:", error);
    return { success: false, error: error.message };
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).cleanOrphanedFAQQuestions = cleanOrphanedFAQQuestions;
}

