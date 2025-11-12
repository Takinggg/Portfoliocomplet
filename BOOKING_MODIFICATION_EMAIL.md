# 🔄 Email Automatique de Modification de RDV

## ✅ Fonctionnalité Implémentée

Quand un administrateur modifie la **date** ou l'**heure** d'un rendez-vous, un email automatique est maintenant envoyé au client avec les nouvelles informations.

## 📧 Template Email "Modified"

### Design
- **Icône** : 🔄 (Flèches circulaires)
- **Couleur** : Gradient violet (même que confirmation)
- **Sujet** : `🔄 Rendez-vous modifié - [Nouvelle Date] à [Nouvelle Heure]`

### Contenu
```html
- Message d'information : "Votre rendez-vous a été modifié"
- Encadré d'alerte jaune avec les changements :
  * "Ancien rendez-vous : [Date] à [Heure]"
  * "Nouveau rendez-vous : [Date] à [Heure]"
- Nouvelles informations détaillées :
  * 📅 Nouvelle date (formatée en français complet)
  * 🕐 Nouvelle heure
  * 💼 Service (si présent)
- Message de contact si changement ne convient pas
- Footer automatique
```

## 🔍 Détection Automatique

La fonction `handleSaveBooking` détecte automatiquement si :
```typescript
bookingData.date !== editingBooking.date  // Date changée
OU
bookingData.time !== editingBooking.time  // Heure changée
```

Si l'un des deux a changé → **Email automatique envoyé**

## 🎯 Workflow Complet

### 1. Admin Modifie un RDV
```
Dashboard → Calendrier → Clic sur RDV → Bouton "Modifier"
OU
Dashboard → Pipeline → Clic sur RDV → Bouton Edit (violet)
```

### 2. Changement de Date/Heure
```
Dialogue d'édition ouvert
→ Admin change la date (ex: du 15/11 au 20/11)
→ Admin change l'heure (ex: de 14:00 à 16:00)
→ Clic "Sauvegarder"
```

### 3. Système Détecte le Changement
```typescript
// Comparaison automatique
const dateChanged = (
  bookingData.date !== editingBooking.date || 
  bookingData.time !== editingBooking.time
);

if (dateChanged) {
  // Préparer le message de changement
  const changeMessage = `
    Ancien rendez-vous : ${oldDate} à ${oldTime}
    Nouveau rendez-vous : ${newDate} à ${newTime}
  `;
}
```

### 4. Email Envoyé Automatiquement
```typescript
POST /emails/booking-confirmation
Body: {
  to: "client@email.com",
  name: "Jean Dupont",
  date: "2024-11-20",
  time: "16:00",
  service: "Consultation",
  status: "modified",  // ← Nouveau statut !
  message: "Ancien rendez-vous : mercredi 15 novembre 2024 à 14:00
            Nouveau rendez-vous : lundi 20 novembre 2024 à 16:00"
}
```

### 5. Toast de Confirmation
```
Affichage notification bleue en haut à droite :
🔄 Rendez-vous modifié !
   Email de modification envoyé à client@email.com
```

## 📊 Cas d'Usage

### Cas 1 : Changement de Date Seule
```
Avant : 15/11/2024 à 14:00
Après  : 20/11/2024 à 14:00
→ Email envoyé ✅
```

### Cas 2 : Changement d'Heure Seule
```
Avant : 15/11/2024 à 14:00
Après  : 15/11/2024 à 16:00
→ Email envoyé ✅
```

### Cas 3 : Changement Date + Heure
```
Avant : 15/11/2024 à 14:00
Après  : 20/11/2024 à 16:00
→ Email envoyé ✅
```

### Cas 4 : Changement Autre Info (nom, service, etc.)
```
Avant : Service = "Consultation"
Après  : Service = "Réunion"
→ Pas d'email envoyé (seulement date/heure déclenchent l'email)
```

## 🎨 Exemple Email Reçu

