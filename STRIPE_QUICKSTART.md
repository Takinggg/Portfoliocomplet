# 🚀 Guide d'Intégration Stripe - Étapes Rapides

## ✅ Étape 1: Créer un Compte Stripe

1. Allez sur https://dashboard.stripe.com/register
2. Remplissez votre email, mot de passe
3. Vérifiez votre email
4. Complétez votre profil (nom, entreprise, etc.)

## ✅ Étape 2: Récupérer vos Clés API

1. Connectez-vous à https://dashboard.stripe.com
2. Allez dans **Developers** (en bas à gauche)
3. Cliquez sur **API Keys**
4. Vous verrez deux clés:
   - **Publishable Key** (commence par `pk_`)
   - **Secret Key** (commence par `sk_`)

### Mode Test vs Production

**Vous êtes actuellement en Mode Test** ✓
- Les clés commencent par `pk_test_` et `sk_test_`
- Utilisez la carte de test **4242 4242 4242 4242** pour les paiements de test

**Quand vous êtes prêt pour le production:**
- Cliquez sur le bouton "Activate your account"
- Les clés changeront à `pk_live_` et `sk_live_`

## ✅ Étape 3: Ajouter les Clés à Supabase

### Option 1: Via Terminal (Recommandé)

```bash
cd votre-projet
bash setup-stripe.sh
```

Entrez vos clés quand demandé.

### Option 2: Manual (Supabase Dashboard)

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Edge Function Secrets**
4. Cliquez sur **Add Secret**
5. Ajoutez:
   - **Name:** `STRIPE_SECRET_KEY`
   - **Value:** Votre clé secrète (sk_test_... ou sk_live_...)
   - **Cliquez:** Add Secret

6. Répétez pour `STRIPE_WEBHOOK_SECRET` (vous la trouverez après l'étape 4)

## ✅ Étape 4: Configurer le Webhook (Production)

Pour que les confirmations de paiement fonctionnent:

1. Dans Stripe Dashboard → **Developers** → **Webhooks**
2. Cliquez sur **Add endpoint**
3. URL: `https://[votre-project-id].supabase.co/functions/v1/make-server-04919ac5/stripe/webhook`
4. Events à sélectionner:
   - ✓ `checkout.session.completed`
   - ✓ `checkout.session.expired`
   - ✓ `charge.refunded`
5. Cliquez **Add endpoint**
6. Cliquez sur l'endpoint créé
7. Cliquez sur **Signing secret** → **Reveal**
8. Copiez ce secret
9. Ajoutez-le dans Supabase: `STRIPE_WEBHOOK_SECRET`

## ✅ Étape 5: Déployer la Fonction

```bash
supabase functions deploy make-server-04919ac5
```

## ✅ Étape 6: Tester

1. Allez sur votre site
2. Créez une facture (depuis le dashboard)
3. Cliquez "Payer maintenant"
4. Utilisez la carte test: **4242 4242 4242 4242**
5. Date future: **12/34**
6. CVC: **123**
7. Cliquez **Payer**

Si tout fonctionne:
- ✓ Vous êtes redirigé vers une page de succès
- ✓ La facture est marquée comme "Payée"
- ✓ Un événement apparaît dans Stripe Dashboard

## 🔧 Dépannage Rapide

| Problème | Solution |
|----------|----------|
| "Stripe not configured" | Vérifiez VITE_STRIPE_PUBLIC_KEY dans .env |
| Paiement échoue silencieusement | Vérifiez console navigateur + logs Supabase |
| Webhook non reçu | Vérifiez URL webhook et webhook secret |
| Facture pas mise à jour | Vérifiez logs Supabase → Functions |

## 📊 Flux du Paiement

```
Client clique "Payer"
    ↓
Frontend → Supabase Edge Function
    ↓
Edge Function → Stripe API
    ↓
Stripe retourne URL checkout
    ↓
Client redirigé → Stripe Checkout
    ↓
Client entre ses données
    ↓
Stripe traite le paiement
    ↓
Stripe envoie webhook → Edge Function
    ↓
Edge Function met à jour facture
    ↓
Client redirigé → Page succès
```

## 🎓 Variables d'Environnement Requises

Dans votre `.env`:
```bash
VITE_STRIPE_PUBLIC_KEY=pk_test_... # ou pk_live_
```

Dans Supabase Edge Function Secrets:
```
STRIPE_SECRET_KEY=sk_test_... # ou sk_live_
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🚀 Passage Production

Quand vous êtes prêt:
1. Activez votre compte Stripe
2. Remplacez les clés test par les clés live
3. Testez avec une vraie carte
4. Redéployez: `supabase functions deploy make-server-04919ac5`

## 📞 Support

- **Stripe Docs:** https://stripe.com/docs
- **Supabase:** https://supabase.com/docs
- **Discord:** Support officiels des deux plateformes
