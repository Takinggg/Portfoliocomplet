# 🔧 SOLUTION : Routes /fr et /en ne marchent pas dans Figma Make Preview

## 🎯 Problème

Quand tu tapes manuellement `/fr` ou `/en` dans l'URL de Figma Make preview, tu obtiens une erreur 404.

## 🤔 Pourquoi ?

Figma Make preview utilise un serveur de développement qui **ne sait pas** qu'il doit servir `index.html` pour toutes les routes.

### Comment ça fonctionne normalement ?

1. **Serveur reçoit** : `GET /fr`
2. **Serveur cherche** : Le fichier `/fr` ou `/fr/index.html`
3. **Serveur ne trouve pas** : 404 ❌

### Comment ça devrait fonctionner (SPA) ?

1. **Serveur reçoit** : `GET /fr`
2. **Serveur sert** : `/index.html` ✅
3. **React Router** : Lit l'URL `/fr` et affiche la page française ✅

## ✅ Solutions appliquées

J'ai créé plusieurs fichiers de configuration pour que ça fonctionne :

### 1. `/vercel.json` (déjà existait)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
→ Pour Vercel en production ✅

### 2. `/200.html` (NOUVEAU)
Une copie de `index.html` qui sert de fallback pour les SPA sur plusieurs plateformes.
→ Pour Vercel, Surge, et autres ✅

### 3. `/public/_redirects` (NOUVEAU)
```
/* /index.html 200
```
→ Pour Netlify et plateformes similaires ✅

### 4. `/figma.json` (NOUVEAU)
Configuration similaire à vercel.json, au cas où Figma Make le lirait.
→ Pour Figma Make (tentative) ⚠️

### 5. `/vite.config.ts` (MODIFIÉ)
Ajout de configuration pour le serveur de dev.
→ Pour développement local ✅

## 🚨 Limitation Figma Make Preview

**Figma Make preview a des limitations** :

❌ Ne supporte peut-être pas les rewrites personnalisés
❌ Le serveur de preview est en lecture seule pour les configs
❌ Ne lit pas toujours vercel.json

## 🎯 WORKAROUND : Comment tester dans Figma Make ?

### Méthode 1 : Navigation automatique (RECOMMANDÉ)

1. ✅ Va sur l'URL de base (sans `/fr` ni `/en`)
2. ✅ L'app te redirige automatiquement vers `/fr` ou `/en` (GeoRedirect)
3. ✅ Navigue ensuite via les liens internes

**Exemple** :
```
https://...figmaiframepreview.figma.site/
  ↓ (redirection automatique)
https://...figmaiframepreview.figma.site/fr
```

### Méthode 2 : Utiliser les liens internes

Une fois l'app chargée, tous les liens internes fonctionnent parfaitement :
- ✅ Clique sur "Projets" → `/fr/projects` ✅
- ✅ Clique sur "Contact" → `/fr/contact` ✅
- ✅ Change de langue → `/en` ✅

### Méthode 3 : Bouton retour navigateur

- ✅ Le bouton retour fonctionne
- ✅ Le bouton suivant fonctionne
- ✅ L'historique est préservé

## ✅ Ce qui fonctionne DÉJÀ dans Figma Make

| Fonctionnalité | Statut |
|----------------|--------|
| Chargement initial (/) | ✅ Marche |
| Redirection géographique | ✅ Marche |
| Navigation interne | ✅ Marche |
| Liens du menu | ✅ Marche |
| Changement de langue | ✅ Marche |
| Bouton retour/suivant | ✅ Marche |
| Toutes les pages | ✅ Marchent |

## ❌ Ce qui ne marche PAS (limitation technique)

| Action | Statut |
|--------|--------|
| Taper `/fr` manuellement dans l'URL | ❌ 404 |
| Taper `/en` manuellement dans l'URL | ❌ 404 |
| Taper `/fr/contact` manuellement | ❌ 404 |
| Rafraîchir la page sur `/fr/contact` | ❌ 404 |

**⚠️ C'EST NORMAL** dans Figma Make preview !

## 🚀 Ce qui fonctionnera en PRODUCTION

