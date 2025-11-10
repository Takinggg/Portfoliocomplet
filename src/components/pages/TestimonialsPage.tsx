import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, Quote, Linkedin, Briefcase, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar } from "../ui/avatar";
import Masonry from "react-responsive-masonry";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  clientPhoto?: string;
  rating: number;
  testimonial: string;
  projectType: string;
  date: string;
  linkedinUrl?: string;
  featured: boolean;
}

interface TestimonialsPageProps {
  onNavigate?: (page: string) => void;
}

export default function TestimonialsPage({ onNavigate }: TestimonialsPageProps = {}) {
  const { t, language } = useTranslation();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [currentFeatured, setCurrentFeatured] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, [language]);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/testimonials?lang=${language}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const featuredTestimonials = testimonials.filter(t => t.featured);
  const regularTestimonials = testimonials.filter(t => !t.featured);

  const filteredTestimonials = filter === "all" 
    ? regularTestimonials 
    : regularTestimonials.filter(t => t.projectType === filter);

  const projectTypes = Array.from(new Set(testimonials.map(t => t.projectType)));

  const nextFeatured = () => {
    setCurrentFeatured((prev) => (prev + 1) % featuredTestimonials.length);
  };

  const prevFeatured = () => {
    setCurrentFeatured((prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length);
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#00FFC2]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#00FFC2]/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-[#00FFC2]/20 mb-6">
              {t.testimonials.hero.badge}
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6">
              {t.testimonials.hero.title}
              <span className="block mt-2">
                <span className="text-[#00FFC2]">{t.testimonials.hero.titleHighlight}</span>
              </span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              {t.testimonials.hero.subtitle}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
          >
            <Card className="bg-black/40 border-[#00FFC2]/10 p-6 text-center">
              <div className="text-4xl mb-2 text-[#00FFC2]">{testimonials.length}</div>
              <div className="text-white/60">{t.testimonials.stats.testimonials}</div>
            </Card>
            <Card className="bg-black/40 border-[#00FFC2]/10 p-6 text-center">
              <div className="text-4xl mb-2 text-[#00FFC2]">
                {testimonials.length > 0 
                  ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
                  : "5.0"}
              </div>
              <div className="text-white/60">{t.testimonials.stats.averageRating}</div>
            </Card>
            <Card className="bg-black/40 border-[#00FFC2]/10 p-6 text-center">
              <div className="text-4xl mb-2 text-[#00FFC2]">
                {testimonials.filter(t => t.rating === 5).length}
              </div>
              <div className="text-white/60">{t.testimonials.stats.fiveStars}</div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Featured Testimonials Carousel */}
      {featuredTestimonials.length > 0 && (
        <section className="py-20 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <Card className="bg-gradient-to-br from-black/60 to-black/40 border-[#00FFC2]/20 p-8 md:p-12">
                <Quote className="h-12 w-12 text-[#00FFC2]/20 mb-6" />
                
                <motion.div
                  key={currentFeatured}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < featuredTestimonials[currentFeatured].rating
                            ? "fill-[#00FFC2] text-[#00FFC2]"
                            : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-2xl md:text-3xl text-white/90 mb-8 leading-relaxed">
                    "{featuredTestimonials[currentFeatured].testimonial}"
                  </p>

                  {/* Client Info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-[#00FFC2]/20">
                      {featuredTestimonials[currentFeatured].clientPhoto ? (
                        <ImageWithFallback
                          src={featuredTestimonials[currentFeatured].clientPhoto} 
                          alt={featuredTestimonials[currentFeatured].clientName}
                          className="object-cover w-full h-full"
                          sizes="64px"
                          priority={true}
                        />
                      ) : (
                        <div className="w-full h-full bg-[#00FFC2]/10 flex items-center justify-center text-2xl text-[#00FFC2]">
                          {featuredTestimonials[currentFeatured].clientName.charAt(0)}
                        </div>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium text-lg text-white">
                        {featuredTestimonials[currentFeatured].clientName}
                      </div>
                      <div className="text-white/60">
                        {featuredTestimonials[currentFeatured].clientRole} • {featuredTestimonials[currentFeatured].clientCompany}
                      </div>
                      {featuredTestimonials[currentFeatured].linkedinUrl && (
                        <a
                          href={featuredTestimonials[currentFeatured].linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1 text-[#00FFC2] hover:underline text-sm"
                        >
                          <Linkedin className="h-3.5 w-3.5" />
                          {t.testimonials.carousel.viewOnLinkedIn}
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Navigation */}
                {featuredTestimonials.length > 1 && (
                  <div className="flex items-center justify-between mt-8 pt-8 border-t border-[#00FFC2]/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevFeatured}
                      className="text-white/60 hover:text-white hover:bg-white/5"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      {t.testimonials.carousel.previous}
                    </Button>
                    <div className="flex gap-2">
                      {featuredTestimonials.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentFeatured(i)}
                          className={`h-2 rounded-full transition-all ${
                            i === currentFeatured
                              ? "w-8 bg-[#00FFC2]"
                              : "w-2 bg-white/20 hover:bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextFeatured}
                      className="text-white/60 hover:text-white hover:bg-white/5"
                    >
                      {t.testimonials.carousel.next}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Filters */}
      {projectTypes.length > 0 && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className={
                  filter === "all"
                    ? "bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
                    : "border-[#00FFC2]/20 text-white hover:bg-white/5"
                }
              >
                {t.testimonials.filters.all}
              </Button>
              {projectTypes.map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? "default" : "outline"}
                  onClick={() => setFilter(type)}
                  className={
                    filter === type
                      ? "bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
                      : "border-[#00FFC2]/20 text-white hover:bg-white/5"
                  }
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Grid - Masonry Layout */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center text-white/40 py-20">
              {t.testimonials.loading}
            </div>
          ) : testimonials.length === 0 ? (
            // Empty State avec exemples de panel
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-2xl mx-auto"
              >
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-[#00FFC2]/20 blur-3xl rounded-full" />
                  <Quote className="h-20 w-20 text-[#00FFC2] relative" />
                </div>
                <h2 className="text-3xl mb-4 text-white">{t.testimonials.empty.title}</h2>
                <p className="text-white/60 mb-8">
                  {t.testimonials.empty.subtitle}
                </p>
              </motion.div>

              {/* Example Testimonials Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {t.testimonials.examples.map((example, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="bg-black/40 border-[#00FFC2]/10 p-6 relative overflow-hidden">
                      {/* "Example" watermark */}
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                          {t.testimonials.empty.exampleBadge}
                        </Badge>
                      </div>

                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="h-12 w-12 border-2 border-[#00FFC2]/20">
                          <div className="w-full h-full bg-[#00FFC2]/10 flex items-center justify-center text-lg text-[#00FFC2]">
                            {example.name.charAt(0)}
                          </div>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-white">{example.name}</div>
                          <div className="text-sm text-white/60">{example.role}</div>
                          <div className="text-xs text-white/40">{example.company}</div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-[#00FFC2] text-[#00FFC2]"
                          />
                        ))}
                      </div>

                      {/* Testimonial */}
                      <p className="text-white/80 text-sm mb-4 leading-relaxed">
                        "{example.text}"
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#00FFC2]/10">
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                          {example.type}
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <Card className="bg-gradient-to-br from-[#00FFC2]/10 to-blue-500/10 border-[#00FFC2]/20 p-8 max-w-2xl mx-auto">
                  <Quote className="h-10 w-10 text-[#00FFC2] mx-auto mb-4" />
                  <h3 className="text-2xl text-white mb-3">
                    {t.testimonials.cta.title}
                  </h3>
                  <p className="text-white/70 mb-6">
                    {t.testimonials.cta.subtitle}
                  </p>
                  <Button
                    onClick={() => onNavigate?.('contact')}
                    className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    {t.testimonials.cta.button}
                  </Button>
                </Card>
              </motion.div>
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="text-center text-white/40 py-20">
              <Quote className="h-16 w-16 mx-auto mb-4 text-[#00FFC2]/20" />
              <p>{t.testimonials.noResults.message}</p>
              <Button
                onClick={() => setFilter("all")}
                variant="outline"
                className="mt-4 border-[#00FFC2]/20 text-white hover:bg-white/5"
              >
                {t.testimonials.noResults.button}
              </Button>
            </div>
          ) : (
            <Masonry columnsCount={3} gutter="24px">
              {filteredTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="bg-black/40 border-[#00FFC2]/10 p-6 hover:border-[#00FFC2]/30 transition-all group">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-12 w-12 border-2 border-[#00FFC2]/20">
                        {testimonial.clientPhoto ? (
                          <ImageWithFallback
                            src={testimonial.clientPhoto} 
                            alt={testimonial.clientName}
                            className="object-cover w-full h-full"
                            sizes="48px"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#00FFC2]/10 flex items-center justify-center text-lg text-[#00FFC2]">
                            {testimonial.clientName.charAt(0)}
                          </div>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-white">{testimonial.clientName}</div>
                        <div className="text-sm text-white/60">{testimonial.clientRole}</div>
                        <div className="text-xs text-white/40">{testimonial.clientCompany}</div>
                      </div>
                      {testimonial.linkedinUrl && (
                        <a
                          href={testimonial.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00FFC2] hover:text-[#00FFC2]/80 transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? "fill-[#00FFC2] text-[#00FFC2]"
                              : "text-white/20"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Testimonial */}
                    <Quote className="h-8 w-8 text-[#00FFC2]/20 mb-2" />
                    <p className="text-white/80 leading-relaxed mb-4">
                      {testimonial.testimonial}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center gap-4 pt-4 border-t border-[#00FFC2]/10">
                      <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-[#00FFC2]/20 text-xs">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {testimonial.projectType}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-white/40">
                        <Calendar className="h-3 w-3" />
                        {new Date(testimonial.date).toLocaleDateString('fr-FR', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </Masonry>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FFC2]/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl tracking-tight mb-6">
              {t.testimonials.finalCta.title}
              <span className="text-[#00FFC2]"> {t.testimonials.finalCta.titleHighlight}</span> ?
            </h2>
            <p className="text-xl text-white/60 mb-8">
              {t.testimonials.finalCta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
                onClick={() => onNavigate?.("contact")}
              >
                {t.testimonials.finalCta.startProject}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#00FFC2]/20 text-white hover:bg-white/5"
                onClick={() => onNavigate?.("booking")}
              >
                {t.testimonials.finalCta.bookCall}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
