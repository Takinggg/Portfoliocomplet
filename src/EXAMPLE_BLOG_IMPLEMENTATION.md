# 📖 Exemple Complet : BlogPostPage avec toutes les optimisations

Voici un exemple réel et complet d'implémentation de `BlogPostPage.tsx` avec **toutes** les nouvelles optimisations.

## ✅ Features implémentées dans cet exemple

- ✅ SEO meta tags dynamiques
- ✅ Breadcrumbs navigation
- ✅ Reading time
- ✅ Loading skeletons
- ✅ Social share
- ✅ Analytics tracking
- ✅ Lazy loaded images
- ✅ Structured data (JSON-LD)
- ✅ Error handling

---

## 📄 Code Complet

```tsx
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";
import { SEO } from "../SEO";
import { Breadcrumbs } from "../layout/Breadcrumbs";
import { SocialShare } from "../SocialShare";
import { ReadingTime, calculateReadingTime } from "../blog/ReadingTime";
import { BlogPostCardSkeleton } from "../ui/loading-skeletons";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { getBlogPostSEO, getCanonicalURL, getOGImageURL } from "../../utils/seoConfig";
import { analytics } from "../../utils/analytics";

interface BlogPostPageProps {
  slug: string;
  onNavigate: (page: string) => void;
  onBlogPostClick: (slug: string) => void;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  readingTime?: number;
}

export function BlogPostPage({ slug, onNavigate, onBlogPostClick }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    loadBlogPost();
  }, [slug]);

  const loadBlogPost = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger l'article
      const response = await fetch(`/api/blog/${slug}`);
      
      if (!response.ok) {
        throw new Error("Article non trouvé");
      }

      const data = await response.json();
      
      // Calculer le temps de lecture
      const readingTime = calculateReadingTime(data.content);
      
      setPost({ ...data, readingTime });

      // Charger les articles liés
      const relatedResponse = await fetch(`/api/blog/${slug}/related`);
      if (relatedResponse.ok) {
        const related = await relatedResponse.json();
        setRelatedPosts(related);
      }

      // Track blog read avec analytics
      analytics.trackBlogRead(data.title, readingTime);

    } catch (err) {
      console.error("Error loading blog post:", err);
      setError(err instanceof Error ? err.message : "Erreur de chargement");
      analytics.trackError("Blog Load Error", err instanceof Error ? err.message : "Unknown");
    } finally {
      setLoading(false);
    }
  };

  // Loading state avec skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <BlogPostCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Article non trouvé</h1>
            <p className="text-neutral-400 mb-8">{error || "Cet article n'existe pas."}</p>
            <Button onClick={() => onNavigate("blog")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au blog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Generate SEO config
  const seoConfig = getBlogPostSEO({
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    tags: post.tags,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    slug: post.slug,
  });

  // Structured data (JSON-LD) pour Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": getOGImageURL(post.coverImage),
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Portfolio Freelance",
      "logo": {
        "@type": "ImageObject",
        "url": getOGImageURL("/logo.png")
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": getCanonicalURL(`/blog/${post.slug}`)
    }
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <SEO
        title={seoConfig.title}
        description={seoConfig.description}
        ogImage={getOGImageURL(seoConfig.ogImage || "")}
        ogType="article"
        keywords={seoConfig.keywords}
        canonical={getCanonicalURL(`/blog/${post.slug}`)}
        publishedTime={post.publishedAt}
        modifiedTime={post.updatedAt}
      />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-black text-white">
        <article className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumbs */}
              <Breadcrumbs
                items={[
                  { label: "Accueil", onClick: () => onNavigate("home") },
                  { label: "Blog", onClick: () => onNavigate("blog") },
                  { label: post.title, isActive: true }
                ]}
              />

              {/* Back button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => onNavigate("blog")}
                className="flex items-center gap-2 text-neutral-400 hover:text-mint transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour au blog</span>
              </motion.button>

              {/* Article Header */}
              <header className="mb-12">
                {/* Category badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/10 border border-mint/30 text-mint text-sm mb-6"
                >
                  {post.category}
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-6xl font-bold mb-6"
                >
                  {post.title}
                </motion.h1>

                {/* Meta info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap items-center gap-6 text-neutral-400"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </time>
                  </div>

                  <ReadingTime text={post.content} />
                </motion.div>
              </header>

              {/* Cover Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-12 rounded-3xl overflow-hidden"
              >
                <ImageWithFallback
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-[500px] object-cover"
                  priority // Image principale = priority
                />
              </motion.div>

              {/* Article Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="prose prose-invert prose-lg max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-3 mb-12"
                >
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-neutral-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Social Share */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-12 border-t border-neutral-800"
              >
                <SocialShare
                  title={post.title}
                  description={post.excerpt}
                  contentType="blog"
                  hashtags={post.tags}
                />
              </motion.div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-20 pt-20 border-t border-neutral-800"
                >
                  <h2 className="text-3xl font-bold mb-12">Articles similaires</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {relatedPosts.slice(0, 2).map((relatedPost) => (
                      <motion.div
                        key={relatedPost.id}
                        whileHover={{ y: -5 }}
                        onClick={() => {
                          onBlogPostClick(relatedPost.slug);
                          analytics.trackEvent({
                            action: "click",
                            category: "Related Post",
                            label: relatedPost.title,
                          });
                        }}
                        className="group cursor-pointer rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-mint/40 transition-all overflow-hidden"
                      >
                        <ImageWithFallback
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          className="w-full h-48 object-cover"
                        />
                        
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-mint transition-colors">
                            {relatedPost.title}
                          </h3>
                          <p className="text-neutral-400 text-sm line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
```

