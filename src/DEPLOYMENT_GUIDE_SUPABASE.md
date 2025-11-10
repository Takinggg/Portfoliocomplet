# 🚀 Guide de Déploiement - Serveur Supabase Edge Function

## ❌ Problème Actuel

L'erreur "Serveur Supabase non disponible" indique que le serveur Edge Function n'est **pas déployé** ou **inaccessible**.

### Diagnostic Rapide

Testez manuellement la connexion au serveur dans la console du navigateur:

```javascript
// Test 1: Health check
fetch('https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health')
  .then(r => r.json())
  .then(data => console.log('✅ Serveur disponible:', data))
  .catch(e => console.error('❌ Serveur indisponible:', e));
```

**Si vous voyez une erreur**, le serveur n'est pas déployé. Suivez les instructions ci-dessous.

---

## ✅ Solution 1 : Déployer le Serveur Edge Function (Recommandé)

### Prérequis

1. **Supabase CLI** installé ([documentation](https://supabase.com/docs/guides/cli))
2. **Compte Supabase** avec accès au projet `ptcxeqtjlxittxayffgu`

### Étapes de Déploiement

#### 1. Installer Supabase CLI (si pas déjà fait)

```bash
# macOS / Linux
brew install supabase/tap/supabase

# Windows (avec Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# NPM (toutes plateformes)
npm install -g supabase
```

#### 2. Login à Supabase

```bash
supabase login
```

Cela ouvrira un navigateur pour vous authentifier.

#### 3. Lier votre projet local

```bash
# Lier au projet Supabase existant
supabase link --project-ref ptcxeqtjlxittxayffgu
```

Entrez votre mot de passe de base de données quand demandé.

#### 4. Déployer la Edge Function

```bash
# Déployer le serveur
supabase functions deploy make-server-04919ac5

# Ou depuis le dossier spécifique
cd supabase/functions/server
supabase functions deploy make-server-04919ac5
```

#### 5. Vérifier le Déploiement

```bash
# Vérifier les logs
supabase functions logs make-server-04919ac5

# Ou tester directement
curl https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health
```

### Configuration des Secrets (Variables d'Environnement)

Le serveur nécessite certaines variables d'environnement:

```bash
# RESEND_API_KEY (pour l'envoi d'emails)
supabase secrets set RESEND_API_KEY=re_123456789

# ADMIN_PASSWORD (optionnel - pour l'admin initial)
supabase secrets set ADMIN_PASSWORD=votre_mot_de_passe_securise

# FRONTEND_URL (pour les liens dans les emails)
supabase secrets set FRONTEND_URL=https://votre-domaine.com
```

Les variables `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, et `SUPABASE_DB_URL` sont déjà configurées automatiquement par Supabase.

---

## ✅ Solution 2 : Déploiement via l'Interface Supabase Dashboard

Si vous préférez utiliser l'interface web:

1. **Connectez-vous** à [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet `ptcxeqtjlxittxayffgu`
3. Allez dans **Edge Functions** dans le menu latéral
4. Cliquez sur **Create new function**
5. Nommez-la `make-server-04919ac5`
6. Copiez le contenu du fichier `/supabase/functions/server/index.tsx`
7. Cliquez sur **Deploy**

### Configurer les Secrets via le Dashboard

1. Dans la section **Edge Functions**, cliquez sur votre fonction
2. Allez dans l'onglet **Secrets**
3. Ajoutez les secrets nécessaires:
   - `RESEND_API_KEY` (si vous utilisez l'envoi d'emails)
   - `ADMIN_PASSWORD` (optionnel)
   - `FRONTEND_URL`

---

## ✅ Solution 3 : Vérification de la Configuration CORS

Si le serveur est déployé mais inaccessible depuis le frontend, vérifiez la configuration CORS.

Le serveur est déjà configuré avec CORS permissif:

```typescript
app.use("/*", cors({
  origin: "*", // Accepter toutes les origines (requis pour Figma Make)
  allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: false,
  maxAge: 86400,
}));
```

Si vous rencontrez toujours des problèmes, vérifiez:

1. **Firewall / Bloqueur de publicité** : Désactivez temporairement pour tester
2. **Console du navigateur** : Vérifiez les messages d'erreur CORS
3. **Logs Supabase** : `supabase functions logs make-server-04919ac5`

---

## 🧪 Tester Après le Déploiement

### Test 1: Health Check

```javascript
fetch('https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Serveur disponible:', data);
    // Devrait afficher: { success: true, message: "Server is running - CONSOLIDATED VERSION", ... }
  })
  .catch(e => console.error('❌ Erreur:', e));
