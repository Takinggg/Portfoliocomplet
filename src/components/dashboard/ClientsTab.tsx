import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { motion } from "motion/react";
import { 
  Users, 
  Search, 
  Mail,
  Building,
  DollarSign,
  Edit,
  Trash,
  Eye,
  UserPlus,
  Plus
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId } from "../../utils/supabase/info";
import { createClient } from "../../utils/supabase/client";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { ClientEditDialog } from "./ClientEditDialog";

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
  revenue?: number;
  status: "active" | "inactive" | "prospect";
  createdAt: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  convertedToClient?: boolean;
  createdAt: string;
}

export function ClientsTab() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [convertibleLeads, setConvertibleLeads] = useState<Lead[]>([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [converting, setConverting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        // Charger des clients vides en mode local
        setClients([]);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients`,
        {
          headers: { 
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Server response error:", response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setClients(data.clients || []);
      
      // Cache les clients pour un usage futur
      localStorage.setItem("cached_clients", JSON.stringify(data.clients || []));
    } catch (error: any) {
      console.error("❌ Error fetching clients:", error);
      
      // Message d'erreur spécifique selon le code HTTP
      const is404 = error.message?.includes("404");
      const is401 = error.message?.includes("401");
      
      if (is404) {
        toast.error("Routes clients non déployées", {
          description: "Le serveur doit être redéployé sur Supabase. Consultez REDEPLOYER_SERVEUR.md",
          duration: 10000,
        });
      } else if (is401) {
        toast.error("Session expirée", {
          description: "Veuillez vous reconnecter au dashboard.",
        });
      }
      
      // Mode dégradé : charger des données locales si disponibles
      const cachedClients = localStorage.getItem("cached_clients");
      if (cachedClients) {
        try {
          const parsed = JSON.parse(cachedClients);
          setClients(parsed);
          if (!is404 && !is401) {
            toast.info("Données locales chargées", {
              description: "Le serveur est indisponible. Affichage des données en cache.",
            });
          }
        } catch (e) {
          console.error("Failed to parse cached clients:", e);
          setClients([]);
        }
      } else {
        setClients([]);
        if (!is404 && !is401) {
          toast.warning("Serveur indisponible", {
            description: "Impossible de charger les clients. Vérifiez que le serveur est déployé.",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchConvertibleLeads = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads`,
        {
          headers: { 
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }

      const data = await response.json();
      
      // Filter leads that are not already converted to clients
      const convertible = (data.leads || []).filter(
        (lead: Lead) => !lead.convertedToClient
      );
      
      setConvertibleLeads(convertible);
      setShowConvertDialog(true);
    } catch (error) {
      console.error("Error fetching convertible leads:", error);
      toast.error("Erreur lors du chargement des leads");
    }
  };

  const convertLeadsToClients = async () => {
    if (selectedLeadIds.length === 0) {
      toast.error("Veuillez sélectionner au moins un lead");
      return;
    }

    setConverting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const conversions = await Promise.all(
        selectedLeadIds.map((leadId) =>
          fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads/${encodeURIComponent(leadId)}/convert`,
            {
              method: "POST",
              headers: { 
                Authorization: `Bearer ${session.access_token}`,
              },
            }
          )
        )
      );

      const results = await Promise.all(conversions.map((r) => r.json()));
      const successCount = results.filter((r) => r.success).length;

      if (successCount > 0) {
        toast.success(`${successCount} lead(s) converti(s) en client(s)`);
        setShowConvertDialog(false);
        setSelectedLeadIds([]);
        fetchClients();
      } else {
        toast.error("Erreur lors de la conversion");
      }
    } catch (error) {
      console.error("Error converting leads:", error);
      toast.error("Erreur lors de la conversion");
    } finally {
      setConverting(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients/${encodeURIComponent(selectedClient.id)}`,
        {
          method: "DELETE",
          headers: { 
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Erreur lors de la suppression");
        return;
      }

      const data = await response.json();
      const deletedInfo = [];
      if (data.deletedInvoices > 0) deletedInfo.push(`${data.deletedInvoices} facture(s)`);
      if (data.deletedQuotes > 0) deletedInfo.push(`${data.deletedQuotes} devis`);
      if (data.deletedProjects > 0) deletedInfo.push(`${data.deletedProjects} projet(s)`);
      
      const message = deletedInfo.length > 0 
        ? `Client supprimé avec ${deletedInfo.join(", ")}`
        : "Client supprimé avec succès";
      
      toast.success(message);
      setShowDeleteDialog(false);
      setSelectedClient(null);
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Impossible de supprimer le client", {
        description: "Le serveur est indisponible. Veuillez réessayer plus tard.",
      });
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: Client["status"]) => {
    const colors = {
      active: "bg-green-500/10 text-green-400",
      inactive: "bg-gray-500/10 text-gray-400",
      prospect: "bg-blue-500/10 text-blue-400"
    };
    return colors[status];
  };

  const getStatusLabel = (status: Client["status"]) => {
    const labels = {
      active: "Actif",
      inactive: "Inactif",
      prospect: "Prospect"
    };
    return labels[status];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Clients</h1>
          <p className="text-white/60">Gérez votre base de clients</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setSelectedClient(null);
              setShowEditDialog(true);
            }}
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau client
          </Button>
          <Button
            onClick={fetchConvertibleLeads}
            className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Convertir des leads
          </Button>
          <Badge className="bg-[#00FFC2]/10 text-[#00FFC2] border-0 px-4 py-2 text-lg">
            <Users className="h-5 w-5 mr-2" />
            {clients.length} client{clients.length > 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Clients actifs</p>
                <p className="text-3xl">
                  {clients.filter(c => c.status === "active").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Prospects</p>
                <p className="text-3xl">
                  {clients.filter(c => c.status === "prospect").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Revenu total</p>
                <p className="text-3xl text-[#00FFC2]">
                  {clients.reduce((sum, c) => sum + (c.revenue || 0), 0).toLocaleString()}€
                </p>
              </div>
              <div className="w-12 h-12 bg-[#00FFC2]/10 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-[#00FFC2]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card className="bg-black/40 border-[#00FFC2]/10 backdrop-blur-xl">
        <CardHeader className="border-b border-[#00FFC2]/10">
          <div className="flex items-center justify-between">
            <CardTitle>Liste des clients</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-8 text-white/40">Chargement...</div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8 text-white/40">
              {searchQuery ? "Aucun client trouvé" : "Aucun client"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white/60">Nom</TableHead>
                    <TableHead className="text-white/60">Contact</TableHead>
                    <TableHead className="text-white/60">Entreprise</TableHead>
                    <TableHead className="text-white/60">Statut</TableHead>
                    <TableHead className="text-white/60">Revenu</TableHead>
                    <TableHead className="text-white/60">Inscrit le</TableHead>
                    <TableHead className="text-white/60 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow 
                      key={client.id} 
                      className="border-white/5 hover:bg-white/5"
                    >
                      <TableCell className="font-medium text-white">{client.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-white/60">
                          <Mail className="h-4 w-4" />
                          {client.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-white/60">
                          {client.company ? (
                            <>
                              <Building className="h-4 w-4" />
                              {client.company}
                            </>
                          ) : (
                            <span className="text-white/40">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(client.status)}>
                          {getStatusLabel(client.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#00FFC2] font-medium">
                        {(client.revenue || 0).toLocaleString()}€
                      </TableCell>
                      <TableCell className="text-white/60">
                        {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => {
                              setSelectedClient(client);
                              setShowEditDialog(true);
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-[#00FFC2] hover:bg-[#00FFC2]/10"
                            title="Modifier le client"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedClient(client);
                              setShowDeleteDialog(true);
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:bg-red-400/10"
                            title="Supprimer le client"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Client Dialog */}
      <ClientEditDialog
        client={selectedClient}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onClientUpdated={fetchClients}
      />

      {/* Delete Confirmation Dialog */}
      {selectedClient && (
        <DeleteConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDeleteClient}
          title="Supprimer le client"
          description="Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible et supprimera également :"
          itemName={`${selectedClient.name} (${selectedClient.email})`}
          warningMessage="Toutes les factures, devis et projets associés à ce client seront également supprimés définitivement."
        />
      )}

      {/* Convert Leads to Clients Dialog */}
      <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <DialogContent className="bg-[#0C0C0C] border-[#00FFC2]/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Convertir des leads en clients</DialogTitle>
            <DialogDescription className="text-white/60">
              Sélectionnez les leads que vous souhaitez convertir en clients actifs
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto space-y-2 py-4">
            {convertibleLeads.length === 0 ? (
              <div className="text-center py-8 text-white/40">
                <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>Aucun lead disponible pour conversion</p>
                <p className="text-sm mt-2">Tous vos leads ont déjà été convertis en clients</p>
              </div>
            ) : (
              convertibleLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                >
                  <Checkbox
                    checked={selectedLeadIds.includes(lead.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedLeadIds([...selectedLeadIds, lead.id]);
                      } else {
                        setSelectedLeadIds(selectedLeadIds.filter((id) => id !== lead.id));
                      }
                    }}
                    className="border-[#00FFC2]/50 data-[state=checked]:bg-[#00FFC2] data-[state=checked]:border-[#00FFC2]"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-white">{lead.name}</p>
                    <div className="flex items-center gap-4 text-sm text-white/60 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </span>
                      {lead.phone && (
                        <span>{lead.phone}</span>
                      )}
                    </div>
                  </div>
                  <Badge 
                    className={
                      lead.status === "new" 
                        ? "bg-[#00FFC2]/10 text-[#00FFC2] border-0" 
                        : lead.status === "qualified"
                        ? "bg-blue-500/10 text-blue-400 border-0"
                        : "bg-white/10 text-white border-0"
                    }
                  >
                    {lead.status}
                  </Badge>
                </div>
              ))
            )}
          </div>

          <DialogFooter className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-white/60">
                {selectedLeadIds.length} lead{selectedLeadIds.length > 1 ? "s" : ""} sélectionné{selectedLeadIds.length > 1 ? "s" : ""}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConvertDialog(false);
                    setSelectedLeadIds([]);
                  }}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  Annuler
                </Button>
                <Button
                  onClick={convertLeadsToClients}
                  disabled={selectedLeadIds.length === 0 || converting}
                  className="bg-[#00FFC2] text-black hover:bg-[#00FFC2]/90"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {converting ? "Conversion..." : `Convertir ${selectedLeadIds.length > 0 ? `(${selectedLeadIds.length})` : ""}`}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
