/**
 * Copy Server Code Button
 * Bouton pour copier facilement le code du serveur complet
 */

import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Copy, CheckCircle, ExternalLink } from "lucide-react";

export function CopyServerCodeButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Le code du serveur consolidÃ© avec CORS corrigÃ©
      const response = await fetch('/supabase/functions/server/index.tsx');
      const serverCode = await response.text();
      
      await navigator.clipboard.writeText(serverCode);
      setCopied(true);
      
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error("Erreur copie:", error);
      alert("Erreur lors de la copie. Ouvrez /supabase/functions/server/index.tsx et copiez manuellement.");
    }
  };

  const openDashboard = () => {
    // Ouvrir la page des Edge Functions
    window.open(
      'https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions',
      '_blank'
    );
  };

  const createNewFunction = () => {
    // Ouvrir la page pour crÃ©er une nouvelle fonction
    window.open(
      'https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions',
      '_blank'
    );
    
    // Afficher les instructions
    setTimeout(() => {
      alert(`ðŸ“ Instructions pour crÃ©er la fonction :

1. Cliquez sur "+ New Function" (bouton vert)
2. Nom de la fonction : make-server-04919ac5
3. Cliquez "Create function"
4. Dans l'Ã©diteur, SUPPRIMEZ tout le code exemple
5. COLLEZ le code que vous avez copiÃ©
6. Cliquez "Deploy"

Attendez 30-60 secondes, puis revenez ici !`);
    }, 500);
  };

  return (
    <Card className="bg-white/5 border-white/10 p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-purple-500/10">
          <Copy className="h-6 w-6 text-purple-400" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg text-white mb-2">
            ðŸš€ DÃ©ployer le Serveur (CORS CorrigÃ©)
          </h3>
          <p className="text-sm text-white/60 mb-4">
            Serveur consolidÃ© avec CORS fixÃ©, prÃªt pour Figma Make et synchronisation Supabase :
          </p>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
            <div className="text-sm text-blue-200 space-y-3">
              <div>
                <p className="font-medium mb-2">ðŸ“ Si la fonction existe dÃ©jÃ  :</p>
                <ol className="list-decimal list-inside space-y-1 text-xs ml-2">
                  <li>Copier le code ci-dessous</li>
                  <li>Ouvrir le Dashboard â†’ Cliquer sur "make-server-04919ac5"</li>
                  <li>Cliquer "Edit" â†’ Supprimer tout â†’ Coller â†’ Deploy</li>
                </ol>
              </div>
              
              <div>
                <p className="font-medium mb-2">ðŸ†• Si la fonction n'existe PAS encore :</p>
                <ol className="list-decimal list-inside space-y-1 text-xs ml-2">
                  <li>Copier le code ci-dessous</li>
                  <li>Cliquer "CrÃ©er la Fonction" â†’ Suivre les instructions</li>
                  <li>Nom : <code className="bg-white/10 px-1 rounded">make-server-04919ac5</code></li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Ã‰tape 1 : Copier le code */}
            <div>
              <p className="text-xs text-white/60 mb-2">Ã‰tape 1 : Copier le code</p>
              <Button
                onClick={handleCopy}
                variant="default"
                className={`${
                  copied 
                    ? "bg-green-500 hover:bg-green-600" 
                    : "bg-purple-500 hover:bg-purple-600"
                } text-white w-full sm:w-auto`}
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Code CopiÃ© !
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copier le Code du Serveur
                  </>
                )}
              </Button>
            </div>

            {/* Ã‰tape 2 : Aller sur Supabase */}
            {copied && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-xs text-white/60 mb-2">Ã‰tape 2 : Ouvrir Supabase</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={openDashboard}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ouvrir Dashboard (fonction existe)
                  </Button>
                  
                  <Button
                    onClick={createNewFunction}
                    variant="outline"
                    className="border-[#CCFF00]/20 text-[#CCFF00] hover:bg-[#CCFF00]/10"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    CrÃ©er la Fonction (si n'existe pas)
                  </Button>
                </div>
              </div>
            )}
          </div>

          {copied && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-green-200">
                âœ… Code copiÃ© ! Maintenant allez dans le Supabase Dashboard et collez-le.
              </p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-white/40">
              ðŸ’¡ <strong>Guide rapide :</strong> Consultez{" "}
              <code className="bg-white/10 px-1 py-0.5 rounded text-[#CCFF00]">
                /DEPLOIEMENT_RAPIDE_CORS_CORRIGE.md
              </code>{" "}
              pour le guide de dÃ©ploiement complet
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
