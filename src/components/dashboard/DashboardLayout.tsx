import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
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
  Star,
  Search,
  Menu,
  X,
  ChevronRight
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
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Filter menu items based on search
  const filteredSections = searchQuery
    ? menuSections.map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(section => section.items.length > 0)
    : menuSections;

  const SidebarContent = () => (
    <>
      <div className="px-6 py-6" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#00FFC2]/10 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-[#00FFC2]" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Dashboard</h2>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              CRM Freelance
            </p>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#00FFC2]/50"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 py-5">
        <div className="space-y-6">
          {filteredSections.map((section) => (
            <div key={section.title} className="space-y-2">
              <h3 
                className="px-2 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: colors.textMuted }}
              >
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = currentView === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => {
                          onViewChange(item.id);
                          setMobileMenuOpen(false);
                        }}
                        variant="ghost"
                        className="w-full justify-start h-10 text-sm font-medium transition-all rounded-lg group"
                        style={active ? {
                          background: colors.accent,
                          color: colors.accentTextOn,
                        } : {
                          background: 'transparent',
                          color: '#d1d5db'
                        }}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {(item as any).badge && (
                          <span
                            className="ml-auto rounded-md px-2 py-0.5 text-[10px] font-bold"
                            style={{
                              background: active ? colors.accentTextOn : colors.accent,
                              color: active ? colors.accent : colors.accentTextOn,
                            }}
                          >
                            {(item as any).badge}
                          </span>
                        )}
                        {active && (
                          <ChevronRight className="w-4 h-4 ml-2" />
                        )}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 space-y-2" style={{ borderTop: `1px solid ${colors.border}` }}>
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start h-10 text-sm font-medium transition-colors hover:bg-red-500/10"
          style={{ color: '#ef4444' }}
        >
          <LogOut className="h-4 w-4 mr-3" /> 
          <span>Déconnexion</span>
        </Button>
      </div>
    </>
  );

  return (
    <div
      className="min-h-screen flex"
      style={{ background: colors.background, color: colors.text }}
    >
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col"
        style={{
          width: 280,
          background: colors.surface,
          borderRight: `1px solid ${colors.border}`,
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50" style={{ background: colors.surface, borderBottom: `1px solid ${colors.border}` }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00FFC2]/10 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-[#00FFC2]" />
            </div>
            <span className="font-bold">Dashboard</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 p-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 flex flex-col"
              style={{
                width: 280,
                background: colors.surface,
                borderRight: `1px solid ${colors.border}`,
              }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden lg:mt-0 mt-14">
        <div className="h-full overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-6 lg:p-8">
            <div className="mb-6">
              <ServerDeploymentAlert />
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
