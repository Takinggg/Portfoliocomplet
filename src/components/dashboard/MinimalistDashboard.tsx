import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Command,
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  Search,
  Bell,
  Settings,
  LogOut,
  Zap,
  Mail,
  Phone,
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  Target,
  Filter,
  Trash2,
  FileText,
  ChevronDown,
  ChevronRight,
  Receipt,
  ArrowRightLeft,
  UserCheck,
  X,
  Edit,
  Layers
} from "lucide-react";
import { createClient } from "../../utils/supabase/client";
import { projectId } from "../../utils/supabase/info";
import { colors } from "../../styles/designSystem";
import { LeadEditDialog } from "./LeadEditDialog";
import { ClientEditDialog } from "./ClientEditDialog";
import { QuoteCreationDialog } from "./QuoteCreationDialog";
import { InvoiceCreationDialog } from "./InvoiceCreationDialog";
import { BookingEditDialog } from "./BookingEditDialog";
import { ItemDetailsModal } from "./ItemDetailsModal";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { CalendarView } from "./CalendarView";
import { ContentTab } from "./ContentTab";
import { DashboardHeader } from "./ui/DashboardHeader";
import { MetricCard } from "./ui/MetricCard";
import { ViewTabs } from "./ui/ViewTabs";
import { PipelineItem, type PipelineItemAction, type PipelineStatus } from "./ui/PipelineItem";
import { exportQuoteToPDF, exportInvoiceToPDF } from "../../utils/pdfGenerator";

interface MinimalistDashboardProps {
  onLogout: () => void;
}

