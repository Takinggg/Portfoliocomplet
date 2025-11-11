import React from 'react';
import { BlogTabBilingual } from './BlogTabBilingual';
import { AnalyticsTab } from './AnalyticsTab';
import { ExpressTab } from './ExpressTab';
import EmailSettings from './EmailSettings';
import { CaseStudiesTab } from './CaseStudiesTab';
import { NewsletterTab } from './NewsletterTab';
import { TestimonialsTab } from './TestimonialsTab';
// Future: import other tabs (clients, leads, projects, invoices, etc.)

export interface ViewDefinition {
  key: string;
  label: string;
  icon?: React.ComponentType<any>;
  group: string; // logical grouping (CRM, Contenu...)
  component: React.ComponentType<any>;
  keepAlive?: boolean; // retained in memory
  searchable?: boolean; // participates in global search
  hidden?: boolean;
  description?: string;
}

// Minimal registry; extend as we refactor other tabs
export const viewRegistry: ViewDefinition[] = [
  {
    key: 'blog',
    label: 'Blog',
    group: 'Contenu',
    component: BlogTabBilingual,
    searchable: true,
    description: 'Gérez les articles bilingues'
  },
  {
    key: 'analytics',
    label: 'Analytics',
    group: 'Principal',
    component: AnalyticsTab,
    keepAlive: true,
    searchable: false,
    description: 'Indicateurs et tendances'
  },
  {
    key: 'express',
    label: 'Express',
    group: 'Principal',
    component: ExpressTab,
    description: 'Vue rapide multi-données'
  },
  {
    key: 'emails',
    label: 'Emails',
    group: 'Configuration',
    component: EmailSettings,
    description: 'Paramètres et modèles emails'
  },
  {
    key: 'case-studies',
    label: 'Études de cas',
    group: 'Contenu',
    component: CaseStudiesTab,
    description: 'Présentez vos projets réussis'
  },
  {
    key: 'newsletter',
    label: 'Newsletter',
    group: 'Contenu',
    component: NewsletterTab,
    description: 'Gérez vos campagnes'
  },
  {
    key: 'testimonials',
    label: 'Témoignages',
    group: 'Contenu',
    component: TestimonialsTab,
    description: 'Preuves sociales clients'
  }
];

export function getViewDefinition(key: string) {
  return viewRegistry.find(v => v.key === key);
}

export function groupViews() {
  return viewRegistry.reduce((acc, v) => {
    if (!acc[v.group]) acc[v.group] = [];
    acc[v.group].push(v);
    return acc;
  }, {} as Record<string, ViewDefinition[]>);
}

export function ViewRenderer({ currentView, injectedProps }: { currentView: string; injectedProps?: any }) {
  const def = getViewDefinition(currentView);
  if (!def) return <div className="text-white/50 text-sm">Vue inconnue: {currentView}</div>;
  const Comp = def.component as any;
  return <Comp {...injectedProps} />;
}
