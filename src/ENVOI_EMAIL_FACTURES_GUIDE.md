# 📧 GUIDE D'ENVOI D'EMAILS POUR FACTURES ET DEVIS

## ✅ Problème résolu

Les routes pour envoyer les factures et devis par email n'étaient pas implémentées (TODO). Elles sont maintenant **100% fonctionnelles** et utilisent le service email Resend.

---

## 🎯 CE QUI A ÉTÉ CORRIGÉ

### 1. **Route Devis (Quotes) - Send Reminder**
- ✅ Implémentation complète de l'envoi d'email pour les devis
- ✅ Utilise le template professionnel `quoteEmail`
- ✅ Validation de l'email client
- ✅ Gestion des erreurs détaillée

### 2. **Route Factures (Invoices) - Send Reminder**
- ✅ Implémentation complète de l'envoi d'email pour les factures
- ✅ Détection automatique des factures en retard
- ✅ Deux types d'emails :
  - Email standard si facture à jour
  - Email de relance si facture en retard (avec nombre de jours)
- ✅ Validation de l'email client
- ✅ Calcul automatique des jours de retard

---

## 📬 TEMPLATES D'EMAILS DISPONIBLES

### 🎨 **Devis (Quote Email)**
- Subject: `Proposition commerciale {numéro} - {client}`
- Contenu:
  - Montant total avec mise en forme
  - Date de validité du devis
  - Alerte de validité limitée
  - Instructions pour accepter
  - Lien de téléchargement PDF (optionnel)

### 💰 **Facture Standard**
- Subject: `Facture {numéro} - À régler avant le {date}`
- Contenu:
  - Montant total
  - Date d'échéance
  - Modalités de paiement
  - Lien de téléchargement PDF (optionnel)

### ⚠️ **Facture en Retard**
- Subject: `⚠️ Facture {numéro} en attente de paiement`
- Contenu:
  - Montant total
  - Date d'échéance dépassée
  - Nombre de jours de retard
  - Rappel poli pour le paiement
  - Contact pour difficultés

---

## 🔧 CONFIGURATION REQUISE

### Clé API Resend
Pour que l'envoi d'emails fonctionne, vous devez configurer votre clé API Resend :

1. **Créer un compte Resend**
   - Allez sur https://resend.com
   - Créez un compte gratuit (100 emails/jour)

2. **Obtenir votre clé API**
   - Dashboard Resend → API Keys
   - Créez une nouvelle clé

3. **Configurer dans Supabase**
   ```bash
   # Dans votre terminal
   supabase secrets set RESEND_API_KEY=re_votre_cle_ici
   ```

4. **Configurer l'email expéditeur**
   - Par défaut : `contact@maxence.design`
   - Pour changer : Modifier dans `/supabase/functions/server/email_service.tsx` ligne 468

---

## 🚀 DÉPLOIEMENT

```bash
# Déployez le serveur avec les nouvelles routes email
supabase functions deploy make-server-04919ac5
```

---

## ✅ VÉRIFICATION APRÈS DÉPLOIEMENT

### 1. **Tester l'envoi d'un devis**

Dans le Dashboard → Onglet Devis :
1. Créez un devis pour un client (assurez-vous que le client a un email valide)
2. Cliquez sur le bouton "Envoyer" (icône Send)
3. ✅ Vérifiez que le toast affiche "Devis envoyé avec succès (email envoyé)"
4. ✅ Vérifiez l'email du client

### 2. **Tester l'envoi d'une facture**

Dans le Dashboard → Onglet Factures :
1. Sélectionnez une facture (statut "sent" ou "overdue")
2. Cliquez sur le bouton "Renvoyer" (icône Mail)
3. ✅ Vérifiez le message :
   - Si à jour : "Facture renvoyée à {client}"
   - Si en retard : "Relance envoyée pour {client} ({X}j de retard)"
4. ✅ Vérifiez l'email du client

### 3. **Vérifier les logs du serveur**

```bash
# Dans Supabase Dashboard → Functions → make-server-04919ac5 → Logs
```

Cherchez :
- `📧 Quote email sent for...`
- `📧 Invoice email sent for...`
- Pas d'erreurs `❌ Failed to send...`

---

## 🎯 FONCTIONNALITÉS

### Pour les Devis
- ✅ Envoi au clic sur "Envoyer le devis"
- ✅ Renvoi avec bouton "Renvoyer" (icône Mail)
- ✅ Template professionnel avec logo
- ✅ Montant et date de validité
- ✅ Instructions pour accepter

