# ⚡ Fix en 3 étapes

## ❌ Problème actuel

```
FRONTEND_URL = vbz657d9
```

❌ Ce n'est **PAS une URL** valide !

---

## ✅ Solution

### Étape 1️⃣ : Trouve ton URL de site

**Où est déployé ton site ?**

**Option A - Netlify :**
```
https://ton-projet.netlify.app
```
👉 Va sur https://app.netlify.com → Ton projet → Copie l'URL

**Option B - Vercel :**
```
https://ton-projet.vercel.app
```
👉 Va sur https://vercel.com/dashboard → Ton projet → Copie l'URL

**Option C - Domaine custom :**
```
https://maxence.design
```

**Option D - Local (dev) :**
```
http://localhost:5173
```

---

### Étape 2️⃣ : Configure dans Supabase

1. **Ouvre** : https://supabase.com/dashboard

2. **Clique** sur ton projet (ID: `vbz657d9`)

3. **Menu** : **Edge Functions** ⚡

4. **Clique** : Fonction **"server"**

5. **Onglet** : **"Settings"** ou **"Secrets"**

6. **Trouve** : `FRONTEND_URL`

7. **Remplace** `vbz657d9` par ton URL réelle :
   ```
   https://ton-site-reel.com
   ```

8. **Sauvegarde** ✅

---

### Étape 3️⃣ : Vérifie que ça marche

**Dans la console (F12) :**
```javascript
newsletterDebug()
```

**Tu dois voir :**
- ✅ Statut **VERT**
- ✅ URL valide (commence par `https://`)

**Teste l'inscription :**
1. Inscris-toi à la newsletter
2. L'email doit contenir un **lien cliquable**
3. Le lien fonctionne !

---

## 📋 Exemples

### ✅ CORRECT

```
https://maxence.design
https://mon-site.netlify.app
https://portfolio-maxence.vercel.app
http://localhost:5173
```

### ❌ INCORRECT

```
vbz657d9                      ← Juste un ID
maxence.design                ← Manque https://
https://maxence.design/       ← Slash final
www.maxence.design            ← Manque https://
```

---

## 🎯 C'est tout !

Une fois `FRONTEND_URL` configuré correctement :
- ✅ Les emails auront des liens valides
- ✅ Les confirmations fonctionneront
- ✅ Le système newsletter sera 100% opérationnel

---

**Temps estimé : 2 minutes ⏱️**
