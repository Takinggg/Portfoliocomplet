# 📅 Système de Calendrier - Documentation Complète

## 📖 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Démarrage rapide](#démarrage-rapide)
3. [Fonctionnalités](#fonctionnalités)
4. [Architecture](#architecture)
5. [Guide d'utilisation](#guide-dutilisation)

---

## 🎯 Vue d'ensemble

Le système de calendrier est un module complet intégré au dashboard CRM permettant de gérer :
- ✅ **Rendez-vous** provenant du formulaire de réservation public
- 📆 **Événements personnalisés** (réunions, tâches, etc.)
- 🚫 **Disponibilités et blocages** (congés, indisponibilités)
- 📊 **Statistiques en temps réel**

### Captures d'écran

**Vue principale du calendrier**
```
┌─────────────────────────────────────────────────────────────┐
│ 📅 Calendrier & Rendez-vous              [+ Événement] [⚙️] │
├─────────────────────────────────────────────────────────────┤
│  En attente │ Confirmés │ Terminés │ Annulés                │
│      2      │     5     │    12    │    1                   │
├───────────────────────────┬─────────────────────────────────┤
│                           │  Prochains RDV                  │
│   CALENDRIER MENSUEL      │  ┌──────────────────────────┐  │
│   ← Novembre 2025 →       │  │ Sophie Dubois           │  │
│                           │  │ 🟢 Confirmé             │  │
│   D  L  M  M  J  V  S     │  │ 08/11 • 14:00 • 30min  │  │
│      1  2  3  4  5  6     │  │ [Terminer] [Annuler]   │  │
│   7 🟢 9 10 🟡 12 13       │  └──────────────────────────┘  │
│  14 15 16 17 18 19 20     │                                 │
│  21 22 23 24 25 26 27     │  + 3 autres rendez-vous...     │
│  28 29 30                 │                                 │
└───────────────────────────┴─────────────────────────────────┘
│  Tous les rendez-vous          [Recherche] [Filtres]       │
│  ┌──────────┬──────────┬──────────┬──────────┐             │
│  │ Card 1   │ Card 2   │ Card 3   │ Card 4   │             │
│  └──────────┴──────────┴──────────┴──────────┘             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Démarrage rapide

### Première utilisation

1. **Accéder au calendrier**
   ```
   Dashboard → Calendrier (menu de gauche)
   ```

2. **Voir les rendez-vous en attente**
   - Badge orange sur "Calendrier" = nombre en attente
   - Cartes jaunes dans "Prochains RDV"

3. **Première action : Confirmer un rendez-vous**
   ```
   Cliquer sur "✓ Confirmer" → Le rendez-vous devient vert
   ```

👉 **Guide de démarrage détaillé** : `CALENDRIER_QUICKSTART.md`

---

## 🎨 Fonctionnalités

### 1. Calendrier mensuel interactif

#### Visualisation
- **Navigation** par mois (flèches gauche/droite)
- **Indicateurs colorés** sur chaque jour :
  - 🟢 Vert = Rendez-vous confirmé
  - 🟡 Jaune = Rendez-vous en attente
  - 🔵 Bleu = Événement personnel
  - 🔴 Rouge = Journée bloquée
- **Sélection de jour** pour voir les détails

#### Interactions
- Cliquer sur un jour → Affiche événements du jour
- Aujourd'hui = bordure blanche
- Jours passés = grisés

### 2. Gestion des rendez-vous

#### Statuts disponibles
| Statut | Description | Actions |
|--------|-------------|---------|
| **pending** 🟡 | En attente de confirmation | Confirmer, Annuler, Supprimer |
| **confirmed** 🟢 | Confirmé par vous | Terminer, Annuler, Supprimer |
| **completed** ✅ | Rendez-vous effectué | Supprimer |
| **cancelled** 🔴 | Annulé | Supprimer |

#### Actions rapides
- **Confirmer** : Valider un rendez-vous en attente
- **Terminer** : Marquer un rendez-vous comme effectué
- **Annuler** : Annuler un rendez-vous
- **Supprimer** : Effacer définitivement

### 3. Gestion des disponibilités

#### Définir des créneaux disponibles
```
1. Cliquer sur "⚙️ Disponibilités"
2. Sélectionner une date
3. Définir horaires (ex: 9h → 18h)
4. Créneaux automatiques de 15 minutes
```

#### Bloquer une journée
```
1. Cliquer sur "⚙️ Disponibilités"
2. Sélectionner la date
3. ✅ Cocher "Bloquer cette journée"
4. Optionnel : Raison (congés, formation...)
5. Confirmer
```

**Résultat** : La journée apparaît en rouge sur le calendrier

### 4. Événements personnalisés

#### Créer un événement
```
1. Cliquer sur "+ Nouvel événement"
2. Formulaire :
   - Titre (ex: "Réunion équipe")
   - Date
   - Heure début/fin
   - Type (événement ou bloqué)
   - Description (optionnel)
3. Créer
```

**Utilité** : Bloquer du temps, ajouter des rappels, etc.

### 5. Statistiques et KPIs

**Cards en haut de page** :
- **En attente** : Nombre de rendez-vous à confirmer
- **Confirmés** : Rendez-vous validés
- **Terminés** : Historique complété
- **Annulés** : Rendez-vous annulés

**Mise à jour** : Temps réel à chaque action

### 6. Recherche et filtres

#### Barre de recherche
- Recherche par **nom**
- Recherche par **email**
- Recherche instantanée

#### Filtres
- Tous les statuts
- En attente uniquement
- Confirmés uniquement
- Terminés uniquement
- Annulés uniquement

---

## 🏗️ Architecture

### Composants

```
/components/calendar/
  └── CalendarManagement.tsx    # Composant principal
  
/components/pages/
  └── DashboardPage.tsx          # Intégration dashboard
  
/supabase/functions/server/
  └── index.tsx                  # Routes API
```

### Routes API

#### Bookings (Rendez-vous)
```
GET    /make-server-04919ac5/bookings           # Liste
POST   /make-server-04919ac5/bookings           # Créer
PUT    /make-server-04919ac5/bookings/:id       # Modifier
DELETE /make-server-04919ac5/bookings/:id       # Supprimer
```

#### Availabilities (Disponibilités)
```
GET    /make-server-04919ac5/availabilities     # Liste
POST   /make-server-04919ac5/availabilities     # Créer
PUT    /make-server-04919ac5/availabilities/:id # Modifier
DELETE /make-server-04919ac5/availabilities/:id # Supprimer
```

#### Events (Événements)
```
GET    /make-server-04919ac5/events             # Liste
POST   /make-server-04919ac5/events             # Créer
PUT    /make-server-04919ac5/events/:id         # Modifier
DELETE /make-server-04919ac5/events/:id         # Supprimer
```

### Stockage de données

**KV Store Supabase** :
- `booking_*` : Rendez-vous
- `availability_*` : Disponibilités
- `event_*` : Événements personnalisés

### Technologies utilisées

- **React** : Interface
- **Motion/React** : Animations fluides
- **Shadcn/UI** : Composants (Dialog, Card, Badge, etc.)
- **Tailwind CSS** : Styling
- **Supabase** : Backend + stockage
- **Hono** : Serveur API

---

## 📚 Guide d'utilisation

### Workflows types

#### 1. Nouveau client réserve un rendez-vous

```
Client remplit formulaire sur /booking
         ↓
Rendez-vous créé (statut: pending)
         ↓
Badge orange apparaît sur "Calendrier"
         ↓
Vous consultez le calendrier
         ↓
Vous cliquez sur "Confirmer"
         ↓
Rendez-vous confirmé (statut: confirmed)
         ↓
Rendez-vous effectué
         ↓
Vous cliquez sur "Terminer"
         ↓
Rendez-vous archivé (statut: completed)
```

#### 2. Planifier vos congés

```
Cliquer sur "Disponibilités"
         ↓
Sélectionner première date de congés
         ↓
Cocher "Bloquer cette journée"
         ↓
Raison : "Congés d'été"
         ↓
Répéter pour chaque jour
         ↓
Calendrier affiche jours en rouge
```

#### 3. Ajouter une réunion interne

```
Cliquer sur "+ Nouvel événement"
         ↓
Titre : "Réunion d'équipe"
         ↓
Date + Horaires
         ↓
Type : "Événement"
         ↓
Créer
         ↓
Point bleu apparaît sur le calendrier
```

### Bonnes pratiques

#### Quotidien
- ✅ Vérifier les nouveaux rendez-vous (matin)
- ✅ Confirmer rapidement les rendez-vous en attente
- ✅ Marquer "Terminé" après chaque rendez-vous

#### Hebdomadaire
- ✅ Planifier les disponibilités de la semaine suivante
- ✅ Nettoyer les rendez-vous annulés/terminés

#### Mensuel
- ✅ Bloquer les jours de congés à l'avance
- ✅ Analyser les statistiques (taux de confirmation, etc.)

---

## 🎯 Cas d'usage

### Scénario A : Confirmation rapide
**Problème** : 5 nouveaux rendez-vous en attente  
**Solution** :
1. Badge "5" sur Calendrier
2. Aller dans Calendrier
3. Pour chaque rendez-vous : "Confirmer" ou "Annuler"
4. Badge disparaît

### Scénario B : Gérer un imprévu
**Problème** : Vous devez annuler tous les rendez-vous de demain  
**Solution** :
1. Cliquer sur demain dans le calendrier
2. Voir tous les événements du jour
3. Pour chaque : "Annuler"
4. Optionnel : Bloquer la journée

### Scénario C : Planifier les vacances
**Problème** : Bloquer 2 semaines de congés  
**Solution** :
1. "Disponibilités"
2. Pour chaque jour de congés :
   - Sélectionner date
   - Bloquer journée
   - Raison : "Vacances été 2025"
3. Calendrier montre toutes les dates en rouge

---

## 📖 Documentation complète

### Fichiers de documentation

| Fichier | Description | Audience |
|---------|-------------|----------|
| `CALENDRIER_README.md` | Vue d'ensemble (ce fichier) | Tous |
| `CALENDRIER_QUICKSTART.md` | Démarrage rapide (3 min) | Débutants |
| `CALENDRIER_GUIDE.md` | Guide complet et technique | Avancé |

### Code source

| Fichier | Fonction |
|---------|----------|
| `/components/calendar/CalendarManagement.tsx` | Composant principal |
| `/components/pages/DashboardPage.tsx` | Intégration dashboard |
| `/supabase/functions/server/index.tsx` | Routes API backend |
| `/utils/seedDemoData.ts` | Données de démo |

---

## 🎨 Design

### Palette de couleurs
- **Fond** : #0C0C0C (noir)
- **Accent** : #00FFC2 (vert néon)
- **Texte** : #F4F4F4 (blanc cassé)
- **Cartes** : black/40 avec backdrop-blur

### Style
- **Minimaliste** inspiré de Linear/Vercel
- **Animations** fluides avec Motion
- **Glassmorphism** sur les cartes
- **Responsive** mobile/desktop

---

## 🔧 Configuration avancée

### Personnalisation des créneaux

**Fichier** : `CalendarManagement.tsx`

```typescript
// Modifier la fonction generateTimeSlots
const generateTimeSlots = (start: string, end: string): string[] => {
  // Changer l'intervalle (actuellement 15min)
  for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
    // 30 minutes au lieu de 15
  }
}
```

### Durées de rendez-vous disponibles

**Fichier** : `BookingPage.tsx`

```typescript
const durations = [15, 30, 60]; // Ajouter 45, 90, etc.
```

---

## 🐛 Dépannage

### Problème : Aucun rendez-vous ne s'affiche

**Cause** : Pas de données  
**Solution** :
```typescript
// Exécuter dans la console du navigateur
import { seedDemoData } from './utils/seedDemoData';
await seedDemoData();
```

### Problème : Badge ne se met pas à jour

**Cause** : Cache React  
**Solution** : Cliquer sur "Actualiser" ou F5

### Problème : Erreur 500 lors de la confirmation

**Cause** : Serveur backend  
**Solution** :
1. Vérifier la console navigateur
2. Vérifier les logs serveur
3. Vérifier que Supabase fonctionne

---

## 🚀 Prochaines évolutions

### Roadmap
- [ ] Synchronisation Google Calendar / Outlook
- [ ] Emails automatiques de confirmation
- [ ] Rappels SMS/Email 24h avant
- [ ] Intégration visio (Zoom, Google Meet)
- [ ] Récurrence d'événements (hebdomadaire, mensuel)
- [ ] Vue semaine / Vue jour
- [ ] Drag & drop pour déplacer les rendez-vous
- [ ] Export iCal
- [ ] Multi-utilisateurs / Équipe

---

## 💬 Support

**Questions ?** Consultez :
1. `CALENDRIER_QUICKSTART.md` → Démarrage rapide
2. `CALENDRIER_GUIDE.md` → Guide complet
3. Code source → Commenté et documenté

**Bugs ?** Vérifier la console et les logs serveur

---

## 📄 Licence

Système développé pour le portfolio freelance de Maxence.

---

**Dernière mise à jour** : Novembre 2025  
**Version** : 1.0.0  
**Statut** : ✅ Production Ready
