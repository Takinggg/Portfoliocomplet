import { projectId } from './supabase/info';

/**
 * Display clear deployment instructions in console
 * This runs on app startup to help users understand what to do
 */

const styles = {
  title: 'font-size: 20px; font-weight: bold; color: #00FFC2; background: #0C0C0C; padding: 8px;',
  error: 'font-size: 14px; font-weight: bold; color: #ff4444; background: #2a0000; padding: 4px;',
  warning: 'font-size: 14px; font-weight: bold; color: #ffaa00; background: #2a1a00; padding: 4px;',
  success: 'font-size: 14px; font-weight: bold; color: #00ff88; background: #002a1a; padding: 4px;',
  info: 'font-size: 13px; color: #88ccff;',
  code: 'font-size: 12px; color: #00FFC2; background: #1a1a1a; padding: 2px 6px; font-family: monospace;',
  link: 'font-size: 13px; color: #00FFC2; text-decoration: underline;'
};

// Only show if server is offline (checked later by startupMessage)
// This keeps the console clean by default

// Add helper function to window
(window as any).deployServer = () => {
  console.clear();
  console.log('%c🚀 GUIDE DE DÉPLOIEMENT SERVEUR', styles.title);
  console.log('');
  console.log('Étapes détaillées:');
  console.log('');
  console.log('1. Installer Supabase CLI:');
  console.log('   %cnpm install -g supabase', styles.code);
  console.log('');
  console.log('2. Se connecter:');
  console.log('   %csupabase login', styles.code);
  console.log('');
  console.log('3. Lier le projet:');
  console.log('   %csupabase link --project-ref ' + projectId, styles.code);
  console.log('');
  console.log('4. Déployer la fonction:');
  console.log('   %csupabase functions deploy server', styles.code);
  console.log('');
  console.log('5. Vérifier le déploiement:');
  console.log('   %ctestServerConnection()', styles.code);
  console.log('');
  console.log('Dashboard: %chttps://supabase.com/dashboard/project/' + projectId + '/functions', styles.link);
};

(window as any).testServerConnection = async () => {
  console.log('%c🔍 Test de connexion au serveur...', styles.info);
  console.log('');
  
  try {
    const { publicAnonKey } = await import('./supabase/info');
    
    console.log('1️⃣  Health Check...');
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
      {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('%c✅ Serveur OPÉRATIONNEL!', styles.success);
      console.log('   Version:', data.version);
      console.log('   Message:', data.message);
      console.log('   Timestamp:', data.timestamp);
      console.log('');
      console.log('%c🎉 Le serveur est déployé et fonctionne correctement!', styles.success);
    } else {
      console.log('%c❌ Serveur répond mais avec erreur HTTP ' + response.status, styles.error);
      const text = await response.text();
      console.log('   Réponse:', text);
    }
  } catch (error) {
    console.log('%c❌ ÉCHEC: Impossible de contacter le serveur', styles.error);
    console.log('   Erreur:', error);
    console.log('');
    console.log('%c⚠️  Le serveur n\'est PAS déployé.', styles.warning);
    console.log('   Exécutez: %cdeployServer()', styles.code, ' pour voir les instructions.');
  }
};

console.log('💡 %cCommandes disponibles:', styles.info);
console.log('   • %cdeployServer()', styles.code, '       - Afficher le guide de déploiement');
console.log('   • %ctestServerConnection()', styles.code, ' - Tester la connexion au serveur');
console.log('');
