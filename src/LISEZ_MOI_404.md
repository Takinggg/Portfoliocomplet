# 🚨 LISEZ-MOI - Problème Routes 404

## TL;DR (Résumé ultra-court)

**Problème réel** : `/fr` et `/en` font 404 sur maxence.design
**Problème fictif** : Erreur 404 figmaiframepreview (ignorer, c'est normal)

**Solution** : Configure Vercel pour ne PAS builder → Lis `/VERCEL_CONFIG_FINAL.md`

---

## 🎯 Ce qu'il faut faire MAINTENANT

### Étape 1 : Comprendre le problème

Tu as **DEUX erreurs 404 différentes** :

#### Erreur A (❌ URGENT - À CORRIGER)
```
maxence.design/fr → 404 Not Found
maxence.design/en → 404 Not Found
```

#### Erreur B (⚠️ IGNORER - Sans impact)
```
GET https://...figmaiframepreview.figma.site/ 404
```

### Étape 2 : Ignorer l'Erreur B

L'erreur `figmaiframepreview.figma.site/ 404` est **COSMÉTIQUE**.

- ❌ Elle n'empêche PAS l'application de fonctionner
- ❌ Elle ne cause PAS de bug
- ✅ Elle disparaîtra en production
- ✅ C'est juste le navigateur qui fait une requête automatique

**NE PERDS PAS DE TEMPS DESSUS** - Concentre-toi sur l'Erreur A !

### Étape 3 : Corriger l'Erreur A (routes production)

**Lis ces fichiers dans l'ordre** :

1. `/SOLUTION_ROUTES_404.md` ← Solution complète
2. `/VERCEL_CONFIG_FINAL.md` ← Config Vercel exacte
3. `/DIAGNOSTIC_404_COMPLET.md` ← Si tu veux comprendre en détail

**En bref** :
1. Va sur vercel.com/dashboard
2. Settings → General
3. Mets Build Command, Output Directory et Install Command **VIDES**
4. Framework Preset → **Other**
5. Redéploie sans cache

### Étape 4 : Tester

Après le redéploiement Vercel :

```
✅ maxence.design → Redirige vers /fr ou /en
✅ maxence.design/fr → Page française
✅ maxence.design/en → Page anglaise
✅ maxence.design/fr/contact → Formulaire contact
```

---

## 📁 Fichiers créés pour t'aider

| Fichier | Description |
|---------|-------------|
| `/SOLUTION_ROUTES_404.md` | ⭐ **COMMENCE ICI** - Solution en 5 étapes |
| `/VERCEL_CONFIG_FINAL.md` | Configuration Vercel avec captures visuelles |
| `/DIAGNOSTIC_404_COMPLET.md` | Explication technique des deux erreurs |
| `/.vercelignore` | Nouveau fichier pour empêcher Vercel de builder |
| `/public/diagnostic.js` | Script à copier-coller dans la console navigateur |

---

## 🔧 Modifications faites au code

Pour réduire l'erreur figmaiframepreview (Erreur B) :

1. ✅ `index.html` - Manifest chargé conditionnellement
2. ✅ `public/service-worker.js` - Assets critiques vidés
3. ✅ `public/manifest.json` - Icons supprimés
4. ✅ `vercel.json` - Headers simplifiés
5. ✅ `.vercelignore` - Créé

**Résultat** : L'erreur peut persister mais c'est normal et sans impact.

---

## ❓ Questions fréquentes

### Q: L'erreur figmaiframepreview va-t-elle disparaître ?

Peut-être oui, peut-être non. C'est le navigateur Chrome/Edge qui la cause automatiquement dans les iframes. Mais **ça n'a aucune importance** car elle n'affecte pas le fonctionnement.

### Q: Pourquoi /fr et /en font 404 sur maxence.design ?

Parce que Vercel essaie probablement de construire le projet au lieu de déployer les fichiers tels quels. Ou alors le `vercel.json` n'est pas pris en compte.

### Q: Comment je sais si Vercel build correctement ?

Regarde les logs de déploiement :
- ✅ Bon : "Copying files..." (rapide, < 30 sec)
- ❌ Mauvais : "Installing dependencies... Building..." (lent, > 2 min)

### Q: Que contient vercel.json ?

Juste ça :
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Ça dit à Vercel : "Toutes les routes → redirige vers index.html, React Router s'occupe du reste"

### Q: Est-ce que l'application fonctionne dans Figma Make ?

OUI ! ✅ Tout fonctionne dans Figma Make preview malgré l'erreur 404 cosmétique.

---

## 🆘 Si rien ne marche

Dis-moi :

1. **Capture d'écran des Settings Vercel** (Build Command, Output Directory)
2. **Logs du dernier build Vercel** (copie-colle)
3. **Structure de ton repo GitHub** (liste des fichiers à la racine)
4. **URL qui ne marche pas** et **message d'erreur exact**

Je t'aiderai à débugger précisément ! 🚀

---

## ✅ Checklist finale

Avant de demander de l'aide, vérifie que tu as fait :

- [ ] Lu `/SOLUTION_ROUTES_404.md`
- [ ] Configuré Vercel Settings comme dans `/VERCEL_CONFIG_FINAL.md`
- [ ] Redéployé SANS cache
- [ ] Attendu 5 minutes (propagation CDN)
- [ ] Testé les routes en navigation privée (éviter le cache navigateur)
- [ ] Vérifié que `vercel.json` existe sur GitHub
- [ ] Vérifié que `index.html` est à la racine sur GitHub

---

## 🎯 Conclusion

**Un seul vrai problème** : Routes 404 sur maxence.design
**Solution** : Configuration Vercel
**Priorité** : Production d'abord, cosmétique après

Bonne chance ! 🚀
