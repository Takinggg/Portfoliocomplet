import { ReactNode } from "react";

interface ViewTabsProps {
  views: Array<{ id: string; label: string; icon: ReactNode; count?: number }>;
  activeId: string;
  onChange: (id: string) => void;
}

export function ViewTabs({ views, activeId, onChange }: ViewTabsProps) {
  return (
    <div className="flex flex-wrap gap-3 rounded-2xl border border-white/5 bg-black/40 p-2">
      {views.map((view) => {
        const isActive = view.id === activeId;
        return (
          <button
            key={view.id}
            onClick={() => onChange(view.id)}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? "bg-mint text-black shadow-[0_10px_30px_rgba(204, 255, 0,.3)]"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {view.icon}
            {view.label}
            {typeof view.count === "number" && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  isActive ? "bg-black/20" : "bg-white/5"
                }`}
              >
                {view.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
