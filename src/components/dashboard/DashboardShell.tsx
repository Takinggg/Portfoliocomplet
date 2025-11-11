import React, { useState, useMemo } from 'react';
import { colors } from '../../styles/designSystem';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { groupViews, ViewRenderer, viewRegistry, ViewDefinition } from './viewRegistry';
import { Search, LayoutDashboard, Menu } from 'lucide-react';

interface DashboardShellProps {
  initialView?: string;
  onLogout?: () => void;
  injectedProps?: any; // Data sets injected to tab components
}

export function DashboardShell({ initialView = 'blog', onLogout, injectedProps }: DashboardShellProps) {
  const [currentView, setCurrentView] = useState(initialView);
  const [navOpen, setNavOpen] = useState(false);
  const [search, setSearch] = useState('');

  const grouped = useMemo(() => groupViews(), []);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return grouped;
    const q = search.toLowerCase();
    const result: Record<string, ViewDefinition[]> = {};
    for (const [group, defs] of Object.entries(grouped)) {
      const match = defs.filter(d => d.label.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q));
      if (match.length) result[group] = match;
    }
    return result;
  }, [search, grouped]);

  return (
    <div className="flex min-h-screen" style={{ background: colors.background, color: colors.text }}>
      {/* Sidebar */}
      <aside className={`z-20 fixed inset-y-0 left-0 w-68 transform transition-transform duration-200 lg:translate-x-0 ${navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{ background: colors.surface, borderRight: `1px solid ${colors.border}` }}>
        <div className="px-5 py-4 flex items-center gap-2 border-b" style={{ borderColor: colors.border }}>
          <LayoutDashboard className="h-5 w-5 text-[${colors.accent}]" />
          <h1 className="font-semibold tracking-tight text-sm">Dashboard</h1>
        </div>
        <div className="p-4 pt-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="pl-9 bg-white/5 border-white/10 text-xs" />
          </div>
          <nav className="space-y-6 pr-1 overflow-y-auto max-h-[calc(100vh-170px)] custom-scrollbar">
            {Object.entries(filteredGroups).map(([group, defs]) => (
              <div key={group} className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider font-medium text-white/40 px-2">{group}</p>
                <div className="space-y-1">
                  {defs.map(def => {
                    const active = def.key === currentView;
                    return (
                      <Button
                        key={def.key}
                        onClick={() => { setCurrentView(def.key); setNavOpen(false); }}
                        variant="ghost"
                        className={`w-full justify-start h-8 text-xs transition-colors ${active ? 'bg-[var(--accent)] text-black font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                        style={active ? { ['--accent' as any]: colors.accent } : undefined}
                        aria-current={active ? 'page' : undefined}
                      >
                        <span className="truncate">{def.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
          {onLogout && (
            <Button onClick={onLogout} variant="ghost" className="w-full justify-start text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10">Déconnexion</Button>
          )}
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col lg:ml-[272px]">
        {/* Top bar */}
        <header className="h-14 flex items-center gap-3 px-4 border-b sticky top-0 z-10 backdrop-blur" style={{ background: 'rgba(17,20,24,0.8)', borderColor: colors.border }}>
          <Button variant="ghost" className="lg:hidden" onClick={() => setNavOpen(v => !v)} aria-label="Toggle navigation">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1 flex items-center gap-2 text-xs text-white/50">
            <span className="text-white/40">Vue:</span>
            <strong className="text-white font-medium">{viewRegistry.find(v => v.key === currentView)?.label || currentView}</strong>
          </div>
          {/* Placeholder for future global actions */}
        </header>
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <ViewRenderer currentView={currentView} injectedProps={injectedProps} />
        </main>
      </div>
    </div>
  );
}
