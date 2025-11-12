# Guide d'Intégration Stripe 💳

## Configuration Stripe

### 1. Créer un compte Stripe
- Allez sur https://dashboard.stripe.com
- Créez un compte ou connectez-vous
- Sélectionnez votre pays et acceptez les conditions

### 2. Récupérer vos clés API

1. Allez dans **Developers** → **API Keys**
2. Copiez votre clé publique (commence par `pk_live_` ou `pk_test_`)
3. Copiez votre clé secrète (commence par `sk_live_` ou `sk_test_`)

### 3. Configurer les variables d'environnement

**Dans Supabase (pour l'Edge Function):**
1. Allez dans **Settings** → **Edge Function Secrets**
2. Ajoutez `STRIPE_SECRET_KEY` avec votre clé secrète
3. Ajoutez `STRIPE_WEBHOOK_SECRET` (vous l'obtiendrez à l'étape 4)

**Dans votre `.env` local:**
```bash
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
```

### 4. Configurer le Webhook Stripe (Production)

Pour recevoir les confirmations de paiement:

1. Dans Stripe Dashboard, allez dans **Developers** → **Webhooks**
2. Cliquez sur "Add endpoint"
3. URL: `https://<your-project>.supabase.co/functions/v1/make-server-04919ac5/stripe/webhook`
4. Sélectionnez les événements:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `charge.refunded`
5. Copiez le "Signing secret" et ajoutez-le dans Supabase comme `STRIPE_WEBHOOK_SECRET`

## Mode Test vs Production

### Mode Test
- Utilisez les clés commençant par `pk_test_` et `sk_test_`
- Utilisez les numéros de carte test:
  - **Succès:** `4242 4242 4242 4242`
  - **Décline:** `4000 0000 0000 0002`
  - **Authentification 3D:** `4000 0025 0000 3155`

### Mode Production
- Utilisez les clés commençant par `pk_live_` et `sk_live_`
- Les vrais paiements par carte sont traités
- Les factures sont marquées comme "payées"

## Flux de Paiement

1. **Client clique "Payer"** sur la facture
2. **Frontend appelle** `/stripe/create-checkout-session`
3. **Edge Function crée** une session Stripe
4. **Client redirigé** vers Stripe Checkout
5. **Client entre** ses informations de paiement
6. **Stripe confirme** le paiement
7. **Webhook reçoit** la confirmation
8. **Facture mise à jour** avec statut "Payée"
9. **Client redirigé** vers page de confirmation

## Fichiers impactés

- `supabase/functions/make-server-04919ac5/index.ts` - Endpoints Stripe
- `src/components/invoice/InvoiceViewer.tsx` - Bouton de paiement
- `src/utils/stripe/stripeService.ts` - Service Stripe
- `.env.example` - Configuration requise

## Tests

### Tester en mode Test
```bash
# 1. Assurez-vous d'être en mode test dans Stripe
# 2. Utilisez une clé test (pk_test_...)

# 3. Créez une facture
# 4. Cliquez sur "Payer maintenant"
# 5. Utilisez la carte test 4242 4242 4242 4242
# 6. Remplissez les champs avec n'importe quelle date future
# 7. CVC: n'importe quel numéro à 3 chiffres
```

## Dépannage

**"Stripe public key not configured"**
- Vérifiez que `VITE_STRIPE_PUBLIC_KEY` est défini

**"Payment processing is not configured"**
- Vérifiez que `STRIPE_SECRET_KEY` est défini dans Supabase

**Paiement échoue silencieusement**
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez les logs de Supabase Edge Function

**Webhook non reçu**
- Vérifiez l'URL du webhook
- Vérifiez le `STRIPE_WEBHOOK_SECRET`
- Utilisez l'interface Stripe pour tester le webhook

## Support

- Docs Stripe: https://stripe.com/docs
- Dashboard Stripe: https://dashboard.stripe.com
- Supabase: https://supabase.com/docs
