/**
 * Diagnostic Complet - Teste TOUS les aspects du serveur
 */

import { projectId, publicAnonKey } from "./supabase/info";

interface DiagnosticResult {
  test: string;
  status: "✅ OK" | "❌ FAIL" | "⚠️ WARNING";
  message: string;
  details?: any;
}

export async function runCompleteDiagnostic(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];
  
  console.log("🔍 === DIAGNOSTIC COMPLET DU SERVEUR ===");

  // Test 1: Variables d'environnement
  results.push({
    test: "Variables d'environnement",
    status: projectId && publicAnonKey ? "✅ OK" : "❌ FAIL",
    message: projectId && publicAnonKey 
      ? `Project ID: ${projectId.substring(0, 8)}...`
      : "Variables manquantes",
    details: { projectId: !!projectId, publicAnonKey: !!publicAnonKey }
  });

  // Test 2: Health check SANS auth
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
      { 
        method: "GET",
        signal: AbortSignal.timeout(5000)
      }
    );
    
    const text = await response.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }

    results.push({
      test: "Health check SANS Authorization",
      status: response.ok ? "✅ OK" : "❌ FAIL",
      message: response.ok 
        ? `Serveur accessible (${response.status})`
        : `Erreur ${response.status}: ${text}`,
      details: { status: response.status, body: json || text }
    });
  } catch (error: any) {
    results.push({
      test: "Health check SANS Authorization",
      status: "❌ FAIL",
      message: `Erreur réseau: ${error.message}`,
      details: { error: error.toString() }
    });
  }

  // Test 3: Health check AVEC auth
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
      { 
        method: "GET",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json"
        },
        signal: AbortSignal.timeout(5000)
      }
    );
    
    const text = await response.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }

    results.push({
      test: "Health check AVEC Authorization",
      status: response.ok ? "✅ OK" : "❌ FAIL",
      message: response.ok 
        ? `Version: ${json?.version || "unknown"}`
        : `Erreur ${response.status}: ${text}`,
      details: { status: response.status, body: json || text }
    });
  } catch (error: any) {
    results.push({
      test: "Health check AVEC Authorization",
      status: "❌ FAIL",
      message: `Erreur réseau: ${error.message}`,
      details: { error: error.toString() }
    });
  }

  // Test 4: CORS preflight
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
      { 
        method: "OPTIONS",
        headers: {
          "Origin": window.location.origin,
          "Access-Control-Request-Method": "GET",
          "Access-Control-Request-Headers": "authorization"
        },
        signal: AbortSignal.timeout(5000)
      }
    );

    const allowOrigin = response.headers.get("Access-Control-Allow-Origin");
    const allowMethods = response.headers.get("Access-Control-Allow-Methods");

    results.push({
      test: "CORS Preflight",
      status: response.ok ? "✅ OK" : "⚠️ WARNING",
      message: response.ok 
        ? `CORS OK (origin: ${allowOrigin})`
        : `Pas de réponse OPTIONS`,
      details: { 
        status: response.status,
        allowOrigin,
        allowMethods,
        currentOrigin: window.location.origin
      }
    });
  } catch (error: any) {
    results.push({
      test: "CORS Preflight",
      status: "⚠️ WARNING",
      message: `Erreur OPTIONS: ${error.message}`,
      details: { error: error.toString() }
    });
  }

  // Test 5: Newsletter stats (endpoint public)
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/newsletter/stats`,
      { 
        method: "GET",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        signal: AbortSignal.timeout(5000)
      }
    );
    
    const json = await response.json();

    results.push({
      test: "Newsletter Stats Endpoint",
      status: response.ok ? "✅ OK" : "❌ FAIL",
      message: response.ok 
        ? `${json.total || 0} subscribers`
        : `Erreur ${response.status}`,
      details: json
    });
  } catch (error: any) {
    results.push({
      test: "Newsletter Stats Endpoint",
      status: "❌ FAIL",
      message: `Erreur: ${error.message}`,
      details: { error: error.toString() }
    });
  }

  // Affichage console
  console.log("\n📊 === RÉSULTATS DU DIAGNOSTIC ===\n");
  results.forEach(r => {
    console.log(`${r.status} ${r.test}`);
    console.log(`   → ${r.message}`);
    if (r.details) {
      console.log(`   Details:`, r.details);
    }
    console.log("");
  });

  // Résumé
  const ok = results.filter(r => r.status === "✅ OK").length;
  const fail = results.filter(r => r.status === "❌ FAIL").length;
  const warn = results.filter(r => r.status === "⚠️ WARNING").length;

  console.log(`\n📈 RÉSUMÉ: ${ok}/${results.length} tests OK | ${fail} échecs | ${warn} warnings\n`);

  // Recommandations
  if (fail > 0) {
    console.log("🔧 RECOMMANDATIONS:");
    
    const healthFails = results.filter(r => 
      r.test.includes("Health") && r.status === "❌ FAIL"
    );
    
    if (healthFails.length === 2) {
      console.log("❌ Le serveur ne répond pas du tout:");
      console.log("   1. Vérifiez que le code est déployé dans Supabase Dashboard");
      console.log("   2. Allez dans Functions → make-server-04919ac5 → Logs");
      console.log("   3. Cherchez les erreurs de compilation");
      console.log("   4. Le dernier log devrait être: '🚀 Server ... starting...'");
    } else if (healthFails.some(r => r.test.includes("SANS"))) {
      console.log("❌ Le serveur exige l'Authorization header (normal pour Supabase)");
      console.log("   → C'est OK, le frontend doit toujours envoyer l'auth");
    }
    
    const corsFail = results.find(r => r.test.includes("CORS"));
    if (corsFail && corsFail.status !== "✅ OK") {
      console.log("⚠️ CORS peut causer des problèmes:");
      console.log(`   Current origin: ${window.location.origin}`);
      console.log("   → Vérifiez que le serveur autorise cette origin");
    }
  }

  if (ok === results.length) {
    console.log("✅ TOUT EST OK! Le serveur fonctionne parfaitement.");
  }

  return results;
}

// Fonction helper pour l'UI
export function getDiagnosticSummary(results: DiagnosticResult[]): {
  ok: number;
  fail: number;
  warn: number;
  total: number;
  allOk: boolean;
} {
  return {
    ok: results.filter(r => r.status === "✅ OK").length,
    fail: results.filter(r => r.status === "❌ FAIL").length,
    warn: results.filter(r => r.status === "⚠️ WARNING").length,
    total: results.length,
    allOk: results.every(r => r.status === "✅ OK")
  };
}
