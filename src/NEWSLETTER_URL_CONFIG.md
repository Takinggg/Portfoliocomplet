# 🔧 Configuration FRONTEND_URL pour la Newsletter

## Problème actuel

L'email de confirmation de la newsletter affiche une URL invalide comme :
```
[vbz657D9?newsletter_confirm=a73c3a5-924e-4b29-a782-5c073686786a]
```

Au lieu de :
```
https://ton-site.com?newsletter_confirm=a73c3a5-924e-4b29-a782-5c073686786a
```

## Cause

La variable d'environnement `FRONTEND_URL` n'est pas correctement configurée dans Supabase.

## Solution : Configurer FRONTEND_URL

### Option 1 : Via le Dashboard Supabase (Recommandé)

1. **Ouvre ton projet Supabase** : https://supabase.com/dashboard
2. **Va dans "Edge Functions"** (menu de gauche)
3. **Clique sur ta fonction "server"**
4. **Va dans l'onglet "Settings"** ou "Secrets"
5. **Ajoute/Modifie la variable d'environnement** :
   - **Nom** : `FRONTEND_URL`
   - **Valeur** : `https://ton-domaine.com` (remplace par l'URL réelle de ton site)
   
   **Exemples de valeurs valides :**
   - Production : `https://maxence.design`
   - Netlify : `https://ton-site.netlify.app`
   - Vercel : `https://ton-site.vercel.app`
   - Localhost (dev) : `http://localhost:5173`

6. **Redémarre la fonction** (si nécessaire)

### Option 2 : Via CLI Supabase

```bash
# Set la variable d'environnement
supabase secrets set FRONTEND_URL=https://ton-domaine.com

# Redéploie la fonction
supabase functions deploy server
```

## Validation de la correction

### 1. Check les logs
Après avoir configuré `FRONTEND_URL`, inscris-toi à la newsletter et vérifie les logs Supabase :

```
📧 Newsletter confirmation email:
   → To: email@example.com
   → Frontend URL (raw): https://ton-domaine.com
   → Frontend URL (fixed): https://ton-domaine.com
   → Token: a73c3a5-924e-4b29-a782-5c073686786a
   → Full URL: https://ton-domaine.com?newsletter_confirm=a73c3a5-924e-4b29-a782-5c073686786a
```

✅ L'URL doit commencer par `http://` ou `https://`

### 2. Vérifie l'email
L'email doit maintenant afficher :
- Un **bouton vert cliquable** "✓ Confirmer mon abonnement"
- En dessous : "Si le bouton ne fonctionne pas, copiez ce lien..."
- Une **URL complète et cliquable** : `https://ton-domaine.com?newsletter_confirm=...`

### 3. Test de confirmation
1. Clique sur le bouton ou le lien
2. Tu dois être redirigé vers ton site
3. Un message de succès s'affiche : "✅ Votre inscription à la newsletter est confirmée !"

## Code de validation automatique

Le serveur valide maintenant automatiquement la `FRONTEND_URL` :

- ✅ Ajoute `https://` si manquant
- ✅ Supprime le slash final `/`
- ✅ Utilise `http://localhost:5173` en fallback si non défini
- ✅ Log l'URL brute et l'URL corrigée pour debug

## Important : Environnements multiples

Si tu as plusieurs environnements :

**Development (local)** :
```bash
FRONTEND_URL=http://localhost:5173
```

**Staging** :
```bash
FRONTEND_URL=https://staging.ton-domaine.com
```

**Production** :
```bash
FRONTEND_URL=https://ton-domaine.com
```

Configure la variable différemment pour chaque environnement dans Supabase.

## Troubleshooting

### L'URL affiche encore `localhost` en production
➡️ Tu as oublié de configurer `FRONTEND_URL` dans Supabase Edge Functions

### L'URL est correcte mais le bouton n'est pas cliquable
➡️ Problème de client email - utilise le lien texte en dessous du bouton

### Erreur 404 après avoir cliqué sur le lien
➡️ Vérifie que le composant `NewsletterConfirmPage` est bien configuré dans ton routeur

### Le token est invalide
➡️ Le token expire après utilisation - réinscris-toi pour obtenir un nouveau lien

## Prochaine étape

Une fois `FRONTEND_URL` configuré correctement :
1. ✅ L'email contiendra une URL valide
2. ✅ Le bouton sera cliquable
3. ✅ La confirmation fonctionnera automatiquement
4. ✅ Le système newsletter sera 100% opérationnel ! 🚀
