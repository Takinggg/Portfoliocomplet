import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { Wifi, WifiOff } from "lucide-react";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { GridSkeleton, BlogPostCardSkeleton, PageHeaderSkeleton } from "../ui/loading-skeletons";
import { PageTransition } from "../PageTransition";
import { fetchBlogPosts, BlogServiceMode } from "../../utils/blogService";
import { fetchWithCache } from "../../utils/apiCache";
import type { BlogPost as LegacyBlogPost } from "../blog/BlogPostCard";
import type { BlogPost as RedesignBlogPost } from "../../redesign/types";
import { BlogRedesignPage } from "../../redesign/components/pages/BlogPage";

interface BlogPageProps {
  onBlogPostClick: (slug: string) => void;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1920&auto=format&fit=crop";
const FALLBACK_EXCERPT = "Article en préparation. Revenez bientôt pour découvrir nos dernières analyses.";
const FALLBACK_CATEGORY = "Insights";

const selectLocalized = (post: LegacyBlogPost, field: "title" | "excerpt" | "slug" | "category" | "tags", language: string) => {
  const suffix = language === "en" ? "_en" : "_fr";
  const localizedKey = `${field}${suffix}` as keyof LegacyBlogPost;
  const baseValue = post[field as keyof LegacyBlogPost];
  const localizedValue = post[localizedKey];
  return (localizedValue as any) || baseValue;
};

const coerceTags = (post: LegacyBlogPost, language: string, fallbackCategory: string): string[] => {
  const tagsCandidate = selectLocalized(post, "tags", language) as unknown;
  if (Array.isArray(tagsCandidate) && tagsCandidate.length) {
    return tagsCandidate.map((tag) => String(tag));
  }
  if (Array.isArray(post.tags) && post.tags.length) {
    return post.tags;
  }
  return [fallbackCategory];
};

const mapPostsToRedesign = (posts: LegacyBlogPost[], language: string): RedesignBlogPost[] =>
  posts.map((post, index) => {
    const title = (selectLocalized(post, "title", language) as string) || post.title || `Article ${index + 1}`;
    const excerpt = (selectLocalized(post, "excerpt", language) as string) || post.excerpt || FALLBACK_EXCERPT;
    const slug = (selectLocalized(post, "slug", language) as string) || post.slug || `${post.id}`;
    const category =
      (selectLocalized(post, "category", language) as string) ||
      post.category ||
      FALLBACK_CATEGORY;
    const coverImage = (post.coverImage && post.coverImage.length > 5) ? post.coverImage : FALLBACK_IMAGE;
    const readTime = post.readTime || Math.round((post.readTime_en || post.readTime_fr || 5));
    const date = post.publishedAt || new Date().toISOString();
    const tags = coerceTags(post, language, category);

    return {
      id: post.id,
      title,
      excerpt,
      coverImage,
      date,
      readTime,
      category,
      tags,
      slug,
      content: undefined,
    };
  });

export function BlogPage({ onBlogPostClick }: BlogPageProps) {
  const { language } = useTranslation();
  const [posts, setPosts] = useState<LegacyBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<BlogServiceMode>("checking");

  useEffect(() => {
    loadPosts();
  }, [language]);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchWithCache(
        `blog_posts_${language}`,
        async () => fetchBlogPosts(language),
        5 * 60 * 1000
      );

      const publishedPosts = result.posts.filter((post: LegacyBlogPost) => post.status === "published");
      setPosts(publishedPosts);
      setMode(result.mode);
    } catch (error) {
      console.error("Error loading posts:", error);
      setPosts([]);
      setMode("local");
    } finally {
      setLoading(false);
    }
  }, [language]);

  const handlePostClick = useCallback(
    (slug: string) => {
      onBlogPostClick(slug);
    },
    [onBlogPostClick]
  );

  const mappedPosts = useMemo(() => mapPostsToRedesign(posts, language), [posts, language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <PageHeaderSkeleton />
          <GridSkeleton count={6} columns={3} Component={BlogPostCardSkeleton} />
        </div>
      </div>
    );
  }

  return (
    <PageTransition show={!loading} mode="fade">
      <div className="bg-[#050505] text-white min-h-screen">
        <div className="max-w-5xl mx-auto px-6 pt-24">
          {mode === "local" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-yellow-200 mb-2">Mode Local Actif</h3>
                  <p className="text-sm text-yellow-200/80 mb-3">
                    Le blog utilise des données locales car le serveur Supabase n'est pas accessible. Déployez le serveur pour
                    activer les contenus dynamiques.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="/server-diagnostic"
                      className="text-sm bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition-colors inline-block"
                    >
                      Déployer le serveur
                    </a>
                    <button
                      onClick={() => window.location.reload()}
                      className="text-sm bg-white/10 text-white px-4 py-2 rounded hover:bg-white/20 transition-colors"
                    >
                      Réessayer
                    </button>
                    <span className="flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-yellow-200/70">
                      <WifiOff className="h-3 w-3" />
                      Local Mode
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <BlogRedesignPage posts={mappedPosts} onPostClick={handlePostClick} />
      </div>
    </PageTransition>
  );
}
