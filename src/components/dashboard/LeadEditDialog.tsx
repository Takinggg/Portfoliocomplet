import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { X } from "lucide-react";

interface LeadEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: any;
  onSave: (leadData: any) => Promise<void>;
}

export function LeadEditDialog({ open, onOpenChange, lead, onSave }: LeadEditDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "new",
    source: "",
    notes: "",
    value: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        status: lead.status || "new",
        source: lead.source || "",
        notes: lead.notes || "",
        value: lead.value?.toString() || ""
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "new",
        source: "",
        notes: "",
        value: ""
      });
    }
  }, [lead, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        ...formData,
        value: parseFloat(formData.value) || 0
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving lead:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#0C0C0C] border-[#00FFC2]/20">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            {lead ? "Modifier le lead" : "Nouveau lead"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/80">Nom complet*</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Email*</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/80">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-white/80">Entreprise</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Acme Inc"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-white/80">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0C0C0C] border-white/10">
                  <SelectItem value="new">🆕 Nouveau</SelectItem>
                  <SelectItem value="contacted">💬 Contacté</SelectItem>
                  <SelectItem value="qualified">✅ Qualifié</SelectItem>
                  <SelectItem value="proposal">📄 Proposition</SelectItem>
                  <SelectItem value="negotiation">💰 Négociation</SelectItem>
                  <SelectItem value="won">🎉 Gagné</SelectItem>
                  <SelectItem value="lost">❌ Perdu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value" className="text-white/80">Valeur estimée (€)</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                placeholder="5000"
                min="0"
                step="100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source" className="text-white/80">Source</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              placeholder="LinkedIn, Référence, Site web..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white/80">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-white/5 border-white/10 text-white min-h-[100px]"
              placeholder="Notes sur le lead..."
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
            >
              {loading ? "Enregistrement..." : lead ? "Mettre à jour" : "Créer le lead"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 text-white hover:bg-white/10"
            >
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
