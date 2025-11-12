import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Breadcrumbs } from "../layout/Breadcrumbs";
import { 
  ArrowLeft,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  ExternalLink,
  Globe,
  Github,
  Workflow,
  Sparkles,
  BarChart3,
  Code2,
  Palette,
  Briefcase,
  Target
} from "lucide-react";
import { useState, useEffect } from "react";
import { projectId as supabaseProjectId, publicAnonKey } from "../../utils/supabase/info";
import { useTranslation } from "../../utils/i18n/useTranslation";

type Page = "projects" | "contact" | "booking";

interface ProjectDetailPageProps {
  projectId: string;
  onNavigate: (page: Page) => void;
}

export default function ProjectDetailPage({ projectId, onNavigate }: ProjectDetailPageProps) {
  const { language, t } = useTranslation();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch project from API
  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log(`🔍 Fetching project with ID: ${projectId} (lang: ${language})`);
        const response = await fetch(
          `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-04919ac5/projects/${projectId}?lang=${language}`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ Project not found:', {
            projectId,
            status: response.status,
            error: errorData
          });
          console.log('💡 Tip: Run checkProjectIdsFormat() in console to see available projects');
          throw new Error('Project not found');
        }
        
        const data = await response.json();
        if (!data.project) {
          console.error('❌ No project data in response:', data);
          throw new Error('Project data missing');
        }
        
        console.log('✅ Project loaded:', data.project.name);
        setProject(data.project);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId, language]);

  const onBack = () => onNavigate("projects");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-mint border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">{t('projects.detail.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-10 w-10 text-neutral-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('projects.detail.notFound')}</h1>
          <p className="text-lg text-neutral-400 mb-8">
            {t('projects.detail.notFoundDescription')}
            <br />
            ID recherché : <code className="text-mint text-sm">{projectId}</code>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onBack} className="bg-mint text-black hover:bg-mint/90">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('projects.detail.backToProjects')}
            </Button>
          </div>
          <div className="mt-8 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 text-left">
            <p className="text-sm text-neutral-400">
              💡 <strong className="text-white">Astuce :</strong> Ouvrez la console et tapez <code className="text-mint">checkProjectIdsFormat()</code> pour voir tous les projets disponibles.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to get category icon
  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'web': return Code2;
      case 'mobile': return Globe;
      case 'design': return Palette;
      case 'automatisation': return Workflow;
      case 'intelligence artificielle': return Sparkles;
      case 'dashboard': return BarChart3;
      default: return Briefcase;
    }
  };

  const Icon = getCategoryIcon(project.category);

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Breadcrumbs */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <Breadcrumbs
            items={[
              { label: "Accueil", onClick: () => onNavigate("projects") },
              { label: "Projets", onClick: () => onNavigate("projects") },
              { label: project.title, isActive: true }
            ]}
          />
        </div>
        {/* Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 194, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 194, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}></div>
        </div>

        {/* Floating Orb */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/3 right-0 w-96 h-96 bg-mint rounded-full blur-[120px] opacity-15"
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
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-neutral-400 hover:text-white hover:bg-white/5"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('projects.detail.backToProjects')}
            </Button>
          </motion.div>

          {/* Header */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="mb-6 bg-mint/10 border-mint/20 text-mint">
                {project.category}
              </Badge>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]">
                {project.title}
              </h1>

              {project.description && (
                <p className="text-xl md:text-2xl text-neutral-400 mb-8 leading-relaxed">
                  {project.description}
                </p>
              )}

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {project.year && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex-shrink-0">
                      <Calendar className="h-5 w-5 text-mint" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 mb-0.5">{t('projects.detail.year')}</div>
                      <div className="text-white font-medium">{project.year}</div>
                    </div>
                  </div>
                )}
                {project.duration && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-mint" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 mb-0.5">{t('projects.detail.duration')}</div>
                      <div className="text-white font-medium">{project.duration}</div>
                    </div>
                  </div>
                )}
                {(project.clientName || project.client) && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 col-span-2">
                    <div className="flex-shrink-0">
                      <User className="h-5 w-5 text-mint" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 mb-0.5">{t('projects.detail.client')}</div>
                      <div className="text-white font-medium">{project.clientName || project.client}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="mb-6">
                  <div className="text-xs text-neutral-500 mb-3 uppercase tracking-wider">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="bg-neutral-900 border-neutral-800 text-neutral-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="mb-8">
                  <div className="text-xs text-neutral-500 mb-3 uppercase tracking-wider">Technologies</div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string, idx: number) => (
                      <Badge key={idx} className="bg-mint/10 border-mint/20 text-mint">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-4">
                {project.liveUrl && (
                  <Button 
                    className="bg-mint text-black hover:bg-mint/90"
                    onClick={() => window.open(project.liveUrl, '_blank')}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    {t('projects.detail.viewWebsite')}
                  </Button>
                )}
                {project.githubUrl && (
                  <Button 
                    variant="outline"
                    className="border-mint/20 text-mint hover:bg-mint/10"
                    onClick={() => window.open(project.githubUrl, '_blank')}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    {t('projects.detail.sourceCode')}
                  </Button>
                )}
                {project.caseStudyUrl && (
                  <Button 
                    variant="outline"
                    className="border-neutral-700 text-neutral-300 hover:bg-neutral-900"
                    onClick={() => window.open(project.caseStudyUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {t('projects.detail.caseStudy')}
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              {(project.coverImage || (project.images && project.images.length > 0)) ? (
                <div className="relative rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-900 aspect-square">
                  <ImageWithFallback
                    src={project.coverImage || project.images[0]} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                    priority={true}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Gradient overlay pour meilleur contraste */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-900 p-16 aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-mint/5 to-transparent"></div>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="relative z-10 w-48 h-48 rounded-3xl bg-gradient-to-br from-mint/20 to-mint/5 border border-mint/30 flex items-center justify-center"
                  >
                    <Icon className="h-24 w-24 text-mint" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      {project.challenge && (
        <section className="py-24 px-6 border-t border-neutral-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                  <Target className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-red-400">{t('projects.detail.challenge')}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('projects.detail.challengeTitle')}</h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-lg text-neutral-300 leading-relaxed whitespace-pre-line">
                  {project.challenge}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Challenges List (if array) */}
      {project.challenges && Array.isArray(project.challenges) && project.challenges.length > 0 && (
        <section className="py-24 px-6 border-t border-neutral-900">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                <Target className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400">Défis</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Challenges Rencontrés</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {project.challenges.map((challenge: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-xl bg-neutral-950/50 border border-neutral-900 hover:border-red-500/20 transition-all"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-sm font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-neutral-300 leading-relaxed">{challenge}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Solution Section */}
      {project.solution && (
        <section className="py-24 px-6 bg-neutral-950/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/10 border border-mint/20 mb-6">
                  <Sparkles className="h-4 w-4 text-mint" />
                  <span className="text-sm text-mint">{t('projects.detail.solution')}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('projects.detail.solutionTitle')}</h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-lg text-neutral-300 leading-relaxed whitespace-pre-line">
                  {project.solution}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Features List */}
      {project.features && Array.isArray(project.features) && project.features.length > 0 && (
        <section className="py-24 px-6 border-t border-neutral-900">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/10 border border-mint/20 mb-6">
                <CheckCircle2 className="h-4 w-4 text-mint" />
                <span className="text-sm text-mint">Fonctionnalités</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Fonctionnalités Clés</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.features.map((feature: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-xl bg-neutral-950/50 border border-neutral-900 hover:border-mint/20 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-mint/10 border border-mint/20 flex items-center justify-center group-hover:bg-mint group-hover:border-mint transition-all">
                      <CheckCircle2 className="h-4 w-4 text-mint group-hover:text-black transition-colors" />
                    </div>
                    <p className="text-neutral-300 leading-relaxed flex-1">{feature}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {project.results && (
        <section className="py-24 px-6 border-t border-neutral-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/10 border border-mint/20 mb-6">
                  <CheckCircle2 className="h-4 w-4 text-mint" />
                  <span className="text-sm text-mint">{t('projects.detail.results')}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('projects.detail.resultsTitle')}</h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-lg text-neutral-300 leading-relaxed whitespace-pre-line">
                  {project.results}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Image Gallery */}
      {project.images && project.images.length > 0 && (
        <section className="py-24 px-6 bg-neutral-950/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold">{t('projects.detail.gallery')}</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {project.images.map((image: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-2xl overflow-hidden border border-neutral-900 hover:border-mint/20 transition-all group"
                >
                  <ImageWithFallback
                    src={image} 
                    alt={`${project.title} - Image ${idx + 1}`}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('projects.detail.similarProjectTitle')}
            </h2>
            <p className="text-xl text-neutral-400 mb-8">
              {t('projects.detail.similarProjectDescription')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={() => onNavigate("contact")}
                className="bg-mint text-black hover:bg-mint/90"
              >
                {t('projects.detail.discussProject')}
              </Button>
              <Button 
                onClick={() => onNavigate("booking")}
                variant="outline"
                className="border-mint/20 text-mint hover:bg-mint/10"
              >
                {t('projects.detail.bookCall')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
