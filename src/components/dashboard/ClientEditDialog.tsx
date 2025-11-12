import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { Loader2, Building, Mail, Phone, MapPin, DollarSign, User, CheckCircle2, Sparkles } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
  revenue?: number;
  status: "active" | "inactive" | "prospect";
  createdAt: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

interface ClientEditDialogProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientUpdated: () => void;
  leads?: Lead[];  // Optional leads for smart selection
}

export function ClientEditDialog({ client, open, onOpenChange, onClientUpdated, leads = [] }: ClientEditDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    address: "",
    revenue: "",
    status: "active" as "active" | "inactive" | "prospect",
  });
  const [saving, setSaving] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");

  // Filter out leads that are already converted
  const availableLeads = leads.filter(lead => 
    !lead.id.includes("converted") // Simple filter, adjust based on your data structure
  );

  const handleLeadSelect = (leadId: string) => {
    setSelectedLeadId(leadId);
    const selectedLead = availableLeads.find(l => l.id === leadId);
    if (selectedLead) {
      setFormData(prev => ({
        ...prev,
        name: selectedLead.name || prev.name,
        email: selectedLead.email || prev.email,
        phone: selectedLead.phone || prev.phone,
        company: selectedLead.company || prev.company,
      }));
      toast.success("Informations du lead chargées !");
    }
  };

  const resetLeadSelection = () => {
    setSelectedLeadId("");
    // Only reset if it's a new client (not editing)
    if (!client) {
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        address: "",
        revenue: "",
        status: "active",
      });
    }
  };

  useEffect(() => {
    if (open) {
      if (client) {
        setFormData({
          name: client.name || "",
          email: client.email || "",
          company: client.company || "",
          phone: client.phone || "",
          address: client.address || "",
          revenue: client.revenue?.toString() || "",
          status: client.status || "active",
        });
        setSelectedLeadId(""); // Reset lead selection when editing
      } else {
        // Reset form for new client
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          address: "",
          revenue: "",
          status: "active",
        });
        setSelectedLeadId("");
      }
    }
  }, [client, open]);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    setSaving(true);
    try {
      const { createClient } = await import("../../utils/supabase/client");
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const { projectId } = await import("../../utils/supabase/info");
      
      const isCreating = !client;
      const url = isCreating
        ? `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients`
        : `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients/${encodeURIComponent(client.id)}`;
      
      const response = await fetch(url, {
        method: isCreating ? "POST" : "PUT",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          revenue: formData.revenue ? parseFloat(formData.revenue) : 0,
          status: formData.status,
          ...(selectedLeadId && { lead_id: selectedLeadId }), // Include lead_id if converting from lead
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        
        console.error("❌ Server error:", response.status, errorData);
        
        // Message d'erreur spécifique pour 404
        if (response.status === 404) {
          throw new Error("Routes clients non déployées. Le serveur doit être redéployé sur Supabase. Consultez REDEPLOYER_SERVEUR.md");
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success(isCreating ? "Client créé avec succès" : "Client mis à jour avec succès");
        onClientUpdated();
        onOpenChange(false);
      } else {
        throw new Error(data.error || `Erreur lors de ${isCreating ? "la création" : "la mise à jour"}`);
      }
    } catch (error: any) {
      console.error("❌ Error saving client:", error);
      
      // Message d'erreur détaillé
      const errorMessage = error.message || `Erreur lors de ${client ? "la mise à jour" : "la création"} du client`;
      
      toast.error("Erreur de sauvegarde", {
        description: errorMessage,
        duration: error.message?.includes("redéployé") ? 10000 : 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { label: "Actif", color: "text-green-400", bg: "bg-green-500/10" };
      case "inactive":
        return { label: "Inactif", color: "text-gray-400", bg: "bg-gray-500/10" };
      case "prospect":
        return { label: "Prospect", color: "text-blue-400", bg: "bg-blue-500/10" };
      default:
        return { label: status, color: "text-white/60", bg: "bg-white/5" };
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20 text-white max-w-2xl max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <div className="border-b border-[#00FFC2]/10 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00FFC2]/10 flex items-center justify-center">
                <User className="h-4 w-4 text-[#00FFC2]" />
              </div>
              {client ? "Modifier le client" : "Nouveau client"}
            </DialogTitle>
            <DialogDescription className="text-white/60 mt-2">
              {client ? "Modifiez les informations du client" : "Ajoutez un nouveau client à votre base"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
          <div className="space-y-6">
            {/* Smart Lead Selector - Only show for new clients */}
            {!client && availableLeads.length > 0 && (
              <div className="p-4 rounded-xl border border-[#00FFC2]/30 bg-gradient-to-br from-[#00FFC2]/5 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00FFC2]/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#00FFC2]" />
                  </div>
                  <div>
                    <Label className="text-white font-medium text-base">Conversion intelligente depuis un lead</Label>
                    <p className="text-xs text-gray-400">Sélectionnez un lead pour pré-remplir les informations</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-300 flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      Sélectionner un lead (optionnel)
                    </Label>
                    <Select value={selectedLeadId} onValueChange={handleLeadSelect}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-11 text-base text-white">
                        <SelectValue placeholder="Choisir un lead..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                        {availableLeads.map((lead) => (
                          <SelectItem key={lead.id} value={lead.id} className="text-white hover:bg-white/10">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <div>
                                <div className="font-medium">{lead.name}</div>
                                <div className="text-xs text-gray-400">{lead.email}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedLeadId && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={resetLeadSelection}
                      className="w-full border-white/20 hover:bg-white/5 text-gray-300"
                    >
                      Réinitialiser et créer client vierge
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Informations principales */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-[#00FFC2]/20 to-transparent" />
                <span className="text-xs uppercase tracking-wider text-[#00FFC2]/60">Informations principales</span>
                <div className="h-px flex-1 bg-gradient-to-l from-[#00FFC2]/20 to-transparent" />
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/90">
                    <User className="h-3.5 w-3.5 text-[#00FFC2]" />
                    Nom complet
                    <span className="text-[#00FFC2] ml-1">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90">
                    <Mail className="h-3.5 w-3.5 text-[#00FFC2]" />
                    Email
                    <span className="text-[#00FFC2] ml-1">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john.doe@exemple.com"
                  />
                </div>
              </div>
            </div>

            {/* Informations complémentaires */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-[#00FFC2]/20 to-transparent" />
                <span className="text-xs uppercase tracking-wider text-[#00FFC2]/60">Informations complémentaires</span>
                <div className="h-px flex-1 bg-gradient-to-l from-[#00FFC2]/20 to-transparent" />
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-white/70">
                    <Building className="h-3.5 w-3.5 text-white/50" />
                    Entreprise
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Nom de l'entreprise"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white/70">
                    <Phone className="h-3.5 w-3.5 text-white/50" />
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-white/70">
                    <MapPin className="h-3.5 w-3.5 text-white/50" />
                    Adresse
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Rue de la République, 75001 Paris"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Statut et Finances */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-[#00FFC2]/20 to-transparent" />
                <span className="text-xs uppercase tracking-wider text-[#00FFC2]/60">Statut & Finances</span>
                <div className="h-px flex-1 bg-gradient-to-l from-[#00FFC2]/20 to-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-white/70">
                    <CheckCircle2 className="h-3.5 w-3.5 text-white/50" />
                    Statut
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive" | "prospect") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusConfig(formData.status).bg}`} />
                          <span>{getStatusConfig(formData.status).label}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active" className="focus:bg-white/10 focus:text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500/10" />
                          <span className="text-green-400">Actif</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="inactive" className="focus:bg-white/10 focus:text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gray-500/10" />
                          <span className="text-gray-400">Inactif</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="prospect" className="focus:bg-white/10 focus:text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500/10" />
                          <span className="text-blue-400">Prospect</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenue" className="text-white/70">
                    <DollarSign className="h-3.5 w-3.5 text-white/50" />
                    Revenu généré (€)
                  </Label>
                  <Input
                    id="revenue"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.revenue}
                    onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#00FFC2]/10 px-6 py-4 bg-black/20">
          <DialogFooter className="flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !formData.name.trim() || !formData.email.trim()}
              className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90 transition-all shadow-lg shadow-[#00FFC2]/20 hover:shadow-[#00FFC2]/30 hover:scale-[1.02]"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {client ? "Mettre à jour" : "Créer le client"}
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

