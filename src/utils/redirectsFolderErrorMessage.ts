// 🚨 ERREUR CRITIQUE : _redirects est un dossier, pas un fichier

console.error(`
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   🚨  ERREUR CRITIQUE : _redirects est un DOSSIER ❌              ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝

❌ PROBLÈME ACTUEL :
   /public/_redirects/  ← C'est un DOSSIER
   
   Tu as dedans :
   - Code-component-70-189.tsx
   - Code-component-70-209.tsx

✅ CE QU'IL FAUT :
   /public/_redirects  ← Un FICHIER texte simple
   
   Contenu : "/*    /index.html   200"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 SOLUTION RAPIDE (Copie-colle dans le terminal) :

rm -rf public/_redirects
echo "/*    /index.html   200" > public/_redirects
git add public/_redirects && git commit -m "fix: _redirects as file" && git push

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 GUIDE DÉTAILLÉ :
   Ouvre /COMMANDES_EXACTES_FIX_REDIRECTS.md
   Ou /CORRECTION_MANUELLE_REDIRECTS.md

⚡ URGENT :
   Lis /URGENT_LIRE_MOI.txt

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 TANT QUE CE N'EST PAS CORRIGÉ :
   • L'erreur 404 persistera sur /en et /fr
   • Le rafraîchissement ne fonctionnera pas
   • Vercel ignore complètement la configuration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Affiche aussi dans le titre de la console si possible
if (typeof document !== 'undefined') {
  document.title = '🚨 ERREUR: _redirects est un dossier - ' + document.title;
}
