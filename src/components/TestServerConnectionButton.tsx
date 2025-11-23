import { useState } from "react";
import { Button } from "./ui/button";
import { RefreshCw, CheckCircle, XCircle, Server, Wifi } from "lucide-react";
import { toast } from "sonner";
import { checkServerAvailability } from "../utils/serverService";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export function TestServerConnectionButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<"success" | "error" | null>(null);

  const testConnection = async () => {
    setIsLoading(true);
    setLastResult(null);

    try {
      // Test 1: Health check via serverService
      console.log("ðŸ” Test 1: VÃ©rification du serveur...");
      const isAvailable = await checkServerAvailability();

      if (isAvailable) {
        console.log("âœ… Serveur disponible");
        
        // Test 2: RÃ©cupÃ©rer les posts du blog
        console.log("ðŸ” Test 2: RÃ©cupÃ©ration des articles du blog...");
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
            signal: AbortSignal.timeout(10000),
          }
        );

        if (response.ok) {
          const posts = await response.json();
          console.log(`âœ… ${posts.length} articles trouvÃ©s`);
          
          setLastResult("success");
          toast.success("Connexion rÃ©ussie !", {
            description: `Le serveur est opÃ©rationnel. ${posts.length} article(s) disponible(s).`,
          });
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } else {
        throw new Error("Le serveur n'est pas disponible (503)");
      }
    } catch (error: any) {
      console.error("âŒ Erreur de connexion:", error);
      setLastResult("error");
      
      const errorMessage = error.message || "Erreur inconnue";
      
      if (errorMessage.includes("503") || errorMessage.includes("disponible")) {
        toast.error("Serveur non dÃ©ployÃ©", {
          description: "Le serveur n'est pas dÃ©ployÃ©. Utilisez le script deploy-server.sh pour le dÃ©ployer.",
          duration: 5000,
        });
      } else if (errorMessage.includes("timeout")) {
        toast.error("DÃ©lai d'attente dÃ©passÃ©", {
          description: "Le serveur ne rÃ©pond pas. VÃ©rifiez les logs Supabase.",
          duration: 5000,
        });
      } else {
        toast.error("Erreur de connexion", {
          description: errorMessage,
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={testConnection}
      disabled={isLoading}
      variant={lastResult === "success" ? "default" : lastResult === "error" ? "destructive" : "outline"}
      className={
        lastResult === "success"
          ? "bg-[#CCFF00] text-[#0C0C0C] hover:bg-[#CCFF00]/90"
          : lastResult === "error"
          ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
          : "bg-white/5 text-white border-white/10 hover:bg-white/10"
      }
    >
      {isLoading ? (
        <>
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Test en cours...
        </>
      ) : lastResult === "success" ? (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Serveur connectÃ©
        </>
      ) : lastResult === "error" ? (
        <>
          <XCircle className="h-4 w-4 mr-2" />
          Connexion Ã©chouÃ©e
        </>
      ) : (
        <>
          <Server className="h-4 w-4 mr-2" />
          Tester la connexion
        </>
      )}
    </Button>
  );
}

