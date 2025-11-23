/**
 * Helper pour afficher les instructions de dÃ©ploiement dans la console
 */

import { projectId } from "./supabase/info";

export function showDeploymentHelp(): void {
  console.log("\n");
  console.log("â•".repeat(70));
  console.log("ðŸš€ GUIDE RAPIDE - DÃ‰PLOYER LE SERVEUR SUPABASE");
  console.log("â•".repeat(70));
  console.log("\n");
  
  console.log("ðŸ“¦ Ã‰TAPE 1: Installer Supabase CLI");
  console.log("â”€".repeat(70));
  console.log("%cnpm install -g supabase", "background: #0C0C0C; color: #CCFF00; padding: 4px 8px; border-radius: 4px;");
  console.log("\n");

  console.log("ðŸ” Ã‰TAPE 2: Se connecter Ã  Supabase");
  console.log("â”€".repeat(70));
  console.log("%csupabase login", "background: #0C0C0C; color: #CCFF00; padding: 4px 8px; border-radius: 4px;");
  console.log("â†’ Cela ouvrira un navigateur pour vous authentifier");
  console.log("\n");

  console.log("ðŸ”— Ã‰TAPE 3: Lier le projet");
  console.log("â”€".repeat(70));
  console.log(`%csupabase link --project-ref ${projectId}`, "background: #0C0C0C; color: #CCFF00; padding: 4px 8px; border-radius: 4px;");
  console.log("â†’ Entrez votre mot de passe de base de donnÃ©es quand demandÃ©");
  console.log("\n");

  console.log("ðŸš€ Ã‰TAPE 4: DÃ©ployer le serveur");
  console.log("â”€".repeat(70));
  console.log("%csupabase functions deploy make-server-04919ac5", "background: #0C0C0C; color: #CCFF00; padding: 4px 8px; border-radius: 4px;");
  console.log("â†’ Le dÃ©ploiement prend gÃ©nÃ©ralement 1-2 minutes");
  console.log("\n");

  console.log("âœ… Ã‰TAPE 5: VÃ©rifier le dÃ©ploiement");
  console.log("â”€".repeat(70));
  console.log(`%ccurl https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`, "background: #0C0C0C; color: #CCFF00; padding: 4px 8px; border-radius: 4px;");
  console.log("â†’ Devrait retourner: { success: true, message: \"Server is running...\" }");
  console.log("\n");

  console.log("â•".repeat(70));
  console.log("ðŸ“– GUIDES COMPLETS");
  console.log("â•".repeat(70));
  console.log("â†’ Guide dÃ©taillÃ©: /DEPLOYMENT_GUIDE_SUPABASE.md");
  console.log("â†’ RÃ©sumÃ© rapide: /FIX_SUPABASE_CONNECTION.md");
  console.log("â†’ Diagnostic case studies: /DIAGNOSTIC_CASE_STUDIES.md");
  console.log("\n");

  console.log("â•".repeat(70));
  console.log("ðŸ§ª OUTILS DE DIAGNOSTIC");
  console.log("â•".repeat(70));
  console.log("â†’ Diagnostic complet:");
  console.log("%c  runSupabaseDiagnostic()", "background: #0C0C0C; color: #CCFF00; padding: 4px 8px; border-radius: 4px;");
  console.log("\nâ†’ Test health check:");
  console.log(`%c  fetch('https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health')
    .then(r => r.json())
    .then(console.log)`, "background: #0C0C0C; color: #CCFF00; padding: 4px 8px; border-radius: 4px;");
  console.log("\n");

  console.log("â•".repeat(70));
  console.log("ðŸ’¡ ASTUCE");
  console.log("â•".repeat(70));
  console.log("Si vous utilisez VS Code, vous pouvez dÃ©ployer directement depuis le terminal intÃ©grÃ©!");
  console.log("\n");
}

// Afficher automatiquement au chargement en mode dÃ©veloppement
if (typeof window !== "undefined" && import.meta.env.DEV) {
  (window as any).showDeploymentHelp = showDeploymentHelp;
  console.log("%cðŸ’¡ Besoin d'aide pour dÃ©ployer le serveur?", "font-size: 14px; font-weight: bold; color: #CCFF00;");
  console.log("%cTapez: showDeploymentHelp()", "font-size: 12px; color: #888;");
}
