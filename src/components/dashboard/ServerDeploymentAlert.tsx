import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { AlertTriangle, CheckCircle, RefreshCw, ExternalLink, Copy, Check } from "lucide-react";
import { projectId } from "../../utils/supabase/info";
import { motion, AnimatePresence } from "motion/react";

interface ServerStatus {
  isOnline: boolean;
  hasClientRoutes: boolean;
  version?: string;
  lastChecked?: Date;
}

export function ServerDeploymentAlert() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    setChecking(true);
    try {
      // Check health endpoint
      const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`;
      const healthResponse = await fetch(healthUrl);
      const healthData = await healthResponse.json();

      const isOnline = healthResponse.ok && healthData.success;
      
      // Quick check if client routes exist (without auth)
      const clientsUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients`;
      const clientsResponse = await fetch(clientsUrl);
      const hasClientRoutes = clientsResponse.status !== 404;

      setStatus({
        isOnline,
        hasClientRoutes,
        version: healthData.version,
        lastChecked: new Date(),
      });
    } catch (error) {
      console.error("Failed to check server status:", error);
      setStatus({
        isOnline: false,
        hasClientRoutes: false,
        lastChecked: new Date(),
      });
    } finally {
      setChecking(false);
    }
  };

  const copyDeployCommand = () => {
    navigator.clipboard.writeText("supabase functions deploy make-server-04919ac5");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openDeploymentGuide = () => {
    // Open the new HTML deployment guide
    window.open("/deploiement-web.html", "_blank");
  };

  if (!status) {
    return null;
  }

  // Server is fully functional
  if (status.isOnline && status.hasClientRoutes) {
    return (
      <Card className="border-[#CCFF00]/20 bg-[#CCFF00]/5 mb-6">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#CCFF00]" />
            <div>
              <div className="text-sm text-[#F4F4F4]">
                Serveur en ligne {status.version && `(${status.version})`}
              </div>
              <div className="text-xs text-gray-400">
                DerniÃ¨re vÃ©rification: {status.lastChecked?.toLocaleTimeString()}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={checkServerStatus}
            disabled={checking}
            className="text-[#CCFF00] hover:bg-[#CCFF00]/10"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </Card>
    );
  }

  // Server needs deployment
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <AlertTitle className="text-[#F4F4F4] mb-2">
            {!status.isOnline
              ? "âš ï¸ Serveur hors ligne"
              : "âš ï¸ Routes clients non dÃ©ployÃ©es"}
          </AlertTitle>
          <AlertDescription className="text-gray-300 space-y-3">
            <p>
              {!status.isOnline
                ? "Le serveur Edge Function ne rÃ©pond pas. Il doit Ãªtre dÃ©ployÃ© sur Supabase."
                : "Les routes clients retournent une erreur 404. Le serveur a Ã©tÃ© mis Ã  jour mais n'est pas redÃ©ployÃ©."}
            </p>

            <div className="bg-[#0C0C0C] border border-[#CCFF00]/20 rounded-lg p-3 mt-3">
              <div className="flex items-center justify-between mb-2">
                <code className="text-xs text-[#CCFF00]">
                  supabase functions deploy make-server-04919ac5
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyDeployCommand}
                  className="h-7 px-2 text-[#CCFF00] hover:bg-[#CCFF00]/10"
                >
                  {copied ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={openDeploymentGuide}
                className="border-[#CCFF00]/30 text-[#CCFF00] hover:bg-[#CCFF00]/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                ðŸ“– Guide de dÃ©ploiement (sans CLI)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={checkServerStatus}
                disabled={checking}
                className="border-[#CCFF00]/30 text-[#CCFF00] hover:bg-[#CCFF00]/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${checking ? "animate-spin" : ""}`} />
                RevÃ©rifier
              </Button>
            </div>

            <p className="text-xs text-gray-400 mt-2">
              ðŸ’¡ <strong>Pas de CLI Supabase ?</strong> Pas de problÃ¨me ! Le guide ci-dessus vous montre comment copier-coller le code via l'interface web.
            </p>
          </AlertDescription>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
}
