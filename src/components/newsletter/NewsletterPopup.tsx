import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { NewsletterForm } from "./NewsletterForm";
import { useTranslation } from "../../utils/i18n/useTranslation";

const POPUP_DELAY = 15000; // 15 secondes
const SCROLL_THRESHOLD = 0.5; // 50% de scroll
const POPUP_COOLDOWN_KEY = "newsletter_popup_closed";
const POPUP_COOLDOWN_DAYS = 7; // Ne plus montrer pendant 7 jours si fermÃ©

export function NewsletterPopup() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false);
  const popupBenefits = Array.isArray((t as any)?.newsletter?.popup?.benefits)
    ? (t as any).newsletter.popup.benefits
    : [];

  useEffect(() => {
    // VÃ©rifier si le popup a Ã©tÃ© fermÃ© rÃ©cemment
    const lastClosed = localStorage.getItem(POPUP_COOLDOWN_KEY);
    if (lastClosed) {
      const daysSinceClosed = (Date.now() - parseInt(lastClosed)) / (1000 * 60 * 60 * 24);
      if (daysSinceClosed < POPUP_COOLDOWN_DAYS) {
        return; // Ne pas montrer le popup
      }
    }

    // VÃ©rifier si dÃ©jÃ  abonnÃ©
    const isSubscribed = localStorage.getItem("newsletter_subscribed");
    if (isSubscribed === "true") {
      return;
    }

    // Timer pour afficher aprÃ¨s X secondes
    const timer = setTimeout(() => {
      if (hasScrolledEnough) {
        setIsVisible(true);
      }
    }, POPUP_DELAY);

    // Listener de scroll
    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercentage >= SCROLL_THRESHOLD * 100) {
        setHasScrolledEnough(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasScrolledEnough]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(POPUP_COOLDOWN_KEY, Date.now().toString());
  };

  const handleSuccess = () => {
    localStorage.setItem("newsletter_subscribed", "true");
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl"
          >
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#050505] shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
              {/* background accents */}
              <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_top,_rgba(204,255,0,0.15),_transparent_55%),radial-gradient(circle_at_20%_90%,_rgba(124,69,255,0.25),_transparent_60%)]" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                aria-label={t('newsletter.popup.close')}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative grid gap-10 p-8 md:p-12 lg:grid-cols-[1.15fr_0.85fr]">
                {/* Copy */}
                <div>
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-mono uppercase tracking-[0.4em] text-white/70 mb-6">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {t('newsletter.popup.badge')}
                  </div>

                  <p className="text-sm font-mono uppercase tracking-[0.3em] text-white/50 mb-3">
                    {t('newsletter.popup.kicker') ?? 'Weekly Signals'}
                  </p>

                  <h3 className="font-display heading-display text-white max-w-xl leading-tight mb-4">
                    {t('newsletter.popup.title')}
                  </h3>

                  <p className="text-lg text-white/70 max-w-2xl">
                    {t('newsletter.popup.description')}
                  </p>

                  <div className="mt-10 space-y-4">
                    {popupBenefits.map((benefit: string, index: number) => (
                      <motion.div
                        key={benefit}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="flex items-start gap-3 text-white/80"
                      >
                        <span className="mt-1 h-1.5 w-8 rounded-full bg-primary/70" />
                        <span className="text-base font-medium">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Form card */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.55)] flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/70">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm font-semibold uppercase tracking-[0.3em]">
                        {t('newsletter.popup.ctaLabel') ?? t('newsletter.popup.badge')}
                      </span>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full border border-white/20">
                      <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-primary shadow-lg" />
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-2xl p-4 border border-white/5">
                    <NewsletterForm onSuccess={handleSuccess} className="space-y-3" />
                  </div>

                  <p className="text-xs text-white/50 leading-relaxed">
                    {t('newsletter.form.footnote')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
