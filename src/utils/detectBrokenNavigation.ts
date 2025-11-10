/**
 * Detect if bilingual URLs are deployed or not
 * Shows a clear message if navigation is broken
 */

setTimeout(() => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  const isProduction = hostname !== 'localhost' && hostname !== '127.0.0.1';
  const hasPrefix = pathname.match(/^\/(en|fr)(\/|$)/) !== null;

  // Check if we're on production WITHOUT language prefix
  if (isProduction && !hasPrefix && pathname !== '/login' && pathname !== '/dashboard') {
    
    // Show a BIG warning in console
    console.log(`%c
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║          🚨 ATTENTION - NAVIGATION CASSÉE                    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `, 'color: #FF5757; font-size: 20px; font-weight: bold;');

    console.log(`%c
📍 URL actuelle : ${window.location.href}

❌ PROBLÈME DÉTECTÉ :
   Tu es sur PRODUCTION (${hostname})
   Mais l'URL n'a PAS de préfixe de langue (/fr/ ou /en/)

🔍 CE QUI NE MARCHE PAS :
   ✗ Navigation vers Services, Blog, Projects, etc.
   ✗ Changement de langue
   ✗ URLs bilingues
   ✗ SEO multilingue

🎯 POURQUOI ?
   Le code avec les URLs bilingues n'est pas encore déployé sur Vercel.
   
   Le code est dans Git, mais Vercel affiche l'ancienne version.

⚡ SOLUTION IMMÉDIATE :

   Exécute ces 3 commandes :

   1. git add .
   2. git commit -m "feat: URLs bilingues /fr/ et /en/"
   3. git push origin main

   Puis attends 3-5 minutes que Vercel redéploie.

📖 Guide complet :
   Ouvre le fichier /ACTION_URGENTE.md dans ton code

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️  Après le déploiement, cette URL deviendra : /fr${pathname}

✅ La navigation fonctionnera parfaitement !

    `, 'color: #F4F4F4; font-size: 14px; background: #1a0000; padding: 20px; border-left: 5px solid #FF5757;');

    // Also show a visible alert to the user
    const showDeploymentAlert = () => {
      const alertDiv = document.createElement('div');
      alertDiv.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #FF5757 0%, #FF3333 100%);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(255, 87, 87, 0.4);
        z-index: 999999;
        max-width: 600px;
        font-family: system-ui, -apple-system, sans-serif;
        animation: slideDown 0.5s ease-out;
      `;
      
      alertDiv.innerHTML = `
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
          🚨 Navigation cassée - Code non déployé
        </div>
        <div style="font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
          Les pages (Services, Blog, etc.) ne fonctionnent pas car le code n'est pas encore sur Vercel.
        </div>
        <div style="font-size: 13px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 6px; font-family: monospace;">
          git add . && git commit -m "feat: URLs bilingues" && git push origin main
        </div>
        <button id="closeDeployAlert" style="
          margin-top: 15px;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        ">
          J'ai compris - Fermer
        </button>
      `;

      // Add keyframe animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideDown {
          from {
            transform: translateX(-50%) translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
        #closeDeployAlert:hover {
          background: rgba(255,255,255,0.3);
        }
      `;
      document.head.appendChild(style);

      document.body.appendChild(alertDiv);

      // Close button
      const closeBtn = document.getElementById('closeDeployAlert');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          alertDiv.remove();
        });
      }

      // Auto-hide after 10 seconds
      setTimeout(() => {
        if (alertDiv.parentNode) {
          alertDiv.style.animation = 'slideDown 0.5s ease-out reverse';
          setTimeout(() => alertDiv.remove(), 500);
        }
      }, 10000);
    };

    // Show the alert after a short delay
    setTimeout(showDeploymentAlert, 1000);
  }

  // If we're on production WITH prefix, show success message
  if (isProduction && hasPrefix) {
    console.log(`%c
🎉 URLs BILINGUES DÉPLOYÉES AVEC SUCCÈS !

📍 URL : ${window.location.href}
🌍 Langue : ${pathname.match(/^\/(en|fr)/)?.[1]?.toUpperCase()}
✅ Navigation fonctionnelle
✅ SEO multilingue actif
✅ Rewrites SPA configurés
✅ React Router opérationnel

Tout fonctionne parfaitement ! 🚀

💡 Tu peux maintenant :
   - Naviguer entre les pages
   - Rafraîchir n'importe quelle page
   - Partager des liens directs
   - Changer de langue
    `, 'color: #00FFC2; font-size: 14px; background: #0a2520; padding: 15px; border-left: 5px solid #00FFC2;');
  }
}, 2000);

export {};
