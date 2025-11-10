// Test the public resources endpoint directly
import { projectId } from "./supabase/info";

async function testPublicResourcesEndpoint() {
  console.log("🧪 ========================================");
  console.log("🧪 TESTING PUBLIC RESOURCES ENDPOINT");
  console.log("🧪 ========================================\n");

  const publicUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources`;
  
  console.log(`📡 Testing: ${publicUrl}`);
  console.log("   Method: GET");
  console.log("   Headers: None (public endpoint)");
  console.log("");

  try {
    const response = await fetch(publicUrl, {
      method: "GET",
      headers: {
        // Pas d'Authorization header - c'est un endpoint public
      }
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log(`📊 Headers:`, Object.fromEntries(response.headers.entries()));
    console.log("");

    if (!response.ok) {
      console.error(`❌ Request failed with status ${response.status}`);
      
      // Try to get error message
      try {
        const errorText = await response.text();
        console.error(`📄 Response body:`, errorText);
      } catch (e) {
        console.error("Could not read response body");
      }
      
      // Suggestions
      console.log("\n💡 Possible causes:");
      console.log("   1. Edge Function not deployed");
      console.log("   2. CORS issue");
      console.log("   3. Authentication middleware blocking public access");
      console.log("   4. Route not registered correctly");
      
      return;
    }

    // Parse JSON response
    const data = await response.json();
    console.log("✅ Request successful!");
    console.log(`📊 Response:`, JSON.stringify(data, null, 2));
    
    if (data.success) {
      const count = data.resources?.length || 0;
      console.log(`\n✅ Found ${count} published resources`);
      
      if (count > 0) {
        console.log("\n📚 Resources:");
        data.resources.forEach((r: any, idx: number) => {
          console.log(`   ${idx + 1}. ${r.title}`);
          console.log(`      Category: ${r.category}`);
          console.log(`      Published: ${r.isPublished}`);
          console.log(`      Downloads: ${r.downloads}`);
        });
      } else {
        console.log("\n⚠️ No resources returned");
        console.log("💡 Message:", data.message || "None");
      }
    } else {
      console.error("\n❌ API returned error:", data.error);
    }

  } catch (error: any) {
    console.error("\n❌ Request failed with exception:");
    console.error("   Error:", error.message);
    console.error("   Type:", error.name);
    
    if (error.message.includes("Failed to fetch")) {
      console.log("\n💡 Possible causes:");
      console.log("   - Edge Function not deployed");
      console.log("   - Network error");
      console.log("   - CORS blocking the request");
    }
  }

  console.log("\n🧪 ========================================");
  console.log("🧪 TEST COMPLETE");
  console.log("🧪 ========================================");
}

// Test with Authorization header (like the frontend does)
async function testPublicWithAuthHeader() {
  console.log("\n🧪 Testing PUBLIC endpoint WITH Authorization header...\n");

  const publicUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources`;
  
  // Get publicAnonKey
  const { publicAnonKey } = await import("./supabase/info");
  
  console.log(`📡 URL: ${publicUrl}`);
  console.log(`🔑 Authorization: Bearer ${publicAnonKey.substring(0, 20)}...`);
  console.log("");

  try {
    const response = await fetch(publicUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${publicAnonKey}`
      }
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.error(`❌ Request failed with status ${response.status}`);
      const errorText = await response.text();
      console.error(`📄 Response:`, errorText);
      return;
    }

    const data = await response.json();
    console.log("✅ Request successful with Authorization header!");
    console.log(`📊 Found ${data.resources?.length || 0} resources`);
    
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

// Make functions available globally
if (typeof window !== "undefined") {
  (window as any).testPublicResourcesEndpoint = testPublicResourcesEndpoint;
  (window as any).testPublicWithAuthHeader = testPublicWithAuthHeader;
  
  console.log("🧪 Public endpoint test loaded!");
  console.log("   await testPublicResourcesEndpoint()  - Test without auth");
  console.log("   await testPublicWithAuthHeader()     - Test with auth header");
}

export { testPublicResourcesEndpoint, testPublicWithAuthHeader };
