import React from 'react';
import { cn } from "../ui/utils";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  meta?: string;
  accentColor?: string; // override accent
}

export function StatCard({ icon, label, value, meta, className, accentColor, ...rest }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-white/5 p-4 flex items-center gap-3 hover:border-white/15 transition-colors",
        className
      )}
      {...rest}
    >
      {icon && (
        <div
          className="w-10 h-10 rounded-md flex items-center justify-center"
          style={{
            background: accentColor ? `${accentColor}22` : "rgba(0,255,194,0.15)",
            color: accentColor || "#00FFC2"
          }}
        >
          {icon}
        </div>
      )}
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wide text-white/50 font-medium">{label}</p>
        <p className="text-xl font-semibold text-white leading-tight mt-0.5">{value}</p>
        {meta && <p className="text-[10px] text-white/40 mt-0.5">{meta}</p>}
      </div>
    </div>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}