import { ReactNode } from "react";
import { motion } from "motion/react";

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  status?: string;
  trend?: {
    label: string;
    direction: "up" | "down" | "flat";
  };
}

const trendColors: Record<"up" | "down" | "flat", string> = {
  up: "text-emerald-400",
  down: "text-red-400",
  flat: "text-neutral-400",
};

const trendIcons: Record<"up" | "down" | "flat", string> = {
  up: "▲",
  down: "▼",
  flat: "■",
};

export function MetricCard({ icon, label, value, sublabel, status, trend }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 px-5 py-4 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/30 text-lg text-mint">
            {icon}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
              {label}
            </p>
            <p className="text-2xl font-semibold text-white">{value}</p>
            {sublabel && <p className="text-sm text-neutral-400">{sublabel}</p>}
          </div>
        </div>
        {status && (
          <span className="rounded-full bg-mint/10 px-3 py-1 text-xs font-semibold text-mint">
            {status}
          </span>
        )}
      </div>
      {trend && (
        <div className={`mt-4 flex items-center gap-2 text-xs font-medium ${trendColors[trend.direction]}`}>
          <span>{trendIcons[trend.direction]}</span>
          <span>{trend.label}</span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-mint/20 blur-3xl" />
        <div className="absolute -left-8 -bottom-12 h-16 w-16 rounded-full bg-cyan-500/20 blur-2xl" />
      </div>
    </motion.div>
  );
}
