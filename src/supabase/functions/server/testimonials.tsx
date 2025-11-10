import { Hono } from "npm:hono@4";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import * as emailService from "./email_service.tsx";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  clientRole_en?: string;
  clientCompany: string;
  clientPhoto?: string;
  rating: number;
  testimonial: string;
  testimonial_en?: string;
  projectType: string;
  projectType_en?: string;
  date: string;
  linkedinUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Middleware to require authentication
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  const token = authHeader.replace("Bearer ", "");
  
  // For public anon key, allow through (used for dashboard with public access)
  const publicAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (token === publicAnonKey) {
    await next();
    return;
  }
  
  // Verify JWT token with Supabase Auth
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  c.set("user", user);
  await next();
};

export function registerTestimonialsRoutes(app: Hono) {
  // Get all testimonials (public)
  app.get("/make-server-04919ac5/testimonials", async (c: any) => {
    try {
      const lang = c.req.query("lang") || "fr"; // Default to French
      const testimonials = await kv.getByPrefix("testimonial:");
      
      // Filter only published testimonials and sort by date
      const publishedTestimonials = testimonials
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((t: Testimonial) => {
          // Return language-specific fields based on requested language
          if (lang === "en") {
            return {
              ...t,
              clientRole: t.clientRole_en || t.clientRole,
              testimonial: t.testimonial_en || t.testimonial,
              projectType: t.projectType_en || t.projectType,
            };
          }
          return t;
        });

      return c.json({ 
        success: true, 
        testimonials: publishedTestimonials
      });
    } catch (error: any) {
      console.error("Error fetching testimonials:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });

  // Get all testimonials (admin)
  app.get("/make-server-04919ac5/testimonials/admin", requireAuth, async (c: any) => {
    try {
      const testimonials = await kv.getByPrefix("testimonial:");
      
      // Sort by creation date
      const sortedTestimonials = testimonials
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return c.json({ 
        success: true, 
        testimonials: sortedTestimonials
      });
    } catch (error: any) {
      console.error("Error fetching testimonials (admin):", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });

  // Get single testimonial
  app.get("/make-server-04919ac5/testimonials/:id", async (c: any) => {
    try {
      const id = c.req.param("id");
      const testimonial = await kv.get(`testimonial:${id}`);

      if (!testimonial) {
        return c.json({ success: false, error: "Testimonial not found" }, 404);
      }

      return c.json({ success: true, testimonial });
    } catch (error: any) {
      console.error("Error fetching testimonial:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });

  // Create testimonial
  app.post("/make-server-04919ac5/testimonials", requireAuth, async (c: any) => {
    try {
      const body = await c.req.json();
      
      const {
        clientName,
        clientRole,
        clientRole_en,
        clientCompany,
        clientPhoto,
        rating,
        testimonial,
        testimonial_en,
        projectType,
        projectType_en,
        date,
        linkedinUrl,
        featured
      } = body;

      // Validation
      if (!clientName || !clientRole || !clientCompany || !testimonial || !projectType || !date) {
        return c.json({ 
          success: false, 
          error: "Missing required fields" 
        }, 400);
      }

      if (rating < 1 || rating > 5) {
        return c.json({ 
          success: false, 
          error: "Rating must be between 1 and 5" 
        }, 400);
      }

      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      const newTestimonial: Testimonial = {
        id,
        clientName,
        clientRole,
        clientRole_en: clientRole_en || undefined,
        clientCompany,
        clientPhoto: clientPhoto || undefined,
        rating: Number(rating),
        testimonial,
        testimonial_en: testimonial_en || undefined,
        projectType,
        projectType_en: projectType_en || undefined,
        date,
        linkedinUrl: linkedinUrl || undefined,
        featured: Boolean(featured),
        createdAt: now,
        updatedAt: now
      };

      await kv.set(`testimonial:${id}`, newTestimonial);

      console.log(`✅ Created testimonial: ${id} - ${clientName}`);

      return c.json({ 
        success: true, 
        testimonial: newTestimonial,
        message: "Testimonial created successfully" 
      });
    } catch (error: any) {
      console.error("Error creating testimonial:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });

  // Update testimonial
  app.put("/make-server-04919ac5/testimonials/:id", requireAuth, async (c: any) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();

      const existing = await kv.get(`testimonial:${id}`);
      if (!existing) {
        return c.json({ success: false, error: "Testimonial not found" }, 404);
      }

      const {
        clientName,
        clientRole,
        clientRole_en,
        clientCompany,
        clientPhoto,
        rating,
        testimonial,
        testimonial_en,
        projectType,
        projectType_en,
        date,
        linkedinUrl,
        featured
      } = body;

      // Validation
      if (rating && (rating < 1 || rating > 5)) {
        return c.json({ 
          success: false, 
          error: "Rating must be between 1 and 5" 
        }, 400);
      }

      const updatedTestimonial: Testimonial = {
        ...existing,
        clientName: clientName || existing.clientName,
        clientRole: clientRole || existing.clientRole,
        clientRole_en: clientRole_en !== undefined ? clientRole_en : existing.clientRole_en,
        clientCompany: clientCompany || existing.clientCompany,
        clientPhoto: clientPhoto !== undefined ? clientPhoto : existing.clientPhoto,
        rating: rating !== undefined ? Number(rating) : existing.rating,
        testimonial: testimonial || existing.testimonial,
        testimonial_en: testimonial_en !== undefined ? testimonial_en : existing.testimonial_en,
        projectType: projectType || existing.projectType,
        projectType_en: projectType_en !== undefined ? projectType_en : existing.projectType_en,
        date: date || existing.date,
        linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : existing.linkedinUrl,
        featured: featured !== undefined ? Boolean(featured) : existing.featured,
        updatedAt: new Date().toISOString()
      };

      await kv.set(`testimonial:${id}`, updatedTestimonial);

      console.log(`✅ Updated testimonial: ${id} - ${updatedTestimonial.clientName}`);

      return c.json({ 
        success: true, 
        testimonial: updatedTestimonial,
        message: "Testimonial updated successfully" 
      });
    } catch (error: any) {
      console.error("Error updating testimonial:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });

  // Delete testimonial
  app.delete("/make-server-04919ac5/testimonials/:id", requireAuth, async (c: any) => {
    try {
      const id = c.req.param("id");

      const existing = await kv.get(`testimonial:${id}`);
      if (!existing) {
        return c.json({ success: false, error: "Testimonial not found" }, 404);
      }

      await kv.del(`testimonial:${id}`);

      console.log(`✅ Deleted testimonial: ${id}`);

      return c.json({ 
        success: true, 
        message: "Testimonial deleted successfully" 
      });
    } catch (error: any) {
      console.error("Error deleting testimonial:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });

  // Request testimonial from client via email
  app.post("/make-server-04919ac5/testimonials/request", requireAuth, async (c: any) => {
    try {
      const body = await c.req.json();
      const { clientName, clientEmail, projectName, projectType, message } = body;

      // Validation
      if (!clientName || !clientEmail || !projectName) {
        return c.json({ 
          success: false, 
          error: "Missing required fields: clientName, clientEmail, projectName" 
        }, 400);
      }

      // Generate a unique token for the review link
      const reviewToken = crypto.randomUUID();
      
      // Store the review request data
      await kv.set(`review-request:${reviewToken}`, {
        clientName,
        clientEmail,
        projectName,
        projectType: projectType || "",
        customMessage: message || "",
        createdAt: new Date().toISOString(),
        status: "pending"
      });

      // Get frontend URL from environment
      const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://maxence.design";
      const reviewUrl = `${frontendUrl}?review=${reviewToken}`;

      // Send review request email
      const emailResult = await emailService.sendTestimonialRequest({
        clientName,
        clientEmail,
        projectName,
        projectType: projectType || "",
        customMessage: message || "",
        reviewUrl
      });

      if (!emailResult.success) {
        console.error("❌ Failed to send review request email:", emailResult.error);
        return c.json({ 
          success: false, 
          error: "Failed to send email: " + emailResult.error 
        }, 500);
      }

      console.log(`✅ Review request sent to ${clientEmail} for project: ${projectName}`);

      return c.json({ 
        success: true, 
        message: "Review request sent successfully",
        reviewToken
      });
    } catch (error: any) {
      console.error("Error sending review request:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
}
