import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { contentService, type Project } from "../../services/contentService";

interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onSuccess: () => void;
}

export function ProjectDialog({ open, onClose, project, onSuccess }: ProjectDialogProps) {
  const [activeTab, setActiveTab] = useState<"fr" | "en">("fr");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title_fr: "",
    title_en: "",
    description_fr: "",
    description_en: "",
    slug_fr: "",
    slug_en: "",
    technologies: [] as string[],
    category: "web-development",
    status: "draft" as "draft" | "published" | "archived",
    featured: false,
    coverImage: "",
    demoUrl: "",
    githubUrl: "",
    clientName_fr: "",
    clientName_en: "",
    duration: "",
    year: new Date().getFullYear(),
    tags_fr: [] as string[],
    tags_en: [] as string[],
    challenges_fr: [] as string[],
    challenges_en: [] as string[],
    features_fr: [] as string[],
    features_en: [] as string[],
  });

  const [newTech, setNewTech] = useState("");
  const [newTagFr, setNewTagFr] = useState("");
  const [newTagEn, setNewTagEn] = useState("");
  const [newChallengeFr, setNewChallengeFr] = useState("");
  const [newChallengeEn, setNewChallengeEn] = useState("");
  const [newFeatureFr, setNewFeatureFr] = useState("");
  const [newFeatureEn, setNewFeatureEn] = useState("");

  useEffect(() => {
    if (project) {
      setFormData({
        title_fr: project.title_fr || "",
        title_en: project.title_en || "",
        description_fr: project.description_fr || "",
        description_en: project.description_en || "",
        slug_fr: project.slug_fr || "",
        slug_en: project.slug_en || "",
        technologies: project.technologies || [],
        category: project.category || "web-development",
        status: project.status || "draft",
        featured: project.featured || false,
        coverImage: project.coverImage || "",
        demoUrl: project.demoUrl || "",
        githubUrl: project.githubUrl || "",
        clientName_fr: project.clientName_fr || "",
        clientName_en: project.clientName_en || "",
        duration: project.duration || "",
        year: project.year || new Date().getFullYear(),
        tags_fr: project.tags_fr || [],
        tags_en: project.tags_en || [],
        challenges_fr: project.challenges_fr || [],
        challenges_en: project.challenges_en || [],
        features_fr: project.features_fr || [],
        features_en: project.features_en || [],
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title_fr || !formData.description_fr) {
      toast.error("Le titre et la description en français sont obligatoires");
      return;
    }

    setLoading(true);
    try {
      if (project) {
        await contentService.updateProject(project.id, formData);
        toast.success("Projet mis à jour");
      } else {
        await contentService.createProject(formData);
        toast.success("Projet créé");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  // Technology management
  const addTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData({ ...formData, technologies: [...formData.technologies, newTech.trim()] });
      setNewTech("");
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({ ...formData, technologies: formData.technologies.filter(t => t !== tech) });
  };

  // FR Tags management
  const addTagFr = () => {
    if (newTagFr.trim() && !formData.tags_fr.includes(newTagFr.trim())) {
      setFormData({ ...formData, tags_fr: [...formData.tags_fr, newTagFr.trim()] });
      setNewTagFr("");
    }
  };

  const removeTagFr = (tag: string) => {
    setFormData({ ...formData, tags_fr: formData.tags_fr.filter(t => t !== tag) });
  };

  // EN Tags management
  const addTagEn = () => {
    if (newTagEn.trim() && !formData.tags_en.includes(newTagEn.trim())) {
      setFormData({ ...formData, tags_en: [...formData.tags_en, newTagEn.trim()] });
      setNewTagEn("");
    }
  };

  const removeTagEn = (tag: string) => {
    setFormData({ ...formData, tags_en: formData.tags_en.filter(t => t !== tag) });
  };

  // FR Challenges management
  const addChallengeFr = () => {
    if (newChallengeFr.trim()) {
      setFormData({ ...formData, challenges_fr: [...formData.challenges_fr, newChallengeFr.trim()] });
      setNewChallengeFr("");
    }
  };

  const removeChallengeFr = (index: number) => {
    setFormData({ ...formData, challenges_fr: formData.challenges_fr.filter((_, i) => i !== index) });
  };

  // EN Challenges management
  const addChallengeEn = () => {
    if (newChallengeEn.trim()) {
      setFormData({ ...formData, challenges_en: [...formData.challenges_en, newChallengeEn.trim()] });
      setNewChallengeEn("");
    }
  };

  const removeChallengeEn = (index: number) => {
    setFormData({ ...formData, challenges_en: formData.challenges_en.filter((_, i) => i !== index) });
  };

  // FR Features management
  const addFeatureFr = () => {
    if (newFeatureFr.trim()) {
      setFormData({ ...formData, features_fr: [...formData.features_fr, newFeatureFr.trim()] });
      setNewFeatureFr("");
    }
  };

  const removeFeatureFr = (index: number) => {
    setFormData({ ...formData, features_fr: formData.features_fr.filter((_, i) => i !== index) });
  };

  // EN Features management
  const addFeatureEn = () => {
    if (newFeatureEn.trim()) {
      setFormData({ ...formData, features_en: [...formData.features_en, newFeatureEn.trim()] });
      setNewFeatureEn("");
    }
  };

  const removeFeatureEn = (index: number) => {
    setFormData({ ...formData, features_en: formData.features_en.filter((_, i) => i !== index) });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0C0C0C] border-cyan-500/20 text-white">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-2xl font-bold text-white">
            {project ? "✏️ Modifier le projet" : "➕ Nouveau projet"}
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
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50"
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
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              🇬🇧 English
            </button>
          </div>

          {/* French Tab */}
          {activeTab === "fr" && (
            <div className="space-y-6 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-xl p-6 border border-cyan-500/10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white font-semibold mb-2 block">Titre (FR) *</Label>
                  <Input
                    value={formData.title_fr}
                    onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
                    placeholder="Nom du projet en français"
                    className="!bg-[#0a0a0a] border-cyan-500/30 !text-white placeholder:text-gray-500 focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <Label className="text-white font-semibold mb-2 block">Slug (FR)</Label>
                  <Input
                    value={formData.slug_fr}
                    onChange={(e) => setFormData({ ...formData, slug_fr: e.target.value })}
                    placeholder="url-du-projet-fr"
                    className="!bg-[#0a0a0a] border-cyan-500/30 !text-white placeholder:text-gray-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Description (FR) *</Label>
                <Textarea
                  value={formData.description_fr}
                  onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                  placeholder="Description complète du projet en français"
                  className="!bg-[#0a0a0a] border-cyan-500/30 !text-white placeholder:text-gray-500 focus:border-cyan-500 min-h-[120px]"
                  required
                />
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Nom du client (FR)</Label>
                <Input
                  value={formData.clientName_fr}
                  onChange={(e) => setFormData({ ...formData, clientName_fr: e.target.value })}
                  placeholder="Nom du client"
                  className="!bg-[#0a0a0a] border-cyan-500/30 !text-white placeholder:text-gray-500 focus:border-cyan-500"
                />
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Défis (FR)</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newChallengeFr}
                    onChange={(e) => setNewChallengeFr(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addChallengeFr())}
                    placeholder="Ajouter un défi..."
                    className="!bg-[#0a0a0a] border-cyan-500/30 !text-white placeholder:text-gray-500 focus:border-cyan-500"
                  />
                  <Button
                    type="button"
                    onClick={addChallengeFr}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-6"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.challenges_fr.map((challenge, index) => (
                    <div key={index} className="flex items-center gap-2 bg-black/30 rounded-lg p-3 border border-cyan-500/10">
                      <span className="flex-1 text-white text-sm">{challenge}</span>
                      <button
                        type="button"
                        onClick={() => removeChallengeFr(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Fonctionnalités (FR)</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newFeatureFr}
                    onChange={(e) => setNewFeatureFr(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeatureFr())}
                    placeholder="Ajouter une fonctionnalité..."
                    className="!bg-[#0a0a0a] border-cyan-500/30 !text-white placeholder:text-gray-500 focus:border-cyan-500"
                  />
                  <Button
                    type="button"
                    onClick={addFeatureFr}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-6"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.features_fr.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 bg-black/30 rounded-lg p-3 border border-cyan-500/10">
                      <span className="flex-1 text-white text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeatureFr(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Tags (FR)</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newTagFr}
                    onChange={(e) => setNewTagFr(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTagFr())}
                    placeholder="Ajouter un tag..."
                    className="!bg-[#0a0a0a] border-cyan-500/30 !text-white placeholder:text-gray-500 focus:border-cyan-500"
                  />
                  <Button
                    type="button"
                    onClick={addTagFr}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-6"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags_fr.map((tag) => (
                    <Badge key={tag} className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1.5">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTagFr(tag)}
                        className="ml-2 hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* English Tab */}
          {activeTab === "en" && (
            <div className="space-y-6 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-xl p-6 border border-cyan-500/10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white font-semibold mb-2 block">Title (EN)</Label>
                  <Input
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    placeholder="Project name in English"
                    className="!bg-[#0a0a0a] border-cyan-500/30 !text-white placeholder:text-gray-500 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <Label className="text-white font-semibold mb-2 block">Slug (EN)</Label>
                  <Input
                    value={formData.slug_en}
                    onChange={(e) => setFormData({ ...formData, slug_en: e.target.value })}
                    placeholder="project-url-en"
                    className="!bg-[#0a0a0a] border-cyan-500/30 !text-white placeholder:text-gray-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Description (EN)</Label>
                <Textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  placeholder="Complete project description in English"
                  className="!bg-[#0a0a0a] border-cyan-500/30 !text-white placeholder:text-gray-500 focus:border-cyan-500 min-h-[120px]"
                />
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Client Name (EN)</Label>
                <Input
                  value={formData.clientName_en}
                  onChange={(e) => setFormData({ ...formData, clientName_en: e.target.value })}
                  placeholder="Client name"
                  className="!bg-[#0a0a0a] border-cyan-500/30 !text-white placeholder:text-gray-500 focus:border-cyan-500"
                />
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Challenges (EN)</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newChallengeEn}
                    onChange={(e) => setNewChallengeEn(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addChallengeEn())}
                    placeholder="Add a challenge..."
                    className="!bg-[#0a0a0a] border-cyan-500/30 !text-white placeholder:text-gray-500 focus:border-cyan-500"
                  />
                  <Button
                    type="button"
                    onClick={addChallengeEn}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-6"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.challenges_en.map((challenge, index) => (
                    <div key={index} className="flex items-center gap-2 bg-black/30 rounded-lg p-3 border border-cyan-500/10">
                      <span className="flex-1 text-white text-sm">{challenge}</span>
                      <button
                        type="button"
                        onClick={() => removeChallengeEn(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Features (EN)</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newFeatureEn}
                    onChange={(e) => setNewFeatureEn(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeatureEn())}
                    placeholder="Add a feature..."
                    className="!bg-[#0a0a0a] border-cyan-500/30 !text-white placeholder:text-gray-500 focus:border-cyan-500"
                  />
                  <Button
                    type="button"
                    onClick={addFeatureEn}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-6"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.features_en.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 bg-black/30 rounded-lg p-3 border border-cyan-500/10">
                      <span className="flex-1 text-white text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeatureEn(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Tags (EN)</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newTagEn}
                    onChange={(e) => setNewTagEn(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTagEn())}
                    placeholder="Add a tag..."
                    className="!bg-[#0a0a0a] border-cyan-500/30 !text-white placeholder:text-gray-500 focus:border-cyan-500"
                  />
                  <Button
                    type="button"
                    onClick={addTagEn}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-6"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags_en.map((tag) => (
                    <Badge key={tag} className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1.5">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTagEn(tag)}
                        className="ml-2 hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Common Fields */}
          <div className="space-y-6 bg-gradient-to-br from-white/5 to-transparent rounded-xl p-6 border border-white/10">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              ⚙️ Paramètres généraux
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white font-semibold mb-2 block">Catégorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-black/50 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-development">Développement Web</SelectItem>
                    <SelectItem value="mobile-app">Application Mobile</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "draft" | "published" | "archived") => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="bg-black/50 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Année</Label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="bg-black/50 border-white/20 text-white"
                />
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">Durée</Label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="ex: 3 mois"
                  className="bg-black/50 border-white/20 text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div>
              <Label className="text-white font-semibold mb-2 block">Image de couverture (URL)</Label>
              <Input
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://..."
                className="bg-black/50 border-white/20 text-white placeholder:text-white/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white font-semibold mb-2 block">URL Demo</Label>
                <Input
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  placeholder="https://..."
                  className="bg-black/50 border-white/20 text-white placeholder:text-white/30"
                />
              </div>

              <div>
                <Label className="text-white font-semibold mb-2 block">URL GitHub</Label>
                <Input
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="bg-black/50 border-white/20 text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div>
              <Label className="text-white font-semibold mb-2 block">Technologies</Label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
                  placeholder="React, TypeScript, Node.js..."
                  className="bg-black/50 border-white/20 text-white placeholder:text-white/30"
                />
                <Button
                  type="button"
                  onClick={addTechnology}
                  className="bg-white/10 hover:bg-white/20 text-white px-6"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech) => (
                  <Badge key={tech} className="bg-white/10 text-white border border-white/20 px-3 py-1.5">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="ml-2 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 accent-cyan-500"
              />
              <Label htmlFor="featured" className="text-white font-semibold cursor-pointer">
                ⭐ Projet mis en avant
              </Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 shadow-lg shadow-cyan-500/30"
            >
              {loading ? "Enregistrement..." : (project ? "💾 Mettre à jour" : "✨ Créer le projet")}
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

