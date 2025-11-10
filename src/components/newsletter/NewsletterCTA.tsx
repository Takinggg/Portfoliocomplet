import { motion } from "motion/react";
import { Mail, Sparkles, TrendingUp } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";
import { NewsletterBadge } from "./NewsletterBadge";

interface NewsletterCTAProps {
  variant?: "default" | "compact" | "hero";
  className?: string;
}

export function NewsletterCTA({ variant = "default", className = "" }: NewsletterCTAProps) {
  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`bg-gradient-to-br from-[#00FFC2]/10 to-transparent border border-[#00FFC2]/20 rounded-xl p-6 ${className}`}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#00FFC2]/10 flex items-center justify-center">
            <Mail className="h-6 w-6 text-[#00FFC2]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-white">Newsletter</h3>
              <NewsletterBadge />
            </div>
            <p className="text-white/60 text-sm mb-4">
              Recevez mes conseils et nouveautés par email
            </p>
            <NewsletterForm variant="minimal" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "hero") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`relative overflow-hidden rounded-2xl border border-[#00FFC2]/30 ${className}`}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FFC2]/10 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#00FFC2]/5 to-transparent" />
        
        {/* Content */}
        <div className="relative p-12 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FFC2]/10 border border-[#00FFC2]/20 mb-6">
            <Sparkles className="h-4 w-4 text-[#00FFC2]" />
            <span className="text-sm text-[#00FFC2]">Newsletter exclusive</span>
          </div>

          {/* Title */}
          <h2 className="mb-4 text-white">
            Ne manquez rien de mes nouveautés
          </h2>

          {/* Description */}
          <p className="text-white/60 mb-6 max-w-2xl mx-auto">
            Rejoignez les professionnels qui reçoivent mes conseils en développement web,
            études de cas détaillées et nouveaux articles. Un email par mois maximum.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center">
                <NewsletterBadge showTrend />
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 text-[#00FFC2]">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+20% ce mois</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>

          {/* Social proof */}
          <p className="text-xs text-white/40 mt-6">
            Rejoignez des développeurs, designers et entrepreneurs qui me font confiance
          </p>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-white/5 border border-white/10 rounded-xl p-8 ${className}`}
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#00FFC2]/10 flex items-center justify-center">
          <Mail className="h-6 w-6 text-[#00FFC2]" />
        </div>
        <div className="flex-1">
          <h3 className="text-white mb-2">
            Restez informé
          </h3>
          <p className="text-white/60 text-sm">
            Abonnez-vous pour recevoir mes derniers articles, études de cas et conseils
            en développement web et design.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <NewsletterBadge showTrend />
      </div>

      <NewsletterForm />

      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-[#00FFC2] mt-2" />
            <span className="text-white/60">1 email / mois max</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-[#00FFC2] mt-2" />
            <span className="text-white/60">Contenu exclusif</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-[#00FFC2] mt-2" />
            <span className="text-white/60">Pas de spam</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-[#00FFC2] mt-2" />
            <span className="text-white/60">Désinscription facile</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
