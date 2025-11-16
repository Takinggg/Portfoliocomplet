import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Globe, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { GlobalSearch } from "../GlobalSearch";
import { useTranslation } from "../../utils/i18n/useTranslation";

type Page =
  | "home"
  | "projects"
  | "services"
  | "about"
  | "contact"
  | "booking"
  | "dashboard"
  | "blog"
  | "case-studies"
  | "faq"
  | "resources"
  | "testimonials";

type NavigationProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAuthenticated: boolean;
};

const PAGE_LABEL_MAP: Record<Page, string> = {
  home: "nav.home",
  projects: "nav.projects",
  "case-studies": "nav.caseStudies",
  services: "nav.services",
  about: "nav.about",
  contact: "nav.contact",
  booking: "nav.booking",
  dashboard: "nav.dashboard",
  blog: "nav.blog",
  faq: "nav.faq",
  resources: "nav.resources",
  testimonials: "nav.testimonials",
};

const navCollections: Array<{ titleKey: string; links: Page[] }> = [
  { titleKey: "nav.expertise", links: ["services", "projects", "case-studies"] },
  { titleKey: "nav.content", links: ["blog", "resources", "faq"] },
  { titleKey: "nav.company", links: ["about", "testimonials", "contact"] },
];

export default function Navigation({ currentPage, onNavigate, isAuthenticated }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation();
  const navigate = useNavigate();

  const handleLanguageChange = (newLang: "fr" | "en") => {
    if (newLang === language) return;
    setLanguage(newLang);

    const { pathname, search, hash } = window.location;
    const pathWithoutLang = pathname.replace(/^\/(fr|en)(?=\/|$)/, "") || "";
    const nextPath = `/${newLang}${pathWithoutLang}${search}${hash}`;
    navigate(nextPath, { replace: true });
  };

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const getPageLabel = (page: Page) => t(PAGE_LABEL_MAP[page] ?? "nav.home");

  const renderLanguageSwitcher = (variant: "desktop" | "mobile" = "desktop") => (
    <div
      className={`${
        variant === "desktop" ? "hidden sm:flex" : "flex"
      } items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 ${
        variant === "mobile" ? "w-full justify-between" : ""
      }`}
    >
      {variant === "mobile" && <Globe className="h-4 w-4 text-neutral-400" />}
      {["fr", "en"].map((lang) => (
        <button
          key={lang}
          onClick={() => handleLanguageChange(lang as "fr" | "en")}
          className={`px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full transition-all ${
            language === lang ? "bg-mint text-black" : "text-neutral-400 hover:text-white"
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <motion.button whileHover={{ scale: 1.02 }} className="flex items-center gap-1" onClick={() => handleNavigate("home")}>
          <span className="text-lg font-bold text-white">Maxence</span>
          <span className="text-lg font-bold text-mint">.</span>
        </motion.button>

        <div className="hidden lg:flex flex-1 items-center justify-center gap-6">
          {navCollections.map((collection) => (
            <div key={collection.titleKey} className="text-center">
              <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">{t(collection.titleKey)}</p>
              <div className="mt-2 flex items-center gap-3">
                {collection.links.map((linkId) => (
                  <button
                    key={linkId}
                    onClick={() => handleNavigate(linkId)}
                    className={`text-sm font-medium transition-colors ${
                      currentPage === linkId ? "text-mint" : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    {getPageLabel(linkId)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <GlobalSearch onNavigate={(page) => handleNavigate(page as Page)} />
          {renderLanguageSwitcher()}
          <Button
            size="sm"
            variant="ghost"
            className="border border-white/10 text-white"
            onClick={() => handleNavigate("dashboard")}
          >
            {isAuthenticated ? "Dashboard" : t("nav.login")}
          </Button>
          <Button size="sm" className="bg-mint text-black" onClick={() => handleNavigate("contact")}>
            {t("nav.cta")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <GlobalSearch onNavigate={(page) => handleNavigate(page as Page)} />
          <button
            className="rounded-full border border-white/10 p-2 text-neutral-400"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-white/5 bg-[#050505]"
          >
            <div className="space-y-6 px-6 py-6">
              {renderLanguageSwitcher("mobile")}
              {navCollections.map((collection) => (
                <div key={collection.titleKey}>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
                    {t(collection.titleKey)}
                  </p>
                  <div className="mt-3 grid gap-2">
                    {collection.links.map((linkId) => (
                      <button
                        key={linkId}
                        onClick={() => handleNavigate(linkId)}
                        className="rounded-xl border border-white/5 px-4 py-3 text-left text-sm text-white"
                      >
                        {getPageLabel(linkId)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="grid gap-3">
                <Button className="w-full bg-mint text-black" onClick={() => handleNavigate("contact")}>
                  {t("nav.cta")}
                </Button>
                <Button variant="outline" className="border-white/10 text-white" onClick={() => handleNavigate("dashboard")}>
                  {isAuthenticated ? "Dashboard" : t("nav.login")}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}