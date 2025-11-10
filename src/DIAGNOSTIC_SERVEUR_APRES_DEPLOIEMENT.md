# 🔍 Diagnostic Serveur Après Déploiement

## ✅ Contexte
Votre backend était déployé et fonctionnait bien, mais maintenant il y a un problème.  
Ce guide vous aide à identifier et résoudre rapidement le problème.

---

## 📋 Checklist de Diagnostic Rapide

### 1️⃣ Vérifier l'état du serveur

#### Test rapide dans le navigateur:
Ouvrez cette URL dans votre navigateur:
```
https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health
```

**✅ Si vous voyez** :
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-07T...",
  "version": "simplified-v1"
}
```
→ **Le serveur fonctionne** ✅ Passez à l'étape 2

**❌ Si vous voyez une erreur** :
- `404 Not Found` → Le serveur n'est pas déployé
- `500 Internal Server Error` → Le serveur a crashé
- `CORS error` → Problème de configuration CORS
- Timeout → Le serveur ne répond pas

---

### 2️⃣ Vérifier les logs du serveur

1. Allez sur le dashboard Supabase:
   ```
   https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/logs/edge-functions
   ```

2. Cherchez des erreurs récentes dans les logs

3. **Erreurs communes** :

#### ❌ "Cannot find module kv_store"
**Cause** : Le fichier `kv_store.tsx` n'a pas été déployé  
**Solution** :
```bash
# Redéployer avec tous les fichiers
cd supabase/functions/server
supabase functions deploy server --no-verify-jwt
```

#### ❌ "SUPABASE_URL is not defined"
**Cause** : Variables d'environnement manquantes  
**Solution** : Voir section 3

#### ❌ "Database connection failed"
**Cause** : Problème avec la table KV  
**Solution** : Voir section 5

---

### 3️⃣ Vérifier les variables d'environnement

Vérifiez que ces secrets sont configurés dans Supabase :

```bash
# Ces variables DOIVENT exister:
SUPABASE_URL                  # ✅
SUPABASE_SERVICE_ROLE_KEY     # ✅ (déjà fourni)
SUPABASE_ANON_KEY            # ✅ (déjà fourni)
FRONTEND_URL                 # ✅ (déjà fourni)
RESEND_API_KEY              # ✅ (déjà fourni)
```

**Pour les vérifier** :
1. Allez sur: https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/settings/functions
2. Vérifiez que tous les secrets sont présents

**Si manquants** :
```bash
# Ajouter via CLI
supabase secrets set SUPABASE_URL="https://ptcxeqtjlxittxayffgu.supabase.co"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="votre-key"
# etc...
```

---

### 4️⃣ Tester les routes principales

#### Test Health Check
```bash
curl -X GET \
  'https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y3hlcXRqbHhpdHR4YXlmZmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY1MjYsImV4cCI6MjA3Nzg4MjUyNn0.4xmzyoXUxas6587ZFWWc95p10bNSa2MdaipYI7RHmZc'
```

#### Test Blog Posts
```bash
curl -X GET \
  'https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/blog/posts?lang=fr' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y3hlcXRqbHhpdHR4YXlmZmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY1MjYsImV4cCI6MjA3Nzg4MjUyNn0.4xmzyoXUxas6587ZFWWc95p10bNSa2MdaipYI7RHmZc'
```

#### Test Newsletter Stats
```bash
curl -X GET \
  'https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/newsletter/stats' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y3hlcXRqbHhpdHR4YXlmZmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY1MjYsImV4cCI6MjA3Nzg4MjUyNn0.4xmzyoXUxas6587ZFWWc95p10bNSa2MdaipYI7RHmZc'
```

---

### 5️⃣ Vérifier la table KV Store

Le serveur utilise une table `kv_store_04919ac5` dans Postgres.

**Vérifier qu'elle existe** :
1. Allez sur: https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/editor
2. Cherchez la table `kv_store_04919ac5`

**Si elle n'existe pas**, créez-la via SQL Editor:
```sql
CREATE TABLE IF NOT EXISTS kv_store_04919ac5 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_kv_store_prefix 
ON kv_store_04919ac5 (key text_pattern_ops);
```

---

### 6️⃣ Problèmes CORS

Si vous voyez des erreurs CORS dans la console:

#### Symptômes:
```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy
```

#### Solution:
Vérifiez que `FRONTEND_URL` est correctement configurée dans les secrets Supabase:
```bash
supabase secrets set FRONTEND_URL="https://votre-domaine.com"
```

**OU** pour accepter toutes les origines (développement seulement):
```bash
supabase secrets set FRONTEND_URL="*"
```

---

### 7️⃣ Redéploiement complet

Si rien ne fonctionne, redéployez complètement:

```bash
# 1. Assurez-vous d'être dans le bon répertoire
cd /path/to/votre/projet

