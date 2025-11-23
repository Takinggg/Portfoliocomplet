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
  AlertCircle,
  Clock,
  TrendingUp,
  Sparkles,
  X,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Search,
  Filter,
  Euro
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

interface Quote {
  id: string;
  client_id: string;
  client_name?: string;
  title: string;
  description: string;
  amount: number;
  status: "draft" | "sent" | "accepted" | "rejected";
  items: Array<{ name: string; quantity: number; price: number }>;
  created_at: string;
  valid_until: string;
}

interface Invoice {
  id: string;
  client_id: string;
  client_name?: string;
  quote_id?: string;
  invoice_number: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  due_date: string;
  created_at: string;
}

export function CRMFlowTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [convertLeadModal, setConvertLeadModal] = useState<Lead | null>(null);
  const [createQuoteModal, setCreateQuoteModal] = useState<Client | null>(null);
  const [convertQuoteModal, setConvertQuoteModal] = useState<Quote | null>(null);
  const [viewDetailsModal, setViewDetailsModal] = useState<any>(null);

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
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data.leads || []);
      }

      // Fetch clients
      const clientsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients`,
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
      if (clientsRes.ok) {
        const data = await clientsRes.json();
        setClients(data.clients || []);
      }

      // Fetch quotes
      const { data: quotesData } = await supabase.from("quotes").select("*") as any;
      if (quotesData) setQuotes(quotesData);

      // Fetch invoices
      const { data: invoicesData } = await supabase.from("invoices").select("*") as any;
      if (invoicesData) setInvoices(invoicesData);

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erreur lors du chargement des donnÃ©es");
    } finally {
      setLoading(false);
    }
  };

  // LEAD â†’ CLIENT
  const handleConvertLeadToClient = async () => {
    if (!convertLeadModal) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const clientData = {
        name: clientForm.name,
        email: clientForm.email,
        phone: clientForm.phone,
        company: clientForm.company,
        address: clientForm.address,
        lead_id: convertLeadModal.id
      };

      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(clientData)
        }
      );

      if (res.ok) {
        toast.success("âœ… Lead converti en client !");
        setConvertLeadModal(null);
        fetchAllData();
      } else {
        toast.error("Erreur lors de la conversion");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur rÃ©seau");
    }
  };

  // CLIENT â†’ QUOTE
  const handleCreateQuote = async () => {
    if (!createQuoteModal) return;

    try {
      const totalAmount = quoteForm.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );

      const quoteData = {
        client_id: createQuoteModal.id,
        client_name: createQuoteModal.name,
        title: quoteForm.title,
        description: quoteForm.description,
        amount: totalAmount,
        items: quoteForm.items,
        status: "draft",
        valid_until: quoteForm.valid_until
      };

      const { data, error } = await (supabase.from("quotes") as any).insert([quoteData]).select();

      if (error) throw error;

      toast.success("âœ… Devis crÃ©Ã© !");
      setCreateQuoteModal(null);
      fetchAllData();
      
      // Reset form
      setQuoteForm({
        title: "",
        description: "",
        items: [{ name: "", quantity: 1, price: 0 }],
        valid_until: ""
      });
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la crÃ©ation du devis");
    }
  };

  // Send quote by email
  const handleSendQuote = async (quote: Quote) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Update status
      await (supabase.from("quotes") as any).update({ status: "sent" }).eq("id", quote.id);

      // TODO: Send email via your email service
      toast.success(`ðŸ“§ Devis envoyÃ© Ã  ${quote.client_name} !`);
      fetchAllData();
    } catch (error) {
      toast.error("Erreur lors de l'envoi");
    }
  };

  // QUOTE â†’ INVOICE
  const handleConvertQuoteToInvoice = async () => {
    if (!convertQuoteModal) return;

    try {
      const invoiceNumber = `INV-${Date.now()}`;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // 30 days

      const invoiceData = {
        client_id: convertQuoteModal.client_id,
        client_name: convertQuoteModal.client_name,
        quote_id: convertQuoteModal.id,
        invoice_number: invoiceNumber,
        amount: convertQuoteModal.amount,
        status: "draft",
        due_date: dueDate.toISOString(),
        items: convertQuoteModal.items
      };

      const { data, error } = await (supabase.from("invoices") as any).insert([invoiceData]).select();

      if (error) throw error;

      // Update quote status
      await (supabase.from("quotes") as any).update({ status: "accepted" }).eq("id", convertQuoteModal.id);

      toast.success("âœ… Facture crÃ©Ã©e depuis le devis !");
      setConvertQuoteModal(null);
      fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la crÃ©ation de la facture");
    }
  };

  // Open convert lead modal
  const openConvertLead = (lead: Lead) => {
    setClientForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      company: lead.company || "",
      address: ""
    });
    setConvertLeadModal(lead);
  };

  // Open create quote modal
  const openCreateQuote = (client: Client) => {
    setQuoteForm({
      title: `Devis pour ${client.company || client.name}`,
      description: "",
      items: [{ name: "Service", quantity: 1, price: 0 }],
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    });
    setCreateQuoteModal(client);
  };

  const addQuoteItem = () => {
    setQuoteForm({
      ...quoteForm,
      items: [...quoteForm.items, { name: "", quantity: 1, price: 0 }]
    });
  };

  const removeQuoteItem = (index: number) => {
    setQuoteForm({
      ...quoteForm,
      items: quoteForm.items.filter((_, i) => i !== index)
    });
  };

  const updateQuoteItem = (index: number, field: string, value: any) => {
    const newItems = [...quoteForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setQuoteForm({ ...quoteForm, items: newItems });
  };

  const calculateQuoteTotal = () => {
    return quoteForm.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#CCFF00]" />
            Pipeline CRM Complet
          </h1>
          <p className="text-white/60 mt-1">Lead â†’ Client â†’ Devis â†’ Facture</p>
        </div>
      </div>

      {/* Stats */}
      <StatGrid>
        <StatCard
          label="Leads Actifs"
          value={leads.filter(l => l.status === "new").length}
          icon={<Users className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          label="Clients"
          value={clients.length}
          icon={<UserCheck className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          label="Devis"
          value={quotes.length}
          icon={<FileText className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          label="Factures"
          value={invoices.length}
          icon={<Receipt className="w-5 h-5" />}
          variant="default"
        />
      </StatGrid>

      {/* Pipeline Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEADS */}
        <Panel title="ðŸŽ¯ Leads" icon={<Users className="w-5 h-5" />} variant="default">
          <div className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <motion.div
                key={lead.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{lead.name}</h4>
                    <p className="text-xs text-white/60">{lead.email}</p>
                    {lead.company && (
                      <p className="text-xs text-[#CCFF00] mt-1">{lead.company}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {lead.status}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  onClick={() => openConvertLead(lead)}
                  className="w-full mt-2 bg-[#CCFF00]/10 hover:bg-[#CCFF00]/20 text-[#CCFF00]"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Convertir en client
                </Button>
              </motion.div>
            ))}
          </div>
        </Panel>

        {/* CLIENTS */}
        <Panel title="ðŸ‘¥ Clients" icon={<UserCheck className="w-5 h-5" />} variant="elevated">
          <div className="space-y-3">
            {clients.slice(0, 5).map((client) => (
              <motion.div
                key={client.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{client.name}</h4>
                    <p className="text-xs text-white/60">{client.email}</p>
                    {client.company && (
                      <p className="text-xs text-[#CCFF00] mt-1 flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {client.company}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => openCreateQuote(client)}
                  className="w-full mt-2 bg-[#CCFF00]/10 hover:bg-[#CCFF00]/20 text-[#CCFF00]"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  CrÃ©er un devis
                </Button>
              </motion.div>
            ))}
          </div>
        </Panel>

        {/* QUOTES */}
        <Panel title="ðŸ“„ Devis" icon={<FileText className="w-5 h-5" />} variant="accent">
          <div className="space-y-3">
            {quotes.slice(0, 5).map((quote) => (
              <motion.div
                key={quote.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{quote.title}</h4>
                    <p className="text-xs text-white/60">{quote.client_name}</p>
                    <p className="text-lg font-bold text-[#CCFF00] mt-1">
                      {quote.amount.toLocaleString()}â‚¬
                    </p>
                  </div>
                  <Badge
                    variant={quote.status === "accepted" ? "default" : "outline"}
                    className="text-xs"
                  >
                    {quote.status}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-2">
                  {quote.status === "draft" && (
                    <Button
                      size="sm"
                      onClick={() => handleSendQuote(quote)}
                      className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Envoyer
                    </Button>
                  )}
                  {quote.status === "sent" && (
                    <Button
                      size="sm"
                      onClick={() => setConvertQuoteModal(quote)}
                      className="flex-1 bg-[#CCFF00]/10 hover:bg-[#CCFF00]/20 text-[#CCFF00]"
                    >
                      <Receipt className="w-4 h-4 mr-1" />
                      â†’ Facture
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Panel>

        {/* INVOICES */}
        <Panel title="ðŸ’° Factures" icon={<Receipt className="w-5 h-5" />} variant="default">
          <div className="space-y-3">
            {invoices.slice(0, 5).map((invoice) => (
              <motion.div
                key={invoice.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{invoice.invoice_number}</h4>
                    <p className="text-xs text-white/60">{invoice.client_name}</p>
                    <p className="text-lg font-bold text-[#CCFF00] mt-1">
                      {invoice.amount.toLocaleString()}â‚¬
                    </p>
                  </div>
                  <Badge
                    variant={invoice.status === "paid" ? "default" : "outline"}
                    className="text-xs"
                  >
                    {invoice.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-white/60">
                  <Calendar className="w-3 h-3" />
                  Ã‰chÃ©ance: {new Date(invoice.due_date).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        </Panel>
      </div>

      {/* MODAL: Convert Lead to Client */}
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

      {/* MODAL: Create Quote */}
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
                <Button size="sm" onClick={addQuoteItem} variant="outline">
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
                        onChange={(e) => updateQuoteItem(index, "name", e.target.value)}
                        className="bg-white/5 border-white/10 text-white mb-2"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="QuantitÃ©"
                          value={item.quantity}
                          onChange={(e) => updateQuoteItem(index, "quantity", parseInt(e.target.value) || 1)}
                          className="bg-white/5 border-white/10 text-white"
                        />
                        <Input
                          type="number"
                          placeholder="Prix unitaire (â‚¬)"
                          value={item.price}
                          onChange={(e) => updateQuoteItem(index, "price", parseFloat(e.target.value) || 0)}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeQuoteItem(index)}
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
                    {calculateQuoteTotal().toLocaleString()}â‚¬
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

      {/* MODAL: Convert Quote to Invoice */}
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
