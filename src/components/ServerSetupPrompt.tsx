/**
 * Server Setup Prompt
 * Bouton flottant qui apparaît sur les pages en mode local
 */

import { motion, AnimatePresence } from "motion/react";
import { X, Server, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface ServerSetupPromptProps {
  show: boolean;
  onClose?: () => void;
}

export function ServerSetupPrompt({ show, onClose }: ServerSetupPromptProps) {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onClose?.();
  };

  const handleSetup = () => {
    // Utiliser la navigation interne au lieu d'une vraie navigation
    if ((window as any).serverDiagnostic) {
      (window as any).serverDiagnostic();
    } else {
      // Fallback: essayer de déclencher un event ou changer le hash
      window.location.hash = "server-diagnostic";
    }
  };

  if (dismissed || !show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm"
      >
        <div className="bg-gradient-to-br from-[#00FFC2]/20 to-blue-500/20 backdrop-blur-xl border border-[#00FFC2]/30 rounded-2xl p-5 shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#00FFC2]/20 rounded-lg">
                <Server className="h-5 w-5 text-[#00FFC2]" />
              </div>
              <h3 className="text-white font-medium">
                Synchroniser avec Supabase
              </h3>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/40 hover:text-white/80 transition-colors"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-sm text-white/70 mb-4">
            Cette page utilise des données locales. Déployez le serveur complet
            pour synchroniser avec Supabase.
          </p>

          <div className="flex gap-2">
            <Button
              onClick={handleSetup}
              className="flex-1 bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
            >
              Configurer <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Plus tard
            </Button>
          </div>

          {/* Pulsing indicator */}
          <div className="absolute -top-1 -right-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFC2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00FFC2]"></span>
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
