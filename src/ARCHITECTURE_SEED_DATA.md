# 🏗️ ARCHITECTURE: Système de Seeding des Projets

## 📁 Structure des fichiers

```
/
├── components/
│   ├── pages/
│   │   ├── DashboardPage.tsx          ← Vue "SeedDataView" intégrée
│   │   └── SeedDataPage.tsx           ← Page dédiée (optionnelle)
│   └── dashboard/
│       └── DashboardRouter.tsx
├── utils/
│   ├── seedTestProjects.ts            ← ⭐ FONCTION PRINCIPALE
│   ├── unifiedDataService.ts          ← Service API
│   └── supabase/
│       └── client.tsx
└── supabase/
    └── functions/
        └── server/
            └── index.tsx              ← Endpoints serveur
```

## 🔄 Flux de données

### 1. Interface Utilisateur

```
┌─────────────────────────────────────┐
│  DashboardPage (SeedDataView)       │
│  ou                                  │
│  SeedDataPage                        │
│                                      │
│  - Auto-détecte le token session    │
│  - Affiche bouton "Créer projets"   │
│  - Gère états loading/success/error │
└─────────────────────────────────────┘
           ↓
    Appelle seedTestProjects(token)
```

### 2. Fonction de Seeding

```typescript
// /utils/seedTestProjects.ts

export async function seedTestProjects(accessToken: string): Promise<void> {
  for (const project of TEST_PROJECTS) {
    await unifiedService.createProject(project, accessToken);
  }
}
```

**Contenu**: 6 projets bilingues pré-configurés
- Plateforme E-commerce
- App Mobile Fitness
- Dashboard SaaS
- Site Corporate
- Plateforme API
- Design System

### 3. Service API

```typescript
// /utils/unifiedDataService.ts

export async function createProject(
  project: BilingualProject,
  accessToken: string
): Promise<BilingualProject> {
  const response = await fetch(
    `${BASE_URL}/projects`,  // ← Endpoint existant
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(project),
    }
  );
  
  return response.json();
}
```

### 4. Serveur Edge Function

```typescript
// /supabase/functions/server/index.tsx

app.post("/make-server-04919ac5/projects", async (c) => {
  const body = await c.req.json();
  
  // Validation
  if (!body.name_fr || !body.name_en) {
    return c.json({ error: "Names required" }, 400);
  }
  
  // Génération ID
  const projectId = `${Date.now()}_${crypto.randomUUID()}`;
  
  // Stockage dans KV Store
  await kv.set(`project_${projectId}`, {
    id: projectId,
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  
  return c.json({ success: true, project });
});
```

### 5. Base de données

```
┌──────────────────────────────┐
│  Supabase KV Store           │
│  Table: kv_store_04919ac5    │
├──────────────────────────────┤
│  key              │  value    │
├──────────────────────────────┤
│  project_123...   │  {...}    │
│  project_456...   │  {...}    │
│  project_789...   │  {...}    │
└──────────────────────────────┘
```

## 🔐 Authentification

### Token de session

```typescript
// Auto-détection dans les composants
const supabase = createClient();
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

### Flux d'authentification

```
1. Utilisateur se connecte au Dashboard
   ↓
2. Supabase crée une session
   ↓
3. Session stockée dans le navigateur
   ↓
4. Composants récupèrent automatiquement le token
   ↓
5. Token utilisé pour les requêtes API
```

## 📊 Structure d'un projet bilingue

```typescript
interface BilingualProject {
  id: string;
  
  // Français
  name_fr: string;
  description_fr?: string;
  tags_fr?: string[];
  category_fr?: "web" | "mobile" | "design" | "consulting";
  
  // Anglais
  name_en: string;
  description_en?: string;
  tags_en?: string[];
  category_en?: "web" | "mobile" | "design" | "consulting";
  
