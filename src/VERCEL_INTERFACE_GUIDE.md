# 🎯 GUIDE VERCEL INTERFACE (Sans CLI)

## ✅ Bonne Nouvelle !

Le fichier `vercel.json` a déjà été modifié avec les routes nécessaires.

**TU N'AS PAS BESOIN de créer le fichier `_redirects`** (c'est uniquement pour Netlify).

---

## 🚀 Option 1 : Redéploiement Automatique (RECOMMANDÉ)

Si tu as connecté Vercel à ton repo GitHub/GitLab :

### Étape 1 : Va sur GitHub/GitLab

1. Ouvre ton repo sur GitHub ou GitLab
2. Va dans le fichier `/vercel.json`
3. Clique sur "Edit" (icône crayon)

### Étape 2 : Vérifie le Contenu

Le fichier devrait contenir ceci au début :

```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "rewrites": [
    ...
  ]
}
```

### Étape 3 : Si les "routes" ne sont PAS là

Remplace tout le fichier par ceci :

```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
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
  ],
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
  ],
  "cleanUrls": true,
  "trailingSlash": false
}
```

### Étape 4 : Commit

1. Scroll tout en bas
2. Écris un message de commit : `fix: Add catch-all route for 404`
3. Clique sur "Commit changes"

### Étape 5 : Vercel Redéploie Automatiquement

Vercel détecte le commit et redéploie automatiquement (2-3 min).

---

## 🔧 Option 2 : Redéploiement Manuel (Si pas connecté à Git)

### Étape 1 : Va sur Vercel Dashboard

1. Va sur https://vercel.com
2. Clique sur ton projet "maxence-design" (ou le nom de ton projet)

### Étape 2 : Redéploiement

1. Clique sur l'onglet "Deployments"
2. Trouve le dernier déploiement réussi
3. Clique sur les 3 points (...) à droite
4. Clique sur "Redeploy"
5. Confirme le redéploiement

### Étape 3 : Attends

Le redéploiement prend 2-3 minutes.

---

## 🔍 Option 3 : Vérifier le vercel.json Actuel

### Via l'interface Vercel :

1. Va sur ton projet Vercel
2. Clique sur "Settings"
3. Scroll vers "Git"
4. Tu devrais voir le lien vers ton repo
5. Clique dessus pour ouvrir GitHub/GitLab
6. Vérifie que `/vercel.json` contient les "routes"

---

## 🧪 Après le Redéploiement : Tests

### Test 1 : URL Racine
```
https://www.maxence.design/
```
✅ Devrait rediriger vers `/fr` ou `/en`

### Test 2 : URLs avec Langue
```
https://www.maxence.design/fr
https://www.maxence.design/en
```
✅ Devraient afficher la HomePage

### Test 3 : Actualisation (F5)
1. Va sur n'importe quelle page
2. Appuie sur **F5**
3. ✅ Plus de 404 !

### Test 4 : URLs Directes
```
https://www.maxence.design/fr/services
https://www.maxence.design/en/about
```
✅ Devraient fonctionner immédiatement

---

## ⚠️ Si Ça Ne Marche Toujours Pas

### Vérification 1 : Logs Vercel

1. Va sur ton projet Vercel
2. Clique sur l'onglet "Deployments"
3. Clique sur le dernier déploiement
4. Vérifie les logs pour des erreurs

### Vérification 2 : Configuration Build

1. Va dans "Settings"
2. Scroll vers "Build & Development Settings"
3. Vérifie que :
   - **Framework Preset** : `Vite` ou `Other`
   - **Build Command** : `npm run build` ou `vite build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install`

### Vérification 3 : Variables d'Environnement

1. Va dans "Settings" → "Environment Variables"
2. Vérifie que toutes les variables Supabase sont bien définies :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_DB_URL`
   - `FRONTEND_URL`

---

## 📱 Alternative : Utiliser GitHub Codespaces (Sans CLI Local)

Si tu ne veux pas utiliser Git en ligne de commande sur ton ordinateur :

### Option A : GitHub Web Editor

1. Va sur ton repo GitHub
2. Appuie sur `.` (point) sur ton clavier
3. Ça ouvre l'éditeur VS Code dans le navigateur
4. Édite `/vercel.json`
5. Commit via l'interface visuelle (icône de branche à gauche)

### Option B : Télécharger et Re-upload

1. Télécharge ton projet depuis GitHub (bouton "Code" → "Download ZIP")
2. Extrais le ZIP
3. Édite `/vercel.json` avec un éditeur de texte
4. Crée un nouveau repo ou pousse les changements
5. Vercel redéploie automatiquement

---

## 🎯 Résumé des Actions

### Action Immédiate

1. **Va sur GitHub/GitLab** → Ouvre `/vercel.json`
2. **Vérifie que les "routes" sont présentes** (voir code ci-dessus)
3. **Si pas présentes** → Édite le fichier et commit
4. **Attends 2-3 min** → Vercel redéploie automatiquement
5. **Teste** → `https://www.maxence.design/fr`

---

## ✅ Pourquoi Ça Va Marcher

Le `vercel.json` avec les **routes** dit à Vercel :

> "Pour TOUTES les URLs (y compris les 404), renvoie `index.html` avec code HTTP 200"

Ensuite, React Router (dans ton app) :

1. Lit l'URL dans le navigateur
2. Affiche la page correspondante
3. Ou redirige vers la homepage si la route n'existe pas

**C'est une configuration SPA (Single Page Application) standard.**

---

## 🔥 Plus Simple Encore

Si tu as accès à l'éditeur GitHub web :

1. Va sur https://github.com/TON_USERNAME/TON_REPO
2. Appuie sur `.` (point) sur ton clavier
3. Édite `/vercel.json`
4. Ctrl+S pour sauvegarder
5. Commit via l'icône de branche à gauche
6. Vercel redéploie automatiquement

**Pas besoin de terminal ! 🎉**

---

## 📞 Besoin d'Aide ?

Dis-moi :

1. ✅ As-tu accès à GitHub/GitLab ?
2. ✅ Le vercel.json contient-il les "routes" ?
3. ✅ As-tu réussi à commit un changement ?
4. ✅ Vercel a-t-il redéployé ?

Et je t'aiderai à diagnostiquer ! 🚀