export default function MinimalistDashboard({ onLogout }: MinimalistDashboardProps) {
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"pipeline" | "calendar" | "analytics" | "content">("pipeline");
  const [activeFilter, setActiveFilter] = useState<"all" | "leads" | "clients" | "deals" | "invoices">("all");
  const [leads, setLeads] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [leadDialogOpen, setLeadDialogOpen] = useState(false);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  
  // Details modal state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedItemType, setSelectedItemType] = useState<'lead' | 'client' | 'quote' | 'invoice' | 'booking'>('lead');
  const [editingLead, setEditingLead] = useState<any>(null);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [editingQuote, setEditingQuote] = useState<any>(null);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  
  // Notes state (stored in localStorage for now, could be in DB)
  const [clientNotes, setClientNotes] = useState<Record<string, any[]>>({});

  const supabase = createClient();

  // Keyboard shortcut CMD+K / CTRL+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(!showCommandPalette);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCommandPalette]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [leadsRes, clientsRes, quotesRes, invoicesRes, bookingsRes] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/invoices`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/bookings`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        })
      ]);

      const leadsData = leadsRes.ok ? (await leadsRes.json()).leads || [] : [];
      const clientsData = clientsRes.ok ? (await clientsRes.json()).clients || [] : [];
      const quotesData = quotesRes.ok ? (await quotesRes.json()).quotes || [] : [];
      const invoicesData = invoicesRes.ok ? (await invoicesRes.json()).invoices || [] : [];
      const bookingsData = bookingsRes.ok ? (await bookingsRes.json()).bookings || [] : [];

      // Utiliser les données réelles de la base, sans fallback sur les données de démo
      setLeads(leadsData);
      setClients(clientsData);
      setQuotes(quotesData);
      setInvoices(invoicesData);
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleSaveLead = async (leadData: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const url = editingLead
      ? `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads/${editingLead.id}`
      : `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads`;

    const method = editingLead ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(leadData)
    });

    if (response.ok) {
      await fetchData();
      setEditingLead(null);
    }
  };

  const handleSaveClient = async (clientData: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const url = editingClient
      ? `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients/${editingClient.id}`
      : `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients`;

    const method = editingClient ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(clientData)
    });

    if (response.ok) {
      await fetchData();
      setEditingClient(null);
    }
  };

  const handleSaveQuote = async (quoteData: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const url = editingQuote
      ? `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes/${editingQuote.id}`
      : `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes`;

    const method = editingQuote ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quoteData)
    });

    if (response.ok) {
      await fetchData();
      setEditingQuote(null);
    }
  };

  const handleSaveBooking = async (bookingData: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const url = editingBooking
      ? `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/bookings/${editingBooking.id}`
      : `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/bookings`;

    const method = editingBooking ? "PUT" : "POST";

    // Détecter si date ou heure a changé
    const dateChanged = editingBooking && (
      bookingData.date !== editingBooking.date || 
      bookingData.time !== editingBooking.time
    );

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bookingData)
    });

    if (response.ok) {
      // Si modification de date/heure, envoyer email
      if (dateChanged) {
        const oldDate = new Date(editingBooking.date).toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        const newDate = new Date(bookingData.date).toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const changeMessage = `Ancien rendez-vous : ${oldDate} à ${editingBooking.time}\nNouveau rendez-vous : ${newDate} à ${bookingData.time}`;

        // Envoyer email de modification
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/emails/booking-confirmation`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              to: bookingData.email,
              name: bookingData.name,
              date: bookingData.date,
              time: bookingData.time,
              service: bookingData.service,
              status: 'modified',
              message: changeMessage
            })
          }
        ).then(res => {
          if (res.ok) {
            // Toast notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 z-50 bg-blue-500/90 backdrop-blur-xl text-white px-6 py-4 rounded-lg shadow-2xl border border-blue-400/20 animate-slide-in-right';
            notification.innerHTML = `
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <div>
                  <p class="font-semibold">Rendez-vous modifié !</p>
                  <p class="text-sm text-blue-100">Email de modification envoyé à ${bookingData.email}</p>
                </div>
              </div>
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 4000);
          }
        });
      }

      await fetchData();
      setEditingBooking(null);
      setBookingDialogOpen(false);
    }
  };

  const handleItemClick = (item: any) => {
    if (item.type === "lead") {
      setEditingLead(item);
      setLeadDialogOpen(true);
    } else if (item.type === "client") {
      setEditingClient(item);
      setClientDialogOpen(true);
    } else if (item.type === "quote") {
      setEditingQuote(item);
      setQuoteDialogOpen(true);
    } else if (item.type === "invoice") {
      setEditingInvoice(item);
      setInvoiceDialogOpen(true);
    } else if (item.type === "booking") {
      setEditingBooking(item);
      setBookingDialogOpen(true);
    }
  };

  const handleNewClick = () => {
    if (activeView === "calendar") {
      // Créer un nouveau rendez-vous
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
      // Par défaut, créer un lead
      setEditingLead(null);
      setLeadDialogOpen(true);
    }
  };

  const handleDeleteItem = async (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const displayName = item.display_name || item.name || 'cet élément';
    if (!confirm(`Voulez-vous vraiment supprimer "${displayName}" ?`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Vous devez être connecté pour supprimer un élément");
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

      console.log("🗑️ DELETE Request:", { 
        type: item.type, 
        id: item.id, 
        url,
        fullItem: item 
      });

      const response = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      console.log("🗑️ DELETE Response:", { 
        ok: response.ok, 
        status: response.status,
        statusText: response.statusText
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ DELETE Success - Full response:", result);
        console.log("📝 Deleted key was:", result.deletedKey);
        console.log("🔍 Was found before delete:", result.wasFound);
        
        // Suppression locale immédiate
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
        
        // NE PAS rafraîchir pour éviter que l'élément revienne
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
    if (!confirm(`⚠️ ATTENTION ! Voulez-vous vraiment supprimer TOUS les ${bookings.length} rendez-vous ?\n\nCette action est irréversible !`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Vous devez être connecté");
        return;
      }

      const url = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/bookings`;
      console.log("🗑️ DELETE ALL bookings request");

      const response = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ All bookings deleted:", result);
        setBookings([]);
        alert(`✅ ${result.count} rendez-vous supprimés avec succès !`);
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
    if (!confirm(`Convertir "${booking.name}" en client ?`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Vous devez être connecté");
        return;
      }

      // Créer le client avec les données du booking
      const clientData = {
        name: booking.name,
        email: booking.email,
        phone: booking.phone || "",
        company: "",
        address: "",
        status: "active",
        revenue: 0,
        notes: `Client créé à partir du rendez-vous du ${booking.date} à ${booking.time}\nService: ${booking.service || 'N/A'}\nMessage: ${booking.message || 'N/A'}`
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/clients`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(clientData)
        }
      );

      if (response.ok) {
        await fetchData();
        alert(`✅ Client "${booking.name}" créé avec succès !`);
      } else {
        const error = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
        alert(`Erreur: ${error.message || response.statusText}`);
      }
    } catch (error: any) {
      console.error("Erreur conversion booking → client:", error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // Créer une facture à partir d'un devis (le devis reste)
  const handleCreateInvoiceFromQuote = async (quote: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log("📝 Quote data:", quote);
    
    const quoteName = quote.clientName || quote.client_name || quote.name || 'Sans nom';
    if (!confirm(`Créer une facture à partir du devis "${quoteName}" ?`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Vous devez être connecté");
        return;
      }

      // Extraire les données du devis en gérant plusieurs formats possibles
      const clientId = quote.clientId || quote.client_id;
      const clientName = quote.clientName || quote.client_name || quote.name;
      const clientEmail = quote.clientEmail || quote.client_email || quote.email;
      const clientAddress = quote.clientAddress || quote.client_address || quote.address;
      
      // Pour les items et le montant
      const items = quote.items || quote.metadata?.items || [];
      const amount = quote.amount || quote.total || quote.value || 0;
      
      if (!clientId || !clientName || !clientEmail) {
        alert("⚠️ Informations client manquantes dans le devis");
        console.error("Missing client info:", { clientId, clientName, clientEmail });
        return;
      }

      // Créer la nouvelle facture avec les données du devis
      const invoiceData = {
        clientId,
        clientName,
        clientEmail,
        clientAddress,
        items: items,
        total: amount,
        status: 'pending', // Facture en attente de paiement
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 jours
        notes: quote.description || quote.notes || "",
        metadata: {
          ...(quote.metadata || {}),
          sourceQuoteId: quote.id, // Référence au devis source
          sourceQuoteNumber: quote.number || quote.quoteNumber,
          convertedAt: new Date().toISOString()
        }
      };

      console.log("💰 Creating invoice with data:", invoiceData);

      const response = await fetch(
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

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Invoice created:", result);
        alert("✅ Facture créée avec succès !");
        await fetchData();
      } else {
        const error = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
        console.error("❌ Error response:", error);
        alert(`Erreur: ${error.error || error.message || response.statusText}`);
      }
    } catch (error: any) {
      console.error("❌ Erreur création facture:", error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // Transformer un devis en facture (le devis est supprimé)
  const handleConvertQuoteToInvoice = async (quote: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log("🔄 Quote to convert:", quote);
    
    const quoteName = quote.clientName || quote.client_name || quote.name || 'Sans nom';
    if (!confirm(`Transformer le devis "${quoteName}" en facture ?\n\n⚠️ Le devis sera supprimé et remplacé par une facture.`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Vous devez être connecté");
        return;
      }

      // Extraire les données du devis en gérant plusieurs formats possibles
      const clientId = quote.clientId || quote.client_id;
      const clientName = quote.clientName || quote.client_name || quote.name;
      const clientEmail = quote.clientEmail || quote.client_email || quote.email;
      const clientAddress = quote.clientAddress || quote.client_address || quote.address;
      
      // Pour les items et le montant
      const items = quote.items || quote.metadata?.items || [];
      const amount = quote.amount || quote.total || quote.value || 0;
      
      if (!clientId || !clientName || !clientEmail) {
        alert("⚠️ Informations client manquantes dans le devis");
        console.error("Missing client info:", { clientId, clientName, clientEmail });
        return;
      }

      // 1. Créer la facture
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

      console.log("💰 Converting to invoice with data:", invoiceData);

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
        console.error("❌ Error creating invoice:", error);
        alert(`Erreur création facture: ${error.error || error.message || createResponse.statusText}`);
        return;
      }

      const invoiceResult = await createResponse.json();
      console.log("✅ Invoice created:", invoiceResult);

      // 2. Supprimer le devis
      const deleteResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes/${quote.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session.access_token}` }
        }
      );

      if (deleteResponse.ok) {
        console.log("✅ Quote deleted:", quote.id);
        alert("✅ Devis transformé en facture !");
        await fetchData();
      } else {
        console.warn("⚠️ Invoice created but quote deletion failed");
        alert("⚠️ Facture créée mais erreur lors de la suppression du devis. Veuillez supprimer le devis manuellement.");
        await fetchData();
      }
    } catch (error: any) {
      console.error("❌ Erreur conversion:", error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // Ouvrir le modal de détails
  const handleOpenDetails = (item: any, type: 'lead' | 'client' | 'quote' | 'invoice') => {
    setSelectedItem(item);
    setSelectedItemType(type);
    setDetailsModalOpen(true);
  };

  // Formater la date du dernier email envoyé
  const formatLastEmailSent = (lastEmailSent: string | null | undefined): string => {
    if (!lastEmailSent) return '';
    
    const now = new Date();
    const sent = new Date(lastEmailSent);
    const diffMs = now.getTime() - sent.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return "À l'instant";
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
      alert("⚠️ Aucun email client trouvé pour ce devis");
      return;
    }
    
    if (!confirm(`Envoyer le devis à ${clientEmail} ?`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Vous devez être connecté");
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
        // Mettre à jour la date d'envoi
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
        
        // Notification de succès stylée
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 z-50 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-sm animate-in slide-in-from-top-5';
        notification.innerHTML = `
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <p class="font-semibold">Email envoyé avec succès !</p>
              <p class="text-sm text-green-400/70">Devis envoyé à ${clientEmail}</p>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
        
        // Recharger les données
        fetchData();
      } else {
        const error = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
        alert(`Erreur: ${error.error || error.message || response.statusText}`);
      }
    } catch (error: any) {
      console.error("❌ Erreur envoi email:", error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // Envoyer une facture par email
  const handleSendInvoiceEmail = async (invoice: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const clientEmail = invoice.clientEmail || invoice.client_email || invoice.email;
    const clientName = invoice.clientName || invoice.client_name || invoice.name || 'Client';
    
    if (!clientEmail) {
      alert("⚠️ Aucun email client trouvé pour cette facture");
      return;
    }
    
    if (!confirm(`Envoyer la facture à ${clientEmail} ?`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Vous devez être connecté");
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
        // Mettre à jour la date d'envoi
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
        
        // Notification de succès stylée
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 z-50 bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-sm animate-in slide-in-from-top-5';
        notification.innerHTML = `
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <p class="font-semibold">Email envoyé avec succès !</p>
              <p class="text-sm text-green-400/70">Facture envoyée à ${clientEmail}</p>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
        
        // Recharger les données
        fetchData();
      } else {
        const error = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
        alert(`Erreur: ${error.error || error.message || response.statusText}`);
      }
    } catch (error: any) {
      console.error("❌ Erreur envoi email:", error);
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
      display_info: `${b.date} à ${b.time} - ${b.service || 'RDV'}`,
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
        'draft': '📝 Brouillon',
        'sent': '📤 Envoyé',
        'accepted': '✅ Accepté',
        'rejected': '❌ Refusé',
        'pending': '⏳ En attente'
      };
      
      // Trouver le client correspondant
      const client = clients.find(c => c.id === q.clientId || c.id === q.client_id);
      
      // Priorité: clientName (API) > client_name (legacy) > nom du client trouvé > email du client > "Devis sans client"
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
        display_info: statusMap[q.status] || q.status || '📝 Brouillon',
        items_count: q.metadata?.items?.length || q.items?.length || 0
      };
    }),
    ...invoices.map(i => {
      const statusMap: Record<string, string> = {
        'draft': '📝 Brouillon',
        'sent': '📤 Envoyée',
        'paid': '💰 Payée',
        'overdue': '⏰ En retard',
        'pending': '⏳ En attente'
      };
      
      // Trouver le client correspondant
      const client = clients.find(c => c.id === i.clientId || c.id === i.client_id);
      
      // Priorité: clientName (API) > client_name (legacy) > nom du client trouvé > email du client > "Facture sans client"
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
        display_info: statusMap[i.status] || i.status || '📝 Brouillon',
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

  // Stats calculées de manière dynamique
  const stats = useMemo(() => {
    // 1. CA Total (factures payées uniquement)
    const totalRevenue = invoices
      .filter(inv => inv.status === 'paid' || inv.status === 'payée')
      .reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0);
    
    // 2. Devis en attente (sent ou pending)
    const pendingQuotes = quotes.filter(q => 
      q.status === 'sent' || q.status === 'pending' || q.status === '📤 Envoyé' || q.status === '⏳ En attente'
    ).length;
    
    // 3. Leads actifs (non convertis)
    const activeLeads = leads.filter(l => 
      l.status !== 'converted' && l.status !== 'lost'
    ).length;
    
    // 4. Taux de conversion (devis acceptés / total devis)
    const acceptedQuotes = quotes.filter(q => q.status === 'accepted' || q.status === '✅ Accepté').length;
    const conversionRate = quotes.length > 0 
      ? Math.round((acceptedQuotes / quotes.length) * 100) 
      : 0;
    
    // 5. Montant potentiel (devis en attente)
    const potentialRevenue = quotes
      .filter(q => q.status === 'sent' || q.status === 'pending')
      .reduce((sum, q) => sum + (q.amount || q.total || 0), 0);
    
    // 6. Factures impayées
    const unpaidInvoices = invoices.filter(inv => 
      inv.status === 'sent' || inv.status === 'overdue' || inv.status === 'unpaid'
    ).length;
    
    // 7. Montant des factures impayées
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
            label="CA réalisé"
            value={`${stats.totalRevenue.toLocaleString('fr-FR')}€`}
            sublabel={stats.unpaidAmount > 0 ? `${stats.unpaidAmount.toLocaleString('fr-FR')}€ en attente` : "Tout est payé"}
            status="Revenus"
            trend={{
              label: `${stats.potentialRevenue.toLocaleString('fr-FR')}€ potentiel`,
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
              label: `${stats.unpaidInvoices} factures impayées`,
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
            sublabel={`${quotes.filter(q => q.status === 'accepted' || q.status === '✅ Accepté').length}/${quotes.length || 1} acceptés`}
            status="Performance"
            trend={{
              label: stats.conversionRate > 30 ? "Progression" : "À travailler",
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
                        ? "border-mint bg-mint text-black shadow-[0_10px_30px_rgba(0,255,194,.3)]"
                        : "border-white/10 text-neutral-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {filter === "all" ? "Tout" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Badge className="rounded-full border border-mint/30 bg-mint/10 text-mint">
                  {allItems.length} éléments
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
                <p className="text-lg text-white/60">Aucun élément</p>
                <p className="text-sm text-white/40">Créez votre premier lead pour commencer</p>
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
                        label: "Créer une facture",
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
              <div className="bg-[#0C0C0C] border border-[#00FFC2]/20 rounded-2xl shadow-2xl shadow-[#00FFC2]/10 overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-[#00FFC2]" />
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
                      {/* Résultats Leads */}
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
                                <div className="text-xs text-white/40">{lead.value ? `${lead.value.toLocaleString('fr-FR')}€` : ''}</div>
                              </button>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Résultats Clients */}
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

                      {/* Résultats Devis */}
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
                                <div className="text-sm font-medium text-white">{(quote.amount || quote.total || 0).toLocaleString('fr-FR')}€</div>
                              </button>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Résultats Factures */}
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
                                <div className="w-8 h-8 rounded-lg bg-[#00FFC2]/10 flex items-center justify-center">
                                  <Receipt className="w-4 h-4 text-[#00FFC2]" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-white">{invoice.clientName || invoice.client_name || 'Sans client'}</div>
                                  <div className="text-xs text-white/40">Facture #{invoice.invoiceNumber || invoice.number || invoice.id}</div>
                                </div>
                                <div className="text-sm font-medium text-white">{(invoice.total || invoice.amount || 0).toLocaleString('fr-FR')}€</div>
                              </button>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Aucun résultat */}
                      {leads.filter(l => l.name?.toLowerCase().includes(searchQuery.toLowerCase()) || l.email?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
                       clients.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || c.email?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
                       quotes.filter(q => q.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) || q.number?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
                       invoices.filter(i => i.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) || i.number?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                        <div className="px-3 py-8 text-center text-white/40">
                          <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                          <p className="text-sm">Aucun résultat pour "{searchQuery}"</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <CommandItem icon={Plus} label="Créer un lead" shortcut="⌘N" onClick={() => { setLeadDialogOpen(true); setShowCommandPalette(false); }} />
                      <CommandItem icon={Users} label="Créer un client" shortcut="⌘C" onClick={() => { setClientDialogOpen(true); setShowCommandPalette(false); }} />
                      <CommandItem icon={FileText} label="Créer un devis" shortcut="⌘Q" onClick={() => { setQuoteDialogOpen(true); setShowCommandPalette(false); }} />
                      <CommandItem icon={Receipt} label="Créer une facture" shortcut="⌘I" onClick={() => { setInvoiceDialogOpen(true); setShowCommandPalette(false); }} />
                      <div className="my-2 border-t border-white/10" />
                      <div className="px-2 py-1 text-xs font-semibold text-white/40 uppercase">Aperçu</div>
                      <CommandItem icon={Users} label={`${stats.activeLeads} leads actifs`} />
                      <CommandItem icon={UserCheck} label={`${stats.clients} clients`} />
                      <CommandItem icon={FileText} label={`${stats.pendingQuotes} devis en attente`} />
                      <CommandItem icon={DollarSign} label={`${stats.totalRevenue.toLocaleString('fr-FR')}€ CA réalisé`} />
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

// Composant helper
function CommandItem({ icon: Icon, label, shortcut, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left group"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-white/60 group-hover:text-[#00FFC2] transition-colors" />
        <span className="text-sm text-white">{label}</span>
      </div>
      {shortcut && (
        <kbd className="px-2 py-0.5 text-xs bg-white/10 text-white/60 rounded">{shortcut}</kbd>
      )}
    </button>
  );
}
