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
  id: number;
  // General
  title: string;
  title_en?: string;
  client: string;
  category: string;
  image: string;
  link: string;
  year?: string;
  
  // Short Description (Portfolio Card)
  description: string;
  description_en?: string;
  
  // Deep Dive (Case Study)
  challenge?: string;
  challenge_en?: string;
  solution?: string;
  solution_en?: string;
  
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
  id: number;
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
  id: number;
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
  clientId: number;
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
  clientId: number;
  clientName: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  date: string;
  dueDate: string;
}

export interface Appointment {
  id: number;
  clientId: number;
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

export type PageView = 'home' | 'services' | 'portfolio' | 'casestudies' | 'contact' | 'admin';

export type AdminView = 'overview' | 'projects' | 'casestudies' | 'services' | 'messages' | 'crm' | 'finance' | 'calendar';