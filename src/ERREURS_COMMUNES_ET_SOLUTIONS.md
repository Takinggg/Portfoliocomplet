# 🔧 ERREURS COMMUNES ET SOLUTIONS

## ❌ Erreur 1 : "Invalid login credentials"

### Symptôme
```
Login error: Invalid login credentials
```

### Cause
Le compte administrateur n'existe pas encore dans Supabase Auth. Cela arrive quand :
- Le serveur Edge Function n'est pas déployé
- Le serveur est déployé mais l'endpoint `/auth/init-admin` n'a jamais été appelé

### Solution

**Option A : Automatique (recommandé)**
1. Déployez d'abord le serveur Edge Function (voir `/DEPLOYER_MAINTENANT.md`)
2. L'application appellera automatiquement `/auth/init-admin` au chargement
3. Attendez 2-3 secondes après le chargement de la page
4. Vérifiez dans la console : `✅ Compte admin: ...`
5. Essayez de vous connecter avec le mot de passe par défaut : `vbz657D9`

**Option B : Manuel**
Appelez l'endpoint directement après avoir déployé le serveur :
```bash
curl -X POST https://[votre-project-id].supabase.co/functions/v1/make-server-04919ac5/auth/init-admin \
  -H "Authorization: Bearer [votre-anon-key]" \
  -H "Content-Type: application/json"
```

**Option C : Via l'interface Supabase**
1. Allez dans votre projet Supabase
2. Authentication > Users
3. Cliquez sur "Add User"
4. Email: `contact@maxence.design`
5. Password: `vbz657D9` (ou votre propre mot de passe)
6. Cochez "Auto Confirm User"
7. Cliquez sur "Create User"

---

## ❌ Erreur 2 : "⚠️ Serveur Supabase non disponible (Status: 401)"

### Symptôme
```
⚠️ Serveur Supabase non disponible (Status: 401 )
```

### Cause
Le health check endpoint retourne 401 Unauthorized. Cela peut arriver si :
- L'Authorization header est manquant ou incorrect
- La clé `SUPABASE_ANON_KEY` est incorrecte dans `/utils/supabase/info.tsx`
- Le serveur attend une authentification mais ne la reçoit pas

### Solution

**Vérification 1 : Les clés Supabase**
Ouvrez `/utils/supabase/info.tsx` et vérifiez que les valeurs sont correctes :

```typescript
export const projectId = "votre-project-id"; // Doit correspondre à votre vrai project ID
export const publicAnonKey = "eyJhbG..."; // Votre vraie anon key
```

**Où trouver ces valeurs ?**
1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Settings > API
4. Copiez :
   - `Project URL` → Extrayez le project-id de `https://[project-id].supabase.co`
   - `Project API keys` → `anon` `public`

**Vérification 2 : Le serveur est déployé**
```bash
# Testez le health endpoint
curl https://[votre-project-id].supabase.co/functions/v1/make-server-04919ac5/health \
  -H "Authorization: Bearer [votre-anon-key]"

# Réponse attendue :
# {"status":"healthy","timestamp":"...","version":"..."}
```

Si vous obtenez 404, le serveur n'est pas déployé → Consultez `/DEPLOYER_MAINTENANT.md`

---

## ❌ Erreur 3 : "ReferenceError: lang is not defined"

### Symptôme
```
❌ Erreur chargement posts: ReferenceError: lang is not defined
```

### Cause
La variable `lang` n'était pas définie dans le code qui appelle `fetchBlogPosts()`.

### Solution
✅ **DÉJÀ CORRIGÉ** dans cette version !

Le code a été mis à jour pour utiliser une langue par défaut :
```typescript
// AVANT (erreur)
const loadedPosts = await fetchBlogPosts(lang);

// APRÈS (corrigé)
const loadedPosts = await fetchBlogPosts("fr"); // Défaut: français
```

Si l'erreur persiste, vérifiez `/components/dashboard/BlogTab.tsx` ligne 85.

---

## ❌ Erreur 4 : "Network error" ou "Failed to fetch"

### Symptôme
```
❌ Erreur chargement case studies: TypeError: Failed to fetch
```

### Cause
Le serveur Edge Function n'est pas déployé ou n'est pas accessible.

### Solution

1. **Vérifiez que le serveur est déployé**
```bash
supabase functions list
# Vous devriez voir : make-server-04919ac5
```

2. **Si non déployé, déployez-le**
```bash
supabase functions deploy make-server-04919ac5
```

