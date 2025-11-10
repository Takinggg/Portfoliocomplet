# ⚡ DÉMARRAGE RAPIDE - 3 MINUTES

## 🎯 Objectif

Connecter votre application à Supabase et résoudre toutes les erreurs.

---

## 🚨 Vous Avez des Erreurs ?

### ❌ "Invalid login credentials"
→ **Le serveur n'est pas encore déployé.** Suivez les étapes ci-dessous.

### ❌ "Serveur Supabase non disponible (Status: 401)"
→ **Vérifiez vos clés API** dans `/utils/supabase/info.tsx` ou déployez le serveur.

### ❌ "lang is not defined"
→ ✅ **Déjà corrigé** dans cette version !

**Toutes les solutions détaillées :** `/ERREURS_COMMUNES_ET_SOLUTIONS.md`

---

## 📋 GUIDE EN 3 ÉTAPES

### Étape 1 : Vérifier les Clés Supabase (30 secondes)

1. Ouvrez `/utils/supabase/info.tsx`
2. Vérifiez que les valeurs correspondent à votre projet :

```typescript
export const projectId = "votre-project-id"; // ⚠️ Remplacez
export const publicAnonKey = "eyJhbG...votre-vraie-key"; // ⚠️ Remplacez
```

**Où trouver ces valeurs ?**
- Allez sur https://app.supabase.com
- Sélectionnez votre projet
- Settings > API
- Copiez `Project URL` (pour l'ID) et `anon public` key

### Étape 2 : Créer la Table (1 minute)

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. SQL Editor > New Query
4. Copiez-collez ce SQL :

```sql
CREATE TABLE IF NOT EXISTS kv_store_04919ac5 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kv_prefix ON kv_store_04919ac5 USING btree (key text_pattern_ops);
```

5. Cliquez sur **Run** (ou CTRL+Enter)

### Étape 3 : Déployer le Serveur (1 minute)

```bash
# Installer le CLI (si pas déjà fait)
npm install -g supabase

# Se connecter
supabase login

# Lier votre projet
supabase link --project-ref [votre-project-id]

# Déployer
supabase functions deploy make-server-04919ac5
```

Attendez que ça termine. Vous devriez voir :
```
✓ Deployed!
```

---

## ✅ VÉRIFICATION

### Test 1 : Health Check

```bash
curl https://[votre-project-id].supabase.co/functions/v1/make-server-04919ac5/health
```

**Résultat attendu :**
```json
{"status":"healthy","timestamp":"...","version":"..."}
```

### Test 2 : Application

1. Rechargez votre application (F5)
2. Ouvrez la console (F12)
3. Vous devriez voir :
   ```
   ✅ Serveur Supabase connecté
   ✅ Compte admin: ...
   ```

### Test 3 : Connexion Dashboard

1. Allez à `/login`
2. Email (pré-rempli) : `contact@maxence.design`
3. Mot de passe : `vbz657D9`
4. Cliquez sur "Se connecter"

**Si ça fonctionne :** ✅ Vous êtes dans le dashboard !

**Si erreur "Invalid login credentials" :**
→ Le compte admin n'a pas été créé automatiquement
→ Créez-le manuellement :
   - Supabase Dashboard > Authentication > Users
   - Add User : `contact@maxence.design` / `vbz657D9`
   - Auto Confirm User ✓

---

## 🎉 C'EST FAIT !

Votre application est maintenant **100% connectée à Supabase**.

### Que Faire Maintenant ?

1. **Dashboard > Case Studies** → Créez votre première case study
2. **Dashboard > Blog** → Créez votre premier article
3. **Explorez** les autres onglets du dashboard

### Données de Démo

Pour avoir des données de test :

```typescript
// Dans la console du navigateur (F12)
import { seedBilingualCaseStudies } from './utils/seedBilingualCaseStudies';
await seedBilingualCaseStudies();
```

---

## 📚 Documentation Complète

- **Guide de déploiement complet :** `/DEPLOIEMENT_SUPABASE_FINAL.md`
- **Résolution des erreurs :** `/ERREURS_COMMUNES_ET_SOLUTIONS.md`
- **Détails techniques :** `/MIGRATION_FULL_DB_COMPLETE.md`

---

## 🆘 Problèmes ?

### Serveur ne déploie pas
```bash
# Logs d'erreur
supabase functions logs make-server-04919ac5

# Forcer le redéploiement
supabase functions deploy make-server-04919ac5 --no-verify-jwt
```

### Application freeze ou lent
→ Le serveur est peut-être lent. Attendez 10 secondes.
→ Vérifiez la console pour les messages de timeout.

### Autres erreurs
→ Consultez `/ERREURS_COMMUNES_ET_SOLUTIONS.md`

---

**Temps total : 3 minutes** ⏱️

**C'est tout !** Votre portfolio est maintenant full-stack avec Supabase. 🚀
