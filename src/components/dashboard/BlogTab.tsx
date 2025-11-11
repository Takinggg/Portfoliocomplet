import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Calendar,
  Clock,
  Tag,
  BookOpen,
  FileText,
  RefreshCw,
} from "lucide-react";
import { BlogPost } from "../blog/BlogPostCard";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { RichTextEditor } from "../blog/RichTextEditor";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { toast } from "sonner";

interface BlogTabProps {
  onRefresh?: () => void;
  loading?: boolean;
}

export function BlogTab({ onRefresh, loading = false }: BlogTabProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletePost, setDeletePost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Form state with multilingual support
  const [formData, setFormData] = useState({
    title_fr: "",
    title_en: "",
    slug: "",
    excerpt_fr: "",
    excerpt_en: "",
    content_fr: "",
    content_en: "",
    coverImage: "",
    category: "development" as "development" | "design" | "business",
    tags: [] as string[],
    status: "draft" as "draft" | "published",
  });
  const [tagInput, setTagInput] = useState("");
  const [editorLang, setEditorLang] = useState<"fr" | "en">("fr"); // Language tab for editor

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // ✅ Utiliser unifiedDataService.ts (Supabase uniquement, FULL DB)
      const { fetchBlogPosts } = await import("../../utils/unifiedDataService");
      
      // Charger les posts depuis Supabase (défaut: français)
      const loadedPosts = await fetchBlogPosts("fr");
      
      console.log(`✅ Blog posts chargés depuis Supabase:`, loadedPosts.length);
      
      setPosts(loadedPosts);
      
      if (loadedPosts.length === 0) {
        toast.info("Aucun article trouvé. Créez votre premier article avec le bouton '+' ci-dessus.", {
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error("❌ Erreur chargement posts:", error);
      toast.error(error.message || "Erreur lors du chargement des articles");
      setPosts([]);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchPosts();
      toast.success("Articles actualisés !");
    } catch (error) {
      toast.error("Erreur lors de l'actualisation");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const calculateReadTime = (content: string) => {
    if (!content) return 1; // Default to 1 minute if no content
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute) || 1;
  };

  const handleTitleChange = (title: string, lang: "fr" | "en") => {
    const updates: any = {
      ...formData,
      [`title_${lang}`]: title,
    };
    // Auto-generate slug from French title
    if (lang === "fr" && !formData.slug) {
      updates.slug = generateSlug(title);
    }
    setFormData(updates);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async () => {
    if (!formData.title_fr || !formData.content_fr) {
      toast.error("Le titre et le contenu en français sont requis");
      return;
    }

    try {
      // ✅ NOUVEAU: Récupérer le token d'accès pour auth
      const { createClient } = await import("../../utils/supabase/client");
      const { createBlogPost, updateBlogPost } = await import("../../utils/unifiedDataService");
      
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        return;
      }

      const postData: any = {
        ...formData,
        readTime: calculateReadTime(formData.content_fr),
        publishedAt: editingPost?.publishedAt || new Date().toISOString(),
        // Legacy fields for backward compatibility
        title: formData.title_fr,
        excerpt: formData.excerpt_fr,
        content: formData.content_fr,
      };

      if (editingPost) {
        // Mise à jour
        await updateBlogPost(editingPost.id, postData, session.access_token);
        toast.success("Article mis à jour !");
      } else {
        // Création
        await createBlogPost(postData, session.access_token);
        toast.success("Article créé !");
      }
      
      setIsCreateOpen(false);
      setEditingPost(null);
      resetForm();
      await fetchPosts(); // Recharger la liste
    } catch (error: any) {
      console.error("❌ Error saving post:", error);
      toast.error(error.message || "Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // ✅ NOUVEAU: Utiliser unifiedDataService avec auth
      const { createClient } = await import("../../utils/supabase/client");
      const { deleteBlogPost } = await import("../../utils/unifiedDataService");
      
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        return;
      }

      await deleteBlogPost(id, session.access_token);
      toast.success("Article supprimé !");
      await fetchPosts(); // Recharger la liste
      setDeletePost(null);
    } catch (error: any) {
      console.error("❌ Error deleting post:", error);
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const resetForm = () => {
    setFormData({
      title_fr: "",
      title_en: "",
      slug: "",
      excerpt_fr: "",
      excerpt_en: "",
      content_fr: "",
      content_en: "",
      coverImage: "",
      category: "development",
      tags: [],
      status: "draft",
    });
    setTagInput("");
    setEditorLang("fr");
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title_fr: (post as any).title_fr || post.title || "",
      title_en: (post as any).title_en || post.title || "",
      slug: post.slug,
      excerpt_fr: (post as any).excerpt_fr || post.excerpt || "",
      excerpt_en: (post as any).excerpt_en || post.excerpt || "",
      content_fr: (post as any).content_fr || post.content || "",
      content_en: (post as any).content_en || post.content || "",
      coverImage: post.coverImage || "",
      category: post.category,
      tags: post.tags,
      status: post.status,
    });
    setIsCreateOpen(true);
  };

  const closeDialog = () => {
    setIsCreateOpen(false);
    setEditingPost(null);
    resetForm();
  };

  // Deduplicate posts by ID first
  const uniquePosts = posts.reduce((acc, post) => {
    // Check if we already have this post ID
    if (!acc.find(p => p.id === post.id)) {
      acc.push(post);
    }
    return acc;
  }, [] as BlogPost[]);

  const filteredPosts = uniquePosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status === "draft").length,
    totalViews: posts.reduce((acc, p) => acc + (p.views || 0), 0),
  };

  const categoryLabels = {
    development: "Développement",
    design: "Design",
    business: "Business",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl text-white mb-1">Gestion du Blog</h2>
          <p className="text-sm text-white/60">
            Créez et gérez vos articles de blog
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Actualiser
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setIsCreateOpen(true);
            }}
            className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Article
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00FFC2]/10 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-[#00FFC2]" />
            </div>
            <div>
              <p className="text-2xl text-white">{stats.total}</p>
              <p className="text-xs text-white/60">Total Articles</p>
            </div>
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl text-white">{stats.published}</p>
              <p className="text-xs text-white/60">Publiés</p>
            </div>
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl text-white">{stats.draft}</p>
              <p className="text-xs text-white/60">Brouillons</p>
            </div>
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl text-white">{stats.totalViews}</p>
              <p className="text-xs text-white/60">Vues Totales</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            type="text"
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="published">Publiés</SelectItem>
            <SelectItem value="draft">Brouillons</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredPosts.map((post, index) => (
            <motion.div
              key={`${post.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-white/5 border-white/10 hover:bg-white/[0.07] transition-all p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white text-lg">{(post as any).title_fr || post.title || "Sans titre"}</h3>
                          <Badge
                            variant={
                              post.status === "published" ? "default" : "outline"
                            }
                            className={
                              post.status === "published"
                                ? "bg-green-500/20 text-green-500 border-green-500/40"
                                : "bg-orange-500/20 text-orange-500 border-orange-500/40"
                            }
                          >
                            {post.status === "published" ? (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Publié
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Brouillon
                              </>
                            )}
                          </Badge>
                          <Badge className="bg-[#00FFC2]/20 text-[#00FFC2] border-[#00FFC2]/40">
                            {categoryLabels[post.category]}
                          </Badge>
                          {(post as any).title_en && (post as any).content_en && (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
                              🌍 EN
                            </Badge>
                          )}
                        </div>
                        <p className="text-white/60 text-sm mb-3 line-clamp-2">
                          {(post as any).excerpt_fr || post.excerpt || "Pas de résumé"}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.publishedAt).toLocaleDateString("fr-FR")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime} min
                          </span>
                          {post.views && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {post.views} vues
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {post.tags.length} tags
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {post.status === "published" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          window.open(`/blog/${post.slug}`, "_blank")
                        }
                        className="text-white/60 hover:text-white hover:bg-white/5"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(post)}
                      className="text-white/60 hover:text-white hover:bg-white/5"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeletePost(post)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">Aucun article trouvé</p>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={closeDialog}>
        <DialogContent className="bg-[#0C0C0C] border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Modifier l'article" : "Nouvel article"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {editingPost
                ? "Modifiez les informations de votre article"
                : "Créez un nouvel article pour votre blog"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Slug (commun pour toutes les langues) */}
            <div>
              <Label htmlFor="slug" className="text-white/80">
                Slug (URL)
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white"
                placeholder="slug-de-larticle"
              />
              <p className="text-xs text-white/40 mt-1">
                URL: /blog/{formData.slug || "slug-de-larticle"}
              </p>
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-white/80">
                  Catégorie
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(v: any) =>
                    setFormData({ ...formData, category: v })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Développement</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status" className="text-white/80">
                  Statut
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(v: any) =>
                    setFormData({ ...formData, status: v })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <Label htmlFor="coverImage" className="text-white/80">
                Image de couverture (URL)
              </Label>
              <Input
                id="coverImage"
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white"
                placeholder="https://..."
              />
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags" className="text-white/80">
                Tags
              </Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Ajouter un tag..."
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-[#00FFC2]/20 text-[#00FFC2] border-[#00FFC2]/40"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-[#00FFC2]/70"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mt-6">
              <p className="text-white/60 text-sm mb-4">
                🌍 Contenu multilingue - Remplissez le français (obligatoire) et l'anglais (optionnel)
              </p>

              {/* Language Tabs */}
              <Tabs value={editorLang} onValueChange={(v) => setEditorLang(v as "fr" | "en")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-4">
                  <TabsTrigger 
                    value="fr" 
                    className="data-[state=active]:bg-[#00FFC2] data-[state=active]:text-[#0C0C0C]"
                  >
                    🇫🇷 Français {!formData.title_fr && <span className="ml-1 text-red-400">*</span>}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="en" 
                    className="data-[state=active]:bg-[#00FFC2] data-[state=active]:text-[#0C0C0C]"
                  >
                    🇬🇧 English
                  </TabsTrigger>
                </TabsList>

                {/* French Content */}
                <TabsContent value="fr" className="space-y-4">
                  {/* Title FR */}
                  <div>
                    <Label htmlFor="title_fr" className="text-white/80">
                      Titre (Français) *
                    </Label>
                    <Input
                      id="title_fr"
                      value={formData.title_fr}
                      onChange={(e) => handleTitleChange(e.target.value, "fr")}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Titre de l'article en français"
                    />
                  </div>

                  {/* Excerpt FR */}
                  <div>
                    <Label htmlFor="excerpt_fr" className="text-white/80">
                      Résumé (Français)
                    </Label>
                    <Textarea
                      id="excerpt_fr"
                      value={formData.excerpt_fr}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt_fr: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Court résumé de l'article en français..."
                      rows={2}
                    />
                  </div>

                  {/* Content FR */}
                  <div>
                    <Label htmlFor="content_fr" className="text-white/80 mb-2 block">
                      Contenu de l'article (Français) *
                    </Label>
                    <RichTextEditor
                      key="editor-fr"
                      content={formData.content_fr}
                      onChange={(html) => setFormData({ ...formData, content_fr: html })}
                      placeholder="Commencez à écrire votre article en français... Utilisez la barre d'outils pour formater le texte."
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-white/40">
                        Temps de lecture estimé:{" "}
                        <span className="text-[#00FFC2]">{calculateReadTime(formData.content_fr || "")} min</span>
                      </p>
                      <p className="text-xs text-white/30">
                        💡 Raccourcis: <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px]">Ctrl+B</kbd> Gras, 
                        <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px] ml-1">Ctrl+I</kbd> Italique
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* English Content */}
                <TabsContent value="en" className="space-y-4">
                  {/* Title EN */}
                  <div>
                    <Label htmlFor="title_en" className="text-white/80">
                      Title (English)
                    </Label>
                    <Input
                      id="title_en"
                      value={formData.title_en}
                      onChange={(e) => handleTitleChange(e.target.value, "en")}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Article title in English"
                    />
                  </div>

                  {/* Excerpt EN */}
                  <div>
                    <Label htmlFor="excerpt_en" className="text-white/80">
                      Excerpt (English)
                    </Label>
                    <Textarea
                      id="excerpt_en"
                      value={formData.excerpt_en}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt_en: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Short summary in English..."
                      rows={2}
                    />
                  </div>

                  {/* Content EN */}
                  <div>
                    <Label htmlFor="content_en" className="text-white/80 mb-2 block">
                      Content (English)
                    </Label>
                    <RichTextEditor
                      key="editor-en"
                      content={formData.content_en}
                      onChange={(html) => setFormData({ ...formData, content_en: html })}
                      placeholder="Start writing your article in English... Use the toolbar to format the text."
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-white/40">
                        Estimated read time:{" "}
                        <span className="text-[#00FFC2]">{calculateReadTime(formData.content_en || "")} min</span>
                      </p>
                      <p className="text-xs text-white/30">
                        💡 Shortcuts: <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px]">Ctrl+B</kbd> Bold, 
                        <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px] ml-1">Ctrl+I</kbd> Italic
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
              >
                {editingPost ? "Mettre à jour" : "Créer l'article"}
              </Button>
              <Button
                onClick={closeDialog}
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={deletePost !== null}
        onClose={() => setDeletePost(null)}
        onConfirm={() => deletePost && handleDelete(deletePost.id)}
        title="Supprimer cet article ?"
        description={`Êtes-vous sûr de vouloir supprimer l'article "${deletePost?.title}" ? Cette action est irréversible.`}
      />
    </div>
  );
}

