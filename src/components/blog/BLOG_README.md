# 📝 Système de Blog

## Vue d'ensemble

Le système de blog complet permet de créer, gérer et publier des articles pour le site portfolio freelance. Il inclut :

- **Interface utilisateur publique** : Liste des articles et page de lecture individuelle
- **Dashboard admin** : Gestion complète des articles (CRUD)
- **Catégories** : Développement, Design, Business
- **Tags** : Système de tags flexible
- **Filtres & Recherche** : Recherche textuelle, filtres par catégorie et tags
- **Statistiques** : Compteur de vues, temps de lecture estimé
- **SEO-Friendly** : Slugs personnalisés, meta descriptions (excerpt)

## 🎨 Composants

### Components Blog (`/components/blog/`)

#### `BlogPostCard.tsx`
Carte d'article réutilisable avec 3 variants :
- **default** : Carte complète avec image et détails
- **compact** : Version compacte pour sidebars
- **featured** : Version mise en avant pour l'article principal

#### `BlogFilters.tsx`
Système de filtres complet :
- Recherche textuelle
- Filtres par catégorie (Développement, Design, Business)
- Filtres par tags
- Affichage des filtres actifs
- Réinitialisation rapide

### Pages (`/components/pages/`)

#### `BlogPage.tsx`
Page principale du blog :
- Article vedette (featured)
- Articles récents (3 derniers)
- Grille de tous les articles
- Sidebar avec filtres
- Statistiques (total articles, sujets, temps de contenu)

#### `BlogPostPage.tsx`
Page de lecture d'un article :
- Affichage complet de l'article
- Meta-informations (date, temps de lecture, vues)
- Boutons de partage social (Twitter, LinkedIn, Facebook)
- Bouton bookmark
- CTA vers contact/booking
- Articles similaires (même catégorie)

### Dashboard Admin (`/components/dashboard/`)

#### `BlogTab.tsx`
Interface de gestion dans le dashboard :
- Statistiques : Total articles, publiés, brouillons, vues totales
- Liste des articles avec filtres
- Création/édition d'articles
- Gestion des statuts (draft/published)
- Calcul automatique du temps de lecture
- Génération automatique de slug
- Gestion des tags
- Prévisualisation des articles publiés

## 🔧 Backend (Supabase Edge Functions)

### Routes API (`/supabase/functions/server/index.tsx`)

#### GET `/make-server-04919ac5/blog/posts`
Récupère tous les articles (triés par date de publication)

#### GET `/make-server-04919ac5/blog/posts/:slug`
Récupère un article par slug + articles similaires

#### POST `/make-server-04919ac5/blog/posts`
Crée un nouvel article

**Body** :
```json
{
  "title": "string",
  "slug": "string",
  "excerpt": "string",
  "content": "string (HTML)",
  "coverImage": "string (URL)",
  "category": "development | design | business",
  "tags": ["string"],
  "status": "draft | published",
  "readTime": "number (minutes)",
  "publishedAt": "ISO date string"
}
```

#### PUT `/make-server-04919ac5/blog/posts/:id`
Met à jour un article existant

#### DELETE `/make-server-04919ac5/blog/posts/:id`
Supprime un article

#### POST `/make-server-04919ac5/blog/posts/:slug/view`
Incrémente le compteur de vues d'un article

## 💾 Stockage

Les articles sont stockés dans la table KV store avec :
- **Clé** : `blog_post:{timestamp}_{random}`
- **Valeur** : Objet BlogPost complet

```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML
  coverImage?: string;
  category: "development" | "design" | "business";
  tags: string[];
  readTime: number; // minutes
  status: "draft" | "published";
  publishedAt: string;
  views?: number;
  createdAt: string;
  updatedAt: string;
}
```

## 🎯 Fonctionnalités

