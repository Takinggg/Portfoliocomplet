/**
 * Auto-Fix Project IDs - Automatic Repair at Startup
 * 
 * Détecte et répare automatiquement les projets avec ancien format d'ID
 * au démarrage de l'application (3 secondes après le chargement)
 */

import { projectId, publicAnonKey } from './supabase/info';

let hasRun = false; // Éviter l'exécution multiple

async function autoFixProjectIds() {
  if (hasRun) return;
  hasRun = true;

  try {
    // 1. Récupérer tous les projets (FR + EN)
    const [responseFR, responseEN] = await Promise.all([
      fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects?lang=fr`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      ),
      fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects?lang=en`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      )
    ]);

    const dataFR = await responseFR.json();
    const dataEN = await responseEN.json();
    
    const allProjects = [
      ...(dataFR.projects || []),
      ...(dataEN.projects || [])
    ];

    if (allProjects.length === 0) {
      return; // Aucun projet, rien à faire
    }

    // 2. Identifier les projets avec mauvais format
    // NOTE: Le serveur gère maintenant automatiquement les deux formats d'ID
    // (avec et sans préfixe "project_"), donc cette réparation n'est plus nécessaire.
    // On désactive la détection pour éviter tout conflit.
    const brokenProjects: any[] = [];

    if (brokenProjects.length === 0) {
      return; // Auto-fix désactivé, le serveur normalise automatiquement les IDs
    }

    // 3. Afficher le message de réparation
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║  🔧 AUTO-RÉPARATION : ${brokenProjects.length} projet(s) avec ancien format détecté(s) ║
╚════════════════════════════════════════════════════════════════╝

🤖 Réparation automatique en cours...
`);

    // 4. Réparer automatiquement chaque projet cassé
    let repaired = 0;
    let failed = 0;

    for (const project of brokenProjects) {
      try {
        const oldId = project.id;
        
        console.log(`🔄 Réparation: ${project.name || 'Sans nom'}`);
        console.log(`   ${oldId} → ${oldId.replace(/^project_/, '')}`);

        // Étape A: Supprimer l'ancien
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects/${oldId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        // Étape B: Recréer avec bon ID (le serveur générera un nouveau bon ID)
        const projectData = { ...project };
        delete projectData.id;
        delete projectData.createdAt;
        delete projectData.updatedAt;

        const createResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify(projectData),
          }
        );

        const createData = await createResponse.json();
        
        if (createData.success) {
          console.log(`   ✅ Recréé avec ID: ${createData.project?.id}`);
          repaired++;
        } else {
          console.log(`   ❌ Échec: ${createData.error}`);
          failed++;
        }

      } catch (error) {
        console.error(`   ❌ Erreur: ${error}`);
        failed++;
      }
    }

    // 5. Afficher le résumé
    console.log(`
┌─────────────────────────────────────────────────────────────┐
│  RÉSUMÉ DE LA RÉPARATION AUTOMATIQUE                        │
└─────────────────────────────────────────────────────────────┘

   ✅ Réparés avec succès : ${repaired}
   ❌ Échecs : ${failed}
   📊 Total : ${brokenProjects.length}

${repaired > 0 ? '🎉 Projets réparés ! La page va se recharger...\n' : ''}
`);

    // 6. Recharger automatiquement la page si réparation réussie
    if (repaired > 0) {
      setTimeout(() => {
        console.log('♻️  Rechargement automatique dans 2 secondes...');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }, 1000);
    }

  } catch (error) {
    console.error('❌ Erreur lors de la réparation automatique:', error);
  }
}

// Exécuter automatiquement 3 secondes après le chargement
// (pour laisser le temps au serveur de démarrer)
setTimeout(autoFixProjectIds, 3000);

// Exposer aussi pour exécution manuelle
(window as any).autoFixProjectIds = autoFixProjectIds;

export {};
