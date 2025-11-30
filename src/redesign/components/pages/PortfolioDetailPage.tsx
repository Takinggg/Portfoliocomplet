import React from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Reveal } from '../Reveal';
import { Project } from '../../types';
import { useTranslation } from '../../../utils/i18n/useTranslation';
import { getLocalizedValue } from '../../../utils/i18n/localeUtils';

const fallbackProject: Project = {
    id: 0,
    title: "Abstract UI System",
    title_en: "Abstract UI System",
    category: "Art Direction",
    client: "Studio Alpha",
    year: "2024",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    timeline: "4 semaines",
    timeline_en: "4 weeks",
    role: "Direction artistique",
    role_en: "Art Direction",
    agency: "Freelance",
    agency_en: "Freelance",
    description:
        "Une exploration visuelle des frontières entre l'interface utilisateur et l'art abstrait. Ce projet vise à déconstruire les grilles conventionnelles pour créer une expérience numérique fluide et organique.",
    description_en:
        "A visual exploration at the edge of interface design and abstract art. The goal is to break conventional grids to craft a fluid, organic digital experience.",
    link: "#",
    tags: ["UI/UX", "Art Direction"],
    deliverables: ["UI Kit", "3D Assets"],
    deliverables_en: ["UI Kit", "3D Assets"],
    gallery: [
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2600&auto=format&fit=crop",
    ],
    feedback: {
        quote: "Un dispositif qui a dépassé nos attentes en donnant une âme à chaque écran.",
        quote_en: "A setup that exceeded expectations by giving life to every screen.",
        author: "Claire Dupont",
        role: "Head of Design",
        role_en: "Head of Design",
    },
    techStack: [
        { name: "React", category: "Frontend" },
        { name: "Three.js", category: "3D" },
        { name: "Tailwind", category: "UI" },
    ],
};

const DETAIL_COPY = {
    fr: {
        back: "Retour à l'archive",
        challenge: 'Le défi',
        solution: 'La solution',
        overview: 'Contexte',
        role: 'Rôle',
        agency: 'Agence',
        timeline: 'Planning',
        deliverables: 'Livrables',
        kpis: 'KPIs clés',
        techStack: 'Stack technique',
        testimonial: 'Témoignage client',
        gallery: 'Galerie projet',
        zoomHint: 'Scroll pour zoomer',
        resetZoom: 'Double-cliquer pour réinitialiser',
        nextProject: 'Projet suivant',
        nextProjectAria: 'Voir le projet suivant',
        figure: 'FIG',
    },
    en: {
        back: 'Back to archive',
        challenge: 'The Challenge',
        solution: 'The Solution',
        overview: 'Overview',
        role: 'Role',
        agency: 'Agency',
        timeline: 'Timeline',
        deliverables: 'Deliverables',
        kpis: 'Key KPIs',
        techStack: 'Technology Stack',
        testimonial: 'Client Testimonial',
        gallery: 'Project Gallery',
        zoomHint: 'Scroll to zoom',
        resetZoom: 'Double-click to reset',
        nextProject: 'Next Project',
        nextProjectAria: 'View next project',
        figure: 'FIG',
    },
} as const;

interface PortfolioDetailPageProps {
    project?: Project;
    onBack: () => void;
    onNext?: () => void;
}

