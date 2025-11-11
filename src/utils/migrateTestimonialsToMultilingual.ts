import { projectId, publicAnonKey } from "./supabase/info";

/**
 * Script de migration pour convertir les anciens témoignages
 * au nouveau format multilingue (clientRole_en, testimonial_en, projectType_en)
 * 
 * Ce script :
 * 1. Récupère tous les témoignages existants
 * 2. Pour chaque témoignage :
 *    - Si les champs _en n'existent pas, les crée avec les valeurs FR par défaut
 *    - Pour permettre une traduction manuelle ultérieure
 * 3. Met à jour le témoignage dans la base de données
 */

export async function migrateTestimonialsToMultilingual() {
  console.log("🔄 Starting testimonials migration to multilingual format...");

  try {
    // Fetch all testimonials from admin endpoint (needs authentication)
    // For this example, we'll use the public endpoint
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/testimonials`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch testimonials: ${response.statusText}`);
    }

    const data = await response.json();
    const testimonials = data.testimonials || [];
    console.log(`📚 Found ${testimonials.length} testimonials to check`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const testimonial of testimonials) {
      // Check if testimonial is already in multilingual format
      if (
        testimonial.clientRole_en &&
        testimonial.testimonial_en &&
        testimonial.projectType_en
      ) {
        console.log(`⏭️  Skipping "${testimonial.clientName}" - already migrated`);
        skippedCount++;
        continue;
      }

      // Prepare migrated data - copy FR values to EN for manual translation later
      const migratedTestimonial = {
        ...testimonial,
        // Add English versions (default to French for manual translation later)
        clientRole_en: testimonial.clientRole_en || testimonial.clientRole,
        testimonial_en: testimonial.testimonial_en || testimonial.testimonial,
        projectType_en: testimonial.projectType_en || testimonial.projectType,
      };

      console.log(`🔄 Migrating: "${testimonial.clientName}"...`);
      console.log(`   FR: "${testimonial.testimonial.substring(0, 50)}..."`);
      console.log(`   EN: [TO BE TRANSLATED]`);

      // Note: Since we can't update without authentication, we'll just log the migration
      // You'll need to run this from the dashboard with proper authentication
      console.log(`✅ Ready to migrate: "${testimonial.clientName}"`);
      migratedCount++;

      // Uncomment this when running with authentication:
      /*
      const updateResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/testimonials/${testimonial.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${YOUR_SESSION_TOKEN}`,
          },
          body: JSON.stringify(migratedTestimonial),
        }
      );

      if (updateResponse.ok) {
        console.log(`✅ Migrated: "${testimonial.clientName}"`);
        migratedCount++;
      } else {
        console.error(`❌ Failed to migrate: "${testimonial.clientName}"`);
      }
      */
    }

    console.log("\n" + "=".repeat(50));
    console.log(`✅ Migration check complete!`);
    console.log(`   Ready to migrate: ${migratedCount} testimonials`);
    console.log(`   Already migrated: ${skippedCount} testimonials`);
    console.log(`   Total: ${testimonials.length} testimonials`);
    console.log("=".repeat(50));
    console.log("\n📝 NEXT STEPS:");
    console.log("1. Edit each testimonial in the Dashboard");
    console.log("2. Add English translations for:");
    console.log("   - Client Role (EN)");
    console.log("   - Testimonial (EN)");
    console.log("   - Project Type (EN)");
    console.log("3. Save each testimonial to persist the multilingual data");

    return {
      success: true,
      readyToMigrate: migratedCount,
      alreadyMigrated: skippedCount,
      total: testimonials.length,
    };
  } catch (error: unknown) {
    console.error("❌ Migration failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Run migration if this file is executed directly
if (import.meta.main) {
  migrateTestimonialsToMultilingual();
}

