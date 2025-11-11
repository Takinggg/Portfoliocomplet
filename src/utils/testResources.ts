// Test utilities for Resources system
// Usage in browser console: await window.testResources()

import { createClient } from "./supabase/client";
import { projectId, publicAnonKey } from "./supabase/info";

// Test creating a bucket
async function createResourcesBucket() {
  console.log("🪣 Creating resources bucket...");
  
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("❌ You must be logged in");
      return;
    }

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources/upload-url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          fileName: "test.pdf"
        })
      }
    );

    const data = await response.json();
    
    if (data.success) {
      console.log("✅ Bucket ready:", data.bucketName);
      console.log("💡 You can now upload files!");
    } else {
      console.error("❌ Error:", data.error);
    }
  } catch (error) {
    console.error("❌ Error creating bucket:", error);
  }
}

// Test listing all resources
async function listResources() {
  console.log("📚 Fetching all resources...");
  
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources`
    );

    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Found ${data.resources.length} resources:`);
      data.resources.forEach((r, idx: number) => {
        console.log(`  ${idx + 1}. ${r.title} (${r.category}) - ${r.downloads} downloads`);
      });
      return data.resources;
    } else {
      console.error("❌ Error:", data.error);
    }
  } catch (error) {
    console.error("❌ Error fetching resources:", error);
  }
}

// Test downloading a resource
async function downloadResource(resourceId: string, email = "test@example.com", name = "Test User") {
  console.log(`📥 Testing download of resource: ${resourceId}`);
  
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources/${resourceId}/download`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name })
      }
    );

    const data = await response.json();
    
    if (data.success) {
      console.log("✅ Download successful!");
      console.log("📄 File URL:", data.fileUrl);
      console.log("💡 Lead created/updated for:", email);
      return data;
    } else {
      console.error("❌ Error:", data.error);
    }
  } catch (error) {
    console.error("❌ Error downloading resource:", error);
  }
}

// Test creating a resource
async function createTestResource() {
  console.log("➕ Creating test resource...");
  
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("❌ You must be logged in");
      return;
    }

    const testResource = {
      title: "Test Resource " + Date.now(),
      description: "This is a test resource created from console",
      category: "guides",
      fileUrl: "https://example.com/test.pdf",
      coverImage: "https://images.unsplash.com/photo-1644352739408-a191ed85e513?w=800",
      tags: ["test", "demo"],
      isPublished: true
    };

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(testResource)
      }
    );

    const data = await response.json();
    
    if (data.success) {
      console.log("✅ Resource created!");
      console.log("📦 Resource ID:", data.resource.id);
      console.log("📚 Title:", data.resource.title);
      return data.resource;
    } else {
      console.error("❌ Error:", data.error);
    }
  } catch (error) {
    console.error("❌ Error creating resource:", error);
  }
}

// Test getting analytics
async function getAnalytics() {
  console.log("📊 Fetching download analytics...");
  
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("❌ You must be logged in");
      return;
    }

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources/analytics/downloads`,
      {
        headers: { Authorization: `Bearer ${session.access_token}` }
      }
    );

    const data = await response.json();
    
    if (data.success) {
      console.log("✅ Analytics:");
      console.log(`  📥 Total downloads: ${data.analytics.total}`);
      console.log(`  📚 Resources: ${data.analytics.byResource.length}`);
      console.log(`  👥 Unique emails: ${data.analytics.byEmail.length}`);
      
      if (data.analytics.byResource.length > 0) {
        console.log("\n  Top resources:");
        data.analytics.byResource
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          .forEach((r, idx: number) => {
            console.log(`    ${idx + 1}. ${r.resourceTitle} - ${r.count} downloads`);
          });
      }
      
      return data.analytics;
    } else {
      console.error("❌ Error:", data.error);
    }
  } catch (error) {
    console.error("❌ Error fetching analytics:", error);
  }
}

// Complete test suite
async function testResources() {
  console.log("🧪 Running complete Resources test suite...\n");
  
  try {
    // 1. List existing resources
    console.log("1️⃣ Listing resources:");
    const resources = await listResources();
    console.log("");
    
    // 2. Create test resource
    console.log("2️⃣ Creating test resource:");
    const newResource = await createTestResource();
    console.log("");
    
    if (newResource) {
      // 3. Download the resource
      console.log("3️⃣ Testing download:");
      await downloadResource(newResource.id);
      console.log("");
      
      // 4. Get analytics
      console.log("4️⃣ Fetching analytics:");
      await getAnalytics();
      console.log("");
    }
    
    console.log("✅ All tests completed!");
    console.log("\n💡 Individual test functions available:");
    console.log("  - listResources()");
    console.log("  - createTestResource()");
    console.log("  - downloadResource(resourceId, email, name)");
    console.log("  - getAnalytics()");
    console.log("  - createResourcesBucket()");
    
  } catch (error) {
    console.error("❌ Test suite failed:", error);
  }
}

// Quick tests
const quickTests = {
  // Test 1: Check if resources endpoint is accessible
  async checkEndpoint() {
    console.log("🔍 Checking resources endpoint...");
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources`
      );
      const data = await response.json();
      console.log(data.success ? "✅ Endpoint working!" : "❌ Endpoint error");
      return data.success;
    } catch (error) {
      console.error("❌ Endpoint unreachable:", error);
      return false;
    }
  },
  
  // Test 2: Check if user is authenticated
  async checkAuth() {
    console.log("🔐 Checking authentication...");
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    console.log(session ? "✅ Authenticated" : "❌ Not authenticated");
    return !!session;
  },
  
  // Test 3: Count resources
  async countResources() {
    console.log("📊 Counting resources...");
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources`
      );
      const data = await response.json();
      if (data.success) {
        console.log(`✅ Found ${data.resources.length} resources`);
        return data.resources.length;
      }
    } catch (error) {
      console.error("❌ Error counting:", error);
    }
    return 0;
  },
  
  // Run all quick tests
  async runAll() {
    console.log("⚡ Running quick tests...\n");
    await this.checkEndpoint();
    await this.checkAuth();
    await this.countResources();
    console.log("\n✅ Quick tests completed!");
  }
};

// Make functions available globally
if (typeof window !== "undefined") {
  (window as any).testResources = testResources;
  (window as any).listResources = listResources;
  (window as any).createTestResource = createTestResource;
  (window as any).downloadResource = downloadResource;
  (window as any).getAnalytics = getAnalytics;
  (window as any).createResourcesBucket = createResourcesBucket;
  (window as any).quickTestResources = quickTests;
  
  console.log("🧪 Resources test utilities loaded!");
  console.log("💡 Available commands:");
  console.log("  - await testResources()              // Run full test suite");
  console.log("  - await quickTestResources.runAll()  // Quick tests");
  console.log("  - await listResources()              // List all resources");
  console.log("  - await createTestResource()         // Create test resource");
  console.log("  - await getAnalytics()               // View analytics");
  console.log("  - await createResourcesBucket()      // Initialize bucket");
}

export {
  testResources,
  listResources,
  createTestResource,
  downloadResource,
  getAnalytics,
  createResourcesBucket,
  quickTests
};

