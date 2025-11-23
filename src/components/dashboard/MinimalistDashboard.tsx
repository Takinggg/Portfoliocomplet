import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRightLeft,
  Calendar,
  DollarSign,
  Edit,
  FileText,
  Layers,
  Mail,
  Plus,
  Receipt,
  Search,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { CalendarView } from "./CalendarView";
import { ContentTab } from "./ContentTab";
import { LeadEditDialog } from "./LeadEditDialog";
import { ClientEditDialog } from "./ClientEditDialog";
import { QuoteCreationDialog } from "./QuoteCreationDialog";
import { InvoiceCreationDialog } from "./InvoiceCreationDialog";
import { BookingEditDialog } from "./BookingEditDialog";
import { ItemDetailsModal } from "./ItemDetailsModal";
import { ViewTabs } from "./ui/ViewTabs";
import { DashboardHeader } from "./ui/DashboardHeader";
import { MetricCard } from "./ui/MetricCard";
import { PipelineItem, PipelineItemAction, PipelineStatus } from "./ui/PipelineItem";
import { createClient } from "@/utils/supabase/client";
import { API_BASE_URL, projectId } from "@/utils/supabase/info";

const supabase = createClient();

type DashboardView = "pipeline" | "calendar" | "analytics" | "content";
type PipelineFilter = "all" | "leads" | "clients" | "deals" | "invoices";
type ItemDetailsType = "lead" | "client" | "quote" | "invoice" | "booking";
type SidebarNavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  chip?: string;
};

interface MinimalistDashboardProps {
  onLogout: () => void;
}

const colors = {
  background: "radial-gradient(circle at top, rgba(12,12,12,1) 0%, rgba(5,5,5,1) 50%, rgba(0,0,0,1) 100%)",
};

const INTEGRATION_ROWS = [
  { application: "Stripe", type: "Finance", rate: "40%", profit: 650 },
  { application: "Zapier", type: "Automation", rate: "80%", profit: 720 },
  { application: "Supabase", type: "Backend", rate: "65%", profit: 540 },
  { application: "Resend", type: "Email", rate: "55%", profit: 410 },
];

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value ?? 0 : 0
  );

