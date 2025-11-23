/**
 * CORS Fix Alert Component
 * Alerte visible pour guider l'utilisateur vers le dÃ©ploiement du fix CORS
 */

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { AlertCircle, Copy, CheckCircle, ExternalLink, X } from "lucide-react";
import { Card } from "./ui/card";
import { toast } from "sonner";

export function CORSFixAlert() {
  const [dismissed, setDismissed] = useState(false);

  // Simplified - just show instructions, no code fetching
  const handleOpenGuide = () => {
    toast.info("ðŸ“– Consultez le guide /URGENT_LIRE_CORS.md pour les instructions dÃ©taillÃ©es", {
      duration: 5000,
    });
  };

  const openSupabase = () => {
    window.open(
      'https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions',
      '_blank'
    );
  };

  // Don't show this alert for now - causing issues
  // Will be re-enabled once backend is properly deployed
  if (dismissed || true) return null;

  return (
    <Card className="fixed bottom-6 right-6 z-50 max-w-md shadow-2xl border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-lg">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <AlertCircle className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">
                ðŸš¨ Erreur CORS DÃ©tectÃ©e
              </h3>
              <p className="text-sm text-white/70">
                Action requise pour corriger
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <Alert className="bg-red-500/10 border-red-500/30">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertTitle className="text-red-200">ProblÃ¨me identifiÃ©</AlertTitle>
            <AlertDescription className="text-red-100/80 text-sm">
              Le serveur Supabase bloque les requÃªtes Ã  cause d'une mauvaise configuration CORS.
            </AlertDescription>
          </Alert>

          <Alert className="bg-green-500/10 border-green-500/30">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertTitle className="text-green-200">Solution prÃªte</AlertTitle>
            <AlertDescription className="text-green-100/80 text-sm">
              Le code corrigÃ© est disponible dans /supabase/functions/server/index.tsx
            </AlertDescription>
          </Alert>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-sm text-white/80 font-medium mb-3">
              ðŸ“‹ Ã‰tapes rapides (2 min) :
            </p>
            <ol className="text-sm text-white/70 space-y-2 list-decimal list-inside">
              <li>Ouvrir le fichier /supabase/functions/server/index.tsx</li>
              <li>Copier tout le contenu</li>
              <li>Ouvrir Supabase Dashboard</li>
              <li>Ã‰diter la fonction make-server-04919ac5</li>
              <li>Remplacer tout le code et dÃ©ployer</li>
            </ol>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleOpenGuide}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              <Copy className="h-4 w-4 mr-2" />
              Voir le Guide de DÃ©ploiement
            </Button>

            <Button
              onClick={openSupabase}
              variant="outline"
              className="w-full border-[#CCFF00]/30 text-[#CCFF00] hover:bg-[#CCFF00]/10"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ouvrir Supabase Dashboard
            </Button>
          </div>

          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-white/50">
              ðŸ“– Guide dÃ©taillÃ© :{" "}
              <code className="bg-white/10 px-1 py-0.5 rounded text-yellow-300">
                /URGENT_LIRE_CORS.md
              </code>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

