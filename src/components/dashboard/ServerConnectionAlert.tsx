import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  ExternalLink,
  Terminal,
  Copy,
  Check
} from "lucide-react";
import { 
  checkServerConnection, 
  getCurrentMode, 
  forceRecheck,
  getConnectionInstructions,
  type DataServiceMode 
} from "../../utils/unifiedDataService";
import { projectId } from "../../utils/supabase/info";

export function ServerConnectionAlert() {
  const [mode, setMode] = useState<DataServiceMode>("checking");
  const [isChecking, setIsChecking] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  useEffect(() => {
    // Check connection on mount
    checkConnection();
    
    // Update mode every 2 seconds
    const interval = setInterval(() => {
      setMode(getCurrentMode());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);
    forceRecheck();
    await checkServerConnection();
    setMode(getCurrentMode());
    setIsChecking(false);
  };

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  if (mode === "connected") {
    return (
      <Alert className="bg-[#CCFF00]/10 border-[#CCFF00]/30 mb-6">
        <CheckCircle2 className="h-4 w-4 text-[#CCFF00]" />
        <AlertTitle className="text-[#CCFF00]">Serveur ConnectÃ©</AlertTitle>
        <AlertDescription className="text-white/80">
          Le serveur Supabase Edge Function est opÃ©rationnel
        </AlertDescription>
      </Alert>
    );
  }

  if (mode === "checking") {
    return (
      <Alert className="bg-white/5 border-white/10 mb-6">
        <Loader2 className="h-4 w-4 text-white/60 animate-spin" />
        <AlertTitle className="text-white">VÃ©rification...</AlertTitle>
        <AlertDescription className="text-white/60">
          VÃ©rification de la connexion au serveur Supabase
        </AlertDescription>
      </Alert>
    );
  }

  // mode === "disconnected"
  return (
    <div className="space-y-4 mb-6">
      <Alert className="bg-red-500/10 border-red-500/30">
        <AlertTriangle className="h-4 w-4 text-red-400" />
        <AlertTitle className="text-red-400">Serveur Non Disponible</AlertTitle>
        <AlertDescription className="text-white/80">
          Le serveur Supabase Edge Function n'est pas dÃ©ployÃ© ou inaccessible.
          Les donnÃ©es ne peuvent pas Ãªtre chargÃ©es.
        </AlertDescription>
      </Alert>

      <Card className="bg-white/5 border-white/10 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white mb-2 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-[#CCFF00]" />
              Comment rÃ©soudre ce problÃ¨me ?
            </h3>
            <p className="text-white/60 text-sm">
              Le serveur Edge Function doit Ãªtre dÃ©ployÃ© sur Supabase pour que l'application fonctionne.
            </p>
          </div>
          <Button
            onClick={checkConnection}
            disabled={isChecking}
            variant="outline"
            size="sm"
            className="border-[#CCFF00]/30 text-[#CCFF00] hover:bg-[#CCFF00]/10"
          >
            {isChecking ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                VÃ©rification...
              </>
            ) : (
              "RevÃ©rifier"
            )}
          </Button>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => setShowInstructions(!showInstructions)}
            variant="outline"
            className="w-full justify-between border-white/10 text-white hover:bg-white/5"
          >
            <span>
              {showInstructions ? "Masquer" : "Afficher"} les instructions de dÃ©ploiement
            </span>
            <ExternalLink className="h-4 w-4" />
          </Button>

          {showInstructions && (
            <div className="bg-[#0C0C0C] rounded-lg p-4 border border-white/10 space-y-4">
              <div>
                <h4 className="text-white mb-2 text-sm font-medium">Ã‰tapes de dÃ©ploiement :</h4>
                <div className="space-y-3">
                  {/* Step 1 */}
                  <div className="bg-white/5 rounded-lg p-3 space-y-2">
                    <p className="text-white/80 text-sm font-medium">1. Installer Supabase CLI</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-black/50 text-[#CCFF00] text-xs p-2 rounded border border-white/10 font-mono">
                        npm install -g supabase
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard("npm install -g supabase", 1)}
                        className="text-white/60 hover:text-white"
                      >
                        {copiedStep === 1 ? (
                          <Check className="h-4 w-4 text-[#CCFF00]" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white/5 rounded-lg p-3 space-y-2">
                    <p className="text-white/80 text-sm font-medium">2. Se connecter Ã  Supabase</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-black/50 text-[#CCFF00] text-xs p-2 rounded border border-white/10 font-mono">
                        supabase login
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard("supabase login", 2)}
                        className="text-white/60 hover:text-white"
                      >
                        {copiedStep === 2 ? (
                          <Check className="h-4 w-4 text-[#CCFF00]" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white/5 rounded-lg p-3 space-y-2">
                    <p className="text-white/80 text-sm font-medium">3. Lier le projet</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-black/50 text-[#CCFF00] text-xs p-2 rounded border border-white/10 font-mono">
                        supabase link --project-ref {projectId}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(`supabase link --project-ref ${projectId}`, 3)}
                        className="text-white/60 hover:text-white"
                      >
                        {copiedStep === 3 ? (
                          <Check className="h-4 w-4 text-[#CCFF00]" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-white/5 rounded-lg p-3 space-y-2">
                    <p className="text-white/80 text-sm font-medium">4. DÃ©ployer le serveur</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-black/50 text-[#CCFF00] text-xs p-2 rounded border border-white/10 font-mono">
                        supabase functions deploy make-server-04919ac5
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard("supabase functions deploy make-server-04919ac5", 4)}
                        className="text-white/60 hover:text-white"
                      >
                        {copiedStep === 4 ? (
                          <Check className="h-4 w-4 text-[#CCFF00]" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="bg-white/5 rounded-lg p-3 space-y-2">
                    <p className="text-white/80 text-sm font-medium">5. VÃ©rifier le dÃ©ploiement</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-black/50 text-[#CCFF00] text-xs p-2 rounded border border-white/10 font-mono overflow-x-auto whitespace-nowrap">
                        curl https://{projectId}.supabase.co/functions/v1/make-server-04919ac5/health
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(`curl https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`, 5)}
                        className="text-white/60 hover:text-white"
                      >
                        {copiedStep === 5 ? (
                          <Check className="h-4 w-4 text-[#CCFF00]" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <p className="text-white/60 text-xs">
                  ðŸ“– Guide complet disponible dans <code className="text-[#CCFF00]">/DEPLOYMENT_GUIDE_SUPABASE.md</code>
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
