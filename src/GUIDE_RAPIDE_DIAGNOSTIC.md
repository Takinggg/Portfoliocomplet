# 🚀 Guide Rapide de Diagnostic Serveur

## ⚡ Test Ultra-Rapide (30 secondes)

### Option 1: Dans le navigateur
Ouvrez cette URL dans votre navigateur:
```
https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health
```

**✅ Si vous voyez un JSON avec `"success": true`** → Serveur OK  
**❌ Si vous voyez une erreur** → Serveur KO, passez aux diagnostics approfondis

---

### Option 2: Dans la console du navigateur (F12)
Copiez/collez ce code:

```javascript
fetch('https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y3hlcXRqbHhpdHR4YXlmZmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY1MjYsImV4cCI6MjA3Nzg4MjUyNn0.4xmzyoXUxas6587ZFWWc95p10bNSa2MdaipYI7RHmZc'
  }
})
.then(r => r.json())
.then(d => console.log('✅ Serveur OK:', d))
.catch(e => console.error('❌ Erreur:', e));
```

---

## 🔍 Diagnostic Complet (Dans votre App)

### Méthode 1: Composant de Diagnostic

Ajoutez ceci dans votre Dashboard ou créez une route `/diagnostic`:

```tsx
import { ServerDiagnostic } from './components/ServerDiagnostic';

// Dans votre composant
<ServerDiagnostic />
```

Ce composant va:
- ✅ Tester toutes les routes API
- ✅ Vérifier la connexion serveur
- ✅ Tester le fallback local
- ✅ Afficher les détails des erreurs
- ✅ Permettre de copier les URLs

### Méthode 2: Page Dédiée

Utilisez la page complète de diagnostic:

```tsx
import { ServerDiagnosticPage } from './components/pages/ServerDiagnosticPage';

// Ajoutez une route
<Route path="/diagnostic" element={<ServerDiagnosticPage />} />
```

---

## 🛠️ Solutions aux Problèmes Fréquents

### Problème 1: "Failed to fetch" ou Timeout

**Causes:**
- Le serveur n'est pas déployé
- Le serveur a crashé
- Problème réseau

**Solutions:**
```bash
# Vérifier si le serveur est déployé
supabase functions list

# Redéployer si nécessaire
cd supabase/functions/server
supabase functions deploy server --no-verify-jwt

# Vérifier les logs
supabase functions logs server --tail
```

---

### Problème 2: Serveur OK mais retourne des erreurs 500

**Causes:**
- Erreur dans le code serveur
- Variable d'environnement manquante
- Problème avec la base de données

**Solutions:**
1. Regardez les logs en détail:
   ```bash
   supabase functions logs server --tail
   ```

2. Vérifiez les variables d'environnement:
   - Allez sur: https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/settings/functions
   - Vérifiez que tous les secrets sont présents:
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `SUPABASE_ANON_KEY`
     - `FRONTEND_URL`

3. Vérifiez la table KV:
   - Allez sur: https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/editor
   - Cherchez la table `kv_store_04919ac5`
   - Si elle n'existe pas, créez-la (voir DIAGNOSTIC_SERVEUR_APRES_DEPLOIEMENT.md)

---

### Problème 3: Routes Blog/Newsletter ne fonctionnent pas

**Causes:**
- Base de données vide
- Routes mal configurées

**Solutions:**
1. Vérifiez que les routes sont accessibles:
   ```javascript
   // Dans la console
   fetch('https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/blog/posts?lang=fr', {
     headers: {
       'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y3hlcXRqbHhpdHR4YXlmZmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY1MjYsImV4cCI6MjA3Nzg4MjUyNn0.4xmzyoXUxas6587ZFWWc95p10bNSa2MdaipYI7RHmZc'
     }
   }).then(r => r.json()).then(console.log);
   ```

2. Si la route retourne un tableau vide:
   - Utilisez les boutons "Initialiser" dans le Dashboard
   - Ou appelez les endpoints de seeding

---

### Problème 4: Erreurs CORS

**Symptôme:**
```
Access to fetch at '...' has been blocked by CORS policy
```

**Solution:**
Vérifiez que `FRONTEND_URL` est configurée correctement:

```bash
# Pour développement local
supabase secrets set FRONTEND_URL="http://localhost:5173"

# Pour production
supabase secrets set FRONTEND_URL="https://votre-domaine.com"

# Pour accepter toutes les origines (dev seulement)
supabase secrets set FRONTEND_URL="*"
```

Puis redéployez:
```bash
supabase functions deploy server --no-verify-jwt
```

---

## 📊 Checklist Complète

Avant de déclarer le serveur opérationnel:

- [ ] Health check retourne 200 OK
- [ ] Blog posts accessible (même si vide)
- [ ] Newsletter stats accessible
- [ ] Projects accessible
- [ ] Pas d'erreurs CORS
- [ ] Logs serveur sans erreurs
- [ ] Fallback local fonctionne

---

## 🔗 Liens Rapides

**Dashboard Supabase:**
https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu

**Logs Edge Functions:**
https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/logs/edge-functions

**Variables d'environnement:**
https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/settings/functions

**SQL Editor:**
https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/editor

**Functions:**
https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions

---

## 💡 Astuces Pro

### 1. Mode Local Automatique
Votre app a un système de fallback automatique. Si le serveur ne répond pas, l'app passera en mode local automatiquement. Vous verrez des messages dans la console:
```
⚠️ Serveur non disponible, passage en mode local
```

### 2. Vérifier le Mode Actuel
Dans la console du navigateur:
```javascript
// Importer le service
import { getServerMode } from './utils/serverService';

// Vérifier le mode
console.log('Mode actuel:', getServerMode());
// "server" | "local" | "checking"
```

### 3. Forcer un Re-check
Si vous venez de déployer et que l'app est encore en mode local:
```javascript
import { resetServerCheck, checkServerAvailability } from './utils/serverService';

resetServerCheck();
await checkServerAvailability();
// L'app va re-tester le serveur
```

### 4. Debug avec les Network DevTools
1. Ouvrez F12 → Network
2. Filtrez par "make-server-04919ac5"
3. Vous verrez toutes les requêtes API
4. Cliquez sur une requête pour voir les détails

---

## 🆘 Besoin d'Aide ?

### Documentation Complète
Consultez: `DIAGNOSTIC_SERVEUR_APRES_DEPLOIEMENT.md`

### Commandes CLI Essentielles
```bash
# Voir les logs
supabase functions logs server --tail

# Redéployer
supabase functions deploy server --no-verify-jwt

# Lister les fonctions
supabase functions list

# Voir les secrets
supabase secrets list
```

### Test Automatique
Exécutez dans la console du navigateur:
```javascript
// Importez le test
import { quickServerTest } from './utils/quickServerTest';

// Lancez le test
await quickServerTest();
```

---

## ✅ Statut Final

Une fois tout vérifié:

**Serveur:** ✅ OK / ❌ KO / ⚠️ Partiel  
**Blog:** ✅ OK / ❌ KO / ⚠️ Vide  
**Newsletter:** ✅ OK / ❌ KO  
**Mode Fallback:** ✅ OK / ❌ KO  

**Notes:** _______________________

**Date:** 7 novembre 2025  
**Project ID:** ptcxeqtjlxittxayffgu
