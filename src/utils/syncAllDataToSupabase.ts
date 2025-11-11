/**
 * Script de synchronisation COMPLÈTE de toutes les données vers Supabase
 * Ce script va uploader TOUTES les données depuis les seeds locaux vers la database KV
 */

import { projectId, publicAnonKey } from "./supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;

interface SyncResult {
  category: string;
  success: boolean;
  count: number;
  error?: string;
}

/**
 * Helper pour faire des requêtes au serveur
 */
async function serverRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  return response.json();
}

/**
 * Helper pour set des valeurs dans le KV store
 */
async function kvSet(key: string, value: any): Promise<void> {
  await serverRequest("/kv/set", {
    method: "POST",
    body: JSON.stringify({ key, value }),
  });
}

/**
 * 1. Sync Projects (depuis seedProjects.ts)
 */
async function syncProjects(): Promise<SyncResult> {
  try {
    console.log("📂 Synchronisation des projets...");
    
    const projects = [
      {
        id: "saas-analytics",
        title: "SaaS Analytics Platform",
        titleFr: "Plateforme d'Analytics SaaS",
        slug: "saas-analytics-platform",
        client: "TechCorp",
        category: "Web App",
        categoryFr: "Application Web",
        description: "Dashboard analytics avancé avec visualisations en temps réel",
        descriptionFr: "Dashboard analytics avancé avec visualisations en temps réel",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        tags: ["React", "TypeScript", "D3.js", "Node.js"],
        year: 2024,
        featured: true,
        stats: {
          duration: "6 mois",
          team: "4 développeurs",
          impact: "+40% productivité"
        },
        testimonial: {
          text: "Maxence a transformé nos données brutes en insights actionnables.",
          author: "Sarah Johnson",
          role: "CTO, TechCorp"
        },
        language: "fr"
      },
      {
        id: "ecommerce-mobile",
        title: "E-commerce Mobile App",
        titleFr: "Application E-commerce Mobile",
        slug: "ecommerce-mobile-app",
        client: "FashionBrand",
        category: "Mobile",
        categoryFr: "Mobile",
        description: "Application mobile native avec paiement intégré",
        descriptionFr: "Application mobile native avec paiement intégré",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
        tags: ["React Native", "Firebase", "Stripe"],
        year: 2023,
        featured: true,
        stats: {
          duration: "4 mois",
          team: "3 développeurs",
          impact: "+250% conversions"
        },
        language: "fr"
      },
      {
        id: "ai-content-generator",
        title: "AI Content Generator",
        titleFr: "Générateur de Contenu IA",
        slug: "ai-content-generator",
        client: "MediaHub",
        category: "AI/ML",
        categoryFr: "IA/ML",
        description: "Outil de génération de contenu propulsé par l'IA",
        descriptionFr: "Outil de génération de contenu propulsé par l'IA",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
        tags: ["Python", "OpenAI", "FastAPI", "React"],
        year: 2024,
        featured: true,
        stats: {
          duration: "5 mois",
          team: "5 développeurs",
          impact: "-70% temps création"
        },
        language: "fr"
      }
    ];

    let count = 0;
    for (const project of projects) {
      await kvSet(`project_${project.id}`, project);
      count++;
      console.log(`  ✅ ${project.title}`);
    }

    return { category: "Projects", success: true, count };
  } catch (error: unknown) {
    console.error("❌ Erreur sync projects:", error);
    return { category: "Projects", success: false, count: 0, error: error.message };
  }
}

/**
 * 2. Sync Blog Posts (depuis seedBlogPosts.ts)
 */
async function syncBlogPosts(): Promise<SyncResult> {
  try {
    console.log("📝 Synchronisation des articles de blog...");
    
    const posts = [
      {
        id: "blog_post_1",
        slug: "comment-creer-saas-moderne-2024",
        title: "Comment créer un SaaS moderne en 2024",
        excerpt: "Guide complet pour lancer votre SaaS avec les meilleures technologies",
        content: "# Introduction\n\nCréer un SaaS en 2024 nécessite une approche moderne...",
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop",
        category: "Development",
        tags: ["SaaS", "Startup", "Web Development"],
        author: "Maxence",
        authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        publishedAt: "2024-01-15T10:00:00Z",
        readingTime: 8,
        views: 1250,
        featured: true,
        published: true,
        language: "fr"
      },
      {
        id: "blog_post_2",
        slug: "guide-complet-react-hooks-2024",
        title: "Guide complet des React Hooks en 2024",
        excerpt: "Maîtrisez tous les hooks React pour des applications performantes",
        content: "# Les React Hooks\n\nLes hooks ont révolutionné React...",
        coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop",
        category: "Tutorial",
        tags: ["React", "JavaScript", "Frontend"],
        author: "Maxence",
        authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        publishedAt: "2024-01-20T14:30:00Z",
        readingTime: 12,
        views: 890,
        featured: true,
        published: true,
        language: "fr"
      }
    ];

    let count = 0;
    for (const post of posts) {
      await kvSet(post.id, post);
      count++;
      console.log(`  ✅ ${post.title}`);
    }

    return { category: "Blog Posts", success: true, count };
  } catch (error: unknown) {
    console.error("❌ Erreur sync blog posts:", error);
    return { category: "Blog Posts", success: false, count: 0, error: error.message };
  }
}

