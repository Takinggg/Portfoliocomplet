import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Download,
  FileText,
  Folder,
  Search,
  Filter,
  TrendingUp,
  BookOpen,
  CheckSquare,
  Wrench,
  Sparkles,
  Mail,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useTranslation } from "../../utils/i18n/useTranslation";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: "templates" | "guides" | "checklists" | "tools";
  fileUrl: string;
  coverImage?: string;
  tags: string[];
  isPublished: boolean;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

interface ResourcesPageProps {
  onNavigate: (page: string) => void;
}

const getCategoryConfig = (t: any) => ({
  templates: {
    label: t.resources.categories.templates,
    icon: Folder,
    color: "blue",
    description: t.resources.categoryDescriptions.templates,
    defaultImage: "https://images.unsplash.com/photo-1625009431843-18569fd7331b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjB0ZW1wbGF0ZSUyMG1vY2t1cHxlbnwxfHx8fDE3NjI0MzA0MDN8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  guides: {
    label: t.resources.categories.guides,
    icon: BookOpen,
    color: "purple",
    description: t.resources.categoryDescriptions.guides,
    defaultImage: "https://images.unsplash.com/photo-1644352739408-a191ed85e513?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwZG93bmxvYWQlMjBwZGZ8ZW58MXx8fHwxNzYyNDMwNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  checklists: {
    label: t.resources.categories.checklists,
    icon: CheckSquare,
    color: "green",
    description: t.resources.categoryDescriptions.checklists,
    defaultImage: "https://images.unsplash.com/photo-1754548930515-ac7eb978280d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVja2xpc3QlMjBwbGFubmluZ3xlbnwxfHx8fDE3NjI0MzA0MDN8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  tools: {
    label: t.resources.categories.tools,
    icon: Wrench,
    color: "orange",
    description: t.resources.categoryDescriptions.tools,
    defaultImage: "https://images.unsplash.com/photo-1623679116710-78b05d2fe2f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBkZXNrfGVufDF8fHx8MTc2MjM3NTg4OHww&ixlib=rb-4.1.0&q=80&w=1080"
  }
});

const COLOR_CLASSES = {
  blue: {
    badge: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    icon: "text-blue-500",
    glow: "group-hover:shadow-blue-500/20"
  },
  purple: {
    badge: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    icon: "text-purple-500",
    glow: "group-hover:shadow-purple-500/20"
  },
  green: {
    badge: "bg-green-500/10 text-green-500 border-green-500/20",
    icon: "text-green-500",
    glow: "group-hover:shadow-green-500/20"
  },
  orange: {
    badge: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    icon: "text-orange-500",
    glow: "group-hover:shadow-orange-500/20"
  }
};

