import type { Project, TechItem } from "../redesign/types";
import { redesignProjects } from "../redesign/data";
import type { CaseStudy as LegacyCaseStudy } from "./freelanceConfig";
import type { CaseStudy as RemoteCaseStudy } from "./unifiedDataService";

export type SupportedLang = "fr" | "en";
export type CaseStudySource = LegacyCaseStudy | RemoteCaseStudy;

const DEFAULT_ROLES: Record<SupportedLang, string> = {
  fr: "Directeur Produit & Tech Lead",
  en: "Lead Product & Tech Partner",
};

const TIMELINE_LABELS: Record<SupportedLang, string> = {
  fr: "étapes",
  en: "phases",
};

const HARD_FALLBACK_PROJECT: Project = {
  id: "case-study-fallback",
  title: "Case Study",
  client: "Client",
  category: "General",
  image: "",
  link: "#",
  description: "",
  tags: [],
};

const ensureFallbackProject = (fallback?: Project | null): Project => fallback ?? redesignProjects[0] ?? HARD_FALLBACK_PROJECT;

const pickLocalizedString = (value: string | undefined, valueEn: string | undefined, lang: SupportedLang): string | undefined => {
  return lang === "en" ? valueEn ?? value : value ?? valueEn;
};

const pickLocalizedList = (value: string[] | undefined, valueEn: string[] | undefined, lang: SupportedLang): string[] | undefined => {
  return lang === "en" ? valueEn ?? value : value ?? valueEn;
};

const combineTextParts = (parts: Array<string | undefined>): string | undefined => {
  const sanitized = parts.map((part) => part?.trim()).filter((part): part is string => Boolean(part));
  return sanitized.length ? sanitized.join(" — ") : undefined;
};

const mapTechnologies = (technologies?: string[]): TechItem[] | undefined => {
  if (!technologies || technologies.length === 0) {
    return undefined;
  }
  return technologies.map((name) => ({ name, category: "Tech" }));
};

type LocalizedTestimonial = LegacyCaseStudy["testimonial"] | NonNullable<RemoteCaseStudy["testimonial"]>;
type PossibleFeedback = Project["feedback"] | LocalizedTestimonial | null | undefined;

const hasLocalizedTestimonial = (testimonial: PossibleFeedback): testimonial is LocalizedTestimonial => {
  if (!testimonial) {
    return false;
  }
  return "quote_en" in testimonial || "role_en" in testimonial;
};

const buildTimeline = (caseStudy: CaseStudySource, lang: SupportedLang, fallbackTimeline?: string): string | undefined => {
  if (Array.isArray(caseStudy.process) && caseStudy.process.length > 0) {
    return `${caseStudy.process.length} ${TIMELINE_LABELS[lang]}`;
  }
  return caseStudy.year || fallbackTimeline;
};

const resolveSlug = (caseStudy: CaseStudySource): string => {
  return (caseStudy as { slug?: string }).slug || caseStudy.id;
};

export function mapCaseStudyToProject(caseStudy: CaseStudySource, lang: SupportedLang, fallback?: Project | null): Project {
  const baseProject = ensureFallbackProject(fallback);
  const slug = resolveSlug(caseStudy);
  const primaryImage = caseStudy.images?.[0] || caseStudy.thumbnail || baseProject.image;
  const gallery = caseStudy.images?.length ? caseStudy.images : baseProject.gallery;
  const deliverables = pickLocalizedList(caseStudy.solution?.approach, caseStudy.solution?.approach_en, lang) || baseProject.deliverables || [];
  const tags = pickLocalizedList(caseStudy.tags, caseStudy.tags_en, lang) || baseProject.tags || [];
  const derivedStats = caseStudy.results?.metrics?.length
    ? caseStudy.results.metrics.map((metric) => ({
        label: pickLocalizedString(metric.label, metric.label_en, lang) || metric.label,
        value: metric.value,
        change: (metric as { change?: string }).change,
      }))
    : undefined;
  const derivedTechStack = mapTechnologies(caseStudy.solution?.technologies);
  const feedbackSource = caseStudy.testimonial || baseProject.feedback;
  const timeline = buildTimeline(caseStudy, lang, baseProject.timeline);
  const formattedFeedback = feedbackSource
    ? hasLocalizedTestimonial(feedbackSource)
      ? {
          quote: pickLocalizedString(feedbackSource.quote, feedbackSource.quote_en, lang) || feedbackSource.quote,
          author: feedbackSource.author,
          role: pickLocalizedString(feedbackSource.role, feedbackSource.role_en, lang) || feedbackSource.role,
        }
      : feedbackSource
    : undefined;

  return {
    ...baseProject,
    id: slug,
    title: pickLocalizedString(caseStudy.title, caseStudy.title_en, lang) || caseStudy.title || baseProject.title,
    subtitle:
      pickLocalizedString(caseStudy.tagline, caseStudy.tagline_en, lang) || caseStudy.tagline || baseProject.subtitle || baseProject.description,
    client: caseStudy.client || baseProject.client,
    category: pickLocalizedString(caseStudy.category, caseStudy.category_en, lang) || caseStudy.category || baseProject.category,
    image: primaryImage,
    link: slug ? `/${lang}/case-studies/${slug}` : baseProject.link || "#",
    year: caseStudy.year || baseProject.year,
    timeline,
    role: DEFAULT_ROLES[lang],
    description: pickLocalizedString(caseStudy.description, caseStudy.description_en, lang) || caseStudy.description || baseProject.description,
    challenge:
      combineTextParts([
        pickLocalizedString(caseStudy.challenge?.title, caseStudy.challenge?.title_en, lang),
        pickLocalizedString(caseStudy.challenge?.description, caseStudy.challenge?.description_en, lang),
      ]) || baseProject.challenge,
    solution:
      combineTextParts([
        pickLocalizedString(caseStudy.solution?.title, caseStudy.solution?.title_en, lang),
        pickLocalizedString(caseStudy.solution?.description, caseStudy.solution?.description_en, lang),
      ]) || baseProject.solution,
    deliverables,
    tags,
    stats: derivedStats || baseProject.stats,
    techStack: derivedTechStack ?? baseProject.techStack,
    feedback: formattedFeedback ?? baseProject.feedback,
    gallery: gallery && gallery.length ? gallery : baseProject.gallery,
  };
}
