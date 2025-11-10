# 🚀 Guide de Déploiement - Paiements Stripe

## ✅ Ce qui a été fait

1. **Backend (Edge Function)** ✅
   - Endpoint `/stripe/create-checkout-session` configuré
   - Endpoint `/stripe/webhook` pour les confirmations de paiement
   - Conversion automatique des montants (euros → centimes)
   - Logging détaillé pour le debugging

2. **Frontend (React)** ✅
   - Composant InvoiceViewer avec bouton de paiement
   - Page de succès après paiement (InvoiceSuccessPage)
   - Gestion des redirections (succès/annulation)
   - Routes configurées dans AppWithRouter

3. **Sécurité** ✅
   - Clés API Stripe protégées dans .env (gitignored)
   - Documentation sécurisée (clés masquées)
   - GitHub secret scanning passé

## ⏳ Prochaines Étapes (À FAIRE)

### 1️⃣ Configurer les Secrets Supabase

```bash
# Allez sur https://app.supabase.com
# → Votre projet → Edge Functions → Secrets

# Ajoutez ces 3 secrets :
STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_SECRETE_STRIPE_ICI

FRONTEND_URL=https://maxence.design

STRIPE_WEBHOOK_SECRET=(on va le récupérer à l'étape 2)
```

> 💡 **Note** : Utilisez votre clé secrète Stripe (commence par `sk_live_...` pour la production ou `sk_test_...` pour les tests)

### 2️⃣ Déployer l'Edge Function

```powershell
# Déployer la fonction mise à jour
npx supabase functions deploy make-server-04919ac5

# Vérifier le déploiement
curl "https://[PROJECT_ID].supabase.co/functions/v1/make-server-04919ac5/health"
```

### 3️⃣ Configurer le Webhook Stripe

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur "Add endpoint"
3. URL du webhook :
   ```
   https://[PROJECT_ID].supabase.co/functions/v1/make-server-04919ac5/stripe/webhook
   ```
4. Sélectionnez ces événements :
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.expired`
   - ✅ `charge.refunded`
5. Cliquez sur "Add endpoint"
6. **IMPORTANT** : Copiez le "Signing secret" (commence par `whsec_...`)
7. Retournez dans Supabase → Edge Functions → Secrets
8. Ajoutez le secret `STRIPE_WEBHOOK_SECRET` avec la valeur copiée

### 4️⃣ Tester le Paiement

⚠️ **ATTENTION : MODE PRODUCTION (LIVE)** ⚠️

Vous utilisez actuellement les clés **LIVE** de Stripe, donc :
- Les paiements sont **RÉELS**
- Votre carte sera **VRAIMENT DÉBITÉE**
- Les fonds iront sur votre compte Stripe

**Option 1 : Tester en mode TEST (Recommandé)**

```bash
# Dans .env, remplacez par les clés TEST :
VITE_STRIPE_PUBLIC_KEY=pk_test_...
# Et dans Supabase Secrets :
STRIPE_SECRET_KEY=sk_test_...
```

Utilisez ces cartes de test :
- ✅ **Succès** : `4242 4242 4242 4242`
- ❌ **Échec** : `4000 0000 0000 0002`
- Date : n'importe quelle date future
- CVC : n'importe quels 3 chiffres

**Option 2 : Tester en mode LIVE (Production)**

1. Créez une facture depuis le Dashboard
2. Notez le montant (ex: 1500.00 €)
3. Cliquez sur "Générer le lien" ou "Envoyer par email"
4. Ouvrez le lien de la facture
5. Cliquez sur "Payer maintenant"
6. Vérifiez que le montant affiché sur Stripe est correct (1500.00 €, soit 150000 centimes)
7. ⚠️ Utilisez une vraie carte bancaire (paiement réel !)

### 5️⃣ Vérifier que tout fonctionne

**Checklist** :

- [ ] Le bouton "Payer maintenant" redirige vers Stripe Checkout
- [ ] Le montant affiché sur Stripe est correct (en euros, pas en centimes)
- [ ] Après paiement, redirection vers `/invoice/{token}/success`
- [ ] La page de succès s'affiche avec l'animation
- [ ] Le statut de la facture passe à "paid" dans le Dashboard
- [ ] Le webhook Stripe fonctionne (vérifiez les logs dans Stripe Dashboard)

## 🐛 Debugging

### Logs Supabase

```bash
# Voir les logs en temps réel
npx supabase functions logs make-server-04919ac5 --follow
```

### Logs Stripe

1. Allez sur https://dashboard.stripe.com/logs
2. Vérifiez les événements de paiement
3. Vérifiez les webhooks envoyés

### Problèmes courants

**"Payment processing is not configured"**
→ Vérifiez que `STRIPE_SECRET_KEY` est bien dans les secrets Supabase

**Le montant est incorrect (10x ou 100x trop élevé)**
→ C'est maintenant corrigé ! Le backend convertit automatiquement (€ → centimes)

**Webhook ne fonctionne pas**
→ Vérifiez que `STRIPE_WEBHOOK_SECRET` est configuré dans Supabase

**Erreur 404 sur l'URL de succès**
→ Vérifiez que les routes sont bien configurées dans AppWithRouter.tsx

## 📊 Monitoring

### Stripe Dashboard
- Paiements : https://dashboard.stripe.com/payments
- Webhooks : https://dashboard.stripe.com/webhooks
- Logs : https://dashboard.stripe.com/logs

### Supabase Dashboard
- Edge Functions : https://app.supabase.com → Edge Functions
- Logs : https://app.supabase.com → Edge Functions → Logs
- KV Store : Vérifiez que les sessions Stripe sont stockées

## 🎉 C'est prêt !

Une fois toutes ces étapes complétées, votre système de paiement Stripe sera pleinement opérationnel :

1. ✅ Création de factures depuis le Dashboard
2. ✅ Génération de liens de paiement sécurisés
3. ✅ Redirection vers Stripe Checkout avec le montant correct
4. ✅ Mise à jour automatique du statut après paiement
5. ✅ Page de succès avec options de téléchargement

---

**Besoin d'aide ?** Consultez les autres guides :
- `STRIPE_SETUP.md` - Configuration technique détaillée
- `STRIPE_QUICKSTART.md` - Guide rapide en français
- `STRIPE_CONFIGURATION.md` - Instructions de configuration

