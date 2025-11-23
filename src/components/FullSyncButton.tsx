/**
 * Full Sync Button - Bouton pour synchroniser toutes les donnÃ©es avec Supabase
 * Affiche le statut de la synchronisation en temps rÃ©el
 */

import { useState } from "react";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Server,
  HardDrive
} from "lucide-react";
import { syncAllDataToSupabase } from "../utils/syncAllDataToSupabase";
import { validateServerDeployment } from "../utils/serverService";

export function FullSyncButton() {
  const [syncing, setSyncing] = useState(false);
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    summary: string;
    details?: any[];
  } | null>(null);
  const [serverStatus, setServerStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleValidate = async () => {
    setValidating(true);
    setServerStatus(null);
    
    try {
      const status = await validateServerDeployment();
      setServerStatus(status);
    } catch (error: any) {
      setServerStatus({
        success: false,
        message: `Erreur: ${error.message}`
      });
    } finally {
      setValidating(false);
    }
  };

  const handleSync = async () => {
    if (syncing) return;
    
    setSyncing(true);
    setResult(null);
    
    try {
      const syncResult = await syncAllDataToSupabase();
      setResult({
        success: syncResult.success,
        summary: syncResult.summary,
        details: syncResult.results
      });
    } catch (error: any) {
      setResult({
        success: false,
        summary: `âŒ Erreur: ${error.message}`,
        details: []
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#0C0C0C] border border-[#CCFF00]/20 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#CCFF00]/10 rounded-lg">
            <Database className="w-6 h-6 text-[#CCFF00]" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl text-[#F4F4F4] mb-2">
              Synchronisation ComplÃ¨te
            </h3>
            <p className="text-[#F4F4F4]/70 mb-4">
              Synchronisez toutes les donnÃ©es (projets, blog, case studies, FAQs, 
              tÃ©moignages, ressources) depuis les seeds locaux vers Supabase KV Store.
            </p>
            
            <div className="flex gap-3">
              <Button
                onClick={handleValidate}
                disabled={validating}
                variant="outline"
                className="bg-[#F4F4F4]/5 hover:bg-[#F4F4F4]/10 text-[#F4F4F4] border-[#F4F4F4]/20"
              >
                {validating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Validation...
                  </>
                ) : (
                  <>
                    <Server className="w-4 h-4 mr-2" />
                    Valider Serveur
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleSync}
                disabled={syncing}
                className="bg-[#CCFF00] hover:bg-[#CCFF00]/90 text-[#0C0C0C]"
              >
                {syncing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Synchronisation...
                  </>
                ) : (
                  <>
                    <HardDrive className="w-4 h-4 mr-2" />
                    Synchroniser Tout
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Server Status */}
      {serverStatus && (
        <Alert className={
          serverStatus.success 
            ? "bg-[#CCFF00]/10 border-[#CCFF00]/30"
            : "bg-red-500/10 border-red-500/30"
        }>
          {serverStatus.success ? (
            <CheckCircle2 className="h-5 w-5 text-[#CCFF00]" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
          <AlertTitle className="text-[#F4F4F4]">
            {serverStatus.success ? "âœ… Serveur OpÃ©rationnel" : "âŒ ProblÃ¨me Serveur"}
          </AlertTitle>
          <AlertDescription className="text-[#F4F4F4]/70">
            {serverStatus.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Sync Result */}
      {result && (
        <Alert className={
          result.success 
            ? "bg-[#CCFF00]/10 border-[#CCFF00]/30"
            : "bg-orange-500/10 border-orange-500/30"
        }>
          {result.success ? (
            <CheckCircle2 className="h-5 w-5 text-[#CCFF00]" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-500" />
          )}
          <AlertTitle className="text-[#F4F4F4] mb-3">
            {result.summary}
          </AlertTitle>
          <AlertDescription>
            {result.details && result.details.length > 0 && (
              <div className="space-y-2 mt-3">
                {result.details.map((detail: any, index: number) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 text-sm"
                  >
                    {detail.success ? (
                      <CheckCircle2 className="w-4 h-4 text-[#CCFF00]" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-[#F4F4F4]">
                      {detail.category}:
                    </span>
                    <span className="text-[#F4F4F4]/70">
                      {detail.count} Ã©lÃ©ment{detail.count > 1 ? 's' : ''}
                    </span>
                    {detail.error && (
                      <span className="text-red-500 text-xs ml-2">
                        ({detail.error})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Instructions */}
      <div className="bg-[#F4F4F4]/5 border border-[#F4F4F4]/10 rounded-lg p-4">
        <h4 className="text-sm text-[#F4F4F4] mb-2">
          ðŸ“ Instructions
        </h4>
        <ol className="text-sm text-[#F4F4F4]/70 space-y-1 list-decimal list-inside">
          <li>VÃ©rifiez d'abord que le serveur est accessible avec "Valider Serveur"</li>
          <li>Cliquez sur "Synchroniser Tout" pour uploader toutes les donnÃ©es</li>
          <li>VÃ©rifiez les rÃ©sultats et rechargez la page si besoin</li>
          <li>Les donnÃ©es seront maintenant chargÃ©es depuis Supabase</li>
        </ol>
      </div>

      {/* Mode Production Notice */}
      <div className="bg-[#CCFF00]/5 border border-[#CCFF00]/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Server className="w-5 h-5 text-[#CCFF00] mt-0.5" />
          <div>
            <h4 className="text-sm text-[#F4F4F4] mb-1">
              ðŸ”’ Mode Production ActivÃ©
            </h4>
            <p className="text-sm text-[#F4F4F4]/70">
              Le systÃ¨me est configurÃ© en mode production. Tous les appels
              utilisent uniquement le serveur Supabase, sans fallback local.
              Les donnÃ©es localStorage ne sont plus utilisÃ©es.
            </p>
          </div>
        </div>
      </div>

      {/* Console Command */}
      <div className="bg-[#0C0C0C]/50 border border-[#F4F4F4]/10 rounded-lg p-4">
        <p className="text-sm text-[#F4F4F4]/70 mb-2">
          ðŸ’¡ Vous pouvez aussi synchroniser via la console:
        </p>
        <code className="text-xs text-[#CCFF00] bg-[#0C0C0C] px-3 py-2 rounded block">
          window.syncAllDataToSupabase()
        </code>
      </div>
    </div>
  );
}
