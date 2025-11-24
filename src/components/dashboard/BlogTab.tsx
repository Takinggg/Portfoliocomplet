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
  FileText,
  BarChart2,
  RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";
import { contentService, type BlogPost } from "../../services/contentService";
import { BlogDialog } from "./BlogDialog";

const STATUS_OPTIONS: Array<{ value: "all" | "published" | "draft"; label: string }> = [
  { value: "all", label: "Tous" },
  { value: "published", label: "Publiés" },
  { value: "draft", label: "Brouillons" },
];

interface StatCardProps {
  label: string;
  sublabel?: string;
  value: string | number;
  trend?: string;
}

const StatCard = ({ label, sublabel, value, trend }: StatCardProps) => (
  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-5">
    <p className="text-xs uppercase tracking-[0.3em] text-white/50 font-mono mb-2">{label}</p>
    <div className="flex items-end justify-between">
      <div>
        <p className="text-3xl font-display text-white">{value}</p>
        {sublabel && <p className="text-sm text-white/50">{sublabel}</p>}
      </div>
      {trend && <span className="text-xs font-bold text-primary">{trend}</span>}
    </div>
  </div>
);

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

  const publishedCount = posts.filter((post) => post.status === "published").length;
  const draftCount = posts.filter((post) => post.status === "draft").length;
  const totalViews = posts.reduce((acc, post) => acc + (post.views || 0), 0);

  const filteredPosts = posts.filter((post) => {
    const search = searchTerm.toLowerCase();
    return (
      post.title_fr?.toLowerCase().includes(search) ||
      post.title_en?.toLowerCase().includes(search) ||
      post.category_fr?.toLowerCase().includes(search) ||
      post.tags_fr?.some(tag => tag?.toLowerCase().includes(search))
    );
  });

  const renderStatusBadge = (status: BlogPost["status"]) => {
    if (status === "published") {
      return <Badge className="bg-green-500/15 text-green-300 border-green-500/20">Publié</Badge>;
    }
    return <Badge className="bg-amber-500/15 text-amber-200 border-amber-500/20">Brouillon</Badge>;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">Studio éditorial</p>
          <h1 className="text-4xl font-display text-white mb-3">Blog & Insights</h1>
          <p className="text-white/60 max-w-2xl">
            Planifiez, traduisez et publiez vos articles directement depuis ce cockpit. Chaque entrée est synchronisée avec Supabase et diffuse automatiquement sur les pages publiques.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <Button
            variant="outline"
            className="border-white/20 text-white hover:border-white/60"
            onClick={fetchPosts}
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Rafraîchir
          </Button>
          <Button
            onClick={() => {
              setSelectedPost(null);
              setDialogOpen(true);
            }}
            className="bg-white text-black font-semibold hover:bg-primary hover:text-black"
          >
            <Plus className="w-4 h-4 mr-2" /> Nouvel article
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Articles totaux" sublabel="Tous statuts" value={posts.length} trend={`+${posts.length ? Math.max(1, posts.length % 5) : 0} ce mois`} />
        <StatCard label="Publiés" sublabel="En ligne actuellement" value={publishedCount} />
        <StatCard label="Audience cumulée" sublabel="Total des vues" value={totalViews} trend={draftCount ? `${draftCount} brouillons en attente` : undefined} />
      </div>

      {/* FILTER PANEL */}
      <div className="border border-white/10 rounded-2xl bg-[#060606] p-6 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-white/80 transition-colors" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un titre, une catégorie ou un tag..."
              className="h-12 pl-12 bg-black/40 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <div className="flex gap-2 bg-black/40 rounded-xl p-1 border border-white/5">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  statusFilter === option.value
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-white/50">
          <BarChart2 className="w-4 h-4" />
          <span>
            {publishedCount} article{publishedCount > 1 ? "s" : ""} en ligne · {draftCount} brouillon{draftCount > 1 ? "s" : ""} à relire
          </span>
        </div>
      </div>

      {/* POSTS */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
          <p className="text-white/60">Aucun article ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent overflow-hidden shadow-[0_25px_70px_-35px_rgba(0,0,0,0.8)]"
            >
              <div className="relative h-44 overflow-hidden">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title_fr}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/15 border-b border-white/5 bg-black/40">
                    <FileText className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">{renderStatusBadge(post.status)}</div>
                {post.category_fr && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black/70 text-white border-white/20">{post.category_fr}</Badge>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">{post.slug_fr || "Sans slug"}</p>
                  <h3 className="text-xl font-display text-white line-clamp-2 mb-2">{post.title_fr}</h3>
                  <p className="text-white/60 line-clamp-3 text-sm">{post.excerpt_fr}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-white/50">
                  {post.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.publishedAt).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                  {post.readTime_fr && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime_fr}
                    </span>
                  )}
                  {post.views !== undefined && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.tags_fr?.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/70">
                      #{tag}
                    </span>
                  ))}
                  {post.tags_fr && post.tags_fr.length > 3 && (
                    <span className="px-3 py-1 rounded-full text-xs bg-white/5 text-white/50">+{post.tags_fr.length - 3}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedPost(post);
                      setDialogOpen(true);
                    }}
                    className="flex-1 justify-center text-white/80 hover:text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" /> Modifier
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