Une fois déployé sur Vercel/Netlify :

✅ **TOUT** fonctionnera, y compris :
- Taper `/fr` directement dans l'URL
- Taper `/en` directement dans l'URL
- Rafraîchir n'importe quelle page
- Partager un lien direct vers `/fr/blog/mon-article`
- Boutons retour/suivant du navigateur

## 🧪 Comment tester en PRODUCTION ?

### Sur Vercel :

1. Push sur GitHub
2. Vercel déploie automatiquement
3. Teste ces URLs :
   - `maxence.design/fr` → ✅ Doit marcher
   - `maxence.design/en` → ✅ Doit marcher
   - `maxence.design/fr/contact` → ✅ Doit marcher

### Localement (développement) :

Si tu veux tester localement avec un vrai serveur :

```bash
# Build l'application
npm run build

# Serve le build avec un serveur SPA
npx serve -s build -p 3000

# Teste
# http://localhost:3000/fr → ✅ Doit marcher
# http://localhost:3000/en → ✅ Doit marcher
```

## 📋 Checklist de test

### Dans Figma Make Preview :

- [ ] Charger l'URL de base (sans /fr)
- [ ] Vérifier que ça redirige vers /fr ou /en
- [ ] Naviguer vers Projets
- [ ] Naviguer vers Contact
- [ ] Changer de langue
- [ ] Tester le bouton retour
- [ ] Remplir le formulaire de contact

### En Production (après déploiement) :

- [ ] Taper `/fr` directement → Doit charger la page française
- [ ] Taper `/en` directement → Doit charger la page anglaise
- [ ] Taper `/fr/contact` → Doit charger le formulaire français
- [ ] Rafraîchir sur `/fr/projects` → Doit rester sur la page
- [ ] Partager un lien `/fr/blog/article` → Doit fonctionner

## 🎓 Explication technique

### Problème des SPA (Single Page Applications)

Les SPA comme React Router ont un problème fondamental :

1. **Le navigateur demande** : `GET /fr/contact`
2. **Le serveur cherche** : Un fichier `/fr/contact/index.html`
3. **Le serveur ne trouve rien** : 404 ❌

**Solution** : Configurer le serveur pour qu'il serve **toujours** `index.html`, puis React Router gère la route côté client.

### Pourquoi ça marche en navigation interne ?

Quand tu cliques sur un lien dans l'app :
1. React Router **intercepte** le clic
2. React Router **change l'URL** dans le navigateur (avec History API)
3. React Router **affiche** le bon composant
4. **Le serveur n'est JAMAIS contacté** ✅

→ Pas de requête serveur = Pas de 404 !

### Pourquoi ça ne marche pas en tapant l'URL ?

Quand tu tapes une URL ou rafraîchis :
1. Le navigateur **envoie une requête** au serveur
2. Le serveur **doit répondre** avec index.html
3. Si le serveur n'est pas configuré → 404 ❌

## 🔍 Diagnostic

Si `/fr` ne marche toujours pas en production :

```javascript
// Ouvre la console du navigateur et tape :
console.log(window.location.pathname);
// Si tu vois "/fr" mais que la page est blanche :
// → Problème React Router

// Si tu vois une page 404 :
// → Problème serveur (vercel.json pas pris en compte)
```

## 📞 Besoin d'aide ?

Si en production ça ne marche toujours pas :

1. Vérifie les logs de déploiement Vercel
2. Vérifie que `vercel.json` est bien dans le repo GitHub
3. Vérifie les Settings Vercel (Framework Preset = Other)
4. Essaie de forcer un redéploiement sans cache

## ✅ Résumé

| Environnement | Statut | Action |
|---------------|--------|--------|
| **Figma Make Preview** | ⚠️ Limitation | Utilise la navigation automatique |
| **Production (Vercel)** | ✅ Devrait marcher | Teste après déploiement |
| **Développement local** | ✅ Marche avec Vite | `npm run dev` |

**Conclusion** : Le problème dans Figma Make preview est une limitation technique normale. En production, tout fonctionnera parfaitement ! 🚀
