import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { projectId } from "../../utils/supabase/info";
import { createClient } from "../../utils/supabase/client";

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
  status: string;
}

interface QuoteEditDialogProps {
  quote: Quote;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export function QuoteEditDialog({ quote, open, onOpenChange, onSave }: QuoteEditDialogProps) {
  const [formData, setFormData] = useState({
    amount: quote.amount.toString(),
    description: quote.description || "",
    validUntil: quote.validUntil,
    clientAddress: quote.clientAddress || "",
  });
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setFormData({
      amount: quote.amount.toString(),
      description: quote.description || "",
      validUntil: quote.validUntil,
      clientAddress: quote.clientAddress || "",
    });
  }, [quote]);

  const handleSave = async () => {
    if (!formData.amount || !formData.validUntil) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes/${encodeURIComponent(quote.id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            amount: parseFloat(formData.amount),
            description: formData.description,
            validUntil: formData.validUntil,
            clientAddress: formData.clientAddress,
          }),
        }
      );

      if (response.ok) {
        toast.success("Devis mis à jour avec succès");
        onSave();
        onOpenChange(false);
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Error updating quote:", error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20 text-white">
        <DialogHeader>
          <DialogTitle>Modifier le devis {quote.number}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Modifiez les informations du devis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-gray-300">Client</Label>
            <Input
              value={quote.clientName}
              disabled
              className="bg-white/5 border-white/10 mt-1 text-gray-400"
            />
          </div>

          <div>
            <Label className="text-gray-300">Montant (€) *</Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="bg-white/5 border-white/10 mt-1"
            />
          </div>

          <div>
            <Label className="text-gray-300">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white/5 border-white/10 mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label className="text-gray-300">Adresse du client</Label>
            <Textarea
              value={formData.clientAddress}
              onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
              className="bg-white/5 border-white/10 mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label className="text-gray-300">Valide jusqu'au *</Label>
            <Input
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              className="bg-white/5 border-white/10 mt-1"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 bg-white/5 border-white/10"
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

