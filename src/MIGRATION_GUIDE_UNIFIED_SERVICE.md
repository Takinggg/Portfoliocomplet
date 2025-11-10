# Guide de Migration vers UnifiedDataService

## 🎯 Objectif

Remplacer tous les appels aux anciens services (`blogService`, `dataService`, `localDataStorage`) par le nouveau service unifié `unifiedDataService` qui utilise **UNIQUEMENT Supabase** (pas de localStorage).

## ✅ Avantages du Nouveau Service

- ✅ **100% Supabase** - Pas de fallback localStorage
- ✅ **Synchronisation complète** - Dashboard ↔ Pages publiques
- ✅ **Gestion d'erreurs claire** - Plus de silences, messages explicites
- ✅ **Types TypeScript** - Interfaces complètes pour tous les objets
- ✅ **Cohérence** - Une seule source de vérité pour toutes les données

## 📋 Routes Serveur Disponibles

### Projets
```typescript
GET    /make-server-04919ac5/projects          // Liste des projets
GET    /make-server-04919ac5/projects/:id      // Détail d'un projet
POST   /make-server-04919ac5/projects          // Créer (auth)
PUT    /make-server-04919ac5/projects/:id      // Modifier (auth)
DELETE /make-server-04919ac5/projects/:id      // Supprimer (auth)
```

### Blog
```typescript
GET    /make-server-04919ac5/blog/posts            // Liste des articles
GET    /make-server-04919ac5/blog/posts/:slug      // Détail d'un article
POST   /make-server-04919ac5/blog/posts            // Créer (auth)
PUT    /make-server-04919ac5/blog/posts/:id        // Modifier (auth)
DELETE /make-server-04919ac5/blog/posts/:id        // Supprimer (auth)
POST   /make-server-04919ac5/blog/posts/:slug/view // Incrémenter vues
```

### Case Studies
```typescript
GET    /make-server-04919ac5/case-studies       // Liste des études de cas
GET    /make-server-04919ac5/case-studies/:id   // Détail d'une étude
POST   /make-server-04919ac5/case-studies       // Créer (auth)
PUT    /make-server-04919ac5/case-studies/:id   // Modifier (auth)
DELETE /make-server-04919ac5/case-studies/:id   // Supprimer (auth)
```

### FAQ
```typescript
GET    /make-server-04919ac5/faq                    // Liste des FAQs
GET    /make-server-04919ac5/faq-categories         // Catégories
POST   /make-server-04919ac5/faq-categories         // Créer catégorie (auth)
POST   /make-server-04919ac5/faq                    // Créer question (auth)
PUT    /make-server-04919ac5/faq/:id                // Modifier (auth)
DELETE /make-server-04919ac5/faq/:id                // Supprimer (auth)
```

### Resources
```typescript
GET    /make-server-04919ac5/resources          // Liste des ressources (public)
GET    /make-server-04919ac5/resources/admin    // Liste complète (auth)
POST   /make-server-04919ac5/resources          // Créer (auth)
PUT    /make-server-04919ac5/resources/:id      // Modifier (auth)
DELETE /make-server-04919ac5/resources/:id      // Supprimer (auth)
POST   /make-server-04919ac5/resources/:id/download // Télécharger
```

## 🔄 Migration des Composants

### 1. BlogTab.tsx

#### AVANT:
```typescript
import { fetchBlogPosts } from "../../utils/blogService";

const { posts, mode } = await fetchBlogPosts("fr");
```

#### APRÈS:
```typescript
import { fetchBlogPosts, getCurrentMode, checkServerConnection } from "../../utils/unifiedDataService";
import { createClient } from "../../utils/supabase/client";

// Vérifier la connexion
const isConnected = await checkServerConnection();
if (!isConnected) {
  toast.error("Serveur non disponible. Veuillez vérifier votre connexion.");
  return;
}

// Charger les posts
try {
  const posts = await fetchBlogPosts("fr");
  setPosts(posts);
} catch (error) {
  toast.error("Impossible de charger les articles: " + error.message);
}

// Pour créer/modifier/supprimer (nécessite auth)
const supabase = createClient();
const { data: { session } } = await supabase.auth.getSession();

await createBlogPost(newPost, session.access_token);
await updateBlogPost(postId, updates, session.access_token);
await deleteBlogPost(postId, session.access_token);
```

