/**
 * Seed de projets professionnels pour le portfolio
 * Crée des projets réalistes et visuellement attractifs
 */

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;

const professionalProjects = [
  {
    name: "Plateforme SaaS - Gestion de Projet",
    category: "web",
    status: "completed",
    description: "Application web complète pour la gestion de projets avec tableaux Kanban, suivi du temps et collaboration en temps réel.",
    budget: 15000,
    spent: 14500,
    startDate: "2024-01-15",
    endDate: "2024-04-30",
    duration: "3,5 mois",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
    tags: ["SaaS", "Collaboration", "Real-time", "Dashboard"],
    technologies: ["React", "TypeScript", "Supabase", "Tailwind CSS", "Recharts"],
    challenges: "Synchronisation temps réel entre plusieurs utilisateurs, gestion des permissions granulaires, et performance avec de grandes quantités de données.",
    solutions: "Utilisation de Supabase Realtime pour la synchronisation, implementation d'un système RBAC custom, et optimisation avec pagination côté serveur.",
    results: "500+ utilisateurs actifs quotidiens, 99.9% uptime, temps de chargement < 2s, satisfaction client 4.8/5",
    isPinned: true,
    language: "fr"
  },
  {
    name: "E-commerce Mobile - Mode Premium",
    category: "mobile",
    status: "completed",
    description: "Application mobile iOS/Android pour une marque de mode haut de gamme avec expérience d'achat immersive et AR.",
    budget: 25000,
    spent: 24000,
    startDate: "2023-09-01",
    endDate: "2024-02-15",
    duration: "5,5 mois",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200",
    tags: ["Mobile", "E-commerce", "AR", "Premium"],
    technologies: ["React Native", "Stripe", "Firebase", "ARKit", "Google Analytics"],
    projectUrl: "https://example-fashion.com",
    challenges: "Intégration de l'AR pour essayage virtuel, optimisation des images haute résolution, et expérience de paiement fluide.",
    solutions: "Utilisation d'ARKit/ARCore pour l'essayage virtuel, compression intelligente des images avec lazy loading, et Stripe Payment Sheet pour UX optimale.",
    results: "50k+ téléchargements en 3 mois, taux de conversion +35%, panier moyen +42%, note App Store 4.7/5",
    isPinned: true,
    language: "fr"
  },
  {
    name: "Dashboard Analytics B2B",
    category: "dashboard",
    status: "completed",
    description: "Tableau de bord analytique avancé avec visualisations interactives, rapports automatisés et prédictions IA.",
    budget: 18000,
    spent: 17200,
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    duration: "4 mois",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
    tags: ["Analytics", "B2B", "Data Viz", "AI"],
    technologies: ["Next.js", "D3.js", "PostgreSQL", "Python", "TensorFlow"],
    challenges: "Traitement de millions de données en temps réel, visualisations complexes performantes, et modèles ML précis.",
    solutions: "Architecture serverless pour scalabilité, Web Workers pour calculs lourds, et fine-tuning de modèles ML sur données métier.",
    results: "Traitement de 10M+ événements/jour, insights en <5s, précision ML 94%, économie de 200h/mois d'analyse manuelle",
    isPinned: true,
    language: "fr"
  },
  {
    name: "Automatisation Marketing Multi-canal",
    category: "automation",
    status: "completed",
    description: "Système d'automatisation marketing complet intégrant email, SMS, réseaux sociaux et CRM.",
    budget: 12000,
    spent: 11500,
    startDate: "2023-11-15",
    endDate: "2024-02-28",
    duration: "3,5 mois",
    imageUrl: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=1200",
    tags: ["Automation", "Marketing", "n8n", "Integration"],
    technologies: ["n8n", "Notion", "Airtable", "Zapier", "SendGrid", "Twilio"],
    challenges: "Synchronisation de 8 plateformes différentes, gestion des erreurs et retry logic, et respect du RGPD.",
    solutions: "Workflows n8n robustes avec error handling, queue system pour fiabilité, et consentement tracking RGPD-compliant.",
    results: "85% réduction temps de gestion, 10k+ contacts automatisés, ROI 4.5x, 0 incident depuis 6 mois",
    isPinned: false,
    language: "fr"
  },
  {
    name: "Assistant IA Conversationnel",
    category: "ai",
    status: "completed",
    description: "Chatbot intelligent avec GPT-4 pour le support client, réduction de 70% des tickets de niveau 1.",
    budget: 8000,
    spent: 7800,
    startDate: "2024-02-01",
    endDate: "2024-04-15",
    duration: "2,5 mois",
    imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200",
    tags: ["AI", "GPT-4", "Chatbot", "Support"],
    technologies: ["OpenAI API", "Langchain", "Pinecone", "React", "WebSocket"],
    projectUrl: "https://example-ai-support.com",
    challenges: "Contexte métier spécifique à intégrer, temps de réponse < 2s, et coûts API OpenAI maîtrisés.",
    solutions: "Fine-tuning avec documentation entreprise, caching intelligent des réponses, et fallback vers agents humains.",
    results: "70% de tickets niveau 1 résolus, satisfaction 4.6/5, économie 30k€/an, temps réponse moyen 1.2s",
    isPinned: false,
    language: "fr"
  },
  {
    name: "Design System Entreprise",
    category: "design",
    status: "completed",
    description: "Système de design complet avec composants React, documentation Storybook et tokens accessibles.",
    budget: 10000,
    spent: 9500,
    startDate: "2023-08-01",
    endDate: "2023-11-30",
    duration: "4 mois",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200",
    tags: ["Design System", "UI/UX", "Storybook", "Accessibility"],
    technologies: ["React", "TypeScript", "Storybook", "Figma", "Tailwind CSS"],
    githubUrl: "https://github.com/example/design-system",
    challenges: "Cohérence entre 15 applications existantes, accessibilité WCAG AA, et adoption par 30+ développeurs.",
    solutions: "Audit exhaustif des patterns existants, tokens CSS variables pour cohérence, et documentation interactive avec Storybook.",
    results: "50+ composants documentés, adoption 100% équipe, -60% temps de dev UI, score accessibilité 95/100",
    isPinned: false,
    language: "fr"
  }
];

export async function seedProjectsComplet() {
  console.log("🌱 Seeding professional projects...\n");
  
  let successCount = 0;
  let errorCount = 0;

  for (const project of professionalProjects) {
    try {
      console.log(`📝 Creating: ${project.name}...`);
      
      const response = await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(project),
      });

      const data = await response.json();

      if (data.success) {
        console.log(`✅ Created: ${project.name}`);
        successCount++;
      } else {
        console.log(`❌ Failed: ${project.name} - ${data.error}`);
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Error creating ${project.name}:`, error);
      errorCount++;
    }
  }

  console.log("\n═══════════════════════════════════════");
  console.log(`✅ Successfully created: ${successCount} projects`);
  if (errorCount > 0) {
    console.log(`❌ Failed: ${errorCount} projects`);
  }
  console.log("═══════════════════════════════════════\n");
  
  console.log("🎉 Portfolio seeding complete!");
  console.log("📱 Check your projects at: /projects");
  console.log("🎨 Manage them in Dashboard at: /dashboard");
}

// Export for console use
(window as any).seedProjectsComplet = seedProjectsComplet;

// Auto-message
console.log("🌱 Professional Projects Seeder loaded!");
console.log("🚀 Run: seedProjectsComplet()");
