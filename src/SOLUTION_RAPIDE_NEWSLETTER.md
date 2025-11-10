# ⚡ Solution rapide : Email Newsletter

## 🎯 Le problème

L'email de newsletter affiche un lien cassé au lieu d'une URL cliquable.

## 🔧 La solution en 3 étapes

### 1️⃣ Ouvre la page de diagnostic

**Dans la console du navigateur** (F12) :
```javascript
newsletterDebug()
```

Ou **navigue vers** :
```
ton-site.com#newsletter-debug
```

### 2️⃣ Configure FRONTEND_URL dans Supabase

1. Va sur https://supabase.com/dashboard
2. Ouvre ton projet
3. Menu **Edge Functions** → ta fonction **"server"**
4. Onglet **Settings** ou **Secrets**
5. Ajoute/Modifie :
   - **Nom** : `FRONTEND_URL`
   - **Valeur** : `https://ton-domaine.com` ← **Remplace par ton URL réelle**

**Exemples de valeurs valides :**
```
https://maxence.design
https://mon-site.netlify.app
https://mon-site.vercel.app
http://localhost:5173
```

⚠️ **Pas de slash `/` à la fin !**

### 3️⃣ Vérifie que ça fonctionne

1. **Recharge** la page de diagnostic
2. Le statut doit être **✅ vert**
3. **Teste** : Inscris-toi à la newsletter
4. **Vérifie l'email** : Le lien doit être cliquable
5. **Clique dessus** : Tu arrives sur la page de confirmation

## ✅ C'est tout !

Le système newsletter est maintenant opérationnel.

---

**Plus d'infos** : Voir `NEWSLETTER_FIX_FINAL.md`
