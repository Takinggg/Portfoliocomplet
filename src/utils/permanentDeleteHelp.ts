// Message d'aide pour la suppression permanente des case studies

if (typeof window !== "undefined") {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  🗑️  SUPPRESSION PERMANENTE DES CASE STUDIES                   ║
╚══════════════════════════════════════════════════════════════════╝

📌 PROBLÈME RÉSOLU:
   Les case studies supprimés dans le dashboard ne réapparaissent 
   plus après avoir appelé initCaseStudies() ou seedCaseStudies()

🔧 COMMENT ÇA MARCHE:
   1. Suppression depuis le dashboard = suppression DÉFINITIVE
   2. Les IDs supprimés sont mémorisés dans localStorage
   3. Les fonctions d'initialisation ignorent ces case studies

💡 FONCTIONS DE CONSOLE DISPONIBLES:

   getDeletedCaseStudies()
   → Liste les IDs des case studies supprimés définitivement
   
   permanentlyDeleteCaseStudy('case-study-id')
   → Supprime un case study définitivement (serveur + localStorage)
   
   clearDeletedCaseStudies()
   → Réinitialise la liste (permet de recréer tous les case studies)

⚙️ UTILISATION NORMALE:
   - Supprimez depuis le dashboard = suppression définitive
   - Appelez initCaseStudies() sans crainte
   - Les case studies supprimés ne seront PAS recréés

🔄 SI VOUS VOULEZ TOUT RÉINITIALISER:
   1. clearDeletedCaseStudies()
   2. Supprimez manuellement tous les case studies du dashboard
   3. initCaseStudies()

══════════════════════════════════════════════════════════════════
`);
}

export {};
