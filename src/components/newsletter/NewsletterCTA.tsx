import { motion } from "motion/react";
import { Mail, Sparkles, TrendingUp } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";
import { NewsletterBadge } from "./NewsletterBadge";
import { useTranslation } from "../../utils/i18n/useTranslation";

interface NewsletterCTAProps {
  variant?: "default" | "compact" | "hero";
  className?: string;
}

export function NewsletterCTA({ variant = "default", className = "" }: NewsletterCTAProps) {
  const { t } = useTranslation();
  const ctaTexts = (t as any)?.newsletter?.cta ?? {};

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
              <h3 className="text-white">{ctaTexts.compact?.title ?? "Newsletter"}</h3>
              <NewsletterBadge />
            </div>
            <p className="text-white/60 text-sm mb-4">
              {ctaTexts.compact?.description}
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
            <span className="text-sm text-[#00FFC2]">{ctaTexts.hero?.badge}</span>
          </div>

          {/* Title */}
          <h2 className="mb-4 text-white">{ctaTexts.hero?.title}</h2>

          {/* Description */}
          <p className="text-white/60 mb-6 max-w-2xl mx-auto">
            {ctaTexts.hero?.description}
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
                <span className="text-sm">{ctaTexts.hero?.trend}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>

          {/* Social proof */}
          <p className="text-xs text-white/40 mt-6">
            {ctaTexts.hero?.socialProof}
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
          <h3 className="text-white mb-2">{ctaTexts.default?.title}</h3>
          <p className="text-white/60 text-sm">{ctaTexts.default?.description}</p>
        </div>
      </div>

      <div className="mb-4">
        <NewsletterBadge showTrend />
      </div>

      <NewsletterForm />

      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {(ctaTexts.default?.bullets || []).map((bullet: string, index: number) => (
            <div className="flex items-start gap-2" key={`${bullet}-${index}`}>
              <div className="w-1 h-1 rounded-full bg-[#00FFC2] mt-2" />
              <span className="text-white/60">{bullet}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
