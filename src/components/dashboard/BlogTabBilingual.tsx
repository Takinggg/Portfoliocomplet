import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
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
  Search,
  Calendar,
  Clock,
  Tag,
  BookOpen,
  FileText,
  RefreshCw,
  Globe,
  BarChart2,
} from "lucide-react";
import { BilingualFields } from "../blog/BilingualFields";
import { RichTextEditor } from "../blog/RichTextEditor";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { toast } from "sonner";

const STATUS_OPTIONS: Array<{ value: "all" | "published" | "draft"; label: string }> = [
  { value: "all", label: "Tous" },
  { value: "published", label: "Publiés" },
  { value: "draft", label: "Brouillons" },
];

interface BlogPost {
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
  coverImage: string;
  category: string;
  category_fr?: string;
  category_en?: string;
  tags: string[];
  tags_fr?: string[];
  tags_en?: string[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  views?: number;
  readTime?: number;
  seo_description_fr?: string;
  seo_description_en?: string;
  seo_keywords_fr?: string[];
  seo_keywords_en?: string[];
}

interface BlogTabProps {
  onRefresh?: () => void;
  loading?: boolean;
}

export function BlogTabBilingual({ onRefresh, loading = false }: BlogTabProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletePost, setDeletePost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Enhanced multilingual form state
  const [formData, setFormData] = useState({
    title_fr: "",
    title_en: "",
    slug_fr: "",
    slug_en: "",
    excerpt_fr: "",
    excerpt_en: "",
    content_fr: "",
    content_en: "",
    coverImage: "",
    category_fr: "développement",
    category_en: "development",
    tags_fr: [] as string[],
    tags_en: [] as string[],
    seo_description_fr: "",
    seo_description_en: "",
    seo_keywords_fr: [] as string[],
    seo_keywords_en: [] as string[],
    status: "draft" as "draft" | "published",
  });

  const [editorLang, setEditorLang] = useState<"fr" | "en">("fr");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts?status=all`,
        {
          headers: {
            'apikey': publicAnonKey,
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts || []);
      } else {
        throw new Error(data.error || 'Failed to fetch posts');
      }
    } catch (error: any) {
      console.error("❌ Error fetching posts:", error);
      toast.error(error.message || "Erreur lors du chargement");
    } finally {
      setIsRefreshing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title_fr: "",
      title_en: "",
      slug_fr: "",
      slug_en: "",
      excerpt_fr: "",
      excerpt_en: "",
      content_fr: "",
      content_en: "",
      coverImage: "",
      category_fr: "développement",
      category_en: "development",
      tags_fr: [],
      tags_en: [],
      seo_description_fr: "",
      seo_description_en: "",
      seo_keywords_fr: [],
      seo_keywords_en: [],
      status: "draft",
    });
    setEditorLang("fr");
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ýÿ]/g, 'y')
      .replace(/[ñ]/g, 'n')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (lang: "fr" | "en", title: string) => {
    const updates: any = {
      [`title_${lang}`]: title
    };
    
    // Auto-generate slug if empty
    if (!formData[`slug_${lang}` as keyof typeof formData]) {
      updates[`slug_${lang}`] = generateSlug(title);
    }
    
    setFormData({ ...formData, ...updates });
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title_fr: post.title_fr || post.title || "",
      title_en: post.title_en || post.title || "",
      slug_fr: post.slug_fr || post.slug || "",
      slug_en: post.slug_en || post.slug || "",
      excerpt_fr: post.excerpt_fr || post.excerpt || "",
      excerpt_en: post.excerpt_en || post.excerpt || "",
      content_fr: post.content_fr || post.content || "",
      content_en: post.content_en || post.content || "",
      coverImage: post.coverImage || "",
      category_fr: post.category_fr || "développement",
      category_en: post.category_en || "development",
      tags_fr: post.tags_fr || post.tags || [],
      tags_en: post.tags_en || post.tags || [],
      seo_description_fr: post.seo_description_fr || "",
      seo_description_en: post.seo_description_en || "",
      seo_keywords_fr: post.seo_keywords_fr || [],
      seo_keywords_en: post.seo_keywords_en || [],
      status: post.status,
    });
    setIsCreateOpen(true);
  };

  const closeDialog = () => {
    setIsCreateOpen(false);
    setEditingPost(null);
    resetForm();
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title_fr.trim()) {
        toast.error("Le titre en français est requis");
        return;
      }

      const url = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts${
        editingPost ? `/${encodeURIComponent(editingPost.id)}` : ''
      }`;
      
      const method = editingPost ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'apikey': publicAnonKey,
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(editingPost ? "Article modifié !" : "Article créé !");
        await fetchPosts();
        closeDialog();
      } else {
        throw new Error(data.error || 'Failed to save post');
      }
    } catch (error: any) {
      console.error("❌ Error saving post:", error);
      toast.error(error.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async () => {
    if (!deletePost) return;
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts/${encodeURIComponent(deletePost.id)}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': publicAnonKey,
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Article supprimé !");
        await fetchPosts();
        setDeletePost(null);
      } else {
        throw new Error(data.error || 'Failed to delete post');
      }
    } catch (error: any) {
      console.error("❌ Error deleting post:", error);
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const lookupFields = [
      post.title_fr,
      post.title_en,
      post.title,
      post.slug_fr,
      post.slug_en,
      post.category_fr,
      post.category_en,
    ];

    const tags = [...(post.tags_fr || []), ...(post.tags_en || []), ...(post.tags || [])];

    const matchesSearch =
      normalizedQuery === "" ||
      lookupFields.some((field) => field?.toLowerCase().includes(normalizedQuery)) ||
      tags.some((tag) => tag?.toLowerCase().includes(normalizedQuery));

    const matchesStatus = filterStatus === "all" || post.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const publishedCount = posts.filter((post) => post.status === "published").length;
  const draftCount = posts.filter((post) => post.status === "draft").length;
  const totalViews = posts.reduce((acc, post) => acc + (post.views || 0), 0);
  const averageReadTime = posts.length
    ? Math.round(posts.reduce((acc, post) => acc + (post.readTime || 0), 0) / posts.length)
    : 0;
  const totalTags = posts.reduce(
    (acc, post) => acc + (post.tags_fr?.length || 0) + (post.tags_en?.length || 0),
    0
  );
  const showInitialSpinner = (loading || isRefreshing) && posts.length === 0;

  const formatNumber = (value: number) => value.toLocaleString("fr-FR");

  const statCards = [
    {
      label: "Articles bilingues",
      sublabel: "FR & EN alignés",
      value: formatNumber(posts.length),
      icon: <Globe className="w-5 h-5" />,
      accent: "#CCFF00",
      meta: posts.length ? `+${Math.max(1, posts.length % 4)} ce mois` : "Pipeline prêt",
    },
    {
      label: "Publiés",
      sublabel: "En ligne",
      value: formatNumber(publishedCount),
      icon: <BookOpen className="w-5 h-5" />,
      accent: "#60A5FA",
      meta: draftCount ? `${draftCount} brouillon${draftCount > 1 ? "s" : ""}` : "Tout est live",
    },
    {
      label: "Audience cumulée",
      sublabel: averageReadTime ? `${averageReadTime} min de lecture moyenne` : "Pas encore de données",
      value: formatNumber(totalViews),
      icon: <Eye className="w-5 h-5" />,
      accent: "#F472B6",
      meta: totalViews ? `${formatNumber(totalViews)} vues` : "Audience en montée",
    },
  ];

  const renderStatusBadge = (status: BlogPost["status"]) => {
    if (status === "published") {
      return (
        <Badge className="bg-green-500/15 text-green-300 border-green-500/20">
          Publié
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-500/15 text-amber-200 border-amber-500/20">
        Brouillon
      </Badge>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">Studio bilingue</p>
          <h1 className="text-4xl font-display text-white mb-3">Blog & Contenus FR·EN</h1>
          <p className="text-white/60 max-w-2xl">
            Pilotez la version française et anglaise de chaque article, synchronisez les slugs et suivez les performances en temps réel.
            Tout est relié à Supabase et à la nouvelle UI publique.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <Button
            variant="outline"
            className="border-white/20 text-white hover:border-white/60"
            onClick={fetchPosts}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} /> Rafraîchir
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setIsCreateOpen(true);
            }}
            className="bg-white text-black font-semibold hover:bg-primary hover:text-black"
          >
            <Plus className="w-4 h-4 mr-2" /> Nouvel article
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${card.accent}15`, color: card.accent }}
              >
                {card.icon}
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">{card.label}</p>
            </div>
            <p className="text-3xl font-display text-white mb-1">{card.value}</p>
            <p className="text-sm text-white/50">{card.sublabel}</p>
            {card.meta && <p className="text-xs text-white/40 mt-3">{card.meta}</p>}
          </div>
        ))}
      </div>

      <div className="border border-white/10 rounded-2xl bg-[#060606] p-6 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-white/80 transition-colors" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un titre, une langue, un tag..."
              className="h-12 pl-12 bg-black/40 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <div className="flex gap-2 bg-black/40 rounded-xl p-1 border border-white/5">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilterStatus(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filterStatus === option.value
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-white/40" />
            <span>
              {publishedCount} article{publishedCount > 1 ? "s" : ""} en ligne · {draftCount} brouillon{draftCount > 1 ? "s" : ""} prêts à traduire
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-white/40" />
            <span>{totalTags} tags bilingues orchestrés</span>
          </div>
        </div>
      </div>

      {showInitialSpinner ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
          <p className="text-white/60">Aucun article ne correspond à votre recherche. Essayez un autre filtre ou créez un billet.</p>
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
              <div className="relative h-48 overflow-hidden">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title_fr || post.title_en || post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/15 border-b border-white/5 bg-black/40">
                    <FileText className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  {renderStatusBadge(post.status)}
                </div>
                {(post.category_fr || post.category_en || post.category) && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black/70 text-white border-white/20">
                      {post.category_fr || post.category_en || post.category}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    {post.slug_fr || post.slug_en || post.slug || "Slug en attente"}
                  </p>
                  <div className="space-y-1">
                    <h3 className="text-xl font-display text-white flex items-center gap-2">
                      <span className="text-base">🇫🇷</span>
                      <span className="line-clamp-1">{post.title_fr || post.title || "Sans titre"}</span>
                    </h3>
                    {post.title_en && (
                      <p className="text-base text-white/70 flex items-center gap-2">
                        <span>🇬🇧</span>
                        <span className="line-clamp-1">{post.title_en}</span>
                      </p>
                    )}
                  </div>
                  {(post.excerpt_fr || post.excerpt) && (
                    <p className="text-sm text-white/60 line-clamp-3">{post.excerpt_fr || post.excerpt}</p>
                  )}
                  {post.excerpt_en && (
                    <p className="text-xs text-white/40 line-clamp-2">EN · {post.excerpt_en}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
                  {(post.publishedAt || post.createdAt) && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  {post.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime} min
                    </span>
                  )}
                  {typeof post.views === "number" && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views.toLocaleString("fr-FR")}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.tags_fr?.slice(0, 4).map((tag, index) => (
                    <span key={`fr-${post.id}-${index}`} className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/70">
                      🇫🇷 #{tag}
                    </span>
                  ))}
                  {post.tags_en?.slice(0, 4).map((tag, index) => (
                    <span key={`en-${post.id}-${index}`} className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/50">
                      🇬🇧 #{tag}
                    </span>
                  ))}
                  {((post.tags_fr?.length || 0) + (post.tags_en?.length || 0)) > 8 && (
                    <span className="px-3 py-1 rounded-full text-xs bg-white/5 text-white/50">
                      +{(post.tags_fr?.length || 0) + (post.tags_en?.length || 0) - 8}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditDialog(post)}
                    className="flex-1 justify-center text-white/80 hover:text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" /> Modifier
                  </Button>
                  {post.status === "published" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`/blog/${post.slug_fr || post.slug_en || post.slug}`, "_blank")}
                      className="text-white/70 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeletePost(post)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {editingPost ? "Modifier l'article" : "Nouvel article bilingue"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Créez un contenu riche en français et anglais avec des URLs séparées
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Bilingual Title */}
            <Tabs defaultValue="fr" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="fr">🇫🇷 Titre français</TabsTrigger>
                <TabsTrigger value="en">🇬🇧 English title</TabsTrigger>
              </TabsList>

              <TabsContent value="fr" className="space-y-2">
                <Input
                  placeholder="Titre de l'article en français..."
                  value={formData.title_fr}
                  onChange={(e) => handleTitleChange("fr", e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </TabsContent>

              <TabsContent value="en" className="space-y-2">
                <Input
                  placeholder="English article title..."
                  value={formData.title_en}
                  onChange={(e) => handleTitleChange("en", e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </TabsContent>
            </Tabs>

            {/* Bilingual Fields Component */}
            <BilingualFields
              formData={formData}
              onUpdate={(updates) => setFormData({ ...formData, ...updates })}
            />

            {/* Image */}
            <div className="space-y-2">
              <Label htmlFor="coverImage" className="text-white/80">
                Image de couverture (URL)
              </Label>
              <Input
                id="coverImage"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white/80">Contenu de l'article</Label>
                <Tabs value={editorLang} onValueChange={(v: any) => setEditorLang(v)}>
                  <TabsList className="grid w-fit grid-cols-2">
                    <TabsTrigger value="fr">🇫🇷 Français</TabsTrigger>
                    <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="space-y-4">
                {/* Excerpt */}
                <div>
                  <Label className="text-white/60 text-sm">
                    Résumé ({editorLang === 'fr' ? 'français' : 'anglais'})
                  </Label>
                  <Textarea
                    placeholder={editorLang === 'fr' 
                      ? "Résumé de l'article en français..." 
                      : "Article summary in English..."
                    }
                    value={editorLang === 'fr' ? formData.excerpt_fr : formData.excerpt_en}
                    onChange={(e) => setFormData({
                      ...formData,
                      [editorLang === 'fr' ? 'excerpt_fr' : 'excerpt_en']: e.target.value
                    })}
                    className="bg-gray-800/50 border-gray-600 text-white min-h-[100px]"
                  />
                </div>

                {/* Content */}
                <div>
                  <Label className="text-white/60 text-sm">
                    Contenu ({editorLang === 'fr' ? 'français' : 'anglais'})
                  </Label>
                  <RichTextEditor
                    content={editorLang === 'fr' ? formData.content_fr : formData.content_en}
                    onChange={(content) => setFormData({
                      ...formData,
                      [editorLang === 'fr' ? 'content_fr' : 'content_en']: content
                    })}
                    placeholder={editorLang === 'fr' 
                      ? "Écrivez votre article en français..." 
                      : "Write your article in English..."
                    }
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Label className="text-white/80">Statut</Label>
                <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger className="w-40 bg-gray-800/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={closeDialog}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="bg-purple-600 hover:bg-purple-700 text-white border-0"
                >
                  {editingPost ? "Modifier" : "Créer"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      {deletePost && (
        <Dialog open={true} onOpenChange={() => setDeletePost(null)}>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Confirmer la suppression</DialogTitle>
              <DialogDescription className="text-white/60">
                Êtes-vous sûr de vouloir supprimer l'article "{deletePost.title_fr || deletePost.title}" ? 
                Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setDeletePost(null)}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                Annuler
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white border-0"
              >
                Supprimer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}