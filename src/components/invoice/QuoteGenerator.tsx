import { Button } from "../ui/button";
import { Download, Printer } from "lucide-react";
import { FreelanceInfo } from "../../utils/freelanceConfig";

interface QuoteData {
  number: string;
  date: string;
  validUntil: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  amount: number;
  description?: string;
  status: string;
}

interface QuoteGeneratorProps {
  quote: QuoteData;
  freelanceInfo: FreelanceInfo;
  onDownload?: () => void;
}

export function QuoteGenerator({ quote, freelanceInfo, onDownload }: QuoteGeneratorProps) {
  
  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Devis ${quote.number}</title>
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
          
          .quote-container {
            max-width: 800px;
            margin: 0 auto;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 60px;
            padding-bottom: 30px;
            border-bottom: 3px solid #CCFF00;
          }
          
          .logo-section h1 {
            font-size: 32px;
            font-weight: 700;
            color: #0C0C0C;
            margin-bottom: 8px;
          }
          
          .logo-section .accent {
            color: #CCFF00;
          }
          
          .quote-info {
            text-align: right;
          }
          
          .quote-number {
            font-size: 24px;
            font-weight: 700;
            color: #0C0C0C;
            margin-bottom: 8px;
          }
          
          .quote-date {
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
            border-top: 2px solid #CCFF00;
          }
          
          .total-row.final {
            font-size: 24px;
            font-weight: 700;
          }
          
          .total-row.final .amount {
            color: #CCFF00;
          }
          
          .validity-box {
            background: #FFF3CD;
            border-left: 4px solid #FFC107;
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 40px;
          }
          
          .validity-box h3 {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
            color: #856404;
          }
          
          .validity-box p {
            margin-bottom: 8px;
            color: #856404;
            line-height: 1.6;
          }
          
          .conditions-box {
            background: #F4F4F4;
            padding: 24px;
            border-radius: 8px;
            margin-bottom: 40px;
          }
          
          .conditions-box h3 {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 16px;
            color: #0C0C0C;
          }
          
          .conditions-box p {
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
          
          .status-accepted {
            background: #D1FAE5;
            color: #065F46;
          }
          
          .status-declined {
            background: #FEE2E2;
            color: #991B1B;
          }
          
          .status-converted {
            background: #E9D5FF;
            color: #6B21A8;
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
        <div class="quote-container">
          <!-- Header -->
          <div class="header">
            <div class="logo-section">
              <h1>${freelanceInfo.name.split(' ')[0]} <span class="accent">${freelanceInfo.name.split(' ').slice(1).join(' ')}</span></h1>
              <p style="color: #666; margin-top: 4px;">DÃ©veloppeur Freelance</p>
            </div>
            <div class="quote-info">
              <div class="quote-number">Devis NÂ° ${quote.number}</div>
              <div class="quote-date">
                Date d'Ã©mission : ${new Date(quote.date).toLocaleDateString('fr-FR')}<br>
                Valide jusqu'au : ${new Date(quote.validUntil).toLocaleDateString('fr-FR')}
              </div>
              <div class="status-badge status-${quote.status.toLowerCase()}">
                ${quote.status === 'draft' ? 'Brouillon' : quote.status === 'sent' ? 'EnvoyÃ©' : quote.status === 'accepted' ? 'AcceptÃ©' : quote.status === 'declined' ? 'RefusÃ©' : 'Converti'}
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
                <p class="name">${quote.clientName}</p>
                ${quote.clientAddress ? `<p>${quote.clientAddress}</p>` : ''}
                <p>${quote.clientEmail}</p>
              </div>
            </div>
          </div>
          
          <!-- Validity Notice -->
          <div class="validity-box">
            <h3>â° ValiditÃ© de ce devis</h3>
            <p><strong>Ce devis est valable jusqu'au ${new Date(quote.validUntil).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong></p>
            <p style="margin-top: 8px; font-size: 13px;">PassÃ© cette date, les tarifs et disponibilitÃ©s pourront Ãªtre modifiÃ©s.</p>
          </div>
          
          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th>Description de la prestation</th>
                <th style="text-align: right; width: 150px;">Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${quote.description || 'Prestation de dÃ©veloppement web'}</strong>
                </td>
                <td style="text-align: right; font-weight: 600;">${quote.amount.toLocaleString('fr-FR')} â‚¬</td>
              </tr>
            </tbody>
          </table>
          
          <!-- Total Section -->
          <div class="total-section">
            <div class="total-box">
              <div class="total-row">
                <span>Sous-total HT</span>
                <span>${quote.amount.toLocaleString('fr-FR')} â‚¬</span>
              </div>
              <div class="total-row">
                <span>TVA (Non applicable)</span>
                <span>0,00 â‚¬</span>
              </div>
              <div class="total-row final">
                <span>Total TTC</span>
                <span class="amount">${quote.amount.toLocaleString('fr-FR')} â‚¬</span>
              </div>
            </div>
          </div>
          
          <!-- Conditions -->
          <div class="conditions-box">
            <h3>Conditions gÃ©nÃ©rales</h3>
            <p><strong>ModalitÃ©s de paiement :</strong> Un acompte de 30% sera demandÃ© Ã  la signature du devis, le solde Ã©tant payable Ã  la livraison du projet.</p>
            <p><strong>DÃ©lai de livraison :</strong> EstimÃ© aprÃ¨s validation du devis et rÃ©ception de l'acompte.</p>
            <p><strong>RÃ©visions :</strong> Deux cycles de rÃ©visions sont inclus dans le tarif proposÃ©.</p>
            <p style="margin-top: 12px; color: #666; font-size: 12px;">En signant ce devis, vous acceptez les conditions gÃ©nÃ©rales de vente disponibles sur demande.</p>
          </div>
          
          <!-- Signature Box -->
          <div style="background: #F4F4F4; padding: 30px; border-radius: 8px; margin-bottom: 40px;">
            <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; color: #0C0C0C;">Signature du client (prÃ©cÃ©dÃ©e de "Bon pour accord")</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px;">
              <div>
                <p style="font-size: 13px; color: #666; margin-bottom: 8px;">Date :</p>
                <div style="border-bottom: 1px solid #999; height: 30px;"></div>
              </div>
              <div>
                <p style="font-size: 13px; color: #666; margin-bottom: 8px;">Signature :</p>
                <div style="border-bottom: 1px solid #999; height: 30px;"></div>
              </div>
            </div>
          </div>
          
          <!-- Legal Mentions -->
          <div class="conditions-box" style="font-size: 11px; line-height: 1.6;">
            <h3 style="font-size: 12px;">Mentions lÃ©gales</h3>
            ${freelanceInfo.legalEntity ? `<p style="margin-bottom: 8px;"><strong>${freelanceInfo.legalEntity}</strong></p>` : ''}
            ${freelanceInfo.legalMentions?.registration ? `<p>${freelanceInfo.legalMentions.registration}</p>` : ''}
            ${freelanceInfo.legalMentions?.tva ? `<p>${freelanceInfo.legalMentions.tva}</p>` : ''}
            ${freelanceInfo.legalMentions?.tvaExemption ? `<p style="margin-top: 12px; color: #666;">${freelanceInfo.legalMentions.tvaExemption}</p>` : ''}
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p><strong>${freelanceInfo.name}</strong> - ${freelanceInfo.legalStatus}</p>
            <p>${freelanceInfo.address}</p>
            <p>${freelanceInfo.email} - ${freelanceInfo.phone}</p>
            ${freelanceInfo.siret ? `<p>SIRET : ${freelanceInfo.siret}</p>` : ''}
            <p style="margin-top: 12px; color: #CCFF00; font-weight: 600;">Merci pour votre confiance !</p>
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

  const printQuote = () => {
    generatePDF();
  };

  return (
    <div className="flex gap-3">
      <Button
        onClick={printQuote}
        className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
      >
        <Download className="h-4 w-4 mr-2" />
        TÃ©lÃ©charger PDF
      </Button>
      <Button
        onClick={printQuote}
        variant="outline"
        className="bg-white/5 border-white/10 text-white hover:bg-white/10"
      >
        <Printer className="h-4 w-4 mr-2" />
        Imprimer
      </Button>
    </div>
  );
}
