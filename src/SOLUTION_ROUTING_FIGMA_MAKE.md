# 🎯 SOLUTION ROUTING /fr et /en pour FIGMA MAKE

## ❌ Problème initial

Dans **Figma Make**, on ne peut **PAS** configurer le serveur :
- ❌ `vercel.json` ne fonctionne pas
- ❌ `_redirects` ne fonctionne pas
- ❌ Aucune config serveur possible

**Résultat :** Quand on actualise `/fr` ou `/en`, le serveur retourne 404.

---

## ✅ Solution : SPA Redirect Hack (100% JavaScript)

Cette technique fonctionne **sans config serveur** - utilisée par GitHub Pages, Surge.sh, etc.

### Comment ça marche ?

```
1. User visite maxence.design/fr
2. Serveur ne trouve pas /fr → retourne 404.html
3. 404.html sauvegarde "/fr" dans sessionStorage
4. 404.html redirige vers "/"
5. React se charge
6. RouteRestorer lit sessionStorage
7. Navigate vers "/fr"
8. ✅ Page française affichée !
```

---

## 📁 Fichiers modifiés

### 1️⃣ `/index.html`
```javascript
// Sauvegarde l'URL si on arrive directement sur /fr ou /en
sessionStorage.setItem('spa_redirect', JSON.stringify({
  path: path,
  search: search,
  hash: hash
}));
```

### 2️⃣ `/public/404.html`
```javascript
// Même logique, mais pour les vraies 404
sessionStorage.setItem('spa_redirect', ...);
window.location.href = '/';
```

### 3️⃣ `/App.tsx`
```typescript
function RouteRestorer() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const savedRoute = sessionStorage.getItem('spa_redirect');
    if (savedRoute) {
      const { path, search, hash } = JSON.parse(savedRoute);
      navigate(path + search + hash, { replace: true });
      sessionStorage.removeItem('spa_redirect');
    }
  }, [navigate]);
  
  return null;
}
```

---

## 🧪 Comment tester

### Test 1 : Navigation normale
1. Va sur `maxence.design`
2. Click sur le language switcher → `/fr`
3. ✅ Fonctionne (client-side routing normal)

### Test 2 : Refresh de page
1. Va sur `maxence.design/fr`
2. **Actualise la page (F5)**
3. ✅ Fonctionne grâce au redirect hack !

### Test 3 : URL directe
1. Ouvre un nouvel onglet
2. Tape `maxence.design/en/projects`
3. ✅ Fonctionne grâce à 404.html !

### Test 4 : Vraie 404
1. Va sur `maxence.design/page-qui-existe-pas`
2. ✅ Affiche la page NotFound de React Router

---

## 🔍 Debugging

### Dans la console du navigateur :

```javascript
// Vérifier si la route est sauvegardée
console.log(sessionStorage.getItem('spa_redirect'));

// Vérifier la route actuelle
console.log(window.location.pathname);
```

### Logs automatiques :

- `🔄 SPA Redirect` : URL sauvegardée dans sessionStorage
- `✅ Route restaurée` : Navigation vers la route sauvegardée

---

## 📊 Flux de navigation

### Cas 1 : Navigation normale (dans l'app)
```
User click → React Router → Navigate → ✅ Pas de reload
```

### Cas 2 : URL directe ou refresh
```
Browser → Cherche /fr → Pas trouvé → index.html
→ Script sauvegarde "/fr" → React charge
→ RouteRestorer lit "/fr" → Navigate → ✅ Page FR
```

### Cas 3 : Vraie 404 (serveur)
```
Browser → Cherche /xyz → Pas trouvé → 404.html
→ Script sauvegarde "/xyz" → Redirige vers /
→ React charge → RouteRestorer navigate → React Router
→ Pas de route /xyz → NotFoundPage ✅
```

---

## ⚠️ Limitations

### SEO
- Les moteurs de recherche voient `/fr` mais sont redirigés vers `/`
- **Solution :** Ajouter des balises canonical et hreflang
- **Alternative :** Utiliser HashRouter (`#/fr`) mais moins propre

### Bookmarks
- Si un user bookmark `/fr` pendant la redirection, il bookmark `/`
- **Solution :** Le script est rapide (<100ms), faible risque

### Analytics
- Le pageview est tracké 2 fois : `/` puis `/fr`
- **Solution :** Filtrer les pageviews de `/` si redirect détecté

---

## 🚀 Déploiement

### Figma Make → Vercel/Netlify

**Aucune config nécessaire !**

1. Push ton code sur GitHub
2. Connecte le repo à Vercel/Netlify
3. ✅ Ça marche directement !

### Vérifier le build

```bash
npm run build
cd dist/
ls -la

# Tu dois voir :
# - index.html
# - 404.html (dans public/)
# - assets/
```

---

## ✅ Avantages de cette solution

- ✅ **Fonctionne sans config serveur**
- ✅ **Compatible avec tous les hébergeurs statiques**
- ✅ **Pas de dépendance externe**
- ✅ **100% client-side**
- ✅ **Supporte les query params et hash**
- ✅ **Rapide (<100ms de redirect)**

---

## 📝 Alternatives considérées

### 1. Hash Router (#/fr)
```
❌ Mauvais pour SEO
❌ URLs moches
✅ Fonctionne sans config
```

### 2. Server-side config
```
❌ Impossible dans Figma Make
❌ Nécessite vercel.json ou _redirects
```

### 3. Static export avec prébuild
```
❌ Complexe à maintenir
❌ Nécessite générer /fr/index.html, /en/index.html
❌ Pas adapté pour SPA
```

---

## 🎯 Conclusion

**Cette solution est le meilleur compromis** pour Figma Make :
- Simple à implémenter
- Fonctionne partout
- Pas de config serveur
- Expérience user fluide

**Prochaine étape :** Push sur GitHub et teste en production ! 🚀
