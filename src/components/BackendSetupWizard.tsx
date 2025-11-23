import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle,
  Circle,
  Server,
  Database,
  Rocket,
  Terminal,
  Copy,
  ExternalLink,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { checkServerAvailability } from "../utils/serverService";

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
  action?: () => void;
  command?: string;
  url?: string;
}

export function BackendSetupWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [serverStatus, setServerStatus] = useState<"checking" | "available" | "unavailable">("checking");

  useEffect(() => {
    checkServer();
    
    // Auto-ouvrir si le serveur n'est pas disponible et que c'est la premiÃ¨re visite
    const hasSeenWizard = localStorage.getItem("hasSeenBackendWizard");
    if (!hasSeenWizard) {
      setTimeout(() => {
        checkServer().then((isAvailable) => {
          if (!isAvailable) {
            setIsOpen(true);
          }
        });
      }, 2000);
    }
  }, []);

  const checkServer = async () => {
    setServerStatus("checking");
    const isAvailable = await checkServerAvailability();
    setServerStatus(isAvailable ? "available" : "unavailable");
    return isAvailable;
  };

  const copyToClipboard = async (text: string) => {
    const { copyToClipboard: copy } = await import("../utils/clipboardHelper");
    await copy(text, "CopiÃ© !");
  };

  const markAsComplete = () => {
    localStorage.setItem("hasSeenBackendWizard", "true");
    setIsOpen(false);
    toast.success("Configuration terminÃ©e !", {
      description: "Vous pouvez toujours rouvrir ce guide depuis le dashboard",
    });
  };

  const steps: SetupStep[] = [
    {
      id: "install",
      title: "Installer Supabase CLI",
      description: "Installez l'outil en ligne de commande Supabase",
      icon: Terminal,
      completed: false,
      command: "npm install -g supabase",
    },
    {
      id: "login",
      title: "Se connecter Ã  Supabase",
      description: "Connectez-vous Ã  votre compte Supabase",
      icon: Server,
      completed: false,
      command: "supabase login",
    },
    {
      id: "deploy",
      title: "DÃ©ployer le serveur",
      description: "DÃ©ployez la fonction Edge sur Supabase",
      icon: Rocket,
      completed: false,
      command: "./deploy-server.sh",
    },
    {
      id: "verify",
      title: "VÃ©rifier le dÃ©ploiement",
      description: "Testez que le serveur fonctionne correctement",
      icon: CheckCircle,
      completed: serverStatus === "available",
      url: "https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health",
      action: checkServer,
    },
  ];

  if (!isOpen && serverStatus === "available") {
    return null;
  }

  return (
    <>
      {/* Trigger Button */}
      {!isOpen && serverStatus === "unavailable" && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 bg-[#CCFF00] text-[#0C0C0C] px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 z-40"
        >
          <Server className="h-4 w-4" />
          <span className="text-sm font-medium">Configurer le backend</span>
        </motion.button>
      )}

      {/* Wizard Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl"
            >
              <Card className="bg-[#0C0C0C] border-white/10 p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Server className="h-6 w-6 text-[#CCFF00]" />
                      <h2 className="text-2xl text-white">Configuration du Backend</h2>
                    </div>
                    <p className="text-white/60 text-sm">
                      Suivez ces Ã©tapes pour connecter votre blog au backend Supabase
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/40 hover:text-white/60 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="mb-6">
                  <Badge
                    className={
                      serverStatus === "available"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : serverStatus === "checking"
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                    }
                  >
                    {serverStatus === "available"
                      ? "âœ… Serveur connectÃ©"
                      : serverStatus === "checking"
                      ? "ðŸ” VÃ©rification..."
                      : "âš ï¸ Serveur non disponible (mode local actif)"}
                  </Badge>
                </div>

                {/* Steps */}
                <div className="space-y-4 mb-6">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = step.completed;

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border transition-all ${
                          isActive
                            ? "bg-[#CCFF00]/5 border-[#CCFF00]/30"
                            : isCompleted
                            ? "bg-green-500/5 border-green-500/30"
                            : "bg-white/5 border-white/10"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div
                            className={`p-2 rounded-lg ${
                              isCompleted
                                ? "bg-green-500/20"
                                : isActive
                                ? "bg-[#CCFF00]/20"
                                : "bg-white/5"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : (
                              <Icon
                                className={`h-5 w-5 ${
                                  isActive ? "text-[#CCFF00]" : "text-white/40"
                                }`}
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white/40 text-sm">Ã‰tape {index + 1}</span>
                              <h3 className="text-white">{step.title}</h3>
                            </div>
                            <p className="text-white/60 text-sm mb-3">{step.description}</p>

                            {/* Command */}
                            {step.command && (
                              <div className="bg-black/50 border border-white/10 rounded-lg p-3 font-mono text-sm mb-2">
                                <div className="flex items-center justify-between">
                                  <code className="text-[#CCFF00]">{step.command}</code>
                                  <button
                                    onClick={() => copyToClipboard(step.command!)}
                                    className="text-white/40 hover:text-white/60 transition-colors"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* URL */}
                            {step.url && (
                              <a
                                href={step.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-[#CCFF00] text-sm hover:underline"
                              >
                                Ouvrir dans le navigateur
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}

                            {/* Action */}
                            {step.action && !isCompleted && (
                              <Button
                                size="sm"
                                onClick={step.action}
                                className="bg-[#CCFF00] text-[#0C0C0C] hover:bg-[#CCFF00]/90 mt-2"
                              >
                                VÃ©rifier
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <Button
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="text-white/60 hover:text-white"
                  >
                    Fermer
                  </Button>
                  <div className="flex items-center gap-2">
                    {serverStatus === "available" && (
                      <Button
                        onClick={markAsComplete}
                        className="bg-[#CCFF00] text-[#0C0C0C] hover:bg-[#CCFF00]/90"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        TerminÃ©
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

