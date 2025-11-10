/**
 * Test de connexion au serveur Supabase Edge Function
 * Ce script teste si le serveur répond correctement
 */

import { projectId, publicAnonKey } from './supabase/info';

async function testServerConnection() {
  console.log("🧪 Testing server connection...");
  console.log("📍 Project ID:", projectId);
  console.log("🔑 Anon Key:", publicAnonKey.substring(0, 20) + "...");
  
  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;
  
  // Test 1: Health check
  console.log("\n1️⃣ Testing health endpoint...");
  try {
    const response = await fetch(`${baseUrl}/health`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    console.log("   Status:", response.status);
    console.log("   Status Text:", response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log("   ✅ Response:", data);
    } else {
      const text = await response.text();
      console.log("   ❌ Error response:", text);
    }
  } catch (error) {
    console.error("   ❌ Fetch error:", error);
  }
  
  // Test 2: Newsletter stats
  console.log("\n2️⃣ Testing newsletter/stats endpoint...");
  try {
    const response = await fetch(`${baseUrl}/newsletter/stats`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    console.log("   Status:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("   ✅ Response:", data);
    } else {
      const text = await response.text();
      console.log("   ❌ Error response:", text);
    }
  } catch (error) {
    console.error("   ❌ Fetch error:", error);
  }
  
  // Test 3: Projects
  console.log("\n3️⃣ Testing projects endpoint...");
  try {
    const response = await fetch(`${baseUrl}/projects`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    console.log("   Status:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("   ✅ Response:", data);
    } else {
      const text = await response.text();
      console.log("   ❌ Error response:", text);
    }
  } catch (error) {
    console.error("   ❌ Fetch error:", error);
  }
  
  // Test 4: Init admin
  console.log("\n4️⃣ Testing auth/init-admin endpoint...");
  try {
    const response = await fetch(`${baseUrl}/auth/init-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    console.log("   Status:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("   ✅ Response:", data);
    } else {
      const text = await response.text();
      console.log("   ❌ Error response:", text);
    }
  } catch (error) {
    console.error("   ❌ Fetch error:", error);
  }
  
  console.log("\n✅ Test complete!");
}

// Auto-run if imported
testServerConnection();

export { testServerConnection };
