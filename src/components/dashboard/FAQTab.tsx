import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  HelpCircle, 
  Plus, 
  Edit, 
  Trash, 
  Search, 
  Sparkles,
  Tag,
  MessageSquare,
  Eye,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Globe,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId } from "../../utils/supabase/info";
import { createClient } from "../../utils/supabase/client";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface FAQCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  order: number;
  createdAt: string;
}

interface FAQQuestion {
  id: string;
  question: string;
  question_en?: string;
  answer: string;
  answer_en?: string;
  categoryId: string;
  categoryName?: string;
  keywords: string[];
  keywords_en?: string[];
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt?: string;
}

const iconOptions = [
  { value: "HelpCircle", label: "Help Circle" },
  { value: "Sparkles", label: "Sparkles" },
  { value: "MessageSquare", label: "Message" },
  { value: "Code", label: "Code" },
  { value: "DollarSign", label: "Dollar" },
  { value: "Clock", label: "Clock" },
  { value: "Shield", label: "Shield" },
  { value: "Zap", label: "Zap" },
];

const colorOptions = [
  { value: "text-[#00FFC2]", label: "Turquoise" },
  { value: "text-purple-400", label: "Violet" },
  { value: "text-green-400", label: "Vert" },
  { value: "text-blue-400", label: "Bleu" },
  { value: "text-orange-400", label: "Orange" },
  { value: "text-pink-400", label: "Rose" },
  { value: "text-red-400", label: "Rouge" },
  { value: "text-yellow-400", label: "Jaune" },
];

