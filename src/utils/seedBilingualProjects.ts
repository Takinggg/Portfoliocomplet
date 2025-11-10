/**
 * Seed Bilingual Projects
 * Crée des versions FR et EN de chaque projet
 */

import { projectId, publicAnonKey } from './supabase/info';

interface BilingualProject {
  id: string;
  fr: {
    name: string;
    description: string;
    clientName?: string;
    challenges?: string;
    solutions?: string;
    results?: string;
  };
  en: {
    name: string;
    description: string;
    clientName?: string;
    challenges?: string;
    solutions?: string;
    results?: string;
  };
  common: {
    category: string;
    imageUrl?: string;
    technologies?: string[];
    tags?: string[];
    budget?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    isPinned?: boolean;
    projectUrl?: string;
    githubUrl?: string;
    imageGallery?: string[];
    duration?: string;
  };
}

const BILINGUAL_PROJECTS: BilingualProject[] = [
  {
    id: "1",
    fr: {
      name: "Plateforme E-commerce",
      description: "Plateforme e-commerce moderne avec dashboard admin complet. Développement d'une solution complète avec gestion des produits, paiements en ligne, système de livraison et dashboard d'administration avancé.",
      clientName: "TechStore Inc.",
      challenges: "Créer une expérience d'achat fluide avec un temps de chargement minimal et une interface intuitive",
      solutions: "Architecture micro-services, CDN global, optimisation des images, cache intelligent",
      results: "+250% de conversions, temps de chargement réduit de 60%, interface mobile-first primée"
    },
    en: {
      name: "E-commerce Platform",
      description: "Modern e-commerce platform with complete admin dashboard. Development of a comprehensive solution with product management, online payments, delivery system and advanced administration dashboard.",
      clientName: "TechStore Inc.",
      challenges: "Create a smooth shopping experience with minimal loading time and intuitive interface",
      solutions: "Micro-services architecture, global CDN, image optimization, intelligent caching",
      results: "+250% conversions, 60% loading time reduction, award-winning mobile-first interface"
    },
    common: {
      category: "web",
      imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=800&fit=crop",
      technologies: ["React", "Node.js", "Stripe", "MongoDB", "Redis"],
      tags: ["E-commerce", "Full Stack", "Payment"],
      budget: 45000,
      status: "completed",
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      isPinned: true,
      duration: "3 mois / 3 months"
    }
  },
  {
    id: "2",
    fr: {
      name: "Application Bancaire Mobile",
      description: "Application bancaire mobile sécurisée et intuitive. Application mobile de gestion bancaire avec authentification biométrique, virements instantanés, et suivi des dépenses en temps réel.",
      clientName: "SecureBank",
      challenges: "Garantir une sécurité maximale tout en offrant une expérience utilisateur fluide",
      solutions: "Authentification biométrique, chiffrement bout-en-bout, architecture zero-trust",
      results: "100K+ téléchargements, 4.8/5 sur l'App Store, certification bancaire obtenue"
    },
    en: {
      name: "Mobile Banking App",
      description: "Secure and intuitive mobile banking application. Mobile banking management app with biometric authentication, instant transfers, and real-time expense tracking.",
      clientName: "SecureBank",
      challenges: "Ensure maximum security while providing a smooth user experience",
      solutions: "Biometric authentication, end-to-end encryption, zero-trust architecture",
      results: "100K+ downloads, 4.8/5 on App Store, banking certification obtained"
    },
    common: {
      category: "mobile",
      imageUrl: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=1200&h=800&fit=crop",
      technologies: ["React Native", "Firebase", "Stripe", "Face ID", "Biometric"],
      tags: ["Mobile", "Banking", "Security"],
      budget: 55000,
      status: "completed",
      startDate: "2024-02-01",
      endDate: "2024-06-01",
      isPinned: true,
      duration: "4 mois / 4 months"
    }
  },
  {
    id: "3",
    fr: {
      name: "Dashboard Analytics SaaS",
      description: "Dashboard analytics temps réel pour entreprises SaaS. Tableau de bord d'analytics complet avec visualisations interactives, rapports personnalisables et intégrations API multiples.",
      clientName: "DataCorp",
      challenges: "Traiter des millions d'événements par jour avec une latence minimale",
      solutions: "Architecture événementielle, streaming de données, micro-frontends",
      results: "Traitement de 1M+ événements/jour, dashboard temps réel sub-seconde"
    },
    en: {
      name: "SaaS Analytics Dashboard",
      description: "Real-time analytics dashboard for SaaS companies. Complete analytics dashboard with interactive visualizations, customizable reports and multiple API integrations.",
      clientName: "DataCorp",
      challenges: "Process millions of events per day with minimal latency",
      solutions: "Event-driven architecture, data streaming, micro-frontends",
      results: "Processing 1M+ events/day, sub-second real-time dashboard"
    },
    common: {
      category: "dashboard",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
      technologies: ["Next.js", "TypeScript", "D3.js", "PostgreSQL", "Redis"],
      tags: ["Analytics", "SaaS", "Real-time"],
      budget: 38000,
      status: "completed",
      startDate: "2024-03-10",
      endDate: "2024-05-10",
      isPinned: true,
      duration: "2 mois / 2 months"
    }
  },
  {
    id: "4",
    fr: {
      name: "CRM Automatisé Notion",
      description: "Système de gestion client complet. Workflow n8n connecté à Notion pour automatiser la facturation, les relances et le suivi client avec intégration complète des outils existants.",
      clientName: "FreelanceHub",
      challenges: "Automatiser les tâches répétitives tout en maintenant la flexibilité",
      solutions: "Workflows n8n personnalisés, intégrations API, webhooks temps réel",
      results: "-83% de temps de gestion, automatisation complète du suivi client"
    },
    en: {
      name: "Automated Notion CRM",
      description: "Complete client management system. n8n workflow connected to Notion to automate invoicing, follow-ups and client tracking with full integration of existing tools.",
      clientName: "FreelanceHub",
      challenges: "Automate repetitive tasks while maintaining flexibility",
      solutions: "Custom n8n workflows, API integrations, real-time webhooks",
      results: "-83% management time, complete automation of client tracking"
    },
    common: {
      category: "automation",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
      technologies: ["n8n", "Notion API", "Webhook", "JavaScript"],
      tags: ["Automation", "CRM", "Notion"],
      budget: 12000,
      status: "completed",
      startDate: "2024-01-05",
      endDate: "2024-02-20",
      isPinned: false,
      duration: "1.5 mois / 1.5 months"
    }
  },
  {
    id: "5",
    fr: {
      name: "Assistant IA Support Client",
      description: "Chatbot intelligent avec GPT-4. Bot conversationnel qui répond aux questions clients 24/7, réduit le temps de réponse de 60% et améliore la satisfaction client.",
      clientName: "SupportPro",
      challenges: "Créer un assistant IA capable de comprendre le contexte et les émotions",
      solutions: "Fine-tuning GPT-4, RAG avec base de connaissances, sentiment analysis",
      results: "-60% de temps de réponse, 92% de satisfaction client, disponibilité 24/7"
    },
    en: {
      name: "AI Customer Support Assistant",
      description: "Intelligent chatbot with GPT-4. Conversational bot that answers customer questions 24/7, reduces response time by 60% and improves customer satisfaction.",
      clientName: "SupportPro",
      challenges: "Create an AI assistant capable of understanding context and emotions",
      solutions: "GPT-4 fine-tuning, RAG with knowledge base, sentiment analysis",
      results: "-60% response time, 92% customer satisfaction, 24/7 availability"
    },
    common: {
      category: "ai",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",
      technologies: ["OpenAI GPT-4", "Python", "LangChain", "Vector DB"],
      tags: ["AI", "Chatbot", "Customer Support"],
      budget: 28000,
      status: "completed",
      startDate: "2024-04-01",
      endDate: "2024-06-15",
      isPinned: false,
      duration: "2.5 mois / 2.5 months"
    }
  },
  {
    id: "6",
    fr: {
      name: "Site Portfolio + Générateur IA",
      description: "Site vitrine avec contenu généré par IA. Landing page optimisée SEO avec textes générés par GPT, images Midjourney et design moderne sur-mesure.",
      clientName: "Creative Studio",
      challenges: "Créer un portfolio unique qui se démarque avec un budget limité",
      solutions: "Génération de contenu IA, optimisation SEO avancée, animations CSS",
      results: "+200% de trafic, +150% de leads, temps de chargement < 1s"
    },
    en: {
      name: "Portfolio Site + AI Generator",
      description: "Showcase website with AI-generated content. SEO-optimized landing page with GPT-generated texts, Midjourney images and custom modern design.",
      clientName: "Creative Studio",
      challenges: "Create a unique portfolio that stands out with a limited budget",
      solutions: "AI content generation, advanced SEO optimization, CSS animations",
      results: "+200% traffic, +150% leads, loading time < 1s"
    },
    common: {
      category: "web",
      imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=800&fit=crop",
      technologies: ["React", "Tailwind CSS", "OpenAI", "Vercel"],
      tags: ["Web Design", "AI Content", "SEO"],
      budget: 8500,
      status: "completed",
      startDate: "2023-11-01",
      endDate: "2023-12-15",
      isPinned: false,
      duration: "1.5 mois / 1.5 months"
    }
  }
];

