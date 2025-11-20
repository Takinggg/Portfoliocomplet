import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { BlogPostCard, BlogPost } from "../blog/BlogPostCard";
import { BlogFilters } from "../blog/BlogFilters";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { BookOpen, TrendingUp, Sparkles, FileText, Wifi, WifiOff } from "lucide-react";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { GridSkeleton, BlogPostCardSkeleton, PageHeaderSkeleton } from "../ui/loading-skeletons";
import { PageTransition } from "../PageTransition";
import { fetchBlogPosts, BlogServiceMode } from "../../utils/blogService";
import { fetchWithCache } from "../../utils/apiCache";

interface BlogPageProps {
  onBlogPostClick: (slug: string) => void;
}

export function BlogPage({ onBlogPostClick }: BlogPageProps) {
  const { t, language } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mode, setMode] = useState<BlogServiceMode>("checking");

  useEffect(() => {
    loadPosts();
  }, [language]);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      // Use cache for blog posts (5 minutes cache per language)
      const result = await fetchWithCache(
        `blog_posts_${language}`,
        async () => {
          return await fetchBlogPosts(language);
        },
        5 * 60 * 1000 // 5 minutes
      );
      
      // Only show published posts for users
      const publishedPosts = result.posts.filter(
        (post: BlogPost) => post.status === "published"
      );
      
      setPosts(publishedPosts);
      setMode(result.mode);
      
      if (result.mode === "local") {
        console.log(`📍 Mode local activé: ${publishedPosts.length} articles`);
      } else {
        console.log(`✅ Serveur connecté: ${publishedPosts.length} articles`);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      setPosts([]);
      setMode("local");
    } finally {
      setLoading(false);
    }
  }, [language]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => post.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory && post.category !== selectedCategory) {
        return false;
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every(tag => post.tags.includes(tag));
        if (!hasAllTags) return false;
      }

      return true;
    });
  }, [posts, searchQuery, selectedCategory, selectedTags]);

  const handleTagClick = useCallback((tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  const handlePostClick = useCallback((slug: string) => {
    onBlogPostClick(slug);
  }, [onBlogPostClick]);

  const featuredPost = useMemo(() => filteredPosts[0], [filteredPosts]);
  const recentPosts = useMemo(() => filteredPosts.slice(1, 4), [filteredPosts]);
  const regularPosts = useMemo(() => filteredPosts.slice(4), [filteredPosts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <PageHeaderSkeleton />
          <GridSkeleton count={6} columns={3} Component={BlogPostCardSkeleton} />
        </div>
      </div>
    );
  }

  return (
    <PageTransition show={!loading} mode="fade">
      <div className="min-h-screen bg-[#0C0C0C] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Mode Local Warning */}
          {mode === "local" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-yellow-200 mb-2">
                    Mode Local Actif
                  </h3>
                  <p className="text-sm text-yellow-200/80 mb-3">
                    Le blog utilise des données locales car le serveur Supabase n'est pas accessible.
                    Pour synchroniser avec Supabase, déployez le serveur complet et créez les données.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a 
                      href="/server-diagnostic" 
                      className="text-sm bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition-colors inline-block"
                    >
                      Déployer le Serveur
                    </a>
                    <button 
                      onClick={() => window.location.reload()}
                      className="text-sm bg-white/10 text-white px-4 py-2 rounded hover:bg-white/20 transition-colors"
                    >
                      Réessayer
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-[#00FFC2]/10 border border-[#00FFC2]/20 rounded-full px-4 py-2">
                <Sparkles className="h-4 w-4 text-[#00FFC2]" />
                <span className="text-sm text-[#00FFC2]">{t('blog.hero.title')}</span>
              </div>
              {mode === "local" && (
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Mode Local
                </Badge>
              )}
              {mode === "server" && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Wifi className="h-3 w-3 mr-1" />
                  Supabase ✓
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              {t('blog.hero.title')}
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              {t('blog.hero.subtitle')}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-[#00FFC2] mb-2">
                <BookOpen className="h-5 w-5" />
                <span className="text-3xl">{posts.length}</span>
              </div>
              <p className="text-white/60 text-sm">{t('blog.stats.articlesPublished')}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-[#00D9A6] mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-3xl">{allTags.length}</span>
              </div>
              <p className="text-white/60 text-sm">{t('blog.stats.topics')}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-[#00B38A] mb-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-3xl">{Math.floor(posts.reduce((acc, p) => acc + p.readTime, 0) / 60)}h</span>
              </div>
              <p className="text-white/60 text-sm">{t('blog.stats.readingTime')}</p>
            </div>
          </motion.div>

          <div className="space-y-12">
            {/* Filters */}
            <BlogFilters
              searchQuery={searchQuery}
              onSearch={handleSearchChange}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              selectedTags={selectedTags}
              onTagClick={handleTagClick}
              availableTags={allTags}
            />

            {/* Featured Post */}
            {featuredPost && !searchQuery && !selectedCategory && selectedTags.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="h-5 w-5 text-[#00FFC2]" />
                  <h2 className="text-2xl text-white font-bold">{t('blog.sections.featured')}</h2>
                </div>
                <BlogPostCard
                  post={featuredPost}
                  variant="featured"
                  onClick={() => handlePostClick(featuredPost.slug)}
                />
              </motion.div>
            )}

            {/* All Posts Grid */}
            {filteredPosts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl text-white font-bold">
                    {searchQuery || selectedCategory || selectedTags.length > 0 
                      ? t('blog.sections.all') 
                      : t('blog.sections.recent')}
                    <Badge className="ml-3 bg-white/5 text-white/60 border-white/10">
                      {filteredPosts.length}
                    </Badge>
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(searchQuery || selectedCategory || selectedTags.length > 0 ? filteredPosts : filteredPosts.slice(1)).map((post, index) => (
                    <BlogPostCard
                      key={`${post.id}-${post.slug}-${index}`}
                      post={post}
                      variant="default"
                      onClick={() => handlePostClick(post.slug)}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8 py-20"
              >
                {/* Empty State Message */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-12 w-12 text-white/40" />
                  </div>
                  <h3 className="text-2xl text-white mb-3">
                    {posts.length === 0 ? t('blog.empty.noArticles') : t('blog.empty.noResults')}
                  </h3>
                  <p className="text-white/60 mb-8 text-lg">
                    {posts.length === 0 ? t('blog.empty.initialize') : t('blog.empty.tryAgain')}
                  </p>
                  {posts.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory(null);
                          setSelectedTags([]);
                        }}
                        className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90 px-8 py-6 text-lg"
                      >
                        {t('blog.filters.clearAll')}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
