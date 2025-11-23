import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Loader2, CheckCircle2, XCircle, AlertCircle, RefreshCw, Copy, ExternalLink } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface TestResult {
  name: string;
  status: "success" | "error" | "warning" | "loading";
  message: string;
  details?: any;
  solution?: string;
}

export function AutoServerDiagnostic() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({});

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;

  const runDiagnostic = async () => {
    setIsRunning(true);
    setTests([]);

    const results: TestResult[] = [];

    // Test 1: Health Check
    results.push({
      name: "Health Check",
      status: "loading",
      message: "Test en cours...",
    });
    setTests([...results]);

    try {
      const response = await fetch(`${baseUrl}/health`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        results[0] = {
          name: "Health Check",
          status: "success",
          message: `âœ… Serveur opÃ©rationnel (version ${data.version})`,
          details: data,
        };
      } else {
        const text = await response.text();
        results[0] = {
          name: "Health Check",
          status: "error",
          message: `âŒ HTTP ${response.status}`,
          details: text,
          solution: response.status === 404 
            ? "Le serveur n'est pas dÃ©ployÃ©. ExÃ©cutez: supabase functions deploy server --no-verify-jwt"
            : "VÃ©rifiez les logs du serveur sur le dashboard Supabase",
        };
      }
    } catch (error: any) {
      results[0] = {
        name: "Health Check",
        status: "error",
        message: `âŒ ${error.name}: ${error.message}`,
        details: error,
        solution: error.name === "TimeoutError"
          ? "Le serveur ne rÃ©pond pas dans les dÃ©lais. VÃ©rifiez qu'il est dÃ©ployÃ©."
          : "Impossible de contacter le serveur. VÃ©rifiez votre connexion internet et que le serveur est dÃ©ployÃ©.",
      };
    }
    setTests([...results]);

    // Test 2: Blog Posts
    results.push({
      name: "Blog Posts",
      status: "loading",
      message: "Test en cours...",
    });
    setTests([...results]);

    try {
      const response = await fetch(`${baseUrl}/blog/posts?lang=fr`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const posts = await response.json();
        results[1] = {
          name: "Blog Posts",
          status: posts.length > 0 ? "success" : "warning",
          message: posts.length > 0 
            ? `âœ… ${posts.length} articles trouvÃ©s` 
            : `âš ï¸ Aucun article trouvÃ©`,
          details: { count: posts.length },
          solution: posts.length === 0 
            ? "Utilisez le bouton 'Initialiser les donnÃ©es du blog' dans le dashboard"
            : undefined,
        };
      } else {
        results[1] = {
          name: "Blog Posts",
          status: "error",
          message: `âŒ HTTP ${response.status}`,
          details: await response.text(),
          solution: "La route blog ne fonctionne pas. VÃ©rifiez les logs du serveur.",
        };
      }
    } catch (error: any) {
      results[1] = {
        name: "Blog Posts",
        status: "error",
        message: `âŒ ${error.message}`,
        details: error,
        solution: "VÃ©rifiez que le serveur est bien dÃ©ployÃ© et opÃ©rationnel.",
      };
    }
    setTests([...results]);

    // Test 3: Newsletter Stats
    results.push({
      name: "Newsletter Stats",
      status: "loading",
      message: "Test en cours...",
    });
    setTests([...results]);

    try {
      const response = await fetch(`${baseUrl}/newsletter/stats`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const stats = await response.json();
        results[2] = {
          name: "Newsletter Stats",
          status: "success",
          message: `âœ… ${stats.total || stats.totalCount || 0} abonnÃ©s`,
          details: stats,
        };
      } else {
        results[2] = {
          name: "Newsletter Stats",
          status: "error",
          message: `âŒ HTTP ${response.status}`,
          details: await response.text(),
          solution: "La route newsletter ne fonctionne pas. VÃ©rifiez les logs du serveur.",
        };
      }
    } catch (error: any) {
      results[2] = {
        name: "Newsletter Stats",
        status: "error",
        message: `âŒ ${error.message}`,
        details: error,
      };
    }
    setTests([...results]);

    // Test 4: Projects
    results.push({
      name: "Projects",
      status: "loading",
      message: "Test en cours...",
    });
    setTests([...results]);

    try {
      const response = await fetch(`${baseUrl}/projects`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        const count = data.projects?.length || 0;
        results[3] = {
          name: "Projects",
          status: count > 0 ? "success" : "warning",
          message: count > 0 ? `âœ… ${count} projets` : `âš ï¸ Aucun projet`,
          details: { count },
          solution: count === 0 
            ? "Utilisez le bouton 'Seed Projects' dans le dashboard"
            : undefined,
        };
      } else {
        results[3] = {
          name: "Projects",
          status: "error",
          message: `âŒ HTTP ${response.status}`,
          details: await response.text(),
        };
      }
    } catch (error: any) {
      results[3] = {
        name: "Projects",
        status: "error",
        message: `âŒ ${error.message}`,
        details: error,
      };
    }
    setTests([...results]);

    // Test 5: KV Store
    results.push({
      name: "KV Store (Write Test)",
      status: "loading",
      message: "Test en cours...",
    });
    setTests([...results]);

    try {
      const testKey = `test_${Date.now()}`;
      const response = await fetch(`${baseUrl}/kv/set`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: testKey, value: { test: true } }),
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        results[4] = {
          name: "KV Store (Write Test)",
          status: "success",
          message: "âœ… Ã‰criture OK",
          details: { key: testKey },
        };
      } else {
        results[4] = {
          name: "KV Store (Write Test)",
          status: "error",
          message: `âŒ HTTP ${response.status}`,
          details: await response.text(),
          solution: "ProblÃ¨me avec la table KV. VÃ©rifiez qu'elle existe dans Supabase.",
        };
      }
    } catch (error: any) {
      results[4] = {
        name: "KV Store (Write Test)",
        status: "error",
        message: `âŒ ${error.message}`,
        details: error,
      };
    }
    setTests([...results]);

    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  const successCount = tests.filter(t => t.status === "success").length;
  const errorCount = tests.filter(t => t.status === "error").length;
  const warningCount = tests.filter(t => t.status === "warning").length;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-[#CCFF00]" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "loading":
        return <Loader2 className="w-5 h-5 animate-spin text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-[#CCFF00] text-black">RÃ©ussi</Badge>;
      case "error":
        return <Badge variant="destructive">Erreur</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500 text-black">Avertissement</Badge>;
      case "loading":
        return <Badge variant="outline">En cours...</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#F4F4F4] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-[#F4F4F4]">Diagnostic Serveur Automatique</h1>
            <Button
              onClick={runDiagnostic}
              disabled={isRunning}
              className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Test en cours...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Re-tester
                </>
              )}
            </Button>
          </div>

          {/* Summary */}
          {tests.length > 0 && !isRunning && (
            <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#F4F4F4]">{tests.length}</div>
                  <div className="text-sm text-gray-400">Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#CCFF00]">{successCount}</div>
                  <div className="text-sm text-gray-400">RÃ©ussis</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">{warningCount}</div>
                  <div className="text-sm text-gray-400">Avertissements</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">{errorCount}</div>
                  <div className="text-sm text-gray-400">Erreurs</div>
                </div>
              </div>

              {/* Overall Status */}
              <div className="mt-6 pt-6 border-t border-[#2A2A2A]">
                {errorCount === 0 && warningCount === 0 ? (
                  <div className="text-center">
                    <CheckCircle2 className="w-12 h-12 text-[#CCFF00] mx-auto mb-2" />
                    <p className="text-[#CCFF00]">ðŸŽ‰ Tous les tests sont passÃ©s avec succÃ¨s !</p>
                    <p className="text-sm text-gray-400 mt-2">Votre serveur fonctionne parfaitement.</p>
                  </div>
                ) : errorCount > 0 ? (
                  <div className="text-center">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                    <p className="text-red-400">âš ï¸ Des erreurs ont Ã©tÃ© dÃ©tectÃ©es</p>
                    <p className="text-sm text-gray-400 mt-2">Consultez les solutions ci-dessous.</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                    <p className="text-yellow-400">âš ï¸ Le serveur fonctionne mais certaines donnÃ©es manquent</p>
                    <p className="text-sm text-gray-400 mt-2">Utilisez les boutons d'initialisation dans le dashboard.</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          {tests.map((test, index) => (
            <Card key={index} className="bg-[#1A1A1A] border-[#2A2A2A] p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {getStatusIcon(test.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[#F4F4F4]">{test.name}</h3>
                      {getStatusBadge(test.status)}
                    </div>
                    <p className="text-gray-400">{test.message}</p>

                    {/* Solution */}
                    {test.solution && (
                      <div className="mt-4 p-4 bg-[#0C0C0C] border border-[#2A2A2A] rounded-lg">
                        <p className="text-sm font-medium text-[#CCFF00] mb-2">ðŸ’¡ Solution recommandÃ©e:</p>
                        <p className="text-sm text-gray-300">{test.solution}</p>
                      </div>
                    )}

                    {/* Details (collapsible) */}
                    {test.details && (
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDetails({ ...showDetails, [test.name]: !showDetails[test.name] })}
                          className="text-xs"
                        >
                          {showDetails[test.name] ? "Masquer les dÃ©tails" : "Voir les dÃ©tails"}
                        </Button>
                        {showDetails[test.name] && (
                          <div className="mt-2 p-4 bg-[#0C0C0C] border border-[#2A2A2A] rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-400">DÃ©tails techniques:</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(JSON.stringify(test.details, null, 2))}
                                className="h-6 px-2 text-xs"
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copier
                              </Button>
                            </div>
                            <pre className="text-xs text-gray-300 overflow-x-auto">
                              {JSON.stringify(test.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-6">
          <h3 className="text-[#F4F4F4] mb-4">ðŸ”— Liens utiles</h3>
          <div className="space-y-3">
            <a
              href={`https://supabase.com/dashboard/project/${projectId}/logs/edge-functions`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#CCFF00] hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Logs Edge Functions Supabase
            </a>
            <a
              href={`https://supabase.com/dashboard/project/${projectId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#CCFF00] hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Dashboard Supabase
            </a>
            <a
              href={`https://supabase.com/dashboard/project/${projectId}/settings/functions`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#CCFF00] hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Secrets / Variables d'environnement
            </a>
            <a
              href={`${baseUrl}/health`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#CCFF00] hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Health Check Direct
            </a>
          </div>
        </Card>

        {/* Info */}
        <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-6">
          <h3 className="text-[#F4F4F4] mb-4">ðŸ“‹ Informations</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Project ID:</span>
              <span className="text-[#F4F4F4] font-mono">{projectId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Base URL:</span>
              <span className="text-[#F4F4F4] font-mono text-xs">{baseUrl}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Mode de fallback:</span>
              <span className="text-[#CCFF00]">ActivÃ© âœ“</span>
            </div>
          </div>
        </Card>

        {/* Command Help */}
        {errorCount > 0 && (
          <Card className="bg-red-950/20 border-red-900/50 p-6">
            <h3 className="text-red-400 mb-4">ðŸš¨ Commandes de dÃ©pannage</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">RedÃ©ployer le serveur:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-[#0C0C0C] px-4 py-2 rounded text-sm text-[#F4F4F4] font-mono">
                    supabase functions deploy server --no-verify-jwt
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("supabase functions deploy server --no-verify-jwt")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Voir les logs en temps rÃ©el:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-[#0C0C0C] px-4 py-2 rounded text-sm text-[#F4F4F4] font-mono">
                    supabase functions logs server --tail
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("supabase functions logs server --tail")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Lister les fonctions dÃ©ployÃ©es:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-[#0C0C0C] px-4 py-2 rounded text-sm text-[#F4F4F4] font-mono">
                    supabase functions list
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("supabase functions list")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
