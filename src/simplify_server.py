#!/usr/bin/env python3
"""
Script pour simplifier le serveur en ne gardant que les routes essentielles
"""

print("🔧 Simplification du serveur...")

# Routes essentielles à garder
ESSENTIAL_ROUTES = [
    '/health',
    '/auth/init-admin',
    '/auth/login', 
    '/newsletter/stats',
    '/projects',
]

# Créer une version minimale du serveur
minimal_server = """import { Hono } from "npm:hono";
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

console.log("🚀 Starting simplified server...");

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
  console.log("✅ Health check OK");
  return c.json({ 
    success: true, 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    version: "simplified-v1"
  });
});

// ============================================
// ADMIN INITIALIZATION
// ============================================
app.post("/make-server-04919ac5/auth/init-admin", async (c) => {
  try {
    console.log("🔐 Init admin endpoint called");
    
    const ADMIN_EMAIL = "contact@maxence.design";
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD") ?? "vbz657D9";

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const userExists = existingUsers?.users?.some(u => u.email === ADMIN_EMAIL);

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
  } catch (error: any) {
    console.error("❌ Server error in init-admin:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// AUTH LOGIN
// ============================================
app.post("/make-server-04919ac5/auth/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

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
  } catch (error: any) {
    console.error("❌ Server error during login:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// NEWSLETTER STATS
// ============================================
app.get("/make-server-04919ac5/newsletter/stats", async (c) => {
  try {
    console.log("📊 Fetching newsletter stats...");
    const subscribers = await kv.getByPrefix("newsletter:");
    
    const stats = {
      total: subscribers.length,
      confirmed: subscribers.filter((s: any) => s.status === "confirmed").length,
      pending: subscribers.filter((s: any) => s.status === "pending").length,
    };

    console.log("✅ Newsletter stats:", stats);
    return c.json({ 
      success: true, 
      ...stats,
      confirmedCount: stats.confirmed,
      pendingCount: stats.pending,
      totalCount: stats.total
    });
  } catch (error: any) {
    console.error("❌ Error fetching newsletter stats:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// PROJECTS
// ============================================
app.get("/make-server-04919ac5/projects", async (c) => {
  try {
    console.log("📁 Fetching projects...");
    const projects = await kv.getByPrefix("project_");
    console.log(`✅ Found ${projects.length} projects`);
    return c.json({ success: true, projects });
  } catch (error: any) {
    console.error("❌ Error fetching projects:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/make-server-04919ac5/projects/:id", async (c) => {
  try {
    const projectId = c.req.param("id");
    console.log(`📁 Fetching project: ${projectId}`);
    const project = await kv.get(projectId);
    
    if (!project) {
      return c.json({ success: false, error: "Project not found" }, 404);
    }
    
    console.log("✅ Project found");
    return c.json({ success: true, project });
  } catch (error: any) {
    console.error("❌ Error fetching project:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// CATCH-ALL FOR DEBUGGING
// ============================================
app.all("*", (c) => {
  console.log(`⚠️ Unhandled route: ${c.req.method} ${c.req.path}`);
  return c.json({ 
    success: false, 
    error: "Route not found",
    path: c.req.path,
    method: c.req.method,
    message: "This is a simplified server with only essential routes"
  }, 404);
});

console.log("✅ Simplified server configured");
console.log("📍 Essential routes:");
console.log("   - GET  /make-server-04919ac5/health");
console.log("   - POST /make-server-04919ac5/auth/init-admin");
console.log("   - POST /make-server-04919ac5/auth/login");
console.log("   - GET  /make-server-04919ac5/newsletter/stats");
console.log("   - GET  /make-server-04919ac5/projects");
console.log("   - GET  /make-server-04919ac5/projects/:id");

Deno.serve(app.fetch);
"""

# Écrire le serveur simplifié
with open('/supabase/functions/server/index.tsx', 'w') as f:
    f.write(minimal_server)

print("✅ Serveur simplifié créé!")
print("\n📋 Routes disponibles:")
for route in ESSENTIAL_ROUTES:
    print(f"   - {route}")

print("\n⚠️  Fonctionnalités temporairement désactivées:")
print("   - Newsletter subscription/unsubscribe")
print("   - Leads, Bookings")
print("   - Resources, Testimonials, Case Studies")
print("   - Blog, Analytics")
print("   - Clients, Invoices, Quotes")
print("\n🔄 Redémarrez Supabase Edge Functions pour appliquer les changements")
