import { motion } from "motion/react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Calendar, Clock, ArrowRight, Tag, Eye } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ViewCounter } from "../ViewCounter";

export interface BlogPost {
  id: string;
  title: string;
  title_fr?: string;
  title_en?: string;
  slug: string;
  slug_fr?: string;
  slug_en?: string;
  excerpt: string;
  excerpt_fr?: string;
  excerpt_en?: string;
  content: string;
  content_fr?: string;
  content_en?: string;
  coverImage?: string;
  category: "development" | "design" | "business" | string;
  category_fr?: string;
  category_en?: string;
  tags: string[];
  tags_fr?: string[];
  tags_en?: string[];
  readTime: number;
  readTime_fr?: number;
  readTime_en?: number;
  publishedAt: string;
  status: "draft" | "published";
  views?: number;
  author?: string;
}

interface BlogPostCardProps {
  post: BlogPost;
  onClick?: () => void;
  variant?: "default" | "compact" | "featured";
}

export function BlogPostCard({ post, onClick, variant = "default" }: BlogPostCardProps) {
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

  // Normaliser la catégorie et ajouter un fallback
  const normalizedCategory = post.category?.toLowerCase() || "development";
  const config = categoryConfig[post.category] || 
                 categoryConfig[normalizedCategory] || 
                 { label: post.category || "Article", color: "#00FFC2" };

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        onClick={onClick}
        className="cursor-pointer"
      >
        <Card className="bg-white/5 border-white/10 hover:bg-white/[0.07] hover:border-[#00FFC2]/30 transition-all overflow-hidden">
          <div className="p-4">
            <div className="flex items-start gap-3">
              {post.coverImage && (
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    sizes="80px"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <Badge
                  className="mb-2"
                  style={{ backgroundColor: `${config.color}20`, color: config.color, border: `1px solid ${config.color}40` }}
                >
                  {config.label}
                </Badge>
                <h3 className="text-white mb-1 line-clamp-2">{post.title}</h3>
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                  {post.views && post.views > 0 && (
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        onClick={onClick}
        className="cursor-pointer"
      >
        <Card className="bg-gradient-to-br from-white/10 to-white/5 border-[#00FFC2]/20 hover:border-[#00FFC2]/40 transition-all overflow-hidden">
          {post.coverImage && (
            <div className="relative h-64 overflow-hidden">
              <ImageWithFallback
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <Badge
                className="absolute top-4 left-4"
                style={{ backgroundColor: `${config.color}`, color: '#0C0C0C' }}
              >
                ⭐ Article Vedette
              </Badge>
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="outline"
                style={{ borderColor: `${config.color}40`, color: config.color }}
              >
                {config.label}
              </Badge>
              {post.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} className="bg-white/5 text-white/60 border-white/10">
                  {tag}
                </Badge>
              ))}
            </div>
            <h2 className="text-2xl text-white mb-3">{post.title}</h2>
            <p className="text-white/60 mb-4 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-white/40">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime} min de lecture
                </span>
                {post.views && post.views > 0 && (
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.views}
                  </span>
                )}
              </div>
              <motion.div
                className="flex items-center gap-2 text-[#00FFC2]"
                whileHover={{ x: 5 }}
              >
                <span className="text-sm">Lire</span>
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <Card className="bg-white/5 border-white/10 hover:bg-white/[0.07] hover:border-[#00FFC2]/30 transition-all overflow-hidden h-full flex flex-col">
        {post.coverImage && (
          <div className="relative h-48 overflow-hidden">
            <ImageWithFallback
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Badge
              className="absolute top-3 right-3"
              style={{ backgroundColor: `${config.color}20`, color: config.color, border: `1px solid ${config.color}40` }}
            >
              {config.label}
            </Badge>
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          {!post.coverImage && (
            <Badge
              className="mb-3 w-fit"
              style={{ backgroundColor: `${config.color}20`, color: config.color, border: `1px solid ${config.color}40` }}
            >
              {config.label}
            </Badge>
          )}
          <h3 className="text-xl text-white mb-2 line-clamp-2 group-hover:text-[#00FFC2] transition-colors">
            {post.title}
          </h3>
          <p className="text-white/60 text-sm mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} className="bg-white/5 text-white/50 border-white/10 text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(post.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime} min
              </span>
              {post.views && post.views > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {post.views > 999 ? `${(post.views / 1000).toFixed(1)}k` : post.views}
                </span>
              )}
            </div>
            <motion.div
              className="flex items-center gap-1 text-[#00FFC2] text-sm opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ x: 3 }}
            >
              <span>Lire</span>
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
