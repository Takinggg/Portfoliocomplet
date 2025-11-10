# 🎮 Commandes Console - URLs & Sitemap

## 🚀 Commandes Rapides

Toutes ces commandes sont disponibles dans la console navigateur (F12).

---

## 📍 Tester les URLs

### Afficher toutes les routes
```javascript
window.testAllURLs.printAllRoutes()
```
Affiche toutes les 35+ routes du site organisées par langue et type.

**Résultat:**
```
🇫🇷 ROUTES FRANÇAISES (11 pages statiques)
  📄 /
  📄 /projects
  📝 /projects/:projectId (ex: /projects/taskflow-2024)
  📄 /services
  📄 /about
  ...

🇬🇧 ROUTES ANGLAISES (11 pages statiques)
  📄 /en/
  📄 /en/projects
  ...

🔐 ROUTES PROTÉGÉES
  🔓 /login
  🔒 /dashboard

🛠️ ROUTES TECHNIQUES
  🔧 /newsletter-debug
  ...
```

---

### Afficher la structure visuelle
```javascript
window.testAllURLs.showURLStructure()
```
Affiche l'arborescence complète du site.

**Résultat:**
```
votredomaine.com/
│
├── 🇫🇷 FRANÇAIS (default)
│   ├── /
│   ├── /projects
│   │   └── /projects/:id
│   ├── /services
│   ...
│
├── 🇬🇧 ANGLAIS (/en)
│   ├── /en/
│   ├── /en/projects
│   ...
```

---

### Tester toutes les routes statiques
```javascript
window.testAllURLs.testAllStaticRoutes()
```
Vérifie que toutes les pages statiques sont accessibles.

**Résultat:**
```
🧪 TEST DE TOUTES LES ROUTES STATIQUES

  ✅ / - Page d'accueil française
  ✅ /projects - Liste des projets (FR)
  ✅ /services - Page services (FR)
  ...
  
  Résultat: 22 ✅ / 0 ❌ (Total: 22)
```

---

### Tester une route spécifique
```javascript
// Vérifier si une route existe
window.testAllURLs.testRoute('/projects')
// → true

window.testAllURLs.testRoute('/page-inexistante')
// → false
```

---

### Obtenir infos sur une route
```javascript
window.testAllURLs.getRouteInfo('/projects')
```
**Résultat:**
```javascript
{
  path: '/projects',
  language: 'fr',
  type: 'static',
  description: 'Liste des projets (FR)'
}
```

---

### Filtrer les routes
```javascript
// Routes françaises uniquement
window.testAllURLs.getRoutesByLanguage('fr')

// Routes anglaises uniquement
window.testAllURLs.getRoutesByLanguage('en')

// Routes protégées
window.testAllURLs.getRoutesByType('protected')

// Routes techniques
window.testAllURLs.getRoutesByType('technical')

// Routes dynamiques
window.testAllURLs.getRoutesByType('dynamic')

// Routes statiques
window.testAllURLs.getRoutesByType('static')
```

---

### Voir toutes les routes (données brutes)
```javascript
window.testAllURLs.allRoutes
```
Retourne le tableau complet de toutes les routes définies.

---

## 🗺️ Générer le Sitemap

### Aide sitemap
```javascript
window.sitemapHelp()
```
Affiche toutes les commandes sitemap disponibles.

---

### Générer sitemap complet
```javascript
window.generateSitemap()
```
Génère le sitemap complet (pages + blog + projets + case studies).

**Inclut:**
- ✅ Pages statiques FR + EN
- ✅ Articles de blog (si serveur déployé)
- ✅ Projets (si serveur déployé)
- ✅ Études de cas (si serveur déployé)
- ✅ Balises hreflang

---

### Télécharger sitemap
```javascript
window.downloadSitemap()
```
Télécharge le fichier `sitemap.xml` complet.

---

### Générer sitemap statique
```javascript
window.generateStaticSitemap()
```
Génère uniquement les pages statiques (22 pages FR + EN).

**Plus rapide**, ne nécessite pas le serveur.

---

### Télécharger sitemap statique
```javascript
window.downloadStaticSitemap()
```
Télécharge uniquement le sitemap des pages statiques.

---

