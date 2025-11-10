# 🚀 Guide de déploiement du serveur Edge Function

## ⚠️ PROBLÈME ACTUEL

Les erreurs "TypeError: Failed to fetch" indiquent que le **serveur Edge Function n'est pas déployé** sur Supabase.

```
❌ Error initializing admin: TypeError: Failed to fetch
❌ Failed to load subscriber count: TypeError: Failed to fetch  
❌ Error fetching pinned projects: TypeError: Failed to fetch
```

## ✅ SOLUTION : Déployer le serveur

### Option 1 : Déploiement via Supabase CLI (RECOMMANDÉ)

1. **Installer Supabase CLI** si ce n'est pas déjà fait :
   ```bash
   npm install -g supabase
   ```

2. **Se connecter à Supabase** :
   ```bash
   supabase login
   ```

3. **Lier le projet** :
   ```bash
   supabase link --project-ref ptcxeqtjlxittxayffgu
   ```

4. **Déployer la fonction** :
   ```bash
   supabase functions deploy server
   ```

5. **Vérifier le déploiement** :
   ```bash
   supabase functions list
   ```

### Option 2 : Déploiement via le Dashboard Supabase

1. **Aller dans le dashboard** :
   https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions

2. **Créer une nouvelle fonction** :
   - Cliquer sur "Create function"
   - Nom : `make-server-04919ac5`
   - Région : choisir la plus proche

3. **Copier le code** :
   - Ouvrir `/supabase/functions/server/index.tsx`
   - Copier tout le contenu
   - Coller dans l'éditeur du dashboard

4. **Déployer** :
   - Cliquer sur "Deploy function"
   - Attendre la fin du déploiement

### Option 3 : Copier-coller manuel depuis l'interface

Si vous ne pouvez pas utiliser CLI, voici le code complet à copier :

**Fichier : `/supabase/functions/server/index.tsx`**

Le serveur simplifié fait seulement 210 lignes. Copiez tout le contenu du fichier `/supabase/functions/server/index.tsx` et collez-le dans l'éditeur Edge Functions de Supabase.

**Important** : Vous devez aussi copier le fichier `kv_store.tsx` dans le même dossier.

## 🔧 Vérifier que ça fonctionne

### Test 1 : Health Check

Ouvrez la console du navigateur et exécutez :

```javascript
fetch('https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y3hlcXRqbHhpdHR4YXlmZmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY1MjYsImV4cCI6MjA3Nzg4MjUyNn0.4xmzyoXUxas6587ZFWWc95p10bNSa2MdaipYI7RHmZc'
  }
})
.then(r => r.json())
.then(d => console.log('✅ Server OK:', d))
.catch(e => console.error('❌ Server error:', e));
```

**Résultat attendu** :
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-07T...",
  "version": "simplified-v1"
}
```

### Test 2 : Script de test complet

Importez et exécutez le script de test :

```javascript
// Dans la console du navigateur
import('/utils/serverHealthCheck.ts');
```

Ou exécutez :

```javascript
import('/utils/testServerConnection.ts');
```

## 📋 Variables d'environnement

Assurez-vous que ces variables sont définies dans Supabase :

1. Allez dans **Settings > Edge Functions > Environment Variables**

2. Vérifiez que ces variables existent :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD` (optionnel, valeur par défaut : vbz657D9)
   - `FRONTEND_URL` (optionnel, valeur par défaut : *)

3. Si elles n'existent pas, créez-les.

## 🐛 Dépannage

### Erreur : "Failed to fetch"

**Cause** : Le serveur n'est pas déployé ou ne répond pas.

**Solution** :
1. Vérifier que la fonction est déployée dans le dashboard
2. Consulter les logs : https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/logs/edge-functions
3. Redéployer la fonction

### Erreur : "CORS"

**Cause** : Les headers CORS ne sont pas corrects.

**Solution** : Le serveur simplifié autorise déjà `*` en développement. Si le problème persiste, vérifiez que `FRONTEND_URL` est défini à `*`.

### Erreur : "Unauthorized"

**Cause** : Le token d'autorisation est invalide.

**Solution** : Vérifiez que vous utilisez bien `publicAnonKey` dans les requêtes.

### Le serveur ne démarre pas

**Cause** : Erreur de syntaxe TypeScript ou import manquant.

**Solution** :
1. Consultez les logs Edge Functions dans le dashboard
2. Vérifiez que `kv_store.tsx` est bien présent
3. Assurez-vous que toutes les dépendances sont correctes

## 📊 Logs

Pour voir les logs du serveur :

1. Allez dans le dashboard : https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/logs/edge-functions

2. Cherchez ces messages au démarrage :
   ```
   🚀 Starting simplified server...
   ✅ Simplified server configured
   📍 Essential routes:
      - GET  /make-server-04919ac5/health
      - POST /make-server-04919ac5/auth/init-admin
      - POST /make-server-04919ac5/auth/login
      - GET  /make-server-04919ac5/newsletter/stats
      - GET  /make-server-04919ac5/projects
      - GET  /make-server-04919ac5/projects/:id
   ```

3. Si vous ne voyez pas ces messages, le serveur n'a pas démarré correctement.

## 🎯 Checklist de déploiement

- [ ] Le serveur est déployé dans Supabase Edge Functions
- [ ] Les variables d'environnement sont configurées
- [ ] Le health check renvoie un succès
- [ ] Les logs montrent que le serveur a démarré
- [ ] L'application ne montre plus d'erreurs "Failed to fetch"

## 🆘 Support

Si le problème persiste :

1. **Vérifier le statut de Supabase** : https://status.supabase.com
2. **Consulter la documentation** : https://supabase.com/docs/guides/functions
3. **Vérifier les logs** pour des erreurs spécifiques
4. **Réessayer** le déploiement après quelques minutes

## 📝 Notes importantes

- Le serveur simplifié fait **210 lignes** au lieu de 3114
- Il contient uniquement les **6 endpoints essentiels**
- Toutes les fonctionnalités non critiques ont été retirées temporairement
- Une fois le serveur fonctionnel, les fonctionnalités pourront être réintégrées progressivement

---

**Dernière mise à jour** : 7 novembre 2025  
**Version du serveur** : simplified-v1
