# ❌ Erreur: window.generateSitemap is not a function

## 🔧 Solution Rapide

### Étape 1: Recharger la page
```
Ctrl+R (Windows/Linux) ou Cmd+R (Mac)
```
Les utilitaires mettent 1-2 secondes à se charger.

### Étape 2: Vérifier que les utilitaires sont chargés
```javascript
// Dans la console
window.sitemapHelp()
```

Si ça fonctionne ✅, les utilitaires sont chargés !

---

## ✅ Commandes Disponibles (après chargement)

### 🆘 Aide
```javascript
window.sitemapHelp()
```

### 📄 Générer et voir aperçu
```javascript
window.generateSitemap()          // Sitemap complet
window.generateStaticSitemap()    // Pages statiques seulement
```

### 📥 Télécharger
```javascript
window.downloadSitemap()          // Sitemap complet
window.downloadStaticSitemap()    // Pages statiques seulement
```

---

## 🔍 Diagnostic

### Problème: Erreur "is not a function"

**Causes possibles:**

1. **Utilitaires pas encore chargés**
   - ✅ **Solution**: Attendre 2-3 secondes après le chargement de la page
   - ✅ **Solution**: Recharger la page

2. **Erreur d'import**
   - ✅ **Vérifier**: `/App.tsx` contient:
     ```typescript
     import "./utils/seo/sitemapHelpers";
     ```

3. **Console cachée ou filtrée**
   - ✅ **Solution**: Vérifier que "All levels" est sélectionné dans la console
   - ✅ **Solution**: Décocher les filtres Warning/Error

---

## 🚀 Alternative: Route visuelle

Si les commandes console ne fonctionnent pas, vous pouvez utiliser la route visuelle:

### Option 1: Via le code
Ajouter dans `App.tsx` (dans le switch de navigation):
```typescript
case 'sitemap':
  return <SitemapRoute />;
```

### Option 2: Navigation directe
Modifier temporairement la navigation pour aller sur une page qui appelle `SitemapRoute`.

---

## 🛠️ Méthode Manuelle (Last Resort)

Si rien ne fonctionne, générer manuellement:

### 1. Copier le code
Ouvrir `/utils/seo/generateStaticSitemap.ts` et copier la fonction.

### 2. Dans la console
```javascript
// Coller toute la fonction generateStaticSitemap() ici
// Puis exécuter:
const xml = generateStaticSitemap();
console.log(xml);

// Copier le résultat dans un fichier sitemap.xml
```

### 3. Créer le fichier
- Créer `/public/sitemap.xml`
- Coller le contenu XML
- Déployer

---

## ✅ Vérification Post-Fix

Après avoir résolu le problème, vérifier:

```javascript
// Ces commandes doivent toutes fonctionner:
window.sitemapHelp()           // ✅ Affiche l'aide
window.generateSitemap()       // ✅ Montre aperçu
window.downloadSitemap()       // ✅ Télécharge fichier
```

---

## 📖 Ressources

- **Guide Rapide**: `/SEO_QUICK_START.md`
- **Guide Complet**: `/SEO_MULTILINGUE_GUIDE.md`
- **Commandes Console**: `/SEO_COMMANDES_CONSOLE.md`

---

## 🆘 Toujours bloqué?

Si après tout ça, ça ne fonctionne toujours pas:

1. **Vérifier les erreurs dans la console**
   - Y a-t-il des erreurs rouges?
   - Copier le message d'erreur complet

2. **Vérifier l'import**
   ```bash
   # Vérifier que le fichier existe
   ls -la utils/seo/sitemapHelpers.ts
   
   # Vérifier qu'il est importé dans App.tsx
   grep "sitemapHelpers" App.tsx
   ```

3. **Dernière option: Utiliser downloadSitemap() directement**
   ```javascript
   // Cette fonction devrait toujours être disponible via sitemapGenerator.ts
   downloadSitemap()
   ```

---

**Note**: Les fonctions ont été corrigées et exposées correctement. Si vous voyez toujours l'erreur, c'est probablement un timing de chargement. Attendez 2-3 secondes et réessayez.