### Générer XML brut
```javascript
const xml = await window.generateSitemapXML()
console.log(xml)
```
Retourne le XML du sitemap en tant que string (sans l'afficher).

---

## 🎯 Commandes de Navigation

### Ouvrir pages techniques
```javascript
// Ouvrir newsletter debug
window.newsletterDebug()
// → Redirige vers /newsletter-debug

// Ouvrir diagnostic serveur
window.serverDiagnostic()
// → Redirige vers /server-diagnostic

// Ouvrir sync dashboard
window.syncDashboard()
// → Redirige vers /sync-dashboard
```

---

## 📊 Statistiques

### Compter les routes
```javascript
const stats = {
  total: window.testAllURLs.allRoutes.length,
  french: window.testAllURLs.getRoutesByLanguage('fr').length,
  english: window.testAllURLs.getRoutesByLanguage('en').length,
  protected: window.testAllURLs.getRoutesByType('protected').length,
  technical: window.testAllURLs.getRoutesByType('technical').length,
  static: window.testAllURLs.getRoutesByType('static').length,
  dynamic: window.testAllURLs.getRoutesByType('dynamic').length,
};

console.table(stats);
```

**Résultat:**
```
┌──────────────┬────────┐
│ (index)      │ Values │
├──────────────┼────────┤
│ total        │ 36     │
│ french       │ 14     │
│ english      │ 14     │
│ protected    │ 2      │
│ technical    │ 4      │
│ static       │ 22     │
│ dynamic      │ 8      │
└──────────────┴────────┘
```

---

## 🔍 Exemples Pratiques

### Cas d'Usage 1: Vérifier Structure Complète
```javascript
// 1. Voir la structure visuelle
window.testAllURLs.showURLStructure()

// 2. Lister toutes les routes
window.testAllURLs.printAllRoutes()

// 3. Tester l'accessibilité
await window.testAllURLs.testAllStaticRoutes()
```

---

### Cas d'Usage 2: Générer Sitemap Production
```javascript
// 1. Générer le sitemap complet
await window.generateSitemap()

// 2. Télécharger le fichier
window.downloadSitemap()

// 3. Placer dans /public/sitemap.xml
// Fait manuellement dans votre projet
```

---

### Cas d'Usage 3: Debug Route Spécifique
```javascript
// Vérifier si route existe
const exists = window.testAllURLs.testRoute('/projects/taskflow-2024')
console.log('Route exists:', exists) // true

// Obtenir infos
const info = window.testAllURLs.getRouteInfo('/projects/taskflow-2024')
console.log('Route info:', info)

// Naviguer vers la route
window.location.href = '/projects/taskflow-2024'
```

---

### Cas d'Usage 4: Audit SEO Complet
```javascript
// 1. Générer sitemap
const xml = await window.generateSitemapXML()

// 2. Compter les URLs
const urlCount = (xml.match(/<loc>/g) || []).length
console.log(`Total URLs in sitemap: ${urlCount}`)

// 3. Vérifier balises hreflang
const hreflangCount = (xml.match(/hreflang/g) || []).length
console.log(`Total hreflang tags: ${hreflangCount}`)

// 4. Vérifier structure
console.log('Sitemap starts with XML declaration:', xml.startsWith('<?xml'))
```

---

## 🛠️ Debugging

### Problème: Route ne fonctionne pas
```javascript
// 1. Vérifier si route existe
window.testAllURLs.testRoute('/ma-route')

// 2. Voir routes similaires
window.testAllURLs.allRoutes.filter(r => r.path.includes('route'))

// 3. Tester accessibilité
await window.testAllURLs.testURLAccessibility('/ma-route')
```

---

### Problème: Sitemap incomplet
```javascript
// 1. Tester avec sitemap statique
await window.generateStaticSitemap()

// 2. Si ça fonctionne, problème serveur
// Vérifier serveur avec:
window.serverDiagnostic()

// 3. Générer XML et compter URLs
const xml = await window.generateSitemapXML()
const count = (xml.match(/<url>/g) || []).length
console.log(`URLs in sitemap: ${count}`)
```

---

### Problème: 404 sur certaines pages
```javascript
// Tester toutes les routes
await window.testAllURLs.testAllStaticRoutes()

// Les routes en ❌ ont un problème
// Vérifier dans AppWithRouter.tsx
```

---

## 📖 Documentation

### Guides Associés
- **Liste URLs**: `/TOUTES_LES_URLS_DU_SITE.md`
- **Structure Visuelle**: `/STRUCTURE_URLS_VISUELLE.md`
- **Sitemap**: `/LIRE_MOI_SITEMAP.md`
- **SEO**: `/SEO_MULTILINGUE_GUIDE.md`

### Fichiers Source
- **Routes**: `/AppWithRouter.tsx`
- **Tests URLs**: `/utils/testAllURLs.ts`
- **Sitemap Helpers**: `/utils/seo/sitemapHelpers.ts`
- **Sitemap Generator**: `/utils/seo/sitemapGenerator.ts`

---

## ✅ Checklist Rapide

### Vérifier Structure URLs
```javascript
✓ window.testAllURLs.showURLStructure()
✓ window.testAllURLs.printAllRoutes()
✓ await window.testAllURLs.testAllStaticRoutes()
```

### Générer Sitemap
```javascript
✓ window.sitemapHelp()
✓ await window.generateSitemap()
✓ window.downloadSitemap()
```

### Navigation
```javascript
✓ window.newsletterDebug()
✓ window.serverDiagnostic()
✓ window.syncDashboard()
```

---

## 🎉 Résumé

**Toutes les commandes sont prêtes !**

🗺️ **URLs**: `window.testAllURLs.*`  
🗂️ **Sitemap**: `window.generateSitemap()`, `window.downloadSitemap()`  
🚀 **Navigation**: `window.newsletterDebug()`, etc.  

**Rechargez la page, ouvrez la console (F12), et testez !**
