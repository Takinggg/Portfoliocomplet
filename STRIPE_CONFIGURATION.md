# 🔐 Configuration Stripe dans Supabase

Vos clés Stripe sont prêtes! Voici comment les configurer:

## ✅ Étape 1: Ajouter la Clé Secrète à Supabase

### Via Dashboard Supabase (Recommandé)

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Menu de gauche → **Edge Functions**
4. Cliquez sur **Settings** (en haut)
5. Descendez à la section **Secrets**
6. Cliquez **Add Secret**

**Ajoutez la clé secrète:**
- **Name:** `STRIPE_SECRET_KEY`
- **Value:** `sk_live_51SRqiB0i[...]00vMY3nUmb` (votre clé complète depuis Stripe Dashboard)
- Cliquez **Add Secret**

### Via Terminal (Alternative)

```bash
cd c:\Users\snsye\OneDrive\Documents\Portfoliocomplet-main

# Login à Supabase
npx supabase login

# Lier votre projet
npx supabase link --project-ref [VOTRE_PROJECT_ID]

# Ajouter le secret
npx supabase secrets set STRIPE_SECRET_KEY="sk_live_VOTRE_CLE_SECRETE_ICI"
```

## ✅ Étape 2: Configurer le Webhook Stripe

1. Allez sur https://dashboard.stripe.com
2. Menu **Developers** → **Webhooks**
3. Cliquez **Add endpoint**

**Configuration:**
- **Endpoint URL:** `https://[VOTRE_PROJECT_ID].supabase.co/functions/v1/make-server-04919ac5/stripe/webhook`
- **Events à écouter:**
  - ✓ `checkout.session.completed`
  - ✓ `checkout.session.expired`
  - ✓ `charge.refunded`
- Cliquez **Add endpoint**

4. Cliquez sur l'endpoint créé
5. Section **Signing secret** → **Reveal**
6. Copiez le secret (commence par `whsec_`)
7. Retournez dans Supabase et ajoutez-le:
   - **Name:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** [votre webhook secret]

## ✅ Étape 3: Déployer la Fonction

```bash
cd c:\Users\snsye\OneDrive\Documents\Portfoliocomplet-main
npx supabase functions deploy make-server-04919ac5
```

## ✅ Étape 4: Tester

⚠️ **ATTENTION: Vous êtes en mode PRODUCTION (LIVE)**

Les paiements seront RÉELS avec de vraies cartes bancaires!

### Pour tester en toute sécurité:

**Option 1 - Utiliser le Mode Test** (Recommandé pour débuter)
1. Retournez sur https://dashboard.stripe.com
2. En haut à droite, basculez sur **Test Mode**
3. Récupérez vos clés TEST (pk_test_, sk_test_)
4. Mettez à jour `.env` et Supabase avec les clés test
5. Testez avec carte: `4242 4242 4242 4242`

**Option 2 - Tester en LIVE** (Paiements réels)
1. Créez une facture depuis votre dashboard
2. Utilisez une vraie carte bancaire
3. Le montant sera débité réellement
4. Vous pourrez rembourser depuis Stripe Dashboard

## 📊 Vérification

Après configuration, vérifiez:
- ✓ Secret visible dans Supabase → Edge Functions → Settings → Secrets
- ✓ Webhook actif dans Stripe Dashboard
- ✓ Fonction déployée avec succès

## ⚠️ Sécurité

- ✓ Clé secrète dans Supabase (jamais dans le code)
- ✓ Clé publique dans `.env` (OK, publique par nature)
- ✓ `.env` dans `.gitignore` (ne sera pas commité)
- ✓ Webhook secret dans Supabase

## 🎯 Statut Actuel

- ✅ Clé publique: Configurée dans `.env`
- ⏳ Clé secrète: À ajouter dans Supabase
- ⏳ Webhook: À configurer dans Stripe
- ⏳ Fonction: À déployer

---

**Questions?** Consultez `STRIPE_QUICKSTART.md` pour plus de détails!
