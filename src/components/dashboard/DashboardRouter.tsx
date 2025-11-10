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
  
  // Pour les autres vues, retourne null et laisse le composant parent gérer
  return null;
}

// Bouton de menu pour les emails (à ajouter dans la navigation)
export function EmailsMenuButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={`w-full justify-start ${
        active
          ? "bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
          : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
      }`}
    >
      <Mail className="h-5 w-5 mr-3" />
      Emails
    </Button>
  );
}
