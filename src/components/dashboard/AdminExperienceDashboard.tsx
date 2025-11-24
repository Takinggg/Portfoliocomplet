import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/redesign/components/admin/AdminLayout";
import { DashboardOverview } from "@/redesign/components/admin/DashboardOverview";
import { CRMManager } from "@/redesign/components/admin/CRMManager";
import { FinanceManager } from "@/redesign/components/admin/FinanceManager";
import { CalendarManager } from "@/redesign/components/admin/CalendarManager";
import { ProjectManager } from "@/redesign/components/admin/ProjectManager";
import { ServiceManager } from "@/redesign/components/admin/ServiceManager";
import { MessageInbox } from "@/redesign/components/admin/MessageInbox";
import { ReviewsManager } from "@/redesign/components/admin/ReviewsManager";
import { BlogTabBilingual } from "@/components/dashboard/BlogTabBilingual";
import { CaseStudiesTab } from "@/components/dashboard/CaseStudiesTab";
import { redesignProjects, redesignServices } from "@/redesign/data";
import type {
  AdminView,
  Appointment,
  Client,
  Invoice,
  Message,
  Notification,
  Project,
  Quote,
  ServicePack,
} from "@/redesign/types";
import { createClient } from "@/utils/supabase/client";
import { API_BASE_URL } from "@/utils/supabase/info";
import {
  BilingualProject,
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/utils/unifiedDataService";

const supabase = createClient();

const uniqueId = (prefix: string) => (crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)) + `-${prefix}`;

const formatCurrency = (value?: number | string) => {
  const numeric = typeof value === "number" ? value : parseFloat(value || "0");
  if (!Number.isFinite(numeric)) return "€0";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(numeric);
};

const formatDate = (input?: string | Date | null) => {
  if (!input) return new Date().toISOString().slice(0, 10);
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
};

const normalizeClientStatus = (status?: string): Client["status"] => {
  if (!status) return "active";
  const normalized = status.toLowerCase();
  if (["lead", "prospect"].includes(normalized)) return "lead";
  if (["inactive", "lost"].includes(normalized)) return "inactive";
  if (["onboarding", "pending"].includes(normalized)) return "onboarding";
  return "active";
};

const normalizeQuoteStatus = (status?: string): Quote["status"] => {
  if (!status) return "draft";
  const normalized = status.toLowerCase();
  if (["sent", "pending"].includes(normalized)) return "sent";
  if (["accepted", "approved"].includes(normalized)) return "accepted";
  if (["rejected", "declined"].includes(normalized)) return "rejected";
  return "draft";
};

const normalizeInvoiceStatus = (status?: string): Invoice["status"] => {
  if (!status) return "pending";
  const normalized = status.toLowerCase();
  if (["paid", "settled"].includes(normalized)) return "paid";
  if (["overdue", "late"].includes(normalized)) return "overdue";
  return "pending";
};

const normalizeAppointmentType = (value?: string): Appointment["type"] => {
  if (!value) return "discovery";
  const normalized = value.toLowerCase();
  if (["review", "sprint"].includes(normalized)) return "review";
  if (["delivery", "handoff"].includes(normalized)) return "delivery";
  return "discovery";
};

type InternalClient = Client & { __source?: "clients" | "leads"; __recordId?: string | number; __raw?: any };
type InternalQuote = Quote & { __raw?: any };
type InternalInvoice = Invoice & { __raw?: any };
type InternalAppointment = Appointment & { __recordId?: string | number; __raw?: any };

type AdminExperienceDashboardProps = {
  onLogout: () => void;
};

