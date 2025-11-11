import { useState } from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { colors } from "../../styles/designSystem";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  Calendar,
  Settings,
  Mail,
  LogOut,
  BarChart3,
  BookOpen,
  Sparkles,
  MailOpen,
  Star
} from "lucide-react";
import { ServerDeploymentAlert } from "./ServerDeploymentAlert";

type DashboardView = "overview" | "express" | "leads" | "clients" | "projects" | "invoices" | "calendar" | "analytics" | "emails" | "blog" | "case-studies" | "newsletter" | "testimonials" | "settings";

interface DashboardLayoutProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function DashboardLayout({ currentView, onViewChange, onLogout, children }: DashboardLayoutProps) {
  const menuSections = [
    {
      title: "Principal",
      items: [
        { id: "overview" as DashboardView, icon: LayoutDashboard, label: "Vue d'ensemble" },
        { id: "express" as DashboardView, icon: Sparkles, label: "Express", badge: "NEW" },
        { id: "analytics" as DashboardView, icon: BarChart3, label: "Analytics" },
      ]
    },
    {
      title: "CRM",
      items: [
        { id: "leads" as DashboardView, icon: Users, label: "Leads" },
        { id: "clients" as DashboardView, icon: Users, label: "Clients" },
        { id: "projects" as DashboardView, icon: Briefcase, label: "Projets" },
        { id: "invoices" as DashboardView, icon: FileText, label: "Factures" },
        { id: "calendar" as DashboardView, icon: Calendar, label: "Calendrier" },
      ]
    },
    {
      title: "Contenu",
      items: [
        { id: "blog" as DashboardView, icon: BookOpen, label: "Blog" },
        { id: "case-studies" as DashboardView, icon: Sparkles, label: "Études de cas" },
        { id: "testimonials" as DashboardView, icon: Star, label: "Témoignages" },
        { id: "newsletter" as DashboardView, icon: MailOpen, label: "Newsletter" },
      ]
    },
    {
      title: "Configuration",
      items: [
        { id: "emails" as DashboardView, icon: Mail, label: "Emails" },
        { id: "settings" as DashboardView, icon: Settings, label: "Paramètres" },
      ]
    }
  ];

  return (
    <div
      className="min-h-screen flex"
      style={{ background: colors.background, color: colors.text }}
    >
      {/* Sidebar */}
      <aside
        className="hidden lg:flex flex-col"
        style={{
          width: 270,
          background: colors.surface,
          borderRight: `1px solid ${colors.border}`,
        }}
      >
        <div className="px-6 py-5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <h2 className="text-lg font-semibold tracking-tight">Dashboard CRM</h2>
          <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
            Gestion freelance
          </p>
        </div>
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-7">
            {menuSections.map((section) => (
              <div key={section.title} className="space-y-2">
                <h3 className="px-2 text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const active = currentView === item.id;
                    return (
                      <Button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        variant="ghost"
                        className="w-full justify-start h-9 text-sm transition-colors"
                        style={active ? {
                          background: colors.accent,
                          color: colors.accentTextOn,
                        } : {
                          background: 'transparent',
                          color: '#d1d5db'
                        }}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        <span>{item.label}</span>
                        {(item.id === 'newsletter' || (item as any).badge) && (
                          <span
                            className="ml-auto rounded px-1.5 py-0.5 text-[10px] font-semibold"
                            style={{
                              background: colors.accent,
                              color: colors.accentTextOn,
                            }}
                          >
                            NEW
                          </span>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4" style={{ borderTop: `1px solid ${colors.border}` }}>
            <Button
              onClick={onLogout}
              variant="ghost"
              className="w-full justify-start h-9 text-sm"
              style={{ color: '#f87171' }}
            >
              <LogOut className="h-4 w-4 mr-3" /> Déconnexion
            </Button>
        </div>
      </aside>

      {/* Mobile Nav (collapsible) */}
      <div className="lg:hidden w-full" style={{ background: colors.surfaceSubtle }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <h2 className="text-sm font-medium">Dashboard</h2>
          {/* Future: burger to open drawer */}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto" style={{ padding: '2rem' }}>
          <div className="mb-4">
            <ServerDeploymentAlert />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
