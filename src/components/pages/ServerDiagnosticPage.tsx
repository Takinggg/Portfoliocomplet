import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { ServerDiagnostic } from "../ServerDiagnostic";
import { ServerHealthCheck } from "../ServerHealthCheck";
import { CompleteDiagnosticButton } from "../CompleteDiagnosticButton";
import { ServerStatusDebugger } from "../ServerStatusDebugger";
import { RefreshServerStatusButton } from "../RefreshServerStatusButton";
import { InitServerDataButton } from "../InitServerDataButton";
import { SeedAllDataButton } from "../SeedAllDataButton";
import { CopyServerCodeButton } from "../CopyServerCodeButton";
import { MigrationWizard } from "../MigrationWizard";
import { SupabaseFunctionSetupHelper } from "../SupabaseFunctionSetupHelper";

interface ServerDiagnosticPageProps {
  onBack?: () => void;
}

export function ServerDiagnosticPage({ onBack }: ServerDiagnosticPageProps) {
  return (
    <div className="min-h-screen bg-[#0C0C0C] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white/60 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          )}

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl text-white mb-2">
                Diagnostic Serveur
              </h1>
              <p className="text-lg text-white/60">
                Vérification complète de l'état du backend et de toutes les routes API
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                const url = `${window.location.origin}/DIAGNOSTIC_SERVEUR_APRES_DEPLOIEMENT.md`;
                window.open(url, "_blank");
              }}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <FileText className="h-4 w-4 mr-2" />
              Guide de dépannage
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="bg-blue-500/10 border-blue-500/20 p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm text-blue-200 mb-1">
                🚀 Migration Complète vers Supabase
              </h3>
              <p className="text-xs text-blue-200/80">
                Suivez l'assistant de migration ci-dessous pour synchroniser TOUTES vos données
                (Blog, Case Studies, FAQ, etc.) avec Supabase en quelques clics.
              </p>
            </div>
          </div>
        </Card>

        {/* Migration Wizard */}
        <div className="mb-6">
          <MigrationWizard />
        </div>

        <div className="my-8 border-t border-white/10" />
        
        {/* Setup Helper for First Time */}
        <div className="mb-6">
          <SupabaseFunctionSetupHelper />
        </div>

        <div className="my-8 border-t border-white/10" />
        
        <h2 className="text-xl text-white mb-4">⚙️ Outils Avancés</h2>

        {/* Déploiement du serveur complet */}
        <div className="mb-6">
          <CopyServerCodeButton />
        </div>

        {/* Bouton de refresh serveur */}
        <div className="mb-6">
          <Card className="bg-white/5 border-white/10 p-6">
            <h3 className="text-lg text-white mb-4">🔄 Rafraîchir la détection serveur</h3>
            <p className="text-sm text-white/60 mb-4">
              Après avoir déployé le serveur complet, cliquez ici pour forcer une nouvelle vérification
              et activer le mode serveur.
            </p>
            <RefreshServerStatusButton />
          </Card>
        </div>

        {/* Initialisation COMPLÈTE des données */}
        <div className="mb-6">
          <SeedAllDataButton />
        </div>

        {/* Initialisation données serveur (legacy - projets uniquement) */}
        <div className="mb-6">
          <InitServerDataButton />
        </div>

        {/* Debugger en temps réel */}
        <div className="mb-6">
          <ServerStatusDebugger />
        </div>

        {/* Nouveau Diagnostic Complet */}
        <div className="mb-6">
          <CompleteDiagnosticButton />
        </div>

        {/* Diagnostic complet */}
        <div className="mb-6">
          <ServerDiagnostic />
        </div>

        {/* Health Check rapide */}
        <div className="mb-6">
          <ServerHealthCheck />
        </div>

        {/* Liens utiles */}
        <Card className="bg-white/5 border-white/10 p-6">
          <h3 className="text-lg text-white mb-4">Liens Utiles</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/logs/edge-functions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-[#00FFC2]" />
              <div>
                <div className="text-sm text-white">Logs Edge Functions</div>
                <div className="text-xs text-white/60">
                  Voir les logs en temps réel du serveur
                </div>
              </div>
            </a>

            <a
              href="https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/settings/functions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-[#00FFC2]" />
              <div>
                <div className="text-sm text-white">Secrets Supabase</div>
                <div className="text-xs text-white/60">
                  Gérer les variables d'environnement
                </div>
              </div>
            </a>

            <a
              href="https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/editor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-[#00FFC2]" />
              <div>
                <div className="text-sm text-white">SQL Editor</div>
                <div className="text-xs text-white/60">
                  Vérifier la table kv_store_04919ac5
                </div>
              </div>
            </a>

            <a
              href="https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-[#00FFC2]" />
              <div>
                <div className="text-sm text-white">Functions Dashboard</div>
                <div className="text-xs text-white/60">
                  Gérer les Edge Functions
                </div>
              </div>
            </a>
          </div>
        </Card>

        {/* Commandes CLI */}
        <Card className="bg-white/5 border-white/10 p-6 mt-6">
          <h3 className="text-lg text-white mb-4">Commandes CLI Utiles</h3>
          
          <div className="space-y-3">
            <div className="p-3 bg-black/30 rounded-lg">
              <div className="text-xs text-white/60 mb-1">Voir les logs en temps réel</div>
              <code className="text-xs text-[#00FFC2]">
                supabase functions logs server --tail
              </code>
            </div>

            <div className="p-3 bg-black/30 rounded-lg">
              <div className="text-xs text-white/60 mb-1">Redéployer le serveur</div>
              <code className="text-xs text-[#00FFC2]">
                supabase functions deploy server --no-verify-jwt
              </code>
            </div>

            <div className="p-3 bg-black/30 rounded-lg">
              <div className="text-xs text-white/60 mb-1">Lister les fonctions</div>
              <code className="text-xs text-[#00FFC2]">
                supabase functions list
              </code>
            </div>

            <div className="p-3 bg-black/30 rounded-lg">
              <div className="text-xs text-white/60 mb-1">Vérifier les secrets</div>
              <code className="text-xs text-[#00FFC2]">
                supabase secrets list
              </code>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-white/40">
          <p>
            Pour plus d'aide, consultez le fichier{" "}
            <code className="bg-white/10 px-2 py-1 rounded">
              DIAGNOSTIC_SERVEUR_APRES_DEPLOIEMENT.md
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
