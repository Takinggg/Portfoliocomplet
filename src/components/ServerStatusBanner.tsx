/**
 * Bannière de statut serveur permanente (discrète)
 */

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import { checkServerAvailability, getServerMode } from "../utils/serverService";

export function ServerStatusBanner() {
  const [mode, setMode] = useState<"server" | "local" | "checking">("checking");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = async () => {
      await checkServerAvailability();
      const currentMode = getServerMode();
      setMode(currentMode);

      // Afficher la bannière seulement si en mode local ou erreur
      setVisible(currentMode !== "server");
    };

    check();

    // Re-check toutes les minutes
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 ${
        mode === "local" 
          ? "bg-yellow-500/90" 
          : mode === "checking"
          ? "bg-blue-500/90"
          : "bg-red-500/90"
      } backdrop-blur-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            {mode === "local" ? (
              <>
                <AlertCircle className="h-4 w-4 text-white" />
                <span className="text-white font-medium">
                  Mode local actif
                </span>
                <span className="text-white/80 hidden sm:inline">
                  — Le serveur n'est pas disponible, données locales utilisées
                </span>
              </>
            ) : mode === "checking" ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-white font-medium">
                  Vérification du serveur...
                </span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-white" />
                <span className="text-white font-medium">
                  Serveur inaccessible
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // Utiliser la fonction globale serverDiagnostic
                if ((window as any).serverDiagnostic) {
                  (window as any).serverDiagnostic();
                }
              }}
              className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded transition-colors flex items-center gap-1"
            >
              Diagnostic
              <ExternalLink className="h-3 w-3" />
            </button>
            <button
              onClick={() => setVisible(false)}
              className="text-white/80 hover:text-white text-xs px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
