# 🔑 Configuration Rapide des Clés Supabase

## ❌ Problème Actuel
Erreur: `Invalid API key` - Les clés Supabase dans `.env` ne sont pas valides.

## ✅ Solution

### Étape 1 : Récupérer vos vraies clés

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet `ptcxeqtjlxittxayffgu`
3. Dans le menu gauche, cliquez sur **⚙️ Settings**
4. Cliquez sur **API**
5. Copiez les valeurs suivantes :

```
Project URL: https://ptcxeqtjlxittxayffgu.supabase.co
anon/public (anon key): eyJ... (longue chaîne)
service_role: eyJ... (longue chaîne)
```

### Étape 2 : Mettre à jour votre fichier `.env`

Ouvrez le fichier `.env` et remplacez les lignes suivantes :

```env
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID=ptcxeqtjlxittxayffgu
VITE_SUPABASE_ANON_KEY=VOTRE_VRAIE_CLE_ANON_ICI

# Stripe Configuration - PRODUCTION MODE
VITE_STRIPE_PUBLIC_KEY=pk_live_51SRqiB0iGfMKiTJkoK6nKtAu00k2vpT5ss94wjR0qiH8rhxP7Kdbo9ec6QHN5hIuWsMVaRYsLARPxRS4Uve6CcPa00WvpRGJB4

# Frontend URL for Stripe redirects
VITE_FRONTEND_URL=https://maxence.design
```

Remplacez `VOTRE_VRAIE_CLE_ANON_ICI` par votre vraie clé `anon` copiée depuis Supabase.

### Étape 3 : Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez :
npm run dev
```

## 📝 Note Importante

La clé `VITE_SUPABASE_ANON_KEY` doit :
- Commencer par `eyJ`
- Être très longue (plusieurs centaines de caractères)
- Provenir de l'onglet API de votre projet Supabase

## ✅ Vérification

Après avoir mis à jour et redémarré :
1. Allez sur votre dashboard
2. Essayez de vous connecter
3. L'erreur "Invalid API key" devrait disparaître

---

**Besoin d'aide ?** Si vous ne trouvez pas vos clés, demandez-moi et je vous guiderai étape par étape.
