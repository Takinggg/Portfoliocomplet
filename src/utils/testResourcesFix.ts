/**
 * Test des corrections ResourcesPage
 * Vérifie que les données locales sont compatibles
 */

import { getLocalResources } from "./localDataStorage";

export function testResourcesFix() {
  console.log("🧪 Test des corrections ResourcesPage...\n");

  const resources = getLocalResources();
  
  console.log(`✅ Nombre de ressources : ${resources.length}`);
  
  const validCategories = ["templates", "guides", "checklists", "tools"];
  let allValid = true;
  
  resources.forEach((resource, index) => {
    console.log(`\n📦 Ressource ${index + 1}:`);
    console.log(`  - Titre: ${resource.title}`);
    console.log(`  - Catégorie: ${resource.category}`);
    console.log(`  - Tags: ${resource.tags.join(", ")}`);
    console.log(`  - Publiée: ${resource.isPublished ? "Oui" : "Non"}`);
    console.log(`  - Downloads: ${resource.downloads}`);
    
    // Vérifier que la catégorie est valide
    if (!validCategories.includes(resource.category)) {
      console.error(`  ❌ ERREUR: Catégorie invalide "${resource.category}"`);
      allValid = false;
    } else {
      console.log(`  ✅ Catégorie valide`);
    }
    
    // Vérifier les champs requis
    const requiredFields = ["id", "title", "description", "category", "fileUrl", "tags", "isPublished", "downloads", "createdAt", "updatedAt"];
    const missingFields = requiredFields.filter(field => !(field in resource));
    
    if (missingFields.length > 0) {
      console.error(`  ❌ ERREUR: Champs manquants: ${missingFields.join(", ")}`);
      allValid = false;
    } else {
      console.log(`  ✅ Tous les champs requis présents`);
    }
  });
  
  console.log("\n" + "=".repeat(50));
  
  if (allValid && resources.length > 0) {
    console.log("✅ SUCCÈS: Toutes les ressources sont valides !");
    console.log("✅ La page Resources devrait fonctionner correctement.");
    return true;
  } else {
    console.error("❌ ÉCHEC: Des erreurs ont été détectées.");
    return false;
  }
}

// Auto-exécution si importé directement
if (typeof window !== "undefined") {
  (window as any).testResourcesFix = testResourcesFix;
  console.log("💡 Test disponible dans la console : testResourcesFix()");
}
