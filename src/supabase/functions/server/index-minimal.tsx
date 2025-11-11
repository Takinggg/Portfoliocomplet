// 🚀 PORTFOLIO CRM SERVER - MINIMAL VERSION FOR TESTING
// This version works without environment variables to test deployment
// Replace with full version once Supabase environment is configured

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";

const app = new Hono();

// Enable CORS for all routes
app.use("*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: false
}));

// Add basic logging
app.use("*", async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`);
  await next();
});

// Health check endpoint
app.get("/make-server-04919ac5/health", (c) => {
  return c.json({
    success: true,
    message: "Minimal server is working!",
    timestamp: new Date().toISOString(),
    version: "1.0.0-minimal"
  });
});

// Projects endpoint - modeled after blog structure
app.get("/make-server-04919ac5/projects", (c) => {
  const lang = c.req.query("lang") || "fr";
  
  const mockProjects = [
    {
      id: "project:1",
      title_fr: "Site Portfolio",
      title_en: "Portfolio Website", 
      description_fr: "Site web portfolio moderne construit avec React et TypeScript",
      description_en: "Modern portfolio website built with React and TypeScript",
      slug: "portfolio-website",
      technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
      category: "web-development",
      status: "completed",
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500"
      ],
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
      demoUrl: "https://maxence.design",
      githubUrl: "https://github.com/example/portfolio",
      clientName_fr: "Personnel",
      clientName_en: "Personal",
      duration: "2 mois",
      year: 2024,
      tags: ["Design", "Development", "React"],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      // Legacy fields for compatibility
      title: lang === 'en' ? "Portfolio Website" : "Site Portfolio",
      description: lang === 'en' 
        ? "Modern portfolio website built with React and TypeScript"
        : "Site web portfolio moderne construit avec React et TypeScript"
    },
    {
      id: "project:2", 
      title_fr: "Plateforme E-commerce",
      title_en: "E-commerce Platform",
      description_fr: "Solution e-commerce complète avec intégration de paiement",
      description_en: "Full-stack e-commerce solution with payment integration",
      slug: "ecommerce-platform",
      technologies: ["Next.js", "Prisma", "Stripe", "PostgreSQL"],
      category: "e-commerce",
      status: "in_progress",
      featured: false,
      images: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500"
      ],
      coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500",
      demoUrl: null,
      githubUrl: "https://github.com/example/ecommerce",
      clientName_fr: "TechCorp",
      clientName_en: "TechCorp",
      duration: "4 mois",
      year: 2024,
      tags: ["E-commerce", "Full-stack", "Payment"],
      createdAt: "2024-02-20T14:30:00Z",
      updatedAt: "2024-03-01T09:15:00Z",
      // Legacy fields
      title: lang === 'en' ? "E-commerce Platform" : "Plateforme E-commerce", 
      description: lang === 'en'
        ? "Full-stack e-commerce solution with payment integration"
        : "Solution e-commerce complète avec intégration de paiement"
    }
  ];

  return c.json({
    success: true,
    projects: mockProjects,
    total: mockProjects.length
  });
});

// Get single project by ID or slug - modeled after blog structure  
app.get("/make-server-04919ac5/projects/:id", (c) => {
  const projectId = c.req.param("id");
  const lang = c.req.query("lang") || "fr";
  
  // Mock project data - in real app this would come from KV store
  const mockProject = {
    id: `project:${projectId}`,
    title_fr: "Site Portfolio Détaillé",
    title_en: "Detailed Portfolio Website",
    description_fr: "Site web portfolio moderne avec toutes les fonctionnalités avancées",
    description_en: "Modern portfolio website with all advanced features",
    slug: "portfolio-website-detailed",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion"],
    category: "web-development",
    status: "completed",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800"
    ],
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    demoUrl: "https://maxence.design",
    githubUrl: "https://github.com/example/portfolio-advanced",
    clientName_fr: "Personnel",
    clientName_en: "Personal",
    duration: "3 mois",
    year: 2024,
    tags: ["Design", "Development", "React", "Animation"],
    challenges_fr: [
      "Optimisation des performances",
      "Animations fluides", 
      "Responsive design avancé"
    ],
    challenges_en: [
      "Performance optimization",
      "Smooth animations",
      "Advanced responsive design"
    ],
    features_fr: [
      "Interface utilisateur moderne",
      "Animations interactives",
      "Mode sombre/clair",
      "Multilingue (FR/EN)"
    ],
    features_en: [
      "Modern user interface",
      "Interactive animations", 
      "Dark/Light mode",
      "Multilingual (FR/EN)"
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    views: 0,
    // Legacy fields
    title: lang === 'en' ? "Detailed Portfolio Website" : "Site Portfolio Détaillé",
    description: lang === 'en' 
      ? "Modern portfolio website with all advanced features"
      : "Site web portfolio moderne avec toutes les fonctionnalités avancées"
  };

  return c.json({
    success: true,
    project: mockProject
  });
});

// Create project endpoint - modeled after blog post creation
app.post("/make-server-04919ac5/projects", async (c) => {
  try {
    const body = await c.req.json();
    console.log("Creating project:", body);
    
    const { 
      title_fr, title_en, 
      description_fr, description_en,
      slug, technologies, category, 
      status, featured, images, coverImage,
      demoUrl, githubUrl,
      clientName_fr, clientName_en,
      duration, year, tags,
      challenges_fr, challenges_en,
      features_fr, features_en 
    } = body;

    // Validation - require at least French title and description
    if (!title_fr || !description_fr) {
      return c.json({
        success: false,
        error: "Title and description in French are required"
      }, 400);
    }

    // Generate project ID similar to blog
    const projectId = `project:${Date.now()}@${slug || Date.now()}`;
    
    const projectData = {
      id: projectId,
      title_fr: title_fr || "",
      title_en: title_en || title_fr, // Fallback to French
      description_fr: description_fr || "",
      description_en: description_en || description_fr,
      slug: slug || `project-${Date.now()}`,
      technologies: technologies || [],
      category: category || "web-development",
      status: status || "draft", // draft, in_progress, completed
      featured: featured || false,
      images: images || [],
      coverImage: coverImage || "",
      demoUrl: demoUrl || null,
      githubUrl: githubUrl || null,
      clientName_fr: clientName_fr || "",
      clientName_en: clientName_en || clientName_fr,
      duration: duration || "",
      year: year || new Date().getFullYear(),
      tags: tags || [],
      challenges_fr: challenges_fr || [],
      challenges_en: challenges_en || challenges_fr,
      features_fr: features_fr || [],
      features_en: features_en || features_fr,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Legacy fields for backward compatibility
      title: title_fr,
      description: description_fr
    };
    
    // In real app: await kv.set(projectId, projectData);
    console.log(`✅ Project created (mock): ${projectId}`);
    
    return c.json({
      success: true,
      project: projectData,
      message: "Project created successfully (mock response)"
    });
  } catch (error) {
    console.error("❌ Error creating project:", error);
    return c.json({
      success: false,
      error: "Invalid JSON data or server error"
    }, 400);
  }
});

// Update project endpoint - modeled after blog update
app.put("/make-server-04919ac5/projects/:id", async (c) => {
  try {
    const projectId = decodeURIComponent(c.req.param("id"));
    const body = await c.req.json();
    console.log(`Updating project: ${projectId}`, body);
    
    // In real app: check if project exists
    // const existingProject = await kv.get(projectId);
    
    const updatedProject = {
      id: projectId,
      ...body, // Merge with new data
      updatedAt: new Date().toISOString(),
      // Update legacy fields if multilingual fields provided
      title: body.title_fr || body.title,
      description: body.description_fr || body.description
    };
    
    // In real app: await kv.set(projectId, updatedProject);
    console.log(`✅ Project updated (mock): ${projectId}`);
    
    return c.json({
      success: true,
      project: updatedProject,
      message: "Project updated successfully (mock response)"
    });
  } catch (error) {
    console.error("❌ Error updating project:", error);
    return c.json({
      success: false,
      error: "Update failed"
    }, 500);
  }
});

// Delete project endpoint - modeled after blog delete
app.delete("/make-server-04919ac5/projects/:id", async (c) => {
  try {
    const projectId = decodeURIComponent(c.req.param("id"));
    console.log(`Deleting project: ${projectId}`);
    
    // In real app: check if project exists and delete
    // const project = await kv.get(projectId);
    // if (!project) return 404
    // await kv.delete(projectId);
    
    console.log(`✅ Project deleted (mock): ${projectId}`);
    
    return c.json({
      success: true,
      message: "Project deleted successfully (mock response)"
    });
  } catch (error) {
    console.error("❌ Error deleting project:", error);
    return c.json({
      success: false,
      error: "Delete failed"
    }, 500);
  }
});

// Auth endpoints for testing
app.post("/make-server-04919ac5/auth/init-admin", (c) => {
  return c.json({
    success: true,
    message: "Admin initialized (mock response)"
  });
});

app.post("/make-server-04919ac5/auth/login", async (c) => {
  try {
    const body = await c.req.json();
    return c.json({
      success: true,
      data: {
        token: "mock-token-123",
        user: {
          id: "1",
          email: body.email || "admin@example.com"
        }
      },
      message: "Login successful (mock response)"
    });
  } catch (error) {
    return c.json({
      success: false,
      error: "Invalid credentials"
    }, 401);
  }
});

// Dashboard stats endpoint
app.get("/make-server-04919ac5/dashboard/stats", (c) => {
  return c.json({
    success: true,
    data: {
      projects: { total: 2, completed: 1, in_progress: 1 },
      clients: { total: 5, active: 3 },
      leads: { total: 8, converted: 3 },
      revenue: { total: 15000, this_month: 3500 }
    }
  });
});

// Catch-all route for debugging
app.all("*", (c) => {
  return c.json({
    success: false,
    error: "Route not found",
    method: c.req.method,
    path: c.req.url,
    message: "This is a minimal test server. Full API will be available once environment is configured."
  }, 404);
});

// Start the server
console.log("🚀 Starting minimal Portfolio CRM Server...");
console.log("📋 Available endpoints (modeled after blog structure):");
console.log("   GET    /make-server-04919ac5/health");
console.log("   GET    /make-server-04919ac5/projects        - List all projects (supports ?lang=en/fr)");
console.log("   GET    /make-server-04919ac5/projects/:id    - Get project by ID");
console.log("   POST   /make-server-04919ac5/projects        - Create new project");
console.log("   PUT    /make-server-04919ac5/projects/:id    - Update project");
console.log("   DELETE /make-server-04919ac5/projects/:id    - Delete project");
console.log("   POST   /make-server-04919ac5/auth/init-admin - Initialize admin");
console.log("   POST   /make-server-04919ac5/auth/login      - Admin login");
console.log("   GET    /make-server-04919ac5/dashboard/stats - Dashboard statistics");
console.log("");
console.log("🌐 Project structure features:");
console.log("   ✅ Bilingual support (FR/EN)");
console.log("   ✅ Blog-like data structure");
console.log("   ✅ Status management (draft/in_progress/completed)");
console.log("   ✅ Featured projects flag");
console.log("   ✅ Multiple images support");
console.log("   ✅ Technologies, tags, and categories");
console.log("   ✅ Client information and project duration");

Deno.serve(app.fetch);