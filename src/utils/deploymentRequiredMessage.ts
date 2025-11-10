// Message urgent pour le déploiement requis

if (typeof window !== "undefined") {
  // Afficher immédiatement au chargement
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  ⚠️  DÉPLOIEMENT REQUIS                                         ║
╚══════════════════════════════════════════════════════════════════╝

Le fix case studies est prêt mais nécessite un déploiement :

🚀 https://supabase.com/dashboard
   → Edge Functions → "server" → Deploy

Puis :

   normalizeCaseStudiesKeys()

📚 Voir : LIRE_MAINTENANT_DEPLOIEMENT.txt

══════════════════════════════════════════════════════════════════
  `);
}

export {};
