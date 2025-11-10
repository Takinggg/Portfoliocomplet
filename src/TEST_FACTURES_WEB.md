# 🧪 TEST - Système de Factures Web

## ✅ Fix appliqué

**Problème :** `TypeError: Cannot read properties of undefined (reading 'map')`

**Cause :** Les données de la facture n'étaient pas complètes (items undefined)

**Solution :**
1. ✅ Ajout de vérifications de sécurité dans `InvoiceViewPage.tsx`
2. ✅ Ajout de valeurs par défaut dans la route backend
3. ✅ Protection contre les champs manquants

---

## 🚀 Déployer les corrections

```bash
supabase functions deploy make-server-04919ac5
```

---

## 🧪 Tester le système

### 1️⃣ Créer une facture de test dans le dashboard

**Données minimales :**
```
Client : Test User
Email : test@example.com
Montant : 1500 €
Échéance : dans 30 jours

Items :
- Description : Développement site web
- Quantité : 1
- Prix unitaire : 1500 €
```

### 2️⃣ Envoyer la facture

1. Dashboard → Factures
2. Trouver la facture
3. Cliquer sur **"Renvoyer" 📧**
4. Attendre le toast de confirmation

### 3️⃣ Vérifier l'email

1. Ouvrir la boîte mail `test@example.com`
2. Chercher l'email "📄 Facture FAC-2025-XXX"
3. Vérifier que le lien est présent
4. **Copier le lien**

### 4️⃣ Ouvrir le lien

1. Coller le lien dans le navigateur
2. Format : `https://maxence.design/#/invoice/550e8400-...`
3. Vérifier que la page se charge **sans erreur**

### 5️⃣ Checklist de la page

- ✅ Header noir avec "FACTURE" + numéro
- ✅ Badge de statut (Envoyée)
- ✅ Informations freelance (De)
- ✅ Informations client (Pour)
- ✅ Dates (émission + échéance)
- ✅ **Tableau des items** (sans erreur !)
- ✅ Totaux (sous-total, TVA, total)
- ✅ IBAN visible
- ✅ Bouton "Payer maintenant"
- ✅ Bouton "Télécharger PDF"

---

## 🐛 Si ça ne marche toujours pas

### Vérifier les logs backend

```bash
supabase functions logs make-server-04919ac5 --tail
```

**Logs attendus :**
```
🔐 Generated secure link for invoice FAC-2025-001: https://...
👁️ Invoice FAC-2025-001 viewed via secure link
```

### Vérifier la console navigateur

Ouvrir DevTools (F12) → Console

**Pas d'erreurs attendues !**

Si tu vois encore :
```
TypeError: Cannot read properties of undefined (reading 'map')
```

→ La facture n'a probablement pas d'`items` dans la base de données.

### Solution : Recréer la facture

1. Dashboard → Factures
2. Supprimer l'ancienne
3. Créer une nouvelle avec **au moins 1 item**
4. Renvoyer
5. Tester le lien

---

## 📊 Structure attendue d'une facture

```typescript
{
  number: "FAC-2025-001",
  date: "2025-11-10T...",
  dueDate: "2025-12-10T...",
  status: "sent",
  clientName: "Test User",
  clientEmail: "test@example.com",
  clientAddress: "123 Rue Test",
  items: [
    {
      description: "Développement site web",
      quantity: 1,
      unitPrice: 1500,
      amount: 1500
    }
  ],
  subtotal: 1500,
  tax: 0,
  amount: 1500,
  notes: "Merci pour votre confiance",
  viewToken: "550e8400-...",
  viewLink: "https://maxence.design/#/invoice/550e8400-..."
}
```

**IMPORTANT :** Le champ `items` doit être un **tableau** (même vide `[]`), jamais `undefined` !

---

## ✅ Validation finale

Une fois que la page de facture se charge sans erreur :

1. ✅ Tester le bouton "Télécharger PDF" (Ctrl+P)
2. ✅ Tester le responsive (mobile view)
3. ✅ Vérifier que tous les montants sont corrects
4. ✅ Tester avec une facture en retard (échéance passée)
5. ✅ Vérifier l'email de relance

---

## 🎯 Prochaines étapes

Une fois que tout fonctionne :

1. **Intégration Stripe** pour les paiements
2. **Webhook** pour marquer comme "paid"
3. **Statistiques** de consultation
4. **Email automatique** de relance

---

**Si tout fonctionne maintenant, on est bon ! 🎉**

Sinon, montre-moi les logs d'erreur et on va débugger ensemble.
