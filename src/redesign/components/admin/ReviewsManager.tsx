import React, { useEffect, useMemo, useState } from "react";
import {
  Star,
  Sparkles,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Mail,
  Send,
  Check,
  Loader2,
  Quote,
  ShieldCheck,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { API_BASE_URL } from "@/utils/supabase/info";

type Review = {
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
  featured?: boolean;
  approved?: boolean;
  createdAt?: string;
};

const supabase = createClient();

const emptyForm: Review = {
  id: "",
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
  date: new Date().toISOString().slice(0, 10),
  linkedinUrl: "",
  featured: true,
  approved: true,
};

const ratingOptions = [5, 4, 3, 2, 1];
const inputClasses = "w-full rounded-xl bg-black/30 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition";

const buildHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const ReviewsManager: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'pending' | 'featured'>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [requestSending, setRequestSending] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [requestData, setRequestData] = useState({
    clientName: "",
    clientEmail: "",
    projectName: "",
    projectType: "",
    message: "",
  });

  const loadReviews = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Session requise");
      const response = await fetch(`${API_BASE_URL}/testimonials/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      setReviews((payload?.testimonials || payload || []).sort((a: Review, b: Review) =>
        new Date(b.date || b.createdAt || new Date()).getTime() -
        new Date(a.date || a.createdAt || new Date()).getTime()
      ));
    } catch (error) {
      console.error("Reviews load failed", error);
      toast.error((error as Error).message || "Chargement impossible");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const visibleReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesQuery =
        search.trim() === "" ||
        review.clientName.toLowerCase().includes(search.toLowerCase()) ||
        review.clientCompany.toLowerCase().includes(search.toLowerCase()) ||
        review.projectType.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && review.approved) ||
        (statusFilter === "pending" && !review.approved) ||
        (statusFilter === "featured" && review.featured);

      return matchesQuery && matchesStatus;
    });
  }, [reviews, search, statusFilter]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const published = reviews.filter((r) => r.approved).length;
    const featured = reviews.filter((r) => r.featured).length;
    const avg = total ? (reviews.reduce((acc, r) => acc + (r.rating ?? 5), 0) / total).toFixed(1) : "5.0";
    return { total, published, featured, avg };
  }, [reviews]);

  const openForm = (review?: Review) => {
    if (review) {
      setFormData({ ...review });
    } else {
      setFormData(emptyForm);
    }
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!formData.clientName.trim() || !formData.testimonial.trim()) {
      toast.error("Nom et témoignage requis");
      return;
    }

    setSaving(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Session requise");
      const payload = { ...formData, rating: Number(formData.rating) };
      const targetId = formData.id ? encodeURIComponent(formData.id) : "";
      const method = formData.id ? "PUT" : "POST";
      const url = `${API_BASE_URL}/testimonials${targetId ? `/${targetId}` : ""}`;
      const response = await fetch(url, {
        method,
        headers: buildHeaders(token),
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || `Echec ${method}`);
      }
      toast.success(formData.id ? "Avis mis à jour" : "Avis ajouté");
      setFormOpen(false);
      loadReviews();
    } catch (error) {
      console.error("Save review failed", error);
      toast.error((error as Error).message || "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Session requise");
      const response = await fetch(`${API_BASE_URL}/testimonials/${encodeURIComponent(deleteId)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok || !result?.success) throw new Error(result?.error || "Suppression impossible");
      toast.success("Avis supprimé");
      setDeleteId(null);
      loadReviews();
    } catch (error) {
      console.error("Delete review failed", error);
      toast.error((error as Error).message || "Suppression impossible");
    }
  };

  const toggleFlag = async (review: Review, key: "featured" | "approved") => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Session requise");
      const response = await fetch(`${API_BASE_URL}/testimonials/${encodeURIComponent(review.id)}`, {
        method: "PUT",
        headers: buildHeaders(token),
        body: JSON.stringify({ [key]: !review[key] }),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) throw new Error(result?.error || "Mise à jour impossible");
      loadReviews();
      toast.success(key === "approved" ? "Statut mis à jour" : "Mise en avant ajustée");
    } catch (error) {
      console.error("Toggle flag failed", error);
      toast.error((error as Error).message || "Action impossible");
    }
  };

  const handleRequest = async () => {
    if (!requestData.clientName || !requestData.clientEmail || !requestData.projectName) {
      toast.error("Champs requis manquants");
      return;
    }
    setRequestSending(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Session requise");
      const response = await fetch(`${API_BASE_URL}/testimonials/request`, {
        method: "POST",
        headers: buildHeaders(token),
        body: JSON.stringify(requestData),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) throw new Error(result?.error || "Envoi impossible");
      toast.success(`Demande envoyée à ${requestData.clientName}`);
      setRequestData({ clientName: "", clientEmail: "", projectName: "", projectType: "", message: "" });
      setRequestOpen(false);
    } catch (error) {
      console.error("Request review failed", error);
      toast.error((error as Error).message || "Envoi impossible");
    } finally {
      setRequestSending(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" onClick={() => setDeleteId(null)}>
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">Voix client</p>
          <h1 className="text-4xl font-display text-white mb-2">Avis & Preuves sociales</h1>
          <p className="text-white/60 max-w-2xl">Centralisez vos témoignages clients, publiez-les et demandez de nouveaux avis sans quitter le cockpit.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setRequestOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-white/15 rounded-xl text-sm text-white/80 hover:text-white hover:border-white/40"
          >
            <Send className="w-4 h-4" /> Demander un avis
          </button>
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold rounded-xl text-sm hover:bg-primary"
          >
            <Plus className="w-4 h-4" /> Nouveau témoignage
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Star className="w-5 h-5" />} label="Note moyenne" value={`${stats.avg}/5`} badge="+0.2" />
        <StatCard icon={<Sparkles className="w-5 h-5" />} label="Avis publiés" value={stats.published} badge={`${Math.round((stats.published / Math.max(stats.total, 1)) * 100)}%`} />
        <StatCard icon={<ShieldCheck className="w-5 h-5" />} label="En validation" value={stats.total - stats.published} badge={stats.total ? `${stats.total - stats.published} en attente` : "0"} />
        <StatCard icon={<Quote className="w-5 h-5" />} label="Mise en avant" value={stats.featured} badge="Hero & pages clés" />
      </div>

      <div className="border border-white/10 rounded-2xl bg-[#060606] p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un client, un projet"
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <div className="flex gap-2">
            {[
              { id: "all", label: "Tous" },
              { id: "published", label: "Publier" },
              { id: "pending", label: "En attente" },
              { id: "featured", label: "Mise en avant" },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setStatusFilter(option.id as typeof statusFilter)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest border transition-all ${
                  statusFilter === option.id
                    ? "bg-white text-black border-white"
                    : "border-white/10 text-white/50 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/60">
          <Filter className="w-4 h-4" />
          {visibleReviews.length} avis visibles · {stats.total} au total
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-white/40" />
        </div>
      ) : visibleReviews.length === 0 ? (
        <div className="border border-dashed border-white/15 rounded-2xl py-20 text-center">
          <p className="text-white/60">Aucun avis trouvé avec ce filtre.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {visibleReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#050505] border border-white/10 rounded-2xl p-6 space-y-4 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.8)]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 text-yellow-400">
                    {Array.from({ length: review.rating || 5 }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <h3 className="text-lg font-display text-white mt-2">{review.clientName}</h3>
                  <p className="text-sm text-white/60">
                    {review.clientRole} • {review.clientCompany}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFlag(review, "approved")}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      review.approved ? "border-green-400/40 text-green-300" : "border-white/20 text-white/50"
                    }`}
                  >
                    {review.approved ? "Publié" : "Brouillon"}
                  </button>
                  <button
                    onClick={() => toggleFlag(review, "featured")}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      review.featured ? "border-[#CCFF00] text-[#CCFF00]" : "border-white/20 text-white/50"
                    }`}
                  >
                    Hero
                  </button>
                </div>
              </div>
              <p className="text-white/80 text-sm leading-relaxed line-clamp-5">“{review.testimonial}”</p>
              <div className="flex items-center justify-between text-xs text-white/40">
                <span>{new Date(review.date).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => openForm(review)}
                    className="text-white/50 hover:text-white flex items-center gap-1 text-xs"
                  >
                    <Edit2 className="w-3 h-3" /> Modifier
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(review.id);
                    }}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 text-xs"
                  >
                    <Trash2 className="w-3 h-3" /> Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6" onClick={() => setFormOpen(false)}>
          <div className="bg-[#080808] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Formulaire</p>
                <h2 className="text-3xl font-display text-white">{formData.id ? "Modifier l'avis" : "Ajouter un avis"}</h2>
              </div>
              <button onClick={() => setFormOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Nom du client">
                  <input value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} className={inputClasses} />
                </Field>
                <Field label="Entreprise">
                  <input value={formData.clientCompany} onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })} className={inputClasses} />
                </Field>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Rôle / Poste">
                  <input value={formData.clientRole} onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })} className={inputClasses} />
                </Field>
                <Field label="Projet / Mission">
                  <input value={formData.projectType} onChange={(e) => setFormData({ ...formData, projectType: e.target.value })} className={inputClasses} />
                </Field>
              </div>
              <Field label="Citation (FR)">
                <textarea value={formData.testimonial} onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })} rows={4} className={inputClasses} />
              </Field>
              <Field label="Citation (EN)">
                <textarea value={formData.testimonial_en} onChange={(e) => setFormData({ ...formData, testimonial_en: e.target.value })} rows={3} className={inputClasses} />
              </Field>
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Note /5">
                  <select value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} className={inputClasses}>
                    {ratingOptions.map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Date">
                  <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={inputClasses} />
                </Field>
                <Field label="Lien LinkedIn">
                  <input value={formData.linkedinUrl} onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })} className={inputClasses} />
                </Field>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-white/70 text-sm">
                  <input type="checkbox" checked={!!formData.approved} onChange={(e) => setFormData({ ...formData, approved: e.target.checked })} />
                  Publier immédiatement
                </label>
                <label className="flex items-center gap-2 text-white/70 text-sm">
                  <input type="checkbox" checked={!!formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
                  Mettre en avant
                </label>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-primary transition-colors flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {formData.id ? "Mettre à jour" : "Publier l'avis"}
              </button>
            </div>
          </div>
        </div>
      )}

      {requestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6" onClick={() => setRequestOpen(false)}>
          <div className="bg-[#080808] border border-white/10 rounded-2xl w-full max-w-xl p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Automation</p>
                <h2 className="text-3xl font-display text-white">Demander un avis</h2>
              </div>
              <button onClick={() => setRequestOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <Field label="Nom du client">
                <input value={requestData.clientName} onChange={(e) => setRequestData({ ...requestData, clientName: e.target.value })} className={inputClasses} />
              </Field>
              <Field label="Email">
                <input type="email" value={requestData.clientEmail} onChange={(e) => setRequestData({ ...requestData, clientEmail: e.target.value })} className={inputClasses} />
              </Field>
              <Field label="Projet ou mission">
                <input value={requestData.projectName} onChange={(e) => setRequestData({ ...requestData, projectName: e.target.value })} className={inputClasses} />
              </Field>
              <Field label="Type de projet (optionnel)">
                <input value={requestData.projectType} onChange={(e) => setRequestData({ ...requestData, projectType: e.target.value })} className={inputClasses} />
              </Field>
              <Field label="Message personnalisé">
                <textarea value={requestData.message} onChange={(e) => setRequestData({ ...requestData, message: e.target.value })} rows={4} className={inputClasses} placeholder="Bonjour, pourrais-tu laisser un avis sur notre mission..." />
              </Field>
              <button
                onClick={handleRequest}
                disabled={requestSending}
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-primary transition-colors flex items-center justify-center gap-2"
              >
                {requestSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                Envoyer la demande
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-6" onClick={() => setDeleteId(null)}>
          <div className="bg-[#0B0B0B] border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-display text-white mb-2">Supprimer l'avis ?</h3>
            <p className="text-white/60 text-sm mb-6">Cette action est définitive et retirera l'avis des pages publiques.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 h-12 rounded-xl border border-white/10 text-white/70 hover:text-white">Annuler</button>
              <button onClick={handleDelete} className="flex-1 h-12 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-400">Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="text-sm text-white/70 space-y-2">
    <span className="block text-xs uppercase tracking-[0.3em] text-white/40">{label}</span>
    {children}
  </label>
);

const StatCard = ({ icon, label, value, badge }: { icon: React.ReactNode; label: string; value: string | number; badge?: string }) => (
  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">{icon}</div>
      {badge && <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">{badge}</span>}
    </div>
    <p className="text-3xl font-display text-white">{value}</p>
    <p className="text-sm text-white/50">{label}</p>
  </div>
);