```

### Test 2: Charger les Case Studies

```javascript
fetch('https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/case-studies', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y3hlcXRqbHhpdHR4YXlmZmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY1MjYsImV4cCI6MjA3Nzg4MjUyNn0.4xmzyoXUxas6587ZFWWc95p10bNSa2MdaipYI7RHmZc'
  }
})
  .then(r => r.json())
  .then(data => {
    console.log('✅ Case studies chargées:', data);
    console.log('📊 Nombre:', data.length);
  })
  .catch(e => console.error('❌ Erreur:', e));
```

### Test 3: Service Unifié

```javascript
import("./utils/unifiedDataService.js").then(async (service) => {
  const isConnected = await service.checkServerConnection();
  console.log('🔌 Connexion serveur:', isConnected);
  console.log('📍 Mode actuel:', service.getCurrentMode());
  
  if (isConnected) {
    try {
      const caseStudies = await service.fetchCaseStudies();
      console.log('✅ Case studies via service unifié:', caseStudies.length);
    } catch (error) {
      console.error('❌ Erreur service unifié:', error.message);
    }
  }
});
```

---

## 📋 Checklist Post-Déploiement

Après avoir déployé le serveur, vérifiez que tout fonctionne:

- [ ] **Health check** retourne `success: true`
- [ ] **Case studies** peuvent être chargées (GET `/case-studies`)
- [ ] **Blog posts** peuvent être chargés (GET `/blog/posts`)
- [ ] **Resources** peuvent être chargées (GET `/resources`)
- [ ] **Authentication** fonctionne (POST `/auth/login`)
- [ ] **Dashboard** peut créer/modifier/supprimer des données (authentification requise)

---

## 🐛 Troubleshooting

### Erreur: "function not found"

**Cause:** La fonction n'est pas déployée ou le nom est incorrect.

**Solution:**
```bash
# Lister les fonctions déployées
supabase functions list

# Redéployer
supabase functions deploy make-server-04919ac5
```

### Erreur: "Unauthorized" lors des opérations CRUD

**Cause:** Token d'authentification manquant ou invalide.

**Solution:**
1. Vérifiez que vous êtes connecté au dashboard
2. Vérifiez le token dans la console:
```javascript
import { createClient } from "./utils/supabase/client";
const supabase = createClient();
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

### Erreur: "CORS policy blocked"

**Cause:** Configuration CORS du navigateur ou firewall.

**Solution:**
1. Vérifiez que le serveur est déployé avec la config CORS correcte
2. Testez depuis un autre navigateur
3. Désactivez temporairement les extensions de sécurité

### Base de données vide

**Cause:** Aucune donnée n'a été ajoutée après le déploiement.

**Solution:** Utilisez le bouton "Initialiser" dans le dashboard CaseStudiesTab pour ajouter des données de démonstration.

---

## 📚 Ressources Supplémentaires

- [Documentation Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Guide Déploiement Edge Functions](https://supabase.com/docs/guides/functions/deploy)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)
- [Guide Troubleshooting](https://supabase.com/docs/guides/functions/troubleshooting)

---

## 💡 Note Importante

Une fois le serveur déployé, l'application utilisera **EXCLUSIVEMENT** Supabase pour toutes les données. Il n'y a **aucun fallback** localStorage. Si le serveur est indisponible, l'application affichera des messages d'erreur clairs demandant de vérifier la connexion.

C'est le comportement souhaité pour garantir que toutes les données sont centralisées et synchronisées via Supabase.
