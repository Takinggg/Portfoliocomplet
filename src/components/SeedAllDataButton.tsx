/**
 * Seed All Data Button
 * Bouton pour initialiser TOUTES les donnÃ©es dans Supabase
 */

import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Database, CheckCircle, XCircle, Loader2, List } from "lucide-react";
import { seedData } from "../utils/seedAllDataToServer";

export function SeedAllDataButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: number } | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);

    try {
      const result = await seedData();
      setResult(result);

      if (result.success > 0) {
        // Reload aprÃ¨s 3 secondes pour voir les nouvelles donnÃ©es
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }
    } catch (error: any) {
      setResult({ success: 0, errors: 1 });
      console.error("Erreur seed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-[#CCFF00]/10 to-[#CCFF00]/5 border-[#CCFF00]/20 p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-[#CCFF00]/10">
          <Database className="h-8 w-8 text-[#CCFF00]" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl text-white mb-2">
            ðŸš€ Initialiser TOUTES les DonnÃ©es
          </h3>
          <p className="text-sm text-white/70 mb-4">
            CrÃ©e un portfolio complet et professionnel avec :
          </p>

          <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#CCFF00]" />
              <span>3 Projets complets</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#CCFF00]" />
              <span>3 Articles de blog</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#CCFF00]" />
              <span>3 Case studies</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#CCFF00]" />
              <span>8 Questions FAQ</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#CCFF00]" />
              <span>5 TÃ©moignages clients</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#CCFF00]" />
              <span>3 Ressources gratuites</span>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
            <p className="text-xs text-yellow-200 flex items-start gap-2">
              <span className="text-lg">âš ï¸</span>
              <span>
                <strong>Important :</strong> DÃ©ployez d'abord le serveur complet
                (fichier /DEPLOYER_COMPLET_TOUTES_FONCTIONNALITES.txt) sinon cette
                action Ã©chouera.
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSeed}
              disabled={loading}
              size="lg"
              className="bg-[#CCFF00] text-[#0C0C0C] hover:bg-[#CCFF00]/90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  CrÃ©ation en cours...
                </>
              ) : (
                <>
                  <Database className="h-5 w-5 mr-2" />
                  CrÃ©er Toutes les DonnÃ©es
                </>
              )}
            </Button>

            {result && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                result.success > 0
                  ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}>
                {result.success > 0 ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <div>
                      <div className="font-medium">
                        âœ… {result.success} Ã©lÃ©ments crÃ©Ã©s !
                      </div>
                      {result.errors > 0 && (
                        <div className="text-xs opacity-70">
                          ({result.errors} erreurs)
                        </div>
                      )}
                      <div className="text-xs opacity-70">
                        Redirection vers la homepage...
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">
                      âŒ Ã‰chec - VÃ©rifiez que le serveur complet est dÃ©ployÃ©
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Logs en temps rÃ©el */}
          {loading && (
            <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
                <List className="h-3 w-3" />
                <span>Logs de crÃ©ation (voir la console)</span>
              </div>
              <div className="text-xs text-white/40 font-mono">
                Ouivrez la console (F12) pour suivre la progression en dÃ©tail...
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
