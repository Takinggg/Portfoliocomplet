/**
 * Script d'initialisation pour les case studies bilingues
 * À exécuter dans la console pour charger les 3 vraies case studies
 */

import { seedBilingualCaseStudies } from "./seedBilingualCaseStudies";

export function initBilingualCaseStudies() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🌍 INITIALISATION DES CASE STUDIES BILINGUES            ║
╚════════════════════════════════════════════════════════════╝

🎯 Cette fonction va :
   1️⃣  Charger 3 case studies professionnelles complètes
   2️⃣  Avec toutes les traductions FR + EN
   3️⃣  Dans le localStorage du dashboard

📋 Case Studies qui seront ajoutées :
   • Plateforme E-commerce Luxe (Maison Beaumont)
   • Application SaaS de Gestion (TaskFlow)
   • Site Vitrine Architecte (Atelier Blanc)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  try {
    seedBilingualCaseStudies();
    
    console.log(`
╔════════════════════════════════════════════════════════════╗
║  ✅ SUCCÈS - CASE STUDIES INITIALISÉES                   ║
╚════════════════════════════════════════════════════════════╝

✨ 3 case studies bilingues ont été chargées !

📌 Prochaines étapes :
   1️⃣  Rafraîchissez la page du dashboard
   2️⃣  Les 3 case studies apparaîtront
   3️⃣  Les compteurs seront mis à jour :
       • Total: 3
       • Featured: 2
       • Multilingues: 3
       • E-commerce: 1

🌐 Les case studies sont maintenant disponibles en FR et EN
   sur la page publique et dans le dashboard !

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

    return { success: true, count: 3 };
  } catch (error) {
    console.error(`
╔════════════════════════════════════════════════════════════╗
║  ❌ ERREUR LORS DE L'INITIALISATION                      ║
╚════════════════════════════════════════════════════════════╝

Erreur: ${error}

💡 Solution :
   1️⃣  Vérifiez la console pour plus de détails
   2️⃣  Essayez de rafraîchir la page
   3️⃣  Utilisez le bouton "Initialiser" dans le dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
    
    return { success: false, error };
  }
}

// Message d'aide au démarrage
export function showCaseStudiesHelp() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  📚 AIDE - CASE STUDIES BILINGUES                        ║
╚════════════════════════════════════════════════════════════╝

🎯 Pour initialiser les case studies :

   📍 OPTION 1 - Dans le Dashboard :
      → Allez dans l'onglet "Études de Cas"
      → Cliquez sur le bouton "Initialiser"
      → Confirmez l'initialisation

   📍 OPTION 2 - Dans la Console :
      → Tapez : initBilingualCaseStudies()
      → Appuyez sur Entrée
      → Rafraîchissez la page

🌐 Fonctionnalités bilingues :
   • Tous les textes sont traduits FR/EN
   • Les URLs des images sont valides (Unsplash)
   • Métadonnées complètes (challenges, solutions, résultats)
   • Témoignages clients authentiques

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

// Expose globally
if (typeof window !== "undefined") {
  (window as any).initBilingualCaseStudies = initBilingualCaseStudies;
  (window as any).showCaseStudiesHelp = showCaseStudiesHelp;
  
  // Auto-affichage du message d'aide si aucune case study
  const checkAndShowHelp = () => {
    const stored = localStorage.getItem("local_case_studies");
    if (!stored || JSON.parse(stored).length === 0) {
      showCaseStudiesHelp();
    }
  };
  
  // Vérifier au chargement
  setTimeout(checkAndShowHelp, 1000);
}
