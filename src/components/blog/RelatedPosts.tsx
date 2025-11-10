import { motion } from "motion/react";
import { BlogPost, BlogPostCard } from "./BlogPostCard";
import { ArrowRight, Sparkles } from "lucide-react";

interface RelatedPostsProps {
  posts: BlogPost[];
  currentPostId: string;
  onPostClick: (slug: string) => void;
}

export function RelatedPosts({ posts, currentPostId, onPostClick }: RelatedPostsProps) {
  // Filter out current post
  const relatedPosts = posts.filter(post => post.id !== currentPostId).slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-20 pt-12 border-t border-white/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#00FFC2]/20 to-[#00D9A6]/20 border border-[#00FFC2]/30 rounded-lg">
              <Sparkles className="h-5 w-5 text-[#00FFC2]" />
            </div>
            <div>
              <h2 className="text-2xl text-white">Articles similaires</h2>
              <p className="text-sm text-white/40 mt-1">
                Continuez votre lecture avec ces articles recommandés
              </p>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BlogPostCard
                post={post}
                onClick={() => onPostClick(post.slug)}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 text-[#00FFC2] hover:text-[#00D9A6] transition-colors group"
          >
            <span>Voir tous les articles</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
