import { Search, Bell, LogOut } from "lucide-react";
import { Button } from "../../ui/button";

interface DashboardHeaderProps {
  onLogout: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onOpenCommandPalette: () => void;
}

export function DashboardHeader({ onLogout, searchValue, onSearchChange, onOpenCommandPalette }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-gradient-to-r from-white/5 to-white/0 p-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.5em] text-neutral-500">Pilotage</p>
        <h1 className="text-3xl font-semibold text-white">Command Center</h1>
        <p className="text-neutral-400">
          Pipeline, clients et finances synchronisés automatiquement.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-neutral-400">
          <Search className="h-4 w-4" />
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Rechercher un client, un projet, une facture..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/70 transition hover:bg-white/10"
          >
            ⌘K
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-2xl border border-white/10 bg-black/40 p-3 text-neutral-300 hover:text-white">
            <Bell className="h-4 w-4" />
          </button>
          <Button
            variant="outline"
            className="rounded-2xl border-white/10 bg-black/50 text-white hover:bg-black/60"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );
}
