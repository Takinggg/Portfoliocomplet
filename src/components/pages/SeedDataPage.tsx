/**
 * PAGE D'ADMINISTRATION - Seeding de Données de Test
 * 
 * Cette page permet de:
 * ✅ Créer des projets de test bilingues
 * ✅ Voir les projets existants
 * ✅ Supprimer tous les projets
 * ✅ Vérifier la connexion Supabase
 */

import React, { useState, useEffect } from "react";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { motion } from "motion/react";
import { 
  Database, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Eye,
  Package,
  Sparkles
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import * as unifiedService from "../../utils/unifiedDataService";
import { seedTestProjects, clearTestProjects, TEST_PROJECTS } from "../../utils/seedTestProjects";
import { createClient } from "../../utils/supabase/client";

export default function SeedDataPage() {
  const { language } = useTranslation();
  const isFr = language === "fr";

  const [projects, setProjects] = useState<unifiedService.BilingualProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [autoDetected, setAutoDetected] = useState(false);

  // ✅ Auto-detect token from session
  useEffect(() => {
    const loadSessionToken = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        setAccessToken(session.access_token);
        setAutoDetected(true);
        console.log("✅ Token auto-détecté depuis la session");
      } else {
        console.log("⚠️ Aucune session active - connexion requise");
      }
    };
    
    loadSessionToken();
    checkConnection();
    loadProjects();
  }, []);

  const checkConnection = async () => {
    const connected = await unifiedService.checkServerConnection();
    setIsConnected(connected);
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await unifiedService.fetchProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error(isFr ? "Erreur de chargement" : "Loading error");
    } finally {
      setLoading(false);
    }
  };

  const handleSeedProjects = async () => {
    if (!accessToken) {
      toast.error(isFr ? "Session expirée. Veuillez vous reconnecter au Dashboard." : "Session expired. Please log in to Dashboard.");
      return;
    }

    setSeeding(true);
    try {
      console.log("🌱 Début du seeding des projets...");
      await seedTestProjects(accessToken);
      toast.success(isFr ? "✅ 6 projets créés avec succès !" : "✅ 6 projects created successfully!");
      await loadProjects();
    } catch (error: any) {
      console.error("❌ Error seeding projects:", error);
      toast.error(isFr ? `Erreur: ${error.message}` : `Error: ${error.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const handleClearProjects = async () => {
    if (!accessToken) {
      toast.error(isFr ? "Session expirée. Veuillez vous reconnecter au Dashboard." : "Session expired. Please log in to Dashboard.");
      return;
    }

    if (!confirm(isFr 
      ? "⚠️ ATTENTION: Cela va supprimer TOUS les projets. Continuer ?" 
      : "⚠️ WARNING: This will delete ALL projects. Continue?")) {
      return;
    }

    setClearing(true);
    try {
      console.log("🗑️ Suppression de tous les projets...");
      await clearTestProjects(accessToken);
      toast.success(isFr ? "✅ Tous les projets ont été supprimés" : "✅ All projects deleted");
      await loadProjects();
    } catch (error: any) {
      console.error("❌ Error clearing projects:", error);
      toast.error(isFr ? `Erreur: ${error.message}` : `Error: ${error.message}`);
    } finally {
      setClearing(false);
    }
  };

  const t = {
    title: isFr ? "Gestion des Données de Test" : "Test Data Management",
    subtitle: isFr 
      ? "Créez et gérez des projets de test pour votre portfolio bilingue"
      : "Create and manage test projects for your bilingual portfolio",
    connectionStatus: isFr ? "Statut de connexion" : "Connection status",
    connected: isFr ? "Connecté à Supabase" : "Connected to Supabase",
    disconnected: isFr ? "Déconnecté" : "Disconnected",
    reconnect: isFr ? "Reconnecter" : "Reconnect",
    sessionStatus: isFr ? "Statut de session" : "Session status",
    sessionActive: isFr ? "Session active détectée" : "Active session detected",
    sessionInactive: isFr ? "Aucune session - Connexion requise" : "No session - Login required",
    goToDashboard: isFr ? "Se connecter au Dashboard" : "Go to Dashboard",
    currentProjects: isFr ? "Projets actuels" : "Current projects",
    projectCount: (count: number) => isFr ? `${count} projet(s)` : `${count} project(s)`,
    testProjects: isFr ? "Projets de test disponibles" : "Available test projects",
    testProjectsDesc: isFr 
      ? "Ces 6 projets professionnels bilingues seront créés dans votre database Supabase"
      : "These 6 professional bilingual projects will be created in your Supabase database",
    seedButton: isFr ? "🚀 Créer 6 projets professionnels" : "🚀 Create 6 professional projects",
    seedButtonDesc: isFr ? "Projets bilingues complets avec images" : "Complete bilingual projects with images",
    clearButton: isFr ? "🗑️ Supprimer tous les projets" : "🗑️ Delete all projects",
    clearButtonDesc: isFr ? "Action irréversible" : "Irreversible action",
    refreshButton: isFr ? "Actualiser" : "Refresh",
    loading: isFr ? "Chargement..." : "Loading...",
    seeding: isFr ? "Création en cours..." : "Creating...",
    clearing: isFr ? "Suppression en cours..." : "Deleting...",
    noProjects: isFr ? "Aucun projet pour le moment" : "No projects yet",
    viewDetails: isFr ? "Voir les détails" : "View details"
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-8 h-8 text-[#00FFC2]" />
            <h1 className="text-[#00FFC2]">{t.title}</h1>
          </div>
          <p className="text-gray-400 mb-6">{t.subtitle}</p>

          {/* Connection Status */}
          <Alert className={`mb-6 ${isConnected ? 'border-[#00FFC2]/20 bg-[#00FFC2]/5' : 'border-red-500/20 bg-red-500/5'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-[#00FFC2]" : "bg-red-500"} animate-pulse`} />
                <AlertDescription className="text-[#F4F4F4]">
                  {t.connectionStatus}: {isConnected ? t.connected : t.disconnected}
                </AlertDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  checkConnection();
                  loadProjects();
                }}
                className="text-[#00FFC2] hover:bg-[#00FFC2]/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t.reconnect}
              </Button>
            </div>
          </Alert>

          {/* Session Status */}
          <Alert className={`mb-6 ${autoDetected ? 'border-[#00FFC2]/20 bg-[#00FFC2]/5' : 'border-yellow-500/20 bg-yellow-500/5'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {autoDetected ? (
                  <CheckCircle2 className="w-5 h-5 text-[#00FFC2]" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
                <AlertDescription className="text-[#F4F4F4]">
                  {t.sessionStatus}: {autoDetected ? t.sessionActive : t.sessionInactive}
                </AlertDescription>
              </div>
              {!autoDetected && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = "/dashboard"}
                  className="text-[#00FFC2] hover:bg-[#00FFC2]/10"
                >
                  {t.goToDashboard}
                </Button>
              )}
            </div>
          </Alert>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Actions */}
          <div>
            {/* Actions */}
            <Card className="bg-[#1A1A1A] border-gray-800 p-6 mb-6">
              <h3 className="mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00FFC2]" />
                {isFr ? "Actions rapides" : "Quick actions"}
              </h3>
              <div className="space-y-4">
                <div>
                  <Button
                    onClick={handleSeedProjects}
                    disabled={seeding || !accessToken || !isConnected}
                    className="w-full bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90 mb-2"
                  >
                    {seeding ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t.seeding}
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        {t.seedButton}
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-gray-500 text-center">{t.seedButtonDesc}</p>
                </div>

                <div>
                  <Button
                    onClick={handleClearProjects}
                    disabled={clearing || !accessToken || projects.length === 0}
                    variant="outline"
                    className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10 mb-2"
                  >
                    {clearing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t.clearing}
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t.clearButton}
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-gray-500 text-center">{t.clearButtonDesc}</p>
                </div>
              </div>
            </Card>

            {/* Test Projects Preview */}
            <Card className="bg-[#1A1A1A] border-gray-800 p-6">
              <h3 className="mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#00FFC2]" />
                {t.testProjects}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{t.testProjectsDesc}</p>
              <div className="space-y-2">
                {TEST_PROJECTS.map((project, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#00FFC2]" />
                    <span className="text-gray-300">
                      {isFr ? project.name_fr : project.name_en}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Current Projects */}
          <div>
            <Card className="bg-[#1A1A1A] border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#00FFC2]" />
                  {t.currentProjects}
                </h3>
                <Badge variant="outline" className="border-[#00FFC2]/30 text-[#00FFC2]">
                  {t.projectCount(projects.length)}
                </Badge>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  {t.loading}
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">{t.noProjects}</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-[#0C0C0C] border border-gray-800 rounded-lg p-4 hover:border-[#00FFC2]/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-[#F4F4F4] mb-2">
                            {isFr ? project.name_fr : project.name_en}
                          </h4>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                            {isFr ? project.description_fr : project.description_en}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-[#00FFC2]/20">
                              {project.status}
                            </Badge>
                            {project.category_fr && (
                              <Badge variant="outline" className="border-gray-700">
                                {isFr ? project.category_fr : project.category_en}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

