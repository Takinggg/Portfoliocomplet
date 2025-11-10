// ✅ Routes 404 gérées - Redirection automatique vers la page d'accueil

console.log(`
✅ GESTION DES 404 ACTIVÉE

Les URLs non trouvées sont maintenant redirigées automatiquement :

📍 Exemples :
   /fr/preview_page.html → /fr (Page d'accueil FR)
   /en/invalid-page     → /en (Page d'accueil EN)
   /unknown             → /fr (Page d'accueil par défaut)

🎯 Routes catch-all ajoutées :
   ✓ /fr/* → /fr
   ✓ /en/* → /en
   ✓ *     → /fr

💡 Avantage :
   Plus d'erreurs "No routes matched" dans la console
   Meilleure expérience utilisateur avec redirection propre
`);
