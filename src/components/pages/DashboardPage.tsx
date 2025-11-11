import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { motion, AnimatePresence } from "motion/react";
import { InvoiceGenerator } from "../invoice/InvoiceGenerator";
import { freelanceInfo } from "../../utils/freelanceConfig";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  Calendar,
  Settings,
  LogOut,
  TrendingUp,
  Mail,
  DollarSign,
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Check,
  X,
  Eye,
  Edit,
  Trash,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Activity,
  Download,
  Printer,
  Pin,
  Image as ImageIcon,
  BookOpen,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Package,
  RefreshCw,
  CheckCircle2,
  UserPlus
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { createClient } from "../../utils/supabase/client";
import { DeleteConfirmDialog } from "../dashboard/DeleteConfirmDialog";
import { ClientsTab } from "../dashboard/ClientsTab";
import { LeadDetailDialog } from "../dashboard/LeadDetailDialog";
import { InvoiceEditDialog } from "../dashboard/InvoiceEditDialog";
import EmailSettings from "../dashboard/EmailSettings";
import { DashboardRouter } from "../dashboard/DashboardRouter";
import EmailsTab from "../dashboard/EmailsTab";
import { QuotesTab } from "../dashboard/QuotesTab";
import { AnalyticsTab } from "../dashboard/AnalyticsTab";
import { ExpressTab } from "../dashboard/ExpressTab";
import { BlogTab } from "../dashboard/BlogTab";
import { CaseStudiesTab } from "../dashboard/CaseStudiesTab";
import { NewsletterTab } from "../dashboard/NewsletterTab";
import { ResourcesTab } from "../dashboard/ResourcesTab";
import { TestimonialsTab } from "../dashboard/TestimonialsTab";
import { CalendarManagement } from "../calendar/CalendarManagement";
import { seedTestProjects } from "../../utils/seedTestProjects";
import { showConsoleWelcome } from "../../utils/consoleWelcome";

type DashboardView = "overview" | "express" | "leads" | "clients" | "projects" | "invoices" | "quotes" | "calendar" | "analytics" | "settings" | "emails" | "blog" | "case-studies" | "newsletter" | "resources" | "testimonials" | "seed-data";

interface DashboardPageProps {
  onLogout: () => void;
  onNavigate: (page: "home") => void;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  source: string;
  interests?: string[];
  wantsAppointment?: boolean;
  convertedToClient?: string;
  createdAt: string;
  updatedAt?: string;
  // Booking-related fields (when lead is created from booking)
  bookingId?: string;
  bookingDate?: string;
  bookingTime?: string;
  bookingDuration?: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  revenue?: number;
  status: "active" | "inactive";
  source?: string;
  convertedFrom?: string;
  createdAt: string;
}

interface Project {
  id: string;
  // Bilingual fields
  name_fr: string;
  name_en: string;
  description_fr?: string;
  description_en?: string;
  tags_fr?: string[];
  tags_en?: string[];
  duration_fr?: string;
  duration_en?: string;
  challenges_fr?: string;
  challenges_en?: string;
  solutions_fr?: string;
  solutions_en?: string;
  results_fr?: string;
  results_en?: string;
  category_fr?: "web" | "mobile" | "design" | "consulting" | "other";
  category_en?: "web" | "mobile" | "design" | "consulting" | "other";
  // Common/non-language specific fields
  clientId?: string;
  clientName?: string;
  status: "planning" | "in_progress" | "review" | "completed" | "on_hold";
  budget?: number;
  spent?: number;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  isPinned?: boolean;
  createdAt: string;
  // Portfolio-specific common fields
  technologies?: string[];
  projectUrl?: string;
  githubUrl?: string;
  imageGallery?: string[];
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
}

interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  amount: number;
  description?: string;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: string;
  createdAt: string;
}

