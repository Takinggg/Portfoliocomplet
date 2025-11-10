# 🎨 Social Proof - Exemples d'intégration

## Exemples pratiques d'utilisation dans différentes pages

---

## 1. HomePage - Section Hero

### Option A : Badges compacts sous le titre

```tsx
import { TrustBadges } from "./components/TrustBadges";

function HeroSection() {
  return (
    <section className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl text-white mb-6">
          Full-Stack Developer
          <span className="text-mint">.</span>
        </h1>
        
        <p className="text-xl text-neutral-400 mb-8">
          Je crée des applications web performantes et élégantes
        </p>
        
        {/* Trust Badges */}
        <TrustBadges variant="compact" showAll={false} className="mb-8" />
        
        {/* CTA Buttons */}
        <div className="flex gap-4">
          <Button>Voir mes projets</Button>
          <Button variant="outline">Me contacter</Button>
        </div>
      </div>
    </section>
  );
}
```

**Rendu visuel :**
```
┌─────────────────────────────────────────────┐
│  Full-Stack Developer.                      │
│                                             │
│  Je crée des applications web...            │
│                                             │
│  [⭐4.9] [🏆50+] [✅100%]                   │ ← TrustBadges compact
│                                             │
│  [Voir mes projets] [Me contacter]          │
└─────────────────────────────────────────────┘
```

---

### Option B : AllTrustBadges complet

```tsx
import { AllTrustBadges } from "./components/TrustBadges";

function HeroSection() {
  return (
    <section className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <h1>Full-Stack Developer.</h1>
        <p>Je crée des applications web performantes</p>
        
        {/* All Trust Badges */}
        <AllTrustBadges className="my-8" />
        
        <div className="flex gap-4">
          <Button>Voir mes projets</Button>
          <Button variant="outline">Me contacter</Button>
        </div>
      </div>
    </section>
  );
}
```

**Rendu visuel :**
```
┌─────────────────────────────────────────────────────────┐
│  Full-Stack Developer.                                  │
│                                                         │
│  [Trustpilot 4.9] [Google 5.0]                         │
│  [Vérifié ✅] [Top Freelance 🏆]                        │
│                                                         │
│  [Voir mes projets] [Me contacter]                      │
└─────────────────────────────────────────────────────────┘
```

---

## 2. HomePage - Section Stats

```tsx
import { AnimatedViewCount } from "./components/ViewCounter";
import { TrustBadges } from "./components/TrustBadges";

function StatsSection() {
  return (
    <section className="py-20 bg-neutral-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl text-white text-center mb-12">
          En chiffres
        </h2>
        
        {/* Horizontal badges */}
        <TrustBadges variant="horizontal" showAll={true} />
        
        {/* Additional animated stats */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <AnimatedViewCount views={50000} label="visiteurs mensuels" />
          <AnimatedViewCount views={15} label="articles publiés" />
          <AnimatedViewCount views={98} label="% satisfaction client" />
        </div>
      </div>
    </section>
  );
}
```

**Rendu visuel :**
```
┌──────────────────────────────────────────────────────┐
│              En chiffres                             │
│                                                      │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐   │
│  │  ⭐️   │  │  🏆    │  │  ✅    │  │  🛡️   │   │
│  │ 4.9/5  │  │  50+   │  │  100%  │  │ 5 ans │   │
│  └────────┘  └────────┘  └────────┘  └────────┘   │
│                                                      │
│    50,000          15           98%                 │
│  visiteurs     articles    satisfaction             │
│  mensuels     publiés        client                 │
└──────────────────────────────────────────────────────┘
```

---

## 3. ServicesPage - Sous chaque service

```tsx
import { TrustBadges } from "./components/TrustBadges";

function ServicesSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl text-white mb-12">Mes services</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Service Card */}
          <div className="p-8 bg-neutral-900 rounded-2xl">
            <h3 className="text-2xl text-white mb-4">Dashboard Design</h3>
            <p className="text-neutral-400 mb-6">
              Création d'interfaces modernes et performantes
            </p>
            
            {/* Trust badges compact inline */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-neutral-500">Preuve :</span>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded-full bg-mint/10 text-mint text-xs">
                  ⭐ 4.9/5
                </span>
                <span className="px-2 py-1 rounded-full bg-mint/10 text-mint text-xs">
                  🏆 50+ projets
                </span>
              </div>
            </div>
            
            <Button>En savoir plus</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## 4. AboutPage - Section "Pourquoi me faire confiance"

```tsx
import { TrustBadges, TrustpilotBadge, GoogleReviewsBadge } from "./components/TrustBadges";

function TrustSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-mint/5 to-transparent">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl text-white text-center mb-4">
          Pourquoi me faire confiance ?
        </h2>
        <p className="text-neutral-400 text-center mb-12">
          Des clients satisfaits et des résultats prouvés
        </p>
        
        {/* Vertical badges */}
        <TrustBadges variant="vertical" showAll={true} />
        
        {/* Third-party badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <TrustpilotBadge />
          <GoogleReviewsBadge />
        </div>
      </div>
    </section>
  );
}
```

**Rendu visuel :**
```
┌──────────────────────────────────────────┐
│   Pourquoi me faire confiance ?          │
│   Des clients satisfaits et...           │
│                                          │
│  ┌─────────────────────────┐            │
│  │  ⭐️  4.9/5             │            │
│  │      Note moyenne       │            │
│  ├─────────────────────────┤            │
│  │  🏆  50+                │            │
│  │      Projets réussis    │            │
│  └─────────────────────────┘            │
│                                          │
│  [Trustpilot 4.9] [Google 5.0]          │
└──────────────────────────────────────────┘
```

---

## 5. BlogPage - En-tête de liste

```tsx
import { ViewStatsGrid } from "./components/ViewCounter";

function BlogHeader() {
  return (
    <div className="mb-12">
      <h1 className="text-4xl text-white mb-4">Blog</h1>
      <p className="text-neutral-400 mb-8">
        Conseils, tutoriels et retours d'expérience
      </p>
      
      {/* Blog stats */}
      <ViewStatsGrid
        totalViews={50000}
        monthlyViews={8500}
        weeklyViews={2100}
      />
    </div>
  );
}
```

**Rendu visuel :**
```
┌─────────────────────────────────────────────────┐
│  Blog                                           │
│  Conseils, tutoriels et retours d'expérience    │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ 👁️       │  │ 👁️       │  │ 👁️       │     │
│  │ 50,000   │  │ 8,500    │  │ 2,100    │     │
│  │ vues     │  │ ce mois  │  │ cette    │     │
│  │ totales  │  │ +12% 📈  │  │ semaine  │     │
│  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────┘
```

---

## 6. ContactPage - Sidebar

```tsx
import { TrustBadges, AllTrustBadges } from "./components/TrustBadges";

