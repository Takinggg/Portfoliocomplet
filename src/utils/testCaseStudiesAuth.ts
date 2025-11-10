// Test script to diagnose case studies authentication issue
import { projectId, publicAnonKey } from "./supabase/info";

export async function testCaseStudiesAuth() {
  console.group("🔍 Testing Case Studies Authentication");
  
  try {
    // Test 1: Check if endpoint exists
    console.log("\n1️⃣ Testing endpoint availability...");
    const healthResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`
    );
    console.log("✅ Health endpoint status:", healthResponse.status);
    
    // Test 2: Test public endpoint
    console.log("\n2️⃣ Testing public endpoint...");
    const publicResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/case-studies`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );
    
    console.log("Public endpoint status:", publicResponse.status);
    const publicData = await publicResponse.json();
    console.log("Public endpoint response:", publicData);
    
    // Test 3: Test admin endpoint
    console.log("\n3️⃣ Testing admin endpoint...");
    const adminResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/case-studies/admin`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );
    
    console.log("Admin endpoint status:", adminResponse.status);
    const adminText = await adminResponse.text();
    console.log("Admin endpoint raw response:", adminText);
    
    try {
      const adminData = JSON.parse(adminText);
      console.log("Admin endpoint parsed response:", adminData);
      
      if (adminResponse.ok) {
        console.log("\n✅ SUCCESS! Admin endpoint is working correctly");
        console.log(`Found ${adminData.caseStudies?.length || 0} case studies`);
      } else {
        console.log("\n❌ FAILED! Admin endpoint returned error:");
        console.log("Status:", adminResponse.status);
        console.log("Error:", adminData.error);
      }
    } catch (e) {
      console.log("❌ Could not parse response as JSON:", adminText);
    }
    
    // Test 4: Check environment variables
    console.log("\n4️⃣ Checking configuration...");
    console.log("Project ID:", projectId);
    console.log("Public Anon Key (first 20 chars):", publicAnonKey.substring(0, 20) + "...");
    
  } catch (error: any) {
    console.error("\n❌ Test failed with error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });
  }
  
  console.groupEnd();
}

// Auto-run if this file is imported
if (typeof window !== 'undefined') {
  (window as any).testCaseStudiesAuth = testCaseStudiesAuth;
  console.log("💡 Run testCaseStudiesAuth() in console to diagnose the issue");
}