### Côté User
- ✅ Navigation vers /blog depuis le menu principal
- ✅ Affichage des articles publiés uniquement
- ✅ Filtrage par catégorie, tags, recherche textuelle
- ✅ Article vedette mis en avant
- ✅ Articles récents en grille compacte
- ✅ Lecture d'article complet avec partage social
- ✅ Articles similaires suggérés
- ✅ Compteur de vues
- ✅ Temps de lecture estimé
- ✅ Design responsive Linear/Vercel

### Côté Admin
- ✅ Onglet "Blog" dans le dashboard
- ✅ Création/édition d'articles avec éditeur HTML
- ✅ Gestion des brouillons et publications
- ✅ Upload d'image de couverture (URL)
- ✅ Gestion des catégories et tags
- ✅ Génération automatique de slug
- ✅ Calcul automatique du temps de lecture
- ✅ Statistiques en temps réel
- ✅ Filtres et recherche
- ✅ Prévisualisation des articles
- ✅ Actualisation des données

## 🎨 Design & Style

### Palette de Couleurs
- **Primary** : #00FFC2 (mint/turquoise)
- **Background** : #0C0C0C (noir profond)
- **Text** : #F4F4F4 (blanc cassé)
- **Catégories** :
  - Développement : #00FFC2
  - Design : #00D9A6
  - Business : #00B38A

### Animations
- Fade-in au scroll (Motion)
- Hover effects sur les cartes
- Transitions fluides entre états
- Animations de chargement
- Toasts de confirmation

## 🚀 Utilisation

### Créer un Article (Admin)
1. Dashboard → Blog
2. "Nouvel Article"
3. Remplir : titre, catégorie, excerpt, contenu (HTML)
4. Ajouter tags et image de couverture
5. Choisir statut (brouillon/publié)
6. "Créer l'article"

### Publier du Contenu HTML
Le champ `content` accepte du HTML :
```html
<p>Introduction de l'article...</p>
<h2>Sous-titre</h2>
<p>Paragraphe avec <strong>texte en gras</strong>.</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
<pre><code>const code = "example";</code></pre>
```

### SEO Best Practices
- **Slug** : Généré automatiquement du titre (modifiable)
- **Excerpt** : Utilisé comme meta description (150-160 caractères)
- **Title** : Balise H1 sur la page article
- **Tags** : Améliore la découvrabilité

## 🔮 Améliorations Futures

- [ ] Éditeur WYSIWYG (Rich Text Editor)
- [ ] Upload d'images dans Supabase Storage
- [ ] Commentaires avec modération
- [ ] Pagination sur la liste d'articles
- [ ] RSS Feed
- [ ] Sitemap XML
- [ ] Open Graph images
- [ ] Recherche full-text avec indexation
- [ ] Auteur multiple
- [ ] Planification de publication
- [ ] Analytics détaillés par article
- [ ] Export/Import d'articles (Markdown)
- [ ] Intégration CMS headless (optionnel)

## 📊 Analytics

Les KPIs suivants sont trackés :
- **Total articles** : Tous les articles créés
- **Articles publiés** : Visibles sur le site
- **Brouillons** : En cours de rédaction
- **Vues totales** : Somme des vues de tous les articles
- **Temps de lecture total** : Contenu disponible

## ⚠️ Notes Importantes

1. **Le contenu HTML est affiché avec `dangerouslySetInnerHTML`** : Assurez-vous que le contenu est sûr (admin uniquement)
2. **Les images doivent être hébergées** : Utilisez des URLs externes ou Unsplash
3. **Le slug doit être unique** : Vérifiez avant de publier
4. **Les articles brouillons ne sont pas visibles** : Seuls les admins les voient
5. **Le temps de lecture est estimé** : Basé sur 200 mots/minute

## 🎯 Intégration

Le blog est intégré dans :
- **Navigation principale** : Lien "Blog" dans le header
- **Dashboard admin** : Onglet "Blog" entre Analytics et Emails
- **Routes** : `/blog` et `/blog/:slug` (SPA routing)

---

✨ **Système de blog complet et opérationnel !**
