/**
 * Bouton pour initialiser le serveur avec des données de démonstration
 */

import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Database, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { seedServerProjects } from "../utils/seedServerProjects";

export function InitServerDataButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleInit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const projectsResult = await seedServerProjects();

      if (projectsResult.success) {
        setResult({
          success: true,
          message: `✅ ${projectsResult.count} projets créés avec succès !`
        });

        // Reload après 2 secondes
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setResult({
          success: false,
          message: "❌ Erreur lors de l'initialisation"
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: `❌ Erreur: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/5 border-white/10 p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-[#00FFC2]/10">
          <Database className="h-6 w-6 text-[#00FFC2]" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg text-white mb-2">
            Initialiser le serveur avec des données de démo
          </h3>
          <p className="text-sm text-white/60 mb-4">
            Crée 3 projets de démonstration sur le serveur pour tester l'affichage
            sur la homepage et le dashboard.
          </p>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleInit}
              disabled={loading}
              className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Initialisation...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Initialiser les données
                </>
              )}
            </Button>

            {result && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                result.success 
                  ? "bg-green-500/10 text-green-400" 
                  : "bg-red-500/10 text-red-400"
              }`}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <span className="text-sm">{result.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
