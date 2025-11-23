import { useState } from "react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Search, X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "../../utils/i18n/useTranslation";

interface BlogFiltersProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string | null) => void;
  onTagClick: (tag: string) => void;
  selectedCategory: string | null;
  selectedTags: string[];
  availableTags: string[];
  searchQuery: string;
}

export function BlogFilters({
  onSearch,
  onCategoryChange,
  onTagClick,
  selectedCategory,
  selectedTags,
  availableTags,
  searchQuery,
}: BlogFiltersProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  const { t } = useTranslation();

  const categories = [
    { value: "development", label: t("blog.filters.development"), color: "#CCFF00" },
    { value: "design", label: t("blog.filters.design"), color: "#DAFF40" },
    { value: "business", label: t("blog.filters.business"), color: "#00B38A" },
  ];

  const displayedTags = showAllTags ? availableTags : availableTags.slice(0, 8);

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
          placeholder={t("blog.filters.searchPlaceholder")}
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
            <Badge
              onClick={() => onCategoryChange(null)}
              className={`cursor-pointer transition-all px-4 py-2 text-sm ${
                selectedCategory === null
                  ? "bg-[#CCFF00] text-[#0C0C0C] border-[#CCFF00]"
                  : "bg-[#0C0C0C] text-white/60 border-white/10 hover:bg-white/10"
              }`}
            >
              {t("blog.filters.all")}
            </Badge>
            {categories.map((cat) => (
              <Badge
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className="cursor-pointer transition-all px-4 py-2 text-sm"
                style={{
                  backgroundColor: selectedCategory === cat.value ? cat.color : "#0C0C0C",
                  color: selectedCategory === cat.value ? "#0C0C0C" : "rgba(255,255,255,0.6)",
                  borderColor: selectedCategory === cat.value ? cat.color : "rgba(255,255,255,0.1)",
                }}
              >
                {cat.label}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Tags */}
        {availableTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            <AnimatePresence>
              {displayedTags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Badge
                    onClick={() => onTagClick(tag)}
                    className={`cursor-pointer transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-[#CCFF00]/20 text-[#CCFF00] border-[#CCFF00]/40"
                        : "bg-[#0C0C0C] text-white/50 border-white/10 hover:bg-white/10 hover:text-white/70"
                    }`}
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
            {availableTags.length > 8 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllTags(!showAllTags)}
                className="text-[#CCFF00] text-xs h-auto p-0 hover:text-[#CCFF00]/80 ml-2"
              >
                {showAllTags ? t("blog.filters.showLess") : `+${availableTags.length - 8}`}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
