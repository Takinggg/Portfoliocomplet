// Emergency fix for case studies loading issue
// This creates a workaround version that bypasses the auth issue

import { projectId, publicAnonKey } from "./supabase/info";

export async function fixCaseStudiesNow() {
  console.group("🚨 Emergency Fix - Case Studies");
  
  try {
    console.log("1️⃣ Testing current endpoints...");
    
    // Test public endpoint
    const publicResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/case-studies`
    );
    
    console.log("Public endpoint status:", publicResponse.status);
    
    if (publicResponse.ok) {
      const publicData = await publicResponse.json();
      console.log("✅ Public endpoint works! Found", publicData.caseStudies?.length || 0, "case studies");
      
      if (publicData.caseStudies && publicData.caseStudies.length === 0) {
        console.log("\n2️⃣ No case studies found. Initializing demo data...");
        
        // Check if initCaseStudies is available
        if (typeof (window as any).initCaseStudies === 'function') {
          console.log("📦 Calling initCaseStudies()...");
          await (window as any).initCaseStudies();
          console.log("✅ Case studies initialized!");
          
          // Verify
          const verifyResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/case-studies`
          );
          const verifyData = await verifyResponse.json();
          console.log("✅ Verification:", verifyData.caseStudies?.length, "case studies now exist");
        } else {
          console.warn("⚠️ initCaseStudies function not available. Please reload the page.");
        }
      }
      
      console.log("\n3️⃣ Solution: Use public endpoint in CaseStudiesTab.tsx");
      console.log("Change line 116 from:");
      console.log("  /case-studies/admin");
      console.log("To:");
      console.log("  /case-studies");
      console.log("\nOR click 'Initialiser' button in the Dashboard to create demo data.");
      
    } else {
      console.error("❌ Public endpoint failed:", publicResponse.status);
      const errorText = await publicResponse.text();
      console.error("Error:", errorText);
    }
    
    // Test admin endpoint
    console.log("\n4️⃣ Testing admin endpoint...");
    const adminResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/case-studies/admin`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );
    
    console.log("Admin endpoint status:", adminResponse.status);
    
    if (adminResponse.ok) {
      const adminData = await adminResponse.json();
      console.log("✅ Admin endpoint works! This is good news.");
      console.log("The issue might be resolved. Try refreshing the Dashboard.");
    } else {
      const errorText = await adminResponse.text();
      console.error("❌ Admin endpoint failed:", errorText);
      console.log("\n💡 SOLUTION: The server needs to be redeployed with the fixed middleware.");
      console.log("Run: supabase functions deploy make-server-04919ac5");
    }
    
  } catch (error: any) {
    console.error("\n❌ Fix failed:", error);
    console.error("Error details:", error.message);
  }
  
  console.groupEnd();
  console.log("\n📖 For detailed instructions, see: DIAGNOSTIC_CASE_STUDIES_ERROR.md");
}

// Make available globally
if (typeof window !== 'undefined') {
  (window as any).fixCaseStudiesNow = fixCaseStudiesNow;
  console.log("💡 Run fixCaseStudiesNow() to diagnose and attempt auto-fix");
}
