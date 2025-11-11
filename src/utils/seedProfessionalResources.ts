import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "./supabase/info";
import { createClient } from "./supabase/client";

/**
 * Seed professional resources to the database
 * This includes guides, templates, and other downloadable resources
 */
export async function seedProfessionalResources(): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("Vous devez être connecté pour initialiser les ressources");
    }

    // Define professional resources
    const professionalResources = [
      {
        id: "guide-tarification-freelance-2024",
        title_fr: "Guide de Tarification Freelance 2024",
        title_en: "Freelance Pricing Guide 2024",
        description_fr: "Guide complet pour établir vos tarifs en tant que freelance avec des stratégies éprouvées.",
        description_en: "Complete guide to setting your freelance rates with proven strategies.",
        category: "guide",
        type: "pdf",
        fileUrl: "/resources/guide-tarification-freelance-2024-fr.html",
        size: "2.5 MB",
        downloads: 0,
        published: true,
        featured: true,
        tags: ["tarification", "freelance", "business"],
        language: "fr",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "freelance-pricing-guide-2024-en",
        title_fr: "Guide de Tarification Freelance 2024 (EN)",
        title_en: "Freelance Pricing Guide 2024",
        description_fr: "Guide complet pour établir vos tarifs en tant que freelance (version anglaise).",
        description_en: "Complete guide to setting your freelance rates with proven strategies.",
        category: "guide",
        type: "pdf",
        fileUrl: "/resources/freelance-pricing-guide-2024-en.html",
        size: "2.4 MB",
        downloads: 0,
        published: true,
        featured: true,
        tags: ["pricing", "freelance", "business"],
        language: "en",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "template-cahier-des-charges",
        title_fr: "Template Cahier des Charges",
        title_en: "Project Specification Template",
        description_fr: "Template professionnel pour rédiger un cahier des charges complet.",
        description_en: "Professional template for writing a complete project specification.",
        category: "template",
        type: "document",
        fileUrl: "/resources/template-cahier-des-charges.html",
        size: "1.2 MB",
        downloads: 0,
        published: true,
        featured: false,
        tags: ["template", "cahier des charges", "projet"],
        language: "fr",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "checklist-lancement-site",
        title_fr: "Checklist Lancement de Site Web",
        title_en: "Website Launch Checklist",
        description_fr: "Liste de contrôle complète pour le lancement d'un site web professionnel.",
        description_en: "Complete checklist for launching a professional website.",
        category: "checklist",
        type: "pdf",
        fileUrl: "/resources/checklist-lancement-site.html",
        size: "800 KB",
        downloads: 0,
        published: true,
        featured: false,
        tags: ["checklist", "lancement", "web"],
        language: "fr",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "template-proposition-commerciale",
        title_fr: "Template Proposition Commerciale",
        title_en: "Business Proposal Template",
        description_fr: "Modèle professionnel pour créer des propositions commerciales convaincantes.",
        description_en: "Professional template for creating convincing business proposals.",
        category: "template",
        type: "document",
        fileUrl: "/resources/template-proposition-commerciale-fr.html",
        size: "1.5 MB",
        downloads: 0,
        published: true,
        featured: true,
        tags: ["template", "proposition", "commercial"],
        language: "fr",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Send bulk resources to server
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources/bulk`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ resources: professionalResources }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to seed resources");
    }

    const result = await response.json();
    console.log("✅ Professional resources seeded:", result);
    
  } catch (error: unknown) {
    console.error("❌ Error seeding professional resources:", error);
    throw error;
  }
}

