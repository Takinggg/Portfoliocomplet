/**
 * Test Resources Bilingual Display
 * Tests that resources are correctly displayed in French and English
 */

export async function testResourcesBilingual() {
  console.log("\n🧪 Testing Resources Bilingual Display...\n");
  
  try {
    // Import the service
    const { fetchResources } = await import("./dataService");
    
    // Test 1: Fetch resources in French
    console.log("📋 Test 1: Fetching resources in French...");
    const { resources: resourcesFR, mode: modeFR } = await fetchResources("fr");
    console.log(`✅ Fetched ${resourcesFR.length} resources in French (${modeFR} mode)`);
    
    if (resourcesFR.length > 0) {
      const firstResource = resourcesFR[0];
      console.log(`   • First resource title: "${firstResource.title}"`);
      console.log(`   • Description: "${firstResource.description?.substring(0, 50)}..."`);
      console.log(`   • File URL: "${firstResource.fileUrl}"`);
    }
    
    // Test 2: Fetch resources in English
    console.log("\n📋 Test 2: Fetching resources in English...");
    const { resources: resourcesEN, mode: modeEN } = await fetchResources("en");
    console.log(`✅ Fetched ${resourcesEN.length} resources in English (${modeEN} mode)`);
    
    if (resourcesEN.length > 0) {
      const firstResource = resourcesEN[0];
      console.log(`   • First resource title: "${firstResource.title}"`);
      console.log(`   • Description: "${firstResource.description?.substring(0, 50)}..."`);
      console.log(`   • File URL: "${firstResource.fileUrl}"`);
    }
    
    // Test 3: Compare results
    console.log("\n📊 Test 3: Comparing FR vs EN results...");
    
    if (resourcesFR.length === resourcesEN.length) {
      console.log(`✅ Same number of resources in both languages (${resourcesFR.length})`);
    } else {
      console.warn(`⚠️ Different number of resources! FR: ${resourcesFR.length}, EN: ${resourcesEN.length}`);
    }
    
    // Test specific resource
    const checklistFR = resourcesFR.find(r => r.title?.includes("Checklist"));
    const checklistEN = resourcesEN.find(r => r.title?.includes("Checklist"));
    
    if (checklistFR && checklistEN) {
      console.log("\n🔍 Comparing 'Checklist' resource:");
      console.log(`   FR: "${checklistFR.title}"`);
      console.log(`   EN: "${checklistEN.title}"`);
      
      if (checklistFR.title !== checklistEN.title) {
        console.log("   ✅ Titles are different (correct!)");
      } else {
        console.warn("   ⚠️ Titles are the same (might be a problem)");
      }
      
      console.log(`\n   FR file: "${checklistFR.fileUrl}"`);
      console.log(`   EN file: "${checklistEN.fileUrl}"`);
      
      if (checklistFR.fileUrl !== checklistEN.fileUrl) {
        console.log("   ✅ File URLs are different (correct!)");
      } else {
        console.warn("   ⚠️ File URLs are the same (might be a problem)");
      }
    }
    
    console.log("\n✅ Resources bilingual test completed!\n");
    
    return {
      success: true,
      resourcesFR: resourcesFR.length,
      resourcesEN: resourcesEN.length,
      mode: modeFR
    };
  } catch (error) {
    console.error("\n❌ Error testing resources bilingual:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Make available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testResourcesBilingual = testResourcesBilingual;
  console.log("💡 Resources bilingual test available! Run: testResourcesBilingual()");
}
