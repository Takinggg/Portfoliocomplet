import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { motion } from "motion/react";
import {
  Plus,
  Download,
  Edit,
  Trash,
  Eye,
  EyeOff,
  FileText,
  Folder,
  Upload,
  TrendingUp,
  Users,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";
import { projectId } from "../../utils/supabase/info";
import { createClient } from "../../utils/supabase/client";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface Resource {
  id: string;
  // Multilingual fields
  title_fr: string;
  title_en?: string;
  description_fr: string;
  description_en?: string;
  // Multilingual file URLs
  fileUrl_fr: string;
  fileUrl_en?: string;
  // Legacy fields (for backward compatibility)
  title: string;
  description: string;
  fileUrl: string; // = fileUrl_fr
  // Common fields
  category: "templates" | "guides" | "checklists" | "tools";
  coverImage?: string;
  tags: string[];
  isPublished: boolean;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

const CATEGORY_LABELS = {
  templates: "Templates",
  guides: "Guides PDF",
  checklists: "Checklists",
  tools: "Outils"
};

const CATEGORY_COLORS = {
  templates: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  guides: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  checklists: "bg-green-500/10 text-green-500 border-green-500/20",
  tools: "bg-orange-500/10 text-orange-500 border-orange-500/20"
};

export function ResourcesTab() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);
  const [uploading, setUploading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [uploadedFileName_fr, setUploadedFileName_fr] = useState<string>("");
  const [uploadedFileName_en, setUploadedFileName_en] = useState<string>("");
  const [editorLang, setEditorLang] = useState<"fr" | "en">("fr");
  
  const supabase = createClient();

  // Form state
  const [formData, setFormData] = useState({
    title_fr: "",
    title_en: "",
    description_fr: "",
    description_en: "",
    fileUrl_fr: "",
    fileUrl_en: "",
    category: "templates" as Resource["category"],
    coverImage: "",
    tags: "",
    isPublished: true
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      // Utiliser le service avec fallback local
      const { fetchResources } = await import("../../utils/dataService");
      const { resources: loadedResources, mode } = await fetchResources();
      
      console.log(`âœ… Resources loaded in ${mode} mode:`, loadedResources.length);
      setResources(loadedResources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast.error(`Erreur de connexion (mode local disponible)`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, lang: "fr" | "en") => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'text/html'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Seuls les fichiers PDF et HTML sont acceptÃ©s");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("Le fichier ne doit pas dÃ©passer 10 MB");
      return;
    }

    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirÃ©e");
        return;
      }

      // Create FormData to send file to server
      const formData = new FormData();
      formData.append('file', file);

      // Upload file via server endpoint (bypasses RLS)
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`
          },
          body: formData
        }
      );

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Upload failed");
      }

      // Update the correct fileUrl based on language
      if (lang === "fr") {
        setFormData(prev => ({ ...prev, fileUrl_fr: data.fileUrl }));
        setUploadedFileName_fr(file.name);
      } else {
        setFormData(prev => ({ ...prev, fileUrl_en: data.fileUrl }));
        setUploadedFileName_en(file.name);
      }
      
      toast.success(`Fichier ${lang.toUpperCase()} "${file.name}" uploadÃ© avec succÃ¨s`);
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(`Erreur lors de l'upload: ${error.message || "Erreur inconnue"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirÃ©e");
        return;
      }

      const payload = {
        title_fr: formData.title_fr,
        title_en: formData.title_en,
        description_fr: formData.description_fr,
        description_en: formData.description_en,
        fileUrl_fr: formData.fileUrl_fr,
        fileUrl_en: formData.fileUrl_en,
        category: formData.category,
        coverImage: formData.coverImage || null,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        isPublished: formData.isPublished
      };

      const url = editingResource
        ? `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources/${encodeURIComponent(editingResource.id)}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources`;

      const response = await fetch(url, {
        method: editingResource ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingResource ? "Ressource mise Ã  jour" : "Ressource crÃ©Ã©e");
        setIsDialogOpen(false);
        setEditingResource(null);
        resetForm();
        fetchResources();
      } else {
        toast.error(data.error || "Erreur");
      }
    } catch (error) {
      console.error("Error saving resource:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async () => {
    if (!resourceToDelete) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirÃ©e");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources/${encodeURIComponent(resourceToDelete.id)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session.access_token}` }
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Ressource supprimÃ©e");
        setDeleteDialogOpen(false);
        setResourceToDelete(null);
        fetchResources();
      } else {
        toast.error(data.error || "Erreur");
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      title_fr: resource.title_fr || resource.title || "",
      title_en: resource.title_en || "",
      description_fr: resource.description_fr || resource.description || "",
      description_en: resource.description_en || "",
      fileUrl_fr: resource.fileUrl_fr || resource.fileUrl || "",
      fileUrl_en: resource.fileUrl_en || "",
      category: resource.category,
      coverImage: resource.coverImage || "",
      tags: resource.tags.join(", "),
      isPublished: resource.isPublished
    });
    // Extract filenames from URLs if possible
    if (resource.fileUrl_fr || resource.fileUrl) {
      const urlParts = (resource.fileUrl_fr || resource.fileUrl).split('/');
      setUploadedFileName_fr(urlParts[urlParts.length - 1] || "");
    }
    if (resource.fileUrl_en) {
      const urlParts = resource.fileUrl_en.split('/');
      setUploadedFileName_en(urlParts[urlParts.length - 1] || "");
    }
    setEditorLang("fr"); // Reset to French tab
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title_fr: "",
      title_en: "",
      description_fr: "",
      description_en: "",
      fileUrl_fr: "",
      fileUrl_en: "",
      category: "templates",
      coverImage: "",
      tags: "",
      isPublished: true
    });
    setUploadedFileName_fr("");
    setUploadedFileName_en("");
  };

  const filteredResources = filterCategory === "all"
    ? resources
    : resources.filter(r => r.category === filterCategory);

  const stats = {
    total: resources.length,
    published: resources.filter(r => r.isPublished).length,
    totalDownloads: resources.reduce((sum, r) => sum + r.downloads, 0),
    byCategory: Object.keys(CATEGORY_LABELS).map(cat => ({
      category: cat,
      label: CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS],
      count: resources.filter(r => r.category === cat).length
    }))
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl tracking-tight">Ressources Gratuites</h1>
          <p className="text-white/60 mt-1">
            GÃ©rez vos ressources avec gated content
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={async () => {
              try {
                toast.info("ðŸŒ± Chargement des ressources professionnelles...");
                const { seedProfessionalResources } = await import("../../utils/seedProfessionalResources");
                await seedProfessionalResources();
                toast.success("âœ… Ressources professionnelles chargÃ©es avec succÃ¨s !");
                fetchResources();
              } catch (error) {
                console.error("Error seeding resources:", error);
                toast.error("âŒ Erreur lors du chargement des ressources");
              }
            }}
            variant="outline"
            className="border-[#CCFF00]/30 text-[#CCFF00] hover:bg-[#CCFF00]/10"
          >
            <Download className="mr-2 h-4 w-4" />
            Charger Ressources Pro
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setEditingResource(null);
              setIsDialogOpen(true);
            }}
            className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle ressource
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-[#CCFF00]/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white/60">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <p className="text-xs text-white/40 mt-1">{stats.published} publiÃ©es</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-[#CCFF00]/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white/60">TÃ©lÃ©chargements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Download className="h-4 w-4 text-[#CCFF00] mr-2" />
              <div className="text-2xl font-bold text-white">{stats.totalDownloads}</div>
            </div>
          </CardContent>
        </Card>

        {stats.byCategory.slice(0, 2).map((cat) => (
          <Card key={cat.category} className="bg-black/40 border-[#CCFF00]/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white/60">{cat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{cat.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[200px] bg-black/40 border-[#CCFF00]/20 text-white">
            <SelectValue placeholder="CatÃ©gorie" />
          </SelectTrigger>
          <SelectContent className="bg-[#0C0C0C] border-[#CCFF00]/20">
            <SelectItem value="all" className="text-white focus:bg-white/10 focus:text-white">Toutes les catÃ©gories</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key} className="text-white focus:bg-white/10 focus:text-white">{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Resources List */}
      <Card className="bg-black/40 border-[#CCFF00]/10">
        <Table>
          <TableHeader>
            <TableRow className="border-[#CCFF00]/10">
              <TableHead className="text-white/60">Titre</TableHead>
              <TableHead className="text-white/60 w-[110px]">CatÃ©gorie</TableHead>
              <TableHead className="text-white/60 w-[70px] text-center hidden sm:table-cell">
                <Download className="h-3.5 w-3.5 inline" />
              </TableHead>
              <TableHead className="text-white/60 w-[90px]">Statut</TableHead>
              <TableHead className="text-white/60 w-[80px] hidden md:table-cell">Date</TableHead>
              <TableHead className="text-white/60 w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-white/40 py-8">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : resources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="space-y-4">
                    <FileText className="h-12 w-12 text-[#CCFF00]/40 mx-auto" />
                    <div>
                      <p className="text-white mb-2">Aucune ressource crÃ©Ã©e</p>
                      <p className="text-white/40 text-sm mb-4">
                        CrÃ©ez votre premiÃ¨re ressource ou utilisez la commande de seeding
                      </p>
                      <div className="inline-block bg-black/60 border border-[#CCFF00]/20 rounded px-4 py-2">
                        <code className="text-xs text-[#CCFF00]">
                          await seedRealResources()
                        </code>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredResources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-white/40 py-8">
                  Aucune ressource trouvÃ©e pour ce filtre
                </TableCell>
              </TableRow>
            ) : (
              filteredResources.map((resource) => (
                <TableRow key={resource.id} className="border-[#CCFF00]/10">
                  <TableCell className="text-white max-w-[200px] sm:max-w-none">
                    <div className="font-medium line-clamp-2 text-sm">
                      {resource.title_fr || resource.title}
                      {resource.title_en && (
                        <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500/40 text-xs">
                          ðŸŒ EN
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`border text-xs whitespace-nowrap ${CATEGORY_COLORS[resource.category]}`}>
                      {CATEGORY_LABELS[resource.category]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white text-center hidden sm:table-cell">
                    <span className="text-sm">{resource.downloads}</span>
                  </TableCell>
                  <TableCell>
                    {resource.isPublished ? (
                      <Badge className="bg-[#CCFF00]/10 text-[#CCFF00] border-[#CCFF00]/20 text-xs">
                        <Eye className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">PubliÃ©</span>
                      </Badge>
                    ) : (
                      <Badge className="bg-white/5 text-white/40 border-white/10 text-xs">
                        <EyeOff className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">Brouillon</span>
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-white/40 text-xs hidden md:table-cell">
                    {new Date(resource.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(resource)}
                        className="hover:bg-white/5 text-white/60 hover:text-white h-7 w-7 p-0"
                        title="Modifier"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setResourceToDelete(resource);
                          setDeleteDialogOpen(true);
                        }}
                        className="hover:bg-red-500/10 text-red-500 h-7 w-7 p-0"
                        title="Supprimer"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0C0C0C] border-[#CCFF00]/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingResource ? "Modifier la ressource" : "Nouvelle ressource"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              CrÃ©ez une ressource gratuite avec gated content
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {/* Common Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">CatÃ©gorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as Resource["category"] })}
                  >
                    <SelectTrigger className="bg-black/40 border-[#CCFF00]/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0C0C0C] border-[#CCFF00]/20">
                      {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key} className="text-white focus:bg-white/10 focus:text-white">{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Tags (sÃ©parÃ©s par virgule)</Label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="design, ux, guide"
                    className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              {/* Multilingual Content */}
              <div className="border-t border-white/10 pt-4">
                <p className="text-white/60 text-sm mb-4">
                  ðŸŒ Contenu multilingue - Remplissez le franÃ§ais (obligatoire) et l'anglais (optionnel)
                </p>

                <Tabs value={editorLang} onValueChange={(v) => setEditorLang(v as "fr" | "en")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-4">
                    <TabsTrigger 
                      value="fr" 
                      className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C]"
                    >
                      ðŸ‡«ðŸ‡· FranÃ§ais {!formData.title_fr && <span className="ml-1 text-red-400">*</span>}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="en" 
                      className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C]"
                    >
                      ðŸ‡¬ðŸ‡§ English
                    </TabsTrigger>
                  </TabsList>

                  {/* French Content */}
                  <TabsContent value="fr" className="space-y-4">
                    <div>
                      <Label className="text-white">Titre (FranÃ§ais) *</Label>
                      <Input
                        value={formData.title_fr}
                        onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
                        placeholder="Guide ultime du design web"
                        className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-white">Description (FranÃ§ais) *</Label>
                      <Textarea
                        value={formData.description_fr}
                        onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                        placeholder="DÃ©crivez votre ressource en franÃ§ais..."
                        className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                        rows={3}
                        required
                      />
                    </div>

                    {/* French File Upload */}
                    <div>
                      <Label className="text-white">Fichier PDF ou HTML (FranÃ§ais) *</Label>
                      <div className="space-y-2">
                        <div className="flex gap-2 items-center">
                          <div className="flex-1">
                            <Input
                              type="file"
                              accept=".pdf,.html"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, "fr");
                              }}
                              className="bg-black/40 border-[#CCFF00]/20 text-white file:text-white"
                              disabled={uploading}
                            />
                          </div>
                          {formData.fileUrl_fr && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => window.open(formData.fileUrl_fr, "_blank")}
                              className="shrink-0 border-[#CCFF00]/20 hover:bg-[#CCFF00]/10 text-white"
                              title="PrÃ©visualiser le fichier franÃ§ais"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        {uploadedFileName_fr && !uploading && (
                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <FileText className="h-4 w-4 text-[#CCFF00]" />
                            <span>{uploadedFileName_fr}</span>
                            <Badge className="bg-[#CCFF00]/10 text-[#CCFF00] border-[#CCFF00]/20 text-xs">
                              ðŸ‡«ðŸ‡· UploadÃ©
                            </Badge>
                          </div>
                        )}
                        
                        <p className="text-xs text-white/40">
                          Formats acceptÃ©s : PDF, HTML â€¢ Taille max : 10 MB
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* English Content */}
                  <TabsContent value="en" className="space-y-4">
                    <div>
                      <Label className="text-white">Title (English)</Label>
                      <Input
                        value={formData.title_en}
                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                        placeholder="Ultimate Web Design Guide"
                        className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Description (English)</Label>
                      <Textarea
                        value={formData.description_en}
                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                        placeholder="Describe your resource in English..."
                        className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                        rows={3}
                      />
                    </div>

                    {/* English File Upload */}
                    <div>
                      <Label className="text-white">PDF or HTML File (English)</Label>
                      <div className="space-y-2">
                        <div className="flex gap-2 items-center">
                          <div className="flex-1">
                            <Input
                              type="file"
                              accept=".pdf,.html"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, "en");
                              }}
                              className="bg-black/40 border-[#CCFF00]/20 text-white file:text-white"
                              disabled={uploading}
                            />
                          </div>
                          {formData.fileUrl_en && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => window.open(formData.fileUrl_en, "_blank")}
                              className="shrink-0 border-[#CCFF00]/20 hover:bg-[#CCFF00]/10 text-white"
                              title="Preview English file"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        {uploadedFileName_en && !uploading && (
                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <FileText className="h-4 w-4 text-blue-400" />
                            <span>{uploadedFileName_en}</span>
                            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                              ðŸ‡¬ðŸ‡§ Uploaded
                            </Badge>
                          </div>
                        )}
                        
                        <p className="text-xs text-white/40">
                          Accepted formats: PDF, HTML â€¢ Max size: 10 MB
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Upload indicator (shown outside tabs when uploading) */}
              {uploading && (
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2 text-[#CCFF00]">
                    <div className="h-4 w-4 border-2 border-[#CCFF00] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm">Upload en cours...</p>
                  </div>
                </div>
              )}

              <div className="border-t border-white/10 pt-4">
                <Label className="text-white">Image de couverture (URL)</Label>
                <Input
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://..."
                  className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                />
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded border-[#CCFF00]/20 bg-black/40"
                />
                <Label htmlFor="isPublished" className="cursor-pointer text-white">
                  Publier immÃ©diatement
                </Label>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingResource(null);
                  resetForm();
                }}
                className="border-[#CCFF00]/20 text-white hover:bg-white/5"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
                disabled={!formData.title_fr || !formData.fileUrl_fr || uploading}
              >
                {editingResource ? "Mettre Ã  jour" : "CrÃ©er"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title={`Supprimer "${resourceToDelete?.title}"?`}
        description="Cette action est irrÃ©versible. La ressource sera dÃ©finitivement supprimÃ©e."
      />
    </div>
  );
}

