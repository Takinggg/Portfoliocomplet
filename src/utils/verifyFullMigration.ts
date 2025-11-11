/**
 * Verify Full Migration to Supabase
 * Script de vérification complète de la migration
 */

import { projectId, publicAnonKey } from "./supabase/info";

const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;
const headers = {
  Authorization: `Bearer ${publicAnonKey}`,
};

interface VerificationResult {
  success: boolean;
  module: string;
  count: number;
  error?: string;
}

async function verifyFullMigration(): Promise<void> {
  console.log("%c🔍 VÉRIFICATION COMPLÈTE DE LA MIGRATION", "font-size: 18px; font-weight: bold; color: #00FFC2;");
  console.log("%c", "");

  const results: VerificationResult[] = [];

  // 1. Vérifier la version du serveur
  console.log("1️⃣ Vérification de la version du serveur...");
  try {
    const res = await fetch(`${serverUrl}/health`, { headers });
    const data = await res.json();
    
    if (data.version === "complete-2.0.0") {
      console.log("   ✅ Serveur complet v2.0.0 déployé");
      console.log(`   📦 Modules : ${data.modules.join(", ")}`);
    } else {
      console.log(`   ⚠️ Serveur version ${data.version} (attendu: complete-2.0.0)`);
      console.log("   → Déployez le serveur complet d'abord");
    }
  } catch (error: unknown) {
    console.log("   ❌ Serveur inaccessible:", error.message);
    return;
  }

  console.log("\n2️⃣ Vérification des données...\n");

  // 2. Vérifier Projects
  try {
    const res = await fetch(`${serverUrl}/projects`, { headers });
    const data = await res.json();
    const count = data.projects?.length || 0;
    
    if (count >= 3) {
      console.log(`   ✅ Projects: ${count} projets`);
      results.push({ success: true, module: "Projects", count });
    } else {
      console.log(`   ⚠️ Projects: ${count} projets (attendu: 3+)`);
      results.push({ success: false, module: "Projects", count });
    }
  } catch (error: unknown) {
    console.log(`   ❌ Projects: ${error.message}`);
    results.push({ success: false, module: "Projects", count: 0, error: error.message });
  }

  // 3. Vérifier Blog
  try {
    const res = await fetch(`${serverUrl}/blog`, { headers });
    const data = await res.json();
    const count = data.posts?.length || 0;
    
    if (count >= 3) {
      console.log(`   ✅ Blog: ${count} articles`);
      results.push({ success: true, module: "Blog", count });
    } else {
      console.log(`   ⚠️ Blog: ${count} articles (attendu: 3+)`);
      results.push({ success: false, module: "Blog", count });
    }
  } catch (error: unknown) {
    console.log(`   ❌ Blog: ${error.message}`);
    results.push({ success: false, module: "Blog", count: 0, error: error.message });
  }

  // 4. Vérifier Case Studies
  try {
    const res = await fetch(`${serverUrl}/case-studies`, { headers });
    const data = await res.json();
    const count = data.caseStudies?.length || 0;
    
    if (count >= 3) {
      console.log(`   ✅ Case Studies: ${count} études de cas`);
      results.push({ success: true, module: "Case Studies", count });
    } else {
      console.log(`   ⚠️ Case Studies: ${count} études de cas (attendu: 3+)`);
      results.push({ success: false, module: "Case Studies", count });
    }
  } catch (error: unknown) {
    console.log(`   ❌ Case Studies: ${error.message}`);
    results.push({ success: false, module: "Case Studies", count: 0, error: error.message });
  }

  // 5. Vérifier FAQ
  try {
    const res = await fetch(`${serverUrl}/faq`, { headers });
    const data = await res.json();
    const count = data.faqs?.length || 0;
    
    if (count >= 8) {
      console.log(`   ✅ FAQ: ${count} questions`);
      results.push({ success: true, module: "FAQ", count });
    } else {
      console.log(`   ⚠️ FAQ: ${count} questions (attendu: 8+)`);
      results.push({ success: false, module: "FAQ", count });
    }
  } catch (error: unknown) {
    console.log(`   ❌ FAQ: ${error.message}`);
    results.push({ success: false, module: "FAQ", count: 0, error: error.message });
  }

  // 6. Vérifier Testimonials
  try {
    const res = await fetch(`${serverUrl}/testimonials`, { headers });
    const data = await res.json();
    const count = data.testimonials?.length || 0;
    
    if (count >= 5) {
      console.log(`   ✅ Testimonials: ${count} témoignages`);
      results.push({ success: true, module: "Testimonials", count });
    } else {
      console.log(`   ⚠️ Testimonials: ${count} témoignages (attendu: 5+)`);
      results.push({ success: false, module: "Testimonials", count });
    }
  } catch (error: unknown) {
    console.log(`   ❌ Testimonials: ${error.message}`);
    results.push({ success: false, module: "Testimonials", count: 0, error: error.message });
  }

  // 7. Vérifier Resources
  try {
    const res = await fetch(`${serverUrl}/resources`, { headers });
    const data = await res.json();
    const count = data.resources?.length || 0;
    
    if (count >= 3) {
      console.log(`   ✅ Resources: ${count} ressources`);
      results.push({ success: true, module: "Resources", count });
    } else {
      console.log(`   ⚠️ Resources: ${count} ressources (attendu: 3+)`);
      results.push({ success: false, module: "Resources", count });
    }
  } catch (error: unknown) {
    console.log(`   ❌ Resources: ${error.message}`);
    results.push({ success: false, module: "Resources", count: 0, error: error.message });
  }

  // 8. Vérifier Clients
  try {
    const res = await fetch(`${serverUrl}/clients`, { headers });
    const data = await res.json();
    const count = data.clients?.length || 0;
    
    console.log(`   ✅ Clients: ${count} clients (OK)`);
    results.push({ success: true, module: "Clients", count });
  } catch (error: unknown) {
    console.log(`   ❌ Clients: ${error.message}`);
    results.push({ success: false, module: "Clients", count: 0, error: error.message });
  }

  // 9. Vérifier Leads
  try {
    const res = await fetch(`${serverUrl}/leads`, { headers });
    const data = await res.json();
    const count = data.leads?.length || 0;
    
    console.log(`   ✅ Leads: ${count} leads (OK)`);
    results.push({ success: true, module: "Leads", count });
  } catch (error: unknown) {
    console.log(`   ❌ Leads: ${error.message}`);
    results.push({ success: false, module: "Leads", count: 0, error: error.message });
  }

  // 10. Vérifier Newsletter
  try {
    const res = await fetch(`${serverUrl}/newsletter/stats`, { headers });
    const data = await res.json();
    
    console.log(`   ✅ Newsletter: ${data.total} abonnés (${data.confirmed} confirmés)`);
    results.push({ success: true, module: "Newsletter", count: data.total });
  } catch (error: unknown) {
    console.log(`   ❌ Newsletter: ${error.message}`);
    results.push({ success: false, module: "Newsletter", count: 0, error: error.message });
  }

  // Résumé
  console.log("\n" + "=".repeat(60));
  console.log("%c📊 RÉSUMÉ DE LA VÉRIFICATION", "font-size: 16px; font-weight: bold; color: #00FFC2;");
  console.log("=".repeat(60) + "\n");

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const percentage = Math.round((successCount / totalCount) * 100);

  console.log(`Modules fonctionnels : ${successCount}/${totalCount} (${percentage}%)\n`);

  // Données critiques (doivent être présentes)
  const criticalModules = ["Projects", "Blog", "Case Studies", "FAQ", "Testimonials", "Resources"];
  const criticalResults = results.filter(r => criticalModules.includes(r.module));
  const criticalSuccess = criticalResults.filter(r => r.success && r.count >= 3).length;

  if (criticalSuccess === criticalModules.length) {
    console.log("%c✅ MIGRATION COMPLÈTE RÉUSSIE !", "font-size: 16px; font-weight: bold; color: #00FF00;");
    console.log("\nToutes les données critiques sont présentes dans Supabase.");
    console.log("Votre portfolio est 100% synchronisé et prêt à l'emploi !\n");
  } else {
    console.log("%c⚠️ MIGRATION INCOMPLÈTE", "font-size: 16px; font-weight: bold; color: #FFA500;");
    console.log("\nCertaines données sont manquantes :");
    
    criticalResults.forEach(r => {
      if (!r.success || r.count < 3) {
        console.log(`   → ${r.module}: ${r.count} items (attendu: 3+)`);
      }
    });
    
    console.log("\nAction requise :");
    console.log("1. Allez sur /server-diagnostic");
    console.log("2. Cliquez 'Créer Toutes les Données'");
    console.log("3. Attendez la confirmation");
    console.log("4. Relancez cette vérification\n");
  }

  console.log("=".repeat(60) + "\n");

  // Actions recommandées
  console.log("📋 ACTIONS RECOMMANDÉES :\n");
  
  if (criticalSuccess === criticalModules.length) {
    console.log("✅ Migration terminée ! Prochaines étapes :");
    console.log("   1. Testez toutes les pages de votre portfolio");
    console.log("   2. Personnalisez les contenus avec vos vraies données");
    console.log("   3. Configurez les analytics (Google Analytics, Clarity)");
    console.log("   4. Optimisez le SEO (meta tags, sitemap)");
    console.log("   5. Déployez en production sur votre domaine\n");
  } else {
    console.log("⚠️ Migration incomplète. Actions à faire :");
    console.log("   1. Vérifiez que le serveur complet est déployé (version complete-2.0.0)");
    console.log("   2. Allez sur /server-diagnostic");
    console.log("   3. Cliquez 'Créer Toutes les Données'");
    console.log("   4. Relancez cette vérification avec verifyFullMigration()\n");
  }

  // Liens utiles
  console.log("🔗 LIENS UTILES :\n");
  console.log("   📖 Guide complet : /MIGRATION_COMPLETE_VERS_SUPABASE.md");
  console.log("   🚀 Démarrage rapide : /DEMARRAGE_RAPIDE.md");
  console.log("   🔧 Diagnostic : /server-diagnostic");
  console.log("   📊 Supabase Dashboard : https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu");
  console.log("   📝 Logs : https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/logs/edge-functions\n");
}

// Export pour utilisation dans les composants
export { verifyFullMigration };

// Auto-run si appelé directement dans la console
if (typeof window !== "undefined") {
  (window as any).verifyFullMigration = verifyFullMigration;
  console.log("💡 Run verifyFullMigration() to check migration status");
}

