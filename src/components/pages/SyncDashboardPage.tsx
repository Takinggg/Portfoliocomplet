/**
 * Sync Dashboard Page - Page de gestion de la synchronisation Supabase
 * Permet de synchroniser toutes les données et gérer le mode production
 */

import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Database,
  Server,
  HardDrive,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Settings,
  AlertTriangle,
  FileText,
  Users,
  Briefcase,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Download
} from "lucide-react";
import { FullSyncButton } from "../FullSyncButton";
import { getServerMode } from "../../utils/serverService";
import { projectId } from "../../utils/supabase/info";

interface DataStatus {
  category: string;
  icon: any;
  description: string;
  count?: number;
  synced: boolean;
}

export default function SyncDashboardPage() {
  const [serverMode, setServerMode] = useState<string>("checking");
  const [dataStatus, setDataStatus] = useState<DataStatus[]>([
    { 
      category: "Projects", 
      icon: Briefcase, 
      description: "Projets du portfolio",
      count: 0,
      synced: false 
    },
    { 
      category: "Blog Posts", 
      icon: FileText, 
      description: "Articles de blog",
      count: 0,
      synced: false 
    },
    { 
      category: "Case Studies", 
      icon: BookOpen, 
      description: "Études de cas détaillées",
      count: 0,
      synced: false 
    },
    { 
      category: "FAQs", 
      icon: HelpCircle, 
      description: "Questions fréquentes",
      count: 0,
      synced: false 
    },
    { 
      category: "Testimonials", 
      icon: MessageSquare, 
      description: "Témoignages clients",
      count: 0,
      synced: false 
    },
    { 
      category: "Resources", 
      icon: Download, 
      description: "Ressources gratuites",
      count: 0,
      synced: false 
    }
  ]);

  useEffect(() => {
    const mode = getServerMode();
    setServerMode(mode);
  }, []);

  const refreshStatus = () => {
    const mode = getServerMode();
    setServerMode(mode);
    // TODO: Fetch real counts from server
  };

  const totalItems = dataStatus.reduce((sum, item) => sum + (item.count || 0), 0);
  const syncedItems = dataStatus.filter(item => item.synced).length;

  return (
    <div className="min-h-screen bg-[#0C0C0C] py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge 
            className="bg-[#00FFC2]/10 text-[#00FFC2] border-[#00FFC2]/30"
          >
            <Database className="w-3 h-3 mr-1" />
            Synchronisation Supabase
          </Badge>
          
          <h1 className="text-5xl text-[#F4F4F4]">
            Gestion des Données
          </h1>
          
          <p className="text-xl text-[#F4F4F4]/70 max-w-2xl mx-auto">
            Synchronisez toutes vos données avec Supabase pour une expérience
            100% production sans dépendances locales.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Server Status */}
          <Card className="bg-[#0C0C0C] border-[#00FFC2]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <Server className="w-8 h-8 text-[#00FFC2]" />
              <Badge 
                className={
                  serverMode === "server"
                    ? "bg-[#00FFC2]/10 text-[#00FFC2] border-[#00FFC2]/30"
                    : "bg-orange-500/10 text-orange-500 border-orange-500/30"
                }
              >
                {serverMode === "server" ? "Connecté" : "Mode Local"}
              </Badge>
            </div>
            <h3 className="text-lg text-[#F4F4F4] mb-2">
              Statut Serveur
            </h3>
            <p className="text-sm text-[#F4F4F4]/60">
              {serverMode === "server" 
                ? "Serveur Supabase opérationnel"
                : "En attente de connexion"
              }
            </p>
            <div className="mt-4 pt-4 border-t border-[#F4F4F4]/10">
              <p className="text-xs text-[#F4F4F4]/40 break-all">
                {projectId}.supabase.co
              </p>
            </div>
          </Card>

          {/* Data Count */}
          <Card className="bg-[#0C0C0C] border-[#00FFC2]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <HardDrive className="w-8 h-8 text-[#00FFC2]" />
              <div className="text-right">
                <div className="text-2xl text-[#F4F4F4]">
                  {totalItems}
                </div>
                <div className="text-xs text-[#F4F4F4]/60">
                  éléments
                </div>
              </div>
            </div>
            <h3 className="text-lg text-[#F4F4F4] mb-2">
              Données Totales
            </h3>
            <p className="text-sm text-[#F4F4F4]/60">
              Contenus synchronisés
            </p>
          </Card>

          {/* Sync Status */}
          <Card className="bg-[#0C0C0C] border-[#00FFC2]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <Database className="w-8 h-8 text-[#00FFC2]" />
              <div className="text-right">
                <div className="text-2xl text-[#F4F4F4]">
                  {syncedItems}/{dataStatus.length}
                </div>
                <div className="text-xs text-[#F4F4F4]/60">
                  catégories
                </div>
              </div>
            </div>
            <h3 className="text-lg text-[#F4F4F4] mb-2">
              Synchronisation
            </h3>
            <p className="text-sm text-[#F4F4F4]/60">
              État de la migration
            </p>
          </Card>
        </div>

        {/* Warning Alert */}
        {serverMode !== "server" && (
          <Alert className="bg-orange-500/10 border-orange-500/30">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <AlertTitle className="text-[#F4F4F4]">
              ⚠️ Mode Local Actif
            </AlertTitle>
            <AlertDescription className="text-[#F4F4F4]/70">
              L'application utilise actuellement des données locales. Synchronisez
              avec Supabase pour activer le mode production.
            </AlertDescription>
          </Alert>
        )}

        {/* Data Categories Status */}
        <Card className="bg-[#0C0C0C] border-[#00FFC2]/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-[#F4F4F4]">
              Catégories de Données
            </h2>
            <Button
              onClick={refreshStatus}
              variant="outline"
              size="sm"
              className="bg-[#F4F4F4]/5 hover:bg-[#F4F4F4]/10 text-[#F4F4F4] border-[#F4F4F4]/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {dataStatus.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-[#F4F4F4]/5 rounded-lg border border-[#F4F4F4]/10"
                >
                  <div className={`p-3 rounded-lg ${
                    item.synced 
                      ? "bg-[#00FFC2]/10" 
                      : "bg-[#F4F4F4]/5"
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      item.synced 
                        ? "text-[#00FFC2]" 
                        : "text-[#F4F4F4]/40"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#F4F4F4]">
                        {item.category}
                      </span>
                      {item.synced ? (
                        <CheckCircle2 className="w-4 h-4 text-[#00FFC2]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#F4F4F4]/30" />
                      )}
                    </div>
                    <p className="text-xs text-[#F4F4F4]/60">
                      {item.description}
                    </p>
                  </div>
                  {item.count !== undefined && (
                    <div className="text-right">
                      <div className="text-lg text-[#F4F4F4]">
                        {item.count}
                      </div>
                      <div className="text-xs text-[#F4F4F4]/40">
                        items
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Sync Actions */}
        <FullSyncButton />

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Production Mode Info */}
          <Card className="bg-[#0C0C0C] border-[#00FFC2]/20 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#00FFC2]/10 rounded-lg">
                <Settings className="w-6 h-6 text-[#00FFC2]" />
              </div>
              <div>
                <h3 className="text-lg text-[#F4F4F4] mb-2">
                  Mode Production
                </h3>
                <p className="text-sm text-[#F4F4F4]/70 mb-3">
                  Le système est configuré pour fonctionner en mode production.
                  Toutes les requêtes utilisent exclusivement le serveur Supabase.
                </p>
                <ul className="text-sm text-[#F4F4F4]/60 space-y-1">
                  <li>✓ Pas de fallback localStorage</li>
                  <li>✓ Erreurs visibles en console</li>
                  <li>✓ Performance optimale</li>
                  <li>✓ Données centralisées</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="bg-[#0C0C0C] border-[#00FFC2]/20 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#00FFC2]/10 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-[#00FFC2]" />
              </div>
              <div>
                <h3 className="text-lg text-[#F4F4F4] mb-2">
                  Prochaines Étapes
                </h3>
                <ol className="text-sm text-[#F4F4F4]/70 space-y-2 list-decimal list-inside">
                  <li>Valider le déploiement du serveur</li>
                  <li>Synchroniser toutes les données</li>
                  <li>Vérifier les endpoints dans la console</li>
                  <li>Recharger l'application</li>
                  <li>Tester toutes les fonctionnalités</li>
                </ol>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
