// Script pour ajouter des données de démo au dashboard
// À exécuter une seule fois pour populer le CRM

import { projectId, publicAnonKey } from "./supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${publicAnonKey}`,
};

// Données de démo
const demoLeads = [
  {
    name: "Sophie Dubois",
    email: "sophie.dubois@startup-tech.fr",
    phone: "+33 6 12 34 56 78",
    message: "Bonjour, je recherche un développeur fullstack pour créer une plateforme SaaS innovante dans le domaine de la santé.",
    source: "Formulaire contact",
    interests: ["Développement Web", "Application SaaS"],
    wantsAppointment: true,
    status: "new",
  },
  {
    name: "Marc Lefevre",
    email: "m.lefevre@agence-comm.com",
    phone: "+33 6 23 45 67 89",
    message: "Nous avons besoin d'un site vitrine moderne pour notre agence de communication.",
    source: "Recommandation",
    interests: ["Design UI/UX", "Site Vitrine"],
    wantsAppointment: false,
    status: "contacted",
  },
  {
    name: "Julie Martin",
    email: "julie@ecommerce-bio.fr",
    phone: "+33 6 34 56 78 90",
    message: "Refonte complète de notre site e-commerce avec intégration Shopify.",
    source: "LinkedIn",
    interests: ["E-commerce", "Développement Web"],
    wantsAppointment: true,
    status: "qualified",
  },
  {
    name: "Thomas Bernard",
    email: "thomas.bernard@fintech-startup.io",
    phone: "+33 6 45 67 89 01",
    message: "Développement d'une application mobile pour notre solution fintech.",
    source: "Formulaire contact",
    interests: ["Application Mobile", "Développement Web"],
    wantsAppointment: true,
    status: "converted",
  },
  {
    name: "Emma Rousseau",
    email: "emma@design-studio.fr",
    phone: "+33 6 56 78 90 12",
    message: "Besoin d'aide pour développer un portfolio interactif avec animations 3D.",
    source: "Instagram",
    interests: ["Design UI/UX", "Animations"],
    wantsAppointment: false,
    status: "converted",
  },
];

const demoProjects = [
  {
    name: "Refonte Site E-commerce BioMarket",
    clientName: "Julie Martin",
    clientId: "client_demo_1",
    status: "completed",
    budget: 15000,
    spent: 15000,
    startDate: "2024-09-01",
    endDate: "2024-11-01",
    duration: "2 mois",
    description: "Développement d'une boutique en ligne moderne avec Shopify, intégration de paiements sécurisés et système de gestion des stocks en temps réel.",
    imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80",
    category: "web",
    isPinned: true,
    tags: ["E-commerce", "Responsive", "SEO", "Paiement en ligne"],
    technologies: ["Shopify", "React", "Tailwind CSS", "Stripe", "Node.js"],
    projectUrl: "https://biomarket-demo.com",
    githubUrl: "",
    imageGallery: [
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
    ],
    challenges: "Le client avait besoin d'une solution e-commerce performante avec gestion de stock automatisée et synchronisation multi-canaux.",
    solutions: "Mise en place d'une architecture Shopify personnalisée avec API REST pour la gestion des stocks et webhooks pour la synchronisation temps réel.",
    results: "+240% de conversions en 3 mois, -65% de temps de chargement, ROI de 450%",
  },
  {
    name: "Application Mobile FinTech Pro",
    clientName: "Thomas Bernard",
    clientId: "client_demo_2",
    status: "completed",
    budget: 35000,
    spent: 35000,
    startDate: "2024-06-01",
    endDate: "2024-10-15",
    duration: "4 mois",
    description: "Application React Native pour gestion financière personnelle avec synchronisation bancaire et intelligence artificielle pour analyses prédictives.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    category: "mobile",
    isPinned: true,
    tags: ["Mobile", "FinTech", "IA", "Temps réel"],
    technologies: ["React Native", "TypeScript", "Firebase", "OpenAI API", "Plaid"],
    projectUrl: "https://fintechpro.app",
    githubUrl: "",
    imageGallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80"
    ],
    challenges: "Intégration sécurisée des APIs bancaires et mise en place d'un système de recommandations IA pour l'optimisation des finances.",
    solutions: "Utilisation de Plaid pour la connexion bancaire sécurisée et développement d'un modèle ML personnalisé pour les insights financiers.",
    results: "15k+ téléchargements en 2 mois, note 4.8/5 sur les stores, Featured par Apple",
  },
  {
    name: "Dashboard Analytics Premium",
    clientName: "Sophie Dubois",
    clientId: "client_demo_3",
    status: "completed",
    budget: 12000,
    spent: 12000,
    startDate: "2024-08-15",
    endDate: "2024-10-30",
    duration: "2.5 mois",
    description: "Tableau de bord interactif avec visualisations de données en temps réel, exports personnalisés et système d'alertes intelligentes pour le suivi des KPIs business.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    category: "web",
    isPinned: true,
    tags: ["Dashboard", "Analytics", "Data Viz", "Real-time"],
    technologies: ["React", "TypeScript", "D3.js", "Recharts", "Supabase", "PostgreSQL"],
    projectUrl: "https://analytics-premium.com",
    githubUrl: "",
    imageGallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
    ],
    challenges: "Affichage de grandes quantités de données en temps réel sans ralentissement de l'interface et avec une expérience utilisateur fluide.",
    solutions: "Optimisation avec virtualisation des listes, WebSockets pour les mises à jour temps réel, et mise en cache intelligente des données.",
    results: "+300% d'engagement utilisateur, -80% de temps de chargement, 99.9% d'uptime",
  },
];

