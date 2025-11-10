# ✅ CHECKLIST DE DÉPLOIEMENT - Portfolio Full-Stack

Utilisez cette checklist pour déployer votre application étape par étape.

---

## 📋 AVANT DE COMMENCER

### Prérequis

- [ ] Compte Supabase créé sur https://supabase.com
- [ ] Projet Supabase créé
- [ ] Node.js installé (v18 ou supérieur)
- [ ] Git installé

---

## 🔧 PARTIE 1 : CONFIGURATION LOCALE

### Étape 1.1 : Vérifier les Clés Supabase

- [ ] Ouvrir `/utils/supabase/info.tsx`
- [ ] Remplacer `projectId` par votre vrai ID
- [ ] Remplacer `publicAnonKey` par votre vraie clé

**Où trouver ces valeurs ?**
→ https://app.supabase.com > Votre Projet > Settings > API

### Étape 1.2 : Test Local

- [ ] Lancer l'app : `npm run dev`
- [ ] Ouvrir http://localhost:5173
- [ ] Vérifier que l'app charge sans erreur
- [ ] Ouvrir la console (F12) pour voir les logs

**Résultat attendu :** 
```
⚠️ Serveur Supabase non disponible (normal à ce stade)
```

---

## 🗄️ PARTIE 2 : BASE DE DONNÉES

### Étape 2.1 : Créer la Table KV Store

- [ ] Aller sur https://app.supabase.com
- [ ] Sélectionner votre projet
- [ ] Cliquer sur "SQL Editor" (menu gauche)
- [ ] Cliquer sur "New Query"
- [ ] Copier-coller le SQL de `/supabase_setup.sql`
- [ ] Cliquer sur "Run" (ou CTRL+Enter)
- [ ] Vérifier le message : ✅ "Success. No rows returned"

### Étape 2.2 : Vérifier la Table

- [ ] Aller dans "Table Editor"
- [ ] Vérifier que `kv_store_04919ac5` existe
- [ ] Vérifier les colonnes : `key`, `value`, `created_at`, `updated_at`

---

## ☁️ PARTIE 3 : SERVEUR EDGE FUNCTION

### Étape 3.1 : Installer le CLI Supabase

```bash
npm install -g supabase
```

- [ ] Vérifier l'installation : `supabase --version`

### Étape 3.2 : Se Connecter

```bash
supabase login
```

- [ ] Une page de connexion s'ouvre dans le navigateur
- [ ] Se connecter avec votre compte Supabase
- [ ] Retourner au terminal, vérifier : ✅ "Logged in"

### Étape 3.3 : Lier le Projet

```bash
supabase link --project-ref [VOTRE-PROJECT-ID]
```

- [ ] Remplacer `[VOTRE-PROJECT-ID]` par votre vrai ID
- [ ] Vérifier : ✅ "Linked to [project-name]"

**Où trouver le Project ID ?**
→ Dans l'URL : `https://app.supabase.com/project/[ID]`
→ Ou Settings > General > Reference ID

### Étape 3.4 : Déployer le Serveur

```bash
supabase functions deploy make-server-04919ac5
```

- [ ] Attendre la fin du déploiement (30-60 secondes)
- [ ] Vérifier : ✅ "Deployed successfully"
- [ ] Noter l'URL affichée

---

## ✅ PARTIE 4 : VÉRIFICATIONS

### Test 1 : Health Endpoint

```bash
curl https://[VOTRE-PROJECT-ID].supabase.co/functions/v1/make-server-04919ac5/health
```

- [ ] Remplacer `[VOTRE-PROJECT-ID]`
- [ ] Résultat attendu : `{"status":"healthy",...}`

**Si erreur 404 :** Le serveur n'est pas déployé → Refaire Étape 3.4

**Si erreur 401 :** Problème de clé API → Vérifier Étape 1.1

### Test 2 : Application

- [ ] Recharger l'application (F5)
- [ ] Ouvrir la console (F12)
- [ ] Vérifier les logs :
  - `✅ Serveur Supabase connecté`
  - `Version serveur: consolidated-v1`
  - `✅ Compte admin: ...`

**Si "Serveur non disponible" :** 
→ Vérifier que le health endpoint fonctionne (Test 1)
→ Vérifier les clés dans `/utils/supabase/info.tsx`

### Test 3 : Connexion Dashboard

- [ ] Aller à `/login` dans l'application
- [ ] Email (pré-rempli) : `contact@maxence.design`
- [ ] Mot de passe : `vbz657D9`
- [ ] Cliquer sur "Se connecter"
- [ ] Vérifier : ✅ Redirection vers `/dashboard`

**Si "Invalid login credentials" :**

**Option A - Auto (recommandé) :**
- [ ] Attendre 3 secondes après le chargement de la page
- [ ] Vérifier la console : `✅ Compte admin: Admin account created`
- [ ] Réessayer la connexion

**Option B - Manuel :**
- [ ] Supabase Dashboard > Authentication > Users
- [ ] Cliquer sur "Add User"
- [ ] Email : `contact@maxence.design`
- [ ] Password : `vbz657D9`
- [ ] Cocher "Auto Confirm User"
- [ ] Cliquer sur "Create User"
- [ ] Réessayer la connexion

