# 📅 Guide du Calendrier de Rendez-vous

## 🎯 Vue d'ensemble

Le système de calendrier complet permet de gérer tous les rendez-vous de manière visuelle et interactive, avec emails automatiques pour chaque action.

## ✨ Fonctionnalités Principales

### 1. 📊 Vue Calendrier
- **Affichage mensuel** : Voir tous les RDV du mois en un coup d'œil
- **Navigation fluide** : Mois précédent/suivant + bouton "Aujourd'hui"
- **Codes couleur** :
  - 🟢 **Vert** : Rendez-vous confirmés
  - 🔴 **Rouge** : Rendez-vous annulés
  - 🟡 **Jaune** : Rendez-vous en attente

### 2. ⚡ Actions Rapides

#### ✅ Confirmer un RDV
- Clic sur le RDV → Bouton "Confirmer"
- ✉️ **Email automatique** envoyé au client avec :
  - Date et heure formatées
  - Service demandé
  - Informations de contact
  - Design professionnel (gradient violet)

#### ❌ Annuler un RDV
- Clic sur le RDV → Bouton "Annuler"
- Popup demandant la raison (optionnel)
- ✉️ **Email automatique** envoyé avec :
  - Raison de l'annulation
  - Invitation à reprendre un nouveau RDV
  - Design professionnel (gradient rouge)

#### ✏️ Modifier un RDV
- Clic sur le RDV → Bouton "Modifier"
- Ouverture du dialogue d'édition
- Possibilité de changer :
  - Date
  - Heure
  - Service
  - Informations client
  - Statut

### 3. 📧 Emails Automatiques

Tous les emails sont envoyés via **Resend API** avec des templates HTML professionnels :

#### Email de Confirmation
```
Sujet: ✅ Rendez-vous confirmé - [Date] à [Heure]
Contenu:
- Message de confirmation
- Détails du RDV (date, heure, service)
- Instructions pour modifier/annuler
- Footer automatique
```

#### Email d'Annulation
```
Sujet: ❌ Rendez-vous annulé - [Date] à [Heure]
Contenu:
- Message d'annulation
- Raison (si fournie)
- Invitation à reprendre RDV
- Coordonnées de contact
```

#### Email de Nouveau RDV
```
Sujet: ⏳ Nouveau rendez-vous - [Date] à [Heure]
Contenu:
- Confirmation de réception
- Statut "En attente de confirmation"
- Détails de la demande
- Promesse de réponse rapide
```

## 🎨 Interface Utilisateur

### Navigation Dashboard
```tsx
Pipeline | Calendrier
   ↓         ↓
 Liste    Vue Mois
 Items    RDV visuels
```

Basculer entre :
- **Pipeline** : Vue liste traditionnelle avec groupement par client
- **Calendrier** : Vue mensuelle avec RDV visuels

### Interactions

1. **Clic sur un jour** : Voir tous les RDV de ce jour
2. **Clic sur un RDV** : Ouvrir le modal de détails avec actions
3. **Hover sur RDV** : Légère animation de zoom
4. **Badge compteur** : Nombre total de RDV sur le bouton "Calendrier"

## 🔧 Configuration Technique

### Routes API (Serveur)
```typescript
// Confirmation/Annulation
POST /emails/booking-confirmation
Body: {
  to: string,        // Email client
  name: string,      // Nom client
  date: string,      // YYYY-MM-DD
  time: string,      // HH:MM
  service?: string,  // Service demandé
  status: 'confirmed' | 'cancelled' | 'pending',
  message?: string   // Note optionnelle
}
```

### Composants

**BookingCalendar.tsx** (571 lignes)
- Génération du calendrier mensuel
- Gestion des bookings par date
- Modal de détails interactif
- Actions confirm/cancel/edit avec emails

**MinimalistDashboard.tsx** (2096 lignes)
- Toggle Pipeline/Calendrier
- Intégration BookingCalendar
- État `activeView` pour basculer les vues

