// Simple PDF Service for Invoice Generation
// Generates PDF invoices without external dependencies using jsPDF

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

// Simple PDF generation using jsPDF
export async function generateInvoicePDF(
  invoice: InvoiceData,
  freelanceInfo: FreelanceInfo
): Promise<{ success: boolean; pdf?: Uint8Array; base64?: string; error?: string }> {
  try {
    console.log(`📄 Generating PDF for invoice ${invoice.number}...`);
    
    // Import jsPDF from CDN
    const { jsPDF } = await import("https://esm.sh/jspdf@2.5.1");
    
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set font
    doc.setFont("helvetica");
    
    // Colors
    const primaryColor = [0, 255, 194]; // #00FFC2
    const darkColor = [12, 12, 12]; // #0C0C0C
    const grayColor = [102, 102, 102]; // #666
    
    let yPos = 20;
    
    // === HEADER ===
    // Logo/Company name
    doc.setFontSize(20);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text("FOULON Maxence", 20, yPos);
    
    // Accent dot
    doc.setTextColor(...primaryColor);
    const nameWidth = doc.getTextWidth("FOULON Maxence");
    doc.text(".", 20 + nameWidth, yPos);
    
    // Subtitle
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "normal");
    doc.text("Micro entrepreneur - Developpeur Web Freelance", 20, yPos + 6);
    
    // Invoice info (right side)
    doc.setFontSize(20);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text("FACTURE", 200, yPos, { align: 'right' });
    
    doc.setFontSize(16);
    doc.text(invoice.number, 200, yPos + 8, { align: 'right' });
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    const formattedDate = new Date(invoice.date).toLocaleDateString('fr-FR');
    doc.text(`Date : ${formattedDate}`, 200, yPos + 14, { align: 'right' });
    
    // Status badge
    if (invoice.status) {
      const statusText = invoice.status === 'paid' ? 'Payée' : 
                        invoice.status === 'sent' ? 'Envoyée' : 
                        invoice.status === 'overdue' ? 'En retard' : 
                        invoice.status;
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      
      if (invoice.status === 'paid') {
        doc.setFillColor(232, 245, 233);
        doc.setTextColor(56, 142, 60);
      } else if (invoice.status === 'sent') {
        doc.setFillColor(227, 242, 253);
        doc.setTextColor(25, 118, 210);
      } else if (invoice.status === 'overdue') {
        doc.setFillColor(255, 235, 238);
        doc.setTextColor(211, 47, 47);
      }
      
      doc.roundedRect(165, yPos + 16, 35, 6, 3, 3, 'F');
      doc.text(statusText, 182.5, yPos + 20, { align: 'center' });
    }
    
    yPos += 30;
    
    // Horizontal line
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1);
    doc.line(20, yPos, 190, yPos);
    
    yPos += 15;
    
    // === PARTIES ===
    // Freelance info (left)
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("AU NOM ET POUR LE COMPTE DE", 20, yPos);
    
    doc.setFontSize(10);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text("FOULON Maxence", 20, yPos + 6);
    
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "normal");
    doc.text("33 Route Du Mans", 20, yPos + 11);
    doc.text("72650 La Milesse, France", 20, yPos + 15);
    doc.text("contact@maxence.design", 20, yPos + 20);
    
    doc.setFontSize(7);
    doc.text("Entreprise Individuelle - Micro entrepreneur", 20, yPos + 26);
    doc.text("SIRET : 93763849200010", 20, yPos + 30);
    doc.text("TVA non applicable", 20, yPos + 34);
    
    // Client info (right)
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("CLIENT", 110, yPos);
    
    doc.setFontSize(10);
    doc.setTextColor(...darkColor);
    doc.text(invoice.clientName, 110, yPos + 6);
    
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "normal");
    if (invoice.clientAddress) {
      doc.text(invoice.clientAddress, 110, yPos + 11);
      doc.text(invoice.clientEmail, 110, yPos + 16);
    } else {
      doc.text(invoice.clientEmail, 110, yPos + 11);
    }
    
    yPos += 50;
    
    // === DETAILS BOX ===
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(20, yPos, 170, 35, 3, 3, 'F');
    
    yPos += 8;
    
    // Detail rows
    const detailRows = [
      ['Numéro de facture', invoice.number],
      ['Date d\'émission', new Date(invoice.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })],
      ['Date d\'échéance', new Date(invoice.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })]
    ];
    
    if (invoice.description) {
      detailRows.push(['Description', invoice.description]);
    }
    
    doc.setFontSize(9);
    detailRows.forEach((row, index) => {
      doc.setTextColor(...grayColor);
      doc.setFont("helvetica", "normal");
      doc.text(row[0], 25, yPos + (index * 7));
      
      doc.setTextColor(...darkColor);
      doc.setFont("helvetica", "bold");
      doc.text(row[1], 190, yPos + (index * 7), { align: 'right' });
    });
    
    yPos += 40;
    
    // === AMOUNT SECTION ===
    doc.setFillColor(...darkColor);
    doc.roundedRect(20, yPos, 170, 45, 3, 3, 'F');
    
    yPos += 10;
    
    // Subtotal
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.text("Sous-total HT", 25, yPos);
    
    doc.setFont("helvetica", "bold");
    doc.text(`${invoice.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 185, yPos, { align: 'right' });
    
    // TVA
    yPos += 7;
    doc.setFont("helvetica", "normal");
    doc.text("TVA non applicable", 25, yPos);
    doc.text("Article 293 B du CGI", 185, yPos, { align: 'right' });
    
    // Total line
    yPos += 10;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(25, yPos, 185, yPos);
    
    // Total
    yPos += 8;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL TTC", 25, yPos);
    
    doc.setFontSize(20);
    doc.setTextColor(...primaryColor);
    doc.text(`${invoice.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, 185, yPos, { align: 'right' });
    
    yPos += 20;
    
    // === PAYMENT INFO ===
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(20, yPos, 170, 55, 3, 3, 'F');
    
    yPos += 8;
    
    doc.setFontSize(9);
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text("💳 Modalites de paiement", 25, yPos);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    
    yPos += 5;
    const dueDateFormatted = new Date(invoice.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.text(`Echeance : ${dueDateFormatted}`, 25, yPos);
    
    yPos += 4;
    doc.text("Moyens de paiement acceptes : Virement bancaire, PayPal", 25, yPos);
    
    yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkColor);
    doc.text("IBAN : FR76 2823 3000 0195 1140 4606 069", 25, yPos);
    
    yPos += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(211, 47, 47);
    doc.setFontSize(6.5);
    
    // Texte des pénalités avec saut de ligne automatique
    const penaltyFullText = "⚠️ Le paiement est du a la date d'echeance. Tout reglement effectue apres expiration du delai donnera lieu, a titre de penalite de retard, a la facturation d'un interet de retard egal a trois fois le taux d'interet legal en vigueur en France, a compter de la date d'exigibilite de cette presente facture jusqu'a la date de paiement effectif, ainsi qu'a une indemnite forfaitaire pour frais de recouvrement d'un montant de 40 €. Les penalites de retard sont exigibles sans qu'un rappel soit necessaire.";
    
    const splitPenaltyText = doc.splitTextToSize(penaltyFullText, 160);
    doc.text(splitPenaltyText, 25, yPos);
    yPos += splitPenaltyText.length * 3;
    
    yPos += 10;
    
    // === FOOTER ===
    doc.setDrawColor(...grayColor);
    doc.setLineWidth(0.3);
    doc.line(20, yPos, 190, yPos);
    
    yPos += 6;
    
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "normal");
    doc.text("Merci pour votre confiance !", 105, yPos, { align: 'center' });
    
    yPos += 4;
    doc.setFontSize(7);
    doc.text("Cette facture a été générée automatiquement et ne nécessite pas de signature.", 105, yPos, { align: 'center' });
    
    yPos += 5;
    doc.setFontSize(7);
    const footerText = "FOULON Maxence • 33 Route Du Mans, 72650 La Milesse, France • contact@maxence.design";
    doc.text(footerText, 105, yPos, { align: 'center' });
    
    yPos += 3;
    doc.setFontSize(6.5);
    doc.text("Entreprise Individuelle - Micro entrepreneur - SIRET : 93763849200010", 105, yPos, { align: 'center' });
    
    // Get PDF as Uint8Array
    const pdfOutput = doc.output('arraybuffer');
    const pdfBytes = new Uint8Array(pdfOutput);
    
    // Convert to base64
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
