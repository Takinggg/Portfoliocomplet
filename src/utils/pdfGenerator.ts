import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface QuoteData {
  id: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
  validUntil?: string;
}

interface InvoiceData {
  id: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
  dueDate?: string;
  items?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  invoiceNumber?: string;
  clientAddress?: string;
  clientCompany?: string;
}

// Informations lÃ©gales obligatoires du freelance
const FREELANCE_INFO = {
  name: "FOULON Maxence",
  businessName: "maxence.design",
  address: "33 Route Du Mans",
  postalCode: "72650",
  city: "La Milesse",
  country: "France",
  email: "contact@maxence.design",
  phone: "+33 (0)X XX XX XX XX", // Ã€ complÃ©ter si nÃ©cessaire
  siret: "937 638 492 00010",
  tva: "TVA non applicable, art. 293 B du CGI",
  iban: "FR76 2823 3000 0195 1140 4606 069",
  bic: "CMBRFR2BARK", // Ã€ vÃ©rifier avec ta banque
  registrationCity: "Le Mans",
  activityCode: "6201Z" // Programmation informatique - Ã  vÃ©rifier
};

export class PDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private yPosition: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
    this.yPosition = this.margin;
    
    // Fond noir pour toute la page
    this.doc.setFillColor(12, 12, 12); // #0C0C0C
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
  }

  // Couleurs de la DA maxence.design
  private colors = {
    primary: [204, 255, 0], // #CCFF00 cyan
    dark: [12, 12, 12], // #0C0C0C
    text: [255, 255, 255], // #FFFFFF blanc
    secondary: [176, 176, 176] // #b0b0b0 gris
  };

  private addHeader(title: string, subtitle: string, isInvoice: boolean = false) {
    // Colonne de gauche : Logo + Titre
    this.doc.setFontSize(24);
    this.doc.setTextColor(204, 255, 0); // Cyan
    this.doc.text('maxence.design', this.margin, this.yPosition);
    
    this.yPosition += 10;
    this.doc.setFontSize(10);
    this.doc.setTextColor(176, 176, 176); // Gris
    this.doc.text('Design & DÃ©veloppement Web', this.margin, this.yPosition);
    
    // Colonne de droite : Infos freelance (pour factures uniquement)
    if (isInvoice) {
      const rightX = this.pageWidth - this.margin;
      let rightY = this.margin;
      
      this.doc.setFontSize(9);
      this.doc.setTextColor(255, 255, 255);
      this.doc.text(FREELANCE_INFO.name, rightX, rightY, { align: 'right' });
      
      rightY += 5;
      this.doc.setTextColor(176, 176, 176);
      this.doc.text(FREELANCE_INFO.address, rightX, rightY, { align: 'right' });
      
      rightY += 5;
      this.doc.text(`${FREELANCE_INFO.postalCode} ${FREELANCE_INFO.city}`, rightX, rightY, { align: 'right' });
      
      rightY += 5;
      this.doc.text(FREELANCE_INFO.email, rightX, rightY, { align: 'right' });
      
      rightY += 7;
      this.doc.setFontSize(8);
      this.doc.text(`SIRET: ${FREELANCE_INFO.siret}`, rightX, rightY, { align: 'right' });
      
      rightY += 4;
      this.doc.text(FREELANCE_INFO.tva, rightX, rightY, { align: 'right' });
    }
    
    // Ligne de sÃ©paration cyan
    this.yPosition += 8;
    this.doc.setDrawColor(204, 255, 0); // Cyan
    this.doc.setLineWidth(1);
    this.doc.line(this.margin, this.yPosition, this.pageWidth - this.margin, this.yPosition);
    
    // Titre du document en blanc
    this.yPosition += 15;
    this.doc.setFontSize(18);
    this.doc.setTextColor(255, 255, 255); // Blanc
    this.doc.text(title, this.margin, this.yPosition);
    
    this.yPosition += 8;
    this.doc.setFontSize(10);
    this.doc.setTextColor(176, 176, 176); // Gris
    this.doc.text(subtitle, this.margin, this.yPosition);
    
    this.yPosition += 15;
  }

  private addSection(title: string) {
    this.yPosition += 5;
    this.doc.setFontSize(12);
    this.doc.setTextColor(204, 255, 0); // Cyan
    this.doc.text(title, this.margin, this.yPosition);
    this.yPosition += 8;
  }

  private addRow(label: string, value: string, bold = false) {
    this.doc.setFontSize(10);
    this.doc.setTextColor(176, 176, 176); // Gris pour labels
    this.doc.text(label, this.margin, this.yPosition);
    
    this.doc.setTextColor(255, 255, 255); // Blanc pour valeurs
    if (bold) this.doc.setFont(undefined, 'bold');
    this.doc.text(value, this.margin + 60, this.yPosition);
    if (bold) this.doc.setFont(undefined, 'normal');
    
    this.yPosition += 7;
  }

  private addTable(headers: string[], rows: string[][]) {
    const cellWidth = (this.pageWidth - 2 * this.margin) / headers.length;
    const cellHeight = 10;
    
    // Header avec fond cyan/noir
    this.doc.setFillColor(204, 255, 0); // Cyan
    this.doc.rect(this.margin, this.yPosition, this.pageWidth - 2 * this.margin, cellHeight, 'F');
    
    this.doc.setFontSize(10);
    this.doc.setTextColor(12, 12, 12); // Texte noir sur fond cyan
    this.doc.setFont(undefined, 'bold');
    headers.forEach((header, i) => {
      this.doc.text(header, this.margin + i * cellWidth + 5, this.yPosition + 7);
    });
    this.doc.setFont(undefined, 'normal');
    
    this.yPosition += cellHeight;
    
    // Rows avec alternance de fond
    rows.forEach((row, rowIndex) => {
      if (rowIndex % 2 === 0) {
        this.doc.setFillColor(30, 30, 30); // Gris foncÃ© pour lignes paires
        this.doc.rect(this.margin, this.yPosition, this.pageWidth - 2 * this.margin, cellHeight, 'F');
      }
      
      this.doc.setTextColor(255, 255, 255); // Texte blanc
      row.forEach((cell, i) => {
        this.doc.text(cell, this.margin + i * cellWidth + 5, this.yPosition + 7);
      });
      
      this.yPosition += cellHeight;
    });
    
    this.yPosition += 5;
  }

  private addFooter() {
    const footerY = this.pageHeight - 20;
    
    this.doc.setDrawColor(204, 255, 0); // Ligne cyan
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, footerY - 5, this.pageWidth - this.margin, footerY - 5);
    
    this.doc.setFontSize(8);
    this.doc.setTextColor(176, 176, 176); // Gris
    this.doc.text('maxence.design | contact@maxence.design | https://maxence.design', 
      this.pageWidth / 2, footerY, { align: 'center' });
  }

  private addLegalMentions() {
    // BoÃ®te de mentions lÃ©gales
    const boxY = this.yPosition + 10;
    const boxHeight = 32;
    
    this.doc.setFillColor(20, 20, 20); // Gris trÃ¨s foncÃ©
    this.doc.setDrawColor(204, 255, 0);
    this.doc.setLineWidth(0.3);
    this.doc.rect(this.margin, boxY, this.pageWidth - 2 * this.margin, boxHeight, 'FD');
    
    let textY = boxY + 5;
    this.doc.setFontSize(7);
    this.doc.setTextColor(176, 176, 176);
    
    // Titre
    this.doc.setTextColor(204, 255, 0);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('MENTIONS LÃ‰GALES', this.margin + 3, textY);
    this.doc.setFont(undefined, 'normal');
    
    textY += 4;
    this.doc.setTextColor(200, 200, 200);
    
    // Ligne 1 : IdentitÃ©
    this.doc.text(
      `${FREELANCE_INFO.name} - SIRET: ${FREELANCE_INFO.siret}`, 
      this.margin + 3, textY
    );
    
    textY += 3.5;
    // Ligne 2 : Adresse
    this.doc.text(
      `${FREELANCE_INFO.address}, ${FREELANCE_INFO.postalCode} ${FREELANCE_INFO.city} - ${FREELANCE_INFO.email}`,
      this.margin + 3, textY
    );
    
    textY += 3.5;
    // Ligne 3 : TVA
    this.doc.text(
      `${FREELANCE_INFO.tva} - DispensÃ© d'immatriculation au RCS et au RM`,
      this.margin + 3, textY
    );
    
    textY += 5;
    // Conditions de paiement - Plus compact
    this.doc.setFontSize(7);
    this.doc.setTextColor(204, 255, 0);
    this.doc.text('Conditions:', this.margin + 3, textY);
    this.doc.setTextColor(200, 200, 200);
    this.doc.text('Paiement Ã  30 jours - PÃ©nalitÃ©s: 3x taux lÃ©gal - Frais recouvrement: 40â‚¬', this.margin + 22, textY);
    
    this.yPosition = boxY + boxHeight;
  }

  private addPaymentInfo() {
    this.yPosition += 8;
    
    // EncadrÃ© infos bancaires - Plus compact
    const boxY = this.yPosition;
    const boxHeight = 16;
    const boxWidth = (this.pageWidth - 2 * this.margin) / 2 - 5;
    
    this.doc.setFillColor(204, 255, 0, 10); // Cyan trÃ¨s transparent
    this.doc.setDrawColor(204, 255, 0);
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margin, boxY, boxWidth, boxHeight, 'FD');
    
    let textY = boxY + 5;
    this.doc.setFontSize(8);
    this.doc.setTextColor(204, 255, 0);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('INFORMATIONS BANCAIRES', this.margin + 3, textY);
    this.doc.setFont(undefined, 'normal');
    
    textY += 5;
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(7);
    this.doc.text(`IBAN: ${FREELANCE_INFO.iban}`, this.margin + 3, textY);
    
    textY += 4;
    this.doc.text(`BIC: ${FREELANCE_INFO.bic}`, this.margin + 3, textY);
    
    this.yPosition = boxY + boxHeight;
  }

  public generateQuote(quote: QuoteData): void {
    this.addHeader('DEVIS', `NÂ° ${quote.id.substring(0, 8).toUpperCase()}`);
    
    // Informations client
    this.addSection('Informations Client');
    this.addRow('Nom:', quote.clientName);
    this.addRow('Email:', quote.clientEmail);
    
    // Informations devis
    this.yPosition += 5;
    this.addSection('DÃ©tails du Devis');
    this.addRow('Date d\'Ã©mission:', new Date(quote.createdAt).toLocaleDateString('fr-FR'));
    if (quote.validUntil) {
      this.addRow('Valide jusqu\'au:', new Date(quote.validUntil).toLocaleDateString('fr-FR'));
    }
    this.addRow('Statut:', this.getStatusLabel(quote.status));
    
    // Description
    this.yPosition += 5;
    this.addSection('Description');
    this.doc.setFontSize(10);
    this.doc.setTextColor(220, 220, 220); // Texte gris clair
    const splitDescription = this.doc.splitTextToSize(quote.description, this.pageWidth - 2 * this.margin);
    this.doc.text(splitDescription, this.margin, this.yPosition);
    this.yPosition += splitDescription.length * 5 + 10;
    
    // Montant total avec highlight
    this.doc.setDrawColor(204, 255, 0); // Ligne cyan
    this.doc.setLineWidth(1);
    this.doc.line(this.margin, this.yPosition, this.pageWidth - this.margin, this.yPosition);
    this.yPosition += 10;
    
    this.doc.setFontSize(14);
    this.doc.setTextColor(204, 255, 0); // Cyan pour "MONTANT TOTAL"
    this.doc.text('MONTANT TOTAL:', this.margin, this.yPosition);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(255, 255, 255); // Blanc pour le montant
    this.doc.text(`${quote.amount.toLocaleString('fr-FR')} â‚¬`, this.pageWidth - this.margin - 40, this.yPosition);
    this.doc.setFont(undefined, 'normal');
    
    this.addFooter();
    
    this.doc.save(`devis-${quote.id.substring(0, 8)}.pdf`);
  }

  public generateInvoice(invoice: InvoiceData): void {
    // Header avec infos freelance
    this.addHeader('FACTURE', `NÂ° ${invoice.invoiceNumber || invoice.id.substring(0, 8).toUpperCase()}`, true);
    
    // Informations client
    this.addSection('Facturation Ã ');
    this.doc.setFontSize(10);
    this.doc.setTextColor(255, 255, 255);
    
    if (invoice.clientCompany) {
      this.doc.setFont(undefined, 'bold');
      this.doc.text(invoice.clientCompany, this.margin, this.yPosition);
      this.yPosition += 5;
      this.doc.setFont(undefined, 'normal');
    }
    
    this.doc.text(invoice.clientName, this.margin, this.yPosition);
    this.yPosition += 5;
    
    if (invoice.clientAddress) {
      this.doc.setTextColor(200, 200, 200);
      this.doc.text(invoice.clientAddress, this.margin, this.yPosition);
      this.yPosition += 5;
    }
    
    this.doc.text(invoice.clientEmail, this.margin, this.yPosition);
    this.yPosition += 10;
    
    // Informations facture
    this.addSection('Informations Facture');
    this.addRow('Date d\'Ã©mission:', new Date(invoice.createdAt).toLocaleDateString('fr-FR'));
    if (invoice.dueDate) {
      this.addRow('Date d\'Ã©chÃ©ance:', new Date(invoice.dueDate).toLocaleDateString('fr-FR'));
    } else {
      // Calculer Ã©chÃ©ance Ã  30 jours
      const dueDate = new Date(invoice.createdAt);
      dueDate.setDate(dueDate.getDate() + 30);
      this.addRow('Date d\'Ã©chÃ©ance:', dueDate.toLocaleDateString('fr-FR'));
    }
    this.addRow('Statut:', this.getInvoiceStatusLabel(invoice.status));
    
    // Items (si disponibles)
    if (invoice.items && invoice.items.length > 0) {
      this.yPosition += 5;
      this.addSection('DÃ©tail des Prestations');
      
      const headers = ['Description', 'QtÃ©', 'Prix Unit.', 'Total HT'];
      const rows = invoice.items.map(item => [
        item.description,
        item.quantity.toString(),
        `${item.unitPrice.toLocaleString('fr-FR')} â‚¬`,
        `${item.total.toLocaleString('fr-FR')} â‚¬`
      ]);
      
      this.addTable(headers, rows);
    } else {
      // Description simple
      this.yPosition += 5;
      this.addSection('Description');
      this.doc.setFontSize(10);
      this.doc.setTextColor(220, 220, 220); // Texte gris clair
      const splitDescription = this.doc.splitTextToSize(invoice.description, this.pageWidth - 2 * this.margin);
      this.doc.text(splitDescription, this.margin, this.yPosition);
      this.yPosition += splitDescription.length * 5 + 10;
    }
    
    // Calcul des totaux (note: TVA non applicable pour micro-entreprise)
    this.yPosition += 10;
    
    // Afficher "TVA non applicable" au lieu de calculer
    this.doc.setFontSize(10);
    this.doc.setTextColor(200, 200, 200);
    this.addRow('Montant HT:', `${invoice.amount.toFixed(2)} â‚¬`);
    
    this.doc.setTextColor(204, 255, 0);
    this.doc.text('TVA non applicable, art. 293 B du CGI', this.margin + 60, this.yPosition);
    this.yPosition += 7;
    
    // Montant total (= HT puisque pas de TVA)
    this.doc.setDrawColor(204, 255, 0); // Ligne cyan
    this.doc.setLineWidth(1);
    this.doc.line(this.margin, this.yPosition, this.pageWidth - this.margin, this.yPosition);
    this.yPosition += 10;
    
    this.doc.setFontSize(14);
    this.doc.setTextColor(204, 255, 0); // Cyan
    this.doc.text('MONTANT TOTAL:', this.margin, this.yPosition);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(255, 255, 255); // Blanc
    this.doc.text(`${invoice.amount.toLocaleString('fr-FR')} â‚¬`, this.pageWidth - this.margin - 40, this.yPosition);
    this.doc.setFont(undefined, 'normal');
    
    // Note de paiement avec couleurs appropriÃ©es
    if (invoice.status === 'unpaid') {
      this.yPosition += 15;
      this.doc.setFontSize(10);
      this.doc.setTextColor(255, 100, 100); // Rouge clair
      this.doc.text('âš  Paiement en attente', this.margin, this.yPosition);
    } else if (invoice.status === 'paid') {
      this.yPosition += 15;
      this.doc.setFontSize(10);
      this.doc.setTextColor(204, 255, 0); // Cyan (couleur primaire)
      this.doc.text('âœ“ Facture payÃ©e', this.margin, this.yPosition);
    }
    
    // Ajouter les infos bancaires
    this.addPaymentInfo();
    
    // Ajouter les mentions lÃ©gales obligatoires
    this.addLegalMentions();
    
    this.addFooter();
    
    this.doc.save(`facture-${invoice.invoiceNumber || invoice.id.substring(0, 8)}.pdf`);
  }

  private getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'En attente',
      accepted: 'AcceptÃ©',
      rejected: 'RefusÃ©'
    };
    return labels[status] || status;
  }

  private getInvoiceStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      paid: 'PayÃ©e',
      unpaid: 'ImpayÃ©e',
      overdue: 'En retard'
    };
    return labels[status] || status;
  }
}

// Fonctions utilitaires
export function exportQuoteToPDF(quote: QuoteData) {
  const generator = new PDFGenerator();
  generator.generateQuote(quote);
}

export function exportInvoiceToPDF(invoice: InvoiceData) {
  const generator = new PDFGenerator();
  generator.generateInvoice(invoice);
}
