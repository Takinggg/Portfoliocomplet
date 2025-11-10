/**
 * Quick Admin Initialization
 * Call this from browser console to create admin account
 */

import { projectId } from './supabase/info';

export async function initAdminQuick(): Promise<void> {
  console.log("🔐 Initializing admin account...");
  
  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;
  
  try {
    const response = await fetch(`${serverUrl}/auth/init-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log("✅ Admin account initialized successfully!");
      console.log("");
      console.log("═══════════════════════════════════════════════");
      console.log("🔑 LOGIN CREDENTIALS");
      console.log("═══════════════════════════════════════════════");
      console.log("");
      console.log("   Email    : contact@maxence.design");
      console.log("   Password : vbz657D9");
      console.log("");
      console.log("⚠️  Please change this password after first login!");
      console.log("═══════════════════════════════════════════════");
      console.log("");
      
      // Show alert
      alert(`✅ Compte admin créé !\n\nEmail: contact@maxence.design\nMot de passe: vbz657D9\n\n⚠️ Changez ce mot de passe après connexion !`);
    } else {
      console.error("❌ Failed to initialize admin:", data.error);
      alert(`❌ Erreur : ${data.error || 'Échec de création du compte admin'}`);
    }
  } catch (error) {
    console.error("❌ Error initializing admin:", error);
    alert(`❌ Erreur de connexion au serveur. Vérifiez que le serveur est déployé.`);
  }
}

// Make available globally for console access
if (typeof window !== 'undefined') {
  (window as any).initAdminQuick = initAdminQuick;
  console.log("💡 Admin initialization available! Run: initAdminQuick()");
}
