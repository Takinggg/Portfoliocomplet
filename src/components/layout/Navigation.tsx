import { Button } from "../ui/button";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { GlobalSearch } from "../GlobalSearch";
import { useNavigate, useLocation } from "react-router-dom";

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

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAuthenticated: boolean;
}

interface SubMenuItem {
  id: Page;
  label: string;
  description?: string;
  icon?: string;
}

interface MenuItem {
  label: string;
  description?: string;
  items?: SubMenuItem[];
  id?: Page;
}

export default function Navigation({
  currentPage,
  onNavigate,
  isAuthenticated,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<
    string | null
  >(null);
  const [expandedMobileSection, setExpandedMobileSection] =
    useState<string | null>(null);
  const { t, language, setLanguage } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Fonction pour changer de langue en restant sur la même page (même chemin)
  const handleLanguageChange = (newLang: "fr" | "en") => {
    if (newLang === language) return;

    // Update language context
    setLanguage(newLang);

    // Conserver le chemin courant et remplacer le préfixe /fr ou /en
    const { pathname, search, hash } = window.location;
    const pathWithoutLang =
      pathname.replace(/^\/(fr|en)(?=\/|$)/, "") || "";
    const nextPath = `/${newLang}${pathWithoutLang}${search}${hash}`;
    console.log(
      "🌍 Changement langue (stay on page):",
      language,
      "→",
      newLang,
      "|",
      pathname,
      "→",
      nextPath,
    );
    navigate(nextPath, { replace: true });
  };

  const menuStructure: MenuItem[] = [
    {
      label: t("nav.expertise"),
      description: t("nav.expertiseDesc"),
      items: [
        {
          id: "services",
          label: t("nav.services"),
          description: t("nav.servicesDesc"),
          icon: "🎯",
        },
        {
          id: "projects",
          label: t("nav.projects"),
          description: t("nav.projectsDesc"),
          icon: "💼",
        },
        {
          id: "case-studies",
          label: t("nav.caseStudies"),
          description: t("nav.caseStudiesDesc"),
          icon: "📊",
        },
      ],
    },
    {
      label: t("nav.content"),
      description: t("nav.contentDesc"),
      items: [
        {
          id: "blog",
          label: t("nav.blog"),
          description: t("nav.blogDesc"),
          icon: "✍️",
        },
        {
          id: "resources",
          label: t("nav.resources"),
          description: t("nav.resourcesDesc"),
          icon: "📚",
        },
        {
          id: "faq",
          label: t("nav.faq"),
          description: t("nav.faqDesc"),
          icon: "❓",
        },
      ],
    },
    {
      label: t("nav.company"),
      description: t("nav.companyDesc"),
      items: [
        {
          id: "about",
          label: t("nav.about"),
          description: t("nav.aboutDesc"),
          icon: "👤",
        },
        {
          id: "testimonials",
          label: t("nav.testimonials"),
          description: t("nav.testimonialsDesc"),
          icon: "⭐",
        },
        {
          id: "contact",
          label: t("nav.contact"),
          description: t("nav.contactDesc"),
          icon: "📧",
        },
      ],
    },
  ];

  const isPageInMenu = (
    menuItem: MenuItem,
    page: Page,
  ): boolean => {
    return (
      menuItem.items?.some((item) => item.id === page) || false
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-900/50 bg-[#0C0C0C]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate("home")}
            className="relative group"
          >
            <span className="text-xl font-bold text-white">
              Maxence
            </span>
            <span className="text-xl font-bold text-mint">
              .
            </span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mint group-hover:w-full transition-all duration-300"></div>
          </motion.button>

          {/* Desktop Navigation with Dropdowns */}
          <div className="hidden lg:flex items-center gap-2">
            {menuStructure.map((menu, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() =>
                  setActiveDropdown(menu.label)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isPageInMenu(menu, currentPage)
                      ? "text-mint bg-mint/10"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {menu.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      activeDropdown === menu.label
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdown === menu.label &&
                    menu.items && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-80 bg-[#0C0C0C] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                      >
                        {/* Dropdown Header */}
                        <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                          <p className="text-xs text-neutral-400">
                            {menu.description}
                          </p>
                        </div>

                        {/* Dropdown Items */}
                        <div className="py-2">
                          {menu.items.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                onNavigate(item.id);
                                setActiveDropdown(null);
                              }}
                              className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-white/5 transition-all group ${
                                currentPage === item.id
                                  ? "bg-mint/10"
                                  : ""
                              }`}
                            >
                              <span className="text-2xl mt-0.5">
                                {item.icon}
                              </span>
                              <div className="flex-1 text-left">
                                <div
                                  className={`text-sm font-medium ${
                                    currentPage === item.id
                                      ? "text-mint"
                                      : "text-white group-hover:text-mint"
                                  }`}
                                >
                                  {item.label}
                                </div>
                                {item.description && (
                                  <div className="text-xs text-neutral-400 mt-0.5">
                                    {item.description}
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            {/* Global Search */}
            <GlobalSearch
              onNavigate={(page) => onNavigate(page as Page)}
            />

            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => handleLanguageChange("fr")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                  language === "fr"
                    ? "bg-mint text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
                aria-label="Français"
                title="Français"
              >
                <span className="inline-flex items-center gap-1">
                  <svg
                    className="w-4 h-3"
                    viewBox="0 0 3 2"
                    fill="currentColor"
                  >
                    <rect width="1" height="2" fill="#0055A4" />
                    <rect
                      x="1"
                      width="1"
                      height="2"
                      fill="#FFFFFF"
                    />
                    <rect
                      x="2"
                      width="1"
                      height="2"
                      fill="#EF4135"
                    />
                  </svg>
                  FR
                </span>
              </button>
              <button
                onClick={() => handleLanguageChange("en")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                  language === "en"
                    ? "bg-mint text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
                aria-label="English"
                title="English"
              >
                <span className="inline-flex items-center gap-1">
                  <svg
                    className="w-4 h-3"
                    viewBox="0 0 60 30"
                    fill="currentColor"
                  >
                    <rect
                      width="60"
                      height="30"
                      fill="#012169"
                    />
                    <path
                      d="M0,0 L60,30 M60,0 L0,30"
                      stroke="#FFFFFF"
                      strokeWidth="6"
                    />
                    <path
                      d="M0,0 L60,30 M60,0 L0,30"
                      stroke="#C8102E"
                      strokeWidth="4"
                      clipPath="inset(0)"
                    />
                    <path
                      d="M30,0 V30 M0,15 H60"
                      stroke="#FFFFFF"
                      strokeWidth="10"
                    />
                    <path
                      d="M30,0 V30 M0,15 H60"
                      stroke="#C8102E"
                      strokeWidth="6"
                    />
                  </svg>
                  EN
                </span>
              </button>
            </div>

            <Button
              onClick={() => onNavigate("dashboard")}
              size="sm"
              className="hidden md:flex bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-mint/30 rounded-lg font-medium transition-all group"
            >
              <svg
                className="h-4 w-4 mr-2 text-mint group-hover:rotate-12 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              {isAuthenticated ? "Dashboard" : t("nav.login")}
            </Button>
            <Button
              onClick={() => onNavigate("contact")}
              size="sm"
              className="hidden sm:flex bg-mint text-black hover:bg-mint/90 rounded-lg font-medium relative overflow-hidden group"
            >
              <span className="relative z-10">
                {t("nav.cta")}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-6 border-t border-neutral-900">
                {/* Mobile Search */}
                <div className="px-4 mb-4">
                  <GlobalSearch
                    onNavigate={(page) => {
                      onNavigate(page as Page);
                      setMobileMenuOpen(false);
                    }}
                  />
                </div>

                <div className="space-y-1">
                  {menuStructure.map((menu, menuIndex) => (
                    <div key={menuIndex}>
                      {/* Mobile Section Header */}
                      <button
                        onClick={() =>
                          setExpandedMobileSection(
                            expandedMobileSection === menu.label
                              ? null
                              : menu.label,
                          )
                        }
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                          isPageInMenu(menu, currentPage)
                            ? "bg-mint/10 text-mint"
                            : "text-neutral-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {menu.label}
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            expandedMobileSection === menu.label
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>

                      {/* Mobile Section Items */}
                      <AnimatePresence>
                        {expandedMobileSection === menu.label &&
                          menu.items && (
                            <motion.div
                              initial={{
                                opacity: 0,
                                height: 0,
                              }}
                              animate={{
                                opacity: 1,
                                height: "auto",
                              }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pr-2 py-2 space-y-1">
                                {menu.items.map(
                                  (item, itemIndex) => (
                                    <motion.button
                                      key={item.id}
                                      initial={{
                                        opacity: 0,
                                        x: -10,
                                      }}
                                      animate={{
                                        opacity: 1,
                                        x: 0,
                                      }}
                                      transition={{
                                        delay: itemIndex * 0.05,
                                      }}
                                      onClick={() => {
                                        onNavigate(item.id);
                                        setMobileMenuOpen(
                                          false,
                                        );
                                        setExpandedMobileSection(
                                          null,
                                        );
                                      }}
                                      className={`w-full text-left px-4 py-3 rounded-lg flex items-start gap-3 transition-all ${
                                        currentPage === item.id
                                          ? "text-mint bg-mint/10"
                                          : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                                      }`}
                                    >
                                      <span className="text-xl">
                                        {item.icon}
                                      </span>
                                      <div className="flex-1">
                                        <div
                                          className={`text-sm font-medium ${
                                            currentPage ===
                                            item.id
                                              ? "text-mint"
                                              : ""
                                          }`}
                                        >
                                          {item.label}
                                        </div>
                                        {item.description && (
                                          <div className="text-xs text-neutral-500 mt-0.5">
                                            {item.description}
                                          </div>
                                        )}
                                      </div>
                                    </motion.button>
                                  ),
                                )}
                              </div>
                            </motion.div>
                          )}
                      </AnimatePresence>
                    </div>
                  ))}

                  <div className="pt-4 px-4 space-y-2">
                    {/* Mobile Language Switcher */}
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="h-4 w-4 text-neutral-400" />
                      <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10 flex-1">
                        <button
                          onClick={() => {
                            handleLanguageChange("fr");
                            setMobileMenuOpen(false);
                          }}
                          className={`flex-1 px-3 py-2 rounded text-xs font-bold transition-all ${
                            language === "fr"
                              ? "bg-mint text-black"
                              : "text-neutral-400 hover:text-white"
                          }`}
                          aria-label="Français"
                          title="Français"
                        >
                          <span className="inline-flex items-center justify-center gap-1">
                            <svg
                              className="w-4 h-3"
                              viewBox="0 0 3 2"
                              fill="currentColor"
                            >
                              <rect
                                width="1"
                                height="2"
                                fill="#0055A4"
                              />
                              <rect
                                x="1"
                                width="1"
                                height="2"
                                fill="#FFFFFF"
                              />
                              <rect
                                x="2"
                                width="1"
                                height="2"
                                fill="#EF4135"
                              />
                            </svg>
                            FR
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            handleLanguageChange("en");
                            setMobileMenuOpen(false);
                          }}
                          className={`flex-1 px-3 py-2 rounded text-xs font-bold transition-all ${
                            language === "en"
                              ? "bg-mint text-black"
                              : "text-neutral-400 hover:text-white"
                          }`}
                          aria-label="English"
                          title="English"
                        >
                          <span className="inline-flex items-center justify-center gap-1">
                            <svg
                              className="w-4 h-3"
                              viewBox="0 0 60 30"
                              fill="currentColor"
                            >
                              <rect
                                width="60"
                                height="30"
                                fill="#012169"
                              />
                              <path
                                d="M0,0 L60,30 M60,0 L0,30"
                                stroke="#FFFFFF"
                                strokeWidth="6"
                              />
                              <path
                                d="M0,0 L60,30 M60,0 L0,30"
                                stroke="#C8102E"
                                strokeWidth="4"
                                clipPath="inset(0)"
                              />
                              <path
                                d="M30,0 V30 M0,15 H60"
                                stroke="#FFFFFF"
                                strokeWidth="10"
                              />
                              <path
                                d="M30,0 V30 M0,15 H60"
                                stroke="#C8102E"
                                strokeWidth="6"
                              />
                            </svg>
                            EN
                          </span>
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        onNavigate("dashboard");
                        setMobileMenuOpen(false);
                      }}
                      size="sm"
                      className="w-full bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-mint/30 rounded-lg font-medium"
                    >
                      <svg
                        className="h-4 w-4 mr-2 text-mint"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                      {isAuthenticated
                        ? "Dashboard"
                        : t("nav.login")}
                    </Button>
                    <Button
                      onClick={() => {
                        onNavigate("contact");
                        setMobileMenuOpen(false);
                      }}
                      size="sm"
                      className="w-full bg-mint text-black hover:bg-mint/90 rounded-lg font-medium"
                    >
                      {t("nav.cta")}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}