import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  FileText,
  User,
  Calendar,
  DollarSign,
  Settings,
  RefreshCw,
  X,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { motion, AnimatePresence } from "motion/react";

interface ReminderDetail {
  name: string;
  email: string;
  date: string;
  time: string;
  duration: string;
}

interface InvoiceReminderDetail {
  clientName: string;
  clientEmail: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
}

export default function EmailSettings() {
  const [isCheckingReminders, setIsCheckingReminders] = useState(false);
  const [isCheckingInvoices, setIsCheckingInvoices] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [reminderResults, setReminderResults] = useState<ReminderDetail[]>([]);
  const [invoiceResults, setInvoiceResults] = useState<InvoiceReminderDetail[]>([]);

  // Check for upcoming appointment reminders
  const checkReminders = async () => {
    setIsCheckingReminders(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/emails/check-reminders`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReminderResults(data.sentDetails || []);
        
        if (data.remindersSent > 0) {
          toast.success(`${data.remindersSent} rappel(s) de RDV envoyé(s) !`);
          setShowReminderDialog(true);
        } else {
          toast.info("Aucun rappel à envoyer aujourd'hui");
        }
      } else {
        throw new Error("Failed to check reminders");
      }
    } catch (error) {
      console.error("Error checking reminders:", error);
      toast.error("Erreur lors de la vérification des rappels");
    } finally {
      setIsCheckingReminders(false);
    }
  };

  // Check for overdue invoices
  const checkOverdueInvoices = async () => {
    setIsCheckingInvoices(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/emails/check-overdue-invoices`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setInvoiceResults(data.sentDetails || []);
        
        if (data.remindersSent > 0) {
          toast.success(`${data.remindersSent} relance(s) de facture envoyée(s) !`);
          setShowInvoiceDialog(true);
        } else {
          toast.info("Aucune relance de facture à envoyer");
        }
      } else {
        throw new Error("Failed to check invoices");
      }
    } catch (error) {
      console.error("Error checking invoices:", error);
      toast.error("Erreur lors de la vérification des factures");
    } finally {
      setIsCheckingInvoices(false);
    }
  };

  const emailTemplates = [
    {
      icon: User,
      title: "Confirmation Contact",
      description: "Envoyé automatiquement après réception d'un message",
      trigger: "Nouveau lead via formulaire contact",
      status: "active",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      icon: Calendar,
      title: "Confirmation RDV",
      description: "Envoyé après réservation d'un rendez-vous",
      trigger: "Nouveau booking confirmé",
      status: "active",
      color: "bg-green-500/10 text-green-500"
    },
    {
      icon: Clock,
      title: "Rappel RDV",
      description: "Rappel automatique 24h avant le rendez-vous",
      trigger: "24h avant un RDV",
      status: "active",
      color: "bg-yellow-500/10 text-yellow-500"
    },
    {
      icon: FileText,
      title: "Envoi Facture",
      description: "Email avec la facture en pièce jointe",
      trigger: "Création d'une facture",
      status: "active",
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      icon: DollarSign,
      title: "Relance Facture",
      description: "Relance pour facture impayée (tous les 7 jours)",
      trigger: "Facture en retard",
      status: "active",
      color: "bg-red-500/10 text-red-500"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">
          Emails Automatiques
        </h2>
        <p className="text-neutral-400">
          Gestion des emails automatisés et templates
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-[#00FFC2]" />
              Rappels de RDV
            </CardTitle>
            <CardDescription>
              Vérifier et envoyer les rappels pour les RDV de demain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={checkReminders}
              disabled={isCheckingReminders}
              className="w-full bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
            >
              {isCheckingReminders ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Vérification en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer les rappels
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-[#00FFC2]" />
              Relances Factures
            </CardTitle>
            <CardDescription>
              Vérifier et envoyer les relances pour factures impayées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={checkOverdueInvoices}
              disabled={isCheckingInvoices}
              className="w-full bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
            >
              {isCheckingInvoices ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Vérification en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer les relances
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Email Templates */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#00FFC2]" />
            Templates d'emails configurés
          </CardTitle>
          <CardDescription>
            Tous les emails sont envoyés automatiquement via Resend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emailTemplates.map((template, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-neutral-800/50 border border-neutral-700 hover:border-[#00FFC2]/30 transition-all"
              >
                <div className={`p-3 rounded-lg ${template.color}`}>
                  <template.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{template.title}</h4>
                    <Badge variant="outline" className="border-[#00FFC2] text-[#00FFC2]">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {template.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-400 mb-2">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Settings className="h-3 w-3" />
                    Trigger: {template.trigger}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Info */}
      <Card className="bg-gradient-to-br from-[#00FFC2]/5 to-transparent border-[#00FFC2]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#00FFC2]">
            <AlertCircle className="h-5 w-5" />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-neutral-300">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#00FFC2] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Service d'email : Resend</p>
              <p className="text-xs text-neutral-400">
                API Key configurée via RESEND_API_KEY
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#00FFC2] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Templates HTML professionnels</p>
              <p className="text-xs text-neutral-400">
                Design cohérent avec la charte graphique (#00FFC2)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Automatisation recommandée</p>
              <p className="text-xs text-neutral-400">
                Configurez un cron job pour exécuter automatiquement les vérifications de rappels et relances (recommandé : tous les jours à 9h)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reminder Results Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <CheckCircle2 className="h-6 w-6 text-[#00FFC2]" />
              Rappels de RDV envoyés
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {reminderResults.length} rappel(s) envoyé(s) avec succès
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            <AnimatePresence>
              {reminderResults.map((reminder, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-br from-[#00FFC2]/10 to-[#00FFC2]/5 rounded-xl border border-[#00FFC2]/20 hover:border-[#00FFC2]/40 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#00FFC2]/20 rounded-lg">
                      <Calendar className="h-5 w-5 text-[#00FFC2]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{reminder.name}</h4>
                        <Badge className="bg-[#00FFC2]/20 text-[#00FFC2] border-[#00FFC2]/30">
                          <Check className="h-3 w-3 mr-1" />
                          Envoyé
                        </Badge>
                      </div>
                      <p className="text-sm text-white/60 mb-2">{reminder.email}</p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg">
                          <Calendar className="h-3 w-3 text-[#00FFC2]" />
                          <span className="text-white/80">
                            {new Date(reminder.date).toLocaleDateString('fr-FR', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg">
                          <Clock className="h-3 w-3 text-[#00FFC2]" />
                          <span className="text-white/80">{reminder.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg">
                          <span className="text-white/80">{reminder.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <Button
              onClick={() => setShowReminderDialog(false)}
              className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Results Dialog */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <CheckCircle2 className="h-6 w-6 text-[#00FFC2]" />
              Relances de factures envoyées
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {invoiceResults.length} relance(s) envoyée(s) avec succès
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            <AnimatePresence>
              {invoiceResults.map((invoice, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <DollarSign className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{invoice.clientName}</h4>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {invoice.daysOverdue}j de retard
                        </Badge>
                      </div>
                      <p className="text-sm text-white/60 mb-2">{invoice.clientEmail}</p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg">
                          <FileText className="h-3 w-3 text-[#00FFC2]" />
                          <span className="text-white/80">Facture #{invoice.invoiceNumber}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg">
                          <DollarSign className="h-3 w-3 text-[#00FFC2]" />
                          <span className="text-white/80">{invoice.amount.toLocaleString()}€</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg">
                          <Clock className="h-3 w-3 text-red-400" />
                          <span className="text-white/80">
                            Échéance: {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <Button
              onClick={() => setShowInvoiceDialog(false)}
              className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
