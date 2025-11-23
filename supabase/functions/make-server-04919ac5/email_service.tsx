// Email Service for automated emails
// Uses Resend API for professional email delivery

interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: string; // base64
  }>;
}

// Email templates
export const emailTemplates = {
  // Lead confirmation email
  leadConfirmation: (data: {
    name: string;
    message: string;
    wantsAppointment: boolean;
  }): EmailTemplate => ({
    subject: "Votre message a bien Ã©tÃ© reÃ§u - Portfolio Freelance",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0C0C0C; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%); color: #CCFF00; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #F4F4F4; padding: 40px 30px; }
            .footer { background: #0C0C0C; color: #CCFF00; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #CCFF00; color: #0C0C0C; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .highlight { background: #CCFF00; color: #0C0C0C; padding: 2px 8px; border-radius: 4px; }
            .message-box { background: white; padding: 20px; border-left: 4px solid #CCFF00; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">âœ¨ Message bien reÃ§u !</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${data.name}</strong>,</p>
              
              <p>Merci pour votre message ! Je l'ai bien reÃ§u et je vous rÃ©pondrai dans les <span class="highlight">24 heures</span>.</p>
              
              <div class="message-box">
                <p style="margin: 0; color: #666; font-size: 14px;"><strong>Votre message :</strong></p>
                <p style="margin: 10px 0 0 0;">${data.message}</p>
              </div>
              
              ${data.wantsAppointment ? `
                <p>ðŸ—“ï¸ <strong>Vous avez demandÃ© un rendez-vous</strong> - Je reviendrai vers vous trÃ¨s rapidement pour planifier notre Ã©change.</p>
              ` : ''}
              
              <p>En attendant, n'hÃ©sitez pas Ã  consulter mon portfolio et mes services.</p>
              
              <center>
                <a href="${Deno.env.get('FRONTEND_URL') || 'http://localhost:5173'}" class="button">Voir le portfolio</a>
              </center>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                Ã€ trÃ¨s bientÃ´t,<br>
                <strong>Votre Freelance</strong>
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0;">Â© 2025 FOULON Maxence - DÃ©veloppeur Web Freelance</p>
              <p style="margin: 5px 0 0 0; opacity: 0.8;">Cet email a Ã©tÃ© envoyÃ© automatiquement suite Ã  votre prise de contact.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Bonjour ${data.name},\n\nMerci pour votre message ! Je l'ai bien reÃ§u et je vous rÃ©pondrai dans les 24 heures.\n\nVotre message : ${data.message}\n\n${data.wantsAppointment ? 'Vous avez demandÃ© un rendez-vous - Je reviendrai vers vous trÃ¨s rapidement pour planifier notre Ã©change.\n\n' : ''}Ã€ trÃ¨s bientÃ´t,\nVotre Freelance`
  }),

  // Booking confirmation email
  bookingConfirmation: (data: {
    name: string;
    date: string;
    time: string;
    duration: number;
    service?: string;
  }): EmailTemplate => ({
    subject: "âœ… Votre rendez-vous est confirmÃ©",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0C0C0C; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%); color: #CCFF00; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #F4F4F4; padding: 40px 30px; }
            .footer { background: #0C0C0C; color: #CCFF00; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .rdv-card { background: white; padding: 30px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(204, 255, 0,0.1); border: 2px solid #CCFF00; }
            .rdv-info { display: flex; align-items: center; margin: 15px 0; font-size: 16px; }
            .icon { margin-right: 10px; font-size: 20px; }
            .button { display: inline-block; background: #CCFF00; color: #0C0C0C; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">âœ… Rendez-vous confirmÃ© !</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${data.name}</strong>,</p>
              
              <p>Votre rendez-vous est confirmÃ© ! Je me rÃ©jouis de notre Ã©change.</p>
              
              <div class="rdv-card">
                <h3 style="margin: 0 0 20px 0; color: #CCFF00;">ðŸ“… DÃ©tails du rendez-vous</h3>
                <div class="rdv-info">
                  <span class="icon">ðŸ“†</span>
                  <strong>Date :</strong>&nbsp;${new Date(data.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div class="rdv-info">
                  <span class="icon">ðŸ•’</span>
                  <strong>Heure :</strong>&nbsp;${data.time}
                </div>
                <div class="rdv-info">
                  <span class="icon">â±ï¸</span>
                  <strong>DurÃ©e :</strong>&nbsp;${data.duration} minutes
                </div>
                ${data.service ? `
                <div class="rdv-info">
                  <span class="icon">ðŸ’¼</span>
                  <strong>Service :</strong>&nbsp;${data.service}
                </div>
                ` : ''}
              </div>
              
              <p><strong>âš ï¸ Important :</strong> Si vous devez modifier ou annuler ce rendez-vous, merci de me prÃ©venir au moins 24h Ã  l'avance.</p>
              
              <p>Un rappel vous sera envoyÃ© 24 heures avant notre rendez-vous.</p>
              
              <center>
                <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Rendez-vous+Freelance&dates=${data.date.replace(/-/g, '')}T${data.time.replace(':', '')}00/${data.date.replace(/-/g, '')}T${(parseInt(data.time.split(':')[0]) + Math.floor(data.duration / 60)).toString().padStart(2, '0')}${((parseInt(data.time.split(':')[1]) + (data.duration % 60)) % 60).toString().padStart(2, '0')}00" class="button" target="_blank">ðŸ“… Ajouter au calendrier</a>
              </center>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                Ã€ trÃ¨s bientÃ´t,<br>
                <strong>Votre Freelance</strong>
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0;">Â© 2025 Portfolio Freelance - Tous droits rÃ©servÃ©s</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Bonjour ${data.name},\n\nVotre rendez-vous est confirmÃ© !\n\nDÃ©tails :\n- Date : ${new Date(data.date).toLocaleDateString('fr-FR')}\n- Heure : ${data.time}\n- DurÃ©e : ${data.duration} minutes\n${data.service ? `- Service : ${data.service}\n` : ''}\nUn rappel vous sera envoyÃ© 24 heures avant notre rendez-vous.\n\nÃ€ trÃ¨s bientÃ´t,\nVotre Freelance`
  }),

  // Invoice email
  invoiceEmail: (data: {
    clientName: string;
    invoiceNumber: string;
    amount: number;
    dueDate: string;
    pdfUrl?: string;
  }): EmailTemplate => ({
    subject: `Facture ${data.invoiceNumber} - Ã€ rÃ©gler avant le ${new Date(data.dueDate).toLocaleDateString('fr-FR')}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0C0C0C; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%); color: #CCFF00; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #F4F4F4; padding: 40px 30px; }
            .footer { background: #0C0C0C; color: #CCFF00; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .invoice-card { background: white; padding: 30px; border-radius: 8px; margin: 20px 0; border: 2px solid #CCFF00; }
            .amount { font-size: 36px; font-weight: 700; color: #CCFF00; margin: 20px 0; }
            .button { display: inline-block; background: #CCFF00; color: #0C0C0C; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">ðŸ’¼ Nouvelle facture</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${data.clientName}</strong>,</p>
              
              <p>Veuillez trouver ci-joint votre facture <strong>${data.invoiceNumber}</strong>.</p>
              
              <div class="invoice-card">
                <h3 style="margin: 0 0 20px 0; text-align: center;">Facture ${data.invoiceNumber}</h3>
                
                <div class="info-row">
                  <span>Montant total :</span>
                  <strong class="amount">${data.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</strong>
                </div>
                
                <div class="info-row">
                  <span>Date d'Ã©chÃ©ance :</span>
                  <strong>${new Date(data.dueDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                </div>
              </div>
              
              ${data.pdfUrl ? `
              <center>
                <a href="${data.pdfUrl}" class="button">ðŸ“„ TÃ©lÃ©charger la facture (PDF)</a>
              </center>
              ` : ''}
              
              <p><strong>ðŸ’³ ModalitÃ©s de paiement :</strong></p>
              <ul style="color: #666; list-style: none; padding-left: 0;">
                <li style="margin-bottom: 8px;">âœ… <strong>Virement bancaire</strong> (recommandÃ©)</li>
                <li style="font-size: 13px; margin-left: 24px; margin-bottom: 12px;">
                  IBAN : <code style="background: #f0f0f0; padding: 3px 8px; border-radius: 3px; font-size: 12px;">FR76 2823 3000 0195 1140 4606 069</code>
                </li>
                <li>ðŸ’³ PayPal (me contacter pour les dÃ©tails)</li>
              </ul>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                Pour toute question concernant cette facture, n'hÃ©sitez pas Ã  me contacter.<br><br>
                Cordialement,<br>
                <strong>Maxence FOULON</strong>
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0;">Â© 2025 Portfolio Freelance - Tous droits rÃ©servÃ©s</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Bonjour ${data.clientName},\n\nVeuillez trouver ci-joint votre facture ${data.invoiceNumber}.\n\nMontant : ${data.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}\nDate d'Ã©chÃ©ance : ${new Date(data.dueDate).toLocaleDateString('fr-FR')}\n\nCordialement,\nVotre Freelance`
  }),

  // Appointment reminder (24h before)
  appointmentReminder: (data: {
    name: string;
    date: string;
    time: string;
    duration: number;
  }): EmailTemplate => ({
    subject: "â° Rappel : Rendez-vous demain",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0C0C0C; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%); color: #CCFF00; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #F4F4F4; padding: 40px 30px; }
            .footer { background: #0C0C0C; color: #CCFF00; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .reminder-box { background: white; padding: 20px; border-left: 4px solid #CCFF00; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">â° Rappel de rendez-vous</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${data.name}</strong>,</p>
              
              <p>Petit rappel concernant notre rendez-vous <strong>demain</strong> !</p>
              
              <div class="reminder-box">
                <p style="margin: 0;"><strong>ðŸ“… Demain - ${new Date(data.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</strong></p>
                <p style="margin: 10px 0 0 0; font-size: 18px;">ðŸ•’ ${data.time} (${data.duration} minutes)</p>
              </div>
              
              <p>J'ai hÃ¢te de notre Ã©change !</p>
              
              <p style="font-size: 14px; color: #666;">Si vous avez un empÃªchement, merci de me prÃ©venir dÃ¨s que possible.</p>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                Ã€ demain,<br>
                <strong>Votre Freelance</strong>
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0;">Â© 2025 Portfolio Freelance - Tous droits rÃ©servÃ©s</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Bonjour ${data.name},\n\nPetit rappel concernant notre rendez-vous demain !\n\nDemain - ${new Date(data.date).toLocaleDateString('fr-FR')}\n${data.time} (${data.duration} minutes)\n\nÃ€ demain,\nVotre Freelance`
  }),

  // Invoice overdue reminder
  invoiceOverdueReminder: (data: {
    clientName: string;
    invoiceNumber: string;
    amount: number;
    dueDate: string;
    daysOverdue: number;
  }): EmailTemplate => ({
    subject: `âš ï¸ Facture ${data.invoiceNumber} en attente de paiement`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0C0C0C; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%); color: #CCFF00; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #F4F4F4; padding: 40px 30px; }
            .footer { background: #0C0C0C; color: #CCFF00; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .alert-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">âš ï¸ Rappel de paiement</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${data.clientName}</strong>,</p>
              
              <p>Je me permets de vous rappeler que la facture <strong>${data.invoiceNumber}</strong> est en attente de rÃ¨glement.</p>
              
              <div class="alert-box">
                <p style="margin: 0;"><strong>Facture ${data.invoiceNumber}</strong></p>
                <p style="margin: 10px 0;">Montant : <strong>${data.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</strong></p>
                <p style="margin: 10px 0 0 0; color: #856404;">Date d'Ã©chÃ©ance dÃ©passÃ©e de ${data.daysOverdue} jour${data.daysOverdue > 1 ? 's' : ''} (${new Date(data.dueDate).toLocaleDateString('fr-FR')})</p>
              </div>
              
              <p>Si vous avez dÃ©jÃ  effectuÃ© ce paiement, merci de m'en informer. Dans le cas contraire, je vous serais reconnaissant de procÃ©der au rÃ¨glement dans les plus brefs dÃ©lais.</p>
              
              <p><strong>ðŸ’³ CoordonnÃ©es bancaires :</strong></p>
              <p style="font-size: 13px; margin-left: 20px;">
                IBAN : <code style="background: #f0f0f0; padding: 3px 8px; border-radius: 3px; font-size: 12px;">FR76 2823 3000 0195 1140 4606 069</code>
              </p>
              
              <p style="font-size: 14px; color: #666;">Pour toute question ou difficultÃ©, n'hÃ©sitez pas Ã  me contacter.</p>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                Cordialement,<br>
                <strong>Maxence FOULON</strong>
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0;">Â© 2025 Portfolio Freelance - Tous droits rÃ©servÃ©s</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Bonjour ${data.clientName},\n\nJe me permets de vous rappeler que la facture ${data.invoiceNumber} est en attente de rÃ¨glement.\n\nMontant : ${data.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}\nDate d'Ã©chÃ©ance dÃ©passÃ©e de ${data.daysOverdue} jour(s) (${new Date(data.dueDate).toLocaleDateString('fr-FR')})\n\nMerci de procÃ©der au rÃ¨glement dans les plus brefs dÃ©lais.\n\nCordialement,\nVotre Freelance`
  }),

  // Quote email
  quoteEmail: (data: {
    clientName: string;
    quoteNumber: string;
    amount: number;
    validUntil: string;
    pdfUrl?: string;
  }): EmailTemplate => ({
    subject: `Proposition commerciale ${data.quoteNumber} - ${data.clientName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0C0C0C; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%); color: #CCFF00; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #F4F4F4; padding: 40px 30px; }
            .footer { background: #0C0C0C; color: #CCFF00; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .quote-card { background: white; padding: 30px; border-radius: 8px; margin: 20px 0; border: 2px solid #CCFF00; }
            .amount { font-size: 36px; font-weight: 700; color: #CCFF00; margin: 20px 0; }
            .button { display: inline-block; background: #CCFF00; color: #0C0C0C; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .validity-box { background: #FFF3CD; border-left: 4px solid #FFC107; padding: 16px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">âœ¨ Nouvelle proposition commerciale</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${data.clientName}</strong>,</p>
              
              <p>J'ai le plaisir de vous transmettre ma proposition commerciale <strong>${data.quoteNumber}</strong> pour votre projet.</p>
              
              <div class="quote-card">
                <h3 style="margin: 0 0 20px 0; text-align: center;">Devis ${data.quoteNumber}</h3>
                
                <div class="info-row">
                  <span>Montant total :</span>
                  <strong class="amount">${data.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</strong>
                </div>
                
                <div class="info-row">
                  <span>Valide jusqu'au :</span>
                  <strong>${new Date(data.validUntil).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                </div>
              </div>
              
              <div class="validity-box">
                <p style="margin: 0; color: #856404;"><strong>â° Ce devis est valable jusqu'au ${new Date(data.validUntil).toLocaleDateString('fr-FR')}</strong></p>
                <p style="margin: 8px 0 0 0; font-size: 13px; color: #856404;">PassÃ© cette date, les tarifs et disponibilitÃ©s pourront Ãªtre modifiÃ©s.</p>
              </div>
              
              ${data.pdfUrl ? `
              <center>
                <a href="${data.pdfUrl}" class="button">ðŸ“„ TÃ©lÃ©charger le devis (PDF)</a>
              </center>
              ` : ''}
              
              <p><strong>Pour accepter ce devis :</strong></p>
              <ul style="color: #666;">
                <li>Signez le document PDF avec la mention "Bon pour accord"</li>
                <li>Retournez-le moi par email</li>
                <li>Un acompte de 30% sera demandÃ© pour dÃ©marrer le projet</li>
              </ul>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                Je reste Ã  votre disposition pour toute question ou prÃ©cision concernant cette proposition.<br><br>
                Cordialement,<br>
                <strong>Votre Freelance</strong>
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0;">Â© 2025 Portfolio Freelance - Tous droits rÃ©servÃ©s</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Bonjour ${data.clientName},\n\nJ'ai le plaisir de vous transmettre ma proposition commerciale ${data.quoteNumber} pour votre projet.\n\nMontant : ${data.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}\nValide jusqu'au : ${new Date(data.validUntil).toLocaleDateString('fr-FR')}\n\nCe devis est valable jusqu'au ${new Date(data.validUntil).toLocaleDateString('fr-FR')}.\n\nPour accepter ce devis, signez le document PDF avec la mention "Bon pour accord" et retournez-le moi par email.\n\nJe reste Ã  votre disposition pour toute question.\n\nCordialement,\nVotre Freelance`
  }),
};

// Send email using Resend API
export async function sendEmail(params: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return { success: false, error: "Email service not configured" };
  }

  // Validate email format BEFORE sending
  // Ensure 'to' is a string and not an array or object
  if (!params.to || typeof params.to !== 'string') {
    console.error(`âŒ Invalid 'to' field type: ${typeof params.to}, value:`, params.to);
    return { success: false, error: `Invalid 'to' field. Must be a string email address.` };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const toEmail = String(params.to).trim();
  
  if (!toEmail || !emailRegex.test(toEmail)) {
    console.error(`âŒ Invalid email format for 'to' field: "${params.to}" (type: ${typeof params.to})`);
    return { success: false, error: `Invalid 'to' field. The email address needs to follow the email@example.com format.` };
  }

  const payload: any = {
    from: params.from || "Maxence - Portfolio Freelance <contact@maxence.design>",
    to: toEmail,
    subject: params.subject,
    html: params.html,
    text: params.text,
  };

  // Add optional fields
  if (params.cc) payload.cc = params.cc;
  if (params.bcc) payload.bcc = params.bcc;
  if (params.attachments && params.attachments.length > 0) {
    payload.attachments = params.attachments;
  }

  console.log(`ðŸ“§ Preparing to send email:`, {
    to: payload.to,
    subject: payload.subject,
    from: payload.from,
    hasAttachments: !!params.attachments?.length,
    attachmentCount: params.attachments?.length || 0,
  });

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend API error:", error);
      return { success: false, error: `Failed to send email: ${error}` };
    }

    const data = await response.json();
    console.log("Email sent successfully:", data);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

// Helper functions for specific email types
export async function sendLeadConfirmation(lead: {
  email: string;
  name: string;
  message: string;
  wantsAppointment: boolean;
}) {
  const template = emailTemplates.leadConfirmation({
    name: lead.name,
    message: lead.message,
    wantsAppointment: lead.wantsAppointment,
  });

  return sendEmail({
    to: lead.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

export async function sendBookingConfirmation(booking: {
  email: string;
  name: string;
  date: string;
  time: string;
  duration: number;
  service?: string;
}) {
  const template = emailTemplates.bookingConfirmation({
    name: booking.name,
    date: booking.date,
    time: booking.time,
    duration: booking.duration,
    service: booking.service,
  });

  return sendEmail({
    to: booking.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

export async function sendInvoiceEmail(invoice: {
  clientEmail: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  pdfUrl?: string;
  pdfBase64?: string;
}) {
  const template = emailTemplates.invoiceEmail({
    clientName: invoice.clientName,
    invoiceNumber: invoice.invoiceNumber,
    amount: invoice.amount,
    dueDate: invoice.dueDate,
    pdfUrl: invoice.pdfUrl,
  });

  const attachments = invoice.pdfBase64 ? [{
    filename: `Facture_${invoice.invoiceNumber}.pdf`,
    content: invoice.pdfBase64
  }] : undefined;

  return sendEmail({
    to: invoice.clientEmail,
    cc: 'contact@maxence.design', // Copy to freelance
    subject: template.subject,
    html: template.html,
    text: template.text,
    attachments,
  });
}

export async function sendAppointmentReminder(booking: {
  email: string;
  name: string;
  date: string;
  time: string;
  duration: number;
}) {
  const template = emailTemplates.appointmentReminder({
    name: booking.name,
    date: booking.date,
    time: booking.time,
    duration: booking.duration,
  });

  return sendEmail({
    to: booking.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

export async function sendInvoiceOverdueReminder(invoice: {
  clientEmail: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  pdfBase64?: string;
}) {
  const template = emailTemplates.invoiceOverdueReminder({
    clientName: invoice.clientName,
    invoiceNumber: invoice.invoiceNumber,
    amount: invoice.amount,
    dueDate: invoice.dueDate,
    daysOverdue: invoice.daysOverdue,
  });

  const attachments = invoice.pdfBase64 ? [{
    filename: `Facture_${invoice.invoiceNumber}_RELANCE.pdf`,
    content: invoice.pdfBase64
  }] : undefined;

  return sendEmail({
    to: invoice.clientEmail,
    cc: 'contact@maxence.design', // Copy to freelance
    subject: template.subject,
    html: template.html,
    text: template.text,
    attachments,
  });
}

// New: Send invoice with secure link instead of PDF
export async function sendInvoiceLink(invoice: {
  clientEmail: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  viewLink: string;
  isOverdue?: boolean;
  daysOverdue?: number;
}) {
  const dueDate = new Date(invoice.dueDate);
  const dueDateFormatted = dueDate.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  const subject = invoice.isOverdue 
    ? `âš ï¸ Facture ${invoice.invoiceNumber} en attente de paiement`
    : `ðŸ“„ Facture ${invoice.invoiceNumber} - FOULON Maxence`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #0C0C0C; 
            margin: 0;
            padding: 0;
            background: #F4F4F4;
          }
          .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%); 
            color: #CCFF00; 
            padding: 40px 30px; 
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
          }
          .content { 
            padding: 40px 30px;
          }
          .invoice-details {
            background: #F8F9FA;
            border-radius: 8px;
            padding: 24px;
            margin: 24px 0;
          }
          .invoice-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #E0E0E0;
          }
          .invoice-row:last-child {
            border-bottom: none;
          }
          .invoice-label {
            color: #666;
            font-size: 14px;
          }
          .invoice-value {
            color: #0C0C0C;
            font-weight: 600;
            font-size: 14px;
          }
          .amount-highlight {
            background: #CCFF00;
            color: #0C0C0C;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 24px 0;
          }
          .amount-label {
            font-size: 14px;
            opacity: 0.8;
            margin-bottom: 8px;
          }
          .amount-value {
            font-size: 36px;
            font-weight: 700;
          }
          .cta-button { 
            display: inline-block; 
            background: #CCFF00; 
            color: #0C0C0C; 
            padding: 16px 40px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 700;
            font-size: 16px;
            margin: 24px 0;
            text-align: center;
            transition: all 0.3s;
          }
          .cta-button:hover {
            background: #00E5AD;
            transform: translateY(-2px);
          }
          .payment-info {
            background: #FFF9E6;
            border-left: 4px solid #FFC107;
            padding: 16px 20px;
            margin: 24px 0;
            border-radius: 4px;
          }
          .payment-info strong {
            color: #0C0C0C;
            display: block;
            margin-bottom: 8px;
          }
          .iban {
            font-family: 'Courier New', monospace;
            background: white;
            padding: 12px;
            border-radius: 4px;
            margin-top: 12px;
            font-size: 15px;
            font-weight: 700;
            color: #0C0C0C;
            letter-spacing: 1px;
          }
          .warning-box {
            background: #FFE5E5;
            border-left: 4px solid #D32F2F;
            padding: 16px 20px;
            margin: 24px 0;
            border-radius: 4px;
          }
          .footer { 
            background: #0C0C0C; 
            color: #CCFF00; 
            padding: 30px; 
            text-align: center; 
            font-size: 13px;
          }
          .footer-divider {
            height: 1px;
            background: rgba(204, 255, 0, 0.2);
            margin: 20px 0;
          }
          .footer-info {
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
            margin-top: 16px;
          }
          @media only screen and (max-width: 600px) {
            .container {
              margin: 20px;
            }
            .content {
              padding: 24px 20px;
            }
            .header {
              padding: 30px 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${invoice.isOverdue ? 'âš ï¸ Relance de paiement' : 'ðŸ“„ Nouvelle facture'}</h1>
            <p>${invoice.isOverdue ? 'Facture en attente de rÃ¨glement' : 'Merci pour votre confiance'}</p>
          </div>
          
          <div class="content">
            <p>Bonjour ${invoice.clientName},</p>
            
            ${invoice.isOverdue ? `
              <div class="warning-box">
                <strong>âš ï¸ Facture en retard de ${invoice.daysOverdue} jour${invoice.daysOverdue > 1 ? 's' : ''}</strong>
                <p style="margin: 8px 0 0 0; font-size: 14px;">
                  Cette facture aurait dÃ» Ãªtre rÃ©glÃ©e le ${dueDateFormatted}. Merci de procÃ©der au paiement dans les plus brefs dÃ©lais.
                </p>
              </div>
            ` : `
              <p>Vous trouverez ci-dessous le dÃ©tail de votre facture.</p>
            `}
            
            <div class="invoice-details">
              <div class="invoice-row">
                <span class="invoice-label">NumÃ©ro de facture</span>
                <span class="invoice-value">${invoice.invoiceNumber}</span>
              </div>
              <div class="invoice-row">
                <span class="invoice-label">Date d'Ã©chÃ©ance</span>
                <span class="invoice-value">${dueDateFormatted}</span>
              </div>
            </div>
            
            <div class="amount-highlight">
              <div class="amount-label">Montant Ã  rÃ©gler</div>
              <div class="amount-value">${invoice.amount.toFixed(2)} â‚¬</div>
            </div>
            
            <div style="text-align: center;">
              <a href="${invoice.viewLink}" class="cta-button">
                ðŸ‘ï¸ Voir et payer la facture
              </a>
            </div>
            
            <div class="payment-info">
              <strong>ðŸ’³ ModalitÃ©s de paiement</strong>
              <p style="margin: 4px 0; font-size: 14px;">
                Moyens acceptÃ©s : Virement bancaire, PayPal
              </p>
              <div class="iban">
                IBAN : FR76 2823 3000 0195 1140 4606 069
              </div>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              Pour toute question, n'hÃ©sitez pas Ã  me contacter directement.
            </p>
            
            <p style="margin-top: 24px; font-size: 14px;">
              Cordialement,<br>
              <strong>Maxence FOULON</strong><br>
              <span style="color: #666;">DÃ©veloppeur Web Freelance</span>
            </p>
          </div>
          
          <div class="footer">
            <strong>FOULON Maxence</strong>
            <div class="footer-divider"></div>
            <div class="footer-info">
              33 Route Du Mans, 72650 La Milesse, France<br>
              contact@maxence.design<br>
              Entreprise Individuelle - Micro entrepreneur - SIRET : 93763849200010
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
  
  const text = `
Bonjour ${invoice.clientName},

${invoice.isOverdue 
  ? `âš ï¸ RELANCE - Facture en retard de ${invoice.daysOverdue} jour${invoice.daysOverdue > 1 ? 's' : ''}

Cette facture aurait dÃ» Ãªtre rÃ©glÃ©e le ${dueDateFormatted}.`
  : 'Vous trouverez ci-dessous le dÃ©tail de votre facture.'
}

NumÃ©ro de facture : ${invoice.invoiceNumber}
Date d'Ã©chÃ©ance : ${dueDateFormatted}
Montant Ã  rÃ©gler : ${invoice.amount.toFixed(2)} â‚¬

Pour consulter et payer votre facture, veuillez suivre ce lien sÃ©curisÃ© :
${invoice.viewLink}

ModalitÃ©s de paiement :
- Moyens acceptÃ©s : Virement bancaire, PayPal
- IBAN : FR76 2823 3000 0195 1140 4606 069

Pour toute question, n'hÃ©sitez pas Ã  me contacter directement.

Cordialement,
Maxence FOULON
DÃ©veloppeur Web Freelance

---
FOULON Maxence
33 Route Du Mans, 72650 La Milesse, France
contact@maxence.design
Entreprise Individuelle - Micro entrepreneur - SIRET : 93763849200010
  `;
  
  return sendEmail({
    to: invoice.clientEmail,
    cc: 'contact@maxence.design',
    subject,
    html,
    text,
  });
}

export async function sendQuoteEmail(quote: {
  clientEmail: string;
  clientName: string;
  quoteNumber: string;
  amount: number;
  validUntil: string;
  pdfUrl?: string;
}) {
  const template = emailTemplates.quoteEmail({
    clientName: quote.clientName,
    quoteNumber: quote.quoteNumber,
    amount: quote.amount,
    validUntil: quote.validUntil,
    pdfUrl: quote.pdfUrl,
  });

  return sendEmail({
    to: quote.clientEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

export async function sendTestimonialRequest(data: {
  clientName: string;
  clientEmail: string;
  projectName: string;
  projectType: string;
  customMessage: string;
  reviewUrl: string;
}) {
  const customMessageSection = data.customMessage 
    ? `
      <div class="message-box">
        <p style="margin: 0; font-style: italic; color: #666;">
          "${data.customMessage}"
        </p>
      </div>
    `
    : '';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0C0C0C; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%); color: #CCFF00; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #F4F4F4; padding: 40px 30px; }
          .footer { background: #0C0C0C; color: #CCFF00; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #CCFF00; color: #0C0C0C; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; font-size: 16px; }
          .highlight { background: #CCFF00; color: #0C0C0C; padding: 2px 8px; border-radius: 4px; }
          .message-box { background: white; padding: 20px; border-left: 4px solid #CCFF00; margin: 20px 0; border-radius: 4px; }
          .stars { font-size: 32px; margin: 20px 0; text-align: center; }
          .benefit-box { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; border: 2px solid #CCFF00; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">â­ Votre avis compte !</h1>
          </div>
          <div class="content">
            <p>Bonjour <strong>${data.clientName}</strong>,</p>
            
            <p>
              J'espÃ¨re que vous Ãªtes satisfait(e) de notre collaboration sur le projet 
              <span class="highlight">${data.projectName}</span>${data.projectType ? ` (${data.projectType})` : ''} !
            </p>

            ${customMessageSection}
            
            <p>
              <strong>Votre retour d'expÃ©rience est trÃ¨s prÃ©cieux</strong> pour moi et pour mes futurs clients. 
              Cela m'aide Ã  amÃ©liorer mes services et Ã  inspirer confiance aux personnes qui hÃ©sitent encore.
            </p>

            <div class="stars">
              â­â­â­â­â­
            </div>

            <center>
              <a href="${data.reviewUrl}" class="button">
                âœï¸ Laisser mon avis (2 minutes)
              </a>
            </center>

            <div class="benefit-box">
              <p style="margin: 0 0 10px 0;"><strong>ðŸ“ Ce que vous pouvez partager :</strong></p>
              <ul style="margin: 0; padding-left: 20px; color: #666;">
                <li>Votre expÃ©rience de collaboration</li>
                <li>Les rÃ©sultats obtenus</li>
                <li>Ce qui vous a particuliÃ¨rement plu</li>
                <li>Votre recommandation pour d'autres projets</li>
              </ul>
            </div>

            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              <strong>Pourquoi votre avis est important ?</strong><br>
              â€¢ Il aide d'autres entreprises Ã  faire le bon choix<br>
              â€¢ Il me permet d'amÃ©liorer continuellement mes services<br>
              â€¢ Il valorise notre collaboration rÃ©ussie<br>
              â€¢ Il ne prend que 2 minutes de votre temps
            </p>

            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              Je vous remercie sincÃ¨rement d'avoir fait confiance Ã  mes services et j'espÃ¨re avoir l'opportunitÃ© de travailler Ã  nouveau avec vous !
              <br><br>
              Cordialement,<br>
              <strong>Maxence</strong>
            </p>

            <p style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; font-size: 13px; color: #999;">
              ðŸ’¡ <em>Votre tÃ©moignage pourra Ãªtre publiÃ© sur mon portfolio avec votre accord. Si vous prÃ©fÃ©rez rester anonyme, prÃ©cisez-le dans votre message.</em>
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0;">Â© 2025 Maxence - Portfolio Freelance</p>
            <p style="margin: 10px 0 0 0; font-size: 11px; opacity: 0.7;">
              Paris, France â€¢ <a href="https://maxence.design" style="color: #CCFF00;">maxence.design</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `Bonjour ${data.clientName},

J'espÃ¨re que vous Ãªtes satisfait(e) de notre collaboration sur le projet ${data.projectName}${data.projectType ? ` (${data.projectType})` : ''} !

${data.customMessage ? `"${data.customMessage}"\n\n` : ''}Votre retour d'expÃ©rience est trÃ¨s prÃ©cieux pour moi et pour mes futurs clients.

Pour laisser votre avis, cliquez sur ce lien : ${data.reviewUrl}

Cela ne prend que 2 minutes et m'aide Ã©normÃ©ment !

Merci sincÃ¨rement,
Maxence`;

  return sendEmail({
    to: data.clientEmail,
    subject: `â­ Votre avis sur notre projet "${data.projectName}"`,
    html,
    text,
  });
}
