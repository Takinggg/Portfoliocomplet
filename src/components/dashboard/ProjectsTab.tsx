import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  ExternalLink,
  Github,
  Calendar,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { contentService, type Project as ProjectType } from "../../services/contentService";
import { ProjectDialog } from "./ProjectDialog";

export function ProjectsTab() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await contentService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Erreur lors du chargement des projets");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;

    try {
      await contentService.deleteProject(projectId);
      toast.success("Projet supprimé");
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const filteredProjects = projects.filter(project => {
    const search = searchTerm.toLowerCase();
    return (
      project.title_fr?.toLowerCase().includes(search) ||
      project.description_fr?.toLowerCase().includes(search) ||
      project.technologies?.some(tech => tech?.toLowerCase().includes(search))
    );
  });

  const statusColors = {
    draft: "bg-gray-500/20 text-gray-400",
    published: "bg-green-500/20 text-green-400",
    archived: "bg-red-500/20 text-red-400"
  };

  const statusLabels = {
    draft: "Brouillon",
    published: "Publié",
    archived: "Archivé"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            Projets Portfolio
          </h3>
          <p className="text-sm text-white/60">
            {projects.length} projet{projects.length > 1 ? "s" : ""}
          </p>
        </div>
        
        <Button
          onClick={() => {
            setSelectedProject(null);
            setDialogOpen(true);
          }}
          className="bg-cyan-500 text-white hover:bg-cyan-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Projet
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un projet..."
          className="pl-10 bg-white/5 border-white/10 text-white"
        />
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 text-white/60">
          <p>Aucun projet trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-cyan-500/50 transition-all group"
            >
              {/* Cover Image */}
              <div className="relative h-48 bg-white/10 overflow-hidden">
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt={project.title_fr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <Eye className="w-12 h-12" />
                  </div>
                )}
                
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-yellow-500 text-black">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className={statusColors[project.status]}>
                    {statusLabels[project.status]}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">
                    {project.title_fr}
                  </h4>
                  <p className="text-sm text-white/60 line-clamp-2">
                    {project.description_fr}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-white/40">
                  {project.year && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {project.year}
                    </div>
                  )}
                  {project.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {project.duration}
                    </div>
                  )}
                  {project.views !== undefined && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {project.views}
                    </div>
                  )}
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <Badge
                      key={tech}
                      className="bg-cyan-500/10 text-cyan-400 text-xs"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies && project.technologies.length > 3 && (
                    <Badge className="bg-white/5 text-white/40 text-xs">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Links */}
                <div className="flex items-center gap-2">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedProject(project);
                      setDialogOpen(true);
                    }}
                    className="flex-1 text-white/70 hover:text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(project.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Project Dialog */}
      <ProjectDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        onSuccess={() => {
          fetchProjects();
          setDialogOpen(false);
          setSelectedProject(null);
        }}
      />
    </div>
  );
}
