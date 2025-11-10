# 🔴 Erreur : Failed to Fetch

## Que s'est-il passé ?

L'application essaie de contacter le serveur Supabase Edge Function, mais celui-ci **n'est pas déployé**.

## Symptômes

```
❌ Error initializing admin: TypeError: Failed to fetch
❌ Failed to load subscriber count: TypeError: Failed to fetch
❌ Error fetching pinned projects: TypeError: Failed to fetch
❌ Cannot connect to server
```

## Pourquoi ?

Le serveur a été **simplifié de 3114 lignes à 210 lignes** pour résoudre les problèmes précédents. C'est maintenant un nouveau fichier qui doit être **redéployé sur Supabase**.

## Solution immédiate

### 🚀 Méthode 1 : CLI (30 secondes)

```bash
npm install -g supabase
supabase login
supabase link --project-ref ptcxeqtjlxittxayffgu
supabase functions deploy server
```

### 🌐 Méthode 2 : Dashboard (2 minutes)

1. Ouvrir : https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions
2. Créer fonction : `make-server-04919ac5`
3. Copier `/supabase/functions/server/index.tsx`
4. Copier `/supabase/functions/server/kv_store.tsx`
5. Deploy

### 🧪 Méthode 3 : Script automatique

```bash
chmod +x deploy.sh
./deploy.sh
```

## Vérification

Dans la console du navigateur (F12) :

```javascript
testServerConnection()
```

Résultat attendu :
```
✅ Serveur OPÉRATIONNEL!
   Version: simplified-v1
   Message: Server is running
```

## Que fait le nouveau serveur ?

Le serveur simplifié contient **6 endpoints essentiels** :

1. ✅ `GET /health` - Vérification de santé
2. ✅ `POST /auth/init-admin` - Initialisation admin
3. ✅ `POST /auth/login` - Connexion
4. ✅ `GET /newsletter/stats` - Statistiques newsletter
5. ✅ `GET /projects` - Liste des projets
6. ✅ `GET /projects/:id` - Détail d'un projet

**Total : 210 lignes** (vs 3114 avant)

## Après le déploiement

Une fois déployé, vous verrez :

1. ✅ **Alerte verte** en haut à droite : "Serveur connecté"
2. ✅ **Console** : "✅ Serveur Edge Function opérationnel"
3. ✅ **Plus d'erreurs** "Failed to fetch"

## Aide

- **Console** : `deployServer()` - Instructions détaillées
- **Test** : `testServerConnection()` - Vérifier le statut
- **Docs** : `/DEPLOYER_SERVEUR.md` - Guide complet
- **Dashboard** : https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu

## Notes importantes

- Le serveur n'a **plus les fonctionnalités avancées** (temporairement)
- Elles seront **réintégrées progressivement** une fois la stabilité confirmée
- Pour l'instant, seules les **fonctionnalités essentielles** sont disponibles

---

**TL;DR** : Exécutez `supabase functions deploy server` ou suivez les instructions dans la console.
