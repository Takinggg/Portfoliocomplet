import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Edit, Mail, Phone, Calendar, MessageSquare, Send, Save, X, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { projectId } from "../../utils/supabase/info";
import { createClient } from "../../utils/supabase/client";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  source: string;
  interests?: string[];
  wantsAppointment?: boolean;
  createdAt: string;
}

interface LeadDetailDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
}

export function LeadDetailDialog({ lead, open, onOpenChange, onRefresh }: LeadDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const supabase = createClient();
  
  const [editedLead, setEditedLead] = useState({
    name: lead.name,
    email: lead.email,
    phone: lead.phone || "",
    message: lead.message,
    interests: lead.interests || [],
  });

  const [emailData, setEmailData] = useState({
    subject: `Re: ${lead.message.substring(0, 50)}...`,
    body: `Bonjour ${lead.name},\n\nMerci pour votre message.\n\n`,
  });

  // Save edited lead
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads/${encodeURIComponent(lead.id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(editedLead),
        }
      );

      if (response.ok) {
        toast.success("Lead mis à jour avec succès");
        setIsEditing(false);
        onRefresh();
      } else {
        toast.error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  // Send email (opens mailto link)
  const handleSendEmail = () => {
    const mailtoLink = `mailto:${lead.email}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
    window.location.href = mailtoLink;
    toast.success("Client email ouvert");
    setEmailDialogOpen(false);
  };

  // Convert lead to client
  const handleConvertToClient = async () => {
    if (lead.convertedToClient) {
      toast.info("Ce lead a déjà été converti en client");
      return;
    }

    setIsConverting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads/${encodeURIComponent(lead.id)}/convert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Lead converti en client avec succès !");
        onOpenChange(false);
        onRefresh();
      } else {
        toast.error(data.error || "Erreur lors de la conversion");
      }
    } catch (error) {
      console.error("Error converting lead to client:", error);
      toast.error("Erreur lors de la conversion");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-white/10 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl">Détails du lead</DialogTitle>
                <DialogDescription className="text-white/60 mt-1">
                  {isEditing ? "Modifiez les informations du lead" : "Consultez les informations complètes de ce lead"}
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                      onClick={() => setEmailDialogOpen(true)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    {!lead.convertedToClient && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                        onClick={handleConvertToClient}
                        disabled={isConverting}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {isConverting ? "Conversion..." : "Convertir en client"}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedLead({
                          name: lead.name,
                          email: lead.email,
                          phone: lead.phone || "",
                          message: lead.message,
                          interests: lead.interests || [],
                        });
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Basic Info Card */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-sm uppercase tracking-wide text-white/40 mb-4">Informations de contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wide">Nom</Label>
                  {isEditing ? (
                    <Input
                      value={editedLead.name}
                      onChange={(e) => setEditedLead({ ...editedLead, name: e.target.value })}
                      className="mt-2 bg-white/5 border-white/10 text-white"
                    />
                  ) : (
                    <p className="text-lg mt-2">{lead.name}</p>
                  )}
                </div>

                <div>
                  <Label className="text-white/60 text-xs uppercase tracking-wide">Email</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editedLead.email}
                      onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                      className="mt-2 bg-white/5 border-white/10 text-white"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-white/80">{lead.email}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-[#00FFC2] hover:bg-[#00FFC2]/10"
                        onClick={async () => {
                          const { copyToClipboard } = await import("../../utils/clipboardHelper");
                          await copyToClipboard(lead.email, "Email copié");
                        }}
                      >
                        <Mail className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {(lead.phone || isEditing) && (
                  <div className="md:col-span-2">
                    <Label className="text-white/60 text-xs uppercase tracking-wide">Téléphone</Label>
                    {isEditing ? (
                      <Input
                        value={editedLead.phone}
                        onChange={(e) => setEditedLead({ ...editedLead, phone: e.target.value })}
                        className="mt-2 bg-white/5 border-white/10 text-white"
                        placeholder="Numéro de téléphone"
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-white/80">{lead.phone}</p>
                        {lead.phone && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-[#00FFC2] hover:bg-[#00FFC2]/10"
                            onClick={async () => {
                              const { copyToClipboard } = await import("../../utils/clipboardHelper");
                              await copyToClipboard(lead.phone || "", "Téléphone copié");
                            }}
                          >
                            <Phone className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Message Card */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <Label className="text-white/60 text-xs uppercase tracking-wide flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4" />
                Message / Demande
              </Label>
              {isEditing ? (
                <Textarea
                  value={editedLead.message}
                  onChange={(e) => setEditedLead({ ...editedLead, message: e.target.value })}
                  className="bg-white/5 border-white/10 text-white min-h-[140px]"
                />
              ) : (
                <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{lead.message}</p>
              )}
            </div>

            {/* Additional Info */}
            {!isEditing && (
              <>
                {lead.interests && lead.interests.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <Label className="text-white/60 text-xs uppercase tracking-wide mb-3 block">Intérêts</Label>
                    <div className="flex flex-wrap gap-2">
                      {lead.interests.map((interest, idx) => (
                        <Badge key={idx} className="bg-[#00FFC2]/10 text-[#00FFC2] border-0 px-3 py-1">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Interests Editor in Edit Mode */}
            {isEditing && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <Label className="text-white/60 text-xs uppercase tracking-wide mb-3 block">Intérêts</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "Audit d'automatisation gratuit",
                    "Projet d'automatisation CRM",
                    "Design UI/UX / Redesign UI/UX",
                    "Intégration IA (chatbot, GPT)",
                    "Formation sur les outils no-code",
                    "Autre demande"
                  ].map((reason, index) => {
                    const isSelected = editedLead.interests.includes(reason);
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setEditedLead({
                              ...editedLead,
                              interests: editedLead.interests.filter(r => r !== reason)
                            });
                          } else {
                            setEditedLead({
                              ...editedLead,
                              interests: [...editedLead.interests, reason]
                            });
                          }
                        }}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg transition-all text-left
                          ${isSelected 
                            ? 'bg-[#00FFC2]/10 border-2 border-[#00FFC2]' 
                            : 'bg-neutral-900/50 border border-neutral-800 hover:border-[#00FFC2]/20'
                          }
                        `}
                      >
                        <div className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                          ${isSelected ? 'border-[#00FFC2]' : 'border-neutral-600'}
                        `}>
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#00FFC2]" />
                          )}
                        </div>
                        <span className={`text-sm ${isSelected ? 'text-white font-medium' : 'text-neutral-400'}`}>
                          {reason}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {!isEditing && (
              <>

                {lead.wantsAppointment && (
                  <div className="bg-[#00FFC2]/10 border border-[#00FFC2]/20 rounded-lg p-4">
                    <div className="flex items-center gap-3 text-[#00FFC2]">
                      <div className="h-10 w-10 rounded-full bg-[#00FFC2]/20 flex items-center justify-center">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <p className="font-medium">Souhaite un appel découverte</p>
                    </div>
                  </div>
                )}

                {lead.convertedToClient && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-3 text-green-400">
                      <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <UserPlus className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Converti en client</p>
                        {lead.convertedAt && (
                          <p className="text-xs text-green-400/60 mt-1">
                            Le {new Date(lead.convertedAt).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-white/40 pt-4 border-t border-white/10">
                  <span>Source: <span className="text-white/60">{lead.source}</span></span>
                  <span>Créé le <span className="text-white/60">{new Date(lead.createdAt).toLocaleDateString('fr-FR')}</span></span>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20 text-white">
          <DialogHeader>
            <DialogTitle>Envoyer un email à {lead.name}</DialogTitle>
            <DialogDescription className="text-white/60">
              Cela ouvrira votre client email par défaut
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Sujet</Label>
              <Input
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                className="mt-1 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                value={emailData.body}
                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                className="mt-1 bg-white/5 border-white/10 text-white min-h-[200px]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                onClick={() => setEmailDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
                onClick={handleSendEmail}
              >
                <Send className="h-4 w-4 mr-2" />
                Ouvrir dans Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

