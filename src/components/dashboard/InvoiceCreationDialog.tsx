import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Sparkles, Plus, Trash2, FileText } from "lucide-react";
import { createClient } from "../../utils/supabase/client";
import { projectId } from "../../utils/supabase/info";

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  address?: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  clients: Client[];
  invoice?: any;
}

export function InvoiceCreationDialog({ open, onOpenChange, onSuccess, clients, invoice }: InvoiceCreationDialogProps) {
  const [creating, setCreating] = useState(false);
  const supabase = createClient();

  // Form data
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"draft" | "sent" | "paid" | "overdue">("draft");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, total: 0 }
  ]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (invoice) {
      // Mode édition
      setSelectedClientId(invoice.client_id || "");
      setInvoiceNumber(invoice.invoice_number || "");
      setIssueDate(invoice.issue_date || "");
      setDueDate(invoice.due_date || "");
      setStatus(invoice.status || "draft");
      setItems(invoice.items || [{ id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, total: 0 }]);
      setNotes(invoice.notes || "");
      
      const client = clients.find(c => c.id === invoice.client_id);
      if (client) setSelectedClient(client);
    } else {
      // Mode création - générer un numéro auto
      const now = new Date();
      const invoiceNum = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      setInvoiceNumber(invoiceNum);
      setIssueDate(now.toISOString().split('T')[0]);
      
      // Date d'échéance par défaut : +30 jours
      const due = new Date(now);
      due.setDate(due.getDate() + 30);
      setDueDate(due.toISOString().split('T')[0]);
    }
  }, [invoice, clients, open]);

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client || null);
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tva = subtotal * 0.20; // TVA 20%
  const total = subtotal + tva;

  const handleSubmit = async () => {
    if (!selectedClientId) {
      alert("Veuillez sélectionner un client");
      return;
    }

    if (items.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      alert("Veuillez remplir tous les items correctement");
      return;
    }

    setCreating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      const invoiceData = {
        client_id: selectedClientId,
        client_name: selectedClient?.name || "",
        invoice_number: invoiceNumber,
        issue_date: issueDate,
        due_date: dueDate,
        status,
        items: items.map(({ id, ...item }) => item),
        subtotal,
        tva,
        total,
        notes
      };

      const url = invoice
        ? `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/invoices/${invoice.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/invoices`;

      const method = invoice ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(invoiceData)
      });

      if (!response.ok) throw new Error("Erreur lors de la création");

      onSuccess();
      onOpenChange(false);
      
      // Reset
      setSelectedClientId("");
      setSelectedClient(null);
      setItems([{ id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, total: 0 }]);
      setNotes("");
      setStatus("draft");
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-[#0C0C0C] border-[#00FFC2]/20">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <DialogTitle className="text-white text-lg">
                {invoice ? "Modifier la facture" : "Créer une nouvelle facture"}
              </DialogTitle>
              <p className="text-xs text-white/60 mt-0.5">
                {invoice ? "Modifiez les informations de la facture" : "Générez une facture professionnelle pour votre client"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Client Selection */}
          <div className="p-3 rounded-lg border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <Label className="text-white/90 text-sm font-semibold">Client</Label>
            </div>
            
            <Select value={selectedClientId} onValueChange={handleClientChange}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white h-9 text-sm">
                <SelectValue placeholder="Sélectionnez un client..." />
              </SelectTrigger>
              <SelectContent className="bg-[#0C0C0C] border-white/10">
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center gap-2">
                      <span>{client.name}</span>
                      {client.company && <span className="text-white/40 text-xs">({client.company})</span>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedClient && (
              <div className="mt-2 p-2 bg-white/5 rounded-lg space-y-0.5">
                <p className="text-xs text-white">{selectedClient.name}</p>
                <p className="text-xs text-white/60">{selectedClient.email}</p>
                {selectedClient.address && (
                  <p className="text-xs text-white/40">{selectedClient.address}</p>
                )}
              </div>
            )}
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-white/80 text-xs">N° Facture</Label>
              <Input
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="bg-white/5 border-white/10 text-white h-9 text-sm"
                placeholder="INV-2025-001"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/80 text-xs">Date d'émission</Label>
              <Input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="bg-white/5 border-white/10 text-white h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/80 text-xs">Date d'échéance</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-white/5 border-white/10 text-white h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-white/80 text-xs">Statut</Label>
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0C0C0C] border-white/10">
                <SelectItem value="draft">📝 Brouillon</SelectItem>
                <SelectItem value="sent">📤 Envoyée</SelectItem>
                <SelectItem value="paid">💰 Payée</SelectItem>
                <SelectItem value="overdue">⏰ En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white/90 text-sm font-semibold">Prestations</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addItem}
                className="gap-1.5 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 h-8 px-3 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter
              </Button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={item.id} className="p-3 bg-white/5 rounded-lg border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">Prestation {index + 1}</span>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="h-6 w-6 p-0 hover:bg-red-500/20 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>

                  <Textarea
                    placeholder="Description de la prestation..."
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    className="bg-white/5 border-white/10 text-white min-h-[50px] text-sm"
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <div key={`quantity-${item.id}`} className="space-y-1">
                      <Label className="text-xs text-white/60">Quantité</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                        className="bg-white/5 border-white/10 text-white h-9 text-sm"
                      />
                    </div>

                    <div key={`price-${item.id}`} className="space-y-1">
                      <Label className="text-xs text-white/60">Prix unitaire (€)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="bg-white/5 border-white/10 text-white h-9 text-sm"
                      />
                    </div>

                    <div key={`total-${item.id}`} className="space-y-1">
                      <Label className="text-xs text-white/60">Total</Label>
                      <div className="h-9 px-3 rounded-md bg-orange-500/10 border border-orange-500/20 flex items-center">
                        <span className="text-orange-400 font-semibold text-sm">{item.total.toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="p-3 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-lg border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-white/70 text-sm">
              <span>Sous-total HT</span>
              <span className="font-semibold">{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex items-center justify-between text-white/70 text-sm">
              <span>TVA (20%)</span>
              <span className="font-semibold">{tva.toFixed(2)} €</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-white">Total TTC</span>
              <span className="text-xl font-bold text-orange-400">{total.toFixed(2)} €</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-white/80 text-xs">Notes (optionnel)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Conditions de paiement, modalités..."
              className="bg-white/5 border-white/10 text-white min-h-[60px] text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={creating || !selectedClientId}
              className="flex-1 bg-orange-500 text-white hover:bg-orange-600 h-9"
            >
              {creating ? "Création..." : invoice ? "Mettre à jour" : "Créer la facture"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 text-white hover:bg-white/10 h-9"
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