export function FAQTab() {
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [questions, setQuestions] = useState<FAQQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Category Dialog States
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FAQCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    icon: "HelpCircle",
    color: "text-[#00FFC2]",
  });

  // Question Dialog States
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<FAQQuestion | null>(null);
  const [editorLang, setEditorLang] = useState<"fr" | "en">("fr");
  const [questionFormData, setQuestionFormData] = useState({
    question: "",
    question_en: "",
    answer: "",
    answer_en: "",
    categoryId: "",
    keywords: "",
    keywords_en: "",
    isPublished: true,
  });

  // Delete Dialog States
  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] = useState(false);
  const [showDeleteQuestionDialog, setShowDeleteQuestionDialog] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<FAQCategory | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<FAQQuestion | null>(null);

  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      // Charger les catégories depuis le serveur
      console.log("📋 Loading FAQ categories from server...");
      const categoriesResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-categories`,
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        console.log("✅ Categories loaded from server:", categoriesData.categories);
        setCategories(categoriesData.categories || []);
      } else {
        console.warn("⚠️ Failed to load categories from server, using fallback");
        // Fallback: créer des catégories par défaut
        setCategories([
          {
            id: "faq_category_general",
            name: "Général",
            icon: "HelpCircle",
            color: "text-[#00FFC2]",
            order: 0,
            createdAt: new Date().toISOString(),
          },
        ]);
      }

      // Utiliser le service avec fallback local pour les questions
      const { fetchFAQs } = await import("../../utils/dataService");
      const { faqs, mode } = await fetchFAQs("fr");
      
      console.log(`✅ FAQs loaded in ${mode} mode:`, faqs.length);
      
      // Convertir les FAQs en format attendu
      setQuestions(faqs.map((faq: any) => ({
        id: faq.id,
        question: faq.question,
        question_en: faq.question,
        answer: faq.answer,
        answer_en: faq.answer,
        categoryId: faq.category || "faq_category_general",
        keywords: "",
        keywords_en: "",
        isPublished: true,
        order: faq.order || 0,
      })));
    } catch (error) {
      console.error("Error fetching FAQ data:", error);
      toast.error(`Erreur lors du chargement des données (mode local disponible)`);
    } finally {
      setLoading(false);
    }
  };

  // Category CRUD
  const handleSaveCategory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const url = editingCategory
        ? `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-categories/${editingCategory.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-categories`;

      const response = await fetch(url, {
        method: editingCategory ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(categoryFormData),
      });

      if (response.ok) {
        toast.success(editingCategory ? "Catégorie mise à jour" : "Catégorie créée");
        setShowCategoryDialog(false);
        resetCategoryForm();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-categories/${deletingCategory.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );

      if (response.ok) {
        toast.success("Catégorie supprimée");
        setShowDeleteCategoryDialog(false);
        setDeletingCategory(null);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  // Question CRUD
  const handleSaveQuestion = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const url = editingQuestion
        ? `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-questions/${editingQuestion.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-questions`;

      const payload = {
        ...questionFormData,
        keywords: questionFormData.keywords.split(",").map(k => k.trim()).filter(Boolean),
        keywords_en: questionFormData.keywords_en.split(",").map(k => k.trim()).filter(Boolean),
      };

      const response = await fetch(url, {
        method: editingQuestion ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingQuestion ? "Question mise à jour" : "Question créée");
        setShowQuestionDialog(false);
        resetQuestionForm();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleDeleteQuestion = async () => {
    if (!deletingQuestion) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-questions/${deletingQuestion.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );

      if (response.ok) {
        toast.success("Question supprimée");
        setShowDeleteQuestionDialog(false);
        setDeletingQuestion(null);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const resetCategoryForm = () => {
    setCategoryFormData({ name: "", icon: "HelpCircle", color: "text-[#00FFC2]" });
    setEditingCategory(null);
  };

  const resetQuestionForm = () => {
    setQuestionFormData({ 
      question: "", 
      question_en: "",
      answer: "", 
      answer_en: "",
      categoryId: "", 
      keywords: "", 
      keywords_en: "",
      isPublished: true 
    });
    setEditingQuestion(null);
    setEditorLang("fr");
  };

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchesCategory = selectedCategory === "all" || q.categoryId === selectedCategory;
    const matchesSearch = !searchQuery || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleQuestionExpand = (id: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-8 w-8 animate-spin text-[#00FFC2]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl text-white">Gestion FAQ</h2>
          <p className="text-[#00FFC2]/60 mt-1">
            {categories.length} catégories • {questions.length} questions
          </p>
        </div>
        <div className="flex gap-3">
          {(categories.length === 0 || questions.length === 0) && (
            <Button
              onClick={async () => {
                try {
                  toast.info("Initialisation des données FAQ...");
                  // @ts-ignore
                  const result = await window.seedFAQData();
                  if (result) {
                    toast.success(`✅ ${result.categories} catégories et ${result.questions} questions créées !`);
                    fetchData();
                  }
                } catch (error) {
                  console.error("Error seeding FAQ:", error);
                  toast.error("Erreur lors de l'initialisation");
                }
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/20"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Initialiser FAQ (6 cat. + 37 Q)
            </Button>
          )}
          <Button
            onClick={() => {
              resetCategoryForm();
              setShowCategoryDialog(true);
            }}
            className="bg-white/5 text-white hover:bg-white/10 border border-white/10"
          >
            <Tag className="h-4 w-4 mr-2" />
            Nouvelle catégorie
          </Button>
          <Button
            onClick={() => {
              resetQuestionForm();
              setShowQuestionDialog(true);
            }}
            className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle question
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="questions" className="data-[state=active]:bg-[#00FFC2] data-[state=active]:text-black">
            <MessageSquare className="h-4 w-4 mr-2" />
            Questions ({questions.length})
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-[#00FFC2] data-[state=active]:text-black">
            <Tag className="h-4 w-4 mr-2" />
            Catégories ({categories.length})
          </TabsTrigger>
        </TabsList>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-6">
          {/* Filters */}
          <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder="Rechercher une question..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="md:w-64 bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={fetchData}
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
            <CardHeader className="border-b border-[#00FFC2]/10">
              <CardTitle className="flex items-center justify-between">
                <span>Questions</span>
                <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-0">
                  {filteredQuestions.length} résultats
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {questions.length === 0 ? (
                <div className="text-center text-white/40 py-12 space-y-4">
                  <HelpCircle className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <div>
                    <h3 className="text-xl text-white mb-2">Aucune question FAQ</h3>
                    <p className="text-white/60 mb-2">
                      Initialisez les données FAQ avec <span className="text-[#00FFC2]">37 questions professionnelles</span>
                    </p>
                    <p className="text-sm text-white/50 mb-6">
                      Réparties en 6 catégories : Services, Tarifs, Processus, Communication, Technique, Légal
                    </p>
                  </div>
                  <Button
                    onClick={async () => {
                      try {
                        toast.info("Initialisation des données FAQ...");
                        // @ts-ignore
                        const result = await window.seedFAQData();
                        if (result) {
                          toast.success(`✅ ${result.categories} catégories et ${result.questions} questions créées !`);
                          fetchData();
                        }
                      } catch (error) {
                        console.error("Error seeding FAQ:", error);
                        toast.error("Erreur lors de l'initialisation");
                      }
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/20 px-8 py-6 text-lg"
                  >
                    <Sparkles className="h-5 w-5 mr-3" />
                    Initialiser FAQ (6 catégories + 37 questions)
                  </Button>
                  <p className="text-xs text-white/40 mt-4">
                    💡 Astuce : Vous pouvez aussi utiliser la console : <code className="text-[#00FFC2] bg-[#00FFC2]/10 px-2 py-1 rounded">await window.seedFAQData()</code>
                  </p>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="text-center text-white/40 py-12">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Aucune question trouvée avec ces filtres</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredQuestions.map((question) => {
                    const category = categories.find(c => c.id === question.categoryId);
                    const isExpanded = expandedQuestions.has(question.id);
                    
                    return (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border border-white/10 rounded-xl overflow-hidden bg-white/5"
                      >
                        <div className="p-4 flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-white font-medium">{question.question}</h3>
                              {!question.isPublished && (
                                <Badge className="bg-orange-500/10 text-orange-400 border-0 text-xs">
                                  Brouillon
                                </Badge>
                              )}
                              {question.question_en && question.answer_en && (
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                  <Globe className="h-3 w-3 mr-1" />
                                  EN
                                </Badge>
                              )}
                            </div>
                            
                            {category && (
                              <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-0 text-xs mb-2">
                                {category.name}
                              </Badge>
                            )}

                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 pt-3 border-t border-white/10"
                              >
                                <p className="text-white/70 text-sm mb-3">{question.answer}</p>
                                {question.keywords && question.keywords.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {question.keywords.map((keyword, idx) => (
                                      <span
                                        key={idx}
                                        className="text-xs px-2 py-1 rounded bg-white/5 text-white/60"
                                      >
                                        {keyword}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => toggleQuestionExpand(question.id)}
                              variant="ghost"
                              size="sm"
                              className="text-white/60 hover:text-white hover:bg-white/10"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              onClick={() => {
                                setEditingQuestion(question);
                                setQuestionFormData({
                                  question: question.question,
                                  question_en: question.question_en || "",
                                  answer: question.answer,
                                  answer_en: question.answer_en || "",
                                  categoryId: question.categoryId,
                                  keywords: question.keywords?.join(", ") || "",
                                  keywords_en: question.keywords_en?.join(", ") || "",
                                  isPublished: question.isPublished,
                                });
                                setEditorLang("fr");
                                setShowQuestionDialog(true);
                              }}
                              variant="ghost"
                              size="sm"
                              className="text-[#00FFC2] hover:bg-[#00FFC2]/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => {
                                setDeletingQuestion(question);
                                setShowDeleteQuestionDialog(true);
                              }}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:bg-red-400/10"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
            <CardHeader className="border-b border-[#00FFC2]/10">
              <CardTitle>Catégories</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {categories.length === 0 ? (
                <div className="text-center text-white/40 py-12 space-y-4">
                  <Tag className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <div>
                    <h3 className="text-xl text-white mb-2">Aucune catégorie FAQ</h3>
                    <p className="text-white/60 mb-2">
                      Initialisez les données FAQ pour créer <span className="text-[#00FFC2]">6 catégories</span>
                    </p>
                    <p className="text-sm text-white/50 mb-6">
                      Services • Tarifs & Paiement • Processus & Délais • Communication • Technique • Légal & Sécurité
                    </p>
                  </div>
                  <Button
                    onClick={async () => {
                      try {
                        toast.info("Initialisation des données FAQ...");
                        // @ts-ignore
                        const result = await window.seedFAQData();
                        if (result) {
                          toast.success(`✅ ${result.categories} catégories et ${result.questions} questions créées !`);
                          fetchData();
                        }
                      } catch (error) {
                        console.error("Error seeding FAQ:", error);
                        toast.error("Erreur lors de l'initialisation");
                      }
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/20 px-8 py-6 text-lg"
                  >
                    <Sparkles className="h-5 w-5 mr-3" />
                    Initialiser FAQ (6 catégories + 37 questions)
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => {
                    const questionCount = questions.filter(q => q.categoryId === category.id).length;
                    
                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 rounded-lg bg-white/5 ${category.color}`}>
                            <HelpCircle className="h-5 w-5" />
                          </div>
                          <div className="flex gap-1">
                            <Button
                              onClick={() => {
                                setEditingCategory(category);
                                setCategoryFormData({
                                  name: category.name,
                                  icon: category.icon,
                                  color: category.color,
                                });
                                setShowCategoryDialog(true);
                              }}
                              variant="ghost"
                              size="sm"
                              className="text-[#00FFC2] hover:bg-[#00FFC2]/10 h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => {
                                setDeletingCategory(category);
                                setShowDeleteCategoryDialog(true);
                              }}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:bg-red-400/10 h-8 w-8 p-0"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <h3 className="text-white font-medium mb-1">{category.name}</h3>
                        <p className="text-white/60 text-sm">
                          {questionCount} question{questionCount > 1 ? "s" : ""}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Organisez vos questions FAQ par catégorie
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white/80">Nom de la catégorie *</Label>
              <Input
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                placeholder="Services, Tarifs, etc."
                className="bg-white/5 border-white/10 text-white mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white/80">Icône</Label>
                <Select
                  value={categoryFormData.icon}
                  onValueChange={(value) => setCategoryFormData({ ...categoryFormData, icon: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                    {iconOptions.map(icon => (
                      <SelectItem key={icon.value} value={icon.value}>{icon.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white/80">Couleur</Label>
                <Select
                  value={categoryFormData.color}
                  onValueChange={(value) => setCategoryFormData({ ...categoryFormData, color: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                    {colorOptions.map(color => (
                      <SelectItem key={color.value} value={color.value}>{color.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSaveCategory}
                disabled={!categoryFormData.name}
                className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
              >
                {editingCategory ? "Mettre à jour" : "Créer"}
              </Button>
              <Button
                onClick={() => {
                  setShowCategoryDialog(false);
                  resetCategoryForm();
                }}
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Question Dialog */}
      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>
                  {editingQuestion ? "Modifier la question" : "Nouvelle question"}
                </DialogTitle>
                <DialogDescription className="text-white/60">
                  Ajoutez des questions fréquentes pour aider vos visiteurs
                </DialogDescription>
              </div>
              {editingQuestion && questionFormData.question_en && questionFormData.answer_en && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Traduit
                </Badge>
              )}
            </div>
          </DialogHeader>

          {/* Language Tabs */}
          <Tabs value={editorLang} onValueChange={(v) => setEditorLang(v as "fr" | "en")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5">
              <TabsTrigger value="fr" className="data-[state=active]:bg-[#00FFC2] data-[state=active]:text-black">
                🇫🇷 Français
              </TabsTrigger>
              <TabsTrigger value="en" className="data-[state=active]:bg-[#00FFC2] data-[state=active]:text-black">
                🇬🇧 English
              </TabsTrigger>
            </TabsList>

            {/* French Tab */}
            <TabsContent value="fr" className="space-y-4 mt-4">
              <div>
                <Label className="text-white/80">Question (FR) *</Label>
                <Input
                  value={questionFormData.question}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, question: e.target.value })}
                  placeholder="Ex: Quels sont vos tarifs ?"
                  className="bg-white/5 border-white/10 text-white mt-2"
                />
              </div>

              <div>
                <Label className="text-white/80">Réponse (FR) *</Label>
                <Textarea
                  value={questionFormData.answer}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, answer: e.target.value })}
                  placeholder="Réponse détaillée à la question..."
                  rows={6}
                  className="bg-white/5 border-white/10 text-white mt-2"
                />
              </div>

              <div>
                <Label className="text-white/80">Mots-clés (FR) - séparés par des virgules</Label>
                <Input
                  value={questionFormData.keywords}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, keywords: e.target.value })}
                  placeholder="tarifs, prix, coût, devis"
                  className="bg-white/5 border-white/10 text-white mt-2"
                />
                <p className="text-xs text-white/40 mt-1">
                  Aide à la recherche et au filtrage
                </p>
              </div>
            </TabsContent>

            {/* English Tab */}
            <TabsContent value="en" className="space-y-4 mt-4">
              <div>
                <Label className="text-white/80">Question (EN)</Label>
                <Input
                  value={questionFormData.question_en}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, question_en: e.target.value })}
                  placeholder="Ex: What are your rates?"
                  className="bg-white/5 border-white/10 text-white mt-2"
                />
              </div>

              <div>
                <Label className="text-white/80">Answer (EN)</Label>
                <Textarea
                  value={questionFormData.answer_en}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, answer_en: e.target.value })}
                  placeholder="Detailed answer to the question..."
                  rows={6}
                  className="bg-white/5 border-white/10 text-white mt-2"
                />
              </div>

              <div>
                <Label className="text-white/80">Keywords (EN) - comma separated</Label>
                <Input
                  value={questionFormData.keywords_en}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, keywords_en: e.target.value })}
                  placeholder="pricing, rates, cost, quote"
                  className="bg-white/5 border-white/10 text-white mt-2"
                />
                <p className="text-xs text-white/40 mt-1">
                  Helps with search and filtering
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Common Fields */}
          <div className="space-y-4">
            <div>
              <Label className="text-white/80">Catégorie *</Label>
              <Select
                value={questionFormData.categoryId}
                onValueChange={(value) => setQuestionFormData({ ...questionFormData, categoryId: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <input
                type="checkbox"
                id="isPublished"
                checked={questionFormData.isPublished}
                onChange={(e) => setQuestionFormData({ ...questionFormData, isPublished: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#00FFC2]"
              />
              <Label htmlFor="isPublished" className="text-white/80 cursor-pointer">
                Publier cette question (visible sur le site)
              </Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSaveQuestion}
                disabled={!questionFormData.question || !questionFormData.answer || !questionFormData.categoryId}
                className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
              >
                {editingQuestion ? "Mettre à jour" : "Créer"}
              </Button>
              <Button
                onClick={() => {
                  setShowQuestionDialog(false);
                  resetQuestionForm();
                }}
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      {deletingCategory && (
        <DeleteConfirmDialog
          open={showDeleteCategoryDialog}
          onOpenChange={setShowDeleteCategoryDialog}
          onConfirm={handleDeleteCategory}
          title="Supprimer la catégorie"
          description="Êtes-vous sûr de vouloir supprimer cette catégorie ?"
          itemName={deletingCategory.name}
          warningMessage={
            questions.filter(q => q.categoryId === deletingCategory.id).length > 0
              ? `Cette catégorie contient ${questions.filter(q => q.categoryId === deletingCategory.id).length} question(s). Elles seront également supprimées.`
              : undefined
          }
        />
      )}

      {/* Delete Question Dialog */}
      {deletingQuestion && (
        <DeleteConfirmDialog
          open={showDeleteQuestionDialog}
          onOpenChange={setShowDeleteQuestionDialog}
          onConfirm={handleDeleteQuestion}
          title="Supprimer la question"
          description="Êtes-vous sûr de vouloir supprimer cette question ?"
          itemName={deletingQuestion.question}
        />
      )}
    </motion.div>
  );
}
