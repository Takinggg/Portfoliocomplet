import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CaseStudyDetailPage as RedesignCaseStudyDetailPage } from "../../redesign/components/pages/CaseStudyDetailPage";
import type { Project } from "../../redesign/types";
import { redesignProjects } from "../../redesign/data";
import { getCaseStudiesForLanguage } from "../../utils/caseStudiesDataBilingual";
import type { CaseStudy as LegacyCaseStudy } from "../../utils/freelanceConfig";
import { fetchCaseStudy } from "../../utils/unifiedDataService";
import { mapCaseStudyToProject } from "../../utils/caseStudyMapper";
import type { SupportedLang } from "../../utils/caseStudyMapper";

interface CaseStudyDetailPageProps {
  caseStudyId?: string;
  onNavigate?: (page: string) => void;
}

type LoaderState = {
  loading: boolean;
  error?: string | null;
};

export function CaseStudyDetailPage({ caseStudyId, onNavigate }: CaseStudyDetailPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const lang: SupportedLang = location.pathname.startsWith("/en") ? "en" : "fr";

  const [project, setProject] = useState<Project | null>(null);
  const [state, setState] = useState<LoaderState>({ loading: true });

  const fallbackProject = useMemo<Project | null>(() => redesignProjects[0] || null, []);
  const localizedFallback = useMemo<LegacyCaseStudy | null>(() => {
    if (!caseStudyId) return null;
    const localized = getCaseStudiesForLanguage(lang);
    return localized.find((item) => item.id === caseStudyId) || null;
  }, [caseStudyId, lang]);

  useEffect(() => {
    let cancelled = false;

    const loadCaseStudy = async () => {
      setState({ loading: true, error: null });

      if (!caseStudyId) {
        setProject(fallbackProject);
        setState({ loading: false, error: "missing-id" });
        return;
      }

      try {
        const remote = await fetchCaseStudy(caseStudyId);
        if (cancelled) return;

        if (remote) {
          setProject(mapCaseStudyToProject(remote, lang, fallbackProject));
          setState({ loading: false });
          return;
        }

        if (localizedFallback) {
          setProject(mapCaseStudyToProject(localizedFallback, lang, fallbackProject));
          setState({ loading: false, error: "not-found" });
          return;
        }

        setProject(fallbackProject);
        setState({ loading: false, error: "not-found" });
      } catch (error) {
        console.error("Failed to load case study", error);
        if (cancelled) return;

        if (localizedFallback) {
          setProject(mapCaseStudyToProject(localizedFallback, lang, fallbackProject));
        } else {
          setProject(fallbackProject);
        }
        setState({ loading: false, error: "fetch-error" });
      }
    };

    loadCaseStudy();

    return () => {
      cancelled = true;
    };
  }, [caseStudyId, fallbackProject, lang, localizedFallback]);

  const handleBack = () => {
    if (onNavigate) {
      onNavigate("case-studies");
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(lang === "en" ? "/en/case-studies" : "/fr/case-studies");
  };

  if (state.loading || !project) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" aria-hidden="true" />
        <p className="text-sm text-white/60 uppercase tracking-[0.3em]">
          {state.error === "missing-id" ? "Case study introuvable" : "Chargement en cours"}
        </p>
      </div>
    );
  }

  return (
    <RedesignCaseStudyDetailPage
      project={project}
      onBack={handleBack}
    />
  );
}
