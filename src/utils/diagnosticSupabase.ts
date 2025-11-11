/**
 * SCRIPT DE DIAGNOSTIC SUPABASE
 * 
 * Utilisez ce script dans la console du navigateur pour diagnostiquer
 * les problèmes de connexion avec le serveur Supabase Edge Function
 * 
 * Usage:
 * ```javascript
 * import("./utils/diagnosticSupabase.js").then(m => m.runDiagnostic());
 * ```
 */

import { projectId, publicAnonKey } from "./supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;

interface DiagnosticResult {
  test: string;
  status: "✅ SUCCESS" | "❌ FAILED" | "⚠️ WARNING";
  message: string;
  details?: Record<string, unknown>;
}

export async function runDiagnostic(): Promise<void> {
  console.log("🔍 DIAGNOSTIC SUPABASE - DÉMARRAGE");
  console.log("=" .repeat(60));
  console.log("");

  const results: DiagnosticResult[] = [];

  // Test 1: Configuration
  console.log("📋 Test 1: Vérification de la configuration...");
  const configResult = checkConfiguration();
  results.push(configResult);
  logResult(configResult);

  // Test 2: Health Check
  console.log("\n🏥 Test 2: Health Check du serveur...");
  const healthResult = await testHealthCheck();
  results.push(healthResult);
  logResult(healthResult);

  // Test 3: Case Studies (Public)
  console.log("\n📚 Test 3: Chargement des Case Studies (public)...");
  const caseStudiesResult = await testCaseStudies();
  results.push(caseStudiesResult);
  logResult(caseStudiesResult);

  // Test 4: Blog Posts (Public)
  console.log("\n📝 Test 4: Chargement des Blog Posts (public)...");
  const blogResult = await testBlogPosts();
  results.push(blogResult);
  logResult(blogResult);

  // Test 5: Authentication
  console.log("\n🔐 Test 5: Vérification de l'authentification...");
  const authResult = await testAuthentication();
  results.push(authResult);
  logResult(authResult);

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 RÉSUMÉ DES TESTS");
  console.log("=" .repeat(60));
  
  const success = results.filter(r => r.status === "✅ SUCCESS").length;
  const failed = results.filter(r => r.status === "❌ FAILED").length;
  const warnings = results.filter(r => r.status === "⚠️ WARNING").length;

  console.log(`✅ Réussis: ${success}/${results.length}`);
  console.log(`❌ Échoués: ${failed}/${results.length}`);
  console.log(`⚠️ Avertissements: ${warnings}/${results.length}`);
  console.log("");

  if (failed > 0) {
    console.log("🚨 ACTIONS RECOMMANDÉES:");
    console.log("");
    
    if (healthResult.status === "❌ FAILED") {
      console.log("1. Le serveur Edge Function n'est PAS DÉPLOYÉ");
      console.log("   ➡️ Déployez le serveur avec: supabase functions deploy make-server-04919ac5");
      console.log("");
    }

    console.log("2. Consultez le guide de déploiement:");
    console.log("   ➡️ /DEPLOYMENT_GUIDE_SUPABASE.md");
    console.log("");
    
    console.log("3. Vérifiez les logs du serveur:");
    console.log("   ➡️ supabase functions logs make-server-04919ac5");
    console.log("");
  } else {
    console.log("✅ Tous les tests sont réussis! Le serveur fonctionne correctement.");
  }

  console.log("=" .repeat(60));
}

function checkConfiguration(): DiagnosticResult {
  if (!projectId || !publicAnonKey) {
    return {
      test: "Configuration",
      status: "❌ FAILED",
      message: "Variables de configuration manquantes",
      details: { projectId, publicAnonKey: publicAnonKey ? "***" : "undefined" }
    };
  }

  return {
    test: "Configuration",
    status: "✅ SUCCESS",
    message: "Configuration correcte",
    details: {
      projectId,
      publicAnonKey: `${publicAnonKey.substring(0, 20)}...`,
      baseUrl: BASE_URL
    }
  };
}

