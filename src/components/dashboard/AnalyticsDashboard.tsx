import { useMemo } from "react";
import { motion } from "motion/react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { TrendingUp, DollarSign, Users, Target, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface AnalyticsDashboardProps {
  leads: any[];
  clients: any[];
  quotes: any[];
  invoices: any[];
  bookings: any[];
}

export function AnalyticsDashboard({ leads, clients, quotes, invoices, bookings }: AnalyticsDashboardProps) {
  // Debug: afficher les donnÃ©es reÃ§ues
  console.log('ðŸ“Š Analytics Data:', {
    leadsCount: leads.length,
    leads: leads,
    clientsCount: clients.length,
    quotesCount: quotes.length,
    invoicesCount: invoices.length,
    invoices: invoices.map(inv => ({ id: inv.id, amount: inv.amount, status: inv.status })),
    bookingsCount: bookings.length
  });

  // Calcul du CA par mois (6 derniers mois)
  const revenueByMonth = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      const monthInvoices = invoices.filter(inv => {
        const invDate = new Date(inv.createdAt);
        return invDate.getMonth() === date.getMonth() && 
               invDate.getFullYear() === date.getFullYear() &&
               inv.status === 'paid';
      });
      
      const revenue = monthInvoices.reduce((sum, inv) => sum + (parseFloat(inv.total || inv.amount) || 0), 0);
      const invoiceCount = monthInvoices.length;
      
      months.push({
        month: monthName,
        revenue,
        invoiceCount,
        fullDate: monthYear
      });
    }
    
    return months;
  }, [invoices]);

  // Funnel de conversion
  const conversionFunnel = useMemo(() => {
    // Les leads incluent les prises de contact classiques + les RDV
    const totalLeads = leads.length + bookings.length;
    const convertedClients = clients.length;
    const acceptedQuotes = quotes.filter(q => q.status === 'accepted').length;
    const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
    
    return [
      { stage: 'Leads', count: totalLeads, color: '#8b5cf6' },
      { stage: 'Clients', count: convertedClients, color: '#CCFF00' },
      { stage: 'Devis AcceptÃ©s', count: acceptedQuotes, color: '#3b82f6' },
      { stage: 'Factures PayÃ©es', count: paidInvoices, color: '#10b981' }
    ];
  }, [leads, clients, quotes, invoices, bookings]);

  // Top 5 clients par CA
  const topClients = useMemo(() => {
    const clientRevenue = new Map();
    
    invoices.forEach(inv => {
      if (inv.status === 'paid' && inv.clientId) {
        const current = clientRevenue.get(inv.clientId) || 0;
        clientRevenue.set(inv.clientId, current + (parseFloat(inv.total || inv.amount) || 0));
      }
    });
    
    const clientsWithRevenue = Array.from(clientRevenue.entries())
      .map(([clientId, revenue]) => {
        const client = clients.find(c => c.id === clientId);
        return {
          name: client?.name || 'Client inconnu',
          revenue,
          email: client?.email
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    return clientsWithRevenue;
  }, [clients, invoices]);

  // PrÃ©visions de trÃ©sorerie
  const cashFlowForecast = useMemo(() => {
    const paidTotal = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + (parseFloat(inv.total || inv.amount) || 0), 0);
    
    const pendingTotal = invoices
      .filter(inv => inv.status === 'unpaid')
      .reduce((sum, inv) => sum + (parseFloat(inv.total || inv.amount) || 0), 0);
    
    const quotesTotal = quotes
      .filter(q => q.status === 'pending')
      .reduce((sum, q) => sum + (parseFloat(q.total || q.amount) || 0), 0);
    
    return [
      { category: 'EncaissÃ©', amount: paidTotal, color: '#10b981' },
      { category: 'Ã€ encaisser', amount: pendingTotal, color: '#f59e0b' },
      { category: 'Potentiel (devis)', amount: quotesTotal, color: '#8b5cf6' }
    ];
  }, [invoices, quotes]);

  // Stats gÃ©nÃ©rales
  const stats = useMemo(() => {
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    console.log('ðŸ’° Paid Invoices:', paidInvoices);
    console.log('ðŸ’° Paid Invoices Details:', paidInvoices.map(inv => ({
      id: inv.id,
      total: inv.total,
      amount: inv.amount,
      amountType: typeof inv.amount,
      parsed: parseFloat(inv.total || inv.amount),
      parsedType: typeof parseFloat(inv.total || inv.amount)
    })));
    
    const totalRevenue = paidInvoices
      .reduce((sum, inv) => sum + (parseFloat(inv.total || inv.amount) || 0), 0);
    
    console.log('ðŸ’° Total Revenue:', totalRevenue);
    
    const lastMonthRevenue = invoices
      .filter(inv => {
        const date = new Date(inv.createdAt);
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return date.getMonth() === lastMonth.getMonth() && 
               date.getFullYear() === lastMonth.getFullYear() &&
               inv.status === 'paid';
      })
      .reduce((sum, inv) => sum + (parseFloat(inv.total || inv.amount) || 0), 0);
    
    const currentMonthRevenue = invoices
      .filter(inv => {
        const date = new Date(inv.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && 
               date.getFullYear() === now.getFullYear() &&
               inv.status === 'paid';
      })
      .reduce((sum, inv) => sum + (parseFloat(inv.total || inv.amount) || 0), 0);
    
    const growth = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : '0';
    
    // Les leads incluent les prises de contact + les RDV
    const totalLeadsCount = leads.length + bookings.length;
    const conversionRate = totalLeadsCount > 0 
      ? ((clients.length / totalLeadsCount) * 100).toFixed(1)
      : '0';
    
    const avgInvoice = paidInvoices.length > 0
      ? totalRevenue / paidInvoices.length
      : 0;
    
    return {
      totalRevenue,
      growth: parseFloat(growth),
      conversionRate: parseFloat(conversionRate),
      avgInvoice,
      currentMonthRevenue,
      totalLeadsCount
    };
  }, [invoices, leads, clients, bookings]);

  // Distribution des statuts des devis
  const quoteStatusDistribution = useMemo(() => {
    const pending = quotes.filter(q => q.status === 'pending').length;
    const accepted = quotes.filter(q => q.status === 'accepted').length;
    const rejected = quotes.filter(q => q.status === 'rejected').length;
    
    return [
      { name: 'En attente', value: pending, color: '#f59e0b' },
      { name: 'AcceptÃ©s', value: accepted, color: '#10b981' },
      { name: 'RefusÃ©s', value: rejected, color: '#ef4444' }
    ];
  }, [quotes]);

  const COLORS = ['#8b5cf6', '#CCFF00', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            Analytics & Reporting
          </h2>
          <p className="text-white/60 mt-1">Vue d'ensemble de votre activitÃ©</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-400" />
            <Badge className={`${stats.growth >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {stats.growth >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
              {Math.abs(stats.growth)}%
            </Badge>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.totalRevenue.toLocaleString('fr-FR')}â‚¬
          </div>
          <div className="text-sm text-white/60">CA Total</div>
          <div className="text-xs text-green-400 mt-2">
            {stats.currentMonthRevenue.toLocaleString('fr-FR')}â‚¬ ce mois
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.conversionRate}%
          </div>
          <div className="text-sm text-white/60">Taux de Conversion</div>
          <div className="text-xs text-cyan-400 mt-2">
            {clients.length} clients sur {stats.totalLeadsCount} leads
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {Math.round(stats.avgInvoice).toLocaleString('fr-FR')}â‚¬
          </div>
          <div className="text-sm text-white/60">Panier Moyen</div>
          <div className="text-xs text-purple-400 mt-2">
            Par facture payÃ©e
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {bookings.filter(b => b.status === 'confirmed').length}
          </div>
          <div className="text-sm text-white/60">RDV ConfirmÃ©s</div>
          <div className="text-xs text-blue-400 mt-2">
            {bookings.filter(b => b.status === 'pending').length} en attente
          </div>
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CA par mois */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0C0C0C] border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Ã‰volution du CA (6 derniers mois)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueByMonth}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CCFF00" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#CCFF00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#ffffff" style={{ fill: '#ffffff' }} />
              <YAxis stroke="#ffffff" style={{ fill: '#ffffff' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #ffffff20',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#CCFF00' }}
                formatter={(value: number) => `${value.toLocaleString('fr-FR')}â‚¬`}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#CCFF00" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Funnel de conversion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-[#0C0C0C] border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Funnel de Conversion
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionFunnel} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis type="number" stroke="#ffffff" style={{ fill: '#ffffff' }} />
              <YAxis dataKey="stage" type="category" stroke="#ffffff" style={{ fill: '#ffffff' }} width={120} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #ffffff20',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#CCFF00' }}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {conversionFunnel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Clients */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-[#0C0C0C] border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Top 5 Clients par CA
          </h3>
          <div className="space-y-3">
            {topClients.map((client, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                    ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' : ''}
                    ${index === 1 ? 'bg-gray-400/20 text-gray-300' : ''}
                    ${index === 2 ? 'bg-orange-500/20 text-orange-400' : ''}
                    ${index > 2 ? 'bg-cyan-500/20 text-cyan-400' : ''}
                  `}>
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-white">{client.name}</div>
                    <div className="text-xs text-white/60">{client.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-400">
                    {client.revenue.toLocaleString('fr-FR')}â‚¬
                  </div>
                </div>
              </div>
            ))}
            {topClients.length === 0 && (
              <div className="text-center py-8 text-white/40">
                Aucun client avec CA pour le moment
              </div>
            )}
          </div>
        </motion.div>

        {/* PrÃ©visions TrÃ©sorerie */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-[#0C0C0C] border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            PrÃ©visions de TrÃ©sorerie
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cashFlowForecast}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
                style={{ fill: '#ffffff' }}
              >
                {cashFlowForecast.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #ffffff20',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#CCFF00' }}
                formatter={(value: number) => `${value.toLocaleString('fr-FR')}â‚¬`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {cashFlowForecast.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-white/80">{item.category}</span>
                </div>
                <span className="font-bold text-white">{item.amount.toLocaleString('fr-FR')}â‚¬</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Distribution des devis */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-[#0C0C0C] border border-white/10 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Distribution des Statuts de Devis</h3>
        <div className="grid grid-cols-3 gap-4">
          {quoteStatusDistribution.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border"
              style={{ 
                borderColor: `${item.color}40`,
                backgroundColor: `${item.color}10`
              }}
            >
              <div className="text-3xl font-bold text-white mb-1">{item.value}</div>
              <div className="text-sm" style={{ color: item.color }}>{item.name}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