---

## 🎯 Ce que fait ce code

### 1. **SEO Optimal**
- Meta tags dynamiques (titre, description, OG, Twitter)
- Canonical URL
- Article metadata (date publication/modification)
- Structured data JSON-LD pour Google Rich Results

### 2. **UX Professionnel**
- Loading skeleton pendant chargement
- Breadcrumbs pour navigation
- Bouton retour au blog
- Temps de lecture affiché
- Images lazy loaded sauf cover (priority)

### 3. **Social & Engagement**
- Partage social en fin d'article
- Articles similaires
- Tags cliquables

### 4. **Analytics Complet**
- Track lecture article (avec temps)
- Track clics articles similaires
- Track erreurs de chargement

### 5. **Error Handling**
- État d'erreur avec message clair
- Fallback UI
- Analytics des erreurs

---

## 🔧 Adaptations Nécessaires

### 1. API Endpoints
Remplacer par vos vraies routes :
```tsx
const response = await fetch(`/api/blog/${slug}`);
// Devient :
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/${slug}`,
  {
    headers: {
      Authorization: `Bearer ${publicAnonKey}`,
    },
  }
);
```

### 2. Images URLs
Si images stockées dans Supabase Storage, utiliser signed URLs.

### 3. Domaine
Dans `/utils/seoConfig.ts`, remplacer :
```typescript
const domain = "https://votre-domaine-reel.com";
```

---

## 📊 Résultats Attendus

### Google Search Console
- ✅ Rich Results éligibles (Article)
- ✅ Breadcrumbs dans SERP
- ✅ Featured snippets possibles

### Social Media
- ✅ Belles cards sur Twitter/LinkedIn/Facebook
- ✅ Image cover visible
- ✅ Metadata correcte

### Analytics
- ✅ Temps de lecture moyen
- ✅ Articles les plus partagés
- ✅ Sources de trafic
- ✅ Taux de rebond par article

### Performance
- ✅ Lighthouse SEO > 95
- ✅ Accessibility > 95
- ✅ Best Practices > 95

---

## 🎨 Customisation

### Changer le style des breadcrumbs
Modifier `/components/layout/Breadcrumbs.tsx`

### Changer le layout des articles similaires
Grid 2 colonnes → Grid 3 colonnes :
```tsx
<div className="grid md:grid-cols-3 gap-8">
```

### Ajouter un CTA en fin d'article
```tsx
<div className="mt-12 p-8 rounded-2xl bg-mint/10 border border-mint/30">
  <h3 className="text-2xl font-bold mb-4">Besoin d'aide ?</h3>
  <Button onClick={() => onNavigate("contact")}>
    Me contacter
  </Button>
</div>
```

---

## ✅ Checklist Avant Production

- [ ] Analytics configuré et testé
- [ ] OG image créée (1200x630px)
- [ ] Domaine configuré dans seoConfig
- [ ] API routes ajustées
- [ ] Testé sur mobile/tablet/desktop
- [ ] Validé avec Facebook Debugger
- [ ] Validé avec Twitter Card Validator
- [ ] Score Lighthouse > 90
- [ ] Structured data validée ([Google Rich Results Test](https://search.google.com/test/rich-results))

---

**Vous pouvez maintenant appliquer ce pattern à toutes vos pages de contenu !** 🚀
