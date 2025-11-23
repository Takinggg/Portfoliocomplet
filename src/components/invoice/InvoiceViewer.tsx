import { motion } from 'motion/react';
import { Loader2, AlertCircle, Download, Printer, CreditCard, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { useState } from 'react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { useTranslation } from '../../utils/i18n/useTranslation';

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

interface InvoiceViewerProps {
  invoice: InvoiceData | null;
  loading: boolean;
  error: string | null;
}

const getStatusConfig = (status: string, labels: Record<string, string>) => {
  const config: Record<string, { label: string; bgColor: string; textColor: string; icon: string }> = {
    draft: { label: labels.draft ?? 'Draft', bgColor: 'bg-gray-900/50', textColor: 'text-gray-300', icon: 'ðŸ“' },
    sent: { label: labels.sent ?? 'Sent', bgColor: 'bg-blue-900/50', textColor: 'text-blue-200', icon: 'ðŸ“¤' },
    paid: { label: labels.paid ?? 'Paid', bgColor: 'bg-green-900/50', textColor: 'text-green-200', icon: 'âœ…' },
    overdue: { label: labels.overdue ?? 'Overdue', bgColor: 'bg-red-900/50', textColor: 'text-red-200', icon: 'âš ï¸' },
  };

  return config[status as keyof typeof config] || config.draft;
};

export default function InvoiceViewer({ invoice, loading, error }: InvoiceViewerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { t, language } = useTranslation();
  const invoiceTexts = (t as any)?.invoice ?? {};
  const locale = language === 'en' ? 'en-US' : 'fr-FR';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    toast.info(invoiceTexts.toast?.downloadTitle ?? 'PDF', {
      description: invoiceTexts.toast?.downloadDescription,
    });
    setTimeout(() => window.print(), 100);
  };

  const handlePayment = async () => {
    if (!invoice) return;

    try {
      setIsProcessing(true);
      
      // Convert amount to number (in case it's stored as string)
      const amountNumber = typeof invoice.amount === 'string' 
        ? parseFloat(invoice.amount) 
        : invoice.amount;
      
      console.log('ðŸ’° Invoice payment details:', {
        originalAmount: invoice.amount,
        convertedAmount: amountNumber,
        type: typeof invoice.amount,
        convertedType: typeof amountNumber
      });
      
      // Validate minimum amount (Stripe requires â‚¬0.50 minimum)
      if (amountNumber < 0.50) {
        toast.error(invoiceTexts.toast?.minAmountTitle, {
          description: invoiceTexts.toast?.minAmountDescription,
        });
        setIsProcessing(false);
        return;
      }
      
      // Get current URL for redirects
      const currentUrl = window.location.origin;
      const token = window.location.pathname.split('/').pop();
      
      // Call the Stripe endpoint via Edge Function
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/stripe/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            invoiceNumber: invoice.number,
            invoiceId: token,
            amount: amountNumber,
            currency: 'eur',
            clientName: invoice.clientName,
            clientEmail: invoice.clientEmail,
            successUrl: `${currentUrl}/invoice/${token}/success`,
            cancelUrl: `${currentUrl}/invoice/${token}`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create payment session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error(invoiceTexts.toast?.paymentErrorTitle, {
        description: err instanceof Error ? err.message : invoiceTexts.toast?.paymentErrorDescription,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C0C0C]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="flex justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-[#CCFF00]" />
          </div>
          <p className="text-[#888888]">{invoiceTexts.loading}</p>
        </motion.div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C0C0C] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md space-y-6"
        >
          <div className="flex justify-center">
            <AlertCircle className="w-16 h-16 text-red-500/70" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#F4F4F4]">{invoiceTexts.error?.title}</h1>
            <p className="text-[#888888]">
              {error || invoiceTexts.error?.description}
            </p>
          </div>
          <div className="pt-4">
            <p className="text-sm text-[#666666]">
              {invoiceTexts.error?.support} <a href="mailto:contact@maxence.design" className="text-[#CCFF00] hover:underline">{invoiceTexts.labels?.contactUs}</a>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const dueDate = invoice?.dueDate ? new Date(invoice.dueDate) : new Date();
  const invoiceDate = invoice?.date ? new Date(invoice.date) : new Date();
  const isOverdue = dueDate < new Date() && invoice.status !== 'paid';
  const statusConfig = getStatusConfig(invoice.status, invoiceTexts.status ?? {});
  const totalAmount = invoice.amount || 0;

  return (
    <div className="min-h-screen bg-[#0C0C0C] py-8 px-4 print:bg-white print:py-0 print:px-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Action Bar - Hidden in print */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3 print:hidden">
          <div className="flex-1 flex gap-3">
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="bg-[#141414] border-[#222222] text-[#F4F4F4] hover:bg-[#1A1A1A] flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{invoiceTexts.actions?.downloadPdf}</span>
              <span className="sm:hidden">PDF</span>
            </Button>

            <Button
              onClick={handlePrint}
              variant="outline"
              className="bg-[#141414] border-[#222222] text-[#F4F4F4] hover:bg-[#1A1A1A] flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{invoiceTexts.actions?.print}</span>
              <span className="sm:hidden">{invoiceTexts.actions?.print}</span>
            </Button>
          </div>

          {invoice.status !== 'paid' && (
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="bg-[#CCFF00] text-[#0C0C0C] hover:bg-[#00E5AD] font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {invoiceTexts.actions?.processingShort}
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  {invoiceTexts.actions?.payNow}
                </>
              )}
            </Button>
          )}
        </div>

        {/* Main Invoice Card */}
        <div className="bg-[#141414] border border-[#222222] rounded-xl overflow-hidden shadow-2xl print:shadow-none print:rounded-none print:border-none print:bg-white">
          
          {/* Header Section - Dark with mint accent */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0C0C0C] via-[#0C0C0C] to-[#1A1A1A] px-8 py-12 sm:px-12 sm:py-16 print:bg-white print:text-black print:py-8">
            {/* Accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#CCFF00] to-transparent print:hidden"></div>

            <div className="relative z-10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-[#F4F4F4] mb-2 print:text-black">
                    {invoiceTexts.labels?.title}
                  </h1>
                  <p className="text-lg text-[#888888] font-mono print:text-gray-600">
                    {invoice.number}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <Badge 
                    variant="outline" 
                    className={`${statusConfig.bgColor} ${statusConfig.textColor} border-0 px-4 py-2 text-base font-semibold print:border print:bg-white print:text-black`}
                  >
                    <span className="mr-2">{statusConfig.icon}</span>
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-8 py-12 sm:px-12 sm:py-16 space-y-10 print:text-black">
            
            {/* Party Information - 2 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              {/* From (Provider) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <p className="text-xs font-semibold text-[#CCFF00] uppercase tracking-widest print:text-black">
                  {invoiceTexts.labels?.provider}
                </p>
                <div className="space-y-3">
                  <p className="font-bold text-[#F4F4F4] text-lg print:text-black">
                    {invoice.freelance?.name || 'N/A'}
                  </p>
                  <div className="text-sm text-[#888888] space-y-1 print:text-gray-700">
                    {invoice.freelance?.address && (
                      <p>{invoice.freelance.address}</p>
                    )}
                    {invoice.freelance?.email && (
                      <p>{invoice.freelance.email}</p>
                    )}
                  </div>
                  <div className="pt-3 border-t border-[#222222] space-y-1 print:border-gray-300">
                    {invoice.freelance?.siret && (
                      <p className="text-xs text-[#666666] print:text-gray-600">
                        SIRET: <span className="font-mono">{invoice.freelance.siret}</span>
                      </p>
                    )}
                    {invoice.freelance?.tva && (
                      <p className="text-xs text-[#666666] print:text-gray-600">
                        {invoice.freelance.tva}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* To (Client) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <p className="text-xs font-semibold text-[#CCFF00] uppercase tracking-widest print:text-black">
                  {invoiceTexts.labels?.billTo}
                </p>
                <div className="space-y-3">
                  <p className="font-bold text-[#F4F4F4] text-lg print:text-black">
                    {invoice.clientName || 'N/A'}
                  </p>
                  <div className="text-sm text-[#888888] space-y-1 print:text-gray-700">
                    {invoice.clientAddress && (
                      <p>{invoice.clientAddress}</p>
                    )}
                    {invoice.clientEmail && (
                      <p>{invoice.clientEmail}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Dates - 2 Columns */}
            <div className="grid grid-cols-2 gap-8 bg-[#0C0C0C] -mx-8 sm:-mx-12 px-8 sm:px-12 py-8 print:bg-white print:mx-0 print:px-0 print:py-4 print:border-y print:border-gray-300">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <p className="text-xs font-semibold text-[#CCFF00] uppercase tracking-widest mb-2 print:text-black">
                  {invoiceTexts.labels?.issueDate}
                </p>
                <p className="text-lg font-semibold text-[#F4F4F4] print:text-black">
                  {invoiceDate.toLocaleDateString(locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <p className="text-xs font-semibold text-[#CCFF00] uppercase tracking-widest mb-2 print:text-black">
                  {invoiceTexts.labels?.dueDate}
                </p>
                <p className={`text-lg font-semibold ${isOverdue ? 'text-red-500/80 print:text-red-600' : 'text-[#F4F4F4] print:text-black'}`}>
                  {dueDate.toLocaleDateString(locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </motion.div>
            </div>

            {/* Items Table */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <p className="text-xs font-semibold text-[#CCFF00] uppercase tracking-widest print:text-black">
                {invoiceTexts.labels?.details}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#222222] print:border-gray-300">
                      <th className="text-left py-4 text-[#F4F4F4] font-bold print:text-black">
                        {invoiceTexts.labels?.description}
                      </th>
                      <th className="text-right py-4 text-[#F4F4F4] font-bold print:text-black">
                        {invoiceTexts.labels?.quantity}
                      </th>
                      <th className="text-right py-4 text-[#F4F4F4] font-bold print:text-black">
                        {invoiceTexts.labels?.unitPrice}
                      </th>
                      <th className="text-right py-4 text-[#F4F4F4] font-bold print:text-black">
                        {invoiceTexts.labels?.amount}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items && invoice.items.length > 0 ? (
                      invoice.items.map((item, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                          className="border-b border-[#1A1A1A] hover:bg-[#0C0C0C] transition-colors print:border-gray-200 print:hover:bg-transparent"
                        >
                          <td className="py-4 text-[#888888] print:text-gray-700">
                            {item.description}
                          </td>
                          <td className="py-4 text-right text-[#888888] print:text-gray-700">
                            {item.quantity}
                          </td>
                          <td className="py-4 text-right text-[#888888] print:text-gray-700">
                            {item.unitPrice.toFixed(2)} â‚¬
                          </td>
                          <td className="py-4 text-right font-semibold text-[#F4F4F4] print:text-black">
                            {item.amount.toFixed(2)} â‚¬
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-[#666666] text-sm print:text-gray-500">
                          {invoiceTexts.labels?.empty}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Summary - Right aligned */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-end"
            >
              <div className="w-full sm:w-96 space-y-3 text-sm">
                <div className="flex justify-between text-[#888888] print:text-gray-700">
                  <span>{invoiceTexts.labels?.subtotal}</span>
                  <span className="font-mono">{(invoice.subtotal || 0).toFixed(2)} â‚¬</span>
                </div>

                {(invoice.tax || 0) > 0 && (
                  <div className="flex justify-between text-[#888888] print:text-gray-700">
                    <span>{invoiceTexts.labels?.tax}</span>
                    <span className="font-mono">{(invoice.tax || 0).toFixed(2)} â‚¬</span>
                  </div>
                )}

                <div className="bg-[#CCFF00]/10 border border-[#CCFF00]/30 rounded-lg px-4 py-3 mt-4 print:bg-[#CCFF00]/20 print:border-[#CCFF00]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#F4F4F4] font-bold print:text-black">{invoiceTexts.labels?.total}</span>
                    <span className="text-2xl font-bold text-[#CCFF00] font-mono print:text-black">
                      {totalAmount.toFixed(2)} â‚¬
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="bg-[#CCFF00]/5 border border-[#CCFF00]/20 rounded-lg p-6 space-y-4 print:bg-gray-50 print:border-gray-300"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">ðŸ’³</span>
                <div className="flex-1">
                  <h3 className="font-bold text-[#F4F4F4] mb-3 print:text-black">
                    {invoiceTexts.labels?.paymentMethods}
                  </h3>
                  <p className="text-sm text-[#888888] mb-4 print:text-gray-700">
                    {invoiceTexts.labels?.methodsList}
                  </p>

                  {invoice.freelance?.iban && (
                    <div className="bg-[#0C0C0C] border border-[#222222] rounded p-4 font-mono text-sm print:bg-white print:border-gray-300">
                      <p className="text-xs text-[#666666] mb-2 print:text-gray-600">{invoiceTexts.labels?.iban}</p>
                      <p className="text-[#CCFF00] break-all print:text-black">
                        {invoice.freelance.iban}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Status Message */}
            {isOverdue && invoice.status !== 'paid' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-start gap-3 print:hidden"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">
                  {invoiceTexts.labels?.overdue}
                </p>
              </motion.div>
            )}

            {/* Legal Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="pt-8 border-t border-[#222222] space-y-3 print:border-gray-300 print:pt-6"
            >
              <p className="text-xs text-[#666666] leading-relaxed print:text-gray-600">
                {invoiceTexts.labels?.legalNotice}
              </p>
              <p className="text-xs text-[#666666] print:text-gray-600">
                {invoiceTexts.labels?.signature}
              </p>
            </motion.div>

          </div>

          {/* Footer - Dark with mint accent */}
          <div className="relative bg-gradient-to-r from-[#0C0C0C] to-[#1A1A1A] px-8 sm:px-12 py-8 border-t border-[#222222] text-center print:bg-gray-100 print:border-gray-300 print:text-black">
            {/* Accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent to-[#CCFF00] print:hidden"></div>

            <p className="text-sm text-[#F4F4F4] mb-2 font-semibold print:text-black">
              {invoiceTexts.labels?.thanks}
            </p>
            <p className="text-xs text-[#888888] print:text-gray-700">
              {invoice.freelance?.name} â€¢ {invoice.freelance?.email}
              {invoice.freelance?.siret && ` â€¢ SIRET: ${invoice.freelance.siret}`}
            </p>
          </div>

        </div>

        {/* Bottom CTA - Hidden in print */}
        {invoice.status !== 'paid' && totalAmount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center print:hidden space-y-4"
          >
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              size="lg"
              className="bg-[#CCFF00] text-[#0C0C0C] hover:bg-[#00E5AD] font-bold text-lg px-8 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {invoiceTexts.actions?.processing}
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  {`${invoiceTexts.actions?.payAmountPrefix} ${totalAmount.toFixed(2)} ${invoiceTexts.actions?.payAmountSuffix}`}
                </>
              )}
            </Button>
            <p className="text-xs text-[#888888]">
              {invoiceTexts.actions?.securePayment}
            </p>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-12 text-center print:hidden space-y-2"
        >
          <p className="text-sm text-[#888888]">
            {invoiceTexts.labels?.helpQuestion}
          </p>
          <a
            href="mailto:contact@maxence.design"
            className="inline-flex items-center gap-2 text-[#CCFF00] hover:text-[#00E5AD] transition-colors text-sm font-medium"
          >
            {invoiceTexts.labels?.contactUs}
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>

      </motion.div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