const mapClients = (items: any[], source: "clients" | "leads"): InternalClient[] => {
  if (!Array.isArray(items)) return [];
  return items.map((entry, index) => {
    const baseId = entry?.id ?? entry?.clientId ?? uniqueId(`${source}-${index}`);
    return {
      id: baseId,
      name: entry?.name || entry?.display_name || entry?.clientName || "Client sans nom",
      company: entry?.company || entry?.business || entry?.organization || (source === "leads" ? "Lead" : "Client"),
      role: entry?.role || entry?.title || (source === "leads" ? "Lead" : "Stakeholder"),
      department: entry?.department || entry?.segment || "General",
      email: entry?.email || entry?.clientEmail || entry?.contact || "no-reply@example.com",
      status: source === "leads" ? "lead" : normalizeClientStatus(entry?.status),
      avatar: entry?.avatar,
      joinDate: formatDate(entry?.joinDate || entry?.created_at || entry?.createdAt),
      totalRevenue: typeof entry?.totalRevenue === "string"
        ? entry.totalRevenue
        : formatCurrency(entry?.totalRevenue ?? entry?.lifetime_value ?? entry?.revenue ?? 0),
      __source: source,
      __recordId: entry?.id ?? entry?.clientId ?? baseId,
      __raw: entry,
    };
  });
};

const mapQuotes = (items: any[]): InternalQuote[] => {
  if (!Array.isArray(items)) return [];
  return items.map((entry, index) => ({
    id: String(entry?.id ?? entry?.quote_id ?? uniqueId(`quote-${index}`)),
    clientId: entry?.clientId ?? entry?.client_id ?? entry?.customerId ?? "unknown",
    clientName: entry?.clientName || entry?.client_name || entry?.name || "Client",
    title: entry?.title || entry?.projectName || entry?.description || "Projet",
    amount: Number(entry?.amount ?? entry?.total ?? entry?.value ?? 0),
    status: normalizeQuoteStatus(entry?.status || entry?.quote_status),
    date: formatDate(entry?.date || entry?.created_at || entry?.createdAt),
    items: Array.isArray(entry?.items)
      ? entry.items
      : Array.isArray(entry?.metadata?.items)
        ? entry.metadata.items
        : [],
    __raw: entry,
  }));
};

const mapInvoices = (items: any[]): InternalInvoice[] => {
  if (!Array.isArray(items)) return [];
  return items.map((entry, index) => ({
    id: String(entry?.id ?? entry?.invoice_id ?? uniqueId(`invoice-${index}`)),
    quoteId: entry?.quoteId || entry?.quote_id,
    clientId: entry?.clientId ?? entry?.client_id ?? entry?.customerId ?? "unknown",
    clientName: entry?.clientName || entry?.client_name || entry?.name || "Client",
    amount: Number(entry?.amount ?? entry?.total ?? entry?.value ?? 0),
    status: normalizeInvoiceStatus(entry?.status || entry?.invoice_status),
    date: formatDate(entry?.date || entry?.created_at || entry?.createdAt),
    dueDate: formatDate(entry?.dueDate || entry?.due_date || entry?.payment_due),
    __raw: entry,
  }));
};

const mapAppointments = (items: any[]): InternalAppointment[] => {
  if (!Array.isArray(items)) return [];
  return items.map((entry, index) => {
    const startDate = entry?.date || entry?.bookingDate || entry?.created_at || entry?.start_time;
    return {
      id: entry?.id ?? entry?.booking_id ?? uniqueId(`booking-${index}`),
      clientId: entry?.clientId ?? entry?.client_id ?? entry?.leadId ?? entry?.customerId ?? "unknown",
      clientName: entry?.clientName || entry?.name || entry?.contact_name || "Client",
      title: entry?.title || entry?.serviceType || entry?.notes || "Rendez-vous",
      date: new Date(startDate || Date.now()).toISOString(),
      duration: Number(entry?.duration ?? entry?.length ?? 60),
      type: normalizeAppointmentType(entry?.type || entry?.serviceType),
      __recordId: entry?.id ?? entry?.booking_id,
      __raw: entry,
    };
  });
};

