# 🚨 SOLUTION URGENTE - Routes /fr et /en qui font 404

## Problème
Les URLs `maxence.design/fr` et `maxence.design/en` font 404 en production sur Vercel.

## Cause
Vercel essaie peut-être de construire lui-même le projet au lieu d'utiliser le build de Figma Make, OU le fichier `vercel.json` n'est pas pris en compte.

## ✅ SOLUTION EN 5 ÉTAPES

### Étape 1 : Vérifier les Settings Vercel

Va sur **vercel.com/dashboard** → Ton projet → **Settings** → **General**

Configure exactement comme ceci :

```
Framework Preset: Other
Build Command: (VIDE - laisse le champ vide)
Output Directory: (VIDE - laisse le champ vide)  
Install Command: (VIDE - laisse le champ vide)
```

**IMPORTANT** : Ne mets RIEN dans ces champs. Vercel doit déployer les fichiers tels quels depuis GitHub.

### Étape 2 : Vérifier que vercel.json est bien présent

Le fichier `vercel.json` DOIT contenir exactement :

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

✅ Ce fichier existe déjà dans ton projet.

### Étape 3 : Force un redéploiement sans cache

Dans Vercel Dashboard :
1. Va dans **Deployments**
2. Clique sur les **3 points** du dernier déploiement
3. Clique sur **"Redeploy"**
4. **COCHE** la case "Use existing Build Cache"
5. Clique sur **"Redeploy"**

### Étape 4 : Vérifier les logs de build

Après le redéploiement, regarde les logs :
- Il NE doit PAS y avoir de compilation Vite
- Il doit juste copier les fichiers depuis GitHub
- Ça doit être très rapide (moins de 30 secondes)

### Étape 5 : Test

Après le déploiement, teste :
- `maxence.design` → doit rediriger vers `/fr` ou `/en` automatiquement
- `maxence.design/fr` → doit afficher la page française ✅
- `maxence.design/en` → doit afficher la page anglaise ✅
- `maxence.design/fr/contact` → doit afficher le formulaire de contact français ✅

## 🔍 Diagnostic : Pourquoi ça ne marche pas ?

Si après ces étapes ça ne marche toujours pas, c'est que :

### Possibilité 1 : Figma Make ne pousse pas les fichiers buildés sur GitHub

**Solution** : 
- Vérifie que le dossier `/dist` ou les fichiers compilés sont bien présents sur GitHub
- Figma Make doit pousser les fichiers **compilés**, pas juste le code source
- Si ce n'est pas le cas, il faut configurer Figma Make pour pousser le build

### Possibilité 2 : Vercel ignore le vercel.json

**Solution** :
- Renomme temporairement `vercel.json` en `vercel.json.backup`
- Push sur GitHub
- Recrée un nouveau `vercel.json` avec juste les rewrites
- Push à nouveau

### Possibilité 3 : Il manque index.html à la racine

**Solution** :
- Vérifie que `index.html` est bien à la racine du repo GitHub
- Vérifie qu'il contient bien `<script type="module" src="/App.tsx"></script>`
- Si Figma Make compile vers `/dist`, alors index.html doit être dans `/dist`

## 🎯 Configuration Figma Make + GitHub + Vercel

Le workflow correct doit être :

```
Figma Make (compile) 
   ↓
GitHub (stocke les fichiers compilés)
   ↓
Vercel (déploie les fichiers tels quels, sans build)
   ↓
vercel.json (route tout vers index.html)
   ↓
React Router (gère /fr et /en)
```

## ⚠️ Note sur l'erreur 404 figmaiframepreview

L'erreur `GET https://...figmaiframepreview.figma.site/ 404` est **NORMALE** dans Figma Make preview.

C'est le navigateur qui essaie de faire un prefetch DNS ou de charger favicon/manifest.
Ça n'affecte PAS le fonctionnement de l'application.

Cette erreur disparaîtra en production sur ton vrai domaine.

## 📞 Si rien ne marche

Dis-moi :
1. Est-ce que les fichiers sur GitHub sont buildés (compilés) ou en source ?
2. Quels sont les logs de build Vercel ?
3. Est-ce que tu as bien vidé le cache et redéployé ?

Je t'aiderai à débugger plus précisément ! 🚀
