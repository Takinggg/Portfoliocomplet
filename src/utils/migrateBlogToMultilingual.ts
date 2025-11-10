import { projectId, publicAnonKey } from "./supabase/info";

/**
 * Script de migration pour convertir les anciens articles de blog
 * au nouveau format multilingue (title_fr, title_en, content_fr, content_en, etc.)
 * 
 * Ce script :
 * 1. Récupère tous les articles existants
 * 2. Pour chaque article :
 *    - Si title_fr n'existe pas, copie title → title_fr
 *    - Si title_en n'existe pas, met une version anglaise par défaut ou copie title
 *    - Idem pour excerpt et content
 * 3. Met à jour l'article dans la base de données
 */

export async function migrateBlogToMultilingual() {
  console.log("🔄 Starting blog migration to multilingual format...");

  try {
    // Fetch all blog posts (without lang parameter to get raw data)
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts?lang=raw`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const posts = await response.json();
    console.log(`📚 Found ${posts.length} posts to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const post of posts) {
      // Check if post is already in multilingual format
      if (post.title_fr && post.title_en && post.content_fr && post.content_en) {
        console.log(`⏭️  Skipping "${post.title}" - already migrated`);
        skippedCount++;
        continue;
      }

      // Prepare migrated data
      const migratedPost = {
        ...post,
        // French versions (use existing data or legacy fields)
        title_fr: post.title_fr || post.title || "Article sans titre",
        excerpt_fr: post.excerpt_fr || post.excerpt || "",
        content_fr: post.content_fr || post.content || "",
        
        // English versions (default to French for manual translation later)
        title_en: post.title_en || post.title || "Untitled Article",
        excerpt_en: post.excerpt_en || post.excerpt || "",
        content_en: post.content_en || post.content || "",
        
        // Keep legacy fields for backward compatibility
        title: post.title_fr || post.title,
        excerpt: post.excerpt_fr || post.excerpt,
        content: post.content_fr || post.content,
      };

      // Update the post
      const updateResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts/${post.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(migratedPost),
        }
      );

      if (updateResponse.ok) {
        console.log(`✅ Migrated: "${post.title}"`);
        migratedCount++;
      } else {
        console.error(`❌ Failed to migrate: "${post.title}"`);
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`✅ Migration complete!`);
    console.log(`   Migrated: ${migratedCount} posts`);
    console.log(`   Skipped: ${skippedCount} posts (already migrated)`);
    console.log(`   Total: ${posts.length} posts`);
    console.log("=".repeat(50));
    
    return {
      success: true,
      migrated: migratedCount,
      skipped: skippedCount,
      total: posts.length,
    };
  } catch (error) {
    console.error("❌ Migration failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Run migration if this file is executed directly
if (import.meta.main) {
  migrateBlogToMultilingual();
}
