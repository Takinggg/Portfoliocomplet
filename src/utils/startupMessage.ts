/**
 * Display a clear startup message with current status
 * OPTIMIZED: No server check at startup to avoid 404 errors
 */

const styles = {
  title: 'font-size: 18px; font-weight: bold; color: #CCFF00; background: #0C0C0C; padding: 10px;',
  success: 'font-size: 14px; font-weight: bold; color: #00ff88;',
  info: 'font-size: 13px; color: #88ccff;',
  code: 'font-size: 12px; color: #CCFF00; background: #1a1a1a; padding: 2px 6px; font-family: monospace;',
  warning: 'font-size: 14px; font-weight: bold; color: #FFA500;',
};

// Show startup message immediately (no server check to avoid 404s)
console.log('');
console.log('%cðŸŽ‰ Portfolio Pro - ChargÃ©', styles.title);
console.log('%câœ¨ Mode LOCAL activÃ© (0 erreur)', styles.success);
console.log('');
console.log('%cðŸ“ Le serveur sera vÃ©rifiÃ© aprÃ¨s 30s ou manuellement', styles.info);
console.log('%cðŸ’¡ Pour synchroniser avec Supabase: %cserverDiagnostic()%c', styles.info, styles.code, styles.info);
console.log('');

export {};
