import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

interface ServiceContactFormProps {
  onSuccess?: () => void;
}

export function ServiceContactForm({ onSuccess }: ServiceContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    subject: "",
    message: "",
    wantsCall: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulation d'envoi (à remplacer par votre logique backend)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Intégrer avec votre backend
      // - Sauvegarder dans Notion/Supabase
      // - Envoyer email via SendGrid/Resend
      // - Notification Slack/Telegram

      console.log("Form submitted:", formData);

      setIsSuccess(true);
      if (onSuccess) onSuccess();

      // Reset form après 3 secondes
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          company: "",
          budget: "",
          subject: "",
          message: "",
          wantsCall: false,
        });
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-mint/20 border border-mint/30 mb-6">
          <CheckCircle2 className="h-10 w-10 text-mint" />
        </div>
        <h3 className="text-3xl font-bold mb-4">Merci !</h3>
        <p className="text-xl text-neutral-400 mb-2">
          Votre demande a bien été reçue.
        </p>
        <p className="text-neutral-500">Je vous réponds sous 24h.</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Name */}
      <div>
        <Label htmlFor="name" className="text-white mb-2">
          Nom complet <span className="text-red-400">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Jean Dupont"
          className="bg-neutral-900 border-neutral-800 focus:border-mint"
        />
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email" className="text-white mb-2">
          Email <span className="text-red-400">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="jean.dupont@example.com"
          className="bg-neutral-900 border-neutral-800 focus:border-mint"
        />
      </div>

      {/* Company */}
      <div>
        <Label htmlFor="company" className="text-white mb-2">
          Société / Projet
        </Label>
        <Input
          id="company"
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder="Nom de votre entreprise"
          className="bg-neutral-900 border-neutral-800 focus:border-mint"
        />
      </div>

      {/* Budget range */}
      <div>
        <Label htmlFor="budget" className="text-white mb-2">
          Budget estimé <span className="text-red-400">*</span>
        </Label>
        <Select
          required
          value={formData.budget}
          onValueChange={(value) => setFormData({ ...formData, budget: value })}
        >
          <SelectTrigger className="bg-neutral-900 border-neutral-800 focus:border-mint">
            <SelectValue placeholder="Sélectionnez une fourchette" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="300-500">300 - 500 € (Starter)</SelectItem>
            <SelectItem value="1000-2500">1 000 - 2 500 € (Pro)</SelectItem>
            <SelectItem value="4000+">4 000+ € (Scale)</SelectItem>
            <SelectItem value="custom">Sur devis personnalisé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subject */}
      <div>
        <Label htmlFor="subject" className="text-white mb-2">
          Type de projet <span className="text-red-400">*</span>
        </Label>
        <Select
          required
          value={formData.subject}
          onValueChange={(value) => setFormData({ ...formData, subject: value })}
        >
          <SelectTrigger className="bg-neutral-900 border-neutral-800 focus:border-mint">
            <SelectValue placeholder="Sélectionnez le type de projet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ui-ux">UI/UX Design</SelectItem>
            <SelectItem value="automation">Automatisation & IA</SelectItem>
            <SelectItem value="integration">Intégration & Développement</SelectItem>
            <SelectItem value="dashboard">Dashboard & Reporting</SelectItem>
            <SelectItem value="full-stack">Projet complet (Design + Tech)</SelectItem>
            <SelectItem value="audit">Audit & Consultation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Message */}
      <div>
        <Label htmlFor="message" className="text-white mb-2">
          Décrivez votre projet <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="message"
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Décrivez brièvement votre besoin, vos objectifs et vos contraintes..."
          rows={6}
          className="bg-neutral-900 border-neutral-800 focus:border-mint resize-none"
        />
      </div>

      {/* Checkbox for call request */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-mint/5 border border-mint/20">
        <Checkbox
          id="wantsCall"
          checked={formData.wantsCall}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, wantsCall: checked as boolean })
          }
          className="mt-1"
        />
        <Label
          htmlFor="wantsCall"
          className="text-sm text-neutral-300 cursor-pointer"
        >
          Je souhaite être rappelé(e) pour un audit gratuit de 15 minutes
        </Label>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-mint text-black hover:bg-mint/90 h-14 text-lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Envoyer ma demande
          </>
        )}
      </Button>

      {/* Privacy note */}
      <p className="text-xs text-neutral-500 text-center">
        En soumettant ce formulaire, vous acceptez que vos données soient utilisées
        pour vous recontacter. Vos informations sont traitées de manière confidentielle
        et conformément au RGPD.
      </p>
    </motion.form>
  );
}