```
De: Portfolio CRM <onboarding@resend.dev>
À: jean.dupont@email.com
Sujet: 🔄 Rendez-vous modifié - lundi 20 novembre 2024 à 16:00

┌─────────────────────────────────────┐
│          🔄                          │
│   Rendez-vous Modifié               │
└─────────────────────────────────────┘

Bonjour Jean Dupont,

Votre rendez-vous a été modifié.

┌─────────────────────────────────────┐
│ ⚠️ Changement :                      │
│                                     │
│ Ancien rendez-vous :                │
│ mercredi 15 novembre 2024 à 14:00  │
│                                     │
│ Nouveau rendez-vous :               │
│ lundi 20 novembre 2024 à 16:00     │
└─────────────────────────────────────┘

📅 Nouvelles informations :

📅 Nouvelle date : lundi 20 novembre 2024
🕐 Nouvelle heure : 16:00
💼 Service : Consultation

Si ces nouvelles informations ne vous 
conviennent pas, merci de nous contacter 
au plus tôt.

---
Cet email a été envoyé automatiquement,
merci de ne pas y répondre.
```

## 🔧 Code Technique

### Serveur (index.ts)
```typescript
// Ligne ~1000 dans index.ts
else if (status === 'modified') {
  subject = `🔄 Rendez-vous modifié - ${formattedDate} à ${time}`;
  html = `
    <!-- Template HTML avec alert box jaune -->
    <div class="alert-box">
      <strong>⚠️ Changement :</strong><br>
      ${message}
    </div>
    <!-- Nouvelles informations -->
  `;
}
```

### Frontend (MinimalistDashboard.tsx)
```typescript
// Ligne ~220 dans MinimalistDashboard.tsx
const handleSaveBooking = async (bookingData: any) => {
  // ... code de sauvegarde ...
  
  // Détection changement
  const dateChanged = editingBooking && (
    bookingData.date !== editingBooking.date || 
    bookingData.time !== editingBooking.time
  );

  if (response.ok && dateChanged) {
    // Formater les dates
    const oldDate = new Date(editingBooking.date).toLocaleDateString('fr-FR', {...});
    const newDate = new Date(bookingData.date).toLocaleDateString('fr-FR', {...});
    
    // Envoyer email
    await fetch('/emails/booking-confirmation', {
      method: 'POST',
      body: JSON.stringify({
        ...bookingData,
        status: 'modified',
        message: `Ancien: ${oldDate} à ${oldTime}\nNouveau: ${newDate} à ${newTime}`
      })
    });
    
    // Toast notification
    showNotification('blue', 'Rendez-vous modifié !', 'Email envoyé');
  }
};
```

## 📈 Statistiques Possibles

Pour mesurer l'efficacité :
```typescript
// Ajouter au tableau de bord
- Nombre de modifications par mois
- Taux de modifications (modifs / total RDV)
- Délai moyen entre création et modification
- Raisons de modifications (si on ajoute un champ)
```

## 💡 Améliorations Futures

### Court Terme
- [ ] Permettre de **désactiver** l'envoi d'email (checkbox dans le dialogue)
- [ ] Ajouter un champ "Raison de la modification" (optionnel)
- [ ] Logger les modifications dans un historique

### Moyen Terme
- [ ] Email différent selon l'ampleur du changement :
  * Petit changement (≤30 min) : Email léger
  * Grand changement (>1 jour) : Email détaillé
- [ ] Permettre de proposer plusieurs créneaux alternatifs
- [ ] Intégration calendrier client (Google Calendar, Outlook)

### Long Terme
- [ ] Validation client requise pour accepter le nouveau créneau
- [ ] Compensation automatique (ex: réduction si modification last-minute)
- [ ] Historique des modifications visible par le client

## 🎯 Récapitulatif

✅ **Ce qui fonctionne maintenant :**
1. Modification d'un RDV (date ou heure)
2. Détection automatique du changement
3. Email professionnel envoyé automatiquement
4. Toast de confirmation pour l'admin
5. Template HTML responsive et design

✅ **Tous les statuts email supportés :**
- `pending` → Email "Demande reçue" (jaune)
- `confirmed` → Email "Confirmé" (vert)
- `cancelled` → Email "Annulé" (rouge)
- `modified` → Email "Modifié" (bleu) ← **NOUVEAU**

---

**Version** : 1.1.0  
**Date** : Novembre 2024  
**Feature** : Email automatique de modification
