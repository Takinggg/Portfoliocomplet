import { useState } from "react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Search, X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "../../utils/i18n/useTranslation";

interface ProjectFiltersProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string | null) => void;
  activeFilter: string;
  searchQuery: string;
}

export function ProjectFilters({
  onSearch,
  onCategoryChange,
  activeFilter,
  searchQuery,
}: ProjectFiltersProps) {
  const { t } = useTranslation();

  const filters = [
    { id: "all", label: t('projects.filters.all'), color: "#CCFF00" },
    { id: "web", label: t('projects.filters.web'), color: "#61DAFB" },
    { id: "mobile", label: t('projects.filters.mobile'), color: "#FF6B6B" },
    { id: "design", label: t('projects.filters.design'), color: "#FF69B4" },
    { id: "consulting", label: t('projects.filters.consulting'), color: "#F7B731" },
    { id: "automation", label: t('projects.filters.automation'), color: "#A55EEA" },
    { id: "ai", label: t('projects.filters.ai'), color: "#20BF6B" },
    { id: "dashboard", label: t('projects.filters.dashboard'), color: "#4D8076" },
    { id: "other", label: t('projects.filters.other'), color: "#778CA3" },
  ];

  return (
    <div className="space-y-6 lg:space-y-0 lg:flex lg:items-start lg:gap-8 bg-white/5 border border-white/10 rounded-2xl p-6 mb-12">
      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex-1 min-w-[250px]"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
        <Input
          type="text"
          placeholder={t("projects.search")}
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-12 pr-10 bg-[#0C0C0C] border-white/10 text-white placeholder:text-white/40 h-12 focus:border-[#CCFF00]/50 transition-all w-full"
        />
        {searchQuery && (
          <button
            onClick={() => onSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </motion.div>

      <div className="flex-1 space-y-4 lg:space-y-0 lg:flex lg:flex-col lg:gap-4">
        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Badge
                key={filter.id}
                onClick={() => onCategoryChange(filter.id)}
                className="cursor-pointer transition-all px-4 py-2 text-sm"
                style={{
                  backgroundColor: activeFilter === filter.id ? filter.color : "#0C0C0C",
                  color: activeFilter === filter.id ? "#0C0C0C" : "rgba(255,255,255,0.6)",
                  borderColor: activeFilter === filter.id ? filter.color : "rgba(255,255,255,0.1)",
                }}
              >
                {filter.label}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
