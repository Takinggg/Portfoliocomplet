# 🚀 Quick Start - Système de Calendrier

## 🎯 En 3 minutes

### 1. Accéder au calendrier
1. Se connecter au dashboard (`/login`)
2. Cliquer sur **"Calendrier"** dans la sidebar
3. Vous voyez immédiatement :
   - Calendrier mensuel
   - Prochains rendez-vous
   - Statistiques (en attente, confirmés, etc.)

### 2. Gérer un rendez-vous en attente

**Scénario** : Un client a réservé un rendez-vous depuis votre site

```
1. Regarder le badge orange sur "Calendrier" → indique le nombre en attente
2. Aller dans "Calendrier"
3. Dans la liste "Prochains RDV", repérer le rendez-vous (badge jaune "En attente")
4. Cliquer sur "✓ Confirmer" → passe en vert "Confirmé"
```

**Actions disponibles** :
- ✅ **Confirmer** : Valider le rendez-vous
- ❌ **Annuler** : Marquer comme annulé
- 🗑️ **Supprimer** : Effacer définitivement

### 3. Bloquer une journée (congés)

```
1. Cliquer sur "⚙️ Disponibilités" (en haut à droite)
2. Sélectionner la date
3. ✅ Cocher "Bloquer cette journée"
4. Ajouter une raison : "Congés", "Formation", etc.
5. Cliquer sur "Bloquer la journée"
```

**Résultat** : La journée apparaît en rouge sur le calendrier

### 4. Ajouter un événement personnel

```
1. Cliquer sur "+ Nouvel événement"
2. Remplir :
   - Titre : "Réunion équipe"
   - Date : Sélectionner
   - Heures : 14:00 → 15:30
   - Type : "Événement"
3. Cliquer sur "Créer l'événement"
```

**Résultat** : Point bleu sur le jour dans le calendrier

## 📊 Comprendre les statuts

| Badge | Signification | Action typique |
|-------|---------------|----------------|
| 🟡 **En attente** | Nouveau rendez-vous non confirmé | → Confirmer |
| 🟢 **Confirmé** | Rendez-vous validé | → Terminer après la réunion |
| ✅ **Terminé** | Rendez-vous effectué | → Archivé |
| 🔴 **Annulé** | Rendez-vous annulé | → Peut être supprimé |

## 🎨 Comprendre le calendrier

### Indicateurs visuels
- **Point vert** 🟢 : Rendez-vous confirmé
- **Point jaune** 🟡 : Rendez-vous en attente
- **Point bleu** 🔵 : Événement personnel
- **Fond rouge** 🟥 : Journée bloquée
- **Bordure blanche** ⚪ : Aujourd'hui

### Cliquer sur un jour
→ Affiche tous les événements de ce jour en bas du calendrier

## ⚡ Raccourcis et astuces

### Workflow quotidien recommandé
1. **Matin** : Vérifier les rendez-vous du jour
2. **Confirmer** les nouveaux rendez-vous (badge jaune)
3. **Après chaque rendez-vous** : Marquer comme "Terminé"
4. **Chaque semaine** : Bloquer les jours de congés à venir

### Recherche rapide
- Taper le nom ou email dans la barre de recherche
- Filtrer par statut avec le menu déroulant

### Navigation
- **← →** : Changer de mois
- **Cliquer sur un jour** : Voir les événements
- **Scroll** dans "Prochains RDV" pour voir plus loin

## 🔄 Workflow complet

### Client réserve → Confirmation → Terminé

```mermaid
Client réserve sur /booking
         ↓
📩 Nouveau rendez-vous (statut: "pending")
         ↓
🔔 Badge orange sur "Calendrier"
         ↓
👤 Admin consulte le calendrier
         ↓
✅ Clic sur "Confirmer" (statut: "confirmed")
         ↓
📧 (Optionnel : Email de confirmation au client)
         ↓
🤝 Rendez-vous effectué
         ↓
✔️ Clic sur "Terminer" (statut: "completed")
```

## 🎯 Cas d'usage fréquents

### Cas 1 : Planifier mes congés
```
Disponibilités → Sélectionner date → Bloquer journée → "Congés d'été"
```

### Cas 2 : Ajouter un rendez-vous manuel
```
Nouvel événement → Titre: "RDV Client X" → Date/Heure → Type: Événement
```

### Cas 3 : Gérer un rendez-vous annulé
```
Trouver le rendez-vous → Annuler → (Optionnel : Supprimer)
```

### Cas 4 : Voir tous mes rendez-vous confirmés
```
Filtre → "Confirmés" → Liste filtrée
```

## 📱 Interface

### Desktop
- **Sidebar gauche** : Menu de navigation
- **Centre** : Calendrier mensuel
- **Droite** : Prochains rendez-vous
- **Bas** : Liste complète avec recherche

### Mobile
- Vue empilée verticalement
- Calendrier → Prochains RDV → Liste complète
- Même fonctionnalités

## ⚙️ Configuration

### Créneaux disponibles par défaut
- **9h00 → 18h00** par défaut
- Créneaux de **15 minutes**
- Modifiable dans le formulaire "Disponibilités"

### Durées de rendez-vous
Les clients peuvent choisir :
- **15 minutes** : Consultation rapide
- **30 minutes** : Appel découverte (par défaut)
- **60 minutes** : Consultation approfondie

## 🎓 Pour aller plus loin

- Consultez `CALENDRIER_GUIDE.md` pour la documentation complète
- Code source : `/components/calendar/CalendarManagement.tsx`
- API : `/supabase/functions/server/index.tsx`

## 🐛 Résolution de problèmes

**Problème** : Aucun rendez-vous ne s'affiche
→ Vérifier que des données existent (exécuter `seedDemoData`)

**Problème** : Badge ne se met pas à jour
→ Cliquer sur "Actualiser" ou recharger la page

**Problème** : Erreur lors de la confirmation
→ Vérifier la console, vérifier que le serveur backend fonctionne

---

**Besoin d'aide ?** Consultez la documentation complète dans `CALENDRIER_GUIDE.md`
