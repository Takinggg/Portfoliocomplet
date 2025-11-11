/**
 * TypeScript Types for Dashboard Components
 * 
 * This file contains all interface definitions for the Dashboard page
 * to improve type safety and remove 'any' types.
 */

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  source: string;
  interests?: string[];
  wantsAppointment?: boolean;
  convertedToClient?: string;
  createdAt: string;
  updatedAt?: string;
  // Booking-related fields
  bookingId?: string;
  bookingDate?: string; // Alternative to preferredDate
  bookingTime?: string; // Alternative to preferredTime
  preferredDate?: string;
  preferredTime?: string;
  budget?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
  tags?: string[];
  revenue?: number;
  status?: "active" | "inactive";
  convertedFrom?: string; // Lead ID if converted from lead
  createdAt: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  // Bilingual fields
  name_fr: string;
  name_en: string;
  description_fr?: string;
  description_en?: string;
  tags_fr?: string[];
  tags_en?: string[];
  duration_fr?: string;
  duration_en?: string;
  challenges_fr?: string;
  challenges_en?: string;
  solutions_fr?: string;
  solutions_en?: string;
  results_fr?: string;
  results_en?: string;
  category_fr?: "web" | "mobile" | "design" | "consulting" | "other";
  category_en?: "web" | "mobile" | "design" | "consulting" | "other";
  // Legacy fields (for backward compatibility)
  title?: string;
  title_fr?: string;
  title_en?: string;
  description?: string;
  // Common fields
  clientId?: string;
  clientName?: string;
  status: "planning" | "in-progress" | "completed" | "on-hold" | "cancelled";
  category?: "web" | "mobile" | "design" | "consulting" | "other";
  technologies?: string[];
  budget?: number;
  startDate?: string;
  endDate?: string;
  completionPercentage?: number;
  image?: string;
  imageUrl?: string;
  isPinned?: boolean;
  url?: string;
  projectUrl?: string;
  githubUrl?: string;
  figmaUrl?: string;
  imageGallery?: string[];
  language?: "fr" | "en";
  createdAt: string;
  updatedAt?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  number?: string; // Alternative field name used in code
  clientId: string;
  clientName?: string;
  clientEmail?: string;
  projectId?: string;
  projectName?: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issueDate: string;
  dueDate: string;
  date?: string; // Alternative field for sorting
  paidDate?: string;
  subtotal: number;
  tax: number;
  total: number;
  amount?: number; // Alternative field name used in code
  currency: string;
  items: InvoiceItem[];
  description?: string;
  notes?: string;
  terms?: string;
  convertedFromQuote?: string; // Quote ID if converted from quote
  createdAt: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  duration?: string; // Field used in DashboardPage
  serviceType: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  budget?: string;
  leadId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Quote {
  id: string;
  clientId: string;
  clientName?: string;
  projectName: string;
  amount: number;
  description?: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  validUntil: string;
  items?: QuoteItem[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// ============================================================================
// DASHBOARD STATISTICS
// ============================================================================

export interface DashboardStats {
  revenue: number;
  revenueChange: string | number;
  activeProjects: number;
  projectsChange?: string | number;
  projectsInfo?: string; // "X en pause" format
  newLeads?: number;
  pendingLeads?: number;
  leadsChange: string | number;
  clientSatisfaction?: number;
  satisfactionChange?: string | number;
  totalClients?: number;
  totalInvoices?: number;
  paidInvoices?: number;
  overdueInvoices?: number;
  overdueAmount?: number;
}

// ============================================================================
// VIEW COMPONENT PROPS
// ============================================================================

export interface OverviewViewProps {
  stats: DashboardStats;
  leads: Lead[];
  projects: Project[];
  bookings: Booking[];
  loading: boolean;
}

export interface LeadsViewProps {
  leads: Lead[];
  onUpdateStatus: (leadId: string, status: Lead['status']) => Promise<void>;
  onRefresh: () => Promise<void>;
  onDeleteLead: (leadId: string, leadName: string) => Promise<void>;
  loading: boolean;
}

export interface ClientsViewProps {
  clients: Client[];
  onRefresh: () => Promise<void>;
  loading: boolean;
}

export interface ProjectsViewProps {
  projects: Project[];
  clients: Client[];
  onRefresh: () => Promise<void>;
  loading: boolean;
  onViewChange: (view: DashboardView) => void;
}

export interface InvoicesViewProps {
  invoices: Invoice[];
  clients: Client[];
  onRefresh: () => Promise<void>;
  loading: boolean;
}

export interface CalendarViewProps {
  bookings: Booking[];
  leads: Lead[];
  onRefresh: () => Promise<void>;
  loading: boolean;
}

export interface QuotesViewProps {
  quotes: Quote[];
  clients: Client[];
  onRefresh: () => Promise<void>;
  loading: boolean;
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export type DashboardView = 
  | "overview" 
  | "express" 
  | "leads" 
  | "clients" 
  | "projects" 
  | "invoices" 
  | "quotes" 
  | "calendar" 
  | "analytics" 
  | "settings" 
  | "emails" 
  | "blog" 
  | "case-studies" 
  | "newsletter" 
  | "resources" 
  | "testimonials" 
  | "seed-data";

export interface DashboardMenuItem {
  id: DashboardView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export interface DashboardCategory {
  name: string;
  items: DashboardMenuItem[];
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
  interests?: string[];
  wantsAppointment?: boolean;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
  tags?: string[];
}

export interface ProjectFormData {
  title: string;
  title_fr?: string;
  title_en?: string;
  description: string;
  description_fr?: string;
  description_en?: string;
  clientId?: string;
  status: Project['status'];
  category: Project['category'];
  technologies: string[];
  budget?: number;
  startDate?: string;
  endDate?: string;
  isPinned: boolean;
  language?: "fr" | "en";
}

export interface InvoiceFormData {
  clientId: string;
  projectId?: string;
  status: Invoice['status'];
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
  tax: number;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  serviceType: string;
  notes?: string;
  budget?: string;
}

// ============================================================================
// FILTER & SORT TYPES
// ============================================================================

export type LeadStatus = Lead['status'] | 'all';
export type ProjectStatus = Project['status'] | 'all';
export type InvoiceStatus = Invoice['status'] | 'all';
export type BookingStatus = Booking['status'] | 'all';

export type SortOrder = 'asc' | 'desc';
export type SortBy = 'date' | 'name' | 'amount' | 'status';

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FetchAllDataResponse {
  leads: Lead[];
  clients: Client[];
  projects: Project[];
  invoices: Invoice[];
  bookings: Booking[];
  quotes: Quote[];
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type LoadingState = boolean;
export type ErrorState = string | null;

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
