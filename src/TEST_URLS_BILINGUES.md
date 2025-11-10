# 🧪 Test URLs Bilingues - Guide Rapide

## ⚡ Test Express (2 minutes)

### 1. Recharger la page
**IMPORTANT:** Vider le cache avant de tester !
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### 2. Tester dans le navigateur

#### Test de redirection
```
http://localhost:5173/
→ Doit rediriger automatiquement vers /fr
```

#### URLs françaises
```
✅ http://localhost:5173/fr
✅ http://localhost:5173/fr/services
✅ http://localhost:5173/fr/projects
✅ http://localhost:5173/fr/blog
✅ http://localhost:5173/fr/contact
```

#### URLs anglaises
```
✅ http://localhost:5173/en
✅ http://localhost:5173/en/services
✅ http://localhost:5173/en/projects
✅ http://localhost:5173/en/blog
✅ http://localhost:5173/en/contact
```

### 3. Tester le changement de langue

1. Va sur `/fr/services`
2. Clique sur le bouton **EN** en haut à droite
3. ✅ L'URL doit changer pour `/en/services`
4. Le contenu doit s'afficher en anglais
5. Clique sur **FR**
6. ✅ L'URL doit revenir à `/fr/services`

### 4. Vérifier dans la console

Ouvre la console (F12) et exécute :

```javascript
// Afficher toutes les routes
window.testAllURLs.printAllRoutes()

// Résultat attendu: 36+ routes affichées avec préfixes /fr/ et /en/
```

### 5. Tester les routes dynamiques

```
✅ /fr/projects/taskflow-2024
✅ /en/projects/taskflow-2024
✅ /fr/blog/optimiser-seo-react-2024
✅ /en/blog/optimize-seo-react-2024
```

## ✅ Critères de réussite

- [ ] `/` redirige vers `/fr`
- [ ] Toutes les URLs françaises commencent par `/fr/`
- [ ] Toutes les URLs anglaises commencent par `/en/`
- [ ] Le changement de langue met à jour l'URL
- [ ] Le contenu change selon la langue
- [ ] Les routes protégées (`/dashboard`, `/login`) fonctionnent sans préfixe
- [ ] `window.testAllURLs.printAllRoutes()` affiche 36+ routes

## 🐛 Problèmes courants

### La redirection `/` → `/fr` ne fonctionne pas
→ Vider le cache et recharger (Ctrl+Shift+R)

### Les URLs n'ont pas de préfixe
→ Vérifier que tu es bien sur la nouvelle version
→ Recharger avec cache vidé

### Le changement de langue ne marche pas
→ Ouvrir la console pour voir les erreurs
→ Vérifier que le composant `LanguageRouteSync` est actif

## 📊 Commandes console utiles

```javascript
// Voir toutes les routes
window.testAllURLs.printAllRoutes()

// Routes françaises uniquement
window.testAllURLs.printByLanguage('fr')

// Routes anglaises uniquement
window.testAllURLs.printByLanguage('en')

// Tester une route spécifique
window.testAllURLs.testRoute('/fr/services') // true
window.testAllURLs.testRoute('/services')    // false (ancienne structure)

// Voir la langue actuelle
console.log(window.location.pathname.match(/^\/(en|fr)/)?.[1])
```

## 🎯 Résultat final attendu

Après le test, ton site doit :
- ✅ Avoir des URLs propres et SEO-friendly
- ✅ Chaque langue a ses propres URLs distinctes
- ✅ La navigation préserve la langue choisie
- ✅ Le changement de langue met à jour l'URL
- ✅ Google peut indexer chaque version de langue séparément

## 📝 Notes

- Les routes techniques (`/dashboard`, `/login`, etc.) restent **sans préfixe**
- La route `/` redirige toujours vers `/fr` (langue par défaut)
- Le localStorage sauvegarde la préférence de langue
- Les balises `hreflang` sont générées automatiquement pour le SEO

---

**C'est prêt ! 🚀** Recharge la page et teste maintenant !
