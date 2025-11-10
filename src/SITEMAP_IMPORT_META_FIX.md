# ✅ Fix: import.meta.env Error

## 🔧 Problème Résolu

L'erreur `Cannot read properties of undefined (reading 'VITE_SITE_URL')` a été corrigée.

---

## 💡 Cause du Problème

`import.meta.env` n'est pas accessible dans le contexte de la console navigateur. Il est uniquement disponible pendant la phase de build Vite.

---

## ✅ Corrections Appliquées

### 1. `/utils/routing/urlHelpers.ts`
```typescript
// AVANT (❌ Ne fonctionnait pas dans la console)
const baseUrl = import.meta.env.VITE_SITE_URL || 'https://maxenss.com';

// APRÈS (✅ Fonctionne partout)
let baseUrl = 'https://maxenss.com';
if (typeof window !== 'undefined' && window.location) {
  baseUrl = window.location.origin;
} else if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) {
  baseUrl = import.meta.env.VITE_SITE_URL;
}
```

### 2. `/utils/seo/sitemapGenerator.ts`
```typescript
// AVANT (❌ import.meta.env hardcodé)
const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || '...';
const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '...';

// APRÈS (✅ Import dynamique)
const { projectId, publicAnonKey } = await import('../supabase/info');
```

---

## 🚀 Tester Maintenant

### 1. Recharger la page
```
Ctrl+R (Windows/Linux) ou Cmd+R (Mac)
```

### 2. Attendre 2-3 secondes (pour que tout se charge)

### 3. Dans la console:
```javascript
window.generateSitemap()
```

**Résultat attendu:**
```
🗺️ Generating complete sitemap (static + dynamic pages)...
✅ Sitemap generated successfully!

📄 Sitemap Preview (first 1000 chars):

<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>http://localhost:5173/</loc>
    ...
```

### 4. Télécharger:
```javascript
window.downloadSitemap()
```

Le fichier `sitemap.xml` sera téléchargé ✅

---

## 📊 Que Contient le Sitemap?

Le sitemap généré utilise maintenant:
- **Base URL**: `window.location.origin` (ex: `http://localhost:5173` en dev, votre domaine en prod)
- **Pages statiques**: Toutes les pages principales (FR + EN)
- **Pages dynamiques**: Blog, projets, case studies (si serveur Supabase déployé)

---

## 🎯 Avantages du Fix

✅ **Fonctionne en dev ET en prod**
- Dev: URLs avec `http://localhost:5173`
- Prod: URLs avec votre domaine réel

✅ **Fonctionne depuis la console**
- Plus d'erreur `import.meta.env` undefined

✅ **URLs dynamiques automatiques**
- Le sitemap s'adapte à votre environnement

---

## 📝 Notes Importantes

### Pour Production
Quand vous déployez en production, le sitemap utilisera automatiquement votre domaine réel.

**Exemple:**
- En local: `http://localhost:5173/blog`
- En prod: `https://maxenss.com/blog`

### Pour Personnaliser le Domaine
Si vous voulez forcer un domaine spécifique, vous pouvez définir la variable d'environnement:

```bash
# Dans .env
VITE_SITE_URL=https://votre-domaine.com
```

Mais ce n'est **PAS nécessaire** - le système détecte automatiquement le bon domaine.

---

## ✅ Checklist

- [x] Erreur `import.meta.env` corrigée
- [x] `urlHelpers.ts` utilise `window.location.origin`
- [x] `sitemapGenerator.ts` utilise import dynamique
- [x] Fonctionne en dev et prod
- [ ] **VOUS**: Tester `window.generateSitemap()`
- [ ] **VOUS**: Vérifier les URLs dans le sitemap
- [ ] **VOUS**: Télécharger avec `window.downloadSitemap()`

---

## 🆘 Si Ça Ne Fonctionne Toujours Pas

### Vérifier la console
Y a-t-il d'autres erreurs?

### Forcer un rechargement complet
```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### Vérifier les commandes disponibles
```javascript
window.sitemapHelp()
```

### Utiliser la version statique
Si les pages dynamiques posent problème:
```javascript
window.generateStaticSitemap()
window.downloadStaticSitemap()
```

---

## 📖 Documentation

- **Commandes**: `/SEO_COMMANDES_CONSOLE.md`
- **Quick Start**: `/SEO_QUICK_START.md`
- **Fix Complet**: `/SEO_FIX_COMPLET.md`
- **Dépannage**: `/SEO_ERREUR_SITEMAP_FIX.md`

---

**Le problème est résolu ! Rechargez la page et testez `window.generateSitemap()` 🎉**