/**
 * 3. Sync Case Studies (depuis seedCaseStudies.ts)
 */
async function syncCaseStudies(): Promise<SyncResult> {
  try {
    console.log("📚 Synchronisation des case studies...");
    
    const caseStudies = [
      {
        id: "fintech-revolution",
        slug: "fintech-revolution",
        title: "Révolution FinTech",
        titleEn: "FinTech Revolution",
        client: "BankFlow",
        industry: "Finance",
        industryEn: "Finance",
        summary: "Transformation digitale complète d'une plateforme bancaire",
        summaryEn: "Complete digital transformation of a banking platform",
        challenge: "Moderniser une infrastructure bancaire vieillissante...",
        challengeEn: "Modernize an aging banking infrastructure...",
        solution: "Architecture cloud-native avec microservices...",
        solutionEn: "Cloud-native architecture with microservices...",
        results: [
          { metric: "Performance", value: "+85%", description: "Temps de réponse amélioré" },
          { metric: "Utilisateurs", value: "500K+", description: "Utilisateurs actifs mensuels" },
          { metric: "Satisfaction", value: "4.8/5", description: "Note moyenne" }
        ],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
        gallery: [
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
        ],
        technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"],
        duration: "8 mois",
        team: "6 développeurs",
        featured: true,
        publishedAt: "2024-01-10T00:00:00Z",
        language: "fr"
      }
    ];

    let count = 0;
    for (const study of caseStudies) {
      await kvSet(`case_study_${study.id}`, study);
      count++;
      console.log(`  ✅ ${study.title}`);
    }

    return { category: "Case Studies", success: true, count };
  } catch (error: unknown) {
    console.error("❌ Erreur sync case studies:", error);
    return { category: "Case Studies", success: false, count: 0, error: error.message };
  }
}

/**
 * 4. Sync FAQs (depuis seedFAQ.ts)
 */
async function syncFAQs(): Promise<SyncResult> {
  try {
    console.log("❓ Synchronisation des FAQs...");
    
    const faqs = [
      {
        id: "faq_1",
        question: "Quels sont vos tarifs ?",
        questionEn: "What are your rates?",
        answer: "Mes tarifs varient selon la complexité et l'envergure du projet...",
        answerEn: "My rates vary depending on the complexity and scope of the project...",
        category: "Tarifs",
        categoryEn: "Pricing",
        order: 1,
        language: "fr"
      },
      {
        id: "faq_2",
        question: "Quels types de projets réalisez-vous ?",
        questionEn: "What types of projects do you work on?",
        answer: "Je me spécialise dans le développement web et mobile...",
        answerEn: "I specialize in web and mobile development...",
        category: "Services",
        categoryEn: "Services",
        order: 2,
        language: "fr"
      }
    ];

    let count = 0;
    for (const faq of faqs) {
      await kvSet(`faq_${faq.id}`, faq);
      count++;
      console.log(`  ✅ ${faq.question}`);
    }

    return { category: "FAQs", success: true, count };
  } catch (error: unknown) {
    console.error("❌ Erreur sync FAQs:", error);
    return { category: "FAQs", success: false, count: 0, error: error.message };
  }
}

/**
 * 5. Sync Testimonials (depuis seedTestimonials.ts)
 */
async function syncTestimonials(): Promise<SyncResult> {
  try {
    console.log("💬 Synchronisation des témoignages...");
    
    const testimonials = [
      {
        id: "testimonial_1",
        name: "Sophie Martin",
        role: "CEO",
        roleEn: "CEO",
        company: "TechStart",
        text: "Maxence a dépassé toutes nos attentes. Son expertise technique et sa capacité à comprendre nos besoins métier ont fait la différence.",
        textEn: "Maxence exceeded all our expectations. His technical expertise and ability to understand our business needs made all the difference.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        featured: true,
        language: "fr"
      },
      {
        id: "testimonial_2",
        name: "Thomas Dubois",
        role: "CTO",
        roleEn: "CTO",
        company: "InnovateLab",
        text: "Un développeur passionné qui livre toujours du code de qualité. Je recommande vivement !",
        textEn: "A passionate developer who always delivers quality code. Highly recommended!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        featured: true,
        language: "fr"
      }
    ];

    let count = 0;
    for (const testimonial of testimonials) {
      await kvSet(`testimonial_${testimonial.id}`, testimonial);
      count++;
      console.log(`  ✅ ${testimonial.name}`);
    }

    return { category: "Testimonials", success: true, count };
  } catch (error: unknown) {
    console.error("❌ Erreur sync testimonials:", error);
    return { category: "Testimonials", success: false, count: 0, error: error.message };
  }
}

