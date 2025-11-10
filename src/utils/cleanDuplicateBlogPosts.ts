/**
 * Nettoie les articles de blog dupliqués dans Supabase
 * 
 * Usage:
 * cleanDuplicateBlogPosts()
 */

import { projectId, publicAnonKey } from "./supabase/info";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  [key: string]: any;
}

export async function cleanDuplicateBlogPosts() {
  console.log("🧹 Nettoyage des articles de blog dupliqués...\n");

  try {
    // 1. Récupérer tous les articles
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/kv/getByPrefix`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ prefix: "blog_post_" }),
      }
    );

    if (!response.ok) {
      throw new Error("Impossible de récupérer les articles");
    }

    const posts: BlogPost[] = await response.json();
    console.log(`📊 ${posts.length} articles trouvés`);

    // 2. Détecter les doublons par ID
    const idMap = new Map<string, BlogPost[]>();
    posts.forEach(post => {
      if (!idMap.has(post.id)) {
        idMap.set(post.id, []);
      }
      idMap.get(post.id)!.push(post);
    });

    // 3. Identifier les IDs en double
    const duplicateIds: string[] = [];
    idMap.forEach((postList, id) => {
      if (postList.length > 1) {
        duplicateIds.push(id);
      }
    });

    if (duplicateIds.length === 0) {
      console.log("✅ Aucun doublon trouvé !");
      return { success: true, duplicatesRemoved: 0 };
    }

    console.log(`⚠️ ${duplicateIds.length} IDs dupliqués détectés:`);
    duplicateIds.forEach(id => {
      const count = idMap.get(id)!.length;
      console.log(`  - ${id} (${count} exemplaires)`);
    });

    // 4. Supprimer les doublons (garder le premier)
    let removedCount = 0;
    for (const id of duplicateIds) {
      const postList = idMap.get(id)!;
      // Garder le premier, supprimer les autres
      const toKeep = postList[0];
      const toRemove = postList.slice(1);

      console.log(`\n🔧 ID: ${id}`);
      console.log(`  ✅ Garder: "${toKeep.title}"`);
      
      for (const post of toRemove) {
        console.log(`  ❌ Supprimer: "${post.title}"`);
        
        // Trouver la clé KV (peut être différente de l'ID du post)
        const kvKey = `blog_post_${post.id.replace(/^blog_post[_:]/, "")}`;
        
        try {
          const deleteResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/kv/del`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${publicAnonKey}`,
              },
              body: JSON.stringify({ key: kvKey }),
            }
          );

          if (deleteResponse.ok) {
            removedCount++;
            console.log(`    ✓ Supprimé`);
          } else {
            console.log(`    ✗ Échec de suppression`);
          }
        } catch (error) {
          console.error(`    ✗ Erreur:`, error);
        }
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`✅ Nettoyage terminé !`);
    console.log(`   - ${duplicateIds.length} IDs dupliqués détectés`);
    console.log(`   - ${removedCount} doublons supprimés`);
    console.log(`   - ${posts.length - removedCount} articles restants`);
    console.log("=".repeat(60));

    return { 
      success: true, 
      duplicatesFound: duplicateIds.length,
      duplicatesRemoved: removedCount 
    };

  } catch (error) {
    console.error("❌ Erreur lors du nettoyage:", error);
    return { success: false, error };
  }
}

// Export pour utilisation dans la console
(window as any).cleanDuplicateBlogPosts = cleanDuplicateBlogPosts;

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  🧹 NETTOYAGE DES DOUBLONS DISPONIBLE                         ║
╚════════════════════════════════════════════════════════════════╝

Pour nettoyer les articles de blog dupliqués dans Supabase :

  cleanDuplicateBlogPosts()

Cela va :
  ✅ Détecter tous les IDs dupliqués
  ✅ Garder le premier exemplaire de chaque article
  ✅ Supprimer les doublons
  ✅ Afficher un rapport détaillé
`);
