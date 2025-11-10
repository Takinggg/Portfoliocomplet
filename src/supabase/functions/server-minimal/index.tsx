import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Logger
app.use('*', logger(console.log));

// CORS
const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "*";
app.use("/*", cors({
  origin: FRONTEND_URL,
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  maxAge: 600,
}));

// ============================================
// HEALTH CHECK
// ============================================
app.get("/make-server-04919ac5/health", (c) => {
  return c.json({ 
    success: true, 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// ============================================
// ADMIN INITIALIZATION
// ============================================
app.post("/make-server-04919ac5/auth/init-admin", async (c) => {
  try {
    const ADMIN_EMAIL = "contact@maxence.design";
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD") ?? "vbz657D9";

    console.log(`🔐 Attempting to create admin: ${ADMIN_EMAIL}`);

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const userExists = existingUsers?.users.some(u => u.email === ADMIN_EMAIL);

    if (userExists) {
      console.log("✅ Admin user already exists");
      return c.json({ 
        success: true, 
        message: "Admin account already exists",
        email: ADMIN_EMAIL 
      });
    }

    // Create admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { 
        name: "Admin",
        role: "admin"
      },
    });

    if (error) {
      console.error("❌ Error creating admin:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    console.log("✅ Admin account created successfully");
    return c.json({ 
      success: true, 
      message: "Admin account created",
      email: ADMIN_EMAIL 
    });
  } catch (error) {
    console.error("❌ Server error:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// NEWSLETTER STATS
// ============================================
app.get("/make-server-04919ac5/newsletter/stats", async (c) => {
  try {
    const subscribers = await kv.getByPrefix("newsletter:");
    
    const stats = {
      total: subscribers.length,
      confirmed: subscribers.filter((s: any) => s.status === "confirmed").length,
      pending: subscribers.filter((s: any) => s.status === "pending").length,
    };

    return c.json({ 
      success: true, 
      ...stats,
      confirmedCount: stats.confirmed,
      pendingCount: stats.pending,
      totalCount: stats.total
    });
  } catch (error) {
    console.error("Error fetching newsletter stats:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// PROJECTS
// ============================================
app.get("/make-server-04919ac5/projects", async (c) => {
  try {
    const projects = await kv.getByPrefix("project_");
    console.log(`📁 Found ${projects.length} projects`);
    return c.json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/make-server-04919ac5/projects/:id", async (c) => {
  try {
    const projectId = c.req.param("id");
    const project = await kv.get(projectId);
    
    if (!project) {
      return c.json({ success: false, error: "Project not found" }, 404);
    }
    
    return c.json({ success: true, project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// AUTH LOGIN
// ============================================
app.post("/make-server-04919ac5/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    console.log(`🔐 Login attempt for: ${email}`);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("❌ Login error:", error);
      return c.json({ success: false, error: error.message }, 401);
    }

    console.log("✅ Login successful");
    return c.json({ 
      success: true, 
      session: data.session,
      user: data.user 
    });
  } catch (error) {
    console.error("❌ Server error during login:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

console.log("🚀 Minimal server starting...");
Deno.serve(app.fetch);
