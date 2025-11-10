import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { AlertCircle, CheckCircle2, AlertTriangle, Play } from "lucide-react";
import { runCompleteDiagnostic, getDiagnosticSummary } from "../utils/completeDiagnostic";

interface DiagnosticResult {
  test: string;
  status: "✅ OK" | "❌ FAIL" | "⚠️ WARNING";
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
      case "✅ OK": return <CheckCircle2 className="w-5 h-5 text-[#00FFC2]" />;
      case "❌ FAIL": return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "⚠️ WARNING": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
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
        <Card className="p-6 space-y-4 bg-[#0C0C0C] border-[#00FFC2]/20">
          {/* Résumé */}
          <div className="flex items-center justify-between pb-4 border-b border-[#00FFC2]/10">
            <h3 className="text-lg">Diagnostic du Serveur</h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#00FFC2]" />
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
            <div className="p-4 rounded-lg bg-[#00FFC2]/10 border border-[#00FFC2]/20">
              <div className="flex items-center gap-2 text-[#00FFC2]">
                <CheckCircle2 className="w-5 h-5" />
                <span>✅ Tout est OK ! Le serveur fonctionne parfaitement.</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>❌ {summary.fail} test(s) échoué(s) - voir détails ci-dessous</span>
              </div>
            </div>
          )}

          {/* Résultats détaillés */}
          <div className="space-y-2">
            {results?.map((result, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-[#F4F4F4]/5 border border-[#F4F4F4]/10 hover:border-[#00FFC2]/30 transition-colors"
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
                        <summary className="text-xs text-[#00FFC2] cursor-pointer hover:underline">
                          Voir détails
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

          {/* Actions recommandées */}
          {summary.fail > 0 && (
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <h4 className="text-sm text-yellow-400 mb-2">🔧 Actions recommandées :</h4>
              <ul className="text-xs text-[#F4F4F4]/70 space-y-1 list-disc list-inside">
                <li>Allez sur le <a href="https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions" target="_blank" rel="noopener" className="text-[#00FFC2] hover:underline">Supabase Dashboard</a></li>
                <li>Cliquez sur la fonction "make-server-04919ac5"</li>
                <li>Vérifiez l'onglet "Logs" pour voir les erreurs</li>
                <li>Le dernier log devrait être: "🚀 Server ... starting..."</li>
                <li>Si pas de log récent → le code n'a pas été déployé</li>
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
