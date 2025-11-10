import { motion, useSpring, useTransform } from "motion/react";
import { Eye, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface ViewCounterProps {
  views: number;
  variant?: "default" | "compact" | "badge";
  showTrending?: boolean;
  trendingPercentage?: number;
  animated?: boolean;
  className?: string;
}

export function ViewCounter({
  views,
  variant = "default",
  showTrending = false,
  trendingPercentage,
  animated = true,
  className = "",
}: ViewCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // Animated counter
  const spring = useSpring(0, {
    stiffness: 50,
    damping: 15,
  });

  const display = useTransform(spring, (latest) =>
    Math.round(latest).toLocaleString("fr-FR")
  );

  useEffect(() => {
    if (animated) {
      spring.set(views);
    } else {
      setDisplayValue(views);
    }
  }, [views, animated, spring]);

  const formatViews = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toLocaleString("fr-FR");
  };

  // Compact badge variant
  if (variant === "badge") {
    return (
      <motion.div
        initial={animated ? { opacity: 0, scale: 0.8 } : false}
        animate={animated ? { opacity: 1, scale: 1 } : false}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900/50 border border-neutral-800 ${className}`}
      >
        <Eye className="h-3.5 w-3.5 text-neutral-400" />
        <span className="text-xs text-neutral-300">
          {animated ? display : formatViews(views)}
        </span>
      </motion.div>
    );
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <motion.div
        initial={animated ? { opacity: 0, x: -10 } : false}
        animate={animated ? { opacity: 1, x: 0 } : false}
        className={`flex items-center gap-2 ${className}`}
      >
        <Eye className="h-4 w-4 text-neutral-400" />
        <span className="text-sm text-neutral-300">
          {animated ? display : formatViews(views)}
        </span>
        {showTrending && trendingPercentage && trendingPercentage > 0 && (
          <div className="flex items-center gap-1 text-xs text-mint">
            <TrendingUp className="h-3 w-3" />
            +{trendingPercentage}%
          </div>
        )}
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 10 } : false}
      animate={animated ? { opacity: 1, y: 0 } : false}
      whileHover={{ scale: 1.05 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all group ${className}`}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-mint/10">
        <Eye className="h-5 w-5 text-mint" />
      </div>
      <div className="flex-1">
        <div className="text-sm text-neutral-400 mb-0.5">Vues</div>
        <div className="text-lg text-white group-hover:text-mint transition-colors">
          {animated ? display : formatViews(views)}
        </div>
        {showTrending && trendingPercentage !== undefined && (
          <div className={`flex items-center gap-1 text-xs mt-1 ${
            trendingPercentage > 0 ? "text-mint" : "text-red-400"
          }`}>
            <TrendingUp className={`h-3 w-3 ${trendingPercentage < 0 ? "rotate-180" : ""}`} />
            {trendingPercentage > 0 ? "+" : ""}{trendingPercentage}% cette semaine
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Animated number component for larger displays
export function AnimatedViewCount({ 
  views, 
  label = "vues totales",
  className = "" 
}: { 
  views: number; 
  label?: string;
  className?: string;
}) {
  const spring = useSpring(0, {
    stiffness: 50,
    damping: 15,
  });

  const display = useTransform(spring, (latest) =>
    Math.round(latest).toLocaleString("fr-FR")
  );

  useEffect(() => {
    spring.set(views);
  }, [views, spring]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center ${className}`}
    >
      <motion.div className="text-4xl md:text-5xl text-mint mb-2">
        {display}
      </motion.div>
      <div className="text-sm text-neutral-400 uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}

// Multiple view counters in a grid
export function ViewStatsGrid({
  totalViews,
  monthlyViews,
  weeklyViews,
  className = "",
}: {
  totalViews: number;
  monthlyViews: number;
  weeklyViews: number;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      <ViewCounter
        views={totalViews}
        variant="default"
        animated={true}
      />
      <ViewCounter
        views={monthlyViews}
        variant="default"
        showTrending={true}
        trendingPercentage={12}
        animated={true}
      />
      <ViewCounter
        views={weeklyViews}
        variant="default"
        showTrending={true}
        trendingPercentage={8}
        animated={true}
      />
    </div>
  );
}
