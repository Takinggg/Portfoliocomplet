# ⚙️ CONFIGURATION VERCEL FINALE

## 🎯 Objectif

Faire en sorte que Vercel déploie les fichiers de Figma Make **SANS LES COMPILER**.

## 📋 Configuration exacte

### Dans Vercel Dashboard → Settings → General

```
┌─────────────────────────────────────────┐
│ Framework Preset                        │
│ ┌─────────────────────────────────────┐ │
│ │ Other                               │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Build & Development Settings            │
│                                          │
│ Build Command (VIDE)                    │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │ ← Laisse vide !
│ └─────────────────────────────────────┘ │
│                                          │
│ Output Directory (VIDE)                 │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │ ← Laisse vide !
│ └─────────────────────────────────────┘ │
│                                          │
│ Install Command (VIDE)                  │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │ ← Laisse vide !
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 🔄 Forcer un redéploiement

1. Va dans **Deployments** (onglet)
2. Clique sur ton dernier déploiement
3. Clique sur les **3 points** (⋮) en haut à droite
4. Sélectionne **"Redeploy"**
5. **DÉCOCHE** "Use existing Build Cache"
6. Clique **"Redeploy"**

## ✅ Ce qui doit se passer

Quand Vercel déploie :

```
✅ Building...
   ↓
✅ Copying files from GitHub...
   ↓
✅ Deploying...
   ↓
✅ Done! (très rapide, < 30 sec)
```

## ❌ Ce qui NE doit PAS se passer

Si tu vois ça, c'est MAL configuré :

```
❌ Installing dependencies...
❌ Running `npm install`...
❌ Running build command `vite build`...
❌ Compiling...
```

## 📁 Structure attendue sur GitHub

Ton repo GitHub doit contenir :

```
/ (racine)
├── index.html          ← IMPORTANT : à la racine !
├── App.tsx
├── components/
├── utils/
├── styles/
├── public/
├── vercel.json         ← IMPORTANT : les rewrites !
└── .vercelignore       ← NOUVEAU : ignore les configs
```

## 🔍 Vérification rapide

Après déploiement, teste ces URLs :

1. `maxence.design` → Redirige vers /fr ou /en ✅
2. `maxence.design/fr` → Page française ✅
3. `maxence.design/en` → Page anglaise ✅
4. `maxence.design/fr/contact` → Formulaire français ✅
5. `maxence.design/en/contact` → Formulaire anglais ✅

## 🆘 Si ça ne marche toujours pas

### Problème : 404 sur /fr et /en

**Cause possible 1** : Vercel build quand même
- Vérifie les logs de déploiement
- S'il compile, les settings ne sont pas bons

**Cause possible 2** : index.html n'est pas à la racine
- Vérifie sur GitHub que index.html est bien à `/index.html`
- Pas dans `/dist` ou `/build`

**Cause possible 3** : vercel.json ignoré
- Vérifie que vercel.json existe bien
- Vérifie qu'il contient les rewrites
- Essaie de le supprimer et recréer

**Cause possible 4** : Cache Vercel
- Force un redéploiement SANS cache
- Attends 5 minutes (propagation DNS/CDN)

## 📞 Besoin d'aide ?

Envoie-moi :
1. Une capture d'écran des **Settings Vercel**
2. Les **logs du dernier build**
3. L'URL qui ne marche pas
4. Le message d'erreur exact

Je t'aiderai à débugger ! 🚀

## 🎯 Rappel important

L'erreur `figmaiframepreview.figma.site/ 404` est NORMALE et SANS IMPACT.
Ne perds pas de temps dessus, concentre-toi sur les vraies routes ! ✅
