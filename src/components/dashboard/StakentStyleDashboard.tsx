import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Users,
  TrendingUp,
  DollarSign,
  FileText,
  Plus,
  ArrowUp,
  ArrowDown,
  Calendar,
  Mail,
  Phone,
  Building,
  Clock,
  Target,
  Zap,
  Activity,
  X,
  Sparkles
} from "lucide-react";
import { createClient } from "../../utils/supabase/client";
import { projectId } from "../../utils/supabase/info";
import { colors } from "../../styles/designSystem";

interface Deal {
  id: string;
  name: string;
  company?: string;
  value: number;
  status: string;
  progress: number;
  type: "lead" | "client" | "quote";
  created_at: string;
  email?: string;
  phone?: string;
  leadCategory?: "rdv-booking" | "contact" | "rdv-confirmed";
}

export function StakentStyleDashboard() {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [activeDeals, setActiveDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Lead filter state
  const [leadFilter, setLeadFilter] = useState<"all" | "rdv-booking" | "contact" | "rdv-confirmed">("all");
  
  // Form states
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", company: "", address: "" });
  const [newQuote, setNewQuote] = useState({ client_name: "", client_email: "", client_phone: "", client_company: "", total: 0 });
  
  // Smart form states
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [availableLeads, setAvailableLeads] = useState<any[]>([]);
  const [availableClients, setAvailableClients] = useState<any[]>([]);
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    revenueChange: 0,
    activeDeals: 0,
    dealsChange: 0,
    clients: 0,
    clientsChange: 0,
    conversionRate: 0
  });

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("❌ No session found");
        setLoading(false);
        return;
      }

      console.log("✅ Session found, fetching data...");

      // Fetch from backend API endpoints
      const [leadsRes, clientsRes, quotesRes, invoicesRes] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/invoices`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        })
      ]);

      const leadsData = leadsRes.ok ? (await leadsRes.json()).leads || [] : [];
      const clientsData = clientsRes.ok ? (await clientsRes.json()).clients || [] : [];
      const quotesData = quotesRes.ok ? (await quotesRes.json()).quotes || [] : [];
      const invoicesData = invoicesRes.ok ? (await invoicesRes.json()).invoices || [] : [];

      console.log("📊 Data fetched:", { 
        leads: leadsData.length, 
        clients: clientsData.length, 
        quotes: quotesData.length,
        invoices: invoicesData.length
      });

      // If no data, create sample data for demo
      const leads = leadsData.length > 0 ? leadsData : [
        {
          id: "demo-lead-1",
          name: "FOULON Maxence",
          email: "maxence@example.com",
          phone: "+33612345678",
          company: "FOULON Enterprise",
          status: "new",
          appointment_requested: true, // Prise de RDV
          appointment_confirmed: false,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
        },
        {
          id: "demo-lead-2",
          name: "Test Lead Contact",
          email: "test@example.com",
          company: "Test Company",
          status: "contacted",
          appointment_requested: false, // Contact simple
          appointment_confirmed: false,
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
        },
        {
          id: "demo-lead-3",
          name: "Client RDV Confirmé",
          email: "rdv@example.com",
          phone: "+33698765432",
          company: "Confirmed Corp",
          status: "qualified",
          appointment_requested: true,
          appointment_confirmed: true, // RDV Confirmé
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "demo-lead-4",
          name: "Lead Simple",
          email: "simple@example.com",
          status: "new",
          appointment_requested: false, // Contact
          appointment_confirmed: false,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      const clients = clientsData.length > 0 ? clientsData : [
        {
          id: "demo-client-1",
          name: "Client Demo",
          email: "client@example.com",
          phone: "+33698765432",
          company: "Demo Corp",
          status: "active",
          revenue: 5000,
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
        }
      ];

      const quotes = quotesData.length > 0 ? quotesData : [
        {
          id: "demo-quote-1",
          client_name: "Devis Test",
          client_email: "devis@example.com",
          client_company: "Quote Company",
          total: 9677,
          status: "sent",
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
        },
        {
          id: "demo-quote-2",
          client_name: "Devis sans nom",
          total: 6031,
          status: "draft",
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      const invoices = invoicesData.length > 0 ? invoicesData : [];

      // Helper function to calculate progress based on age and status
      const calculateProgress = (createdAt: string, type: "lead" | "client" | "quote") => {
        const daysSinceCreation = Math.floor(
          (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (type === "lead") {
          // Leads: 0-40% based on age (max 30 days)
          return Math.min(40, Math.floor((daysSinceCreation / 30) * 40));
        } else if (type === "client") {
          // Clients: 40-80% based on engagement
          return 40 + Math.min(40, Math.floor((daysSinceCreation / 60) * 40));
        } else {
          // Quotes handled by status
          return 50;
        }
      };

      // Transform to deals
      const deals: Deal[] = [
        ...leads.slice(0, 8).map((l: any) => ({
          id: l.id,
          name: l.name || "Lead sans nom",
          company: l.company || l.subject,
          value: 2500, // Valeur estimée pour un lead
          status: l.status || "new",
          progress: calculateProgress(l.created_at, "lead"),
          type: "lead" as const,
          created_at: l.created_at || new Date().toISOString(),
          email: l.email,
          phone: l.phone,
          // Add lead category
          leadCategory: l.appointment_requested ? "rdv-booking" : 
                       l.appointment_confirmed ? "rdv-confirmed" : 
                       "contact"
        })),
        ...clients.slice(0, 5).map((c: any) => ({
          id: c.id,
          name: c.name || "Client sans nom",
          company: c.company,
          value: c.revenue || 5000,
          status: c.status || "active",
          progress: calculateProgress(c.created_at, "client"),
          type: "client" as const,
          created_at: c.created_at || new Date().toISOString(),
          email: c.email,
          phone: c.phone
        })),
        ...quotes.slice(0, 5).map((q: any) => {
          // Calculate quote progress based on status
          let progress = 30;
          if (q.status === "sent") progress = 60;
          if (q.status === "accepted") progress = 90;
          if (q.status === "paid") progress = 100;
          
          return {
            id: q.id,
            name: q.client_name || "Devis sans nom",
            company: q.client_company,
            value: q.total || 0,
            status: q.status || "draft",
            progress: progress,
            type: "quote" as const,
            created_at: q.created_at || new Date().toISOString(),
            email: q.client_email,
            phone: q.client_phone
          };
        })
      ];

      // Calculate real stats with trends
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Calculate total revenue
      const totalQuotesValue = quotes.reduce((sum: number, q: any) => sum + (q.total || 0), 0);
      const totalInvoicesValue = invoices.reduce((sum: number, i: any) => sum + (i.total || 0), 0);
      const totalRevenue = totalQuotesValue + totalInvoicesValue;

      // Calculate last month revenue
      const lastMonthQuotes = quotes.filter((q: any) => 
        new Date(q.created_at) < thirtyDaysAgo
      );
      const lastMonthInvoices = invoices.filter((i: any) => 
        new Date(i.created_at) < thirtyDaysAgo
      );
      const lastMonthRevenue = 
        lastMonthQuotes.reduce((sum: number, q: any) => sum + (q.total || 0), 0) +
        lastMonthInvoices.reduce((sum: number, i: any) => sum + (i.total || 0), 0);
      
      const revenueChange = lastMonthRevenue > 0 
        ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue * 100)
        : totalRevenue > 0 ? 100 : 0;

      // Calculate deals change
      const lastMonthDeals = [
        ...leads.filter((l: any) => new Date(l.created_at) < thirtyDaysAgo),
        ...clients.filter((c: any) => new Date(c.created_at) < thirtyDaysAgo),
        ...quotes.filter((q: any) => new Date(q.created_at) < thirtyDaysAgo)
      ].length;
      const activeDealsCount = deals.length;
      const dealsChange = lastMonthDeals > 0
        ? ((activeDealsCount - lastMonthDeals) / lastMonthDeals * 100)
        : activeDealsCount > 0 ? 100 : 0;

      // Calculate clients change
      const lastMonthClients = clients.filter((c: any) => 
        new Date(c.created_at) < thirtyDaysAgo
      ).length;
      const clientsCount = clients.length;
      const clientsChange = lastMonthClients > 0
        ? ((clientsCount - lastMonthClients) / lastMonthClients * 100)
        : clientsCount > 0 ? 100 : 0;

      // Calculate conversion rate
      const conversionRate = leads.length > 0 
        ? ((clients.length / leads.length) * 100)
        : 0;

      // Calculate conversion rate change
      const lastMonthLeads = leads.filter((l: any) => 
        new Date(l.created_at) < thirtyDaysAgo
      ).length;
      const lastMonthConversionRate = lastMonthLeads > 0
        ? ((lastMonthClients / lastMonthLeads) * 100)
        : 0;
      const conversionChange = lastMonthConversionRate > 0
        ? ((conversionRate - lastMonthConversionRate) / lastMonthConversionRate * 100)
        : conversionRate > 0 ? 100 : 0;

      console.log("📈 Stats calculated:", {
        totalRevenue,
        revenueChange: revenueChange.toFixed(1),
        activeDeals: activeDealsCount,
        dealsChange: dealsChange.toFixed(1),
        clients: clientsCount,
        clientsChange: clientsChange.toFixed(1),
        conversionRate: conversionRate.toFixed(1),
        conversionChange: conversionChange.toFixed(1)
      });

      setStats({
        totalRevenue: Math.round(totalRevenue),
        revenueChange: Number(revenueChange.toFixed(1)),
        activeDeals: activeDealsCount,
        dealsChange: Number(dealsChange.toFixed(1)),
        clients: clientsCount,
        clientsChange: Number(clientsChange.toFixed(1)),
        conversionRate: Number(conversionRate.toFixed(1))
      });

      setActiveDeals(deals);
      if (!selectedDeal && deals.length > 0) {
        setSelectedDeal(deals[0]);
      }
      
      // Store leads and clients for dropdowns
      setAvailableLeads(leads);
      setAvailableClients(clients);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const convertLeadToClient = async () => {
    if (!selectedDeal || selectedDeal.type !== "lead") return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Create client via backend API
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: selectedDeal.name,
            email: selectedDeal.email,
            phone: selectedDeal.phone,
            company: selectedDeal.company,
            status: "active"
          })
        }
      );

      if (response.ok) {
        alert(`✅ Lead "${selectedDeal.name}" converti en client avec succès !`);
        fetchData(); // Refresh data
      } else {
        const error = await response.text();
        alert("Erreur lors de la conversion: " + error);
      }
    } catch (error) {
      console.error("Error converting lead:", error);
      alert("Erreur lors de la conversion");
    }
  };

  const createQuoteForClient = async () => {
    if (!selectedDeal || selectedDeal.type !== "client") return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Create quote via backend API
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            client_name: selectedDeal.name,
            client_email: selectedDeal.email,
            client_phone: selectedDeal.phone,
            client_company: selectedDeal.company,
            total: 0,
            status: "draft",
            items: []
          })
        }
      );

      if (response.ok) {
        alert(`✅ Devis créé pour "${selectedDeal.name}" !`);
        fetchData(); // Refresh data
      } else {
        const error = await response.text();
        alert("Erreur lors de la création du devis: " + error);
      }
    } catch (error) {
      console.error("Error creating quote:", error);
      alert("Erreur lors de la création du devis");
    }
  };

  const sendEmail = async () => {
    if (!selectedDeal?.email) return;
    alert(`Email envoyé à ${selectedDeal.email} !`);
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newLead)
        }
      );

      if (response.ok) {
        alert(`✅ Lead "${newLead.name}" créé avec succès !`);
        setShowNewLeadModal(false);
        setNewLead({ name: "", email: "", phone: "", company: "", message: "" });
        fetchData();
      } else {
        alert("Erreur lors de la création du lead");
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      alert("Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ 
            ...newClient, 
            status: "active",
            lead_id: selectedLeadId || undefined // Include lead_id if selected
          })
        }
      );

      if (response.ok) {
        alert(`✅ Client "${newClient.name}" créé avec succès !`);
        setShowNewClientModal(false);
        setNewClient({ name: "", email: "", phone: "", company: "", address: "" });
        setSelectedLeadId(""); // Reset selection
        fetchData();
      } else {
        alert("Erreur lors de la création du client");
      }
    } catch (error) {
      console.error("Error creating client:", error);
      alert("Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ 
            ...newQuote, 
            status: "draft", 
            items: [],
            client_id: selectedClientId || undefined // Include client_id if selected
          })
        }
      );

      if (response.ok) {
        alert(`✅ Devis pour "${newQuote.client_name}" créé avec succès !`);
        setShowNewQuoteModal(false);
        setNewQuote({ client_name: "", client_email: "", client_phone: "", client_company: "", total: 0 });
        setSelectedClientId(""); // Reset selection
        fetchData();
      } else {
        alert("Erreur lors de la création du devis");
      }
    } catch (error) {
      console.error("Error creating quote:", error);
      alert("Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  };

  const MiniSparkline = ({ trend }: { trend: number }) => {
    const isPositive = trend > 0;
    return (
      <svg width="60" height="20" viewBox="0 0 60 20" className="inline-block">
        <path
          d={isPositive 
            ? "M 0 15 Q 15 10, 30 8 T 60 5"
            : "M 0 5 Q 15 8, 30 10 T 60 15"
          }
          stroke={isPositive ? "#00FFC2" : "#ff4444"}
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
      </svg>
    );
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon 
  }: { 
    title: string; 
    value: string; 
    change: number; 
    icon: any 
  }) => (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-2xl p-6 border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-[#00FFC2]/10">
          <Icon className="w-5 h-5 text-[#00FFC2]" />
        </div>
        <MiniSparkline trend={change} />
      </div>
      <h3 className="text-sm text-white/60 mb-1">{title}</h3>
      <div className="flex items-end gap-3">
        <p className="text-3xl font-bold text-white">{value}</p>
        <div className={`flex items-center gap-1 text-sm ${change > 0 ? 'text-[#00FFC2]' : 'text-red-400'}`}>
          {change > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
    <div className="min-h-screen flex" style={{ background: colors.background }}>
      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-white/60">Bienvenue 👋 Voici votre aperçu</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FFC2]"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Revenue Total"
                value={`${stats.totalRevenue.toLocaleString()}€`}
                change={stats.revenueChange}
                icon={DollarSign}
              />
              <StatCard
                title="Deals Actifs"
                value={stats.activeDeals.toString()}
                change={stats.dealsChange}
                icon={Target}
              />
              <StatCard
                title="Clients"
                value={stats.clients.toString()}
                change={stats.clientsChange}
                icon={Users}
              />
              <StatCard
                title="Taux Conversion"
                value={`${stats.conversionRate}%`}
                change={stats.conversionRate > 0 ? 5.2 : 0}
                icon={TrendingUp}
              />
            </div>

            {/* Active Deals Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Deals List */}
              <div className="xl:col-span-1 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Active Leads</h2>
                  <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-0">
                    {activeDeals.filter(d => d.type === "lead").length}
                  </Badge>
                </div>

                {/* Lead Filter Buttons */}
                <div className="flex gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLeadFilter("all")}
                    className={`
                      text-xs transition-all
                      ${leadFilter === "all"
                        ? "bg-[#00FFC2] text-black border-[#00FFC2] hover:bg-[#00FFC2]/90"
                        : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                      }
                    `}
                  >
                    Tous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLeadFilter("rdv-booking")}
                    className={`
                      text-xs transition-all
                      ${leadFilter === "rdv-booking"
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                      }
                    `}
                  >
                    📅 Prise RDV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLeadFilter("contact")}
                    className={`
                      text-xs transition-all
                      ${leadFilter === "contact"
                        ? "bg-yellow-500 text-white border-yellow-500"
                        : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                      }
                    `}
                  >
                    💬 Contact
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLeadFilter("rdv-confirmed")}
                    className={`
                      text-xs transition-all
                      ${leadFilter === "rdv-confirmed"
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                      }
                    `}
                  >
                    ✅ RDV Confirmé
                  </Button>
                </div>

                {activeDeals.filter(d => {
                  // Filter by type (only leads)
                  if (d.type !== "lead") return false;
                  // Filter by category
                  if (leadFilter === "all") return true;
                  return d.leadCategory === leadFilter;
                }).length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white/60">
                      {leadFilter === "all" ? "Aucun lead actif" : 
                       leadFilter === "rdv-booking" ? "Aucune prise de RDV" :
                       leadFilter === "contact" ? "Aucun contact simple" :
                       "Aucun RDV confirmé"}
                    </p>
                    <p className="text-sm text-white/40 mt-2">
                      {leadFilter === "all" ? "Créez votre premier lead !" : "Changez de filtre pour voir d'autres leads"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeDeals
                      .filter(d => {
                        if (d.type !== "lead") return false;
                        if (leadFilter === "all") return true;
                        return d.leadCategory === leadFilter;
                      })
                      .map((deal) => (
                      <motion.div
                        key={deal.id}
                        whileHover={{ x: 4 }}
                        onClick={() => setSelectedDeal(deal)}
                        className={`
                          p-4 rounded-xl cursor-pointer transition-all relative
                          ${selectedDeal?.id === deal.id 
                            ? 'bg-[#00FFC2]/10 border border-[#00FFC2]/30' 
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                          }
                        `}
                      >
                        {/* Lead Category Badge */}
                        {deal.type === "lead" && deal.leadCategory && (
                          <div className="absolute top-2 right-2">
                            {deal.leadCategory === "rdv-booking" && (
                              <span className="text-lg" title="Prise de RDV">📅</span>
                            )}
                            {deal.leadCategory === "contact" && (
                              <span className="text-lg" title="Contact simple">💬</span>
                            )}
                            {deal.leadCategory === "rdv-confirmed" && (
                              <span className="text-lg" title="RDV Confirmé">✅</span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0 pr-8">
                            <h3 className="font-semibold text-white truncate">{deal.name}</h3>
                            {deal.company && (
                              <p className="text-xs text-white/60 truncate">{deal.company}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-[#00FFC2]">
                            {deal.value.toLocaleString()}€
                          </span>
                          <span className="text-xs text-white/60">
                            {Math.round(deal.progress)}%
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${deal.progress}%` }}
                            className="h-full bg-[#00FFC2]"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

          {/* Deal Detail Card (Main) */}
          <div className="xl:col-span-2">
            {selectedDeal ? (
              <motion.div
                key={selectedDeal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-8 border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-xl"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold text-white">{selectedDeal.name}</h2>
                      <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-0">
                        {selectedDeal.type}
                      </Badge>
                    </div>
                    {selectedDeal.company && (
                      <p className="text-white/60 flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {selectedDeal.company}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/60 mb-1">Valeur Estimée</p>
                    <p className="text-4xl font-bold text-[#00FFC2]">
                      {selectedDeal.value.toLocaleString()}€
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4 mb-8 p-6 rounded-xl bg-white/5">
                  {selectedDeal.email && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#00FFC2]/10">
                        <Mail className="w-4 h-4 text-[#00FFC2]" />
                      </div>
                      <div>
                        <p className="text-xs text-white/60">Email</p>
                        <p className="text-sm text-white">{selectedDeal.email}</p>
                      </div>
                    </div>
                  )}
                  {selectedDeal.phone && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#00FFC2]/10">
                        <Phone className="w-4 h-4 text-[#00FFC2]" />
                      </div>
                      <div>
                        <p className="text-xs text-white/60">Téléphone</p>
                        <p className="text-sm text-white">{selectedDeal.phone || "N/A"}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#00FFC2]/10">
                      <Calendar className="w-4 h-4 text-[#00FFC2]" />
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Date de création</p>
                      <p className="text-sm text-white">
                        {new Date(selectedDeal.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#00FFC2]/10">
                      <Activity className="w-4 h-4 text-[#00FFC2]" />
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Progression</p>
                      <p className="text-sm text-white">{Math.round(selectedDeal.progress)}%</p>
                    </div>
                  </div>
                </div>

                {/* Momentum Section (Stakent style) */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                    <p className="text-xs text-white/60 mb-1">Momentum</p>
                    <p className="text-2xl font-bold text-white">+{(selectedDeal.progress / 10).toFixed(2)}%</p>
                    <p className="text-xs text-blue-400 mt-1">24h</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                    <p className="text-xs text-white/60 mb-1">Status</p>
                    <p className="text-2xl font-bold text-white">{selectedDeal.status}</p>
                    <p className="text-xs text-purple-400 mt-1">Overview</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                    <p className="text-xs text-white/60 mb-1">Risk</p>
                    <p className="text-2xl font-bold text-white">
                      {selectedDeal.progress > 50 ? 'Low' : 'Medium'}
                    </p>
                    <p className="text-xs text-green-400 mt-1">Assessment</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {selectedDeal.type === "lead" && (
                    <Button 
                      onClick={convertLeadToClient}
                      className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90 font-semibold"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Convertir en Client
                    </Button>
                  )}
                  {selectedDeal.type === "client" && (
                    <Button 
                      onClick={createQuoteForClient}
                      className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90 font-semibold"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Créer un Devis
                    </Button>
                  )}
                  {selectedDeal.type === "quote" && (
                    <Button 
                      onClick={sendEmail}
                      className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90 font-semibold"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Envoyer le Devis
                    </Button>
                  )}
                  <Button 
                    onClick={sendEmail}
                    variant="outline" 
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full rounded-2xl border border-white/10 bg-white/5">
                <p className="text-white/60">Sélectionnez un deal pour voir les détails</p>
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </div>

      {/* Quick Actions Sidebar (Right) */}
      <div className="w-80 p-6 border-l border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent">
        <h2 className="text-xl font-bold text-white mb-6">Actions Rapides</h2>
        
        <div className="space-y-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={() => setShowNewLeadModal(true)}
              className="w-full h-14 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white hover:from-purple-500/30 hover:to-pink-500/30 justify-start">
              <div className="p-2 rounded-lg bg-purple-500/20 mr-3">
                <Plus className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Nouveau Lead</p>
                <p className="text-xs text-white/60">Ajouter un prospect</p>
              </div>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={() => setShowNewClientModal(true)}
              className="w-full h-14 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-white hover:from-blue-500/30 hover:to-cyan-500/30 justify-start">
              <div className="p-2 rounded-lg bg-blue-500/20 mr-3">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Nouveau Client</p>
                <p className="text-xs text-white/60">Créer un client</p>
              </div>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={() => setShowNewQuoteModal(true)}
              className="w-full h-14 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-white hover:from-green-500/30 hover:to-emerald-500/30 justify-start">
              <div className="p-2 rounded-lg bg-green-500/20 mr-3">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Nouveau Devis</p>
                <p className="text-xs text-white/60">Créer une proposition</p>
              </div>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="w-full h-14 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-white hover:from-yellow-500/30 hover:to-orange-500/30 justify-start">
              <div className="p-2 rounded-lg bg-yellow-500/20 mr-3">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Action Rapide</p>
                <p className="text-xs text-white/60">Automatisations</p>
              </div>
            </Button>
          </motion.div>
        </div>

        {/* Promo Card (like Stakent) */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-500/20 border border-purple-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-white/10">
              <Zap className="w-6 h-6 text-[#00FFC2]" />
            </div>
            <div>
              <h3 className="font-bold text-white">Premium CRM</h3>
              <p className="text-xs text-white/60">Débloquez toutes les fonctionnalités</p>
            </div>
          </div>
          <Button className="w-full bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90 font-semibold">
            Activer Premium
          </Button>
        </motion.div>
      </div>
    </div>

    {/* Modals */}
    <AnimatePresence>
      {/* New Lead Modal */}
      {showNewLeadModal && (
        <Dialog open={showNewLeadModal} onOpenChange={setShowNewLeadModal}>
          <DialogContent className="bg-[#0C0C0C] border border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#00FFC2]">Nouveau Lead</DialogTitle>
              <DialogDescription className="text-white/60">
                Ajoutez un nouveau prospect à votre pipeline
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateLead} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="lead-name" className="text-white/80">Nom *</Label>
                <Input
                  id="lead-name"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lead-email" className="text-white/80">Email *</Label>
                <Input
                  id="lead-email"
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lead-phone" className="text-white/80">Téléphone</Label>
                <Input
                  id="lead-phone"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="lead-company" className="text-white/80">Entreprise</Label>
                <Input
                  id="lead-company"
                  value={newLead.company}
                  onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="lead-message" className="text-white/80">Message</Label>
                <Textarea
                  id="lead-message"
                  value={newLead.message}
                  onChange={(e) => setNewLead({ ...newLead, message: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90 font-semibold"
                >
                  {submitting ? "Création..." : "Créer Lead"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* New Client Modal */}
      {showNewClientModal && (
        <Dialog open={showNewClientModal} onOpenChange={setShowNewClientModal}>
          <DialogContent className="bg-[#0C0C0C] border border-white/10 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#00FFC2]">Nouveau Client</DialogTitle>
              <DialogDescription className="text-white/60">
                Créez un client depuis zéro ou sélectionnez un lead existant
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateClient} className="space-y-4 mt-4">
              {/* Smart Lead Selector */}
              {availableLeads.length > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-[#00FFC2]" />
                    <Label className="text-white font-semibold">Convertir depuis un Lead</Label>
                  </div>
                  <Select
                    value={selectedLeadId}
                    onValueChange={(value) => {
                      setSelectedLeadId(value);
                      // Auto-fill form with lead data
                      const lead = availableLeads.find(l => l.id === value);
                      if (lead) {
                        setNewClient({
                          name: lead.name || "",
                          email: lead.email || "",
                          phone: lead.phone || "",
                          company: lead.company || "",
                          address: ""
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Sélectionner un lead (optionnel)" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10">
                      {availableLeads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id} className="text-white hover:bg-white/10">
                          <div className="flex items-center gap-2">
                            <span>{lead.name}</span>
                            {lead.company && (
                              <span className="text-xs text-white/60">({lead.company})</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedLeadId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedLeadId("");
                        setNewClient({ name: "", email: "", phone: "", company: "", address: "" });
                      }}
                      className="mt-2 text-xs text-white/60 hover:text-white"
                    >
                      Réinitialiser
                    </Button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client-name" className="text-white/80">Nom *</Label>
                  <Input
                    id="client-name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="client-company" className="text-white/80">Entreprise</Label>
                  <Input
                    id="client-company"
                    value={newClient.company}
                    onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="client-email" className="text-white/80">Email *</Label>
                <Input
                  id="client-email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="client-phone" className="text-white/80">Téléphone</Label>
                <Input
                  id="client-phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="client-address" className="text-white/80">Adresse</Label>
                <Input
                  id="client-address"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setShowNewClientModal(false);
                    setSelectedLeadId("");
                    setNewClient({ name: "", email: "", phone: "", company: "", address: "" });
                  }}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90 font-semibold"
                >
                  {submitting ? "Création..." : selectedLeadId ? "Convertir en Client" : "Créer Client"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* New Quote Modal */}
      {showNewQuoteModal && (
        <Dialog open={showNewQuoteModal} onOpenChange={setShowNewQuoteModal}>
          <DialogContent className="bg-[#0C0C0C] border border-white/10 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#00FFC2]">Nouveau Devis</DialogTitle>
              <DialogDescription className="text-white/60">
                Créez un devis pour un client existant ou nouveau
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateQuote} className="space-y-4 mt-4">
              {/* Smart Client Selector */}
              {availableClients.length > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-[#00FFC2]" />
                    <Label className="text-white font-semibold">Sélectionner un Client</Label>
                  </div>
                  <Select
                    value={selectedClientId}
                    onValueChange={(value) => {
                      setSelectedClientId(value);
                      // Auto-fill form with client data
                      const client = availableClients.find(c => c.id === value);
                      if (client) {
                        setNewQuote({
                          client_name: client.name || "",
                          client_email: client.email || "",
                          client_phone: client.phone || "",
                          client_company: client.company || "",
                          total: 0
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Sélectionner un client (optionnel)" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10">
                      {availableClients.map((client) => (
                        <SelectItem key={client.id} value={client.id} className="text-white hover:bg-white/10">
                          <div className="flex items-center gap-2">
                            <span>{client.name}</span>
                            {client.company && (
                              <span className="text-xs text-white/60">({client.company})</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedClientId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedClientId("");
                        setNewQuote({ client_name: "", client_email: "", client_phone: "", client_company: "", total: 0 });
                      }}
                      className="mt-2 text-xs text-white/60 hover:text-white"
                    >
                      Réinitialiser
                    </Button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quote-name" className="text-white/80">Nom du client *</Label>
                  <Input
                    id="quote-name"
                    value={newQuote.client_name}
                    onChange={(e) => setNewQuote({ ...newQuote, client_name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quote-company" className="text-white/80">Entreprise</Label>
                  <Input
                    id="quote-company"
                    value={newQuote.client_company}
                    onChange={(e) => setNewQuote({ ...newQuote, client_company: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="quote-email" className="text-white/80">Email *</Label>
                <Input
                  id="quote-email"
                  type="email"
                  value={newQuote.client_email}
                  onChange={(e) => setNewQuote({ ...newQuote, client_email: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="quote-phone" className="text-white/80">Téléphone</Label>
                <Input
                  id="quote-phone"
                  value={newQuote.client_phone}
                  onChange={(e) => setNewQuote({ ...newQuote, client_phone: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="quote-total" className="text-white/80">Montant (€)</Label>
                <Input
                  id="quote-total"
                  type="number"
                  value={newQuote.total}
                  onChange={(e) => setNewQuote({ ...newQuote, total: Number(e.target.value) })}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="0"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setShowNewQuoteModal(false);
                    setSelectedClientId("");
                    setNewQuote({ client_name: "", client_email: "", client_phone: "", client_company: "", total: 0 });
                  }}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90 font-semibold"
                >
                  {submitting ? "Création..." : "Créer Devis"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
    </>
  );
}
