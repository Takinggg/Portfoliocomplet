import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingUp, Users, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { getCaseStudiesForLanguage } from "../../utils/caseStudiesDataBilingual";
import { CaseStudy } from "../../utils/freelanceConfig";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { GridSkeleton, CaseStudyCardSkeleton, PageHeaderSkeleton } from "../ui/loading-skeletons";
import { PageTransition } from "../PageTransition";

interface CaseStudiesPageProps {
  onNavigate: (page: string, caseStudyId?: string) => void;
}

export function CaseStudiesPage({ onNavigate }: CaseStudiesPageProps) {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bilingual case studies based on current language
  useEffect(() => {
    const loadCaseStudies = async () => {
      setIsLoading(true);
      try {
        // Always use bilingual static data for consistent multilingual experience
        const bilingualData = getCaseStudiesForLanguage(language as 'fr' | 'en');
        console.log(`✅ Case studies loaded in ${language} mode:`, bilingualData.length);
        setCaseStudies(bilingualData);
      } catch (error) {
        console.error("Error loading case studies:", error);
        setCaseStudies([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCaseStudies();
  }, [language]);

  // Get unique categories from actual case studies
  const uniqueCategories = Array.from(new Set(caseStudies.map(cs => cs.category))).filter(Boolean);
  const categories = [
    t('caseStudies.filters.all'),
    ...uniqueCategories
  ];

  const filteredCaseStudies = selectedCategory && selectedCategory !== t('caseStudies.filters.all')
    ? caseStudies.filter((cs) => cs.category === selectedCategory)
    : caseStudies;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <PageHeaderSkeleton />
          <GridSkeleton count={6} columns={3} Component={CaseStudyCardSkeleton} />
        </div>
      </div>
    );
  }

  return (
    <PageTransition show={!isLoading} mode="fade">
      <div className="min-h-screen bg-[#0C0C0C] pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="absolute inset-0 grid-pattern opacity-30" />

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FFC2]/10 border border-[#00FFC2]/20 mb-6">
              <Sparkles className="h-4 w-4 text-[#00FFC2]" />
              <span className="text-sm text-[#00FFC2]">{t('caseStudies.hero.title')}</span>
            </div>

            <h1 className="mb-6 text-gradient-mint-animated">
              {t('caseStudies.hero.subtitle')}
            </h1>
            <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              {t('caseStudies.hero.subtitle')}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-3xl mb-1 text-[#00FFC2]">+280%</div>
                <div className="text-sm text-white/50">{t('home.results.title')}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-3xl mb-1 text-[#00FFC2]">12</div>
                <div className="text-sm text-white/50">{t('projects.stats.projects')}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl mb-1 text-[#00FFC2]">98%</div>
                <div className="text-sm text-white/50">{t('about.stats.clientsSatisfied')}</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3 justify-center flex-wrap"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category || (!selectedCategory && category === t('caseStudies.filters.all')) ? "default" : "outline"}
              onClick={() => setSelectedCategory(category === t('caseStudies.filters.all') ? null : category)}
              className={
                selectedCategory === category || (!selectedCategory && category === t('caseStudies.filters.all'))
                  ? "bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
                  : "border-white/10 text-white/70 hover:text-white hover:border-[#00FFC2]/50"
              }
            >
              {category}
            </Button>
          ))}
        </motion.div>
      </section>

      {/* Case Studies Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 gap-8">
          {filteredCaseStudies.map((caseStudy, index) => (
            <motion.div
              key={caseStudy.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="group relative overflow-hidden border-white/10 bg-white/5 hover:border-[#00FFC2]/30 transition-all duration-500 cursor-pointer">
                <div className="grid md:grid-cols-2 gap-8 p-8">
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-lg aspect-video">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00FFC2]/20 to-transparent z-10" />
                    <ImageWithFallback
                      src={caseStudy.thumbnail}
                      alt={caseStudy.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                    />
                    {caseStudy.featured && (
                      <div className="absolute top-4 right-4 z-20">
                        <Badge className="bg-[#00FFC2] text-[#0C0C0C]">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="outline" className="border-[#00FFC2]/30 text-[#00FFC2]">
                          {caseStudy.category}
                        </Badge>
                        <span className="text-sm text-white/40">{caseStudy.year}</span>
                      </div>

                      <h3 className="mb-3 text-white group-hover:text-[#00FFC2] transition-colors">
                        {caseStudy.title}
                      </h3>
                      <p className="text-white/40 text-sm mb-2">{caseStudy.client}</p>
                      <p className="text-white/60 mb-6">{caseStudy.tagline}</p>

                      {/* Quick Metrics */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {caseStudy.results.metrics.slice(0, 3).map((metric, i) => (
                          <div key={i} className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="text-lg text-[#00FFC2] mb-1">{metric.value}</div>
                            <div className="text-xs text-white/50">{metric.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {caseStudy.tags.slice(0, 4).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="border-white/10 text-white/60 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        const currentLang = window.location.pathname.match(/^\/(en|fr)/)?.[1] || 'fr';
                        navigate(`/${currentLang}/case-studies/${caseStudy.id}`);
                      }}
                      className="group/btn bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90 w-full"
                    >
                      {t('caseStudies.readMore')}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-[#00FFC2]/20 p-12 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FFC2]/10 to-transparent" />
          <div className="relative">
            <h2 className="mb-4">{t('projects.cta.title')}</h2>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto">
              {t('projects.cta.subtitle')}
            </p>
            <Button
              onClick={() => onNavigate("contact")}
              size="lg"
              className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
            >
              {t('nav.contact')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </section>
      </div>
    </PageTransition>
  );
}
