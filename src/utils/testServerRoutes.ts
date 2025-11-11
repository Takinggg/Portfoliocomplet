/**
 * Script de test des routes du serveur Edge Function
 * Permet de vérifier que toutes les routes critiques sont accessibles
 */

import { projectId, publicAnonKey } from "./supabase/info";

interface RouteTest {
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  requiresAuth: boolean;
  expectedStatus: number;
}

const routes: RouteTest[] = [
  {
    name: "Health Check",
    method: "GET",
    path: "/make-server-04919ac5/health",
    requiresAuth: false,
    expectedStatus: 200,
  },
  {
    name: "Get Clients",
    method: "GET",
    path: "/make-server-04919ac5/clients",
    requiresAuth: true,
    expectedStatus: 200,
  },
  {
    name: "Get Leads",
    method: "GET",
    path: "/make-server-04919ac5/leads",
    requiresAuth: true,
    expectedStatus: 200,
  },
  {
    name: "Get Projects",
    method: "GET",
    path: "/make-server-04919ac5/projects",
    requiresAuth: false,
    expectedStatus: 200,
  },
  {
    name: "Get Resources",
    method: "GET",
    path: "/make-server-04919ac5/resources",
    requiresAuth: false,
    expectedStatus: 200,
  },
  {
    name: "Newsletter Stats",
    method: "GET",
    path: "/make-server-04919ac5/newsletter/stats",
    requiresAuth: false,
    expectedStatus: 200,
  },
];

export async function testServerRoutes(accessToken?: string): Promise<{
  success: boolean;
  results: Array<{
    name: string;
    success: boolean;
    status: number;
    error?: string;
  }>;
}> {
  const baseUrl = `https://${projectId}.supabase.co/functions/v1`;
  const results = [];

  console.log("🔍 Testing server routes...\n");

  for (const route of routes) {
    const url = `${baseUrl}${route.path}`;
    const headers: Record<string, string> = {};

    if (route.requiresAuth) {
      if (!accessToken) {
        console.log(`⚠️  ${route.name}: SKIPPED (no access token provided)`);
        results.push({
          name: route.name,
          success: false,
          status: 0,
          error: "No access token provided",
        });
        continue;
      }
      headers.Authorization = `Bearer ${accessToken}`;
    } else {
      headers.Authorization = `Bearer ${publicAnonKey}`;
    }

    try {
      const response = await fetch(url, {
        method: route.method,
        headers,
      });

      const success = response.status === route.expectedStatus;
      const icon = success ? "✅" : "❌";

      console.log(
        `${icon} ${route.name}: ${response.status} ${
          response.statusText
        } (expected ${route.expectedStatus})`
      );

      if (!success) {
        const text = await response.text();
        console.log(`   Error: ${text.substring(0, 100)}`);
      }

      results.push({
        name: route.name,
        success,
        status: response.status,
        error: success ? undefined : await response.text().catch(() => "Unknown error"),
      });
    } catch (error: unknown) {
      console.log(`❌ ${route.name}: FAILED - ${error.message}`);
      results.push({
        name: route.name,
        success: false,
        status: 0,
        error: error.message,
      });
    }
  }

  const successCount = results.filter((r) => r.success).length;
  const totalCount = results.length;

  console.log(`\n📊 Results: ${successCount}/${totalCount} routes OK`);

  return {
    success: successCount === totalCount,
    results,
  };
}

/**
 * Test simple qui peut être appelé depuis la console
 */
export async function quickTest() {
  console.log("🚀 Quick server test (without auth)...\n");
  
  const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`;
  
  try {
    const response = await fetch(healthUrl);
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log("✅ Server is ONLINE");
      console.log(`   Version: ${data.version}`);
      console.log(`   Timestamp: ${data.timestamp}`);
      return true;
    } else {
      console.log("❌ Server responded but with error");
      console.log(data);
      return false;
    }
  } catch (error: unknown) {
    console.log("❌ Server is OFFLINE or unreachable");
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

/**
 * Test des routes clients spécifiquement
 */
export async function testClientRoutes(accessToken: string) {
  console.log("🔍 Testing client routes...\n");
  
  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients`;
  
  try {
    // Test GET
    const getResponse = await fetch(baseUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    console.log(`GET /clients: ${getResponse.status} ${getResponse.statusText}`);
    
    if (getResponse.status === 404) {
      console.log("\n❌ ERREUR 404: Les routes clients ne sont pas déployées!");
      console.log("📖 Solution: Consultez REDEPLOYER_SERVEUR.md");
      return false;
    }
    
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log(`✅ Found ${data.clients?.length || 0} clients`);
      return true;
    } else {
      const error = await getResponse.text();
      console.log(`❌ Error: ${error}`);
      return false;
    }
  } catch (error: unknown) {
    console.log(`❌ Network error: ${error.message}`);
    return false;
  }
}

// Export pour utilisation dans la console du navigateur
if (typeof window !== "undefined") {
  (window as any).testServer = {
    quickTest,
    testClientRoutes,
    testAllRoutes: testServerRoutes,
  };
  
  console.log("🔧 Server test utilities loaded!");
  console.log("   Run: testServer.quickTest()");
  console.log("   Run: testServer.testClientRoutes(yourAccessToken)");
  console.log("   Run: testServer.testAllRoutes(yourAccessToken)");
}

