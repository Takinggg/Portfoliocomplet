# 🌍 URLs Bilingues - Guide Rapide

## 🎯 Ce qui a changé

### AVANT
```
/              → Page d'accueil (FR)
/blog          → Blog (FR)
/services      → Services (FR)
/en/blog       → Blog (EN) - Traduction uniquement
```

### MAINTENANT
```
/              → Redirige vers /fr
/fr            → Page d'accueil (FR) ✅
/fr/blog       → Blog (FR) ✅
/fr/services   → Services (FR) ✅
/en            → Home page (EN) ✅
/en/blog       → Blog (EN) ✅
/en/services   → Services (EN) ✅
```

---

## ⚡ Quick Start

### 1️⃣ Sur localhost
```bash
# Ouvre localhost
http://localhost:5173

# Recharge avec cache vidé
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# Vérifie l'URL
✅ Doit être : /fr (pas juste /)
```

### 2️⃣ Teste la navigation
```
Clique sur Blog → /fr/blog ✅
Change de langue (EN) → /en/blog ✅
Reviens en FR → /fr/blog ✅
```

### 3️⃣ Vérifications
```javascript
// Dans la console
testBilingualURLs()  // État actuel
window.testAllURLs.printAllRoutes()  // Toutes les routes
```

---

## 📂 Fichiers modifiés

### Routes principales
- `/AppWithRouter.tsx` - Routes restructurées avec préfixes /fr/ et /en/

### Routing helpers
- `/utils/routing/languageRouting.ts` - Gestion des routes bilingues (NOUVEAU)
- `/utils/routing/urlHelpers.ts` - Helpers pour construire les URLs
- `/components/routing/LanguageRouteSync.tsx` - Synchronisation langue ↔ URL
- `/components/routing/LegacyRouteRedirect.tsx` - Redirections anciennes URLs (NOUVEAU)

### Contexte et traductions
- `/utils/i18n/LanguageContext.tsx` - Gestion de la langue avec sync URL

### Composants visuels
- `/components/URLMigrationStatus.tsx` - Badge de statut en bas à droite (NOUVEAU)

### SEO
- `/utils/seo/sitemapGenerator.ts` - Génération du sitemap avec préfixes
- `/components/SEO.tsx` - Balises hreflang automatiques

### Documentation
- `/URLS_BILINGUES_ACTIVES.md` - Liste complète des URLs
- `/TEST_URLS_BILINGUES.md` - Guide de test
- `/POURQUOI_PAS_DURLF.md` - Explication production vs local
- `/TESTER_MAINTENANT.md` - Checklist rapide
- `/README_URLS_BILINGUES.md` - Ce fichier

---

## 🚨 Important : Local vs Production

### En LOCAL (localhost)
✅ Les URLs bilingues sont **PRÊTES MAINTENANT**
- `/fr/blog`, `/en/blog`, etc.
- Redirection automatique de `/` vers `/fr`
- Changement de langue met à jour l'URL

### En PRODUCTION (maxence.design)
⏳ Les URLs bilingues **NE SONT PAS ENCORE DÉPLOYÉES**
- Tu verras encore `/blog`, `/services`, etc.
- Normal ! Les changements sont en local uniquement
- Il faut commit + push + redéployer

**C'est pour ça que tu vois encore `/blog` sur maxence.design !**

---

## 🚀 Déployer en production

### Étape 1 : Teste en local
```bash
# Ouvre http://localhost:5173
# Recharge avec Ctrl+Shift+R
# Vérifie que /fr/blog fonctionne
```

### Étape 2 : Commit & Push
```bash
git add .
git commit -m "feat: URLs bilingues /fr/ et /en/ avec redirections"
git push
```

### Étape 3 : Configure les redirections 301
**Crucial pour le SEO !** Sinon Google perd tes anciennes pages.

**Option A - Netlify (_redirects) :**
```
/blog              /fr/blog           301
/blog/*            /fr/blog/:splat    301
/services          /fr/services       301
/projects          /fr/projects       301
/projects/*        /fr/projects/:splat 301
/contact           /fr/contact        301
/about             /fr/about          301
/case-studies      /fr/case-studies   301
/case-studies/*    /fr/case-studies/:splat 301
/faq               /fr/faq            301
/resources         /fr/resources      301
/testimonials      /fr/testimonials   301
```

