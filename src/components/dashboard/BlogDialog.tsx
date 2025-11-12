import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";
import { contentService, type BlogPost } from "../../services/contentService";

interface BlogDialogProps {
  open: boolean;
  onClose: () => void;
  post: BlogPost | null;
  onSuccess: () => void;
}

export function BlogDialog({ open, onClose, post, onSuccess }: BlogDialogProps) {
  const [activeTab, setActiveTab] = useState<"fr" | "en">("fr");
  const [formData, setFormData] = useState({
    // French fields
    title_fr: "",
    slug_fr: "",
    excerpt_fr: "",
    content_fr: "",
    category_fr: "",
    tags_fr: [] as string[],
    seo_description_fr: "",
    seo_keywords_fr: [] as string[],
    
    // English fields
    title_en: "",
    slug_en: "",
    excerpt_en: "",
    content_en: "",
    category_en: "",
    tags_en: [] as string[],
    seo_description_en: "",
    seo_keywords_en: [] as string[],
    
    // Common fields
    status: "draft" as "draft" | "published",
    coverImage: "",
  });

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (post) {
      setFormData({
        title_fr: post.title_fr || "",
        slug_fr: post.slug_fr || "",
        excerpt_fr: post.excerpt_fr || "",
        content_fr: post.content_fr || "",
        category_fr: post.category_fr || "",
        tags_fr: post.tags_fr || [],
        seo_description_fr: post.seo_description_fr || "",
        seo_keywords_fr: Array.isArray(post.seo_keywords_fr) ? post.seo_keywords_fr : [],
        
        title_en: post.title_en || "",
        slug_en: post.slug_en || "",
        excerpt_en: post.excerpt_en || "",
        content_en: post.content_en || "",
        category_en: post.category_en || "",
        tags_en: post.tags_en || [],
        seo_description_en: post.seo_description_en || "",
        seo_keywords_en: Array.isArray(post.seo_keywords_en) ? post.seo_keywords_en : [],
        
        status: post.status || "draft",
        coverImage: post.coverImage || "",
      });
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title_fr.trim()) {
      toast.error("Le titre français est requis");
      return;
    }
    
    if (!formData.content_fr.trim()) {
      toast.error("Le contenu français est requis");
      return;
    }

    try {
      if (post) {
        await contentService.updateBlogPost(post.id, formData);
        toast.success("Article mis à jour");
      } else {
        await contentService.createBlogPost(formData);
        toast.success("Article créé");
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const addTag = (lang: "fr" | "en") => {
    const tag = newTag.trim();
    if (!tag) return;
    
    const fieldName = lang === "fr" ? "tags_fr" : "tags_en";
    const currentTags = formData[fieldName];
    
    if (currentTags.includes(tag)) {
      toast.error("Ce tag existe déjà");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...currentTags, tag]
    }));
    setNewTag("");
  };

  const removeTag = (lang: "fr" | "en", tagToRemove: string) => {
    const fieldName = lang === "fr" ? "tags_fr" : "tags_en";
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter(tag => tag !== tagToRemove)
    }));
  };

  const categories = [
    "Développement Web",
    "Design",
    "Marketing",
    "Business",
    "Technologie",
    "IA & Machine Learning",
    "Cybersécurité",
    "DevOps"
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto !bg-[#1a1a1a] border border-purple-500/20">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-2xl font-bold text-white">
            {post ? "✏️ Modifier l'article" : "➕ Nouvel article"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Language Tabs */}
          <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setActiveTab("fr")}
              className={`flex-1 px-6 py-3 rounded-md font-semibold transition-all ${
                activeTab === "fr"
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/50"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              🇫🇷 Français
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("en")}
              className={`flex-1 px-6 py-3 rounded-md font-semibold transition-all ${
                activeTab === "en"
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/50"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              🇬🇧 English
            </button>
          </div>

          {/* French Tab */}
          {activeTab === "fr" && (
            <div className="space-y-6 bg-gradient-to-br from-purple-500/5 to-transparent rounded-xl p-6 border border-purple-500/10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white font-semibold mb-2 block">Titre *</Label>
                  <Input
                    value={formData.title_fr}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_fr: e.target.value }))}
                    placeholder="Titre de l'article en français"
                    className="bg-black/50 border-purple-500/20 text-white placeholder:text-white/30 focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <Label className="text-white font-semibold mb-2 block">Slug</Label>
                  <Input
                    value={formData.slug_fr}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug_fr: e.target.value }))}
                    placeholder="url-de-l-article (auto-généré si vide)"
                    className="bg-black/50 border-purple-500/20 text-white placeholder:text-white/30 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Extrait</Label>
                <Textarea
                  value={formData.excerpt_fr}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt_fr: e.target.value }))}
                  placeholder="Court résumé de l'article"
                  rows={2}
                  className="bg-black/50 border-purple-500/20 text-white placeholder:text-white/30 focus:border-purple-500"
                />
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Contenu * (Markdown)</Label>
                <Textarea
                  value={formData.content_fr}
                  onChange={(e) => setFormData(prev => ({ ...prev, content_fr: e.target.value }))}
                  placeholder="Contenu complet de l'article en Markdown..."
                  rows={10}
                  className="bg-black/50 border-purple-500/20 text-white placeholder:text-white/30 focus:border-purple-500 font-mono text-sm"
                  required
                />
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Catégorie</Label>
                <Input
                  value={formData.category_fr}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_fr: e.target.value }))}
                  placeholder="Catégorie de l'article"
                  list="categories-fr"
                  className="bg-black/50 border-purple-500/20 text-white placeholder:text-white/30 focus:border-purple-500"
                />
                <datalist id="categories-fr">
                  {categories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag("fr");
                      }
                    }}
                    placeholder="Ajouter un tag..."
                    className="bg-black/50 border-purple-500/20 text-white placeholder:text-white/30 focus:border-purple-500"
                  />
                  <Button
                    type="button"
                    onClick={() => addTag("fr")}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags_fr.map((tag) => (
                    <Badge key={tag} className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1.5">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag("fr", tag)}
                        className="ml-2 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">SEO - Description</Label>
                <Textarea
                  value={formData.seo_description_fr}
                  onChange={(e) => setFormData(prev => ({ ...prev, seo_description_fr: e.target.value }))}
                  placeholder="Description pour les moteurs de recherche"
                  rows={2}
                  className="bg-black/50 border-purple-500/20 text-white placeholder:text-white/30 focus:border-purple-500"
                />
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">SEO - Mots-clés</Label>
                <Input
                  value={formData.seo_keywords_fr.join(", ")}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    seo_keywords_fr: e.target.value.split(",").map(k => k.trim()).filter(Boolean)
                  }))}
                  placeholder="mot-clé1, mot-clé2, mot-clé3"
                  className="bg-black/50 border-purple-500/20 text-white placeholder:text-white/30 focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* English Tab */}
          {activeTab === "en" && (
            <div className="space-y-6 bg-gradient-to-br from-purple-500/5 to-transparent rounded-xl p-6 border border-purple-500/10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white font-semibold mb-2 block">Title</Label>
                  <Input
                    value={formData.title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                    placeholder="Article title in English"
                    className="bg-black/50 border-purple-500/20 text-white placeholder:text-white/30 focus:border-purple-500"
                  />
                </div>

                <div>
                  <Label className="text-white font-semibold mb-2 block">Slug</Label>
                  <Input
                    value={formData.slug_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug_en: e.target.value }))}
                    placeholder="article-url (auto-generated if empty)"
                    className="bg-black/50 border-purple-500/20 text-white placeholder:text-white/30 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Excerpt</Label>
                <Textarea
                  value={formData.excerpt_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt_en: e.target.value }))}
                  placeholder="Short article summary"
                  rows={2}
                  className="bg-black/50 border-purple-500/20 text-white placeholder:text-white/30 focus:border-purple-500"
                />
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Content (Markdown)</Label>
                <Textarea
                  value={formData.content_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
                  placeholder="Full article content in Markdown..."
                  rows={10}
                  className="bg-black/50 border-purple-500/20 text-white placeholder:text-white/30 focus:border-purple-500 font-mono text-sm"
                />
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Category</Label>
                <Input
                  value={formData.category_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_en: e.target.value }))}
                  placeholder="Article category"
                  className="bg-black/50 border-purple-500/20 text-white placeholder:text-white/30 focus:border-purple-500"
                />
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag("en");
                      }
                    }}
                    placeholder="Add a tag..."
                    className="bg-black/50 border-purple-500/20 text-white placeholder:text-white/30 focus:border-purple-500"
                  />
                  <Button
                    type="button"
                    onClick={() => addTag("en")}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags_en.map((tag) => (
                    <Badge key={tag} className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1.5">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag("en", tag)}
                        className="ml-2 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">SEO - Description</Label>
                <Textarea
                  value={formData.seo_description_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, seo_description_en: e.target.value }))}
                  placeholder="Description for search engines"
                  rows={2}
                  className="bg-black/50 border-purple-500/20 text-white placeholder:text-white/30 focus:border-purple-500"
                />
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">SEO - Keywords</Label>
                <Input
                  value={formData.seo_keywords_en.join(", ")}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    seo_keywords_en: e.target.value.split(",").map(k => k.trim()).filter(Boolean)
                  }))}
                  placeholder="keyword1, keyword2, keyword3"
                  className="bg-black/50 border-purple-500/20 text-white placeholder:text-white/30 focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* Common Fields */}
          <div className="space-y-6 bg-gradient-to-br from-white/5 to-transparent rounded-xl p-6 border border-white/10">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              ⚙️ Paramètres généraux
            </h4>
            
            <div>
              <Label className="text-white font-semibold mb-2 block">Image de couverture (URL)</Label>
              <Input
                value={formData.coverImage}
                onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                placeholder="https://..."
                className="bg-black/50 border-white/20 text-white placeholder:text-white/30"
              />
            </div>

            <div>
              <Label className="text-white font-semibold mb-2 block">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "draft" | "published") => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="bg-black/50 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 shadow-lg shadow-purple-500/30"
            >
              {post ? "💾 Mettre à jour" : "✨ Créer l'article"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-white/60 hover:text-white hover:bg-white/10 px-8"
            >
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
