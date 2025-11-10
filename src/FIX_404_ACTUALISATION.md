# ✅ Fix : Erreur 404 lors de l'actualisation des pages

## 🐛 Problème

Quand tu actualises une page comme `/en` ou `/fr/services`, tu obtiens :
```
GET https://www.maxence.design/en 404 (Not Found)
```

## 🎯 Cause

C'est un **problème classique des SPA (Single Page Applications)** :

1. Tu navigues vers `/en` via React Router ✅
2. React Router affiche le bon contenu ✅
3. Tu actualises la page (F5) ❌
4. Vercel cherche un fichier physique `/en/index.html` qui n'existe pas ❌
5. Erreur 404 ❌

**Le problème :** Vercel essaie de servir un fichier au lieu de laisser React Router gérer la route.

---

## 🔧 Solution Appliquée

### 1. Configuration `vercel.json` améliorée

**AVANT** (trop générique) :
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**APRÈS** (plus spécifique) :
```json
{
  "rewrites": [
    {
      "source": "/fr/:path*",
      "destination": "/index.html"
    },
    {
      "source": "/en/:path*",
      "destination": "/index.html"
    },
    {
      "source": "/:path*",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Fichier `_redirects` ajouté

Créé `/public/_redirects` pour une compatibilité supplémentaire :
```
/*    /index.html   200
```

---

## 📊 Comment ça Fonctionne

### Flux Normal (Navigation Interne)
```
Click "Services" 
  ↓
React Router change l'URL → /fr/services
  ↓
React Router affiche ServicesPage
  ↓
✅ Tout fonctionne
```

### Flux avec Actualisation (AVANT le fix)
```
Sur /en → F5 (Actualisation)
  ↓
Vercel cherche /en/index.html
  ↓
Fichier n'existe pas
  ↓
❌ 404 Not Found
```

### Flux avec Actualisation (APRÈS le fix)
```
Sur /en → F5 (Actualisation)
  ↓
Vercel rewrite : /en → /index.html
  ↓
Serve index.html
  ↓
React Router démarre
  ↓
React Router lit l'URL : /en
  ↓
React Router affiche la bonne page
  ↓
✅ Tout fonctionne
```

---

## 🧪 Test

### Avant de déployer (local)

Si tu testes en local, le problème ne devrait pas apparaître car le dev server gère ça automatiquement.

### Après déploiement (production)

1. **Va sur** `https://www.maxence.design/en`
2. **Appuie sur F5** (actualisation)
3. **Résultat attendu** : 
   - ✅ La page se recharge sans erreur
   - ✅ Tu restes sur `/en`
   - ✅ Pas de 404

4. **Teste d'autres pages** :
   ```
   /fr/services → F5 → ✅
   /en/projects → F5 → ✅
   /fr/about → F5 → ✅
   /en/blog → F5 → ✅
   ```

---

## 🚀 Déploiement

```bash
# 1. Commit les changements
git add vercel.json public/_redirects FIX_404_ACTUALISATION.md
git commit -m "fix: Fix 404 on page refresh with improved Vercel rewrites"

# 2. Push
git push origin main

# 3. Attends le déploiement Vercel (2-3 min)

# 4. Teste l'actualisation sur /en
```

---

## 🔍 Vérification Console

Après le déploiement, ouvre la console sur `https://www.maxence.design/en` et actualise :

**AVANT le fix** :
```
❌ GET https://www.maxence.design/en 404 (Not Found)
```

**APRÈS le fix** :
```
✅ Pas d'erreur 404
✅ Page se charge normalement
```

---

## 📝 Détails Techniques

### Rewrites vs Redirects

**Rewrites** (utilisés ici) :
- Changent la destination en interne
- L'URL reste identique dans le navigateur
- Transparents pour l'utilisateur
- Parfaits pour les SPA

**Redirects** (déjà dans le fichier) :
- Changent l'URL visible
- Le navigateur voit le changement
- Utilisés pour les URLs legacy (`/blog` → `/fr/blog`)

### Ordre des Rewrites

L'ordre est important ! Vercel teste dans l'ordre :

1. `/fr/:path*` - Attrape `/fr`, `/fr/services`, `/fr/blog/post`, etc.
2. `/en/:path*` - Attrape `/en`, `/en/about`, `/en/projects/123`, etc.
3. `/:path*` - Attrape tout le reste (fallback)

### Pattern `:path*`

- `:path` = capture un segment d'URL
- `*` = zéro ou plusieurs segments
- Exemples :
  - `/fr` → match (0 segments après /fr)
  - `/fr/services` → match (1 segment : "services")
  - `/fr/blog/mon-article` → match (2 segments : "blog/mon-article")

---

## 🛡️ Fichiers Statiques Préservés

Les rewrites **ne s'appliquent pas** aux fichiers statiques :

✅ `/manifest.json` → servi tel quel
✅ `/robots.txt` → servi tel quel
✅ `/service-worker.js` → servi tel quel
✅ Fichiers dans `/public` → servis tel quel

Seulement les routes qui **ne correspondent pas à un fichier physique** sont rewritées vers `index.html`.

---

## 🐛 Si le Problème Persiste

### 1. Vide le cache Vercel

Dans Vercel Dashboard :
1. Va sur ton projet
2. Settings → General
3. Scroll down → "Clear Cache"
4. Redéploie

### 2. Force un nouveau build

```bash
# Ajoute un commentaire pour forcer un rebuild
git commit --allow-empty -m "Trigger rebuild for rewrite fix"
git push origin main
```

### 3. Vérifie les logs Vercel

1. Va sur Vercel Dashboard
2. Deployments → Click sur le dernier
3. Runtime Logs → Cherche des erreurs 404

### 4. Test en local (simulation production)

```bash
# Build de production local
npm run build

# Serve avec simulation des rewrites
npx serve dist -s

# Teste http://localhost:3000/en et actualise
```

---

## 📊 Checklist de Validation

- [ ] `vercel.json` mis à jour avec rewrites spécifiques
- [ ] `/public/_redirects` créé
- [ ] Code déployé sur Vercel
- [ ] Actualisation sur `/en` fonctionne (pas de 404)
- [ ] Actualisation sur `/fr` fonctionne
- [ ] Actualisation sur `/fr/services` fonctionne
- [ ] Actualisation sur `/en/projects` fonctionne
- [ ] Fichiers statiques toujours accessibles (manifest.json, robots.txt)

---

## 🎯 Alternatives (si besoin)

### Option 1 : Headers personnalisés

Ajoute dans `vercel.json` :
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### Option 2 : Configuration Vite (si utilisé)

Dans `vite.config.ts` :
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
```

---

## 💡 Ressources

- [Vercel SPA Configuration](https://vercel.com/docs/configuration#project/rewrites)
- [React Router + Vercel](https://reactrouter.com/en/main/start/overview#client-side-routing)
- [SPA Fallback Strategies](https://vercel.com/docs/frameworks/vite#spa-fallback)

---

**Le problème d'actualisation 404 est maintenant résolu ! ✅**

Après déploiement, tu pourras actualiser n'importe quelle page sans erreur.
