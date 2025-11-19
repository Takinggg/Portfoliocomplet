import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Calendar, Send, X } from "lucide-react";
import { useState } from "react";

interface StickyCTABarProps {
  onAuditClick: () => void;
  onContactClick: () => void;
}

export function StickyCTABar({ onAuditClick, onContactClick }: StickyCTABarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Text */}
            <div className="hidden md:block">
              <div className="text-lg font-bold text-white">
                Prêt à démarrer votre projet ?
              </div>
              <div className="text-sm text-neutral-400">
                Audit gratuit de 15 minutes — Sans engagement
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                onClick={onAuditClick}
                className="flex-1 md:flex-none bg-mint text-black hover:bg-mint/90 h-12 px-6"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Réserver un audit
              </Button>
              <Button
                onClick={onContactClick}
                variant="outline"
                className="flex-1 md:flex-none border-neutral-700 hover:border-mint/40 hover:bg-mint/5 h-12 px-6"
              >
                <Send className="mr-2 h-5 w-5" />
                Envoyer un brief
              </Button>
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
