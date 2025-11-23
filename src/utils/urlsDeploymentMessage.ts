/**
 * Message for deployment - URLs bilingues ready to deploy
 */

setTimeout(() => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  const hasPrefix = pathname.match(/^\/(en|fr)(\/|$)/) !== null;

  console.log(`%c
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘                                                               â•‘
â•‘              ðŸŒ URLs BILINGUES - STATUS                      â•‘
â•‘                                                               â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  `, 'color: #CCFF00; font-size: 16px; font-weight: bold;');

  if (isLocal && hasPrefix) {
    console.log(`%c
âœ… URLS BILINGUES ACTIVES EN LOCAL !

ðŸ“ URL actuelle : ${pathname}
ðŸŒ Langue : ${pathname.match(/^\/(en|fr)/)?.[1]?.toUpperCase()}

ðŸŽ¯ PROCHAINE Ã‰TAPE : DÃ©ployer sur Vercel

1. Commit et push :
   git add .
   git commit -m "feat: URLs bilingues /fr/ et /en/"
   git push origin main

2. Attends 2-5 min que Vercel redÃ©ploie

3. VÃ©rifie sur maxence.design

ðŸ“– Guide complet : /DEPLOYER_SUR_VERCEL.md
    `, 'color: #F4F4F4; font-size: 13px;');
    
  } else if (isLocal && !hasPrefix) {
    console.log(`%c
âš ï¸  URL EN LOCAL SANS PRÃ‰FIXE

ðŸ“ URL actuelle : ${pathname}
ðŸŽ¯ URL attendue : /fr${pathname}

Recharge la page : Ctrl+Shift+R (Win) ou Cmd+Shift+R (Mac)
    `, 'color: #FF5757; font-size: 13px;');
    
  } else if (!isLocal && hasPrefix) {
    console.log(`%c
ðŸŽ‰ URLS BILINGUES DÃ‰PLOYÃ‰ES EN PRODUCTION !

ðŸ“ URL actuelle : ${pathname}
ðŸŒ Langue : ${pathname.match(/^\/(en|fr)/)?.[1]?.toUpperCase()}
ðŸŒ Environnement : PRODUCTION (${hostname})

âœ… Tout fonctionne parfaitement !
    `, 'color: #CCFF00; font-size: 13px;');
    
  } else if (!isLocal && !hasPrefix) {
    console.log(`%c
ðŸŒ EN PRODUCTION - URLs Bilingues Non DÃ©ployÃ©es

ðŸ“ Environnement : PRODUCTION (${hostname})
ðŸ“ URL actuelle : ${pathname}

âš ï¸  Les URLs bilingues sont dans le code mais PAS ENCORE dÃ©ployÃ©es sur Vercel.

ðŸš¨ SYMPTÃ”MES :
   - Tu vois le sÃ©lecteur FR/EN
   - Mais les pages comme "/services" ne fonctionnent pas
   - Les URLs restent sans prÃ©fixe (/blog au lieu de /fr/blog)

ðŸŽ¯ SOLUTION IMMÃ‰DIATE :

   ExÃ©cute ces 3 commandes dans ton terminal :

   1ï¸âƒ£  git add .
   2ï¸âƒ£  git commit -m "feat: URLs bilingues /fr/ et /en/"
   3ï¸âƒ£  git push origin main

   Puis attends 3-5 minutes que Vercel redÃ©ploie.

ðŸ“– Guide dÃ©taillÃ© : Voir /ACTION_URGENTE.md dans ton code

â±ï¸  Une fois dÃ©ployÃ©, cette URL deviendra : /fr${pathname}
    `, 'color: #FF5757; font-size: 14px; background: #1a0000; padding: 20px; border: 2px solid #FF5757; font-weight: bold;');
  }

  console.log(`%c
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
  `, 'color: #666;');
}, 1500);

export {};