const parseDate = (input?: string | Date | null) => {
  if (!input) return new Date();
  if (input instanceof Date) return input;
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

export default function MinimalistDashboard({ onLogout }: MinimalistDashboardProps) {
  const [leads, setLeads] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView>("pipeline");
  const [activeFilter, setActiveFilter] = useState<PipelineFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [leadDialogOpen, setLeadDialogOpen] = useState(false);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any | null>(null);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [editingQuote, setEditingQuote] = useState<any | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<any | null>(null);
  const [editingBooking, setEditingBooking] = useState<any | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<ItemDetailsType>("lead");

  const ensureSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      alert("Vous devez être connecté pour effectuer cette action");
      throw new Error("Session required");
    }
    return data.session;
  }, []);

  const fetchCollection = useCallback(async (resource: string, token: string, key: string) => {
    const response = await fetch(`${API_BASE_URL}/${resource}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return [];
    }

    const payload = await response.json().catch(() => ({}));
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.[key])) return payload[key];
    return [];
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        setLoading(false);
        return;
      }

      const token = session.access_token;
      const [leadsData, clientsData, quotesData, invoicesData, bookingsData] = await Promise.all([
        fetchCollection("leads", token, "leads"),
        fetchCollection("clients", token, "clients"),
        fetchCollection("quotes", token, "quotes"),
        fetchCollection("invoices", token, "invoices"),
        fetchCollection("bookings", token, "bookings"),
      ]);

      setLeads(leadsData);
      setClients(clientsData);
      setQuotes(quotesData);
      setInvoices(invoicesData);
      setBookings(bookingsData);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  }, [fetchCollection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const persistEntity = useCallback(
    async (resource: string, payload: any, id?: string | null) => {
      try {
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
          const error = await response.json().catch(() => ({}));
          throw new Error(error.message || "Erreur lors de l'enregistrement");
        }

        await fetchData();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [ensureSession, fetchData]
  );

  const handleSaveLead = async (leadData: any) => {
    const id = leadData.id || editingLead?.id || null;
    await persistEntity("leads", leadData, id);
    setEditingLead(null);
  };

  const handleSaveQuote = async (quoteData: any) => {
    const id = quoteData.id || editingQuote?.id || null;
    await persistEntity("quotes", quoteData, id);
    setEditingQuote(null);
  };

  const handleSaveBooking = async (bookingData: any) => {
    const id = bookingData.id || editingBooking?.id || null;
    await persistEntity("bookings", bookingData, id);
    setEditingBooking(null);
  };

  const handleCreateInvoiceFromQuote = async (quote: any, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const session = await ensureSession();
      const invoicePayload = {
        clientId: quote.clientId || quote.client_id,
        clientName: quote.clientName || quote.client_name,
        clientEmail: quote.clientEmail || quote.client_email,
        clientAddress: quote.clientAddress || quote.client_address,
        items: quote.metadata?.items || quote.items || [],
        total: quote.amount || quote.total || 0,
        status: "pending",
        sourceQuoteId: quote.id,
      };

      const response = await fetch(`${API_BASE_URL}/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(invoicePayload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Erreur lors de la création de la facture");
      }

      alert("Facture créée avec succès à partir du devis !");
      fetchData();
    } catch (error: any) {
      alert(error.message || "Impossible de créer la facture");
    }
  };

  const handleItemClick = (item: any) => {
    if (!item) return;
    const type = (item.type || "lead") as ItemDetailsType;
    handleOpenDetails(item, type);
  };

  const handleNewClick = () => {
    if (activeView === "calendar") {
      // CrÃ©er un nouveau rendez-vous
      setEditingBooking(null);
      setBookingDialogOpen(true);
    } else if (activeFilter === "leads") {
      setEditingLead(null);
      setLeadDialogOpen(true);
    } else if (activeFilter === "clients") {
      setEditingClient(null);
      setClientDialogOpen(true);
    } else if (activeFilter === "deals") {
      setEditingQuote(null);
      setQuoteDialogOpen(true);
    } else if (activeFilter === "invoices") {
      setEditingInvoice(null);
      setInvoiceDialogOpen(true);
    } else {
      // Par dÃ©faut, crÃ©er un lead
      setEditingLead(null);
      setLeadDialogOpen(true);
    }
  };

  const handleDeleteItem = async (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const displayName = item.display_name || item.name || 'cet Ã©lÃ©ment';
    if (!confirm(`Voulez-vous vraiment supprimer "${displayName}" ?`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Vous devez Ãªtre connectÃ© pour supprimer un Ã©lÃ©ment");
        return;
      }

      let url = "";
      if (item.type === "lead") {
        url = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads/${item.id}`;
      } else if (item.type === "client") {
        url = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients/${item.id}`;
      } else if (item.type === "quote") {
        url = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes/${item.id}`;
      } else if (item.type === "invoice") {
        url = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/invoices/${item.id}`;
      } else if (item.type === "booking") {
        url = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/bookings/${item.id}`;
      }

      console.log("ðŸ—‘ï¸ DELETE Request:", { 
        type: item.type, 
        id: item.id, 
        url,
        fullItem: item 
      });

      const response = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      console.log("ðŸ—‘ï¸ DELETE Response:", { 
        ok: response.ok, 
        status: response.status,
        statusText: response.statusText
      });

      if (response.ok) {
        const result = await response.json();
        console.log("âœ… DELETE Success - Full response:", result);
        console.log("ðŸ“ Deleted key was:", result.deletedKey);
        console.log("ðŸ” Was found before delete:", result.wasFound);
        
        // Suppression locale immÃ©diate
        if (item.type === "lead") {
          setLeads(leads.filter(l => l.id !== item.id));
        } else if (item.type === "client") {
          setClients(clients.filter(c => c.id !== item.id));
        } else if (item.type === "quote") {
          setQuotes(quotes.filter(q => q.id !== item.id));
        } else if (item.type === "invoice") {
          setInvoices(invoices.filter(i => i.id !== item.id));
        } else if (item.type === "booking") {
          setBookings(bookings.filter(b => b.id !== item.id));
        }
        
        // NE PAS rafraÃ®chir pour Ã©viter que l'Ã©lÃ©ment revienne
        // await fetchData();
      } else {
        const error = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
        alert(`Erreur lors de la suppression: ${error.message || response.statusText}`);
      }
    } catch (error: any) {
      console.error("Erreur suppression:", error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // ADMIN: Supprimer TOUS les bookings
  const handleDeleteAllBookings = async () => {
    if (!confirm(`âš ï¸ ATTENTION ! Voulez-vous vraiment supprimer TOUS les ${bookings.length} rendez-vous ?\n\nCette action est irrÃ©versible !`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Vous devez Ãªtre connectÃ©");
        return;
      }

      const url = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/bookings`;
      console.log("ðŸ—‘ï¸ DELETE ALL bookings request");

      const response = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        const result = await response.json();
        console.log("âœ… All bookings deleted:", result);
        setBookings([]);
        alert(`âœ… ${result.count} rendez-vous supprimÃ©s avec succÃ¨s !`);
      } else {
        const error = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
        alert(`Erreur: ${error.message || response.statusText}`);
      }
    } catch (error: any) {
      console.error("Erreur suppression totale:", error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // Convertir un booking en client
  const handleConvertBookingToClient = async (booking: any) => {
    if (!booking) return;
    if (!confirm(`Convertir "${booking.name || booking.email}" en client ?`)) return;

    if (!booking.email) {
      alert("Impossible de créer un client sans email");
      return;
    }

    try {
      const session = await ensureSession();
      const clientPayload = {
        name: booking.name || "Client sans nom",
        email: booking.email,
        phone: booking.phone || "",
        company: booking.company || booking.serviceType || "",
        address: booking.address || "",
        status: "active",
        notes: booking.notes || "",
        tags: booking.tags || booking.services || [],
        metadata: {
          source: "booking",
          bookingId: booking.id,
          bookingDate: booking.date,
          bookingTime: booking.time,
          serviceType: booking.serviceType,
          budget: booking.budget,
        },
      };

      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(clientPayload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Erreur lors de la conversion du rendez-vous");
      }

      alert("Client créé avec succès à partir du rendez-vous");
      await fetchData();
    } catch (error: any) {
      console.error("Erreur conversion booking:", error);
      alert(error.message || "Impossible de convertir ce rendez-vous");
    }
  };

  // Transformer un devis en facture (le devis est supprimÃ©)
  const handleConvertQuoteToInvoice = async (quote: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log("ðŸ”„ Quote to convert:", quote);
    
    const quoteName = quote.clientName || quote.client_name || quote.name || 'Sans nom';
    if (!confirm(`Transformer le devis "${quoteName}" en facture ?\n\nâš ï¸ Le devis sera supprimÃ© et remplacÃ© par une facture.`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Vous devez Ãªtre connectÃ©");
        return;
      }

      // Extraire les donnÃ©es du devis en gÃ©rant plusieurs formats possibles
      const clientId = quote.clientId || quote.client_id;
      const clientName = quote.clientName || quote.client_name || quote.name;
      const clientEmail = quote.clientEmail || quote.client_email || quote.email;
      const clientAddress = quote.clientAddress || quote.client_address || quote.address;
      
      // Pour les items et le montant
      const items = quote.items || quote.metadata?.items || [];
      const amount = quote.amount || quote.total || quote.value || 0;
      
      if (!clientId || !clientName || !clientEmail) {
        alert("âš ï¸ Informations client manquantes dans le devis");
        console.error("Missing client info:", { clientId, clientName, clientEmail });
        return;
      }

      // 1. CrÃ©er la facture
      const invoiceData = {
        clientId,
        clientName,
        clientEmail,
        clientAddress,
        items: items,
        total: amount,
        status: 'pending',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes: quote.description || quote.notes || "",
        metadata: {
          ...(quote.metadata || {}),
          convertedFromQuoteId: quote.id,
          convertedFromQuoteNumber: quote.number || quote.quoteNumber,
          convertedAt: new Date().toISOString()
        }
      };

      console.log("ðŸ’° Converting to invoice with data:", invoiceData);

      const createResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/invoices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`
          },
          body: JSON.stringify(invoiceData)
        }
      );

      if (!createResponse.ok) {
        const error = await createResponse.json().catch(() => ({ message: 'Erreur inconnue' }));
        console.error("âŒ Error creating invoice:", error);
        alert(`Erreur crÃ©ation facture: ${error.error || error.message || createResponse.statusText}`);
        return;
      }

      const invoiceResult = await createResponse.json();
      console.log("âœ… Invoice created:", invoiceResult);

      // 2. Supprimer le devis
      const deleteResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes/${quote.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session.access_token}` }
        }
      );

      if (deleteResponse.ok) {
        console.log("âœ… Quote deleted:", quote.id);
        alert("âœ… Devis transformÃ© en facture !");
        await fetchData();
      } else {
        console.warn("âš ï¸ Invoice created but quote deletion failed");
        alert("âš ï¸ Facture crÃ©Ã©e mais erreur lors de la suppression du devis. Veuillez supprimer le devis manuellement.");
        await fetchData();
      }
    } catch (error: any) {
      console.error("âŒ Erreur conversion:", error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // Ouvrir le modal de dÃ©tails
  const handleOpenDetails = (item: any, type: ItemDetailsType) => {
    setSelectedItem(item);
    setSelectedItemType(type);
    setDetailsModalOpen(true);
  };

  // Formater la date du dernier email envoyÃ©
  const formatLastEmailSent = (lastEmailSent: string | null | undefined): string => {
    if (!lastEmailSent) return '';
    
    const now = new Date();
    const sent = new Date(lastEmailSent);
    const diffMs = now.getTime() - sent.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return "Ã€ l'instant";
    if (diffMins < 60) return `il y a ${diffMins}min`;
    if (diffHours < 24) return `il y a ${diffHours}h`;
    if (diffDays === 1) return "hier";
    if (diffDays < 7) return `il y a ${diffDays}j`;
    if (diffDays < 30) return `il y a ${Math.floor(diffDays / 7)}sem`;
    return `il y a ${Math.floor(diffDays / 30)}mois`;
  };

  // Envoyer un devis par email
  const handleSendQuoteEmail = async (quote: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const clientEmail = quote.clientEmail || quote.client_email || quote.email;
    const clientName = quote.clientName || quote.client_name || quote.name || 'Client';
    
    if (!clientEmail) {
      alert("âš ï¸ Aucun email client trouvÃ© pour ce devis");
      return;
    }
    
    if (!confirm(`Envoyer le devis Ã  ${clientEmail} ?`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Vous devez Ãªtre connectÃ©");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes/${quote.id}/send-reminder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`
          }
        }
      );

      if (response.ok) {
        // Mettre Ã  jour la date d'envoi
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes/${quote.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
              ...quote,
              lastEmailSent: new Date().toISOString()
            })
          }
        );
        
        // Notification de succÃ¨s stylÃ©e
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 z-50 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-sm animate-in slide-in-from-top-5';
        notification.innerHTML = `
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <p class="font-semibold">Email envoyÃ© avec succÃ¨s !</p>
              <p class="text-sm text-green-400/70">Devis envoyÃ© Ã  ${clientEmail}</p>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
        
        // Recharger les donnÃ©es
        fetchData();
      } else {
        const error = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
        alert(`Erreur: ${error.error || error.message || response.statusText}`);
      }
    } catch (error: any) {
      console.error("âŒ Erreur envoi email:", error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // Envoyer une facture par email
  const handleSendInvoiceEmail = async (invoice: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const clientEmail = invoice.clientEmail || invoice.client_email || invoice.email;
    const clientName = invoice.clientName || invoice.client_name || invoice.name || 'Client';
    
    if (!clientEmail) {
      alert("âš ï¸ Aucun email client trouvÃ© pour cette facture");
      return;
    }
    
    if (!confirm(`Envoyer la facture Ã  ${clientEmail} ?`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Vous devez Ãªtre connectÃ©");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/invoices/${invoice.id}/send-reminder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`
          }
        }
      );

      if (response.ok) {
        // Mettre Ã  jour la date d'envoi
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/invoices/${invoice.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
              ...invoice,
              lastEmailSent: new Date().toISOString()
            })
          }
        );
        
        // Notification de succÃ¨s stylÃ©e
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 z-50 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-sm animate-in slide-in-from-top-5';
        notification.innerHTML = `
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <p class="font-semibold">Email envoyÃ© avec succÃ¨s !</p>
              <p class="text-sm text-green-400/70">Facture envoyÃ©e Ã  ${clientEmail}</p>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
        
        // Recharger les donnÃ©es
        fetchData();
      } else {
        const error = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
        alert(`Erreur: ${error.error || error.message || response.statusText}`);
      }
    } catch (error: any) {
      console.error("âŒ Erreur envoi email:", error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // Combiner tous les items
  const allItems = [
    ...leads.map(l => ({ 
      ...l, 
      type: "lead", 
      value: l.value || 2500,
      display_name: l.name,
      display_info: l.email || l.status || 'N/A',
      interests: l.interests || []
    })),
    ...bookings.map(b => ({
      ...b,
      type: "booking",
      value: 0,
      display_name: b.name,
      display_info: `${b.date} Ã  ${b.time} - ${b.service || 'RDV'}`,
      status: b.status || 'pending'
    })),
    ...clients.map(c => ({ 
      ...c, 
      type: "client", 
      value: c.revenue || 0,
      display_name: c.name,
      display_info: c.email || 'N/A'
    })),
    ...quotes.map(q => {
      const statusMap: Record<string, string> = {
        'draft': 'ðŸ“ Brouillon',
        'sent': 'ðŸ“¤ EnvoyÃ©',
        'accepted': 'âœ… AcceptÃ©',
        'rejected': 'âŒ RefusÃ©',
        'pending': 'â³ En attente'
      };
      
      // Trouver le client correspondant
      const client = clients.find(c => c.id === q.clientId || c.id === q.client_id);
      
      // PrioritÃ©: clientName (API) > client_name (legacy) > nom du client trouvÃ© > email du client > "Devis sans client"
      let clientName = 'Devis sans client';
      if (q.clientName) {
        clientName = q.clientName;
      } else if (q.client_name) {
        clientName = q.client_name;
      } else if (client) {
        clientName = client.name || client.email || 'Devis sans client';
      } else if (q.clientEmail || q.client_email) {
        clientName = q.clientEmail || q.client_email;
      }
      
      return {
        ...q, 
        type: "quote", 
        value: q.amount || q.total || 0,
        display_name: clientName,
        display_info: statusMap[q.status] || q.status || 'ðŸ“ Brouillon',
        items_count: q.metadata?.items?.length || q.items?.length || 0
      };
    }),
    ...invoices.map(i => {
      const statusMap: Record<string, string> = {
        'draft': 'ðŸ“ Brouillon',
        'sent': 'ðŸ“¤ EnvoyÃ©e',
        'paid': 'ðŸ’° PayÃ©e',
        'overdue': 'â° En retard',
        'pending': 'â³ En attente'
      };
      
      // Trouver le client correspondant
      const client = clients.find(c => c.id === i.clientId || c.id === i.client_id);
      
      // PrioritÃ©: clientName (API) > client_name (legacy) > nom du client trouvÃ© > email du client > "Facture sans client"
      let clientName = 'Facture sans client';
      if (i.clientName) {
        clientName = i.clientName;
      } else if (i.client_name) {
        clientName = i.client_name;
      } else if (client) {
        clientName = client.name || client.email || 'Facture sans client';
      } else if (i.clientEmail || i.client_email) {
        clientName = i.clientEmail || i.client_email;
      }
      
      return {
        ...i, 
        type: "invoice", 
        value: i.total || i.amount || 0,
        display_name: clientName,
        display_info: statusMap[i.status] || i.status || 'ðŸ“ Brouillon',
        items_count: i.items?.length || 0
      };
    })
  ].filter(item => {
    if (activeFilter === "all") return true;
    if (activeFilter === "leads") return item.type === "lead";
    if (activeFilter === "clients") return item.type === "client";
    if (activeFilter === "deals") return item.type === "quote";
    if (activeFilter === "invoices") return item.type === "invoice";
    return true;
  }).filter(item => {
    if (!searchQuery) return true;
    return item.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.client_name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Stats calculÃ©es de maniÃ¨re dynamique
  const stats = useMemo(() => {
    // 1. CA Total (factures payÃ©es uniquement)
    const totalRevenue = invoices
      .filter(inv => inv.status === 'paid' || inv.status === 'payÃ©e')
      .reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0);
    
    // 2. Devis en attente (sent ou pending)
    const pendingQuotes = quotes.filter(q => 
      q.status === 'sent' || q.status === 'pending' || q.status === 'ðŸ“¤ EnvoyÃ©' || q.status === 'â³ En attente'
    ).length;
    
    // 3. Leads actifs (non convertis)
    const activeLeads = leads.filter(l => 
      l.status !== 'converted' && l.status !== 'lost'
    ).length;
    
    // 4. Taux de conversion (devis acceptÃ©s / total devis)
    const acceptedQuotes = quotes.filter(q => q.status === 'accepted' || q.status === 'âœ… AcceptÃ©').length;
    const conversionRate = quotes.length > 0 
      ? Math.round((acceptedQuotes / quotes.length) * 100) 
      : 0;
    
    // 5. Montant potentiel (devis en attente)
    const potentialRevenue = quotes
      .filter(q => q.status === 'sent' || q.status === 'pending')
      .reduce((sum, q) => sum + (q.amount || q.total || 0), 0);
    
    // 6. Factures impayÃ©es
    const unpaidInvoices = invoices.filter(inv => 
      inv.status === 'sent' || inv.status === 'overdue' || inv.status === 'unpaid'
    ).length;
    
    // 7. Montant des factures impayÃ©es
    const unpaidAmount = invoices
      .filter(inv => inv.status === 'sent' || inv.status === 'overdue' || inv.status === 'unpaid')
      .reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0);

    return {
      totalRevenue,
      pendingQuotes,
      activeLeads,
      conversionRate,
      clients: clients.length,
      potentialRevenue,
      unpaidInvoices,
      unpaidAmount
    };
  }, [leads, clients, quotes, invoices]);

  const revenueSeries = useMemo(() => {
    const now = new Date();
    const buckets = Array.from({ length: 6 }).map((_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const label = date.toLocaleString('en-US', { month: 'short' });
      return { label, value: 0 };
    });

    invoices.forEach((invoice) => {
      const date = parseDate(
        invoice.created_at ||
          invoice.createdAt ||
          invoice.issuedAt ||
          invoice.issueDate ||
          invoice.date ||
          invoice.dueDate
      );
      const label = date.toLocaleString('en-US', { month: 'short' });
      const bucket = buckets.find((entry) => entry.label === label);
      if (bucket) {
        bucket.value += invoice.total || invoice.amount || 0;
      }
    });

    return buckets;
  }, [invoices]);

  const subscriberSeries = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => ({ label, value: 0 }));
    bookings.forEach((booking) => {
      const dayIndex = parseDate(booking.date || booking.created_at || booking.createdAt).getDay();
      days[dayIndex].value += 1;
    });
    return days;
  }, [bookings]);

  const distributionData = useMemo(() => {
    const dataset = [
      { label: 'Website', value: leads.length, color: '#CCFF00' },
      { label: 'Mobile App', value: clients.length, color: '#7C45FF' },
      { label: 'Autres', value: invoices.length, color: '#1EA7FF' },
    ];
    const total = dataset.reduce((sum, item) => sum + item.value, 0) || 1;
    return dataset.map((item) => ({ ...item, percent: Math.round((item.value / total) * 100) }));
  }, [leads.length, clients.length, invoices.length]);

  return (
    <div className="min-h-screen" style={{ background: colors.background }}>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <DashboardHeader
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
          onLogout={onLogout}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={<DollarSign className="h-5 w-5" />}
            label="CA rÃ©alisÃ©"
            value={`${stats.totalRevenue.toLocaleString('fr-FR')}â‚¬`}
            sublabel={stats.unpaidAmount > 0 ? `${stats.unpaidAmount.toLocaleString('fr-FR')}â‚¬ en attente` : "Tout est payÃ©"}
            status="Revenus"
            trend={{
              label: `${stats.potentialRevenue.toLocaleString('fr-FR')}â‚¬ potentiel`,
              direction: stats.potentialRevenue >= stats.totalRevenue ? "up" : "flat",
            }}
          />
          <MetricCard
            icon={<FileText className="h-5 w-5" />}
            label="Devis en attente"
            value={stats.pendingQuotes.toString()}
            sublabel={`${quotes.length} devis au total`}
            status="Devis"
            trend={{
              label: `${stats.unpaidInvoices} factures impayÃ©es`,
              direction: stats.unpaidInvoices > 0 ? "down" : "flat",
            }}
          />
          <MetricCard
            icon={<Users className="h-5 w-5" />}
            label="Leads actifs"
            value={stats.activeLeads.toString()}
            sublabel={`${stats.clients} clients`}
            status="Pipeline"
            trend={{
              label: `${leads.length} leads suivis`,
              direction: stats.activeLeads >= leads.length / 2 ? "up" : "flat",
            }}
          />
          <MetricCard
            icon={<Target className="h-5 w-5" />}
            label="Conversion"
            value={`${stats.conversionRate}%`}
            sublabel={`${quotes.filter(q => q.status === 'accepted' || q.status === 'âœ… AcceptÃ©').length}/${quotes.length || 1} acceptÃ©s`}
            status="Performance"
            trend={{
              label: stats.conversionRate > 30 ? "Progression" : "Ã€ travailler",
              direction: stats.conversionRate > 30 ? "up" : "flat",
            }}
          />
        </div>

        <ViewTabs
          views={[
            { id: "pipeline", label: "Pipeline", icon: <Target className="h-4 w-4" />, count: allItems.length },
            { id: "calendar", label: "Calendrier", icon: <Calendar className="h-4 w-4" />, count: bookings.length },
            { id: "analytics", label: "Analytics", icon: <TrendingUp className="h-4 w-4" /> },
            { id: "content", label: "Contenu", icon: <Layers className="h-4 w-4" /> },
          ]}
          activeId={activeView}
          onChange={(viewId) => setActiveView(viewId as "pipeline" | "calendar" | "analytics" | "content")}
        />

        {activeView === "pipeline" && (
          <section className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-3">
                {(["all", "leads", "clients", "deals", "invoices"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      activeFilter === filter
                        ? "border-mint bg-mint text-black shadow-[0_10px_30px_rgba(204, 255, 0,.3)]"
                        : "border-white/10 text-neutral-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {filter === "all" ? "Tout" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Badge className="rounded-full border border-mint/30 bg-mint/10 text-mint">
                  {allItems.length} Ã©lÃ©ments
                </Badge>
                <Button
                  className="gap-2 rounded-2xl bg-mint px-4 py-2 text-sm font-semibold text-black hover:bg-mint/90"
                  onClick={handleNewClick}
                >
                  <Plus className="h-4 w-4" />
                  Nouveau
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-mint/30 border-t-mint" />
              </div>
            ) : allItems.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <Target className="mb-4 h-12 w-12 text-white/20" />
                <p className="text-lg text-white/60">Aucun Ã©lÃ©ment</p>
                <p className="text-sm text-white/40">CrÃ©ez votre premier lead pour commencer</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allItems.map((item) => {
                  const itemStatus: PipelineStatus =
                    item.type === "lead"
                      ? "lead"
                      : item.type === "client"
                        ? "client"
                        : item.type === "quote"
                          ? "quote"
                          : item.type === "invoice"
                            ? "invoice"
                            : "booking";

                  const actions: PipelineItemAction[] = [];

                  if (item.type === "lead") {
                    actions.push({
                      key: "convert-lead",
                      icon: <UserCheck className="h-4 w-4" />,
                      label: "Convertir en client",
                      tone: "success",
                      onClick: () => {
                        setEditingLead(item);
                        setLeadDialogOpen(true);
                      },
                    });
                  }

                  if (item.type === "quote") {
                    actions.push(
                      {
                        key: "send-quote",
                        icon: <Mail className="h-4 w-4" />,
                        label: item.lastEmailSent
                          ? `Relancer (${formatLastEmailSent(item.lastEmailSent)})`
                          : "Envoyer le devis",
                        tone: "info",
                        onClick: (event) => handleSendQuoteEmail(item, event),
                      },
                      {
                        key: "create-invoice",
                        icon: <Receipt className="h-4 w-4" />,
                        label: "CrÃ©er une facture",
                        onClick: (event) => handleCreateInvoiceFromQuote(item, event),
                      },
                      {
                        key: "convert-invoice",
                        icon: <ArrowRightLeft className="h-4 w-4" />,
                        label: "Transformer en facture",
                        tone: "warning",
                        onClick: (event) => handleConvertQuoteToInvoice(item, event),
                      }
                    );
                  }

                  if (item.type === "invoice") {
                    actions.push({
                      key: "send-invoice",
                      icon: <Mail className="h-4 w-4" />,
                      label: item.lastEmailSent
                        ? `Relancer (${formatLastEmailSent(item.lastEmailSent)})`
                        : "Envoyer la facture",
                      tone: "info",
                      onClick: (event) => handleSendInvoiceEmail(item, event),
                    });
                  }

                  if (item.type === "booking") {
                    actions.push(
                      {
                        key: "edit-booking",
                        icon: <Edit className="h-4 w-4" />,
                        label: "Modifier le rendez-vous",
                        onClick: () => {
                          setEditingBooking(item);
                          setBookingDialogOpen(true);
                        },
                      },
                      {
                        key: "booking-email",
                        icon: <Mail className="h-4 w-4" />,
                        label: "Envoyer un email",
                        onClick: () => {
                          if (item.email) window.open(`mailto:${item.email}`);
                        },
                      },
                      {
                        key: "booking-convert",
                        icon: <UserCheck className="h-4 w-4" />,
                        label: "Convertir en client",
                        tone: "success",
                        onClick: () => handleConvertBookingToClient(item),
                      }
                    );
                  }

                  return (
                    <PipelineItem
                      key={`${item.type}-${item.id}`}
                      title={item.display_name || item.name || "Sans nom"}
                      email={item.email}
                      subtitle={item.display_info}
                      amount={item.value}
                      status={itemStatus}
                      tags={item.interests || item.tags || item.services || []}
                      itemsCount={item.items_count}
                      actions={actions}
                      onEmail={item.email ? () => window.open(`mailto:${item.email}`) : undefined}
                      onDelete={(event) => handleDeleteItem(item, event)}
                      onOpen={() => handleItemClick(item)}
                    />
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeView === "calendar" && (
          <CalendarView
            bookings={bookings}
            onUpdateBooking={async (id, updates) => {
              const bookingToUpdate = bookings.find((b) => b.id === id);
              if (!bookingToUpdate) {
                console.error("Booking not found:", id);
                return;
              }

              const updatedBooking = { ...bookingToUpdate, ...updates };
              const { data: { session } } = await supabase.auth.getSession();
              if (!session) return;

              const response = await fetch(
                `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/bookings/${id}`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${session.access_token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(updatedBooking),
                }
              );

              if (response.ok) {
                await fetchData();
              } else {
                throw new Error("Failed to update booking");
              }
            }}
            onCreateBooking={async () => {
              setBookingDialogOpen(true);
            }}
            onEditBooking={(booking) => {
              setEditingBooking(booking);
              setBookingDialogOpen(true);
            }}
            onDeleteBooking={async (id) => {
              const { data: { session } } = await supabase.auth.getSession();
              if (!session) return;

              const response = await fetch(
                `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/bookings/${id}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${session.access_token}` },
                }
              );

              if (response.ok) {
                await fetchData();
              } else {
                throw new Error("Failed to delete booking");
              }
            }}
          />
        )}

        {activeView === "analytics" && (
          <AnalyticsDashboard
            leads={leads}
            clients={clients}
            quotes={quotes}
            invoices={invoices}
            bookings={bookings}
          />
        )}

        {activeView === "content" && <ContentTab />}

        {activeView !== "pipeline" && activeView !== "analytics" && (
          <div className="flex justify-end lg:hidden">
            <Button
              className="gap-2 rounded-2xl bg-mint px-4 py-2 text-sm font-semibold text-black hover:bg-mint/90"
              onClick={handleNewClick}
            >
              <Plus className="h-4 w-4" />
              Nouveau
            </Button>
          </div>
        )}
      </div>

      {/* Command Palette (CMD+K) */}
      <AnimatePresence>
        {showCommandPalette && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowCommandPalette(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-32 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
            >
              <div className="bg-[#0C0C0C] border border-[#CCFF00]/20 rounded-2xl shadow-2xl shadow-[#CCFF00]/10 overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-[#CCFF00]" />
                    <Input
                      placeholder="Rechercher un lead, client, devis, facture..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-white"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-white/40 hover:text-white/60"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-2 max-h-96 overflow-y-auto">
                  {searchQuery ? (
                    <div className="space-y-3">
                      {/* RÃ©sultats Leads */}
                      {(() => {
                        const filteredLeads = leads.filter(l => 
                          l.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.company?.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        return filteredLeads.length > 0 && (
                          <div>
                            <div className="px-2 py-1 text-xs font-semibold text-white/40 uppercase">Leads ({filteredLeads.length})</div>
                            {filteredLeads.map(lead => (
                              <button
                                key={lead.id}
                                onClick={() => {
                                  handleOpenDetails(lead, 'lead');
                                  setShowCommandPalette(false);
                                }}
                                className="w-full px-3 py-2 rounded-lg hover:bg-white/5 flex items-center gap-3 text-left transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                  <Users className="w-4 h-4 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-white">{lead.name}</div>
                                  <div className="text-xs text-white/40">{lead.email || lead.company}</div>
                                </div>
                                <div className="text-xs text-white/40">{lead.value ? `${lead.value.toLocaleString('fr-FR')}â‚¬` : ''}</div>
                              </button>
                            ))}
                          </div>
                        );
                      })()}

                      {/* RÃ©sultats Clients */}
                      {(() => {
                        const filteredClients = clients.filter(c => 
                          c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.company?.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        return filteredClients.length > 0 && (
                          <div>
                            <div className="px-2 py-1 text-xs font-semibold text-white/40 uppercase">Clients ({filteredClients.length})</div>
                            {filteredClients.map(client => (
                              <button
                                key={client.id}
                                onClick={() => {
                                  handleOpenDetails(client, 'client');
                                  setShowCommandPalette(false);
                                }}
                                className="w-full px-3 py-2 rounded-lg hover:bg-white/5 flex items-center gap-3 text-left transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                  <UserCheck className="w-4 h-4 text-green-400" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-white">{client.name}</div>
                                  <div className="text-xs text-white/40">{client.email || client.company}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        );
                      })()}

                      {/* RÃ©sultats Devis */}
                      {(() => {
                        const filteredQuotes = quotes.filter(q => 
                          q.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.clientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.number?.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        return filteredQuotes.length > 0 && (
                          <div>
                            <div className="px-2 py-1 text-xs font-semibold text-white/40 uppercase">Devis ({filteredQuotes.length})</div>
                            {filteredQuotes.map(quote => (
                              <button
                                key={quote.id}
                                onClick={() => {
                                  handleOpenDetails(quote, 'quote');
                                  setShowCommandPalette(false);
                                }}
                                className="w-full px-3 py-2 rounded-lg hover:bg-white/5 flex items-center gap-3 text-left transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-yellow-400" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-white">{quote.clientName || quote.client_name || 'Sans client'}</div>
                                  <div className="text-xs text-white/40">Devis #{quote.number || quote.id}</div>
                                </div>
                                <div className="text-sm font-medium text-white">{(quote.amount || quote.total || 0).toLocaleString('fr-FR')}â‚¬</div>
                              </button>
                            ))}
                          </div>
                        );
                      })()}

                      {/* RÃ©sultats Factures */}
                      {(() => {
                        const filteredInvoices = invoices.filter(inv => 
                          inv.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.clientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        return filteredInvoices.length > 0 && (
                          <div>
                            <div className="px-2 py-1 text-xs font-semibold text-white/40 uppercase">Factures ({filteredInvoices.length})</div>
                            {filteredInvoices.map(invoice => (
                              <button
                                key={invoice.id}
                                onClick={() => {
                                  handleOpenDetails(invoice, 'invoice');
                                  setShowCommandPalette(false);
                                }}
                                className="w-full px-3 py-2 rounded-lg hover:bg-white/5 flex items-center gap-3 text-left transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#CCFF00]/10 flex items-center justify-center">
                                  <Receipt className="w-4 h-4 text-[#CCFF00]" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-white">{invoice.clientName || invoice.client_name || 'Sans client'}</div>
                                  <div className="text-xs text-white/40">Facture #{invoice.invoiceNumber || invoice.number || invoice.id}</div>
                                </div>
                                <div className="text-sm font-medium text-white">{(invoice.total || invoice.amount || 0).toLocaleString('fr-FR')}â‚¬</div>
                              </button>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Aucun rÃ©sultat */}
                      {leads.filter(l => l.name?.toLowerCase().includes(searchQuery.toLowerCase()) || l.email?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
                       clients.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || c.email?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
                       quotes.filter(q => q.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) || q.number?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
                       invoices.filter(i => i.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) || i.number?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                        <div className="px-3 py-8 text-center text-white/40">
                          <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                          <p className="text-sm">Aucun rÃ©sultat pour "{searchQuery}"</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <CommandItem icon={Plus} label="CrÃ©er un lead" shortcut="âŒ˜N" onClick={() => { setLeadDialogOpen(true); setShowCommandPalette(false); }} />
                      <CommandItem icon={Users} label="CrÃ©er un client" shortcut="âŒ˜C" onClick={() => { setClientDialogOpen(true); setShowCommandPalette(false); }} />
                      <CommandItem icon={FileText} label="CrÃ©er un devis" shortcut="âŒ˜Q" onClick={() => { setQuoteDialogOpen(true); setShowCommandPalette(false); }} />
                      <CommandItem icon={Receipt} label="CrÃ©er une facture" shortcut="âŒ˜I" onClick={() => { setInvoiceDialogOpen(true); setShowCommandPalette(false); }} />
                      <div className="my-2 border-t border-white/10" />
                      <div className="px-2 py-1 text-xs font-semibold text-white/40 uppercase">AperÃ§u</div>
                      <CommandItem icon={Users} label={`${stats.activeLeads} leads actifs`} />
                      <CommandItem icon={UserCheck} label={`${stats.clients} clients`} />
                      <CommandItem icon={FileText} label={`${stats.pendingQuotes} devis en attente`} />
                      <CommandItem icon={DollarSign} label={`${stats.totalRevenue.toLocaleString('fr-FR')}â‚¬ CA rÃ©alisÃ©`} />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dialogs */}
      <LeadEditDialog
        open={leadDialogOpen}
        onOpenChange={setLeadDialogOpen}
        lead={editingLead}
        onSave={handleSaveLead}
      />

      <ClientEditDialog
        open={clientDialogOpen}
        onOpenChange={setClientDialogOpen}
        client={editingClient}
        onClientUpdated={fetchData}
        leads={leads}
      />

      <QuoteCreationDialog
        open={quoteDialogOpen}
        onOpenChange={(open) => {
          setQuoteDialogOpen(open);
          if (!open) setEditingQuote(null);
        }}
        onSuccess={fetchData}
        clients={clients}
        quote={editingQuote}
        onSave={handleSaveQuote}
      />

      <InvoiceCreationDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        onSuccess={fetchData}
        clients={clients}
        invoice={editingInvoice}
      />

      <BookingEditDialog
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        booking={editingBooking}
        onSave={handleSaveBooking}
        clients={clients}
      />

      <ItemDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        item={selectedItem}
        type={selectedItemType}
        onEdit={() => {
          setDetailsModalOpen(false);
          if (selectedItemType === 'lead') {
            setEditingLead(selectedItem);
            setLeadDialogOpen(true);
          } else if (selectedItemType === 'client') {
            setEditingClient(selectedItem);
            setClientDialogOpen(true);
          } else if (selectedItemType === 'quote') {
            setEditingQuote(selectedItem);
            setQuoteDialogOpen(true);
          } else if (selectedItemType === 'invoice') {
            setEditingInvoice(selectedItem);
            setInvoiceDialogOpen(true);
          } else if (selectedItemType === 'booking') {
            setEditingBooking(selectedItem);
            setBookingDialogOpen(true);
          }
        }}
        onDelete={() => {
          setDetailsModalOpen(false);
          handleDeleteItem(selectedItem, { stopPropagation: () => {} } as any);
        }}
        relatedItems={
          selectedItemType === 'client' ? {
            quotes: quotes.filter(q => q.clientId === selectedItem?.id || q.client_id === selectedItem?.id),
            invoices: invoices.filter(inv => inv.clientId === selectedItem?.id || inv.client_id === selectedItem?.id)
          } : undefined
        }
      />
    </div>
  );
}

const SidebarNav = ({ sections, activeId, onSelect }: { sections: { title: string; items: SidebarNavItem[] }[]; activeId: string; onSelect: (id: string) => void }) => (
  <div className="space-y-8">
    {sections.map((section) => (
      <div key={section.title}>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-white/40">{section.title}</p>
        <div className="space-y-1">
          {section.items.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm transition-all ${
                  isActive ? "border border-white/10 bg-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)]" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3 font-medium">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${isActive ? "bg-primary/20 text-primary" : "bg-white/5 text-white/50"}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  {item.label}
                </span>
                {item.badge && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">{item.badge}</span>
                )}
                {item.chip && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                    {item.chip}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

const SalesOverviewCard = ({ series, total, className = "" }: { series: { label: string; value: number }[]; total: number; className?: string }) => {
  const maxValue = Math.max(...series.map((entry) => entry.value), 1);
  const latest = series[series.length - 1];
  return (
    <div className={`rounded-3xl border border-white/5 bg-gradient-to-br from-[#0b0b0d] to-[#050505] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.55)] ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">Sales Overview</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(total)}</p>
          <p className="text-xs text-primary">+{latest ? latest.value.toLocaleString('fr-FR') : 0}€ ce mois</p>
        </div>
        <div className="flex gap-2 text-xs text-white/60">
          <button className="rounded-full border border-white/10 px-3 py-1">Filter</button>
          <button className="rounded-full border border-white/10 px-3 py-1">Sort</button>
        </div>
      </div>
      <div className="mt-6 flex items-end gap-3">
        {series.map((point) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-44 w-full items-end justify-center rounded-2xl bg-white/5 p-1">
              <div
                className="w-full rounded-xl bg-gradient-to-t from-[#7C45FF] via-[#4c6fff] to-[#CCFF00]"
                style={{ height: `${(point.value / maxValue) * 100 || 0}%` }}
              />
            </div>
            <span className="text-xs text-white/50">{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SubscribersCard = ({ data, total, className = "" }: { data: { label: string; value: number }[]; total: number; className?: string }) => {
  const maxValue = Math.max(...data.map((entry) => entry.value), 1);
  return (
    <div className={`rounded-3xl border border-white/5 bg-[#070707]/90 p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/60">Total Subscribers</p>
          <p className="text-3xl font-bold text-white">{total.toLocaleString('fr-FR')}</p>
          <p className="text-xs text-primary">+{Math.max(1, total - data[0]?.value || 0)} cette semaine</p>
        </div>
        <button className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">Weekly</button>
      </div>
      <div className="mt-6 flex items-end gap-3">
        {data.map((point) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-28 w-full items-end rounded-2xl bg-white/5 p-1">
              <div className="w-full rounded-xl bg-primary/80" style={{ height: `${(point.value / maxValue) * 100 || 0}%` }} />
            </div>
            <span className={`text-xs ${point.label === 'Tue' ? 'text-white' : 'text-white/40'}`}>{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DistributionCard = ({ data, total, className = "" }: { data: { label: string; value: number; percent: number; color: string }[]; total: number; className?: string }) => {
  const colorStops: string[] = [];
  let accumulator = 0;
  data.forEach((segment) => {
    const start = accumulator;
    accumulator += segment.percent;
    colorStops.push(`${segment.color} ${start}% ${accumulator}%`);
  });

  return (
    <div className={`rounded-3xl border border-white/5 bg-[#070707]/90 p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">Sales Distribution</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(total)}</p>
        </div>
        <button className="text-xs text-primary">Voir tout</button>
      </div>
      <div className="mt-6 flex flex-col items-center gap-5 md:flex-row">
        <div
          className="relative h-40 w-40 rounded-full"
          style={{ background: `conic-gradient(${colorStops.join(',')})` }}
        >
          <div className="absolute inset-6 rounded-full bg-[#050505] text-center">
            <p className="mt-10 text-xs uppercase tracking-[0.4em] text-white/40">Share</p>
            <p className="text-2xl font-bold text-white">{data[0]?.percent ?? 0}%</p>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {data.map((segment) => (
            <div key={segment.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: segment.color }} />
                <p className="text-sm text-white">{segment.label}</p>
              </div>
              <p className="text-sm text-white/60">{segment.percent}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const IntegrationListCard = ({ rows, className = "" }: { rows: { application: string; type: string; rate: string; profit: number }[]; className?: string }) => (
  <div className={`rounded-3xl border border-white/5 bg-[#070707]/90 p-6 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-white/60">List of Integration</p>
        <p className="text-2xl font-bold text-white">Connexions clés</p>
      </div>
      <button className="text-xs text-primary">Tout voir</button>
    </div>
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-left text-sm text-white/70">
        <thead>
          <tr className="text-xs uppercase tracking-[0.3em] text-white/40">
            <th className="pb-3">Application</th>
            <th className="pb-3">Type</th>
            <th className="pb-3">Taux</th>
            <th className="pb-3 text-right">Profit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((row) => (
            <tr key={row.application}>
              <td className="py-3 font-medium text-white">{row.application}</td>
              <td className="py-3">{row.type}</td>
              <td className="py-3">{row.rate}</td>
              <td className="py-3 text-right font-semibold text-white">{formatCurrency(row.profit)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Composant helper
function CommandItem({ icon: Icon, label, shortcut, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left group"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-white/60 group-hover:text-[#CCFF00] transition-colors" />
        <span className="text-sm text-white">{label}</span>
      </div>
      {shortcut && (
        <kbd className="px-2 py-0.5 text-xs bg-white/10 text-white/60 rounded">{shortcut}</kbd>
      )}
    </button>
  );
}
