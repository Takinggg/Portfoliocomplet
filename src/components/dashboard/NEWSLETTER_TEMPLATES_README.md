# 📧 Newsletter Templates System - Technical Documentation

## Overview

Le système de templates Newsletter permet de générer automatiquement des emails professionnels à partir des contenus existants (projets, articles de blog, études de cas).

---

## Architecture

### Composants

```
NewsletterTab.tsx (parent)
├── NewsletterTemplatesTab.tsx (nouveau)
│   ├── Template Selection Grid
│   ├── Content Selection (Projects/Blogs/Case Studies)
│   ├── Preview Dialog
│   └── Template Generator
├── NewsletterCampaignTab.tsx (modifié)
│   └── Auto-load from localStorage
└── NewsletterAbonnésTab (existant)
```

### Data Flow

```
1. User selects template
2. User selects content(s)
3. System generates HTML + Text
4. User previews
5. User clicks "Use Template"
6. Content saved to localStorage
7. Event "newsletter-template-selected" fired
8. NewsletterCampaignTab loads from localStorage
9. User can edit and send
```

---

## Templates disponibles

### 1. Nouveau Projet (`project`)

**Input** :
- 1 projet sélectionné

**Output** :
```javascript
{
  subject: "✨ Nouveau projet : [title]",
  html: "<h2>Nouveau projet disponible !</h2>...",
  text: "Nouveau projet : [title]\n\n[description]..."
}
```

**Features** :
- Image du projet (optionnelle)
- Titre + description
- Tags
- CTA "Découvrir le projet"
- Couleur accent : `#00FFC2`

---

### 2. Nouveau Article (`blog`)

**Input** :
- 1 article de blog sélectionné

**Output** :
```javascript
{
  subject: "📚 Nouvel article : [title]",
  html: "<h2>Nouvel article de blog</h2>...",
  text: "Nouvel article : [title]\n\n[excerpt]..."
}
```

**Features** :
- Cover image (optionnelle)
- Catégorie
- Titre + extrait
- CTA "Lire l'article" avec lien vers `/blog/[slug]`
- Couleur accent : `#3B82F6`

---

### 3. Étude de Cas (`case-study`)

**Input** :
- 1 étude de cas sélectionnée

**Output** :
```javascript
{
  subject: "💼 Étude de cas : [title]",
  html: "<h2>Nouvelle étude de cas</h2>...",
  text: "Étude de cas : [title]\n\n[subtitle]..."
}
```

**Features** :
- Thumbnail (optionnel)
- Catégorie
- Titre + sous-titre
- Nom du client
- CTA "Voir l'étude de cas" avec lien vers `/case-studies/[slug]`
- Couleur accent : `#8B5CF6`

---

### 4. Digest Mensuel (`digest`)

**Input** :
- Titre personnalisé
- Introduction (optionnelle)
- Multi-sélection : projets + articles + études de cas

**Output** :
```javascript
{
  subject: "[customTitle]",
  html: "<p>[intro]</p><h3>Nouveaux Projets</h3>...",
  text: "[intro]\n\nNouveaux Projets\n- [project1]..."
}
```

**Features** :
- Sections dynamiques :
  - 🚀 Nouveaux Projets
  - 📚 Nouveaux Articles
  - 💼 Études de Cas
- Chaque section affiche les éléments sélectionnés
- CTA global "Voir tout sur le site"
- Couleurs multiples selon section

---

### 5. Annonce (`announcement`)

**Input** :
- Titre personnalisé
- Message personnalisé

**Output** :
```javascript
{
  subject: "[customTitle]",
  html: "<h2>[customTitle]</h2><p>[customMessage]</p>...",
  text: "[customTitle]\n\n[customMessage]..."
}
```

**Features** :
- Design simple et élégant
- CTA "En savoir plus"
- Couleur accent : `#EC4899`

---

## API Endpoints utilisés

### GET `/projects`
Récupère la liste des projets.

**Response** :
```json
{
  "projects": [
    {
      "id": "project_123",
      "title": "Refonte site e-commerce",
      "description": "Modernisation complète...",
      "image": "https://...",
      "tags": ["React", "E-commerce"],
      "link": "https://..."
    }
  ]
}
```

### GET `/blogs/posts`
Récupère la liste des articles de blog.