### Test 4 : Dashboard Fonctionnel

- [ ] Dashboard > Case Studies
  - Vérifier : Pas d'erreur
  - Vérifier : Bouton "+" visible
  - Vérifier : Liste vide ou avec données

- [ ] Dashboard > Blog
  - Vérifier : Pas d'erreur
  - Vérifier : Bouton "Nouvel Article" visible
  - Vérifier : Liste vide ou avec articles

- [ ] Dashboard > Clients
  - Vérifier : Interface charge correctement

**Si erreurs :**
→ Consulter `/ERREURS_COMMUNES_ET_SOLUTIONS.md`

---

## 🎨 PARTIE 5 : CONTENU INITIAL

### Optionnel : Données de Démonstration

Pour avoir des données de test, exécutez dans la console (F12) :

```javascript
// Case Studies de démo
import { seedBilingualCaseStudies } from './utils/seedBilingualCaseStudies';
await seedBilingualCaseStudies();
```

- [ ] Console ouverte (F12)
- [ ] Copier-coller le code ci-dessus
- [ ] Appuyer sur Enter
- [ ] Vérifier : ✅ "Seeding completed"
- [ ] Recharger Dashboard > Case Studies
- [ ] Vérifier : 3-5 case studies apparaissent

---

## 🚀 PARTIE 6 : DÉPLOIEMENT FRONTEND (Vercel)

### Si Utilisation de Vercel

- [ ] Créer un compte Vercel (vercel.com)
- [ ] Connecter votre repository Git
- [ ] Configurer les variables d'environnement (pas nécessaire, déjà dans le code)
- [ ] Déployer
- [ ] Vérifier l'URL de production

### Variables d'Environnement (Optionnel)

Si vous voulez utiliser des variables d'environnement au lieu des valeurs en dur :

**Créer dans Vercel :**
- `VITE_SUPABASE_PROJECT_ID` = votre-project-id
- `VITE_SUPABASE_ANON_KEY` = votre-anon-key

**Modifier `/utils/supabase/info.tsx` :**
```typescript
export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || "fallback-id";
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "fallback-key";
```

---

## 🔐 PARTIE 7 : SÉCURITÉ

### Post-Déploiement

- [ ] Changer le mot de passe admin
  - Dashboard > Settings (à implémenter)
  - Ou via Supabase : Authentication > Users > Reset Password

- [ ] Configurer les politiques RLS (Row Level Security)
  - Supabase > Authentication > Policies
  - Créer des règles d'accès aux données

- [ ] Activer 2FA sur Supabase
  - Settings > Account > Two-Factor Authentication

- [ ] Backup régulier
  - Supabase fait des backups automatiques
  - Configurer : Settings > Database > Backups

---

## 📊 RÉCAPITULATIF FINAL

### ✅ Checklist Complète

- [ ] Clés Supabase configurées
- [ ] App locale fonctionne
- [ ] Table KV Store créée
- [ ] CLI Supabase installé
- [ ] Serveur Edge Function déployé
- [ ] Health endpoint répond 200
- [ ] Application connectée au serveur
- [ ] Compte admin créé
- [ ] Login fonctionne
- [ ] Dashboard accessible
- [ ] Case Studies fonctionne
- [ ] Blog fonctionne
- [ ] (Optionnel) Données de démo chargées
- [ ] (Optionnel) Frontend déployé sur Vercel
- [ ] Mot de passe changé

### 🎉 SI TOUT EST COCHÉ : FÉLICITATIONS !

Votre portfolio full-stack est déployé et opérationnel !

---

## 🆘 EN CAS DE PROBLÈME

### Logs & Debugging

**Logs serveur :**
```bash
supabase functions logs make-server-04919ac5
```

**Logs application :**
- F12 > Console (dans le navigateur)

**Tester les endpoints :**
```bash
# Health
curl https://[id].supabase.co/.../health

# Projects
curl https://[id].supabase.co/.../projects

# Blog
curl https://[id].supabase.co/.../blog/posts
```

### Documentation

| Problème | Consulter |
|----------|-----------|
| Erreur spécifique | `/ERREURS_COMMUNES_ET_SOLUTIONS.md` |
| Démarrage rapide | `/DEMARRAGE_RAPIDE.md` |
| Guide complet | `/DEPLOIEMENT_SUPABASE_FINAL.md` |
| Architecture | `/MIGRATION_FULL_DB_COMPLETE.md` |

---

## 📞 SUPPORT

### Commandes Utiles

```bash
# Voir les fonctions déployées
supabase functions list

# Voir les logs en temps réel
supabase functions logs make-server-04919ac5 --follow

# Redéployer
supabase functions deploy make-server-04919ac5

# Tester localement (optionnel)
supabase functions serve make-server-04919ac5
```

---

**Temps total estimé :** 10-15 minutes

**Difficulté :** Facile à Moyenne

**Statut :** ✅ Ready to Deploy

Bonne chance ! 🚀
