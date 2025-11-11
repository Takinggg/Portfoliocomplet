import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Mail,
  Send,
  Users,
  Eye,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { toast } from "sonner@2.0.3";
import DOMPurify from "dompurify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface Campaign {
  subject: string;
  content: string;
  htmlContent?: string; // Store pre-generated HTML from templates
  recipientFilter: "all" | "confirmed";
}

export function NewsletterCampaignTab() {
  const [campaign, setCampaign] = useState<Campaign>({
    subject: "",
    content: "",
    recipientFilter: "confirmed",
  });
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState<{
    total: number;
    confirmed: number;
  }>({ total: 0, confirmed: 0 });

  useEffect(() => {
    loadSubscriberCount();
    
    // Load template from localStorage if available
    const loadTemplate = () => {
      const subject = localStorage.getItem("newsletter_draft_subject");
      const html = localStorage.getItem("newsletter_draft_html");
      const text = localStorage.getItem("newsletter_draft_text");
      
      if (subject && html) {
        console.log("📧 Template chargé depuis localStorage");
        console.log("  Sujet:", subject);
        console.log("  HTML length:", html.length);
        console.log("  Text length:", text?.length || 0);
        
        setCampaign({
          subject,
          content: text || html, // Use text fallback or HTML
          htmlContent: html, // Store the full HTML
          recipientFilter: "confirmed",
        });
        
        toast.success("✅ Template chargé avec succès !", {
          description: "Vous pouvez maintenant modifier et envoyer",
        });
        
        // Clear localStorage after loading
        localStorage.removeItem("newsletter_draft_subject");
        localStorage.removeItem("newsletter_draft_html");
        localStorage.removeItem("newsletter_draft_text");
      }
    };
    
    loadTemplate();
    
    // Listen for template selection event
    const handleTemplateSelected = () => {
      console.log("🔔 Événement template-selected reçu");
      setTimeout(() => {
        loadTemplate();
      }, 100); // Small delay to ensure localStorage is written
    };
    
    window.addEventListener("newsletter-template-selected", handleTemplateSelected);
    
    return () => {
      window.removeEventListener("newsletter-template-selected", handleTemplateSelected);
    };
  }, []);

  const loadSubscriberCount = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/newsletter/subscribers`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const subscribers = data.subscribers || [];
        setSubscriberCount({
          total: subscribers.length,
          confirmed: subscribers.filter((s: any) => s.status === "confirmed")
            .length,
        });
      }
    } catch (error) {
      console.error("Error loading subscriber count:", error);
    }
  };

  const getRecipientCount = () => {
    return campaign.recipientFilter === "all"
      ? subscriberCount.total
      : subscriberCount.confirmed;
  };

  const handleSendCampaign = async () => {
    if (!campaign.subject.trim()) {
      toast.error("Veuillez saisir un sujet");
      return;
    }

    if (!campaign.content.trim()) {
      toast.error("Veuillez saisir un contenu");
      return;
    }

    const recipientCount = getRecipientCount();
    if (recipientCount === 0) {
      toast.error("Aucun destinataire pour cette campagne");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/newsletter/send-campaign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            subject: campaign.subject,
            content: campaign.content,
            recipientFilter: campaign.recipientFilter,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(
          `✅ Campagne envoyée à ${data.sent} abonné${data.sent > 1 ? "s" : ""}`,
          {
            description: data.failed > 0 ? `${data.failed} échec(s)` : undefined,
          }
        );
        
        // Reset form
        setCampaign({
          subject: "",
          content: "",
          recipientFilter: "confirmed",
        });
      } else {
        const error = await response.json();
        toast.error("Erreur lors de l'envoi", {
          description: error.error || "Une erreur est survenue",
        });
      }
    } catch (error) {
      console.error("Error sending campaign:", error);
      toast.error("Impossible d'envoyer la campagne");
    } finally {
      setIsSending(false);
    }
  };

  const generateEmailHTML = () => {
    // If we have pre-generated HTML from a template, use it
    if (campaign.htmlContent) {
      console.log("📧 Utilisation du HTML pré-généré du template");
      return `
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
                background-color: #F4F4F4;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%);
                color: #00FFC2;
                padding: 40px 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
              }
              .content {
                background: white;
                padding: 40px 30px;
                border-radius: 0 0 8px 8px;
              }
              .footer {
                background: #0C0C0C;
                color: #00FFC2;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                border-radius: 8px;
                margin-top: 20px;
              }
              .unsubscribe {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #999;
              }
              .unsubscribe a {
                color: #00FFC2;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✨ ${campaign.subject}</h1>
              </div>
              <div class="content">
                ${campaign.htmlContent}
                
                <div class="unsubscribe">
                  <p>Vous recevez cet email car vous êtes inscrit à notre newsletter.</p>
                  <p><a href="{{unsubscribe_url}}">Se désabonner</a></p>
                </div>
              </div>
              <div class="footer">
                <p style="margin: 0;">© 2025 Portfolio Freelance - Tous droits réservés</p>
              </div>
            </div>
          </body>
        </html>
      `;
    }
    
    // Otherwise, generate HTML from text content (manual entry)
    console.log("📧 Génération du HTML depuis le contenu texte");
    const formattedContent = campaign.content.replace(/\n/g, "<br>");

    return `
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
              background-color: #F4F4F4;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%);
              color: #00FFC2;
              padding: 40px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              background: white;
              padding: 40px 30px;
              border-radius: 0 0 8px 8px;
            }
            .footer {
              background: #0C0C0C;
              color: #00FFC2;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              border-radius: 8px;
              margin-top: 20px;
            }
            .unsubscribe {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #999;
            }
            .unsubscribe a {
              color: #00FFC2;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ ${campaign.subject || "Newsletter"}</h1>
            </div>
            <div class="content">
              <p style="white-space: pre-wrap;">${formattedContent || "Contenu de votre newsletter..."}</p>
              
              <div class="unsubscribe">
                <p>Vous recevez cet email car vous êtes inscrit à notre newsletter.</p>
                <p><a href="{{unsubscribe_url}}">Se désabonner</a></p>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0;">© 2025 Portfolio Freelance - Tous droits réservés</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white mb-2">Campagne Newsletter</h2>
          <p className="text-white/60">
            Composez et envoyez un email à vos abonnés
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowPreview(true)}
            variant="outline"
            className="border-[#00FFC2]/30 text-[#00FFC2] hover:bg-[#00FFC2]/10"
            disabled={!campaign.subject || !campaign.content}
          >
            <Eye className="h-4 w-4 mr-2" />
            Prévisualiser
          </Button>
          <Button
            onClick={handleSendCampaign}
            disabled={isSending || !campaign.subject || !campaign.content}
            className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Envoyer la campagne
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Abonnés confirmés</p>
              <p className="text-2xl text-white">{subscriberCount.confirmed}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-[#00FFC2]" />
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Total abonnés</p>
              <p className="text-2xl text-white">{subscriberCount.total}</p>
            </div>
            <Users className="h-8 w-8 text-white/40" />
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Destinataires</p>
              <p className="text-2xl text-white">{getRecipientCount()}</p>
            </div>
            <Mail className="h-8 w-8 text-[#00FFC2]" />
          </div>
        </Card>
      </div>

      {/* Campaign Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subject */}
          <Card className="bg-white/5 border-white/10 p-6">
            <label className="text-sm text-white/60 mb-2 block">
              Sujet de l'email *
            </label>
            <Input
              placeholder="Ex: Nouvelle fonctionnalité disponible !"
              value={campaign.subject}
              onChange={(e) =>
                setCampaign({ ...campaign, subject: e.target.value })
              }
              className="bg-white/5 border-white/10 text-white text-lg"
            />
          </Card>

          {/* Content */}
          <Card className="bg-white/5 border-white/10 p-6">
            <label className="text-sm text-white/60 mb-2 block">
              Contenu du message *
            </label>
            <Textarea
              placeholder="Rédigez votre message ici...&#10;&#10;Bonjour,&#10;&#10;Nous avons le plaisir de vous annoncer...&#10;&#10;À très bientôt !"
              value={campaign.content}
              onChange={(e) =>
                setCampaign({ ...campaign, content: e.target.value })
              }
              className="bg-white/5 border-white/10 text-white min-h-[300px]"
            />
            <p className="text-xs text-white/40 mt-2">
              Longueur : {campaign.content.length} caractères
            </p>
            {campaign.htmlContent && (
              <p className="text-xs text-[#00FFC2] mt-1">
                ✨ Template HTML pré-généré actif
              </p>
            )}
          </Card>
        </div>

        {/* Right Column - Settings & Tips */}
        <div className="space-y-6">
          {/* Recipient Filter */}
          <Card className="bg-white/5 border-white/10 p-6">
            <label className="text-sm text-white/60 mb-2 block">
              Destinataires
            </label>
            <Select
              value={campaign.recipientFilter}
              onValueChange={(value: "all" | "confirmed") =>
                setCampaign({ ...campaign, recipientFilter: value })
              }
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#00FFC2]" />
                    <span>Confirmés uniquement ({subscriberCount.confirmed})</span>
                  </div>
                </SelectItem>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Tous les abonnés ({subscriberCount.total})</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-white/40 mt-2">
              ⚠️ Recommandé : envoyez uniquement aux abonnés confirmés
            </p>
          </Card>

          {/* Tips */}
          <Card className="bg-gradient-to-br from-[#00FFC2]/10 to-[#00FFC2]/5 border-[#00FFC2]/30 p-6">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="h-5 w-5 text-[#00FFC2] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white mb-2">Conseils</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Sujet court et accrocheur (max 50 caractères)</li>
                  <li>• Contenu clair et concis</li>
                  <li>• Utilisez des sauts de ligne pour aérer</li>
                  <li>• Prévisualisez avant d'envoyer</li>
                  <li>• Envoyez aux heures de bureau</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Warning */}
          {getRecipientCount() > 0 && (
            <Card className="bg-yellow-500/10 border-yellow-500/30 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-500">
                    Cette action enverra un email à{" "}
                    <strong>{getRecipientCount()} abonné
                    {getRecipientCount() > 1 ? "s" : ""}</strong>.
                  </p>
                  <p className="text-xs text-yellow-500/70 mt-1">
                    Cette action est irréversible.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl bg-[#0C0C0C] border-white/10 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              Aperçu de l'email
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Voici comment votre email apparaîtra aux abonnés
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {/* Email Preview */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                <Mail className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">Sujet :</span>
                <span className="text-white">{campaign.subject}</span>
              </div>
            </div>
            
            {/* HTML Preview */}
            <div
              className="bg-white rounded-lg overflow-hidden"
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(generateEmailHTML(), {
                  ALLOWED_TAGS: [
                    'html', 'head', 'title', 'meta', 'style', 'body',
                    'div', 'span', 'p', 'br', 'a', 'img',
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'strong', 'em', 'u', 'ul', 'ol', 'li',
                    'table', 'thead', 'tbody', 'tr', 'th', 'td',
                  ],
                  ALLOWED_ATTR: [
                    'href', 'src', 'alt', 'title', 'style', 'class', 'id',
                    'width', 'height', 'target', 'rel', 'align', 'valign',
                    'cellpadding', 'cellspacing', 'border', 'bgcolor',
                  ],
                  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
                })
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