**Option B - Vercel (vercel.json) :**
```json
{
  "redirects": [
    { "source": "/blog", "destination": "/fr/blog", "permanent": true },
    { "source": "/blog/:path*", "destination": "/fr/blog/:path*", "permanent": true },
    { "source": "/services", "destination": "/fr/services", "permanent": true },
    { "source": "/projects", "destination": "/fr/projects", "permanent": true },
    { "source": "/projects/:path*", "destination": "/fr/projects/:path*", "permanent": true },
    { "source": "/contact", "destination": "/fr/contact", "permanent": true }
  ]
}
```

**Option C - Apache (.htaccess) :**
```apache
RewriteEngine On
RewriteRule ^blog$ /fr/blog [R=301,L]
RewriteRule ^blog/(.*)$ /fr/blog/$1 [R=301,L]
RewriteRule ^services$ /fr/services [R=301,L]
RewriteRule ^projects$ /fr/projects [R=301,L]
RewriteRule ^projects/(.*)$ /fr/projects/$1 [R=301,L]
```

### Étape 4 : Redéploie
Sur ton hébergeur (Netlify, Vercel, etc.)

### Étape 5 : Vérifie en production
```
maxence.design → Redirige vers maxence.design/fr ✅
maxence.design/blog → Redirige vers maxence.design/fr/blog ✅
```

---

## 🎯 Avantages des URLs bilingues

### ✅ SEO
- Google indexe chaque langue séparément
- Balises `hreflang` automatiques
- Meilleur ranking pour chaque marché

### ✅ UX
- URL claire indique la langue
- Partage d'URL préserve la langue
- Navigation cohérente

### ✅ Technique
- URLs propres et lisibles
- Compatible avec tous les outils SEO
- Facile à maintenir

---

## 🐛 Dépannage

### URLs sans préfixe sur localhost
**Solution :** Recharge avec `Ctrl+Shift+R` (vider le cache)

### Redirection infinie
**Solution :** Vide le localStorage dans la console : `localStorage.clear()`

### Changement de langue ne met pas à jour l'URL
**Solution :** Vérifie la console pour les erreurs, recharge la page

### Badge "Ancienne URL détectée"
**Solution :** Normal si cache pas vidé. Recharge avec `Ctrl+Shift+R`

---

## 💡 Commandes utiles

```javascript
// État des URLs
testBilingualURLs()

// Toutes les routes (36+)
window.testAllURLs.printAllRoutes()

// Routes FR uniquement
window.testAllURLs.printByLanguage('fr')

// Routes EN uniquement
window.testAllURLs.printByLanguage('en')

// Tester une URL
window.testAllURLs.testRoute('/fr/blog')  // true
window.testAllURLs.testRoute('/blog')     // false (ancienne)

// Langue actuelle
console.log(window.location.pathname.match(/^\/(en|fr)/)?.[1])

// Forcer une redirection
window.location.href = '/fr/blog'
```

---

## 📚 Documentation

- **Ce fichier** : Vue d'ensemble et quick start
- **`/TESTER_MAINTENANT.md`** : Checklist de test étape par étape
- **`/POURQUOI_PAS_DURLF.md`** : Pourquoi tu vois encore `/blog` sur maxence.design
- **`/TEST_URLS_BILINGUES.md`** : Tests complets (2 min)
- **`/URLS_BILINGUES_ACTIVES.md`** : Liste exhaustive de toutes les URLs

---

## ✅ Checklist

- [ ] Recharge localhost avec cache vidé
- [ ] Vérifie que l'URL est `/fr` (pas juste `/`)
- [ ] Clique sur Blog → URL devient `/fr/blog`
- [ ] Change de langue → URL devient `/en/blog`
- [ ] Teste d'autres pages (services, projects, etc.)
- [ ] Vérifie dans la console : `testBilingualURLs()`
- [ ] Badge vert en bas à droite
- [ ] Commit + Push
- [ ] Configure redirections 301
- [ ] Redéploie en production
- [ ] Teste sur maxence.design

---

**🚀 PROCHAINE ÉTAPE :** Recharge http://localhost:5173 avec `Ctrl+Shift+R` !
