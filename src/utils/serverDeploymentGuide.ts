import { projectId } from './supabase/info';

/**
 * Display clear deployment instructions in console
 * This runs on app startup to help users understand what to do
 */

const styles = {
  title: 'font-size: 20px; font-weight: bold; color: #CCFF00; background: #0C0C0C; padding: 8px;',
  error: 'font-size: 14px; font-weight: bold; color: #ff4444; background: #2a0000; padding: 4px;',
  warning: 'font-size: 14px; font-weight: bold; color: #ffaa00; background: #2a1a00; padding: 4px;',
  success: 'font-size: 14px; font-weight: bold; color: #00ff88; background: #002a1a; padding: 4px;',
  info: 'font-size: 13px; color: #88ccff;',
  code: 'font-size: 12px; color: #CCFF00; background: #1a1a1a; padding: 2px 6px; font-family: monospace;',
  link: 'font-size: 13px; color: #CCFF00; text-decoration: underline;'
};

// Only show if server is offline (checked later by startupMessage)
// This keeps the console clean by default

// Add helper function to window
(window as any).deployServer = () => {
  console.clear();
  console.log('%cðŸš€ GUIDE DE DÃ‰PLOIEMENT SERVEUR', styles.title);
  console.log('');
  console.log('Ã‰tapes dÃ©taillÃ©es:');
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
  console.log('4. DÃ©ployer la fonction:');
  console.log('   %csupabase functions deploy server', styles.code);
  console.log('');
  console.log('5. VÃ©rifier le dÃ©ploiement:');
  console.log('   %ctestServerConnection()', styles.code);
  console.log('');
  console.log('Dashboard: %chttps://supabase.com/dashboard/project/' + projectId + '/functions', styles.link);
};

(window as any).testServerConnection = async () => {
  console.log('%cðŸ” Test de connexion au serveur...', styles.info);
  console.log('');
  
  try {
    const { publicAnonKey } = await import('./supabase/info');
    
    console.log('1ï¸âƒ£  Health Check...');
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
      {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('%câœ… Serveur OPÃ‰RATIONNEL!', styles.success);
      console.log('   Version:', data.version);
      console.log('   Message:', data.message);
      console.log('   Timestamp:', data.timestamp);
      console.log('');
      console.log('%cðŸŽ‰ Le serveur est dÃ©ployÃ© et fonctionne correctement!', styles.success);
    } else {
      console.log('%câŒ Serveur rÃ©pond mais avec erreur HTTP ' + response.status, styles.error);
      const text = await response.text();
      console.log('   RÃ©ponse:', text);
    }
  } catch (error) {
    console.log('%câŒ Ã‰CHEC: Impossible de contacter le serveur', styles.error);
    console.log('   Erreur:', error);
    console.log('');
    console.log('%câš ï¸  Le serveur n\'est PAS dÃ©ployÃ©.', styles.warning);
    console.log('   ExÃ©cutez: %cdeployServer()', styles.code, ' pour voir les instructions.');
  }
};

console.log('ðŸ’¡ %cCommandes disponibles:', styles.info);
console.log('   â€¢ %cdeployServer()', styles.code, '       - Afficher le guide de dÃ©ploiement');
console.log('   â€¢ %ctestServerConnection()', styles.code, ' - Tester la connexion au serveur');
console.log('');
