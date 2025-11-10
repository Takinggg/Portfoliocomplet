/**
 * Message for deployment - URLs bilingues ready to deploy
 */

setTimeout(() => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  const hasPrefix = pathname.match(/^\/(en|fr)(\/|$)/) !== null;

  console.log(`%c
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              🌍 URLs BILINGUES - STATUS                      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `, 'color: #00FFC2; font-size: 16px; font-weight: bold;');

  if (isLocal && hasPrefix) {
    console.log(`%c
✅ URLS BILINGUES ACTIVES EN LOCAL !

📍 URL actuelle : ${pathname}
🌍 Langue : ${pathname.match(/^\/(en|fr)/)?.[1]?.toUpperCase()}

🎯 PROCHAINE ÉTAPE : Déployer sur Vercel

1. Commit et push :
   git add .
   git commit -m "feat: URLs bilingues /fr/ et /en/"
   git push origin main

2. Attends 2-5 min que Vercel redéploie

3. Vérifie sur maxence.design

📖 Guide complet : /DEPLOYER_SUR_VERCEL.md
    `, 'color: #F4F4F4; font-size: 13px;');
    
  } else if (isLocal && !hasPrefix) {
    console.log(`%c
⚠️  URL EN LOCAL SANS PRÉFIXE

📍 URL actuelle : ${pathname}
🎯 URL attendue : /fr${pathname}

Recharge la page : Ctrl+Shift+R (Win) ou Cmd+Shift+R (Mac)
    `, 'color: #FF5757; font-size: 13px;');
    
  } else if (!isLocal && hasPrefix) {
    console.log(`%c
🎉 URLS BILINGUES DÉPLOYÉES EN PRODUCTION !

📍 URL actuelle : ${pathname}
🌍 Langue : ${pathname.match(/^\/(en|fr)/)?.[1]?.toUpperCase()}
🌐 Environnement : PRODUCTION (${hostname})

✅ Tout fonctionne parfaitement !
    `, 'color: #00FFC2; font-size: 13px;');
    
  } else if (!isLocal && !hasPrefix) {
    console.log(`%c
🌐 EN PRODUCTION - URLs Bilingues Non Déployées

📍 Environnement : PRODUCTION (${hostname})
📍 URL actuelle : ${pathname}

⚠️  Les URLs bilingues sont dans le code mais PAS ENCORE déployées sur Vercel.

🚨 SYMPTÔMES :
   - Tu vois le sélecteur FR/EN
   - Mais les pages comme "/services" ne fonctionnent pas
   - Les URLs restent sans préfixe (/blog au lieu de /fr/blog)

🎯 SOLUTION IMMÉDIATE :

   Exécute ces 3 commandes dans ton terminal :

   1️⃣  git add .
   2️⃣  git commit -m "feat: URLs bilingues /fr/ et /en/"
   3️⃣  git push origin main

   Puis attends 3-5 minutes que Vercel redéploie.

📖 Guide détaillé : Voir /ACTION_URGENTE.md dans ton code

⏱️  Une fois déployé, cette URL deviendra : /fr${pathname}
    `, 'color: #FF5757; font-size: 14px; background: #1a0000; padding: 20px; border: 2px solid #FF5757; font-weight: bold;');
  }

  console.log(`%c
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `, 'color: #666;');
}, 1500);

export {};