function ContactPage() {
  return (
    <div className="grid lg:grid-cols-3 gap-12">
      {/* Left: Form */}
      <div className="lg:col-span-2">
        <h1>Contactez-moi</h1>
        <ContactForm />
      </div>
      
      {/* Right: Sidebar with trust elements */}
      <div className="lg:col-span-1">
        <div className="p-6 bg-neutral-900 rounded-2xl">
          <h3 className="text-lg text-white mb-4">Ils me font confiance</h3>
          
          <TrustBadges variant="vertical" showAll={true} />
          
          <div className="mt-6 pt-6 border-t border-neutral-800">
            <p className="text-sm text-neutral-400 mb-3">
              Note moyenne sur les plateformes :
            </p>
            <AllTrustBadges />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 7. Testimonials Section - Avec stats

```tsx
import { TrustBadges } from "./components/TrustBadges";

function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-white mb-4">
            Ce que disent mes clients
          </h2>
          
          {/* Trust badges horizontal */}
          <TrustBadges variant="compact" showAll={true} className="justify-center" />
        </div>
        
        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 8. Footer - Déjà implémenté ✅

```tsx
import { TrustBadges } from "../TrustBadges";

export default function Footer() {
  return (
    <footer>
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Newsletter, links, etc. */}
        
        {/* Trust Badges */}
        <TrustBadges variant="compact" showAll={true} className="mb-12" />
        
        {/* Copyright, social icons */}
      </div>
    </footer>
  );
}
```

---

## 9. Pricing Page - Avec garanties

```tsx
import { TrustpilotBadge, GoogleReviewsBadge } from "./components/TrustBadges";

function PricingCard({ plan }) {
  return (
    <div className="p-8 bg-neutral-900 rounded-2xl">
      <h3 className="text-2xl text-white mb-2">{plan.name}</h3>
      <div className="text-4xl text-mint mb-6">{plan.price}€</div>
      
      {/* Features list */}
      <ul className="mb-6">
        {plan.features.map(feature => (
          <li key={feature}>✓ {feature}</li>
        ))}
      </ul>
      
      {/* Trust badges for premium plan */}
      {plan.premium && (
        <div className="mb-6 p-4 bg-mint/5 rounded-lg border border-mint/20">
          <p className="text-sm text-neutral-400 mb-3">Recommandé par :</p>
          <div className="flex flex-col gap-2">
            <TrustpilotBadge />
            <GoogleReviewsBadge />
          </div>
        </div>
      )}
      
      <Button>Choisir ce plan</Button>
    </div>
  );
}
```

---

## 10. CaseStudy Detail - Avec social share

```tsx
import { SocialShare } from "./components/SocialShare";
import { ViewCounter } from "./components/ViewCounter";

function CaseStudyPage({ caseStudy }) {
  return (
    <article className="max-w-4xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Badge>{caseStudy.category}</Badge>
          <ViewCounter views={caseStudy.views} variant="badge" />
        </div>
        
        <h1 className="text-5xl text-white mb-6">{caseStudy.title}</h1>
        <p className="text-xl text-neutral-400 mb-8">{caseStudy.excerpt}</p>
        
        {/* Social Share */}
        <SocialShare
          title={caseStudy.title}
          description={caseStudy.excerpt}
          hashtags={caseStudy.tags}
          contentType="case-study"
        />
      </div>
      
      {/* Content */}
      <div dangerouslySetInnerHTML={{ __html: caseStudy.content }} />
      
      {/* Bottom social share */}
      <div className="mt-12 pt-8 border-t border-neutral-800">
        <p className="text-neutral-400 mb-4">Projet intéressant ? Partagez-le :</p>
        <SocialShare
          title={caseStudy.title}
          contentType="case-study"
        />
      </div>
    </article>
  );
}
```

---

## 🎨 Conseils de design

### Placement stratégique

1. **Above the fold** (Hero) : TrustBadges compact
2. **Mid-page** (Stats) : TrustBadges horizontal
3. **Sidebar** : TrustBadges vertical
4. **Footer** : TrustBadges compact (✅ déjà fait)
5. **Article header** : ViewCounter badge
6. **Article footer** : SocialShare

### Combinaisons recommandées

```tsx
// Hero moderne
<TrustBadges variant="compact" showAll={false} />

// Section dédiée confiance
<TrustBadges variant="horizontal" showAll={true} />
<div className="flex gap-4 mt-6">
  <TrustpilotBadge />
  <GoogleReviewsBadge />
</div>

// Blog/Article
<ViewCounter variant="badge" />
<ReadingTime text={content} />
<SocialShare title={title} />

// Stats dashboard
<ViewStatsGrid totalViews={X} monthlyViews={Y} weeklyViews={Z} />
<AnimatedViewCount views={total} />
```

### Responsive tips

```tsx
// Mobile: Compact badges
<div className="flex sm:hidden">
  <TrustBadges variant="compact" showAll={false} />
</div>

// Desktop: Horizontal badges
<div className="hidden sm:block">
  <TrustBadges variant="horizontal" showAll={true} />
</div>
```

---

## ⚡ Quick Wins

### 1. Ajouter badges dans Hero (2 min)
```tsx
import { TrustBadges } from "./components/TrustBadges";
// Ajouter après le titre principal
<TrustBadges variant="compact" showAll={false} />
```

### 2. Ajouter stats dans About (3 min)
```tsx
import { TrustBadges } from "./components/TrustBadges";
// Ajouter section dédiée
<section>
  <h2>En chiffres</h2>
  <TrustBadges variant="horizontal" showAll={true} />
</section>
```

### 3. Améliorer articles (5 min)
Déjà fait ✅ dans BlogPostPage avec SocialShare + ViewCounter

---

**Créé le : 7 novembre 2024**  
**Tous les exemples sont prêts à copier-coller !**
