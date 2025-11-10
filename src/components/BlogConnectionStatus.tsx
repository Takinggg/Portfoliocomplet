import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Server, Database, RefreshCw, CheckCircle, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { getCurrentMode, recheckServer } from "../utils/blogService";
import { checkServerAvailability } from "../utils/serverService";

export function BlogConnectionStatus() {
  const [mode, setMode] = useState<"server" | "local" | "checking">("checking");
  const [isChecking, setIsChecking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const isAvailable = await checkServerAvailability();
      setMode(isAvailable ? "server" : "local");
    } catch (error) {
      setMode("local");
    } finally {
      setIsChecking(false);
    }
  };

  const handleRecheck = () => {
    recheckServer();
    checkConnection();
  };

  const statusConfig = {
    server: {
      icon: Server,
      color: "#00FFC2",
      bgColor: "bg-[#00FFC2]/10",
      borderColor: "border-[#00FFC2]/30",
      label: "Connecté au serveur",
      description: "Les articles sont synchronisés avec la base de données",
    },
    local: {
      icon: Database,
      color: "#F59E0B",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      label: "Mode local",
      description: "Les articles sont stockés dans votre navigateur",
    },
    checking: {
      icon: RefreshCw,
      color: "#94A3B8",
      bgColor: "bg-white/5",
      borderColor: "border-white/10",
      label: "Vérification...",
      description: "Connexion au serveur en cours",
    },
  };

  const config = statusConfig[mode];
  const Icon = config.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <AnimatePresence>
        {showDetails ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-[#0C0C0C]/95 backdrop-blur-lg border-white/10 p-4 shadow-2xl">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${config.bgColor} border ${config.borderColor}`}
                    >
                      <Icon
                        className={`h-5 w-5 ${mode === "checking" ? "animate-spin" : ""}`}
                        style={{ color: config.color }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{config.label}</p>
                      <p className="text-xs text-white/60 mt-1">
                        {config.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-white/40 hover:text-white/60 transition-colors"
                  >
                    ×
                  </button>
                </div>

                {mode === "local" && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                    <p className="text-xs text-white/40">
                      Pour connecter au backend :
                    </p>
                    <ol className="text-xs text-white/60 space-y-1 pl-4 list-decimal">
                      <li>Déployer le serveur sur Supabase</li>
                      <li>Utiliser le bouton "Seed Blog" dans le dashboard</li>
                      <li>Rafraîchir cette page</li>
                    </ol>
                    <Button
                      size="sm"
                      onClick={handleRecheck}
                      disabled={isChecking}
                      className="w-full bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90 mt-2"
                    >
                      {isChecking ? (
                        <>
                          <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                          Vérification...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-3 w-3 mr-2" />
                          Vérifier la connexion
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {mode === "server" && (
                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <CheckCircle className="h-4 w-4 text-[#00FFC2]" />
                    <p className="text-xs text-white/60">
                      Tout fonctionne correctement
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setShowDetails(true)}
            className={`${config.bgColor} ${config.borderColor} border backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2`}
          >
            <Icon
              className={`h-4 w-4 ${mode === "checking" ? "animate-spin" : ""}`}
              style={{ color: config.color }}
            />
            <span className="text-sm font-medium text-white">
              {mode === "server" ? "Backend" : mode === "local" ? "Local" : "..."}
            </span>
            {mode === "local" && (
              <WifiOff className="h-3 w-3 text-amber-500" />
            )}
            {mode === "server" && (
              <Wifi className="h-3 w-3 text-[#00FFC2]" />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
