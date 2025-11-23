import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Activity, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export function QuickDiagnosticButton() {
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<{
    success: number;
    error: number;
    warning: number;
    timestamp: Date;
  } | null>(null);

  const runQuickDiagnostic = async () => {
    setIsRunning(true);
    const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;

    let success = 0;
    let error = 0;
    let warning = 0;

    // Test 1: Health Check
    try {
      const response = await fetch(`${baseUrl}/health`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) success++;
      else error++;
    } catch {
      error++;
    }

    // Test 2: Blog Posts
    try {
      const response = await fetch(`${baseUrl}/blog/posts?lang=fr`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        const posts = await response.json();
        if (posts.length > 0) success++;
        else warning++;
      } else error++;
    } catch {
      error++;
    }

    // Test 3: Newsletter Stats
    try {
      const response = await fetch(`${baseUrl}/newsletter/stats`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) success++;
      else error++;
    } catch {
      error++;
    }

    setLastResult({
      success,
      error,
      warning,
      timestamp: new Date(),
    });
    setIsRunning(false);
  };

  const getStatusColor = () => {
    if (!lastResult) return "gray";
    if (lastResult.error > 0) return "red";
    if (lastResult.warning > 0) return "yellow";
    return "green";
  };

  const getStatusIcon = () => {
    const color = getStatusColor();
    if (color === "green") return <CheckCircle2 className="w-5 h-5 text-[#CCFF00]" />;
    if (color === "yellow") return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    if (color === "red") return <XCircle className="w-5 h-5 text-red-500" />;
    return <Activity className="w-5 h-5 text-gray-400" />;
  };

  const openFullDiagnostic = () => {
    if (typeof (window as any).serverDiagnostic === "function") {
      (window as any).serverDiagnostic();
    } else {
      console.log("ðŸ’¡ Pour ouvrir le diagnostic complet, utilisez: serverDiagnostic()");
    }
  };

  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A] p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-sm font-medium text-[#F4F4F4]">Ã‰tat du serveur</h3>
            {lastResult ? (
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-[#CCFF00] text-black text-xs px-2 py-0">
                  {lastResult.success} OK
                </Badge>
                {lastResult.warning > 0 && (
                  <Badge className="bg-yellow-500 text-black text-xs px-2 py-0">
                    {lastResult.warning} âš ï¸
                  </Badge>
                )}
                {lastResult.error > 0 && (
                  <Badge variant="destructive" className="text-xs px-2 py-0">
                    {lastResult.error} âŒ
                  </Badge>
                )}
                <span className="text-xs text-gray-400">
                  {lastResult.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-1">Cliquez pour tester</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={runQuickDiagnostic}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Test...
              </>
            ) : (
              "Tester"
            )}
          </Button>
          {lastResult && (
            <Button
              variant="ghost"
              size="sm"
              onClick={openFullDiagnostic}
              className="text-[#CCFF00] hover:text-[#CCFF00] hover:bg-[#CCFF00]/10"
            >
              DÃ©tails
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
