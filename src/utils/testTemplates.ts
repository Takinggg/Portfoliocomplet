// Test utility for Newsletter Templates
// Run in browser console: testNewsletterTemplates()

export async function testNewsletterTemplates() {
  console.log("🧪 Testing Newsletter Templates...\n");

  const projectId = "ptcxeqtjlxittxayffgu";
  const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y3hlcXRqbHhpdHR4YXlmZmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY1MjYsImV4cCI6MjA3Nzg4MjUyNn0.4xmzyoXUxas6587ZFWWc95p10bNSa2MdaipYI7RHmZc";

  // Test 1: Load Projects
  console.log("📦 Testing Projects endpoint...");
  try {
    const projectsResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects`,
      {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      }
    );
    
    if (projectsResponse.ok) {
      const projectsData = await projectsResponse.json();
      console.log("✅ Projects loaded:", projectsData.projects?.length || 0);
      if (projectsData.projects?.length > 0) {
        console.log("   First project:", projectsData.projects[0].title);
      }
    } else {
      console.error("❌ Projects error:", projectsResponse.status);
    }
  } catch (error) {
    console.error("❌ Projects failed:", error);
  }

  console.log("");

  // Test 2: Load Blogs
  console.log("📚 Testing Blogs endpoint...");
  try {
    const blogsResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts`,
      {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      }
    );
    
    if (blogsResponse.ok) {
      const blogsData = await blogsResponse.json();
      const postsArray = Array.isArray(blogsData) ? blogsData : (blogsData.posts || []);
      console.log("✅ Blogs loaded:", postsArray.length);
      if (postsArray.length > 0) {
        console.log("   First blog:", postsArray[0].title);
        console.log("   Format:", Array.isArray(blogsData) ? "Array direct" : "Object with .posts");
      }
    } else {
      console.error("❌ Blogs error:", blogsResponse.status);
    }
  } catch (error) {
    console.error("❌ Blogs failed:", error);
  }

  console.log("");

  // Test 3: Load Case Studies
  console.log("💼 Testing Case Studies endpoint...");
  try {
    const caseStudiesResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/case-studies`,
      {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      }
    );
    
    if (caseStudiesResponse.ok) {
      const caseStudiesData = await caseStudiesResponse.json();
      console.log("✅ Case Studies loaded:", caseStudiesData.caseStudies?.length || 0);
      if (caseStudiesData.caseStudies?.length > 0) {
        console.log("   First case study:", caseStudiesData.caseStudies[0].title);
      }
    } else {
      console.error("❌ Case Studies error:", caseStudiesResponse.status);
    }
  } catch (error) {
    console.error("❌ Case Studies failed:", error);
  }

  console.log("\n✅ Template test complete!");
  console.log("\nℹ️ Next steps:");
  console.log("1. Go to Dashboard → Newsletter → Templates");
  console.log("2. Select a template");
  console.log("3. Check if content appears");
  console.log("4. Test preview and send");
}

// Make it available globally
if (typeof window !== "undefined") {
  (window as any).testNewsletterTemplates = testNewsletterTemplates;
  console.log("💡 Newsletter Templates test utility loaded!");
  console.log("   Run: testNewsletterTemplates()");
}
