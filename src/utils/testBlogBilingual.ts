/**
 * Test du système de blog bilingue
 * Usage: await testBlogBilingual()
 */

import { projectId, publicAnonKey } from "./supabase/info";

export async function testBlogBilingual() {
  console.log("%c🌍 Test du Blog Bilingue", "font-size: 16px; font-weight: bold; color: #00FFC2");
  console.log("━".repeat(50));
  
  try {
    // 1. Test articles FR
    console.log("\n%c📝 Test Articles Français", "font-weight: bold; color: #00FFC2");
    const responseFr = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts?lang=fr`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );
    
    if (responseFr.ok) {
      const postsFr = await responseFr.json();
      console.log(`✅ ${postsFr.length} articles trouvés en français`);
      postsFr.forEach((post: any, i: number) => {
        console.log(`   ${i + 1}. ${post.title} (${post.slug})`);
      });
    } else {
      console.error("❌ Erreur récupération articles FR:", responseFr.status);
    }
    
    // 2. Test articles EN
    console.log("\n%c📝 Test Articles English", "font-weight: bold; color: #00FFC2");
    const responseEn = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts?lang=en`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );
    
    if (responseEn.ok) {
      const postsEn = await responseEn.json();
      console.log(`✅ ${postsEn.length} articles trouvés en anglais`);
      postsEn.forEach((post: any, i: number) => {
        console.log(`   ${i + 1}. ${post.title} (${post.slug})`);
      });
    } else {
      console.error("❌ Erreur récupération articles EN:", responseEn.status);
    }
    
    // 3. Résumé
    console.log("\n%c📊 Résumé", "font-weight: bold; color: #00FFC2");
    const totalFr = responseFr.ok ? (await responseFr.clone().json()).length : 0;
    const totalEn = responseEn.ok ? (await responseEn.clone().json()).length : 0;
    
    console.log(`   Articles FR: ${totalFr}`);
    console.log(`   Articles EN: ${totalEn}`);
    console.log(`   Total: ${totalFr + totalEn}`);
    
    if (totalFr === 0 && totalEn === 0) {
      console.log("\n%c⚠️ Aucun article trouvé", "color: orange; font-weight: bold");
      console.log("   Utilisez le bouton 'Initialiser Blog' pour créer les articles");
      console.log("   Ou exécutez: await seedBlogPostsBilingual()");
    } else if (totalFr === 0) {
      console.log("\n%c⚠️ Articles français manquants", "color: orange; font-weight: bold");
    } else if (totalEn === 0) {
      console.log("\n%c⚠️ Articles anglais manquants", "color: orange; font-weight: bold");
      console.log("   C'était le problème ! Utilisez seedBlogPostsBilingual()");
    } else {
      console.log("\n%c✅ Blog bilingue complet !", "color: #00FFC2; font-weight: bold");
    }
    
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
  
  console.log("\n" + "━".repeat(50));
}

/**
 * Test rapide pour voir si les articles changent selon la langue
 */
export async function testLanguageSwitching() {
  console.log("%c🔄 Test du Changement de Langue", "font-size: 16px; font-weight: bold; color: #00FFC2");
  
  const testLang = async (lang: string) => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts?lang=${lang}`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );
    
    if (response.ok) {
      const posts = await response.json();
      return posts;
    }
    return [];
  };
  
  const postsFr = await testLang("fr");
  const postsEn = await testLang("en");
  
  console.log(`\nFrançais: ${postsFr.length} articles`);
  console.log(`Anglais: ${postsEn.length} articles`);
  
  if (postsFr.length > 0 && postsEn.length > 0) {
    console.log("\n%c✅ Le changement de langue fonctionne !", "color: #00FFC2; font-weight: bold");
  } else if (postsFr.length > 0 && postsEn.length === 0) {
    console.log("\n%c❌ Pas d'articles en anglais !", "color: red; font-weight: bold");
    console.log("   Solution: Exécutez seedBlogPostsBilingual()");
  } else {
    console.log("\n%c⚠️ Problème détecté", "color: orange; font-weight: bold");
  }
}

// Export pour utilisation dans la console
if (typeof window !== 'undefined') {
  (window as any).testBlogBilingual = testBlogBilingual;
  (window as any).testLanguageSwitching = testLanguageSwitching;
}
