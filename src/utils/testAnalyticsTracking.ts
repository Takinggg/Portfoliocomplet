/**
 * Test Analytics Tracking
 * Utilitaire pour générer des données de test et vérifier le système analytics
 */

import { projectId, publicAnonKey } from "./supabase/info";

// Fonction pour créer une session de test
async function createTestSession() {
  const sessionId = `test_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    // 1. Track session start
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/analytics/session/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        sessionId,
        referrer: "https://google.com/search",
        userAgent: navigator.userAgent,
      }),
    });

    console.log(`✅ Session créée: ${sessionId}`);
    
    // 2. Track some pageviews
    const pages = ["/", "/blog", "/case-studies", "/contact", "/resources"];
    
    for (let i = 0; i < pages.length; i++) {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/analytics/pageview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          sessionId,
          page: pages[i],
          referrer: i === 0 ? "https://google.com" : pages[i - 1],
          userAgent: navigator.userAgent,
        }),
      });
      
      console.log(`  📄 Page vue: ${pages[i]}`);
      
      // Small delay between pages
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // 3. Maybe track a conversion (30% chance)
    if (Math.random() < 0.3) {
      const conversionTypes = ["contact_form", "newsletter", "booking"];
      const type = conversionTypes[Math.floor(Math.random() * conversionTypes.length)];
      
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/analytics/conversion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          sessionId,
          type,
          data: { source: "test" },
        }),
      });
      
      console.log(`  🎯 Conversion: ${type}`);
    }
    
    // 4. Track session end
    const duration = Math.floor(Math.random() * 600) + 60; // 1-10 minutes
    
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/analytics/session/end`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        sessionId,
        duration,
      }),
    });
    
    console.log(`  ⏱️  Session terminée: ${duration}s`);
    
    return sessionId;
  } catch (error) {
    console.error("❌ Erreur lors de la création de session:", error);
    return null;
  }
}

// Fonction pour générer plusieurs sessions de test
async function generateTestData(count = 10) {
  console.log(`🚀 Génération de ${count} sessions de test...`);
  
  const sessions = [];
  
  for (let i = 0; i < count; i++) {
    console.log(`\n--- Session ${i + 1}/${count} ---`);
    const sessionId = await createTestSession();
    if (sessionId) {
      sessions.push(sessionId);
    }
    
    // Small delay between sessions
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`\n✅ ${sessions.length} sessions créées avec succès!`);
  console.log(`📊 Rafraîchis le Dashboard Express pour voir les données.`);
  
  return sessions;
}

// Fonction pour vérifier les stats
async function checkAnalyticsStats() {
  try {
    const { createClient } = await import("./supabase/client");
    const supabase = createClient(projectId, publicAnonKey);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("❌ Vous devez être connecté au Dashboard pour voir les stats");
      return;
    }
    
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/analytics/stats?days=30`,
      {
        headers: { Authorization: `Bearer ${session.access_token}` }
      }
    );
    
    const data = await response.json();
    
    if (data.success) {
      console.log("\n📊 ANALYTICS STATS (30 derniers jours)");
      console.log("═".repeat(50));
      console.log(`👥 Visiteurs uniques: ${data.stats.totals.visitors}`);
      console.log(`📄 Pages vues: ${data.stats.totals.pageviews}`);
      console.log(`📊 Sessions: ${data.stats.totals.sessions}`);
      console.log(`🎯 Conversions: ${data.stats.totals.conversions}`);
      console.log(`📉 Taux de rebond: ${data.stats.totals.bounceRate}%`);
      console.log(`⏱️  Temps moyen: ${data.stats.totals.avgSessionTime}s`);
      console.log(`💫 Taux de conversion: ${data.stats.totals.conversionRate}%`);
      console.log("═".repeat(50));
      
      if (data.stats.recentConversions?.length > 0) {
        console.log("\n🎯 Conversions récentes:");
        data.stats.recentConversions.forEach((conv) => {
          console.log(`  - ${conv.type} (${new Date(conv.timestamp).toLocaleString()})`);
        });
      }
    } else {
      console.error("❌ Erreur:", data.error);
    }
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des stats:", error);
  }
}

// Exporter les fonctions dans window pour utilisation facile
if (typeof window !== "undefined") {
  (window as any).generateAnalyticsTestData = generateTestData;
  (window as any).createTestSession = createTestSession;
  (window as any).checkAnalyticsStats = checkAnalyticsStats;
  
  console.log("\n📊 Analytics Test Utils Loaded!");
  console.log("━".repeat(60));
  console.log("Commandes disponibles:");
  console.log("");
  console.log("  🔹 generateAnalyticsTestData(10)");
  console.log("     → Génère 10 sessions de test avec pageviews et conversions");
  console.log("");
  console.log("  🔹 createTestSession()");
  console.log("     → Crée une session de test unique");
  console.log("");
  console.log("  🔹 checkAnalyticsStats()");
  console.log("     → Affiche les stats analytics actuelles (Dashboard uniquement)");
  console.log("");
  console.log("━".repeat(60));
}

export { generateTestData, createTestSession, checkAnalyticsStats };

