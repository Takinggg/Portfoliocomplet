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
    { value: "development", label: t("blog.filters.development"), color: "#00FFC2" },
    { value: "design", label: t("blog.filters.design"), color: "#00D9A6" },
    { value: "business", label: t("blog.filters.business"), color: "#00B38A" },
  ];

  const displayedTags = showAllTags ? availableTags : availableTags.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
        <Input
          type="text"
          placeholder={t("blog.filters.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-12 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 focus:border-[#00FFC2]/50 transition-all"
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

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-white/60" />
          <h3 className="text-sm text-white/60">{t("blog.filters.categories")}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            onClick={() => onCategoryChange(null)}
            className={`cursor-pointer transition-all ${
              selectedCategory === null
                ? "bg-[#00FFC2] text-[#0C0C0C] border-[#00FFC2]"
                : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
            }`}
          >
            {t("blog.filters.all")}
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className="cursor-pointer transition-all"
              style={{
                backgroundColor: selectedCategory === cat.value ? cat.color : "rgba(255,255,255,0.05)",
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
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm text-white/60">{t("blog.filters.popularTags")}</h3>
            {availableTags.length > 8 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllTags(!showAllTags)}
                className="text-[#00FFC2] text-xs h-auto p-0 hover:text-[#00FFC2]/80"
              >
                {showAllTags ? t("blog.filters.showLess") : `+${availableTags.length - 8} ${t("blog.filters.tags")}`}
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
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
                        ? "bg-[#00FFC2]/20 text-[#00FFC2] border-[#00FFC2]/40"
                        : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/70"
                    }`}
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Active Filters */}
      {(selectedCategory || selectedTags.length > 0 || searchQuery) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="pt-4 border-t border-white/10"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/40">{t("blog.filters.activeFilters")}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSearch("");
                onCategoryChange(null);
                selectedTags.forEach(tag => onTagClick(tag));
              }}
              className="text-white/40 text-xs h-auto p-0 hover:text-white/60"
            >
              {t("blog.filters.clearAll")}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge className="bg-[#00FFC2]/20 text-[#00FFC2] border-[#00FFC2]/40">
                {t("blog.filters.search")}: "{searchQuery}"
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => onSearch("")}
                />
              </Badge>
            )}
            {selectedCategory && (
              <Badge className="bg-[#00FFC2]/20 text-[#00FFC2] border-[#00FFC2]/40">
                {categories.find(c => c.value === selectedCategory)?.label}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => onCategoryChange(null)}
                />
              </Badge>
            )}
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                className="bg-[#00FFC2]/20 text-[#00FFC2] border-[#00FFC2]/40"
              >
                {tag}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => onTagClick(tag)}
                />
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