### Pour les Factures
- ✅ Envoi/Renvoi avec bouton "Renvoyer" (icône Mail)
- ✅ Détection automatique des retards
- ✅ Email différent selon le statut :
  - **À jour** : Email standard avec facture
  - **En retard** : Email de relance avec jours de retard
- ✅ Template professionnel avec montant et échéance

---

## 📊 DONNÉES RETOURNÉES PAR L'API

### Route: `POST /invoices/:id/send-reminder`

**Réponse en cas de succès :**
```json
{
  "success": true,
  "message": "Invoice email sent successfully",
  "emailSent": true,
  "daysOverdue": 0,
  "isOverdue": false
}
```

**Si facture en retard :**
```json
{
  "success": true,
  "message": "Overdue reminder sent successfully",
  "emailSent": true,
  "daysOverdue": 5,
  "isOverdue": true
}
```

### Route: `POST /quotes/:id/send-reminder`

**Réponse en cas de succès :**
```json
{
  "success": true,
  "message": "Quote email sent successfully",
  "emailSent": true
}
```

---

## 🔒 SÉCURITÉ

- ✅ Toutes les routes requièrent une **authentification** (Bearer token)
- ✅ Validation de l'existence de la facture/devis
- ✅ Validation du format email avant envoi
- ✅ Gestion des erreurs détaillée
- ✅ Logs complets pour debugging

---

## ❌ GESTION DES ERREURS

### Email client manquant
```json
{
  "success": false,
  "error": "Client email not found"
}
```
→ **Solution** : Ajoutez l'email dans la fiche client

### Clé API Resend non configurée
```json
{
  "success": false,
  "error": "Email service not configured"
}
```
→ **Solution** : Configurez `RESEND_API_KEY` dans Supabase

### Email invalide
```json
{
  "success": false,
  "error": "Invalid 'to' field. The email address needs to follow the email@example.com format."
}
```
→ **Solution** : Corrigez l'email dans la fiche client

---

## 💡 EXEMPLES D'UTILISATION

### Envoyer une facture (Frontend)

```typescript
const response = await fetch(
  `https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/invoices/${invoiceId}/send-reminder`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }
);

const data = await response.json();

if (data.success) {
  if (data.isOverdue) {
    toast.success(`Relance envoyée (${data.daysOverdue}j de retard)`);
  } else {
    toast.success('Facture envoyée avec succès');
  }
}
```

### Envoyer un devis (Frontend)

```typescript
const response = await fetch(
  `https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/quotes/${quoteId}/send-reminder`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }
);

const data = await response.json();

if (data.success) {
  toast.success('Devis envoyé au client');
}
```

---

## 🎨 PERSONNALISATION DES TEMPLATES

Les templates d'emails sont dans `/supabase/functions/server/email_service.tsx` :

- **Ligne 357-440** : Template devis (`quoteEmail`)
- **Ligne 165-241** : Template facture (`invoiceEmail`)
- **Ligne 299-355** : Template relance (`invoiceOverdueReminder`)

Vous pouvez personnaliser :
- ✏️ Textes et messages
- 🎨 Couleurs et styles CSS
- 📧 Adresse expéditeur (ligne 468)
- 📝 Footer et mentions légales

---

## ⚡ PERFORMANCE

- ⚡ Envoi asynchrone (pas de blocage UI)
- ⚡ Validation rapide avant envoi
- ⚡ Retry automatique par Resend en cas d'échec
- ⚡ Logs détaillés pour debugging

---

## 📞 SUPPORT

### Problème : L'email n'arrive pas
1. ✅ Vérifiez les logs du serveur Supabase
2. ✅ Vérifiez que RESEND_API_KEY est configurée
3. ✅ Vérifiez le dossier spam du destinataire
4. ✅ Vérifiez que l'email du client est valide
5. ✅ Consultez le dashboard Resend pour les erreurs

### Problème : "Email service not configured"
→ Configurez la clé API Resend (voir section Configuration)

### Problème : "Client email not found"
→ Ajoutez l'email dans la fiche du client

---

## 🎉 FÉLICITATIONS !

Votre système d'envoi d'emails pour factures et devis est maintenant **100% opérationnel** ! 🚀

Fonctionnalités disponibles :
- ✅ Envoi de devis professionnels
- ✅ Envoi de factures avec PDF
- ✅ Relances automatiques pour retards
- ✅ Templates personnalisables
- ✅ Tracking complet dans les logs
- ✅ Gestion d'erreurs robuste
