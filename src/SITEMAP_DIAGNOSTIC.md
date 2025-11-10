# 🔍 Sitemap - Diagnostic Rapide

## Problème rencontré?

Utilisez ce guide pour diagnostiquer rapidement votre problème.

---

## ❌ Erreur: "window.generateSitemap is not a function"

### Cause
Les utilitaires sitemap ne sont pas encore chargés.

### Solution
1. Attendre 2-3 secondes après le chargement de la page
2. Recharger la page (Ctrl+R)
3. Vérifier avec: `window.sitemapHelp()`

### Si le problème persiste
📖 Voir: `/SEO_ERREUR_SITEMAP_FIX.md`

---

## ❌ Erreur: "Cannot read properties of undefined (reading 'VITE_SITE_URL')"

### Cause
`import.meta.env` n'est pas accessible dans le contexte de la console.

### Solution
✅ **CORRIGÉ** - Le code utilise maintenant `window.location.origin`

Rechargez la page et réessayez.

### Vérification
```javascript
window.generateSitemap()
```

Devrait afficher des URLs avec votre domaine actuel (ex: `http://localhost:5173/` en dev).

📖 Voir: `/SITEMAP_IMPORT_META_FIX.md`

---

## ❌ Erreur: Fetch échoue / Pas de données dynamiques

### Cause
Le serveur Supabase n'est pas déployé ou inaccessible.

### Solution Temporaire
Utiliser le générateur statique (pages seulement):
```javascript
window.generateStaticSitemap()
window.downloadStaticSitemap()
```

### Solution Permanente
1. Déployer le serveur Supabase
2. Vérifier que les routes fonctionnent:
   - `/make-server-04919ac5/blog`
   - `/make-server-04919ac5/projects`
   - `/make-server-04919ac5/case-studies`

---

## ❌ Le sitemap se télécharge mais contient des erreurs

### Vérifications
1. **Format XML valide?**
   - Le fichier doit commencer par `<?xml version="1.0" encoding="UTF-8"?>`
   - Ouvrir dans navigateur pour vérifier

2. **URLs correctes?**
   - En dev: `http://localhost:5173/`
   - En prod: `https://maxenss.com/`

3. **Balises hreflang présentes?**
   - Chercher `xhtml:link` dans le fichier
   - Doit avoir FR, EN, et x-default pour chaque page

### Génération manuelle
Si le téléchargement automatique échoue:
```javascript
// 1. Générer et copier
const xml = await window.generateSitemap();
console.log(xml);

// 2. Copier le contenu de la console
// 3. Créer manuellement /public/sitemap.xml
// 4. Coller le contenu
```

---

## ❌ Le sitemap est vide ou incomplet

### Vérifications

1. **Pages statiques présentes?**
   ```javascript
   window.generateStaticSitemap()
   ```
   Devrait afficher toutes les pages principales.

2. **Serveur accessible?**
   ```javascript
   // Tester manuellement
   fetch('https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/blog')
     .then(r => r.json())
     .then(console.log)
   ```

3. **Console errors?**
   Vérifier s'il y a des erreurs rouges dans la console.

---

## ✅ Tout Fonctionne - Checklist de Validation

```javascript
// 1. Aide disponible
window.sitemapHelp()
// ✅ Affiche le menu d'aide

// 2. Génération fonctionne
window.generateSitemap()
// ✅ Affiche aperçu XML

// 3. Téléchargement fonctionne
window.downloadSitemap()
// ✅ Télécharge sitemap.xml

// 4. Contenu valide
// ✅ Commence par <?xml
// ✅ Contient des URLs
// ✅ A des balises hreflang
```

---

## 🆘 Problème Non Résolu?

### 1. Vérifier les Messages de Démarrage
Au chargement de la page, vous devriez voir:
```
🗺️ Sitemap utilities loaded!
💡 Type window.sitemapHelp() for available commands
```

### 2. Vérifier les Imports
Dans `/App.tsx`, ces lignes doivent être présentes:
```typescript
import "./utils/seo/sitemapHelpers";
import "./utils/seo/sitemapGenerator";
import "./utils/seo/generateStaticSitemap";
```

### 3. Vérifier les Fichiers
Ces fichiers doivent exister:
- `/utils/seo/sitemapHelpers.ts`
- `/utils/seo/sitemapGenerator.ts`
- `/utils/seo/generateStaticSitemap.ts`
- `/utils/routing/urlHelpers.ts`

### 4. Test Manuel Direct
Copier ce code dans la console:
```javascript
fetch(window.location.origin)
  .then(() => console.log('✅ Serveur local accessible'))
  .catch(e => console.error('❌ Erreur:', e))
```

---

## 📖 Ressources

### Guides Principaux
- **Démarrage Rapide**: `/SITEMAP_READY.md`
- **Commandes**: `/SEO_COMMANDES_CONSOLE.md`
- **Quick Start**: `/SEO_QUICK_START.md`

### Dépannage
- **Import.meta Fix**: `/SITEMAP_IMPORT_META_FIX.md`
- **Erreurs Générales**: `/SEO_ERREUR_SITEMAP_FIX.md`
- **Fix Complet**: `/SEO_FIX_COMPLET.md`

### Avancé
- **Guide Complet**: `/SEO_MULTILINGUE_GUIDE.md`

---

## 🔧 Dernière Solution: Reset Complet

Si vraiment rien ne fonctionne:

1. **Hard Refresh**
   ```
   Ctrl+Shift+R (Windows/Linux)
   Cmd+Shift+R (Mac)
   ```

2. **Vider le Cache**
   - DevTools → Application → Clear storage → Clear site data

3. **Redémarrer le Serveur Dev**
   ```bash
   # Arrêter le serveur (Ctrl+C)
   # Relancer
   npm run dev
   ```

4. **Dernier Recours: Génération Manuelle**
   Voir le code source de `/utils/seo/generateStaticSitemap.ts` et exécuter manuellement.

---

**En général, un simple rechargement de page suffit ! 🔄**