**Response** :
```json
{
  "posts": [
    {
      "id": "blog_123",
      "slug": "seo-tips-2025",
      "title": "10 astuces SEO pour 2025",
      "excerpt": "Découvrez les techniques...",
      "category": "SEO",
      "publishedAt": "2025-11-01T10:00:00Z",
      "coverImage": "https://..."
    }
  ]
}
```

### GET `/case-studies`
Récupère la liste des études de cas.

**Response** :
```json
{
  "caseStudies": [
    {
      "id": "case_123",
      "slug": "startup-x-growth",
      "title": "Comment StartupX a doublé son trafic",
      "subtitle": "Stratégie SEO + Content Marketing",
      "client": "StartupX",
      "category": "SEO",
      "thumbnail": "https://..."
    }
  ]
}
```

---

## LocalStorage Communication

### Workflow

1. **NewsletterTemplatesTab** génère le contenu
2. Stockage dans localStorage :
   ```javascript
   localStorage.setItem("newsletter_draft_subject", subject);
   localStorage.setItem("newsletter_draft_html", html);
   localStorage.setItem("newsletter_draft_text", text);
   ```
3. Déclenchement d'un événement custom :
   ```javascript
   window.dispatchEvent(new CustomEvent("newsletter-template-selected"));
   ```
4. **NewsletterCampaignTab** écoute l'événement
5. Charge le contenu depuis localStorage
6. Supprime les données de localStorage après chargement

### Conversion HTML → Text

Pour l'affichage dans le textarea :
```javascript
const tempDiv = document.createElement("div");
tempDiv.innerHTML = html;
const text = tempDiv.textContent || tempDiv.innerText || "";
```

---

## HTML Email Template Structure