### 2. CaseStudiesTab.tsx

#### AVANT:
```typescript
import { fetchCaseStudies } from "../../utils/dataService";

const { caseStudies, mode } = await fetchCaseStudies();
```

#### APRÈS:
```typescript
import { fetchCaseStudies, createCaseStudy, updateCaseStudy, deleteCaseStudy } from "../../utils/unifiedDataService";

try {
  const caseStudies = await fetchCaseStudies();
  setCaseStudies(caseStudies);
} catch (error) {
  toast.error("Impossible de charger les études de cas: " + error.message);
}
```

### 3. ProjectsPage.tsx (Public)

#### AVANT:
```typescript
// Probablement un fetch direct ou utilisation de dataService
const response = await fetch(`/api/projects`);
```

#### APRÈS:
```typescript
import { fetchProjects } from "../utils/unifiedDataService";

useEffect(() => {
  const loadProjects = async () => {
    try {
      const projects = await fetchProjects();
      setProjects(projects);
    } catch (error) {
      console.error(error);
      // Afficher un message d'erreur à l'utilisateur
      setError("Les projets ne peuvent pas être chargés pour le moment.");
    }
  };
  
  loadProjects();
}, []);
```

### 4. BlogPage.tsx (Public)

```typescript
import { fetchBlogPosts } from "../utils/unifiedDataService";
import { useLanguage } from "../utils/i18n/LanguageContext";

const { language } = useLanguage();

useEffect(() => {
  const loadPosts = async () => {
    try {
      const posts = await fetchBlogPosts(language);
      setPosts(posts);
    } catch (error) {
      setError("Les articles ne peuvent pas être chargés.");
    }
  };
  
  loadPosts();
}, [language]);
```

### 5. CaseStudiesPage.tsx (Public)

```typescript
import { fetchCaseStudies } from "../utils/unifiedDataService";

useEffect(() => {
  const loadCaseStudies = async () => {
    try {
      const caseStudies = await fetchCaseStudies();
      setCaseStudies(caseStudies);
    } catch (error) {
      setError("Les études de cas ne peuvent pas être chargées.");
    }
  };
  
  loadCaseStudies();
}, []);
```

## 🎨 Affichage du Statut de Connexion

```typescript
import { getCurrentMode, getConnectionBadge } from "../utils/unifiedDataService";

const ConnectionStatus = () => {
  const [mode, setMode] = useState(getCurrentMode());
  const badge = getConnectionBadge();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMode(getCurrentMode());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span>{badge.icon}</span>
      <span style={{ color: badge.color }}>{badge.text}</span>
    </div>
  );
};
```

## 🔐 Gestion de l'Authentification

### Pour les opérations protégées (CREATE, UPDATE, DELETE):

```typescript
import { createClient } from "../utils/supabase/client";
import { createBlogPost } from "../utils/unifiedDataService";

const handleCreate = async (postData) => {
  // 1. Récupérer le token d'accès
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    toast.error("Vous devez être connecté");
    return;
  }
  
  // 2. Appeler le service avec le token
  try {
    const newPost = await createBlogPost(postData, session.access_token);
    toast.success("Article créé avec succès!");
    // Rafraîchir la liste
    await loadPosts();
  } catch (error) {
    toast.error("Erreur: " + error.message);
  }
};
```

## ⚠️ Gestion des Erreurs

Le nouveau service **lance des exceptions** au lieu de retourner des modes de fallback:

```typescript
try {
  const posts = await fetchBlogPosts("fr");
  setPosts(posts);
  setError(null);
} catch (error) {
  console.error("Erreur chargement:", error);
  
  // Afficher un message clair à l'utilisateur
  if (error.message.includes("non disponible")) {
    setError("Le serveur est temporairement indisponible. Veuillez réessayer.");
  } else {
    setError("Une erreur est survenue lors du chargement des données.");
  }
  
  // Toast pour feedback immédiat
  toast.error(error.message);
}
```

