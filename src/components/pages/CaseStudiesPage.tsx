import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Project } from "../../redesign/types";
import { CaseStudiesPage as RedesignCaseStudiesPage } from "../../redesign/components/pages/CaseStudiesPage";
import { redesignProjects } from "../../redesign/data";
import { ContactCTA } from "../../redesign/components/ContactCTA";
import { getCaseStudiesForLanguage } from "../../utils/caseStudiesDataBilingual";
import { fetchCaseStudies } from "../../utils/unifiedDataService";
import { mapCaseStudyToProject } from "../../utils/caseStudyMapper";
import type { CaseStudySource, SupportedLang } from "../../utils/caseStudyMapper";
import { FullScreenLoader } from "../../redesign/components/FullScreenLoader";

interface CaseStudiesPageProps {
  onNavigate?: (page: string, caseStudyId?: string) => void;
}

type LoaderState = {
  loading: boolean;
  error?: "fallback" | "empty" | "fetch-error" | null;
};

const LABELS: Record<SupportedLang, { heading: string; allFilter: string }> = {
  fr: { heading: "Études de cas", allFilter: "Toutes" },
  en: { heading: "Case Studies", allFilter: "All" },
};

const CTA_LABELS: Record<SupportedLang, { title: string; subtitle: string; action: string }> = {
  fr: {
    title: "Votre prochain produit mérite un lancement premium.",
    subtitle: "Planifions une étude de cas avec des résultats aussi concrets que ceux présentés ci-dessus.",
    action: "Planifier un projet",
  },
  en: {
    title: "Your next product deserves a premium launch.",
    subtitle: "Let's craft a case-study-worthy project with measurable outcomes.",
    action: "Book a project call",
  },
};

const STATUS_MESSAGES: Record<NonNullable<LoaderState["error"]>, Record<SupportedLang, string>> = {
  fallback: {
    fr: "Serveur indisponible : affichage des études statiques.",
    en: "Live data unavailable, showing offline case studies.",
  },
  empty: {
    fr: "Aucune étude n'est disponible pour le moment. Revenez bientôt.",
    en: "No case studies available right now. Please check back later.",
  },
  "fetch-error": {
    fr: "Impossible de récupérer les données Supabase. Dataset local affiché.",
    en: "Supabase request failed. Showing cached dataset instead.",
  },
};

const mapCaseStudyListToProjects = (list: CaseStudySource[], lang: SupportedLang): Project[] => {
  if (!list || list.length === 0) {
    return redesignProjects;
  }

  return list.map((caseStudy, index) => {
    const fallback = redesignProjects[index % redesignProjects.length] ?? redesignProjects[0];
    return mapCaseStudyToProject(caseStudy, lang, fallback);
  });
};

export function CaseStudiesPage({ onNavigate }: CaseStudiesPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const lang: SupportedLang = location.pathname.startsWith("/en") ? "en" : "fr";

  const [projects, setProjects] = useState<Project[]>([]);
  const [state, setState] = useState<LoaderState>({ loading: true });

  const bilingualFallback = useMemo(() => getCaseStudiesForLanguage(lang), [lang]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setState({ loading: true, error: null });
      try {
        const remote = await fetchCaseStudies();
        if (cancelled) return;

        if (remote.length) {
          setProjects(mapCaseStudyListToProjects(remote, lang));
          setState({ loading: false, error: null });
          return;
        }

        if (bilingualFallback.length) {
          setProjects(mapCaseStudyListToProjects(bilingualFallback, lang));
          setState({ loading: false, error: "fallback" });
          return;
        }

        setProjects(redesignProjects);
        setState({ loading: false, error: "empty" });
      } catch (error) {
        console.error("Failed to load case studies list", error);
        if (cancelled) return;

        if (bilingualFallback.length) {
          setProjects(mapCaseStudyListToProjects(bilingualFallback, lang));
          setState({ loading: false, error: "fallback" });
        } else {
          setProjects(redesignProjects);
          setState({ loading: false, error: "fetch-error" });
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [bilingualFallback, lang]);

  const handleProjectClick = (projectId: string | number) => {
    const id = String(projectId);
    const target = projects.find((project) => String(project.id) === id);
    if (target?.link) {
      navigate(target.link);
    } else {
      navigate(`/${lang}/case-studies/${id}`);
    }
  };

  const handleContactClick = () => {
    if (onNavigate) {
      onNavigate("contact");
      return;
    }
    navigate(`/${lang}/contact`);
  };

  if (state.loading) {
    return (
      <FullScreenLoader
        message={lang === "en" ? "Loading case studies" : "Chargement des études"}
        subtext={lang === "en" ? "One moment please" : "Merci de patienter"}
      />
    );
  }

  const statusMessage = state.error ? STATUS_MESSAGES[state.error][lang] : null;
  const cta = CTA_LABELS[lang];

  return (
    <div className="bg-[#050505]">
      {statusMessage && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-200 text-center text-sm px-6 py-3">
          {statusMessage}
        </div>
      )}

      <RedesignCaseStudiesPage
        projects={projects.length ? projects : redesignProjects}
        labels={LABELS[lang]}
        onProjectClick={handleProjectClick}
      />

      <section className="border-t border-white/5 px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <ContactCTA
            eyebrow={lang === "en" ? "Next collaboration" : "Prochain projet"}
            title={cta.title}
            description={cta.subtitle}
            primaryAction={{ label: cta.action, onClick: handleContactClick }}
            helperText={lang === "en" ? "Answer in 24h" : "Réponse sous 24h"}
          />
        </div>
      </section>
    </div>
  );
}