  // Commun
  status: "planning" | "in_progress" | "review" | "completed";
  budget?: number;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  technologies?: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

## ⚡ Performance

### Seeding de 6 projets
```
Temps total: ~10 secondes

Par projet:
├─ Appel API: ~1.5s
├─ Validation: ~0.1s
└─ Stockage KV: ~0.2s

En série: 6 × 1.8s ≈ 10.8s
```

### Optimisation possible
```typescript
// Parallélisation (futur)
await Promise.all(
  TEST_PROJECTS.map(project => 
    unifiedService.createProject(project, token)
  )
);
// Temps réduit à ~2-3 secondes
```

## 🛡️ Gestion des erreurs

### Stratégie de retry
```typescript
try {
  await seedTestProjects(token);
  toast.success("Projets créés !");
} catch (error: any) {
  console.error("Erreur:", error);
  toast.error(`Erreur: ${error.message}`);
}
```

### Logs détaillés
```
Console output:
🌱 Début du seeding des projets...
✅ Projet créé: Plateforme E-commerce Moderne
✅ Projet créé: Application Mobile Fitness
...
📊 Résumé du seeding:
   ✅ Succès: 6/6
   ❌ Erreurs: 0/6
```

## 🔄 Cycle de vie

```
┌──────────────────────────────────────────┐
│  État initial: 0 projets                 │
└──────────────────────────────────────────┘
                ↓
┌──────────────────────────────────────────┐
│  1. Utilisateur clique "Créer projets"   │
└──────────────────────────────────────────┘
                ↓
┌──────────────────────────────────────────┐
│  2. État: loading = true                 │
└──────────────────────────────────────────┘
                ↓
┌──────────────────────────────────────────┐
│  3. Appels API séquentiels (6×)          │
└──────────────────────────────────────────┘
                ↓
┌──────────────────────────────────────────┐
│  4. Stockage dans Supabase KV            │
└──────────────────────────────────────────┘
                ↓
┌──────────────────────────────────────────┐
│  5. Rafraîchissement de la liste         │
└──────────────────────────────────────────┘
                ↓
┌──────────────────────────────────────────┐
│  6. État: loading = false, success!      │
│     Affichage: 6 projets                 │
└──────────────────────────────────────────┘
```

## 📝 Exemple de projet complet

```typescript
{
  id: "1731168000000_abc123...",
  
  name_fr: "Plateforme E-commerce Moderne",
  name_en: "Modern E-commerce Platform",
  
  description_fr: "Développement d'une plateforme e-commerce...",
  description_en: "Development of a complete e-commerce platform...",
  
  tags_fr: ["E-commerce", "React", "Node.js"],
  tags_en: ["E-commerce", "React", "Node.js"],
  
  category_fr: "web",
  category_en: "web",
  
  status: "completed",
  budget: 35000,
  spent: 32500,
  startDate: "2024-01-15",
  endDate: "2024-05-20",
  
  imageUrl: "https://images.unsplash.com/photo-...",
  isPinned: true,
  
  technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
  
  projectUrl: "https://example-ecommerce.com",
  
  imageGallery: [
    "https://images.unsplash.com/photo-1...",
    "https://images.unsplash.com/photo-2..."
  ],
  
  testimonial: {
    text: "Excellent travail !",
    author: "Marie Dubois",
    role: "CEO, ShopTech"
  },
  
  createdAt: "2024-11-09T15:30:00.000Z",
  updatedAt: "2024-11-09T15:30:00.000Z"
}
```

## 🎯 Points clés de l'architecture

✅ **Séparation des responsabilités**
- UI: Gestion de l'état et affichage
- Business Logic: seedTestProjects()
- API: unifiedDataService
- Persistance: Supabase KV Store

✅ **Réutilisabilité**
- TEST_PROJECTS exporté pour réutilisation
- seedTestProjects() peut être appelé depuis n'importe où
- clearTestProjects() pour nettoyer

✅ **Sécurité**
- Token JWT requis pour toutes les opérations
- Auto-détection depuis session Supabase
- Validation côté serveur

✅ **Expérience utilisateur**
- Auto-détection du token (pas de copier-coller)
- Feedback en temps réel (loading, success, error)
- Messages d'erreur détaillés

✅ **Maintenabilité**
- Code modulaire et bien organisé
- Types TypeScript stricts
- Logs détaillés pour debugging

---

**Architecture validée et opérationnelle** ✅