export const PortfolioDetailPage: React.FC<PortfolioDetailPageProps> = ({ project, onBack, onNext }) => {
        const details = project ?? fallbackProject;
        const { language } = useTranslation();
        const copy = DETAIL_COPY[language];
    const overviewText = getLocalizedValue(language, details.description, details.description_en);
    const challengeText = getLocalizedValue(language, details.challenge ?? details.description, details.challenge_en ?? details.description_en);
    const solutionText = getLocalizedValue(language, details.solution, details.solution_en);
    const [activeImage, setActiveImage] = React.useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
    const [zoomLevel, setZoomLevel] = React.useState(1);
    React.useEffect(() => {
        setActiveImage(0);
        setIsLightboxOpen(false);
        setZoomLevel(1);
    }, [details.id]);
    const galleryImages = (details.gallery && details.gallery.length > 0
        ? details.gallery
        : (details.image ? [details.image] : [])).filter((src): src is string => Boolean(src));
    const safeGallery = galleryImages.length ? galleryImages : [fallbackProject.image];
    const hasMultipleImages = safeGallery.length > 1;
    const handlePrevImage = () => {
        setActiveImage((prev) => (prev - 1 + safeGallery.length) % safeGallery.length);
    };
    const handleNextImage = () => {
        setActiveImage((prev) => (prev + 1) % safeGallery.length);
    };
    const roleLabel = getLocalizedValue(language, details.role, details.role_en) || '—';
    const agencyLabel = getLocalizedValue(language, details.agency ?? details.client, details.agency_en ?? details.client) || '—';
    const timelineLabel = getLocalizedValue(language, details.timeline, details.timeline_en) || details.year || '—';
    const deliverablesList = language === 'fr'
        ? details.deliverables ?? []
        : details.deliverables_en ?? details.deliverables ?? [];
    const testimonialQuote = getLocalizedValue(language, details.feedback?.quote, details.feedback?.quote_en);
    const testimonialRole = getLocalizedValue(language, details.feedback?.role, details.feedback?.role_en);
    const testimonialAuthor = details.feedback?.author;
    const techItems = details.techStack?.map((item) => item.name) ?? details.tags ?? [];
    const techFallback = language === 'fr' ? 'Bientôt disponible' : 'Coming soon';
    const prevImageLabel = language === 'fr' ? 'Image précédente' : 'Previous image';
    const nextImageLabel = language === 'fr' ? 'Image suivante' : 'Next image';
    const enlargeLabel = language === 'fr' ? "Ouvrir l'image en plein écran" : 'Open image fullscreen';
    const enlargeHint = language === 'fr' ? 'Cliquer pour agrandir' : 'Click to enlarge';
    const closeLabel = language === 'fr' ? 'Fermer la galerie' : 'Close gallery';
    const zoomHint = copy.zoomHint;
    const resetZoomHint = copy.resetZoom;
    const stats = details.stats ?? [];
    const localizedStats = stats.map((stat) => ({
        value: stat.value,
        label: language === 'fr' ? (stat.label || stat.label_en || '') : (stat.label_en || stat.label || ''),
    })).filter((stat) => stat.value && stat.label);

    const openLightbox = (index: number) => {
        setActiveImage(index);
        setIsLightboxOpen(true);
        setZoomLevel(1);
    };
    const closeLightbox = () => {
        setIsLightboxOpen(false);
        setZoomLevel(1);
    };

    React.useEffect(() => {
        if (!isLightboxOpen) {
            return;
        }
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeLightbox();
            }
            if (event.key === 'ArrowLeft') {
                handlePrevImage();
            }
            if (event.key === 'ArrowRight') {
                handleNextImage();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isLightboxOpen, safeGallery.length]);

  return (
    <div className="bg-background min-h-screen animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Navigation Header */}
      <div className="fixed top-0 left-0 w-full z-40 px-6 py-6 pointer-events-none">
          <div className="container mx-auto flex justify-between">
                        <button 
                                onClick={onBack}
                                className="pointer-events-auto flex items-center gap-3 text-white mix-blend-difference hover:text-primary transition-colors group"
                        >
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
                            <span className="uppercase tracking-widest text-xs font-bold">{copy.back}</span>
                        </button>
          </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[80vh] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img 
                        src={details.image} 
                        alt={details.title} 
            className="w-full h-full object-cover parallax-img"
        />
        <div className="absolute bottom-0 left-0 w-full p-6 z-20 bg-gradient-to-t from-black via-black/50 to-transparent pt-32">
             <div className="container mx-auto">
                <Reveal>
                    <h1 className="font-display font-bold heading-hero text-white uppercase mb-4">
                                                {getLocalizedValue(language, details.title, details.title_en)}
                    </h1>
                </Reveal>
                <div className="flex flex-wrap gap-6 text-sm font-mono text-neutral-300">
                                        {details.category && (
                                            <span className="px-3 py-1 border border-white/20 rounded-full">{details.category}</span>
                                        )}
                                        {details.year && (
                                            <span className="px-3 py-1 border border-white/20 rounded-full">{details.year}</span>
                                        )}
                                        {details.client && (
                                            <span className="px-3 py-1 border border-white/20 rounded-full">{details.client}</span>
                                        )}
                </div>
             </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            
            {/* Sticky Sidebar */}
            <div className="lg:col-span-4">
                <div className="sticky top-32 space-y-12">
                    {overviewText && (
                        <Reveal>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">{copy.overview}</h3>
                                <p className="text-xl text-white font-light leading-relaxed">
                                    {overviewText}
                                </p>
                            </div>
                        </Reveal>
                    )}
                    <Reveal>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">{copy.challenge}</h3>
                        <p className="text-xl text-white font-light leading-relaxed">
                            {challengeText}
                        </p>
                    </Reveal>
                    {solutionText && (
                        <Reveal delay={150}>
                            <div>
                                <h3 className="mt-10 text-xs font-bold uppercase tracking-widest text-primary mb-4">{copy.solution}</h3>
                                <p className="text-xl text-white font-light leading-relaxed">
                                    {solutionText}
                                </p>
                            </div>
                        </Reveal>
                    )}
                    
                    <Reveal delay={200}>
                        <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                            <div>
                                <h4 className="text-xs text-neutral-500 uppercase mb-1">{copy.role}</h4>
                                <p className="text-white">{roleLabel}</p>
                            </div>
                            <div>
                                <h4 className="text-xs text-neutral-500 uppercase mb-1">{copy.agency}</h4>
                                <p className="text-white">{agencyLabel}</p>
                            </div>
                            <div>
                                <h4 className="text-xs text-neutral-500 uppercase mb-1">{copy.timeline}</h4>
                                <p className="text-white">{timelineLabel}</p>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Main Content & Gallery */}
            <div className="lg:col-span-8 space-y-16">
                {testimonialQuote && (
                    <Reveal delay={50}>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                            <p className="text-3xl md:text-4xl font-display font-medium text-white leading-tight">
                                &ldquo;{testimonialQuote}&rdquo;
                            </p>
                            <div className="mt-6 text-sm font-mono uppercase tracking-widest text-white/80">
                                <span>{testimonialAuthor || details.client}</span>
                                {testimonialRole && <span className="text-white/50"> &mdash; {testimonialRole}</span>}
                            </div>
                        </div>
                    </Reveal>
                )}

                <Reveal delay={testimonialQuote ? 120 : 60}>
                    <div>
                        <div className="mb-4 flex items-center justify-between text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">
                            <span>{copy.gallery}</span>
                            <span>{String(activeImage + 1).padStart(2, '0')}/{String(safeGallery.length).padStart(2, '0')}</span>
                        </div>
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                            <button
                                type="button"
                                onClick={() => openLightbox(activeImage)}
                                aria-label={enlargeLabel}
                                className="group block w-full"
                            >
                                <img
                                    src={safeGallery[activeImage]}
                                    alt={`${details.title} gallery ${activeImage + 1}`}
                                    className="w-full h-[520px] object-cover transition duration-300 group-hover:scale-[1.01]"
                                />
                                <span className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white opacity-0 group-hover:opacity-100 transition">
                                    {enlargeHint}
                                </span>
                            </button>
                            {hasMultipleImages && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        aria-label={prevImageLabel}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur hover:bg-primary hover:text-black transition"
                                    >
                                        <ArrowLeft size={18} />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        aria-label={nextImageLabel}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur hover:bg-primary hover:text-black transition"
                                    >
                                        <ArrowRight size={18} />
                                    </button>
                                </>
                            )}
                            <div className="absolute bottom-4 left-4 text-xs font-mono text-white/60 bg-black/50 px-3 py-1 rounded-full">
                                {copy.figure} {activeImage + 1}.0
                            </div>
                        </div>
                        {hasMultipleImages && (
                            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                                {safeGallery.map((img, index) => (
                                    <button
                                        key={`${img}-${index}`}
                                        onClick={() => setActiveImage(index)}
                                        className={`relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-xl border transition ${
                                            index === activeImage ? 'border-primary' : 'border-white/10 opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                                        {index === activeImage && <span className="absolute inset-0 border-2 border-primary/80 rounded-xl pointer-events-none" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </Reveal>

                {deliverablesList.length > 0 && (
                    <Reveal delay={200}>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                            <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-3">{copy.deliverables}</div>
                            <div className="flex flex-wrap gap-2">
                                {deliverablesList.map((item, index) => (
                                    <span key={`${item}-${index}`} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white text-sm">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                )}

                {localizedStats.length > 0 && (
                    <Reveal delay={220}>
                        <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-6">
                            <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-6">{copy.kpis}</div>
                            <div className="grid gap-6 sm:grid-cols-2">
                                {localizedStats.map((stat, index) => (
                                    <div key={`${stat.label}-${index}`} className="border border-white/5 rounded-xl p-4 bg-white/[0.01]">
                                        <p className="text-3xl font-display text-white">{stat.value}</p>
                                        <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/60">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                )}

                <Reveal delay={techItems.length ? 240 : 200}>
                    <div className="bg-[#111] p-12 rounded-2xl border border-white/5 text-center">
                        <h3 className="font-display text-2xl text-white mb-4">{copy.techStack}</h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {techItems.length ? (
                                techItems.map((tech) => (
                                    <span key={tech} className="px-4 py-2 bg-white/5 rounded text-neutral-400 text-sm">{tech}</span>
                                ))
                            ) : (
                                <span className="text-sm text-neutral-500">{techFallback}</span>
                            )}
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
      </div>
      
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4" onClick={closeLightbox}>
            <div
                className="relative flex w-full max-w-6xl flex-col items-center"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-3 flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-white/60">
                    <span>{zoomHint}</span>
                    <span>{resetZoomHint}</span>
                </div>
                <button
                    type="button"
                    aria-label={closeLabel}
                    onClick={closeLightbox}
                    className="absolute top-0 right-0 rounded-full border border-white/20 bg-white/10 p-3 text-white hover:bg-primary hover:text-black"
                >
                    <X size={18} />
                </button>
                <div className="relative flex w-full items-center justify-center">
                    <button
                        onClick={(event) => {
                            event.stopPropagation();
                            handlePrevImage();
                        }}
                        aria-label={prevImageLabel}
                        className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-4 text-white hover:bg-primary hover:text-black"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <div
                        className="relative max-h-[85vh] max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black/60"
                        onWheel={(event) => {
                            event.preventDefault();
                            const nextZoom = Math.min(3, Math.max(0.5, zoomLevel + event.deltaY * -0.001));
                            setZoomLevel(Number(nextZoom.toFixed(2)));
                        }}
                        onDoubleClick={() => setZoomLevel(1)}
                    >
                        <img
                            src={safeGallery[activeImage]}
                            alt={`${details.title} fullscreen ${activeImage + 1}`}
                            className="object-contain"
                            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
                        />
                    </div>
                    <button
                        onClick={(event) => {
                            event.stopPropagation();
                            handleNextImage();
                        }}
                        aria-label={nextImageLabel}
                        className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-4 text-white hover:bg-primary hover:text-black"
                    >
                        <ArrowRight size={22} />
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Next Project Footer */}
      <div className="border-t border-white/10 bg-[#0A0A0A] py-32 group cursor-pointer relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 block group-hover:text-primary transition-colors">{copy.nextProject}</span>
            <h2 className="heading-display font-display font-bold text-white uppercase leading-none group-hover:scale-105 transition-transform duration-500 origin-center">
                {getLocalizedValue(language, details.title, details.title_en)}
            </h2>
             <div className="mt-8 flex justify-center">
                <button
                  onClick={onNext}
                  className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-300"
                  aria-label={copy.nextProjectAria}
                >
                    <ArrowRight size={24} />
                </button>
            </div>
        </div>
      </div>

    </div>
  );
};