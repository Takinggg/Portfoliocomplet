/**
 * Migration Script - Fix Project IDs
 * 
 * ⚠️ SOLUTION SIMPLIFIÉE : Recréer les projets avec le bon format
 * 
 * Ce script vérifie s'il existe des projets avec l'ancien format et propose
 * de les recréer avec le nouveau format en utilisant seedProjetTaskFlow().
 */

import { projectId, publicAnonKey } from './supabase/info';

export async function checkProjectIdsFormat() {
  console.log("🔍 Vérification du format des IDs de projets...\n");
  
  try {
    // Récupérer tous les projets FR
    const responseFr = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects?lang=fr`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );
    
    // Récupérer tous les projets EN
    const responseEn = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects?lang=en`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );
    
    const dataFr = responseFr.ok ? await responseFr.json() : { projects: [] };
    const dataEn = responseEn.ok ? await responseEn.json() : { projects: [] };
    
    const allProjects = [...(dataFr.projects || []), ...(dataEn.projects || [])];
    
    console.log(`📊 ${allProjects.length} projet(s) trouvé(s) au total\n`);
    
    if (allProjects.length === 0) {
      console.log("ℹ️ Aucun projet existant");
      console.log("\n💡 Créez des projets avec :");
      console.log("   seedProjetTaskFlow()");
      return { success: true, needsMigration: false, projects: [] };
    }
    
    // Vérifier le format des IDs
    const projectsWithOldFormat = allProjects.filter((p) => 
      p.id && typeof p.id === 'string' && p.id.startsWith('project_')
    );
    
    const projectsWithNewFormat = allProjects.filter((p) => 
      p.id && typeof p.id === 'string' && !p.id.startsWith('project_')
    );
    
    console.log("📋 Résultats de l'analyse :\n");
    console.log(`  ✅ Nouveau format (correct) : ${projectsWithNewFormat.length} projet(s)`);
    console.log(`  ⚠️  Ancien format (à corriger) : ${projectsWithOldFormat.length} projet(s)\n`);
    
    if (projectsWithOldFormat.length > 0) {
      console.log("⚠️ PROJETS AVEC ANCIEN FORMAT DÉTECTÉS :\n");
      projectsWithOldFormat.forEach((p, i: number) => {
        console.log(`  ${i + 1}. ${p.name || 'Sans nom'}`);
        console.log(`     ID actuel : ${p.id}`);
        console.log(`     Langue : ${p.language || 'non spécifiée'}`);
        console.log("");
      });
      
      console.log("💡 SOLUTION RECOMMANDÉE :\n");
      console.log("1. Les projets avec ancien format ne seront pas accessibles");
      console.log("2. Utilisez seedProjetTaskFlow() pour créer de nouveaux projets");
      console.log("3. Ou créez manuellement depuis le dashboard\n");
      console.log("   Commande : seedProjetTaskFlow()\n");
      
      return { 
        success: true, 
        needsMigration: true, 
        oldFormatCount: projectsWithOldFormat.length,
        newFormatCount: projectsWithNewFormat.length,
        projects: allProjects
      };
    }
    
    console.log("✅ Tous les projets sont au bon format !\n");
    
    projectsWithNewFormat.forEach((p, i: number) => {
      console.log(`  ${i + 1}. ${p.name || 'Sans nom'} (${p.language || 'fr'})`);
    });
    console.log("");
    
    return { 
      success: true, 
      needsMigration: false, 
      projects: allProjects 
    };
    
  } catch (error) {
    console.error("\n❌ ERREUR lors de la vérification:", error);
    console.log("\n💡 Solutions :");
    console.log("  1. Vérifier que le serveur est déployé");
    console.log("  2. Vérifier les credentials Supabase");
    return { success: false, error };
  }
}

// Export pour utilisation dans la console
(window as any).checkProjectIdsFormat = checkProjectIdsFormat;

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  🔍 VÉRIFICATION DES IDS DE PROJETS DISPONIBLE                ║
╚════════════════════════════════════════════════════════════════╝

Pour vérifier le format des IDs de vos projets :

  checkProjectIdsFormat()

Cela va :
  ✅ Lister tous les projets existants
  ✅ Identifier ceux avec l'ancien format (project_project_123)
  ✅ Identifier ceux avec le nouveau format (123_abc)
  ✅ Recommander des actions si nécessaire

Si des projets ont l'ancien format, utilisez :
  seedProjetTaskFlow()    ← Pour créer de nouveaux projets
`);


