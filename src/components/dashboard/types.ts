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
  createdAt: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  title_fr?: string;
  title_en?: string;
  description: string;
  description_fr?: string;
  description_en?: string;
  clientId?: string;
  clientName?: string;
  status: "planning" | "in-progress" | "completed" | "on-hold" | "cancelled";
  category: "web" | "mobile" | "design" | "consulting" | "other";
  technologies: string[];
  budget?: number;
  startDate?: string;
  endDate?: string;
  completionPercentage?: number;
  image?: string;
  imageUrl?: string;
  isPinned: boolean;
  url?: string;
  githubUrl?: string;
  figmaUrl?: string;
  language?: "fr" | "en";
  createdAt: string;
  updatedAt?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName?: string;
  projectId?: string;
  projectName?: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
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
  revenueChange: number;
  activeProjects: number;
  projectsChange: number;
  pendingLeads: number;
  leadsChange: number;
  clientSatisfaction: number;
  satisfactionChange: number;
  totalClients?: number;
  totalInvoices?: number;
  paidInvoices?: number;
  overdueInvoices?: number;
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
  onDeleteLead: (leadId: string) => Promise<void>;
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
  onViewChange: (view: string) => void;
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
