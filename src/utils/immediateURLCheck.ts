/**
 * Immediate URL check - displays as soon as page loads
 */

const currentPath = window.location.pathname;
const currentHost = window.location.hostname;
const hasLanguagePrefix = currentPath.match(/^\/(en|fr)(\/|$)/) !== null;
const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';

// Only show if on localhost and doesn't have prefix
if (isLocalhost && !hasLanguagePrefix && currentPath !== '/') {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  ANCIENNE URL DÉTECTÉE : ${currentPath}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 Tu vas être redirigé automatiquement vers /fr${currentPath}

Si la redirection ne fonctionne pas :
👉 Recharge avec Ctrl+Shift+R (Win) ou Cmd+Shift+R (Mac)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

// Show success if prefix is present
if (isLocalhost && hasLanguagePrefix) {
  const lang = currentPath.match(/^\/(en|fr)/)?.[1]?.toUpperCase() || '?';
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ URLs BILINGUES ACTIVES !
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 URL actuelle : ${currentPath}
🌍 Langue       : ${lang}

🎉 Tout fonctionne parfaitement !

💡 Pour tester :
• Change de langue (FR/EN) → L'URL se met à jour
• Navigate entre les pages → Les préfixes restent
• Tape : testBilingualURLs()

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

// Show production notice if not localhost
if (!isLocalhost) {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 SITE EN PRODUCTION : ${currentHost}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${hasLanguagePrefix ? '✅' : '⏳'} URLs bilingues : ${hasLanguagePrefix ? 'DÉPLOYÉES ✅' : 'PAS ENCORE DÉPLOYÉES'}

${hasLanguagePrefix 
  ? `🎉 Les URLs bilingues fonctionnent en production !`
  : `📝 Les URLs bilingues sont prêtes en local.
   Pour les voir ici :
   1. Teste sur http://localhost:5173
   2. Commit + Push + Redéploie
   
   📖 Voir : /POURQUOI_PAS_DURLF.md`
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

export {};
