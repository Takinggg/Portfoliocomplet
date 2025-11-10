// PDF Service for Invoice Generation
// Generates professional PDF invoices for email attachments

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

interface FreelanceInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  siret?: string;
  tva?: string;
}

// Generate HTML for invoice
function generateInvoiceHTML(invoice: InvoiceData, freelanceInfo: FreelanceInfo): string {
  return `
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
          font-weight: 600;
          color: #00FFC2;
          margin-bottom: 16px;
          letter-spacing: 0.5px;
        }
        
        .party p {
          color: #0C0C0C;
          line-height: 1.6;
          margin-bottom: 4px;
        }
        
        .details {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          padding: 30px;
          border-radius: 8px;
          margin-bottom: 40px;
          border: 1px solid #e9ecef;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e9ecef;
        }
        
        .detail-row:last-child {
          border-bottom: none;
        }
        
        .detail-label {
          color: #666;
          font-size: 14px;
        }
        
        .detail-value {
          color: #0C0C0C;
          font-weight: 600;
          font-size: 14px;
        }
        
        .amount-section {
          background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%);
          color: white;
          padding: 30px;
          border-radius: 8px;
          margin-bottom: 40px;
        }
        
        .amount-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
        }
        
        .amount-label {
          font-size: 14px;
          opacity: 0.8;
        }
        
        .amount-value {
          font-weight: 600;
          font-size: 14px;
        }
        
        .total-row {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #00FFC2;
        }
        
        .total-label {
          font-size: 18px;
          font-weight: 700;
        }
        
        .total-value {
          font-size: 32px;
          font-weight: 700;
          color: #00FFC2;
        }
        
        .payment-info {
          background: #f8f9fa;
          padding: 24px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        
        .payment-info h3 {
          font-size: 14px;
          font-weight: 600;
          color: #0C0C0C;
          margin-bottom: 16px;
        }
        
        .payment-info p {
          color: #666;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 8px;
        }
        
        .footer {
          text-align: center;
          padding-top: 30px;
          border-top: 1px solid #e9ecef;
          color: #999;
          font-size: 12px;
        }
        
        .status-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 8px;
        }
        
        .status-sent {
          background: #e3f2fd;
          color: #1976d2;
        }
        
        .status-paid {
          background: #e8f5e9;
          color: #388e3c;
        }
        
        .status-overdue {
          background: #ffebee;
          color: #d32f2f;
        }
        
        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header -->
        <div class="header">
          <div class="logo-section">
            <h1>${freelanceInfo.name} <span class="accent">.</span></h1>
            <p style="color: #666; font-size: 14px;">Freelance Web Developer</p>
          </div>
          <div class="invoice-info">
            <div class="invoice-number">FACTURE</div>
            <div class="invoice-number">${invoice.number}</div>
            <div class="invoice-date">Date : ${new Date(invoice.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
            ${invoice.status ? `<span class="status-badge status-${invoice.status}">${invoice.status === 'paid' ? 'Payée' : invoice.status === 'sent' ? 'Envoyée' : invoice.status === 'overdue' ? 'En retard' : invoice.status}</span>` : ''}
          </div>
        </div>

        <!-- Parties -->
        <div class="parties">
          <div class="party">
            <h3>Émetteur</h3>
            <p><strong>${freelanceInfo.name}</strong></p>
            <p>${freelanceInfo.address || ''}</p>
            <p>${freelanceInfo.email}</p>
            <p>${freelanceInfo.phone || ''}</p>
            ${freelanceInfo.siret ? `<p style="margin-top: 8px; font-size: 12px; color: #999;">SIRET : ${freelanceInfo.siret}</p>` : ''}
            ${freelanceInfo.tva ? `<p style="font-size: 12px; color: #999;">TVA : ${freelanceInfo.tva}</p>` : ''}
          </div>
          
          <div class="party">
            <h3>Client</h3>
            <p><strong>${invoice.clientName}</strong></p>
            ${invoice.clientAddress ? `<p>${invoice.clientAddress}</p>` : ''}
            <p>${invoice.clientEmail}</p>
          </div>
        </div>

        <!-- Details -->
        <div class="details">
          <div class="detail-row">
            <span class="detail-label">Numéro de facture</span>
            <span class="detail-value">${invoice.number}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date d'émission</span>
            <span class="detail-value">${new Date(invoice.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date d'échéance</span>
            <span class="detail-value">${new Date(invoice.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          ${invoice.description ? `
          <div class="detail-row">
            <span class="detail-label">Description</span>
            <span class="detail-value">${invoice.description}</span>
          </div>
          ` : ''}
        </div>

        <!-- Amount -->
        <div class="amount-section">
          <div class="amount-row">
            <span class="amount-label">Sous-total HT</span>
            <span class="amount-value">${invoice.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
          </div>
          <div class="amount-row">
            <span class="amount-label">TVA non applicable</span>
            <span class="amount-value">Article 293 B du CGI</span>
          </div>
          <div class="amount-row total-row">
            <span class="total-label">TOTAL TTC</span>
            <span class="total-value">${invoice.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
          </div>
        </div>

        <!-- Payment Info -->
        <div class="payment-info">
          <h3>💳 Modalités de paiement</h3>
          <p><strong>Échéance :</strong> ${new Date(invoice.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p><strong>Moyens de paiement acceptés :</strong> Virement bancaire, PayPal</p>
          <p style="margin-top: 12px; font-size: 12px; color: #d32f2f;">
            ⚠️ En cas de retard de paiement, seront exigibles des pénalités de retard calculées à un taux égal à trois fois le taux d'intérêt légal, ainsi qu'une indemnité forfaitaire de 40 € pour frais de recouvrement.
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>Merci pour votre confiance !</p>
          <p style="margin-top: 8px;">Cette facture a été générée automatiquement et ne nécessite pas de signature.</p>
          <p style="margin-top: 16px; font-size: 11px;">
            ${freelanceInfo.name} • ${freelanceInfo.email} • ${freelanceInfo.phone || ''}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Convert HTML to PDF using an external API service
async function convertHTMLToPDF(html: string): Promise<Uint8Array> {
  try {
    // Use PDF Shift API (alternative: html2pdf.app, pdfshift.io, etc.)
    // For now, we'll use a free service: html-pdf-node equivalent
    
    // Option 1: Try using Deno's built-in WebAssembly PDF generation
    // This is a simplified version - in production you might want to use a proper service
    
    console.log("🔄 Converting HTML to PDF using external service...");
    
    // Use pdf.co REST API (has a free tier)
    const API_KEY = Deno.env.get("PDFCO_API_KEY") || "demo"; // Use demo key or real key
    
    const response = await fetch("https://api.pdf.co/v1/pdf/convert/from/html", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
      },
      body: JSON.stringify({
        html: html,
        name: "invoice.pdf",
        async: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`PDF.co API error: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result.url) {
      throw new Error("No PDF URL returned from API");
    }
    
    // Download the generated PDF
    const pdfResponse = await fetch(result.url);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to download PDF: ${pdfResponse.statusText}`);
    }
    
    const pdfBuffer = await pdfResponse.arrayBuffer();
    return new Uint8Array(pdfBuffer);
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    
    // Fallback: Return a simple text-based PDF message
    console.log("⚠️ Falling back to simple PDF generation...");
    throw new Error(`Failed to generate PDF: ${error.message}. Please configure PDFCO_API_KEY or use another PDF service.`);
  }
}

// Generate invoice PDF
export async function generateInvoicePDF(
  invoice: InvoiceData,
  freelanceInfo: FreelanceInfo
): Promise<{ success: boolean; pdf?: Uint8Array; base64?: string; error?: string }> {
  try {
    console.log(`📄 Generating PDF for invoice ${invoice.number}...`);
    
    const html = generateInvoiceHTML(invoice, freelanceInfo);
    const pdfBytes = await convertHTMLToPDF(html);
    
    // Convert to base64 for email attachment
    const base64 = btoa(String.fromCharCode(...pdfBytes));
    
    console.log(`✅ PDF generated successfully for invoice ${invoice.number} (${pdfBytes.length} bytes)`);
    
    return {
      success: true,
      pdf: pdfBytes,
      base64
    };
  } catch (error) {
    console.error(`❌ Error generating PDF for invoice ${invoice.number}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}