async function testHealthCheck(): Promise<DiagnosticResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${BASE_URL}/health`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        test: "Health Check",
        status: "❌ FAILED",
        message: `Serveur non disponible (HTTP ${response.status})`,
        details: { status: response.status, url: `${BASE_URL}/health` }
      };
    }

    const data = await response.json();
    return {
      test: "Health Check",
      status: "✅ SUCCESS",
      message: "Serveur opérationnel",
      details: data
    };
  } catch (error: unknown) {
    return {
      test: "Health Check",
      status: "❌ FAILED",
      message: `Impossible de contacter le serveur: ${error.message}`,
      details: { error: error.message, url: `${BASE_URL}/health` }
    };
  }
}

async function testCaseStudies(): Promise<DiagnosticResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${BASE_URL}/case-studies`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        test: "Case Studies",
        status: "❌ FAILED",
        message: `Erreur lors du chargement (HTTP ${response.status})`,
        details: { status: response.status }
      };
    }

    const data = await response.json();
    const count = Array.isArray(data) ? data.length : 0;

    if (count === 0) {
      return {
        test: "Case Studies",
        status: "⚠️ WARNING",
        message: "Aucune case study trouvée (base de données vide)",
        details: { count: 0 }
      };
    }

    return {
      test: "Case Studies",
      status: "✅ SUCCESS",
      message: `${count} case studies chargées`,
      details: { count }
    };
  } catch (error: unknown) {
    return {
      test: "Case Studies",
      status: "❌ FAILED",
      message: `Erreur: ${error.message}`,
      details: { error: error.message }
    };
  }
}

async function testBlogPosts(): Promise<DiagnosticResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${BASE_URL}/blog/posts`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        test: "Blog Posts",
        status: "❌ FAILED",
        message: `Erreur lors du chargement (HTTP ${response.status})`,
        details: { status: response.status }
      };
    }

    const data = await response.json();
    const count = Array.isArray(data) ? data.length : 0;

    if (count === 0) {
      return {
        test: "Blog Posts",
        status: "⚠️ WARNING",
        message: "Aucun article trouvé (base de données vide)",
        details: { count: 0 }
      };
    }

    return {
      test: "Blog Posts",
      status: "✅ SUCCESS",
      message: `${count} articles chargés`,
      details: { count }
    };
  } catch (error: unknown) {
    return {
      test: "Blog Posts",
      status: "❌ FAILED",
      message: `Erreur: ${error.message}`,
      details: { error: error.message }
    };
  }
}

async function testAuthentication(): Promise<DiagnosticResult> {
  try {
    const { createClient } = await import("./supabase/client");
    const supabase = createClient();
    
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      return {
        test: "Authentication",
        status: "⚠️ WARNING",
        message: `Erreur lors de la vérification: ${error.message}`,
        details: { error: error.message }
      };
    }

    if (!session) {
      return {
        test: "Authentication",
        status: "⚠️ WARNING",
        message: "Aucune session active (non connecté au dashboard)",
        details: { session: null }
      };
    }

    return {
      test: "Authentication",
      status: "✅ SUCCESS",
      message: "Session active",
      details: {
        user: session.user.email,
        expiresAt: new Date(session.expires_at! * 1000).toISOString()
      }
    };
  } catch (error: unknown) {
    return {
      test: "Authentication",
      status: "❌ FAILED",
      message: `Erreur: ${error.message}`,
      details: { error: error.message }
    };
  }
}

function logResult(result: DiagnosticResult): void {
  console.log(`${result.status} ${result.message}`);
  if (result.details) {
    console.log("   Détails:", result.details);
  }
}

// Export pour utilisation globale
if (typeof window !== "undefined") {
  (window as any).runSupabaseDiagnostic = runDiagnostic;
  console.log("💡 Astuce: Utilisez runSupabaseDiagnostic() dans la console pour lancer le diagnostic");
}

