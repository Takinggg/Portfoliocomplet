// Debug utility to check resources visibility issue
import { createClient } from "./supabase/client";
import { projectId } from "./supabase/info";

async function debugResources() {
  console.log("🔍 ========================================");
  console.log("🔍 RESOURCE VISIBILITY DEBUG");
  console.log("🔍 ========================================\n");

  const supabase = createClient();

  // Test 1: Check if logged in
  console.log("1️⃣ Checking authentication...");
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    console.log("✅ Logged in as:", session.user.email);
  } else {
    console.log("⚠️ Not logged in");
  }

  // Test 2: Fetch from admin endpoint
  console.log("\n2️⃣ Fetching from ADMIN endpoint...");
  try {
    const adminUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources/admin`;
    console.log(`   URL: ${adminUrl}`);
    
    const adminResponse = await fetch(adminUrl, {
      headers: session ? { Authorization: `Bearer ${session.access_token}` } : {}
    });
    
    console.log(`   Status: ${adminResponse.status}`);
    const adminData = await adminResponse.json();
    
    if (adminData.success) {
      console.log(`✅ Admin endpoint: ${adminData.resources?.length || 0} resources`);
      if (adminData.resources?.length > 0) {
        console.log("\n   Resources found:");
        adminData.resources.forEach((r: any, idx: number) => {
          console.log(`   ${idx + 1}. ${r.title}`);
          console.log(`      ID: ${r.id}`);
          console.log(`      Category: ${r.category}`);
          console.log(`      isPublished: ${r.isPublished} (type: ${typeof r.isPublished})`);
          console.log(`      Downloads: ${r.downloads}`);
          console.log("");
        });
      }
    } else {
      console.log("❌ Admin endpoint error:", adminData.error);
    }
  } catch (error) {
    console.error("❌ Admin endpoint failed:", error);
  }

  // Test 3: Fetch from public endpoint
  console.log("\n3️⃣ Fetching from PUBLIC endpoint...");
  try {
    const publicUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources`;
    console.log(`   URL: ${publicUrl}`);
    
    const publicResponse = await fetch(publicUrl);
    
    console.log(`   Status: ${publicResponse.status}`);
    const publicData = await publicResponse.json();
    
    if (publicData.success) {
      console.log(`✅ Public endpoint: ${publicData.resources?.length || 0} resources`);
      if (publicData.resources?.length > 0) {
        console.log("\n   Resources found:");
        publicData.resources.forEach((r: any, idx: number) => {
          console.log(`   ${idx + 1}. ${r.title}`);
          console.log(`      isPublished: ${r.isPublished}`);
        });
      } else {
        console.log("⚠️ Public endpoint returned 0 resources");
        console.log("   Message:", publicData.message);
      }
    } else {
      console.log("❌ Public endpoint error:", publicData.error);
    }
  } catch (error) {
    console.error("❌ Public endpoint failed:", error);
  }

  // Test 4: Check KV store directly
  console.log("\n4️⃣ Checking KV store directly...");
  if (session) {
    try {
      const kvTestUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/debug/kv`;
      console.log("   (Attempting direct KV test if available)");
      // This would require a debug endpoint on the server
    } catch (error) {
      console.log("   ⚠️ Direct KV check not available");
    }
  }

  console.log("\n🔍 ========================================");
  console.log("🔍 DEBUG COMPLETE");
  console.log("🔍 ========================================");
}

async function fixResourcesPublished() {
  console.log("🔧 Fixing resources isPublished status...\n");

  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.error("❌ You must be logged in");
    return;
  }

  // Get all resources from admin endpoint
  const adminResponse = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources/admin`,
    {
      headers: { Authorization: `Bearer ${session.access_token}` }
    }
  );

  const adminData = await adminResponse.json();
  
  if (!adminData.success || !adminData.resources) {
    console.error("❌ Failed to fetch resources");
    return;
  }

  console.log(`Found ${adminData.resources.length} resources\n`);

  // Update each one to ensure isPublished is true
  for (const resource of adminData.resources) {
    console.log(`Updating: ${resource.title}`);
    console.log(`  Current isPublished: ${resource.isPublished} (type: ${typeof resource.isPublished})`);
    
    const updateResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources/${resource.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          ...resource,
          isPublished: true // Force to boolean true
        })
      }
    );

    const updateData = await updateResponse.json();
    
    if (updateData.success) {
      console.log(`  ✅ Updated successfully`);
    } else {
      console.log(`  ❌ Update failed:`, updateData.error);
    }
  }

  console.log("\n✅ Fix complete! Try fetching resources again.");
}

// Make functions available globally
if (typeof window !== "undefined") {
  (window as any).debugResources = debugResources;
  (window as any).fixResourcesPublished = fixResourcesPublished;
  
  console.log("🔍 Debug tools loaded!");
  console.log("   await debugResources()        - Full diagnostic");
  console.log("   await fixResourcesPublished() - Fix isPublished status");
}

export { debugResources, fixResourcesPublished };
