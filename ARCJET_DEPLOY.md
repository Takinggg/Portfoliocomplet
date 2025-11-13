# 🚀 GUIDE DE DÉPLOIEMENT ARCJET

## ✅ Code Déployé sur GitHub
Commit: `feat: Arcjet ML security integration`
Branch: `main`

---

## 📋 ÉTAPES DE DÉPLOIEMENT (5 minutes)

### 1️⃣ Aller sur le Dashboard Supabase
🔗 https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions

### 2️⃣ Cliquer sur `make-server-04919ac5`

### 3️⃣ Options de déploiement :

#### **Option A : Pull depuis GitHub** (Recommandé)
1. Cliquer sur "Deploy new version"
2. Sélectionner "Deploy from GitHub"
3. Branch : `main`
4. Folder : `supabase/functions/make-server-04919ac5`
5. Cliquer "Deploy"

#### **Option B : Upload Manuel**
1. Télécharger depuis GitHub :
   - `arcjet-config.ts` (NOUVEAU)
   - `index.ts` (modifié)
   - `deno.json`
   - `email_service.tsx`
   - `kv_store.tsx`
   - `pdf_service.tsx`
   - `security_middleware.tsx`

2. Uploader dans le Dashboard

### 4️⃣ Vérifier le Secret ARCJET_KEY
Settings → Edge Functions → Secrets
Doit contenir : `ARCJET_KEY=ajkey_...`

### 5️⃣ Attendre le Déploiement (30-60 secondes)

### 6️⃣ Vérifier les Logs
```bash
Logs → make-server-04919ac5
```

Tu devrais voir :
```
✅ Arcjet configuré avec clé: ajkey_...
```

### 7️⃣ TESTER avec test-arcjet.html

---

## 🧪 Tests Attendus

### ✅ Newsletter avec Email Jetable
- Email `test@yopmail.com` → Status 400
- Message : "Email invalide: DISPOSABLE"

### ✅ Rate Limiting Login
- 10 tentatives rapides → Status 429 après la 5ème
- Message : "Trop de tentatives"

### ✅ Bot Detection
- Headers suspects → Status 403
- Message : "Bot détecté"

---

## 🔧 Si ça ne Marche Pas

### Debug 1 : Vérifier les Logs
```
Dashboard → Functions → make-server-04919ac5 → Logs
```

Rechercher :
- ✅ "Arcjet configuré" → OK
- ⚠️ "ARCJET_KEY non configurée" → Ajouter le secret
- ❌ Erreur import Arcjet → Vérifier deno.json

### Debug 2 : Vérifier deno.json
Doit contenir :
```json
{
  "imports": {
    "@arcjet/node": "npm:@arcjet/node@^1.0.0-rc.23"
  }
}
```

### Debug 3 : Forcer le Redéploiement
Parfois Supabase cache l'ancienne version :
1. Supprimer la fonction
2. Recréer avec les nouveaux fichiers

---

## 📞 Support
Si problème persistant, envoie les logs de la console Edge Function.
