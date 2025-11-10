# 🗄️ Guide Database - Système de Projets Portfolio

## ✅ Configuration actuelle

Votre application est **100% connectée à Supabase** via le système KV (Key-Value store). Toutes les données sont stockées dans la base de données et non en localStorage.

## 🎯 Fonctionnalités opérationnelles

### 1. API Backend (Supabase Edge Functions)
Toutes les routes API sont actives et fonctionnelles :

- **Projects**
  - `GET /projects` - Liste tous les projets
  - `GET /projects/:id` - Détail d'un projet
  - `POST /projects` - Créer un projet
  - `PUT /projects/:id` - Mettre à jour un projet (ex: épingler/désépingler)
  
- **Leads**
  - `GET /leads` - Liste des leads
  - `POST /leads` - Créer un lead
  - `PUT /leads/:id` - Mettre à jour
  - `DELETE /leads/:id` - Supprimer
  
- **Clients**
  - `GET /clients` - Liste des clients
  - `POST /clients` - Créer un client
  - `PUT /clients/:id` - Mettre à jour
  
- **Invoices**
  - `GET /invoices` - Liste des factures
  - `POST /invoices` - Créer une facture
  - `PATCH /invoices/:id` - Mettre à jour le statut
  
- **Bookings**
  - `GET /bookings` - Liste des réservations
  - `POST /bookings` - Créer une réservation
  - `PUT /bookings/:id` - Mettre à jour
  - `DELETE /bookings/:id` - Supprimer

### 2. Pages Frontend

#### 🏠 HomePage (`/`)
- Charge automatiquement les projets épinglés depuis l'API
- Affiche 2-3 projets épinglés dans la section "Projets en vedette"
- Les cartes sont cliquables et naviguent vers les détails

#### 📂 ProjectsPage (`/projects`)
- Affiche tous les projets depuis la base de données
- Système de filtres par catégorie (web, mobile, design, etc.)
- Barre de recherche fonctionnelle
- Navigation vers les détails au clic

#### 🔍 ProjectDetailPage (`/projects/:id`)
- Charge les détails complets d'un projet depuis l'API
- Affiche galerie d'images, technologies, résultats, etc.
- Gestion des erreurs si projet non trouvé

#### 📊 DashboardPage (`/dashboard`)
- **Vue Overview** : KPIs animés, derniers leads, projets récents
- **Vue Projets** : 
  - Liste complète des projets
  - Bouton épingler/désépingler (icône pin)
  - Création de nouveaux projets avec formulaire complet
  - Upload d'images d'illustration
- **Vue Leads** : Gestion des prospects
- **Vue Clients** : Gestion du portefeuille
- **Vue Factures** : Génération et suivi
- **Vue Calendrier** : Réservations

## 🚀 Démarrage rapide

### Étape 1 : Ajouter des données de démo

Pour tester immédiatement le système :

1. Connectez-vous au dashboard (email: `admin@test.fr`, password: `password`)
2. Sur la page Overview, cliquez sur **"Ajouter les données de démo"**
3. Le système ajoutera automatiquement :
   - ✅ 5 leads de démonstration
   - ✅ 3 projets portfolio épinglés (avec images Unsplash)
   - ✅ 2 factures exemples
   - ✅ 5 réservations calendrier

### Étape 2 : Épingler des projets

1. Dans le dashboard, allez dans **Projets**
2. Cliquez sur l'icône 📌 (pin) à droite de chaque projet
3. Les projets épinglés apparaîtront automatiquement sur la landing page

### Étape 3 : Créer un nouveau projet

1. Dans le dashboard > Projets
2. Cliquez sur **"+ Nouveau projet"**
3. Remplissez le formulaire :
   - **Obligatoires** : Nom, Client, Budget, Date de début
   - **Portfolio** : Image URL, Tags, Technologies, Galerie, Résultats
4. Le projet sera visible immédiatement sur `/projects`

## 🔧 Architecture technique

```
Frontend (React + Tailwind)
    ↓
Supabase Edge Functions (Hono server)
    ↓
KV Store (Postgres table)
```

### Stockage des données

Toutes les données sont stockées dans le **KV Store** de Supabase avec des préfixes :
- `project_*` - Projets
- `lead_*` - Leads
- `client_*` - Clients
- `invoice_*` - Factures
- `booking_*` - Réservations

