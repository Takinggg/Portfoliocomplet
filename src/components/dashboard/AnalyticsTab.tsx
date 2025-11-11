import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  DollarSign,
  FileText,
  Calendar,
  Target,
  Activity,
  Zap,
  RefreshCw,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;
}

interface AnalyticsClient {
  id: string;
  name: string;
  email: string;
  revenue?: number;
  status?: string;
  createdAt: string;
}

interface AnalyticsProject {
  id: string;
  name?: string;
  name_fr?: string;
  name_en?: string;
  status: string;
  budget?: number;
  createdAt: string;
}

interface AnalyticsInvoice {
  id: string;
  amount?: number;
  total?: number;
  status: string;
  dueDate: string;
  createdAt: string;
}

interface AnalyticsQuote {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface AnalyticsTabProps {
  leads: Lead[];
  clients: AnalyticsClient[];
  projects: AnalyticsProject[];
  invoices: AnalyticsInvoice[];
  quotes: AnalyticsQuote[];
  onRefresh?: () => void;
  loading?: boolean;
}

export function AnalyticsTab({ leads, clients, projects, invoices, quotes, onRefresh, loading = false }: AnalyticsTabProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
        setLastRefresh(new Date());
        toast.success("Données actualisées avec succès !");
      } catch (error) {
        toast.error("Erreur lors de l'actualisation");
        console.error("Refresh error:", error);
      } finally {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  const formatLastRefresh = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastRefresh.getTime()) / 1000);
    
    if (diff < 60) return "À l'instant";
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
    return lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };
  // Calculer les KPIs
  const kpis = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Leads
    const recentLeads = leads.filter(l => new Date(l.createdAt) > thirtyDaysAgo);
    const previousLeads = leads.filter(l => {
      const date = new Date(l.createdAt);
      return date > sixtyDaysAgo && date <= thirtyDaysAgo;
    });
    const leadsGrowth = previousLeads.length > 0
      ? ((recentLeads.length - previousLeads.length) / previousLeads.length) * 100
      : recentLeads.length > 0 ? 100 : 0;

    // Clients
    const recentClients = clients.filter(c => new Date(c.createdAt) > thirtyDaysAgo);
    const previousClients = clients.filter(c => {
      const date = new Date(c.createdAt);
      return date > sixtyDaysAgo && date <= thirtyDaysAgo;
    });
    const clientsGrowth = previousClients.length > 0
      ? ((recentClients.length - previousClients.length) / previousClients.length) * 100
      : recentClients.length > 0 ? 100 : 0;

    // Revenus
    const totalRevenue = clients.reduce((sum, c) => sum + (c.revenue || 0), 0);
    const recentRevenue = clients
      .filter(c => new Date(c.createdAt) > thirtyDaysAgo)
      .reduce((sum, c) => sum + (c.revenue || 0), 0);
    const previousRevenue = clients
      .filter(c => {
        const date = new Date(c.createdAt);
        return date > sixtyDaysAgo && date <= thirtyDaysAgo;
      })
      .reduce((sum, c) => sum + (c.revenue || 0), 0);
    const revenueGrowth = previousRevenue > 0
      ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
      : recentRevenue > 0 ? 100 : 0;

    // Taux de conversion
    const convertedLeads = leads.filter(l => l.status === "converted").length;
    const conversionRate = leads.length > 0 ? (convertedLeads / leads.length) * 100 : 0;

    // Projets actifs
    const activeProjects = projects.filter(p => p.status === "active").length;

    // Factures en attente
    const pendingInvoices = invoices.filter(i => i.status === "pending" || i.status === "sent").length;
    const pendingAmount = invoices
      .filter(i => i.status === "pending" || i.status === "sent")
      .reduce((sum, i) => sum + i.amount, 0);

    return {
      leads: { total: leads.length, recent: recentLeads.length, growth: leadsGrowth },
      clients: { total: clients.length, recent: recentClients.length, growth: clientsGrowth },
      revenue: { total: totalRevenue, recent: recentRevenue, growth: revenueGrowth },
      conversion: conversionRate,
      activeProjects,
      pendingInvoices: { count: pendingInvoices, amount: pendingAmount },
    };
  }, [leads, clients, projects, invoices]);

  // Données pour le graphique d'évolution mensuelle
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentYear = new Date().getFullYear();
    
    const data = months.map((month, index) => {
      const monthLeads = leads.filter(l => {
        const date = new Date(l.createdAt);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      }).length;

      const monthClients = clients.filter(c => {
        const date = new Date(c.createdAt);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      }).length;

      const monthRevenue = clients
        .filter(c => {
          const date = new Date(c.createdAt);
          return date.getMonth() === index && date.getFullYear() === currentYear;
        })
        .reduce((sum, c) => sum + (c.revenue || 0), 0);

      return {
        month,
        leads: monthLeads,
        clients: monthClients,
        revenue: monthRevenue,
      };
    });

    return data;
  }, [leads, clients]);

  // Répartition des leads par source
  const leadsBySource = useMemo(() => {
    const sources = leads.reduce((acc, lead) => {
      const source = lead.source || 'Inconnu';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sources).map(([name, value]) => ({
      name,
      value,
    }));
  }, [leads]);

  // Répartition des statuts de leads
  const leadsByStatus = useMemo(() => {
    const statusMap: Record<string, string> = {
      new: 'Nouveau',
      contacted: 'Contacté',
      qualified: 'Qualifié',
      converted: 'Converti',
      lost: 'Perdu',
    };

    const statuses = leads.reduce((acc, lead) => {
      const status = statusMap[lead.status] || lead.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statuses).map(([name, value]) => ({
      name,
      value,
    }));
  }, [leads]);

  // Statut des factures
  const invoicesByStatus = useMemo(() => {
    const statusMap: Record<string, string> = {
      draft: 'Brouillon',
      sent: 'Envoyée',
      paid: 'Payée',
      overdue: 'En retard',
      cancelled: 'Annulée',
    };

    const statuses = invoices.reduce((acc, invoice) => {
      const status = statusMap[invoice.status] || invoice.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statuses).map(([name, value]) => ({
      name,
      value,
    }));
  }, [invoices]);

  const COLORS = ['#00FFC2', '#00D9A6', '#00B38A', '#008D6E', '#006752'];

  const KPICard = ({ 
    title, 
    value, 
    subtitle, 
    growth, 
    icon: Icon,
    color = "#00FFC2" 
  }: { 
    title: string; 
    value: string | number; 
    subtitle: string; 
    growth?: number; 
    icon: any;
    color?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white/5 border-white/10 hover:bg-white/[0.07] transition-all">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-white/60 mb-2">{title}</p>
              <motion.p 
                className="text-3xl text-white mb-1"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                {value}
              </motion.p>
              <p className="text-xs text-white/40">{subtitle}</p>
              {growth !== undefined && (
                <div className="flex items-center gap-1 mt-2">
                  {growth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-[#00FFC2]" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                  <span className={growth >= 0 ? "text-[#00FFC2] text-sm" : "text-red-400 text-sm"}>
                    {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                  </span>
                  <span className="text-white/40 text-xs ml-1">vs 30j précédents</span>
                </div>
              )}
            </div>
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${color}10` }}
            >
              <Icon className="h-6 w-6" style={{ color }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header avec bouton Actualiser */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2"
      >
        <div>
          <h2 className="text-2xl text-white mb-1">Analytics & Reporting</h2>
          <p className="text-sm text-white/60">
            {isRefreshing ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-[#00FFC2] rounded-full animate-pulse" />
                Actualisation des données en cours...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Vue d'ensemble de votre activité
                <span className="text-white/40">•</span>
                <span className="text-[#00FFC2]/80">Mis à jour {formatLastRefresh()}</span>
              </span>
            )}
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="bg-white/5 border border-white/10 text-white hover:bg-[#00FFC2]/10 hover:border-[#00FFC2]/40 hover:text-[#00FFC2] transition-all w-full sm:w-auto group"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 transition-transform group-hover:rotate-180 duration-500 ${isRefreshing || loading ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualisation...' : 'Actualiser'}
          </Button>
        </motion.div>
      </motion.div>

      {/* KPIs Grid */}
      <motion.div 
        key={lastRefresh.getTime()}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <KPICard
          title="Total Leads"
          value={kpis.leads.total}
          subtitle={`${kpis.leads.recent} ce mois-ci`}
          growth={kpis.leads.growth}
          icon={Users}
          color="#00FFC2"
        />
        <KPICard
          title="Clients Actifs"
          value={kpis.clients.total}
          subtitle={`${kpis.clients.recent} nouveaux ce mois`}
          growth={kpis.clients.growth}
          icon={Target}
          color="#00D9A6"
        />
        <KPICard
          title="Revenus Totaux"
          value={`${kpis.revenue.total.toLocaleString('fr-FR')} €`}
          subtitle={`${kpis.revenue.recent.toLocaleString('fr-FR')} € ce mois`}
          growth={kpis.revenue.growth}
          icon={DollarSign}
          color="#00B38A"
        />
        <KPICard
          title="Taux de Conversion"
          value={`${kpis.conversion.toFixed(1)}%`}
          subtitle={`${leads.filter(l => l.status === "converted").length} leads convertis`}
          icon={Zap}
          color="#008D6E"
        />
      </motion.div>

      {/* Statistiques secondaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">Projets Actifs</p>
                <p className="text-2xl text-white">{kpis.activeProjects}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">Factures en Attente</p>
                <p className="text-2xl text-white">{kpis.pendingInvoices.count}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">Montant en Attente</p>
                <p className="text-2xl text-white">{kpis.pendingInvoices.amount.toLocaleString('fr-FR')} €</p>
              </div>
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution mensuelle */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#00FFC2]" />
              Évolution Mensuelle (2025)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FFC2" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00FFC2" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D9A6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D9A6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff40" />
                <YAxis stroke="#ffffff40" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #ffffff20',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#00FFC2"
                  fillOpacity={1}
                  fill="url(#colorLeads)"
                  name="Leads"
                />
                <Area
                  type="monotone"
                  dataKey="clients"
                  stroke="#00D9A6"
                  fillOpacity={1}
                  fill="url(#colorClients)"
                  name="Clients"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenus mensuels */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#00FFC2]" />
              Revenus Mensuels (€)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff40" />
                <YAxis stroke="#ffffff40" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #ffffff20',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="revenue" fill="#00FFC2" radius={[8, 8, 0, 0]} name="Revenus" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques circulaires */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads par source */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-base">Leads par Source</CardTitle>
          </CardHeader>
          <CardContent>
            {leadsBySource.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={leadsBySource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadsBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #ffffff20',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-white/40">
                Aucune donnée
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leads par statut */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-base">Leads par Statut</CardTitle>
          </CardHeader>
          <CardContent>
            {leadsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={leadsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #ffffff20',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-white/40">
                Aucune donnée
              </div>
            )}
          </CardContent>
        </Card>

        {/* Factures par statut */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-base">Factures par Statut</CardTitle>
          </CardHeader>
          <CardContent>
            {invoicesByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={invoicesByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {invoicesByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #ffffff20',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-white/40">
                Aucune donnée
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top clients par revenus */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-[#00FFC2]" />
            Top 5 Clients par Revenus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {clients
              .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
              .slice(0, 5)
              .map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#00FFC2]/10 rounded-full flex items-center justify-center">
                      <span className="text-[#00FFC2]">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-white">{client.name}</p>
                      <p className="text-sm text-white/60">{client.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#00FFC2]">{(client.revenue || 0).toLocaleString('fr-FR')} €</p>
                    <Badge className="bg-white/5 text-white/60 border-0 mt-1">
                      {client.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            {clients.length === 0 && (
              <div className="text-center text-white/40 py-8">
                Aucun client pour le moment
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
