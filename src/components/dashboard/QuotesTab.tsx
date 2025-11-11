import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { motion } from "motion/react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye,
  Edit,
  Trash,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  ArrowRight,
  Mail
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { createClient } from "../../utils/supabase/client";
import { QuoteGenerator } from "../invoice/QuoteGenerator";
import { QuoteEditDialog } from "./QuoteEditDialog";
import { QuoteCreationDialog } from "./QuoteCreationDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { freelanceInfo } from "../../utils/freelanceConfig";

interface Quote {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  amount: number;
  description?: string;
  validUntil: string;
  status: "draft" | "sent" | "accepted" | "declined" | "converted";
  convertedToInvoice?: string;
  createdAt: string;
  updatedAt?: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
}

export function QuotesTab() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const supabase = createClient();

  // Form state for new quote
  const [newQuote, setNewQuote] = useState({
    clientId: "",
    amount: "",
    description: "",
    validUntil: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const authHeader = `Bearer ${session.access_token}`;

      const [quotesRes, clientsRes] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes`, {
          headers: { Authorization: authHeader }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients`, {
          headers: { Authorization: authHeader }
        })
      ]);

      const [quotesData, clientsData] = await Promise.all([
        quotesRes.json(),
        clientsRes.json()
      ]);

      setQuotes(quotesData.quotes || []);
      setClients(clientsData.clients || []);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      toast.error("Erreur lors du chargement des devis");
    } finally {
      setLoading(false);
    }
  };

  const generateQuoteNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = quotes.length + 1;
    return `DEV-${year}${month}-${String(count).padStart(3, '0')}`;
  };

  const handleCreateQuote = async () => {
    if (!newQuote.clientId || !newQuote.amount || !newQuote.validUntil) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    const selectedClient = clients.find(c => c.id === newQuote.clientId);
    if (!selectedClient) {
      toast.error("Client non trouvé");
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const quoteNumber = generateQuoteNumber();

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            number: quoteNumber,
            clientId: newQuote.clientId,
            clientName: selectedClient.name,
            clientEmail: selectedClient.email,
            amount: parseFloat(newQuote.amount),
            description: newQuote.description,
            validUntil: newQuote.validUntil,
            status: "draft",
          }),
        }
      );

      if (response.ok) {
        toast.success("Devis créé avec succès");
        setShowCreateDialog(false);
        setNewQuote({ clientId: "", amount: "", description: "", validUntil: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Error creating quote:", error);
      toast.error("Erreur lors de la création du devis");
    }
  };

  const handleUpdateQuoteStatus = async (quoteId: string, newStatus: Quote["status"]) => {
    // Message de confirmation pour l'envoi
    if (newStatus === "sent") {
      const quote = quotes.find(q => q.id === quoteId);
      if (!quote?.clientEmail) {
        toast.error("Impossible d'envoyer : pas d'email client");
        return;
      }
      
      const confirmed = window.confirm(
        `Êtes-vous sûr de vouloir envoyer ce devis par email à ${quote.clientEmail} ?\n\nLe devis sera marqué comme "envoyé" et un email sera envoyé au client.`
      );
      
      if (!confirmed) return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes/${quoteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(`Devis ${newStatus === "sent" ? "envoyé" : "mis à jour"} avec succès${result.emailSent ? " 📧" : ""}`);
        fetchData();
      }
    } catch (error) {
      console.error("Error updating quote:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleConvertToInvoice = async (quote: Quote) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes/${encodeURIComponent(quote.id)}/convert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Devis converti en facture avec succès !");
        fetchData();
      } else {
        toast.error(result.error || "Erreur lors de la conversion");
      }
    } catch (error) {
      console.error("Error converting quote:", error);
      toast.error("Erreur lors de la conversion");
    }
  };

  const handleDeleteQuote = async () => {
    if (!selectedQuote) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes/${encodeURIComponent(selectedQuote.id)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );

      if (response.ok) {
        toast.success("Devis supprimé avec succès");
        setShowDeleteDialog(false);
        setSelectedQuote(null);
        fetchData();
      } else {
        const data = await response.json();
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting quote:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleSendReminder = async (quote: Quote) => {
    // Message de confirmation
    const confirmed = window.confirm(
      `Renvoyer le devis ${quote.number} par email ?\n\n` +
      `Client : ${quote.clientName}\n` +
      `Email : ${quote.clientEmail}\n` +
      `Montant : ${quote.amount.toLocaleString('fr-FR')} €\n\n` +
      `Un email de rappel sera envoyé au client.`
    );
    
    if (!confirmed) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes/${encodeURIComponent(quote.id)}/send-reminder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        toast.success(`📧 Email de rappel envoyé à ${quote.clientEmail}`);
      } else {
        const result = await response.json();
        toast.error(result.error || "Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast.error("Erreur lors de l'envoi de l'email");
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quote.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Quote["status"]) => {
    const styles = {
      draft: "bg-gray-500/20 text-gray-300 border-gray-500/40",
      sent: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      accepted: "bg-green-500/20 text-green-300 border-green-500/40",
      declined: "bg-red-500/20 text-red-300 border-red-500/40",
      converted: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    };
    
    const labels = {
      draft: "Brouillon",
      sent: "Envoyé",
      accepted: "Accepté",
      declined: "Refusé",
      converted: "Converti",
    };

    return (
      <Badge className={`${styles[status]} border px-3 py-1 text-sm font-medium`}>
        {labels[status]}
      </Badge>
    );
  };

  const stats = {
    total: quotes.length,
    draft: quotes.filter(q => q.status === "draft").length,
    sent: quotes.filter(q => q.status === "sent").length,
    accepted: quotes.filter(q => q.status === "accepted").length,
    pending: quotes.filter(q => q.status === "sent" || q.status === "draft").length,
    totalAmount: quotes.reduce((sum, q) => sum + q.amount, 0),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-[#00FFC2]/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-400">Total Devis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-[#00FFC2]">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-400">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-400">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-400">Acceptés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-400">{stats.accepted}</div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-[#00FFC2]/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-400">Montant total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-[#00FFC2]">{stats.totalAmount.toLocaleString('fr-FR')} €</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <Card className="bg-black/40 border-[#00FFC2]/10">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="sent">Envoyés</SelectItem>
                  <SelectItem value="accepted">Acceptés</SelectItem>
                  <SelectItem value="declined">Refusés</SelectItem>
                  <SelectItem value="converted">Convertis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau devis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Table */}
      <Card className="bg-black/40 border-[#00FFC2]/10">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-[#00FFC2] text-base py-4 min-w-[140px]">N° Devis</TableHead>
                  <TableHead className="text-[#00FFC2] text-base py-4 min-w-[180px]">Client</TableHead>
                  <TableHead className="text-[#00FFC2] text-base py-4 min-w-[130px]">Montant</TableHead>
                  <TableHead className="text-[#00FFC2] text-base py-4 min-w-[150px]">Valide jusqu'au</TableHead>
                  <TableHead className="text-[#00FFC2] text-base py-4 min-w-[130px]">Statut</TableHead>
                  <TableHead className="text-[#00FFC2] text-base py-4 text-right min-w-[220px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400 py-12 text-base">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : filteredQuotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400 py-12 text-base">
                      Aucun devis trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuotes.map((quote) => (
                    <TableRow key={quote.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="py-4 text-base font-medium text-white">{quote.number}</TableCell>
                      <TableCell className="py-4 text-base text-gray-200">{quote.clientName}</TableCell>
                      <TableCell className="py-4 text-[#00FFC2] text-base font-semibold">
                        {quote.amount.toLocaleString('fr-FR')} €
                      </TableCell>
                      <TableCell className="py-4 text-base text-gray-200">
                        {new Date(quote.validUntil).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="py-4">{getStatusBadge(quote.status)}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedQuote(quote);
                            setShowPreviewDialog(true);
                          }}
                          className="hover:bg-white/10 text-gray-300 hover:text-white h-9 w-9 p-0"
                          title="Prévisualiser"
                        >
                          <Eye className="h-5 w-5" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedQuote(quote);
                            setShowEditDialog(true);
                          }}
                          className="hover:bg-white/10 text-gray-300 hover:text-white h-9 w-9 p-0"
                          disabled={quote.status === "converted"}
                          title="Modifier"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>

                        {quote.status === "draft" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUpdateQuoteStatus(quote.id, "sent")}
                            className="hover:bg-blue-500/20 text-blue-400 h-9 w-9 p-0"
                            title="Envoyer le devis"
                          >
                            <Send className="h-5 w-5" />
                          </Button>
                        )}

                        {quote.status === "sent" && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSendReminder(quote)}
                              className="hover:bg-yellow-500/20 text-yellow-400 h-9 w-9 p-0"
                              title="Renvoyer le devis"
                            >
                              <Mail className="h-5 w-5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUpdateQuoteStatus(quote.id, "accepted")}
                              className="hover:bg-green-500/20 text-green-400 h-9 w-9 p-0"
                              title="Marquer comme accepté"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUpdateQuoteStatus(quote.id, "declined")}
                              className="hover:bg-red-500/20 text-red-400 h-9 w-9 p-0"
                              title="Marquer comme refusé"
                            >
                              <XCircle className="h-5 w-5" />
                            </Button>
                          </>
                        )}

                        {quote.status === "accepted" && !quote.convertedToInvoice && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleConvertToInvoice(quote)}
                            className="hover:bg-purple-500/20 text-purple-400 h-9 w-9 p-0"
                            title="Convertir en facture"
                          >
                            <ArrowRight className="h-5 w-5" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedQuote(quote);
                            setShowDeleteDialog(true);
                          }}
                          className="hover:bg-red-500/20 text-red-400 hover:text-red-300 h-9 w-9 p-0"
                          title="Supprimer"
                        >
                          <Trash className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Quote Dialog */}
      <QuoteCreationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={fetchData}
        clients={clients}
      />

      {/* Preview Dialog */}
      {selectedQuote && (
        <>
          <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
            <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20 text-white max-w-4xl">
              <DialogHeader>
                <DialogTitle>Aperçu du devis {selectedQuote.number}</DialogTitle>
                <DialogDescription className="text-white/60">
                  Visualisez le devis avant de l'exporter
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <QuoteGenerator
                  quote={{
                    ...selectedQuote,
                    date: selectedQuote.createdAt,
                  }}
                  freelanceInfo={freelanceInfo}
                />
              </div>
            </DialogContent>
          </Dialog>

          <QuoteEditDialog
            quote={selectedQuote}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            onSave={fetchData}
          />

          <DeleteConfirmDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            onConfirm={handleDeleteQuote}
            title="Supprimer le devis"
            description="Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible."
            itemName={`Devis ${selectedQuote.number} - ${selectedQuote.clientName} (${selectedQuote.amount.toLocaleString()}€)`}
            warningMessage={
              selectedQuote.status === "converted"
                ? "Ce devis a été converti en facture. La facture associée sera également supprimée."
                : selectedQuote.status === "accepted"
                ? "Ce devis a été accepté mais pas encore converti en facture."
                : undefined
            }
          />
        </>
      )}
    </motion.div>
  );
}
