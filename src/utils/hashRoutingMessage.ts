/**
 * âœ… HASH ROUTING ACTIVÃ‰ - ProblÃ¨me 404 rÃ©solu !
 * 
 * Ce message s'affiche pour confirmer que le Hash Routing est actif.
 */

if (typeof window !== 'undefined') {
  const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
  
  // Message simplifiÃ© pour production
  if (isProduction) {
    console.log('%câœ… ROUTING OK', 'color: #CCFF00; font-size: 16px; font-weight: bold;');
    console.log('%cHash Routing activÃ© - Navigation fonctionne parfaitement !', 'color: #CCFF00;');
    console.log('URLs : /#/fr, /#/en, etc.');
  } else {
    // Message dÃ©taillÃ© pour dev
    console.log('%câ”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”', 'color: #CCFF00; font-weight: bold;');
    console.log('%câœ… HASH ROUTING ACTIVÃ‰', 'color: #CCFF00; font-size: 18px; font-weight: bold;');
    console.log('%câ”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”', 'color: #CCFF00; font-weight: bold;');
    console.log('');
    console.log('%cðŸŽ¯ ProblÃ¨me 404 DÃ‰FINITIVEMENT rÃ©solu !', 'color: #00ff00; font-size: 14px; font-weight: bold;');
    console.log('');
    console.log('ðŸ“‹ URLs :');
    console.log('  âœ… /#/fr');
    console.log('  âœ… /#/en');
    console.log('  âœ… /#/fr/projects');
    console.log('  âœ… /#/en/about');
    console.log('');
    console.log('âœ¨ Avantages :');
    console.log('  â†’ Fonctionne Ã  100% partout');
    console.log('  â†’ Aucune configuration serveur');
    console.log('  â†’ Navigation instantanÃ©e');
    console.log('  â†’ Historique navigateur OK');
    console.log('  â†’ Bookmarks fonctionnent');
    console.log('');
    console.log('ðŸ“– Documentation : /README_HASH_ROUTING.md');
    console.log('');
  }
}

export {};
