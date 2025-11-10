/**
 * Seed TaskFlow - Projet de Test Production Bilingue
 * 
 * Ce fichier crée automatiquement un projet de production réaliste
 * en version FR + EN pour tester la fonctionnalité bilingue.
 * 
 * Usage : Importer dans App.tsx ou exécuter dans la console
 */

import { projectId, publicAnonKey } from './supabase/info';

export async function seedProjetTaskFlow() {
  console.log("🚀 Création du projet TaskFlow (FR + EN)...\n");

  const commonData = {
    clientName: "Projet personnel / Startup",
    budget: 45000,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    status: "completed",
    category: "web",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
    isPinned: true,
    spent: 42000,
    tags: ["SaaS", "Productivité", "Temps réel", "Collaboration"],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Node.js", "Stripe"],
    projectUrl: "https://taskflow-demo.vercel.app",
    githubUrl: "https://github.com/votre-username/taskflow-saas",
    imageGallery: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200"
    ],
  };

  // Version Française
  const projectFR = {
    ...commonData,
    name: "TaskFlow - Plateforme SaaS de Gestion de Projets",
    description: "Application web SaaS complète de gestion de projets avec tableaux Kanban, suivi du temps en temps réel, collaboration d'équipe et facturation automatisée. Conçue pour les équipes de 5 à 50 personnes avec système de permissions granulaires et tableau de bord analytique avancé.",
    duration: "6 mois",
    challenges: `Le projet présentait plusieurs défis techniques majeurs :

1. **Synchronisation temps réel** : Permettre à plusieurs utilisateurs de collaborer simultanément sur les mêmes tâches sans conflits de données

2. **Performance avec volumétrie** : Gérer efficacement des projets contenant plus de 10 000 tâches avec un temps de chargement < 2 secondes

3. **Système de permissions complexe** : Implémenter un RBAC (Role-Based Access Control) avec 6 rôles différents et permissions granulaires par projet

4. **Intégration paiements** : Connecter Stripe pour gérer les abonnements mensuels/annuels avec essai gratuit de 14 jours

5. **Exportation de données** : Permettre l'export PDF et Excel de rapports personnalisés en moins de 5 secondes

6. **Accessibilité** : Respecter les normes WCAG 2.1 niveau AA pour rendre l'application utilisable par tous`,
    solutions: `Architecture et technologies :

**Backend & Base de données**
- Utilisation de Supabase pour la base de données PostgreSQL avec Row Level Security (RLS) pour sécuriser les données par organisation
- Supabase Realtime pour la synchronisation WebSocket entre utilisateurs
- Edge Functions pour les traitements côté serveur (génération PDF, webhooks Stripe)

**Frontend & Performance**
- React 18 avec Server Components pour améliorer les performances de chargement initial
- Optimistic UI updates pour une expérience utilisateur fluide même avec latence
- Virtual scrolling (react-window) pour afficher des milliers de tâches sans lag
- Pagination côté serveur avec cache intelligent (React Query)

**Permissions & Sécurité**
- Système RBAC custom avec 6 rôles : Owner, Admin, Manager, Member, Guest, Viewer
- Permissions stockées en JSON dans PostgreSQL avec validation côté serveur
- Tokens JWT avec refresh automatique toutes les 15 minutes

**Intégrations**
- Stripe Checkout pour les paiements avec webhooks sécurisés
- API d'export utilisant jsPDF et xlsx avec génération côté serveur
- Système de notifications par email (Resend) et in-app

**Monitoring**
- Supabase Analytics pour le monitoring des performances
- Sentry pour le tracking des erreurs en production
- Posthog pour l'analyse comportementale des utilisateurs`,
    results: `Résultats mesurables après 6 mois de développement et 3 mois en production :

📊 **Métriques techniques**
- Temps de chargement initial : 1.8s (objectif < 2s) ✅
- Time to Interactive : 2.4s
- Lighthouse Score : 96/100
- 99.9% uptime sur 3 mois
- 0 incident de sécurité

👥 **Adoption utilisateurs**
- 847 utilisateurs actifs mensuels
- 12 000+ tâches créées
- 3 500+ projets gérés
- Taux de rétention : 78% après 3 mois
- NPS (Net Promoter Score) : 72/100

💰 **Business**
- 142 abonnements payants (MRR : 8 520€)
- Taux de conversion essai → payant : 24%
- Churn rate : 4.2% (excellent pour une SaaS)
- CAC (Customer Acquisition Cost) : 85€
- LTV (Lifetime Value) : 1 240€

⚡ **Performance**
- 65% des tâches exportées en < 3 secondes
- 0 conflit de synchronisation temps réel
- Temps de réponse API moyen : 180ms
- 23 000+ événements temps réel traités/jour

🎯 **Satisfaction client**
- Note moyenne : 4.7/5 (142 avis)
- 89% des utilisateurs recommandent la plateforme
- Temps moyen de réponse support : 2h30
- Taux de résolution premier contact : 76%`,
    language: "fr"
  };

  // Version Anglaise
  const projectEN = {
    ...commonData,
    name: "TaskFlow - SaaS Project Management Platform",
    description: "Complete SaaS web application for project management with Kanban boards, real-time tracking, team collaboration and automated billing. Designed for teams of 5 to 50 people with granular permission system and advanced analytics dashboard.",
    duration: "6 months",
    challenges: `The project presented several major technical challenges:

1. **Real-time synchronization**: Enable multiple users to collaborate simultaneously on the same tasks without data conflicts

2. **Performance with volume**: Efficiently manage projects containing over 10,000 tasks with loading time < 2 seconds

3. **Complex permission system**: Implement RBAC (Role-Based Access Control) with 6 different roles and granular per-project permissions

4. **Payment integration**: Connect Stripe to manage monthly/annual subscriptions with 14-day free trial

5. **Data export**: Enable PDF and Excel export of custom reports in less than 5 seconds

6. **Accessibility**: Meet WCAG 2.1 Level AA standards to make the application usable by everyone`,
    solutions: `Architecture and technologies:

**Backend & Database**
- Using Supabase for PostgreSQL database with Row Level Security (RLS) to secure data per organization
- Supabase Realtime for WebSocket synchronization between users
- Edge Functions for server-side processing (PDF generation, Stripe webhooks)

**Frontend & Performance**
- React 18 with Server Components to improve initial loading performance
- Optimistic UI updates for smooth user experience even with latency
- Virtual scrolling (react-window) to display thousands of tasks without lag
- Server-side pagination with intelligent caching (React Query)

**Permissions & Security**
- Custom RBAC system with 6 roles: Owner, Admin, Manager, Member, Guest, Viewer
- Permissions stored as JSON in PostgreSQL with server-side validation
- JWT tokens with automatic refresh every 15 minutes

**Integrations**
- Stripe Checkout for payments with secure webhooks
- Export API using jsPDF and xlsx with server-side generation
- Email notification system (Resend) and in-app

**Monitoring**
- Supabase Analytics for performance monitoring
- Sentry for production error tracking
- Posthog for user behavioral analysis`,
    results: `Measurable results after 6 months of development and 3 months in production:

📊 **Technical metrics**
- Initial load time: 1.8s (target < 2s) ✅
- Time to Interactive: 2.4s
- Lighthouse Score: 96/100
- 99.9% uptime over 3 months
- 0 security incidents

👥 **User adoption**
- 847 monthly active users
- 12,000+ tasks created
- 3,500+ projects managed
- Retention rate: 78% after 3 months
- NPS (Net Promoter Score): 72/100

💰 **Business**
- 142 paid subscriptions (MRR: €8,520)
- Trial → paid conversion rate: 24%
- Churn rate: 4.2% (excellent for SaaS)
- CAC (Customer Acquisition Cost): €85
- LTV (Lifetime Value): €1,240

⚡ **Performance**
- 65% of tasks exported in < 3 seconds
- 0 real-time sync conflicts
- Average API response time: 180ms
- 23,000+ real-time events processed/day

🎯 **Customer satisfaction**
- Average rating: 4.7/5 (142 reviews)
- 89% of users recommend the platform
- Average support response time: 2h30
- First contact resolution rate: 76%`,
    language: "en"
  };

  try {
    // Créer version française
    console.log("📝 Création version française...");
    const responseFR = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(projectFR),
      }
    );

    const dataFR = await responseFR.json();
    if (dataFR.success) {
      console.log("✅ Version FR créée :", dataFR.project?.id);
    } else {
      console.error("❌ Erreur FR :", dataFR);
    }

    // Créer version anglaise
    console.log("\n📝 Création version anglaise...");
    const responseEN = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(projectEN),
      }
    );

    const dataEN = await responseEN.json();
    if (dataEN.success) {
      console.log("✅ Version EN créée :", dataEN.project?.id);
    } else {
      console.error("❌ Erreur EN :", dataEN);
    }

    if (dataFR.success && dataEN.success) {
      console.log("\n" + "=".repeat(70));
      console.log("🎉 PROJET TASKFLOW CRÉÉ AVEC SUCCÈS (FR + EN)");
      console.log("=".repeat(70));
      console.log("\n📊 Résumé :");
      console.log(`  • Version FR : ${projectFR.name}`);
      console.log(`  • Version EN : ${projectEN.name}`);
      console.log(`  • Budget : ${projectFR.budget.toLocaleString()}€`);
      console.log(`  • Durée : ${projectFR.duration}`);
      console.log(`  • Statut : ${projectFR.status}`);
      console.log(`  • Technologies : ${projectFR.technologies.join(", ")}`);
      console.log("\n✅ Vérification :");
      console.log("  • Dashboard : /dashboard → Projets");
      console.log("  • Page FR : /projects?lang=fr");
      console.log("  • Page EN : /projects?lang=en");
      console.log("\n");
      
      return { success: true, projectFR: dataFR.project, projectEN: dataEN.project };
    } else {
      throw new Error("Échec de création d'une ou plusieurs versions");
    }
  } catch (error) {
    console.error("\n❌ ERREUR lors de la création :", error);
    console.log("\n💡 Solutions :");
    console.log("  1. Vérifier que le serveur est déployé");
    console.log("  2. Vérifier les credentials Supabase");
    console.log("  3. Tester avec : testProjectsRoutes()");
    return { success: false, error };
  }
}

// Export pour utilisation dans la console
(window as any).seedProjetTaskFlow = seedProjetTaskFlow;

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  🚀 SEED TASKFLOW DISPONIBLE                                  ║
╚════════════════════════════════════════════════════════════════╝

Pour créer automatiquement le projet TaskFlow bilingue :

  seedProjetTaskFlow()

Cela créera :
  ✅ Version française (TaskFlow - Plateforme SaaS...)
  ✅ Version anglaise (TaskFlow - SaaS Project Management...)

Avec toutes les données de production professionnelles !
`);
