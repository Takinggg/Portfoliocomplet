// Script de test pour vérifier la connexion à la base de données
import { projectId, publicAnonKey } from "./supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${publicAnonKey}`,
};

export async function testDatabaseConnection() {
  console.log("🔍 Test de connexion à la base de données...\n");

  try {
    // Test 1: Health check
    console.log("1️⃣ Test health check...");
    const healthRes = await fetch(`${API_BASE}/health`, { headers });
    const healthData = await healthRes.json();
    console.log("✅ Health check:", healthData);

    // Test 2: KV Store
    console.log("\n2️⃣ Test KV Store...");
    const kvRes = await fetch(`${API_BASE}/test-kv`, { headers });
    const kvData = await kvRes.json();
    console.log("✅ KV Store:", kvData);

    // Test 3: Projects
    console.log("\n3️⃣ Test récupération des projets...");
    const projectsRes = await fetch(`${API_BASE}/projects`, { headers });
    const projectsData = await projectsRes.json();
    console.log(`✅ Projets trouvés: ${projectsData.projects?.length || 0}`);
    if (projectsData.projects?.length > 0) {
      const pinnedProjects = projectsData.projects.filter((p: any) => p.isPinned);
      console.log(`   📌 Projets épinglés: ${pinnedProjects.length}`);
      pinnedProjects.forEach((p: any) => {
        console.log(`      - ${p.name} (${p.category})`);
      });
    }

    // Test 4: Leads
    console.log("\n4️⃣ Test récupération des leads...");
    const leadsRes = await fetch(`${API_BASE}/leads`, { headers });
    const leadsData = await leadsRes.json();
    console.log(`✅ Leads trouvés: ${leadsData.leads?.length || 0}`);

    // Test 5: Clients
    console.log("\n5️⃣ Test récupération des clients...");
    const clientsRes = await fetch(`${API_BASE}/clients`, { headers });
    const clientsData = await clientsRes.json();
    console.log(`✅ Clients trouvés: ${clientsData.clients?.length || 0}`);

    // Test 6: Invoices
    console.log("\n6️⃣ Test récupération des factures...");
    const invoicesRes = await fetch(`${API_BASE}/invoices`, { headers });
    const invoicesData = await invoicesRes.json();
    console.log(`✅ Factures trouvées: ${invoicesData.invoices?.length || 0}`);

    // Test 7: Bookings
    console.log("\n7️⃣ Test récupération des réservations...");
    const bookingsRes = await fetch(`${API_BASE}/bookings`, { headers });
    const bookingsData = await bookingsRes.json();
    console.log(`✅ Réservations trouvées: ${bookingsData.bookings?.length || 0}`);

    console.log("\n🎉 Tous les tests sont passés avec succès !");
    console.log("\n📊 Résumé :");
    console.log(`   - Projets: ${projectsData.projects?.length || 0}`);
    console.log(`   - Leads: ${leadsData.leads?.length || 0}`);
    console.log(`   - Clients: ${clientsData.clients?.length || 0}`);
    console.log(`   - Factures: ${invoicesData.invoices?.length || 0}`);
    console.log(`   - Réservations: ${bookingsData.bookings?.length || 0}`);

    return {
      success: true,
      data: {
        projects: projectsData.projects?.length || 0,
        leads: leadsData.leads?.length || 0,
        clients: clientsData.clients?.length || 0,
        invoices: invoicesData.invoices?.length || 0,
        bookings: bookingsData.bookings?.length || 0,
      },
    };
  } catch (error) {
    console.error("\n❌ Erreur lors des tests:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Fonction pour créer un projet de test
export async function createTestProject() {
  console.log("🆕 Création d'un projet de test...");

  try {
    const testProject = {
      name: "Test Project - " + new Date().toLocaleString(),
      clientName: "Client Test",
      status: "completed",
      budget: 5000,
      startDate: new Date().toISOString().split("T")[0],
      description: "Ceci est un projet de test créé automatiquement",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      category: "web",
      isPinned: true,
      tags: ["Test", "Demo", "React"],
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      results: "Test réussi ✅",
    };

    const response = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers,
      body: JSON.stringify(testProject),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log("✅ Projet de test créé:", data.projectId);
      return { success: true, projectId: data.projectId };
    } else {
      console.log("❌ Erreur:", data.error);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error("❌ Erreur:", error);
    return { success: false, error: error.message };
  }
}

// Fonction pour épingler/désépingler un projet
export async function toggleProjectPin(projectId: string, isPinned: boolean) {
  console.log(`📌 ${isPinned ? "Désépinglage" : "Épinglage"} du projet ${projectId}...`);

  try {
    const response = await fetch(`${API_BASE}/projects/${projectId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ isPinned: !isPinned }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Projet ${isPinned ? "désépinglé" : "épinglé"}`);
      return { success: true };
    } else {
      console.log("❌ Erreur:", data.error);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error("❌ Erreur:", error);
    return { success: false, error: error.message };
  }
}

// Export pour utilisation dans la console du navigateur
if (typeof window !== "undefined") {
  (window as any).testDB = {
    test: testDatabaseConnection,
    createProject: createTestProject,
    togglePin: toggleProjectPin,
  };
  
  console.log(`
🛠️ Utilitaires de test disponibles dans la console :

  testDB.test()              - Tester la connexion à la DB
  testDB.createProject()     - Créer un projet de test
  testDB.togglePin(id, pin)  - Épingler/désépingler un projet

Exemple: testDB.test()
  `);
}
