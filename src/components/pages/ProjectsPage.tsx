import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { 
  ArrowRight, 
  Search, 
  ArrowUpRight,
  Workflow,
  Sparkles,
  BarChart3,
  Target,
  Rocket,
  Zap,
  TrendingDown,
  Clock,
  Star,
  Code2,
  Palette,
  Briefcase
} from "lucide-react";
import { Input } from "../ui/input";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { GridSkeleton, ProjectCardSkeleton, PageHeaderSkeleton } from "../ui/loading-skeletons";
import { PageTransition } from "../PageTransition";

type Page = "contact" | "booking";

interface ProjectsPageProps {
  onNavigate: (page: Page) => void;
  onProjectClick?: (projectId: string) => void;
}

// Project Icon Illustration
function ProjectIcon({ icon: Icon, color }: { icon: any; color: string }) {
  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${color} rounded-2xl`}>
      <Icon className="h-16 w-16 text-mint" />
    </div>
  );
}

// Animated Stats Card
function StatsCard({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="px-6 py-4 rounded-xl bg-neutral-950/50 border border-neutral-900"
    >
      <div className="text-3xl font-bold text-mint mb-1">{value}</div>
      <div className="text-sm text-neutral-500">{label}</div>
    </motion.div>
  );
}

export default function ProjectsPage({ onNavigate, onProjectClick }: ProjectsPageProps) {
  const { t, language } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects?lang=${language}`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Will fall back to demo projects
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [language]);

  // Fallback demo projects if no projects in database
  const demoProjects = [
    {
      id: 1,
      title: "CRM Automatisé Notion",
      subtitle: "Système de gestion client complet",
      description: "Workflow n8n connecté à Notion pour automatiser la facturation, les relances et le suivi client.",
      icon: Workflow,
      color: "from-mint/20 to-mint/5",
      tags: ["n8n", "Notion", "Automatisation"],
      category: "automation",
      year: "2024",
      impact: "-83%",
      metric: "Temps gestion",
      featured: true
    },
    {
      id: 2,
      title: "Assistant IA Support Client",
      subtitle: "Chatbot intelligent avec GPT-4",
      description: "Bot conversationnel qui répond aux questions clients et réduit le temps de réponse de 60%.",
      icon: Sparkles,
      color: "from-mint/20 to-mint/5",
      tags: ["OpenAI", "GPT-4", "Chatbot"],
      category: "ai",
      year: "2024",
      impact: "-60%",
      metric: "Temps réponse",
      featured: true
    },
    {
      id: 3,
      title: "Dashboard Analytics Notion",
      subtitle: "Tableau de bord KPIs en temps réel",
      description: "Interface Notion personnalisée avec formules avancées et vues automatisées pour suivre les performances.",
      icon: BarChart3,
      color: "from-mint/20 to-mint/5",
      tags: ["Notion", "Dashboard", "KPIs"],
      category: "dashboard",
      year: "2024",
      impact: "100%",
      metric: "Visibilité",
      featured: false
    },
    {
      id: 4,
      title: "Workflow Marketing Automation",
      subtitle: "Automatisation campagnes emailing",
      description: "Système Make qui gère les campagnes, segmentation, et scoring automatique des leads.",
      icon: Target,
      color: "from-mint/20 to-mint/5",
      tags: ["Make", "Emailing", "CRM"],
      category: "automation",
      year: "2024",
      impact: "+240%",
      metric: "Conversions",
      featured: false
    },
    {
      id: 5,
      title: "Intégration Multi-plateformes",
      subtitle: "Synchronisation données temps réel",
      description: "API pour connecter Airtable, Notion, Stripe et autres outils en synchronisation bidirectionnelle.",
      icon: Rocket,
      color: "from-mint/20 to-mint/5",
      tags: ["API", "Zapier", "Integration"],
      category: "automation",
      year: "2023",
      impact: "Temps réel",
      metric: "Sync",
      featured: false
    },
    {
      id: 6,
      title: "Page Webflow + IA",
      subtitle: "Site vitrine avec contenu généré par IA",
      description: "Landing page optimisée SEO avec textes générés par GPT et design Webflow sur-mesure.",
      icon: Zap,
      color: "from-mint/20 to-mint/5",
      tags: ["Webflow", "GPT", "SEO"],
      category: "web",
      year: "2023",
      impact: "+200%",
      metric: "Trafic",
      featured: false
    },
  ];

  // Use demo projects if no real projects exist
  const displayProjects = projects.length > 0 ? projects : demoProjects;

  const filters = [
    { id: "all", label: t('projects.filters.all') },
    { id: "web", label: t('projects.filters.web') },
    { id: "mobile", label: t('projects.filters.mobile') },
    { id: "design", label: t('projects.filters.design') },
    { id: "consulting", label: t('projects.filters.consulting') },
    { id: "automation", label: t('projects.filters.automation') },
    { id: "ai", label: t('projects.filters.ai') },
    { id: "dashboard", label: t('projects.filters.dashboard') },
    { id: "other", label: t('projects.filters.other') },
  ];

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      web: Code2,
      mobile: Briefcase,
      design: Palette,
      consulting: Target,
      automation: Workflow,
      ai: Sparkles,
      dashboard: BarChart3,
      other: Rocket,
    };
    return icons[category] || Briefcase;
  };

  const filteredProjects = displayProjects.filter(project => {
    const projectCategory = project.category || 'other';
    const matchesFilter = activeFilter === "all" || projectCategory === activeFilter;
    const matchesSearch = 
      (project.name || project.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description || project.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const featuredProjects = displayProjects.filter(p => p.featured || p.isPinned).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <PageHeaderSkeleton />
          <GridSkeleton count={6} columns={3} Component={ProjectCardSkeleton} />
        </div>
      </div>
    );
  }

  return (
    <PageTransition show={!loading} mode="fade">
      <div className="min-h-screen bg-[#0C0C0C] text-white pt-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 194, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 194, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}></div>
        </div>

        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 -left-20 w-96 h-96 bg-mint rounded-full blur-[120px] opacity-15"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 backdrop-blur-sm mb-8">
              <span className="text-sm text-mint font-medium">{t('projects.hero.badge')}</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-[0.95]">
              <span className="block text-white">{t('projects.hero.title')}</span>
              <span className="block text-gradient-mint-animated">{t('projects.hero.titleHighlight')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-400 mb-12 leading-relaxed max-w-3xl">
              {t('projects.hero.subtitle')}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              <StatsCard value="30+" label={t('projects.stats.projects')} delay={0.2} />
              <StatsCard value="25+" label={t('projects.stats.clients')} delay={0.3} />
              <StatsCard value="15h" label={t('projects.stats.timeSaved')} delay={0.4} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters - Sticky */}
      <section className="sticky top-20 z-40 border-y border-neutral-900 bg-[#0C0C0C]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter.id)}
                  className={activeFilter === filter.id 
                    ? "bg-mint text-black hover:bg-mint/90 rounded-lg" 
                    : "border-neutral-800 text-neutral-400 hover:bg-neutral-950 hover:text-white rounded-lg"
                  }
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                placeholder={t('projects.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus:border-mint/30 rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-neutral-500 text-lg">{t('common.loading')}</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-500 text-lg">{t('projects.empty')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => {
                const ProjectIconComponent = project.icon || getCategoryIcon(project.category || 'other');
                const projectYear = project.year || new Date(project.startDate || project.createdAt).getFullYear();
                const projectTitle = project.title || project.name;
                const projectSubtitle = project.subtitle || project.clientName || t('projects.card.completedProject');
                const projectDescription = project.description || '';
                
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => {
                      const slug = language === 'en' ? (project.slug_en || project.slug_fr || project.slug) : (project.slug_fr || project.slug);
                      onProjectClick?.(slug || project.id);
                    }}
                  >
                    <div className="relative h-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-900 hover:border-mint/20 transition-all duration-300">
                      {/* Image or Icon Visual */}
                      <div className="aspect-[4/3] bg-neutral-900/50 border-b border-neutral-800 relative overflow-hidden">
                        {project.imageUrl ? (
                          <>
                            <ImageWithFallback
                              src={project.imageUrl} 
                              alt={projectTitle}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                          </>
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-mint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-full h-full p-8 flex items-center justify-center">
                              <motion.div
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                className="relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-mint/20 to-mint/5 border border-mint/30 flex items-center justify-center"
                              >
                                <ProjectIconComponent className="h-12 w-12 text-mint" />
                              </motion.div>
                            </div>
                          </>
                        )}

                        {/* Year Badge */}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-neutral-900/80 border-neutral-800 text-neutral-400 backdrop-blur-sm">
                            {projectYear}
                          </Badge>
                        </div>

                        {/* Status Badge */}
                        {project.status && (
                          <div className="absolute top-4 right-4">
                            <div className="px-3 py-1.5 rounded-lg bg-mint/10 border border-mint/20 backdrop-blur-sm">
                              <div className="text-xs font-bold text-mint capitalize">
                                {project.status === 'completed' && 'Terminé'}
                                {project.status === 'in_progress' && 'En cours'}
                                {project.status === 'planning' && 'Planification'}
                                {project.status === 'review' && 'Révision'}
                                {project.status === 'on_hold' && 'En pause'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.category && (
                            <Badge variant="secondary" className="text-xs bg-neutral-900 border-neutral-800 text-neutral-400">
                              {project.category === 'web' && 'Développement Web'}
                              {project.category === 'mobile' && 'Application Mobile'}
                              {project.category === 'design' && 'Design UI/UX'}
                              {project.category === 'consulting' && 'Consulting'}
                              {project.category === 'other' && 'Autre'}
                              {project.category === 'automation' && 'Automatisation'}
                              {project.category === 'ai' && 'Intelligence Artificielle'}
                              {project.category === 'dashboard' && 'Dashboard'}
                            </Badge>
                          )}
                          {project.tags?.map((tag: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-neutral-900 border-neutral-800 text-neutral-400">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2 group-hover:text-mint transition-colors">
                          {projectTitle}
                        </h3>
                        
                        <p className="text-sm text-neutral-400 mb-4 leading-relaxed line-clamp-2">
                          {projectSubtitle}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-neutral-900">
                          <div>
                            <div className="text-xs text-neutral-500">
                              {project.budget ? `${project.budget.toLocaleString()}€` : project.metric || 'Budget'}
                            </div>
                            <div className="text-sm font-medium text-mint">
                              {project.impact || t('projects.viewProject')}
                            </div>
                          </div>
                          <ArrowUpRight className="h-5 w-5 text-neutral-600 group-hover:text-mint group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="py-32 px-6 bg-neutral-950/30 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 backdrop-blur-sm mb-6">
              <Star className="h-4 w-4 text-mint" />
              <span className="text-sm text-mint font-medium">{t('projects.featured.badge')}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              {t('projects.featured.title')}
            </h2>
            <p className="text-xl text-neutral-400 leading-relaxed">
              {t('projects.featured.subtitle')}
            </p>
          </motion.div>

          <div className="space-y-24">
            {featuredProjects.map((project, index) => {
              const FeaturedIcon = project.icon || getCategoryIcon(project.category || 'other');
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="grid lg:grid-cols-2 gap-12 items-center"
                >
                  {/* Visual */}
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-900 p-12 group cursor-pointer hover:border-mint/20 transition-all">
                      <div className="absolute inset-0 bg-gradient-to-br from-mint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10 flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          className="w-40 h-40 rounded-3xl bg-gradient-to-br from-mint/20 to-mint/5 border border-mint/30 flex items-center justify-center"
                        >
                          <FeaturedIcon className="h-20 w-20 text-mint" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <Badge className="mb-6 bg-mint/10 border-mint/20 text-mint">
                      {t(`projects.card.categories.${project.category}`) || t('projects.card.categories.other')}
                    </Badge>
                    
                    <h3 className="text-4xl font-bold mb-4">{project.title}</h3>
                    <p className="text-lg text-neutral-400 mb-8 leading-relaxed">{project.description}</p>

                    {/* Challenge & Impact */}
                    <div className="space-y-6 mb-10">
                      <div>
                        <div className="text-xs text-mint mb-2 font-medium tracking-wider">{t('projects.featured.challenge')}</div>
                        <p className="text-neutral-400 leading-relaxed">
                          Automatiser les tâches répétitives tout en maintenant la qualité et la fiabilité du système.
                        </p>
                      </div>
                      <div>
                        <div className="text-xs text-mint mb-3 font-medium tracking-wider">{t('projects.featured.results')}</div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="rounded-xl border border-neutral-900 bg-neutral-950/50 p-4 text-center">
                            <div className="text-2xl font-bold text-mint mb-1">{project.impact}</div>
                            <div className="text-xs text-neutral-500">{project.metric}</div>
                          </div>
                          <div className="rounded-xl border border-neutral-900 bg-neutral-950/50 p-4 text-center">
                            <div className="text-2xl font-bold text-white mb-1">100%</div>
                            <div className="text-xs text-neutral-500">{t('projects.featured.automated')}</div>
                          </div>
                          <div className="rounded-xl border border-neutral-900 bg-neutral-950/50 p-4 text-center">
                            <div className="text-2xl font-bold text-white mb-1">5h</div>
                            <div className="text-xs text-neutral-500">{t('projects.featured.saved')}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      variant="outline"
                      onClick={() => {
                        const slug = language === 'en' ? (project.slug_en || project.slug_fr || project.slug) : (project.slug_fr || project.slug);
                        onProjectClick?.(slug || project.id);
                      }}
                      className="border-neutral-800 hover:border-mint/20 hover:bg-neutral-950 rounded-lg"
                    >
                      {t('projects.card.viewProject')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('projects.resultsSection.title')}
            </h2>
            <p className="text-xl text-neutral-400">
              {t('projects.resultsSection.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: TrendingDown, value: "83%", label: t('projects.resultsSection.stats.timeSaved'), color: "mint" },
              { icon: Clock, value: "15h", label: t('projects.resultsSection.stats.hoursPerWeek'), color: "white" },
              { icon: Zap, value: "100%", label: t('projects.resultsSection.stats.automationRate'), color: "mint" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative rounded-2xl border border-neutral-900 bg-neutral-950/50 p-8 hover:border-mint/20 transition-all duration-300 text-center h-full">
                  <div className="absolute inset-0 bg-mint/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-mint/10 border border-mint/20 mb-6">
                      <stat.icon className="h-8 w-8 text-mint" />
                    </div>
                    
                    <div className={`text-5xl font-bold mb-4 ${stat.color === 'mint' ? 'text-mint' : 'text-white'}`}>
                      {stat.value}
                    </div>
                    
                    <div className="text-lg text-neutral-400">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
              {t('projects.cta.title')}
            </h2>
            <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto">
              {t('projects.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => onNavigate("contact")}
                className="bg-mint text-black hover:bg-mint/90 h-14 px-10 rounded-full text-lg"
              >
                {t('projects.cta.cta')}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => onNavigate("booking")}
                className="border-neutral-800 hover:border-mint/20 hover:bg-neutral-950 h-14 px-10 rounded-full text-lg"
              >
                {t('projects.cta.button')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </PageTransition>
  );
}