3. **Vérifiez la connectivité**
```bash
curl https://[project-id].supabase.co/functions/v1/make-server-04919ac5/health
```

4. **Vérifiez les logs**
```bash
supabase functions logs make-server-04919ac5
```

---

## ❌ Erreur 5 : "Table kv_store_04919ac5 does not exist"

### Symptôme
```
❌ Error: relation "kv_store_04919ac5" does not exist
```

### Cause
La table KV Store n'a pas été créée dans la base de données.

### Solution

1. Allez dans votre projet Supabase
2. SQL Editor
3. New Query
4. Copiez-collez le SQL de `/supabase_setup.sql` ou celui dans `/DEPLOYER_MAINTENANT.md`
5. Run

---

## ❌ Erreur 6 : "CORS policy" ou "Access-Control-Allow-Origin"

### Symptôme
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

### Cause
Le serveur Edge Function n'a pas les headers CORS corrects.

### Solution
✅ **DÉJÀ CORRIGÉ** dans `/supabase/functions/server/index.tsx` !

Le serveur utilise déjà :
```typescript
app.use("*", cors({ origin: "*" }));
```

Si l'erreur persiste :
1. Vérifiez que vous avez la dernière version du serveur
2. Redéployez : `supabase functions deploy make-server-04919ac5`

---

## ❌ Erreur 7 : "Access Token expired"

### Symptôme
```
❌ Error: Access token expired
```

### Cause
Votre session Supabase Auth a expiré (après 1 heure généralement).

### Solution

1. **Reconnectez-vous**
   - Allez à `/login`
   - Entrez votre mot de passe
   - Vous obtiendrez un nouveau token

2. **Automatique** (déjà implémenté)
   - L'application détecte automatiquement les sessions expirées
   - Redirige vers `/login` quand nécessaire

---

## 🔍 Diagnostic Complet

### Checklist de Vérification

```
[ ] Le serveur Edge Function est déployé
    → supabase functions list

[ ] La table kv_store_04919ac5 existe
    → SQL Editor: SELECT * FROM kv_store_04919ac5 LIMIT 1;

[ ] Les clés Supabase sont correctes dans /utils/supabase/info.tsx
    → projectId et publicAnonKey

[ ] Le health endpoint répond
    → curl https://[project-id].supabase.co/.../health

[ ] Le compte admin est créé
    → Supabase Dashboard > Authentication > Users

[ ] Vous utilisez le bon mot de passe
    → Par défaut: vbz657D9
```

### Script de Diagnostic Automatique

Pour diagnostiquer tous les problèmes en une fois :

```bash
# Créez un fichier diagnostic.sh
#!/bin/bash

echo "🔍 DIAGNOSTIC SUPABASE"
echo "====================="
echo ""

echo "1️⃣ Test du serveur..."
curl -s https://[votre-project-id].supabase.co/functions/v1/make-server-04919ac5/health
echo ""
echo ""

echo "2️⃣ Liste des fonctions..."
supabase functions list
echo ""

echo "3️⃣ Logs récents..."
supabase functions logs make-server-04919ac5 --limit 10
echo ""

echo "✅ Diagnostic terminé"
```

---

## 📞 Besoin d'Aide ?

Si aucune de ces solutions ne fonctionne :

1. **Vérifiez les logs du serveur**
   ```bash
   supabase functions logs make-server-04919ac5
   ```

2. **Vérifiez la console du navigateur** (F12)
   - Recherchez les messages en rouge
   - Notez les URLs qui échouent
   - Vérifiez les réponses des requêtes dans l'onglet Network

3. **Consultez les guides**
   - `/DEPLOYER_MAINTENANT.md` - Guide de déploiement rapide
   - `/DEPLOIEMENT_SUPABASE_FINAL.md` - Guide complet
   - `/MIGRATION_FULL_DB_COMPLETE.md` - Détails techniques

---

## 📝 Codes d'Erreur HTTP Communs

| Code | Signification | Action |
|------|---------------|--------|
| 401 | Non autorisé | Vérifiez vos clés API ou reconnectez-vous |
| 404 | Non trouvé | Le serveur n'est pas déployé ou l'URL est incorrecte |
| 500 | Erreur serveur | Consultez les logs du serveur |
| 503 | Service indisponible | Le serveur est temporairement hors ligne |

---

**Dernière mise à jour :** 2025-11-09

**Version de l'application :** Full DB (no localStorage)

**Version du serveur :** consolidated-v1
