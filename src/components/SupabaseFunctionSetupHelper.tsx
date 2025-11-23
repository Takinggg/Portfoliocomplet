/**
 * Supabase Function Setup Helper
 * Guide visuel pour crÃ©er la fonction Edge
 */

import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  ChevronRight,
  FileCode,
  Server
} from "lucide-react";

export function SupabaseFunctionSetupHelper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      const response = await fetch('/DEPLOYER_COMPLET_TOUTES_FONCTIONNALITES.txt');
      const code = await response.text();
      await navigator.clipboard.writeText(code);
      setCodeCopied(true);
      setCurrentStep(1);
      setTimeout(() => setCodeCopied(false), 3000);
    } catch (error) {
      alert("Erreur lors de la copie. Copiez manuellement depuis /DEPLOYER_COMPLET_TOUTES_FONCTIONNALITES.txt");
    }
  };

  const handleOpenDashboard = () => {
    window.open(
      'https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions',
      '_blank'
    );
    setCurrentStep(2);
  };

  const steps = [
    {
      id: 0,
      title: "Copier le Code du Serveur",
      description: "Copiez le code complet dans votre presse-papier",
      icon: Copy,
      action: handleCopyCode,
      actionText: codeCopied ? "Code CopiÃ© !" : "Copier le Code",
      actionVariant: codeCopied ? "success" : "default"
    },
    {
      id: 1,
      title: "Ouvrir Supabase Dashboard",
      description: "AccÃ©dez Ã  la page Edge Functions de votre projet",
      icon: ExternalLink,
      action: handleOpenDashboard,
      actionText: "Ouvrir Dashboard",
      actionVariant: "default"
    },
    {
      id: 2,
      title: "CrÃ©er la Fonction",
      description: "Instructions dÃ©taillÃ©es ci-dessous",
      icon: FileCode,
      action: () => {},
      actionText: "",
      actionVariant: "default"
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 p-6">
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <Server className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg text-white font-medium mb-1">
            ðŸ†• CrÃ©er la Fonction Edge sur Supabase
          </h3>
          <p className="text-sm text-white/60">
            La fonction n'existe pas encore dans votre projet. Suivez ces Ã©tapes :
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-6">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`p-4 rounded-lg border transition-all ${
              currentStep === index
                ? "bg-blue-500/10 border-blue-500/30"
                : currentStep > index
                ? "bg-green-500/10 border-green-500/20"
                : "bg-white/5 border-white/10"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                currentStep > index
                  ? "bg-green-500/20"
                  : currentStep === index
                  ? "bg-blue-500/20"
                  : "bg-white/5"
              }`}>
                {currentStep > index ? (
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                ) : (
                  <step.icon className={`h-4 w-4 ${
                    currentStep === index ? "text-blue-400" : "text-white/40"
                  }`} />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-white">
                    {index + 1}. {step.title}
                  </h4>
                  {currentStep === index && (
                    <ChevronRight className="h-4 w-4 text-blue-400 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-white/60 mb-2">
                  {step.description}
                </p>
                
                {step.actionText && currentStep >= index && (
                  <Button
                    onClick={step.action}
                    size="sm"
                    className={`${
                      codeCopied && step.id === 0
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                  >
                    {step.actionText}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Instructions */}
      {currentStep >= 2 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-3">
              <h4 className="text-sm font-medium text-yellow-200">
                Dans le Dashboard Supabase :
              </h4>
              
              <ol className="text-xs text-yellow-200/80 space-y-2 list-decimal list-inside">
                <li>
                  Cliquez le bouton <strong>"+ New Function"</strong> (vert, en haut Ã  droite)
                </li>
                <li>
                  Dans le modal :
                  <ul className="ml-6 mt-1 space-y-1 list-disc list-inside">
                    <li><strong>Name</strong> : <code className="bg-white/10 px-1 rounded">make-server-04919ac5</code> (exactement !)</li>
                    <li><strong>Verify JWT</strong> : DÃ©cochez</li>
                  </ul>
                </li>
                <li>Cliquez <strong>"Create function"</strong></li>
                <li>Dans l'Ã©diteur : <strong>SUPPRIMEZ</strong> tout le code exemple</li>
                <li><strong>COLLEZ</strong> le code que vous avez copiÃ© (Ctrl+V)</li>
                <li>Cliquez <strong>"Deploy"</strong> (bouton vert)</li>
                <li>Attendez 30-60 secondes</li>
                <li>Revenez ici et cliquez <strong>"RafraÃ®chir le serveur"</strong></li>
              </ol>

              <div className="pt-2 border-t border-yellow-500/20">
                <p className="text-xs text-yellow-200/60">
                  ðŸ’¡ <strong>Astuce :</strong> Si vous voyez "Function already exists", 
                  cliquez sur la fonction existante, puis "Edit" pour la mettre Ã  jour.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guide Link */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-white/40">
          ðŸ“– <strong>Guide dÃ©taillÃ© :</strong>{" "}
          <a 
            href="/CREER_FONCTION_SUPABASE_GUIDE.md" 
            target="_blank"
            className="text-[#CCFF00] hover:underline"
          >
            CREER_FONCTION_SUPABASE_GUIDE.md
          </a>
        </p>
      </div>
    </Card>
  );
}
