import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Quote,
  Clock,
  Target,
  Zap,
  Users
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { Avatar } from "../ui/avatar";
import { getCaseStudiesForLanguage } from "../../utils/caseStudiesDataBilingual";
import { CaseStudy } from "../../utils/freelanceConfig";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { Breadcrumbs } from "../layout/Breadcrumbs";

interface CaseStudyDetailPageProps {
  caseStudyId: string;
  onNavigate: (page: string, id?: string) => void;
}

export function CaseStudyDetailPage({ caseStudyId, onNavigate }: CaseStudyDetailPageProps) {
  const { language, t } = useTranslation();
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCaseStudy = async () => {
      setIsLoading(true);
      
      try {
        // Always use bilingual static data for consistent multilingual experience
        const bilingualCaseStudies = getCaseStudiesForLanguage(language as 'fr' | 'en');
        const staticData = bilingualCaseStudies.find((cs) => cs.id === caseStudyId);
        console.log(`✅ Case study loaded in ${language} mode:`, staticData?.title);
        setCaseStudy(staticData || null);
      } catch (error) {
        console.error("Error loading case study:", error);
        setCaseStudy(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadCaseStudy();
  }, [caseStudyId, language]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FFC2] mx-auto mb-4"></div>
          <p className="text-white/60">{t('caseStudies.loading')}</p>
        </div>
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">{t('caseStudies.notFound')}</p>
          <Button onClick={() => onNavigate("case-studies")} variant="outline">
            {t('caseStudies.backToList')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 hero-gradient opacity-40" />
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="relative max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumbs */}
            <Breadcrumbs
              items={[
                { label: "Accueil", onClick: () => onNavigate("home") },
                { label: "Case Studies", onClick: () => onNavigate("case-studies") },
                { label: caseStudy.title, isActive: true }
              ]}
            />
            
            <Button
              variant="ghost"
              onClick={() => onNavigate("case-studies")}
              className="mb-8 text-white/60 hover:text-white -ml-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('caseStudies.backToList')}
            </Button>

            <div className="flex items-center gap-3 mb-6">
              <Badge className="bg-[#00FFC2]/20 text-[#00FFC2] border-[#00FFC2]/30">
                {caseStudy.category}
              </Badge>
              <span className="text-white/40">{caseStudy.year}</span>
            </div>

            <h1 className="mb-6 max-w-4xl">{caseStudy.title}</h1>
            <p className="text-2xl text-white/70 mb-8 max-w-3xl">
              {caseStudy.tagline}
            </p>

            <div className="flex flex-wrap gap-6 mb-12">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-[#00FFC2]" />
                <div>
                  <div className="text-sm text-white/50">{t('caseStudies.client')}</div>
                  <div className="text-white">{caseStudy.client}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-[#00FFC2]" />
                <div>
                  <div className="text-sm text-white/50">{t('caseStudies.totalDuration')}</div>
                  <div className="text-white">
                    {caseStudy.process.reduce((acc, step) => {
                      const weeks = parseInt(step.duration);
                      return acc + (isNaN(weeks) ? 0 : weeks);
                    }, 0)} {t('caseStudies.weeks')}
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {caseStudy.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-white/20 text-white/70"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Image */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl aspect-video border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FFC2]/10 to-transparent z-10" />
          <ImageWithFallback
            src={caseStudy.images[0]}
            alt={caseStudy.title}
            className="w-full h-full object-cover"
            priority={true}
            sizes="100vw"
          />
        </motion.div>
      </section>

      {/* Challenge Section */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <Target className="h-6 w-6 text-red-400" />
            </div>
            <h2 className="text-red-400">{t('caseStudies.challenge')}</h2>
          </div>

          <h3 className="mb-6">{caseStudy.challenge.title}</h3>
          <p className="text-xl text-white/70 mb-8 leading-relaxed">
            {caseStudy.challenge.description}
          </p>

          <Card className="bg-white/5 border-white/10 p-8">
            <h4 className="mb-6 text-white/90">{t('caseStudies.painPoints')}</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {caseStudy.challenge.painPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-red-500/10"
                >
                  <div className="mt-1 h-2 w-2 rounded-full bg-red-400 flex-shrink-0" />
                  <p className="text-white/70 text-sm">{point}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Solution Section */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-[#00FFC2]/10 border border-[#00FFC2]/20">
              <Zap className="h-6 w-6 text-[#00FFC2]" />
            </div>
            <h2 className="text-[#00FFC2]">{t('caseStudies.solution')}</h2>
          </div>

          <h3 className="mb-6">{caseStudy.solution.title}</h3>
          <p className="text-xl text-white/70 mb-12 leading-relaxed">
            {caseStudy.solution.description}
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Approach */}
            <Card className="bg-white/5 border-white/10 p-8">
              <h4 className="mb-6 text-white/90">{t('caseStudies.approach')}</h4>
              <div className="space-y-4">
                {caseStudy.solution.approach.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-[#00FFC2] mt-0.5 flex-shrink-0" />
                    <p className="text-white/70 text-sm">{item}</p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Technologies */}
            <Card className="bg-white/5 border-white/10 p-8">
              <h4 className="mb-6 text-white/90">{t('caseStudies.techStack')}</h4>
              <div className="flex flex-wrap gap-2">
                {caseStudy.solution.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    className="bg-[#00FFC2]/10 text-[#00FFC2] border-[#00FFC2]/20"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Additional Images */}
          {caseStudy.images.length > 1 && (
            <div className="grid md:grid-cols-2 gap-6">
              {caseStudy.images.slice(1).map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative overflow-hidden rounded-xl aspect-video border border-white/10"
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${caseStudy.title} - Image ${index + 2}`}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Results Section */}
      <section className="relative overflow-hidden py-20 mb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FFC2]/5 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-[#00FFC2]/20 border border-[#00FFC2]/30">
                <TrendingUp className="h-6 w-6 text-[#00FFC2]" />
              </div>
              <h2>{t('caseStudies.results')}</h2>
            </div>

            <h3 className="mb-6">{caseStudy.results.title}</h3>
            <p className="text-xl text-white/70 mb-12 leading-relaxed">
              {caseStudy.results.description}
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {caseStudy.results.metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group relative overflow-hidden border-white/10 bg-white/5 hover:border-[#00FFC2]/30 transition-all duration-500 p-6 text-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00FFC2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="text-3xl mb-2 text-[#00FFC2]">
                        {metric.value}
                      </div>
                      <div className="text-sm text-white/60 mb-2">
                        {metric.label}
                      </div>
                      {metric.change && (
                        <Badge
                          className={
                            metric.positive
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-white/10 text-white/60"
                          }
                        >
                          {metric.change}
                        </Badge>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="relative overflow-hidden border-[#00FFC2]/20 bg-gradient-to-br from-[#00FFC2]/10 to-transparent p-12">
            <Quote className="absolute top-8 right-8 h-24 w-24 text-[#00FFC2]/10" />
            <div className="relative">
              <p className="text-2xl text-white/90 mb-8 leading-relaxed italic">
                "{caseStudy.testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-[#00FFC2]/30">
                  <div className="w-full h-full bg-gradient-to-br from-[#00FFC2]/20 to-[#00FFC2]/5 flex items-center justify-center">
                    <span className="text-[#00FFC2] text-xl">
                      {caseStudy.testimonial.author.charAt(0)}
                    </span>
                  </div>
                </Avatar>
                <div>
                  <div className="text-white mb-1">{caseStudy.testimonial.author}</div>
                  <div className="text-sm text-white/60">
                    {caseStudy.testimonial.role} · {caseStudy.testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-6 text-center">{t('caseStudies.process')}</h2>
          <p className="text-center text-white/60 mb-12 max-w-2xl mx-auto">
            {t('caseStudies.processSubtitle')}
          </p>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00FFC2]/50 via-[#00FFC2]/20 to-transparent hidden md:block" />

            <div className="space-y-8">
              {caseStudy.process.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <Card className="md:ml-20 bg-white/5 border-white/10 hover:border-[#00FFC2]/30 transition-all duration-500 p-6">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[68px] top-8 hidden md:block">
                      <div className="h-4 w-4 rounded-full bg-[#00FFC2] border-4 border-[#0C0C0C]" />
                    </div>

                    <div className="flex items-start justify-between gap-6 mb-4">
                      <div>
                        <Badge className="bg-[#00FFC2]/20 text-[#00FFC2] mb-3">
                          {step.phase}
                        </Badge>
                        <h4 className="text-white mb-2">{step.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-white/50 flex-shrink-0">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{step.duration}</span>
                      </div>
                    </div>
                    <p className="text-white/70">{step.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-[#00FFC2]/20 p-12 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FFC2]/10 to-transparent" />
          <div className="relative">
            <h2 className="mb-4">{t('caseStudies.similarProject.title')}</h2>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto">
              {t('caseStudies.similarProject.subtitle')}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => onNavigate("contact")}
                size="lg"
                className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
              >
                {t('caseStudies.similarProject.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => onNavigate("case-studies")}
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:border-[#00FFC2]/50"
              >
                {t('caseStudies.similarProject.viewMore')}
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
