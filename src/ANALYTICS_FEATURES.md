# 📊 Analytics & Reporting - Documentation

## Vue d'ensemble

L'onglet **Analytics** offre une vue complète et visuelle de l'activité freelance avec des graphiques modernes, des KPIs animés et des statistiques détaillées.

### 🔄 Actualisation des données

Un bouton **Actualiser** est disponible en haut à droite pour rafraîchir toutes les données en temps réel :
- Animation de rotation de l'icône pendant le chargement
- Toast de confirmation après actualisation
- Affichage de l'horodatage de la dernière mise à jour
- Réanimation des KPIs après actualisation
- Effet hover avec rotation 180° de l'icône

## Fonctionnalités principales

### 🎯 KPIs Principaux (4 cards animées)

1. **Total Leads**
   - Nombre total de leads
   - Leads du mois en cours
   - Croissance vs 30 jours précédents (%)
   - Animation sur l'affichage

2. **Clients Actifs**
   - Nombre total de clients
   - Nouveaux clients ce mois
   - Croissance vs 30 jours précédents (%)

3. **Revenus Totaux**
   - Chiffre d'affaires total
   - Revenus du mois
   - Croissance vs 30 jours précédents (%)

4. **Taux de Conversion**
   - Pourcentage de leads convertis
   - Nombre de leads convertis

### 📈 Statistiques Secondaires

- **Projets Actifs** : Nombre de projets en cours
- **Factures en Attente** : Nombre de factures non payées
- **Montant en Attente** : Total des factures impayées

### 📊 Graphiques Principaux

#### 1. Évolution Mensuelle (Area Chart)
- **Données** : Leads et Clients mois par mois (2025)
- **Type** : Area Chart avec gradient
- **Couleurs** : 
  - Leads : #00FFC2 (vert principal)
  - Clients : #00D9A6 (vert secondaire)

#### 2. Revenus Mensuels (Bar Chart)
- **Données** : Revenus par mois (€)
- **Type** : Bar Chart avec coins arrondis
- **Couleur** : #00FFC2

### 🥧 Graphiques Circulaires (Pie Charts)

#### 1. Leads par Source
- Distribution des sources d'acquisition (Site web, LinkedIn, Bouche à oreille, etc.)
- Palette de 5 couleurs (#00FFC2 → #006752)

#### 2. Leads par Statut
- Répartition : Nouveau, Contacté, Qualifié, Converti, Perdu
- Labels avec pourcentages

#### 3. Factures par Statut
- Répartition : Brouillon, Envoyée, Payée, En retard, Annulée

### 🏆 Top 5 Clients par Revenus

- Liste animée des 5 meilleurs clients
- Affichage : Nom, Email, Revenus, Statut
- Animation staggered (délai de 0.1s par élément)

## Technologies utilisées

- **Recharts** : Bibliothèque de graphiques React
- **Motion (Framer Motion)** : Animations fluides
- **Tailwind CSS** : Styling avec palette personnalisée
- **shadcn/ui** : Composants Card, Badge, etc.

## Palette de couleurs

```css
#00FFC2 - Vert principal (accents)
#00D9A6 - Vert secondaire
#00B38A - Vert tertiaire
#008D6E - Vert foncé
#006752 - Vert très foncé
```

## Structure du code

```
/components
  /dashboard
    AnalyticsTab.tsx - Composant principal Analytics
  /pages
    DashboardPage.tsx - Intégration du menu + routing
/components/dashboard/DashboardLayout.tsx - Menu sidebar
```

## Données sources

L'onglet Analytics récupère les données de :
- **Leads** : Liste complète des leads avec statuts
- **Clients** : Clients avec revenus et dates de création
- **Projects** : Projets avec statuts (actif, en pause, terminé)
- **Invoices** : Factures avec montants et statuts
- **Quotes** : Devis avec montants et statuts

## Calculs KPIs

### Croissance (Growth)
```typescript
growth = ((recentCount - previousCount) / previousCount) * 100
```

- **Recent** : 30 derniers jours
- **Previous** : 30 jours précédents (j-60 à j-30)

### Taux de conversion
```typescript
conversionRate = (convertedLeads / totalLeads) * 100
```

## Affichage responsive

- **Mobile** : 1 colonne pour les KPIs
- **Tablette** : 2 colonnes pour les KPIs
- **Desktop** : 4 colonnes pour les KPIs

## Animations

- **KPIs** : Apparition avec `opacity` et `y` offset
- **Nombre** : Animation de scale avec spring
- **Top clients** : Staggered animation (délai progressif)
- **Charts** : Gradients animés pour Area Charts

## Améliorations futures possibles

- [ ] Export PDF des analytics
- [ ] Comparaison année précédente
- [ ] Prévisions basées sur tendances
- [ ] Filtre par période personnalisée
- [ ] Analytics par catégorie de projet
- [ ] Objectifs et tracking
- [ ] Notifications sur les KPIs critiques
