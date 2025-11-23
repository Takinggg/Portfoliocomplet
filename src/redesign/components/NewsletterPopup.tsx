import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mail, Sparkles, X } from "lucide-react";
import { NewsletterForm } from "../../components/newsletter/NewsletterForm";
import { useTranslation } from "../../utils/i18n/useTranslation";

const POPUP_DELAY = 15000;
const SCROLL_THRESHOLD = 0.5;
const POPUP_COOLDOWN_KEY = "newsletter_popup_closed";
const POPUP_COOLDOWN_DAYS = 7;

export function RedesignNewsletterPopup() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false);
  const popupBenefits = Array.isArray((t as any)?.newsletter?.popup?.benefits)
    ? (t as any).newsletter.popup.benefits
    : [];

  useEffect(() => {
    const lastClosed = localStorage.getItem(POPUP_COOLDOWN_KEY);
    if (lastClosed) {
      const daysSinceClosed = (Date.now() - parseInt(lastClosed)) / (1000 * 60 * 60 * 24);
      if (daysSinceClosed < POPUP_COOLDOWN_DAYS) {
        return;
      }
    }

    if (localStorage.getItem("newsletter_subscribed") === "true") {
      return;
    }

    const timer = setTimeout(() => {
      if (hasScrolledEnough) {
        setIsVisible(true);
      }
    }, POPUP_DELAY);

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
    setTimeout(() => setIsVisible(false), 2200);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70]"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="fixed inset-0 z-[80] flex items-center justify-center px-4"
          >
            <div className="relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/10 bg-[#050505] text-white">
              <div className="absolute inset-0 opacity-40" aria-hidden>
                <div className="bg-noise" />
              </div>
              <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-primary/20 blur-[120px]" />
              <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full bg-white/5 blur-[100px]" />

              <button
                onClick={handleClose}
                className="absolute top-6 right-6 z-10 text-white/60 hover:text-white transition-colors"
                aria-label={t("newsletter.popup.close")}
              >
                <X className="h-6 w-6" />
              </button>

              <div className="relative grid gap-12 p-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
                <div className="space-y-6 max-w-xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
                    <Sparkles size={16} className="text-primary" />
                    {t("newsletter.popup.badge")}
                  </div>
                  <div>
                    <p className="font-mono text-sm text-neutral-500">Weekly Signals</p>
                    <h3 className="mt-2 text-4xl font-display font-semibold leading-tight">
                      {t("newsletter.popup.title")}
                    </h3>
                    <p className="mt-4 text-neutral-300">
                      {t("newsletter.popup.description")}
                    </p>
                  </div>
                  <ul className="space-y-3 text-sm text-neutral-400">
                    {popupBenefits.map((benefit: string) => (
                      <li key={benefit} className="flex items-center gap-3">
                        <span className="h-px w-8 bg-primary/60" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative z-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                  <div className="mb-6 flex items-center gap-3 text-sm font-mono text-white/70">
                    <Mail size={18} />
                    <span>{t("newsletter.popup.cta")}</span>
                  </div>
                  <NewsletterForm onSuccess={handleSuccess} />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
