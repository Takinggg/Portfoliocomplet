// 🌍 Geo-Redirection activée - Détection automatique du pays

console.log(`
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║   🌍  GEO-REDIRECTION AUTOMATIQUE ACTIVÉE                          ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝

🎯 FONCTIONNEMENT :
   Quand un utilisateur arrive sur "/" (racine du site) :
   
   1️⃣  Vérification de la préférence sauvegardée (localStorage)
   2️⃣  Si aucune préférence, détection du pays via géolocalisation IP
   3️⃣  Redirection automatique :
       🇫🇷 France        → /fr
       🌎 Autres pays    → /en
   4️⃣  Sauvegarde de la préférence pour les prochaines visites

📍 SOURCES DE DÉTECTION :
   - API de géolocalisation : ipapi.co
   - Fallback : langue du navigateur (navigator.language)
   - Cache : localStorage ('preferredLanguage')

💡 AVANTAGES :
   ✓ Meilleure expérience utilisateur (langue native automatique)
   ✓ Pas besoin de sélecteur de langue en premier
   ✓ Préférence sauvegardée (pas de re-détection à chaque visite)
   ✓ Changement manuel possible via le sélecteur de langue

🧪 POUR TESTER :
   1. Efface localStorage : localStorage.removeItem('preferredLanguage')
   2. Rafraîchis la page (ou va sur /)
   3. Regarde la console pour voir le pays détecté
   4. Tu seras redirigé vers /fr ou /en selon ton pays

🔧 FORCER UNE LANGUE :
   localStorage.setItem('preferredLanguage', 'fr')  // Force français
   localStorage.setItem('preferredLanguage', 'en')  // Force anglais
   Puis rafraîchis la page

🌐 API UTILISÉE :
   - ipapi.co (gratuite, 30k requêtes/mois)
   - Timeout : 3 secondes
   - Fallback automatique si l'API est indisponible

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Fonction utile pour tester la géolocalisation
(window as any).testGeo = async () => {
  console.log("\n🧪 TEST GÉOLOCALISATION\n");
  
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    console.log("📍 Informations détectées :");
    console.log(`   Pays: ${data.country_name} (${data.country_code})`);
    console.log(`   Ville: ${data.city}`);
    console.log(`   Région: ${data.region}`);
    console.log(`   IP: ${data.ip}`);
    console.log(`   Timezone: ${data.timezone}`);
    console.log(`\n🎯 Langue assignée: ${data.country_code === 'FR' ? 'Français (/fr)' : 'Anglais (/en)'}`);
    
    const saved = localStorage.getItem('preferredLanguage');
    console.log(`💾 Langue sauvegardée: ${saved || 'Aucune'}`);
    
  } catch (error) {
    console.error("❌ Erreur:", error);
  }
};

// Fonction pour réinitialiser la préférence
(window as any).resetLanguagePreference = () => {
  localStorage.removeItem('preferredLanguage');
  console.log("✅ Préférence de langue effacée");
  console.log("🔄 Rafraîchis la page pour une nouvelle détection");
};

console.log("💡 Nouvelles commandes disponibles :");
console.log("   • testGeo() - Teste la géolocalisation");
console.log("   • resetLanguagePreference() - Efface la préférence sauvegardée");
