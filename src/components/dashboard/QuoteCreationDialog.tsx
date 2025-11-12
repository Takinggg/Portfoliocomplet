import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Info, 
  Calendar,
  Euro,
  FileText,
  User,
  Building,
  Mail,
  MapPin,
  Calculator,
  AlertCircle,
  ChevronRight,
  Sparkles,
  CheckCircle
} from "lucide-react";
import { projectId } from "../../utils/supabase/info";
import { createClient } from "../../utils/supabase/client";

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  address?: string;
  city?: string;
  country?: string;
}

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface QuoteCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  clients: Client[];
  quote?: any;
  onSave?: (quoteData: any) => Promise<void>;
}

export function QuoteCreationDialog({ open, onOpenChange, onSuccess, clients, quote, onSave }: QuoteCreationDialogProps) {
  const [step, setStep] = useState(1);
  const [creating, setCreating] = useState(false);
  const supabase = createClient();

  // Form data
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [status, setStatus] = useState("draft");
  const [validUntil, setValidUntil] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([
    { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, total: 0 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [notes, setNotes] = useState("");
  const [includeConditions, setIncludeConditions] = useState(true);
  const [paymentTerms, setPaymentTerms] = useState("30% à la signature, solde à la livraison");
  const [deliveryDelay, setDeliveryDelay] = useState("4 à 6 semaines");
  const [revisions, setRevisions] = useState("2 cycles de révisions");

  useEffect(() => {
    if (selectedClientId) {
      const client = clients.find(c => c.id === selectedClientId);
      setSelectedClient(client || null);
    }
  }, [selectedClientId, clients]);

  // Pré-remplir le formulaire quand on édite un devis
  useEffect(() => {
    console.log('🔍 QuoteDialog useEffect:', { open, quote, quoteData: quote });
    if (open && quote) {
      console.log('✏️ Mode édition - pré-remplissage du formulaire', quote);
      setSelectedClientId(quote.clientId || "");
      setStatus(quote.status || "draft");
      setValidUntil(quote.validUntil || "");
      // Les items sont dans quote.metadata.items
      setItems(quote.metadata?.items || quote.items || [{ id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, total: 0 }]);
      setDiscount(quote.metadata?.discount?.value || quote.discount || 0);
      setDiscountType(quote.metadata?.discount?.type || quote.discountType || "percentage");
      setNotes(quote.metadata?.notes || quote.notes || "");
      setIncludeConditions(quote.includeConditions ?? true);
      setPaymentTerms(quote.metadata?.paymentTerms || quote.paymentTerms || "30% à la signature, solde à la livraison");
      setDeliveryDelay(quote.metadata?.deliveryDelay || quote.deliveryDelay || "4 à 6 semaines");
      setRevisions(quote.metadata?.revisions || quote.revisions || "2 cycles de révisions");
      setStep(1);
    } else if (open && !quote) {
      console.log('➕ Mode création - formulaire vide');
      // Réinitialiser le formulaire pour un nouveau devis
      setSelectedClientId("");
      setSelectedClient(null);
      setStatus("draft");
      setValidUntil("");
      setItems([{ id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, total: 0 }]);
      setDiscount(0);
      setDiscountType("percentage");
      setNotes("");
      setIncludeConditions(true);
      setPaymentTerms("30% à la signature, solde à la livraison");
      setDeliveryDelay("4 à 6 semaines");
      setRevisions("2 cycles de révisions");
      setStep(1);
    }
  }, [open, quote]);

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
    }
  };

  const resetClientSelection = () => {
    setSelectedClientId("");
    setSelectedClient(null);
  };

  useEffect(() => {
    // Set default valid until date (30 days from now)
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    setValidUntil(defaultDate.toISOString().split('T')[0]);
  }, [open]);

  const addItem = () => {
    setItems([...items, { 
      id: crypto.randomUUID(), 
      description: "", 
      quantity: 1, 
      unitPrice: 0, 
      total: 0 
    }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
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

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (discountType === "percentage") {
      return (subtotal * discount) / 100;
    }
    return discount;
  };

  const calculateTotal = () => {
    return Math.max(0, calculateSubtotal() - calculateDiscount());
  };

  const generateQuoteNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `DEV-${year}${month}-${random}`;
  };

  const buildDescription = () => {
    return items
      .filter(item => item.description.trim())
      .map(item => `${item.description} (${item.quantity} × ${item.unitPrice.toLocaleString('fr-FR')} €)`)
      .join('\n');
  };

  const handleNext = () => {
    if (step === 1) {
      if (!selectedClientId) {
        toast.error("Veuillez sélectionner un client");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const hasValidItems = items.some(item => item.description.trim() && item.unitPrice > 0);
      if (!hasValidItems) {
        toast.error("Veuillez ajouter au moins une prestation");
        return;
      }
      setStep(3);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleCreate = async () => {
    if (!selectedClient || !validUntil) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    const hasValidItems = items.some(item => item.description.trim() && item.unitPrice > 0);
    if (!hasValidItems) {
      toast.error("Veuillez ajouter au moins une prestation");
      return;
    }

    setCreating(true);
    try {
      const quoteNumber = quote?.number || generateQuoteNumber();
      const description = buildDescription();
      const totalAmount = calculateTotal();

      const quoteData = {
        number: quoteNumber,
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientEmail: selectedClient.email,
        clientAddress: selectedClient.address 
          ? `${selectedClient.address}${selectedClient.city ? `, ${selectedClient.city}` : ''}${selectedClient.country ? `, ${selectedClient.country}` : ''}`
          : undefined,
        amount: totalAmount,
        description,
        validUntil,
        status: status,
        metadata: {
          items: items.filter(item => item.description.trim()),
          discount: discount > 0 ? { type: discountType, value: discount } : null,
          subtotal: calculateSubtotal(),
          notes,
          paymentTerms,
          deliveryDelay,
          revisions
        }
      };

      // Utiliser onSave si fourni (mode édition), sinon créer via API
      if (onSave) {
        await onSave(quoteData);
        toast.success("Devis modifié avec succès !");
        resetForm();
        onSuccess();
        onOpenChange(false);
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Session expirée");
          return;
        }

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify(quoteData),
          }
        );

        if (response.ok) {
          toast.success("Devis créé avec succès !");
          resetForm();
          onSuccess();
          onOpenChange(false);
        } else {
          const error = await response.json();
          toast.error(error.error || "Erreur lors de la création du devis");
        }
      }
    } catch (error) {
      console.error("Error creating quote:", error);
      toast.error("Erreur lors de la création du devis");
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedClientId("");
    setSelectedClient(null);
    setItems([{ id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, total: 0 }]);
    setDiscount(0);
    setDiscountType("percentage");
    setNotes("");
    setIncludeConditions(true);
    setPaymentTerms("30% à la signature, solde à la livraison");
    setDeliveryDelay("4 à 6 semaines");
    setRevisions("2 cycles de révisions");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00FFC2]/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#00FFC2]" />
            </div>
            <div>
              <DialogTitle className="text-2xl">
                {quote ? "Modifier le devis" : "Créer un nouveau devis"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Étape {step} sur 3 : {
                  step === 1 ? "Sélection du client" :
                  step === 2 ? "Détails des prestations" :
                  "Conditions et finalisation"
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-[#00FFC2]" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Client Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Smart Client Selector */}
              <div className="p-4 rounded-xl border border-[#00FFC2]/30 bg-gradient-to-br from-[#00FFC2]/5 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00FFC2]/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#00FFC2]" />
                  </div>
                  <div>
                    <Label className="text-white font-medium text-base">Sélection intelligente du client</Label>
                    <p className="text-xs text-gray-400">Les informations seront automatiquement remplies</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-300 flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      Client *
                    </Label>
                    <Select value={selectedClientId} onValueChange={handleClientSelect}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-11 text-base text-white">
                        <SelectValue placeholder="Choisir un client..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0C0C0C] border-[#00FFC2]/20">
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id} className="text-white hover:bg-white/10">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <div>
                                <div className="font-medium">{client.name}</div>
                                {client.company && (
                                  <div className="text-xs text-gray-400">{client.company}</div>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedClientId && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={resetClientSelection}
                      className="w-full border-white/20 hover:bg-white/5 text-gray-300"
                    >
                      Réinitialiser la sélection
                    </Button>
                  )}
                </div>
              </div>

              {selectedClient && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-white/5 border-[#00FFC2]/20">
                    <CardHeader>
                      <CardTitle className="text-sm text-[#00FFC2] flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Informations du client sélectionné
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-[#00FFC2]" />
                        <span className="text-gray-300">{selectedClient.name}</span>
                      </div>
                      {selectedClient.company && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="w-4 h-4 text-[#00FFC2]" />
                          <span className="text-gray-300">{selectedClient.company}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-[#00FFC2]" />
                        <span className="text-gray-300">{selectedClient.email}</span>
                      </div>
                      {selectedClient.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-[#00FFC2]" />
                          <span className="text-gray-300">
                            {selectedClient.address}
                            {selectedClient.city && `, ${selectedClient.city}`}
                            {selectedClient.country && `, ${selectedClient.country}`}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <div>
                <Label className="text-gray-300 flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  Date de validité du devis *
                </Label>
                <Input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="bg-white/5 border-white/10 h-11 text-base text-white"
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Le devis sera valable jusqu'à cette date
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Items */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#00FFC2]" />
                  Prestations
                </h3>
                <Button
                  onClick={addItem}
                  size="sm"
                  className="bg-[#00FFC2] hover:bg-[#00FFC2]/90 text-black font-medium"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter
                </Button>
              </div>

              {/* Items list */}
              <div className="space-y-3">
                {items.map((item, index) => (
                  <Card key={item.id} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-300">
                          Prestation {index + 1}
                        </span>
                        {items.length > 1 && (
                          <Button
                            onClick={() => removeItem(item.id)}
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        )}
                      </div>

                      {/* Description */}
                      <div className="mb-3">
                        <Label className="text-xs text-gray-400 mb-1.5 block">Description *</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Ex: Développement site web vitrine"
                          className="bg-black/30 border-white/10 text-sm h-20 resize-none"
                        />
                      </div>

                      {/* Quantité / Prix / Total */}
                      <div className="grid grid-cols-3 gap-3">
                        <div key={`quantity-${item.id}`}>
                          <Label className="text-xs text-gray-400 mb-1.5 block">Quantité</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                            className="bg-black/30 border-white/10 h-10 text-center text-white"
                          />
                        </div>

                        <div key={`price-${item.id}`}>
                          <Label className="text-xs text-gray-400 mb-1.5 block">Prix unitaire (€)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="bg-black/30 border-white/10 h-10 text-white"
                          />
                        </div>

                        <div key={`total-${item.id}`}>
                          <Label className="text-xs text-gray-400 mb-1.5 block">Total</Label>
                          <div className="bg-[#00FFC2]/10 border border-[#00FFC2]/30 rounded-md h-10 flex items-center justify-center text-[#00FFC2] font-semibold text-sm">
                            {item.total.toLocaleString('fr-FR')} €
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="bg-white/10" />

              {/* Discount Section */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#00FFC2]" />
                    Réduction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-gray-400 mb-1.5 block">Type de réduction</Label>
                      <Select value={discountType} onValueChange={(value: any) => setDiscountType(value)}>
                        <SelectTrigger className="bg-black/30 border-white/10 h-10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                          <SelectItem value="fixed">Montant fixe (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-400 mb-1.5 block">
                        Montant {discountType === "percentage" ? "(%)" : "(€)"}
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        max={discountType === "percentage" ? "100" : undefined}
                        step={discountType === "percentage" ? "1" : "0.01"}
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        className="bg-black/30 border-white/10 h-10 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-gray-400 mb-1.5 block">Réduction appliquée</Label>
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-md h-10 flex items-center justify-center text-orange-400 font-semibold text-sm">
                        - {calculateDiscount().toLocaleString('fr-FR')} €
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Totals */}
              <Card className="bg-gradient-to-br from-[#00FFC2]/10 to-[#00FFC2]/5 border-[#00FFC2]/30">
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-300">Sous-total HT</span>
                    <span className="font-semibold text-white">
                      {calculateSubtotal().toLocaleString('fr-FR')} €
                    </span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-base">
                      <span className="text-gray-300">Réduction</span>
                      <span className="font-semibold text-orange-400">
                        - {calculateDiscount().toLocaleString('fr-FR')} €
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-base">
                    <span className="text-gray-300">TVA</span>
                    <span className="font-medium text-gray-400">Non applicable</span>
                  </div>
                  
                  <Separator className="bg-white/20" />
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold text-white">Total TTC</span>
                    <span className="text-3xl font-bold text-[#00FFC2]">
                      {calculateTotal().toLocaleString('fr-FR')} €
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Conditions */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {quote && (
                <div>
                  <Label className="text-gray-300 mb-2 block">Statut du devis</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">📝 Brouillon</SelectItem>
                      <SelectItem value="sent">📤 Envoyé</SelectItem>
                      <SelectItem value="pending">⏳ En attente</SelectItem>
                      <SelectItem value="accepted">✅ Accepté</SelectItem>
                      <SelectItem value="rejected">❌ Refusé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label className="text-gray-300 mb-2 block">Notes / Informations supplémentaires</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ajoutez des informations complémentaires pour le client..."
                  className="bg-white/5 border-white/10 text-base text-white"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#00FFC2]" />
                  <span className="text-sm text-gray-300">Inclure les conditions générales</span>
                </div>
                <Switch
                  checked={includeConditions}
                  onCheckedChange={setIncludeConditions}
                />
              </div>

              {includeConditions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-sm text-gray-300">Conditions commerciales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs text-gray-400">Modalités de paiement</Label>
                        <Input
                          value={paymentTerms}
                          onChange={(e) => setPaymentTerms(e.target.value)}
                          className="bg-black/20 border-white/10 text-base mt-1 h-11 text-white"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-400">Délai de livraison</Label>
                        <Input
                          value={deliveryDelay}
                          onChange={(e) => setDeliveryDelay(e.target.value)}
                          className="bg-black/20 border-white/10 text-base mt-1 h-11 text-white"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-400">Révisions incluses</Label>
                        <Input
                          value={revisions}
                          onChange={(e) => setRevisions(e.target.value)}
                          className="bg-black/20 border-white/10 text-base mt-1 h-11 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Final Summary */}
              <Card className="bg-black/60 border-[#00FFC2]/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5 text-[#00FFC2]" />
                    Récapitulatif du devis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Client</span>
                    <span className="font-semibold text-white">{selectedClient?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Nombre de prestations</span>
                    <span className="font-semibold text-white">
                      {items.filter(i => i.description.trim()).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Valide jusqu'au</span>
                    <span className="font-semibold text-white">
                      {new Date(validUntil).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <Separator className="bg-white/20 my-2" />
                  <div className="flex justify-between text-xl pt-2">
                    <span className="font-bold text-white">Montant total TTC</span>
                    <span className="font-bold text-[#00FFC2] text-2xl">
                      {calculateTotal().toLocaleString('fr-FR')} €
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-2 pt-4 border-t border-white/10">
          {step > 1 && (
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="flex-1 bg-white/5 border-white/10"
              disabled={creating}
            >
              Précédent
            </Button>
          )}
          
          {step < 3 ? (
            <Button
              onClick={handleNext}
              className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={creating}
              className="flex-1 bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
            >
              {creating ? "Création en cours..." : "Créer le devis"}
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