const mapMessages = (leads: any[]): Message[] => {
  if (!Array.isArray(leads)) return [];
  return leads.map((lead, index) => ({
    id: lead?.id ?? uniqueId(`message-${index}`),
    name: lead?.name || lead?.display_name || "Lead",
    email: lead?.email || lead?.contact || "no-reply@example.com",
    type: lead?.serviceType || lead?.source || "Lead",
    message: lead?.message || lead?.notes || lead?.description || "Demande de contact",
    date: new Date(lead?.created_at || Date.now()).toLocaleString("fr-FR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" }),
    status: "new",
  }));
};

const exportToCSV = (rows: Record<string, any>[], filename: string) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => headers.map((field) => JSON.stringify(row[field] ?? "")).join(",")),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const FALLBACK_PROJECT_IMAGE = "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=80";

const normalizeProjectCategory = (category?: string): BilingualProject["category_fr"] => {
  if (!category) return "other";
  const normalized = category.toLowerCase();
  if (normalized.includes("mobile")) return "mobile";
  if (normalized.includes("design")) return "design";
  if (normalized.includes("consult")) return "consulting";
  if (normalized.includes("web")) return "web";
  return "other";
};

const mapBilingualProjectToProject = (project: BilingualProject): Project => ({
  id: project.id,
  title: project.name_fr || project.name_en || "Sans titre",
  title_en: project.name_en || project.name_fr || "",
  client: project.clientName || "Client confidentiel",
  category: project.category_fr || project.category_en || "Projet",
  image: project.imageUrl || FALLBACK_PROJECT_IMAGE,
  link: project.projectUrl || project.githubUrl || "#",
  year: project.startDate?.slice(0, 4),
  description: project.description_fr || "",
  description_en: project.description_en || project.description_fr || "",
  challenge: project.challenges_fr,
  challenge_en: project.challenges_en,
  solution: project.solutions_fr,
  solution_en: project.solutions_en,
  tags: project.tags_fr?.length ? project.tags_fr : project.tags_en || [],
  techStack: project.technologies?.map((tech) => ({ name: tech, category: "Stack" })),
  stats: project.results_fr
    ? [
        {
          label: project.results_en || "Résultats",
          value: project.results_fr,
        },
      ]
    : undefined,
  gallery: project.imageGallery,
});

const buildBilingualProjectPayload = (
  project: Partial<Project>,
  existing?: BilingualProject
): Omit<BilingualProject, "id" | "createdAt" | "updatedAt"> => {
  const normalizedCategory = normalizeProjectCategory(project.category || existing?.category_fr);
  const tags = project.tags && project.tags.length > 0
    ? project.tags
    : existing?.tags_fr || existing?.tags_en || [];
  const technologies = project.techStack?.map((tech) => tech.name) ?? existing?.technologies ?? [];
  const kpi = project.stats?.[0];
  const nowIso = new Date().toISOString();

  return {
    name_fr: project.title || existing?.name_fr || "Sans titre",
    name_en: project.title_en || project.title || existing?.name_en || "Untitled project",
    description_fr: project.description ?? existing?.description_fr ?? "",
    description_en: project.description_en ?? existing?.description_en ?? "",
    tags_fr: tags,
    tags_en: tags,
    duration_fr: existing?.duration_fr,
    duration_en: existing?.duration_en,
    challenges_fr: project.challenge ?? existing?.challenges_fr,
    challenges_en: project.challenge_en ?? existing?.challenges_en,
    solutions_fr: project.solution ?? existing?.solutions_fr,
    solutions_en: project.solution_en ?? existing?.solutions_en,
    results_fr: kpi?.value ?? existing?.results_fr,
    results_en: kpi?.label ?? existing?.results_en,
    category_fr: normalizedCategory,
    category_en: normalizedCategory,
    clientId: existing?.clientId,
    clientName: project.client ?? existing?.clientName ?? "Client confidentiel",
    status: existing?.status ?? "completed",
    budget: existing?.budget,
    spent: existing?.spent,
    startDate: existing?.startDate ?? nowIso,
    endDate: existing?.endDate,
    imageUrl: project.image ?? existing?.imageUrl ?? FALLBACK_PROJECT_IMAGE,
    isPinned: existing?.isPinned ?? false,
    technologies,
    projectUrl: project.link ?? existing?.projectUrl,
    githubUrl: existing?.githubUrl,
    imageGallery: project.gallery ?? existing?.imageGallery,
    testimonial: existing?.testimonial,
  };
};

