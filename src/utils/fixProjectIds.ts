/**
 * Fix Project IDs - Repair old projects with wrong format
 * 
 * Ce script détecte et corrige automatiquement les projets avec l'ancien format d'ID
 * (qui contient le préfixe "project_" dans l'ID de l'objet)
 */

import { projectId as supabaseProjectId, publicAnonKey } from './supabase/info';

export async function fixProjectIds() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  🔧 RÉPARATION des IDs de projets                             ║
╚════════════════════════════════════════════════════════════════╝
`);

  try {
    // 1. Récupérer tous les projets (FR + EN)
    console.log('📡 Récupération de tous les projets...\n');
    
    const [responseFR, responseEN] = await Promise.all([
      fetch(
        `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-04919ac5/projects?lang=fr`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      ),
      fetch(
        `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-04919ac5/projects?lang=en`,
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
      console.log('ℹ️  Aucun projet trouvé. Rien à réparer.\n');
      return;
    }

    console.log(`📊 ${allProjects.length} projet(s) trouvé(s)\n`);

    // 2. Identifier les projets avec mauvais format
    const brokenProjects = allProjects.filter(p => 
      p.id && p.id.startsWith('project_')
    );
    
    const okProjects = allProjects.filter(p => 
      p.id && !p.id.startsWith('project_')
    );

    console.log(`✅ Format correct : ${okProjects.length} projet(s)`);
    console.log(`❌ Format incorrect : ${brokenProjects.length} projet(s)\n`);

    if (brokenProjects.length === 0) {
      console.log('🎉 Tous les projets sont au bon format ! Rien à réparer.\n');
      return;
    }

    // 3. Afficher les projets à réparer
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  Projets à réparer :                                        │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');
    
    brokenProjects.forEach((p, idx) => {
      console.log(`  ${idx + 1}. ${p.name || 'Sans nom'}`);
      console.log(`     Ancien ID : ${p.id}`);
      console.log(`     Nouveau ID : ${p.id.replace(/^project_/, '')}`);
      console.log(`     Langue : ${p.language || '?'}\n`);
    });

    // 4. Demander confirmation (simulé - on répare automatiquement)
    console.log('🔧 Réparation automatique en cours...\n');

    // 5. Pour chaque projet cassé, on doit :
    //    - Supprimer l'ancien (avec mauvais ID)
    //    - Recréer avec le bon ID
    
    let repaired = 0;
    let failed = 0;

    for (const project of brokenProjects) {
      try {
        const oldId = project.id;
        const newId = oldId.replace(/^project_/, '');
        
        console.log(`🔄 Réparation: ${project.name}`);
        console.log(`   ${oldId} → ${newId}`);

        // Étape A: Supprimer l'ancien
        const deleteResponse = await fetch(
          `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-04919ac5/projects/${oldId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (!deleteResponse.ok) {
          console.log(`   ⚠️  Suppression échouée (peut-être déjà supprimé)`);
        }

        // Étape B: Recréer avec bon ID
        // On ne met PAS d'ID dans le body - le serveur va en générer un nouveau
        const projectData = { ...project };
        delete projectData.id; // Important!
        delete projectData.createdAt;
        delete projectData.updatedAt;

        const createResponse = await fetch(
          `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-04919ac5/projects`,
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
          console.log(`   ✅ Recréé avec ID: ${createData.project?.id}\n`);
          repaired++;
        } else {
          console.log(`   ❌ Échec recréation: ${createData.error}\n`);
          failed++;
        }

      } catch (error) {
        console.error(`   ❌ Erreur: ${error}\n`);
        failed++;
      }
    }

    // 6. Résumé
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  RÉSUMÉ DE LA RÉPARATION                                    │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');
    console.log(`   ✅ Réparés avec succès : ${repaired}`);
    console.log(`   ❌ Échecs : ${failed}`);
    console.log(`   📊 Total : ${brokenProjects.length}\n`);

    if (repaired > 0) {
      console.log('🎉 Projets réparés ! Rechargez la page pour voir les changements.\n');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la réparation:', error);
  }
}

// Auto-execute on import (pour faciliter l'usage)
// Mais on peut aussi appeler manuellement avec fixProjectIds()

// Expose globally for console access
(window as any).fixProjectIds = fixProjectIds;

console.log(`
┌────────────────────────────────────────────────────────────────┐
│  💡 Commande disponible :                                      │
│                                                                │
│     fixProjectIds()                                            │
│                                                                │
│  Répare automatiquement les projets avec ancien format d'ID   │
└────────────────────────────────────────────────────────────────┘
`);

export {};