export default function ResourcesPage({ onNavigate }: ResourcesPageProps) {
  const { t, language } = useTranslation();
  const CATEGORY_CONFIG = getCategoryConfig(t);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [downloadForm, setDownloadForm] = useState({ name: "", email: "" });
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchResources();
  }, [language]); // Reload when language changes

  const fetchResources = async () => {
    setLoading(true);
    try {
      console.log(`📚 [FRONTEND] Fetching resources from API (lang: ${language})...`);
      
      // Utiliser le service avec fallback local - PASSER LA LANGUE !
      const { fetchResources } = await import("../../utils/dataService");
      const { resources: loadedResources, mode } = await fetchResources(language);
      
      console.log(`✅ Resources loaded in ${mode} mode (${language}):`, loadedResources.length);
      setResources(loadedResources);
    } catch (error) {
      console.error("❌ Error fetching resources:", error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedResource) return;

    setDownloading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources/${encodeURIComponent(selectedResource.id)}/download`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email: downloadForm.email,
            name: downloadForm.name,
            lang: t.locale // Send current language to get the correct file
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success(t.resources.toast.downloadStarted);
        
        // Fetch the file with proper authorization headers
        const fileResponse = await fetch(data.fileUrl, {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        });
        
        if (fileResponse.ok) {
          // Get the file content as blob
          const blob = await fileResponse.blob();
          
          // Create a download link
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          
          // Extract filename from fileUrl or use resource title
          const filename = data.fileUrl.split("/").pop() || `${selectedResource.title}.html`;
          a.download = filename;
          
          // Trigger download
          document.body.appendChild(a);
          a.click();
          
          // Cleanup
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          toast.success(t.resources.toast.downloadSuccess);
        } else {
          toast.error(t.resources.toast.downloadError);
        }
        
        // Close dialog and reset
        setDownloadDialogOpen(false);
        setDownloadForm({ name: "", email: "" });
        setSelectedResource(null);
        
        // Refresh resources to update download count
        fetchResources();
      } else {
        toast.error(data.error || t.resources.toast.error);
      }
    } catch (error) {
      console.error("Error downloading resource:", error);
      toast.error(t.resources.toast.connectionError);
    } finally {
      setDownloading(false);
    }
  };

  const openDownloadDialog = (resource: Resource) => {
    setSelectedResource(resource);
    setDownloadDialogOpen(true);
  };

  const filteredResources = resources.filter(resource => {
    const matchesCategory = filterCategory === "all" || resource.category === filterCategory;
    const matchesSearch = !searchQuery || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const stats = {
    total: resources.length,
    downloads: resources.reduce((sum, r) => sum + r.downloads, 0),
    categories: Object.keys(CATEGORY_CONFIG).map(cat => ({
      category: cat,
      count: resources.filter(r => r.category === cat).length
    }))
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#00FFC2]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FFC2]/5 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-[#00FFC2]/20 mb-6">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              {t.resources.hero.badge}
            </Badge>
            
            <h1 className="text-5xl md:text-6xl mb-6 tracking-tight">
              {t.resources.hero.title}
            </h1>
            
            <p className="text-xl text-white/60 mb-8">
              {t.resources.hero.subtitle}
              <br />
              {t.resources.hero.subtitleLine2}
            </p>

            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-white/40">
                <Download className="h-5 w-5 text-[#00FFC2]" />
                <span>{stats.downloads}+ {t.resources.hero.stats.downloads}</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2 text-white/40">
                <FileText className="h-5 w-5 text-[#00FFC2]" />
                <span>{stats.total} {t.resources.hero.stats.resources}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-[#00FFC2]/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.resources.filters.search}
                className="pl-10 bg-black/40 border-[#00FFC2]/20 focus:border-[#00FFC2]/40"
              />
            </div>

            {/* Category filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={filterCategory === "all" ? "default" : "outline"}
                onClick={() => setFilterCategory("all")}
                className={filterCategory === "all" ? "bg-[#00FFC2] text-black" : "border-[#00FFC2]/20"}
              >
                {t.resources.filters.all}
              </Button>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <Button
                    key={key}
                    variant={filterCategory === key ? "default" : "outline"}
                    onClick={() => setFilterCategory(key)}
                    className={filterCategory === key ? "bg-[#00FFC2] text-black" : "border-[#00FFC2]/20"}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {config.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="text-center py-20 text-white/40">
            {t.resources.loading}
          </div>
        ) : resources.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="bg-black/40 border border-[#00FFC2]/20 rounded-lg p-12 max-w-2xl mx-auto">
              <FileText className="h-16 w-16 text-[#00FFC2]/40 mx-auto mb-6" />
              <h3 className="text-2xl mb-4">{t.resources.empty.title}</h3>
              <p className="text-white/60 mb-6">
                {t.resources.empty.subtitle}
                <br />
                {t.resources.empty.subtitleLine2}
              </p>
              <div className="bg-[#00FFC2]/10 border border-[#00FFC2]/20 rounded-lg p-4 text-left">
                <p className="text-sm text-white/80 mb-2 font-mono">
                  {t.resources.empty.console.title}
                </p>
                <code className="text-xs text-[#00FFC2] bg-black/60 px-3 py-2 rounded block">
                  {t.resources.empty.console.command}
                </code>
              </div>
            </div>
          </motion.div>
        ) : filteredResources.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <FileText className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">{t.resources.noResults.message}</p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setFilterCategory("all");
              }}
              variant="outline"
              className="mt-4 border-[#00FFC2]/20"
            >
              {t.resources.noResults.reset}
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {filteredResources.map((resource) => {
              const config = CATEGORY_CONFIG[resource.category] || CATEGORY_CONFIG.guides; // Fallback to guides
              const colors = COLOR_CLASSES[config.color as keyof typeof COLOR_CLASSES] || COLOR_CLASSES.blue; // Fallback to blue
              const Icon = config.icon || BookOpen; // Fallback icon

              return (
                <motion.div
                  key={resource.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <Card className="group bg-black/40 border-[#00FFC2]/10 overflow-hidden hover:border-[#00FFC2]/30 transition-all duration-300 h-full flex flex-col">
                    {/* Cover Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#00FFC2]/10 to-transparent">
                      <ImageWithFallback
                        src={resource.coverImage || config.defaultImage}
                        alt={resource.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className={`border ${colors.badge}`}>
                          <Icon className="h-3.5 w-3.5 mr-1.5" />
                          {config.label}
                        </Badge>
                      </div>

                      {/* Downloads */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-sm text-white/80">
                        <Download className="h-3.5 w-3.5" />
                        <span>{resource.downloads}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="flex-1 flex flex-col p-6">
                      <h3 className="text-xl mb-2 line-clamp-2">
                        {resource.title}
                      </h3>
                      
                      <p className="text-white/60 text-sm mb-4 line-clamp-3 flex-1">
                        {resource.description}
                      </p>

                      {/* Tags */}
                      {resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {resource.tags.slice(0, 3).map((tag, idx) => (
                            <Badge 
                              key={idx}
                              className="bg-white/5 text-white/40 border-white/10 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Download Button */}
                      <Button
                        onClick={() => openDownloadDialog(resource)}
                        className="w-full bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90 group-hover:shadow-lg group-hover:shadow-[#00FFC2]/20 transition-all"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {t.resources.card.download}
                        <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* CTA Section */}
      <section className="border-t border-[#00FFC2]/10 bg-gradient-to-b from-transparent to-[#00FFC2]/5">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Mail className="h-12 w-12 text-[#00FFC2] mx-auto mb-6" />
            <h2 className="text-3xl mb-4">
              {t.resources.cta.title}
            </h2>
            <p className="text-white/60 mb-8">
              {t.resources.cta.subtitle}
            </p>
            <Button
              onClick={() => onNavigate("contact")}
              className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
            >
              {t.resources.cta.button}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Download Dialog (Gated Content) */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-[#00FFC2]" />
              {t.resources.dialog.title} "{selectedResource?.title}"
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {t.resources.dialog.description}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDownload} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">{t.resources.dialog.form.name}</Label>
              <Input
                id="name"
                value={downloadForm.name}
                onChange={(e) => setDownloadForm({ ...downloadForm, name: e.target.value })}
                placeholder={t.resources.dialog.form.namePlaceholder}
                className="bg-black/40 border-[#00FFC2]/20"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">{t.resources.dialog.form.email}</Label>
              <Input
                id="email"
                type="email"
                value={downloadForm.email}
                onChange={(e) => setDownloadForm({ ...downloadForm, email: e.target.value })}
                placeholder={t.resources.dialog.form.emailPlaceholder}
                className="bg-black/40 border-[#00FFC2]/20"
                required
              />
            </div>

            <div className="bg-[#00FFC2]/5 border border-[#00FFC2]/10 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-[#00FFC2] shrink-0 mt-0.5" />
                <div className="text-sm text-white/60">
                  <p>{t.resources.dialog.notice.text}</p>
                  <p className="mt-2 text-xs text-white/40">
                    {t.resources.dialog.notice.unsubscribe}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDownloadDialogOpen(false);
                  setDownloadForm({ name: "", email: "" });
                }}
                className="flex-1 border-[#00FFC2]/20"
              >
                {t.resources.dialog.buttons.cancel}
              </Button>
              <Button
                type="submit"
                disabled={downloading}
                className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
              >
                {downloading ? (
                  t.resources.dialog.buttons.downloading
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    {t.resources.dialog.buttons.download}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