export default function AdminExperienceDashboard({ onLogout }: AdminExperienceDashboardProps) {
  const [adminView, setAdminView] = useState<AdminView>("overview");
  const [clients, setClients] = useState<InternalClient[]>([]);
  const [quotes, setQuotes] = useState<InternalQuote[]>([]);
  const [invoices, setInvoices] = useState<InternalInvoice[]>([]);
  const [appointments, setAppointments] = useState<InternalAppointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>(() => JSON.parse(JSON.stringify(redesignProjects)));
  const [projectRecords, setProjectRecords] = useState<Record<string, BilingualProject>>({});
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [services, setServices] = useState<ServicePack[]>(() => JSON.parse(JSON.stringify(redesignServices)));
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addNotification = useCallback((message: string, type: Notification["type"] = "success") => {
    const id = uniqueId("notif");
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, 3500);
  }, []);

  const ensureSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw new Error("Session Supabase requise");
    }
    return data.session;
  }, []);

  const fetchCollection = useCallback(async (resource: string, token: string, key: string) => {
    const response = await fetch(`${API_BASE_URL}/${resource}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return [];
    const payload = await response.json().catch(() => ({}));
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.[key])) return payload[key];
    return [];
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const session = await ensureSession();
      const token = session.access_token;
      const [clientPayload, quotePayload, invoicePayload, bookingPayload, leadPayload] = await Promise.all([
        fetchCollection("clients", token, "clients"),
        fetchCollection("quotes", token, "quotes"),
        fetchCollection("invoices", token, "invoices"),
        fetchCollection("bookings", token, "bookings"),
        fetchCollection("leads", token, "leads"),
      ]);

      const normalizedClients = [...mapClients(clientPayload, "clients"), ...mapClients(leadPayload, "leads")];
      setClients(normalizedClients);
      setQuotes(mapQuotes(quotePayload));
      setInvoices(mapInvoices(invoicePayload));
      setAppointments(mapAppointments(bookingPayload));
      setMessages((prev) => {
        const statusMap = new Map(prev.map((msg) => [msg.id, msg.status]));
        const derived = mapMessages(leadPayload);
        if (!derived.length) return prev;
        return derived.map((msg) => ({ ...msg, status: statusMap.get(msg.id) ?? msg.status }));
      });
    } catch (err) {
      console.error("Failed to load dashboard", err);
      setError((err as Error).message || "Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  }, [ensureSession, fetchCollection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshPortfolio = useCallback(async () => {
    try {
      setPortfolioLoading(true);
      const remoteProjects = await fetchProjects();
      const recordMap: Record<string, BilingualProject> = {};
      remoteProjects.forEach((project) => {
        recordMap[project.id] = project;
      });
      setProjectRecords(recordMap);
      setProjects(remoteProjects.map(mapBilingualProjectToProject));
    } catch (err) {
      console.error("Failed to load portfolio projects", err);
      addNotification("Impossible de synchroniser les projets", "error");
    } finally {
      setPortfolioLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    refreshPortfolio();
  }, [refreshPortfolio]);

  const persistEntity = useCallback(
    async (resource: string, payload: Record<string, any>, id?: string | number | null) => {
      const session = await ensureSession();
      const response = await fetch(`${API_BASE_URL}/${resource}${id ? `/${id}` : ""}`, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.message || `Action ${resource} impossible`);
      }
      return response.json().catch(() => ({}));
    },
    [ensureSession]
  );

  const deleteEntity = useCallback(
    async (resource: string, id?: string | number) => {
      if (!id) return;
      const session = await ensureSession();
      const response = await fetch(`${API_BASE_URL}/${resource}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.message || `Suppression ${resource} impossible`);
      }
    },
    [ensureSession]
  );

  const handleAddOrUpdateClient = useCallback(
    async (data: any, id?: Client["id"]) => {
      const payload = {
        name: data.name,
        email: data.email,
        company: data.company,
        role: data.role,
        department: data.department,
        status: data.status || "active",
      };
      await persistEntity("clients", payload, id ?? undefined);
      addNotification(id ? "Client mis à jour" : "Client ajouté");
      fetchData();
    },
    [persistEntity, fetchData, addNotification]
  );

  const handleDeleteClient = useCallback(
    async (id: Client["id"]) => {
      const record = clients.find((client) => client.id === id);
      const resource = record?.__source === "leads" ? "leads" : "clients";
      await deleteEntity(resource, record?.__recordId ?? id);
      addNotification("Contact supprimé", "info");
      fetchData();
    },
    [clients, deleteEntity, fetchData, addNotification]
  );

  const handleConvertLead = useCallback(
    async (id: Client["id"]) => {
      const lead = clients.find((client) => client.id === id && client.__source === "leads");
      if (!lead) {
        addNotification("Aucun lead trouvé", "error");
        return;
      }
      const payload = {
        name: lead.name,
        email: lead.email,
        company: lead.company,
        role: lead.role,
        department: lead.department,
        status: "active",
        sourceLeadId: lead.__recordId ?? lead.id,
      };
      await persistEntity("clients", payload);
      if (lead.__recordId) {
        await deleteEntity("leads", lead.__recordId);
      }
      addNotification("Lead converti en client");
      fetchData();
    },
    [clients, deleteEntity, fetchData, persistEntity, addNotification]
  );

  const handleAddQuote = useCallback(
    async (quote: any) => {
      const payload = {
        ...quote,
        amount: Number(quote.amount),
        status: quote.status || "draft",
      };
      await persistEntity("quotes", payload);
      addNotification("Devis créé");
      fetchData();
    },
    [persistEntity, fetchData, addNotification]
  );

  const handleUpdateQuoteStatus = useCallback(
    async (id: Quote["id"], status: Quote["status"]) => {
      const target = quotes.find((quote) => quote.id === id);
      if (!target) return;
      await persistEntity("quotes", { ...(target.__raw ?? target), status }, id);
      addNotification("Statut du devis mis à jour");
      fetchData();
    },
    [quotes, persistEntity, fetchData, addNotification]
  );

  const handleDeleteQuote = useCallback(
    async (id: Quote["id"]) => {
      await deleteEntity("quotes", id);
      addNotification("Devis supprimé", "info");
      fetchData();
    },
    [deleteEntity, fetchData, addNotification]
  );

  const handleConvertQuoteToInvoice = useCallback(
    async (quote: Quote) => {
      try {
        const payload = {
          clientId: quote.clientId,
          clientName: quote.clientName,
          total: quote.amount,
          amount: quote.amount,
          status: "pending",
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: { sourceQuoteId: quote.id },
        };
        await persistEntity("invoices", payload);
        addNotification("Facture créée");
        fetchData();
      } catch (err) {
        addNotification((err as Error).message ?? "Erreur conversion", "error");
      }
    },
    [persistEntity, fetchData, addNotification]
  );

  const handleUpdateInvoiceStatus = useCallback(
    async (id: Invoice["id"], status: Invoice["status"]) => {
      const target = invoices.find((invoice) => invoice.id === id);
      if (!target) return;
      await persistEntity("invoices", { ...(target.__raw ?? target), status }, id);
      addNotification("Statut facture mis à jour");
      fetchData();
    },
    [invoices, persistEntity, fetchData, addNotification]
  );

  const handleDeleteInvoice = useCallback(
    async (id: Invoice["id"]) => {
      await deleteEntity("invoices", id);
      addNotification("Facture supprimée", "info");
      fetchData();
    },
    [deleteEntity, fetchData, addNotification]
  );

  const handleAddAppointment = useCallback(
    async (apt: Appointment) => {
      const start = new Date(apt.date);
      const payload = {
        clientId: apt.clientId,
        clientName: apt.clientName,
        name: apt.clientName || apt.title,
        title: apt.title,
        date: start.toISOString(),
        time: start.toISOString(),
        duration: apt.duration,
        serviceType: apt.type,
        status: "confirmed",
      };
      await persistEntity("bookings", payload);
      addNotification("Rendez-vous ajouté");
      fetchData();
    },
    [persistEntity, fetchData, addNotification]
  );

  const handleDeleteAppointment = useCallback(
    async (id: Appointment["id"]) => {
      const record = appointments.find((apt) => apt.id === id);
      await deleteEntity("bookings", record?.__recordId ?? id);
      addNotification("Rendez-vous supprimé", "info");
      fetchData();
    },
    [appointments, deleteEntity, fetchData, addNotification]
  );

  const handleExportClients = useCallback(
    (data: Client[], filename: string) => {
      const sanitized = data.map(({ name, email, company, role, department, status, joinDate, totalRevenue }) => ({
        name,
        email,
        company,
        role,
        department,
        status,
        joinDate,
        totalRevenue,
      }));
      exportToCSV(sanitized, filename);
      addNotification("Export téléchargé");
    },
    [addNotification]
  );

  const handleSaveProject = useCallback(
    async (payload: Partial<Project>, editingId?: Project["id"] | null) => {
      try {
        setPortfolioLoading(true);
        const session = await ensureSession();
        if (editingId) {
          const remoteId = String(editingId);
          const existing = projectRecords[remoteId];
          const updates = buildBilingualProjectPayload(payload, existing);
          const updated = await updateProject(remoteId, updates, session.access_token);
          setProjectRecords((prev) => ({ ...prev, [remoteId]: updated }));
          setProjects((prev) =>
            prev.map((project) => (String(project.id) === remoteId ? mapBilingualProjectToProject(updated) : project))
          );
          addNotification("Projet mis à jour");
        } else {
          const body = buildBilingualProjectPayload(payload);
          const created = await createProject(body, session.access_token);
          setProjectRecords((prev) => ({ ...prev, [created.id]: created }));
          setProjects((prev) => [...prev, mapBilingualProjectToProject(created)]);
          addNotification("Projet ajouté");
        }
      } catch (err) {
        console.error("Portfolio save error", err);
        addNotification((err as Error).message || "Impossible d'enregistrer le projet", "error");
        throw err;
      } finally {
        setPortfolioLoading(false);
      }
    },
    [ensureSession, projectRecords, addNotification]
  );

  const handleDeleteProject = useCallback(
    async (id: Project["id"]) => {
      try {
        setPortfolioLoading(true);
        const session = await ensureSession();
        const remoteId = String(id);
        await deleteProject(remoteId, session.access_token);
        setProjectRecords((prev) => {
          const next = { ...prev };
          delete next[remoteId];
          return next;
        });
        setProjects((prev) => prev.filter((project) => String(project.id) !== remoteId));
        addNotification("Projet supprimé", "info");
      } catch (err) {
        console.error("Portfolio delete error", err);
        addNotification((err as Error).message || "Impossible de supprimer le projet", "error");
        throw err;
      } finally {
        setPortfolioLoading(false);
      }
    },
    [ensureSession, addNotification]
  );

  const visibleClients = clients as Client[];
  const visibleQuotes = quotes as Quote[];
  const visibleInvoices = invoices as Invoice[];
  const visibleAppointments = appointments as Appointment[];

  const content = useMemo(() => {
    if (loading && !visibleClients.length && !visibleQuotes.length) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="space-y-3 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-white" />
            <p className="text-sm text-white/60">Chargement du back-office…</p>
          </div>
        </div>
      );
    }

    return (
      <>
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {adminView === "overview" && (
          <DashboardOverview
            clients={visibleClients}
            quotes={visibleQuotes}
            invoices={visibleInvoices}
            onAddClient={(payload) => handleAddOrUpdateClient(payload)}
            onUpdateClient={(id, payload) => handleAddOrUpdateClient(payload, id)}
            onDeleteClient={handleDeleteClient}
            onExport={(rows, filename) => handleExportClients(rows as Client[], filename)}
          />
        )}

        {adminView === "crm" && (
          <CRMManager
            clients={visibleClients}
            onAddClient={(payload) => handleAddOrUpdateClient(payload)}
            onUpdateClient={(id, payload) => handleAddOrUpdateClient(payload, id)}
            onDeleteClient={handleDeleteClient}
            onConvertLead={handleConvertLead}
          />
        )}

        {adminView === "finance" && (
          <FinanceManager
            clients={visibleClients}
            quotes={visibleQuotes}
            invoices={visibleInvoices}
            onAddQuote={handleAddQuote}
            onUpdateQuoteStatus={handleUpdateQuoteStatus}
            onDeleteQuote={handleDeleteQuote}
            onConvertToInvoice={handleConvertQuoteToInvoice}
            onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            onDeleteInvoice={handleDeleteInvoice}
            onDownload={(id) => addNotification(`Téléchargement ${id}`, "info")}
          />
        )}

        {adminView === "calendar" && (
          <CalendarManager
            appointments={visibleAppointments}
            clients={visibleClients}
            onAddAppointment={handleAddAppointment}
            onDeleteAppointment={handleDeleteAppointment}
          />
        )}

        {adminView === "projects" && (
          <ProjectManager
            title="Portfolio"
            projects={projects}
            setProjects={setProjects}
            onSaveProject={handleSaveProject}
            onDeleteProject={handleDeleteProject}
            loading={portfolioLoading}
          />
        )}

        {adminView === "casestudies" && <CaseStudiesTab onRefresh={refreshPortfolio} />}

        {adminView === "blog" && <BlogTabBilingual />}
  {adminView === "services" && <ServiceManager services={services} setServices={setServices} />}

  {adminView === "reviews" && <ReviewsManager />}

  {adminView === "messages" && <MessageInbox messages={messages} setMessages={setMessages} />}
      </>
    );
  }, [
    loading,
    error,
    adminView,
    visibleClients,
    visibleQuotes,
    visibleInvoices,
    visibleAppointments,
    projects,
    portfolioLoading,
    services,
    messages,
    handleAddOrUpdateClient,
    handleDeleteClient,
    handleExportClients,
    handleConvertLead,
    handleAddQuote,
    handleUpdateQuoteStatus,
    handleDeleteQuote,
    handleConvertQuoteToInvoice,
    handleUpdateInvoiceStatus,
    handleDeleteInvoice,
    handleAddAppointment,
    handleDeleteAppointment,
    refreshPortfolio,
    handleSaveProject,
    handleDeleteProject,
    addNotification,
  ]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      <AdminLayout currentView={adminView} onChangeView={setAdminView} onLogout={onLogout}>
        {content}
      </AdminLayout>

      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm font-semibold shadow-2xl ${
              notif.type === "error"
                ? "border-red-500/30 bg-red-500/10 text-red-200"
                : notif.type === "info"
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-[#CCFF00]/30 bg-[#CCFF00]/10 text-[#CCFF00]"
            }`}
          >
            {notif.message}
          </div>
        ))}
      </div>
    </div>
  );
}
