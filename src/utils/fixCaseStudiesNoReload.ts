/**
 * 🔥 FIX CASE STUDIES - VERSION SANS AUTO-RELOAD
 * 
 * Cette version ne rafraîchit PAS automatiquement la page
 * pour éviter les problèmes dans la preview Figma.
 */

export async function fixCaseStudiesNoReload() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🔥 FIX CASE STUDIES - SANS AUTO-RELOAD                 ║
╚════════════════════════════════════════════════════════════╝

🎯 Étape 1/3 : Nettoyage...
`);

  try {
    // 1. Vider la liste de suppression permanente
    localStorage.removeItem("permanently_deleted_case_studies");
    console.log("✅ Liste de suppression permanente vidée");

    // 2. Supprimer les anciennes données corrompues
    localStorage.removeItem("local_case_studies");
    console.log("✅ Anciennes données supprimées");

    console.log(`
🎯 Étape 2/3 : Chargement des case studies bilingues...
`);

    // 3. Charger les case studies bilingues avec VRAIES URLs
    const { seedBilingualCaseStudies } = await import("./seedBilingualCaseStudies");
    seedBilingualCaseStudies();

    console.log(`
🎯 Étape 3/3 : Vérification...
`);

    // 4. Vérifier que les données sont correctes
    const stored = localStorage.getItem("local_case_studies");
    if (stored) {
      const caseStudies = JSON.parse(stored);
      
      // Vérifier les URLs
      const invalidUrls = caseStudies.filter((cs) => 
        !cs.thumbnail || 
        !cs.thumbnail.startsWith("http")
      );
      
      if (invalidUrls.length > 0) {
        console.error("❌ ATTENTION : Certaines URLs d'images sont invalides !");
        throw new Error("URLs d'images invalides détectées");
      }
      
      console.log(`
╔════════════════════════════════════════════════════════════╗
║  ✅ SUCCÈS - ${caseStudies.length} CASE STUDIES CHARGÉES                ║
╚════════════════════════════════════════════════════════════╝

📊 Case studies bilingues :
`);
      
      caseStudies.forEach((cs, index: number) => {
        const featuredIcon = cs.featured ? "⭐" : "•";
        console.log(`   ${featuredIcon} ${cs.title}`);
        console.log(`      Client: ${cs.client} | Catégorie: ${cs.category}`);
        if (cs.title_en) {
          console.log(`      🌐 Bilingue: FR + EN`);
        }
      });

      console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ TERMINÉ !

💡 PROCHAINES ÉTAPES :

   Dans le DASHBOARD :
   → Cliquez sur "Initialiser" pour recharger les données

   OU rafraîchissez manuellement :
   → Appuyez sur F5
   → Ou naviguez vers une autre section puis revenez

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

    } else {
      throw new Error("Aucune donnée dans le localStorage après le seed");
    }

  } catch (error) {
    console.error(`
╔════════════════════════════════════════════════════════════╗
║  ❌ ERREUR LORS DU FIX                                   ║
╚════════════════════════════════════════════════════════════╝

Erreur : ${error}

💡 Utilisez le bouton "Initialiser" dans le dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
  }
}

// Expose globally
if (typeof window !== "undefined") {
  (window as any).fixCaseStudiesNoReload = fixCaseStudiesNoReload;
  
  // Message d'accueil
  setTimeout(() => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║  🔧 FIX CASE STUDIES - VERSION FIGMA-SAFE                ║
╚════════════════════════════════════════════════════════════╝

⚡ SOLUTION RECOMMANDÉE (Ne crashe pas la preview) :

   1. Dans la console, tapez :
   
      → fixCaseStudiesNoReload()
   
   2. Puis dans le dashboard, cliquez sur "Initialiser"
      OU rafraîchissez manuellement (F5)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Cette version ne fait PAS de location.reload() automatique
   → Évite les crashes dans la preview Figma

💡 Le bouton "Initialiser" du dashboard a été corrigé aussi
   → Il recharge les données sans crasher

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
  }, 2000);
}

export {};

