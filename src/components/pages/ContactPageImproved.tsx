import { useState, useEffect } from "react";
import { useForm } from "react-hook-form@7.55.0";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { motion } from "motion/react";
import { 
  Mail, 
  MapPin, 
  Send, 
  Calendar,
  Clock,
  CheckCircle2,
  MessageSquare,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { useAnalytics, usePageTracking } from "../../utils/hooks/useAnalytics";
import { contactFormSchema, type ContactFormData } from "../../utils/formSchemas";
import { useFormDraft, formatDraftAge } from "../../utils/hooks/useFormDraft";
import { FormInput, FormTextarea, FormSelect, FormSection, FormDraftIndicator } from "../forms/FormField";
import { SimpleCaptcha } from "../forms/SimpleCaptcha";

type Page = "booking";

interface ContactPageImprovedProps {
  onNavigate: (page: Page) => void;
}

export default function ContactPageImproved({ onNavigate }: ContactPageImprovedProps) {
  const { t } = useTranslation();
  const analytics = useAnalytics();
  
  usePageTracking('contact', 'Contact Page');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
    watch,
    setValue,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange", // Validate on change for real-time feedback
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
      budget: "",
      timeline: "",
      wantsAppointment: false,
      acceptsTerms: false,
    },
  });

  // Auto-save draft
  const { getDraftInfo, clearDraft } = useFormDraft({
    formId: "contact-form",
    watch,
    setValue,
    enabled: true,
    debounceMs: 1000,
    excludeFields: ["acceptsTerms"], // Don't save checkbox state
  });

  const draftInfo = getDraftInfo();

  // Submit handler
  const onSubmit = async (data: ContactFormData) => {
    if (!isCaptchaVerified) {
      toast.error("Veuillez compléter la vérification anti-spam");
      return;
    }

    setIsSubmitting(true);
    analytics.trackFormStart('Contact Form');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            company: data.company || null,
            message: data.message,
            budget: data.budget || null,
            timeline: data.timeline || null,
            source: "contact_form",
            status: "new",
            wantsAppointment: data.wantsAppointment,
            interests: selectedServices,
            createdAt: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'envoi");
      }

      // Success!
      toast.success("Message envoyé ! Je vous réponds rapidement.");
      
      analytics.trackContactConversion('Contact Form');
      analytics.trackFormSubmit('Contact Form');
      
      // Send confirmation email (fire and forget)
      fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/emails/lead-confirmation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email: data.email,
            name: data.name,
            message: data.message,
            wantsAppointment: data.wantsAppointment,
          }),
        }
      ).catch(console.error);
      
      // Clear form and draft
      reset();
      clearDraft();
      setSelectedServices([]);
      setIsCaptchaVerified(false);
      
      // Navigate to booking if requested
      if (data.wantsAppointment) {
        analytics.trackEvent('Booking Intent', 'Contact Form', 'Yes');
        setTimeout(() => {
          toast.info("Redirection vers la prise de rendez-vous...");
          onNavigate("booking");
        }, 1500);
      }
      
    } catch (error: any) {
      console.error("Contact form error:", error);
      toast.error(error.message || "Erreur lors de l'envoi du message");
      analytics.trackFormError('Contact Form', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    { id: "website", label: "Site Vitrine", icon: "🌐" },
    { id: "webapp", label: "Application Web", icon: "⚡" },
    { id: "ecommerce", label: "E-commerce", icon: "🛒" },
    { id: "mobile", label: "Application Mobile", icon: "📱" },
    { id: "api", label: "API / Backend", icon: "🔌" },
    { id: "consulting", label: "Conseil", icon: "💡" },
  ];

  const budgetRanges = [
    { value: "<5k", label: "Moins de 5 000€" },
    { value: "5k-10k", label: "5 000€ - 10 000€" },
    { value: "10k-25k", label: "10 000€ - 25 000€" },
    { value: "25k-50k", label: "25 000€ - 50 000€" },
    { value: ">50k", label: "Plus de 50 000€" },
  ];

  const timelines = [
    { value: "urgent", label: "Urgent (< 1 mois)" },
    { value: "1month", label: "1 mois" },
    { value: "3months", label: "3 mois" },
    { value: "6months", label: "6 mois" },
    { value: "flexible", label: "Flexible" },
  ];

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            {t("contact.title")}
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="bg-neutral-900/50 border-neutral-800">
              <CardContent className="p-8">
                {/* Draft Indicator */}
                {draftInfo && (
                  <FormDraftIndicator
                    draftAge={formatDraftAge(draftInfo.ageMs)}
                    onClear={() => {
                      clearDraft();
                      reset();
                      toast.success("Brouillon effacé");
                    }}
                  />
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Personal Info Section */}
                  <FormSection
                    title="Informations personnelles"
                    description="Pour que je puisse vous recontacter"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormInput
                        label="Nom complet"
                        {...register("name")}
                        error={errors.name?.message}
                        touched={touchedFields.name}
                        required
                        placeholder="Jean Dupont"
                        success
                      />

                      <FormInput
                        label="Email"
                        type="email"
                        {...register("email")}
                        error={errors.email?.message}
                        touched={touchedFields.email}
                        required
                        placeholder="jean.dupont@example.com"
                        success
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormInput
                        label="Téléphone"
                        type="tel"
                        {...register("phone")}
                        error={errors.phone?.message}
                        touched={touchedFields.phone}
                        placeholder="+33 6 12 34 56 78"
                        helpText="Optionnel"
                        success
                      />

                      <FormInput
                        label="Entreprise"
                        {...register("company")}
                        error={errors.company?.message}
                        touched={touchedFields.company}
                        placeholder="Ma Société SARL"
                        helpText="Optionnel"
                        success
                      />
                    </div>
                  </FormSection>

                  {/* Project Info Section */}
                  <FormSection
                    title="Votre projet"
                    description="Décrivez-moi votre besoin"
                  >
                    {/* Services */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">
                        Services souhaités
                      </label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {services.map((service) => (
                          <label
                            key={service.id}
                            className="flex items-center gap-3 p-3 rounded-lg border border-neutral-800 hover:border-mint/30 cursor-pointer transition-all"
                          >
                            <Checkbox
                              checked={selectedServices.includes(service.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedServices([...selectedServices, service.id]);
                                } else {
                                  setSelectedServices(
                                    selectedServices.filter((s) => s !== service.id)
                                  );
                                }
                              }}
                            />
                            <span className="text-xl">{service.icon}</span>
                            <span className="text-sm">{service.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <FormTextarea
                      label="Description du projet"
                      {...register("message")}
                      error={errors.message?.message}
                      touched={touchedFields.message}
                      required
                      placeholder="Décrivez votre projet, vos besoins, vos objectifs..."
                      rows={6}
                      showCount
                      maxCount={2000}
                      success
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormSelect
                        label="Budget estimé"
                        {...register("budget")}
                        error={errors.budget?.message}
                        touched={touchedFields.budget}
                        options={budgetRanges}
                        helpText="Indicatif"
                        success
                      />

                      <FormSelect
                        label="Délai souhaité"
                        {...register("timeline")}
                        error={errors.timeline?.message}
                        touched={touchedFields.timeline}
                        options={timelines}
                        helpText="Quand démarrer ?"
                        success
                      />
                    </div>
                  </FormSection>

                  {/* CAPTCHA */}
                  <SimpleCaptcha
                    onVerify={setIsCaptchaVerified}
                    disabled={isSubmitting}
                  />

                  {/* Options */}
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 p-4 rounded-lg border border-neutral-800 hover:border-mint/30 cursor-pointer transition-all">
                      <Checkbox {...register("wantsAppointment")} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-mint" />
                          <span className="text-sm font-medium">
                            Je souhaite prendre rendez-vous
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">
                          Discutons de votre projet lors d'un appel gratuit
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3">
                      <Checkbox {...register("acceptsTerms")} />
                      <span className="text-sm text-neutral-400">
                        J'accepte que mes données soient utilisées pour me recontacter
                        {errors.acceptsTerms && (
                          <span className="block text-red-500 text-xs mt-1">
                            {errors.acceptsTerms.message}
                          </span>
                        )}
                      </span>
                    </label>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isCaptchaVerified || !isValid}
                    className="w-full bg-mint text-black hover:bg-mint/90 h-12"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Contact Cards */}
            <Card className="bg-neutral-900/50 border-neutral-800 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-mint/10">
                  <Mail className="h-6 w-6 text-mint" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <a href="mailto:contact@example.com" className="text-sm text-neutral-400 hover:text-mint transition-colors">
                    contact@example.com
                  </a>
                </div>
              </div>
            </Card>

            <Card className="bg-neutral-900/50 border-neutral-800 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-mint/10">
                  <Clock className="h-6 w-6 text-mint" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Disponibilité</h3>
                  <p className="text-sm text-neutral-400">
                    Lun-Ven: 9h-18h
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Réponse sous 24h
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-neutral-900/50 border-neutral-800 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-mint/10">
                  <MapPin className="h-6 w-6 text-mint" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Localisation</h3>
                  <p className="text-sm text-neutral-400">
                    Paris, France
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Interventions à distance
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

