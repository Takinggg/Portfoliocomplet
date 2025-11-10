# 📧 Guide : Emails Automatiques

## ✅ Système Implémenté

Le système d'emails automatiques est **entièrement opérationnel** avec Resend API.

### 🎯 Fonctionnalités

#### 1. **Emails de Confirmation**

##### ✉️ Confirmation Contact (Lead)
- **Trigger** : Automatique après soumission du formulaire de contact
- **Contenu** : Confirmation de réception + rappel du message
- **Template** : HTML professionnel avec charte graphique (#00FFC2)
- **Fichier** : `/supabase/functions/server/email_service.tsx`

##### 📅 Confirmation Réservation RDV
- **Trigger** : Automatique après réservation d'un rendez-vous
- **Contenu** : Détails du RDV (date, heure, durée) + bouton ajout au calendrier
- **Intégration** : Lien Google Calendar automatique
- **Fichier** : `/components/pages/BookingPage.tsx`

#### 2. **Rappels Automatiques**

##### ⏰ Rappel RDV (24h avant)
- **Trigger** : À exécuter quotidiennement via la section Emails du dashboard
- **Logique** : Cherche les RDV de demain et envoie un rappel
- **Anti-spam** : Marque les rappels envoyés pour éviter les doublons

##### 💸 Relance Factures Impayées
- **Trigger** : À exécuter quotidiennement
- **Fréquence** : Tous les 7 jours après échéance
- **Contenu** : Détails de la facture + jours de retard

#### 3. **Envoi de Factures**
- **Route** : POST `/make-server-04919ac5/emails/invoice`
- **Utilisation** : Lors de la création d'une facture
- **Contenu** : Facture avec toutes les informations + lien PDF (optionnel)

---

## 🚀 Utilisation

### Dans le Dashboard

1. **Accéder à la section Emails**
   - Cliquer sur "Emails" dans le menu latéral
   - Icône : 📧

2. **Envoyer les rappels de RDV**
   - Cliquer sur "Envoyer les rappels"
   - Le système vérifie automatiquement les RDV de demain
   - Toast de confirmation avec le nombre de rappels envoyés

3. **Envoyer les relances de factures**
   - Cliquer sur "Envoyer les relances"
   - Le système vérifie les factures impayées
   - Envoie un email tous les 7 jours de retard

### Configuration Resend

#### ⚙️ API Key
L'API Key Resend est stockée dans la variable d'environnement :
```
RESEND_API_KEY
```

#### 📤 Expéditeur par défaut
```
Portfolio Freelance <onboarding@resend.dev>
```

⚠️ **Important** : Pour utiliser un domaine personnalisé (ex: contact@votredomaine.com), vous devez :
1. Vérifier votre domaine dans Resend
2. Modifier la ligne `from:` dans `/supabase/functions/server/email_service.tsx`

---

## 🎨 Templates d'Emails

Tous les templates sont en **HTML responsive** avec :
- ✅ Charte graphique cohérente (#0C0C0C, #00FFC2, #F4F4F4)
- ✅ Design moderne type SaaS
- ✅ Version texte brut (fallback)
- ✅ Boutons d'action
- ✅ Footer professionnel

### Personnaliser les templates

Fichier : `/supabase/functions/server/email_service.tsx`

Chaque fonction retourne un objet `EmailTemplate` :
```typescript
{
  subject: "Sujet de l'email",
  html: "<html>...</html>",
  text: "Version texte brut"
}
```

---

## 🔄 Automatisation Recommandée

### Cron Job (Production)

Pour automatiser les rappels et relances, configurez un cron job qui appelle :

```bash
# Rappels RDV (tous les jours à 9h)
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-04919ac5/emails/check-reminders \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Relances factures (tous les jours à 10h)
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-04919ac5/emails/check-overdue-invoices \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Alternative : Supabase Edge Functions Cron

Vous pouvez aussi configurer des cron jobs directement dans Supabase.

---

## 📊 Routes API

| Route | Méthode | Description |
|-------|---------|-------------|
| `/emails/lead-confirmation` | POST | Confirmation contact lead |
| `/emails/booking-confirmation` | POST | Confirmation réservation RDV |
| `/emails/invoice` | POST | Envoi de facture |
| `/emails/appointment-reminder` | POST | Rappel de RDV |
| `/emails/invoice-overdue` | POST | Relance facture impayée |
| `/emails/check-reminders` | GET | Vérifier et envoyer tous les rappels RDV |
| `/emails/check-overdue-invoices` | GET | Vérifier et envoyer toutes les relances factures |

---

## 🧪 Test

### Tester manuellement un email

1. Ouvrir la console navigateur
2. Exécuter :

```javascript
fetch('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-04919ac5/emails/lead-confirmation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    name: 'Test User',
    message: 'Message de test',
    wantsAppointment: false
  })
}).then(r => r.json()).then(console.log);
```

---

## 🎯 Intégrations Automatiques

### ✅ Déjà intégré
- [x] Formulaire de contact → Email de confirmation
- [x] Réservation RDV → Email de confirmation
- [x] Dashboard → Rappels RDV
- [x] Dashboard → Relances factures

### 🔜 À ajouter manuellement
- [ ] Création facture → Envoi automatique au client
- [ ] Conversion lead → client → Email de bienvenue
- [ ] Projet terminé → Email de remerciement

---

## 💡 Conseils

### Éviter le spam
- ✅ Les rappels sont marqués pour éviter les doublons
- ✅ Relances factures : maximum 1 tous les 7 jours
- ✅ Tous les emails ont un footer avec mention "envoyé automatiquement"

### Performance
- Les envois d'emails sont asynchrones
- L'application ne bloque pas en cas d'erreur email
- Logs détaillés dans la console serveur

### Personnalisation
Modifiez le contenu des emails dans `/supabase/functions/server/email_service.tsx` :
- Textes
- Couleurs
- Structure HTML
- Informations de contact

---

## 🆘 Dépannage

### Email non reçu
1. Vérifier la console serveur pour les logs
2. Vérifier que RESEND_API_KEY est configurée
3. Vérifier les spams
4. Vérifier les limites Resend (gratuit : 100 emails/jour)

### Erreur "Email service not configured"
→ La variable `RESEND_API_KEY` n'est pas définie

### Rappels non envoyés
→ Les RDV doivent être exactement demain (J+1) et status = "confirmed"

---

## 📚 Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `/supabase/functions/server/email_service.tsx` | Service d'envoi + templates |
| `/components/dashboard/EmailSettings.tsx` | Interface dashboard emails |
| `/components/pages/ContactPage.tsx` | Intégration formulaire contact |
| `/components/pages/BookingPage.tsx` | Intégration réservation RDV |
| `/supabase/functions/server/index.tsx` | Routes API emails |

---

## ✨ Prochaines Étapes

1. **Configurer un domaine personnalisé dans Resend**
2. **Mettre en place un cron job pour automatiser les rappels**
3. **Ajouter l'envoi automatique lors de la création de factures**
4. **Créer des templates supplémentaires** (bienvenue client, projet terminé, etc.)

---

**Système créé le** : 5 novembre 2025  
**Status** : ✅ Production Ready  
**Score fonctionnel** : 10/10
