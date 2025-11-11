/**
 * Startup Projects Check
 * 
 * Vérifie automatiquement au démarrage si des projets existent
 */

import { projectId, publicAnonKey } from './supabase/info';

// Run check 2 seconds after page load
setTimeout(async () => {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects?lang=fr`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      const projects = data.projects || [];
      const projectCount = projects.length;
      
      // Check for broken IDs (old format with project_ prefix)
      const brokenProjects = projects.filter((p) => 
        p.id && p.id.startsWith('project_')
      );
      
      if (brokenProjects.length > 0) {
        console.log(`
╔════════════════════════════════════════════════════════════════╗
║  ⚠️  ATTENTION : ${brokenProjects.length} projet(s) avec ancien format d'ID détecté(s) ║
╚════════════════════════════════════════════════════════════════╝

Ces projets ne s'afficheront PAS correctement !

✅ SOLUTION AUTOMATIQUE (10 secondes) :

   fixProjectIds()

Cette commande va automatiquement réparer tous les projets cassés.

───────────────────────────────────────────────────────────────
📖 Guide rapide : FIX_PROJECT_ID_NOW.md
        `);
      } else if (projectCount === 0) {
        console.log(`
╔════════════════════════════════════════════════════════════════╗
║  ℹ️  INFO : Aucun projet dans la base de données              ║
╚════════════════════════════════════════════════════════════════╝

Pour créer des projets de démonstration professionnels :

   seedProjetTaskFlow()

Cela créera "TaskFlow" (une app SaaS) en français ET en anglais
avec toutes les données réalistes (budget, technologies, etc.)

Ensuite, allez sur /projects pour les voir ! 🚀

───────────────────────────────────────────────────────────────
📖 Guide complet : GUIDE_RAPIDE_PROJETS.md
        `);
      } else {
        console.log(`✅ ${projectCount} projet(s) disponible(s) - Tous au bon format !`);
      }
    }
  } catch (error) {
    // Silently fail - server might not be deployed yet
  }
}, 2000);

export {};

