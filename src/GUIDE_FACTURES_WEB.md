# 📄 Système de Factures Web - Guide Complet

## 🎨 Design

Le système de factures web respecte parfaitement la DA minimaliste :

### ✅ Caractéristiques
- **Header noir** (#0C0C0C) avec "FACTURE" + numéro
- **Badge** de statut discret (Envoyée, Payée, etc.)
- **Layout épuré** : 2 colonnes pour "De" / "Pour"
- **Tableau simple** avec bordures fines
- **Total** avec fond vert clair (#D9FFF4)
- **Section paiement** avec fond crème (#FFFEF0) et bordure dorée
- **Footer noir** avec mentions légales
- **Boutons** : Télécharger PDF + Payer maintenant

---

## 🚀 Déploiement

### 1. Déployer le backend

```bash
supabase functions deploy make-server-04919ac5
```

### 2. Tester l'accès

```bash
curl "https://[PROJECT_ID].supabase.co/functions/v1/make-server-04919ac5/health"
```

---

## 🧪 Test Complet

### Étape 1 : Créer une facture de test

1. Aller dans le **Dashboard** → **Factures**
2. Créer une nouvelle facture :
   - Client : Test User
   - Email : ton-email@test.com
   - Montant : 1500 €
   - Date d'échéance : dans 30 jours
   - **Important** : Ajouter au moins 1 item (ex: "Développement site web")

### Étape 2 : Envoyer la facture

1. Dans la liste des factures, trouver celle que tu viens de créer
2. Cliquer sur le bouton **"Renvoyer" 📧**
3. Attendre le toast de confirmation : "Email envoyé avec succès"

### Étape 3 : Vérifier l'email

1. Ouvrir ta boîte mail
2. Chercher l'email "📄 Facture FAC-2025-XXX"
3. Email devrait contenir :
   - Sujet : "📄 Facture FAC-2025-XXX - Maxence FOULON"
   - Bouton "Voir la facture"
   - Lien direct vers : `https://maxence.design/#/invoice/[TOKEN]`

### Étape 4 : Ouvrir le lien

1. Cliquer sur le lien ou le copier dans le navigateur
2. Format : `https://maxence.design/#/invoice/550e8400-e29b-41d4-a716-446655440000`

### Étape 5 : Vérifier la page

**Checklist visuelle :**

✅ **Header noir**
- Titre "FACTURE" en blanc
- Numéro FAC-2025-XXX en gris clair
- Badge "Envoyée" en haut à droite

✅ **Informations**
- Colonne gauche : FOULON Maxence (De)
- Colonne droite : Nom du client (Pour)
- Dates d'émission et d'échéance

✅ **Tableau des items**
- Header : Description, Quantité, Prix unitaire, Montant
- Lignes avec les items de la facture
- Bordures fines grises

✅ **Totaux**
- Sous-total
- TVA
- **Total** avec fond vert clair (#D9FFF4)

✅ **Paiement**
- Section jaune crème avec emoji 💳
- IBAN affiché dans un encadré blanc
- Moyens acceptés listés

✅ **Footer noir**
- "Merci pour votre confiance !"
- Mentions légales
- Coordonnées complètes

✅ **Boutons (hors impression)**
- En haut : "Télécharger PDF" + "Payer maintenant"
- En bas : Grand bouton "Payer XXX € maintenant"

### Étape 6 : Tester l'impression

1. Cliquer sur **"Télécharger PDF"** (ou Ctrl+P / Cmd+P)
2. Vérifier l'aperçu avant impression :
   - ✅ Les boutons sont cachés
   - ✅ Le fond est blanc
   - ✅ Les couleurs noires et vertes sont préservées
   - ✅ Tout tient sur une page A4

---

## 🔧 Dépannage

### Erreur : "Cannot read properties of undefined (reading 'map')"

**Cause** : La facture n'a pas d'items dans la base de données

**Solution** :
1. Supprimer la facture problématique
2. Créer une nouvelle facture
3. **S'assurer d'ajouter au moins 1 item avant de sauvegarder**

### Erreur : "Facture introuvable"

**Causes possibles :**
- Le token a expiré (7 jours par défaut)
- La facture a été supprimée
- Le lien est mal formé

**Solution** :
1. Dashboard → Factures → Trouver la facture
2. Cliquer sur "Renvoyer" pour générer un nouveau lien
3. Vérifier l'email pour le nouveau lien

### La page ne charge pas

**Vérifier :**
1. Le backend est déployé :
   ```bash
   supabase functions list
   ```
2. Les logs du serveur :
   ```bash
   supabase functions logs make-server-04919ac5 --tail
   ```
3. La console navigateur (F12) pour voir les erreurs

---

## 📊 Structure des données

### Format d'une facture complète

```typescript
{
  id: "invoice_123456",
  number: "FAC-2025-001",
  date: "2025-11-10T12:00:00.000Z",
  dueDate: "2025-12-10T12:00:00.000Z",
  status: "sent",
  clientName: "Test User",
  clientEmail: "test@example.com",
  clientAddress: "123 Rue Test, Paris",
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
  viewToken: "550e8400-e29b-41d4-a716-446655440000",
  viewLink: "https://maxence.design/#/invoice/550e8400-...",
  createdAt: "2025-11-10T12:00:00.000Z"
}
```

**⚠️ Important** : Le champ `items` doit **toujours** être un tableau, même vide `[]`

---

## 🔐 Sécurité

### Tokens sécurisés

- Chaque facture a un **token UUID unique**
- Le token est stocké dans la KV store avec préfixe `invoice_token:`
- Expiration par défaut : **7 jours**
- Pas besoin d'authentification pour voir la facture (lien public)

### Validation

Le backend vérifie :
1. ✅ Le token existe
2. ✅ Le token n'a pas expiré
3. ✅ La facture existe
4. ✅ Les données sont complètes

---

## 🎯 Prochaines étapes

### Phase 1 : Paiement Stripe ✨

1. Créer un compte Stripe
2. Récupérer les clés API (test + prod)
3. Ajouter les variables d'environnement
4. Intégrer Stripe Checkout
5. Ajouter le webhook pour marquer comme "paid"

### Phase 2 : Statistiques 📊

1. Tracker les vues de factures
2. Enregistrer les tentatives de paiement
3. Analytics dans le dashboard

### Phase 3 : Automatisation 🤖

1. Relances automatiques pour factures en retard
2. Email de confirmation quand payée
3. Génération récurrente pour abonnements

---

## ✅ Validation finale

Avant de considérer le système comme prêt :

- [ ] Les factures se créent sans erreur
- [ ] L'envoi d'email fonctionne
- [ ] Le lien mène à une belle page
- [ ] Tous les champs sont remplis correctement
- [ ] L'impression est nickel (A4, couleurs OK)
- [ ] Les tokens expirent après 7 jours
- [ ] Le responsive fonctionne (mobile)
- [ ] Aucune erreur dans la console

---

**Enjoy ! 🎉**

Si tout fonctionne, tu as maintenant un système de facturation professionnel prêt à l'emploi.
