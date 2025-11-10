# 📧📄 GUIDE COMPLET - Envoi de Factures PDF par Email

## ✅ NOUVELLE FONCTIONNALITÉ IMPLÉMENTÉE

Vos factures sont maintenant envoyées **avec un PDF professionnel en pièce jointe** et **une copie automatique à contact@maxence.design** !

---

## 🎯 CE QUI A ÉTÉ AJOUTÉ

### 1. **Génération PDF Professionnelle** (`pdf_service_simple.tsx`)
- ✅ Génération de PDFs avec jsPDF (aucune dépendance externe)
- ✅ Design professionnel avec votre branding (#00FFC2 + #0C0C0C)
- ✅ Informations complètes :
  - En-tête avec votre nom et logo
  - Informations émetteur (vous) et client
  - Numéro de facture et dates
  - Montant détaillé (HT, TVA, TTC)
  - Modalités de paiement
  - Mentions légales (pénalités de retard)
  - Statut de la facture (badge coloré)

### 2. **Service Email Amélioré** (`email_service.tsx`)
- ✅ Support des **pièces jointes** (attachments)
- ✅ **Copie carbone automatique** (CC) à `contact@maxence.design`
- ✅ Support BCC (copie cachée) si nécessaire
- ✅ Nom du fichier professionnel : `Facture_XXX.pdf`

### 3. **Route Send-Reminder Complète** (`index.tsx`)
- ✅ Génère automatiquement le PDF à chaque envoi
- ✅ Attache le PDF au mail
- ✅ Détecte si facture en retard
- ✅ Envoie l'email approprié selon le statut
- ✅ Copie automatique à votre email

---

## 📬 EMAILS ENVOYÉS

### 📧 **Facture Standard** (à jour)
**À :** Client
**CC :** contact@maxence.design
**Pièce jointe :** `Facture_XXX.pdf`
**Contenu :**
- Message professionnel avec montant et échéance
- Modalités de paiement (virement, PayPal)
- PDF complet en pièce jointe

### ⚠️ **Facture en Retard** (overdue)
**À :** Client
**CC :** contact@maxence.design
**Pièce jointe :** `Facture_XXX_RELANCE.pdf`
**Contenu :**
- Message de rappel poli
- Nombre de jours de retard
- Montant et date d'échéance dépassée
- PDF complet en pièce jointe

---

## 🎨 APERÇU DU PDF GÉNÉRÉ

```
┌─────────────────────────────────────────────┐
│ Maxence .              FACTURE              │
│ Freelance Web Developer   FAC-2025-001      │
│                           Date: 10/11/2025  │
│                           [Envoyée]         │
├─────────────────────────────────────────────┤
│                                             │
│ ÉMETTEUR              CLIENT                │
│ Maxence               Nom du Client         │
│ Paris, France         Adresse du client     │
│ contact@maxence.design  email@client.com    │
│ +33 6 XX XX XX XX                           │
│ SIRET: XXX XXX XXX                          │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Numéro de facture    FAC-2025-001      │ │
│ │ Date d'émission      10 novembre 2025  │ │
│ │ Date d'échéance      10 décembre 2025  │ │
│ │ Description          Prestation web    │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Sous-total HT              1 500,00 €  │ │
│ │ TVA non applicable  Article 293 B CGI  │ │
│ │ ─────────────────────────────────────  │ │
│ │ TOTAL TTC               1 500,00 €     │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ 💳 Modalités de paiement                    │
│ Échéance : 10 décembre 2025                 │
│ Moyens : Virement bancaire, PayPal         │
│ ⚠️ Pénalités de retard : 3x taux légal     │
│                                             │
├─────────────────────────────────────────────┤
│ Merci pour votre confiance !                │
│ Facture générée automatiquement             │
│ Maxence • contact@maxence.design • +33...   │
└─────────────────────────────────────────────┘
```

---

## 🔧 CONFIGURATION

### Variables d'Environnement (Optionnelles)

Pour personnaliser les informations dans le PDF :

```bash
# Dans Supabase Dashboard → Project Settings → Edge Functions → Secrets
supabase secrets set FREELANCE_NAME="Maxence Dupont"
supabase secrets set FREELANCE_EMAIL="contact@maxence.design"
supabase secrets set FREELANCE_PHONE="+33 6 12 34 56 78"
supabase secrets set FREELANCE_ADDRESS="123 Rue de Paris, 75001 Paris"
supabase secrets set FREELANCE_SIRET="123 456 789 00012"
supabase secrets set FREELANCE_TVA="TVA non applicable, art. 293 B du CGI"
```

**Valeurs par défaut** (si non configurées) :
- Name: "Maxence"
- Email: "contact@maxence.design"
- Phone: "+33 6 XX XX XX XX"
- Address: "Paris, France"
- TVA: "TVA non applicable, art. 293 B du CGI"

---

## 🚀 DÉPLOIEMENT

```bash
# Déployez le serveur avec la nouvelle fonctionnalité PDF
supabase functions deploy make-server-04919ac5

# Vérifiez le déploiement
supabase functions logs make-server-04919ac5
```

---

## ✅ TEST APRÈS DÉPLOIEMENT

### 1. **Créer une facture de test**
Dans le Dashboard → Factures :
1. Créez une nouvelle facture
2. Assurez-vous que le client a un email valide
3. Définissez un montant et une échéance

### 2. **Envoyer la facture**
1. Cliquez sur le bouton "Renvoyer" (icône Mail) 📧
2. Attendez le message de succès
3. Vérifiez :
   - ✅ Toast de confirmation : "Facture renvoyée à {client}"
   - ✅ Email reçu par le client avec PDF
   - ✅ Copie reçue sur contact@maxence.design

### 3. **Vérifier le PDF**
Ouvrez le PDF reçu et vérifiez :
- ✅ Design professionnel avec vos couleurs
- ✅ Informations complètes et correctes
- ✅ Montant et dates exacts
- ✅ Statut affiché (badge coloré)
- ✅ Mentions légales présentes

### 4. **Tester avec facture en retard**
1. Créez une facture avec une échéance passée
2. Marquez-la comme "overdue" ou "sent"
3. Envoyez-la
4. Vérifiez :
   - ✅ Email de relance avec mention du retard
   - ✅ Nom du fichier : `Facture_XXX_RELANCE.pdf`
   - ✅ Message adapté au retard

---

## 📊 LOGS À SURVEILLER

Dans Supabase Functions Logs, cherchez :

```
✅ Succès :
📄 Generating PDF for invoice FAC-2025-001...
✅ PDF generated successfully for invoice FAC-2025-001 (45678 bytes)
📧 Preparing to send email: { to: "client@email.com", hasAttachments: true, attachmentCount: 1 }
📧 Invoice email sent for invoice:... to client@email.com

❌ Erreurs possibles :
❌ Failed to generate PDF: ...
❌ Failed to send email: ...
❌ No email for client in invoice ...
```

---

## 🎯 UTILISATION DANS LE DASHBOARD

### Bouton "Renvoyer la facture" 📧

**Emplacement :** Dashboard → Factures → Colonne Actions

**Disponible quand :**
- Facture avec statut "sent" (envoyée)
- Facture avec statut "overdue" (en retard)

**Comportement :**
1. Clic sur l'icône Mail 📧
2. Génération automatique du PDF
3. Envoi au client + copie à vous
4. Toast de confirmation

**Messages de confirmation :**
- **Facture à jour :** "Facture renvoyée à {client}"
- **Facture en retard :** "Relance envoyée pour {client} (5j de retard)"

---

## 💡 FONCTIONNALITÉS AVANCÉES

### Copie automatique à vous
**Pourquoi ?** Pour avoir une trace de tous les emails envoyés
**Comment ?** Chaque email est automatiquement CC à `contact@maxence.design`
**Avantage :** Vous gardez un historique complet dans votre boîte mail

### Détection intelligente des retards
**Calcul automatique :** Le système calcule les jours de retard
**Email adapté :** Message différent selon le statut
**Information précise :** "Relance envoyée (5j de retard)"

### Noms de fichiers explicites
- **Standard :** `Facture_FAC-2025-001.pdf`
- **Relance :** `Facture_FAC-2025-001_RELANCE.pdf`

---

## 🔒 SÉCURITÉ & VALIDATION

### Validations effectuées
- ✅ Email client valide (format)
- ✅ Facture existe dans la base
- ✅ Authentification requise (Bearer token)
- ✅ Génération PDF sécurisée

### Gestion des erreurs
- ❌ Pas d'email client → Erreur 400
- ❌ Facture introuvable → Erreur 404
- ❌ Échec génération PDF → Erreur 500
- ❌ Échec envoi email → Erreur 500

---

## 📝 PERSONNALISATION DU PDF

Pour modifier le design du PDF, éditez `/supabase/functions/server/pdf_service_simple.tsx` :

### Couleurs
```typescript
const primaryColor = [0, 255, 194]; // #00FFC2 (vert)
const darkColor = [12, 12, 12];     // #0C0C0C (noir)
const grayColor = [102, 102, 102];  // #666 (gris)
```

### Textes
- Ligne 85 : "Freelance Web Developer"
- Ligne 206 : "Merci pour votre confiance !"
- Ligne 171-175 : Modalités de paiement

### Mentions légales
Ligne 180-183 : Texte des pénalités de retard

---

## 🆘 DÉPANNAGE

### Problème : PDF non généré
**Symptôme :** Email envoyé mais sans pièce jointe
**Cause :** Erreur dans jsPDF
**Solution :**
1. Vérifiez les logs Supabase
2. Cherchez l'erreur "Failed to generate PDF"
3. Vérifiez que jsPDF est bien importé

### Problème : Email non reçu
**Symptôme :** Pas d'email dans la boîte du client
**Solution :**
1. Vérifiez le spam
2. Vérifiez que RESEND_API_KEY est configurée
3. Consultez le dashboard Resend pour les erreurs

### Problème : Copie non reçue sur contact@maxence.design
**Symptôme :** Client reçoit mais pas vous
**Solution :**
1. Vérifiez vos spams
2. Vérifiez que l'email est bien contact@maxence.design
3. Consultez les logs pour confirmer le CC

---

## 📈 STATISTIQUES & MÉTRIQUES

Avec cette fonctionnalité, vous pouvez :
- ✅ Tracer tous les envois (copie systématique)
- ✅ Savoir quelles factures ont été envoyées
- ✅ Compter les relances effectuées
- ✅ Archiver automatiquement les PDFs (dans votre email)

---

## 🎉 AVANTAGES

### Pour vous (Freelance)
- ✅ Copie automatique de tous les envois
- ✅ Archivage automatique des PDFs
- ✅ Suivi des relances
- ✅ Professionnalisme renforcé

### Pour vos clients
- ✅ PDF professionnel et lisible
- ✅ Toutes les informations nécessaires
- ✅ Facile à archiver et imprimer
- ✅ Mentions légales conformes

### Technique
- ✅ Aucune API tierce payante requise
- ✅ Génération PDF côté serveur
- ✅ Léger et rapide (jsPDF)
- ✅ 100% open source

---

## 🚀 C'EST PRÊT !

Votre système d'envoi de factures PDF est maintenant **100% opérationnel** !

**Commandes de déploiement :**
```bash
supabase functions deploy make-server-04919ac5
```

**Testez immédiatement :**
1. Créez une facture
2. Cliquez sur "Renvoyer" 📧
3. Recevez le PDF professionnel !

---

## 📞 SUPPORT

Si vous rencontrez un problème :
1. Consultez les logs : `supabase functions logs make-server-04919ac5`
2. Vérifiez que RESEND_API_KEY est configurée
3. Testez avec votre propre email d'abord
4. Vérifiez que l'email du client est valide

**Félicitations ! Vos factures sont maintenant envoyées comme un pro ! 🎉📧📄**
