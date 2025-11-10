# 🚀 QUICKSTART - Factures Web Sécurisées

## En 3 étapes

### 1️⃣ Déployer (1 commande)

```bash
supabase functions deploy make-server-04919ac5
```

### 2️⃣ Tester (dans le dashboard)

1. Ouvrir `https://maxence.design/#/dashboard`
2. Aller dans **Factures**
3. Créer une nouvelle facture de test
4. Cliquer sur **"Renvoyer" 📧**

### 3️⃣ Vérifier

✅ Email reçu avec un **lien sécurisé** (pas de PDF)
✅ Clic sur le lien → **Page web professionnelle**
✅ Bouton **"Payer maintenant"** visible (Stripe à intégrer)

---

## 📧 Ce qui change

### Avant (système PDF)
```
Email → PDF en pièce jointe (40-100 KB)
```

### Maintenant (système Web)
```
Email → Lien sécurisé → Page web pro
             ↓
    https://maxence.design/#/invoice/550e8400-...
```

---

## 🔐 Sécurité

- ✅ Token unique par facture (UUID cryptographique)
- ✅ Expiration 90 jours
- ✅ Accès public (pas besoin de login)
- ✅ Non-énumérable (impossible de deviner)

---

## 💡 Avantages

### Pour toi
- Email plus léger
- Facile à mettre à jour
- Tracking possible
- **Paiement intégré** (avec Stripe)

### Pour le client
- Accès immédiat
- Fonctionne sur mobile
- Bouton "Payer" en 2 clics
- Toujours accessible (90j)

---

## 🎨 Aperçu

### Email envoyé
```
📄 Facture FAC-2025-001 - FOULON Maxence

Bonjour Client,

Numéro : FAC-2025-001
Échéance : 10 décembre 2025
Montant : 1 500,00 €

[👁️ Voir et payer la facture]

💳 Modalités de paiement
IBAN : FR76 2823 3000 0195 1140 4606 069
```

### Page web
```
┌─────────────────────────────────────┐
│ [📥 Télécharger] [💳 Payer]        │
├─────────────────────────────────────┤
│ FACTURE FAC-2025-001   [Envoyée]   │
│                                     │
│ De : FOULON Maxence                 │
│ Pour : Client XYZ                   │
│                                     │
│ Détails de la prestation            │
│ Total : 1 500,00 €                  │
│                                     │
│ 💳 IBAN : FR76 2823 3000 ...        │
│                                     │
│ [💳 Payer 1 500 € maintenant]      │
└─────────────────────────────────────┘
```

---

## ⚡ Prochaine étape : Stripe

Pour activer les paiements par carte :

1. Créer un compte Stripe
2. Obtenir les clés API
3. Ajouter au serveur :
   ```typescript
   // Route de paiement
   app.post("/invoices/:id/create-payment", async (c) => {
     const session = await stripe.checkout.sessions.create({
       amount: invoice.amount * 100,
       // ...
     });
     return c.json({ checkoutUrl: session.url });
   });
   ```

4. Frontend : rediriger vers Stripe
   ```typescript
   const { checkoutUrl } = await fetch(...);
   window.location.href = checkoutUrl;
   ```

**Guide complet :** `/NOUVEAU_SYSTEME_FACTURES_WEB.md`

---

## 🐛 Dépannage

### Email non reçu
- Vérifier le spam
- Confirmer RESEND_API_KEY

### Lien invalide
- Token expiré (>90j)
- Facture supprimée

### Page blanche
- Vérifier les logs serveur
- Token invalide

---

## 📚 Documentation complète

- **Guide complet :** `/NOUVEAU_SYSTEME_FACTURES_WEB.md`
- **Code backend :** `/supabase/functions/server/index.tsx` (lignes 893-1010)
- **Code frontend :** `/components/pages/InvoiceViewPage.tsx`
- **Email service :** `/supabase/functions/server/email_service.tsx`

---

**C'est prêt ! Teste dès maintenant dans le dashboard.** 🎉