/**
 * 6. Sync Resources (depuis seedResources.ts)
 */
async function syncResources(): Promise<SyncResult> {
  try {
    console.log("📚 Synchronisation des ressources...");
    
    const resources = [
      {
        id: "resource_checklist",
        slug: "checklist-lancement-site",
        slugEn: "website-launch-checklist",
        title: "Checklist de lancement de site web",
        titleEn: "Website Launch Checklist",
        description: "Liste complète pour ne rien oublier avant de lancer votre site",
        descriptionEn: "Complete checklist to ensure nothing is forgotten before launching your site",
        type: "checklist",
        category: "Lancement",
        categoryEn: "Launch",
        downloadUrl: "/resources/checklist-lancement-site-complete.html",
        downloadCount: 523,
        featured: true,
        language: "fr"
      },
      {
        id: "resource_guide",
        slug: "guide-cahier-des-charges",
        slugEn: "requirements-guide",
        title: "Guide du cahier des charges",
        titleEn: "Requirements Guide",
        description: "Comment rédiger un cahier des charges efficace",
        descriptionEn: "How to write an effective requirements document",
        type: "guide",
        category: "Documentation",
        categoryEn: "Documentation",
        downloadUrl: "/resources/guide-cahier-des-charges-complet.html",
        downloadCount: 412,
        featured: true,
        language: "fr"
      }
    ];

    let count = 0;
    for (const resource of resources) {
      await kvSet(`resource_${resource.id}`, resource);
      count++;
      console.log(`  ✅ ${resource.title}`);
    }

    return { category: "Resources", success: true, count };
  } catch (error: unknown) {
    console.error("❌ Erreur sync resources:", error);
    return { category: "Resources", success: false, count: 0, error: error.message };
  }
}

/**
 * Fonction principale de synchronisation
 */
export async function syncAllDataToSupabase(): Promise<{
  success: boolean;
  results: SyncResult[];
  summary: string;
}> {
  console.log("🚀 DÉBUT DE LA SYNCHRONISATION COMPLÈTE");
  console.log("=" .repeat(60));

  const results: SyncResult[] = [];

  // 1. Vérifier que le serveur est accessible
  try {
    const healthResponse = await serverRequest("/health");
    console.log("✅ Serveur accessible:", healthResponse.message);
  } catch (error: unknown) {
    console.error("❌ ERREUR: Le serveur n'est pas accessible");
    console.error("   Détails:", error.message);
    return {
      success: false,
      results: [],
      summary: `❌ Échec: serveur non accessible (${error.message})`
    };
  }

  // 2. Synchroniser toutes les catégories
  results.push(await syncProjects());
  results.push(await syncBlogPosts());
  results.push(await syncCaseStudies());
  results.push(await syncFAQs());
  results.push(await syncTestimonials());
  results.push(await syncResources());

  // 3. Générer le résumé
  console.log("\n" + "=".repeat(60));
  console.log("📊 RÉSUMÉ DE LA SYNCHRONISATION");
  console.log("=".repeat(60));

  const totalSuccess = results.filter(r => r.success).length;
  const totalCount = results.reduce((sum, r) => sum + r.count, 0);

  results.forEach(result => {
    const icon = result.success ? "✅" : "❌";
    console.log(`${icon} ${result.category}: ${result.count} éléments`);
    if (result.error) {
      console.log(`   Erreur: ${result.error}`);
    }
  });

  const allSuccess = results.every(r => r.success);
  const summary = allSuccess
    ? `✅ SUCCÈS: ${totalCount} éléments synchronisés dans ${results.length} catégories`
    : `⚠️ PARTIEL: ${totalSuccess}/${results.length} catégories synchronisées`;

  console.log("\n" + summary);
  console.log("=".repeat(60));

  return {
    success: allSuccess,
    results,
    summary
  };
}

// Exporter pour utilisation dans la console
(window as any).syncAllDataToSupabase = syncAllDataToSupabase;

console.log("📝 Utilitaire de synchronisation chargé");
console.log("   Exécuter: window.syncAllDataToSupabase()");

