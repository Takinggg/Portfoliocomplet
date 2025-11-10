// Dashboard Content Router
// Gère le routage entre les différentes vues du dashboard

import { useEffect } from "react";
import { DashboardRouter } from "./DashboardRouter";
import EmailSettings from "./EmailSettings";
import { AnalyticsTab } from "./AnalyticsTab";
import { ExpressTab } from "./ExpressTab";
import { BlogTab } from "./BlogTab";
import { CaseStudiesTab } from "./CaseStudiesTab";
import { NewsletterTab } from "./NewsletterTab";
import { TestimonialsTab } from "./TestimonialsTab";

// Import diagnostic helpers (dev only)
if (import.meta.env.DEV) {
  import("../../utils/showDeploymentHelp");
  import("../../utils/diagnosticSupabase");
}

interface DashboardContentProps {
  currentView: string;
  renderView: () => React.ReactNode;
  leads?: any[];
  clients?: any[];
  projects?: any[];
  invoices?: any[];
  quotes?: any[];
}

export function DashboardContent({ currentView, renderView, leads = [], clients = [], projects = [], invoices = [], quotes = [] }: DashboardContentProps) {
  // Si c'est la vue emails, utiliser le composant EmailSettings directement
  if (currentView === "emails") {
    return <EmailSettings />;
  }
  
  // Si c'est la vue express, utiliser le composant ExpressTab
  if (currentView === "express") {
    return <ExpressTab leads={leads} clients={clients} projects={projects} invoices={invoices} quotes={quotes} />;
  }
  
  // Si c'est la vue analytics, utiliser le composant AnalyticsTab
  if (currentView === "analytics") {
    return <AnalyticsTab leads={leads} clients={clients} projects={projects} invoices={invoices} quotes={quotes} />;
  }
  
  // Si c'est la vue blog, utiliser le composant BlogTab
  if (currentView === "blog") {
    return <BlogTab />;
  }
  
  // Si c'est la vue case-studies, utiliser le composant CaseStudiesTab
  if (currentView === "case-studies") {
    return <CaseStudiesTab />;
  }
  
  // Si c'est la vue newsletter, utiliser le composant NewsletterTab
  if (currentView === "newsletter") {
    return <NewsletterTab />;
  }
  
  // Si c'est la vue testimonials, utiliser le composant TestimonialsTab
  if (currentView === "testimonials") {
    return <TestimonialsTab />;
  }
  
  // Sinon, utiliser le rendu par défaut (les vues existantes)
  return <>{renderView()}</>;
}
