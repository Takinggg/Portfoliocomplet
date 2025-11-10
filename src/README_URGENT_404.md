# 🚨 URGENT : Fix Erreurs 404

## 🎯 Objectif

Faire en sorte que **toutes les erreurs 404** renvoient vers **`https://www.maxence.design/`**

---

## ❌ Problème Actuel

Le fichier `/public/_redirects` est un **DOSSIER** avec des fichiers `.tsx` à l'intérieur.

**Vercel cherche un FICHIER TEXTE nommé `_redirects`** pour gérer les erreurs 404.

---

## ✅ Solution : 1 Commande à Exécuter

### Ouvre ton terminal et copie-colle ceci :

```bash
cd public && rm -rf _redirects && echo "/*    /index.html   200" > _redirects && cd .. && git add . && git commit -m "fix: Create _redirects file for 404 handling" && git push
```

### ⏰ Attends 2-3 Minutes

Vercel va automatiquement déployer les changements.

---

## 🧪 Tests Après Déploiement

### ✅ Test 1 : Homepage
- Va sur `https://www.maxence.design/`
- Tu es redirigé vers `/fr` ou `/en` selon ta localisation

### ✅ Test 2 : Pages en Français
- `https://www.maxence.design/fr` → HomePage français
- `https://www.maxence.design/fr/services` → Page Services
- `https://www.maxence.design/fr/projects` → Page Projects

### ✅ Test 3 : Pages en Anglais
- `https://www.maxence.design/en` → HomePage anglais
- `https://www.maxence.design/en/about` → Page About
- `https://www.maxence.design/en/contact` → Page Contact

### ✅ Test 4 : Actualisation (F5)
- Va sur n'importe quelle page
- Appuie sur **F5**
- ✅ La page se recharge normalement (plus de 404 !)

### ✅ Test 5 : Page Inexistante
- Va sur `https://www.maxence.design/page-qui-nexiste-pas`
- ✅ Tu es redirigé vers la homepage avec géo-détection

---

## 🔧 Comment Ça Marche ?

### 1. Fichier `_redirects`

```
/*    /index.html   200
```

- `/*` = Toutes les routes (y compris les erreurs 404)
- `/index.html` = Renvoyer le fichier principal de l'app React
- `200` = Code HTTP 200 (succès)

### 2. Fichier `vercel.json` (déjà configuré)

```json
{
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "/index.html"
    }
  ]
}
```

Les deux fichiers travaillent ensemble pour gérer les routes.

### 3. React Router (dans `/App.tsx`)

Une fois que `index.html` est chargé, React Router prend le relais :

```tsx
// Route racine avec géo-redirection
<Route path="/" element={<GeoRedirect />} />

// Routes françaises
<Route path="/fr" element={<HomePage />} />
<Route path="/fr/services" element={<ServicesPage />} />

// Routes anglaises
<Route path="/en" element={<HomePage />} />
<Route path="/en/about" element={<AboutPage />} />

// Catch-all pour les 404
<Route path="*" element={<Navigate to="/fr" replace />} />
```

---

## 🌍 Comportement Attendu

### Scénario 1 : Utilisateur en France
1. Va sur `https://www.maxence.design/`
2. Géo-détection → Redirige vers `/fr`
3. Affiche la homepage en français

### Scénario 2 : Utilisateur hors de France
1. Va sur `https://www.maxence.design/`
2. Géo-détection → Redirige vers `/en`
3. Affiche la homepage en anglais

### Scénario 3 : URL Directe
1. Va sur `https://www.maxence.design/fr/services`
2. Affiche directement la page Services en français

### Scénario 4 : Erreur 404
1. Va sur `https://www.maxence.design/page-inexistante`
2. Serveur renvoie `index.html` (code 200)
3. React Router charge
4. Route `*` (catch-all) détecte que la route n'existe pas
5. Redirige vers `/fr` (homepage française par défaut)
6. Ou utilise la géo-détection si on modifie le code

---

## 📝 Modification Optionnelle

Si tu veux que les 404 utilisent la **géo-détection** au lieu de toujours rediriger vers `/fr`, modifie cette ligne dans `/App.tsx` :

```tsx
// AVANT (ligne 493)
<Route path="*" element={<Navigate to="/fr" replace />} />

// APRÈS (avec géo-détection)
<Route path="*" element={<GeoRedirect />} />
```

---

## 🔥 Action Immédiate

**1. Copie cette commande :**

```bash
cd public && rm -rf _redirects && echo "/*    /index.html   200" > _redirects && cd .. && git add . && git commit -m "fix: Create _redirects file" && git push
```

**2. Exécute-la dans ton terminal**

**3. Attends 2-3 minutes**

**4. Teste les URLs !** 🚀

---

## 📖 Ressources

- `/CREER_REDIRECTS_MAINTENANT.txt` - Version courte
- `/FIX_404_SIMPLE.md` - Guide détaillé
- `/SITE_PRET_DEPLOIEMENT.md` - Vue d'ensemble complète

---

## ✅ Checklist

- [ ] Exécuter la commande
- [ ] Attendre le déploiement (2-3 min)
- [ ] Tester `/fr` → Fonctionne
- [ ] Tester `/en` → Fonctionne
- [ ] Tester F5 sur une page → Plus de 404
- [ ] Tester URL inexistante → Redirige vers home

**C'est tout ! Le site sera opérationnel. 🎉**
