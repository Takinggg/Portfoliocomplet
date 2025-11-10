/**
 * Helper pour afficher les instructions de déploiement dans la console
 */

import { projectId } from "./supabase/info";

export function showDeploymentHelp(): void {
  console.log("\n");
  console.log("═".repeat(70));
  console.log("🚀 GUIDE RAPIDE - DÉPLOYER LE SERVEUR SUPABASE");
  console.log("═".repeat(70));
  console.log("\n");
  
  console.log("📦 ÉTAPE 1: Installer Supabase CLI");
  console.log("─".repeat(70));
  console.log("%cnpm install -g supabase", "background: #0C0C0C; color: #00FFC2; padding: 4px 8px; border-radius: 4px;");
  console.log("\n");

  console.log("🔐 ÉTAPE 2: Se connecter à Supabase");
  console.log("─".repeat(70));
  console.log("%csupabase login", "background: #0C0C0C; color: #00FFC2; padding: 4px 8px; border-radius: 4px;");
  console.log("→ Cela ouvrira un navigateur pour vous authentifier");
  console.log("\n");

  console.log("🔗 ÉTAPE 3: Lier le projet");
  console.log("─".repeat(70));
  console.log(`%csupabase link --project-ref ${projectId}`, "background: #0C0C0C; color: #00FFC2; padding: 4px 8px; border-radius: 4px;");
  console.log("→ Entrez votre mot de passe de base de données quand demandé");
  console.log("\n");

  console.log("🚀 ÉTAPE 4: Déployer le serveur");
  console.log("─".repeat(70));
  console.log("%csupabase functions deploy make-server-04919ac5", "background: #0C0C0C; color: #00FFC2; padding: 4px 8px; border-radius: 4px;");
  console.log("→ Le déploiement prend généralement 1-2 minutes");
  console.log("\n");

  console.log("✅ ÉTAPE 5: Vérifier le déploiement");
  console.log("─".repeat(70));
  console.log(`%ccurl https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`, "background: #0C0C0C; color: #00FFC2; padding: 4px 8px; border-radius: 4px;");
  console.log("→ Devrait retourner: { success: true, message: \"Server is running...\" }");
  console.log("\n");

  console.log("═".repeat(70));
  console.log("📖 GUIDES COMPLETS");
  console.log("═".repeat(70));
  console.log("→ Guide détaillé: /DEPLOYMENT_GUIDE_SUPABASE.md");
  console.log("→ Résumé rapide: /FIX_SUPABASE_CONNECTION.md");
  console.log("→ Diagnostic case studies: /DIAGNOSTIC_CASE_STUDIES.md");
  console.log("\n");

  console.log("═".repeat(70));
  console.log("🧪 OUTILS DE DIAGNOSTIC");
  console.log("═".repeat(70));
  console.log("→ Diagnostic complet:");
  console.log("%c  runSupabaseDiagnostic()", "background: #0C0C0C; color: #00FFC2; padding: 4px 8px; border-radius: 4px;");
  console.log("\n→ Test health check:");
  console.log(`%c  fetch('https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health')
    .then(r => r.json())
    .then(console.log)`, "background: #0C0C0C; color: #00FFC2; padding: 4px 8px; border-radius: 4px;");
  console.log("\n");

  console.log("═".repeat(70));
  console.log("💡 ASTUCE");
  console.log("═".repeat(70));
  console.log("Si vous utilisez VS Code, vous pouvez déployer directement depuis le terminal intégré!");
  console.log("\n");
}

// Afficher automatiquement au chargement en mode développement
if (typeof window !== "undefined" && import.meta.env.DEV) {
  (window as any).showDeploymentHelp = showDeploymentHelp;
  console.log("%c💡 Besoin d'aide pour déployer le serveur?", "font-size: 14px; font-weight: bold; color: #00FFC2;");
  console.log("%cTapez: showDeploymentHelp()", "font-size: 12px; color: #888;");
}
