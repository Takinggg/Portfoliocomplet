import { Button } from "../ui/button";
import { Download, Printer } from "lucide-react";
import { FreelanceInfo } from "../../utils/freelanceConfig";

interface InvoiceData {
  number: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  amount: number;
  description?: string;
  status: string;
}

interface InvoiceGeneratorProps {
  invoice: InvoiceData;
  freelanceInfo: FreelanceInfo;
  onDownload?: () => void;
}

export function InvoiceGenerator({ invoice, freelanceInfo, onDownload }: InvoiceGeneratorProps) {
  
  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Facture ${invoice.number}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            padding: 40px;
            color: #0C0C0C;
            background: white;
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 60px;
            padding-bottom: 30px;
            border-bottom: 3px solid #00FFC2;
          }
          
          .logo-section h1 {
            font-size: 32px;
            font-weight: 700;
            color: #0C0C0C;
            margin-bottom: 8px;
          }
          
          .logo-section .accent {
            color: #00FFC2;
          }
          
          .invoice-info {
            text-align: right;
          }
          
          .invoice-number {
            font-size: 24px;
            font-weight: 700;
            color: #0C0C0C;
            margin-bottom: 8px;
          }
          
          .invoice-date {
            color: #666;
            font-size: 14px;
          }
          
          .parties {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 60px;
          }
          
          .party h3 {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #666;
            margin-bottom: 12px;
          }
          
          .party-info {
            background: #F4F4F4;
            padding: 20px;
            border-radius: 8px;
          }
          
          .party-info p {
            margin-bottom: 6px;
            line-height: 1.6;
            color: #0C0C0C;
          }
          
          .party-info .name {
            font-weight: 700;
            font-size: 16px;
            margin-bottom: 10px;
          }
          
          .items-table {
            width: 100%;
            margin-bottom: 40px;
            border-collapse: collapse;
          }
          
          .items-table thead {
            background: #0C0C0C;
            color: white;
          }
          
          .items-table th {
            padding: 16px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .items-table td {
            padding: 20px 16px;
            border-bottom: 1px solid #E5E5E5;
          }
          
          .items-table tbody tr:hover {
            background: #F9F9F9;
          }
          
          .total-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 60px;
          }
          
          .total-box {
            width: 300px;
            background: #0C0C0C;
            color: white;
            padding: 24px;
            border-radius: 8px;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .total-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-top: 12px;
            border-top: 2px solid #00FFC2;
          }
          
          .total-row.final {
            font-size: 24px;
            font-weight: 700;
          }
          
          .total-row.final .amount {
            color: #00FFC2;
          }
          
          .payment-info {
            background: #F4F4F4;
            padding: 24px;
            border-radius: 8px;
            margin-bottom: 40px;
          }
          
          .payment-info h3 {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 16px;
            color: #0C0C0C;
          }
          
          .payment-info p {
            margin-bottom: 8px;
            color: #333;
            line-height: 1.6;
          }
          
          .footer {
            text-align: center;
            padding-top: 40px;
            border-top: 1px solid #E5E5E5;
            color: #666;
            font-size: 12px;
            line-height: 1.8;
          }
          
          .status-badge {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 8px;
          }
          
          .status-draft {
            background: #E5E5E5;
            color: #666;
          }
          
          .status-sent {
            background: #DBEAFE;
            color: #1E40AF;
          }
          
          .status-paid {
            background: #D1FAE5;
            color: #065F46;
          }
          
          .status-overdue {
            background: #FEE2E2;
            color: #991B1B;
          }
          
          @media print {
            body {
              padding: 0;
            }
            
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Header -->
          <div class="header">
            <div class="logo-section">
              <h1>${freelanceInfo.name.split(' ')[0]} <span class="accent">${freelanceInfo.name.split(' ').slice(1).join(' ')}</span></h1>
              <p style="color: #666; margin-top: 4px;">Développeur Freelance</p>
            </div>
            <div class="invoice-info">
              <div class="invoice-number">Facture N° ${invoice.number}</div>
              <div class="invoice-date">
                Date d'émission : ${new Date(invoice.date).toLocaleDateString('fr-FR')}<br>
                Date d'échéance : ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
              </div>
              <div class="status-badge status-${invoice.status.toLowerCase()}">
                ${invoice.status === 'draft' ? 'Brouillon' : invoice.status === 'sent' ? 'Envoyée' : invoice.status === 'paid' ? 'Payée' : 'En retard'}
              </div>
            </div>
          </div>
          
          <!-- Parties -->
          <div class="parties">
            <div class="party">
              <h3>Prestataire</h3>
              <div class="party-info">
                <p class="name">${freelanceInfo.name}</p>
                ${freelanceInfo.legalStatus ? `<p style="font-size: 13px; color: #666; margin-bottom: 8px;">${freelanceInfo.legalStatus}</p>` : ''}
                <p>${freelanceInfo.address}</p>
                <p>${freelanceInfo.email}</p>
                <p>${freelanceInfo.phone}</p>
                ${freelanceInfo.siret ? `<p style="margin-top: 12px; font-weight: 600;">SIRET : ${freelanceInfo.siret}</p>` : ''}
                ${freelanceInfo.tva && freelanceInfo.tva !== 'Non applicable' ? `<p style="font-weight: 600;">TVA : ${freelanceInfo.tva}</p>` : ''}
              </div>
            </div>
            
            <div class="party">
              <h3>Client</h3>
              <div class="party-info">
                <p class="name">${invoice.clientName}</p>
                ${invoice.clientAddress ? `<p>${invoice.clientAddress}</p>` : ''}
                <p>${invoice.clientEmail}</p>
              </div>
            </div>
          </div>
          
          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right; width: 150px;">Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${invoice.description || 'Prestation de développement web'}</strong>
                </td>
                <td style="text-align: right; font-weight: 600;">${invoice.amount.toLocaleString('fr-FR')} €</td>
              </tr>
            </tbody>
          </table>
          
          <!-- Total Section -->
          <div class="total-section">
            <div class="total-box">
              <div class="total-row">
                <span>Sous-total HT</span>
                <span>${invoice.amount.toLocaleString('fr-FR')} €</span>
              </div>
              <div class="total-row">
                <span>TVA (Non applicable)</span>
                <span>0,00 €</span>
              </div>
              <div class="total-row final">
                <span>Total TTC</span>
                <span class="amount">${invoice.amount.toLocaleString('fr-FR')} €</span>
              </div>
            </div>
          </div>
          
          <!-- Payment Info -->
          <div class="payment-info">
            <h3>Conditions de paiement</h3>
            <p><strong>Échéance :</strong> ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</p>
            <p><strong>Modalités :</strong> Paiement par virement bancaire</p>
            ${freelanceInfo.iban ? `<p><strong>IBAN :</strong> ${freelanceInfo.iban}</p>` : ''}
            ${freelanceInfo.bic ? `<p><strong>BIC :</strong> ${freelanceInfo.bic}</p>` : ''}
          </div>
          
          <!-- Legal Mentions -->
          <div class="payment-info" style="font-size: 11px; line-height: 1.6;">
            <h3 style="font-size: 12px;">Mentions légales</h3>
            ${freelanceInfo.legalEntity ? `<p style="margin-bottom: 8px;"><strong>${freelanceInfo.legalEntity}</strong></p>` : ''}
            ${freelanceInfo.legalMentions?.registration ? `<p>${freelanceInfo.legalMentions.registration}</p>` : ''}
            ${freelanceInfo.legalMentions?.tva ? `<p>${freelanceInfo.legalMentions.tva}</p>` : ''}
            ${freelanceInfo.legalMentions?.tvaExemption ? `<p style="margin-top: 12px; color: #666;">${freelanceInfo.legalMentions.tvaExemption}</p>` : ''}
            ${freelanceInfo.legalMentions?.latePenalties ? `<p style="margin-top: 12px; color: #666;">${freelanceInfo.legalMentions.latePenalties}</p>` : ''}
            ${freelanceInfo.legalMentions?.penaltiesNote ? `<p style="color: #666;">${freelanceInfo.legalMentions.penaltiesNote}</p>` : ''}
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p><strong>${freelanceInfo.name}</strong> - ${freelanceInfo.legalStatus}</p>
            <p>${freelanceInfo.address}</p>
            <p>${freelanceInfo.email} - ${freelanceInfo.phone}</p>
            ${freelanceInfo.siret ? `<p>SIRET : ${freelanceInfo.siret}</p>` : ''}
            <p style="margin-top: 12px; color: #00FFC2; font-weight: 600;">Merci pour votre confiance !</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        if (onDownload) onDownload();
      }, 250);
    };
  };

  const printInvoice = () => {
    generatePDF();
  };

  return (
    <div className="flex gap-3">
      <Button
        onClick={printInvoice}
        className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
      >
        <Download className="h-4 w-4 mr-2" />
        Télécharger PDF
      </Button>
      <Button
        onClick={printInvoice}
        variant="outline"
        className="bg-white/5 border-white/10 text-white hover:bg-white/10"
      >
        <Printer className="h-4 w-4 mr-2" />
        Imprimer
      </Button>
    </div>
  );
}
