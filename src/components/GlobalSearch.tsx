import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, FileText, Briefcase, BookOpen, Info, Calendar, Command } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: "page" | "blog" | "project" | "case-study" | "resource";
  url: string;
  icon: any;
}

interface GlobalSearchProps {
  onNavigate: (page: string, id?: string) => void;
}

// DonnÃ©es de recherche (Ã  adapter selon votre contenu)
const searchableContent: Omit<SearchResult, "id">[] = [
  // Pages principales
  { title: "Accueil", description: "Page d'accueil - Portfolio et services", category: "page", url: "home", icon: Info },
  { title: "Services", description: "Mes services de dÃ©veloppement web", category: "page", url: "services", icon: Briefcase },
  { title: "Projets", description: "Portfolio de mes rÃ©alisations", category: "page", url: "projects", icon: Briefcase },
  { title: "Blog", description: "Articles et tutoriels", category: "page", url: "blog", icon: BookOpen },
  { title: "Case Studies", description: "Ã‰tudes de cas dÃ©taillÃ©es", category: "page", url: "case-studies", icon: FileText },
  { title: "Ã€ propos", description: "En savoir plus sur moi", category: "page", url: "about", icon: Info },
  { title: "Contact", description: "Me contacter", category: "page", url: "contact", icon: Info },
  { title: "RÃ©server un appel", description: "Prendre rendez-vous", category: "page", url: "booking", icon: Calendar },
  { title: "Ressources", description: "Ressources gratuites Ã  tÃ©lÃ©charger", category: "page", url: "resources", icon: FileText },
  { title: "TÃ©moignages", description: "Avis clients", category: "page", url: "testimonials", icon: Info },
  { title: "FAQ", description: "Questions frÃ©quentes", category: "page", url: "faq", icon: Info },
];

const categoryConfig = {
  page: { label: "Page", color: "#CCFF00", icon: FileText },
  blog: { label: "Blog", color: "#3B82F6", icon: BookOpen },
  project: { label: "Projet", color: "#8B5CF6", icon: Briefcase },
  "case-study": { label: "Case Study", color: "#EC4899", icon: FileText },
  resource: { label: "Ressource", color: "#F59E0B", icon: FileText },
};

export function GlobalSearch({ onNavigate }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = searchableContent
      .filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm)
      )
      .map((item, index) => ({ ...item, id: `${item.category}-${index}` }))
      .slice(0, 8); // Limit to 8 results

    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleResultClick = (result: SearchResult) => {
    onNavigate(result.url);
    setIsOpen(false);
    setQuery("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-mint/30 transition-all group"
        aria-label="Ouvrir la recherche"
      >
        <Search className="h-4 w-4 text-neutral-400 group-hover:text-mint transition-colors" />
        <span className="hidden md:inline text-sm text-neutral-400 group-hover:text-neutral-300">
          Rechercher...
        </span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 text-xs bg-neutral-800 rounded border border-neutral-700 text-neutral-500">
          <Command className="h-3 w-3" />
          K
        </kbd>
      </button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0 bg-neutral-950 border-neutral-800">
          {/* Search Input */}
          <div className="relative border-b border-neutral-800">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Rechercher des pages, articles, projets..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-12 py-6 text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-neutral-800 transition-colors"
                aria-label="Effacer"
              >
                <X className="h-4 w-4 text-neutral-500" />
              </button>
            )}
          </div>

          {/* Results */}
          <ScrollArea className="max-h-96">
            <AnimatePresence mode="wait">
              {query && results.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-8 text-center text-neutral-400"
                >
                  Aucun rÃ©sultat pour "{query}"
                </motion.div>
              ) : results.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-2"
                >
                  {results.map((result, index) => {
                    const config = categoryConfig[result.category];
                    const Icon = config.icon;
                    const isSelected = index === selectedIndex;

                    return (
                      <motion.button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all ${
                          isSelected
                            ? "bg-mint/10 border border-mint/20"
                            : "hover:bg-neutral-900/50 border border-transparent"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected ? "bg-mint/20" : "bg-neutral-900"
                          }`}
                        >
                          <Icon
                            className="h-5 w-5"
                            style={{
                              color: isSelected ? "#CCFF00" : config.color,
                            }}
                          />
                        </div>

                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white">{result.title}</h3>
                            <Badge
                              variant="outline"
                              className="text-xs"
                              style={{
                                borderColor: config.color + "40",
                                color: config.color,
                              }}
                            >
                              {config.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-neutral-400">
                            {result.description}
                          </p>
                        </div>

                        {isSelected && (
                          <kbd className="px-2 py-1 text-xs bg-neutral-900 rounded border border-neutral-700 text-neutral-500">
                            â†µ
                          </kbd>
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 space-y-4"
                >
                  <div className="text-center text-neutral-400 mb-6">
                    <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      Commencez Ã  taper pour rechercher
                    </p>
                  </div>

                  {/* Quick Links */}
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-neutral-500 mb-3">
                      AccÃ¨s rapide
                    </p>
                    {searchableContent.slice(0, 5).map((item, index) => {
                      const config = categoryConfig[item.category];
                      const Icon = config.icon;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handleResultClick({ ...item, id: `quick-${index}` })}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-900/50 transition-colors text-left"
                        >
                          <Icon className="h-4 w-4" style={{ color: config.color }} />
                          <span className="text-sm text-neutral-300">{item.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-neutral-800 px-4 py-3 flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-700">
                  â†‘
                </kbd>
                <kbd className="px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-700">
                  â†“
                </kbd>
                naviguer
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-700">
                  â†µ
                </kbd>
                sÃ©lectionner
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-700">
                esc
              </kbd>
              fermer
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
