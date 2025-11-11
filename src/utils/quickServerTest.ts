/**
 * Test Rapide du Serveur
 * 
 * Exécutez ce fichier dans la console du navigateur pour tester rapidement le serveur
 * 
 * Usage:
 * 1. Ouvrez la console du navigateur (F12)
 * 2. Copiez/collez le code de ce fichier
 * 3. Appelez: quickServerTest()
 */

import { projectId, publicAnonKey } from "./supabase/info";

interface TestResult {
  test: string;
  status: "✅" | "❌" | "⚠️";
  message: string;
  details?: any;
}

export async function quickServerTest(): Promise<void> {
  console.log("🚀 Démarrage du test rapide du serveur...\n");
  
  const results: TestResult[] = [];
  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;

  // Test 1: Health Check
  console.log("1️⃣ Test Health Check...");
  try {
    const response = await fetch(`${baseUrl}/health`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      results.push({
        test: "Health Check",
        status: "✅",
        message: `Serveur opérationnel (version ${data.version})`,
        details: data,
      });
      console.log("✅ Health Check OK\n", data);
    } else {
      const error = await response.text();
      results.push({
        test: "Health Check",
        status: "❌",
        message: `HTTP ${response.status}`,
        details: error,
      });
      console.error("❌ Health Check échoué:", error);
    }
  } catch (error: unknown) {
    results.push({
      test: "Health Check",
      status: "❌",
      message: error.message,
      details: error,
    });
    console.error("❌ Erreur Health Check:", error);
  }

  // Test 2: Blog Posts
  console.log("\n2️⃣ Test Blog Posts...");
  try {
    const response = await fetch(`${baseUrl}/blog/posts?lang=fr`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    if (response.ok) {
      const posts = await response.json();
      results.push({
        test: "Blog Posts",
        status: posts.length > 0 ? "✅" : "⚠️",
        message: `${posts.length} articles trouvés`,
        details: { count: posts.length },
      });
      console.log(`${posts.length > 0 ? "✅" : "⚠️"} Blog Posts: ${posts.length} articles`);
    } else {
      const error = await response.text();
      results.push({
        test: "Blog Posts",
        status: "❌",
        message: `HTTP ${response.status}`,
        details: error,
      });
      console.error("❌ Blog Posts échoué:", error);
    }
  } catch (error: unknown) {
    results.push({
      test: "Blog Posts",
      status: "❌",
      message: error.message,
      details: error,
    });
    console.error("❌ Erreur Blog Posts:", error);
  }

  // Test 3: Newsletter Stats
  console.log("\n3️⃣ Test Newsletter Stats...");
  try {
    const response = await fetch(`${baseUrl}/newsletter/stats`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    if (response.ok) {
      const stats = await response.json();
      results.push({
        test: "Newsletter Stats",
        status: "✅",
        message: `${stats.total || stats.totalCount || 0} abonnés`,
        details: stats,
      });
      console.log("✅ Newsletter Stats OK\n", stats);
    } else {
      const error = await response.text();
      results.push({
        test: "Newsletter Stats",
        status: "❌",
        message: `HTTP ${response.status}`,
        details: error,
      });
      console.error("❌ Newsletter Stats échoué:", error);
    }
  } catch (error: unknown) {
    results.push({
      test: "Newsletter Stats",
      status: "❌",
      message: error.message,
      details: error,
    });
    console.error("❌ Erreur Newsletter Stats:", error);
  }

  // Test 4: Projects
  console.log("\n4️⃣ Test Projects...");
  try {
    const response = await fetch(`${baseUrl}/projects`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const count = data.projects?.length || 0;
      results.push({
        test: "Projects",
        status: "✅",
        message: `${count} projets trouvés`,
        details: { count },
      });
      console.log(`✅ Projects: ${count} projets`);
    } else {
      const error = await response.text();
      results.push({
        test: "Projects",
        status: "❌",
        message: `HTTP ${response.status}`,
        details: error,
      });
      console.error("❌ Projects échoué:", error);
    }
  } catch (error: unknown) {
    results.push({
      test: "Projects",
      status: "❌",
      message: error.message,
      details: error,
    });
    console.error("❌ Erreur Projects:", error);
  }

  // Résumé
  console.log("\n" + "=".repeat(60));
  console.log("📊 RÉSUMÉ DES TESTS\n");
  
  const successCount = results.filter((r) => r.status === "✅").length;
  const warningCount = results.filter((r) => r.status === "⚠️").length;
  const errorCount = results.filter((r) => r.status === "❌").length;

  results.forEach((result) => {
    console.log(`${result.status} ${result.test}: ${result.message}`);
  });

  console.log("\n" + "=".repeat(60));
  console.log(`Total: ${results.length} tests`);
  console.log(`✅ Réussis: ${successCount}`);
  console.log(`⚠️ Avertissements: ${warningCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log("=".repeat(60) + "\n");

  if (errorCount === 0 && warningCount === 0) {
    console.log("🎉 Tous les tests sont passés avec succès !");
    console.log("Le serveur fonctionne parfaitement.\n");
  } else if (errorCount > 0) {
    console.log("⚠️ Des erreurs ont été détectées.");
    console.log("Consultez le fichier DIAGNOSTIC_SERVEUR_APRES_DEPLOIEMENT.md pour des solutions.\n");
    
    console.log("🔍 Actions recommandées:");
    console.log("1. Vérifiez les logs: https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/logs/edge-functions");
    console.log("2. Vérifiez que le serveur est déployé: supabase functions list");
    console.log("3. Vérifiez les variables d'environnement dans le dashboard Supabase\n");
  } else if (warningCount > 0) {
    console.log("⚠️ Le serveur fonctionne mais certaines données sont manquantes.");
    console.log("Utilisez les boutons 'Initialiser' dans le dashboard pour ajouter des données.\n");
  }

  // Info projet
  console.log("📋 Informations du projet:");
  console.log(`Project ID: ${projectId}`);
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Dashboard: https://supabase.com/dashboard/project/${projectId}\n`);

  return;
}

// Version simplifiée pour copier/coller dans la console
export function testServer() {
  const projectId = "ptcxeqtjlxittxayffgu";
  const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y3hlcXRqbHhpdHR4YXlmZmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY1MjYsImV4cCI6MjA3Nzg4MjUyNn0.4xmzyoXUxas6587ZFWWc95p10bNSa2MdaipYI7RHmZc";
  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;

  console.log("🚀 Test rapide du serveur...\n");

  // Health Check
  fetch(`${baseUrl}/health`, {
    headers: { Authorization: `Bearer ${publicAnonKey}` },
  })
    .then((r) => r.json())
    .then((d) => console.log("✅ Health Check OK:", d))
    .catch((e) => console.error("❌ Health Check échoué:", e));

  // Blog Posts
  fetch(`${baseUrl}/blog/posts?lang=fr`, {
    headers: { Authorization: `Bearer ${publicAnonKey}` },
  })
    .then((r) => r.json())
    .then((d) => console.log(`✅ Blog Posts: ${d.length} articles`))
    .catch((e) => console.error("❌ Blog Posts échoué:", e));

  // Newsletter Stats
  fetch(`${baseUrl}/newsletter/stats`, {
    headers: { Authorization: `Bearer ${publicAnonKey}` },
  })
    .then((r) => r.json())
    .then((d) => console.log("✅ Newsletter Stats:", d))
    .catch((e) => console.error("❌ Newsletter Stats échoué:", e));

  console.log("\n📋 Dashboard: https://supabase.com/dashboard/project/" + projectId);
}

// Pour usage dans la console du navigateur sans import
(window as any).quickServerTest = quickServerTest;
(window as any).testServer = testServer;

console.log("✨ Tests serveur chargés ! Utilisez quickServerTest() ou testServer()");

