/**
 * Verify Full Migration to Supabase
 * Script de vÃ©rification complÃ¨te de la migration
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
  console.log("%cðŸ” VÃ‰RIFICATION COMPLÃˆTE DE LA MIGRATION", "font-size: 18px; font-weight: bold; color: #CCFF00;");
  console.log("%c", "");

  const results: VerificationResult[] = [];

  // 1. VÃ©rifier la version du serveur
  console.log("1ï¸âƒ£ VÃ©rification de la version du serveur...");
  try {
    const res = await fetch(`${serverUrl}/health`, { headers });
    const data = await res.json();
    
    if (data.version === "complete-2.0.0") {
      console.log("   âœ… Serveur complet v2.0.0 dÃ©ployÃ©");
      console.log(`   ðŸ“¦ Modules : ${data.modules.join(", ")}`);
    } else {
      console.log(`   âš ï¸ Serveur version ${data.version} (attendu: complete-2.0.0)`);
      console.log("   â†’ DÃ©ployez le serveur complet d'abord");
    }
  } catch (error: unknown) {
    console.log("   âŒ Serveur inaccessible:", error.message);
    return;
  }

  console.log("\n2ï¸âƒ£ VÃ©rification des donnÃ©es...\n");

  // 2. VÃ©rifier Projects
  try {
    const res = await fetch(`${serverUrl}/projects`, { headers });
    const data = await res.json();
    const count = data.projects?.length || 0;
    
    if (count >= 3) {
      console.log(`   âœ… Projects: ${count} projets`);
      results.push({ success: true, module: "Projects", count });
    } else {
      console.log(`   âš ï¸ Projects: ${count} projets (attendu: 3+)`);
      results.push({ success: false, module: "Projects", count });
    }
  } catch (error: unknown) {
    console.log(`   âŒ Projects: ${error.message}`);
    results.push({ success: false, module: "Projects", count: 0, error: error.message });
  }

  // 3. VÃ©rifier Blog
  try {
    const res = await fetch(`${serverUrl}/blog`, { headers });
    const data = await res.json();
    const count = data.posts?.length || 0;
    
    if (count >= 3) {
      console.log(`   âœ… Blog: ${count} articles`);
      results.push({ success: true, module: "Blog", count });
    } else {
      console.log(`   âš ï¸ Blog: ${count} articles (attendu: 3+)`);
      results.push({ success: false, module: "Blog", count });
    }
  } catch (error: unknown) {
    console.log(`   âŒ Blog: ${error.message}`);
    results.push({ success: false, module: "Blog", count: 0, error: error.message });
  }

  // 4. VÃ©rifier Case Studies
  try {
    const res = await fetch(`${serverUrl}/case-studies`, { headers });
    const data = await res.json();
    const count = data.caseStudies?.length || 0;
    
    if (count >= 3) {
      console.log(`   âœ… Case Studies: ${count} Ã©tudes de cas`);
      results.push({ success: true, module: "Case Studies", count });
    } else {
      console.log(`   âš ï¸ Case Studies: ${count} Ã©tudes de cas (attendu: 3+)`);
      results.push({ success: false, module: "Case Studies", count });
    }
  } catch (error: unknown) {
    console.log(`   âŒ Case Studies: ${error.message}`);
    results.push({ success: false, module: "Case Studies", count: 0, error: error.message });
  }

  // 5. VÃ©rifier FAQ
  try {
    const res = await fetch(`${serverUrl}/faq`, { headers });
    const data = await res.json();
    const count = data.faqs?.length || 0;
    
    if (count >= 8) {
      console.log(`   âœ… FAQ: ${count} questions`);
      results.push({ success: true, module: "FAQ", count });
    } else {
      console.log(`   âš ï¸ FAQ: ${count} questions (attendu: 8+)`);
      results.push({ success: false, module: "FAQ", count });
    }
  } catch (error: unknown) {
    console.log(`   âŒ FAQ: ${error.message}`);
    results.push({ success: false, module: "FAQ", count: 0, error: error.message });
  }

  // 6. VÃ©rifier Testimonials
  try {
    const res = await fetch(`${serverUrl}/testimonials`, { headers });
    const data = await res.json();
    const count = data.testimonials?.length || 0;
    
    if (count >= 5) {
      console.log(`   âœ… Testimonials: ${count} tÃ©moignages`);
      results.push({ success: true, module: "Testimonials", count });
    } else {
      console.log(`   âš ï¸ Testimonials: ${count} tÃ©moignages (attendu: 5+)`);
      results.push({ success: false, module: "Testimonials", count });
    }
  } catch (error: unknown) {
    console.log(`   âŒ Testimonials: ${error.message}`);
    results.push({ success: false, module: "Testimonials", count: 0, error: error.message });
  }

  // 7. VÃ©rifier Resources
  try {
    const res = await fetch(`${serverUrl}/resources`, { headers });
    const data = await res.json();
    const count = data.resources?.length || 0;
    
    if (count >= 3) {
      console.log(`   âœ… Resources: ${count} ressources`);
      results.push({ success: true, module: "Resources", count });
    } else {
      console.log(`   âš ï¸ Resources: ${count} ressources (attendu: 3+)`);
      results.push({ success: false, module: "Resources", count });
    }
  } catch (error: unknown) {
    console.log(`   âŒ Resources: ${error.message}`);
    results.push({ success: false, module: "Resources", count: 0, error: error.message });
  }

  // 8. VÃ©rifier Clients
  try {
    const res = await fetch(`${serverUrl}/clients`, { headers });
    const data = await res.json();
    const count = data.clients?.length || 0;
    
    console.log(`   âœ… Clients: ${count} clients (OK)`);
    results.push({ success: true, module: "Clients", count });
  } catch (error: unknown) {
    console.log(`   âŒ Clients: ${error.message}`);
    results.push({ success: false, module: "Clients", count: 0, error: error.message });
  }

  // 9. VÃ©rifier Leads
  try {
    const res = await fetch(`${serverUrl}/leads`, { headers });
    const data = await res.json();
    const count = data.leads?.length || 0;
    
    console.log(`   âœ… Leads: ${count} leads (OK)`);
    results.push({ success: true, module: "Leads", count });
  } catch (error: unknown) {
    console.log(`   âŒ Leads: ${error.message}`);
    results.push({ success: false, module: "Leads", count: 0, error: error.message });
  }

  // 10. VÃ©rifier Newsletter
  try {
    const res = await fetch(`${serverUrl}/newsletter/stats`, { headers });
    const data = await res.json();
    
    console.log(`   âœ… Newsletter: ${data.total} abonnÃ©s (${data.confirmed} confirmÃ©s)`);
    results.push({ success: true, module: "Newsletter", count: data.total });
  } catch (error: unknown) {
    console.log(`   âŒ Newsletter: ${error.message}`);
    results.push({ success: false, module: "Newsletter", count: 0, error: error.message });
  }

  // RÃ©sumÃ©
  console.log("\n" + "=".repeat(60));
  console.log("%cðŸ“Š RÃ‰SUMÃ‰ DE LA VÃ‰RIFICATION", "font-size: 16px; font-weight: bold; color: #CCFF00;");
  console.log("=".repeat(60) + "\n");

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const percentage = Math.round((successCount / totalCount) * 100);

  console.log(`Modules fonctionnels : ${successCount}/${totalCount} (${percentage}%)\n`);

  // DonnÃ©es critiques (doivent Ãªtre prÃ©sentes)
  const criticalModules = ["Projects", "Blog", "Case Studies", "FAQ", "Testimonials", "Resources"];
  const criticalResults = results.filter(r => criticalModules.includes(r.module));
  const criticalSuccess = criticalResults.filter(r => r.success && r.count >= 3).length;

  if (criticalSuccess === criticalModules.length) {
    console.log("%câœ… MIGRATION COMPLÃˆTE RÃ‰USSIE !", "font-size: 16px; font-weight: bold; color: #00FF00;");
    console.log("\nToutes les donnÃ©es critiques sont prÃ©sentes dans Supabase.");
    console.log("Votre portfolio est 100% synchronisÃ© et prÃªt Ã  l'emploi !\n");
  } else {
    console.log("%câš ï¸ MIGRATION INCOMPLÃˆTE", "font-size: 16px; font-weight: bold; color: #FFA500;");
    console.log("\nCertaines donnÃ©es sont manquantes :");
    
    criticalResults.forEach(r => {
      if (!r.success || r.count < 3) {
        console.log(`   â†’ ${r.module}: ${r.count} items (attendu: 3+)`);
      }
    });
    
    console.log("\nAction requise :");
    console.log("1. Allez sur /server-diagnostic");
    console.log("2. Cliquez 'CrÃ©er Toutes les DonnÃ©es'");
    console.log("3. Attendez la confirmation");
    console.log("4. Relancez cette vÃ©rification\n");
  }

  console.log("=".repeat(60) + "\n");

  // Actions recommandÃ©es
  console.log("ðŸ“‹ ACTIONS RECOMMANDÃ‰ES :\n");
  
  if (criticalSuccess === criticalModules.length) {
    console.log("âœ… Migration terminÃ©e ! Prochaines Ã©tapes :");
    console.log("   1. Testez toutes les pages de votre portfolio");
    console.log("   2. Personnalisez les contenus avec vos vraies donnÃ©es");
    console.log("   3. Configurez les analytics (Google Analytics, Clarity)");
    console.log("   4. Optimisez le SEO (meta tags, sitemap)");
    console.log("   5. DÃ©ployez en production sur votre domaine\n");
  } else {
    console.log("âš ï¸ Migration incomplÃ¨te. Actions Ã  faire :");
    console.log("   1. VÃ©rifiez que le serveur complet est dÃ©ployÃ© (version complete-2.0.0)");
    console.log("   2. Allez sur /server-diagnostic");
    console.log("   3. Cliquez 'CrÃ©er Toutes les DonnÃ©es'");
    console.log("   4. Relancez cette vÃ©rification avec verifyFullMigration()\n");
  }

  // Liens utiles
  console.log("ðŸ”— LIENS UTILES :\n");
  console.log("   ðŸ“– Guide complet : /MIGRATION_COMPLETE_VERS_SUPABASE.md");
  console.log("   ðŸš€ DÃ©marrage rapide : /DEMARRAGE_RAPIDE.md");
  console.log("   ðŸ”§ Diagnostic : /server-diagnostic");
  console.log("   ðŸ“Š Supabase Dashboard : https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu");
  console.log("   ðŸ“ Logs : https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/logs/edge-functions\n");
}

// Export pour utilisation dans les composants
export { verifyFullMigration };

// Auto-run si appelÃ© directement dans la console
if (typeof window !== "undefined") {
  (window as any).verifyFullMigration = verifyFullMigration;
  console.log("ðŸ’¡ Run verifyFullMigration() to check migration status");
}

