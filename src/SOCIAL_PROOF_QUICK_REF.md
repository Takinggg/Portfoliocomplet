# ⚡ Social Proof - Quick Reference

## 🎯 Composants - Copy-Paste rapide

### SocialShare (Boutons de partage)
```tsx
import { SocialShare } from "./components/SocialShare";

<SocialShare
  title="Titre"
  description="Description"
  hashtags={["tag1", "tag2"]}
  contentType="blog"
/>
```

### ViewCounter (Compteur de vues)
```tsx
import { ViewCounter } from "./components/ViewCounter";

// Badge
<ViewCounter views={1234} variant="badge" />

// Complet
<ViewCounter views={5000} showTrending trendingPercentage={15} />

// Grid
<ViewStatsGrid totalViews={50000} monthlyViews={8500} weeklyViews={2100} />
```

### TrustBadges (Badges de confiance)
```tsx
import { 
  TrustBadges, 
  TrustpilotBadge, 
  GoogleReviewsBadge, 
  AllTrustBadges 
} from "./components/TrustBadges";

// Horizontal
<TrustBadges variant="horizontal" showAll={true} />

// Compact (inline)
<TrustBadges variant="compact" showAll={false} />

// Vertical (sidebar)
<TrustBadges variant="vertical" showAll={true} />

// Badges individuels
<TrustpilotBadge />
<GoogleReviewsBadge />
<AllTrustBadges />
```

### ReadingTime (Temps de lecture)
```tsx
import { ReadingTime, calculateReadingTime } from "./components/blog/ReadingTime";

<ReadingTime text={post.content} />

// Ou calculer manuellement
const minutes = calculateReadingTime(htmlContent);
```

---

## 📍 Où c'est déjà implémenté ?

- ✅ **BlogPostPage** → SocialShare + ViewCounter
- ✅ **BlogPostCard** → ViewCounter + ReadingTime
- ✅ **Footer** → TrustBadges compact

---

## 🎨 Variantes disponibles

| Composant | Variantes | Usage |
|-----------|-----------|-------|
| SocialShare | `default`, `compact` | Articles, pages |
| ViewCounter | `default`, `compact`, `badge` | Stats, meta |
| TrustBadges | `horizontal`, `vertical`, `compact` | Hero, footer, sidebar |

---

## 🚀 Quick Wins (< 5 min chacun)

### 1. Hero avec badges
```tsx
<h1>Full-Stack Developer.</h1>
<TrustBadges variant="compact" showAll={false} />
```

### 2. Section Stats
```tsx
<section>
  <h2>En chiffres</h2>
  <TrustBadges variant="horizontal" showAll={true} />
</section>
```

### 3. Article avec partage
Déjà fait ✅

---

## 📊 Props essentielles

### SocialShare
- `title` (requis)
- `description` (optionnel)
- `hashtags` (optionnel)
- `contentType` (optionnel)

### ViewCounter
- `views` (requis)
- `variant` = "badge" | "compact" | "default"
- `showTrending` (optionnel)

### TrustBadges
- `variant` = "horizontal" | "vertical" | "compact"
- `showAll` = true | false

---

## 🎯 Couleurs

```css
--mint: #00FFC2
--trustpilot: #00B67A
--google-star: #FBBC04
--twitter: #1DA1F2
--linkedin: #0077B5
```

---

## ✅ Status

- [x] SocialShare - 4 plateformes
- [x] ViewCounter - 3 variantes
- [x] TrustBadges - 4 composants
- [x] ReadingTime - Fonctionnel
- [x] Intégrations - Blog + Footer
- [x] Documentation - 5 fichiers

**✅ 100% COMPLET**

---

## 📚 Docs complètes

- `/SOCIAL_PROOF_COMPLETE.md` - Guide complet
- `/SOCIAL_PROOF_VISUAL_GUIDE.md` - Schémas visuels
- `/SOCIAL_PROOF_INTEGRATION_EXAMPLES.md` - Exemples
- `/SOCIAL_PROOF_TESTS.md` - Tests
- `/SOCIAL_PROOF_DONE.md` - Résumé

---

**Mise à jour : 7 novembre 2024**
