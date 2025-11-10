import { ReactNode } from "react";
import { cn } from "./utils";

interface AdvancedCardProps {
  className?: string;
  children: ReactNode;
  variant?: "default" | "gradient" | "blur" | "premium";
  size?: "sm" | "md" | "lg" | "xl";
}

export function AdvancedCard({ 
  className, 
  children, 
  variant = "default",
  size = "md" 
}: AdvancedCardProps) {
  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10"
  };

  const variantClasses = {
    default: "glass border-white/10",
    gradient: "glass-strong border-white/20 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none",
    blur: "backdrop-blur-3xl bg-white/5 border border-white/10",
    premium: "glass-strong border-white/20 shadow-2xl shadow-white/5"
  };

  return (
    <div className={cn(
      "rounded-2xl transition-all duration-300",
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  icon?: ReactNode;
  color?: string;
}

export function StatCard({ label, value, sublabel, trend, icon, color = "blue" }: StatCardProps) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-500/5",
    green: "from-green-500/20 to-green-500/5",
    purple: "from-purple-500/20 to-purple-500/5",
    orange: "from-orange-500/20 to-orange-500/5",
    pink: "from-pink-500/20 to-pink-500/5",
  };

  return (
    <AdvancedCard variant="gradient" className={`relative overflow-hidden bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
      {icon && (
        <div className="absolute top-6 right-6 opacity-10">
          {icon}
        </div>
      )}
      <div className="relative z-10">
        <p className="text-sm text-white/50 mb-2">{label}</p>
        <p className="text-4xl text-white mb-1">{value}</p>
        {sublabel && <p className="text-sm text-white/40">{sublabel}</p>}
        {trend && (
          <div className={`inline-flex items-center mt-3 text-sm ${
            trend.direction === "up" ? "text-green-400" : 
            trend.direction === "down" ? "text-red-400" : 
            "text-white/50"
          }`}>
            {trend.direction === "up" && "↑"}
            {trend.direction === "down" && "↓"}
            {trend.value}
          </div>
        )}
      </div>
    </AdvancedCard>
  );
}

interface MetricCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function MetricCard({ title, description, children, actions }: MetricCardProps) {
  return (
    <AdvancedCard variant="premium" size="lg">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-white mb-1">{title}</h3>
          {description && <p className="text-sm text-white/50">{description}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div className="relative">
        {children}
      </div>
    </AdvancedCard>
  );
}
