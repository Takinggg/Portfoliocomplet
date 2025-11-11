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
  Globe,
} from "lucide-react";
import { BilingualFields } from "../blog/BilingualFields";
import { RichTextEditor } from "../blog/RichTextEditor";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { toast } from "sonner";

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

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === "" || 
      (post.title_fr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       post.title_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       post.title.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || post.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen p-6 space-y-6" style={{ backgroundColor: '#111827' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-lg border" style={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#374151' }}>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">
            Blog Bilingue ({posts.length} articles)
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={fetchPosts}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            style={{ backgroundColor: '#374151', borderColor: '#4b5563', color: 'white' }}
            className="hover:bg-gray-600"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setIsCreateOpen(true);
            }}
            style={{ backgroundColor: '#7c3aed', color: 'white', border: 'none' }}
            className="hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel article
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 rounded-lg border" style={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#374151' }}>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
        <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
          <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all" className="text-white hover:bg-gray-700">Tous</SelectItem>
            <SelectItem value="published" className="text-white hover:bg-gray-700">Publiés</SelectItem>
            <SelectItem value="draft" className="text-white hover:bg-gray-700">Brouillons</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="p-4 border" style={{ backgroundColor: '#1f2937', borderColor: '#374151' }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">
                      🇫🇷 {post.title_fr || post.title}
                    </h3>
                    {post.title_en && (
                      <h3 className="font-medium text-gray-300 mb-2">
                        🇬🇧 {post.title_en}
                      </h3>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                      {post.views && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views}
                        </div>
                      )}
                      <Badge
                        variant={post.status === "published" ? "default" : "secondary"}
                        className={post.status === "published" 
                          ? "bg-green-600/20 text-green-300 border-green-600/30"
                          : "bg-gray-600/20 text-gray-300 border-gray-600/30"
                        }
                      >
                        {post.status === "published" ? "Publié" : "Brouillon"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {post.tags_fr && post.tags_fr.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-purple-600/30 text-purple-300 bg-purple-600/10">
                          🇫🇷 {tag}
                        </Badge>
                      ))}
                      {post.tags_en && post.tags_en.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-blue-600/30 text-blue-300 bg-blue-600/10">
                          🇬🇧 {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {post.status === "published" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openEditDialog(post)}
                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDeletePost(post)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-600/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

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