/**
 * No Data Banner - Bannière d'alerte si aucune donnée n'est détectée
 * Guide l'utilisateur vers la synchronisation
 */

import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { AlertTriangle, Database, ExternalLink, X } from "lucide-react";

export function NoDataBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Vérifier après 3 secondes si des données sont présentes
    const timer = setTimeout(() => {
      // Check localStorage first (quick check)
      const hasLocalData = 
        localStorage.getItem('projects') || 
        localStorage.getItem('blog_posts') ||
        localStorage.getItem('case_studies');
      
      // Si pas de données locales, afficher la bannière
      if (!hasLocalData && !dismissed) {
        setShow(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleSync = () => {
    // Ouvrir le sync dashboard
    if (typeof window !== 'undefined' && (window as any).syncDashboard) {
      (window as any).syncDashboard();
    } else {
      window.location.hash = '#sync-dashboard';
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-top duration-500">
      <Alert className="bg-orange-500/90 backdrop-blur-sm border-orange-600 text-white shadow-2xl">
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-1" />
          
          <div className="flex-1 min-w-0">
            <AlertTitle className="text-white mb-2 text-lg">
              ⚠️ Aucune donnée détectée
            </AlertTitle>
            <AlertDescription className="text-white/90 space-y-3">
              <p className="text-sm">
                L'application est en <strong>mode production</strong> mais les données 
                ne sont pas encore synchronisées avec Supabase.
              </p>
              
              <div className="bg-white/10 rounded-lg p-3 text-sm">
                <p className="mb-2">
                  <strong>Solution rapide (2 minutes):</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1 text-white/80">
                  <li>Cliquer sur "Synchroniser les données" ci-dessous</li>
                  <li>Cliquer sur "Synchroniser Tout" dans le dashboard</li>
                  <li>Attendre 30 secondes</li>
                  <li>Recharger la page (F5)</li>
                </ol>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={handleSync}
                  size="sm"
                  className="bg-white text-orange-600 hover:bg-white/90"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Synchroniser les données
                </Button>
                
                <Button
                  onClick={() => {
                    window.open('/LIRE_MOI_URGENT.md', '_blank');
                  }}
                  size="sm"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Guide complet
                </Button>
              </div>

              <p className="text-xs text-white/70 mt-3">
                💡 <strong>Astuce:</strong> Tapez <code className="bg-white/20 px-1 rounded">syncDashboard()</code> dans 
                la console (F12) pour ouvrir le dashboard de synchronisation.
              </p>
            </AlertDescription>
          </div>

          <Button
            onClick={handleDismiss}
            size="sm"
            variant="ghost"
            className="flex-shrink-0 text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Alert>
    </div>
  );
}