### IDs générés automatiquement

```typescript
const projectId = `project_${Date.now()}`;
const leadId = `lead_${Date.now()}`;
// etc.
```

## 📝 Champs disponibles pour les projets

### Champs CRM (gestion interne)
```typescript
{
  id: string;
  name: string;
  clientId?: string;
  clientName?: string;
  status: "planning" | "in_progress" | "review" | "completed" | "on_hold";
  budget?: number;
  spent?: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
}
```

### Champs Portfolio (affichage public)
```typescript
{
  description?: string;
  imageUrl?: string;  // Image principale
  isPinned?: boolean; // Afficher sur la landing page
  category?: "web" | "mobile" | "design" | "consulting" | "other";
  tags?: string[];  // ["React", "Tailwind", "API"]
  technologies?: string[];  // Liste des technos utilisées
  projectUrl?: string;  // Lien du projet en ligne
  githubUrl?: string;  // Lien GitHub
  imageGallery?: string[];  // Galerie d'images
  duration?: string;  // "3 mois"
  challenges?: string;  // Description des défis
  solutions?: string;  // Solutions apportées
  results?: string;  // Résultats mesurables
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
}
```

## 🎨 Images et illustrations

### Sources d'images recommandées
- **Unsplash** : Images haute qualité gratuites
  - https://images.unsplash.com/photo-[ID]?w=800&q=80
- **Pexels** : Alternative gratuite
- **Illustrations** : undraw.co, storyset.com

### Format imageUrl
```typescript
imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
```

### Galerie d'images
```typescript
imageGallery: [
  "https://images.unsplash.com/photo-1.jpg?w=800&q=80",
  "https://images.unsplash.com/photo-2.jpg?w=800&q=80"
]
```

## 🔄 Workflow complet

### 1. Client potentiel arrive sur le site
- Visite la landing page
- Voit les **3 projets épinglés** en vedette
- Clique sur "Voir tous les projets" → `/projects`

### 2. Consultation des projets
- Filtre par catégorie (web, mobile, etc.)
- Recherche par mots-clés
- Clique sur un projet → Détails complets

### 3. Contact / Réservation
- Formulaire de contact → Crée un **lead** dans le CRM
- Système de réservation → Crée un **booking** dans le calendrier

### 4. Gestion côté admin (Dashboard)
- Le lead arrive dans **Dashboard > Leads**
- Conversion en client → **Dashboard > Clients**
- Création projet → **Dashboard > Projets**
- Épinglage du projet → Visible sur la landing page
- Génération facture → **Dashboard > Factures**

## 🐛 Debugging

### Voir les données en base
```typescript
// Dans la console du navigateur
fetch('https://[PROJECT_ID].supabase.co/functions/v1/make-server-04919ac5/projects', {
  headers: { Authorization: 'Bearer [ANON_KEY]' }
})
.then(r => r.json())
.then(console.log);
```

### Vérifier un projet spécifique
```typescript
fetch('https://[PROJECT_ID].supabase.co/functions/v1/make-server-04919ac5/projects/project_123', {
  headers: { Authorization: 'Bearer [ANON_KEY]' }
})
.then(r => r.json())
.then(console.log);
```

### Logs serveur
Les logs du serveur Supabase Edge Functions affichent toutes les requêtes :
```
[2024-11-05] GET /projects - 200
[2024-11-05] PUT /projects/project_123 - 200
```

## ✅ Checklist finale

- [x] API backend complète et fonctionnelle
- [x] Frontend connecté à l'API (plus de localStorage)
- [x] Système d'épinglage des projets
- [x] Page projets avec filtres et recherche
- [x] Page détails projet avec toutes les infos
- [x] Dashboard CRM complet
- [x] Bouton seed data pour démarrage rapide
- [x] Images Unsplash pour les projets
- [x] Navigation fluide entre les pages
- [x] Gestion d'erreurs si projet non trouvé

## 🎉 Prochaines étapes recommandées

1. **Ajouter vos vrais projets** via le dashboard
2. **Uploader des captures d'écran** de vos projets réels
3. **Personnaliser les descriptions** avec vos résultats concrets
4. **Configurer les métadonnées** (tags, technologies, durée)
5. **Épingler les 3 meilleurs projets** sur la landing page

---

**Tout est prêt ! 🚀** Le système fonctionne 100% avec la base de données Supabase.
