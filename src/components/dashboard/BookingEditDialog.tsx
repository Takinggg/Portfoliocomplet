import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface BookingEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: any;
  onSave: (bookingData: any) => void;
  clients?: any[]; // Liste des clients pour sÃ©lection
}

export function BookingEditDialog({ open, onOpenChange, booking, onSave, clients = [] }: BookingEditDialogProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [hasRecurrence, setHasRecurrence] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    service: "",
    message: "",
    status: "pending",
    recurrence: {
      type: "none" as "none" | "daily" | "weekly" | "monthly",
      endDate: "",
      count: 1
    }
  });

  useEffect(() => {
    if (booking) {
      const recurrence = booking.recurrence || { type: "none", endDate: "", count: 1 };
      setFormData({
        name: booking.name || "",
        email: booking.email || "",
        phone: booking.phone || "",
        date: booking.date || "",
        time: booking.time || "",
        service: booking.service || "",
        message: booking.message || "",
        status: booking.status || "pending",
        recurrence
      });
      setHasRecurrence(recurrence.type !== "none");
      setSelectedClientId(""); // RÃ©initialiser la sÃ©lection client
    } else {
      // Nouveau booking - rÃ©initialiser tout
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        service: "",
        message: "",
        status: "pending",
        recurrence: { type: "none", endDate: "", count: 1 }
      });
      setHasRecurrence(false);
      setSelectedClientId("");
    }
  }, [booking, open]);

  // Fonction pour remplir le formulaire avec les donnÃ©es d'un client
  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    
    if (clientId && clientId !== "manual") {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setFormData({
          ...formData,
          name: client.name || client.display_name || "",
          email: client.email || "",
          phone: client.phone || ""
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#0C0C0C] border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Modifier le rendez-vous
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* SÃ©lection de client (seulement pour nouveau booking) */}
          {!booking && clients.length > 0 && (
            <div className="space-y-2 pb-2 border-b border-white/10">
              <Label className="text-white/80">Client</Label>
              <Select value={selectedClientId} onValueChange={handleClientSelect}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="SÃ©lectionner un client existant ou saisir manuellement" />
                </SelectTrigger>
                <SelectContent className="bg-[#0C0C0C] border-white/10 max-h-[300px]">
                  <SelectItem value="manual" className="text-white/60 hover:bg-white/5">
                    âœï¸ Saisie manuelle
                  </SelectItem>
                  {clients.map((client) => (
                    <SelectItem 
                      key={client.id} 
                      value={client.id}
                      className="text-white hover:bg-white/5"
                    >
                      <div className="flex flex-col">
                        <span>{client.name || client.display_name}</span>
                        {client.email && (
                          <span className="text-xs text-white/40">{client.email}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/80">Nom</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/80">TÃ©lÃ©phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service" className="text-white/80">Service</Label>
              <Input
                id="service"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Ex: Consultation, Rendez-vous..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-white/80">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-white/80">Heure</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-white/80">Statut</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0C0C0C] border-white/10">
                <SelectItem value="pending" className="text-white hover:bg-white/5">â³ En attente</SelectItem>
                <SelectItem value="confirmed" className="text-white hover:bg-white/5">âœ… ConfirmÃ©</SelectItem>
                <SelectItem value="cancelled" className="text-white hover:bg-white/5">âŒ AnnulÃ©</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Section RÃ©currence */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasRecurrence"
                checked={hasRecurrence}
                onChange={(e) => {
                  setHasRecurrence(e.target.checked);
                  if (!e.target.checked) {
                    setFormData({
                      ...formData,
                      recurrence: { type: "none", endDate: "", count: 1 }
                    });
                  }
                }}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#CCFF00] focus:ring-[#CCFF00]"
              />
              <Label htmlFor="hasRecurrence" className="text-white/80 cursor-pointer">
                ðŸ” Rendez-vous rÃ©current
              </Label>
            </div>

            {hasRecurrence && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-white/80">FrÃ©quence</Label>
                  <Select 
                    value={formData.recurrence.type} 
                    onValueChange={(value: any) => setFormData({
                      ...formData,
                      recurrence: { ...formData.recurrence, type: value }
                    })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0C0C0C] border-white/10">
                      <SelectItem value="daily" className="text-white hover:bg-white/5">ðŸ“… Quotidien</SelectItem>
                      <SelectItem value="weekly" className="text-white hover:bg-white/5">ðŸ“† Hebdomadaire</SelectItem>
                      <SelectItem value="monthly" className="text-white hover:bg-white/5">ðŸ—“ï¸ Mensuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">Nombre d'occurrences</Label>
                  <Input
                    type="number"
                    min="1"
                    max="52"
                    value={formData.recurrence.count}
                    onChange={(e) => setFormData({
                      ...formData,
                      recurrence: { ...formData.recurrence, count: parseInt(e.target.value) || 1 }
                    })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label className="text-white/80">Date de fin (optionnel)</Label>
                  <Input
                    type="date"
                    value={formData.recurrence.endDate}
                    onChange={(e) => setFormData({
                      ...formData,
                      recurrence: { ...formData.recurrence, endDate: e.target.value }
                    })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-white/80">Message / Notes</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-white/5 border-white/10 text-white min-h-[100px]"
              placeholder="Informations complÃ©mentaires..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
