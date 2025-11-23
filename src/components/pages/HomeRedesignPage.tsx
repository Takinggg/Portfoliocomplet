import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home as RedesignHome } from "../../redesign/components/home/Home";
import type { PageView } from "../../redesign/types";

interface HomeRedesignPageProps {
  onNavigate?: (page: string) => void;
}

export default function HomeRedesignPage({ onNavigate }: HomeRedesignPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const lang = location.pathname.startsWith("/en") ? "en" : "fr";

  const buildPath = useCallback(
    (page: string) => {
      if (page === "home") {
        return `/${lang}`;
      }
      if (page === "dashboard" || page === "login") {
        return `/${page}`;
      }
      return `/${lang}/${page}`;
    },
    [lang]
  );

  const directNavigate = useCallback(
    (page: string) => {
      if (onNavigate) {
        onNavigate(page);
        return;
      }
      navigate(buildPath(page));
    },
    [buildPath, navigate, onNavigate]
  );

  const handleChangePage = useCallback(
    (view: PageView) => {
      if (view === "admin") {
        navigate("/dashboard");
        return;
      }

      const map: Record<PageView, string> = {
        home: "home",
        services: "services",
        portfolio: "projects",
        casestudies: "case-studies",
        contact: "contact",
        admin: "dashboard",
      };

      directNavigate(map[view]);
    },
    [directNavigate, navigate]
  );

  return (
    <div className="relative overflow-hidden bg-background text-foreground">
      <RedesignHome onChangePage={handleChangePage} />
    </div>
  );
}
