# 🗺️ Commandes SEO & Sitemap - Console

## 📋 Toutes les commandes disponibles

### 🆘 Aide
```javascript
window.sitemapHelp()
```
Affiche la liste complète des commandes avec explications.

---

## 📄 Génération de sitemap

### 1. Aperçu dans la console
```javascript
window.generateSitemap()
```
- ✅ Génère le sitemap complet (pages + blog + projets + case studies)
- ✅ Affiche un aperçu dans la console (premiers 1000 caractères)
- ✅ Montre la taille totale du fichier
- ⚡ Utilise les données du serveur Supabase

**Utilisation recommandée**: Pour vérifier le contenu avant de télécharger

---

### 2. Aperçu sitemap statique (pages seulement)
```javascript
window.generateStaticSitemap()
```
- ✅ Génère uniquement les pages statiques (home, about, contact, etc.)
- ✅ Plus rapide (pas de requêtes serveur)
- ✅ Affiche un aperçu dans la console

**Utilisation recommandée**: Pour déploiement rapide sans contenu dynamique

---

## 📥 Téléchargement de sitemap

### 3. Télécharger sitemap complet
```javascript
window.downloadSitemap()
```
- ✅ Télécharge le fichier `sitemap.xml` complet
- ✅ Inclut: pages + blog + projets + case studies
- ✅ Toutes les URLs en FR et EN
- ✅ Balises hreflang pour chaque page

**Utilisation recommandée**: Pour production (sitemap le plus complet)

---

### 4. Télécharger sitemap statique
```javascript
window.downloadStaticSitemap()
```
- ✅ Télécharge le fichier `sitemap.xml` pages statiques
- ✅ Plus rapide à générer
- ✅ Idéal pour démarrer vite

**Utilisation recommandée**: Pour déploiement initial rapide

---

## 🎯 Workflow recommandé

### Première fois (Démarrage rapide)
```javascript
// 1. Voir les commandes disponibles
window.sitemapHelp()

// 2. Vérifier le contenu
window.generateSitemap()

// 3. Télécharger le fichier
window.downloadSitemap()
```

### Pour production
```javascript
// Télécharger directement le sitemap complet
window.downloadSitemap()

// ↓ Ensuite:
// 1. Placer le fichier dans /public/sitemap.xml
// 2. Vérifier robots.txt
// 3. Déployer
// 4. Soumettre à Google Search Console
```

---

## 📊 Contenu du sitemap

Le sitemap généré inclut:

### Pages statiques (FR + EN)
- `/` et `/en/` (Homepage)
- `/projects` et `/en/projects`
- `/services` et `/en/services`
- `/about` et `/en/about`
- `/contact` et `/en/contact`
- `/booking` et `/en/booking`
- `/blog` et `/en/blog`
- `/case-studies` et `/en/case-studies`
- `/faq` et `/en/faq`
- `/resources` et `/en/resources`
- `/testimonials` et `/en/testimonials`

### Pages dynamiques (FR + EN)
- Articles de blog: `/blog/{slug}` et `/en/blog/{slug}`
- Projets: `/projects/{id}` et `/en/projects/{id}`
- Case studies: `/case-studies/{id}` et `/en/case-studies/{id}`

### Métadonnées pour chaque URL
- `<loc>` - URL complète
- `<lastmod>` - Date de dernière modification
- `<changefreq>` - Fréquence de mise à jour
- `<priority>` - Priorité (0.0 à 1.0)
- `<xhtml:link>` - Balises hreflang FR/EN/x-default

---

## 🔧 Dépannage

### Erreur: "window.generateSitemap is not a function"
**Solutions:**
1. Attendre 2-3 secondes après le chargement de la page
2. Recharger la page (Ctrl+R ou Cmd+R)
3. Vérifier avec: `window.sitemapHelp()`
4. Vérifier que `/utils/seo/sitemapHelpers.ts` est bien importé dans `App.tsx`

### Le sitemap ne contient pas mes données
**Solutions:**
1. Vérifier que le serveur Supabase est déployé
2. Vérifier la console pour les erreurs de fetch
3. Utiliser `window.generateStaticSitemap()` en attendant
4. Consulter `/SEO_MULTILINGUE_GUIDE.md` pour le setup complet

### Le fichier ne se télécharge pas
**Solutions:**
1. Vérifier les paramètres du navigateur (autoriser téléchargements)
2. Essayer avec un navigateur différent
3. Copier le contenu depuis la console après `window.generateSitemap()`
4. Créer manuellement le fichier sitemap.xml

---

## 📖 Guides complets

- **Démarrage rapide**: `/SEO_QUICK_START.md`
- **Guide complet**: `/SEO_MULTILINGUE_GUIDE.md`
- **Architecture**: `/SEO_MULTILINGUE_GUIDE.md` (section Architecture)

---

## ✅ Prochaines étapes après téléchargement

1. **Placer le fichier**
   ```bash
   # Copier sitemap.xml dans le dossier public
   cp ~/Downloads/sitemap.xml /public/
   ```

2. **Vérifier robots.txt**
   - Ouvrir `/public/robots.txt`
   - Vérifier la ligne Sitemap
   ```
   Sitemap: https://VOTRE-DOMAINE.com/sitemap.xml
   ```

3. **Déployer**
   - Déployer normalement votre site
   - Vérifier que `/sitemap.xml` est accessible

4. **Soumettre à Google**
   - Google Search Console → Sitemaps
   - Ajouter: `https://VOTRE-DOMAINE.com/sitemap.xml`
   - Envoyer ✅

---

**Besoin d'aide?** Consulter `/SEO_MULTILINGUE_GUIDE.md` pour plus de détails.
