import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import { projectId } from "../../utils/supabase/info";
import { createClient } from "../../utils/supabase/client";

interface InvoiceEditInvoice {
  id: string;
  number?: string;
  invoiceNumber?: string;
  clientId: string;
  clientName?: string;
  amount?: number;
  total?: number;
  description?: string;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: string;
  createdAt: string;
}

interface InvoiceEditClient {
  id: string;
  name: string;
  email: string;
}

interface InvoiceEditDialogProps {
  invoice: InvoiceEditInvoice;
  clients: InvoiceEditClient[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
}

export function InvoiceEditDialog({ invoice, clients, open, onOpenChange, onRefresh }: InvoiceEditDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();
  
  const [editedInvoice, setEditedInvoice] = useState({
    clientId: invoice.clientId,
    amount: invoice.amount.toString(),
    description: invoice.description || "",
    dueDate: invoice.dueDate,
    status: invoice.status,
  });

  const handleSave = async () => {
    if (!editedInvoice.clientId || !editedInvoice.amount || !editedInvoice.dueDate) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    const selectedClient = clients.find((c) => c.id === editedInvoice.clientId);
    if (!selectedClient) {
      toast.error("Client introuvable");
      return;
    }

    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirÃ©e");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/invoices/${encodeURIComponent(invoice.id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            clientId: editedInvoice.clientId,
            clientName: selectedClient.name,
            amount: parseFloat(editedInvoice.amount),
            description: editedInvoice.description,
            dueDate: editedInvoice.dueDate,
            status: editedInvoice.status,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Check if email was sent
        if (data.emailSent) {
          toast.success(`Facture mise Ã  jour et email envoyÃ© Ã  ${selectedClient.name} !`);
        } else {
          toast.success("Facture mise Ã  jour avec succÃ¨s");
        }
        
        onOpenChange(false);
        onRefresh();
      } else {
        const error = await response.text();
        console.error("Error response:", error);
        toast.error("Erreur lors de la mise Ã  jour");
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Erreur lors de la mise Ã  jour");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0C0C0C] border-[#CCFF00]/20 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier la facture {invoice.number}</DialogTitle>
          <DialogDescription className="text-white/60">
            Modifiez les informations de la facture
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>Client *</Label>
            <Select
              value={editedInvoice.clientId}
              onValueChange={(value) => setEditedInvoice({ ...editedInvoice, clientId: value })}
            >
              <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="SÃ©lectionner un client" />
              </SelectTrigger>
              <SelectContent className="bg-[#0C0C0C] border-[#CCFF00]/20">
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Montant (â‚¬) *</Label>
            <Input
              type="number"
              step="0.01"
              value={editedInvoice.amount}
              onChange={(e) => setEditedInvoice({ ...editedInvoice, amount: e.target.value })}
              className="mt-1 bg-white/5 border-white/10 text-white"
              placeholder="1500.00"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={editedInvoice.description}
              onChange={(e) => setEditedInvoice({ ...editedInvoice, description: e.target.value })}
              className="mt-1 bg-white/5 border-white/10 text-white"
              placeholder="Description des services..."
              rows={3}
            />
          </div>

          <div>
            <Label>Date d'Ã©chÃ©ance *</Label>
            <Input
              type="date"
              value={editedInvoice.dueDate}
              onChange={(e) => setEditedInvoice({ ...editedInvoice, dueDate: e.target.value })}
              className="mt-1 bg-white/5 border-white/10 text-white"
            />
          </div>

          <div>
            <Label>Statut</Label>
            <Select
              value={editedInvoice.status}
              onValueChange={(value) => setEditedInvoice({ ...editedInvoice, status: value as InvoiceEditInvoice["status"] })}
            >
              <SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0C0C0C] border-[#CCFF00]/20">
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="sent">EnvoyÃ©e</SelectItem>
                <SelectItem value="paid">PayÃ©e</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
