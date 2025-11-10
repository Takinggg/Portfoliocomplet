# 🚀 Déploiement du Serveur via Supabase CLI

## Le Problème
Le dashboard Supabase ne peut pas déployer un serveur avec plusieurs fichiers.
Votre serveur dans `/supabase/functions/server/` a des imports:
- `./kv_store.tsx`
- `./email_service.tsx`
- `./analytics.tsx`
- etc.

Le dashboard attend UN SEUL FICHIER standalone.

## La Solution : Supabase CLI

### Étape 1: Installer Supabase CLI

**Sur Windows (PowerShell) :**
```powershell
scoop install supabase
```

**Sur Mac/Linux :**
```bash
brew install supabase/tap/supabase
```

**Ou avec NPM :**
```bash
npm install -g supabase
```

### Étape 2: Se connecter à Supabase

```bash
supabase login
```

Cela va ouvrir votre navigateur pour vous connecter.

### Étape 3: Lier le projet

```bash
supabase link --project-ref ptcxeqtjlxittxayffgu
```

Entrez votre mot de passe de base de données si demandé.

### Étape 4: Renommer la fonction

Le serveur doit s'appeler `make-server-04919ac5` mais il est dans `/supabase/functions/server/`.

**Option A : Renommer le dossier**
```bash
# Dans votre terminal, depuis la racine du projet
mv supabase/functions/server supabase/functions/make-server-04919ac5
```

**Option B : Créer un alias**
Gardez le dossier `server` mais déployez-le sous le nom `make-server-04919ac5`:
```bash
supabase functions deploy make-server-04919ac5 --import-map supabase/functions/server/import_map.json
```

### Étape 5: Déployer

```bash
supabase functions deploy make-server-04919ac5 --no-verify-jwt
```

Le flag `--no-verify-jwt` permet d'utiliser le publicAnonKey sans vérification stricte.

### Étape 6: Vérifier

```bash
# Voir les logs en temps réel
supabase functions logs make-server-04919ac5 --tail

# Tester
curl -i https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y3hlcXRqbHhpdHR4YXlmZmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY1MjYsImV4cCI6MjA3Nzg4MjUyNn0.4xmzyoXUxas6587ZFWWc95p10bNSa2MdaipYI7RHmZc"
```

---

## Alternative : Version Dashboard (Ultra Simple)

Si vous ne pouvez PAS utiliser CLI, je peux créer une version 100% standalone sans imports.

Voulez-vous :
- **A)** Utiliser Supabase CLI (recommandé, plus puissant)
- **B)** Version dashboard ultra-simple (sans emails, sans analytics)

---

## Problème CORS actuel

Le serveur actuel ne répond pas du tout aux requêtes OPTIONS (preflight).
C'est pourquoi le CORS échoue.

Une fois déployé avec CLI, le CORS sera configuré et tout fonctionnera ! ✅
