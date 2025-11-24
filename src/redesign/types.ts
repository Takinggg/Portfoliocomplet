import React from 'react';

export interface KPI {
  label: string;
  label_en?: string;
  value: string;
  change?: string;
}

export interface TechItem {
  name: string;
  category: string;
}

export interface Project {
  id: number | string;
  // General
  title: string;
  title_en?: string;
  client: string;
  category: string;
  image: string;
  link: string;
  year?: string;
  subtitle?: string;
  subtitle_en?: string;
  timeline?: string;
  timeline_en?: string;
  role?: string;
  role_en?: string;
  
  // Short Description (Portfolio Card)
  description: string;
  description_en?: string;
  
  // Deep Dive (Case Study)
  challenge?: string;
  challenge_en?: string;
  solution?: string;
  solution_en?: string;
  deliverables?: string[];
  deliverables_en?: string[];
  feedback?: {
    quote: string;
    quote_en?: string;
    author: string;
    role?: string;
    role_en?: string;
  };
  
  // Lists
  tags: string[];
  techStack?: TechItem[];
  stats?: KPI[];
  
  // Gallery
  gallery?: string[];
}

export interface ServicePack {
  id: string;
  title: string;
  title_en?: string;
  price: string;
  price_en?: string;
  description: string;
  description_en?: string;
  features: string[];
  features_en?: string[];
  popular?: boolean;
}

export interface Message {
  id: number | string;
  name: string;
  email: string;
  type: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'archived';
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// CRM & FINANCE TYPES
export interface Client {
  id: number | string;
  name: string;
  company: string;
  role: string; // Job Title
  department: string;
  email: string;
  status: 'lead' | 'active' | 'inactive' | 'onboarding';
  avatar?: string;
  joinDate: string;
  totalRevenue: string;
}

export interface Quote {
  id: string;
  clientId: number | string;
  clientName: string;
  title: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  date: string;
  items: { description: string; price: number }[];
}

export interface Invoice {
  id: string;
  quoteId?: string;
  clientId: number | string;
  clientName: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  date: string;
  dueDate: string;
}

export interface Appointment {
  id: number | string;
  clientId: number | string;
  clientName: string;
  title: string;
  date: string; // ISO String
  duration: number; // minutes
  type: 'discovery' | 'review' | 'delivery';
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export type PageView = 'home' | 'services' | 'portfolio' | 'casestudies' | 'blog' | 'contact' | 'admin' | 'legal';

export type AdminView = 'overview' | 'projects' | 'casestudies' | 'blog' | 'services' | 'messages' | 'crm' | 'finance' | 'calendar';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  coverImage: string;
  date: string;
  readTime: number;
  category: string;
  tags: string[];
  slug: string;
  author?: {
    name: string;
    avatar: string;
  };
}