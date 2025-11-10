/**
 * Deployment Needed Banner
 * Bannière fixe en haut pour rappeler le déploiement nécessaire
 */

import { useState } from "react";
import { AlertCircle, X, Rocket } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function DeploymentNeededBanner() {
  const [dismissed, setDismissed] = useState(
    localStorage.getItem('deployment-banner-dismissed') === 'true'
  );

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('deployment-banner-dismissed', 'true');
  };

  if (dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center justify-center w-8 h-8 bg-black/20 rounded-full">
            <Rocket className="h-4 w-4" />
          </div>
          <div>
            <p className="font-bold text-sm sm:text-base">
              🚀 Déploiement requis : 2 erreurs corrigées !
            </p>
            <p className="text-xs sm:text-sm opacity-90">
              Route /projects ajoutée + Clipboard fallback → 
              <span className="ml-1 font-semibold">
                Redéployez le serveur maintenant (2 min)
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // Scroll to the alert at bottom right
              const alertElement = document.querySelector('[class*="CORSFixAlert"]');
              if (alertElement) {
                alertElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              } else {
                toast.info('Regardez l\'alerte jaune en bas à droite de l\'écran !');
              }
            }}
            className="hidden sm:inline-flex items-center gap-1 bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            <AlertCircle className="h-3 w-3" />
            Voir le guide
          </a>
          
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-black/20 rounded transition-colors"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
