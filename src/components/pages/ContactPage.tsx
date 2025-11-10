import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { motion } from "motion/react";
import { 
  Mail, 
  MapPin, 
  Send, 
  Calendar,
  Clock,
  CheckCircle2,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { useAnalytics, usePageTracking } from "../../utils/hooks/useAnalytics";

type Page = "booking";

interface ContactPageProps {
  onNavigate: (page: Page) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {
  const { t } = useTranslation();
  const analytics = useAnalytics();
  
  // Track page view
  usePageTracking('contact', 'Contact Page');
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    wantsAppointment: false
  });
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(t("contact.form.errorRequired"));
      return;
    }

    setIsSubmitting(true);

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
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            source: "contact_form",
            status: "new",
            wantsAppointment: formData.wantsAppointment,
            interests: selectedReasons,
            createdAt: new Date().toISOString()
          }),
        }
      );

      if (response.ok) {
        toast.success(t("contact.form.success"));
        
        // 🎯 Track successful contact conversion
        analytics.trackContactConversion('Contact Form');
        analytics.trackFormSubmit('Contact Form');
        
        // Send confirmation email
        try {
          await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/emails/lead-confirmation`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${publicAnonKey}`,
              },
              body: JSON.stringify({
                email: formData.email,
                name: formData.name,
                message: formData.message,
                wantsAppointment: formData.wantsAppointment,
              }),
            }
          );
          // Don't wait for email response, continue flow
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
          // Don't show error to user, email is secondary
        }
        
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          wantsAppointment: false
        });
        setSelectedReasons([]);

        if (formData.wantsAppointment) {
          // Track booking intent
          analytics.trackCTA('Schedule Appointment', 'Contact Form');
          setTimeout(() => {
            onNavigate("booking");
          }, 1500);
        }
      } else {
        throw new Error("Error sending message");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error(t("contact.form.error"));
      
      // 🎯 Track form error
      analytics.trackFormError('Contact Form', 'Submission Failed');
      analytics.trackError('ContactFormSubmission', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: t("contact.info.email"),
      value: t("contact.info.emailValue"),
      href: `mailto:${t("contact.info.emailValue")}`
    },
    {
      icon: MapPin,
      label: t("contact.info.location"),
      value: t("contact.info.locationValue"),
      href: null
    },
    {
      icon: Clock,
      label: t("contact.info.availability"),
      value: t("contact.info.availabilityValue"),
      href: null
    },
  ];

  const reasonKeys = [
    "contact.form.reasons.0",
    "contact.form.reasons.1",
    "contact.form.reasons.2",
    "contact.form.reasons.3",
    "contact.form.reasons.4",
    "contact.form.reasons.5"
  ];
  
  const reasons = reasonKeys.map(key => t(key));

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white pt-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 194, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 194, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}></div>
        </div>

        {/* Floating Orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-mint rounded-full blur-[120px] opacity-15"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 backdrop-blur-sm mb-8">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-mint"></div>
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-mint animate-ping"></div>
              </div>
              <span className="text-sm text-mint font-medium">{t("contact.hero.badge")}</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-[0.95]">
              <span className="block text-white">{t("contact.hero.titleLine1")}</span>
              <span className="block text-gradient-mint-animated">{t("contact.hero.titleLine2")}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-400 mb-12 leading-relaxed max-w-3xl mx-auto">
              {t("contact.hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left - Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Cards */}
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-neutral-900 bg-neutral-950/50 hover:border-mint/20 transition-all">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-mint/10 border border-mint/20 flex items-center justify-center flex-shrink-0">
                          <info.icon className="h-6 w-6 text-mint" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-neutral-500 mb-1">{info.label}</p>
                          {info.href ? (
                            <a 
                              href={info.href} 
                              className="text-white hover:text-mint transition-colors font-medium"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-white font-medium">{info.value}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Quick Action */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-mint/20 bg-gradient-to-br from-mint/10 to-mint/5">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Calendar className="h-10 w-10 text-mint mx-auto mb-4" />
                      <h3 className="text-lg font-bold mb-2">{t("contact.quickAction.title")}</h3>
                      <p className="text-sm text-neutral-400 mb-4">
                        {t("contact.quickAction.description")}
                      </p>
                      <Button
                        onClick={() => onNavigate("booking")}
                        className="w-full bg-mint text-black hover:bg-mint/90 rounded-lg"
                      >
                        {t("contact.quickAction.button")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card className="border-neutral-900 bg-neutral-950/50">
                <CardContent className="pt-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name & Email */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                          {t("contact.form.nameRequired")}
                        </Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={t("contact.form.namePlaceholder")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                          {t("contact.form.emailRequired")}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder={t("contact.form.emailPlaceholder")}
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">
                        {t("contact.form.phone")}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={t("contact.form.phonePlaceholder")}
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white">
                        {t("contact.form.messageRequired")}
                      </Label>
                      <Textarea
                        id="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={t("contact.form.messagePlaceholder")}
                      />
                    </div>

                    {/* Reasons */}
                    <div className="space-y-3">
                      <Label className="text-white">{t("contact.form.interestedIn")}</Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {reasons.map((reason, index) => {
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
                                  ? 'bg-[#00FFC2]/10 border-2 border-[#00FFC2]' 
                                  : 'bg-neutral-900/50 border border-neutral-800 hover:border-[#00FFC2]/20'
                                }
                              `}
                            >
                              <div className={`
                                w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                ${isSelected ? 'border-[#00FFC2] bg-[#00FFC2]' : 'border-neutral-600'}
                              `}>
                                {isSelected && (
                                  <CheckCircle2 className="h-3 w-3 text-black" />
                                )}
                              </div>
                              <span className={`text-sm ${isSelected ? 'text-[#00FFC2]' : 'text-neutral-400'}`}>
                                {reason}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-mint/5 border border-mint/20">
                      <Checkbox
                        id="wantsAppointment"
                        checked={formData.wantsAppointment}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, wantsAppointment: checked as boolean })
                        }
                        className="border-mint/30 data-[state=checked]:bg-mint data-[state=checked]:border-mint"
                      />
                      <Label
                        htmlFor="wantsAppointment"
                        className="text-sm text-white cursor-pointer flex-1"
                      >
                        {t("contact.form.appointmentCheckbox")}
                      </Label>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-mint text-black hover:bg-mint/90 h-12 rounded-lg font-medium text-base group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {isSubmitting ? t("contact.form.sending") : t("contact.form.submit")}
                        {!isSubmitting && <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    </Button>

                    <p className="text-xs text-neutral-500 text-center">
                      {t("contact.form.privacyNotice")}
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 bg-neutral-950/30 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Questions fréquentes
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: "Quel est votre délai de réponse ?",
                a: "Je réponds généralement sous 24h ouvrées. Pour les urgences, n'hésitez pas à le préciser dans votre message."
              },
              {
                q: "L'audit gratuit, c'est quoi exactement ?",
                a: "Un appel de 30 minutes pour analyser vos processus actuels et identifier les opportunités d'automatisation avec estimation du ROI."
              },
              {
                q: "Combien de temps dure un projet type ?",
                a: "Un projet d'automatisation simple prend 2-3 semaines. Les projets plus complexes peuvent prendre 4-8 semaines."
              },
              {
                q: "Travaillez-vous avec des clients internationaux ?",
                a: "Oui, je travaille avec des clients dans toute la francophonie et propose des appels en français ou en anglais."
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-neutral-900 bg-neutral-950/50 hover:border-mint/20 transition-all">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-mint/10 border border-mint/20 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="h-5 w-5 text-mint" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">{faq.q}</h3>
                        <p className="text-neutral-400">{faq.a}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
