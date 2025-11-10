/**
 * Migration script to add English translations to existing FAQ questions
 * Run in browser console: await window.migrateFAQToMultilingual()
 */

import { projectId } from "./supabase/info";
import { createClient } from "./supabase/client";

// Sample English translations for common FAQ questions
const englishTranslations: Record<string, { question_en: string; answer_en: string; keywords_en: string[] }> = {
  "Quels services proposez-vous ?": {
    question_en: "What services do you offer?",
    answer_en: "I offer a complete range of digital services: web and mobile development (React, Next.js, React Native), UI/UX design (Figma, prototyping), technical consulting, existing site redesign, and custom support for your digital projects. Each project is unique and tailored to your specific needs.",
    keywords_en: ["services", "offerings", "development", "design", "web", "mobile", "consulting"]
  },
  "Travaillez-vous avec des technologies spécifiques ?": {
    question_en: "Do you work with specific technologies?",
    answer_en: "I specialize in the modern JavaScript ecosystem: React, Next.js, TypeScript, Node.js, Tailwind CSS. For mobile, I use React Native. On the backend, I work with Supabase, Firebase, or REST/GraphQL APIs. I always choose the tech stack best suited to your project.",
    keywords_en: ["technologies", "stack", "react", "nextjs", "typescript", "supabase", "firebase"]
  },
  "Proposez-vous de la maintenance après livraison ?": {
    question_en: "Do you offer maintenance after delivery?",
    answer_en: "Yes, absolutely! I offer several maintenance packages: on-demand support, monthly maintenance, or long-term support. This includes security updates, bug fixes, feature additions, and performance optimizations. Maintenance can be discussed from the initial quote.",
    keywords_en: ["maintenance", "support", "follow-up", "post-delivery", "updates"]
  },
  "Pouvez-vous reprendre un projet existant ?": {
    question_en: "Can you take over an existing project?",
    answer_en: "Absolutely! I can work on an existing project to: fix bugs, add features, improve performance, modernize the tech stack, or completely redesign the interface. I always start with a free technical audit to assess the project's state and propose the best solutions.",
    keywords_en: ["takeover", "existing project", "redesign", "improvement", "audit", "legacy"]
  },
  "Travaillez-vous seul ou en équipe ?": {
    question_en: "Do you work alone or in a team?",
    answer_en: "I primarily work solo to ensure maximum quality and consistency. For larger projects, I collaborate with a trusted network of freelancers (designers, copywriters, SEO specialists). You have a single point of contact: me. It's simple and efficient.",
    keywords_en: ["team", "solo", "freelance", "collaboration", "partners"]
  },
  "Pouvez-vous créer une application mobile ?": {
    question_en: "Can you create a mobile application?",
    answer_en: "Yes! I develop cross-platform mobile apps with React Native, which allows creating iOS and Android apps with a single codebase. It's faster and more cost-effective than native development. If you need pure native performance, I can recommend trusted native developer partners.",
    keywords_en: ["mobile", "app", "react native", "ios", "android", "application"]
  },
  // Add more translations as needed
};

async function migrateFAQToMultilingual() {
  console.log("🚀 Starting FAQ multilingual migration...");
  
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("❌ Not authenticated. Please login first.");
      return { success: false, error: "Not authenticated" };
    }

    // Fetch all FAQ questions
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-questions`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    const data = await response.json();
    if (!data.success || !data.questions) {
      console.error("❌ Failed to fetch FAQ questions");
      return { success: false, error: "Failed to fetch questions" };
    }

    const questions = data.questions;
    console.log(`📋 Found ${questions.length} FAQ questions to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const question of questions) {
      // Skip if already has English translation
      if (question.question_en && question.answer_en) {
        console.log(`⏭️  Skipping "${question.question.substring(0, 50)}..." - already has EN translation`);
        skippedCount++;
        continue;
      }

      // Try to find a translation
      const translation = englishTranslations[question.question];
      
      if (!translation) {
        console.log(`⚠️  No translation found for: "${question.question}"`);
        // Still update to add empty fields
        const updateResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-questions/${question.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              ...question,
              question_en: "",
              answer_en: "",
              keywords_en: [],
            }),
          }
        );

        if (updateResponse.ok) {
          console.log(`✅ Added empty EN fields to: "${question.question.substring(0, 50)}..."`);
          migratedCount++;
        }
        continue;
      }

      // Update with translation
      const updateResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-questions/${question.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            ...question,
            question_en: translation.question_en,
            answer_en: translation.answer_en,
            keywords_en: translation.keywords_en,
          }),
        }
      );

      if (updateResponse.ok) {
        console.log(`✅ Migrated: "${question.question}" → "${translation.question_en}"`);
        migratedCount++;
      } else {
        console.error(`❌ Failed to migrate: "${question.question}"`);
      }
    }

    console.log(`
╔════════════════════════════════════════════════════════════╗
║  ✅ FAQ MULTILINGUAL MIGRATION COMPLETED                 ║
╚════════════════════════════════════════════════════════════╝

📊 Results:
  • ${migratedCount} questions migrated/updated
  • ${skippedCount} questions skipped (already translated)
  • ${questions.length} total questions

💡 Next steps:
  1. Open Dashboard → FAQ
  2. Edit each question to add/refine English translations
  3. Test the FAQ page in both FR and EN
    `);

    return {
      success: true,
      migratedCount,
      skippedCount,
      totalQuestions: questions.length,
    };
  } catch (error) {
    console.error("❌ Migration error:", error);
    return { success: false, error: error.message };
  }
}

// Make it available globally
if (typeof window !== "undefined") {
  (window as any).migrateFAQToMultilingual = migrateFAQToMultilingual;
}

export { migrateFAQToMultilingual };