/**
 * Seed bilingual projects to the server
 */
export async function seedBilingualProjects() {
  console.log("🌍 Starting BILINGUAL projects seed...\n");
  
  try {
    const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;
    let successCount = 0;
    let errorCount = 0;
    
    for (const bilingualProject of BILINGUAL_PROJECTS) {
      // Create French version
      try {
        const frProject = {
          id: `${bilingualProject.id}_fr`,
          name: bilingualProject.fr.name,
          description: bilingualProject.fr.description,
          clientName: bilingualProject.fr.clientName,
          challenges: bilingualProject.fr.challenges,
          solutions: bilingualProject.fr.solutions,
          results: bilingualProject.fr.results,
          ...bilingualProject.common,
          language: "fr",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const frResponse = await fetch(`${baseUrl}/kv/set`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            key: `project_${bilingualProject.id}_fr`,
            value: frProject
          })
        });

        if (frResponse.ok) {
          console.log(`✅ FR: ${bilingualProject.fr.name}`);
          successCount++;
        } else {
          const error = await frResponse.text();
          console.error(`❌ Failed FR: ${bilingualProject.fr.name}`, error);
          errorCount++;
        }
      } catch (error) {
        console.error(`❌ Error seeding FR version:`, error);
        errorCount++;
      }
      
      // Create English version
      try {
        const enProject = {
          id: `${bilingualProject.id}_en`,
          name: bilingualProject.en.name,
          description: bilingualProject.en.description,
          clientName: bilingualProject.en.clientName,
          challenges: bilingualProject.en.challenges,
          solutions: bilingualProject.en.solutions,
          results: bilingualProject.en.results,
          ...bilingualProject.common,
          language: "en",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const enResponse = await fetch(`${baseUrl}/kv/set`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            key: `project_${bilingualProject.id}_en`,
            value: enProject
          })
        });

        if (enResponse.ok) {
          console.log(`✅ EN: ${bilingualProject.en.name}`);
          successCount++;
        } else {
          const error = await enResponse.text();
          console.error(`❌ Failed EN: ${bilingualProject.en.name}`, error);
          errorCount++;
        }
      } catch (error) {
        console.error(`❌ Error seeding EN version:`, error);
        errorCount++;
      }
      
      console.log(""); // Empty line between projects
    }

    console.log("═".repeat(60));
    console.log("🎉 Bilingual projects seed completed!");
    console.log(`✅ Success: ${successCount} projects`);
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount} projects`);
    }
    console.log("═".repeat(60));
    
    return { success: true, successCount, errorCount };
  } catch (error) {
    console.error("❌ Bilingual projects seed failed:", error);
    return { success: false, error };
  }
}

/**
 * Check bilingual projects in database
 */
export async function checkBilingualProjects() {
  try {
    const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;
    
    console.log("🔍 Checking bilingual projects...\n");
    
    // Check French projects
    const frResponse = await fetch(`${baseUrl}/projects?lang=fr`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      }
    });

    // Check English projects
    const enResponse = await fetch(`${baseUrl}/projects?lang=en`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      }
    });

    if (frResponse.ok && enResponse.ok) {
      const frData = await frResponse.json();
      const enData = await enResponse.json();
      
      console.log("═".repeat(60));
      console.log(`🇫🇷 French projects: ${frData.projects?.length || 0}`);
      frData.projects?.forEach((p: any) => {
        console.log(`   • ${p.name} (${p.category})`);
      });
      
      console.log("");
      console.log(`🇬🇧 English projects: ${enData.projects?.length || 0}`);
      enData.projects?.forEach((p: any) => {
        console.log(`   • ${p.name} (${p.category})`);
      });
      console.log("═".repeat(60));
      
      return { 
        fr: frData.projects || [], 
        en: enData.projects || [] 
      };
    } else {
      console.error("❌ Failed to fetch projects");
      return { fr: [], en: [] };
    }
  } catch (error) {
    console.error("❌ Error checking bilingual projects:", error);
    return { fr: [], en: [] };
  }
}

// Expose functions to window for console access
if (typeof window !== 'undefined') {
  (window as any).seedBilingualProjects = seedBilingualProjects;
  (window as any).checkBilingualProjects = checkBilingualProjects;
  
  console.log("🌍 Bilingual Projects utilities loaded:");
  console.log("   • seedBilingualProjects() - Seed 6 projects in FR + EN (12 total)");
  console.log("   • checkBilingualProjects() - Check projects by language");
}
