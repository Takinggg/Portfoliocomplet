# 📋 Instructions Console - Obtenir votre Token

Copiez et collez ce code dans la console de votre navigateur (F12) :

```javascript
// ========================================
// 🔑 OBTENIR VOTRE ACCESS TOKEN
// ========================================

const { data } = await supabase.auth.getSession()

if (data?.session?.access_token) {
  console.clear()
  console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #00FFC2")
  console.log("%c🔑 VOTRE ACCESS TOKEN", "color: #00FFC2; font-size: 16px; font-weight: bold")
  console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #00FFC2")
  console.log("")
  console.log("%c" + data.session.access_token, "color: #FFF; background: #1a1a1a; padding: 10px; font-family: monospace")
  console.log("")
  console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #00FFC2")
  console.log("%c📋 COPIEZ ce token et collez-le sur la page:", "color: #FFF; font-size: 14px")
  console.log("%chttp://localhost:5173/fr/seed-data", "color: #00FFC2; font-size: 14px; font-weight: bold")
  console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #00FFC2")
  console.log("")
  console.log("%c✨ Ensuite, cliquez sur 'Créer les projets de test'", "color: #FFF")
  console.log("")
} else {
  console.log("%c❌ ERREUR: Vous n'êtes pas connecté", "color: red; font-size: 14px; font-weight: bold")
  console.log("%cConnectez-vous d'abord au Dashboard: http://localhost:5173/login", "color: #FFF")
}

// ========================================
```

---

## Alternative : Version Simple

Si la version ci-dessus ne fonctionne pas, utilisez celle-ci :

```javascript
const { data } = await supabase.auth.getSession()
console.log("🔑 TOKEN:", data.session.access_token)
```

Puis copiez le token affiché.

---

## Prochaines Étapes

1. ✅ Copier le token affiché
2. 🌐 Ouvrir `http://localhost:5173/fr/seed-data`
3. 📋 Coller le token dans le champ
4. ✅ Cliquer "Créer les projets de test"
5. 🎉 Profiter de vos 6 projets !

---

Guide complet : `/CREER_PROJETS_MAINTENANT.md`
