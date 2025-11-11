import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { toast } from "sonner@2.0.3";
import { useLanguage } from "../../utils/i18n/LanguageContext";

interface NewsletterFormProps {
  variant?: "default" | "minimal";
  className?: string;
  onSuccess?: () => void;
}

export function NewsletterForm({ variant = "default", className = "", onSuccess }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { language } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error(language === 'en' ? "Please enter a valid email address" : "Veuillez entrer une adresse email valide");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("📧 Subscribing to newsletter:", email, "Language:", language);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/newsletter/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ 
            email, 
            source: "footer",
            language: language // Send current language
          }),
        }
      );

      console.log("📧 Newsletter response status:", response.status);
      
      const data = await response.json();
      console.log("📧 Newsletter response data:", data);

      if (response.ok && data.success) {
        setIsSuccess(true);
        setEmail("");
        
        // Different message if already subscribed
        if (data.alreadySubscribed) {
          toast.info(language === 'en' 
            ? "ℹ️ You are already subscribed to the newsletter!" 
            : "ℹ️ Vous êtes déjà inscrit à la newsletter !"
          );
        } else {
          toast.success(
            language === 'en' 
              ? "✅ Thank you! You are now subscribed to the newsletter." 
              : "✅ Merci ! Vous êtes maintenant inscrit à la newsletter.",
            {
              description: language === 'en'
                ? "You will receive our latest news and exclusive tips."
                : "Vous recevrez nos prochaines actualités et conseils exclusifs.",
              duration: 5000,
            }
          );
        }
        
        onSuccess?.();
        
        // Reset success after 5s
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        console.error("❌ Newsletter error:", data);
        toast.error(data.error || (language === 'en' ? "An error occurred" : "Une erreur est survenue"));
      }
    } catch (error) {
      console.error("❌ Newsletter subscription error:", error);
      toast.error(
        language === 'en' 
          ? "Unable to subscribe at the moment. Please try again later." 
          : "Impossible de s'abonner pour le moment. Réessayez plus tard."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess && variant === "minimal") {
    return (
      <div className={`flex items-center gap-2 p-3 rounded-lg bg-[#00FFC2]/10 border border-[#00FFC2]/30 ${className}`}>
        <CheckCircle2 className="h-4 w-4 text-[#00FFC2] flex-shrink-0" />
        <p className="text-sm text-[#00FFC2]">✅ Inscription confirmée !</p>
      </div>
    );
  }

  if (isSuccess && variant === "default") {
    return (
      <div className={`flex items-center gap-3 p-4 rounded-lg bg-[#00FFC2]/10 border border-[#00FFC2]/30 ${className}`}>
        <CheckCircle2 className="h-5 w-5 text-[#00FFC2] flex-shrink-0" />
        <div>
          <p className="text-sm text-[#00FFC2] mb-1">✅ Inscription réussie !</p>
          <p className="text-xs text-white/70">
            Merci de votre confiance. Vous recevrez nos prochaines actualités.
          </p>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <Input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90 flex-shrink-0"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "S'abonner"
          )}
        </Button>
      </div>
      <p className="text-xs text-white/40 mt-2">
        En vous abonnant, vous acceptez de recevoir nos emails. Désinscription possible à tout moment.
      </p>
    </form>
  );
}
