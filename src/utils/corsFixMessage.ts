/**
 * CORS Fix Message - Display in console to guide user
 * Message affiché dans la console pour guider l'utilisateur vers le fix CORS
 */

export function displayCORSFixMessage() {
  const styles = {
    error: 'background: #ff4444; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold;',
    warning: 'background: #ffaa00; color: black; padding: 8px 12px; border-radius: 4px; font-weight: bold;',
    success: 'background: #00ff88; color: black; padding: 8px 12px; border-radius: 4px; font-weight: bold;',
    info: 'background: #0088ff; color: white; padding: 8px 12px; border-radius: 4px;',
    code: 'background: #2d2d2d; color: #00ff88; padding: 4px 8px; border-radius: 3px; font-family: monospace;',
    step: 'background: #00FFC2; color: #0C0C0C; padding: 6px 12px; border-radius: 4px; font-weight: bold;',
  };

  console.log('\n');
  console.log('%c🚨 ERREUR CORS DÉTECTÉE', styles.error);
  console.log('\n');
  
  console.log('%cℹ️ PROBLÈME', styles.info);
  console.log('Le serveur Supabase bloque les requêtes à cause de la configuration CORS.');
  console.log('');
  
  console.log('%c✅ SOLUTION PRÊTE', styles.success);
  console.log('J\'ai corrigé le code. Vous devez juste le redéployer (2 minutes).');
  console.log('');
  
  console.log('%c📋 INSTRUCTIONS RAPIDES (3 étapes)', styles.warning);
  console.log('');
  
  console.log('%c1️⃣ COPIER LE CODE', styles.step);
  console.log('   → Regardez l\'alerte jaune en bas à droite');
  console.log('   → Cliquez "Copier le Code Corrigé"');
  console.log('   → Le code est maintenant dans votre presse-papier');
  console.log('');
  
  console.log('%c2️⃣ OUVRIR SUPABASE', styles.step);
  console.log('   → Cliquez sur le bouton dans l\'alerte');
  console.log('   → OU allez manuellement sur :');
  console.log('%c   https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions', styles.code);
  console.log('');
  
  console.log('%c3️⃣ DÉPLOYER', styles.step);
  console.log('   → Trouvez la fonction "make-server-04919ac5"');
  console.log('   → Cliquez dessus pour l\'éditer');
  console.log('   → Supprimez TOUT le code existant');
  console.log('   → Collez le nouveau code (Ctrl+V ou Cmd+V)');
  console.log('   → Cliquez le bouton bleu "Deploy"');
  console.log('   → Attendez 30 secondes');
  console.log('');
  
  console.log('%c🎉 VÉRIFICATION', styles.success);
  console.log('Une fois déployé, testez avec cette commande :');
  console.log('%c', '');
  console.log(
    '%cfetch("https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health").then(r=>r.json()).then(d=>console.log("✅ CORRIGÉ!", d))',
    styles.code
  );
  console.log('');
  
  console.log('%c📖 GUIDES DISPONIBLES', styles.info);
  console.log('   • /SOLUTION_CORS_SIMPLE.md - Guide ultra-simple');
  console.log('   • /URGENT_LIRE_CORS.md - Guide détaillé');
  console.log('   • /DEPLOIEMENT_RAPIDE_CORS_CORRIGE.md - Guide complet');
  console.log('\n');
  
  console.log('%c⏱️ TEMPS ESTIMÉ : 2 MINUTES', styles.warning);
  console.log('\n\n');
}

// Auto-display on import
if (typeof window !== 'undefined') {
  // Check if there's a CORS error by testing the health endpoint
  fetch('https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health', {
    method: 'GET',
    mode: 'cors',
  })
    .then(response => {
      if (!response.ok) {
        console.log('%c✅ Serveur accessible mais erreur HTTP', 'color: orange');
      }
    })
    .catch(error => {
      // CORS error detected
      if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
        displayCORSFixMessage();
      }
    });
}