# 2. Vérifiez que tous les fichiers sont présents
ls -la supabase/functions/server/
# Vous devez voir:
# - index.tsx
# - kv_store.tsx

# 3. Redéployez
supabase functions deploy server --no-verify-jwt

# 4. Vérifiez les logs immédiatement
supabase functions logs server --tail
```

---

## 🔧 Solutions aux Problèmes Courants

### Problème: "Failed to fetch"

**Causes possibles:**
1. Le serveur n'est pas déployé
2. L'URL est incorrecte
3. Le serveur a crashé
4. Problème réseau

**Solution:**
```bash
# 1. Vérifier que le serveur est déployé
supabase functions list

# 2. Vérifier les logs
supabase functions logs server --tail

# 3. Redéployer si nécessaire
supabase functions deploy server --no-verify-jwt
```

---

### Problème: Le serveur répond mais retourne des erreurs 500

**Diagnostic:**
1. Regardez les logs détaillés
2. L'erreur est probablement dans le code serveur

**Causes communes:**
- Erreur dans `kv_store.tsx`
- Problème de connexion à la base de données
- Variable d'environnement manquante

**Solution:**
```bash
# Voir les erreurs détaillées
supabase functions logs server --tail

# Vous verrez exactement quelle ligne cause l'erreur
```

---

### Problème: Routes spécifiques ne fonctionnent pas

**Exemple:** `/blog/posts` retourne 404 mais `/health` fonctionne

**Cause:** Route mal configurée dans `index.tsx`

**Solution:**
1. Vérifiez que toutes les routes sont préfixées avec `/make-server-04919ac5/`
2. Vérifiez la casse (sensible aux majuscules/minuscules)
3. Consultez la liste des routes dans les logs au démarrage

---

## 📊 Test de Santé Complet

Utilisez ce composant dans votre app pour tester:

```typescript
import { ServerHealthCheck } from './components/ServerHealthCheck';

// Dans votre Dashboard ou page de test
<ServerHealthCheck />
```

Ce composant va:
- ✅ Tester la connexion au serveur
- ✅ Vérifier les routes principales
- ✅ Afficher les détails des erreurs
- ✅ Permettre un re-test facile

---

## 🚀 Checklist Finale

Avant de déclarer le problème résolu:

- [ ] Le health check retourne 200 OK
- [ ] Les routes blog fonctionnent (`/blog/posts`)
- [ ] Les routes newsletter fonctionnent (`/newsletter/stats`)
- [ ] Pas d'erreurs CORS dans la console
- [ ] Le mode local fonctionne en fallback (si serveur down)
- [ ] Les logs ne montrent pas d'erreurs

---

## 🆘 Si Rien Ne Fonctionne

### Option 1: Mode Local Complet
Votre app a un système de fallback complet. Si le serveur ne fonctionne pas, l'app continuera à fonctionner en mode local.

Vérifiez que le mode local fonctionne:
```typescript
// Dans la console du navigateur
import { checkServerAvailability } from './utils/serverService';
await checkServerAvailability();
// false = mode local actif
```

### Option 2: Logs Détaillés
Pour activer les logs détaillés:

1. Dans le serveur (`index.tsx`), les logs sont déjà activés avec:
```typescript
app.use('*', logger(console.log));
```

2. Dans le frontend, ouvrez la console du navigateur
3. Tous les appels API sont loggés avec le résultat (serveur ou local)

---

## 📞 Debug en Direct

Ouvrez la console de votre navigateur et exécutez:

```javascript
// Test health check
fetch('https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y3hlcXRqbHhpdHR4YXlmZmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY1MjYsImV4cCI6MjA3Nzg4MjUyNn0.4xmzyoXUxas6587ZFWWc95p10bNSa2MdaipYI7RHmZc'
  }
})
.then(r => r.json())
.then(d => console.log('✅ Serveur OK:', d))
.catch(e => console.error('❌ Erreur serveur:', e));
```

Cela vous dira immédiatement si le serveur répond.

---

## 🎯 Résumé des Commandes Utiles

```bash
# Voir les fonctions déployées
supabase functions list

# Voir les logs en temps réel
supabase functions logs server --tail

# Redéployer
supabase functions deploy server --no-verify-jwt

# Tester le health check
curl https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health

# Voir les secrets
supabase secrets list
```

---

## ✅ Vous avez trouvé le problème ?

Une fois identifié, notez-le ici pour référence future :

**Problème rencontré :** ______________________

**Solution appliquée :** ______________________

**Date :** ______________________

---

**Dernière mise à jour:** 7 novembre 2025  
**Version du serveur:** simplified-v1  
**Project ID:** ptcxeqtjlxittxayffgu
