import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import '../../styles/invoice-print.css';

interface InvoiceData {
  number: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  amount: number;
  notes?: string;
  freelance: {
    name: string;
    email: string;
    address: string;
    siret: string;
    tva: string;
    iban: string;
  };
}

export default function InvoiceViewPage() {
  const { token } = useParams<{ token: string }>();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Lien invalide');
      setLoading(false);
      return;
    }

    fetchInvoice();
  }, [token]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/invoices/view/${token}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Impossible de charger la facture');
      }

      setInvoice(data.invoice);
    } catch (err: any) {
      console.error('Error fetching invoice:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePayment = () => {
    toast.info('Paiement Stripe - Prochainement disponible', {
      description: 'L\'intégration Stripe sera ajoutée bientôt'
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      draft: { label: 'Brouillon', className: 'bg-gray-100 text-gray-800' },
      sent: { label: 'Envoyée', className: 'bg-white text-gray-700 border border-gray-300' },
      paid: { label: 'Payée', className: 'bg-green-100 text-green-800' },
      overdue: { label: 'En retard', className: 'bg-red-100 text-red-800' },
    };

    const { label, className } = config[status as keyof typeof config] || config.draft;
    
    return (
      <Badge variant="outline" className={`${className} text-xs px-3 py-1`}>
        {label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#00FFC2] mx-auto mb-4" />
          <p className="text-gray-600">Chargement de la facture...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl mb-2" style={{ fontWeight: 700 }}>Facture introuvable</h1>
          <p className="text-gray-600 mb-6">{error || 'Cette facture n\'existe pas ou le lien a expiré.'}</p>
        </div>
      </div>
    );
  }

  const dueDate = invoice?.dueDate ? new Date(invoice.dueDate) : new Date();
  const invoiceDate = invoice?.date ? new Date(invoice.date) : new Date();
  const isOverdue = dueDate < new Date() && invoice.status !== 'paid';

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-8 px-4 print:bg-white print:py-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Action buttons - Hidden in print */}
        <div className="mb-6 flex gap-3 print:hidden">
          <Button 
            onClick={handlePrint} 
            variant="outline" 
            className="bg-white border-gray-300"
          >
            Télécharger PDF
          </Button>
          
          {invoice.status !== 'paid' && (
            <Button 
              onClick={handlePayment} 
              className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00E5AD]"
            >
              Payer maintenant
            </Button>
          )}
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm print:shadow-none print:rounded-none">
          
          {/* Header - Black */}
          <div className="bg-[#0C0C0C] text-white px-12 py-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl mb-1" style={{ fontWeight: 700, letterSpacing: '0.02em' }}>
                FACTURE
              </h1>
              <p className="text-gray-400 text-sm">{invoice.number}</p>
            </div>
            <div>
              {getStatusBadge(invoice.status)}
            </div>
          </div>

          {/* Body */}
          <div className="px-12 py-10">
            
            {/* From / To - 2 columns */}
            <div className="grid grid-cols-2 gap-16 mb-12">
              {/* From */}
              <div>
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">
                  {invoice.freelance?.name || 'N/A'}
                </p>
                <div className="text-sm text-gray-600 space-y-0.5">
                  <p>{invoice.freelance?.address || 'N/A'}</p>
                  <p>{invoice.freelance?.email || 'N/A'}</p>
                </div>
                <div className="text-xs text-gray-500 mt-3 space-y-0.5">
                  <p>SIRET : {invoice.freelance?.siret || 'N/A'}</p>
                  <p>{invoice.freelance?.tva || 'N/A'}</p>
                </div>
              </div>

              {/* To */}
              <div>
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">
                  {invoice.clientName}
                </p>
                <div className="text-sm text-gray-600 space-y-0.5">
                  {invoice.clientAddress && <p>{invoice.clientAddress}</p>}
                  <p>{invoice.clientEmail}</p>
                </div>
              </div>
            </div>

            {/* Dates - 2 columns */}
            <div className="grid grid-cols-2 gap-16 mb-12 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">Date d'émission</p>
                <p className="text-gray-900">
                  {invoiceDate.toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Date d'échéance</p>
                <p className={isOverdue ? 'text-red-600' : 'text-gray-900'}>
                  {dueDate.toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-10">
              <h3 className="text-xs text-gray-500 mb-4 uppercase tracking-wider">
                Détails de la prestation
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-gray-900" style={{ fontWeight: 500 }}>
                      Description
                    </th>
                    <th className="text-right py-3 text-gray-900" style={{ fontWeight: 500 }}>
                      Quantité
                    </th>
                    <th className="text-right py-3 text-gray-900" style={{ fontWeight: 500 }}>
                      Prix unitaire
                    </th>
                    <th className="text-right py-3 text-gray-900" style={{ fontWeight: 500 }}>
                      Montant
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items && invoice.items.length > 0 ? (
                    invoice.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 text-gray-700">{item.description}</td>
                        <td className="py-4 text-right text-gray-700">{item.quantity}</td>
                        <td className="py-4 text-right text-gray-700">{item.unitPrice.toFixed(2)} €</td>
                        <td className="py-4 text-right text-gray-900" style={{ fontWeight: 500 }}>
                          {item.amount.toFixed(2)} €
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">
                        Aucun élément dans cette facture
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals - Right aligned */}
            <div className="flex justify-end mb-12">
              <div className="w-80 space-y-2 text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="text-gray-900">{(invoice.subtotal || 0).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">TVA</span>
                  <span className="text-gray-900">{(invoice.tax || 0).toFixed(2)} €</span>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-3 flex justify-between bg-[#D9FFF4] px-4 py-3 -mx-4 rounded">
                  <span className="text-gray-900" style={{ fontWeight: 600 }}>Total</span>
                  <span className="text-xl text-gray-900" style={{ fontWeight: 700 }}>
                    {(invoice.amount || 0).toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-[#FFFEF0] border-l-2 border-[#FFD700] p-6 rounded-r mb-8">
              <div className="flex gap-2 items-start">
                <span className="text-xl">💳</span>
                <div className="flex-1">
                  <h3 className="text-sm mb-2" style={{ fontWeight: 600 }}>
                    Moyens acceptés : Virement bancaire, PayPal, Carte bancaire
                  </h3>
                  {invoice.freelance?.iban && (
                    <div className="bg-white border border-gray-200 rounded p-3 mt-3">
                      <p className="text-xs text-gray-500 mb-1">IBAN</p>
                      <p className="font-mono text-sm text-gray-900">
                        {invoice.freelance.iban}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Legal notice */}
            <div className="text-xs text-gray-500 leading-relaxed">
              <p className="mb-2">
                À la réception et dès la date d'échéance, tout paiement effectué après application des délais donnera lieu, à titre de pénalité de retard, à la facturation d'un intérêt au montant total à acquitter, déterminé à un taux égal à trois fois le taux de l'intérêt légal en vigueur en France. 
                À compter de la date d'exigibilité de cette présente facture jusqu'à la date de paiement du règlement de cette dernière.
              </p>
            </div>

          </div>

          {/* Footer - Black */}
          <div className="bg-[#0C0C0C] text-white px-12 py-6 text-center">
            <p className="text-sm mb-2">Merci pour votre confiance !</p>
            <p className="text-xs text-gray-400">
              Cette facture a été générée automatiquement et ne nécessite pas de signature.
            </p>
            <div className="border-t border-white/10 mt-4 pt-4">
              <p className="text-xs text-gray-400">
                {invoice.freelance?.name || 'N/A'} • {invoice.freelance?.address || 'N/A'} • {invoice.freelance?.email || 'N/A'}
                <br />
                Entreprise Individuelle - Micro entrepreneur - SIRET : {invoice.freelance?.siret || 'N/A'}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom CTA - Hidden in print */}
        {invoice.status !== 'paid' && invoice.amount && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center print:hidden"
          >
            <Button 
              onClick={handlePayment}
              size="lg"
              className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00E5AD] shadow-lg"
            >
              Payer {invoice.amount.toFixed(2)} € maintenant
            </Button>
            <p className="text-xs text-gray-500 mt-3">
              Paiement sécurisé • Stripe • Aucune commission
            </p>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}
