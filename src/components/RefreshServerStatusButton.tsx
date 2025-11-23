/**
 * Bouton pour forcer une vÃ©rification immÃ©diate du serveur
 */

import { useState } from "react";
import { Button } from "./ui/button";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { forceCheckServer, getServerMode } from "../utils/serverService";

export function RefreshServerStatusButton() {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ available: boolean; mode: string } | null>(null);

  const handleRefresh = async () => {
    setChecking(true);
    setResult(null);

    // Force une vÃ©rification immÃ©diate (ignore le cache)
    const available = await forceCheckServer();
    const mode = getServerMode();

    setResult({ available, mode });
    setChecking(false);

    // Reload aprÃ¨s 1 seconde si le serveur est disponible
    if (available) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleRefresh}
        disabled={checking}
        variant="default"
        className="bg-[#CCFF00] text-[#0C0C0C] hover:bg-[#CCFF00]/90"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${checking ? "animate-spin" : ""}`} />
        {checking ? "VÃ©rification..." : "RafraÃ®chir le serveur"}
      </Button>

      {result && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          result.available 
            ? "bg-green-500/10 text-green-400" 
            : "bg-red-500/10 text-red-400"
        }`}>
          {result.available ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">
                Serveur disponible ! Rechargement...
              </span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4" />
              <span className="text-sm">
                Serveur indisponible (mode: {result.mode})
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
