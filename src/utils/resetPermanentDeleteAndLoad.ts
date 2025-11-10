/**
 * 🔥 FIX ULTIME - Reset la liste de suppression permanente et charge les case studies
 */

export function resetAndLoadCaseStudies() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🔥 RESET COMPLET + CHARGEMENT DES CASE STUDIES          ║
╚════════════════════════════════════════════════════════════╝

🎯 Étape 1/3 : Suppression de la liste noire...
`);

  // 1. Vider la liste des suppressions permanentes
  try {
    localStorage.removeItem("deleted_case_studies");
    console.log("✅ Liste de suppression permanente vidée");
  } catch (e) {
    console.warn("⚠️ Erreur lors de la suppression de la liste noire:", e);
  }

  console.log(`
🎯 Étape 2/3 : Chargement des 3 case studies bilingues...
`);

  // 2. Charger les case studies bilingues
  import("./seedBilingualCaseStudies").then(({ seedBilingualCaseStudies }) => {
    try {
      seedBilingualCaseStudies();
      
      console.log(`
╔════════════════════════════════════════════════════════════╗
║  ✅ SUCCÈS - CASE STUDIES RESTAURÉES !                   ║
╚════════════════════════════════════════════════════════════╝

✨ 3 case studies bilingues chargées avec succès :
   1. ⭐ Plateforme E-commerce Luxe (Maison Beaumont)
   2. ⭐ Application SaaS de Gestion (TaskFlow)
   3. • Site Vitrine Architecte (Atelier Blanc)

📊 Résultat attendu dans le dashboard :
   • Total: 3
   • Featured: 2
   • 🌐 Multilingues: 3
   • E-commerce: 1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ TERMINÉ !

💡 Dans le dashboard, cliquez sur "Initialiser" pour recharger
   les données, ou rafraîchissez la page (F5).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

    } catch (error) {
      console.error("❌ Erreur lors du chargement:", error);
    }
  }).catch((error) => {
    console.error("❌ Erreur lors de l'import:", error);
  });
}

/**
 * Version manuelle sans auto-refresh
 */
export function resetDeletedListOnly() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🗑️ RESET DE LA LISTE DE SUPPRESSION PERMANENTE         ║
╚════════════════════════════════════════════════════════════╝
`);

  try {
    const key = "deleted_case_studies";
    const before = localStorage.getItem(key);
    
    if (before) {
      const deletedList = JSON.parse(before);
      console.log(`📋 Case studies dans la liste noire (${deletedList.length}) :`, deletedList);
    }
    
    localStorage.removeItem(key);
    
    console.log(`
✅ Liste de suppression permanente vidée !

💡 Maintenant, exécutez :
   → resetAndLoadCaseStudies()
   
   OU cliquez sur "Initialiser" dans le dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
    
  } catch (error) {
    console.error("❌ Erreur:", error);
  }
}

/**
 * Afficher l'état actuel
 */
export function checkDeletedCaseStudies() {
  const key = "deleted_case_studies";
  const stored = localStorage.getItem(key);
  
  if (!stored) {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║  ✅ LISTE DE SUPPRESSION VIDE                            ║
╚════════════════════════════════════════════════════════════╝

👍 Aucune case study dans la liste noire

💡 Vous pouvez maintenant charger les case studies :
   → resetAndLoadCaseStudies()
   
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
    return [];
  }
  
  try {
    const deletedList = JSON.parse(stored);
    console.log(`
╔════════════════════════════════════════════════════════════╗
║  ⚠️ CASE STUDIES DANS LA LISTE NOIRE                     ║
╚════════════════════════════════════════════════════════════╝

📊 ${deletedList.length} case studies marquées comme supprimées :
`);
    
    deletedList.forEach((id: string, index: number) => {
      console.log(`   ${index + 1}. ${id}`);
    });
    
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Pour résoudre ce problème :
   → resetAndLoadCaseStudies()
   
   Cela va :
   1. Vider la liste noire
   2. Charger les 3 case studies bilingues
   3. Rafraîchir la page automatiquement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
    
    return deletedList;
  } catch (e) {
    console.error("❌ Erreur lors de la lecture de la liste:", e);
    return [];
  }
}

// Expose globally
if (typeof window !== "undefined") {
  (window as any).resetAndLoadCaseStudies = resetAndLoadCaseStudies;
  (window as any).resetDeletedListOnly = resetDeletedListOnly;
  (window as any).checkDeletedCaseStudies = checkDeletedCaseStudies;
  
  // Message d'accueil
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🔧 FONCTIONS DE RESET DISPONIBLES                       ║
╚════════════════════════════════════════════════════════════╝

⚡ FIX RAPIDE (1 commande) :
   → resetAndLoadCaseStudies()
   
   ✓ Vide la liste noire
   ✓ Charge les 3 case studies
   ✓ Rafraîchit automatiquement

🔍 VÉRIFIER L'ÉTAT :
   → checkDeletedCaseStudies()

🗑️ JUSTE VIDER LA LISTE NOIRE :
   → resetDeletedListOnly()

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

export {};