## 🧪 Test de la Migration

### Checklist de test:

- [ ] **Pages publiques** chargent les données depuis Supabase
  - [ ] HomePage (projets en vedette)
  - [ ] ProjectsPage (liste complète)
  - [ ] BlogPage (liste articles)
  - [ ] BlogPostPage (détail article)
  - [ ] CaseStudiesPage (liste études)
  - [ ] CaseStudyDetailPage (détail étude)
  - [ ] FAQPage (questions/réponses)
  - [ ] ResourcesPage (ressources)

- [ ] **Dashboard** charge et modifie les données
  - [ ] Onglet Projets (CRUD)
  - [ ] Onglet Blog (CRUD)
  - [ ] Onglet Case Studies (CRUD)
  - [ ] Onglet FAQ (CRUD)
  - [ ] Onglet Resources (CRUD)

- [ ] **Synchronisation** fonctionne
  - [ ] Créer un projet dans le dashboard → Apparaît sur ProjectsPage
  - [ ] Modifier un article dans le dashboard → Mis à jour sur BlogPage
  - [ ] Supprimer une case study → Disparaît partout

- [ ] **Gestion d'erreurs**
  - [ ] Message clair si serveur down
  - [ ] Pas de crash si erreur réseau
  - [ ] Feedback utilisateur avec toast

## 📝 Fichiers à Modifier

### Composants Dashboard:
- `/components/dashboard/BlogTab.tsx`
- `/components/dashboard/CaseStudiesTab.tsx`
- `/components/dashboard/FAQTab.tsx`
- `/components/dashboard/ResourcesTab.tsx`
- `/components/pages/DashboardPage.tsx`

### Pages Publiques:
- `/components/pages/HomePage.tsx`
- `/components/pages/ProjectsPage.tsx`
- `/components/pages/ProjectDetailPage.tsx`
- `/components/pages/BlogPage.tsx`
- `/components/pages/BlogPostPage.tsx`
- `/components/pages/CaseStudiesPage.tsx`
- `/components/pages/CaseStudyDetailPage.tsx`
- `/components/pages/FAQPage.tsx`
- `/components/pages/ResourcesPage.tsx`

### À SUPPRIMER (après migration):
- `/utils/blogService.ts` (old)
- `/utils/dataService.ts` (old avec fallback)
- `/utils/localDataStorage.ts` (localStorage fallback)
- `/utils/localBlogStorage.ts` (localStorage fallback)

## 🚀 Ordre de Migration Recommandé

1. **Phase 1: Pages Publiques (Lecture seule)**
   - ProjectsPage
   - BlogPage
   - CaseStudiesPage
   - FAQPage
   - ResourcesPage

2. **Phase 2: Dashboard (CRUD)**
   - BlogTab
   - CaseStudiesTab
   - FAQTab
   - ResourcesTab

3. **Phase 3: Nettoyage**
   - Supprimer anciens services
   - Tests complets
   - Vérification synchronisation

## 💡 Conseils

1. **Commencer par une page simple** (ex: FAQPage) pour tester le flux
2. **Garder les anciens services** jusqu'à ce que toute la migration soit terminée
3. **Tester en production** avec serveur Supabase déployé
4. **Avoir un plan de rollback** si problème critique

## 🐛 Debugging

Si les données ne se chargent pas:

```typescript
import { checkServerConnection, getCurrentMode } from "../utils/unifiedDataService";

// Vérifier la connexion
const isConnected = await checkServerConnection();
console.log("Serveur connecté?", isConnected);
console.log("Mode actuel:", getCurrentMode());

// Vérifier les réponses serveur
const response = await fetch("https://[PROJECT_ID].supabase.co/functions/v1/make-server-04919ac5/health");
console.log("Health check:", await response.json());
```

## 🎯 Résultat Final

Après migration complète:
- ✅ Toutes les données dans Supabase
- ✅ Pas de localStorage (sauf cache navigation)
- ✅ Dashboard et pages publiques 100% synchronisés
- ✅ Messages d'erreur clairs
- ✅ Code maintenable et type-safe
