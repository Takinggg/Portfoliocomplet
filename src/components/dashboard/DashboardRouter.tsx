import { Mail } from "lucide-react";
import { Button } from "../ui/button";
import EmailSettings from "./EmailSettings";

interface DashboardRouterProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function DashboardRouter({ currentView, onViewChange }: DashboardRouterProps) {
  // Rendu conditionnel pour la vue Emails
  if (currentView === "emails") {
    return <EmailSettings />;
  }
  
  // Pour les autres vues, retourne null et laisse le composant parent gÃ©rer
  return null;
}

// Bouton de menu pour les emails (Ã  ajouter dans la navigation)
export function EmailsMenuButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={`w-full justify-start ${
        active
          ? "bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
          : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
      }`}
    >
      <Mail className="h-5 w-5 mr-3" />
      Emails
    </Button>
  );
}
