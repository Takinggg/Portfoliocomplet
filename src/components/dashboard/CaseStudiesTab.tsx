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
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  Quote,
  Users,
  Calendar,
  ArrowRight,
  X,
  Globe,
  Layers,
} from "lucide-react";
import { CaseStudy } from "../../utils/freelanceConfig";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { toast } from "sonner";
import type { CaseStudyArchitecture, CaseStudyArchitectureNode } from "../../types/caseStudyArchitecture";

interface CaseStudiesTabProps {
  onRefresh?: () => void;
  loading?: boolean;
}

const generateArchitectureNodeId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `architecture-node-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const createEmptyArchitectureNode = (): CaseStudyArchitectureNode => ({
  id: generateArchitectureNodeId(),
  layer: "",
  title: "",
  description: "",
  connector: "",
});

const createEmptyArchitecture = (): CaseStudyArchitecture => ({
  status: "",
  status_en: "",
  latency: "",
  latency_en: "",
  nodes: [],
});

const ARCHITECTURE_ICON_OPTIONS: Array<{ value: CaseStudyArchitectureNode["icon"]; label: string }> = [
  { value: "smartphone", label: "Smartphone" },
  { value: "cloud", label: "Cloud" },
  { value: "server", label: "Serveur" },
  { value: "database", label: "Base de données" },
  { value: "shield", label: "Sécurité" },
  { value: "layers", label: "Générique" },
];

const ARCHITECTURE_ACCENT_OPTIONS: Array<{ value: CaseStudyArchitectureNode["accent"]; label: string }> = [
  { value: "blue", label: "Bleu" },
  { value: "purple", label: "Violet" },
  { value: "green", label: "Vert" },
  { value: "orange", label: "Orange" },
  { value: "pink", label: "Rose" },
  { value: "teal", label: "Bleu canard" },
];

export function CaseStudiesTab({ onRefresh, loading = false }: CaseStudiesTabProps) {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);
  const [deletingCaseStudy, setDeletingCaseStudy] = useState<CaseStudy | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorLang, setEditorLang] = useState<"fr" | "en">("fr");
  const [activeTab, setActiveTab] = useState("general");

  // Helper function to check if English version is complete
  const hasEnglishVersion = (cs: CaseStudy): boolean => {
    return !!(
      cs.title_en &&
      cs.description_en &&
      cs.tags_en &&
      cs.tags_en.length > 0
    );
  };

  const [formData, setFormData] = useState<Partial<CaseStudy>>({
    title: "",
    title_en: "",
    client: "",
    category: "Website",
    category_en: "",
    year: new Date().getFullYear().toString(),
    featured: false,
    thumbnail: "",
    tagline: "",
    tagline_en: "",
    description: "",
    description_en: "",
    tags: [],
    tags_en: [],
    challenge: {
      title: "",
      title_en: "",
      description: "",
      description_en: "",
      painPoints: [],
      painPoints_en: [],
    },
    solution: {
      title: "",
      title_en: "",
      description: "",
      description_en: "",
      approach: [],
      approach_en: [],
      technologies: [],
    },
    results: {
      title: "",
      title_en: "",
      description: "",
      description_en: "",
      metrics: [],
    },
    testimonial: {
      quote: "",
      quote_en: "",
      author: "",
      role: "",
      role_en: "",
      company: "",
    },
    process: [],
    images: [],
    architecture: createEmptyArchitecture(),
  });

  // Load case studies from Supabase (FULL DB)
  const loadCaseStudies = async () => {
    try {
      console.log("🔍 Loading case studies from Supabase...");
      
      // ✅ Utiliser unifiedDataService.ts (Supabase uniquement, FULL DB)
      const { fetchCaseStudies } = await import("../../utils/unifiedDataService");
      
      const loadedCaseStudies = await fetchCaseStudies();
      
      console.log(`✅ Case studies chargées depuis Supabase:`, loadedCaseStudies.length);
      console.log("📋 Case studies IDs:", loadedCaseStudies.map(cs => cs.id));
      
      setCaseStudies(loadedCaseStudies);
      
      if (loadedCaseStudies.length === 0) {
        toast.info("Aucune case study. Utilisez le bouton '+' pour en créer.", {
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error("❌ Error loading case studies:", error);
      
      // Message d'erreur détaillé avec instructions de déploiement
      if (error.message.includes("fetch") || error.message.includes("network")) {
        toast.error("❌ Serveur Supabase non déployé. Consultez DEPLOYMENT_GUIDE_SUPABASE.md", {
          duration: 8000,
        });
      } else {
        toast.error(`Erreur: ${error.message}`, {
          duration: 4000,
        });
      }
      
      setCaseStudies([]);
    }
  };

  useEffect(() => {
    loadCaseStudies();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      title_en: "",
      client: "",
      category: "Website",
      category_en: "",
      year: new Date().getFullYear().toString(),
      featured: false,
      thumbnail: "",
      tagline: "",
      tagline_en: "",
      description: "",
      description_en: "",
      tags: [],
      tags_en: [],
      challenge: {
        title: "",
        title_en: "",
        description: "",
        description_en: "",
        painPoints: [],
        painPoints_en: [],
      },
      solution: {
        title: "",
        title_en: "",
        description: "",
        description_en: "",
        approach: [],
        approach_en: [],
        technologies: [],
      },
      results: {
        title: "",
        title_en: "",
        description: "",
        description_en: "",
        metrics: [],
      },
      testimonial: {
        quote: "",
        quote_en: "",
        author: "",
        role: "",
        role_en: "",
        company: "",
      },
      process: [],
      images: [],
      architecture: createEmptyArchitecture(),
    });
    setEditorLang("fr");
    setActiveTab("general");
  };

  // Open edit dialog with existing data
  const openEditDialog = (cs: CaseStudy) => {
    setEditingCaseStudy(cs);
    setFormData({
      title: cs.title || "",
      title_en: cs.title_en || "",
      client: cs.client || "",
      category: cs.category || "Website",
      category_en: cs.category_en || "",
      year: cs.year || new Date().getFullYear().toString(),
      featured: cs.featured || false,
      thumbnail: cs.thumbnail || "",
      tagline: cs.tagline || "",
      tagline_en: cs.tagline_en || "",
      description: cs.description || "",
      description_en: cs.description_en || "",
      tags: cs.tags || [],
      tags_en: cs.tags_en || [],
      challenge: {
        title: cs.challenge?.title || "",
        title_en: cs.challenge?.title_en || "",
        description: cs.challenge?.description || "",
        description_en: cs.challenge?.description_en || "",
        painPoints: cs.challenge?.painPoints || [],
        painPoints_en: cs.challenge?.painPoints_en || [],
      },
      solution: {
        title: cs.solution?.title || "",
        title_en: cs.solution?.title_en || "",
        description: cs.solution?.description || "",
        description_en: cs.solution?.description_en || "",
        approach: cs.solution?.approach || [],
        approach_en: cs.solution?.approach_en || [],
        technologies: cs.solution?.technologies || [],
      },
      results: {
        title: cs.results?.title || "",
        title_en: cs.results?.title_en || "",
        description: cs.results?.description || "",
        description_en: cs.results?.description_en || "",
        metrics: cs.results?.metrics || [],
      },
      testimonial: {
        quote: cs.testimonial?.quote || "",
        quote_en: cs.testimonial?.quote_en || "",
        author: cs.testimonial?.author || "",
        role: cs.testimonial?.role || "",
        role_en: cs.testimonial?.role_en || "",
        company: cs.testimonial?.company || "",
      },
      process: cs.process || [],
      images: cs.images || [],
      architecture: cs.architecture
        ? {
            status: cs.architecture.status || "",
            status_en: cs.architecture.status_en || "",
            latency: cs.architecture.latency || "",
            latency_en: cs.architecture.latency_en || "",
            nodes: cs.architecture.nodes?.map((node) => ({
              ...node,
              id: node.id || generateArchitectureNodeId(),
            })) || [],
          }
        : createEmptyArchitecture(),
    });
    setIsCreateOpen(true);
  };

  // Handle create/edit using unified service
  const handleSubmit = async () => {
    if (!formData.title || !formData.client) {
      toast.error("Veuillez remplir tous les champs obligatoires (FR)");
      return;
    }

    setIsSubmitting(true);

    try {
      // Récupérer le token d'authentification
      const { createClient } = await import("../../utils/supabase/client");
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        setIsSubmitting(false);
        return;
      }

      const caseStudyData: any = {
        id: editingCaseStudy?.id || `case-study-${Date.now()}`,
        slug: formData.slug || `case-study-${Date.now()}`,
        title: formData.title!,
        title_en: formData.title_en || "",
        client: formData.client!,
        category: formData.category!,
        category_en: formData.category_en || "",
        year: formData.year!,
        featured: formData.featured!,
        thumbnail: formData.thumbnail!,
        tagline: formData.tagline!,
        tagline_en: formData.tagline_en || "",
        description: formData.description!,
        description_en: formData.description_en || "",
        tags: formData.tags!,
        tags_en: formData.tags_en || [],
        challenge: {
          ...formData.challenge!,
          title_en: formData.challenge!.title_en || "",
          description_en: formData.challenge!.description_en || "",
          painPoints_en: formData.challenge!.painPoints_en || [],
        },
        solution: {
          ...formData.solution!,
          title_en: formData.solution!.title_en || "",
          description_en: formData.solution!.description_en || "",
          approach_en: formData.solution!.approach_en || [],
        },
        results: {
          ...formData.results!,
          title_en: formData.results!.title_en || "",
          description_en: formData.results!.description_en || "",
        },
        testimonial: {
          ...formData.testimonial!,
          quote_en: formData.testimonial!.quote_en || "",
          role_en: formData.testimonial!.role_en || "",
        },
        process: formData.process!.map(step => ({
          ...step,
          phase_en: step.phase_en || "",
          title_en: step.title_en || "",
          description_en: step.description_en || "",
          duration_en: step.duration_en || "",
        })),
        images: formData.images!,
        video: formData.video,
        architecture:
          formData.architecture &&
          (formData.architecture.nodes.length > 0 || formData.architecture.status || formData.architecture.latency)
            ? {
                status: formData.architecture.status || "",
                status_en: formData.architecture.status_en || "",
                latency: formData.architecture.latency || "",
                latency_en: formData.architecture.latency_en || "",
                nodes: formData.architecture.nodes.map((node) => ({
                  ...node,
                  id: node.id || generateArchitectureNodeId(),
                  layer: node.layer || "",
                  layer_en: node.layer_en || "",
                  title: node.title || "",
                  title_en: node.title_en || "",
                  description: node.description || "",
                  description_en: node.description_en || "",
                  connector: node.connector || "",
                  connector_en: node.connector_en || "",
                })),
              }
            : undefined,
      };

      console.log("📤 Saving case study data:", caseStudyData);

      // Utiliser le service unifié
      const { createCaseStudy, updateCaseStudy } = await import("../../utils/unifiedDataService");
      
      if (editingCaseStudy) {
        await updateCaseStudy(editingCaseStudy.id, caseStudyData, session.access_token);
        toast.success("Étude de cas mise à jour avec succès");
      } else {
        await createCaseStudy(caseStudyData, session.access_token);
        toast.success("Étude de cas créée avec succès");
      }

      await loadCaseStudies();
      setIsCreateOpen(false);
      setEditingCaseStudy(null);
      resetForm();
      onRefresh?.();
    } catch (error: any) {
      console.error("Error saving case study:", error);
      toast.error(`Erreur lors de la sauvegarde: ${error.message || "Erreur inconnue"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete using unified service
  const handleDelete = async () => {
    if (!deletingCaseStudy) return;

    try {
      console.log("🗑️ Attempting to delete case study:", deletingCaseStudy.id);

      // Récupérer le token d'authentification
      const { createClient } = await import("../../utils/supabase/client");
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        return;
      }

      // Utiliser le service unifié
      const { deleteCaseStudy } = await import("../../utils/unifiedDataService");
      await deleteCaseStudy(deletingCaseStudy.id, session.access_token);

      console.log("✅ Case study supprimé avec succès:", deletingCaseStudy.id);
      toast.success("Étude de cas supprimée avec succès");
      
      await loadCaseStudies();
      setDeletingCaseStudy(null);
      onRefresh?.();
    } catch (error: any) {
      console.error("❌ Error deleting case study:", error);
      toast.error(`Erreur lors de la suppression: ${error.message || "Erreur inconnue"}`);
    }
  };

  // Add/remove items from arrays
  const addArrayItem = (field: string, value: string, lang: "fr" | "en" = "fr") => {
    console.log(`🏷️ addArrayItem called:`, { field, value, lang });
    if (!value.trim()) {
      console.log(`⚠️ Value is empty, returning`);
      return;
    }

    if (field === "tags") {
      if (lang === "en") {
        const newTagsEn = [...(formData.tags_en || []), value.trim()];
        console.log(`✅ Adding EN tag:`, { currentTags: formData.tags_en, newTag: value.trim(), result: newTagsEn });
        setFormData({
          ...formData,
          tags_en: newTagsEn,
        });
      } else {
        const newTagsFr = [...(formData.tags || []), value.trim()];
        console.log(`✅ Adding FR tag:`, { currentTags: formData.tags, newTag: value.trim(), result: newTagsFr });
        setFormData({
          ...formData,
          tags: newTagsFr,
        });
      }
    } else if (field === "painPoints") {
      if (lang === "en") {
        setFormData({
          ...formData,
          challenge: {
            ...formData.challenge!,
            painPoints_en: [...(formData.challenge?.painPoints_en || []), value.trim()],
          },
        });
      } else {
        setFormData({
          ...formData,
          challenge: {
            ...formData.challenge!,
            painPoints: [...(formData.challenge?.painPoints || []), value.trim()],
          },
        });
      }
    } else if (field === "approach") {
      if (lang === "en") {
        setFormData({
          ...formData,
          solution: {
            ...formData.solution!,
            approach_en: [...(formData.solution?.approach_en || []), value.trim()],
          },
        });
      } else {
        setFormData({
          ...formData,
          solution: {
            ...formData.solution!,
            approach: [...(formData.solution?.approach || []), value.trim()],
          },
        });
      }
    } else if (field === "technologies") {
      setFormData({
        ...formData,
        solution: {
          ...formData.solution!,
          technologies: [...(formData.solution?.technologies || []), value.trim()],
        },
      });
    } else if (field === "images") {
      setFormData({
        ...formData,
        images: [...(formData.images || []), value.trim()],
      });
    }
  };

  const removeArrayItem = (field: string, index: number, lang: "fr" | "en" = "fr") => {
    if (field === "tags") {
      if (lang === "en") {
        console.log(`🗑️ Removing EN tag at index ${index}`);
        setFormData({
          ...formData,
          tags_en: formData.tags_en?.filter((_, i) => i !== index),
        });
      } else {
        console.log(`🗑️ Removing FR tag at index ${index}`);
        setFormData({
          ...formData,
          tags: formData.tags?.filter((_, i) => i !== index),
        });
      }
    } else if (field === "painPoints") {
      if (lang === "en") {
        setFormData({
          ...formData,
          challenge: {
            ...formData.challenge!,
            painPoints_en: formData.challenge?.painPoints_en?.filter((_, i) => i !== index),
          },
        });
      } else {
        setFormData({
          ...formData,
          challenge: {
            ...formData.challenge!,
            painPoints: formData.challenge?.painPoints?.filter((_, i) => i !== index),
          },
        });
      }
    } else if (field === "approach") {
      if (lang === "en") {
        setFormData({
          ...formData,
          solution: {
            ...formData.solution!,
            approach_en: formData.solution?.approach_en?.filter((_, i) => i !== index),
          },
        });
      } else {
        setFormData({
          ...formData,
          solution: {
            ...formData.solution!,
            approach: formData.solution?.approach?.filter((_, i) => i !== index),
          },
        });
      }
    } else if (field === "technologies") {
      setFormData({
        ...formData,
        solution: {
          ...formData.solution!,
          technologies: formData.solution?.technologies?.filter((_, i) => i !== index),
        },
      });
    } else if (field === "images") {
      setFormData({
        ...formData,
        images: formData.images?.filter((_, i) => i !== index),
      });
    }
  };

  const ensureArchitecture = (): CaseStudyArchitecture => formData.architecture ?? createEmptyArchitecture();

  const updateArchitectureField = (field: keyof CaseStudyArchitecture, value: string) => {
    const architecture = ensureArchitecture();
    setFormData({
      ...formData,
      architecture: {
        ...architecture,
        [field]: value,
      },
    });
  };

  const addArchitectureNode = () => {
    const architecture = ensureArchitecture();
    setFormData({
      ...formData,
      architecture: {
        ...architecture,
        nodes: [...architecture.nodes, createEmptyArchitectureNode()],
      },
    });
  };

  const updateArchitectureNode = (
    index: number,
    field: keyof CaseStudyArchitectureNode,
    value: CaseStudyArchitectureNode[keyof CaseStudyArchitectureNode]
  ) => {
    const architecture = ensureArchitecture();
    const nodes = [...architecture.nodes];
    nodes[index] = {
      ...nodes[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      architecture: {
        ...architecture,
        nodes,
      },
    });
  };

  const removeArchitectureNode = (index: number) => {
    const architecture = ensureArchitecture();
    setFormData({
      ...formData,
      architecture: {
        ...architecture,
        nodes: architecture.nodes.filter((_, i) => i !== index),
      },
    });
  };

  const addMetric = () => {
    setFormData({
      ...formData,
      results: {
        ...formData.results!,
        metrics: [
          ...(formData.results?.metrics || []),
          { label: "", label_en: "", value: "", change: "", positive: true },
        ],
      },
    });
  };

  const updateMetric = (index: number, field: string, value: any) => {
    const updatedMetrics = [...(formData.results?.metrics || [])];
    updatedMetrics[index] = { ...updatedMetrics[index], [field]: value };
    setFormData({
      ...formData,
      results: {
        ...formData.results!,
        metrics: updatedMetrics,
      },
    });
  };

  const removeMetric = (index: number) => {
    setFormData({
      ...formData,
      results: {
        ...formData.results!,
        metrics: formData.results?.metrics?.filter((_, i) => i !== index),
      },
    });
  };

  const addProcessStep = () => {
    setFormData({
      ...formData,
      process: [
        ...(formData.process || []),
        { 
          phase: "", 
          phase_en: "",
          title: "", 
          title_en: "",
          description: "", 
          description_en: "",
          duration: "",
          duration_en: ""
        },
      ],
    });
  };

  const updateProcessStep = (index: number, field: string, value: string) => {
    const updatedProcess = [...(formData.process || [])];
    updatedProcess[index] = { ...updatedProcess[index], [field]: value };
    setFormData({
      ...formData,
      process: updatedProcess,
    });
  };

  const removeProcessStep = (index: number) => {
    setFormData({
      ...formData,
      process: formData.process?.filter((_, i) => i !== index),
    });
  };

  const filteredCaseStudies = caseStudies.filter((cs) => {
    const matchesSearch =
      cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || cs.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white mb-2">Études de Cas</h2>
          <p className="text-white/60">
            Gérez vos études de cas détaillées avec métriques et témoignages
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={async () => {
              if (window.confirm("Voulez-vous initialiser les études de cas bilingues dans Supabase ?\n\nCela va :\n1. Vider la liste de suppression permanente\n2. Charger 3 études de cas professionnelles (FR + EN)\n3. Synchroniser avec la database Supabase\n4. Afficher les données")) {
                try {
                  toast.info("🔄 Initialisation Supabase en cours...");
                  
                  console.log("🗑️ Étape 1/4 : Suppression de la liste noire...");
                  // Vider la liste de suppression permanente (bonne clé)
                  localStorage.removeItem("deleted_case_studies");
                  
                  console.log("📦 Étape 2/4 : Génération des case studies bilingues...");
                  // Importer les données bilingues
                  const { bilingualCaseStudies } = await import("../../utils/caseStudiesDataBilingual");
                  const { convertBilingualToCaseStudy } = await import("../../utils/seedBilingualCaseStudies");
                  
                  // Convertir en format CaseStudy
                  const caseStudiesData = bilingualCaseStudies.map(convertBilingualToCaseStudy);
                  console.log("📋 Case studies générées:", caseStudiesData.length);
                  
                  console.log("☁️ Étape 3/4 : Envoi vers Supabase...");
                  // Envoyer au serveur Supabase via bulk create
                  const { projectId, publicAnonKey } = await import("../../utils/supabase/info");
                  
                  const response = await fetch(
                    `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/case-studies/bulk`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${publicAnonKey}`,
                      },
                      body: JSON.stringify({ caseStudies: caseStudiesData }),
                    }
                  );
                  
                  if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Erreur serveur: ${errorText}`);
                  }
                  
                  const result = await response.json();
                  console.log("✅ Supabase sync result:", result);
                  
                  console.log("📥 Étape 4/4 : Rechargement depuis Supabase...");
                  // Recharger depuis le serveur
                  await loadCaseStudies();
                  
                  console.log("✅ Initialisation Supabase terminée !");
                  toast.success(`✅ ${result.count} case studies synchronisées avec Supabase !`);
                  
                } catch (error: any) {
                  console.error("❌ Erreur lors de l'initialisation Supabase:", error);
                  toast.error(`Erreur: ${error.message}`);
                }
              }
            }}
            variant="outline"
            className="border-[#CCFF00]/30 text-[#CCFF00] hover:bg-[#CCFF00]/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Initialiser
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setEditingCaseStudy(null);
              setIsCreateOpen(true);
            }}
            className="bg-[#CCFF00] text-[#0C0C0C] hover:bg-[#CCFF00]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle étude de cas
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Total</p>
              <p className="text-2xl text-white">{caseStudies.length}</p>
            </div>
            <Sparkles className="h-8 w-8 text-[#CCFF00]" />
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Featured</p>
              <p className="text-2xl text-white">
                {caseStudies.filter((cs) => cs.featured).length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-[#CCFF00]" />
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 inline" />
                  Multilingues
                </span>
              </p>
              <p className="text-2xl text-white">
                {caseStudies.filter((cs) => hasEnglishVersion(cs)).length}
              </p>
            </div>
            <Globe className="h-8 w-8 text-blue-400" />
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">E-commerce</p>
              <p className="text-2xl text-white">
                {caseStudies.filter((cs) => cs.category === "E-commerce").length}
              </p>
            </div>
            <Zap className="h-8 w-8 text-[#CCFF00]" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder="Rechercher une étude de cas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[200px] bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem value="E-commerce">E-commerce</SelectItem>
            <SelectItem value="SaaS">SaaS</SelectItem>
            <SelectItem value="Website">Website</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Case Studies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCaseStudies.map((cs) => (
            <motion.div
              key={cs.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-white/5 border-white/10 p-6 hover:bg-white/10 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {cs.featured && (
                        <Badge className="bg-[#CCFF00]/20 text-[#CCFF00] border-[#CCFF00]/40">
                          Featured
                        </Badge>
                      )}
                      <Badge className="bg-white/10 text-white border-white/20">
                        {cs.category}
                      </Badge>
                      {hasEnglishVersion(cs) && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40 flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          EN
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-white mb-1">{cs.title}</h3>
                    <p className="text-sm text-white/60 mb-2">{cs.client}</p>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Calendar className="h-3 w-3" />
                      <span>{cs.year}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-white/60 mb-4 line-clamp-2">
                  {cs.tagline}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {cs.tags?.slice(0, 3).map((tag, i) => (
                    <Badge
                      key={i}
                      className="bg-white/5 text-white/70 border-white/10 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => openEditDialog(cs)}
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    onClick={() => setDeletingCaseStudy(cs)}
                    variant="outline"
                    size="sm"
                    className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredCaseStudies.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Sparkles className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">Aucune étude de cas trouvée</p>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={() => {
        setIsCreateOpen(false);
        setEditingCaseStudy(null);
        resetForm();
      }}>
        <DialogContent className="bg-[#0C0C0C] border-white/10 text-white max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCaseStudy ? "Modifier l'étude de cas" : "Nouvelle étude de cas"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {editingCaseStudy
                ? "Modifiez les informations de votre étude de cas"
                : "Créez une nouvelle étude de cas détaillée"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <p className="text-white/60 text-sm">
              🌍 Contenu multilingue - Remplissez le français (obligatoire) et l'anglais (optionnel)
            </p>

            {/* Main Tabs: General / Challenge / Solution / Results / Extras */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-white/5">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="challenge">Défi</TabsTrigger>
                <TabsTrigger value="solution">Solution</TabsTrigger>
                <TabsTrigger value="results">Résultats</TabsTrigger>
                <TabsTrigger value="architecture">Architecture</TabsTrigger>
                <TabsTrigger value="extras">Extras</TabsTrigger>
              </TabsList>

              {/* GENERAL TAB */}
              <TabsContent value="general" className="space-y-4 mt-4">
                {/* Common fields (no language variation) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client" className="text-white/80">
                      Client *
                    </Label>
                    <Input
                      id="client"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Nom du client"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year" className="text-white/80">
                      Année
                    </Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="featured" className="text-white/80">
                    Featured (Mise en avant)
                  </Label>
                </div>

                <div>
                  <Label htmlFor="thumbnail" className="text-white/80">
                    Thumbnail (recherche Unsplash)
                  </Label>
                  <Input
                    id="thumbnail"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="luxury ecommerce"
                  />
                </div>

                {/* Language Tabs for translated fields */}
                <div className="border-t border-white/10 pt-4">
                  <Tabs value={editorLang} onValueChange={(v) => setEditorLang(v as "fr" | "en")} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-4">
                      <TabsTrigger 
                        value="fr" 
                        className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C]"
                      >
                        🇫🇷 Français {!formData.title && <span className="ml-1 text-red-400">*</span>}
                      </TabsTrigger>
                      <TabsTrigger 
                        value="en" 
                        className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C]"
                      >
                        🇬🇧 English
                      </TabsTrigger>
                    </TabsList>

                    {/* FRENCH CONTENT */}
                    <TabsContent value="fr" className="space-y-4">
                      <div>
                        <Label htmlFor="title_fr" className="text-white/80">
                          Titre (Français) *
                        </Label>
                        <Input
                          id="title_fr"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="Refonte e-commerce luxe..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category_fr" className="text-white/80">
                          Catégorie (Français)
                        </Label>
                        <Select
                          value={formData.category?.startsWith("Autre:") ? "Autre" : formData.category}
                          onValueChange={(value) => {
                            if (value === "Autre") {
                              setFormData({ ...formData, category: "Autre: " });
                            } else {
                              setFormData({ ...formData, category: value });
                            }
                          }}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="E-commerce">E-commerce</SelectItem>
                            <SelectItem value="SaaS">SaaS</SelectItem>
                            <SelectItem value="Site Web">Site Web</SelectItem>
                            <SelectItem value="Application Mobile">Application Mobile</SelectItem>
                            <SelectItem value="Application Web">Application Web</SelectItem>
                            <SelectItem value="Page d'Atterrissage">Page d'Atterrissage</SelectItem>
                            <SelectItem value="Identité de Marque">Identité de Marque</SelectItem>
                            <SelectItem value="Design UI/UX">Design UI/UX</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Tableau de Bord">Tableau de Bord</SelectItem>
                            <SelectItem value="Portfolio">Portfolio</SelectItem>
                            <SelectItem value="Blog">Blog</SelectItem>
                            <SelectItem value="Autre">Autre (préciser)</SelectItem>
                          </SelectContent>
                        </Select>
                        {formData.category?.startsWith("Autre:") && (
                          <Input
                            value={formData.category.replace("Autre: ", "")}
                            onChange={(e) => setFormData({ ...formData, category: `Autre: ${e.target.value}` })}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="Préciser la catégorie..."
                          />
                        )}
                      </div>

                      <div>
                        <Label htmlFor="tagline_fr" className="text-white/80">
                          Tagline (Français)
                        </Label>
                        <Input
                          id="tagline_fr"
                          value={formData.tagline}
                          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="Transformation digitale d'une maison de luxe..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="description_fr" className="text-white/80">
                          Description (Français)
                        </Label>
                        <Textarea
                          id="description_fr"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="Description courte du projet..."
                          rows={3}
                        />
                      </div>

                      {/* Tags FR */}
                      <div>
                        <Label className="text-white/80 mb-2 block">Tags (Français)</Label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            id="tagInput_fr"
                            placeholder="Ajouter un tag..."
                            className="bg-white/5 border-white/10 text-white"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addArrayItem("tags", e.currentTarget.value, "fr");
                                e.currentTarget.value = "";
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById("tagInput_fr") as HTMLInputElement;
                              addArrayItem("tags", input.value, "fr");
                              input.value = "";
                            }}
                            className="bg-[#CCFF00]/20 text-[#CCFF00] hover:bg-[#CCFF00]/30"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags?.map((tag, index) => (
                            <Badge
                              key={index}
                              className="bg-[#CCFF00]/20 text-[#CCFF00] cursor-pointer hover:bg-red-500/20 hover:text-red-400"
                              onClick={() => removeArrayItem("tags", index, "fr")}
                            >
                              {tag}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* ENGLISH CONTENT */}
                    <TabsContent value="en" className="space-y-4">
                      <div>
                        <Label htmlFor="title_en" className="text-white/80">
                          Title (English)
                        </Label>
                        <Input
                          id="title_en"
                          value={formData.title_en}
                          onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="Luxury e-commerce redesign..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category_en" className="text-white/80">
                          Category (English)
                        </Label>
                        <Select
                          value={formData.category_en?.startsWith("Other:") ? "Other" : formData.category_en}
                          onValueChange={(value) => {
                            if (value === "Other") {
                              setFormData({ ...formData, category_en: "Other: " });
                            } else {
                              setFormData({ ...formData, category_en: value });
                            }
                          }}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="E-commerce">E-commerce</SelectItem>
                            <SelectItem value="SaaS">SaaS</SelectItem>
                            <SelectItem value="Website">Website</SelectItem>
                            <SelectItem value="Mobile App">Mobile App</SelectItem>
                            <SelectItem value="Web App">Web App</SelectItem>
                            <SelectItem value="Landing Page">Landing Page</SelectItem>
                            <SelectItem value="Brand Identity">Brand Identity</SelectItem>
                            <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Dashboard">Dashboard</SelectItem>
                            <SelectItem value="Portfolio">Portfolio</SelectItem>
                            <SelectItem value="Blog">Blog</SelectItem>
                            <SelectItem value="Other">Other (please specify)</SelectItem>
                          </SelectContent>
                        </Select>
                        {formData.category_en?.startsWith("Other:") && (
                          <Input
                            value={formData.category_en.replace("Other: ", "")}
                            onChange={(e) => setFormData({ ...formData, category_en: `Other: ${e.target.value}` })}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="Specify category..."
                          />
                        )}
                      </div>

                      <div>
                        <Label htmlFor="tagline_en" className="text-white/80">
                          Tagline (English)
                        </Label>
                        <Input
                          id="tagline_en"
                          value={formData.tagline_en}
                          onChange={(e) => setFormData({ ...formData, tagline_en: e.target.value })}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="Digital transformation of a luxury brand..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="description_en" className="text-white/80">
                          Description (English)
                        </Label>
                        <Textarea
                          id="description_en"
                          value={formData.description_en}
                          onChange={(e) =>
                            setFormData({ ...formData, description_en: e.target.value })
                          }
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="Short project description..."
                          rows={3}
                        />
                      </div>

                      {/* Tags EN */}
                      <div>
                        <Label className="text-white/80 mb-2 block">Tags (English)</Label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            id="tagInput_en"
                            placeholder="Add a tag..."
                            className="bg-white/5 border-white/10 text-white"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addArrayItem("tags", e.currentTarget.value, "en");
                                e.currentTarget.value = "";
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById("tagInput_en") as HTMLInputElement;
                              addArrayItem("tags", input.value, "en");
                              input.value = "";
                            }}
                            className="bg-[#CCFF00]/20 text-[#CCFF00] hover:bg-[#CCFF00]/30"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags_en?.map((tag, index) => (
                            <Badge
                              key={index}
                              className="bg-[#CCFF00]/20 text-[#CCFF00] cursor-pointer hover:bg-red-500/20 hover:text-red-400"
                              onClick={() => removeArrayItem("tags", index, "en")}
                            >
                              {tag}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>

              {/* CHALLENGE TAB */}
              <TabsContent value="challenge" className="space-y-4 mt-4">
                <Tabs value={editorLang} onValueChange={(v) => setEditorLang(v as "fr" | "en")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-4">
                    <TabsTrigger 
                      value="fr" 
                      className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C]"
                    >
                      🇫🇷 Français
                    </TabsTrigger>
                    <TabsTrigger 
                      value="en" 
                      className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C]"
                    >
                      🇬🇧 English
                    </TabsTrigger>
                  </TabsList>

                  {/* FRENCH CHALLENGE */}
                  <TabsContent value="fr" className="space-y-4">
                    <div>
                      <Label htmlFor="challengeTitle_fr" className="text-white/80">
                        Titre du défi (Français)
                      </Label>
                      <Input
                        id="challengeTitle_fr"
                        value={formData.challenge?.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            challenge: { ...formData.challenge!, title: e.target.value },
                          })
                        }
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Un site obsolète qui freinait la croissance"
                      />
                    </div>

                    <div>
                      <Label htmlFor="challengeDescription_fr" className="text-white/80">
                        Description du défi (Français)
                      </Label>
                      <Textarea
                        id="challengeDescription_fr"
                        value={formData.challenge?.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            challenge: { ...formData.challenge!, description: e.target.value },
                          })
                        }
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Description détaillée du problème..."
                        rows={4}
                      />
                    </div>

                    {/* Pain Points FR */}
                    <div>
                      <Label className="text-white/80 mb-2 block">Points de friction (Français)</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          id="painPointInput_fr"
                          placeholder="Ajouter un point de friction..."
                          className="bg-white/5 border-white/10 text-white"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addArrayItem("painPoints", e.currentTarget.value, "fr");
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById("painPointInput_fr") as HTMLInputElement;
                            addArrayItem("painPoints", input.value, "fr");
                            input.value = "";
                          }}
                          className="bg-[#CCFF00]/20 text-[#CCFF00] hover:bg-[#CCFF00]/30"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {formData.challenge?.painPoints?.map((point, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-white/5 rounded border border-white/10"
                          >
                            <span className="flex-1 text-white/80 text-sm">{point}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeArrayItem("painPoints", index, "fr")}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* ENGLISH CHALLENGE */}
                  <TabsContent value="en" className="space-y-4">
                    <div>
                      <Label htmlFor="challengeTitle_en" className="text-white/80">
                        Challenge Title (English)
                      </Label>
                      <Input
                        id="challengeTitle_en"
                        value={formData.challenge?.title_en}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            challenge: { ...formData.challenge!, title_en: e.target.value },
                          })
                        }
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="An outdated website that hindered growth"
                      />
                    </div>

                    <div>
                      <Label htmlFor="challengeDescription_en" className="text-white/80">
                        Challenge Description (English)
                      </Label>
                      <Textarea
                        id="challengeDescription_en"
                        value={formData.challenge?.description_en}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            challenge: { ...formData.challenge!, description_en: e.target.value },
                          })
                        }
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Detailed description of the problem..."
                        rows={4}
                      />
                    </div>

                    {/* Pain Points EN */}
                    <div>
                      <Label className="text-white/80 mb-2 block">Pain Points (English)</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          id="painPointInput_en"
                          placeholder="Add a pain point..."
                          className="bg-white/5 border-white/10 text-white"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addArrayItem("painPoints", e.currentTarget.value, "en");
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById("painPointInput_en") as HTMLInputElement;
                            addArrayItem("painPoints", input.value, "en");
                            input.value = "";
                          }}
                          className="bg-[#CCFF00]/20 text-[#CCFF00] hover:bg-[#CCFF00]/30"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {formData.challenge?.painPoints_en?.map((point, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-white/5 rounded border border-white/10"
                          >
                            <span className="flex-1 text-white/80 text-sm">{point}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeArrayItem("painPoints", index, "en")}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* SOLUTION TAB */}
              <TabsContent value="solution" className="space-y-4 mt-4">
                <Tabs value={editorLang} onValueChange={(v) => setEditorLang(v as "fr" | "en")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-4">
                    <TabsTrigger 
                      value="fr" 
                      className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C]"
                    >
                      🇫🇷 Français
                    </TabsTrigger>
                    <TabsTrigger 
                      value="en" 
                      className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C]"
                    >
                      🇬🇧 English
                    </TabsTrigger>
                  </TabsList>

                  {/* FRENCH SOLUTION */}
                  <TabsContent value="fr" className="space-y-4">
                    <div>
                      <Label htmlFor="solutionTitle_fr" className="text-white/80">
                        Titre de la solution (Français)
                      </Label>
                      <Input
                        id="solutionTitle_fr"
                        value={formData.solution?.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            solution: { ...formData.solution!, title: e.target.value },
                          })
                        }
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Une refonte complète centrée utilisateur"
                      />
                    </div>

                    <div>
                      <Label htmlFor="solutionDescription_fr" className="text-white/80">
                        Description de la solution (Français)
                      </Label>
                      <Textarea
                        id="solutionDescription_fr"
                        value={formData.solution?.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            solution: { ...formData.solution!, description: e.target.value },
                          })
                        }
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Description détaillée de la solution mise en place..."
                        rows={4}
                      />
                    </div>

                    {/* Approach FR */}
                    <div>
                      <Label className="text-white/80 mb-2 block">Approche (Français)</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          id="approachInput_fr"
                          placeholder="Ajouter une étape de l'approche..."
                          className="bg-white/5 border-white/10 text-white"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addArrayItem("approach", e.currentTarget.value, "fr");
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById("approachInput_fr") as HTMLInputElement;
                            addArrayItem("approach", input.value, "fr");
                            input.value = "";
                          }}
                          className="bg-[#CCFF00]/20 text-[#CCFF00] hover:bg-[#CCFF00]/30"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {formData.solution?.approach?.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-white/5 rounded border border-white/10"
                          >
                            <span className="flex-1 text-white/80 text-sm">{item}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeArrayItem("approach", index, "fr")}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technologies (same for FR/EN) */}
                    <div>
                      <Label className="text-white/80 mb-2 block">Technologies (identique FR/EN)</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          id="technologiesInput"
                          placeholder="Ajouter une technologie..."
                          className="bg-white/5 border-white/10 text-white"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addArrayItem("technologies", e.currentTarget.value);
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById("technologiesInput") as HTMLInputElement;
                            addArrayItem("technologies", input.value);
                            input.value = "";
                          }}
                          className="bg-[#CCFF00]/20 text-[#CCFF00] hover:bg-[#CCFF00]/30"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.solution?.technologies?.map((tech, index) => (
                          <Badge
                            key={index}
                            className="bg-[#CCFF00]/20 text-[#CCFF00] cursor-pointer hover:bg-red-500/20 hover:text-red-400"
                            onClick={() => removeArrayItem("technologies", index)}
                          >
                            {tech}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* ENGLISH SOLUTION */}
                  <TabsContent value="en" className="space-y-4">
                    <div>
                      <Label htmlFor="solutionTitle_en" className="text-white/80">
                        Solution Title (English)
                      </Label>
                      <Input
                        id="solutionTitle_en"
                        value={formData.solution?.title_en}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            solution: { ...formData.solution!, title_en: e.target.value },
                          })
                        }
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="A complete user-centered redesign"
                      />
                    </div>

                    <div>
                      <Label htmlFor="solutionDescription_en" className="text-white/80">
                        Solution Description (English)
                      </Label>
                      <Textarea
                        id="solutionDescription_en"
                        value={formData.solution?.description_en}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            solution: { ...formData.solution!, description_en: e.target.value },
                          })
                        }
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Detailed description of the implemented solution..."
                        rows={4}
                      />
                    </div>

                    {/* Approach EN */}
                    <div>
                      <Label className="text-white/80 mb-2 block">Approach (English)</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          id="approachInput_en"
                          placeholder="Add an approach step..."
                          className="bg-white/5 border-white/10 text-white"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addArrayItem("approach", e.currentTarget.value, "en");
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById("approachInput_en") as HTMLInputElement;
                            addArrayItem("approach", input.value, "en");
                            input.value = "";
                          }}
                          className="bg-[#CCFF00]/20 text-[#CCFF00] hover:bg-[#CCFF00]/30"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {formData.solution?.approach_en?.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-white/5 rounded border border-white/10"
                          >
                            <span className="flex-1 text-white/80 text-sm">{item}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeArrayItem("approach", index, "en")}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* RESULTS TAB */}
              <TabsContent value="results" className="space-y-4 mt-4">
                <Tabs value={editorLang} onValueChange={(v) => setEditorLang(v as "fr" | "en")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-4">
                    <TabsTrigger 
                      value="fr" 
                      className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C]"
                    >
                      🇫🇷 Français
                    </TabsTrigger>
                    <TabsTrigger 
                      value="en" 
                      className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C]"
                    >
                      🇬🇧 English
                    </TabsTrigger>
                  </TabsList>

                  {/* FRENCH RESULTS */}
                  <TabsContent value="fr" className="space-y-4">
                    <div>
                      <Label htmlFor="resultsTitle_fr" className="text-white/80">
                        Titre des résultats (Français)
                      </Label>
                      <Input
                        id="resultsTitle_fr"
                        value={formData.results?.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            results: { ...formData.results!, title: e.target.value },
                          })
                        }
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Des résultats mesurables et impressionnants"
                      />
                    </div>

                    <div>
                      <Label htmlFor="resultsDescription_fr" className="text-white/80">
                        Description des résultats (Français)
                      </Label>
                      <Textarea
                        id="resultsDescription_fr"
                        value={formData.results?.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            results: { ...formData.results!, description: e.target.value },
                          })
                        }
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Description détaillée des résultats obtenus..."
                        rows={4}
                      />
                    </div>
                  </TabsContent>

                  {/* ENGLISH RESULTS */}
                  <TabsContent value="en" className="space-y-4">
                    <div>
                      <Label htmlFor="resultsTitle_en" className="text-white/80">
                        Results Title (English)
                      </Label>
                      <Input
                        id="resultsTitle_en"
                        value={formData.results?.title_en}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            results: { ...formData.results!, title_en: e.target.value },
                          })
                        }
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Measurable and impressive results"
                      />
                    </div>

                    <div>
                      <Label htmlFor="resultsDescription_en" className="text-white/80">
                        Results Description (English)
                      </Label>
                      <Textarea
                        id="resultsDescription_en"
                        value={formData.results?.description_en}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            results: { ...formData.results!, description_en: e.target.value },
                          })
                        }
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Detailed description of results achieved..."
                        rows={4}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Metrics (bilingual) */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-white/80">Métriques (Metrics)</Label>
                    <Button
                      type="button"
                      onClick={addMetric}
                      className="bg-[#CCFF00]/20 text-[#CCFF00] hover:bg-[#CCFF00]/30"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une métrique
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {formData.results?.metrics?.map((metric, index) => (
                      <Card key={index} className="bg-white/5 border-white/10 p-4">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-white/60 text-xs">Label (FR)</Label>
                              <Input
                                value={metric.label}
                                onChange={(e) => updateMetric(index, "label", e.target.value)}
                                className="bg-white/5 border-white/10 text-white text-sm"
                                placeholder="Taux de conversion"
                              />
                            </div>
                            <div>
                              <Label className="text-white/60 text-xs">Label (EN)</Label>
                              <Input
                                value={metric.label_en || ""}
                                onChange={(e) => updateMetric(index, "label_en", e.target.value)}
                                className="bg-white/5 border-white/10 text-white text-sm"
                                placeholder="Conversion rate"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-white/60 text-xs">Valeur</Label>
                              <Input
                                value={metric.value}
                                onChange={(e) => updateMetric(index, "value", e.target.value)}
                                className="bg-white/5 border-white/10 text-white text-sm"
                                placeholder="+425%"
                              />
                            </div>
                            <div className="flex items-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateMetric(index, "positive", !metric.positive)}
                                className={`flex-1 ${
                                  metric.positive
                                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                                    : "bg-red-500/10 border-red-500/20 text-red-400"
                                }`}
                              >
                                {metric.positive ? "Positif" : "Négatif"}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMetric(index)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* ARCHITECTURE TAB */}
              <TabsContent value="architecture" className="space-y-4 mt-4">
                <div className="border border-white/10 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2 text-white">
                    <Layers className="h-5 w-5 text-[#CCFF00]" />
                    <h3 className="font-semibold">Carte d'architecture</h3>
                  </div>
                  <p className="text-white/50 text-sm">
                    Centralisez les différentes couches (application cliente, edge, base de données...) visibles sur la page publique.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/60 text-xs">Statut (FR)</Label>
                      <Input
                        value={formData.architecture?.status || ""}
                        onChange={(e) => updateArchitectureField("status", e.target.value)}
                        placeholder="EN LIGNE"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white/60 text-xs">Status (EN)</Label>
                      <Input
                        value={formData.architecture?.status_en || ""}
                        onChange={(e) => updateArchitectureField("status_en", e.target.value)}
                        placeholder="ONLINE"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white/60 text-xs">Latence (FR)</Label>
                      <Input
                        value={formData.architecture?.latency || ""}
                        onChange={(e) => updateArchitectureField("latency", e.target.value)}
                        placeholder="Latence : 12ms"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white/60 text-xs">Latency (EN)</Label>
                      <Input
                        value={formData.architecture?.latency_en || ""}
                        onChange={(e) => updateArchitectureField("latency_en", e.target.value)}
                        placeholder="Latency: 12ms"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
                    <div>
                      <p className="text-white font-medium">Niveaux</p>
                      <p className="text-white/50 text-xs">Ajoutez chaque couche (client, edge, data...).</p>
                    </div>
                    <Button
                      type="button"
                      onClick={addArchitectureNode}
                      className="bg-[#CCFF00]/20 text-[#CCFF00] hover:bg-[#CCFF00]/30"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une couche
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {formData.architecture?.nodes?.length ? (
                      formData.architecture.nodes.map((node, index) => (
                        <Card key={node.id || index} className="bg-white/5 border-white/10 p-4 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-white text-sm font-medium">Couche {index + 1}</p>
                              <p className="text-white/50 text-xs">Détaillez le label, le titre et la stack.</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeArchitectureNode(index)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <Label className="text-white/60 text-xs">Icône</Label>
                              <Select
                                value={node.icon || "layers"}
                                onValueChange={(value) =>
                                  updateArchitectureNode(index, "icon", value as CaseStudyArchitectureNode["icon"])
                                }
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ARCHITECTURE_ICON_OPTIONS.map((option) => (
                                    <SelectItem key={option.value || "layers"} value={option.value || "layers"}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-white/60 text-xs">Accent</Label>
                              <Select
                                value={node.accent || "blue"}
                                onValueChange={(value) =>
                                  updateArchitectureNode(index, "accent", value as CaseStudyArchitectureNode["accent"])
                                }
                              >
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ARCHITECTURE_ACCENT_OPTIONS.map((option) => (
                                    <SelectItem key={option.value || "blue"} value={option.value || "blue"}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-white/60 text-xs">Badge/Chemin (FR)</Label>
                              <Input
                                value={node.connector || ""}
                                onChange={(e) => updateArchitectureNode(index, "connector", e.target.value)}
                                placeholder="gRPC / HTTPS"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                          </div>

                          <Tabs value={editorLang} onValueChange={(v) => setEditorLang(v as "fr" | "en")}>
                            <TabsList className="grid grid-cols-2 bg-white/5 mb-3">
                              <TabsTrigger
                                value="fr"
                                className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C] text-xs"
                              >
                                🇫🇷 FR
                              </TabsTrigger>
                              <TabsTrigger
                                value="en"
                                className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C] text-xs"
                              >
                                🇬🇧 EN
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="fr" className="space-y-2">
                              <div>
                                <Label className="text-white/60 text-xs">Label couche (FR)</Label>
                                <Input
                                  value={node.layer || ""}
                                  onChange={(e) => updateArchitectureNode(index, "layer", e.target.value)}
                                  placeholder="Couche présentation"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-white/60 text-xs">Titre (FR)</Label>
                                <Input
                                  value={node.title || ""}
                                  onChange={(e) => updateArchitectureNode(index, "title", e.target.value)}
                                  placeholder="Application mobile"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-white/60 text-xs">Stack / Description (FR)</Label>
                                <Input
                                  value={node.description || ""}
                                  onChange={(e) => updateArchitectureNode(index, "description", e.target.value)}
                                  placeholder="React Native / TypeScript"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                            </TabsContent>

                            <TabsContent value="en" className="space-y-2">
                              <div>
                                <Label className="text-white/60 text-xs">Layer label (EN)</Label>
                                <Input
                                  value={node.layer_en || ""}
                                  onChange={(e) => updateArchitectureNode(index, "layer_en", e.target.value)}
                                  placeholder="Presentation layer"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-white/60 text-xs">Title (EN)</Label>
                                <Input
                                  value={node.title_en || ""}
                                  onChange={(e) => updateArchitectureNode(index, "title_en", e.target.value)}
                                  placeholder="Mobile application"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-white/60 text-xs">Stack / Description (EN)</Label>
                                <Input
                                  value={node.description_en || ""}
                                  onChange={(e) => updateArchitectureNode(index, "description_en", e.target.value)}
                                  placeholder="React Native / TypeScript"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-white/60 text-xs">Badge (EN)</Label>
                                <Input
                                  value={node.connector_en || ""}
                                  onChange={(e) => updateArchitectureNode(index, "connector_en", e.target.value)}
                                  placeholder="gRPC / HTTPS"
                                  className="bg-white/5 border-white/10 text-white"
                                />
                              </div>
                            </TabsContent>
                          </Tabs>
                        </Card>
                      ))
                    ) : (
                      <p className="text-white/40 text-sm">
                        Ajoutez votre première couche pour rendre la carte interactive.
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* EXTRAS TAB */}
              <TabsContent value="extras" className="space-y-4 mt-4">
                {/* Testimonial */}
                <div className="border border-white/10 rounded-lg p-4">
                  <h3 className="text-white mb-4 flex items-center gap-2">
                    <Quote className="h-5 w-5 text-[#CCFF00]" />
                    Témoignage client
                  </h3>
                  
                  <Tabs value={editorLang} onValueChange={(v) => setEditorLang(v as "fr" | "en")} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-4">
                      <TabsTrigger 
                        value="fr" 
                        className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C]"
                      >
                        🇫🇷 Français
                      </TabsTrigger>
                      <TabsTrigger 
                        value="en" 
                        className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C]"
                      >
                        🇬🇧 English
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="fr" className="space-y-3">
                      <div>
                        <Label className="text-white/60 text-xs">Citation (FR)</Label>
                        <Textarea
                          value={formData.testimonial?.quote}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              testimonial: { ...formData.testimonial!, quote: e.target.value },
                            })
                          }
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="L'équipe a dépassé toutes nos attentes..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label className="text-white/60 text-xs">Rôle (FR)</Label>
                        <Input
                          value={formData.testimonial?.role}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              testimonial: { ...formData.testimonial!, role: e.target.value },
                            })
                          }
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="Directrice Produit"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="en" className="space-y-3">
                      <div>
                        <Label className="text-white/60 text-xs">Quote (EN)</Label>
                        <Textarea
                          value={formData.testimonial?.quote_en}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              testimonial: { ...formData.testimonial!, quote_en: e.target.value },
                            })
                          }
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="The team exceeded all our expectations..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label className="text-white/60 text-xs">Role (EN)</Label>
                        <Input
                          value={formData.testimonial?.role_en}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              testimonial: { ...formData.testimonial!, role_en: e.target.value },
                            })
                          }
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="Product Director"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <Label className="text-white/60 text-xs">Auteur (identique FR/EN)</Label>
                      <Input
                        value={formData.testimonial?.author}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            testimonial: { ...formData.testimonial!, author: e.target.value },
                          })
                        }
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Sophie Martin"
                      />
                    </div>
                    <div>
                      <Label className="text-white/60 text-xs">Entreprise (identique FR/EN)</Label>
                      <Input
                        value={formData.testimonial?.company}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            testimonial: { ...formData.testimonial!, company: e.target.value },
                          })
                        }
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="TechFlow SaaS"
                      />
                    </div>
                  </div>
                </div>

                {/* Process Steps */}
                <div className="border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white flex items-center gap-2">
                      <ArrowRight className="h-5 w-5 text-[#CCFF00]" />
                      Processus de travail
                    </h3>
                    <Button
                      type="button"
                      onClick={addProcessStep}
                      className="bg-[#CCFF00]/20 text-[#CCFF00] hover:bg-[#CCFF00]/30"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une étape
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {formData.process?.map((step, index) => (
                      <Card key={index} className="bg-white/5 border-white/10 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-white/60 text-sm">Étape {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProcessStep(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <Tabs value={editorLang} onValueChange={(v) => setEditorLang(v as "fr" | "en")} className="w-full">
                          <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-3">
                            <TabsTrigger 
                              value="fr" 
                              className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C] text-xs"
                            >
                              🇫🇷 FR
                            </TabsTrigger>
                            <TabsTrigger 
                              value="en" 
                              className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-[#0C0C0C] text-xs"
                            >
                              🇬🇧 EN
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="fr" className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-white/60 text-xs">Phase (FR)</Label>
                                <Input
                                  value={step.phase}
                                  onChange={(e) => updateProcessStep(index, "phase", e.target.value)}
                                  className="bg-white/5 border-white/10 text-white text-sm"
                                  placeholder="Phase 1"
                                />
                              </div>
                              <div>
                                <Label className="text-white/60 text-xs">Durée (FR)</Label>
                                <Input
                                  value={step.duration}
                                  onChange={(e) => updateProcessStep(index, "duration", e.target.value)}
                                  className="bg-white/5 border-white/10 text-white text-sm"
                                  placeholder="2 semaines"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-white/60 text-xs">Titre (FR)</Label>
                              <Input
                                value={step.title}
                                onChange={(e) => updateProcessStep(index, "title", e.target.value)}
                                className="bg-white/5 border-white/10 text-white text-sm"
                                placeholder="Découverte"
                              />
                            </div>
                            <div>
                              <Label className="text-white/60 text-xs">Description (FR)</Label>
                              <Textarea
                                value={step.description}
                                onChange={(e) => updateProcessStep(index, "description", e.target.value)}
                                className="bg-white/5 border-white/10 text-white text-sm"
                                placeholder="Analyse des besoins et audit UX..."
                                rows={2}
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="en" className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-white/60 text-xs">Phase (EN)</Label>
                                <Input
                                  value={step.phase_en || ""}
                                  onChange={(e) => updateProcessStep(index, "phase_en", e.target.value)}
                                  className="bg-white/5 border-white/10 text-white text-sm"
                                  placeholder="Phase 1"
                                />
                              </div>
                              <div>
                                <Label className="text-white/60 text-xs">Duration (EN)</Label>
                                <Input
                                  value={step.duration_en || ""}
                                  onChange={(e) => updateProcessStep(index, "duration_en", e.target.value)}
                                  className="bg-white/5 border-white/10 text-white text-sm"
                                  placeholder="2 weeks"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-white/60 text-xs">Title (EN)</Label>
                              <Input
                                value={step.title_en || ""}
                                onChange={(e) => updateProcessStep(index, "title_en", e.target.value)}
                                className="bg-white/5 border-white/10 text-white text-sm"
                                placeholder="Discovery"
                              />
                            </div>
                            <div>
                              <Label className="text-white/60 text-xs">Description (EN)</Label>
                              <Textarea
                                value={step.description_en || ""}
                                onChange={(e) => updateProcessStep(index, "description_en", e.target.value)}
                                className="bg-white/5 border-white/10 text-white text-sm"
                                placeholder="Needs analysis and UX audit..."
                                rows={2}
                              />
                            </div>
                          </TabsContent>
                        </Tabs>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <Label className="text-white/80 mb-2 block">Images (recherches Unsplash)</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="imageInput"
                      placeholder="Mots-clés Unsplash..."
                      className="bg-white/5 border-white/10 text-white"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addArrayItem("images", e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("imageInput") as HTMLInputElement;
                        addArrayItem("images", input.value);
                        input.value = "";
                      }}
                      className="bg-[#CCFF00]/20 text-[#CCFF00] hover:bg-[#CCFF00]/30"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.images?.map((img, index) => (
                      <Badge
                        key={index}
                        className="bg-white/10 text-white cursor-pointer hover:bg-red-500/20 hover:text-red-400"
                        onClick={() => removeArrayItem("images", index)}
                      >
                        {img}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingCaseStudy(null);
                  resetForm();
                }}
                variant="outline"
                className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-[#CCFF00] text-[#0C0C0C] hover:bg-[#CCFF00]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enregistrement..." : editingCaseStudy ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deletingCaseStudy}
        onOpenChange={(open) => !open && setDeletingCaseStudy(null)}
        onConfirm={handleDelete}
        title="Supprimer l'étude de cas"
        description="Êtes-vous sûr de vouloir supprimer cette étude de cas ? Cette action est irréversible."
        itemName={deletingCaseStudy?.title || ""}
        warningMessage="Toutes les données associées seront définitivement supprimées."
      />
    </div>
  );
}

