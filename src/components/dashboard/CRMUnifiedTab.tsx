import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Panel } from "./Panel";
import { StatCard, StatGrid } from "./StatCard";
import {
  Users,
  UserCheck,
  FileText,
  Receipt,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  ArrowRight,
  Plus,
  Eye,
  Send,
  CheckCircle,
  Clock,
  Sparkles,
  X,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Search,
  Filter,
  Euro,
  History
} from "lucide-react";
import { createClient } from "../../utils/supabase/client";
import { projectId } from "../../utils/supabase/info";
import { toast } from "sonner";
import { colors } from "../../styles/designSystem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  status: string;
  created_at: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  created_at: string;
  lead_id?: string;
}

interface Deal {
  id: string;
  type: "lead" | "client" | "quote" | "invoice";
  lead?: Lead;
  client?: Client;
  quote?: any;
  invoice?: any;
  status: string;
  value?: number;
  created_at: string;
  children?: Deal[];
  expanded?: boolean;
}

export function CRMUnifiedTab() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Stats
  const [stats, setStats] = useState({
    leads: 0,
    clients: 0,
    quotes: 0,
    invoices: 0,
    totalValue: 0
  });

  // Modals
  const [convertLeadModal, setConvertLeadModal] = useState<Lead | null>(null);
  const [createQuoteModal, setCreateQuoteModal] = useState<Client | null>(null);
  const [convertQuoteModal, setConvertQuoteModal] = useState<any>(null);

  // Form states
  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: ""
  });

  const [quoteForm, setQuoteForm] = useState({
    title: "",
    description: "",
    items: [{ name: "", quantity: 1, price: 0 }],
    valid_until: ""
  });

  const supabase = createClient();

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    filterDeals();
  }, [searchQuery, statusFilter, deals]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch leads
      const leadsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads`,
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
      
      let leadsData: Lead[] = [];
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        leadsData = data.leads || [];
      }

      // Fetch clients
      const clientsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients`,
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
      
      let clientsData: Client[] = [];
      if (clientsRes.ok) {
        const data = await clientsRes.json();
        clientsData = data.clients || [];
      }

      // Fetch quotes
      const { data: quotesData } = await (supabase.from("quotes") as any).select("*");
      const quotes = quotesData || [];

      // Fetch invoices
      const { data: invoicesData } = await (supabase.from("invoices") as any).select("*");
      const invoices = invoicesData || [];

      // Build unified deals structure
      const unifiedDeals: Deal[] = [];
      
      // Process leads (not yet converted)
      leadsData.forEach(lead => {
        const hasClient = clientsData.find(c => c.lead_id === lead.id);
        if (!hasClient) {
          unifiedDeals.push({
            id: lead.id,
            type: "lead",
            lead,
            status: lead.status,
            created_at: lead.created_at,
            children: []
          });
        }
      });

      // Process clients with their quotes and invoices
      clientsData.forEach(client => {
        const clientQuotes = quotes.filter((q: any) => q.client_id === client.id);
        const children: Deal[] = [];

        clientQuotes.forEach((quote: any) => {
          const quoteInvoices = invoices.filter((inv: any) => inv.quote_id === quote.id);
          const quoteChildren: Deal[] = quoteInvoices.map((invoice: any) => ({
            id: invoice.id,
            type: "invoice" as const,
            invoice,
            status: invoice.status,
            value: invoice.amount,
            created_at: invoice.created_at
          }));

          children.push({
            id: quote.id,
            type: "quote",
            quote,
            status: quote.status,
            value: quote.amount,
            created_at: quote.created_at,
            children: quoteChildren,
            expanded: false
          });
        });

        unifiedDeals.push({
          id: client.id,
          type: "client",
          client,
          status: "active",
          created_at: client.created_at,
          children,
          expanded: false
        });
      });

      // Sort by date desc
      unifiedDeals.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setDeals(unifiedDeals);

      // Calculate stats
      const totalValue = [...quotes, ...invoices].reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
      setStats({
        leads: leadsData.length,
        clients: clientsData.length,
        quotes: quotes.length,
        invoices: invoices.length,
        totalValue
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erreur lors du chargement des donnÃ©es");
    } finally {
      setLoading(false);
    }
  };

  const filterDeals = () => {
    let filtered = [...deals];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(deal => {
        const name = deal.lead?.name || deal.client?.name || "";
        const email = deal.lead?.email || deal.client?.email || "";
        const company = deal.lead?.company || deal.client?.company || "";
        return (
          name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(deal => deal.type === statusFilter);
    }

    setFilteredDeals(filtered);
  };

  const toggleExpand = (dealId: string) => {
    setDeals(deals.map(deal => 
      deal.id === dealId ? { ...deal, expanded: !deal.expanded } : deal
    ));
  };

  const toggleChildExpand = (parentId: string, childId: string) => {
    setDeals(deals.map(deal => {
      if (deal.id === parentId && deal.children) {
        return {
          ...deal,
          children: deal.children.map(child =>
            child.id === childId ? { ...child, expanded: !child.expanded } : child
          )
        };
      }
      return deal;
    }));
  };

  // Actions
  const handleConvertLead = (lead: Lead) => {
    setClientForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      company: lead.company || "",
      address: ""
    });
    setConvertLeadModal(lead);
  };

  const handleConvertLeadToClient = async () => {
    if (!convertLeadModal) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ...clientForm, lead_id: convertLeadModal.id })
        }
      );

      if (res.ok) {
        toast.success("âœ… Lead converti en client !");
        setConvertLeadModal(null);
        fetchAllData();
      }
    } catch (error) {
      toast.error("Erreur lors de la conversion");
    }
  };

  const handleCreateQuote = async () => {
    if (!createQuoteModal) return;

    try {
      const totalAmount = quoteForm.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );

      const { error } = await (supabase.from("quotes") as any).insert([{
        client_id: createQuoteModal.id,
        client_name: createQuoteModal.name,
        title: quoteForm.title,
        description: quoteForm.description,
        amount: totalAmount,
        items: quoteForm.items,
        status: "draft",
        valid_until: quoteForm.valid_until
      }]).select();

      if (error) throw error;

      toast.success("âœ… Devis crÃ©Ã© !");
      setCreateQuoteModal(null);
      fetchAllData();
      
      setQuoteForm({
        title: "",
        description: "",
        items: [{ name: "", quantity: 1, price: 0 }],
        valid_until: ""
      });
    } catch (error) {
      toast.error("Erreur lors de la crÃ©ation du devis");
    }
  };

  const handleSendQuote = async (quote: any) => {
    try {
      await (supabase.from("quotes") as any).update({ status: "sent" }).eq("id", quote.id);
      toast.success(`ðŸ“§ Devis envoyÃ© !`);
      fetchAllData();
    } catch (error) {
      toast.error("Erreur lors de l'envoi");
    }
  };

  const handleConvertQuoteToInvoice = async () => {
    if (!convertQuoteModal) return;

    try {
      const invoiceNumber = `INV-${Date.now()}`;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);

      const { error } = await (supabase.from("invoices") as any).insert([{
        client_id: convertQuoteModal.client_id,
        client_name: convertQuoteModal.client_name,
        quote_id: convertQuoteModal.id,
        invoice_number: invoiceNumber,
        amount: convertQuoteModal.amount,
        status: "draft",
        due_date: dueDate.toISOString(),
        items: convertQuoteModal.items
      }]).select();

      if (error) throw error;

      await (supabase.from("quotes") as any).update({ status: "accepted" }).eq("id", convertQuoteModal.id);

      toast.success("âœ… Facture crÃ©Ã©e !");
      setConvertQuoteModal(null);
      fetchAllData();
    } catch (error) {
      toast.error("Erreur lors de la crÃ©ation de la facture");
    }
  };

  const openCreateQuote = (client: Client) => {
    setQuoteForm({
      title: `Devis pour ${client.company || client.name}`,
      description: "",
      items: [{ name: "Service", quantity: 1, price: 0 }],
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    });
    setCreateQuoteModal(client);
  };

  const getStatusBadge = (type: string, status: string) => {
    const variants: Record<string, any> = {
      lead: { bg: "bg-blue-500/10", text: "text-blue-400", icon: Users },
      client: { bg: "bg-green-500/10", text: "text-green-400", icon: UserCheck },
      quote: { bg: "bg-purple-500/10", text: "text-purple-400", icon: FileText },
      invoice: { bg: "bg-yellow-500/10", text: "text-yellow-400", icon: Receipt }
    };

    const variant = variants[type] || variants.lead;
    const Icon = variant.icon;

    return (
      <Badge className={`${variant.bg} ${variant.text} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {type === "lead" && "Lead"}
        {type === "client" && "Client"}
        {type === "quote" && status}
        {type === "invoice" && status}
      </Badge>
    );
  };

  const renderDeal = (deal: Deal, level: number = 0) => {
    const hasChildren = deal.children && deal.children.length > 0;
    const paddingLeft = level * 32;

    return (
      <div key={deal.id}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-white/5 hover:bg-white/5 transition-all"
        >
          <div className="flex items-center gap-4 p-4" style={{ paddingLeft: `${paddingLeft + 16}px` }}>
            {/* Expand button */}
            {hasChildren && (
              <button
                onClick={() => toggleExpand(deal.id)}
                className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
              >
                {deal.expanded ? (
                  <ChevronDown className="w-4 h-4 text-white/60" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white/60" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-6" />}

            {/* Status badge */}
            <div className="w-32">
              {getStatusBadge(deal.type, deal.status)}
            </div>

            {/* Name & Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white truncate">
                {deal.lead?.name || deal.client?.name || deal.quote?.title || deal.invoice?.invoice_number}
              </h4>
              <div className="flex items-center gap-3 mt-1 text-xs text-white/60">
                {(deal.lead?.email || deal.client?.email) && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {deal.lead?.email || deal.client?.email}
                  </span>
                )}
                {(deal.lead?.company || deal.client?.company) && (
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {deal.lead?.company || deal.client?.company}
                  </span>
                )}
              </div>
            </div>

            {/* Value */}
            {deal.value && (
              <div className="text-right w-32">
                <div className="text-lg font-bold text-[#CCFF00]">
                  {deal.value.toLocaleString()}â‚¬
                </div>
              </div>
            )}

            {/* Date */}
            <div className="text-xs text-white/60 w-28 text-right">
              {new Date(deal.created_at).toLocaleDateString()}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {deal.type === "lead" && (
                <Button
                  size="sm"
                  onClick={() => handleConvertLead(deal.lead!)}
                  className="bg-[#CCFF00]/10 hover:bg-[#CCFF00]/20 text-[#CCFF00]"
                >
                  <ArrowRight className="w-4 h-4 mr-1" />
                  Convertir
                </Button>
              )}

              {deal.type === "client" && (
                <Button
                  size="sm"
                  onClick={() => openCreateQuote(deal.client!)}
                  className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Devis
                </Button>
              )}

              {deal.type === "quote" && deal.quote.status === "draft" && (
                <Button
                  size="sm"
                  onClick={() => handleSendQuote(deal.quote)}
                  className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Envoyer
                </Button>
              )}

              {deal.type === "quote" && deal.quote.status === "sent" && (
                <Button
                  size="sm"
                  onClick={() => setConvertQuoteModal(deal.quote)}
                  className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400"
                >
                  <Receipt className="w-4 h-4 mr-1" />
                  Facturer
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    Voir dÃ©tails
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <History className="w-4 h-4 mr-2" />
                    Historique
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>

        {/* Render children */}
        {deal.expanded && hasChildren && (
          <div>
            {deal.children!.map(child => renderDeal(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#CCFF00]" />
            CRM UnifiÃ©
          </h1>
          <p className="text-white/60 mt-1">Toutes vos opportunitÃ©s en un coup d'Å“il</p>
        </div>
      </div>

      {/* Stats */}
      <StatGrid>
        <StatCard
          label="Leads"
          value={stats.leads}
          icon={<Users className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          label="Clients"
          value={stats.clients}
          icon={<UserCheck className="w-5 h-5" />}
          variant="solid"
        />
        <StatCard
          label="Devis"
          value={stats.quotes}
          icon={<FileText className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          label="Valeur totale"
          value={`${stats.totalValue.toLocaleString()}â‚¬`}
          icon={<Euro className="w-5 h-5" />}
          variant="gradient"
        />
      </StatGrid>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Rechercher un contact, email, entreprise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="flex gap-2">
          {["all", "lead", "client", "quote", "invoice"].map(type => (
            <Button
              key={type}
              size="sm"
              variant={statusFilter === type ? "default" : "ghost"}
              onClick={() => setStatusFilter(type)}
              className={statusFilter === type ? "bg-[#CCFF00] text-black" : ""}
            >
              {type === "all" && "Tous"}
              {type === "lead" && "Leads"}
              {type === "client" && "Clients"}
              {type === "quote" && "Devis"}
              {type === "invoice" && "Factures"}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Panel variant="elevated">
        <div className="divide-y divide-white/5">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#CCFF00]/20 border-t-[#CCFF00] rounded-full animate-spin" />
            </div>
          ) : filteredDeals.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              Aucune opportunitÃ© trouvÃ©e
            </div>
          ) : (
            filteredDeals.map(deal => renderDeal(deal))
          )}
        </div>
      </Panel>

      {/* Modals - Same as before */}
      <Dialog open={!!convertLeadModal} onOpenChange={() => setConvertLeadModal(null)}>
        <DialogContent className="max-w-2xl" style={{ background: colors.surface, border: `1px solid ${colors.border}` }}>
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-[#CCFF00]" />
              Convertir le lead en client
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Nom complet *</Label>
                <Input
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Email *</Label>
                <Input
                  type="email"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-white">TÃ©lÃ©phone</Label>
                <Input
                  value={clientForm.phone}
                  onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Entreprise</Label>
                <Input
                  value={clientForm.company}
                  onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-white">Adresse complÃ¨te</Label>
              <Textarea
                value={clientForm.address}
                onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                rows={3}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setConvertLeadModal(null)}>
                Annuler
              </Button>
              <Button
                onClick={handleConvertLeadToClient}
                className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                CrÃ©er le client
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Quote Modal */}
      <Dialog open={!!createQuoteModal} onOpenChange={() => setCreateQuoteModal(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{ background: colors.surface, border: `1px solid ${colors.border}` }}>
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#CCFF00]" />
              CrÃ©er un devis pour {createQuoteModal?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Titre du devis *</Label>
                <Input
                  value={quoteForm.title}
                  onChange={(e) => setQuoteForm({ ...quoteForm, title: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Valable jusqu'au *</Label>
                <Input
                  type="date"
                  value={quoteForm.valid_until}
                  onChange={(e) => setQuoteForm({ ...quoteForm, valid_until: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-white">Description</Label>
              <Textarea
                value={quoteForm.description}
                onChange={(e) => setQuoteForm({ ...quoteForm, description: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                rows={3}
              />
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-white">Prestations / Produits</Label>
                <Button 
                  size="sm" 
                  onClick={() => setQuoteForm({
                    ...quoteForm,
                    items: [...quoteForm.items, { name: "", quantity: 1, price: 0 }]
                  })} 
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
              <div className="space-y-3">
                {quoteForm.items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-start p-3 rounded-lg bg-white/5">
                    <div className="flex-1">
                      <Input
                        placeholder="Nom du service/produit"
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...quoteForm.items];
                          newItems[index] = { ...newItems[index], name: e.target.value };
                          setQuoteForm({ ...quoteForm, items: newItems });
                        }}
                        className="bg-white/5 border-white/10 text-white mb-2"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="QuantitÃ©"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...quoteForm.items];
                            newItems[index] = { ...newItems[index], quantity: parseInt(e.target.value) || 1 };
                            setQuoteForm({ ...quoteForm, items: newItems });
                          }}
                          className="bg-white/5 border-white/10 text-white"
                        />
                        <Input
                          type="number"
                          placeholder="Prix unitaire (â‚¬)"
                          value={item.price}
                          onChange={(e) => {
                            const newItems = [...quoteForm.items];
                            newItems[index] = { ...newItems[index], price: parseFloat(e.target.value) || 0 };
                            setQuoteForm({ ...quoteForm, items: newItems });
                          }}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setQuoteForm({
                        ...quoteForm,
                        items: quoteForm.items.filter((_, i) => i !== index)
                      })}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {/* Total */}
              <div className="mt-4 p-4 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/20">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">Total HT</span>
                  <span className="text-2xl font-bold text-[#CCFF00]">
                    {quoteForm.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toLocaleString()}â‚¬
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setCreateQuoteModal(null)}>
                Annuler
              </Button>
              <Button
                onClick={handleCreateQuote}
                className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
              >
                <FileText className="w-4 h-4 mr-2" />
                CrÃ©er le devis
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Convert Quote to Invoice Modal */}
      <Dialog open={!!convertQuoteModal} onOpenChange={() => setConvertQuoteModal(null)}>
        <DialogContent style={{ background: colors.surface, border: `1px solid ${colors.border}` }}>
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#CCFF00]" />
              Transformer en facture
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/5">
              <h4 className="font-semibold text-white mb-2">{convertQuoteModal?.title}</h4>
              <p className="text-white/60 text-sm mb-3">{convertQuoteModal?.client_name}</p>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Montant</span>
                <span className="text-2xl font-bold text-[#CCFF00]">
                  {convertQuoteModal?.amount.toLocaleString()}â‚¬
                </span>
              </div>
            </div>
            <p className="text-white/60 text-sm">
              Une facture sera crÃ©Ã©e automatiquement avec un numÃ©ro unique et une Ã©chÃ©ance de 30 jours.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setConvertQuoteModal(null)}>
                Annuler
              </Button>
              <Button
                onClick={handleConvertQuoteToInvoice}
                className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                CrÃ©er la facture
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
