import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Mail,
  Search,
  Users,
  TrendingUp,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  MailOpen,
  Send,
  FileText,
} from "lucide-react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { NewsletterCampaignTab } from "./NewsletterCampaignTab";
import { NewsletterTemplatesTab } from "./NewsletterTemplatesTab";

interface Subscriber {
  email: string;
  status: "pending" | "confirmed" | "unsubscribed";
  subscribedAt: string;
  confirmedAt?: string;
  unsubscribedAt?: string;
  confirmationToken?: string;
}

export function NewsletterTab() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingSubscriber, setDeletingSubscriber] = useState<Subscriber | null>(null);
  const [activeTab, setActiveTab] = useState("subscribers");

  useEffect(() => {
    loadSubscribers();
    
    // Listen for switch to campaign tab event
    const handleSwitchToCampaign = () => {
      console.log("🔄 Switch vers l'onglet campagne demandé");
      setActiveTab("campaign");
    };
    
    window.addEventListener("newsletter-switch-to-campaign", handleSwitchToCampaign);
    
    return () => {
      window.removeEventListener("newsletter-switch-to-campaign", handleSwitchToCampaign);
    };
  }, []);

  const loadSubscribers = async () => {
    setIsLoading(true);
    try {
      // Utiliser le service avec fallback local
      const { fetchSubscribers } = await import("../../utils/dataService");
      const { subscribers: loadedSubscribers, mode } = await fetchSubscribers();
      
      console.log(`✅ Subscribers loaded in ${mode} mode:`, loadedSubscribers.length);
      setSubscribers(loadedSubscribers as any);
    } catch (error) {
      console.error("Error loading subscribers:", error);
      toast.error(`Erreur de chargement (mode local disponible)`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSubscriber) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/newsletter/subscriber/${encodeURIComponent(
          deletingSubscriber.email
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Abonné supprimé");
        loadSubscribers();
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast.error("Impossible de supprimer l'abonné");
    } finally {
      setDeletingSubscriber(null);
    }
  };

  const exportSubscribers = () => {
    const csv = [
      ["Email", "Statut", "Date d'inscription", "Date de confirmation"].join(","),
      ...filteredSubscribers.map((sub) =>
        [
          sub.email,
          sub.status,
          new Date(sub.subscribedAt).toLocaleDateString("fr-FR"),
          sub.confirmedAt
            ? new Date(sub.confirmedAt).toLocaleDateString("fr-FR")
            : "N/A",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filter subscribers
  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || sub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: subscribers.length,
    confirmed: subscribers.filter((s) => s.status === "confirmed").length,
    pending: subscribers.filter((s) => s.status === "pending").length,
    unsubscribed: subscribers.filter((s) => s.status === "unsubscribed").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-[#00FFC2]/20 text-[#00FFC2] border-[#00FFC2]/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Confirmé
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500/30 text-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      case "unsubscribed":
        return (
          <Badge variant="outline" className="border-red-500/30 text-red-500">
            <XCircle className="h-3 w-3 mr-1" />
            Désabonné
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white mb-2">Newsletter</h2>
          <p className="text-white/60">
            Gérez vos abonnés et envoyez des campagnes email
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger value="subscribers" className="data-[state=active]:bg-[#00FFC2]/20 data-[state=active]:text-[#00FFC2]">
            <Users className="h-4 w-4 mr-2" />
            Abonnés ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-[#00FFC2]/20 data-[state=active]:text-[#00FFC2]">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="campaign" className="data-[state=active]:bg-[#00FFC2]/20 data-[state=active]:text-[#00FFC2]">
            <Send className="h-4 w-4 mr-2" />
            Envoyer une campagne
          </TabsTrigger>
        </TabsList>

        {/* Subscribers Tab */}
        <TabsContent value="subscribers" className="space-y-6 mt-6">
          <div className="flex items-center justify-end">
            <Button
              onClick={exportSubscribers}
              variant="outline"
              className="border-[#00FFC2]/30 text-[#00FFC2] hover:bg-[#00FFC2]/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
          </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Total</p>
              <p className="text-2xl text-white">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-[#00FFC2]" />
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Confirmés</p>
              <p className="text-2xl text-white">{stats.confirmed}</p>
            </div>
            <MailOpen className="h-8 w-8 text-[#00FFC2]" />
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">En attente</p>
              <p className="text-2xl text-white">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Taux de confirmation</p>
              <p className="text-2xl text-white">
                {stats.total > 0
                  ? Math.round((stats.confirmed / stats.total) * 100)
                  : 0}
                %
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-[#00FFC2]" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder="Rechercher par email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px] bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="confirmed">Confirmés</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="unsubscribed">Désabonnés</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subscribers List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FFC2] mx-auto mb-4"></div>
              <p className="text-white/60">Chargement...</p>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <Card className="bg-white/5 border-white/10 p-12 text-center">
              <Mail className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">Aucun abonné trouvé</p>
            </Card>
          ) : (
            filteredSubscribers.map((subscriber) => (
              <motion.div
                key={subscriber.email}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
              >
                <Card className="bg-white/5 border-white/10 p-4 hover:border-[#00FFC2]/30 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-[#00FFC2]/10 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-[#00FFC2]" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white truncate">{subscriber.email}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-white/40">
                            Inscrit le{" "}
                            {new Date(subscriber.subscribedAt).toLocaleDateString("fr-FR")}
                          </span>
                          {subscriber.confirmedAt && (
                            <span className="text-xs text-white/40">
                              • Confirmé le{" "}
                              {new Date(subscriber.confirmedAt).toLocaleDateString("fr-FR")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(subscriber.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingSubscriber(subscriber)}
                        className="text-white/60 hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deletingSubscriber}
        onOpenChange={(open) => !open && setDeletingSubscriber(null)}
        onConfirm={handleDelete}
        title="Supprimer cet abonné ?"
        description={`Êtes-vous sûr de vouloir supprimer ${deletingSubscriber?.email} de la liste ? Cette action est irréversible.`}
      />
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="mt-6">
          <NewsletterTemplatesTab />
        </TabsContent>

        {/* Campaign Tab */}
        <TabsContent value="campaign" className="mt-6">
          <NewsletterCampaignTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

