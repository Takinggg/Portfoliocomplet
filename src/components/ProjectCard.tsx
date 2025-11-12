import { motion } from "motion/react";
import { ArrowUpRight, Calendar, Clock, User } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslation } from "../utils/i18n/useTranslation";
import { Badge } from "./ui/badge";

interface ProjectCardProps {
  project: {
    id: string;
    name?: string;
    title?: string;
    title_fr?: string;
    title_en?: string;
    description?: string;
    description_fr?: string;
    description_en?: string;
    imageUrl?: string;
    coverImage?: string;
    category?: string;
    technologies?: string[];
    client?: string;
    clientName?: string;
    clientName_fr?: string;
    clientName_en?: string;
    year?: number;
    duration?: string;
    featured?: boolean;
    slug?: string;
    slug_fr?: string;
    slug_en?: string;
  };
  index: number;
  onProjectClick?: (projectId: string) => void;
}

export function ProjectCard({ project, index, onProjectClick }: ProjectCardProps) {
  const { t, language } = useTranslation();
  
  // Normalize project data for current language
  const isEn = language === 'en';
  const title = isEn 
    ? (project.title_en || project.title_fr || project.title || project.name)
    : (project.title_fr || project.title || project.name);
  const description = isEn
    ? (project.description_en || project.description_fr || project.description)
    : (project.description_fr || project.description);
  const clientName = isEn
    ? (project.clientName_en || project.clientName_fr || project.clientName || project.client)
    : (project.clientName_fr || project.clientName || project.client);
  const imageUrl = project.coverImage || project.imageUrl;
  
  const handleClick = () => {
    if (onProjectClick && project.id) {
      const slug = isEn ? (project.slug_en || project.slug_fr || project.slug) : (project.slug_fr || project.slug);
      onProjectClick(slug || project.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onClick={handleClick}
      className="group relative bg-[#0C0C0C] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-mint/30 transition-all duration-300"
    >
      {/* Project Image */}
      {imageUrl && (
        <div className="relative h-64 overflow-hidden">
          <ImageWithFallback
            src={imageUrl}
            alt={title || ''}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/60 to-transparent" />
          
          {/* Category badge on image */}
          {project.category && (
            <Badge
              className="absolute top-4 left-4 bg-mint text-black border-0 font-semibold"
            >
              {t(`projects.card.categories.${project.category}`) || t('projects.card.categories.other')}
            </Badge>
          )}
          
          {/* Featured badge */}
          {project.featured && (
            <Badge
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white border-white/20"
            >
              ⭐ {t('projects.featured.badge')}
            </Badge>
          )}
        </div>
      )}
      
      {/* Project Content */}
      <div className="p-6 flex flex-col h-full">
        <h3 className="text-xl font-bold mb-3 group-hover:text-mint transition-colors line-clamp-2">
          {title}
        </h3>
        
        <p className="text-neutral-400 mb-4 line-clamp-2 text-sm leading-relaxed">
          {description || t('projects.card.completedProject')}
        </p>
        
        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 4).map((tech: string, idx: number) => (
              <span
                key={idx}
                className="text-xs bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-neutral-300"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-xs text-neutral-500 flex items-center">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        )}
        
        {/* Footer metadata */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-4 text-xs text-white/50">
            {clientName && (
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {clientName}
              </span>
            )}
            {project.year && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {project.year}
              </span>
            )}
            {project.duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {project.duration}
              </span>
            )}
          </div>
          
          {/* View project arrow */}
          <motion.div
            className="flex items-center gap-2 text-mint text-sm font-medium"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowUpRight className="h-4 w-4" />
          </motion.div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-mint/5 to-transparent" />
      </div>
    </motion.div>
  );
}
