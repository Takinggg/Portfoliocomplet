import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { NewsletterForm } from "./NewsletterForm";

const POPUP_DELAY = 15000; // 15 secondes
const SCROLL_THRESHOLD = 0.5; // 50% de scroll
const POPUP_COOLDOWN_KEY = "newsletter_popup_closed";
const POPUP_COOLDOWN_DAYS = 7; // Ne plus montrer pendant 7 jours si fermé

export function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false);

  useEffect(() => {
    // Vérifier si le popup a été fermé récemment
    const lastClosed = localStorage.getItem(POPUP_COOLDOWN_KEY);
    if (lastClosed) {
      const daysSinceClosed = (Date.now() - parseInt(lastClosed)) / (1000 * 60 * 60 * 24);
      if (daysSinceClosed < POPUP_COOLDOWN_DAYS) {
        return; // Ne pas montrer le popup
      }
    }

    // Vérifier si déjà abonné
    const isSubscribed = localStorage.getItem("newsletter_subscribed");
    if (isSubscribed === "true") {
      return;
    }

    // Timer pour afficher après X secondes
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4"
          >
            <div className="relative bg-[#0C0C0C] border border-[#00FFC2]/30 rounded-2xl p-8 shadow-2xl">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FFC2]/10 to-transparent rounded-2xl pointer-events-none" />

              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FFC2]/10 border border-[#00FFC2]/20 mb-6">
                  <Sparkles className="h-4 w-4 text-[#00FFC2]" />
                  <span className="text-sm text-[#00FFC2]">Newsletter exclusive</span>
                </div>

                {/* Title */}
                <h3 className="text-white mb-3">
                  Restez à jour avec mes derniers projets
                </h3>

                {/* Description */}
                <p className="text-white/60 mb-6">
                  Recevez mes conseils en développement web, études de cas détaillées et
                  nouveaux articles directement dans votre boîte mail. Un email par mois maximum.
                </p>

                {/* Benefits */}
                <div className="space-y-2 mb-6">
                  {[
                    "📚 Études de cas détaillées",
                    "💡 Conseils techniques exclusifs",
                    "🎯 Tendances web & design",
                    "🚀 Nouveaux projets en avant-première",
                  ].map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 text-sm text-white/70"
                    >
                      <div className="w-1 h-1 rounded-full bg-[#00FFC2]" />
                      {benefit}
                    </motion.div>
                  ))}
                </div>

                {/* Form */}
                <NewsletterForm onSuccess={handleSuccess} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
