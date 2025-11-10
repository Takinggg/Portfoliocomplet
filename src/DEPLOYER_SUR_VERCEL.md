# 🚀 Déployer les URLs Bilingues sur Vercel

## 🎯 Ce qui a été fait

✅ Les routes dans le code sont maintenant bilingues :
- `/fr` → Page d'accueil français
- `/en` → Homepage anglais
- `/fr/blog` → Blog français
- `/en/blog` → Blog anglais
- etc.

✅ Les composants de routing sont en place :
- `LanguageRouteSync` - Synchronise la langue avec l'URL
- `LegacyRouteRedirect` - Redirige les anciennes URLs

## ⚠️ Ce qu'il faut faire MAINTENANT

Les changements sont **dans le code** mais **pas encore en production**.

### Étape 1 : Commit et Push

```bash
git add .
git commit -m "feat: URLs bilingues avec préfixes /fr/ et /en/"
git push origin main
```

### Étape 2 : Vercel va redéployer automatiquement

Si Vercel est connecté à ton repo Git, il va **automatiquement** :
1. Détecter le push
2. Lancer un nouveau build
3. Déployer la nouvelle version

**Attends 2-5 minutes** pour que le déploiement se termine.

### Étape 3 : CRUCIAL - Configure les redirections 301

Une fois déployé, tu DOIS ajouter des redirections pour le SEO.

#### Dans Vercel Dashboard :

1. Va sur ton projet Vercel
2. Settings → Redirects
3. Ajoute ces redirections (ou crée un fichier `vercel.json`)

#### Ou crée `/vercel.json` :

```json
{
  "redirects": [
    {
      "source": "/blog",
      "destination": "/fr/blog",
      "permanent": true
    },
    {
      "source": "/blog/:slug",
      "destination": "/fr/blog/:slug",
      "permanent": true
    },
    {
      "source": "/services",
      "destination": "/fr/services",
      "permanent": true
    },
    {
      "source": "/projects",
      "destination": "/fr/projects",
      "permanent": true
    },
    {
      "source": "/projects/:id",
      "destination": "/fr/projects/:id",
      "permanent": true
    },
    {
      "source": "/contact",
      "destination": "/fr/contact",
      "permanent": true
    },
    {
      "source": "/about",
      "destination": "/fr/about",
      "permanent": true
    },
    {
      "source": "/booking",
      "destination": "/fr/booking",
      "permanent": true
    },
    {
      "source": "/case-studies",
      "destination": "/fr/case-studies",
      "permanent": true
    },
    {
      "source": "/case-studies/:id",
      "destination": "/fr/case-studies/:id",
      "permanent": true
    },
    {
      "source": "/faq",
      "destination": "/fr/faq",
      "permanent": true
    },
    {
      "source": "/resources",
      "destination": "/fr/resources",
      "permanent": true
    },
    {
      "source": "/testimonials",
      "destination": "/fr/testimonials",
      "permanent": true
    }
  ]
}
```

---

## ✅ Vérification Post-Déploiement

Après le déploiement, vérifie :

### 1. URLs directes
- ✅ `maxence.design` → Redirige vers `/fr`
- ✅ `maxence.design/fr` → Accueil français
- ✅ `maxence.design/en` → Homepage anglais

### 2. Navigation
- ✅ Clique sur "Blog" → URL devient `/fr/blog`
- ✅ Change de langue EN → URL devient `/en/blog`
- ✅ Retour FR → URL devient `/fr/blog`

### 3. Anciennes URLs (redirections 301)
- ✅ `maxence.design/blog` → Redirige vers `/fr/blog`
- ✅ `maxence.design/services` → Redirige vers `/fr/services`

### 4. Console
Ouvre la console (F12) et vérifie qu'il n'y a pas d'erreurs.

---

## 📊 Toutes les nouvelles URLs

### Pages en Français (`/fr/`)
- `/fr` - Accueil
- `/fr/blog` - Blog
- `/fr/blog/:slug` - Article
- `/fr/projects` - Projets
- `/fr/projects/:id` - Détail projet
- `/fr/services` - Services
- `/fr/contact` - Contact
- `/fr/booking` - Réservation
- `/fr/about` - À propos
- `/fr/case-studies` - Études de cas
- `/fr/case-studies/:id` - Détail étude de cas
- `/fr/faq` - FAQ
- `/fr/resources` - Ressources
- `/fr/testimonials` - Témoignages

### Pages en Anglais (`/en/`)
- `/en` - Home
- `/en/blog` - Blog
- `/en/blog/:slug` - Post
- `/en/projects` - Projects
- `/en/projects/:id` - Project detail
- `/en/services` - Services
- `/en/contact` - Contact
- `/en/booking` - Booking
- `/en/about` - About
- `/en/case-studies` - Case studies
- `/en/case-studies/:id` - Case study detail
- `/en/faq` - FAQ
- `/en/resources` - Resources
- `/en/testimonials` - Testimonials

### Routes Spéciales (sans préfixe)
- `/dashboard` - Dashboard admin
- `/login` - Connexion

---

## 🔍 Problèmes Courants

### "Je vois toujours les anciennes URLs"

**Cause** : Cache du navigateur ou CDN Vercel  
**Solution** :
1. Vide le cache : `Ctrl+Shift+R` (Win) ou `Cmd+Shift+R` (Mac)
2. Ou navigation privée
3. Attends 5-10 minutes (purge du cache CDN)

### "Les redirections 301 ne fonctionnent pas"

**Cause** : `vercel.json` pas commité ou mal configuré  
**Solution** :
1. Vérifie que `vercel.json` existe à la racine
2. Commit et push
3. Redéploie

### "Erreur 404 sur certaines pages"

**Cause** : Routes manquantes ou mal configurées  
**Solution** :
1. Vérifie dans `AppWithRouter.tsx` que toutes les routes existent
2. Console (F12) → Regarde les erreurs
3. Partage l'erreur complète

---

## 📱 SEO et Google

### Important !

Les redirections 301 sont **CRUCIALES** :
- ✅ Google suit les redirections et met à jour ses liens
- ❌ Sans redirections, Google perd tes anciennes URLs et ton SEO chute

### Google Search Console

Après déploiement :
1. Va sur [Google Search Console](https://search.google.com/search-console)
2. Propriété → Couverture
3. Vérifie que Google découvre les nouvelles URLs
4. Les anciennes URLs doivent apparaître comme "Redirigées"

---

## 🎯 Checklist Finale

Avant de déployer :
- [ ] Commit tous les changements
- [ ] Push vers le repo Git
- [ ] Créé `vercel.json` avec les redirections 301
- [ ] Vérifié que Vercel est connecté au repo

Après déploiement :
- [ ] Attendu 5 minutes pour que le build se termine
- [ ] Testé `maxence.design` → Doit rediriger vers `/fr`
- [ ] Testé `/blog` → Doit rediriger vers `/fr/blog`
- [ ] Testé le changement de langue FR ↔ EN
- [ ] Vérifié la console (F12) pour les erreurs
- [ ] Vidé le cache (`Ctrl+Shift+R`)

---

## 🚨 URGENT - Fais ça MAINTENANT

**Étape 1** : Crée le fichier `/vercel.json` avec les redirections (voir ci-dessus)

**Étape 2** : Commit et push :
```bash
git add vercel.json
git commit -m "feat: URLs bilingues + redirections 301"
git push origin main
```

**Étape 3** : Va sur Vercel, attends le déploiement (2-5 min)

**Étape 4** : Teste `maxence.design` et vérifie que l'URL devient `/fr`

---

**Une fois déployé, les URLs bilingues seront LIVE sur maxence.design !** 🎉
