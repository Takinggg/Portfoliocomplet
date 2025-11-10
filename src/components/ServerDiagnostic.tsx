import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Server,
  AlertTriangle,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface DiagnosticTest {
  name: string;
  status: "pending" | "running" | "success" | "error" | "warning";
  message?: string;
  details?: any;
  url?: string;
}

export function ServerDiagnostic() {
  const [tests, setTests] = useState<DiagnosticTest[]>([
    { name: "Connexion Serveur", status: "pending" },
    { name: "Route Health Check", status: "pending" },
    { name: "Route Blog Posts", status: "pending" },
    { name: "Route Newsletter Stats", status: "pending" },
    { name: "Mode Fallback Local", status: "pending" },
  ]);

  const [running, setRunning] = useState(false);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    total: number;
    success: number;
    errors: number;
    warnings: number;
  } | null>(null);

  const updateTest = (name: string, updates: Partial<DiagnosticTest>) => {
    setTests((prev) =>
      prev.map((t) => (t.name === name ? { ...t, ...updates } : t))
    );
  };

  const runDiagnostics = async () => {
    setRunning(true);
    setSummary(null);

    // Reset tous les tests
    setTests((prev) => prev.map((t) => ({ ...t, status: "pending", message: undefined, details: undefined })));

    console.log("🔍 Démarrage du diagnostic serveur...");

    // Test 1: Connexion Serveur
    updateTest("Connexion Serveur", { status: "running" });
    try {
      const { checkServerAvailability } = await import("../utils/serverService");
      const isAvailable = await checkServerAvailability();

      if (isAvailable) {
        updateTest("Connexion Serveur", {
          status: "success",
          message: "Serveur accessible et opérationnel",
          details: { mode: "server", available: true },
        });
      } else {
        updateTest("Connexion Serveur", {
          status: "warning",
          message: "Serveur non accessible, mode local activé",
          details: { mode: "local", available: false },
        });
      }
    } catch (error: any) {
      updateTest("Connexion Serveur", {
        status: "error",
        message: `Erreur: ${error.message}`,
        details: { error: error.toString() },
      });
    }

    // Test 2: Route Health Check
    updateTest("Route Health Check", { status: "running" });
    const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`;
    try {
      const response = await fetch(healthUrl, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
        signal: AbortSignal.timeout(10000),
      });

      const data = await response.json();

      if (response.ok) {
        updateTest("Route Health Check", {
          status: "success",
          message: `Serveur version ${data.version || "unknown"} opérationnel`,
          details: data,
          url: healthUrl,
        });
      } else {
        updateTest("Route Health Check", {
          status: "error",
          message: `HTTP ${response.status}: ${data.error || "Erreur inconnue"}`,
          details: data,
          url: healthUrl,
        });
      }
    } catch (error: any) {
      updateTest("Route Health Check", {
        status: "error",
        message: `Impossible de joindre le serveur: ${error.message}`,
        details: { error: error.toString() },
        url: healthUrl,
      });
    }

    // Test 3: Route Blog Posts
    updateTest("Route Blog Posts", { status: "running" });
    const blogUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts?lang=fr`;
    try {
      const response = await fetch(blogUrl, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const posts = await response.json();
        updateTest("Route Blog Posts", {
          status: posts.length > 0 ? "success" : "warning",
          message:
            posts.length > 0
              ? `${posts.length} articles trouvés`
              : "Aucun article trouvé (base vide)",
          details: { count: posts.length, posts: posts.slice(0, 2) },
          url: blogUrl,
        });
      } else {
        const data = await response.json();
        updateTest("Route Blog Posts", {
          status: "error",
          message: `HTTP ${response.status}: ${data.error || "Erreur inconnue"}`,
          details: data,
          url: blogUrl,
        });
      }
    } catch (error: any) {
      updateTest("Route Blog Posts", {
        status: "error",
        message: `Erreur: ${error.message}`,
        details: { error: error.toString() },
        url: blogUrl,
      });
    }

    // Test 4: Route Newsletter Stats
    updateTest("Route Newsletter Stats", { status: "running" });
    const newsletterUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/newsletter/stats`;
    try {
      const response = await fetch(newsletterUrl, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const stats = await response.json();
        updateTest("Route Newsletter Stats", {
          status: "success",
          message: `${stats.total || stats.totalCount || 0} abonnés trouvés`,
          details: stats,
          url: newsletterUrl,
        });
      } else {
        const data = await response.json();
        updateTest("Route Newsletter Stats", {
          status: "error",
          message: `HTTP ${response.status}: ${data.error || "Erreur inconnue"}`,
          details: data,
          url: newsletterUrl,
        });
      }
    } catch (error: any) {
      updateTest("Route Newsletter Stats", {
        status: "error",
        message: `Erreur: ${error.message}`,
        details: { error: error.toString() },
        url: newsletterUrl,
      });
    }

    // Test 5: Mode Fallback Local
    updateTest("Mode Fallback Local", { status: "running" });
    try {
      const { fetchBlogPosts } = await import("../utils/blogService");
      const { posts, mode } = await fetchBlogPosts("fr");

      updateTest("Mode Fallback Local", {
        status: "success",
        message: `Mode ${mode}: ${posts.length} articles disponibles`,
        details: { mode, postsCount: posts.length },
      });
    } catch (error: any) {
      updateTest("Mode Fallback Local", {
        status: "error",
        message: `Erreur fallback: ${error.message}`,
        details: { error: error.toString() },
      });
    }

    // Calculer le résumé
    setTests((currentTests) => {
      const successCount = currentTests.filter((t) => t.status === "success").length;
      const errorCount = currentTests.filter((t) => t.status === "error").length;
      const warningCount = currentTests.filter((t) => t.status === "warning").length;

      setSummary({
        total: currentTests.length,
        success: successCount,
        errors: errorCount,
        warnings: warningCount,
      });

      return currentTests;
    });

    setRunning(false);
    console.log("✅ Diagnostic terminé");
  };

  const getStatusIcon = (status: DiagnosticTest["status"]) => {
    switch (status) {
      case "pending":
        return <div className="h-4 w-4 rounded-full bg-white/20" />;
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-400" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-400" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status: DiagnosticTest["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-white/5 text-white/60 border-white/20">
            En attente
          </Badge>
        );
      case "running":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            En cours...
          </Badge>
        );
      case "success":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            OK
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Erreur
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Attention
          </Badge>
        );
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("✅ Copié dans le presse-papiers");
    } catch (error) {
      console.error("❌ Erreur de copie:", error);
    }
  };

  return (
    <Card className="bg-white/5 border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Server className="h-6 w-6 text-[#00FFC2]" />
          <div>
            <h2 className="text-xl text-white">Diagnostic Serveur</h2>
            <p className="text-sm text-white/60">
              Vérification complète de tous les composants
            </p>
          </div>
        </div>

        <Button
          onClick={runDiagnostics}
          disabled={running}
          className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
        >
          {running ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Diagnostic...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Lancer le diagnostic
            </>
          )}
        </Button>
      </div>

      {/* Résumé */}
      {summary && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl text-white">{summary.total}</div>
              <div className="text-xs text-white/60">Tests</div>
            </div>
            <div>
              <div className="text-2xl text-green-400">{summary.success}</div>
              <div className="text-xs text-white/60">Réussis</div>
            </div>
            <div>
              <div className="text-2xl text-yellow-400">{summary.warnings}</div>
              <div className="text-xs text-white/60">Avertissements</div>
            </div>
            <div>
              <div className="text-2xl text-red-400">{summary.errors}</div>
              <div className="text-xs text-white/60">Erreurs</div>
            </div>
          </div>

          {summary.errors === 0 && summary.warnings === 0 && (
            <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Tous les tests sont passés avec succès !</span>
            </div>
          )}

          {summary.errors > 0 && (
            <div className="mt-4 flex items-start gap-2 text-red-400 text-sm">
              <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">
                  {summary.errors} erreur{summary.errors > 1 ? "s" : ""} détectée
                  {summary.errors > 1 ? "s" : ""}
                </div>
                <div className="text-white/60 text-xs mt-1">
                  Consultez les détails ci-dessous pour plus d'informations
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tests */}
      <div className="space-y-2">
        {tests.map((test) => (
          <div key={test.name} className="bg-white/5 rounded-lg border border-white/10">
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5"
              onClick={() =>
                setExpandedTest(expandedTest === test.name ? null : test.name)
              }
            >
              <div className="flex items-center gap-3 flex-1">
                {getStatusIcon(test.status)}
                <div className="flex-1">
                  <div className="text-sm text-white">{test.name}</div>
                  {test.message && (
                    <div className="text-xs text-white/60 mt-1">{test.message}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(test.status)}
                {test.details && (
                  <>
                    {expandedTest === test.name ? (
                      <ChevronUp className="h-4 w-4 text-white/60" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-white/60" />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Détails expandables */}
            {expandedTest === test.name && test.details && (
              <div className="px-4 pb-4 border-t border-white/10">
                <div className="mt-3 space-y-2">
                  {test.url && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(test.url, "_blank")}
                        className="text-xs text-[#00FFC2] hover:text-[#00FFC2]/80"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Ouvrir l'URL
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(test.url!)}
                        className="text-xs text-white/60 hover:text-white"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copier
                      </Button>
                    </div>
                  )}

                  <div className="p-3 bg-black/30 rounded-lg">
                    <pre className="text-xs text-white/80 overflow-auto max-h-40">
                      {JSON.stringify(test.details, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Projet */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="text-xs text-white/40 space-y-1">
          <div className="flex justify-between">
            <span>Project ID:</span>
            <span className="text-white/60 font-mono">{projectId}</span>
          </div>
          <div className="flex justify-between">
            <span>Base URL:</span>
            <span className="text-white/60 font-mono text-right break-all">
              https://{projectId}.supabase.co/functions/v1/make-server-04919ac5
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-200">
            💡 <strong>Astuce:</strong> Si des tests échouent, consultez le fichier{" "}
            <code className="bg-black/30 px-1 py-0.5 rounded">
              DIAGNOSTIC_SERVEUR_APRES_DEPLOIEMENT.md
            </code>{" "}
            pour des solutions détaillées.
          </p>
        </div>
      </div>
    </Card>
  );
}
