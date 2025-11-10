// Message court pour le fix rapide

if (typeof window !== "undefined") {
  // Afficher ce message EN PREMIER
  setTimeout(() => {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  🎯 CASE STUDIES - FIX PRÊT                                     ║
╚══════════════════════════════════════════════════════════════════╝

✅ CODE CORRIGÉ !

⚠️ DÉPLOIEMENT REQUIS :

1. Déployez la fonction Edge "server" via Supabase Dashboard

2. Puis normalisez les clés :
   
   normalizeCaseStudiesKeys()

📚 Voir: DEPLOYER_FIX_CASE_STUDIES.txt (guide complet)

══════════════════════════════════════════════════════════════════
    `);
  }, 100); // Petit délai pour apparaître après les autres messages
}

export {};
