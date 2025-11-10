/**
 * Quick help message for bilingual projects
 * Short version displayed on startup
 */

if (typeof window !== 'undefined') {
  // Only show if language switch seems to be an issue
  const hasSeenMessage = sessionStorage.getItem('bilingual_help_shown');
  
  if (!hasSeenMessage) {
    setTimeout(() => {
      console.log('');
      console.log('%c🌍 INFO : Projets Bilingues', 'background: #00FFC2; color: #0C0C0C; padding: 4px 12px; border-radius: 4px; font-weight: bold;');
      console.log('');
      console.log('%cSi les projets ne changent pas de langue :', 'color: #888;');
      console.log('%c  await seedBilingualProjects()  %c← Fix en 30 secondes', 'background: #1a1a1a; color: #00FFC2; padding: 2px 8px; border-radius: 3px; font-family: monospace;', 'color: #60A5FA; margin-left: 8px;');
      console.log('');
      console.log('%c📖 Guides : START_HERE_BILINGUAL.txt', 'color: #888; font-size: 11px;');
      console.log('');
      
      sessionStorage.setItem('bilingual_help_shown', 'true');
    }, 3000); // Show after 3 seconds
  }
}

export {};