### États
```typescript
const [activeView, setActiveView] = useState<"pipeline" | "calendar">("pipeline");
const [currentDate, setCurrentDate] = useState(new Date());
const [selectedBooking, setSelectedBooking] = useState<any>(null);
```

## 📝 Workflow Typique

### Nouveau RDV
1. Client remplit le formulaire public
2. RDV créé avec status "pending" (jaune)
3. **Email automatique** envoyé : "Demande reçue"
4. RDV apparaît dans le calendrier

### Confirmation
1. Admin ouvre le calendrier
2. Clic sur RDV jaune (pending)
3. Bouton "Confirmer"
4. Status → "confirmed" (vert)
5. **Email automatique** : "RDV confirmé"
6. Toast vert : "Email de confirmation envoyé"

### Annulation
1. Admin ou changement de plan
2. Clic sur RDV (n'importe quel status)
3. Bouton "Annuler" → Popup raison
4. Status → "cancelled" (rouge)
5. **Email automatique** : "RDV annulé + raison"
6. Toast rouge : "Email d'annulation envoyé"

### Modification
1. Clic sur RDV → Bouton "Modifier"
2. Dialogue d'édition s'ouvre
3. Changement date/heure/service
4. Sauvegarde → PUT /bookings/:id
5. Option : Envoyer email de modification
6. Refresh du calendrier

## 🚀 Idées d'Amélioration Future

### Court Terme
- [ ] **Email de modification** : Prévenir automatiquement quand date/heure change
- [ ] **Rappels 24h avant** : Cron job pour envoyer rappels
- [ ] **Vue semaine/jour** : Ajouter d'autres vues calendrier
- [ ] **Drag & Drop** : Déplacer RDV entre jours
- [ ] **Disponibilités** : Bloquer certaines heures

### Moyen Terme
- [ ] **Récurrence** : RDV récurrents (hebdo, mensuel)
- [ ] **Catégories** : Types de services avec durées
- [ ] **Salle/Ressource** : Gestion des ressources
- [ ] **Export ICS** : Synchroniser avec calendriers externes
- [ ] **Statistiques** : Taux de no-show, heures populaires

### Long Terme
- [ ] **Booking public** : Widget calendrier pour site web
- [ ] **SMS notifications** : En plus des emails
- [ ] **Paiement anticipé** : Caution pour réserver
- [ ] **Visioconférence** : Liens Zoom/Meet automatiques
- [ ] **Notes internes** : Commentaires admin invisibles au client

## 🎯 KPIs à Suivre

1. **Taux de confirmation** : RDV confirmés / Total RDV
2. **Taux d'annulation** : RDV annulés / Total RDV
3. **Délai moyen de confirmation** : Temps entre demande et confirmation
4. **No-show rate** : RDV confirmés mais pas venus
5. **Heures populaires** : Créneaux les plus demandés
6. **Services populaires** : Types de RDV les plus fréquents

## 💡 Conseils d'Utilisation

### ✅ Bonnes Pratiques
- Confirmer les RDV dans les 24h
- Toujours indiquer une raison lors d'annulation
- Utiliser le message personnalisé pour instructions spéciales
- Vérifier le calendrier tous les matins
- Activer les notifications navigateur

### ❌ À Éviter
- Ne pas laisser des RDV en "pending" trop longtemps
- Ne pas annuler sans raison (mauvaise expérience client)
- Ne pas oublier d'envoyer l'email de confirmation
- Ne pas surcharger le calendrier (prévoir pauses)

## 🔐 Sécurité

- Routes `/emails/*` nécessitent authentification
- Validation des champs email (format, existence)
- Rate limiting sur envoi emails (éviter spam)
- RESEND_API_KEY en variable d'environnement
- Logs côté serveur pour audit

## 📞 Support

En cas de problème :
1. Vérifier les logs serveur : Supabase Dashboard → Edge Functions
2. Vérifier variable RESEND_API_KEY configurée
3. Tester route email manuellement via Postman
4. Vérifier quota Resend (100 emails/jour en gratuit)

---

**Version** : 1.0.0  
**Date** : Novembre 2024  
**Auteur** : CRM Portfolio System
