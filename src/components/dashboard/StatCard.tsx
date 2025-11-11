import React from 'react';
import { motion } from 'motion/react';
import { cn } from "../ui/utils";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  meta?: string;
  trend?: number | string;
  trendLabel?: string;
  accentColor?: string;
  variant?: 'default' | 'gradient' | 'solid';
  animate?: boolean;
  loading?: boolean;
}

export function StatCard({ 
  icon, 
  label, 
  value, 
  meta, 
  trend,
  trendLabel,
  className, 
  accentColor = '#00FFC2',
  variant = 'default',
  animate = true,
  loading = false,
  ...rest 
}: StatCardProps) {
  
  const getTrendInfo = () => {
    if (!trend) return null;
    const trendNum = typeof trend === 'string' ? parseFloat(trend) : trend;
    if (isNaN(trendNum)) return null;
    
    const isPositive = trendNum > 0;
    const isNeutral = trendNum === 0;
    const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
    const color = isNeutral ? '#94a3b8' : isPositive ? '#10b981' : '#ef4444';
    
    return { Icon, color, value: Math.abs(trendNum) };
  };

  const trendInfo = getTrendInfo();

  const variantStyles = {
    default: "bg-white/5 border-white/10",
    gradient: `bg-gradient-to-br from-white/10 to-white/5 border-white/15`,
    solid: "bg-white/8 border-white/15"
  };

  const content = (
    <>
      <div className="flex items-start justify-between mb-3">
        {icon && (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110"
            style={{
              background: `${accentColor}15`,
              color: accentColor,
            }}
          >
            {icon}
          </div>
        )}
        {trendInfo && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${trendInfo.color}15`,
              color: trendInfo.color,
            }}
          >
            <trendInfo.Icon className="w-3 h-3" />
            <span>{trendInfo.value}%</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wider text-white/50 font-medium">
          {label}
        </p>
        <p className="text-3xl font-bold text-white leading-none">
          {loading ? '...' : value}
        </p>
        {(meta || trendLabel) && (
          <div className="flex items-center gap-2 text-xs text-white/40 mt-2">
            {meta && <span>{meta}</span>}
            {meta && trendLabel && <span>•</span>}
            {trendLabel && <span>{trendLabel}</span>}
          </div>
        )}
      </div>
    </>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        className={cn(
          "rounded-xl border p-5 transition-all duration-300",
          "hover:border-white/20 hover:shadow-lg hover:scale-[1.02]",
          variantStyles[variant],
          loading && "animate-pulse",
          className
        )}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-all duration-300",
        "hover:border-white/20 hover:shadow-lg hover:scale-[1.02]",
        variantStyles[variant],
        loading && "animate-pulse",
        className
      )}
      {...rest}
    >
      {content}
    </div>
  );
}

export function StatGrid({ 
  children,
  cols = 4 
}: { 
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
}) {
  const colsClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={cn("grid gap-5", colsClass[cols])}>
      {children}
    </div>
  );
}