interface Booking {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  duration: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

interface Quote {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  amount: number;
  description?: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  validUntil: string;
  createdAt: string;
}

export default function DashboardPage({ onLogout, onNavigate }: DashboardPageProps) {
  const [currentView, setCurrentView] = useState<DashboardView>("overview");
  const [openCategories, setOpenCategories] = useState<string[]>(["CRM", "Contenu"]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userEmail, setUserEmail] = useState("contact@maxence.design");
  const supabase = createClient();

  // ✅ Get user email from Supabase Session + Show welcome message
  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
        console.log("👤 User email:", user.email);
      }
    };
    getUserEmail();
    
    // 🎯 Show deployment instructions in console
    showConsoleWelcome();
    
    // 🎯 Listen for navigation events from Quick Setup banner
    const handleNavigateToSeedData = () => {
      setCurrentView("seed-data");
    };
    window.addEventListener('navigate-to-seed-data', handleNavigateToSeedData);
    
    return () => {
      window.removeEventListener('navigate-to-seed-data', handleNavigateToSeedData);
    };
  }, []);

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // ✅ Get session token for authenticated requests
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("❌ No session found - user should be logged in");
        toast.error("Session expirée. Veuillez vous reconnecter.");
        onLogout();
        return;
      }

      const authHeader = `Bearer ${session.access_token}`;
      console.log("🔐 Using session token for API requests");

      // Utiliser le service avec fallback local
      const { fetchDashboardData } = await import("../../utils/dataService");
      const { data: dashboardData, mode } = await fetchDashboardData();
      
      console.log(`✅ Dashboard data loaded in ${mode} mode`);
      
      // ✅ Utiliser TOUTES les données du serveur
      setLeads(dashboardData.leads || []);
      setClients(dashboardData.clients || []);
      setBookings(dashboardData.bookings || []);
      
      // ✅ Charger les Quotes et Invoices depuis le serveur
      try {
        const [quotesResponse, invoicesResponse] = await Promise.all([
          fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes`,
            {
              headers: {
                Authorization: authHeader,
              },
            }
          ),
          fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/invoices`,
            {
              headers: {
                Authorization: authHeader,
              },
            }
          )
        ]);

        if (quotesResponse.ok) {
          const quotesData = await quotesResponse.json();
          setQuotes(quotesData.quotes || []);
          console.log(`✅ Loaded ${quotesData.quotes?.length || 0} quotes from server`);
        } else {
          console.warn("⚠️ Failed to load quotes, using empty array");
          setQuotes([]);
        }

        if (invoicesResponse.ok) {
          const invoicesData = await invoicesResponse.json();
          setInvoices(invoicesData.invoices || []);
          console.log(`✅ Loaded ${invoicesData.invoices?.length || 0} invoices from server`);
        } else {
          console.warn("⚠️ Failed to load invoices, using empty array");
          setInvoices([]);
        }
      } catch (error) {
        console.error("❌ Error loading quotes/invoices:", error);
        setQuotes([]);
        setInvoices([]);
      }

      // ✅ Charger TOUS les projets bilingues depuis le serveur
      try {
        const projectsResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData.projects || []);
          console.log(`✅ ${projectsData.projects?.length || 0} projet(s) bilingue(s) chargé(s)`);
        } else {
          console.warn("⚠️ Impossible de charger les projets depuis le serveur");
        }
      } catch (projectError) {
        console.warn("⚠️ Erreur lors du chargement des projets:", projectError);
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error(`Erreur lors du chargement (mode local disponible)`);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: Lead["status"]) => {
    try {
      // ✅ Get session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        onLogout();
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads/${encodeURIComponent(leadId)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setLeads(leads.map(lead => 
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        ));
        toast.success("Statut mis à jour");
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const deleteLead = async (leadId: string, leadName: string) => {
    try {
      // ✅ Get session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        onLogout();
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads/${encodeURIComponent(leadId)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLeads(leads.filter(lead => lead.id !== leadId));
        
        if (data.emailSent) {
          toast.success(`Lead "${leadName}" supprimé et email d'annulation envoyé`);
        } else {
          toast.success(`Lead "${leadName}" supprimé`);
        }
        
        await fetchAllData(); // Refresh data
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const menuCategories = [
    {
      label: "CRM",
      items: [
        { id: "overview" as DashboardView, label: "Vue d'ensemble", icon: LayoutDashboard },
        { id: "express" as DashboardView, label: "Express", icon: Sparkles, badge: "NEW" as any },
        { id: "leads" as DashboardView, label: "Leads", icon: UserPlus, badge: leads.filter(l => l.status === "new").length },
        { id: "clients" as DashboardView, label: "Clients", icon: Users, badge: clients.length },
      ]
    },
    {
      label: "Facturation",
      items: [
        { id: "quotes" as DashboardView, label: "Devis", icon: FileText, badge: quotes.filter(q => q.status === "sent").length },
        { id: "invoices" as DashboardView, label: "Factures", icon: DollarSign, badge: invoices.filter(i => i.status === "overdue").length },
      ]
    },
    {
      label: "Contenu",
      items: [
        { id: "projects" as DashboardView, label: "Projets", icon: Briefcase, badge: projects.filter(p => p.status === "in_progress").length },
        { id: "blog" as DashboardView, label: "Blog", icon: BookOpen },
        { id: "case-studies" as DashboardView, label: "Études de cas", icon: Sparkles },
        { id: "newsletter" as DashboardView, label: "Newsletter", icon: Mail },
        { id: "resources" as DashboardView, label: "Ressources", icon: Package },
        { id: "testimonials" as DashboardView, label: "Témoignages", icon: Target },
      ]
    },
    {
      label: "Gestion",
      items: [
        { id: "calendar" as DashboardView, label: "Calendrier", icon: Calendar, badge: bookings.filter(b => b.status === "pending").length },
        { id: "analytics" as DashboardView, label: "Analytics", icon: Activity },
        { id: "emails" as DashboardView, label: "Emails", icon: Zap },
        { id: "seed-data" as DashboardView, label: "Seed Data", icon: Package, badge: projects.length === 0 ? "NEW" as any : undefined },
      ]
    }
  ];

  // Calculate stats
  const stats = {
    revenue: invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0),
    revenueChange: "+23%",
    newLeads: leads.filter(l => l.status === "new").length,
    leadsChange: `+${leads.filter(l => {
      const date = new Date(l.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date > weekAgo;
    }).length}`,
    activeProjects: projects.filter(p => p.status === "in_progress").length,
    projectsInfo: `${projects.filter(p => p.status === "on_hold").length} en pause`,
    overdueInvoices: invoices.filter(i => i.status === "overdue").length,
    overdueAmount: invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0),
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white flex">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 bg-black/40 backdrop-blur-xl border-r border-[#00FFC2]/10 flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#00FFC2]/10">
          <button 
            onClick={() => onNavigate("home")}
            className="flex items-center space-x-3 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#00FFC2] to-[#00FFC2]/60 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-black font-bold text-xl">M</span>
            </div>
            <div>
              <div className="text-white">Dashboard</div>
              <div className="text-xs text-[#00FFC2]/60">CRM Pro</div>
            </div>
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuCategories.map((category, categoryIndex) => {
            const isOpen = openCategories.includes(category.label);
            
            return (
              <div key={categoryIndex} className="mb-2">
                {/* Category Header - Collapsible */}
                <button
                  onClick={() => {
                    setOpenCategories(prev => 
                      prev.includes(category.label)
                        ? prev.filter(c => c !== category.label)
                        : [...prev, category.label]
                    );
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 mb-1 text-xs uppercase tracking-wider text-white/40 font-semibold hover:text-white/60 transition-colors group"
                >
                  <span>{category.label}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                  </motion.div>
                </button>
                
                {/* Category Items - Animated */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="space-y-1 overflow-hidden"
                    >
                      {category.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        
                        return (
                          <motion.button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                              w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all relative overflow-hidden
                              ${isActive 
                                ? "bg-[#00FFC2]/10 text-[#00FFC2] border border-[#00FFC2]/20" 
                                : "text-white/60 hover:bg-white/5 hover:text-white border border-transparent"
                              }
                            `}
                          >
                            {isActive && (
                              <motion.div 
                                layoutId="activeTab"
                                className="absolute inset-0 bg-[#00FFC2]/5"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                            <div className="flex items-center space-x-3 relative z-10">
                              <Icon className="h-5 w-5" />
                              <span className="font-medium">{item.label}</span>
                            </div>
                            {item.badge !== undefined && item.badge !== 0 && (
                              <Badge 
                                className={`relative z-10 ${
                                  typeof item.badge === 'string' && item.badge === 'NEW'
                                    ? 'bg-[#00FFC2] text-[#0C0C0C] animate-pulse'
                                    : 'bg-[#00FFC2]/20 text-[#00FFC2]'
                                }`}
                                variant="secondary"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-[#00FFC2]/10">
          <div className="flex items-center space-x-3 mb-3 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00FFC2] to-[#00FFC2]/60 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">M</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{userEmail}</p>
              <p className="text-xs text-[#00FFC2]/60">Administrateur</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/40 backdrop-blur-xl border-b border-[#00FFC2]/10 p-6 sticky top-0 z-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl mb-1">
                {(() => {
                  for (const category of menuCategories) {
                    const item = category.items.find(i => i.id === currentView);
                    if (item) return item.label;
                  }
                  return "Dashboard";
                })()}
              </h1>
              <p className="text-[#00FFC2]/60 text-sm">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <Button 
              onClick={() => onNavigate("home")} 
              className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Voir le site
            </Button>
          </div>
        </motion.header>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {currentView === "overview" && (
              <OverviewView 
                stats={stats} 
                leads={leads.slice(0, 5)} 
                projects={projects.slice(0, 4)}
                bookings={bookings.slice(0, 5)}
                loading={loading}
              />
            )}
            {currentView === "express" && (
              <ExpressTab 
                leads={leads}
                clients={clients}
                projects={projects}
                invoices={invoices}
                quotes={quotes}
              />
            )}
            {currentView === "leads" && (
              <LeadsView 
                leads={leads} 
                onUpdateStatus={updateLeadStatus}
                onDeleteLead={deleteLead}
                onRefresh={fetchAllData}
                loading={loading}
              />
            )}
            {currentView === "clients" && (
              <ClientsTab />
            )}
            {currentView === "projects" && (
              <ProjectsView 
                projects={projects}
                clients={clients}
                onRefresh={fetchAllData}
                loading={loading}
                onViewChange={setCurrentView}
              />
            )}
            {currentView === "invoices" && (
              <InvoicesView 
                invoices={invoices}
                clients={clients}
                onRefresh={fetchAllData}
                loading={loading}
              />
            )}
            {currentView === "quotes" && (
              <QuotesTab />
            )}
            {currentView === "calendar" && (
              <CalendarView 
                bookings={bookings}
                leads={leads}
                onRefresh={fetchAllData}
                loading={loading}
              />
            )}
            {currentView === "emails" && (
              <EmailsTab />
            )}
            {currentView === "analytics" && (
              <AnalyticsTab 
                leads={leads}
                clients={clients}
                projects={projects}
                invoices={invoices}
                quotes={quotes}
                onRefresh={fetchAllData}
                loading={loading}
              />
            )}
            {currentView === "blog" && (
              <BlogTab />
            )}
            {currentView === "case-studies" && (
              <CaseStudiesTab />
            )}
            {currentView === "newsletter" && (
              <NewsletterTab />
            )}
            {currentView === "resources" && (
              <ResourcesTab />
            )}
            {currentView === "testimonials" && (
              <TestimonialsTab />
            )}
            {currentView === "seed-data" && (
              <SeedDataView onRefresh={fetchAllData} />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Overview View Component
function OverviewView({ stats, leads, projects, bookings, loading }: any) {
  const [showQuickSetup, setShowQuickSetup] = useState(true);
  const hasData = leads.length > 0 || projects.length > 0 || bookings.length > 0;
  
  const statsData = [
    {
      title: "CA du mois",
      value: `${(stats.revenue ?? 0).toLocaleString()}€`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: "#00FFC2",
      trend: "up"
    },
    {
      title: "Nouveaux leads",
      value: stats.newLeads ?? 0,
      change: stats.leadsChange,
      icon: Mail,
      color: "#00FFC2",
      trend: "up"
    },
    {
      title: "Projets actifs",
      value: stats.activeProjects ?? 0,
      change: stats.projectsInfo,
      icon: Briefcase,
      color: "#00FFC2",
      trend: "neutral"
    },
    {
      title: "Factures impayées",
      value: stats.overdueInvoices ?? 0,
      change: `${(stats.overdueAmount ?? 0).toLocaleString()}€`,
      icon: AlertCircle,
      color: "#FF6B6B",
      trend: "down"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Quick Setup Banner - Show when no data exists */}
      {!loading && !hasData && showQuickSetup && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Alert className="bg-gradient-to-r from-[#00FFC2]/10 to-blue-500/10 border-[#00FFC2]/30">
            <Sparkles className="h-5 w-5 text-[#00FFC2]" />
            <AlertTitle className="text-[#00FFC2] text-lg mb-2">
              🚀 Bienvenue sur votre Dashboard !
            </AlertTitle>
            <AlertDescription className="text-white/80">
              <p className="mb-4">
                Votre dashboard est vide. Commencez par initialiser vos données de démonstration pour découvrir toutes les fonctionnalités.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    const event = new CustomEvent('navigate-to-seed-data');
                    window.dispatchEvent(event);
                  }}
                  className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Initialiser les données
                </Button>
                <Button
                  onClick={() => setShowQuickSetup(false)}
                  variant="outline"
                  className="border-white/20 text-white/80 hover:bg-white/10"
                >
                  Masquer
                </Button>
              </div>
            </AlertDescription>
            <button
              onClick={() => setShowQuickSetup(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        </motion.div>
      )}
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl hover:border-[#00FFC2]/30 transition-all group">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: stat.color }} />
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      {stat.trend === "up" && <ArrowUpRight className="h-4 w-4 text-[#00FFC2]" />}
                      {stat.trend === "down" && <ArrowDownRight className="h-4 w-4 text-red-400" />}
                      <span className={stat.trend === "up" ? "text-[#00FFC2]" : "text-white/60"}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-3xl mb-1">{stat.value}</h3>
                  <p className="text-sm text-white/60">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Latest Leads */}
        <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
          <CardHeader className="border-b border-[#00FFC2]/10">
            <CardTitle className="flex items-center justify-between">
              <span>Derniers leads</span>
              <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-0">
                {leads.length} nouveaux
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {loading ? (
                <div className="text-center text-white/40 py-8">Chargement...</div>
              ) : leads.length === 0 ? (
                <div className="text-center text-white/40 py-8">Aucun lead pour le moment</div>
              ) : (
                leads.map((lead: Lead, index: number) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/5"
                  >
                    <div>
                      <p className="font-medium text-white">{lead.name}</p>
                      <p className="text-sm text-white/60">{lead.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        className={
                          lead.status === "new" 
                            ? "bg-[#00FFC2]/10 text-[#00FFC2] border-0" 
                            : "bg-white/10 text-white border-0"
                        }
                      >
                        {lead.status === "new" ? "Nouveau" : "Traité"}
                      </Badge>
                      <p className="text-xs text-white/40 mt-1">
                        {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
          <CardHeader className="border-b border-[#00FFC2]/10">
            <CardTitle className="flex items-center justify-between">
              <span>Prochains RDV</span>
              <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-0">
                {(() => {
                  const now = new Date();
                  
                  // Bookings à venir
                  const upcomingBookings = bookings.filter((b: Booking) => {
                    const bookingDateTime = new Date(`${b.date}T${b.time}`);
                    return bookingDateTime > now && b.status !== "cancelled";
                  });
                  
                  // Créer un Set des emails qui ont déjà un booking
                  const emailsWithBooking = new Set(upcomingBookings.map(b => b.email.toLowerCase()));
                  
                  // Leads qui veulent un RDV (mais qui n'ont pas encore de booking)
                  const leadsWithAppointment = leads.filter((l: Lead) => 
                    l.wantsAppointment && 
                    l.status !== "lost" && 
                    l.status !== "converted" &&
                    !emailsWithBooking.has(l.email.toLowerCase())
                  );
                  
                  const total = upcomingBookings.length + leadsWithAppointment.length;
                  return total;
                })()}
                {" "}à venir
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {loading ? (
                <div className="text-center text-white/40 py-8">Chargement...</div>
              ) : (() => {
                const now = new Date();
                
                // Récupérer les bookings à venir
                const upcomingBookings = bookings
                  .filter((b: Booking) => {
                    const bookingDateTime = new Date(`${b.date}T${b.time}`);
                    return bookingDateTime > now && b.status !== "cancelled";
                  })
                  .map((b: Booking) => ({
                    id: b.id,
                    name: b.name,
                    email: b.email,
                    date: b.date,
                    time: b.time,
                    duration: b.duration,
                    status: b.status,
                    source: 'booking' as const
                  }));
                
                // Créer un Set des emails qui ont déjà un booking
                const emailsWithBooking = new Set(upcomingBookings.map(b => b.email.toLowerCase()));
                
                // Récupérer les leads qui veulent un RDV (mais qui n'ont pas encore de booking)
                const leadsWithAppointment = leads
                  .filter((l: Lead) => 
                    l.wantsAppointment && 
                    l.status !== "lost" && 
                    l.status !== "converted" &&
                    !emailsWithBooking.has(l.email.toLowerCase()) // Ne pas afficher si déjà un booking
                  )
                  .map((l: Lead) => ({
                    id: l.id,
                    name: l.name,
                    email: l.email,
                    date: l.createdAt.split('T')[0], // Utiliser la date de création
                    time: new Date(l.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                    duration: 30, // Durée par défaut
                    status: 'pending' as const,
                    source: 'lead' as const,
                    message: l.message
                  }));
                
                // Combiner et trier
                const allAppointments = [...upcomingBookings, ...leadsWithAppointment]
                  .sort((a, b) => {
                    const dateA = new Date(`${a.date}T${a.time}`);
                    const dateB = new Date(`${b.date}T${b.time}`);
                    return dateA.getTime() - dateB.getTime();
                  })
                  .slice(0, 5); // Afficher seulement les 5 prochains
                
                if (allAppointments.length === 0) {
                  return (
                    <div className="text-center text-white/40 py-8">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">Aucun rendez-vous à venir</p>
                      <p className="text-xs mt-2 text-white/30">
                        Bookings: {bookings.length} | Leads avec RDV: {leadsWithAppointment.length}
                      </p>
                    </div>
                  );
                }
                
                return allAppointments.map((appointment, index: number) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/5"
                  >
                    <div className="w-12 h-12 bg-[#00FFC2]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-[#00FFC2]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{appointment.name}</p>
                        {appointment.source === 'lead' && (
                          <Badge className="bg-blue-500/10 text-blue-400 border-0 text-xs">
                            Contact
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/60">
                        {appointment.email} • {appointment.duration} min
                      </p>
                      {appointment.source === 'lead' && 'message' in appointment && (
                        <p className="text-xs text-white/40 mt-1 line-clamp-1">{appointment.message}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#00FFC2]">{appointment.time}</p>
                      <p className="text-xs text-white/40">{new Date(appointment.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </motion.div>
                ));
              })()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
        <CardHeader className="border-b border-[#00FFC2]/10">
          <CardTitle>Projets en cours</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-2 text-center text-white/40 py-8">Chargement...</div>
            ) : projects.length === 0 ? (
              <div className="col-span-2 text-center text-white/40 py-8">Aucun projet actif</div>
            ) : (
              projects.map((project: Project, index: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 bg-white/5 rounded-xl border border-white/5 hover:border-[#00FFC2]/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium mb-1 text-white">{project.name_fr || project.name_en || "Projet sans nom"}</h4>
                      <p className="text-sm text-white/60">{project.clientName || "Client inconnu"}</p>
                    </div>
                    <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-0">
                      {project.status === "in_progress" ? "En cours" : "Planifié"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Budget</span>
                    <span className="text-[#00FFC2] font-medium">{(project.budget ?? 0).toLocaleString()}€</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Leads View Component
function LeadsView({ leads, onUpdateStatus, onRefresh, onDeleteLead, loading }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadDetail, setShowLeadDetail] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const filteredLeads = leads.filter((lead: Lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusLabel = (status: Lead["status"]) => {
    const labels = {
      new: "Nouveau",
      contacted: "Contacté",
      qualified: "Qualifié",
      converted: "Converti",
      lost: "Perdu"
    };
    return labels[status];
  };

  const getStatusColor = (status: Lead["status"]) => {
    const colors = {
      new: "bg-[#00FFC2]/10 text-[#00FFC2]",
      contacted: "bg-blue-500/10 text-blue-400",
      qualified: "bg-purple-500/10 text-purple-400",
      converted: "bg-green-500/10 text-green-400",
      lost: "bg-red-500/10 text-red-400"
    };
    return colors[status];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Filters */}
      <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Rechercher un lead..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-48 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="new">Nouveaux</SelectItem>
                <SelectItem value="contacted">Contactés</SelectItem>
                <SelectItem value="qualified">Qualifiés</SelectItem>
                <SelectItem value="converted">Convertis</SelectItem>
                <SelectItem value="lost">Perdus</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={onRefresh}
              className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
            >
              <Activity className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
        <CardHeader className="border-b border-[#00FFC2]/10">
          <CardTitle className="flex items-center justify-between">
            <span>Tous les leads</span>
            <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-0">
              {filteredLeads.length} résultats
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center text-white/40 py-12">Chargement...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center text-white/40 py-12">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Aucun lead trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#00FFC2]/10 hover:bg-transparent">
                    <TableHead className="text-white/60">Nom</TableHead>
                    <TableHead className="text-white/60">Email</TableHead>
                    <TableHead className="text-white/60">Téléphone</TableHead>
                    <TableHead className="text-white/60">Statut</TableHead>
                    <TableHead className="text-white/60">Source</TableHead>
                    <TableHead className="text-white/60">Date</TableHead>
                    <TableHead className="text-white/60">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead: Lead) => (
                    <TableRow 
                      key={lead.id}
                      className="border-[#00FFC2]/10 hover:bg-white/5"
                    >
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center gap-2">
                          {lead.name}
                          {lead.convertedToClient && (
                            <Badge className="bg-green-500/10 text-green-400 border-0 text-xs">Client</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-white/60">{lead.email}</TableCell>
                      <TableCell className="text-white/60">{lead.phone || "-"}</TableCell>
                      <TableCell>
                        <Select
                          value={lead.status}
                          onValueChange={(value) => onUpdateStatus(lead.id, value as Lead["status"])}
                        >
                          <SelectTrigger className={`w-32 border-0 ${getStatusColor(lead.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                            <SelectItem value="new">Nouveau</SelectItem>
                            <SelectItem value="contacted">Contacté</SelectItem>
                            <SelectItem value="qualified">Qualifié</SelectItem>
                            <SelectItem value="converted">Converti</SelectItem>
                            <SelectItem value="lost">Perdu</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-white/60">{lead.source}</TableCell>
                      <TableCell className="text-white/60">
                        {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-[#00FFC2] hover:bg-[#00FFC2]/10"
                            onClick={() => {
                              setSelectedLead(lead);
                              setShowLeadDetail(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-400 hover:bg-red-500/10"
                            onClick={() => {
                              setLeadToDelete(lead);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Detail Dialog with Edit and Email */}
      {selectedLead && (
        <LeadDetailDialog
          lead={selectedLead}
          open={showLeadDetail}
          onOpenChange={setShowLeadDetail}
          onRefresh={onRefresh}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {leadToDelete && (
        <DeleteConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Supprimer ce lead ?"
          description={
            leadToDelete.bookingDate && leadToDelete.bookingTime
              ? `Êtes-vous sûr de vouloir supprimer "${leadToDelete.name}" ? Un email d'annulation de rendez-vous sera automatiquement envoyé à ${leadToDelete.email}.`
              : `Êtes-vous sûr de vouloir supprimer "${leadToDelete.name}" ?`
          }
          onConfirm={async () => {
            await onDeleteLead(leadToDelete.id, leadToDelete.name);
            setShowDeleteDialog(false);
            setLeadToDelete(null);
          }}
        />
      )}
    </motion.div>
  );
}

// Clients View Component
function ClientsView({ clients, onRefresh, loading }: any) {
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [convertibleLeads, setConvertibleLeads] = useState<Lead[]>([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [converting, setConverting] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [creatingClient, setCreatingClient] = useState(false);

  // Fetch convertible leads (status = converted)
  const fetchConvertibleLeads = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );
      const data = await response.json();
      
      // Filter leads that are "converted" and not already linked to a client
      const convertible = (data.leads || []).filter(
        (lead: Lead) => lead.status === "converted" && !lead.convertedToClient
      );
      setConvertibleLeads(convertible);
      setShowConvertDialog(true);
    } catch (error) {
      console.error("Error fetching convertible leads:", error);
      toast.error("Erreur lors du chargement des leads");
    }
  };

  // Convert selected leads to clients
  const convertLeadsToClients = async () => {
    if (selectedLeadIds.length === 0) {
      toast.error("Veuillez sélectionner au moins un lead");
      return;
    }

    setConverting(true);
    try {
      const conversions = await Promise.all(
        selectedLeadIds.map((leadId) =>
          fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads/${encodeURIComponent(leadId)}/convert`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${publicAnonKey}` },
            }
          )
        )
      );

      const results = await Promise.all(conversions.map((r) => r.json()));
      const successCount = results.filter((r) => r.success).length;

      if (successCount > 0) {
        toast.success(`${successCount} lead(s) converti(s) en client(s)`);
        setShowConvertDialog(false);
        setSelectedLeadIds([]);
        onRefresh();
      }
    } catch (error) {
      console.error("Error converting leads:", error);
      toast.error("Erreur lors de la conversion");
    } finally {
      setConverting(false);
    }
  };

  // Create new client manually
  const createNewClient = async () => {
    if (!newClientData.name || !newClientData.email) {
      toast.error("Le nom et l'email sont requis");
      return;
    }

    setCreatingClient(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            ...newClientData,
            status: "active",
            revenue: 0,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Client créé avec succès");
        setShowNewClientDialog(false);
        setNewClientData({ name: "", email: "", phone: "", company: "" });
        onRefresh();
      }
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Erreur lors de la création du client");
    } finally {
      setCreatingClient(false);
    }
  };

  // Toggle lead selection
  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Action Buttons */}
      <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={fetchConvertibleLeads}
              className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
            >
              <Zap className="h-4 w-4 mr-2" />
              Importer leads convertis
            </Button>
            <Button
              onClick={() => setShowNewClientDialog(true)}
              className="flex-1 bg-white/5 text-white hover:bg-white/10 border border-white/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer client manuellement
            </Button>
            <Button
              onClick={onRefresh}
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <Activity className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
        <CardHeader className="border-b border-[#00FFC2]/10">
          <CardTitle className="flex items-center justify-between">
            <span>Liste des clients</span>
            <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-0">
              {clients.length} clients
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center text-white/40 py-12">Chargement...</div>
          ) : clients.length === 0 ? (
            <div className="text-center text-white/40 py-12">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="mb-2">Aucun client pour le moment</p>
              <p className="text-sm">Importez des leads convertis ou créez un client manuellement</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((client: Client, index: number) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 bg-white/5 rounded-xl border border-white/5 hover:border-[#00FFC2]/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-[#00FFC2]/10 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-[#00FFC2]" />
                    </div>
                    <Badge
                      className={
                        client.status === "active"
                          ? "bg-green-500/10 text-green-400 border-0"
                          : "bg-white/10 text-white/60 border-0"
                      }
                    >
                      {client.status === "active" ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                  <h4 className="font-medium mb-1">{client.name}</h4>
                  <p className="text-sm text-white/60 mb-2">{client.email}</p>
                  {client.phone && (
                    <p className="text-xs text-white/40 mb-1">📞 {client.phone}</p>
                  )}
                  {client.company && (
                    <p className="text-xs text-white/40 mb-2">🏢 {client.company}</p>
                  )}
                  {client.revenue && client.revenue > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-xs text-white/40">CA généré</p>
                      <p className="text-[#00FFC2] font-medium">
                        {client.revenue.toLocaleString()}€
                      </p>
                    </div>
                  )}
                  {client.convertedFrom && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-[#00FFC2]/60">
                      <Zap className="h-3 w-3" />
                      Converti depuis lead
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Convert Leads Dialog */}
      <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Convertir les leads en clients</DialogTitle>
            <DialogDescription className="text-white/60">
              Transformez vos leads qualifiés en clients actifs
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {convertibleLeads.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>Aucun lead converti disponible</p>
                <p className="text-sm mt-1">
                  Les leads doivent avoir le statut "Converti" pour apparaître ici
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-white/60">
                  Sélectionnez les leads à convertir en clients ({convertibleLeads.length} disponible(s))
                </p>
                <div className="space-y-2">
                  {convertibleLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => toggleLeadSelection(lead.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedLeadIds.includes(lead.id)
                          ? "border-[#00FFC2] bg-[#00FFC2]/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-white">{lead.name}</h4>
                            {selectedLeadIds.includes(lead.id) && (
                              <Check className="h-4 w-4 text-[#00FFC2]" />
                            )}
                          </div>
                          <p className="text-sm text-white/60">{lead.email}</p>
                          {lead.phone && (
                            <p className="text-xs text-white/40 mt-1">📞 {lead.phone}</p>
                          )}
                        </div>
                        <Badge className="bg-green-500/10 text-green-400 border-0">
                          Converti
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={convertLeadsToClients}
                    disabled={selectedLeadIds.length === 0 || converting}
                    className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
                  >
                    {converting ? (
                      <>Conversion en cours...</>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Convertir {selectedLeadIds.length > 0 ? `(${selectedLeadIds.length})` : ""}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowConvertDialog(false)}
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    Annuler
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* New Client Dialog */}
      <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
        <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20 text-white">
          <DialogHeader>
            <DialogTitle>Créer un nouveau client</DialogTitle>
            <DialogDescription className="text-white/60">
              Ajoutez un nouveau client à votre portefeuille
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white/80">Nom *</Label>
              <Input
                value={newClientData.name}
                onChange={(e) =>
                  setNewClientData({ ...newClientData, name: e.target.value })
                }
                placeholder="John Doe"
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-white/80">Email *</Label>
              <Input
                type="email"
                value={newClientData.email}
                onChange={(e) =>
                  setNewClientData({ ...newClientData, email: e.target.value })
                }
                placeholder="john@example.com"
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-white/80">Téléphone</Label>
              <Input
                value={newClientData.phone}
                onChange={(e) =>
                  setNewClientData({ ...newClientData, phone: e.target.value })
                }
                placeholder="+33 6 12 34 56 78"
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-white/80">Entreprise</Label>
              <Input
                value={newClientData.company}
                onChange={(e) =>
                  setNewClientData({ ...newClientData, company: e.target.value })
                }
                placeholder="Nom de l'entreprise"
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={createNewClient}
                disabled={creatingClient}
                className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
              >
                {creatingClient ? "Création..." : "Créer le client"}
              </Button>
              <Button
                onClick={() => setShowNewClientDialog(false)}
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

// Projects View Component
function ProjectsView({ projects, clients, onRefresh, loading, onViewChange }: any) {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showEditProjectDialog, setShowEditProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [newProjectData, setNewProjectData] = useState({
    // French fields
    name_fr: "",
    description_fr: "",
    tags_fr: "",
    duration_fr: "",
    challenges_fr: "",
    solutions_fr: "",
    results_fr: "",
    category_fr: "web" as Project["category_fr"],
    // English fields
    name_en: "",
    description_en: "",
    tags_en: "",
    duration_en: "",
    challenges_en: "",
    solutions_en: "",
    results_en: "",
    category_en: "web" as Project["category_en"],
    // Common fields
    clientId: "",
    clientName: "",
    budget: "",
    startDate: "",
    endDate: "",
    status: "completed" as Project["status"],
    imageUrl: "",
    technologies: "",
    projectUrl: "",
    githubUrl: "",
    imageGallery: "",
  });
  const [editProjectData, setEditProjectData] = useState<any>({});
  const [editProjectTab, setEditProjectTab] = useState("general");
  const [editProjectLang, setEditProjectLang] = useState<"fr" | "en">("fr");
  const [creatingProject, setCreatingProject] = useState(false);
  const [updatingProject, setUpdatingProject] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);

  // Toggle pin status
  const togglePin = async (pid: string, currentPinStatus: boolean) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects/${pid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            isPinned: !currentPinStatus,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success(currentPinStatus ? "Projet désépinglé" : "Projet épinglé");
        onRefresh();
      }
    } catch (error) {
      console.error("Error toggling pin:", error);
      toast.error("Erreur lors de la modification");
    }
  };

  // Edit project
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setEditProjectData({
      // French fields
      name_fr: project.name_fr || "",
      description_fr: project.description_fr || "",
      tags_fr: project.tags_fr?.join(", ") || "",
      duration_fr: project.duration_fr || "",
      challenges_fr: project.challenges_fr || "",
      solutions_fr: project.solutions_fr || "",
      results_fr: project.results_fr || "",
      category_fr: project.category_fr || "web",
      // English fields
      name_en: project.name_en || "",
      description_en: project.description_en || "",
      tags_en: project.tags_en?.join(", ") || "",
      duration_en: project.duration_en || "",
      challenges_en: project.challenges_en || "",
      solutions_en: project.solutions_en || "",
      results_en: project.results_en || "",
      category_en: project.category_en || "web",
      // Common fields
      clientId: project.clientId || "",
      clientName: project.clientName || "",
      budget: project.budget?.toString() || "",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      status: project.status || "completed",
      imageUrl: project.imageUrl || "",
      technologies: project.technologies?.join(", ") || "",
      projectUrl: project.projectUrl || "",
      githubUrl: project.githubUrl || "",
      imageGallery: project.imageGallery?.join(", ") || "",
    });
    setShowEditProjectDialog(true);
  };

  // Update existing project
  const updateProject = async () => {
    if (!editingProject || !editProjectData.name_fr || !editProjectData.name_en) {
      toast.error("Les noms du projet (FR et EN) sont obligatoires");
      return;
    }

    setUpdatingProject(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects/${encodeURIComponent(editingProject.id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            // French fields
            name_fr: editProjectData.name_fr,
            description_fr: editProjectData.description_fr || undefined,
            tags_fr: editProjectData.tags_fr ? editProjectData.tags_fr.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
            duration_fr: editProjectData.duration_fr || undefined,
            challenges_fr: editProjectData.challenges_fr || undefined,
            solutions_fr: editProjectData.solutions_fr || undefined,
            results_fr: editProjectData.results_fr || undefined,
            category_fr: editProjectData.category_fr,
            // English fields
            name_en: editProjectData.name_en,
            description_en: editProjectData.description_en || undefined,
            tags_en: editProjectData.tags_en ? editProjectData.tags_en.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
            duration_en: editProjectData.duration_en || undefined,
            challenges_en: editProjectData.challenges_en || undefined,
            solutions_en: editProjectData.solutions_en || undefined,
            results_en: editProjectData.results_en || undefined,
            category_en: editProjectData.category_en,
            // Common fields
            clientId: editProjectData.clientId || undefined,
            clientName: editProjectData.clientName,
            budget: editProjectData.budget ? parseFloat(editProjectData.budget) : undefined,
            startDate: editProjectData.startDate,
            endDate: editProjectData.endDate || undefined,
            status: editProjectData.status,
            imageUrl: editProjectData.imageUrl,
            technologies: editProjectData.technologies ? editProjectData.technologies.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
            projectUrl: editProjectData.projectUrl || undefined,
            githubUrl: editProjectData.githubUrl || undefined,
            imageGallery: editProjectData.imageGallery ? editProjectData.imageGallery.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Projet mis à jour avec succès");
        setShowEditProjectDialog(false);
        setEditingProject(null);
        setEditProjectData({});
        setEditProjectTab("general");
        setEditProjectLang("fr");
        onRefresh();
      } else {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Erreur lors de la mise à jour du projet");
    } finally {
      setUpdatingProject(false);
    }
  };

  // Delete project
  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteDialog(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    setDeletingProject(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects/${encodeURIComponent(projectToDelete.id)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Projet supprimé avec succès");
        setShowDeleteDialog(false);
        setProjectToDelete(null);
        onRefresh();
      } else {
        throw new Error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Erreur lors de la suppression du projet");
    } finally {
      setDeletingProject(false);
    }
  };

  // Create new project (bilingual)
  const createNewProject = async () => {
    if (!newProjectData.name_fr || !newProjectData.name_en || !newProjectData.startDate) {
      toast.error("Veuillez remplir tous les champs obligatoires (noms FR/EN et date)");
      return;
    }

    setCreatingProject(true);
    try {
      const selectedClient = clients.find((c: Client) => c.id === newProjectData.clientId);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            // French fields
            name_fr: newProjectData.name_fr,
            description_fr: newProjectData.description_fr || undefined,
            tags_fr: newProjectData.tags_fr ? newProjectData.tags_fr.split(',').map(t => t.trim()).filter(Boolean) : [],
            duration_fr: newProjectData.duration_fr || undefined,
            challenges_fr: newProjectData.challenges_fr || undefined,
            solutions_fr: newProjectData.solutions_fr || undefined,
            results_fr: newProjectData.results_fr || undefined,
            category_fr: newProjectData.category_fr,
            // English fields
            name_en: newProjectData.name_en,
            description_en: newProjectData.description_en || undefined,
            tags_en: newProjectData.tags_en ? newProjectData.tags_en.split(',').map(t => t.trim()).filter(Boolean) : [],
            duration_en: newProjectData.duration_en || undefined,
            challenges_en: newProjectData.challenges_en || undefined,
            solutions_en: newProjectData.solutions_en || undefined,
            results_en: newProjectData.results_en || undefined,
            category_en: newProjectData.category_en,
            // Common fields
            clientId: newProjectData.clientId || undefined,
            clientName: newProjectData.clientId ? selectedClient?.name : newProjectData.clientName,
            budget: newProjectData.budget ? parseFloat(newProjectData.budget) : undefined,
            startDate: newProjectData.startDate,
            endDate: newProjectData.endDate || undefined,
            status: newProjectData.status,
            imageUrl: newProjectData.imageUrl,
            isPinned: false,
            spent: 0,
            technologies: newProjectData.technologies ? newProjectData.technologies.split(',').map(t => t.trim()).filter(Boolean) : [],
            projectUrl: newProjectData.projectUrl || undefined,
            githubUrl: newProjectData.githubUrl || undefined,
            imageGallery: newProjectData.imageGallery ? newProjectData.imageGallery.split(',').map(t => t.trim()).filter(Boolean) : [],
          }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        toast.success("Projet bilingue créé avec succès (FR + EN)");
        setShowNewProjectDialog(false);
        setNewProjectData({
          name_fr: "",
          description_fr: "",
          tags_fr: "",
          duration_fr: "",
          challenges_fr: "",
          solutions_fr: "",
          results_fr: "",
          category_fr: "web",
          name_en: "",
          description_en: "",
          tags_en: "",
          duration_en: "",
          challenges_en: "",
          solutions_en: "",
          results_en: "",
          category_en: "web",
          clientId: "",
          clientName: "",
          budget: "",
          startDate: "",
          endDate: "",
          status: "completed",
          imageUrl: "",
          technologies: "",
          projectUrl: "",
          githubUrl: "",
          imageGallery: "",
        });
        onRefresh();
      } else {
        throw new Error(data.error || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Erreur lors de la création du projet");
    } finally {
      setCreatingProject(false);
    }
  };

  const getStatusColor = (status: Project["status"]) => {
    const colors = {
      planning: "bg-yellow-500/10 text-yellow-400",
      in_progress: "bg-[#00FFC2]/10 text-[#00FFC2]",
      review: "bg-purple-500/10 text-purple-400",
      completed: "bg-green-500/10 text-green-400",
      on_hold: "bg-orange-500/10 text-orange-400"
    };
    return colors[status];
  };

  const getStatusLabel = (status: Project["status"]) => {
    const labels = {
      planning: "Planification",
      in_progress: "En cours",
      review: "Révision",
      completed: "Terminé",
      on_hold: "En pause"
    };
    return labels[status];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
        <CardHeader className="border-b border-[#00FFC2]/10">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>Projets</span>
              <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-0">
                {projects.length} {projects.length > 1 ? 'projets' : 'projet'}
              </Badge>
            </div>
            <Button 
              onClick={() => setShowNewProjectDialog(true)}
              className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau projet
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center text-white/40 py-12">Chargement...</div>
          ) : projects.length === 0 ? (
            <div className="text-center text-white/40 py-12">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="mb-4">Aucun projet pour le moment</p>
              <div className="flex flex-col items-center gap-3 mt-6">
                <p className="text-sm text-white/60 mb-2">
                  🌱 Créez des projets de test pour commencer
                </p>
                <Button
                  onClick={() => onViewChange("seed-data")}
                  className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer 6 projets de test
                </Button>
                <p className="text-xs text-white/40 mt-2">
                  Projets bilingues professionnels en 30 secondes
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project: Project, index: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 bg-white/5 rounded-xl border border-white/5 hover:border-[#00FFC2]/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {project.imageUrl && (
                          <ImageIcon className="h-5 w-5 text-[#00FFC2]/60" />
                        )}
                        <h4 className="font-medium text-lg text-white">{project.name_fr || project.name_en}</h4>
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusLabel(project.status)}
                        </Badge>
                        <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-0 text-xs">
                          🇫🇷 FR + 🇬🇧 EN
                        </Badge>
                        {project.isPinned && (
                          <Badge className="bg-[#00FFC2]/20 text-[#00FFC2] border-0">
                            <Pin className="h-3 w-3 mr-1" />
                            Épinglé
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/60 mb-2">{project.clientName || 'Projet personnel'}</p>
                      {project.tags_fr && project.tags_fr.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.tags_fr.slice(0, 3).map((tag: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-white/5 border-white/10 text-white/70">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags_fr.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-white/5 border-white/10 text-white/70">
                              +{project.tags_fr.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => togglePin(project.id, project.isPinned || false)}
                        className={`${
                          project.isPinned
                            ? "text-[#00FFC2] hover:text-[#00FFC2]/80"
                            : "text-white/40 hover:text-white/60"
                        }`}
                      >
                        <Pin className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditProject(project)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteProject(project)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {project.description_fr && (
                    <p className="text-sm text-white/50 mb-4 line-clamp-2">{project.description_fr}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    {project.budget && (
                      <div>
                        <p className="text-xs text-white/40 mb-1">Budget</p>
                        <p className="text-[#00FFC2] font-medium">{project.budget.toLocaleString()}€</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-white/40 mb-1">{project.duration_fr || 'Date'}</p>
                      <p className="text-white/80">{new Date(project.startDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="border-t border-white/5 pt-3">
                      <p className="text-xs text-white/40 mb-2">Technologies</p>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 4).map((tech: string, idx: number) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded bg-[#00FFC2]/10 text-[#00FFC2]">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="text-xs px-2 py-1 rounded bg-white/5 text-white/50">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Project Dialog */}
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un projet bilingue (FR/EN)</DialogTitle>
            <DialogDescription className="text-white/60">
              Tous les projets sont automatiquement bilingues. Remplissez les champs dans les deux langues.
            </DialogDescription>
          </DialogHeader>

          {/* Info Banner */}
          <div className="p-4 bg-[#00FFC2]/5 border border-[#00FFC2]/20 rounded-lg mb-4">
            <p className="text-sm text-white/80">
              💡 <strong>Système bilingue :</strong> Chaque projet contient des champs français et anglais. Remplissez au minimum les champs obligatoires (*) dans les deux langues.
            </p>
          </div>
          
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/5">
              <TabsTrigger value="basics">Infos de base</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="content">Contenu <span className="ml-1 text-[#00FFC2]">FR/EN</span></TabsTrigger>
              <TabsTrigger value="media">Médias</TabsTrigger>
            </TabsList>

            {/* Tab 1: Basic Info */}
            <TabsContent value="basics" className="space-y-4 py-4">
              <div className="grid gap-4">
                {/* French Name */}
                <div className="space-y-2">
                  <Label className="text-white/80 flex items-center gap-2">
                    <span>Nom du projet (FR) *</span>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs">🇫🇷</Badge>
                  </Label>
                  <Input
                    value={newProjectData.name_fr}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, name_fr: e.target.value })
                    }
                    placeholder="Refonte site e-commerce"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                {/* English Name */}
                <div className="space-y-2">
                  <Label className="text-white/80 flex items-center gap-2">
                    <span>Nom du projet (EN) *</span>
                    <Badge variant="outline" className="border-[#00FFC2]/30 text-[#00FFC2] text-xs">🇬🇧</Badge>
                  </Label>
                  <Input
                    value={newProjectData.name_en}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, name_en: e.target.value })
                    }
                    placeholder="E-commerce website redesign"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Catégorie (FR) *</Label>
                  <Select
                    value={newProjectData.category_fr}
                    onValueChange={(value: Project["category_fr"]) =>
                      setNewProjectData({ ...newProjectData, category_fr: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                      <SelectItem value="web" className="text-white">
                        Développement Web
                      </SelectItem>
                      <SelectItem value="mobile" className="text-white">
                        Application Mobile
                      </SelectItem>
                      <SelectItem value="design" className="text-white">
                        Design UI/UX
                      </SelectItem>
                      <SelectItem value="consulting" className="text-white">
                        Consulting
                      </SelectItem>
                      <SelectItem value="other" className="text-white">
                        Autre
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">Catégorie (EN) *</Label>
                  <Select
                    value={newProjectData.category_en}
                    onValueChange={(value: Project["category_en"]) =>
                      setNewProjectData({ ...newProjectData, category_en: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                      <SelectItem value="web" className="text-white">
                        Web Development
                      </SelectItem>
                      <SelectItem value="mobile" className="text-white">
                        Mobile App
                      </SelectItem>
                      <SelectItem value="design" className="text-white">
                        UI/UX Design
                      </SelectItem>
                      <SelectItem value="consulting" className="text-white">
                        Consulting
                      </SelectItem>
                      <SelectItem value="other" className="text-white">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">Statut</Label>
                  <Select
                    value={newProjectData.status}
                    onValueChange={(value: Project["status"]) =>
                      setNewProjectData({ ...newProjectData, status: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                      <SelectItem value="planning" className="text-white">
                        Planification
                      </SelectItem>
                      <SelectItem value="in_progress" className="text-white">
                        En cours
                      </SelectItem>
                      <SelectItem value="review" className="text-white">
                        Révision
                      </SelectItem>
                      <SelectItem value="completed" className="text-white">
                        Terminé
                      </SelectItem>
                      <SelectItem value="on_hold" className="text-white">
                        En pause
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Date de début *</Label>
                  <Input
                    type="date"
                    value={newProjectData.startDate}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, startDate: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Date de fin</Label>
                  <Input
                    type="date"
                    value={newProjectData.endDate}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, endDate: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Durée du projet (FR)</Label>
                  <Input
                    value={newProjectData.duration_fr}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, duration_fr: e.target.value })
                    }
                    placeholder="3 mois"
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-white/40">Ex: "2 semaines", "3 mois", "6 mois"</p>
                </div>

                <div className="space-y-2 pl-4 border-l-2 border-[#00FFC2]/30">
                  <Label className="text-white/80 flex items-center gap-2">
                    <span>Durée (EN)</span>
                    <Badge className="bg-[#00FFC2]/20 text-[#00FFC2] text-xs">English</Badge>
                  </Label>
                  <Input
                    value={newProjectData.duration_en}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, duration_en: e.target.value })
                    }
                    placeholder="3 months"
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-white/40">Ex: "2 weeks", "3 months", "6 months"</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Client (optionnel)</Label>
                  <Select
                    value={newProjectData.clientId}
                    onValueChange={(value) =>
                      setNewProjectData({ ...newProjectData, clientId: value, clientName: "" })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                      {clients.map((client: Client) => (
                        <SelectItem key={client.id} value={client.id} className="text-white">
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Ou nom du client</Label>
                  <Input
                    value={newProjectData.clientName}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, clientName: e.target.value, clientId: "" })
                    }
                    placeholder="Acme Corp"
                    className="bg-white/5 border-white/10 text-white"
                    disabled={!!newProjectData.clientId}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Budget (€) - optionnel</Label>
                <Input
                  type="number"
                  value={newProjectData.budget}
                  onChange={(e) =>
                    setNewProjectData({ ...newProjectData, budget: e.target.value })
                  }
                  placeholder="15000"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </TabsContent>

            {/* Tab 2: Portfolio Fields */}
            <TabsContent value="portfolio" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/80 flex items-center gap-2">
                    <span>Tags (FR)</span>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs">🇫🇷</Badge>
                  </Label>
                  <Input
                    value={newProjectData.tags_fr}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, tags_fr: e.target.value })
                    }
                    placeholder="E-commerce, Responsive, SEO"
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-white/40">Séparez les tags par des virgules</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80 flex items-center gap-2">
                    <span>Tags (EN)</span>
                    <Badge variant="outline" className="border-[#00FFC2]/30 text-[#00FFC2] text-xs">🇬🇧</Badge>
                  </Label>
                  <Input
                    value={newProjectData.tags_en}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, tags_en: e.target.value })
                    }
                    placeholder="E-commerce, Responsive, SEO"
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-white/40">Separate tags with commas</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Technologies utilisées</Label>
                <Input
                  value={newProjectData.technologies}
                  onChange={(e) =>
                    setNewProjectData({ ...newProjectData, technologies: e.target.value })
                  }
                  placeholder="React, TypeScript, Tailwind CSS, Supabase"
                  className="bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-white/40">Séparez les technologies par des virgules</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">URL du projet en ligne</Label>
                <Input
                  value={newProjectData.projectUrl}
                  onChange={(e) =>
                    setNewProjectData({ ...newProjectData, projectUrl: e.target.value })
                  }
                  placeholder="https://monprojet.com"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">URL du dépôt GitHub</Label>
                <Input
                  value={newProjectData.githubUrl}
                  onChange={(e) =>
                    setNewProjectData({ ...newProjectData, githubUrl: e.target.value })
                  }
                  placeholder="https://github.com/username/repo"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </TabsContent>

            {/* Tab 3: Content */}
            <TabsContent value="content" className="space-y-6 py-4">
              {/* Description */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Description courte (FR) *</Label>
                  <Textarea
                    value={newProjectData.description_fr}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, description_fr: e.target.value })
                    }
                    placeholder="Description courte qui apparaîtra dans la liste des projets..."
                    className="bg-white/5 border-white/10 text-white min-h-[80px]"
                  />
                </div>

                <div className="space-y-2 pl-4 border-l-2 border-[#00FFC2]/30">
                  <Label className="text-white/80 flex items-center gap-2">
                    <span>Description courte (EN)</span>
                    <Badge className="bg-[#00FFC2]/20 text-[#00FFC2] text-xs">English</Badge>
                  </Label>
                  <Textarea
                    value={newProjectData.description_en}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, description_en: e.target.value })
                    }
                    placeholder="Short description that will appear in the project list..."
                    className="bg-white/5 border-white/10 text-white min-h-[80px]"
                  />
                </div>
              </div>

              {/* Challenges */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Défis rencontrés (FR)</Label>
                  <Textarea
                    value={newProjectData.challenges_fr}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, challenges_fr: e.target.value })
                    }
                    placeholder="Quels étaient les principaux défis de ce projet ?"
                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                  />
                </div>

                <div className="space-y-2 pl-4 border-l-2 border-[#00FFC2]/30">
                  <Label className="text-white/80 flex items-center gap-2">
                    <span>Challenges (EN)</span>
                    <Badge className="bg-[#00FFC2]/20 text-[#00FFC2] text-xs">English</Badge>
                  </Label>
                  <Textarea
                    value={newProjectData.challenges_en}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, challenges_en: e.target.value })
                    }
                    placeholder="What were the main challenges of this project?"
                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                  />
                </div>
              </div>

              {/* Solutions */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Solutions apportées (FR)</Label>
                  <Textarea
                    value={newProjectData.solutions_fr}
                    onChange={(e) =>
                      setNewProjectData({ ...newProjectData, solutions_fr: e.target.value })
                    }
                  placeholder="Comment avez-vous résolu ces défis ?"
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                />
              </div>

              <div className="space-y-2 pl-4 border-l-2 border-[#00FFC2]/30">
                <Label className="text-white/80 flex items-center gap-2">
                  <span>Solutions (EN)</span>
                  <Badge className="bg-[#00FFC2]/20 text-[#00FFC2] text-xs">English</Badge>
                </Label>
                <Textarea
                  value={newProjectData.solutions_en}
                  onChange={(e) =>
                    setNewProjectData({ ...newProjectData, solutions_en: e.target.value })
                  }
                  placeholder="How did you solve these challenges?"
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Résultats & Impact (FR)</Label>
                <Textarea
                  value={newProjectData.results_fr}
                  onChange={(e) =>
                    setNewProjectData({ ...newProjectData, results_fr: e.target.value })
                  }
                  placeholder="Quels ont été les résultats mesurables ? Ex: +150% de conversions, -40% de temps de chargement..."
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                />
              </div>

              <div className="space-y-2 pl-4 border-l-2 border-[#00FFC2]/30">
                <Label className="text-white/80 flex items-center gap-2">
                  <span>Results & Impact (EN)</span>
                  <Badge className="bg-[#00FFC2]/20 text-[#00FFC2] text-xs">English</Badge>
                </Label>
                <Textarea
                  value={newProjectData.results_en}
                  onChange={(e) =>
                    setNewProjectData({ ...newProjectData, results_en: e.target.value })
                  }
                  placeholder="What were the measurable results? Ex: +150% conversions, -40% loading time..."
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                />
              </div>
            </div>
            </TabsContent>

            {/* Tab 4: Media */}
            <TabsContent value="media" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-white/80">Image principale *</Label>
                <Input
                  value={newProjectData.imageUrl}
                  onChange={(e) =>
                    setNewProjectData({ ...newProjectData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/hero-image.jpg"
                  className="bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-white/40">URL de l'image principale du projet (format: 16:9 recommandé)</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Galerie d'images</Label>
                <Textarea
                  value={newProjectData.imageGallery}
                  onChange={(e) =>
                    setNewProjectData({ ...newProjectData, imageGallery: e.target.value })
                  }
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg, https://example.com/image3.jpg"
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                />
                <p className="text-xs text-white/40">URLs des images supplémentaires, séparées par des virgules</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              onClick={() => setShowNewProjectDialog(false)}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Annuler
            </Button>
            <Button
              onClick={createNewProject}
              disabled={creatingProject}
              className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
            >
              {creatingProject ? "Création..." : "Créer le projet"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      {editingProject && (
        <Dialog open={showEditProjectDialog} onOpenChange={(open) => {
          setShowEditProjectDialog(open);
          if (!open) {
            setEditingProject(null);
            setEditProjectTab("general");
            setEditProjectLang("fr");
          }
        }}>
          <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20 text-white max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le projet</DialogTitle>
              <DialogDescription className="text-white/60">
                Modifiez les informations du projet "{editingProject.name_fr || editingProject.name_en}"
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-white/60 text-sm">
                🌍 Contenu multilingue - Remplissez le français (obligatoire) et l'anglais (obligatoire)
              </p>

              {/* Tabs for sections */}
              <Tabs value={editProjectTab} onValueChange={setEditProjectTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/5">
                  <TabsTrigger value="general">Général</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="content">Contenu</TabsTrigger>
                  <TabsTrigger value="details">Détails</TabsTrigger>
                </TabsList>

                {/* GENERAL TAB */}
                <TabsContent value="general" className="space-y-4 mt-4">
                  {/* Common Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/80">Statut</Label>
                      <Select
                        value={editProjectData.status}
                        onValueChange={(value: Project["status"]) =>
                          setEditProjectData({ ...editProjectData, status: value })
                        }
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                          <SelectItem value="planning">Planification</SelectItem>
                          <SelectItem value="in_progress">En cours</SelectItem>
                          <SelectItem value="review">Révision</SelectItem>
                          <SelectItem value="completed">Terminé</SelectItem>
                          <SelectItem value="on_hold">En pause</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/80">Budget (€)</Label>
                      <Input
                        type="number"
                        value={editProjectData.budget}
                        onChange={(e) =>
                          setEditProjectData({ ...editProjectData, budget: e.target.value })
                        }
                        placeholder="5000"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/80">Date de début</Label>
                      <Input
                        type="date"
                        value={editProjectData.startDate}
                        onChange={(e) =>
                          setEditProjectData({ ...editProjectData, startDate: e.target.value })
                        }
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/80">Date de fin</Label>
                      <Input
                        type="date"
                        value={editProjectData.endDate}
                        onChange={(e) =>
                          setEditProjectData({ ...editProjectData, endDate: e.target.value })
                        }
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  {/* Language Tabs for translated fields */}
                  <div className="border-t border-white/10 pt-4">
                    <Tabs value={editProjectLang} onValueChange={(v) => setEditProjectLang(v as "fr" | "en")} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-4">
                        <TabsTrigger 
                          value="fr" 
                          className="data-[state=active]:bg-[#00FFC2] data-[state=active]:text-[#0C0C0C]"
                        >
                          🇫🇷 Français {!editProjectData.name_fr && <span className="ml-1 text-red-400">*</span>}
                        </TabsTrigger>
                        <TabsTrigger 
                          value="en" 
                          className="data-[state=active]:bg-[#00FFC2] data-[state=active]:text-[#0C0C0C]"
                        >
                          🇬🇧 English {!editProjectData.name_en && <span className="ml-1 text-red-400">*</span>}
                        </TabsTrigger>
                      </TabsList>

                      {/* FRENCH CONTENT */}
                      <TabsContent value="fr" className="space-y-4">
                        <div>
                          <Label htmlFor="name_fr" className="text-white/80">
                            Nom du projet (Français) *
                          </Label>
                          <Input
                            id="name_fr"
                            value={editProjectData.name_fr || ""}
                            onChange={(e) =>
                              setEditProjectData({ ...editProjectData, name_fr: e.target.value })
                            }
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="Refonte e-commerce luxe..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="category_fr" className="text-white/80">
                            Catégorie (Français)
                          </Label>
                          <Select
                            value={editProjectData.category_fr || "web"}
                            onValueChange={(value) =>
                              setEditProjectData({ ...editProjectData, category_fr: value })
                            }
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                              <SelectItem value="web">Développement Web</SelectItem>
                              <SelectItem value="mobile">Application Mobile</SelectItem>
                              <SelectItem value="design">Design UI/UX</SelectItem>
                              <SelectItem value="consulting">Consulting</SelectItem>
                              <SelectItem value="other">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="duration_fr" className="text-white/80">
                            Durée (Français)
                          </Label>
                          <Input
                            id="duration_fr"
                            value={editProjectData.duration_fr || ""}
                            onChange={(e) =>
                              setEditProjectData({ ...editProjectData, duration_fr: e.target.value })
                            }
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="3 mois"
                          />
                        </div>
                      </TabsContent>

                      {/* ENGLISH CONTENT */}
                      <TabsContent value="en" className="space-y-4">
                        <div>
                          <Label htmlFor="name_en" className="text-white/80">
                            Project Name (English) *
                          </Label>
                          <Input
                            id="name_en"
                            value={editProjectData.name_en || ""}
                            onChange={(e) =>
                              setEditProjectData({ ...editProjectData, name_en: e.target.value })
                            }
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="Luxury e-commerce redesign..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="category_en" className="text-white/80">
                            Category (English)
                          </Label>
                          <Select
                            value={editProjectData.category_en || "web"}
                            onValueChange={(value) =>
                              setEditProjectData({ ...editProjectData, category_en: value })
                            }
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                              <SelectItem value="web">Web Development</SelectItem>
                              <SelectItem value="mobile">Mobile App</SelectItem>
                              <SelectItem value="design">UI/UX Design</SelectItem>
                              <SelectItem value="consulting">Consulting</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="duration_en" className="text-white/80">
                            Duration (English)
                          </Label>
                          <Input
                            id="duration_en"
                            value={editProjectData.duration_en || ""}
                            onChange={(e) =>
                              setEditProjectData({ ...editProjectData, duration_en: e.target.value })
                            }
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="3 months"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </TabsContent>

                {/* PORTFOLIO TAB */}
                <TabsContent value="portfolio" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-white/80">Technologies (séparées par virgules)</Label>
                    <Input
                      value={editProjectData.technologies || ""}
                      onChange={(e) =>
                        setEditProjectData({ ...editProjectData, technologies: e.target.value })
                      }
                      placeholder="React, TypeScript, Tailwind CSS"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/80">URL du projet</Label>
                    <Input
                      value={editProjectData.projectUrl || ""}
                      onChange={(e) =>
                        setEditProjectData({ ...editProjectData, projectUrl: e.target.value })
                      }
                      placeholder="https://monprojet.com"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/80">URL du dépôt GitHub</Label>
                    <Input
                      value={editProjectData.githubUrl || ""}
                      onChange={(e) =>
                        setEditProjectData({ ...editProjectData, githubUrl: e.target.value })
                      }
                      placeholder="https://github.com/username/repo"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/80">Image principale (URL)</Label>
                    <Input
                      value={editProjectData.imageUrl || ""}
                      onChange={(e) =>
                        setEditProjectData({ ...editProjectData, imageUrl: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/80">Galerie d'images (URLs séparées par virgules)</Label>
                    <Input
                      value={editProjectData.imageGallery || ""}
                      onChange={(e) =>
                        setEditProjectData({ ...editProjectData, imageGallery: e.target.value })
                      }
                      placeholder="url1, url2, url3"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  {/* Language Tabs for tags */}
                  <div className="border-t border-white/10 pt-4">
                    <Tabs value={editProjectLang} onValueChange={(v) => setEditProjectLang(v as "fr" | "en")} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-4">
                        <TabsTrigger 
                          value="fr" 
                          className="data-[state=active]:bg-[#00FFC2] data-[state=active]:text-[#0C0C0C]"
                        >
                          🇫🇷 Tags Français
                        </TabsTrigger>
                        <TabsTrigger 
                          value="en" 
                          className="data-[state=active]:bg-[#00FFC2] data-[state=active]:text-[#0C0C0C]"
                        >
                          🇬🇧 Tags English
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="fr" className="space-y-4">
                        <div>
                          <Label className="text-white/80">Tags (Français)</Label>
                          <Input
                            value={editProjectData.tags_fr || ""}
                            onChange={(e) =>
                              setEditProjectData({ ...editProjectData, tags_fr: e.target.value })
                            }
                            placeholder="E-commerce, Responsive, SEO"
                            className="bg-white/5 border-white/10 text-white"
                          />
                          <p className="text-xs text-white/40 mt-1">Séparez les tags par des virgules</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="en" className="space-y-4">
                        <div>
                          <Label className="text-white/80">Tags (English)</Label>
                          <Input
                            value={editProjectData.tags_en || ""}
                            onChange={(e) =>
                              setEditProjectData({ ...editProjectData, tags_en: e.target.value })
                            }
                            placeholder="E-commerce, Responsive, SEO"
                            className="bg-white/5 border-white/10 text-white"
                          />
                          <p className="text-xs text-white/40 mt-1">Separate tags with commas</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </TabsContent>

                {/* CONTENT TAB */}
                <TabsContent value="content" className="space-y-4 mt-4">
                  <Tabs value={editProjectLang} onValueChange={(v) => setEditProjectLang(v as "fr" | "en")} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-4">
                      <TabsTrigger 
                        value="fr" 
                        className="data-[state=active]:bg-[#00FFC2] data-[state=active]:text-[#0C0C0C]"
                      >
                        🇫🇷 Français
                      </TabsTrigger>
                      <TabsTrigger 
                        value="en" 
                        className="data-[state=active]:bg-[#00FFC2] data-[state=active]:text-[#0C0C0C]"
                      >
                        🇬🇧 English
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="fr" className="space-y-4">
                      <div>
                        <Label htmlFor="description_fr" className="text-white/80">
                          Description (Français)
                        </Label>
                        <Textarea
                          id="description_fr"
                          value={editProjectData.description_fr || ""}
                          onChange={(e) =>
                            setEditProjectData({ ...editProjectData, description_fr: e.target.value })
                          }
                          className="bg-white/5 border-white/10 text-white min-h-[80px]"
                          placeholder="Description courte du projet..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="challenges_fr" className="text-white/80">
                          Défis (Français)
                        </Label>
                        <Textarea
                          id="challenges_fr"
                          value={editProjectData.challenges_fr || ""}
                          onChange={(e) =>
                            setEditProjectData({ ...editProjectData, challenges_fr: e.target.value })
                          }
                          className="bg-white/5 border-white/10 text-white min-h-[100px]"
                          placeholder="Quels étaient les défis à relever..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="solutions_fr" className="text-white/80">
                          Solutions (Français)
                        </Label>
                        <Textarea
                          id="solutions_fr"
                          value={editProjectData.solutions_fr || ""}
                          onChange={(e) =>
                            setEditProjectData({ ...editProjectData, solutions_fr: e.target.value })
                          }
                          className="bg-white/5 border-white/10 text-white min-h-[100px]"
                          placeholder="Comment avez-vous résolu ces défis..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="results_fr" className="text-white/80">
                          Résultats (Français)
                        </Label>
                        <Textarea
                          id="results_fr"
                          value={editProjectData.results_fr || ""}
                          onChange={(e) =>
                            setEditProjectData({ ...editProjectData, results_fr: e.target.value })
                          }
                          className="bg-white/5 border-white/10 text-white min-h-[100px]"
                          placeholder="Quels sont les résultats obtenus..."
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="en" className="space-y-4">
                      <div>
                        <Label htmlFor="description_en" className="text-white/80">
                          Description (English)
                        </Label>
                        <Textarea
                          id="description_en"
                          value={editProjectData.description_en || ""}
                          onChange={(e) =>
                            setEditProjectData({ ...editProjectData, description_en: e.target.value })
                          }
                          className="bg-white/5 border-white/10 text-white min-h-[80px]"
                          placeholder="Short project description..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="challenges_en" className="text-white/80">
                          Challenges (English)
                        </Label>
                        <Textarea
                          id="challenges_en"
                          value={editProjectData.challenges_en || ""}
                          onChange={(e) =>
                            setEditProjectData({ ...editProjectData, challenges_en: e.target.value })
                          }
                          className="bg-white/5 border-white/10 text-white min-h-[100px]"
                          placeholder="What were the challenges to overcome..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="solutions_en" className="text-white/80">
                          Solutions (English)
                        </Label>
                        <Textarea
                          id="solutions_en"
                          value={editProjectData.solutions_en || ""}
                          onChange={(e) =>
                            setEditProjectData({ ...editProjectData, solutions_en: e.target.value })
                          }
                          className="bg-white/5 border-white/10 text-white min-h-[100px]"
                          placeholder="How you solved these challenges..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="results_en" className="text-white/80">
                          Results (English)
                        </Label>
                        <Textarea
                          id="results_en"
                          value={editProjectData.results_en || ""}
                          onChange={(e) =>
                            setEditProjectData({ ...editProjectData, results_en: e.target.value })
                          }
                          className="bg-white/5 border-white/10 text-white min-h-[100px]"
                          placeholder="What results were achieved..."
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                {/* DETAILS TAB */}
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/80">Client (optionnel)</Label>
                      <Input
                        value={editProjectData.clientName || ""}
                        onChange={(e) =>
                          setEditProjectData({ ...editProjectData, clientName: e.target.value })
                        }
                        placeholder="Nom du client"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white/80">ID Client (optionnel)</Label>
                      <Input
                        value={editProjectData.clientId || ""}
                        onChange={(e) =>
                          setEditProjectData({ ...editProjectData, clientId: e.target.value })
                        }
                        placeholder="client-123"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditProjectDialog(false);
                  setEditingProject(null);
                  setEditProjectTab("general");
                  setEditProjectLang("fr");
                }}
                className="border-white/10 text-white hover:bg-white/5"
              >
                Annuler
              </Button>
              <Button
                onClick={updateProject}
                disabled={updatingProject}
                className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
              >
                {updatingProject ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {projectToDelete && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="bg-[#0C0C0C] border-red-500/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-red-400">Confirmer la suppression</DialogTitle>
              <DialogDescription className="text-white/60">
                Êtes-vous sûr de vouloir supprimer le projet "{projectToDelete.name_fr || projectToDelete.name_en}" ?
                Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white/80 mb-1">
                    <strong>Projet FR:</strong> {projectToDelete.name_fr}
                  </p>
                  <p className="text-sm text-white/80">
                    <strong>Projet EN:</strong> {projectToDelete.name_en}
                  </p>
                  <p className="text-xs text-white/50 mt-2">
                    ⚠️ Les deux versions seront supprimées
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setProjectToDelete(null);
                }}
                className="border-white/10 text-white hover:bg-white/5"
              >
                Annuler
              </Button>
              <Button
                onClick={confirmDeleteProject}
                disabled={deletingProject}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                {deletingProject ? "Suppression..." : "Supprimer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}

// Invoices View Component
function InvoicesView({ invoices, clients, onRefresh, loading }: any) {
  const [showNewInvoiceDialog, setShowNewInvoiceDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newInvoiceData, setNewInvoiceData] = useState({
    clientId: "",
    amount: "",
    description: "",
    dueDate: "",
  });
  
  // Invoice filters and search
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<Invoice["status"] | "all">("all");
  const [invoiceSortBy, setInvoiceSortBy] = useState<"date" | "amount" | "client">("date");
  const [invoiceSortOrder, setInvoiceSortOrder] = useState<"asc" | "desc">("desc");

  const getStatusColor = (status: Invoice["status"]) => {
    const colors = {
      draft: "bg-white/10 text-white/60",
      sent: "bg-blue-500/10 text-blue-400",
      paid: "bg-green-500/10 text-green-400",
      overdue: "bg-red-500/10 text-red-400"
    };
    return colors[status];
  };

  const getStatusLabel = (status: Invoice["status"]) => {
    const labels = {
      draft: "Brouillon",
      sent: "Envoyée",
      paid: "Payée",
      overdue: "En retard"
    };
    return labels[status];
  };

  // Generate next invoice number
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const existingNumbers = invoices
      .map((inv: Invoice) => {
        const match = inv.number.match(/(\d+)-(\d+)/);
        return match ? parseInt(match[2]) : 0;
      })
      .filter((n: number) => n > 0);
    
    const nextNumber = existingNumbers.length > 0 
      ? Math.max(...existingNumbers) + 1 
      : 1;
    
    return `${year}-${String(nextNumber).padStart(3, "0")}`;
  };

  // Create new invoice
  const createInvoice = async () => {
    if (!newInvoiceData.clientId || !newInvoiceData.amount || !newInvoiceData.dueDate) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    const selectedClient = clients.find((c: Client) => c.id === newInvoiceData.clientId);
    if (!selectedClient) {
      toast.error("Client introuvable");
      return;
    }

    setCreatingInvoice(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/invoices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            number: generateInvoiceNumber(),
            clientId: newInvoiceData.clientId,
            clientName: selectedClient.name,
            amount: parseFloat(newInvoiceData.amount),
            description: newInvoiceData.description,
            dueDate: newInvoiceData.dueDate,
            status: "draft",
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Facture créée avec succès");
        setShowNewInvoiceDialog(false);
        setNewInvoiceData({ clientId: "", amount: "", description: "", dueDate: "" });
        onRefresh();
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Erreur lors de la création de la facture");
    } finally {
      setCreatingInvoice(false);
    }
  };

  // Update invoice status
  const updateInvoiceStatus = async (invoiceId: string, newStatus: Invoice["status"]) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/invoices/${invoiceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success(`Facture ${getStatusLabel(newStatus).toLowerCase()}`);
        onRefresh();
        setShowDetailDialog(false);
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Delete invoice
  const handleDeleteInvoice = async () => {
    if (!selectedInvoice) return;
    
    try {
      const supabaseClient = createClient();
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/invoices/${encodeURIComponent(selectedInvoice.id)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Facture supprimée avec succès");
        setShowDeleteDialog(false);
        setSelectedInvoice(null);
        onRefresh();
      } else {
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  // Calculate total revenue
  const totalRevenue = invoices
    .filter((inv: Invoice) => inv.status === "paid")
    .reduce((sum: number, inv: Invoice) => sum + inv.amount, 0);

  const pendingRevenue = invoices
    .filter((inv: Invoice) => inv.status === "sent" || inv.status === "overdue")
    .reduce((sum: number, inv: Invoice) => sum + inv.amount, 0);

  // Filter and sort invoices
  const filteredInvoices = invoices
    .filter((invoice) => {
      // Search filter
      const searchLower = invoiceSearch.toLowerCase();
      const matchesSearch = 
        invoice.number.toLowerCase().includes(searchLower) ||
        invoice.clientName.toLowerCase().includes(searchLower) ||
        invoice.amount.toString().includes(searchLower) ||
        (invoice.description && invoice.description.toLowerCase().includes(searchLower));
      
      // Status filter
      const matchesStatus = invoiceStatusFilter === "all" || invoice.status === invoiceStatusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (invoiceSortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "client":
          comparison = a.clientName.localeCompare(b.clientName);
          break;
      }
      
      return invoiceSortOrder === "asc" ? comparison : -comparison;
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/60 text-sm">CA facturé</p>
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Check className="h-5 w-5 text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#00FFC2]">
              {totalRevenue.toLocaleString()}€
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/60 text-sm">En attente</p>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {pendingRevenue.toLocaleString()}€
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/60 text-sm">Total factures</p>
              <div className="w-10 h-10 bg-[#00FFC2]/10 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-[#00FFC2]" />
              </div>
            </div>
            <p className="text-2xl font-bold">{invoices.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
        <CardHeader className="border-b border-[#00FFC2]/10">
          <CardTitle className="flex items-center justify-between">
            <span>Toutes les factures</span>
            <div className="flex gap-3">
              <Button
                onClick={onRefresh}
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <Activity className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Button 
                onClick={() => setShowNewInvoiceDialog(true)}
                className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle facture
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Rechercher par numéro, client, montant ou description..."
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            {/* Filters row */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Status filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-white/60" />
                <Select
                  value={invoiceStatusFilter}
                  onValueChange={(value: any) => setInvoiceStatusFilter(value)}
                >
                  <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="sent">Envoyée</SelectItem>
                    <SelectItem value="paid">Payée</SelectItem>
                    <SelectItem value="overdue">En retard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort by */}
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">Trier par:</span>
                <Select
                  value={invoiceSortBy}
                  onValueChange={(value: any) => setInvoiceSortBy(value)}
                >
                  <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="amount">Montant</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort order */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInvoiceSortOrder(invoiceSortOrder === "asc" ? "desc" : "asc")}
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                {invoiceSortOrder === "asc" ? (
                  <>
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    Croissant
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    Décroissant
                  </>
                )}
              </Button>

              {/* Reset filters */}
              {(invoiceSearch || invoiceStatusFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setInvoiceSearch("");
                    setInvoiceStatusFilter("all");
                  }}
                  className="text-white/60 hover:text-white hover:bg-white/5"
                >
                  <X className="h-4 w-4 mr-1" />
                  Réinitialiser
                </Button>
              )}

              {/* Results count */}
              <span className="ml-auto text-sm text-white/60">
                {filteredInvoices.length} {filteredInvoices.length > 1 ? "factures" : "facture"}
                {invoiceSearch || invoiceStatusFilter !== "all" ? ` (sur ${invoices.length})` : ""}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-white/40 py-12">Chargement...</div>
          ) : invoices.length === 0 ? (
            <div className="text-center text-white/40 py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="mb-2">Aucune facture pour le moment</p>
              <p className="text-sm">Créez votre première facture pour suivre vos revenus</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center text-white/40 py-12">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="mb-2">Aucune facture trouvée</p>
              <p className="text-sm">Essayez de modifier vos filtres de recherche</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#00FFC2]/10 hover:bg-transparent">
                    <TableHead className="text-white/60">Numéro</TableHead>
                    <TableHead className="text-white/60">Client</TableHead>
                    <TableHead className="text-white/60">Montant</TableHead>
                    <TableHead className="text-white/60">Statut</TableHead>
                    <TableHead className="text-white/60">Échéance</TableHead>
                    <TableHead className="text-white/60">Date</TableHead>
                    <TableHead className="text-white/60">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice: Invoice) => (
                    <TableRow 
                      key={invoice.id}
                      className="border-[#00FFC2]/10 hover:bg-white/5"
                    >
                      <TableCell className="font-medium text-white">#{invoice.number}</TableCell>
                      <TableCell className="text-white/80">{invoice.clientName}</TableCell>
                      <TableCell className="text-[#00FFC2] font-medium">
                        {invoice.amount.toLocaleString()}€
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusLabel(invoice.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white/60">
                        {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-white/60">
                        {new Date(invoice.createdAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowDetailDialog(true);
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-white/60 hover:text-white hover:bg-white/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowEditDialog(true);
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-[#00FFC2] hover:bg-[#00FFC2]/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {(invoice.status === "sent" || invoice.status === "overdue") && (
                            <Button
                              onClick={async () => {
                                // Message de confirmation
                                const isOverdue = invoice.status === "overdue";
                                const action = isOverdue ? "relancer" : "renvoyer la facture";
                                
                                const confirmed = window.confirm(
                                  `${isOverdue ? 'Relancer' : 'Renvoyer'} la facture ${invoice.number} par email ?\n\n` +
                                  `Client : ${invoice.clientName}\n` +
                                  `Email : ${invoice.clientEmail}\n` +
                                  `Montant : ${invoice.amount?.toLocaleString('fr-FR') || 0} €\n` +
                                  `Statut : ${isOverdue ? '⚠️ En retard' : '📤 Envoyée'}\n\n` +
                                  `Un email ${isOverdue ? 'de relance' : 'de rappel'} sera envoyé au client.`
                                );
                                
                                if (!confirmed) return;

                                try {
                                  const supabaseClient = createClient();
                                  const { data: { session } } = await supabaseClient.auth.getSession();
                                  
                                  if (!session) {
                                    toast.error("Session expirée");
                                    return;
                                  }

                                  const response = await fetch(
                                    `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/invoices/${encodeURIComponent(invoice.id)}/send-reminder`,
                                    {
                                      method: "POST",
                                      headers: {
                                        Authorization: `Bearer ${session.access_token}`,
                                      },
                                    }
                                  );

                                  if (response.ok) {
                                    const data = await response.json();
                                    if (data.daysOverdue > 0) {
                                      toast.success(`📧 Relance envoyée à ${invoice.clientEmail} (${data.daysOverdue}j de retard)`);
                                    } else {
                                      toast.success(`📧 Facture renvoyée à ${invoice.clientEmail}`);
                                    }
                                    onRefresh();
                                  } else {
                                    toast.error("Erreur lors de l'envoi");
                                  }
                                } catch (error) {
                                  console.error("Error sending reminder:", error);
                                  toast.error("Erreur lors de l'envoi");
                                }
                              }}
                              variant="ghost"
                              size="sm"
                              className="text-orange-400 hover:bg-orange-400/10"
                              title={invoice.status === "overdue" ? "Relancer le client" : "Renvoyer la facture"}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowDeleteDialog(true);
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:bg-red-400/10"
                            title="Supprimer la facture"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Invoice Dialog */}
      <Dialog open={showNewInvoiceDialog} onOpenChange={setShowNewInvoiceDialog}>
        <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle facture</DialogTitle>
            <DialogDescription className="text-white/60">
              Générez une nouvelle facture pour un client
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white/80">Client *</Label>
              <Select
                value={newInvoiceData.clientId}
                onValueChange={(value) =>
                  setNewInvoiceData({ ...newInvoiceData, clientId: value })
                }
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1">
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                  {clients.length === 0 ? (
                    <SelectItem value="no-client" disabled>
                      Aucun client disponible
                    </SelectItem>
                  ) : (
                    clients.map((client: Client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {client.email}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white/80">Montant (€) *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={newInvoiceData.amount}
                onChange={(e) =>
                  setNewInvoiceData({ ...newInvoiceData, amount: e.target.value })
                }
                placeholder="5000"
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>

            <div>
              <Label className="text-white/80">Description</Label>
              <Textarea
                value={newInvoiceData.description}
                onChange={(e) =>
                  setNewInvoiceData({ ...newInvoiceData, description: e.target.value })
                }
                placeholder="Développement site web..."
                className="bg-white/5 border-white/10 text-white mt-1 min-h-[80px]"
              />
            </div>

            <div>
              <Label className="text-white/80">Date d'échéance *</Label>
              <Input
                type="date"
                value={newInvoiceData.dueDate}
                onChange={(e) =>
                  setNewInvoiceData({ ...newInvoiceData, dueDate: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>

            <div className="pt-2 text-xs text-white/40">
              Numéro généré automatiquement : {generateInvoiceNumber()}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={createInvoice}
                disabled={creatingInvoice || clients.length === 0}
                className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
              >
                {creatingInvoice ? "Création..." : "Créer la facture"}
              </Button>
              <Button
                onClick={() => setShowNewInvoiceDialog(false)}
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Detail Dialog */}
      {selectedInvoice && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>Facture #{selectedInvoice.number}</DialogTitle>
              <DialogDescription className="text-white/60">
                Consultez et gérez les détails de cette facture
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-white/60">Client</p>
                    <p className="font-medium">{selectedInvoice.clientName}</p>
                  </div>
                  <Badge className={getStatusColor(selectedInvoice.status)}>
                    {getStatusLabel(selectedInvoice.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-white/60">Montant</p>
                    <p className="text-xl text-[#00FFC2] font-bold">
                      {selectedInvoice.amount.toLocaleString()}€
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Date d'échéance</p>
                    <p className="font-medium">
                      {new Date(selectedInvoice.dueDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                {selectedInvoice.description && (
                  <div>
                    <p className="text-sm text-white/60 mb-1">Description</p>
                    <p className="text-sm">{selectedInvoice.description}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm text-white/60">Actions rapides</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedInvoice.status === "draft" && (
                    <Button
                      onClick={() => updateInvoiceStatus(selectedInvoice.id, "sent")}
                      disabled={updatingStatus}
                      className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
                    >
                      Marquer envoyée
                    </Button>
                  )}
                  {(selectedInvoice.status === "sent" || selectedInvoice.status === "overdue") && (
                    <Button
                      onClick={() => updateInvoiceStatus(selectedInvoice.id, "paid")}
                      disabled={updatingStatus}
                      className="bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Marquer payée
                    </Button>
                  )}
                </div>
              </div>

              {/* Invoice Generator */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <p className="text-sm text-white/60">Générer la facture</p>
                <InvoiceGenerator
                  invoice={{
                    number: selectedInvoice.number,
                    date: selectedInvoice.createdAt,
                    dueDate: selectedInvoice.dueDate,
                    clientName: selectedInvoice.clientName,
                    clientEmail: clients.find((c: Client) => c.id === selectedInvoice.clientId)?.email || "",
                    clientAddress: clients.find((c: Client) => c.id === selectedInvoice.clientId)?.company || "",
                    amount: selectedInvoice.amount,
                    description: selectedInvoice.description,
                    status: selectedInvoice.status,
                  }}
                  freelanceInfo={freelanceInfo}
                  onDownload={() => toast.success("Facture téléchargée")}
                />
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-white/40">
                Créée le {new Date(selectedInvoice.createdAt).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Invoice Dialog */}
      {selectedInvoice && (
        <InvoiceEditDialog
          invoice={selectedInvoice}
          clients={clients}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onRefresh={onRefresh}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedInvoice && (
        <DeleteConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDeleteInvoice}
          title="Supprimer la facture"
          description="Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible."
          itemName={`Facture ${selectedInvoice.number} - ${selectedInvoice.clientName} (${selectedInvoice.amount.toLocaleString()}€)`}
          warningMessage={
            selectedInvoice.status === "paid"
              ? "Cette facture est marquée comme payée. Sa suppression affectera le revenu du client."
              : selectedInvoice.convertedFromQuote
              ? "Cette facture provient d'un devis. Le devis sera réinitialisé au statut 'Accepté'."
              : undefined
          }
        />
      )}
    </motion.div>
  );
}

// Calendar View Component
import CalendarManagement from "../calendar/CalendarManagement";

function CalendarView({ bookings, leads, onRefresh, loading }: any) {
  console.log("📅 CalendarView - Leads:", leads?.length || 0, "Bookings:", bookings?.length || 0);
  return <CalendarManagement bookings={bookings} leads={leads} onRefresh=
{onRefresh} loading={loading} />;
}

// Seed Data View Component
function SeedDataView({ onRefresh }: { onRefresh: () => void }) {
  const [token, setToken] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [autoToken, setAutoToken] = useState(false);
  const [serverConnected, setServerConnected] = useState<boolean | null>(null);
  const supabase = createClient(projectId, publicAnonKey);

  // Automatically get token from current session
  useEffect(() => {
    const getSessionToken = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        setToken(session.access_token);
        setAutoToken(true);
      }
    };
    getSessionToken();
    
    // Auto-test connection on mount
    testServerConnection();
  }, []);

  // Test server connection
  const testServerConnection = async () => {
    setIsTesting(true);
    setServerConnected(null);
    
    try {
      console.log("🔍 Testing server connection...");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Server connected:", data);
        setServerConnected(true);
        toast.success("✅ Serveur connecté !");
      } else {
        console.error("❌ Server not responding:", response.status);
        setServerConnected(false);
        toast.error("❌ Serveur non disponible");
      }
    } catch (error) {
      console.error("❌ Connection error:", error);
      setServerConnected(false);
      toast.error("❌ Impossible de se connecter au serveur");
    } finally {
      setIsTesting(false);
    }
  };

  // Initialize demo data via server (if /seed-data route exists)
  const initializeDemoData = async () => {
    if (!token) {
      toast.error("Token d'accès requis");
      return;
    }

    setIsInitializing(true);
    try {
      console.log("🌱 Initializing demo data from server...");
      
      // Try to call /seed-data route
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/seed-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Demo data initialized:", data);
        toast.success("✅ Données de démo initialisées avec succès !");
        onRefresh();
      } else if (response.status === 404) {
        // Route doesn't exist, fall back to local seeding
        console.log("⚠️ /seed-data route not found, using local seeding...");
        toast.info("Route /seed-data non trouvée, création locale...");
        await createProjects();
      } else {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error: any) {
      console.error("❌ Error initializing data:", error);
      
      // Fallback to local seeding
      console.log("⚠️ Falling back to local project seeding...");
      toast.info("Utilisation de la création locale de projets...");
      await createProjects();
    } finally {
      setIsInitializing(false);
    }
  };

  const createProjects = async () => {
    if (!token) {
      toast.error("Token d'accès requis");
      return;
    }

    setIsCreating(true);
    try {
      console.log("🌱 Début du seeding depuis le Dashboard...");
      await seedTestProjects(token);
      toast.success("✅ 6 projets professionnels créés avec succès !");
      onRefresh();
    } catch (error: any) {
      console.error("❌ Error creating projects:", error);
      toast.error(`Erreur : ${error.message || "Échec de la création des projets"}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl text-white mb-2">🚀 Initialisation du Dashboard</h2>
        <p className="text-white/60">
          Testez la connexion au serveur et initialisez les données de démonstration
        </p>
      </div>

      {/* Server Connection Status */}
      <Card className={`border-2 ${
        serverConnected === true 
          ? "bg-green-500/5 border-green-500/30" 
          : serverConnected === false 
          ? "bg-red-500/5 border-red-500/30" 
          : "bg-white/5 border-[#00FFC2]/20"
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className={
              serverConnected === true 
                ? "text-green-400" 
                : serverConnected === false 
                ? "text-red-400" 
                : "text-[#00FFC2]"
            }>
              État du Serveur Supabase
            </span>
            <Button
              onClick={testServerConnection}
              disabled={isTesting}
              size="sm"
              variant="outline"
              className="border-[#00FFC2]/30 text-[#00FFC2] hover:bg-[#00FFC2]/10"
            >
              {isTesting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                  </motion.div>
                  Test en cours...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  🔍 Tester Connexion
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {serverConnected === null ? (
            <div className="flex items-center gap-2 text-white/60">
              <Clock className="h-5 w-5" />
              <span>En attente du test de connexion...</span>
            </div>
          ) : serverConnected ? (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <span>✅ Serveur connecté et opérationnel</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-400">
                <X className="h-5 w-5" />
                <span>❌ Serveur non disponible</span>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-xs text-white/60">
                  Le serveur Edge Function n'est pas déployé ou inaccessible.<br />
                  <strong className="text-red-400">Action requise :</strong> Déployez le serveur avec la commande :<br />
                  <code className="bg-black/30 px-2 py-1 rounded mt-1 inline-block text-[#00FFC2]">
                    supabase functions deploy make-server-04919ac5
                  </code>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Token Status */}
      <Card className="bg-white/5 border-[#00FFC2]/20">
        <CardHeader>
          <CardTitle className="text-[#00FFC2]">Authentification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {autoToken ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-400">
                <Check className="h-5 w-5" />
                <span>✅ Session active détectée</span>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2 text-yellow-400">
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">⚠️ Session non détectée</p>
                    <p className="text-xs text-white/60">
                      Assurez-vous d'être connecté au Dashboard
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-[#00FFC2]/5 to-[#00FFC2]/10 border-[#00FFC2]/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#00FFC2]" />
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={initializeDemoData}
            disabled={!token || isInitializing || serverConnected === false}
            className="w-full bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90 h-14 text-base"
          >
            {isInitializing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  ⚡
                </motion.div>
                Initialisation en cours...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                🌱 Initialiser les Données
              </>
            )}
          </Button>
          <p className="text-xs text-center text-white/50">
            Crée les leads, clients, projets et bookings de démonstration
          </p>
        </CardContent>
      </Card>

      {/* Projects Preview */}
      <Card className="bg-white/5 border-[#00FFC2]/20">
        <CardHeader>
          <CardTitle className="text-white">Projets de Test Inclus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { icon: "🛒", name: "Plateforme E-commerce Moderne", budget: "35 000€" },
              { icon: "📱", name: "Application Mobile Fitness", budget: "48 000€" },
              { icon: "📊", name: "Tableau de Bord SaaS Analytique", budget: "62 000€" },
              { icon: "🏢", name: "Site Vitrine Corporate", budget: "22 000€" },
              { icon: "🔌", name: "Plateforme API RESTful", budget: "75 000€" },
              { icon: "🎨", name: "Système de Design UI/UX", budget: "38 000€" },
            ].map((project, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{project.icon}</span>
                  <div>
                    <p className="text-white font-medium">{project.name}</p>
                    <p className="text-xs text-white/40">Bilingue FR + EN</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-[#00FFC2]/10 text-[#00FFC2]">
                  {project.budget}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-white/70">
              <p className="font-medium text-white mb-2">ℹ️ Informations</p>
              <ul className="space-y-1 text-xs">
                <li>• 6 projets professionnels bilingues (FR + EN)</li>
                <li>• Leads et clients de démonstration</li>
                <li>• Rendez-vous (bookings) de test</li>
                <li>• Données réalistes avec budgets et descriptions</li>
                <li>• Images Unsplash de haute qualité</li>
                <li>• Durée d'initialisation : ~10-15 secondes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
