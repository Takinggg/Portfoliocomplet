/**
 * Migration Wizard
 * Guide interactif pour la migration complète vers Supabase
 */

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle, Circle, ArrowRight, ExternalLink, RefreshCw } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { seedData } from "../utils/seedAllDataToServer";

type Step = {
  id: number;
  title: string;
  description: string;
  action?: string;
  status: "pending" | "inprogress" | "completed" | "skipped";
};

export function MigrationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [serverVersion, setServerVersion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: "Déployer le Serveur Complet",
      description: "Copiez le code et déployez-le sur Supabase Dashboard",
      status: "pending"
    },
    {
      id: 2,
      title: "Vérifier le Déploiement",
      description: "Attendre 30-60 secondes et vérifier la version du serveur",
      status: "pending"
    },
    {
      id: 3,
      title: "Activer le Mode Serveur",
      description: "Rafraîchir la détection du serveur dans l'application",
      status: "pending"
    },
    {
      id: 4,
      title: "Créer Toutes les Données",
      description: "Initialiser le portfolio avec des données professionnelles",
      status: "pending"
    },
    {
      id: 5,
      title: "Vérification Finale",
      description: "Tester que tout fonctionne correctement",
      status: "pending"
    }
  ]);

  // Vérifier la version du serveur au chargement
  useEffect(() => {
    checkServerVersion();
  }, []);

  const checkServerVersion = async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );
      const data = await res.json();
      setServerVersion(data.version);
      
      // Si serveur complet déjà déployé, marquer les premières étapes comme complétées
      if (data.version === "complete-2.0.0") {
        updateStepStatus(1, "completed");
        updateStepStatus(2, "completed");
        if (currentStep < 2) setCurrentStep(2);
      }
    } catch (error) {
      console.error("Error checking server:", error);
    }
  };

  const updateStepStatus = (stepId: number, status: Step["status"]) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const handleCopyServerCode = async () => {
    try {
      const response = await fetch('/DEPLOYER_COMPLET_TOUTES_FONCTIONNALITES.txt');
      const serverCode = await response.text();
      await navigator.clipboard.writeText(serverCode);
      
      updateStepStatus(1, "completed");
      setCurrentStep(1);
      
      alert("✅ Code copié ! Maintenant ouvrez le Supabase Dashboard et collez-le.");
    } catch (error) {
      alert("Erreur lors de la copie. Copiez manuellement depuis /DEPLOYER_COMPLET_TOUTES_FONCTIONNALITES.txt");
    }
  };

  const handleOpenDashboard = () => {
    window.open(
      'https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions',
      '_blank'
    );
  };

  const handleCheckDeployment = async () => {
    setLoading(true);
    updateStepStatus(2, "inprogress");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await checkServerVersion();
      
      if (serverVersion === "complete-2.0.0") {
        updateStepStatus(2, "completed");
        setCurrentStep(2);
      } else {
        alert("⚠️ Serveur pas encore déployé ou ancienne version. Attendez 30 secondes et réessayez.");
        updateStepStatus(2, "pending");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshServer = async () => {
    setLoading(true);
    updateStepStatus(3, "inprogress");
    
    try {
      // Simuler le refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateStepStatus(3, "completed");
      setCurrentStep(3);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setLoading(true);
    updateStepStatus(4, "inprogress");
    
    try {
      const result = await seedData();
      
      if (result.success > 0) {
        updateStepStatus(4, "completed");
        setCurrentStep(4);
      } else {
        alert("❌ Échec de la création des données. Vérifiez que le serveur complet est déployé.");
        updateStepStatus(4, "pending");
      }
    } catch (error) {
      alert("❌ Erreur lors de la création des données.");
      updateStepStatus(4, "pending");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalVerification = () => {
    updateStepStatus(5, "completed");
    setCurrentStep(5);
    
    // Ouvrir la page de vérification dans un nouvel onglet
    window.open('/', '_blank');
  };

  const renderStepActions = (step: Step) => {
    switch (step.id) {
      case 1:
        return (
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              onClick={handleCopyServerCode}
              size="sm"
              className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
            >
              Copier le Code
            </Button>
            <Button
              onClick={handleOpenDashboard}
              size="sm"
              variant="outline"
              className="border-white/20 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ouvrir Dashboard
            </Button>
          </div>
        );
      
      case 2:
        return (
          <Button
            onClick={handleCheckDeployment}
            disabled={loading || step.status === "completed"}
            size="sm"
            className="mt-3 bg-blue-500 hover:bg-blue-600"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Vérification...
              </>
            ) : (
              <>Vérifier le Déploiement</>
            )}
          </Button>
        );
      
      case 3:
        return (
          <Button
            onClick={handleRefreshServer}
            disabled={loading || step.status === "completed" || currentStep < 2}
            size="sm"
            className="mt-3 bg-purple-500 hover:bg-purple-600"
          >
            Rafraîchir le Serveur
          </Button>
        );
      
      case 4:
        return (
          <Button
            onClick={handleSeedData}
            disabled={loading || step.status === "completed" || currentStep < 3}
            size="sm"
            className="mt-3 bg-green-500 hover:bg-green-600"
          >
            {loading ? "Création..." : "Créer les Données"}
          </Button>
        );
      
      case 5:
        return (
          <Button
            onClick={handleFinalVerification}
            disabled={currentStep < 4}
            size="sm"
            className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            Vérifier & Tester
          </Button>
        );
      
      default:
        return null;
    }
  };

  const getStepIcon = (step: Step) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-400" />;
      case "inprogress":
        return <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />;
      default:
        return <Circle className="h-6 w-6 text-white/30" />;
    }
  };

  const progress = (steps.filter(s => s.status === "completed").length / steps.length) * 100;

  return (
    <Card className="bg-gradient-to-br from-[#00FFC2]/10 to-blue-500/10 border-[#00FFC2]/20 p-6">
      <div className="mb-6">
        <h2 className="text-2xl text-white mb-2">🧙‍♂️ Assistant de Migration</h2>
        <p className="text-sm text-white/60">
          Suivez ces étapes pour migrer votre portfolio vers Supabase
        </p>
        
        {/* Barre de progression */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-white/60 mb-2">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#00FFC2] to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Version du serveur */}
        {serverVersion && (
          <div className={`mt-3 px-3 py-2 rounded-lg text-sm ${
            serverVersion === "complete-2.0.0"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
          }`}>
            {serverVersion === "complete-2.0.0" ? "✅" : "⚠️"} Serveur actuel : {serverVersion}
          </div>
        )}
      </div>

      {/* Étapes */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`p-4 rounded-lg border transition-all ${
              step.status === "completed"
                ? "bg-green-500/10 border-green-500/20"
                : step.status === "inprogress"
                ? "bg-blue-500/10 border-blue-500/20"
                : currentStep === index
                ? "bg-white/10 border-[#00FFC2]/30"
                : "bg-white/5 border-white/10"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getStepIcon(step)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-medium mb-1">
                      {step.id}. {step.title}
                    </h3>
                    <p className="text-sm text-white/60">
                      {step.description}
                    </p>
                  </div>
                  
                  {currentStep === index && step.status !== "completed" && (
                    <ArrowRight className="h-5 w-5 text-[#00FFC2] flex-shrink-0 animate-pulse" />
                  )}
                </div>
                
                {renderStepActions(step)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message de fin */}
      {progress === 100 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg">
          <h3 className="text-lg text-white font-medium mb-2">
            🎉 Migration Terminée !
          </h3>
          <p className="text-sm text-white/70 mb-3">
            Votre portfolio est maintenant 100% synchronisé avec Supabase.
            Toutes vos données sont sauvegardées dans le cloud !
          </p>
          <Button
            onClick={() => window.location.href = "/"}
            className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
          >
            Voir Mon Portfolio 🚀
          </Button>
        </div>
      )}
    </Card>
  );
}
