import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { AlertCircle, CheckCircle2, AlertTriangle, Play } from "lucide-react";
import { runCompleteDiagnostic, getDiagnosticSummary } from "../utils/completeDiagnostic";

interface DiagnosticResult {
  test: string;
  status: "âœ… OK" | "âŒ FAIL" | "âš ï¸ WARNING";
  message: string;
  details?: any;
}

export function CompleteDiagnosticButton() {
  const [results, setResults] = useState<DiagnosticResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    try {
      const diagnosticResults = await runCompleteDiagnostic();
      setResults(diagnosticResults);
    } catch (error) {
      console.error("Erreur diagnostic:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (status: string) => {
    switch (status) {
      case "âœ… OK": return <CheckCircle2 className="w-5 h-5 text-[#CCFF00]" />;
      case "âŒ FAIL": return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "âš ï¸ WARNING": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return null;
    }
  };

  const summary = results ? getDiagnosticSummary(results) : null;

  return (
    <div className="space-y-4">
      <Button
        onClick={runDiagnostic}
        disabled={loading}
        className="gap-2"
        variant="outline"
      >
        <Play className="w-4 h-4" />
        {loading ? "Diagnostic en cours..." : "Lancer le Diagnostic Complet"}
      </Button>

      {summary && (
        <Card className="p-6 space-y-4 bg-[#0C0C0C] border-[#CCFF00]/20">
          {/* RÃ©sumÃ© */}
          <div className="flex items-center justify-between pb-4 border-b border-[#CCFF00]/10">
            <h3 className="text-lg">Diagnostic du Serveur</h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#CCFF00]" />
                {summary.ok}
              </span>
              <span className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                {summary.fail}
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                {summary.warn}
              </span>
            </div>
          </div>

          {/* Statut global */}
          {summary.allOk ? (
            <div className="p-4 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/20">
              <div className="flex items-center gap-2 text-[#CCFF00]">
                <CheckCircle2 className="w-5 h-5" />
                <span>âœ… Tout est OK ! Le serveur fonctionne parfaitement.</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>âŒ {summary.fail} test(s) Ã©chouÃ©(s) - voir dÃ©tails ci-dessous</span>
              </div>
            </div>
          )}

          {/* RÃ©sultats dÃ©taillÃ©s */}
          <div className="space-y-2">
            {results?.map((result, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-[#F4F4F4]/5 border border-[#F4F4F4]/10 hover:border-[#CCFF00]/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {getIcon(result.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#F4F4F4]">{result.test}</span>
                      <span className="text-xs text-[#F4F4F4]/50">{result.status}</span>
                    </div>
                    <p className="text-xs text-[#F4F4F4]/70 mt-1">{result.message}</p>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-[#CCFF00] cursor-pointer hover:underline">
                          Voir dÃ©tails
                        </summary>
                        <pre className="text-xs text-[#F4F4F4]/60 mt-2 p-2 bg-black/30 rounded overflow-x-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions recommandÃ©es */}
          {summary.fail > 0 && (
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <h4 className="text-sm text-yellow-400 mb-2">ðŸ”§ Actions recommandÃ©es :</h4>
              <ul className="text-xs text-[#F4F4F4]/70 space-y-1 list-disc list-inside">
                <li>Allez sur le <a href="https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions" target="_blank" rel="noopener" className="text-[#CCFF00] hover:underline">Supabase Dashboard</a></li>
                <li>Cliquez sur la fonction "make-server-04919ac5"</li>
                <li>VÃ©rifiez l'onglet "Logs" pour voir les erreurs</li>
                <li>Le dernier log devrait Ãªtre: "ðŸš€ Server ... starting..."</li>
                <li>Si pas de log rÃ©cent â†’ le code n'a pas Ã©tÃ© dÃ©ployÃ©</li>
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
