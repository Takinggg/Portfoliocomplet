/**
 * PAGE DE TEST - Emails Dashboard
 * 
 * Cette page standalone permet de tester le composant EmailSettings
 * sans avoir besoin de l'intégrer dans le dashboard complet.
 * 
 * UTILISATION :
 * 1. Importer dans App.tsx
 * 2. Ajouter une route temporaire pour y accéder
 * 3. Tester les fonctionnalités emails
 * 4. Une fois validé, intégrer dans DashboardPage
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
              Page de test du système d'emails automatiques
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
          <strong className="text-[#00FFC2]">✅ Page de test active</strong>
        </p>
        <p className="text-xs text-neutral-400">
          Cette page permet de tester EmailSettings avant de l'intégrer dans DashboardPage.
          Supprimez ce fichier après intégration complète.
        </p>
      </div>
    </div>
  );
}

/**
 * INTÉGRATION DANS APP.TSX (Temporaire pour test) :
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
 * 4. Accéder via : window.location.hash = "emails-test"
 *    ou en modifiant temporairement currentPage
 * 
 * 5. Après validation, supprimer cette page et intégrer EmailSettings dans DashboardPage
 */
