import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

/**
 * Composant ultra-léger pour afficher l'état du serveur
 * Parfait pour ajouter dans le header, footer, ou n'importe où
 */
export function QuickServerStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    checkServer();
    // Re-check toutes les 60 secondes
    const interval = setInterval(checkServer, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkServer = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
          signal: AbortSignal.timeout(5000),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStatus("online");
        setVersion(data.version || "");
      } else {
        setStatus("offline");
      }
    } catch (error) {
      setStatus("offline");
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "offline":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "checking":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-3 w-3" />;
      case "offline":
        return <XCircle className="h-3 w-3" />;
      case "checking":
        return <Loader2 className="h-3 w-3 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "online":
        return version ? `Serveur OK (${version})` : "Serveur OK";
      case "offline":
        return "Mode Local";
      case "checking":
        return "Vérification...";
    }
  };

  const handleClick = () => {
    window.open(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
      "_blank"
    );
  };

  return (
    <Badge
      className={`${getStatusColor()} cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2`}
      onClick={handleClick}
      title="Cliquez pour tester le serveur"
    >
      {getStatusIcon()}
      <span className="text-xs">{getStatusText()}</span>
      <ExternalLink className="h-2.5 w-2.5 opacity-60" />
    </Badge>
  );
}
