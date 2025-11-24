import { useEffect, useMemo, useState } from "react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { GridSkeleton, ProjectCardSkeleton, PageHeaderSkeleton } from "../ui/loading-skeletons";
import { PageTransition } from "../PageTransition";
import { fetchWithCache } from "../../utils/apiCache";
import { PortfolioPage as PortfolioRedesignPage } from "../../redesign/components/pages/PortfolioPage";
import { ContactCTA } from "../../redesign/components/ContactCTA";
import type { Project as RedesignProject } from "../../redesign/types";

type Page = "contact" | "booking";

interface ProjectsPageProps {
  onNavigate: (page: Page) => void;
  onProjectClick?: (projectId: string) => void; // kept for API compatibility, handled inside redesign detail cards
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop";
const FALLBACK_DESCRIPTION = "Projet confidentiel en cours de documentation.";
const FALLBACK_CLIENT = "Client confidentiel";

const formatCategory = (value?: string): string => {
  if (!value) return "Other";
  const normalized = value.toLowerCase();
  if (normalized.includes("fintech")) return "Fintech";
  if (normalized.includes("e-com")) return "E-Commerce";
  if (normalized.includes("ecommerce")) return "E-Commerce";
  if (normalized.includes("saas")) return "SaaS";
  if (normalized.includes("mobile")) return "Mobile";
  if (normalized.includes("web3")) return "Web3";
  if (normalized.includes("ai")) return "AI";
  return value.replace(/^./, (char) => char.toUpperCase()) || "Other";
};

const normalizeTags = (raw: unknown, fallbackCategory: string): string[] => {
  let tags: string[] = [];

  if (Array.isArray(raw)) {
    tags = raw.map((tag) => String(tag)).filter(Boolean);
  } else if (typeof raw === "string") {
    tags = raw
      .split(/[,|]/)
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return tags.length ? tags : [fallbackCategory];
};

const coerceGallery = (raw: unknown, fallbackImage: string): string[] => {
  if (Array.isArray(raw)) {
    return raw.map((img) => String(img)).filter(Boolean);
  }

  if (typeof raw === "string" && raw.length > 0) {
    return raw.split(/[,|]/).map((img) => img.trim()).filter(Boolean);
  }

  return [fallbackImage];
};

const pickImage = (project: Record<string, any>): string => {
  const candidate =
    project.imageUrl ||
    project.image_url ||
    project.coverImage ||
    project.cover_image ||
    project.thumbnail ||
    project.heroImage ||
    project.image;

  return typeof candidate === "string" && candidate.length > 5 ? candidate : FALLBACK_IMAGE;
};

const coerceTextBlock = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
      .filter(Boolean)
      .join(" - ");
  }
  if (typeof value === "string") {
    return value.trim();
  }
  return "";
};

const coerceStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean);
  }
  if (typeof value === "string" && value.trim().length) {
    return value
      .split(/\r?\n|[,|]/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
};

const mapToRedesignProjects = (items: any[], language: string): RedesignProject[] => {
  return items.map((project, index) => {
    const title = project.title || project.name || `Projet ${index + 1}`;
    const category = formatCategory(project.category || project.type || project.industry);
    const description = project.short_description || project.subtitle || project.description || FALLBACK_DESCRIPTION;
    const descriptionEn = project.description_en || project.short_description_en || project.description || description;
    const image = pickImage(project);

    const slug = language === "en"
      ? project.slug_en || project.slug_fr || project.slug
      : project.slug_fr || project.slug_en || project.slug;

    const challengeFr = coerceTextBlock(
      project.challenge || project.challenge_fr || project.challenges_fr || project.challenges || description
    );
    const challengeEn = coerceTextBlock(
      project.challenge_en || project.challenges_en || project.challenge || descriptionEn
    );

    const solutionFr = coerceTextBlock(
      project.solution || project.solution_fr || project.features_fr || project.features
    );
    const solutionEn = coerceTextBlock(
      project.solution_en || project.features_en || project.solution || solutionFr
    );

    const deliverablesFr = coerceStringArray(project.deliverables_fr || project.features_fr || project.deliverables);
    const deliverablesEn = coerceStringArray(project.deliverables_en || project.features_en || project.deliverables);

    const techStack = coerceStringArray(project.technologies || project.stack).map((tech: string) => ({
      name: tech,
      category: "Stack",
    }));

    return {
      id: project.id ?? slug ?? `project-${index}`,
      title,
      title_en: project.title_en || title,
      client: project.client || project.client_name || project.clientName || FALLBACK_CLIENT,
      category,
      image,
      description,
      description_en: descriptionEn,
      challenge: challengeFr,
      challenge_en: challengeEn,
      solution: solutionFr,
      solution_en: solutionEn,
      deliverables: deliverablesFr.length ? deliverablesFr : undefined,
      deliverables_en: deliverablesEn.length ? deliverablesEn : undefined,
      link: slug ? `/${language}/projects/${slug}` : project.url || "#",
      year: project.year?.toString() || project.launch_year?.toString(),
      tags: normalizeTags(project.tags || project.tags_fr || project.tags_en || project.technologies || project.stack, category),
      techStack: techStack.length ? techStack : undefined,
      gallery: coerceGallery(project.gallery || project.images, image),
    } satisfies RedesignProject;
  });
};

export default function ProjectsPage({ onNavigate }: ProjectsPageProps) {
  const { t, language } = useTranslation();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await fetchWithCache(
          `projects_${language}`,
          async () => {
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

            return response.json();
          },
          5 * 60 * 1000
        );

        setProjects(data.projects || []);
        if (import.meta.env.DEV) {
          console.log(`✅ Loaded ${data.projects?.length || 0} projects for language: ${language}`);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Error fetching projects:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [language]);

  const mappedProjects = useMemo(() => {
    if (!projects.length) return [];
    try {
      return mapToRedesignProjects(projects, language);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("Failed to map projects for redesign portfolio view:", error);
      }
      return [];
    }
  }, [projects, language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <PageHeaderSkeleton />
          <GridSkeleton count={6} columns={3} Component={ProjectCardSkeleton} />
        </div>
      </div>
    );
  }

  return (
    <PageTransition show={!loading} mode="fade">
      <div className="bg-[#050505] text-white">
        <PortfolioRedesignPage items={mappedProjects.length ? mappedProjects : undefined} />

        <section className="container mx-auto px-6 pb-24 pt-16 md:pt-24">
          {(() => {
            const closingCopy = (t as any)?.projects?.closing ?? {};
            const {
              eyebrow = "Nouvelle mission",
              title = "Co-créons votre prochain produit en 30 jours",
              description = "Prêt à lancer votre projet ? Partagez votre brief et je vous reviens dans les 24h avec un plan d'action clair.",
              primary = "Discuter du brief",
              secondary = "Réserver un créneau",
              helper = "Slots limités chaque mois",
            } = closingCopy;

            return (
              <ContactCTA
                eyebrow={eyebrow}
                title={title}
                description={description}
                primaryAction={{ label: primary, onClick: () => onNavigate("contact") }}
                secondaryAction={{ label: secondary, onClick: () => onNavigate("booking") }}
                helperText={helper}
              />
            );
          })()}
        </section>
      </div>
    </PageTransition>
  );
}
