import { ChevronRight, Home } from "lucide-react";
import { motion } from "motion/react";

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-neutral-600" />
              )}
              
              {isLast ? (
                <span 
                  className="text-mint font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.onClick ? (
                <motion.button
                  onClick={item.onClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-neutral-400 hover:text-mint transition-colors"
                >
                  {item.label}
                </motion.button>
              ) : (
                <span className="text-neutral-400">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Simple version with just text
export function SimpleBreadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-neutral-400 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <span>/</span>}
          <span className={item.isActive ? "text-mint" : ""}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
