/**
 * Quick Fix Message for "Project not found" error
 * 
 * Affiche un message concis avec la solution rapide
 */

// Listen for project errors
const originalFetch = window.fetch;
let errorShown = false;

window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  
  // Check if this is a project fetch that failed
  if (args[0]?.toString().includes('/projects/') && 
      !args[0]?.toString().includes('/projects?') &&
      !response.ok && 
      !errorShown) {
    
    errorShown = true;
    
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  ❌ ERREUR : Projet non trouvé                                ║
╚═══════════════════════════════════════════════════════════════╝

🔍 Cause possible : Ancien format d'ID ou projet inexistant

✅ SOLUTION EN 2 ÉTAPES (1 minute) :

   1️⃣  RÉPARER les anciens projets :
   
       fixProjectIds()
   
   2️⃣  Si toujours vide, CRÉER des projets de test :
   
       seedProjetTaskFlow()

───────────────────────────────────────────────────────────────

📋 Toutes les commandes utiles :

   • fixProjectIds()          →  Réparer anciens projets
   • checkProjectIdsFormat()  →  Voir tous les projets
   • seedProjetTaskFlow()     →  Créer projet de test

───────────────────────────────────────────────────────────────

📖 Guide complet : Voir GUIDE_RAPIDE_PROJETS.md

`);
  }
  
  return response;
};

export {};
