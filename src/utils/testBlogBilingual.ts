/**
 * Test du systÃ¨me de blog bilingue
 * Usage: await testBlogBilingual()
 */

import { projectId, publicAnonKey } from "./supabase/info";

export async function testBlogBilingual() {
  console.log("%cðŸŒ Test du Blog Bilingue", "font-size: 16px; font-weight: bold; color: #CCFF00");
  console.log("â”".repeat(50));
  
  try {
    // 1. Test articles FR
    console.log("\n%cðŸ“ Test Articles FranÃ§ais", "font-weight: bold; color: #CCFF00");
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
      console.log(`âœ… ${postsFr.length} articles trouvÃ©s en franÃ§ais`);
      postsFr.forEach((post, i: number) => {
        console.log(`   ${i + 1}. ${post.title} (${post.slug})`);
      });
    } else {
      console.error("âŒ Erreur rÃ©cupÃ©ration articles FR:", responseFr.status);
    }
    
    // 2. Test articles EN
    console.log("\n%cðŸ“ Test Articles English", "font-weight: bold; color: #CCFF00");
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
      console.log(`âœ… ${postsEn.length} articles trouvÃ©s en anglais`);
      postsEn.forEach((post, i: number) => {
        console.log(`   ${i + 1}. ${post.title} (${post.slug})`);
      });
    } else {
      console.error("âŒ Erreur rÃ©cupÃ©ration articles EN:", responseEn.status);
    }
    
    // 3. RÃ©sumÃ©
    console.log("\n%cðŸ“Š RÃ©sumÃ©", "font-weight: bold; color: #CCFF00");
    const totalFr = responseFr.ok ? (await responseFr.clone().json()).length : 0;
    const totalEn = responseEn.ok ? (await responseEn.clone().json()).length : 0;
    
    console.log(`   Articles FR: ${totalFr}`);
    console.log(`   Articles EN: ${totalEn}`);
    console.log(`   Total: ${totalFr + totalEn}`);
    
    if (totalFr === 0 && totalEn === 0) {
      console.log("\n%câš ï¸ Aucun article trouvÃ©", "color: orange; font-weight: bold");
      console.log("   Utilisez le bouton 'Initialiser Blog' pour crÃ©er les articles");
      console.log("   Ou exÃ©cutez: await seedBlogPostsBilingual()");
    } else if (totalFr === 0) {
      console.log("\n%câš ï¸ Articles franÃ§ais manquants", "color: orange; font-weight: bold");
    } else if (totalEn === 0) {
      console.log("\n%câš ï¸ Articles anglais manquants", "color: orange; font-weight: bold");
      console.log("   C'Ã©tait le problÃ¨me ! Utilisez seedBlogPostsBilingual()");
    } else {
      console.log("\n%câœ… Blog bilingue complet !", "color: #CCFF00; font-weight: bold");
    }
    
  } catch (error) {
    console.error("âŒ Erreur lors du test:", error);
  }
  
  console.log("\n" + "â”".repeat(50));
}

/**
 * Test rapide pour voir si les articles changent selon la langue
 */
export async function testLanguageSwitching() {
  console.log("%cðŸ”„ Test du Changement de Langue", "font-size: 16px; font-weight: bold; color: #CCFF00");
  
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
  
  console.log(`\nFranÃ§ais: ${postsFr.length} articles`);
  console.log(`Anglais: ${postsEn.length} articles`);
  
  if (postsFr.length > 0 && postsEn.length > 0) {
    console.log("\n%câœ… Le changement de langue fonctionne !", "color: #CCFF00; font-weight: bold");
  } else if (postsFr.length > 0 && postsEn.length === 0) {
    console.log("\n%câŒ Pas d'articles en anglais !", "color: red; font-weight: bold");
    console.log("   Solution: ExÃ©cutez seedBlogPostsBilingual()");
  } else {
    console.log("\n%câš ï¸ ProblÃ¨me dÃ©tectÃ©", "color: orange; font-weight: bold");
  }
}

// Export pour utilisation dans la console
if (typeof window !== 'undefined') {
  (window as any).testBlogBilingual = testBlogBilingual;
  (window as any).testLanguageSwitching = testLanguageSwitching;
}

