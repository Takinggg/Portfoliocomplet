/**
 * Simple, direct message about URLs
 * Displays immediately
 */

const path = window.location.pathname;
const host = window.location.hostname;
const isLocal = host === 'localhost' || host === '127.0.0.1';
const hasPrefix = path.match(/^\/(en|fr)(\/|$)/) !== null;

// Super simple message
if (isLocal && !hasPrefix && path !== '/') {
  console.log(`
⚠️  URL SANS PRÉFIXE DÉTECTÉE : ${path}

👉 Recharge avec Ctrl+Shift+R pour voir /fr${path}
  `);
} else if (isLocal && hasPrefix) {
  console.log(`
✅ URLs bilingues actives ! Tu es sur ${path}
  `);
} else if (!isLocal && !hasPrefix) {
  console.log(`
🌐 PRODUCTION : Les URLs bilingues ne sont pas encore déployées.
   Teste sur http://localhost:5173 pour voir /fr/blog, /en/services, etc.
   
   📖 Lis : /POURQUOI_PAS_DURLF.md
  `);
}

export {};
