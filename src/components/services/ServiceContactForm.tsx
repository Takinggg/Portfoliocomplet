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
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { useLanguage } from "../../utils/i18n/LanguageContext";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || "ukumyzjjcmdcuwvwzkct";
const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdW15empqY21kY3V3dnd6a2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MTc0MzksImV4cCI6MjA0ODI5MzQzOX0.f-XzqLQ9LJJgRhbFKfj1YQdZBVDm0bGHvNZgFmTYzBg";

interface ServiceContactFormProps {
  onSuccess?: () => void;
}

export function ServiceContactForm({ onSuccess }: ServiceContactFormProps) {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.message || selectedReasons.length === 0) {
      toast.error(language === 'en' ? 'Please fill in all required fields and select at least one interest' : 'Veuillez remplir tous les champs requis et sélectionner au moins un intérêt');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send lead to backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: "",
            message: formData.message,
            source: "services_page",
            status: "new",
            interests: selectedReasons,
            budget: formData.budget,
            subject: formData.subject,
            company: formData.company,
            createdAt: new Date().toISOString()
          }),
        }
      );

      if (response.ok) {
        // Success animation
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00FFC2", "#0C0C0C", "#F4F4F4"],
        });

        toast.success(language === 'en' ? 'Message sent successfully! I will respond within 24h.' : 'Message envoyé avec succès ! Je vous réponds sous 24h.');
        setIsSuccess(true);
        
        if (onSuccess) onSuccess();

        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            company: "",
            budget: "",
            subject: "",
            message: "",
          });
          setSelectedReasons([]);
          setIsSuccess(false);
        }, 3000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(language === 'en' ? 'Error sending message. Please try again.' : 'Erreur lors de l\'envoi. Veuillez réessayer.');
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
        <h3 className="text-3xl font-bold mb-4">
          {language === 'en' ? 'Thank you!' : 'Merci !'}
        </h3>
        <p className="text-xl text-neutral-400 mb-2">
          {language === 'en' ? 'Your request has been received.' : 'Votre demande a bien été reçue.'}
        </p>
        <p className="text-neutral-500">
          {language === 'en' ? 'I will respond within 24h.' : 'Je vous réponds sous 24h.'}
        </p>
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
          {language === 'en' ? 'Full name' : 'Nom complet'} <span className="text-red-400">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={language === 'en' ? 'John Doe' : 'Jean Dupont'}
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
          placeholder={language === 'en' ? 'john.doe@example.com' : 'jean.dupont@example.com'}
          className="bg-neutral-900 border-neutral-800 focus:border-mint"
        />
      </div>

      {/* Company */}
      <div>
        <Label htmlFor="company" className="text-white mb-2">
          {language === 'en' ? 'Company / Project' : 'Société / Projet'}
        </Label>
        <Input
          id="company"
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder={language === 'en' ? 'Your company name' : 'Nom de votre entreprise'}
          className="bg-neutral-900 border-neutral-800 focus:border-mint"
        />
      </div>

      {/* Budget range */}
      <div>
        <Label htmlFor="budget" className="text-white mb-2">
          {language === 'en' ? 'Estimated budget' : 'Budget estimé'} <span className="text-red-400">*</span>
        </Label>
        <Select
          required
          value={formData.budget}
          onValueChange={(value) => setFormData({ ...formData, budget: value })}
        >
          <SelectTrigger className="bg-neutral-900 border-neutral-800 focus:border-mint">
            <SelectValue placeholder={language === 'en' ? 'Select a range' : 'Sélectionnez une fourchette'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="300-500">300 - 500 € (Starter)</SelectItem>
            <SelectItem value="1000-2500">1 000 - 2 500 € (Pro)</SelectItem>
            <SelectItem value="4000+">4 000+ € (Scale)</SelectItem>
            <SelectItem value="custom">{language === 'en' ? 'Custom quote' : 'Sur devis personnalisé'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Interests - Multiple checkboxes */}
      <div className="space-y-3">
        <Label className="text-white">
          {language === 'en' ? 'I\'m interested in' : 'Je suis intéressé(e) par'} <span className="text-red-400">*</span>
        </Label>
        <div className="grid md:grid-cols-2 gap-3">
          {(language === 'en' 
            ? ["UI/UX Design", "Automation & AI", "Front-end Integration", "Full Project", "Audit & Consulting", "Dashboards & Reporting"]
            : ["UI/UX Design", "Automatisation & IA", "Intégration Front-end", "Projet complet", "Audit & Consultation", "Dashboards & Reporting"]
          ).map((reason, index) => {
            const isSelected = selectedReasons.includes(reason);
            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setSelectedReasons(selectedReasons.filter(r => r !== reason));
                  } else {
                    setSelectedReasons([...selectedReasons, reason]);
                  }
                }}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer text-left
                  ${isSelected 
                    ? 'bg-mint/10 border-2 border-mint' 
                    : 'bg-neutral-900/50 border border-neutral-800 hover:border-mint/20'
                  }
                `}
              >
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${isSelected ? 'border-mint' : 'border-neutral-600'}
                `}>
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-mint" />
                  )}
                </div>
                <span className={`text-sm ${isSelected ? 'text-white font-medium' : 'text-neutral-400'}`}>
                  {reason}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message */}
      <div>
        <Label htmlFor="message" className="text-white mb-2">
          {language === 'en' ? 'Describe your project' : 'Décrivez votre projet'} <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="message"
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder={language === 'en' ? 'Tell me about your needs, goals, and constraints...' : 'Parlez-moi de vos besoins, objectifs et contraintes...'}
          rows={6}
          className="bg-neutral-900 border-neutral-800 focus:border-mint resize-none"
        />
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
            {language === 'en' ? 'Sending...' : 'Envoi en cours...'}
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            {language === 'en' ? 'Send my request' : 'Envoyer ma demande'}
          </>
        )}
      </Button>

      {/* Privacy note */}
      <p className="text-xs text-neutral-500 text-center">
        {language === 'en' 
          ? 'By submitting this form, you agree that your data will be used to contact you. Your information is treated confidentially and in compliance with GDPR.'
          : 'En soumettant ce formulaire, vous acceptez que vos données soient utilisées pour vous recontacter. Vos informations sont traitées de manière confidentielle et conformément au RGPD.'}
      </p>
    </motion.form>
  );
}
