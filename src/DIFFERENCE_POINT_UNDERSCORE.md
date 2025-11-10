# ⚠️ DIFFÉRENCE CRITIQUE : . vs _

## 📛 CE SONT DEUX FICHIERS DIFFÉRENTS

```
/public/.redirects   ← Fichier avec un POINT (.)
/public/_redirects   ← Fichier avec un UNDERSCORE (_)
```

**CE NE SONT PAS LES MÊMES FICHIERS !**

---

## ❌ Ce Que Tu as Fait

Tu as modifié : `/public/.redirects`

```
.redirects
↑
Point
```

**Résultat** : Vercel ne lit PAS ce fichier → 404 persiste

---

## ✅ Ce Qu'il Faut Faire

Créer : `/public/_redirects`

```
_redirects
↑
Underscore
```

**Résultat** : Vercel lit ce fichier → 404 disparaît

---

## 🔍 Sur Ton Clavier

### Point (.)
- **Touche** : En bas à droite, à côté de la virgule
- **Symbole** : `.`
- **Exemple** : `.redirects`

### Underscore (_)
- **Touche** : Shift + Tiret (à côté du 0)
- **Symbole** : `_`
- **Exemple** : `_redirects`

---

## ⚡ Solution en 1 Commande

```bash
echo "/*    /index.html   200" > public/_redirects && git add public/_redirects && git commit -m "fix: Create _redirects file" && git push
```

Cette commande crée le BON fichier : `_redirects` (avec underscore)

---

## 📊 Comparaison Visuelle

### ❌ INCORRECT (ce que tu as)

```
/public/
  └── .redirects  ← Point au début
```

**Vercel dit** : "Je ne connais pas `.redirects`" → Ignore

### ✅ CORRECT (ce qu'il faut)

```
/public/
  └── _redirects  ← Underscore au début
```

**Vercel dit** : "Je lis `_redirects`" → Applique la config

---

## 🎯 Pourquoi Cette Confusion ?

### `.redirects` (Point)
- **Convention** : Fichiers cachés Unix/Linux
- **Exemples** : `.gitignore`, `.env`, `.htaccess`
- **Vercel** : N'utilise PAS ce fichier

### `_redirects` (Underscore)
- **Convention** : Configuration Netlify/Vercel
- **Exemples** : `_redirects`, `_headers`
- **Vercel** : Lit et applique ce fichier ✅

---

## 🔬 Test Rapide

**Après avoir créé le fichier, vérifie :**

```bash
# Liste les fichiers qui commencent par _ ou .
ls -la public/ | grep -E "^[-d].*[_\.]redirects"
```

**Tu devrais voir :**
```
-rw-r--r--  ... _redirects   ← Le bon fichier
```

---

## 📝 Récapitulatif

| Fichier | Tu l'as modifié ? | Vercel le lit ? | Fixe le 404 ? |
|---------|-------------------|-----------------|---------------|
| `.redirects` | ✅ Oui | ❌ Non | ❌ Non |
| `_redirects` | ❌ Non | ✅ Oui | ✅ Oui |

**Solution** : Crée `_redirects` avec la commande ci-dessus

---

## ⚡ Action Immédiate

**Copie-colle cette commande :**

```bash
echo "/*    /index.html   200" > public/_redirects && git add public/_redirects && git commit -m "fix: Create _redirects file" && git push
```

**Attends 2-3 min, puis teste :**
https://www.maxence.design/en → F5 → ✅ Plus de 404

---

**Un underscore peut changer ta vie ! 🎉**
