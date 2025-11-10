# 🚨 URGENT : Configurer FRONTEND_URL

## Le problème

Tu as actuellement : `FRONTEND_URL=vbz657d9`

Mais `vbz657d9` n'est **PAS une URL valide** ! C'est un identifiant de projet.

## La solution

### 1️⃣ Trouve ton URL de site

**Option A - Site déployé** :
- Netlify : `https://ton-projet.netlify.app`
- Vercel : `https://ton-projet.vercel.app`
- Domaine custom : `https://maxence.design`

**Option B - Développement local** :
- `http://localhost:5173`

**Pour trouver ton URL Netlify/Vercel :**
1. Va sur Netlify/Vercel Dashboard
2. Ouvre ton projet
3. Copie l'URL dans "Domains" ou "Production URL"

### 2️⃣ Configure dans Supabase

#### Méthode 1 : Via le Dashboard (Recommandé)

1. **Va sur** : https://supabase.com/dashboard
   
2. **Sélectionne ton projet** (celui avec l'ID `vbz657d9`)

3. **Menu de gauche** : Clique sur **"Edge Functions"** (icône éclair ⚡)

4. **Clique sur la fonction "server"** dans la liste

5. **Va dans l'onglet "Settings"** ou **"Secrets"** 
   (en haut de la page, à côté de "Details")

6. **Cherche la variable** : `FRONTEND_URL`
   - Si elle existe : Clique sur "Edit" ✏️
   - Si elle n'existe pas : Clique sur "Add Secret" ➕

7. **Entre la valeur** :
   ```
   Nom : FRONTEND_URL
   Valeur : https://ton-site-reel.com
   ```
   
   ⚠️ **Remplace par TON URL réelle !**
   ⚠️ **Pas de slash `/` à la fin !**

8. **Sauvegarde** (bouton "Save" ou "Add")

9. **Redémarre la fonction** (si demandé)

#### Méthode 2 : Via CLI (Alternative)

```bash
# Configure la variable
supabase secrets set FRONTEND_URL=https://ton-site.com

# Redéploie la fonction
supabase functions deploy server
```

### 3️⃣ Vérifie que ça fonctionne

**Dans ton navigateur, ouvre la console (F12) et tape :**
```javascript
newsletterDebug()
```

Tu verras :
- ✅ **AVANT** : `Valeur brute: vbz657d9` → ❌ INVALIDE
- ✅ **APRÈS** : `Valeur brute: https://ton-site.com` → ✅ VALIDE

### 4️⃣ Teste la newsletter

1. Inscris-toi avec une nouvelle adresse email
2. L'email doit maintenant contenir une URL valide comme :
   ```
   https://ton-site.com?newsletter_confirm=abc-123-def
   ```
3. Le lien doit être **cliquable** et te rediriger vers ton site

## ⚠️ Points importants

### Trouve ton URL de déploiement

**Si tu ne connais pas l'URL de ton site :**

1. **Netlify** :
   - Dashboard : https://app.netlify.com
   - Ton projet → "Domain settings"
   - Copie l'URL principale (ex: `https://maxence-portfolio.netlify.app`)

2. **Vercel** :
   - Dashboard : https://vercel.com/dashboard
   - Ton projet → "Domains"
   - Copie l'URL de production (ex: `https://maxence-portfolio.vercel.app`)

3. **Domaine custom** :
   - Si tu as configuré un domaine : `https://maxence.design`

4. **En développement local** :
   - Utilise : `http://localhost:5173`
   - ⚠️ Ça ne marchera que sur ta machine !

### Format correct

✅ **CORRECT** :
```
https://maxence.design
https://mon-site.netlify.app
http://localhost:5173
```

❌ **INCORRECT** :
```
vbz657d9                    ← Juste un ID
maxence.design              ← Manque https://
https://maxence.design/     ← Slash final à éviter
www.maxence.design          ← Manque https://
```

## 🎯 Checklist rapide

- [ ] J'ai trouvé l'URL réelle de mon site
- [ ] Je suis connecté à Supabase Dashboard
- [ ] J'ai ouvert Edge Functions → server → Settings/Secrets
- [ ] J'ai modifié `FRONTEND_URL` avec l'URL réelle
- [ ] J'ai sauvegardé la modification
- [ ] J'ai testé avec `newsletterDebug()` → Statut ✅ vert
- [ ] J'ai testé l'inscription newsletter
- [ ] L'email contient maintenant un lien cliquable
- [ ] ✅ **SYSTÈME OPÉRATIONNEL !**

## 💡 Astuce

Si tu n'as pas encore déployé ton site :

1. **Pour le développement** : Utilise `http://localhost:5173`
2. **Déploie ton site** sur Netlify ou Vercel
3. **Met à jour** `FRONTEND_URL` avec l'URL de production
4. **Redéploie** la fonction Edge

## 🆘 Besoin d'aide ?

**Pour vérifier la configuration actuelle :**
```javascript
// Dans la console du navigateur (F12)
fetch('https://vbz657d9.supabase.co/functions/v1/make-server-04919ac5/test-frontend-url', {
  headers: { 'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
}).then(r => r.json()).then(console.log)
```

Ou plus simple :
```javascript
newsletterDebug()
```

---

**Une fois `FRONTEND_URL` correctement configuré, le système newsletter sera 100% opérationnel ! 🚀**
