# 🚀 Guide de Déploiement du Backend Supabase

## Problème actuel
L'endpoint `https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/projects` retourne **404 Not Found** car la fonction Edge n'est pas déployée.

## Solution : Déployer la fonction Edge

### 1. **Prérequis**
- Compte Supabase avec projet `ptcxeqtjlxittxayffgu`
- Supabase CLI installé
- Token d'accès Supabase

### 2. **Commandes de déploiement**

```bash
# 1. Lier le projet Supabase
npx supabase link --project-ref ptcxeqtjlxittxayffgu

# 2. Déployer la fonction Edge
npx supabase functions deploy make-server-04919ac5 --project-ref ptcxeqtjlxittxayffgu

# 3. Vérifier le déploiement
curl https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/projects
```

### 3. **Variables d'environnement nécessaires**

Sur Supabase Dashboard > Edge Functions > Secrets :

```
SUPABASE_URL=https://ptcxeqtjlxittxayffgu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... (clé service role)
SUPABASE_ANON_KEY=eyJ... (clé publique)
RESEND_API_KEY=re_... (pour emails)
ADMIN_PASSWORD=vbz657D9
STRIPE_SECRET_KEY=sk_... (pour paiements)
STRIPE_WEBHOOK_SECRET=whsec_... (pour webhooks)
FRONTEND_URL=https://votre-domaine.com
```

### 4. **Structure requise**

La fonction est dans : `src/supabase/functions/server/index.tsx`
Elle doit être déployée comme : `make-server-04919ac5`

### 5. **Test après déploiement**

```bash
# Test endpoint projects
curl -X GET https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/projects

# Test endpoint health
curl -X GET https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health
```

## 🆘 Alternative temporaire

En attendant le déploiement, vous pouvez :

1. **Mode offline** : Utiliser le localStorage uniquement
2. **Mock API** : Créer des réponses factices
3. **Serveur local** : Démarrer un serveur Node.js local

## 📞 Support

Si vous avez besoin d'aide pour le déploiement :
1. Vérifiez vos accès Supabase Dashboard
2. Assurez-vous d'avoir les permissions de déploiement
3. Contactez l'équipe si problème de token