Tous les templates utilisent la même structure de base :

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      /* Styles inline pour compatibilité email */
      body { font-family: -apple-system, ...; }
      .container { max-width: 600px; ... }
      .header { background: linear-gradient(...); }
      .content { background: white; ... }
      .footer { background: #0C0C0C; ... }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>✨ [Subject]</h1>
      </div>
      <div class="content">
        [Template-specific content]
        
        <div class="unsubscribe">
          <p>Vous recevez cet email car vous êtes inscrit à notre newsletter.</p>
          <p><a href="{{unsubscribe_url}}">Se désabonner</a></p>
        </div>
      </div>
      <div class="footer">
        <p>© 2025 Portfolio Freelance - Tous droits réservés</p>
      </div>
    </div>
  </body>
</html>
```

---

## Color System

Chaque template a sa couleur accent :

| Template | Couleur | Hex |
|----------|---------|-----|
| Projet | Vert | `#00FFC2` |
| Article | Bleu | `#3B82F6` |
| Étude de Cas | Violet | `#8B5CF6` |
| Digest | Orange | `#F59E0B` |
| Annonce | Rose | `#EC4899` |

**Utilisation** :
```jsx
<div style={{ backgroundColor: `${template.color}20` }}>
  <Icon style={{ color: template.color }} />
</div>
```

---

## State Management

### NewsletterTemplatesTab State

```typescript
const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
const [projects, setProjects] = useState<Project[]>([]);
const [blogs, setBlogs] = useState<BlogPost[]>([]);
const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
const [selectedCaseStudies, setSelectedCaseStudies] = useState<string[]>([]);
const [customTitle, setCustomTitle] = useState("");
const [customMessage, setCustomMessage] = useState("");
const [showPreview, setShowPreview] = useState(false);
const [isLoading, setIsLoading] = useState(false);
```

### Selection Logic

**Single Selection** (Project, Blog, Case Study) :
```typescript
// Replace previous selection with new one
setSelectedProjects([project.id]);
```

**Multi Selection** (Digest) :
```typescript
// Toggle selection
setSelectedProjects(prev => 
  prev.includes(id) 
    ? prev.filter(p => p !== id) 
    : [...prev, id]
);
```

---

## Validation Rules

### canGenerate()

```typescript
if (selectedTemplate === "project") 
  return selectedProjects.length === 1;

if (selectedTemplate === "blog") 
  return selectedBlogs.length === 1;

if (selectedTemplate === "case-study") 
  return selectedCaseStudies.length === 1;

if (selectedTemplate === "digest") 
  return selectedProjects.length > 0 
      || selectedBlogs.length > 0 
      || selectedCaseStudies.length > 0;

if (selectedTemplate === "announcement") 
  return customTitle && customMessage;

return false;
```

---

## Error Handling

### Content Loading

```typescript
try {
  const response = await fetch(...);
  if (response.ok) {
    const data = await response.json();
    setProjects(data.projects || []);
  }
} catch (error) {
  console.error("Error loading content:", error);
  toast.error("Erreur lors du chargement du contenu");
}
```

### Template Generation

```typescript
if (!subject || !html) {
  toast.error("Veuillez sélectionner au moins un élément");
  return;
}
```

---

## Testing

### Test 1 : Template Selection
1. Ouvrir Templates tab
2. Cliquer sur chaque template
3. Vérifier que l'UI change correctement

### Test 2 : Content Loading
1. Vérifier que les projets se chargent
2. Vérifier que les articles se chargent
3. Vérifier que les études de cas se chargent

### Test 3 : Single Selection
1. Template "Nouveau Projet"
2. Cliquer sur un projet
3. Vérifier qu'il est sélectionné (✓)
4. Cliquer sur un autre projet
5. Vérifier que le premier est désélectionné

### Test 4 : Multi Selection (Digest)
1. Template "Digest Mensuel"
2. Cocher plusieurs projets
3. Cocher plusieurs articles
4. Vérifier que tous sont sélectionnés

### Test 5 : Preview
1. Sélectionner un contenu
2. Cliquer "Prévisualiser"
3. Vérifier que la modale s'ouvre
4. Vérifier le rendu HTML

### Test 6 : Use Template
1. Cliquer "Utiliser ce template"
2. Vérifier le toast de succès
3. Aller dans "Envoyer une campagne"
4. Vérifier que le contenu est pré-chargé

---

## Performance

### Optimizations

**Lazy Loading** :
- Contenu chargé uniquement au mount
- Pas de rechargement à chaque sélection

**Memoization** :
- Génération HTML uniquement lors de la preview ou du submit
- Pas de calcul en temps réel

**Event Delegation** :
- Un seul listener pour l'événement custom

---

## Accessibility

- ✅ Keyboard navigation
- ✅ ARIA labels sur les checkboxes
- ✅ Focus visible
- ✅ Screen reader friendly

---

## Browser Support

Testé sur :
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## Future Improvements

### Phase 2
- [ ] Drag & drop pour réorganiser les éléments (Digest)
- [ ] Éditeur WYSIWYG pour personnaliser le HTML
- [ ] Templates personnalisés (créer ses propres templates)
- [ ] Historique des templates utilisés

### Phase 3
- [ ] A/B testing de templates
- [ ] Statistiques par template (taux d'ouverture)
- [ ] Templates conditionnels (selon segment d'abonnés)
- [ ] Import/export de templates

---

## Troubleshooting

### Content ne se charge pas

**Symptôme** : Listes vides

**Solution** :
1. Vérifier que les endpoints `/projects`, `/blogs/posts`, `/case-studies` existent
2. Vérifier les logs console
3. Vérifier que des contenus existent en DB

### Template ne se charge pas dans Campaign

**Symptôme** : Formulaire vide après "Utiliser ce template"

**Solution** :
1. Vérifier localStorage : `localStorage.getItem("newsletter_draft_subject")`
2. Vérifier que l'événement custom est déclenché
3. Recharger la page

### Preview différente de l'email final

**Symptôme** : Le rendu ne correspond pas

**Solution** :
- La preview est exacte
- Vérifier que le contenu n'a pas été modifié après génération
- Tester l'envoi pour voir le vrai rendu

---

## Stack

- **React** : Composants fonctionnels avec hooks
- **TypeScript** : Typage fort
- **Tailwind CSS** : Styles
- **shadcn/ui** : Composants UI (Dialog, Card, Checkbox, etc.)
- **Motion** : Animations (Framer Motion)
- **Lucide React** : Icons

---

## Version

**Current** : 1.0.0  
**Last Updated** : 2025-11-06

---

## Support

Pour toute question :
- User Guide : `/NEWSLETTER_TEMPLATES_GUIDE.md`
- Quick Start : `/QUICK_START_TEMPLATES.md`
- Issues : Check console logs + Supabase logs
