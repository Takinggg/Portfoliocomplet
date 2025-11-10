# ✅ Checklist : Tester les URLs Bilingues

## 🚀 Test Rapide (2 minutes)

### ☐ Étape 1 : Ouvrir localhost
```
http://localhost:5173
```

### ☐ Étape 2 : Vider le cache
**Raccourci clavier :**
- 💻 Windows/Linux : `Ctrl + Shift + R`
- 🍎 Mac : `Cmd + Shift + R`

### ☐ Étape 3 : Vérifier la page d'accueil
**Résultat attendu :**
```
✅ URL : http://localhost:5173/fr
```
(Pas juste `/` mais bien `/fr`)

### ☐ Étape 4 : Naviguer vers Blog
Clique sur "Blog" dans le menu.

**Résultat attendu :**
```
✅ URL : http://localhost:5173/fr/blog
```

### ☐ Étape 5 : Changer de langue
Clique sur le bouton **EN** en haut à droite.

**Résultat attendu :**
```
✅ URL change pour : http://localhost:5173/en/blog
✅ Le contenu passe en anglais
```

### ☐ Étape 6 : Revenir en français
Clique sur le bouton **FR**.

**Résultat attendu :**
```
✅ URL change pour : http://localhost:5173/fr/blog
✅ Le contenu revient en français
```

### ☐ Étape 7 : Tester d'autres pages
- `/fr/services` ✅
- `/fr/projects` ✅
- `/fr/contact` ✅
- `/en/services` ✅
- `/en/projects` ✅
- `/en/contact` ✅

---

## 🎯 Indicateurs de succès

### ✅ Dans l'URL :
- Tu vois `/fr/` ou `/en/` dans TOUTES les URLs
- Pas d'URLs comme `/blog` ou `/services` sans préfixe

### ✅ Dans la console (F12) :
```javascript
testBilingualURLs()
```
Doit afficher : **"URLs bilingues ACTIVES !"**

### ✅ Badge visuel :
Un badge vert en bas à droite indique "URLs bilingues actives"

---

## 🐛 Si ça ne fonctionne pas

### Symptôme : URLs sans préfixe (/blog au lieu de /fr/blog)
**Solution :**
1. Force le rechargement : `Ctrl + Shift + R`
2. Vide complètement le cache du navigateur
3. Ferme et rouvre l'onglet

### Symptôme : Redirection infinie
**Solution :**
1. Ouvre la console (F12)
2. Lis les messages d'erreur
3. Vide le localStorage : `localStorage.clear()` dans la console

### Symptôme : Le changement de langue ne met pas à jour l'URL
**Solution :**
1. Vérifie la console pour les erreurs
2. Recharge la page
3. Essaie sur une autre page

---

## 📊 Commandes de diagnostic

```javascript
// État des URLs
testBilingualURLs()

// Toutes les routes disponibles
window.testAllURLs.printAllRoutes()

// Routes françaises uniquement
window.testAllURLs.printByLanguage('fr')

// Routes anglaises uniquement
window.testAllURLs.printByLanguage('en')

// Langue actuelle
console.log(window.location.pathname.match(/^\/(en|fr)/)?.[1])
```

---

## 🎉 Si tout fonctionne

**BRAVO ! 🎊** Tes URLs bilingues sont opérationnelles !

### Prochaine étape : Déploiement en production

1. **Commit les changements**
   ```bash
   git add .
   git commit -m "feat: URLs bilingues /fr/ et /en/"
   git push
   ```

2. **Configure les redirections 301**
   Voir : `/POURQUOI_PAS_DURLF.md` section "Étape 4"

3. **Redéploie l'application**
   Sur ton hébergeur (Vercel, Netlify, etc.)

4. **Teste en production**
   ```
   maxence.design → maxence.design/fr ✅
   maxence.design/blog → maxence.design/fr/blog ✅
   ```

---

## 📚 Documentation complète

- **Pourquoi pas de /fr/ ?** → `/POURQUOI_PAS_DURLF.md`
- **Toutes les URLs** → `/URLS_BILINGUES_ACTIVES.md`
- **Guide complet** → `/TEST_URLS_BILINGUES.md`

---

## 💡 Rappel

**EN LOCAL :** Les URLs bilingues sont prêtes maintenant ! ✅  
**EN PRODUCTION :** Pas encore (tant que tu n'as pas redéployé) ⏳

C'est normal de voir les anciennes URLs sur maxence.design. Teste d'abord sur localhost ! 🚀
