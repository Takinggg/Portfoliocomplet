import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { motion } from "motion/react";
import {
  Plus,
  Edit,
  Trash,
  Star,
  Quote,
  Linkedin,
  TrendingUp,
  Users,
  Award,
  Send,
  Mail,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";
import { projectId } from "../../utils/supabase/info";
import { createClient } from "../../utils/supabase/client";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  clientRole_en?: string;
  clientCompany: string;
  clientPhoto?: string;
  rating: number;
  testimonial: string;
  testimonial_en?: string;
  projectType: string;
  projectType_en?: string;
  date: string;
  linkedinUrl?: string;
  featured: boolean;
  createdAt: string;
  approved?: boolean;
  updatedAt?: string;
}

export function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  
  const supabase = createClient();

  // Request review form state
  const [requestData, setRequestData] = useState({
    clientName: "",
    clientEmail: "",
    projectName: "",
    projectType: "",
    message: ""
  });

  // Form state
  const [formData, setFormData] = useState({
    clientName: "",
    clientRole: "",
    clientRole_en: "",
    clientCompany: "",
    clientPhoto: "",
    rating: 5,
    testimonial: "",
    testimonial_en: "",
    projectType: "",
    projectType_en: "",
    date: new Date().toISOString().split('T')[0],
    linkedinUrl: "",
    featured: false
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirÃ©e");
        setTestimonials([]);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/testimonials/admin`,
        {
          headers: { Authorization: `Bearer ${session.access_token}` }
        }
      );

      if (!response.ok) {
        console.error(`API returned status ${response.status}`);
        toast.error("Erreur lors du chargement des tÃ©moignages");
        setTestimonials([]);
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        const sorted = (data.testimonials || []).sort((a: Testimonial, b: Testimonial) => {
          const dateA = new Date(a.createdAt || a.date).getTime();
          const dateB = new Date(b.createdAt || b.date).getTime();
          return dateB - dateA;
        });
        setTestimonials(sorted);
      } else {
        toast.error(data.error || "Erreur lors du chargement");
        setTestimonials([]);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error("Erreur de connexion");
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirÃ©e");
        return;
      }

      const payload = {
        ...formData,
        rating: Number(formData.rating)
      };

      const url = editingTestimonial
        ? `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/testimonials/${encodeURIComponent(editingTestimonial.id)}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/testimonials`;

      const response = await fetch(url, {
        method: editingTestimonial ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingTestimonial ? "TÃ©moignage mis Ã  jour" : "TÃ©moignage crÃ©Ã©");
        setIsDialogOpen(false);
        setEditingTestimonial(null);
        resetForm();
        fetchTestimonials();
      } else {
        toast.error(data.error || "Erreur");
      }
    } catch (error) {
      console.error("Error saving testimonial:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestData.clientName || !requestData.clientEmail || !requestData.projectName) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setSendingRequest(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirÃ©e");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/testimonials/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`
          },
          body: JSON.stringify(requestData)
        }
      );

      const data = await response.json();

      if (data.success) {
        if (data.request?.formUrl) {
          try {
            await navigator.clipboard.writeText(data.request.formUrl);
            toast.success(`Demande envoyÃ©e Ã  ${requestData.clientName} (lien copiÃ©) !`);
          } catch {
            toast.success(`Demande envoyÃ©e Ã  ${requestData.clientName} !`);
            console.info("Lien du formulaire:", data.request.formUrl);
          }
        } else {
          toast.success(`Demande envoyÃ©e Ã  ${requestData.clientName} !`);
        }
        setRequestDialogOpen(false);
        setRequestData({
          clientName: "",
          clientEmail: "",
          projectName: "",
          projectType: "",
          message: ""
        });
      } else {
        toast.error(data.error || "Erreur lors de l'envoi");
      }
    } catch (error) {
      console.error("Error sending review request:", error);
      toast.error("Erreur lors de l'envoi de la demande");
    } finally {
      setSendingRequest(false);
    }
  };

  const handleDelete = async () => {
    if (!testimonialToDelete) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirÃ©e");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/testimonials/${encodeURIComponent(testimonialToDelete.id)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session.access_token}` }
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("TÃ©moignage supprimÃ©");
        setDeleteDialogOpen(false);
        setTestimonialToDelete(null);
        fetchTestimonials();
      } else {
        toast.error(data.error || "Erreur");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleApprovalToggle = async (testimonial: Testimonial) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirÃ©e");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/testimonials/${encodeURIComponent(testimonial.id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ approved: !testimonial.approved })
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success(!testimonial.approved ? "TÃ©moignage publiÃ©" : "TÃ©moignage masquÃ©");
        fetchTestimonials();
      } else {
        toast.error(data.error || "Impossible de mettre Ã  jour le statut");
      }
    } catch (error) {
      console.error("Error toggling testimonial approval:", error);
      toast.error("Erreur lors de la mise Ã  jour");
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      clientName: testimonial.clientName,
      clientRole: testimonial.clientRole,
      clientRole_en: testimonial.clientRole_en || "",
      clientCompany: testimonial.clientCompany,
      clientPhoto: testimonial.clientPhoto || "",
      rating: testimonial.rating,
      testimonial: testimonial.testimonial,
      testimonial_en: testimonial.testimonial_en || "",
      projectType: testimonial.projectType,
      projectType_en: testimonial.projectType_en || "",
      date: testimonial.date,
      linkedinUrl: testimonial.linkedinUrl || "",
      featured: testimonial.featured
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientRole: "",
      clientRole_en: "",
      clientCompany: "",
      clientPhoto: "",
      rating: 5,
      testimonial: "",
      testimonial_en: "",
      projectType: "",
      projectType_en: "",
      date: new Date().toISOString().split('T')[0],
      linkedinUrl: "",
      featured: false
    });
  };

  const stats = {
    total: testimonials.length,
    featured: testimonials.filter(t => t.featured).length,
    averageRating: testimonials.length > 0 
      ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
      : "5.0",
    fiveStars: testimonials.filter(t => t.rating === 5).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl tracking-tight text-white">TÃ©moignages Clients</h1>
          <p className="text-white/60 mt-1">
            GÃ©rez les tÃ©moignages et avis clients
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setRequestDialogOpen(true)}
            variant="outline"
            className="border-[#CCFF00]/20 text-white hover:bg-white/5"
          >
            <Send className="mr-2 h-4 w-4" />
            Demander un avis
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setEditingTestimonial(null);
              setIsDialogOpen(true);
            }}
            className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau tÃ©moignage
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-[#CCFF00]/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white/60">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <p className="text-xs text-white/40 mt-1">{stats.featured} Ã  la une</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-[#CCFF00]/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white/60">Note moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-[#CCFF00] mr-2 fill-[#CCFF00]" />
              <div className="text-2xl font-bold text-white">{stats.averageRating}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-[#CCFF00]/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white/60">5 Ã©toiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.fiveStars}</div>
            <p className="text-xs text-white/40 mt-1">
              {testimonials.length > 0 
                ? `${((stats.fiveStars / testimonials.length) * 100).toFixed(0)}%`
                : "0%"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-[#CCFF00]/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white/60">Ã€ la une</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.featured}</div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials List */}
      <Card className="bg-black/40 border-[#CCFF00]/10">
        <Table>
          <TableHeader>
            <TableRow className="border-[#CCFF00]/10">
              <TableHead className="text-white/60">Client</TableHead>
              <TableHead className="text-white/60 w-[100px]">Note</TableHead>
              <TableHead className="text-white/60 w-[120px]">Projet</TableHead>
              <TableHead className="text-white/60 w-[100px] hidden md:table-cell">Date</TableHead>
              <TableHead className="text-white/60 w-[120px]">Publication</TableHead>
              <TableHead className="text-white/60 w-[90px]">Ã€ la une</TableHead>
                <TableHead className="text-white/60 w-[130px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-white/40 py-8">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : testimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 max-w-md mx-auto"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#CCFF00]/20 blur-3xl rounded-full" />
                      <Quote className="h-16 w-16 text-[#CCFF00] mx-auto relative" />
                    </div>
                    <div>
                      <h3 className="text-xl text-white mb-2">Aucun tÃ©moignage pour le moment</h3>
                      <p className="text-white/60 text-sm mb-6">
                        Commencez Ã  collecter des avis de vos clients pour renforcer votre crÃ©dibilitÃ©
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          onClick={() => {
                            resetForm();
                            setEditingTestimonial(null);
                            setIsDialogOpen(true);
                          }}
                          className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          CrÃ©er un tÃ©moignage
                        </Button>
                        <Button
                          onClick={() => setRequestDialogOpen(true)}
                          variant="outline"
                          className="border-[#CCFF00]/20 text-white hover:bg-white/5"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Demander un avis
                        </Button>
                      </div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-left">
                      <p className="text-sm text-white/70 mb-2">
                        ðŸ’¡ <strong className="text-white">Astuce :</strong> Les tÃ©moignages clients sont essentiels pour :
                      </p>
                      <ul className="text-sm text-white/60 space-y-1 ml-4">
                        <li>â€¢ Rassurer vos prospects</li>
                        <li>â€¢ Augmenter vos conversions</li>
                        <li>â€¢ Valoriser votre expertise</li>
                        <li>â€¢ AmÃ©liorer votre SEO</li>
                      </ul>
                    </div>
                  </motion.div>
                </TableCell>
              </TableRow>
            ) : (
              testimonials.map((testimonial) => (
                <TableRow key={testimonial.id} className="border-[#CCFF00]/10">
                  <TableCell className="text-white">
                    <div>
                      <div className="font-medium">{testimonial.clientName}</div>
                      <div className="text-sm text-white/60">
                        {testimonial.clientRole} â€¢ {testimonial.clientCompany}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-[#CCFF00] fill-[#CCFF00]" />
                      <span className="text-white">{testimonial.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
                      {testimonial.projectType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/40 text-sm hidden md:table-cell">
                    {new Date(testimonial.date).toLocaleDateString('fr-FR', { 
                      day: '2-digit', 
                      month: '2-digit',
                      year: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    {testimonial.approved ?? true ? (
                      <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-xs">
                        PubliÃ©
                      </Badge>
                    ) : (
                      <Badge className="bg-white/5 text-white/40 border-white/10 text-xs">
                        Brouillon
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {testimonial.featured ? (
                      <Badge className="bg-[#CCFF00]/10 text-[#CCFF00] border-[#CCFF00]/20 text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    ) : (
                      <Badge className="bg-white/5 text-white/40 border-white/10 text-xs">
                        Normal
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprovalToggle(testimonial)}
                        className={`h-7 w-7 p-0 ${testimonial.approved ?? true ? "text-white/70 hover:text-white hover:bg-white/5" : "text-[#CCFF00] hover:bg-[#CCFF00]/10"}`}
                        title={testimonial.approved ?? true ? "Masquer du site" : "Publier"}
                      >
                        {testimonial.approved ?? true ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      {testimonial.linkedinUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(testimonial.linkedinUrl, "_blank")}
                          className="hover:bg-blue-500/10 text-blue-500 h-7 w-7 p-0"
                          title="LinkedIn"
                        >
                          <Linkedin className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(testimonial)}
                        className="hover:bg-white/5 text-white/60 hover:text-white h-7 w-7 p-0"
                        title="Modifier"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setTestimonialToDelete(testimonial);
                          setDeleteDialogOpen(true);
                        }}
                        className="hover:bg-red-500/10 text-red-500 h-7 w-7 p-0"
                        title="Supprimer"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0C0C0C] border-[#CCFF00]/20 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingTestimonial ? "Modifier le tÃ©moignage" : "Nouveau tÃ©moignage"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Ajoutez un tÃ©moignage client authentique
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-white">Nom du client</Label>
                <Input
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Jean Dupont"
                  className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                  required
                />
              </div>

              <div>
                <Label className="text-white">Poste (FR) ðŸ‡«ðŸ‡·</Label>
                <Input
                  value={formData.clientRole}
                  onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                  placeholder="CEO"
                  className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                  required
                />
              </div>

              <div>
                <Label className="text-white">Poste (EN) ðŸ‡¬ðŸ‡§</Label>
                <Input
                  value={formData.clientRole_en}
                  onChange={(e) => setFormData({ ...formData, clientRole_en: e.target.value })}
                  placeholder="CEO"
                  className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                />
              </div>

              <div className="col-span-2">
                <Label className="text-white">Entreprise</Label>
                <Input
                  value={formData.clientCompany}
                  onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                  placeholder="Startup SaaS"
                  className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label className="text-white">Photo du client (URL)</Label>
                <Input
                  value={formData.clientPhoto}
                  onChange={(e) => setFormData({ ...formData, clientPhoto: e.target.value })}
                  placeholder="https://..."
                  className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                />
              </div>

              <div>
                <Label className="text-white">Note (sur 5)</Label>
                <Select
                  value={formData.rating.toString()}
                  onValueChange={(value) => setFormData({ ...formData, rating: Number(value) })}
                >
                  <SelectTrigger className="bg-black/40 border-[#CCFF00]/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0C0C0C] border-[#CCFF00]/20">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <SelectItem 
                        key={rating} 
                        value={rating.toString()}
                        className="text-white focus:bg-white/10 focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          {[...Array(rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-[#CCFF00] text-[#CCFF00]" />
                          ))}
                          <span>({rating}/5)</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Type de projet (FR) ðŸ‡«ðŸ‡·</Label>
                <Input
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  placeholder="Site Web, Branding, etc."
                  className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                  required
                />
              </div>

              <div>
                <Label className="text-white">Type de projet (EN) ðŸ‡¬ðŸ‡§</Label>
                <Input
                  value={formData.projectType_en}
                  onChange={(e) => setFormData({ ...formData, projectType_en: e.target.value })}
                  placeholder="Website, Branding, etc."
                  className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                />
              </div>

              <div className="col-span-2">
                <Label className="text-white">TÃ©moignage (FR) ðŸ‡«ðŸ‡·</Label>
                <Textarea
                  value={formData.testimonial}
                  onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                  placeholder="Ex: Maxence a complÃ¨tement transformÃ© notre prÃ©sence en ligne. Son approche stratÃ©gique et son attention aux dÃ©tails ont dÃ©passÃ© toutes nos attentes..."
                  className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                  rows={5}
                  required
                />
                <p className="text-xs text-white/40 mt-1.5">
                  ðŸ’¡ Un bon tÃ©moignage mentionne : le problÃ¨me rÃ©solu, l'expÃ©rience de collaboration, et les rÃ©sultats obtenus
                </p>
              </div>

              <div className="col-span-2">
                <Label className="text-white">TÃ©moignage (EN) ðŸ‡¬ðŸ‡§</Label>
                <Textarea
                  value={formData.testimonial_en}
                  onChange={(e) => setFormData({ ...formData, testimonial_en: e.target.value })}
                  placeholder="Ex: Maxence completely transformed our online presence. His strategic approach and attention to detail exceeded all our expectations..."
                  className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                  rows={5}
                />
              </div>

              <div>
                <Label className="text-white">Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-black/40 border-[#CCFF00]/20 text-white"
                  required
                />
              </div>

              <div>
                <Label className="text-white">LinkedIn (optionnel)</Label>
                <Input
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                />
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-[#CCFF00]/20 bg-black/40"
                  />
                  <Label htmlFor="featured" className="cursor-pointer text-white">
                    â­ Mettre Ã  la une (carousel sur la page publique)
                  </Label>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-[#CCFF00]/10 to-blue-500/10 border border-[#CCFF00]/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-[#CCFF00] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-white/80">
                  <p className="font-medium text-white mb-2">ðŸ“‹ Conseils pour un tÃ©moignage impactant :</p>
                  <ul className="space-y-1 text-white/70">
                    <li>â€¢ <strong>SpÃ©cifique :</strong> Mentionnez des rÃ©sultats concrets (ex: +250% de conversions)</li>
                    <li>â€¢ <strong>Authentique :</strong> Utilisez les mots rÃ©els du client</li>
                    <li>â€¢ <strong>Complet :</strong> ProblÃ¨me initial â†’ Solution â†’ RÃ©sultats obtenus</li>
                    <li>â€¢ <strong>Humain :</strong> Ajoutez une photo et un lien LinkedIn si possible</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-[#CCFF00]/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingTestimonial(null);
                  resetForm();
                }}
                className="border-[#CCFF00]/20 text-white hover:bg-white/5"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
              >
                {editingTestimonial ? "Mettre Ã  jour" : "CrÃ©er"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Request Review Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="bg-[#0C0C0C] border-[#CCFF00]/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#CCFF00]" />
              Demander un avis client
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Envoyez un email personnalisÃ© Ã  votre client pour lui demander un tÃ©moignage
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendRequest} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Nom du client *</Label>
                <Input
                  value={requestData.clientName}
                  onChange={(e) => setRequestData({ ...requestData, clientName: e.target.value })}
                  placeholder="Jean Dupont"
                  className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                  required
                />
              </div>

              <div>
                <Label className="text-white">Email du client *</Label>
                <Input
                  type="email"
                  value={requestData.clientEmail}
                  onChange={(e) => setRequestData({ ...requestData, clientEmail: e.target.value })}
                  placeholder="jean@example.com"
                  className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                  required
                />
              </div>

              <div>
                <Label className="text-white">Nom du projet *</Label>
                <Input
                  value={requestData.projectName}
                  onChange={(e) => setRequestData({ ...requestData, projectName: e.target.value })}
                  placeholder="Refonte du site web"
                  className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                  required
                />
              </div>

              <div>
                <Label className="text-white">Type de projet</Label>
                <Input
                  value={requestData.projectType}
                  onChange={(e) => setRequestData({ ...requestData, projectType: e.target.value })}
                  placeholder="Site Web, Branding, etc."
                  className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                />
              </div>

              <div className="col-span-2">
                <Label className="text-white">Message personnalisÃ© (optionnel)</Label>
                <Textarea
                  value={requestData.message}
                  onChange={(e) => setRequestData({ ...requestData, message: e.target.value })}
                  placeholder="Ajoutez un message personnalisÃ© Ã  votre client..."
                  className="bg-black/40 border-[#CCFF00]/20 text-white placeholder:text-white/40"
                  rows={3}
                />
                <p className="text-xs text-white/40 mt-2">
                  ðŸ’¡ Un message par dÃ©faut sera envoyÃ© si vous laissez ce champ vide
                </p>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-white/80">
                  <p className="font-medium mb-1">ðŸ“§ L'email contiendra :</p>
                  <ul className="space-y-1 text-white/60">
                    <li>â€¢ Un lien direct pour laisser un avis</li>
                    <li>â€¢ Des instructions simples et claires</li>
                    <li>â€¢ Votre message personnalisÃ© (si ajoutÃ©)</li>
                    <li>â€¢ Un formulaire de notation 5 Ã©toiles</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-[#CCFF00]/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setRequestDialogOpen(false);
                  setRequestData({
                    clientName: "",
                    clientEmail: "",
                    projectName: "",
                    projectType: "",
                    message: ""
                  });
                }}
                className="border-[#CCFF00]/20 text-white hover:bg-white/5"
                disabled={sendingRequest}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90"
                disabled={sendingRequest}
              >
                {sendingRequest ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer la demande
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title={`Supprimer le tÃ©moignage de "${testimonialToDelete?.clientName}"?`}
        description="Cette action est irrÃ©versible. Le tÃ©moignage sera dÃ©finitivement supprimÃ©."
      />
    </div>
  );
}

