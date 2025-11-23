import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BlogPostCard, BlogPost } from "../blog/BlogPostCard";
import { Button } from "../ui/button";
import { BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { useTranslation } from "../../utils/i18n/useTranslation";

interface BlogPreviewSectionProps {
  onNavigate: (page: "blog") => void;
}

export function BlogPreviewSection({ onNavigate }: BlogPreviewSectionProps) {
  const { language, t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [language]);

  const fetchPosts = async () => {
    try {
      // Utiliser le blogService avec fallback local
      const { fetchBlogPosts } = await import("../../utils/blogService");
      const { posts: loadedPosts, mode } = await fetchBlogPosts(language);
      
      console.log(`âœ… Blog preview loaded in ${mode} mode:`, loadedPosts.length);
      
      // Get latest 3 published posts
      const publishedPosts = loadedPosts
        .filter((post: BlogPost) => post.status === "published")
        .slice(0, 3);
      setPosts(publishedPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Only show section if there are published posts
  if (loading || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-[#0C0C0C] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#CCFF00]/5 to-transparent" />
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CCFF00]/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-[#CCFF00]" />
            <span className="text-sm text-[#CCFF00]">{t('blog.hero.title')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl text-white mb-4">
            {t('blog.latest.title')}
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            {t('blog.latest.subtitle')}
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <BlogPostCard post={post} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            onClick={() => onNavigate("blog")}
            size="lg"
            className="bg-[#CCFF00] text-[#0C0C0C] hover:bg-[#CCFF00]/90 group"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            {t('blog.latest.viewAll')}
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