const demoInvoices = [
  {
    number: "2024-001",
    clientName: "Julie Martin",
    amount: 5000,
    status: "paid",
    dueDate: "2024-11-15",
  },
  {
    number: "2024-002",
    clientName: "Thomas Bernard",
    amount: 10000,
    status: "sent",
    dueDate: "2024-12-10",
  },
];

const demoBookings = [
  {
    name: "Sophie Dubois",
    email: "sophie.dubois@startup-tech.fr",
    phone: "+33 6 12 34 56 78",
    date: "2025-11-08",
    time: "14:00",
    duration: 30,
    status: "confirmed",
    notes: "Discussion sur le projet SaaS - plateforme de santé",
    type: "video"
  },
  {
    name: "Emma Rousseau",
    email: "emma@design-studio.fr",
    phone: "+33 6 56 78 90 12",
    date: "2025-11-10",
    time: "10:30",
    duration: 60,
    status: "confirmed",
    notes: "Portfolio interactif avec animations 3D",
    type: "video"
  },
  {
    name: "Marc Lefevre",
    email: "m.lefevre@agence-comm.com",
    phone: "+33 6 23 45 67 89",
    date: "2025-11-06",
    time: "15:30",
    duration: 30,
    status: "pending",
    notes: "Site vitrine agence de communication",
    type: "call"
  },
  {
    name: "Alexandre Petit",
    email: "alex@startup-innovations.fr",
    phone: "+33 6 67 89 01 23",
    date: "2025-11-12",
    time: "11:00",
    duration: 45,
    status: "pending",
    notes: "Projet dashboard analytics temps réel",
    type: "video"
  },
  {
    name: "Claire Moreau",
    email: "claire.moreau@boutique-mode.fr",
    phone: "+33 6 78 90 12 34",
    date: "2025-11-14",
    time: "16:00",
    duration: 30,
    status: "confirmed",
    notes: "E-commerce mode - intégration paiements",
    type: "video"
  },
];

export async function seedDemoData() {
  try {
    console.log("🌱 Ajout des données de démo...");

    // Créer les leads
    for (const lead of demoLeads) {
      await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers,
        body: JSON.stringify(lead),
      });
    }
    console.log("✅ Leads créés");

    // Créer les projets
    for (const project of demoProjects) {
      await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers,
        body: JSON.stringify(project),
      });
    }
    console.log("✅ Projets créés");

    // Créer les factures
    for (const invoice of demoInvoices) {
      await fetch(`${API_BASE}/invoices`, {
        method: "POST",
        headers,
        body: JSON.stringify(invoice),
      });
    }
    console.log("✅ Factures créées");

    // Créer les réservations
    for (const booking of demoBookings) {
      await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers,
        body: JSON.stringify(booking),
      });
    }
    console.log("✅ Réservations créées");

    console.log("🎉 Données de démo ajoutées avec succès !");
    return true;
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
    return false;
  }
}
