/**
 * PAGE DE TEST - Emails Dashboard
 * 
 * Cette page standalone permet de tester le composant EmailSettings
 * sans avoir besoin de l'intÃ©grer dans le dashboard complet.
 * 
 * UTILISATION :
 * 1. Importer dans App.tsx
 * 2. Ajouter une route temporaire pour y accÃ©der
 * 3. Tester les fonctionnalitÃ©s emails
 * 4. Une fois validÃ©, intÃ©grer dans DashboardPage
 */

import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import EmailSettings from "../dashboard/EmailSettings";

interface EmailsTestPageProps {
  onBack?: () => void;
}

export default function EmailsTestPage({ onBack }: EmailsTestPageProps) {
  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white">
      {/* Header */}
      <div className="bg-neutral-900 border-b border-neutral-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-neutral-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          )}
          <div>
            <h1 className="text-xl font-bold">Test - Gestion des Emails</h1>
            <p className="text-sm text-neutral-400">
              Page de test du systÃ¨me d'emails automatiques
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8">
        <EmailSettings />
      </div>

      {/* Footer Info */}
      <div className="fixed bottom-4 right-4 bg-neutral-900 border border-neutral-800 rounded-lg p-4 max-w-md">
        <p className="text-sm text-neutral-300 mb-2">
          <strong className="text-[#CCFF00]">âœ… Page de test active</strong>
        </p>
        <p className="text-xs text-neutral-400">
          Cette page permet de tester EmailSettings avant de l'intÃ©grer dans DashboardPage.
          Supprimez ce fichier aprÃ¨s intÃ©gration complÃ¨te.
        </p>
      </div>
    </div>
  );
}

/**
 * INTÃ‰GRATION DANS APP.TSX (Temporaire pour test) :
 * 
 * 1. Import :
 *    import EmailsTestPage from "./components/pages/EmailsTestPage";
 * 
 * 2. Ajouter au type Page :
 *    type Page = "home" | ... | "emails-test";
 * 
 * 3. Ajouter dans renderPage() :
 *    case "emails-test":
 *      return <EmailsTestPage onBack={() => setCurrentPage("dashboard")} />;
 * 
 * 4. AccÃ©der via : window.location.hash = "emails-test"
 *    ou en modifiant temporairement currentPage
 * 
 * 5. AprÃ¨s validation, supprimer cette page et intÃ©grer EmailSettings dans DashboardPage
 */
