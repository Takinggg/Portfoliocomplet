/**
 * Message d'aide pour les erreurs 404 des images
 */

if (typeof window !== "undefined") {
  // Afficher le message seulement si on détecte des erreurs 404 potentielles
  const checkFor404Errors = () => {
    const stored = localStorage.getItem("local_case_studies");
    if (stored) {
      try {
        const caseStudies = JSON.parse(stored);
        const invalidUrls = caseStudies.filter((cs: any) => 
          cs.thumbnail && !cs.thumbnail.startsWith("http")
        );
        
        if (invalidUrls.length > 0) {
          console.warn(`
╔════════════════════════════════════════════════════════════╗
║  ⚠️ ERREURS 404 DÉTECTÉES - IMAGES INVALIDES             ║
╚════════════════════════════════════════════════════════════╝

🚨 PROBLÈME : ${invalidUrls.length} case studies ont des URLs d'images invalides

📋 Case studies problématiques :
`);
          
          invalidUrls.forEach((cs: any) => {
            console.warn(`   ❌ ${cs.id} : "${cs.thumbnail}"`);
          });
          
          console.warn(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ SOLUTION EN 1 COMMANDE :

   Tapez dans la console :
   
   → fixCaseStudiesCompletely()
   
   Cela va :
   ✓ Supprimer les anciennes données corrompues
   ✓ Charger les vraies case studies bilingues
   ✓ Vérifier que toutes les URLs sont valides
   ✓ Rafraîchir la page automatiquement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Alternative : Cliquez sur "Initialiser" dans le dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  };

  // Vérifier après un court délai pour laisser le temps aux autres scripts de se charger
  setTimeout(checkFor404Errors, 1000);
}

export {};
