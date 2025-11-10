# 🌍 Système d'internationalisation (i18n)

## 📋 Vue d'ensemble

Le site portfolio est maintenant **bilingue FR/EN** avec un système d'internationalisation complet.

### ✨ Fonctionnalités

- ✅ **Auto-détection** de la langue du navigateur au premier chargement
- ✅ **Mémorisation** de la préférence utilisateur dans localStorage
- ✅ **Switch FR/EN** dans la navigation (Desktop + Mobile)
- ✅ **Dashboard en français uniquement** (outil personnel)
- ✅ **Traductions complètes** de toutes les pages publiques

---

## 🏗️ Architecture

### Structure des fichiers

```
/utils/i18n/
  ├── LanguageContext.tsx          # Context React pour la gestion de l'état
  ├── useTranslation.ts            # Hook personnalisé pour l'utilisation
  └── translations/
      ├── fr.json                  # Traductions françaises
      └── en.json                  # Traductions anglaises
```

### Composants mis à jour

- ✅ **Navigation.tsx** - Switch langue + labels traduits
- ✅ **App.tsx** - Wrapper avec LanguageProvider
- 🚧 **HomePage.tsx** - À traduire (prochaine étape)
- 🚧 **Footer.tsx** - À traduire
- 🚧 **Autres pages** - À traduire progressivement

---

## 🎨 UI du Language Switcher

### Desktop
```
┌─────────────────┐
│  FR  │  EN  │
└─────────────────┘
```

### Mobile
```
┌──────────────────────────┐
│ 🌐 Français │ English  │
└──────────────────────────┘
```

---

## 💻 Utilisation dans les composants

### 1. Importer le hook

```tsx
import { useTranslation } from '../utils/i18n/useTranslation';
```

### 2. Utiliser dans le composant

```tsx
function MyComponent() {
  const { t, language, setLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.hero.title')}</h1>
      <p>{t('home.hero.subtitle')}</p>
      
      {/* Langue actuelle */}
      <p>Current: {language}</p>
      
      {/* Changer la langue */}
      <button onClick={() => setLanguage('en')}>EN</button>
    </div>
  );
}
```

### 3. Helpers disponibles

```tsx
const { t, language, setLanguage, isEnglish, isFrench } = useTranslation();

// t() - Fonction de traduction
t('nav.home') // "Accueil" ou "Home"

// language - Langue actuelle ('fr' | 'en')
language === 'fr' // true ou false

// setLanguage() - Changer la langue
setLanguage('en') // Switch to English

// isEnglish - Boolean helper
isEnglish // true si langue = 'en'

// isFrench - Boolean helper  
isFrench // true si langue = 'fr'
```

---

## 📝 Structure des traductions

### Clés imbriquées avec notation par points

```json
{
  "nav": {
    "home": "Accueil",
    "about": "À propos"
  },
  "home": {
    "hero": {
      "title": "Designer & Développeur Web",
      "subtitle": "Je crée des expériences..."
    }
  }
}
```

### Utilisation

```tsx
t('nav.home')           // "Accueil"
t('home.hero.title')    // "Designer & Développeur Web"
```

---

## 🔄 Workflow de traduction

### Pour ajouter une nouvelle traduction

1. **Ajouter la clé dans `fr.json`**
```json
{
  "services": {
    "newFeature": "Nouvelle fonctionnalité"
  }
}
```

2. **Ajouter la traduction EN dans `en.json`**
```json
{
  "services": {
    "newFeature": "New Feature"
  }
}
```

3. **Utiliser dans le composant**
```tsx
<h2>{t('services.newFeature')}</h2>
```

---

## 📄 Pages à traduire

### ✅ Phase 1 : Infrastructure
- [x] LanguageContext
- [x] useTranslation hook
- [x] Fichiers de traduction (base)
- [x] Navigation switcher
- [x] App wrapper

### 🚧 Phase 2 : Composants communs
- [ ] Navigation (labels) ✅ Fait
- [ ] Footer
- [ ] NewsletterForm
- [ ] NewsletterPopup
- [ ] NewsletterCTA

### 🚧 Phase 3 : Pages publiques
- [ ] HomePage (priorité #1)
- [ ] AboutPage
- [ ] ServicesPage
- [ ] ProjectsPage
- [ ] ProjectDetailPage
- [ ] CaseStudiesPage
- [ ] CaseStudyDetailPage
- [ ] BlogPage
- [ ] BlogPostPage
- [ ] TestimonialsPage
- [ ] FAQPage
- [ ] ResourcesPage
- [ ] ContactPage
- [ ] BookingPage
- [ ] NewsletterConfirmPage

---

## 🎯 Contenu dynamique (Database)

### Case Studies
- ✅ Ont déjà un champ `language` dans Supabase
- ✅ Filtrer par langue dans les queries

### Blog, FAQ, Resources
**Option 1 : Duplication**
- Créer 2 versions (FR + EN) avec flag `language`
- Filtrer selon la langue active

**Option 2 : Champs multiples**
- Ajouter `title_en`, `content_en` à côté de `title`, `content`
- Afficher selon la langue active

### Témoignages
- Pour l'instant : afficher tous (noms propres = universels)
- Future : ajouter champ `language` si nécessaire

---

## 🧪 Tests

### Tester le système

1. **Ouvrir le site** → Langue = celle du navigateur
2. **Cliquer sur FR/EN** → Switch instantané
3. **Rafraîchir la page** → Langue conservée (localStorage)
4. **Ouvrir en navigation privée** → Auto-détection navigateur
5. **Tester mobile** → Switcher visible dans le menu burger

### Console debug

```javascript
// Changer la langue via console
localStorage.setItem('language', 'en');
location.reload();

// Vérifier la langue actuelle
localStorage.getItem('language');

// Réinitialiser (auto-détection)
localStorage.removeItem('language');
location.reload();
```

---

## 🚀 Prochaines étapes

### Priorité haute
1. ✅ Infrastructure complète (FAIT)
2. 🔜 Traduire HomePage (page la plus importante)
3. 🔜 Traduire Footer
4. 🔜 Traduire composants Newsletter

### Priorité moyenne
5. Traduire About, Services, Contact
6. Traduire Projects, Case Studies
7. Traduire Blog, Testimonials, FAQ, Resources

### Priorité basse
8. Gérer le contenu dynamique (blog posts, case studies)
9. SEO multilingue (hreflang tags)
10. URLs localisées (optionnel)

---

## ⚠️ Important

- **Dashboard reste en français** (outil personnel, pas besoin d'anglais)
- **Ne PAS traduire** les fichiers dans `/components/dashboard/`
- **Toujours ajouter** les 2 langues (FR + EN) en même temps
- **Tester** après chaque traduction majeure

---

## 📚 Ressources

- [React Context API](https://react.dev/reference/react/useContext)
- [localStorage](https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage)
- [Navigator.language](https://developer.mozilla.org/fr/docs/Web/API/Navigator/language)

---

**Status** : ✅ Infrastructure complète | 🚧 Traduction des pages en cours

**Dernière mise à jour** : 2025-01-06
