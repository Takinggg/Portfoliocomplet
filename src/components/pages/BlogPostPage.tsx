import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { BlogPost, BlogPostCard } from "../blog/BlogPostCard";
import { Breadcrumbs } from "../layout/Breadcrumbs";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  Tag,
  Eye,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { SocialShare } from "../SocialShare";
import { ViewCounter } from "../ViewCounter";
import { fetchBlogPost, fetchBlogPosts, incrementPostViews } from "../../utils/blogService";
import DOMPurify from "dompurify";

interface BlogPostPageProps {
  slug: string;
  onNavigate: (page: "blog" | "contact" | "booking") => void;
  onBlogPostClick?: (slug: string) => void;
}

export function BlogPostPage({ slug, onNavigate, onBlogPostClick }: BlogPostPageProps) {
  const { language } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    loadPost();
    // Track view
    handleIncrementViews();
  }, [slug, language]);

  const loadPost = async () => {
    setLoading(true);
    try {
      // Charger l'article
      const { post: fetchedPost, mode } = await fetchBlogPost(slug, language);
      setPost(fetchedPost);

      if (fetchedPost) {
        // Charger les articles liés
        const { posts: allPosts } = await fetchBlogPosts(language);
        const related = allPosts
          .filter((p: BlogPost) => 
            p.slug !== slug && 
            p.status === "published" &&
            (p.category === fetchedPost.category || 
             p.tags.some((tag: string) => fetchedPost.tags.includes(tag)))
          )
          .slice(0, 3);
        setRelatedPosts(related);
        
        console.log(`✅ Article chargé (${mode}): ${fetchedPost.title}`);
      }
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrementViews = async () => {
    try {
      await incrementPostViews(slug);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = post?.title || "";

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    if (platform === "link") {
      const { copyToClipboard } = await import("../../utils/clipboardHelper");
      await copyToClipboard(url, "Lien copié dans le presse-papier !");
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const categoryConfig: Record<string, { label: string; color: string }> = {
    development: { label: "Développement", color: "#00FFC2" },
    design: { label: "Design", color: "#00D9A6" },
    business: { label: "Business", color: "#00B38A" },
    // Support pour catégories en français (mode local)
    "Développement": { label: "Développement", color: "#00FFC2" },
    "TypeScript": { label: "TypeScript", color: "#3178C6" },
    "Design": { label: "Design", color: "#00D9A6" },
    "Performance": { label: "Performance", color: "#FF6B6B" },
    "React": { label: "React", color: "#61DAFB" },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-[#00FFC2] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-white/60">Chargement de l'article...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center py-20">
            <h1 className="text-3xl text-white mb-4">Article introuvable</h1>
            <p className="text-white/60 mb-8">Cet article n'existe pas ou a été supprimé.</p>
            <Button
              onClick={() => onNavigate("blog")}
              className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au blog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Normaliser la catégorie et ajouter un fallback
  const normalizedCategory = post.category?.toLowerCase() || "development";
  const config = categoryConfig[post.category] || 
                 categoryConfig[normalizedCategory] || 
                 { label: post.category || "Article", color: "#00FFC2" };

  return (
    <div className="min-h-screen bg-[#0C0C0C] pt-24 pb-20">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate("blog")}
          className="text-white/60 hover:text-white hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au blog
        </Button>
      </div>

      <article className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: "Accueil", onClick: () => onNavigate("blog") },
              { label: "Blog", onClick: () => onNavigate("blog") },
              { label: post.title, isActive: true }
            ]}
          />
          
          <div className="flex items-center gap-3 mb-6">
            <Badge
              style={{
                backgroundColor: `${config.color}20`,
                color: config.color,
                border: `1px solid ${config.color}40`,
              }}
            >
              {config.label}
            </Badge>
            <div className="flex items-center gap-4 text-sm text-white/40">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime} min de lecture
              </span>
              {post.views && (
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.views} vues
                </span>
              )}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-white/60 mb-6">{post.excerpt}</p>

          {/* Tags & View Counter */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-white/5 text-white/50 border-white/10"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {post.views && post.views > 0 && (
              <ViewCounter views={post.views} variant="badge" animated={false} />
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`${
                  isBookmarked
                    ? "bg-[#00FFC2]/20 border-[#00FFC2] text-[#00FFC2]"
                    : "bg-white/5 border-white/10 text-white/60"
                } hover:bg-white/10`}
              >
                <Bookmark
                  className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-current" : ""}`}
                />
                {isBookmarked ? "Sauvegardé" : "Sauvegarder"}
              </Button>
            </div>
            
            {/* Social Share Buttons */}
            <SocialShare
              title={post.title}
              description={post.excerpt}
              hashtags={post.tags}
              contentType="blog"
            />
          </div>
        </motion.div>

        {/* Cover Image */}
        {post.coverImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 rounded-2xl overflow-hidden"
          >
            <ImageWithFallback
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto"
              priority={true}
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none mb-12"
        >
          <div
            className="text-white/80 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(post.content, {
                ALLOWED_TAGS: [
                  'p', 'br', 'strong', 'em', 'u', 's', 'a', 'img',
                  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                  'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
                  'table', 'thead', 'tbody', 'tr', 'th', 'td',
                  'div', 'span', 'hr'
                ],
                ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'],
                ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
              })
            }}
          />
        </motion.div>

        <Separator className="my-12 bg-white/10" />

        {/* Share Again at Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <div className="text-sm text-neutral-400 mb-3">Article utile ? Partagez-le :</div>
          <SocialShare
            title={post.title}
            description={post.excerpt}
            hashtags={post.tags}
            contentType="blog"
          />
        </motion.div>

        <Separator className="my-12 bg-white/10" />

        {/* Author CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#00FFC2]/10 to-transparent border border-[#00FFC2]/20 rounded-2xl p-8 mb-12"
        >
          <h3 className="text-2xl text-white mb-3">Besoin d'aide sur ce sujet ?</h3>
          <p className="text-white/60 mb-6">
            Je suis disponible pour des missions freelance. Discutons de votre
            projet !
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => onNavigate("contact")}
              className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
            >
              Me contacter
            </Button>
            <Button
              onClick={() => onNavigate("booking")}
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              Réserver un appel
            </Button>
          </div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl text-white mb-6">Articles similaires</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 3).map((relatedPost) => (
                <BlogPostCard
                  key={relatedPost.id}
                  post={relatedPost}
                  variant="compact"
                  onClick={() => onBlogPostClick?.(relatedPost.slug)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </article>
    </div>
  );
}
