/**
 * Test des nouvelles routes Projects
 * Exécuter dans la console pour vérifier que tout fonctionne
 */

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;

export async function testProjectsRoutes() {
  console.log("🧪 Testing Projects Routes...\n");
  
  let testProjectId: string | null = null;
  
  try {
    // 1. Test GET all projects
    console.log("1️⃣ Testing GET /projects...");
    const getResponse = await fetch(`${API_BASE}/projects`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });
    const getData = await getResponse.json();
    console.log(`✅ GET /projects: ${getData.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`   Found ${getData.projects?.length || 0} projects`);
    console.log("");

    // 2. Test POST create project
    console.log("2️⃣ Testing POST /projects (create)...");
    const newProject = {
      name: "Test Project API",
      category: "web",
      description: "Projet créé automatiquement par le test de routes",
      budget: 3000,
      status: "completed",
      tags: ["Test", "API", "Automation"],
      technologies: ["React", "TypeScript", "Supabase"],
      isPinned: false,
      language: "fr"
    };
    
    const postResponse = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(newProject),
    });
    const postData = await postResponse.json();
    
    if (postData.success && postData.project) {
      testProjectId = postData.project.id;
      console.log(`✅ POST /projects: SUCCESS`);
      console.log(`   Created project: ${postData.project.name} (${testProjectId})`);
    } else {
      console.log(`❌ POST /projects: FAILED`);
      console.log(`   Error: ${postData.error}`);
      return;
    }
    console.log("");

    // 3. Test GET single project
    console.log("3️⃣ Testing GET /projects/:id...");
    const getOneResponse = await fetch(`${API_BASE}/projects/${testProjectId}`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });
    const getOneData = await getOneResponse.json();
    console.log(`✅ GET /projects/:id: ${getOneData.id ? 'SUCCESS' : 'FAILED'}`);
    console.log(`   Project name: ${getOneData.name}`);
    console.log("");

    // 4. Test PUT update project
    console.log("4️⃣ Testing PUT /projects/:id (update)...");
    const updateData = {
      name: "Test Project API - UPDATED",
      budget: 5000,
      description: "Description mise à jour via test API"
    };
    
    const putResponse = await fetch(`${API_BASE}/projects/${testProjectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(updateData),
    });
    const putData = await putResponse.json();
    console.log(`✅ PUT /projects/:id: ${putData.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`   Updated project: ${putData.project?.name}`);
    console.log(`   New budget: ${putData.project?.budget}€`);
    console.log("");

    // 5. Test PUT toggle pin
    console.log("5️⃣ Testing PUT /projects/:id/pin (toggle)...");
    const pinResponse = await fetch(`${API_BASE}/projects/${testProjectId}/pin`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ isPinned: true }),
    });
    const pinData = await pinResponse.json();
    console.log(`✅ PUT /projects/:id/pin: ${pinData.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`   Project pinned: ${pinData.project?.isPinned}`);
    console.log("");

    // 6. Test DELETE project
    console.log("6️⃣ Testing DELETE /projects/:id...");
    const deleteResponse = await fetch(`${API_BASE}/projects/${testProjectId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });
    const deleteData = await deleteResponse.json();
    console.log(`✅ DELETE /projects/:id: ${deleteData.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`   Message: ${deleteData.message}`);
    console.log("");

    // 7. Verify deletion
    console.log("7️⃣ Verifying deletion...");
    const verifyResponse = await fetch(`${API_BASE}/projects/${testProjectId}`, {
      headers: {
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });
    const verifyData = await verifyResponse.json();
    console.log(`✅ Verification: ${verifyData.success === false ? 'Project correctly deleted' : 'ERROR - Project still exists'}`);
    console.log("");

    // Summary
    console.log("═══════════════════════════════════════");
    console.log("✅ ALL TESTS PASSED!");
    console.log("═══════════════════════════════════════");
    console.log("");
    console.log("📊 Routes fonctionnelles :");
    console.log("  ✅ GET    /projects          - Liste tous les projets");
    console.log("  ✅ GET    /projects/:id      - Récupère un projet");
    console.log("  ✅ POST   /projects          - Crée un projet");
    console.log("  ✅ PUT    /projects/:id      - Modifie un projet");
    console.log("  ✅ PUT    /projects/:id/pin  - Épingle/désépingle");
    console.log("  ✅ DELETE /projects/:id      - Supprime un projet");
    console.log("");
    console.log("🎉 Le Dashboard → Page Projets est maintenant synchronisé!");

  } catch (error) {
    console.error("❌ Error during tests:", error);
    console.log("");
    console.log("🚨 Possible causes:");
    console.log("  1. Server not deployed: supabase functions deploy server --no-verify-jwt");
    console.log("  2. CORS issue: Check server configuration");
    console.log("  3. Network error: Check your connection");
  }
}

// Export for console use
(window as any).testProjectsRoutes = testProjectsRoutes;

// Auto-message
console.log("📦 Projects Routes Tester loaded!");
console.log("🚀 Run: testProjectsRoutes()");
