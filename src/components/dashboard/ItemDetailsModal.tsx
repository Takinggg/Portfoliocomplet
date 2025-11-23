import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Phone, Calendar, DollarSign, FileText, User, Building, MapPin, Clock, CheckCircle, AlertCircle, Receipt, Edit, Briefcase, MessageSquare, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { exportQuoteToPDF, exportInvoiceToPDF } from "../../utils/pdfGenerator";
import { toast } from "sonner";
import { NotesTimeline } from "./NotesTimeline";
import { useState } from "react";

interface ItemDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  type: 'lead' | 'client' | 'quote' | 'invoice' | 'booking';
  onEdit?: () => void;
  onDelete?: () => void;
  relatedItems?: {
    quotes?: any[];
    invoices?: any[];
  };
}

export function ItemDetailsModal({ 
  open, 
  onOpenChange, 
  item, 
  type, 
  onEdit, 
  onDelete,
  relatedItems 
}: ItemDetailsModalProps) {
  if (!open || !item) return null;

  // Ã‰tat local pour les notes
  const [clientNotes, setClientNotes] = useState(item.clientNotes || []);

  const handleAddNote = (note: any) => {
    const newNote = {
      id: Date.now().toString(),
      ...note,
      createdAt: new Date().toISOString()
    };
    setClientNotes([...clientNotes, newNote]);
    toast.success('Note ajoutÃ©e !');
  };

  const handleDeleteNote = (noteId: string) => {
    setClientNotes(clientNotes.filter((n: any) => n.id !== noteId));
    toast.success('Note supprimÃ©e !');
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'draft': { label: 'ðŸ“ Brouillon', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
      'sent': { label: 'ðŸ“¤ EnvoyÃ©', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      'accepted': { label: 'âœ… AcceptÃ©', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
      'rejected': { label: 'âŒ RefusÃ©', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
      'pending': { label: 'â³ En attente', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
      'paid': { label: 'ðŸ’° PayÃ©e', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
      'unpaid': { label: 'â° ImpayÃ©e', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
      'overdue': { label: 'ðŸ”´ En retard', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    };
    const config = statusMap[status] || { label: status, color: 'bg-white/10 text-white/60 border-white/20' };
    return <Badge className={`${config.color} border`}>{config.label}</Badge>;
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return '0â‚¬';
    return `${amount.toLocaleString('fr-FR')}â‚¬`;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => onOpenChange(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[85vh] z-50"
          >
            <div className="bg-[#0C0C0C] border border-[#CCFF00]/20 rounded-2xl shadow-2xl shadow-[#CCFF00]/10 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#CCFF00]/5 to-transparent">
                <div className="flex items-center gap-3">
                  {type === 'lead' && <User className="w-6 h-6 text-blue-400" />}
                  {type === 'client' && <Building className="w-6 h-6 text-green-400" />}
                  {type === 'booking' && <Calendar className="w-6 h-6 text-green-400" />}
                  {type === 'quote' && <FileText className="w-6 h-6 text-yellow-400" />}
                  {type === 'invoice' && <Receipt className="w-6 h-6 text-[#CCFF00]" />}
                  
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {type === 'lead' && 'Lead'}
                      {type === 'client' && 'Client'}
                      {type === 'booking' && 'Rendez-vous'}
                      {type === 'quote' && `Devis #${item.number || item.id}`}
                      {type === 'invoice' && `Facture #${item.invoiceNumber || item.number || item.id}`}
                    </h2>
                    <p className="text-sm text-white/60">
                      {item.name || item.clientName || item.client_name || 'Sans nom'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Bouton Export PDF pour quotes et invoices */}
                  {(type === 'quote' || type === 'invoice') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        try {
                          if (type === 'quote') {
                            exportQuoteToPDF({
                              id: item.id,
                              clientName: item.clientName || item.client_name || 'Client inconnu',
                              clientEmail: item.clientEmail || item.client_email || '',
                              amount: parseFloat(item.total || item.amount || 0),
                              description: item.description || item.notes || '',
                              status: item.status || 'draft',
                              createdAt: item.createdAt || item.created_at || new Date().toISOString(),
                              validUntil: item.validUntil || item.valid_until
                            });
                          } else if (type === 'invoice') {
                            exportInvoiceToPDF({
                              id: item.id,
                              invoiceNumber: item.invoiceNumber || item.number,
                              clientName: item.clientName || item.client_name || 'Client inconnu',
                              clientEmail: item.clientEmail || item.client_email || '',
                              clientAddress: item.clientAddress || item.client_address,
                              clientCompany: item.clientCompany || item.client_company,
                              amount: parseFloat(item.total || item.amount || 0),
                              description: item.description || item.notes || '',
                              status: item.status || 'unpaid',
                              createdAt: item.createdAt || item.created_at || new Date().toISOString(),
                              dueDate: item.dueDate || item.due_date,
                              items: item.metadata?.items || item.items || []
                            });
                          }
                          toast.success('PDF exportÃ© avec succÃ¨s !');
                        } catch (error) {
                          console.error('Erreur export PDF:', error);
                          toast.error('Erreur lors de l\'export PDF');
                        }
                      }}
                      className="text-[#CCFF00] hover:text-[#CCFF00]/80 hover:bg-[#CCFF00]/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                  )}
                  
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onEdit}
                      className="text-white/60 hover:text-[#CCFF00]"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  <button
                    onClick={() => onOpenChange(false)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[calc(85vh-180px)] overflow-y-auto">
                {/* LEAD Details */}
                {type === 'lead' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <InfoCard icon={Mail} label="Email" value={item.email || 'N/A'} />
                      <InfoCard icon={Phone} label="TÃ©lÃ©phone" value={item.phone || 'N/A'} />
                      <InfoCard icon={Building} label="Entreprise" value={item.company || 'N/A'} />
                      <InfoCard icon={DollarSign} label="Valeur estimÃ©e" value={formatCurrency(item.value)} />
                      <InfoCard icon={Calendar} label="CrÃ©Ã© le" value={formatDate(item.createdAt || item.created_at)} />
                      <InfoCard icon={CheckCircle} label="Statut" value={item.status || 'N/A'} />
                    </div>

                    {item.notes && (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white/80 mb-2">Notes</h3>
                        <p className="text-sm text-white/60">{item.notes}</p>
                      </div>
                    )}

                    {/* Timeline des interactions */}
                    <NotesTimeline
                      entityId={item.id}
                      entityType="lead"
                      notes={clientNotes}
                      onAddNote={handleAddNote}
                      onDeleteNote={handleDeleteNote}
                    />
                  </div>
                )}

                {/* BOOKING Details */}
                {type === 'booking' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <InfoCard icon={User} label="Nom" value={item.name || 'N/A'} />
                      <InfoCard icon={Mail} label="Email" value={item.email || 'N/A'} />
                      <InfoCard icon={Phone} label="TÃ©lÃ©phone" value={item.phone || 'N/A'} />
                      <InfoCard icon={Calendar} label="Date" value={item.date || 'N/A'} />
                      <InfoCard icon={Clock} label="Heure" value={item.time || 'N/A'} />
                      <InfoCard icon={Briefcase} label="Service" value={item.service || 'N/A'} />
                      <InfoCard icon={Calendar} label="CrÃ©Ã© le" value={formatDate(item.createdAt || item.created_at)} />
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-white/40" />
                          <span className="text-xs text-white/40">Statut</span>
                        </div>
                        <div className="mt-2">{getStatusBadge(item.status)}</div>
                      </div>
                    </div>

                    {item.message && (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-white/60" />
                          Message
                        </h3>
                        <p className="text-sm text-white/60">{item.message}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* CLIENT Details */}
                {type === 'client' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <InfoCard icon={Mail} label="Email" value={item.email || 'N/A'} />
                      <InfoCard icon={Phone} label="TÃ©lÃ©phone" value={item.phone || 'N/A'} />
                      <InfoCard icon={Building} label="Entreprise" value={item.company || 'N/A'} />
                      <InfoCard icon={MapPin} label="Adresse" value={item.address || 'N/A'} />
                      <InfoCard icon={DollarSign} label="CA Total" value={formatCurrency(item.revenue)} />
                      <InfoCard icon={Calendar} label="Client depuis" value={formatDate(item.createdAt || item.created_at)} />
                    </div>

                    {/* Related Quotes & Invoices */}
                    {relatedItems && (
                      <div className="space-y-4">
                        {relatedItems.quotes && relatedItems.quotes.length > 0 && (
                          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-yellow-400" />
                              Devis ({relatedItems.quotes.length})
                            </h3>
                            <div className="space-y-2">
                              {relatedItems.quotes.map(quote => (
                                <div key={quote.id} className="flex items-center justify-between text-sm">
                                  <span className="text-white/60">Devis #{quote.number || quote.id}</span>
                                  <div className="flex items-center gap-2">
                                    {getStatusBadge(quote.status)}
                                    <span className="text-white font-medium">{formatCurrency(quote.amount || quote.total)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {relatedItems.invoices && relatedItems.invoices.length > 0 && (
                          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                              <Receipt className="w-4 h-4 text-[#CCFF00]" />
                              Factures ({relatedItems.invoices.length})
                            </h3>
                            <div className="space-y-2">
                              {relatedItems.invoices.map(invoice => (
                                <div key={invoice.id} className="flex items-center justify-between text-sm">
                                  <span className="text-white/60">Facture #{invoice.invoiceNumber || invoice.number || invoice.id}</span>
                                  <div className="flex items-center gap-2">
                                    {getStatusBadge(invoice.status)}
                                    <span className="text-white font-medium">{formatCurrency(invoice.total || invoice.amount)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Timeline des interactions */}
                    <NotesTimeline
                      entityId={item.id}
                      entityType="client"
                      notes={clientNotes}
                      onAddNote={handleAddNote}
                      onDeleteNote={handleDeleteNote}
                    />
                  </div>
                )}

                {/* QUOTE Details */}
                {type === 'quote' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <InfoCard icon={User} label="Client" value={item.clientName || item.client_name || 'N/A'} />
                      <InfoCard icon={Mail} label="Email" value={item.clientEmail || item.client_email || 'N/A'} />
                      <InfoCard icon={DollarSign} label="Montant" value={formatCurrency(item.amount || item.total)} />
                      <InfoCard icon={Calendar} label="ValiditÃ©" value={formatDate(item.validUntil || item.valid_until)} />
                      <InfoCard icon={Calendar} label="CrÃ©Ã© le" value={formatDate(item.createdAt || item.created_at)} />
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-white/40" />
                          <span className="text-xs text-white/40">Statut</span>
                        </div>
                        <div className="mt-2">{getStatusBadge(item.status)}</div>
                      </div>
                    </div>

                    {/* Items */}
                    {(item.items || item.metadata?.items) && (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white/80 mb-3">Lignes du devis</h3>
                        <div className="space-y-2">
                          {(item.items || item.metadata?.items || []).map((lineItem: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0">
                              <div className="flex-1">
                                <div className="text-white font-medium">{lineItem.description || lineItem.name}</div>
                                <div className="text-white/40 text-xs">
                                  QtÃ©: {lineItem.quantity} Ã— {formatCurrency(lineItem.unitPrice || lineItem.price)}
                                </div>
                              </div>
                              <div className="text-white font-semibold">
                                {formatCurrency((lineItem.quantity || 1) * (lineItem.unitPrice || lineItem.price || 0))}
                              </div>
                            </div>
                          ))}
                          <div className="flex items-center justify-between pt-3 border-t border-white/20">
                            <span className="text-white font-bold">Total</span>
                            <span className="text-[#CCFF00] font-bold text-lg">
                              {formatCurrency(item.amount || item.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {item.lastEmailSent && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-400" />
                        <div>
                          <div className="text-sm font-medium text-blue-400">Email envoyÃ©</div>
                          <div className="text-xs text-blue-400/60">
                            {new Date(item.lastEmailSent).toLocaleString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* INVOICE Details */}
                {type === 'invoice' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <InfoCard icon={User} label="Client" value={item.clientName || item.client_name || 'N/A'} />
                      <InfoCard icon={Mail} label="Email" value={item.clientEmail || item.client_email || 'N/A'} />
                      <InfoCard icon={DollarSign} label="Montant" value={formatCurrency(item.total || item.amount)} />
                      <InfoCard icon={Calendar} label="Date d'Ã©chÃ©ance" value={formatDate(item.dueDate || item.due_date)} />
                      <InfoCard icon={Calendar} label="CrÃ©Ã©e le" value={formatDate(item.createdAt || item.created_at)} />
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-white/40" />
                          <span className="text-xs text-white/40">Statut</span>
                        </div>
                        <div className="mt-2">{getStatusBadge(item.status)}</div>
                      </div>
                    </div>

                    {/* Items */}
                    {(item.items || item.metadata?.items) && (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white/80 mb-3">Lignes de la facture</h3>
                        <div className="space-y-2">
                          {(item.items || item.metadata?.items || []).map((lineItem: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0">
                              <div className="flex-1">
                                <div className="text-white font-medium">{lineItem.description || lineItem.name}</div>
                                <div className="text-white/40 text-xs">
                                  QtÃ©: {lineItem.quantity} Ã— {formatCurrency(lineItem.unitPrice || lineItem.price)}
                                </div>
                              </div>
                              <div className="text-white font-semibold">
                                {formatCurrency((lineItem.quantity || 1) * (lineItem.unitPrice || lineItem.price || 0))}
                              </div>
                            </div>
                          ))}
                          <div className="flex items-center justify-between pt-3 border-t border-white/20">
                            <span className="text-white font-bold">Total</span>
                            <span className="text-[#CCFF00] font-bold text-lg">
                              {formatCurrency(item.total || item.amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {item.lastEmailSent && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-400" />
                        <div>
                          <div className="text-sm font-medium text-blue-400">Email envoyÃ©</div>
                          <div className="text-xs text-blue-400/60">
                            {new Date(item.lastEmailSent).toLocaleString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    )}

                    {item.status === 'overdue' && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <div>
                          <div className="text-sm font-medium text-red-400">Facture en retard</div>
                          <div className="text-xs text-red-400/60">
                            Ã‰chÃ©ance dÃ©passÃ©e depuis {Math.floor((new Date().getTime() - new Date(item.dueDate || item.due_date).getTime()) / (1000 * 60 * 60 * 24))} jours
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-white/5">
                <div className="text-xs text-white/40">
                  ID: {item.id}
                </div>
                <div className="flex items-center gap-2">
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onDelete}
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                    >
                      Supprimer
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    className="bg-white/10 hover:bg-white/20 text-white"
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-white/40" />
        <span className="text-xs text-white/40">{label}</span>
      </div>
      <div className="text-sm font-medium text-white truncate">{value}</div>
    </div>
  );
}
