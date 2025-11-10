// Seed initial testimonials data
import { projectId, publicAnonKey } from './supabase/info';

export interface TestimonialSeedData {
  clientName: string;
  clientRole: string;
  clientCompany: string;
  clientPhoto?: string;
  rating: number;
  testimonial: string;
  projectType: string;
  date: string;
  linkedinUrl?: string;
  featured: boolean;
}

export const testimonialsSeedData: TestimonialSeedData[] = [
  {
    clientName: "Sophie Martinez",
    clientRole: "CEO",
    clientCompany: "TechFlow",
    rating: 5,
    testimonial: "Maxence a complètement transformé notre présence en ligne. Son approche stratégique et son attention aux détails ont dépassé toutes nos attentes. Le nouveau site web a augmenté nos conversions de 250% ! Un vrai professionnel qui comprend les enjeux business.",
    projectType: "Site Web",
    date: "2024-10-15",
    linkedinUrl: "https://linkedin.com/in/sophiemartinez",
    featured: true
  },
  {
    clientName: "Thomas Bernard",
    clientRole: "Founder",
    clientCompany: "GreenStart",
    rating: 5,
    testimonial: "Collaboration exceptionnelle du début à la fin. Maxence a su capturer parfaitement l'essence de notre marque. Le design est moderne, épuré et surtout très efficace. Nos clients adorent la nouvelle identité visuelle !",
    projectType: "Branding",
    date: "2024-09-22",
    featured: true
  },
  {
    clientName: "Marie Dubois",
    clientRole: "Marketing Manager",
    clientCompany: "DataLab",
    rating: 5,
    testimonial: "Réactivité impressionnante et qualité irréprochable. Maxence a livré notre site e-commerce en respectant les délais et le budget. Les animations sont fluides, l'UX est intuitive. Nos ventes ont doublé en 3 mois !",
    projectType: "E-commerce",
    date: "2024-08-30",
    featured: false
  },
  {
    clientName: "Julien Rousseau",
    clientRole: "Product Owner",
    clientCompany: "InnovateLab",
    rating: 5,
    testimonial: "Un designer qui comprend vraiment les besoins techniques. Le site est non seulement magnifique mais aussi performant et optimisé SEO. Communication claire, conseils pertinents, résultat au-delà de nos espérances.",
    projectType: "Site Web",
    date: "2024-07-18",
    linkedinUrl: "https://linkedin.com/in/julienrousseau",
    featured: false
  },
  {
    clientName: "Clara Fontaine",
    clientRole: "Directrice",
    clientCompany: "L'Atelier Creative",
    rating: 5,
    testimonial: "Maxence a créé notre identité de marque de A à Z : logo, charte graphique, supports de com. Le résultat est cohérent, élégant et nous représente parfaitement. Je recommande les yeux fermés !",
    projectType: "Branding",
    date: "2024-06-25",
    featured: false
  },
  {
    clientName: "Alexandre Petit",
    clientRole: "CTO",
    clientCompany: "CloudServices",
    rating: 5,
    testimonial: "Expertise technique impressionnante. Le site est ultra rapide, responsive et accessible. Maxence a intégré toutes nos demandes complexes avec professionnalisme. Un vrai plaisir de travailler avec lui.",
    projectType: "Application Web",
    date: "2024-05-12",
    featured: false
  },
  {
    clientName: "Émilie Laurent",
    clientRole: "Coach Business",
    clientCompany: "Success Path",
    rating: 5,
    testimonial: "Mon nouveau site reflète enfin mon expertise ! Design premium, copywriting percutant, tunnel de conversion optimisé. J'ai triplé mes demandes de coaching en 2 mois. Merci Maxence !",
    projectType: "Site Web",
    date: "2024-11-01",
    linkedinUrl: "https://linkedin.com/in/emilielaurent",
    featured: true
  },
  {
    clientName: "David Chen",
    clientRole: "Founder",
    clientCompany: "FitTech",
    rating: 5,
    testimonial: "Application mobile-first parfaite pour notre startup. Maxence a su allier design moderne et performance. L'interface est intuitive et nos utilisateurs adorent. ROI exceptionnel !",
    projectType: "Application Web",
    date: "2024-04-08",
    featured: false
  }
];

export async function seedTestimonials() {
  console.log('🌱 Starting testimonials seeding...');
  
  try {
    // Get admin session
    const { createClient } = await import('./supabase/client');
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('❌ Not authenticated. Please login first.');
      return { success: false, error: 'Not authenticated' };
    }

    let successCount = 0;
    let errorCount = 0;

    for (const testimonial of testimonialsSeedData) {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/testimonials`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify(testimonial)
          }
        );

        const result = await response.json();

        if (result.success) {
          console.log(`✅ Created testimonial: ${testimonial.clientName} (${testimonial.clientCompany})`);
          successCount++;
        } else {
          console.error(`❌ Failed to create testimonial for ${testimonial.clientName}:`, result.error);
          errorCount++;
        }
      } catch (error) {
        console.error(`❌ Error creating testimonial for ${testimonial.clientName}:`, error);
        errorCount++;
      }
    }

    console.log('\n📊 Seeding Summary:');
    console.log(`✅ Successfully created: ${successCount} testimonials`);
    console.log(`❌ Errors: ${errorCount}`);
    
    return {
      success: true,
      created: successCount,
      errors: errorCount
    };

  } catch (error) {
    console.error('❌ Seeding error:', error);
    return { success: false, error };
  }
}

// Run if called directly
if (import.meta.main) {
  seedTestimonials();
}
