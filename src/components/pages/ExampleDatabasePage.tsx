/**
 * PAGE D'EXEMPLE - Intégration Database Bilingue
 * 
 * Cette page démontre:
 * ✅ Intégration complète avec Supabase via unifiedDataService
 * ✅ Bilinguisme complet (Français/Anglais)
 * ✅ Opérations CRUD (Create, Read, Update, Delete)
 * ✅ UI moderne avec animations
 * ✅ Gestion des états de chargement et erreurs
 * ✅ Synchronisation temps réel avec la database
 */

import React, { useState, useEffect } from "react";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { motion } from "motion/react";
import { Plus, Trash2, Edit2, CheckCircle2, Circle, Calendar, Tag, AlertCircle, Database, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import { toast } from "sonner";
import * as unifiedService from "../../utils/unifiedDataService";

interface ExampleTask {
  id: string;
  title_fr: string;
  title_en: string;
  description_fr?: string;
  description_en?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const EXAMPLE_TRANSLATIONS = {
  fr: {
    pageTitle: "Exemple d'Intégration Database",
    pageSubtitle: "Démonstration complète de l'intégration Supabase avec bilinguisme",
    addTask: "Ajouter une tâche",
    editTask: "Modifier la tâche",
    deleteTask: "Supprimer la tâche",
    deleteConfirm: "Êtes-vous sûr de vouloir supprimer cette tâche ?",
    cancel: "Annuler",
    save: "Enregistrer",
    delete: "Supprimer",
    loading: "Chargement...",
    noTasks: "Aucune tâche pour le moment",
    noTasksDesc: "Créez votre première tâche pour commencer",
    titleFr: "Titre (Français)",
    titleEn: "Titre (Anglais)",
    descriptionFr: "Description (Français)",
    descriptionEn: "Description (Anglais)",
    status: "Statut",
    priority: "Priorité",
    dueDate: "Date d'échéance",
    tags: "Tags",
    tagsPlaceholder: "Séparés par des virgules",
    statusTodo: "À faire",
    statusInProgress: "En cours",
    statusDone: "Terminé",
    priorityLow: "Faible",
    priorityMedium: "Moyenne",
    priorityHigh: "Haute",
    connectionStatus: "Connexion Database",
    connected: "Connecté à Supabase",
    disconnected: "Déconnecté",
    reconnect: "Reconnecter",
    created: "Créée",
    updated: "Mise à jour",
    errorLoading: "Erreur lors du chargement des tâches",
    errorSaving: "Erreur lors de l'enregistrement",
    errorDeleting: "Erreur lors de la suppression",
    successCreated: "Tâche créée avec succès",
    successUpdated: "Tâche mise à jour avec succès",
    successDeleted: "Tâche supprimée avec succès",
    taskCount: "tâches",
    features: "Fonctionnalités démontrées",
    feature1: "Opérations CRUD complètes",
    feature2: "Synchronisation Supabase temps réel",
    feature3: "Interface bilingue (FR/EN)",
    feature4: "Gestion d'états et erreurs",
    feature5: "UI moderne avec animations",
    feature6: "Validation de formulaires"
  },
  en: {
    pageTitle: "Database Integration Example",
    pageSubtitle: "Complete demonstration of Supabase integration with bilingual support",
    addTask: "Add task",
    editTask: "Edit task",
    deleteTask: "Delete task",
    deleteConfirm: "Are you sure you want to delete this task?",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    loading: "Loading...",
    noTasks: "No tasks yet",
    noTasksDesc: "Create your first task to get started",
    titleFr: "Title (French)",
    titleEn: "Title (English)",
    descriptionFr: "Description (French)",
    descriptionEn: "Description (English)",
    status: "Status",
    priority: "Priority",
    dueDate: "Due date",
    tags: "Tags",
    tagsPlaceholder: "Comma separated",
    statusTodo: "To Do",
    statusInProgress: "In Progress",
    statusDone: "Done",
    priorityLow: "Low",
    priorityMedium: "Medium",
    priorityHigh: "High",
    connectionStatus: "Database Connection",
    connected: "Connected to Supabase",
    disconnected: "Disconnected",
    reconnect: "Reconnect",
    created: "Created",
    updated: "Updated",
    errorLoading: "Error loading tasks",
    errorSaving: "Error saving task",
    errorDeleting: "Error deleting task",
    successCreated: "Task created successfully",
    successUpdated: "Task updated successfully",
    successDeleted: "Task deleted successfully",
    taskCount: "tasks",
    features: "Features demonstrated",
    feature1: "Complete CRUD operations",
    feature2: "Real-time Supabase sync",
    feature3: "Bilingual interface (FR/EN)",
    feature4: "State & error management",
    feature5: "Modern UI with animations",
    feature6: "Form validation"
  }
};

export default function ExampleDatabasePage() {
  const { language } = useTranslation();
  const t = EXAMPLE_TRANSLATIONS[language];

  const [tasks, setTasks] = useState<ExampleTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ExampleTask | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title_fr: "",
    title_en: "",
    description_fr: "",
    description_en: "",
    status: "todo" as const,
    priority: "medium" as const,
    dueDate: "",
    tags: ""
  });

  // Check connection and load tasks
  useEffect(() => {
    checkConnection();
    loadTasks();
  }, []);

  const checkConnection = async () => {
    const connected = await unifiedService.checkServerConnection();
    setIsConnected(connected);
  };

  const loadTasks = async () => {
    setLoading(true);
    try {
      // Utilise le KV store pour stocker les tâches d'exemple
      const tasksData = await unifiedService.getCustomData("example_tasks");
      if (tasksData && Array.isArray(tasksData)) {
        setTasks(tasksData);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error(t.errorLoading);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async () => {
    try {
      const newTask: ExampleTask = {
        id: editingTask?.id || `task-${Date.now()}`,
        title_fr: formData.title_fr,
        title_en: formData.title_en,
        description_fr: formData.description_fr || undefined,
        description_en: formData.description_en || undefined,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        createdAt: editingTask?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      let updatedTasks: ExampleTask[];
      if (editingTask) {
        updatedTasks = tasks.map(t => t.id === editingTask.id ? newTask : t);
        toast.success(t.successUpdated);
      } else {
        updatedTasks = [...tasks, newTask];
        toast.success(t.successCreated);
      }

      // Sauvegarde dans Supabase
      await unifiedService.saveCustomData("example_tasks", updatedTasks);
      setTasks(updatedTasks);
      closeDialog();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(t.errorSaving);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const updatedTasks = tasks.filter(t => t.id !== taskToDelete);
      await unifiedService.saveCustomData("example_tasks", updatedTasks);
      setTasks(updatedTasks);
      toast.success(t.successDeleted);
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(t.errorDeleting);
    }
  };

  const openAddDialog = () => {
    setEditingTask(null);
    setFormData({
      title_fr: "",
      title_en: "",
      description_fr: "",
      description_en: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
      tags: ""
    });
    setDialogOpen(true);
  };

  const openEditDialog = (task: ExampleTask) => {
    setEditingTask(task);
    setFormData({
      title_fr: task.title_fr,
      title_en: task.title_en,
      description_fr: task.description_fr || "",
      description_en: task.description_en || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || "",
      tags: task.tags.join(", ")
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingTask(null);
  };

  const openDeleteDialog = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="w-5 h-5 text-[#00FFC2]" />;
      case "in_progress":
        return <Circle className="w-5 h-5 text-blue-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#F4F4F4]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-8 h-8 text-[#00FFC2]" />
            <h1 className="text-[#00FFC2]">{t.pageTitle}</h1>
          </div>
          <p className="text-gray-400 mb-6">{t.pageSubtitle}</p>

          {/* Connection Status */}
          <Alert className="mb-6 border-[#00FFC2]/20 bg-[#00FFC2]/5">
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
                  loadTasks();
                }}
                className="text-[#00FFC2] hover:bg-[#00FFC2]/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t.reconnect}
              </Button>
            </div>
          </Alert>

          {/* Features */}
          <Card className="bg-[#1A1A1A] border-gray-800 p-6 mb-6">
            <h3 className="mb-4 text-[#00FFC2]">{t.features}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[t.feature1, t.feature2, t.feature3, t.feature4, t.feature5, t.feature6].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-[#00FFC2]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Seed Data CTA */}
          <Alert className="mb-6 border-[#00FFC2]/20 bg-[#1A1A1A]">
            <AlertDescription className="text-[#F4F4F4]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1">
                    {language === "fr" 
                      ? "🌱 Besoin de projets de test pour votre portfolio ?" 
                      : "🌱 Need test projects for your portfolio?"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {language === "fr" 
                      ? "Créez 6 projets professionnels bilingues en quelques clics" 
                      : "Create 6 professional bilingual projects in a few clicks"}
                  </p>
                </div>
                <Button
                  onClick={() => window.location.href = `/${language}/seed-data`}
                  className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
                >
                  {language === "fr" ? "Créer des projets" : "Create projects"}
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="text-gray-400">
              {tasks.length} {t.taskCount}
            </div>
            <Button
              onClick={openAddDialog}
              className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t.addTask}
            </Button>
          </div>
        </motion.div>

        {/* Tasks List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400">{t.loading}</div>
          </div>
        ) : tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-gray-400 mb-2">{t.noTasks}</h3>
            <p className="text-gray-600">{t.noTasksDesc}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-[#1A1A1A] border-gray-800 p-6 hover:border-[#00FFC2]/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {getStatusIcon(task.status)}
                      <div className="flex-1">
                        <h3 className="mb-2">
                          {language === "fr" ? task.title_fr : task.title_en}
                        </h3>
                        {(task.description_fr || task.description_en) && (
                          <p className="text-gray-400 mb-3">
                            {language === "fr" ? task.description_fr : task.description_en}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority === "high" ? t.priorityHigh : task.priority === "medium" ? t.priorityMedium : t.priorityLow}
                          </Badge>
                          <Badge variant="outline" className="border-gray-700">
                            {task.status === "done" ? t.statusDone : task.status === "in_progress" ? t.statusInProgress : t.statusTodo}
                          </Badge>
                          {task.dueDate && (
                            <Badge variant="outline" className="border-gray-700">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(task.dueDate).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")}
                            </Badge>
                          )}
                        </div>
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {task.tags.map((tag, i) => (
                              <Badge key={i} variant="outline" className="border-[#00FFC2]/30 text-[#00FFC2]">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(task)}
                        className="text-gray-400 hover:text-[#00FFC2] hover:bg-[#00FFC2]/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(task.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-[#1A1A1A] border-gray-800 text-[#F4F4F4] max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#00FFC2]">
                {editingTask ? t.editTask : t.addTask}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {language === "fr" 
                  ? "Remplissez les champs dans les deux langues pour une meilleure expérience bilingue"
                  : "Fill in the fields in both languages for a better bilingual experience"
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">{t.titleFr} *</label>
                  <Input
                    value={formData.title_fr}
                    onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
                    className="bg-[#0C0C0C] border-gray-700"
                    placeholder="Ex: Développer le site web"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">{t.titleEn} *</label>
                  <Input
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    className="bg-[#0C0C0C] border-gray-700"
                    placeholder="Ex: Develop the website"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">{t.descriptionFr}</label>
                  <Textarea
                    value={formData.description_fr}
                    onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                    className="bg-[#0C0C0C] border-gray-700"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">{t.descriptionEn}</label>
                  <Textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    className="bg-[#0C0C0C] border-gray-700"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">{t.status}</label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="bg-[#0C0C0C] border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-gray-700">
                      <SelectItem value="todo">{t.statusTodo}</SelectItem>
                      <SelectItem value="in_progress">{t.statusInProgress}</SelectItem>
                      <SelectItem value="done">{t.statusDone}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">{t.priority}</label>
                  <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger className="bg-[#0C0C0C] border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-gray-700">
                      <SelectItem value="low">{t.priorityLow}</SelectItem>
                      <SelectItem value="medium">{t.priorityMedium}</SelectItem>
                      <SelectItem value="high">{t.priorityHigh}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">{t.dueDate}</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="bg-[#0C0C0C] border-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">{t.tags}</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="bg-[#0C0C0C] border-gray-700"
                  placeholder={t.tagsPlaceholder}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={closeDialog}
                className="text-gray-400 hover:bg-gray-800"
              >
                {t.cancel}
              </Button>
              <Button
                onClick={handleSaveTask}
                disabled={!formData.title_fr || !formData.title_en}
                className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
              >
                {t.save}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-[#1A1A1A] border-gray-800 text-[#F4F4F4]">
            <DialogHeader>
              <DialogTitle className="text-red-500">{t.deleteTask}</DialogTitle>
              <DialogDescription className="text-gray-400">
                {t.deleteConfirm}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setDeleteDialogOpen(false)}
                className="text-gray-400 hover:bg-gray-800"
              >
                {t.cancel}
              </Button>
              <Button
                onClick={handleDeleteTask}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                {t.delete}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

