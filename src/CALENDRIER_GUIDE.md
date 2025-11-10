# 📅 Guide du Système de Calendrier

## Vue d'ensemble

Le système de calendrier complet permet de gérer les rendez-vous, disponibilités et événements directement depuis le dashboard CRM.

## Fonctionnalités principales

### 🗓️ Vue Calendrier
- **Calendrier mensuel** avec navigation mois par mois
- **Visualisation des événements** sur chaque jour (points colorés)
- **Sélection de date** pour voir les détails du jour
- **Indicateurs visuels** :
  - Points verts : rendez-vous confirmés
  - Points jaunes : rendez-vous en attente
  - Points bleus : événements personnalisés
  - Fond rouge : journée bloquée

### 📊 Statistiques en temps réel
- **En attente** : Rendez-vous à confirmer
- **Confirmés** : Rendez-vous validés
- **Terminés** : Rendez-vous complétés
- **Annulés** : Rendez-vous annulés

### 📋 Gestion des rendez-vous

#### Actions disponibles
1. **Confirmer** un rendez-vous en attente
2. **Terminer** un rendez-vous confirmé
3. **Annuler** un rendez-vous
4. **Supprimer** définitivement un rendez-vous

#### Filtres et recherche
- Recherche par nom, email
- Filtre par statut (tous, en attente, confirmés, terminés, annulés)

### ⚙️ Gestion des disponibilités

#### Ajouter des disponibilités
1. Cliquer sur "Disponibilités"
2. Sélectionner une date
3. Définir les heures de début et fin (créneaux de 15 minutes)
4. Confirmer

#### Bloquer une journée
1. Cliquer sur "Disponibilités"
2. Sélectionner une date
3. Cocher "Bloquer cette journée"
4. Optionnel : Ajouter une raison (congés, formation, etc.)
5. Confirmer

### 🎯 Événements personnalisés

#### Créer un événement
1. Cliquer sur "Nouvel événement"
2. Renseigner :
   - Titre
   - Date
   - Heure de début et fin
   - Type (événement ou bloqué)
   - Description (optionnelle)
3. Confirmer

## Interface utilisateur

### Prochains rendez-vous (sidebar droite)
- Liste des rendez-vous à venir
- Actions rapides :
  - Confirmer
  - Terminer
  - Annuler
  - Supprimer
- Informations visibles :
  - Nom et email du client
  - Date et heure
  - Durée
  - Statut avec badge coloré

### Liste complète (bas de page)
- Grille avec tous les rendez-vous
- Recherche et filtres
- Informations détaillées :
  - Coordonnées complètes
  - Date, heure, durée
  - Notes/description
  - Téléphone si renseigné

## Routes API utilisées

### Rendez-vous (Bookings)
- `GET /bookings` - Récupérer tous les rendez-vous
- `POST /bookings` - Créer un rendez-vous
- `PUT /bookings/:id` - Mettre à jour un rendez-vous
- `DELETE /bookings/:id` - Supprimer un rendez-vous

### Disponibilités (Availabilities)
- `GET /availabilities` - Récupérer toutes les disponibilités
- `POST /availabilities` - Créer des disponibilités
- `PUT /availabilities/:id` - Mettre à jour
- `DELETE /availabilities/:id` - Supprimer

### Événements (Events)
- `GET /events` - Récupérer tous les événements
- `POST /events` - Créer un événement
- `PUT /events/:id` - Mettre à jour
- `DELETE /events/:id` - Supprimer

## Workflow typique

### Nouveau rendez-vous depuis le site public
1. Client remplit le formulaire sur `/booking`
2. Rendez-vous créé avec statut "pending"
3. Notification dans le dashboard (badge "En attente")
4. Admin consulte le calendrier
5. Admin confirme ou annule le rendez-vous

### Gestion d'une journée
1. Ouvrir le calendrier
2. Cliquer sur "Disponibilités"
3. Sélectionner la date
4. Option A : Ajouter des créneaux (9h-18h par défaut)
5. Option B : Bloquer la journée (congés, etc.)

### Ajouter un événement personnel
1. Cliquer sur "Nouvel événement"
2. Remplir le formulaire
3. Type "Événement" pour événement normal
4. Type "Bloqué" pour bloquer du temps
5. Confirmer

## Statuts des rendez-vous

| Statut | Description | Couleur | Actions disponibles |
|--------|-------------|---------|---------------------|
| **pending** | En attente de confirmation | Jaune | Confirmer, Annuler, Supprimer |
| **confirmed** | Confirmé par l'admin | Vert (#00FFC2) | Terminer, Annuler, Supprimer |
| **completed** | Rendez-vous terminé | Vert foncé | Supprimer |
| **cancelled** | Rendez-vous annulé | Rouge | Supprimer |

## Astuces

### 💡 Bonnes pratiques
- Vérifier quotidiennement les rendez-vous en attente
- Bloquer les journées de congés à l'avance
- Confirmer rapidement les rendez-vous pour éviter les annulations
- Utiliser les notes pour garder le contexte

### 🎨 Design
- Animations fluides avec Motion/React
- Style minimaliste Linear/Vercel
- Couleur principale : #00FFC2 (vert néon)
- Fond sombre : #0C0C0C
- Cartes avec backdrop-blur pour effet glassmorphism

### 📱 Responsive
- Vue adaptée mobile/desktop
- Grille responsive
- Sidebar qui s'adapte

## Prochaines améliorations possibles

- [ ] Synchronisation Google Calendar
- [ ] Envoi d'emails automatiques de confirmation
- [ ] Rappels 24h avant le rendez-vous
- [ ] Intégration visio (Zoom, Google Meet)
- [ ] Export iCal
- [ ] Récurrence d'événements
- [ ] Vue semaine/jour
- [ ] Glisser-déposer pour déplacer les rendez-vous

## Support

Pour toute question sur le système de calendrier, consultez :
- Ce guide
- Le code dans `/components/calendar/CalendarManagement.tsx`
- Les routes serveur dans `/supabase/functions/server/index.tsx`
