# ⚡ POURQUOI HashRouter ?

**TL;DR : Figma Make ne permet pas de configurer le serveur. HashRouter est la SEULE solution qui fonctionne.**

---

## 🎯 Le Problème

Quand tu actualises `maxence.design/en`, tu obtiens une **erreur 404**.

### Pourquoi ?

**Avec BrowserRouter :**
```
1. Tu visites maxence.design
2. Le serveur envoie index.html
3. React Router affiche /en
4. ✅ Ça marche !

5. Tu actualises la page (F5)
6. Le navigateur demande maxence.design/en au SERVEUR
7. Le serveur cherche un fichier /en
8. ❌ 404 - Le fichier n'existe pas !
```

**Le serveur doit être configuré pour répondre avec `index.html` pour TOUTES les routes.**

### Configurations Serveur Nécessaires

**Vercel (`vercel.json`) :**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify (`_redirects`) :**
```
/*    /index.html   200
```

**Apache (`.htaccess`) :**
```
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

---

## ⚠️ Problème avec Figma Make

**Figma Make ne permet PAS de configurer le serveur.**

Tu ne peux pas :
- ❌ Créer un `vercel.json`
- ❌ Créer un `_redirects`
- ❌ Modifier la config serveur
- ❌ Ajouter des rewrites

**Résultat :** BrowserRouter ne peut PAS fonctionner sur Figma Make.

---

## ✅ Solution : HashRouter

### Comment ça marche ?

**Avec HashRouter :**
```
URLs : maxence.design/#/fr
       maxence.design/#/en
       
1. Tu visites maxence.design
2. Le serveur envoie index.html
3. React Router lit le hash (#/fr)
4. Affiche la page FR
5. ✅ Ça marche !

6. Tu actualises la page (F5)
7. Le navigateur demande maxence.design au SERVEUR
   (Le #/fr est ignoré par le serveur !)
8. Le serveur envoie index.html
9. React Router lit le hash (#/fr)
10. Affiche la page FR
11. ✅ Ça marche toujours !
```

### Pourquoi ça fonctionne ?

**Le `#` (hash) n'est JAMAIS envoyé au serveur.**

```
URL complète : maxence.design/#/fr/projects

Ce que le serveur voit : maxence.design/
Ce que React voit : #/fr/projects
```

Le navigateur demande TOUJOURS `maxence.design/` (la racine), donc le serveur répond TOUJOURS avec `index.html`, peu importe la route.

---

## 📊 Comparaison

| Feature | BrowserRouter | HashRouter |
|---------|--------------|------------|
| URLs propres (`/fr`) | ✅ | ❌ (`/#/fr`) |
| Fonctionne sans config serveur | ❌ | ✅ |
| SEO friendly | ✅ | ⚠️ Limité |
| Refresh de page | ❌ (404 sans config) | ✅ |
| Compatible Figma Make | ❌ | ✅ |
| Compatible Vercel/Netlify | ✅ (avec config) | ✅ |

---

## 🎯 Quand Utiliser Quoi ?

### Utilise **BrowserRouter** si :
- ✅ Tu déploies sur Vercel/Netlify/serveur que tu contrôles
- ✅ Tu peux ajouter un `vercel.json` ou `_redirects`
- ✅ Le SEO est critique
- ✅ Tu veux des URLs propres sans `#`

### Utilise **HashRouter** si :
- ✅ Tu déploies sur Figma Make
- ✅ Tu n'as pas accès à la config serveur
- ✅ Tu veux que ça "juste marche" sans config
- ✅ Le `#` ne te dérange pas

---

## 🔄 Migration vers BrowserRouter (plus tard)

Si tu déploies ailleurs plus tard, tu peux facilement migrer :

### 1. Change le Router dans `App.tsx`

```typescript
// Avant (HashRouter)
import { HashRouter } from "react-router-dom";

export default function App() {
  return <HashRouter>...</HashRouter>;
}

// Après (BrowserRouter)
import { BrowserRouter } from "react-router-dom";

export default function App() {
  return <BrowserRouter>...</BrowserRouter>;
}
```

### 2. Ajoute la Config Serveur

**Vercel :**
```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify :**
```
// _redirects
/*    /index.html   200
```

### 3. Déploie

C'est tout ! Les routes changeront automatiquement :
- `/#/fr` → `/fr`
- `/#/en` → `/en`

---

## 🌐 Impact SEO du HashRouter

### ⚠️ Limitations

Google et les autres moteurs de recherche :
- ⚠️ Ignorent généralement le contenu après le `#`
- ⚠️ Considèrent `maxence.design/#/fr` et `maxence.design/#/en` comme la même page
- ⚠️ Ne peuvent pas indexer les sous-pages séparément

### ✅ Solutions

**Option 1 : Utilise le mode SSR (Server-Side Rendering)**
→ Nécessite Next.js ou un serveur Node

**Option 2 : Génère un sitemap statique**
→ Liste toutes tes pages explicitement

**Option 3 : Migre vers BrowserRouter sur un vrai serveur**
→ Déploie sur Vercel/Netlify avec config

**Option 4 : Accepte les limitations**
→ Pour un portfolio personnel, c'est souvent OK

---

## 🎯 Recommandation

**Pour Figma Make : Utilise HashRouter**

C'est la seule solution qui fonctionne sans config serveur.

**Pour production finale : Migre vers BrowserRouter**

Quand tu es prêt à déployer sérieusement :
1. Déploie sur Vercel (gratuit)
2. Passe à BrowserRouter
3. Ajoute `vercel.json`
4. Profite des URLs propres + SEO

---

## ✅ Checklist

- [x] HashRouter activé dans `App.tsx`
- [x] URLs utilisent le `#` : `/#/fr` et `/#/en`
- [x] Refresh de page fonctionne ✅
- [x] Navigation fonctionne ✅
- [x] Pas d'erreur 404 ✅
- [ ] Migrer vers BrowserRouter quand tu déploies ailleurs

---

**Conclusion : HashRouter est la bonne solution pour Figma Make. C'est pas parfait pour le SEO, mais c'est la seule option qui fonctionne sans config serveur. 🚀**
