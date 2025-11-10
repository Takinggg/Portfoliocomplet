# 📊 Analytics & Tracking - Guide de Configuration

## 🎯 Vue d'ensemble

Votre site dispose maintenant d'un système d'analytics complet et professionnel comprenant :

✅ **Google Analytics 4 (GA4)** - Analyse du trafic et comportement des utilisateurs  
✅ **Microsoft Clarity** - Heatmaps et enregistrements de sessions (100% GRATUIT)  
✅ **Sentry** - Suivi des erreurs en temps réel  
✅ **Event Tracking** - Tracking automatique des conversions et interactions  
✅ **Performance Monitoring** - Mesure de la vitesse du site  

---

## 🚀 Configuration Rapide (5 minutes)

### 1️⃣ Google Analytics 4 (GA4)

**Pourquoi ?** Analytics complet du trafic, utilisateurs, conversions

**Comment configurer :**

1. Allez sur [analytics.google.com](https://analytics.google.com)
2. Créez une propriété GA4
3. Copiez votre **Measurement ID** (format: `G-XXXXXXXXXX`)
4. Ouvrez `/utils/analyticsConfig.ts`
5. Remplacez `GA4_MEASUREMENT_ID: "G-XXXXXXXXXX"` par votre ID

```typescript
GA4_MEASUREMENT_ID: "G-ABC123DEF4", // ← Votre ID ici
```

**C'est tout !** Le tracking démarre automatiquement.

---

### 2️⃣ Microsoft Clarity (GRATUIT & PUISSANT)

**Pourquoi ?** Heatmaps, enregistrements de sessions, analyses UX - 100% gratuit !

**Comment configurer :**

1. Allez sur [clarity.microsoft.com](https://clarity.microsoft.com)
2. Créez un nouveau projet
3. Copiez votre **Project ID**
4. Ouvrez `/utils/analyticsConfig.ts`
5. Collez votre ID :

```typescript
CLARITY_PROJECT_ID: "abc123def4", // ← Votre ID ici
```

**Résultat :** Vous verrez les clics, scrolls, et enregistrements de sessions !

---

### 3️⃣ Sentry (Error Tracking)

**Pourquoi ?** Détectez et corrigez les bugs avant qu'ils n'impactent les utilisateurs

**Comment configurer :**

1. Allez sur [sentry.io](https://sentry.io)
2. Créez un compte (plan gratuit : 5,000 erreurs/mois)
3. Créez un projet **JavaScript/React**
4. Copiez votre **DSN**
5. Ouvrez `/utils/analyticsConfig.ts`
6. Collez votre DSN :

```typescript
SENTRY_DSN: "https://abc123@o456789.ingest.sentry.io/123456", // ← Votre DSN ici
```

---

### 4️⃣ Plausible Analytics (Optionnel)

**Alternative privacy-first à Google Analytics**

Si vous préférez Plausible à GA4 :

1. Allez sur [plausible.io](https://plausible.io)
2. Ajoutez votre site
3. Dans `/utils/analyticsConfig.ts` :

```typescript
PLAUSIBLE_DOMAIN: "votresite.com",
ENABLE_PLAUSIBLE: true,
ENABLE_GA4: false, // Désactivez GA4 si vous utilisez Plausible
```

---

## 📈 Ce qui est tracké automatiquement

### Pages vues
✅ Chaque navigation de page  
✅ Temps passé sur chaque page  
✅ Profondeur de scroll (25%, 50%, 75%, 100%)

### Conversions
✅ Soumissions de formulaire de contact  
✅ Réservations de rendez-vous  
✅ Demandes de devis  
✅ Inscriptions newsletter  
✅ Téléchargements de ressources

### Interactions
✅ Clics sur CTA (Call-to-Action)  
✅ Partages sociaux  
✅ Lectures d'articles de blog  
✅ Vues de projets/case studies  
✅ Recherches

### Performance
✅ Temps de chargement des pages  
✅ Temps de rendu  
✅ Core Web Vitals

### Erreurs
✅ Erreurs JavaScript  
✅ Erreurs de formulaires  
✅ Erreurs réseau

---

## 💻 Utilisation dans le code

### Hook React `useAnalytics()`

```tsx
import { useAnalytics } from './utils/hooks/useAnalytics';

function MonComposant() {
  const analytics = useAnalytics();
  
  const handleButtonClick = () => {
    // Tracker un CTA
    analytics.trackCTA('Prendre RDV', 'Hero Section');
    
    // Tracker une conversion
    analytics.trackContactConversion('HomePage CTA');
  };
  
  return <button onClick={handleButtonClick}>Contactez-nous</button>;
}
```

### Tracking automatique de page

```tsx
import { usePageTracking } from './utils/hooks/useAnalytics';

function BlogPostPage() {
  // Track automatiquement la vue de page
  usePageTracking('blog-post', 'Titre de l\'article');
  
  return <article>...</article>;
}
```

### Tracking de temps passé

```tsx
import { useTimeTracking } from './utils/hooks/useAnalytics';

function LongArticle() {
  // Track le temps passé sur cet article
  useTimeTracking('article-xyz');
  
  return <article>...</article>;
}
```

---

## 🎯 Événements disponibles

### Conversions

```typescript
// Contact
analytics.trackContactConversion('source');

// Booking
analytics.trackBookingConversion('Consultation', 150);

// Quote
analytics.trackQuoteConversion('Site E-commerce', 5000);

// Newsletter
analytics.trackNewsletterConversion('Popup');

// Resource Download
analytics.trackResourceConversion('Guide PDF', 'pdf');
```

### Interactions

```typescript
// CTA Click
analytics.trackCTA('Button Name', 'Section Name');

// Form Submission
analytics.trackFormSubmit('Contact Form');

// Social Share
analytics.trackSocialShare('twitter', 'blog', 'Article Title');

// Download
analytics.trackDownload('filename.pdf', 'pdf');

// Search
analytics.trackSearch('keyword', 10);
```

### Avancé

```typescript
// Feature Usage
analytics.trackFeatureUse('Live Chat', 'Contact Page');

// Engagement Time
analytics.trackEngagementTime('blog-post', 180);

// Scroll Depth
analytics.trackScrollDepth('article-name', 75);

// User Identification
analytics.identifyUser('user-123', { 
  name: 'John Doe',
  plan: 'premium' 
});
```

---

## 🔍 Où voir les données ?

### Google Analytics 4
- Dashboard : [analytics.google.com](https://analytics.google.com)
- **Rapports** → En temps réel (voir visiteurs actuels)
- **Rapports** → Acquisition (d'où viennent vos visiteurs)
- **Événements** → Tous les événements (conversions, clics, etc.)

### Microsoft Clarity
- Dashboard : [clarity.microsoft.com](https://clarity.microsoft.com)
- **Heatmaps** → Voir où les gens cliquent
- **Recordings** → Regarder les sessions utilisateurs
- **Insights** → Rage clicks, dead clicks, quick backs

### Sentry
- Dashboard : [sentry.io](https://sentry.io)
- **Issues** → Toutes les erreurs détectées
- **Performance** → Temps de chargement des pages
- **Releases** → Suivi des versions

---

## 🛡️ Privacy & RGPD

### Conformité automatique

✅ **Do Not Track respecté** - Les utilisateurs avec DNT activé ne sont pas trackés  
✅ **Anonymisation IP** - Les adresses IP sont anonymisées (GA4)  
✅ **Pas de cookies tiers** - Tout est first-party  
✅ **Données en EU** - Clarity et GA4 peuvent stocker en EU

### Configuration dans `analyticsConfig.ts`

```typescript
RESPECT_DO_NOT_TRACK: true, // Respecte le DNT
ANONYMIZE_IP: true,          // Anonymise les IPs (RGPD)
```

---

## 🐛 Debug & Troubleshooting

### Mode Debug

Le mode debug est automatiquement activé en localhost :

```typescript
DEBUG: true, // Active les console.logs
```

### Vérifier l'initialisation

Ouvrez la console du navigateur, vous devriez voir :

```
✅ Google Analytics 4 initialized: G-ABC123
✅ Microsoft Clarity initialized: abc123
✅ Sentry initialized
📊 Analytics system initialized
```

### Tester les événements

```javascript
// Dans la console du navigateur
window.gtag('event', 'test_event', { test: true });
```

### Voir les warnings

Si les IDs ne sont pas configurés :

```
⚠️ Google Analytics 4: No valid Measurement ID configured
⚠️ Microsoft Clarity: No Project ID configured
⚠️ Sentry: No DSN configured
```

---

## 📚 Ressources

### Documentation officielle
- [GA4 Guide](https://support.google.com/analytics/answer/9304153)
- [Clarity Setup](https://docs.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup)
- [Sentry React Guide](https://docs.sentry.io/platforms/javascript/guides/react/)

### Tutoriels vidéo
- [GA4 Setup (YouTube)](https://www.youtube.com/results?search_query=google+analytics+4+setup)
- [Microsoft Clarity Guide](https://www.youtube.com/results?search_query=microsoft+clarity+setup)

---

## ✨ Prochaines étapes

1. **Configurez vos IDs** dans `/utils/analyticsConfig.ts`
2. **Testez** sur votre site local
3. **Vérifiez** les dashboards après quelques heures
4. **Analysez** les heatmaps Clarity après 100+ sessions
5. **Optimisez** votre site selon les données

---

## 💡 Conseils Pro

### Pour les conversions
- Créez des **objectifs** dans GA4 pour chaque conversion
- Configurez des **alertes** Sentry pour les erreurs critiques
- Regardez les **replays** Clarity des utilisateurs qui ne convertissent pas

### Pour la performance
- Surveillez le **temps de chargement** dans Sentry
- Optimisez les pages avec un **taux de rebond** élevé (GA4)
- Identifiez les **blocages** avec les heatmaps (Clarity)

### Pour le ROI
- Trackez la **source** de chaque conversion
- Calculez le **coût par acquisition** (CPA)
- Mesurez le **temps jusqu'à conversion**

---

**🎉 C'est tout ! Votre système d'analytics est maintenant au niveau entreprise.**

Questions ? Consultez la [documentation complète](/utils/analytics.ts) ou les commentaires dans le code.
