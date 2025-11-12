import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { contentService, type BlogPost } from "../../services/contentService";
import { BlogDialog } from "./BlogDialog";

export function BlogTab() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [statusFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await contentService.getBlogPosts(statusFilter);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Erreur lors du chargement des articles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

    try {
      await contentService.deleteBlogPost(postId);
      toast.success("Article supprimé");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const filteredPosts = posts.filter(post => {
    const search = searchTerm.toLowerCase();
    return (
      post.title_fr?.toLowerCase().includes(search) ||
      post.title_en?.toLowerCase().includes(search) ||
      post.category_fr?.toLowerCase().includes(search) ||
      post.tags_fr?.some(tag => tag?.toLowerCase().includes(search))
    );
  });

  const statusColors = {
    draft: "bg-gray-500/20 text-gray-400",
    published: "bg-green-500/20 text-green-400"
  };

  const statusLabels = {
    draft: "Brouillon",
    published: "Publié"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            Articles de Blog
          </h3>
          <p className="text-sm text-white/60">
            {posts.length} article{posts.length > 1 ? "s" : ""}
          </p>
        </div>
        
        <Button
          onClick={() => {
            setSelectedPost(null);
            setDialogOpen(true);
          }}
          className="bg-purple-500 text-white hover:bg-purple-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Article
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un article..."
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={statusFilter === "all" ? "default" : "ghost"}
            onClick={() => setStatusFilter("all")}
            className={statusFilter === "all" ? "bg-purple-500" : "text-white/60"}
          >
            Tous
          </Button>
          <Button
            size="sm"
            variant={statusFilter === "published" ? "default" : "ghost"}
            onClick={() => setStatusFilter("published")}
            className={statusFilter === "published" ? "bg-green-500" : "text-white/60"}
          >
            Publiés
          </Button>
          <Button
            size="sm"
            variant={statusFilter === "draft" ? "default" : "ghost"}
            onClick={() => setStatusFilter("draft")}
            className={statusFilter === "draft" ? "bg-gray-500" : "text-white/60"}
          >
            Brouillons
          </Button>
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16 text-white/60">
          <p>Aucun article trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all group"
            >
              {/* Cover Image */}
              <div className="relative h-48 bg-white/10 overflow-hidden">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title_fr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <FileText className="w-12 h-12" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className={statusColors[post.status]}>
                    {statusLabels[post.status]}
                  </Badge>
                </div>

                {/* Category Badge */}
                {post.category_fr && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-purple-500/80 text-white">
                      {post.category_fr}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-white mb-2 line-clamp-2">
                    {post.title_fr}
                  </h4>
                  <p className="text-sm text-white/60 line-clamp-2">
                    {post.excerpt_fr}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-white/40">
                  {post.publishedAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.publishedAt).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                  {post.readTime_fr && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime_fr}
                    </div>
                  )}
                  {post.views !== undefined && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags_fr?.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-purple-500/10 text-purple-400 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {post.tags_fr && post.tags_fr.length > 3 && (
                    <Badge className="bg-white/5 text-white/40 text-xs">
                      +{post.tags_fr.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedPost(post);
                      setDialogOpen(true);
                    }}
                    className="flex-1 text-white/70 hover:text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(post.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Blog Dialog */}
      <BlogDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
        onSuccess={() => {
          fetchPosts();
          setDialogOpen(false);
          setSelectedPost(null);
        }}
      />
    </div>
  );
}
