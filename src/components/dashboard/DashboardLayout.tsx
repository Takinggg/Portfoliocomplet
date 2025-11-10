import { useState } from "react";
import { Button } from "../ui/button";
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
    <div className="min-h-screen bg-[#0C0C0C] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="p-6 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-white">Dashboard CRM</h2>
          <p className="text-sm text-neutral-400 mt-1">Gestion freelance</p>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {menuSections.map((section) => (
            <div key={section.title}>
              <h3 className="px-3 mb-2 text-xs uppercase tracking-wider text-neutral-500">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    variant="ghost"
                    className={`w-full justify-start ${
                      currentView === item.id
                        ? "bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
                        : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                    {(item.id === "newsletter" || (item as any).badge) && (
                      <span className="ml-auto text-[10px] bg-[#00FFC2] text-black px-1.5 py-0.5 rounded font-semibold">
                        NEW
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Server deployment status alert */}
          <ServerDeploymentAlert />
          
          {children}
        </div>
      </main>
    </div>
  );
}
