import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslation } from "../utils/i18n/useTranslation";

interface ProjectCardProps {
  project: any;
  index: number;
  onProjectClick?: (projectId: string) => void;
}

export function ProjectCard({ project, index, onProjectClick }: ProjectCardProps) {
  const { t } = useTranslation();
  const handleClick = () => {
    if (onProjectClick && project.id) {
      onProjectClick(project.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -10 }}
      onClick={handleClick}
      className="group relative bg-neutral-950/50 border border-neutral-800 rounded-3xl overflow-hidden backdrop-blur-xl cursor-pointer"
    >
      {/* Project Image */}
      {project.imageUrl && (
        <div className="relative h-64 overflow-hidden">
          <ImageWithFallback
            src={project.imageUrl}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
        </div>
      )}
      
      {/* Project Content */}
      <div className="p-8">
        <div className="flex items-center gap-2 mb-4">
          {project.category && (
            <span className="text-xs uppercase tracking-wider text-mint/80 bg-mint/10 border border-mint/20 rounded-full px-3 py-1">
              {t(`projects.card.categories.${project.category}`) || t('projects.card.categories.other')}
            </span>
          )}
        </div>
        
        <h3 className="text-2xl mb-3 group-hover:text-mint transition-colors">
          {project.name}
        </h3>
        
        <p className="text-neutral-400 mb-4 line-clamp-2">
          {project.description || t('projects.card.completedProject')}
        </p>
        
        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.slice(0, 3).map((tech: string, idx: number) => (
              <span
                key={idx}
                className="text-xs bg-neutral-900/80 border border-neutral-800 rounded-full px-3 py-1 text-neutral-400"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-xs text-neutral-500">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            {project.clientName || project.client}
          </div>
          <ArrowUpRight className="h-5 w-5 text-mint opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 border-2 border-mint/0 group-hover:border-mint/20 rounded-3xl transition-all duration-500" />
    </motion.div>
  );
}
