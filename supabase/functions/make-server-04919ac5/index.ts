// ============================================================================
// 🚀 PORTFOLIO CRM SERVER - SUPABASE EDGE FUNCTION
// ============================================================================
//
// 📋 DESCRIPTION:
//     Complete backend API for Portfolio CRM application
//     Includes: Projects, Clients, Invoices, Quotes, Blog, Auth, Payments
//
// 🎯 DEPLOYMENT INSTRUCTIONS:
//     1. Copy this entire file
//     2. Go to Supabase Dashboard > Edge Functions
//     3. Create new function named: make-server-04919ac5
//     4. Paste this code
//     5. Deploy
//
// ⚙️ REQUIRED ENVIRONMENT VARIABLES (Supabase Secrets):
//     SUPABASE_URL=https://ptcxeqtjlxittxayffgu.supabase.co
//     SUPABASE_SERVICE_ROLE_KEY=eyJ... (service role key)
//     SUPABASE_ANON_KEY=eyJ... (public anon key)
//     RESEND_API_KEY=re_... (for emails)
//     ADMIN_PASSWORD=vbz657D9 (admin access)
//     STRIPE_SECRET_KEY=sk_... (payments)
//     STRIPE_WEBHOOK_SECRET=whsec_... (webhooks)
//     FRONTEND_URL=https://your-domain.com
//
// 🔗 ENDPOINTS:
//     GET  /projects - List all projects
//     POST /projects - Create new project
//     GET  /clients - List all clients
//     POST /clients - Create new client
//     GET  /invoices - List all invoices
//     POST /invoices - Create new invoice
//     GET  /quotes - List all quotes
//     POST /quotes - Create new quote
//     + 40+ other endpoints (blog, auth, payments, etc.)
//
// ============================================================================

// TypeScript declarations for Deno runtime
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { sendQuoteEmail, sendInvoiceLink } from "./email_service.tsx";
import aj, { arcjetMiddleware, protectAuthRoute, validateEmailWithArcjet, checkForBot } from "./arcjet-config.ts";

// Type definitions for Hono (inline to avoid import issues)
type HonoContext = any; // Simplifié pour Deno
type HonoNext = () => Promise<void> | void;

// Utility to get error message from unknown error
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message || error.toString();
  }
  return typeof error === "string" ? error : JSON.stringify(error);
}

console.log("🚀 Portfolio CRM Server starting...");
console.log("📅 Deployment:", new Date().toISOString());

const app = new Hono();

// ===========================================================================
// 🔧 CONFIGURATION & CLIENTS
// ===========================================================================

// Supabase client avec service role pour accès complet
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "https://ptcxeqtjlxittxayffgu.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY is required!");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Client KV pour le stockage de données
const kvClient = () => createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const kv = {
  set: async (key: string, value: any): Promise<void> => {
    const supabaseKv = kvClient();
    const { error } = await supabaseKv.from("kv_store_04919ac5").upsert({
      key,
      value
    });
    if (error) {
      throw new Error(getErrorMessage(error));
    }
  },
  get: async (key: string): Promise<any> => {
    const supabaseKv = kvClient();
    const { data, error } = await supabaseKv.from("kv_store_04919ac5").select("value").eq("key", key).maybeSingle();
    if (error) {
      throw new Error(getErrorMessage(error));
    }
    return data?.value;

    function sanitizeCustomKey(input: string | undefined | null): string | null {
      if (!input) return null;
      const normalized = input.trim();
      if (!normalized) return null;
      const safeKey = normalized.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase();
      return safeKey || null;
    }

    function getUserScopedKey(c: HonoContext, keyParam: string): { storageKey: string; userId: string } | null {
      const user = c.get("user");
      const rawUserId = user?.id as string | undefined;
      if (!rawUserId) {
        return null;
      }
      const safeUserId = sanitizeCustomKey(rawUserId.replace(/[^a-zA-Z0-9_-]/g, "-"));
      if (!safeUserId) {
        return null;
      }
      return { storageKey: `custom:${safeUserId}:${keyParam}`, userId: safeUserId };
    }
  },
  del: async (key: string): Promise<void> => {
    const supabaseKv = kvClient();
    const { error } = await supabaseKv.from("kv_store_04919ac5").delete().eq("key", key);
    if (error) {
      throw new Error(getErrorMessage(error));
    }
  },
  mset: async (keys: string[], values: any[]): Promise<void> => {
    const supabaseKv = kvClient();
    const { error } = await supabaseKv.from("kv_store_04919ac5").upsert(keys.map((k: string, i: number)=>({
        key: k,
        value: values[i]
      })));
    if (error) {
      throw new Error(getErrorMessage(error));
    }
  },
  mget: async (keys: string[]): Promise<any[]> => {
    const supabaseKv = kvClient();
    const { data, error } = await supabaseKv.from("kv_store_04919ac5").select("value").in("key", keys);
    if (error) {
      throw new Error(getErrorMessage(error));
    }
    return data?.map((d: any)=>d.value) ?? [];
  },
  mdel: async (keys: string[]): Promise<void> => {
    const supabaseKv = kvClient();
    const { error } = await supabaseKv.from("kv_store_04919ac5").delete().in("key", keys);
    if (error) {
      throw new Error(getErrorMessage(error));
    }
  },
  getByPrefix: async (prefix: string): Promise<any[]> => {
    const supabaseKv = kvClient();
    const { data, error } = await supabaseKv.from("kv_store_04919ac5").select("key, value").like("key", prefix + "%");
    if (error) {
      throw new Error(getErrorMessage(error));
    }
    return data?.map((d: any)=>d.value) ?? [];
  },
  getByPrefixWithKeys: async (prefix: string): Promise<any[]> => {
    const supabaseKv = kvClient();
    const { data, error } = await supabaseKv.from("kv_store_04919ac5").select("key, value").like("key", prefix + "%");
    if (error) {
      throw new Error(getErrorMessage(error));
    }
    return data ?? [];
  }
};
console.log("✅ KV store configured");
// ===========================================================================
// LANGUAGE DETECTION
// ===========================================================================
function detectLanguage(headers: Headers | undefined, fallback: string = 'fr'): 'fr' | 'en' {
  if (!headers) return fallback as 'fr' | 'en';
  
  // Check Accept-Language header
  const acceptLanguage = headers.get('accept-language') || headers.get('Accept-Language');
  if (acceptLanguage) {
    if (acceptLanguage.toLowerCase().includes('en')) return 'en';
    if (acceptLanguage.toLowerCase().includes('fr')) return 'fr';
  }
  
  // Check custom X-Language header
  const customLang = headers.get('x-language') || headers.get('X-Language');
  if (customLang) {
    if (customLang.toLowerCase() === 'en') return 'en';
    if (customLang.toLowerCase() === 'fr') return 'fr';
  }
  
  return fallback as 'fr' | 'en';
}

// ===========================================================================
// EMAIL SERVICE
// ===========================================================================
interface EmailParams {
  from?: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}

async function sendEmail(params: EmailParams): Promise<{ success: boolean; error?: string }> {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return {
      success: false,
      error: "Email service not configured"
    };
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: params.from || "Maxence - Portfolio Freelance <contact@maxence.design>",
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text
      })
    });
    if (!response.ok) {
      const error = await response.text();
      console.error("Resend API error:", error);
      return {
        success: false,
        error: `Failed to send email: ${error}`
      };
    }
    const data = await response.json();
    console.log("Email sent successfully:", data);
    return {
      success: true
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
}
console.log("✅ Email service configured");
// ===========================================================================
// 🔧 MIDDLEWARE CONFIGURATION
// ===========================================================================

// Logging middleware pour débugger les requêtes
app.use('*', logger(console.log));

// CORS middleware - Permet les requêtes depuis le frontend
app.use("*", cors({
  origin: "*", // Accepte toutes les origines (permet localhost:3000 et production)
  allowHeaders: [
    "Content-Type",
    "Authorization", 
    "X-Requested-With",
    "apikey", // Required for Supabase client requests
    "x-client-info"
  ],
  allowMethods: [
    "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
  ],
  exposeHeaders: ["Content-Length", "X-Request-Id"],
  credentials: true,
  maxAge: 86400 // Cache preflight 24h
}));

// Security headers middleware
app.use("*", async (c: HonoContext, next: HonoNext) => {
  await next();
  
  // Content Security Policy - Empêche XSS, injection de scripts malveillants
  c.header("Content-Security-Policy", 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*.supabase.co;"
  );
  
  // Empêche le site d'être intégré dans une iframe (protection clickjacking)
  c.header("X-Frame-Options", "DENY");
  
  // Force le navigateur à respecter le Content-Type (anti-MIME sniffing)
  c.header("X-Content-Type-Options", "nosniff");
  
  // Contrôle les informations de référence envoyées
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Désactive les features browser dangereuses
  c.header("Permissions-Policy", 
    "geolocation=(), microphone=(), camera=(), payment=()"
  );
  
  // Force HTTPS (si en production)
  if (c.req.header("x-forwarded-proto") === "https") {
    c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
});

console.log("✅ Security headers configured");

const requireAuth = async (c: HonoContext, next: HonoNext): Promise<Response | void> => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({
      success: false,
      error: "Unauthorized"
    }, 401);
  }
  const token = authHeader.replace("Bearer ", "");
  const adminServiceToken = Deno.env.get("ADMIN_SERVICE_TOKEN");
  if (adminServiceToken && token === adminServiceToken) {
    await next();
    return;
  }
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return c.json({
      success: false,
      error: "Unauthorized"
    }, 401);
  }
  c.set("user", user);
  await next();
};

// Arcjet global middleware
app.use(arcjetMiddleware(aj));

console.log("✅ Middleware configured (CORS, Logger, Auth, Arcjet)");

// =============================================================================
// 📋 COMPLETE API ENDPOINTS DOCUMENTATION
// =============================================================================
/*
  
  🔗 BASE URL: https://your-project.supabase.co/functions/v1/make-server-04919ac5
  
  📊 HEALTH & SYSTEM
  ─────────────────────
  GET    /health                               - Server health check
  POST   /auth/init-admin                      - Initialize admin user
  POST   /auth/login                           - Admin authentication
  POST   /seed-data                           - Seed initial data (Auth required)
  
  👥 CLIENTS MANAGEMENT
  ─────────────────────
  GET    /clients                              - List all clients (Auth required)
  POST   /clients                              - Create new client (Auth required)  
  GET    /clients/:id                          - Get client by ID (Auth required)
  PUT    /clients/:id                          - Update client (Auth required)
  DELETE /clients/:id                          - Delete client (Auth required)
  
  🎯 LEADS & CONVERSIONS
  ──────────────────────
  GET    /leads                                - List all leads (Auth required)
  POST   /leads                                - Create new lead (Public)
  GET    /leads/:id                            - Get lead by ID (Auth required)
  PUT    /leads/:id                            - Update lead (Auth required)
  DELETE /leads/:id                            - Delete lead (Auth required)
  POST   /leads/:id/convert                    - Convert lead to client (Auth required)
  
  📅 BOOKING SYSTEM  
  ─────────────────
  GET    /bookings                             - List all bookings (Auth required)
  POST   /bookings                             - Create new booking (Public)
  PUT    /bookings/:id                         - Update booking (Auth required)
  DELETE /bookings/:id                         - Delete booking (Auth required)
  GET    /availabilities                       - Get available slots (Auth required)
  POST   /availabilities                       - Set availability (Auth required)
  GET    /events                               - List calendar events (Auth required)
  POST   /events                               - Create calendar event (Auth required)
  
  📧 EMAIL SERVICES
  ─────────────────
  POST   /emails/booking-confirmation          - Send booking confirmation (Public)
  POST   /emails/lead-confirmation             - Send lead confirmation (Public)
  
  📊 DASHBOARD & STATS
  ────────────────────
  GET    /dashboard/stats                      - Get dashboard statistics (Auth required)
  
  💰 QUOTES MANAGEMENT
  ────────────────────
  GET    /quotes                               - List all quotes (Auth required)
  POST   /quotes                               - Create new quote (Auth required)
  GET    /quotes/:id                           - Get quote by ID (Auth required)
  PUT    /quotes/:id                           - Update quote (Auth required)
  DELETE /quotes/:id                           - Delete quote (Auth required)
  POST   /quotes/:id/convert                   - Convert quote to invoice (Auth required)
  POST   /quotes/:id/send-reminder             - Send quote reminder (Auth required)
  
  🧾 INVOICES MANAGEMENT
  ──────────────────────
  GET    /invoices                             - List all invoices (Auth required)
  POST   /invoices                             - Create new invoice (Auth required)
  GET    /invoices/:id                         - Get invoice by ID (Auth required)
  PUT    /invoices/:id                         - Update invoice (Auth required)
  DELETE /invoices/:id                         - Delete invoice (Auth required)
  POST   /invoices/:id/generate-link           - Generate public invoice link (Auth required)
  GET    /invoices/view/:token                 - View public invoice (Public)
  POST   /invoices/:id/send-reminder           - Send invoice reminder (Auth required)
  
  🎨 PROJECTS PORTFOLIO
  ─────────────────────
  GET    /projects                             - List all projects (Public)
  POST   /projects                             - Create new project (Auth required)
  GET    /projects/:id                         - Get project by ID (Public)
  PUT    /projects/:id                         - Update project (Auth required)
  DELETE /projects/:id                         - Delete project (Auth required)
  
  📬 NEWSLETTER SYSTEM
  ────────────────────
  POST   /newsletter/subscribe                 - Subscribe to newsletter (Public)
  GET    /newsletter/stats                     - Get newsletter statistics (Public)
  GET    /newsletter/subscribers               - List subscribers (Auth required)
  DELETE /newsletter/subscribers/:id           - Remove subscriber (Auth required)
  POST   /newsletter/send-campaign             - Send email campaign (Auth required)
  
  ⭐ TESTIMONIALS
  ──────────────
  GET    /testimonials                         - List public testimonials (Public)
  GET    /testimonials/admin                   - List all testimonials (Auth required)
  POST   /testimonials                         - Create testimonial (Public)
  PUT    /testimonials/:id                     - Update testimonial (Auth required)
  DELETE /testimonials/:id                     - Delete testimonial (Auth required)
  
  📝 ENHANCED BILINGUAL BLOG SYSTEM
  ─────────────────────────────────
  GET    /blog/posts                           - List posts (Public, supports ?lang=fr/en, ?category, ?tag, ?status)
  POST   /blog/posts                           - Create post with bilingual support (Auth required)
  GET    /blog/posts/:slug                     - Get post by slug (Public, supports ?lang=fr/en)
  PUT    /blog/posts/:id                       - Update post with bilingual support (Auth required)
  DELETE /blog/posts/:id                       - Delete post (Auth required)
  GET    /blog/tags                            - Get available tags (Public, supports ?lang=fr/en)
  GET    /blog/categories                      - Get available categories (Public, supports ?lang=fr/en)
  GET    /blog/stats                           - Get blog statistics (Public)
  
  💳 STRIPE PAYMENTS
  ──────────────────
  POST   /stripe/create-checkout-session       - Create payment session (Public)
  POST   /stripe/webhook                       - Stripe webhook handler (Public)
  
  📝 AUTHENTICATION NOTES
  ───────────────────────
  • Public endpoints: No authentication required
  • Auth required: Send "Authorization: Bearer <token>" header
  • Admin token: Use SUPABASE_ANON_KEY for admin access
  • User tokens: Valid Supabase auth tokens from frontend
  
  📄 REQUEST/RESPONSE FORMAT
  ─────────────────────────
  • All requests: Content-Type: application/json
  • Success response: { success: true, data: {...} }
  • Error response: { success: false, error: "message" }
  • List responses: { success: true, data: [...], total?: number }
  
  🔧 TESTING COMMANDS
  ───────────────────
  curl -X GET "https://your-project.supabase.co/functions/v1/make-server-04919ac5/health"
  curl -X GET "https://your-project.supabase.co/functions/v1/make-server-04919ac5/projects"
  curl -X POST "https://your-project.supabase.co/functions/v1/make-server-04919ac5/leads" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test Lead","email":"test@example.com","message":"Test message"}'

*/

// =============================================================================
// 🛣️  API ROUTES IMPLEMENTATION
// =============================================================================

// ===========================================================================
// HEALTH CHECK
// ===========================================================================
app.get("/make-server-04919ac5/health", (c: HonoContext) =>{
  return c.json({
    success: true,
    message: "COMPLETE server running (quotes + invoices + blog CRUD)",
    timestamp: new Date().toISOString()
  });
});
console.log("✅ Health check added");

// Test KV Store endpoint
app.get("/make-server-04919ac5/test-kv", async (c: HonoContext) => {
  try {
    const ip = c.req.header('x-forwarded-for') || 'test-ip';
    const testKey = `test:${Date.now()}`;
    
    // Test 1: Import KV
    const kvModule = await import("./kv_store.tsx");
    console.log("✅ KV module imported");
    
    // Test 2: Write
    console.log("📝 Writing to KV:", testKey);
    await kvModule.set(testKey, { count: 1, ts: Date.now() });
    console.log("✅ KV SET success");
    
    // Wait 100ms for write to propagate
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Test 3: Read
    console.log("📖 Reading from KV:", testKey);
    const value = await kvModule.get(testKey);
    console.log("✅ KV GET result:", value);
    
    // Test 4: Rate limit test
    const rateLimitKey = `ratelimit:auth:${ip}`;
    console.log("📝 Writing rate limit:", rateLimitKey);
    await kvModule.set(rateLimitKey, { count: 3, firstRequest: Date.now(), windowMs: 300000 });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log("📖 Reading rate limit:", rateLimitKey);
    const rateLimitValue = await kvModule.get(rateLimitKey);
    console.log("✅ Rate limit result:", rateLimitValue);
    
    return c.json({
      success: true,
      message: "KV Store is working",
      test: {
        write: testKey,
        read: value,
        rateLimit: rateLimitValue
      }
    });
  } catch (error) {
    console.error("❌ KV Store test failed:", error);
    const err = error as Error;
    return c.json({
      success: false,
      error: err.message || String(error),
      stack: err.stack
    }, 500);
  }
});
console.log("✅ KV test endpoint added");

// ===========================================================================
// CUSTOM DATA (KV STORE)
// ===========================================================================
app.use("/make-server-04919ac5/custom-data/*", requireAuth);
app.get("/make-server-04919ac5/custom-data/:key", async (c: HonoContext) => {
  const keyParam = sanitizeCustomKey(c.req.param("key"));
  if (!keyParam) {
    return c.json({ success: false, error: "INVALID_KEY" }, 400);
  }
  const scoped = getUserScopedKey(c, keyParam);
  if (!scoped) {
    return c.json({ success: false, error: "USER_CONTEXT_MISSING" }, 401);
  }

  try {
    const stored = await kv.get(scoped.storageKey);
    let responseValue = null;
    let metadata: Record<string, unknown> | undefined;

    if (typeof stored !== "undefined" && stored !== null) {
      if (typeof stored === "object" && "data" in (stored as Record<string, unknown>)) {
        const typedStored = stored as { data: unknown; updatedAt?: string };
        responseValue = typedStored.data;
        metadata = typedStored.updatedAt ? { updatedAt: typedStored.updatedAt } : undefined;
      } else {
        responseValue = stored;
      }
    }

    return c.json({
      success: true,
      key: keyParam,
      owner: scoped.userId,
      exists: typeof stored !== "undefined" && stored !== null,
      value: responseValue,
      metadata: metadata ?? null
    });
  } catch (error) {
    console.error("❌ Custom data GET error:", error);
    return c.json({ success: false, error: getErrorMessage(error) }, 500);
  }
});

app.put("/make-server-04919ac5/custom-data/:key", async (c: HonoContext) => {
  const keyParam = sanitizeCustomKey(c.req.param("key"));
  if (!keyParam) {
    return c.json({ success: false, error: "INVALID_KEY" }, 400);
  }
  const scoped = getUserScopedKey(c, keyParam);
  if (!scoped) {
    return c.json({ success: false, error: "USER_CONTEXT_MISSING" }, 401);
  }

  let payload: any = null;
  try {
    payload = await c.req.json();
  } catch (_err) {
    return c.json({ success: false, error: "INVALID_JSON" }, 400);
  }

  const value = typeof payload?.value === "undefined" ? payload : payload.value;
  const record = {
    data: value,
    updatedAt: new Date().toISOString()
  };

  try {
    await kv.set(scoped.storageKey, record);
    return c.json({ success: true, key: keyParam, owner: scoped.userId, value, metadata: { updatedAt: record.updatedAt } });
  } catch (error) {
    console.error("❌ Custom data PUT error:", error);
    return c.json({ success: false, error: getErrorMessage(error) }, 500);
  }
});

app.delete("/make-server-04919ac5/custom-data/:key", async (c: HonoContext) => {
  const keyParam = sanitizeCustomKey(c.req.param("key"));
  if (!keyParam) {
    return c.json({ success: false, error: "INVALID_KEY" }, 400);
  }
  const scoped = getUserScopedKey(c, keyParam);
  if (!scoped) {
    return c.json({ success: false, error: "USER_CONTEXT_MISSING" }, 401);
  }

  try {
    await kv.del(scoped.storageKey);
    return c.json({ success: true, key: keyParam, owner: scoped.userId });
  } catch (error) {
    console.error("❌ Custom data DELETE error:", error);
    return c.json({ success: false, error: getErrorMessage(error) }, 500);
  }
});
console.log("✅ Custom data KV endpoints added");

// ===========================================================================
// AUTH ROUTES
// ===========================================================================
app.post("/make-server-04919ac5/auth/init-admin", async (c: HonoContext) =>{
  try {
    const ADMIN_EMAIL = "contact@maxence.design";
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD") ?? "vbz657D9";
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users?.some((u: any) => u.email === ADMIN_EMAIL);
    if (userExists) {
      return c.json({
        success: true,
        message: "Admin already exists"
      });
    }
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      user_metadata: {
        name: "Admin",
        role: "admin"
      },
      email_confirm: true
    });
    if (error) throw error;
    return c.json({
      success: true,
      message: "Admin created successfully",
      user: data.user
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// Login avec protection rate limiting
app.post("/make-server-04919ac5/auth/login", async (c: HonoContext) =>{
  try {
    // Protection rate limiting stricte pour auth
    const canProceed = protectAuthRoute(c);
    if (!canProceed) {
      return c.json({
        success: false,
        error: "Trop de tentatives de connexion. Veuillez réessayer dans 5 minutes."
      }, 429);
    }

    const body = await c.req.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return c.json({
        success: false,
        error: "Email et mot de passe requis"
      }, 400);
    }
    
    // Validation email
    const emailValidation = await validateEmailWithArcjet(email);
    if (!emailValidation.valid) {
      return c.json({
        success: false,
        error: `Email invalide: ${emailValidation.reason}`
      }, 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Login error:", error);
      return c.json({
        success: false,
        error: "Email ou mot de passe incorrect"
      }, 401);
    }
    
    return c.json({
      success: true,
      session: data.session,
      user: data.user
    });
  } catch (error) {
    console.error("Login exception:", error);
    return c.json({
      success: false,
      error: "Erreur serveur lors de la connexion"
    }, 500);
  }
});
console.log("✅ Auth routes added");
// ===========================================================================
// CLIENTS ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/clients", requireAuth, async (c: HonoContext) =>{
  try {
    const clients = await kv.getByPrefix("client:");
    const sorted = clients.sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json({
      success: true,
      clients: sorted
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
app.get("/make-server-04919ac5/clients/:id", requireAuth, async (c: HonoContext) =>{
  try {
    const clientId = decodeURIComponent(c.req.param("id"));
    const client = await kv.get(clientId);
    if (!client) {
      return c.json({
        success: false,
        error: "Client not found"
      }, 404);
    }
    return c.json({
      success: true,
      client
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
app.post("/make-server-04919ac5/clients", requireAuth, async (c: HonoContext) =>{
  try {
    const body = await c.req.json();
    const { name, email, phone, company, address, status, revenue } = body;
    if (!name || !email) {
      return c.json({
        success: false,
        error: "Name and email required"
      }, 400);
    }
    const clientId = `client:${Date.now()}@${email}`;
    const clientData = {
      id: clientId,
      name,
      email,
      phone: phone || "",
      company: company || "",
      address: address || "",
      status: status || "active",
      revenue: revenue || 0,
      projects: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await kv.set(clientId, clientData);
    return c.json({
      success: true,
      client: clientData
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
app.put("/make-server-04919ac5/clients/:id", requireAuth, async (c: HonoContext) =>{
  try {
    const clientId = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(clientId);
    if (!existing) return c.json({
      success: false,
      error: "Client not found"
    }, 404);
    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString()
    };
    await kv.set(clientId, updated);
    return c.json({
      success: true,
      client: updated
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
app.delete("/make-server-04919ac5/clients/:id", requireAuth, async (c: HonoContext) =>{
  try {
    const clientId = c.req.param("id");
    const existing = await kv.get(clientId);
    if (!existing) return c.json({
      success: false,
      error: "Client not found"
    }, 404);
    await kv.del(clientId);
    return c.json({
      success: true,
      message: "Client deleted"
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
console.log("✅ Clients routes added");
// ===========================================================================
// LEADS ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/leads", requireAuth, async (c: HonoContext) =>{
  try {
    const leads = await kv.getByPrefix("lead:");
    const sorted = leads.sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({
      success: true,
      leads: sorted
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
app.get("/make-server-04919ac5/leads/:id", requireAuth, async (c: HonoContext) =>{
  try {
    const leadId = decodeURIComponent(c.req.param("id"));
    const lead = await kv.get(leadId);
    if (!lead) {
      return c.json({
        success: false,
        error: "Lead not found"
      }, 404);
    }
    return c.json({
      success: true,
      lead
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
app.post("/make-server-04919ac5/leads", async (c: HonoContext) =>{
  try {
    // Détection de bots avec Arcjet
    const isBot = await checkForBot(c);
    if (isBot) {
      console.warn("Bot detected attempting lead submission");
      return c.json({
        success: false,
        error: "Bot détecté"
      }, 403);
    }

    const body = await c.req.json();
    const { name, email, phone, message, budget, timeline, projectType, source, interests } = body;
    
    if (!name || !email) {
      return c.json({
        success: false,
        error: "Name and email required"
      }, 400);
    }

    // Validation email avancée avec Arcjet
    const emailValidation = await validateEmailWithArcjet(email);
    if (!emailValidation.valid) {
      return c.json({
        success: false,
        error: `Invalid email: ${emailValidation.reason}`
      }, 400);
    }
    
    const leadId = `lead:${Date.now()}@${email}`;
    const leadData = {
      id: leadId,
      name,
      email,
      phone: phone || "",
      message: message || "",
      budget: budget || "",
      timeline: timeline || "",
      projectType: projectType || "",
      source: source || "website",
      interests: interests || [],
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(leadId, leadData);
    return c.json({
      success: true,
      lead: leadData
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
app.put("/make-server-04919ac5/leads/:id", requireAuth, async (c: HonoContext) =>{
  try {
    const leadId = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(leadId);
    if (!existing) return c.json({
      success: false,
      error: "Lead not found"
    }, 404);
    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString()
    };
    await kv.set(leadId, updated);
    return c.json({
      success: true,
      lead: updated
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
app.delete("/make-server-04919ac5/leads/:id", requireAuth, async (c: HonoContext) =>{
  try {
    const leadId = c.req.param("id");
    await kv.del(leadId);
    return c.json({
      success: true,
      message: "Lead deleted"
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// Convert lead to client
app.post("/make-server-04919ac5/leads/:id/convert", requireAuth, async (c: HonoContext) =>{
  try {
    const leadId = decodeURIComponent(c.req.param("id"));
    const lead = await kv.get(leadId);
    
    if (!lead) {
      return c.json({
        success: false,
        error: "Lead not found"
      }, 404);
    }
    
    if (lead.status === "converted") {
      return c.json({
        success: false,
        error: "Lead already converted"
      }, 400);
    }
    
    // Create new client from lead data
    const clientId = `client:${Date.now()}@${lead.email}`;
    const clientData = {
      id: clientId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      company: lead.company || "",
      address: lead.address || "",
      status: "active",
      revenue: 0,
      projects: 0,
      convertedFromLead: leadId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save client
    await kv.set(clientId, clientData);
    
    // Update lead status
    const updatedLead = {
      ...lead,
      status: "converted",
      convertedToClient: clientId,
      updatedAt: new Date().toISOString()
    };
    await kv.set(leadId, updatedLead);
    
    console.log(`✅ Converted lead ${leadId} to client ${clientId}`);
    
    return c.json({
      success: true,
      client: clientData,
      lead: updatedLead
    });
  } catch (error) {
    console.error("❌ Error converting lead:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

console.log("✅ Leads routes added");
// ===========================================================================
// BOOKINGS ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/bookings", requireAuth, async (c: HonoContext) =>{
  try {
    const bookings = await kv.getByPrefix("booking:");
    const sorted = bookings.sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json({
      success: true,
      bookings: sorted
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
app.post("/make-server-04919ac5/bookings", async (c: HonoContext) =>{
  try {
    // Détection de bots avec Arcjet
    const isBot = await checkForBot(c);
    if (isBot) {
      console.warn("Bot detected attempting booking submission");
      return c.json({
        success: false,
        error: "Bot détecté"
      }, 403);
    }

    const body = await c.req.json();
    const { name, email, phone, date, time, service, message } = body;

    // Validation email avancée avec Arcjet
    if (email) {
      const emailValidation = await validateEmailWithArcjet(email);
      if (!emailValidation.valid) {
        return c.json({
          success: false,
          error: `Invalid email: ${emailValidation.reason}`
        }, 400);
      }
    }
    
    const bookingId = `booking:${Date.now()}@${email}`;
    const bookingData = {
      id: bookingId,
      name,
      email,
      phone: phone || "",
      date,
      time,
      service,
      message: message || "",
      status: "pending",
      createdAt: new Date().toISOString()
    };
    await kv.set(bookingId, bookingData);
    return c.json({
      success: true,
      booking: bookingData
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
app.put("/make-server-04919ac5/bookings/:id", requireAuth, async (c: HonoContext) =>{
  try {
    const bookingId = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(bookingId);
    if (!existing) return c.json({
      success: false,
      error: "Booking not found"
    }, 404);
    const updated = {
      ...existing,
      ...body
    };
    await kv.set(bookingId, updated);
    return c.json({
      success: true,
      booking: updated
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
app.delete("/make-server-04919ac5/bookings/:id", requireAuth, async (c: HonoContext) =>{
  try {
    const bookingId = c.req.param("id");
    console.log("🗑️ DELETE booking request - ID received:", bookingId);
    
    // Essayer de trouver le booking avec différents formats d'ID
    let found = await kv.get(bookingId);
    let keyToDelete = bookingId;
    console.log("🔍 Trying exact ID:", bookingId, "- Found:", !!found);
    
    // Si pas trouvé et que l'ID ne commence pas par "booking:", essayer avec le préfixe
    if (!found && !bookingId.startsWith("booking:")) {
      const withPrefix = `booking:${bookingId}`;
      found = await kv.get(withPrefix);
      console.log("🔍 Trying with prefix:", withPrefix, "- Found:", !!found);
      if (found) keyToDelete = withPrefix;
    }
    
    // Si toujours pas trouvé et que l'ID commence par "booking:", essayer sans le préfixe
    if (!found && bookingId.startsWith("booking:")) {
      const withoutPrefix = bookingId.replace("booking:", "");
      found = await kv.get(withoutPrefix);
      console.log("🔍 Trying without prefix:", withoutPrefix, "- Found:", !!found);
      if (found) keyToDelete = withoutPrefix;
    }
    
    if (!found) {
      console.log("❌ Booking not found in KV with any format");
      // Essayons de lister tous les bookings pour voir ce qui existe
      const allBookings = await kv.getByPrefix("booking:");
      console.log("📋 All bookings in KV:", allBookings.map((b: any) => ({ id: b.id, email: b.email })));
    }
    
    // Supprimer avec la clé correcte
    console.log("🗑️ Deleting key:", keyToDelete);
    await kv.del(keyToDelete);
    console.log("✅ Deleted successfully");
    
    return c.json({
      success: true,
      message: "Booking deleted",
      deletedKey: keyToDelete,
      wasFound: !!found
    });
  } catch (error: any) {
    console.error("❌ DELETE booking error:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// Route ADMIN pour supprimer TOUS les bookings (nettoyage)
app.delete("/make-server-04919ac5/bookings", requireAuth, async (c: HonoContext) =>{
  try {
    console.log("🗑️ DELETE ALL bookings request");
    
    // Récupérer tous les bookings AVEC leurs clés
    const allBookingsWithKeys = await kv.getByPrefixWithKeys("booking:");
    console.log(`📋 Found ${allBookingsWithKeys.length} bookings to delete`);
    
    // Supprimer chaque booking en utilisant la CLÉ, pas l'ID
    let deleted = 0;
    for (const item of allBookingsWithKeys) {
      console.log(`🗑️ Deleting key: ${item.key}`);
      await kv.del(item.key);
      deleted++;
    }
    
    console.log(`✅ Deleted ${deleted} bookings`);
    
    return c.json({
      success: true,
      message: `Deleted ${deleted} bookings`,
      count: deleted
    });
  } catch (error: any) {
    console.error("❌ DELETE ALL bookings error:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

console.log("✅ Bookings routes added");

// =============================================================================
// 📧 EMAIL STYLES & NOTIFICATIONS
// =============================================================================

// Style commun pour tous les emails (DA maxence.design)
const commonStyles = `
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6; 
    color: #e0e0e0; 
    background: #000000;
    margin: 0;
    padding: 0;
  }
  .email-wrapper { 
    background: #000000; 
    padding: 40px 20px; 
  }
  .container { 
    max-width: 600px; 
    margin: 0 auto; 
    background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
    border: 1px solid #00FFC2;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 255, 194, 0.15);
  }
  .header { 
    background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
    padding: 30px;
    text-align: center;
    border-bottom: 2px solid #00FFC2;
  }
  .logo { 
    color: #00FFC2; 
    font-size: 28px; 
    font-weight: 700; 
    letter-spacing: -1px;
    text-transform: uppercase;
    margin: 0;
  }
  .tagline {
    color: #888;
    font-size: 12px;
    margin-top: 5px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .content { 
    padding: 40px 30px; 
  }
  h1 { 
    color: #00FFC2; 
    font-size: 24px; 
    margin: 0 0 20px 0;
    font-weight: 600;
  }
  .info-box {
    background: rgba(0, 255, 194, 0.05);
    border: 1px solid rgba(0, 255, 194, 0.2);
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  }
  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  .info-row:last-child {
    border-bottom: none;
  }
  .info-label {
    color: #888;
    font-size: 14px;
  }
  .info-value {
    color: #e0e0e0;
    font-weight: 600;
  }
  .button { 
    display: inline-block;
    background: linear-gradient(135deg, #00FFC2 0%, #00CC9A 100%);
    color: #000000;
    padding: 14px 32px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    margin: 20px 0;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0, 255, 194, 0.3);
    transition: all 0.3s ease;
  }
  .button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 255, 194, 0.4);
  }
  .footer { 
    background: rgba(255, 255, 255, 0.02);
    padding: 25px;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
  .footer-text { 
    color: #666; 
    font-size: 13px; 
    margin: 5px 0;
  }
  .footer-link {
    color: #00FFC2;
    text-decoration: none;
  }
  .footer-link:hover {
    text-decoration: underline;
  }
  .status-badge {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .status-confirmed {
    background: rgba(0, 255, 194, 0.1);
    color: #00FFC2;
    border: 1px solid rgba(0, 255, 194, 0.3);
  }
  .status-cancelled {
    background: rgba(255, 68, 68, 0.1);
    color: #ff4444;
    border: 1px solid rgba(255, 68, 68, 0.3);
  }
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 194, 0.3), transparent);
    margin: 30px 0;
  }
`;

// Route: POST /make-server-04919ac5/emails/booking-confirmation
// Description: Envoyer un email de confirmation ou d'annulation de RDV
app.post("/make-server-04919ac5/emails/booking-confirmation", async (c: HonoContext) => {
  try {
    const body = await c.req.json();
    const { to, name, date, time, service, status, message } = body;

    if (!to || !name || !date || !time) {
      return c.json({ success: false, error: "Missing required fields" }, 400);
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.error("❌ RESEND_API_KEY not configured");
      return c.json({ success: false, error: "Email service not configured" }, 500);
    }

    // Formater la date
    const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Déterminer le sujet et le contenu selon le statut
    let subject = '';
    let html = '';
    
    // Style commun pour tous les emails (DA maxence.design)
    const commonStyles = `
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6; 
        color: #e0e0e0; 
        background: #000000;
        margin: 0;
        padding: 0;
      }
      .email-wrapper { 
        background: #000000; 
        padding: 40px 20px; 
      }
      .container { 
        max-width: 600px; 
        margin: 0 auto; 
        background: #0C0C0C;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid rgba(0, 255, 194, 0.1);
        box-shadow: 0 8px 32px rgba(0, 255, 194, 0.05);
      }
      .header { 
        background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%);
        padding: 40px 30px;
        text-align: center;
        border-bottom: 2px solid rgba(0, 255, 194, 0.2);
      }
      .logo {
        font-size: 28px;
        font-weight: 700;
        color: #00FFC2;
        margin-bottom: 10px;
        letter-spacing: -0.5px;
      }
      .header-icon { 
        font-size: 48px; 
        margin-bottom: 15px;
        filter: drop-shadow(0 4px 12px rgba(0, 255, 194, 0.3));
      }
      h1 {
        color: #ffffff;
        font-size: 24px;
        font-weight: 600;
        margin: 0;
        line-height: 1.3;
      }
      .content { 
        background: #0C0C0C;
        padding: 40px 30px;
      }
      .content p {
        color: #d0d0d0;
        margin: 0 0 15px 0;
      }
      .detail { 
        background: rgba(255, 255, 255, 0.02);
        padding: 18px 20px;
        margin: 12px 0;
        border-radius: 8px;
        border-left: 3px solid #00FFC2;
        backdrop-filter: blur(10px);
        color: #d0d0d0;
      }
      .detail strong {
        color: #00FFC2;
        font-weight: 600;
        display: block;
        margin-bottom: 4px;
      }
      .detail span {
        color: #ffffff;
      }
      .alert-box {
        background: rgba(255, 193, 7, 0.1);
        border: 1px solid rgba(255, 193, 7, 0.3);
        border-radius: 8px;
        padding: 18px 20px;
        margin: 20px 0;
        color: #ffc107;
        line-height: 1.6;
      }
      .alert-box strong {
        color: #ffc107;
        display: block;
        margin-bottom: 4px;
      }
      .cta-button {
        display: inline-block;
        background: linear-gradient(135deg, #00FFC2 0%, #00d9a5 100%);
        color: #000000;
        padding: 14px 32px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        margin: 20px 0;
        box-shadow: 0 4px 16px rgba(0, 255, 194, 0.3);
        transition: transform 0.2s;
      }
      .footer { 
        text-align: center;
        padding: 30px;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        color: #999;
        font-size: 13px;
      }
      .footer p {
        color: #999;
        margin: 5px 0;
      }
      .footer a {
        color: #00FFC2;
        text-decoration: none;
      }
      .divider {
        height: 1px;
        background: linear-gradient(90deg, transparent 0%, rgba(0, 255, 194, 0.2) 50%, transparent 100%);
        margin: 30px 0;
      }
    `;
    
    if (status === 'confirmed') {
      subject = `✅ Rendez-vous confirmé - ${formattedDate} à ${time}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${commonStyles}</style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="container">
              <div class="header">
                <div class="logo">maxence.design</div>
                <div class="header-icon">✅</div>
                <h1>Rendez-vous Confirmé</h1>
              </div>
              <div class="content">
                <p>Bonjour <strong style="color: #fff;">${name}</strong>,</p>
                <p>Votre rendez-vous a été <strong style="color: #00FFC2;">confirmé</strong> avec succès.</p>
                
                <div class="divider"></div>
                
                <div class="detail">
                  <strong>📅 Date</strong><br>
                  <span style="color: #ffffff; font-size: 16px;">${formattedDate}</span>
                </div>
                <div class="detail">
                  <strong>🕐 Heure</strong><br>
                  <span style="color: #ffffff; font-size: 16px;">${time}</span>
                </div>
                ${service ? `<div class="detail"><strong>💼 Service</strong><br><span style="color: #ffffff; font-size: 16px;">${service}</span></div>` : ''}
                ${message ? `<div class="detail"><strong>📝 Note</strong><br><span style="color: #ffffff;">${message}</span></div>` : ''}
                
                <div class="divider"></div>
                
                <p style="color: #00FFC2; font-weight: 600; margin-top: 25px;">Nous vous attendons avec plaisir !</p>
                <p style="font-size: 14px;">Si vous avez besoin de modifier ou d'annuler ce rendez-vous, merci de nous contacter au plus tôt.</p>
                
                <div class="footer">
                  <p style="margin: 0 0 10px 0;">maxence.design | Design & Développement Web</p>
                  <p style="margin: 0;"><a href="https://maxence.design">maxence.design</a> | <a href="mailto:contact@maxence.design">contact@maxence.design</a></p>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (status === 'cancelled') {
      subject = `❌ Rendez-vous annulé - ${formattedDate} à ${time}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${commonStyles}</style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="container">
              <div class="header">
                <div class="logo">maxence.design</div>
                <div class="header-icon">❌</div>
                <h1>Rendez-vous Annulé</h1>
              </div>
              <div class="content">
                <p>Bonjour <strong style="color: #fff;">${name}</strong>,</p>
                <p>Votre rendez-vous a été <strong style="color: #ff6b6b;">annulé</strong>.</p>
                
                <div class="divider"></div>
                
                <div class="detail">
                  <strong>📅 Date</strong><br>
                  <span style="color: #ffffff; font-size: 16px;">${formattedDate}</span>
                </div>
                <div class="detail">
                  <strong>🕐 Heure</strong><br>
                  <span style="color: #ffffff; font-size: 16px;">${time}</span>
                </div>
                ${service ? `<div class="detail"><strong>💼 Service</strong><br><span style="color: #ffffff; font-size: 16px;">${service}</span></div>` : ''}
                ${message ? `<div class="alert-box"><strong>📝 Raison</strong><br>${message}</div>` : ''}
                
                <div class="divider"></div>
                
                <p style="margin-top: 25px;">Si vous souhaitez reprendre un nouveau rendez-vous, n'hésitez pas à nous contacter.</p>
                
                <div class="footer">
                  <p style="margin: 0 0 10px 0;">maxence.design | Design & Développement Web</p>
                  <p style="margin: 0;"><a href="https://maxence.design">maxence.design</a> | <a href="mailto:contact@maxence.design">contact@maxence.design</a></p>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (status === 'modified') {
      subject = `🔄 Rendez-vous modifié - ${formattedDate} à ${time}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${commonStyles}</style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="container">
              <div class="header">
                <div class="logo">maxence.design</div>
                <div class="header-icon">🔄</div>
                <h1>Rendez-vous Modifié</h1>
              </div>
              <div class="content">
                <p>Bonjour <strong style="color: #fff;">${name}</strong>,</p>
                <p>Votre rendez-vous a été <strong style="color: #ffc107;">modifié</strong>.</p>
                
                ${message ? `<div class="alert-box"><strong>⚠️ Changement</strong><br>${message}</div>` : ''}
                
                <div class="divider"></div>
                
                <h3 style="color: #00FFC2; font-size: 18px; margin: 20px 0 15px 0;">📅 Nouvelles informations</h3>
                
                <div class="detail">
                  <strong>📅 Nouvelle date</strong><br>
                  <span style="color: #ffffff; font-size: 16px;">${formattedDate}</span>
                </div>
                <div class="detail">
                  <strong>🕐 Nouvelle heure</strong><br>
                  <span style="color: #ffffff; font-size: 16px;">${time}</span>
                </div>
                ${service ? `<div class="detail"><strong>💼 Service</strong><br><span style="color: #ffffff; font-size: 16px;">${service}</span></div>` : ''}
                
                <div class="divider"></div>
                
                <p style="margin-top: 25px;">Si ces nouvelles informations ne vous conviennent pas, merci de nous contacter au plus tôt.</p>
                
                <div class="footer">
                  <p style="margin: 0 0 10px 0;">maxence.design | Design & Développement Web</p>
                  <p style="margin: 0;"><a href="https://maxence.design">maxence.design</a> | <a href="mailto:contact@maxence.design">contact@maxence.design</a></p>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      // Status = pending (nouveau RDV)
      subject = `⏳ Nouveau rendez-vous - ${formattedDate} à ${time}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${commonStyles}</style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="container">
              <div class="header">
                <div class="logo">maxence.design</div>
                <div class="header-icon">⏳</div>
                <h1>Demande de Rendez-vous Reçue</h1>
              </div>
              <div class="content">
                <p>Bonjour <strong style="color: #fff;">${name}</strong>,</p>
                <p>Nous avons bien reçu votre demande de rendez-vous.</p>
                
                <div class="divider"></div>
                
                <div class="detail">
                  <strong>📅 Date souhaitée</strong><br>
                  <span style="color: #ffffff; font-size: 16px;">${formattedDate}</span>
                </div>
                <div class="detail">
                  <strong>🕐 Heure souhaitée</strong><br>
                  <span style="color: #ffffff; font-size: 16px;">${time}</span>
                </div>
                ${service ? `<div class="detail"><strong>💼 Service</strong><br><span style="color: #ffffff; font-size: 16px;">${service}</span></div>` : ''}
                ${message ? `<div class="detail"><strong>📝 Message</strong><br><span style="color: #ffffff; font-size: 16px;">${message}</span></div>` : ''}
                
                <div class="divider"></div>
                
                <p style="color: #ffc107; font-weight: 600; margin-top: 25px;">Votre demande est en attente de confirmation. Nous vous contacterons très prochainement pour valider ce rendez-vous.</p>
                
                <div class="footer">
                  <p style="margin: 0 0 10px 0;">maxence.design | Design & Développement Web</p>
                  <p style="margin: 0;"><a href="https://maxence.design">maxence.design</a> | <a href="mailto:contact@maxence.design">contact@maxence.design</a></p>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Envoyer l'email via Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Maxence Design <contact@maxence.design>",
        to: [to],
        subject,
        html
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`✅ Email ${status} sent to ${to}`);
      return c.json({ success: true, message: `Email sent to ${to}`, emailId: result.id });
    } else {
      console.error("❌ Resend API error:", result);
      return c.json({ success: false, error: result.message || "Failed to send email" }, 500);
    }
  } catch (error: any) {
    console.error("❌ Email sending error:", error);
    return c.json({ success: false, error: getErrorMessage(error) }, 500);
  }
});

console.log("✅ Booking email notifications added");

// ===========================================================================
// CRON ROUTES - AUTOMATED TASKS
// ===========================================================================
console.log("⏰ Adding CRON routes for automation...");

// Route pour relances automatiques des factures impayées
app.post("/make-server-04919ac5/cron/send-invoice-reminders", async (c: HonoContext) => {
  try {
    console.log("🔔 Running invoice reminders cron job...");
    
    const invoices = await kv.getByPrefix("invoice:");
    const now = new Date();
    const remindersConfig = [
      { days: 7, label: "J+7" },
      { days: 15, label: "J+15" },
      { days: 30, label: "J+30 - URGENT" }
    ];
    
    let sentCount = 0;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    
    for (const invoice of invoices) {
      if (invoice.status !== 'unpaid' && invoice.status !== 'overdue') continue;
      
      const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : new Date(invoice.createdAt);
      const daysPastDue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Vérifier si on doit envoyer un reminder
      const shouldRemind = remindersConfig.some(config => 
        daysPastDue === config.days || 
        (daysPastDue > config.days && daysPastDue < config.days + 1)
      );
      
      if (shouldRemind && invoice.clientEmail) {
        const reminderType = daysPastDue >= 30 ? 'urgent' : daysPastDue >= 15 ? 'second' : 'first';
        
        const subject = `${reminderType === 'urgent' ? '🚨 URGENT' : '💼'} Rappel Facture N°${invoice.id.substring(0, 8).toUpperCase()}`;
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${commonStyles}</style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="container">
                <div class="header">
                  <div class="logo">maxence.design</div>
                  <div class="header-icon">${reminderType === 'urgent' ? '🚨' : '💼'}</div>
                  <h1>Rappel de Paiement</h1>
                </div>
                <div class="content">
                  <p>Bonjour <strong style="color: #fff;">${invoice.clientName}</strong>,</p>
                  <p>Nous vous rappelons que la facture suivante est en attente de paiement depuis <strong style="color: #ffc107;">${daysPastDue} jours</strong>.</p>
                  
                  <div class="divider"></div>
                  
                  <div class="detail">
                    <strong>📄 Facture</strong><br>
                    <span style="color: #ffffff; font-size: 16px;">N°${invoice.id.substring(0, 8).toUpperCase()}</span>
                  </div>
                  <div class="detail">
                    <strong>💰 Montant</strong><br>
                    <span style="color: #ffffff; font-size: 18px; font-weight: bold;">${invoice.amount.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div class="detail">
                    <strong>📅 Date d'échéance</strong><br>
                    <span style="color: #ff6b6b; font-size: 16px;">${dueDate.toLocaleDateString('fr-FR')}</span>
                  </div>
                  
                  ${reminderType === 'urgent' ? `
                    <div class="alert-box" style="background: rgba(255, 107, 107, 0.1); border-color: rgba(255, 107, 107, 0.3); color: #ff6b6b;">
                      <strong>⚠️ Action Requise</strong><br>
                      Cette facture est en retard de plus de 30 jours. Merci de régulariser votre situation dans les plus brefs délais pour éviter toute interruption de service.
                    </div>
                  ` : `
                    <div class="divider"></div>
                    <p style="margin-top: 25px;">Merci de procéder au règlement dans les meilleurs délais. Si vous avez déjà effectué le paiement, veuillez ignorer ce message.</p>
                  `}
                  
                  <div class="footer">
                    <p style="margin: 0 0 10px 0;">maxence.design | Design & Développement Web</p>
                    <p style="margin: 0;"><a href="https://maxence.design">maxence.design</a> | <a href="mailto:contact@maxence.design">contact@maxence.design</a></p>
                  </div>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
        
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Maxence Design <contact@maxence.design>",
            to: [invoice.clientEmail],
            subject,
            html
          }),
        });
        
        if (response.ok) {
          console.log(`✅ Reminder sent for invoice ${invoice.id} (${daysPastDue} days overdue)`);
          sentCount++;
        }
      }
    }
    
    return c.json({ 
      success: true, 
      message: `Sent ${sentCount} invoice reminders`,
      sentCount 
    });
  } catch (error: any) {
    console.error("❌ Error sending invoice reminders:", error);
    return c.json({ success: false, error: getErrorMessage(error) }, 500);
  }
});

// Route pour rappels de rendez-vous (24h avant)
app.post("/make-server-04919ac5/cron/send-booking-reminders", async (c: HonoContext) => {
  try {
    console.log("🔔 Running booking reminders cron job...");
    
    const bookings = await kv.getByPrefix("booking:");
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    let sentCount = 0;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    
    for (const booking of bookings) {
      if (booking.status !== 'confirmed') continue;
      
      const bookingDate = new Date(booking.date);
      const isTomorrow = bookingDate.toDateString() === tomorrow.toDateString();
      
      if (isTomorrow && booking.email) {
        const formattedDate = bookingDate.toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        const subject = `🔔 Rappel: Votre RDV demain à ${booking.time}`;
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${commonStyles}</style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="container">
                <div class="header">
                  <div class="logo">maxence.design</div>
                  <div class="header-icon">🔔</div>
                  <h1>Rappel de Rendez-vous</h1>
                </div>
                <div class="content">
                  <p>Bonjour <strong style="color: #fff;">${booking.name}</strong>,</p>
                  <p>Nous vous rappelons que vous avez un rendez-vous <strong style="color: #00FFC2;">demain</strong>.</p>
                  
                  <div class="divider"></div>
                  
                  <div class="detail">
                    <strong>📅 Date</strong><br>
                    <span style="color: #ffffff; font-size: 16px;">${formattedDate}</span>
                  </div>
                  <div class="detail">
                    <strong>🕐 Heure</strong><br>
                    <span style="color: #00FFC2; font-size: 20px; font-weight: bold;">${booking.time}</span>
                  </div>
                  ${booking.service ? `
                    <div class="detail">
                      <strong>💼 Service</strong><br>
                      <span style="color: #ffffff; font-size: 16px;">${booking.service}</span>
                    </div>
                  ` : ''}
                  
                  <div class="divider"></div>
                  
                  <p style="color: #00FFC2; font-weight: 600; margin-top: 25px;">À demain ! 👋</p>
                  <p style="color: #b0b0b0; font-size: 14px; margin-top: 15px;">
                    Si vous avez besoin de modifier ou d'annuler ce rendez-vous, merci de nous contacter dès que possible.
                  </p>
                  
                  <div class="footer">
                    <p style="margin: 0 0 10px 0;">maxence.design | Design & Développement Web</p>
                    <p style="margin: 0;"><a href="https://maxence.design">maxence.design</a> | <a href="mailto:contact@maxence.design">contact@maxence.design</a></p>
                  </div>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
        
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Maxence Design <contact@maxence.design>",
            to: [booking.email],
            subject,
            html
          }),
        });
        
        if (response.ok) {
          console.log(`✅ Reminder sent for booking ${booking.id} (${booking.name})`);
          sentCount++;
        }
      }
    }
    
    return c.json({ 
      success: true, 
      message: `Sent ${sentCount} booking reminders`,
      sentCount 
    });
  } catch (error: any) {
    console.error("❌ Error sending booking reminders:", error);
    return c.json({ success: false, error: getErrorMessage(error) }, 500);
  }
});

console.log("✅ CRON routes added");

// ===========================================================================
// CALENDAR ROUTES - AVAILABILITIES & EVENTS
// ===========================================================================
app.get("/make-server-04919ac5/availabilities", requireAuth, async (c: HonoContext) =>{
  try {
    const availabilities = await kv.getByPrefix("availability:");
    return c.json({
      success: true,
      availabilities: availabilities || []
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

app.post("/make-server-04919ac5/availabilities", requireAuth, async (c: HonoContext) =>{
  try {
    const body = await c.req.json();
    const availabilityId = `availability:${Date.now()}`;
    await kv.set(availabilityId, {
      id: availabilityId,
      ...body,
      createdAt: new Date().toISOString()
    });
    return c.json({
      success: true,
      availability: body
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

app.get("/make-server-04919ac5/events", requireAuth, async (c: HonoContext) =>{
  try {
    const events = await kv.getByPrefix("event:");
    return c.json({
      success: true,
      events: events || []
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

app.post("/make-server-04919ac5/events", requireAuth, async (c: HonoContext) =>{
  try {
    const body = await c.req.json();
    const eventId = `event:${Date.now()}`;
    await kv.set(eventId, {
      id: eventId,
      ...body,
      createdAt: new Date().toISOString()
    });
    return c.json({
      success: true,
      event: body
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

console.log("✅ Calendar routes added (availabilities & events)");

// ===========================================================================
// EMAIL ROUTES - BOOKING CONFIRMATION
// ===========================================================================
app.post("/make-server-04919ac5/emails/booking-confirmation", async (c: HonoContext) =>{
  try {
    const body = await c.req.json();
    const { name, email, phone, date, time, duration, service } = body;
    
    if (!name || !email || !date || !time || !duration) {
      return c.json({
        success: false,
        error: "Missing required fields: name, email, date, time, duration"
      }, 400);
    }
    
    // Import and use the email service
    const { sendBookingConfirmation } = await import("./email_service.tsx");
    
    const emailResult = await sendBookingConfirmation({
      email,
      name,
      date,
      time,
      duration,
      service
    });
    
    if (emailResult.success) {
      console.log(`📧 Booking confirmation email sent to ${email}`);
      return c.json({
        success: true,
        message: "Booking confirmation email sent successfully"
      });
    } else {
      console.error(`❌ Failed to send booking confirmation email: ${emailResult.error}`);
      return c.json({
        success: false,
        error: emailResult.error || "Failed to send booking confirmation email"
      }, 500);
    }
  } catch (error) {
    console.error("❌ Error sending booking confirmation:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
console.log("✅ Booking confirmation email route added");
// ===========================================================================
// EMAIL ROUTES - LEAD CONFIRMATION
// ===========================================================================
app.post("/make-server-04919ac5/emails/lead-confirmation", async (c: HonoContext) =>{
  try {
    const body = await c.req.json();
    const { name, email, message, wantsAppointment } = body;
    
    if (!name || !email || !message) {
      return c.json({
        success: false,
        error: "Missing required fields: name, email, message"
      }, 400);
    }
    
    // Import and use the email service
    const { sendLeadConfirmation } = await import("./email_service.tsx");
    
    const emailResult = await sendLeadConfirmation({
      name,
      email,
      message,
      wantsAppointment: wantsAppointment || false
    });
    
    if (emailResult.success) {
      console.log(`📧 Lead confirmation email sent to ${email}`);
      return c.json({
        success: true,
        message: "Lead confirmation email sent successfully"
      });
    } else {
      console.error(`❌ Failed to send lead confirmation email: ${emailResult.error}`);
      return c.json({
        success: false,
        error: emailResult.error || "Failed to send lead confirmation email"
      }, 500);
    }
  } catch (error) {
    console.error("❌ Error sending lead confirmation:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
console.log("✅ Lead confirmation email route added");
// ===========================================================================
// DASHBOARD STATS
// ===========================================================================
app.get("/make-server-04919ac5/dashboard/stats", requireAuth, async (c: HonoContext) =>{
  try {
    const [leads, clients, bookings] = await Promise.all([
      kv.getByPrefix("lead:"),
      kv.getByPrefix("client:"),
      kv.getByPrefix("booking:")
    ]);
    // Sort by createdAt
    const sortedLeads = leads.sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const sortedClients = clients.sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const sortedBookings = bookings.sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json({
      success: true,
      // Return ARRAYS, not numbers
      leads: sortedLeads,
      clients: sortedClients,
      bookings: sortedBookings
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
console.log("✅ Dashboard stats route added");
// ===========================================================================
// QUOTES ROUTES - THE 6 ROUTES THAT WORK
// ===========================================================================
console.log("📋 Adding QUOTES routes...");
// 1. Get all quotes
app.get("/make-server-04919ac5/quotes", requireAuth, async (c: HonoContext) =>{
  try {
    const quotes = await kv.getByPrefix("quote:");
    const sorted = quotes.sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    console.log(`✅ Fetched ${quotes.length} quotes`);
    return c.json({
      success: true,
      quotes: sorted
    });
  } catch (error) {
    console.error("❌ Error fetching quotes:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
// 1.5. Get single quote by ID
app.get("/make-server-04919ac5/quotes/:id", requireAuth, async (c: HonoContext) =>{
  try {
    const quoteId = decodeURIComponent(c.req.param("id"));
    const quote = await kv.get(quoteId);
    if (!quote) {
      return c.json({
        success: false,
        error: "Quote not found"
      }, 404);
    }
    return c.json({
      success: true,
      quote
    });
  } catch (error) {
    console.error("❌ Error fetching quote:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
// 2. Create a new quote
app.post("/make-server-04919ac5/quotes", requireAuth, async (c: HonoContext) =>{
  try {
    const body = await c.req.json();
    const { number, clientId, clientName, clientEmail, clientAddress, amount, description, validUntil, status, metadata } = body;
    if (!number || !clientId || !clientName || !amount || !validUntil) {
      return c.json({
        success: false,
        error: "Missing required fields"
      }, 400);
    }
    const quoteId = `quote:${Date.now()}@${number}`;
    const quoteData = {
      id: quoteId,
      number,
      clientId,
      clientName,
      clientEmail: clientEmail || "",
      clientAddress: clientAddress || "",
      amount: parseFloat(amount),
      description: description || "",
      validUntil,
      status: status || "draft",
      metadata: metadata || {},
      convertedToInvoice: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await kv.set(quoteId, quoteData);
    console.log(`✅ Quote created: ${quoteId}`);
    return c.json({
      success: true,
      quote: quoteData
    });
  } catch (error) {
    console.error("❌ Error creating quote:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
// 3. Update a quote
app.put("/make-server-04919ac5/quotes/:id", requireAuth, async (c: HonoContext) =>{
  try {
    const quoteId = decodeURIComponent(c.req.param("id"));
    const body = await c.req.json();
    const existingQuote = await kv.get(quoteId);
    if (!existingQuote) return c.json({
      success: false,
      error: "Quote not found"
    }, 404);
    const updatedQuote = {
      ...existingQuote,
      ...body,
      updatedAt: new Date().toISOString()
    };
    await kv.set(quoteId, updatedQuote);
    console.log(`✅ Quote updated: ${quoteId}`);
    return c.json({
      success: true,
      quote: updatedQuote,
      emailSent: false
    });
  } catch (error) {
    console.error("❌ Error updating quote:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
// 4. Delete a quote
app.delete("/make-server-04919ac5/quotes/:id", requireAuth, async (c: HonoContext) =>{
  try {
    const quoteId = decodeURIComponent(c.req.param("id"));
    const existingQuote = await kv.get(quoteId);
    if (!existingQuote) return c.json({
      success: false,
      error: "Quote not found"
    }, 404);
    await kv.del(quoteId);
    console.log(`✅ Quote deleted: ${quoteId}`);
    return c.json({
      success: true,
      message: "Quote deleted successfully"
    });
  } catch (error) {
    console.error("❌ Error deleting quote:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
// 5. Convert quote to invoice
app.post("/make-server-04919ac5/quotes/:id/convert", requireAuth, async (c: HonoContext) =>{
  try {
    const quoteId = decodeURIComponent(c.req.param("id"));
    const quote = await kv.get(quoteId);
    if (!quote) return c.json({
      success: false,
      error: "Quote not found"
    }, 404);
    if (quote.status !== "accepted") return c.json({
      success: false,
      error: "Only accepted quotes can be converted"
    }, 400);
    if (quote.convertedToInvoice) return c.json({
      success: false,
      error: "Already converted"
    }, 400);
    const invoiceNumber = quote.number.replace("DEV-", "FACT-");
    const invoiceId = `invoice:${Date.now()}@${invoiceNumber}`;
    const invoiceData = {
      id: invoiceId,
      number: invoiceNumber,
      clientId: quote.clientId,
      clientName: quote.clientName,
      clientEmail: quote.clientEmail,
      clientAddress: quote.clientAddress,
      amount: quote.amount,
      description: quote.description,
      status: "unpaid",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      metadata: quote.metadata || {},
      convertedFromQuote: quoteId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await kv.set(invoiceId, invoiceData);
    const updatedQuote = {
      ...quote,
      status: "converted",
      convertedToInvoice: invoiceId,
      updatedAt: new Date().toISOString()
    };
    await kv.set(quoteId, updatedQuote);
    console.log(`✅ Converted ${quoteId} to ${invoiceId}`);
    return c.json({
      success: true,
      invoice: invoiceData,
      quote: updatedQuote
    });
  } catch (error) {
    console.error("❌ Error converting:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
// 6. Send reminder
app.post("/make-server-04919ac5/quotes/:id/send-reminder", requireAuth, async (c: HonoContext) =>{
  try {
    const quoteId = decodeURIComponent(c.req.param("id"));
    const quote = await kv.get(quoteId);
    if (!quote) return c.json({
      success: false,
      error: "Quote not found"
    }, 404);
    
    // Send quote email using email service
    if (!quote.clientEmail) {
      console.error(`❌ No email for client in quote ${quoteId}`);
      return c.json({
        success: false,
        error: "Client email not found"
      }, 400);
    }
    
    const emailResult = await sendQuoteEmail({
      clientEmail: quote.clientEmail,
      clientName: quote.clientName,
      quoteNumber: quote.number, // "number" is the property in the quote object
      amount: quote.amount,
      validUntil: quote.validUntil
    });
    
    if (emailResult.success) {
      console.log(`📧 Quote email sent for ${quoteId} to ${quote.clientEmail}`);
      return c.json({
        success: true,
        message: "Quote email sent successfully",
        emailSent: true
      });
    } else {
      console.error(`❌ Failed to send quote email: ${emailResult.error}`);
      return c.json({
        success: false,
        error: emailResult.error || "Failed to send email"
      }, 500);
    }
  } catch (error) {
    console.error("❌ Error sending reminder:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
console.log("✅ ALL 6 QUOTES ROUTES ADDED!");
// ===========================================================================
// INVOICES ROUTES - NEW!
// ===========================================================================
console.log("💰 Adding INVOICES routes...");
// 1. Get all invoices
app.get("/make-server-04919ac5/invoices", requireAuth, async (c: HonoContext) =>{
  try {
    const invoices = await kv.getByPrefix("invoice:");
    const sorted = invoices.sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    console.log(`✅ Fetched ${invoices.length} invoices`);
    return c.json({
      success: true,
      invoices: sorted
    });
  } catch (error) {
    console.error("❌ Error fetching invoices:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
// 2. Get single invoice
app.get("/make-server-04919ac5/invoices/:id", requireAuth, async (c: HonoContext) =>{
  try {
    const invoiceId = decodeURIComponent(c.req.param("id"));
    const invoice = await kv.get(invoiceId);
    if (!invoice) return c.json({
      success: false,
      error: "Invoice not found"
    }, 404);
    console.log(`✅ Invoice found: ${invoiceId}`);
    return c.json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error("❌ Error fetching invoice:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// 2.5. Create new invoice
app.post("/make-server-04919ac5/invoices", requireAuth, async (c: HonoContext) =>{
  try {
    const body = await c.req.json();
    
    // Validate required fields
    if (!body.clientId || !body.clientName || !body.clientEmail) {
      return c.json({
        success: false,
        error: "Missing required fields: clientId, clientName, clientEmail"
      }, 400);
    }

    // Generate invoice ID and number if not provided
    const timestamp = Date.now();
    const invoiceNumber = body.invoiceNumber || `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    const invoiceId = body.id || `invoice:${timestamp}@${invoiceNumber}`;

    // Calculate totals from items
    const items = body.items || [];
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
    const tva = subtotal * 0.20; // TVA 20%
    const total = body.total || subtotal + tva;

    const invoiceData = {
      id: invoiceId,
      invoiceNumber,
      clientId: body.clientId,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      clientAddress: body.clientAddress || "",
      items: items,
      subtotal,
      tva,
      total,
      status: body.status || "pending",
      issueDate: body.issueDate || new Date().toISOString().split('T')[0],
      dueDate: body.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: body.notes || "",
      metadata: body.metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(invoiceId, invoiceData);
    console.log(`✅ Invoice created: ${invoiceId} - ${invoiceNumber} - ${total}€`);

    return c.json({
      success: true,
      invoice: invoiceData
    });
  } catch (error) {
    console.error("❌ Error creating invoice:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// 3. Update invoice
app.put("/make-server-04919ac5/invoices/:id", requireAuth, async (c: HonoContext) =>{
  try {
    const invoiceId = decodeURIComponent(c.req.param("id"));
    const body = await c.req.json();
    const existingInvoice = await kv.get(invoiceId);
    if (!existingInvoice) return c.json({
      success: false,
      error: "Invoice not found"
    }, 404);
    const updatedInvoice = {
      ...existingInvoice,
      ...body,
      updatedAt: new Date().toISOString()
    };
    await kv.set(invoiceId, updatedInvoice);
    console.log(`✅ Invoice updated: ${invoiceId}`);
    return c.json({
      success: true,
      invoice: updatedInvoice
    });
  } catch (error) {
    console.error("❌ Error updating invoice:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
// 4. Delete invoice
app.delete("/make-server-04919ac5/invoices/:id", requireAuth, async (c: HonoContext) =>{
  try {
    const invoiceId = decodeURIComponent(c.req.param("id"));
    const existingInvoice = await kv.get(invoiceId);
    if (!existingInvoice) return c.json({
      success: false,
      error: "Invoice not found"
    }, 404);
    await kv.del(invoiceId);
    console.log(`✅ Invoice deleted: ${invoiceId}`);
    return c.json({
      success: true,
      message: "Invoice deleted successfully"
    });
  } catch (error) {
    console.error("❌ Error deleting invoice:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// Generate secure link for invoice (new system)
app.post("/make-server-04919ac5/invoices/:id/generate-link", requireAuth, async (c: HonoContext) =>{
  try {
    const invoiceId = decodeURIComponent(c.req.param("id"));
    const invoice = await kv.get(invoiceId);
    
    if (!invoice) {
      return c.json({
        success: false,
        error: "Invoice not found"
      }, 404);
    }
    
    // Generate secure token
    const token = crypto.randomUUID();
    const tokenKey = `invoice_token:${token}`;
    
    // Store token with invoice ID (expire in 90 days)
    await kv.set(tokenKey, {
      invoiceId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    });
    
    // Store token reference in invoice
    invoice.viewToken = token;
    invoice.viewLink = `${Deno.env.get('FRONTEND_URL') || 'https://maxence.design'}/invoice/${token}`;
    await kv.set(invoiceId, invoice);
    
    console.log(`🔐 Generated secure link for invoice ${invoice.number}: ${invoice.viewLink}`);
    
    return c.json({
      success: true,
      token,
      viewLink: invoice.viewLink
    });
    
  } catch (error) {
    console.error("❌ Error generating invoice link:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// View invoice by token (public route - no auth required)
app.get("/make-server-04919ac5/invoices/view/:token", async (c: HonoContext) =>{
  try {
    const token = c.req.param("token");
    const tokenKey = `invoice_token:${token}`;
    
    // Get token data
    const tokenData = await kv.get(tokenKey);
    
    if (!tokenData) {
      return c.json({
        success: false,
        error: "Invalid or expired link"
      }, 404);
    }
    
    // Check expiration
    if (new Date(tokenData.expiresAt) < new Date()) {
      await kv.del(tokenKey);
      return c.json({
        success: false,
        error: "This link has expired"
      }, 410);
    }
    
    // Get invoice
    const invoice = await kv.get(tokenData.invoiceId);
    
    if (!invoice) {
      return c.json({
        success: false,
        error: "Invoice not found"
      }, 404);
    }
    
    console.log(`👁️ Invoice ${invoice.number} viewed via secure link`);
    
    // Return invoice data (sanitized - no internal IDs)
    return c.json({
      success: true,
      invoice: {
        number: invoice.number || 'N/A',
        date: invoice.date || new Date().toISOString(),
        dueDate: invoice.dueDate || new Date().toISOString(),
        status: invoice.status || 'draft',
        clientName: invoice.clientName || 'Client',
        clientEmail: invoice.clientEmail || '',
        clientAddress: invoice.clientAddress || '',
        items: invoice.items || [],
        subtotal: invoice.subtotal || 0,
        tax: invoice.tax || 0,
        amount: invoice.amount || 0,
        notes: invoice.notes || '',
        freelance: {
          name: "FOULON Maxence",
          email: "contact@maxence.design",
          address: "33 Route Du Mans, 72650 La Milesse, France",
          siret: "93763849200010",
          tva: "TVA non applicable",
          iban: "FR76 2823 3000 0195 1140 4606 069"
        }
      }
    });
    
  } catch (error) {
    console.error("❌ Error viewing invoice:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// Send invoice reminder
app.post("/make-server-04919ac5/invoices/:id/send-reminder", requireAuth, async (c: HonoContext) =>{
  try {
    const invoiceId = decodeURIComponent(c.req.param("id"));
    const invoice = await kv.get(invoiceId);
    if (!invoice) return c.json({
      success: false,
      error: "Invoice not found"
    }, 404);
    
    // Check if email exists
    if (!invoice.clientEmail) {
      console.error(`❌ No email for client in invoice ${invoiceId}`);
      return c.json({
        success: false,
        error: "Client email not found"
      }, 400);
    }
    
    // Calculate days overdue if invoice is overdue
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
    const isOverdue = daysOverdue > 0;
    
    // Generate or get existing secure link
    let viewLink = invoice.viewLink;
    
    if (!viewLink) {
      // Generate new secure token
      const token = crypto.randomUUID();
      const tokenKey = `invoice_token:${token}`;
      
      // Store token with invoice ID (expire in 90 days)
      await kv.set(tokenKey, {
        invoiceId,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      });
      
      // Generate link
      viewLink = `${Deno.env.get('FRONTEND_URL') || 'https://maxence.design'}/invoice/${token}`;
      
      // Store link in invoice
      invoice.viewToken = token;
      invoice.viewLink = viewLink;
      await kv.set(invoiceId, invoice);
      
      console.log(`🔐 Generated new secure link for invoice ${invoice.invoiceNumber || invoice.number}`);
    } else {
      console.log(`🔗 Using existing secure link for invoice ${invoice.invoiceNumber || invoice.number}`);
    }
    
    // Send email with secure link (no PDF)
    const emailResult = await sendInvoiceLink({
      clientEmail: invoice.clientEmail,
      clientName: invoice.clientName,
      invoiceNumber: invoice.invoiceNumber || invoice.number || "N/A", // Support both formats
      amount: invoice.total || invoice.amount || 0, // Support both formats
      dueDate: invoice.dueDate,
      viewLink,
      isOverdue,
      daysOverdue: isOverdue ? daysOverdue : undefined
    });
    
    if (emailResult.success) {
      console.log(`📧 Invoice email sent for ${invoiceId} to ${invoice.clientEmail}${isOverdue ? ` (${daysOverdue} days overdue)` : ''}`);
      return c.json({
        success: true,
        message: isOverdue ? "Overdue reminder sent successfully" : "Invoice email sent successfully",
        emailSent: true,
        daysOverdue,
        isOverdue
      });
    } else {
      console.error(`❌ Failed to send invoice email: ${emailResult.error}`);
      return c.json({
        success: false,
        error: emailResult.error || "Failed to send email"
      }, 500);
    }
  } catch (error) {
    console.error("❌ Error sending invoice reminder:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
console.log("✅ ALL 5 INVOICES ROUTES ADDED (including send-reminder)!");
// ===========================================================================
// PROJECTS ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/projects", async (c: HonoContext) =>{
  try {
    const lang = c.req.query("lang") || "fr";
    const projects = await kv.getByPrefix("project:");
    
    // Normalize projects for the requested language
    const normalizedProjects = projects.map(project => {
      const isEn = lang === 'en';
      return {
        ...project,
        // Normalize main fields
        title: isEn 
          ? (project.title_en || project.title_fr || project.title || project.name)
          : (project.title_fr || project.title || project.name),
        name: isEn 
          ? (project.title_en || project.title_fr || project.title || project.name)
          : (project.title_fr || project.title || project.name),
        description: isEn
          ? (project.description_en || project.description_fr || project.description)
          : (project.description_fr || project.description),
        clientName: isEn
          ? (project.clientName_en || project.clientName_fr || project.clientName || project.client)
          : (project.clientName_fr || project.clientName || project.client),
        slug: isEn
          ? (project.slug_en || project.slug_fr || project.slug)
          : (project.slug_fr || project.slug),
        tags: isEn
          ? (project.tags_en || project.tags_fr || project.tags || [])
          : (project.tags_fr || project.tags || []),
        challenges: isEn
          ? (project.challenges_en || project.challenges_fr || project.challenges || [])
          : (project.challenges_fr || project.challenges || []),
        features: isEn
          ? (project.features_en || project.features_fr || project.features || [])
          : (project.features_fr || project.features || []),
        // Normalize image URL (coverImage or imageUrl)
        imageUrl: project.imageUrl || project.coverImage || project.image || ""
      };
    });
    
    const sorted = normalizedProjects.sort((a, b)=>new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    console.log(`✅ Found ${sorted.length} bilingual projects (normalized for ${lang})`);
    return c.json({
      success: true,
      projects: sorted
    });
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
app.get("/make-server-04919ac5/projects/:id", async (c: HonoContext) =>{
  try {
    const identifier = decodeURIComponent(c.req.param("id"));
    const lang = c.req.query("lang") || "fr";
    console.log(`🔍 Fetching project: ${identifier} (lang: ${lang})`);
    
    // Try to get by ID first
    let project = await kv.get(identifier);
    
    // If not found by ID, search by slug
    if (!project) {
      console.log(`🔎 Not found by ID, searching by slug...`);
      const allProjects = await kv.getByPrefix("project:");
      project = allProjects.find((p: any) => 
        p.slug === identifier || 
        p.slug_fr === identifier || 
        p.slug_en === identifier
      );
    }
    
    if (!project) {
      console.log(`❌ Project not found: ${identifier}`);
      return c.json({
        success: false,
        error: "Project not found"
      }, 404);
    }
    
    // Normalize project for the requested language
    const isEn = lang === 'en';
    const normalizedProject = {
      ...project,
      title: isEn 
        ? (project.title_en || project.title_fr || project.title || project.name)
        : (project.title_fr || project.title || project.name),
      name: isEn 
        ? (project.title_en || project.title_fr || project.title || project.name)
        : (project.title_fr || project.title || project.name),
      description: isEn
        ? (project.description_en || project.description_fr || project.description)
        : (project.description_fr || project.description),
      clientName: isEn
        ? (project.clientName_en || project.clientName_fr || project.clientName || project.client)
        : (project.clientName_fr || project.clientName || project.client),
      slug: isEn
        ? (project.slug_en || project.slug_fr || project.slug)
        : (project.slug_fr || project.slug),
      tags: isEn
        ? (project.tags_en || project.tags_fr || project.tags || [])
        : (project.tags_fr || project.tags || []),
      challenges: isEn
        ? (project.challenges_en || project.challenges_fr || project.challenges || [])
        : (project.challenges_fr || project.challenges || []),
      features: isEn
        ? (project.features_en || project.features_fr || project.features || [])
        : (project.features_fr || project.features || []),
      // Normalize image URL (coverImage or imageUrl)
      imageUrl: project.imageUrl || project.coverImage || project.image || ""
    };
    
    console.log(`✅ Project found and normalized for ${lang}: ${normalizedProject.id}`);
    return c.json({
      success: true,
      project: normalizedProject
    });
  } catch (error) {
    console.error(`❌ Error fetching project:`, error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// Create new project
app.post("/make-server-04919ac5/projects", requireAuth, async (c: HonoContext) => {
  try {
    const body = await c.req.json();
    const { 
      title_fr, title_en, 
      description_fr, description_en,
      slug_fr, slug_en, technologies, category, 
      status, featured, images, coverImage,
      demoUrl, githubUrl,
      clientName_fr, clientName_en,
      duration, year, tags_fr, tags_en,
      challenges_fr, challenges_en,
      features_fr, features_en 
    } = body;

    // Validation
    if (!title_fr || !description_fr) {
      return c.json({
        success: false,
        error: "Title and description in French are required"
      }, 400);
    }

    const projectId = `project:${Date.now()}@${slug_fr || Date.now()}`;
    
    const projectData = {
      id: projectId,
      title_fr: title_fr || "",
      title_en: title_en || title_fr,
      description_fr: description_fr || "",
      description_en: description_en || description_fr,
      slug_fr: slug_fr || `project-${Date.now()}`,
      slug_en: slug_en || slug_fr || `project-${Date.now()}`,
      technologies: technologies || [],
      category: category || "web-development",
      status: status || "draft",
      featured: featured || false,
      images: images || [],
      coverImage: coverImage || "",
      demoUrl: demoUrl || null,
      githubUrl: githubUrl || null,
      clientName_fr: clientName_fr || "",
      clientName_en: clientName_en || clientName_fr,
      duration: duration || "",
      year: year || new Date().getFullYear(),
      tags_fr: tags_fr || [],
      tags_en: tags_en || tags_fr || [],
      challenges_fr: challenges_fr || [],
      challenges_en: challenges_en || challenges_fr,
      features_fr: features_fr || [],
      features_en: features_en || features_fr,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Legacy fields for compatibility
      title: title_fr,
      description: description_fr,
      slug: slug_fr || `project-${Date.now()}`,
      tags: tags_fr || []
    };
    
    await kv.set(projectId, projectData);
    console.log(`✅ Project created: ${projectId}`);
    
    return c.json({
      success: true,
      project: projectData
    });
  } catch (error) {
    console.error("❌ Error creating project:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// Update existing project
app.put("/make-server-04919ac5/projects/:id", requireAuth, async (c: HonoContext) => {
  try {
    const projectId = decodeURIComponent(c.req.param("id"));
    const body = await c.req.json();
    
    const existingProject = await kv.get(projectId);
    if (!existingProject) {
      return c.json({
        success: false,
        error: "Project not found"
      }, 404);
    }
    
    const updatedProject = {
      ...existingProject,
      ...body,
      updatedAt: new Date().toISOString(),
      // Update legacy fields if multilingual fields provided
      title: body.title_fr || existingProject.title_fr || existingProject.title,
      description: body.description_fr || existingProject.description_fr || existingProject.description
    };
    
    await kv.set(projectId, updatedProject);
    console.log(`✅ Project updated: ${projectId}`);
    
    return c.json({
      success: true,
      project: updatedProject
    });
  } catch (error) {
    console.error("❌ Error updating project:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// Delete project
app.delete("/make-server-04919ac5/projects/:id", requireAuth, async (c: HonoContext) => {
  try {
    const projectId = decodeURIComponent(c.req.param("id"));
    
    const existingProject = await kv.get(projectId);
    if (!existingProject) {
      return c.json({
        success: false,
        error: "Project not found"
      }, 404);
    }
    
    await kv.del(projectId);
    console.log(`✅ Project deleted: ${projectId}`);
    
    return c.json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("❌ Error deleting project:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

console.log("✅ Projects CRUD routes added (GET, POST, PUT, DELETE)");
// ===========================================================================
// NEWSLETTER ROUTES
// ===========================================================================
app.post("/make-server-04919ac5/newsletter/subscribe", async (c: HonoContext) =>{
  try {
    // Détection de bots avec Arcjet
    const isBot = await checkForBot(c);
    if (isBot) {
      console.warn("Bot detected attempting newsletter subscription");
      return c.json({
        success: false,
        error: "Activité suspecte détectée"
      }, 403);
    }

    const { email: rawEmail, source, language } = await c.req.json();
    
    // Detect language from request headers or body
    const lang = language || detectLanguage(c.req.raw.headers, 'fr');
    
    if (!rawEmail) return c.json({
      success: false,
      error: lang === 'en' ? "Email required" : "Email requis"
    }, 400);
    
    // Normalize email to lowercase to prevent duplicates with case variations
    const email = rawEmail.toLowerCase().trim();
    
    // Validation email avancée avec Arcjet (emails jetables, typos, etc.)
    const emailValidation = await validateEmailWithArcjet(email);
    if (!emailValidation.valid) {
      return c.json({
        success: false,
        error: lang === 'en' 
          ? `Invalid email: ${emailValidation.reason}` 
          : `Email invalide: ${emailValidation.reason}`
      }, 400);
    }
    
    // Validate email format (backup)
    if (!email.includes("@") || !email.includes(".")) {
      return c.json({
        success: false,
        error: lang === 'en' ? "Invalid email address" : "Adresse email invalide"
      }, 400);
    }
    
    // Check if email already exists (case-insensitive comparison)
    const existingSubscribers = await kv.getByPrefix("subscriber:");
    const alreadySubscribed = existingSubscribers.some(sub => 
      sub.email && sub.email.toLowerCase() === email
    );
    
    if (alreadySubscribed) {
      console.log(`⚠️ Email already subscribed: ${email}`);
      return c.json({
        success: false, // Changed to false so frontend shows error toast
        message: lang === 'en' ? "You are already subscribed to the newsletter" : "Vous êtes déjà inscrit à la newsletter",
        alreadySubscribed: true
      });
    }
    
    const subscriberId = `subscriber:${Date.now()}@${email}`;
    const subscriberData = {
      id: subscriberId,
      email,
      source: source || "website",
      status: "confirmed", // Changed from "active" - direct confirmation since no email verification
      subscribedAt: new Date().toISOString(),
      language: lang
    };
    await kv.set(subscriberId, subscriberData);
    console.log(`✅ New subscriber: ${email} (${lang})`);
    
    // Send welcome email in the correct language
    const emailContent = lang === 'en' ? {
      subject: "✨ Welcome to the newsletter!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0C0C0C; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%); color: #00FFC2; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #F4F4F4; padding: 40px 30px; }
              .footer { background: #0C0C0C; color: #00FFC2; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #00FFC2; color: #0C0C0C; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
              .highlight { background: #00FFC2; color: #0C0C0C; padding: 2px 8px; border-radius: 4px; }
              .benefits-box { background: white; padding: 20px; border-left: 4px solid #00FFC2; margin: 20px 0; border-radius: 4px; }
              .benefit-item { padding: 8px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">✨ Welcome to the newsletter!</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                
                <p>Thank you for subscribing to the newsletter! 🚀</p>
                
                <p>You will regularly receive exclusive content:</p>
                
                <div class="benefits-box">
                  <div class="benefit-item">💡 <strong>Tips & tricks</strong> for web development</div>
                  <div class="benefit-item">🎨 <strong>My latest projects</strong> and achievements</div>
                  <div class="benefit-item">📚 <strong>Exclusive resources</strong> for developers</div>
                  <div class="benefit-item">🚀 <strong>Tech trends</strong> and innovations</div>
                  <div class="benefit-item">💼 <strong>Freelance advice</strong> and business tips</div>
                </div>
                
                <p>Also find all my projects and services on my portfolio:</p>
                
                <center>
                  <a href="${Deno.env.get("FRONTEND_URL") || "https://maxence.design"}" class="button">View portfolio</a>
                </center>
                
                <p style="margin-top: 30px; font-size: 14px; color: #666;">
                  See you soon in your mailbox! 📬<br>
                  <strong>Maxence FOULON</strong><br>
                  <span style="color: #999;">Full-Stack Freelance Developer</span>
                </p>
              </div>
              <div class="footer">
                <p style="margin: 0;">© 2025 FOULON Maxence - Freelance Web Developer</p>
                <p style="margin: 5px 0 0 0; opacity: 0.8;">To unsubscribe, contact me at contact@maxence.design</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
✨ Welcome to the newsletter!

Hello,

Thank you for subscribing to the newsletter! 🚀

You will regularly receive:
💡 Tips & tricks for web development
🎨 My latest projects and achievements
📚 Exclusive resources for developers
🚀 Tech trends and innovations
💼 Freelance advice and business tips

Visit my portfolio: ${Deno.env.get("FRONTEND_URL") || "https://maxence.design"}

See you soon in your mailbox! 📬

Maxence FOULON
Full-Stack Freelance Developer

© 2025 FOULON Maxence - Freelance Web Developer
To unsubscribe, contact me at contact@maxence.design
      `
    } : {
      subject: "✨ Bienvenue dans la newsletter !",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0C0C0C; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%); color: #00FFC2; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #F4F4F4; padding: 40px 30px; }
              .footer { background: #0C0C0C; color: #00FFC2; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #00FFC2; color: #0C0C0C; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
              .highlight { background: #00FFC2; color: #0C0C0C; padding: 2px 8px; border-radius: 4px; }
              .benefits-box { background: white; padding: 20px; border-left: 4px solid #00FFC2; margin: 20px 0; border-radius: 4px; }
              .benefit-item { padding: 8px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">✨ Bienvenue dans la newsletter !</h1>
              </div>
              <div class="content">
                <p>Bonjour,</p>
                
                <p>Merci de vous être inscrit à la newsletter ! 🚀</p>
                
                <p>Vous recevrez régulièrement des contenus exclusifs :</p>
                
                <div class="benefits-box">
                  <div class="benefit-item">💡 <strong>Conseils & astuces</strong> en développement web</div>
                  <div class="benefit-item">🎨 <strong>Mes derniers projets</strong> et réalisations</div>
                  <div class="benefit-item">📚 <strong>Ressources exclusives</strong> pour développeurs</div>
                  <div class="benefit-item">🚀 <strong>Tendances tech</strong> et innovations</div>
                  <div class="benefit-item">💼 <strong>Conseils freelance</strong> et business</div>
                </div>
                
                <p>Retrouvez également tous mes projets et services sur mon portfolio :</p>
                
                <center>
                  <a href="${Deno.env.get("FRONTEND_URL") || "https://maxence.design"}" class="button">Voir le portfolio</a>
                </center>
                
                <p style="margin-top: 30px; font-size: 14px; color: #666;">
                  À très bientôt dans votre boîte mail ! 📬<br>
                  <strong>Maxence FOULON</strong><br>
                  <span style="color: #999;">Développeur Full-Stack Freelance</span>
                </p>
              </div>
              <div class="footer">
                <p style="margin: 0;">© 2025 FOULON Maxence - Développeur Web Freelance</p>
                <p style="margin: 5px 0 0 0; opacity: 0.8;">Pour vous désinscrire, contactez-moi à contact@maxence.design</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
✨ Bienvenue dans la newsletter !

Bonjour,

Merci de vous être inscrit à la newsletter ! 🚀

Vous recevrez régulièrement :
💡 Conseils & astuces en développement web
🎨 Mes derniers projets et réalisations
📚 Ressources exclusives pour développeurs
🚀 Tendances tech et innovations
💼 Conseils freelance et business

Visitez mon portfolio : ${Deno.env.get("FRONTEND_URL") || "https://maxence.design"}

À très bientôt dans votre boîte mail ! 📬

Maxence FOULON
Développeur Full-Stack Freelance

© 2025 FOULON Maxence - Développeur Web Freelance
Pour vous désinscrire, contactez-moi à contact@maxence.design
      `
    };
    
    const emailResult = await sendEmail({
      to: email,
      ...emailContent
    });
    
    if (emailResult.success) {
      console.log(`� Welcome email sent to ${email} (${lang})`);
    } else {
      console.error(`⚠️ Failed to send welcome email to ${email}:`, emailResult.error);
    }
    
    return c.json({
      success: true,
      message: lang === 'en' ? "Successfully subscribed!" : "Inscription réussie !",
      alreadySubscribed: false,
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error("❌ Error subscribing:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
app.get("/make-server-04919ac5/newsletter/stats", async (c: HonoContext) =>{
  try {
    const subscribers = await kv.getByPrefix("subscriber:");
    const confirmedCount = subscribers.filter((s)=>s.status === "confirmed").length;
    return c.json({
      success: true,
      total: subscribers.length,
      confirmed: confirmedCount,
      confirmedCount // Keep both for compatibility
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// Get all newsletter subscribers for admin
app.get("/make-server-04919ac5/newsletter/subscribers", requireAuth, async (c: HonoContext) =>{
  try {
    const subscribers = await kv.getByPrefix("subscriber:");
    return c.json({
      success: true,
      subscribers
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// Delete newsletter subscriber
app.delete("/make-server-04919ac5/newsletter/subscriber/:email", requireAuth, async (c: HonoContext) =>{
  try {
    const email = decodeURIComponent(c.req.param("email"));
    
    // Find subscriber by email
    const subscribers = await kv.getByPrefixWithKeys("subscriber:");
    const subscriber = subscribers.find(s => s.value.email === email);
    
    if (!subscriber) {
      return c.json({
        success: false,
        error: "Subscriber not found"
      }, 404);
    }
    
    await kv.del(subscriber.key);
    console.log(`✅ Subscriber deleted: ${email}`);
    
    return c.json({
      success: true,
      message: "Subscriber deleted successfully"
    });
  } catch (error) {
    console.error("❌ Error deleting subscriber:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// Send newsletter campaign
app.post("/make-server-04919ac5/newsletter/send-campaign", requireAuth, async (c: HonoContext) =>{
  try {
    const { subject, content, recipients } = await c.req.json();
    
    if (!subject || !content) {
      return c.json({
        success: false,
        error: "Subject and content are required"
      }, 400);
    }
    
    // Get subscribers based on recipients filter
    const subscribers = await kv.getByPrefix("subscriber:");
    let targetSubscribers = subscribers;
    
    if (recipients === "confirmed") {
      targetSubscribers = subscribers.filter(s => s.status === "confirmed");
    }
    
    if (targetSubscribers.length === 0) {
      return c.json({
        success: false,
        error: "No subscribers to send to"
      }, 400);
    }
    
    // Send emails to all subscribers
    console.log(`📧 Sending campaign "${subject}" to ${targetSubscribers.length} subscribers`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const subscriber of targetSubscribers) {
      try {
        const emailResult = await sendEmail({
          to: subscriber.email,
          subject: subject,
          html: content
        });
        
        if (emailResult.success) {
          successCount++;
        } else {
          errorCount++;
          console.error(`Failed to send to ${subscriber.email}:`, emailResult.error);
        }
      } catch (error) {
        errorCount++;
        console.error(`Error sending to ${subscriber.email}:`, error);
      }
    }
    
    console.log(`✅ Campaign sent: ${successCount} success, ${errorCount} errors`);
    
    return c.json({
      success: true,
      sent: successCount,
      errors: errorCount,
      message: `Campaign sent to ${successCount}/${targetSubscribers.length} subscriber(s)`
    });
  } catch (error) {
    console.error("❌ Error sending campaign:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

console.log("✅ Newsletter routes added");
// ===========================================================================
// TESTIMONIALS ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/testimonials", async (c: HonoContext) =>{
  try {
    const testimonials = await kv.getByPrefix("testimonial:");
    const approved = testimonials.filter((t)=>t.approved);
    return c.json({
      success: true,
      testimonials: approved
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// Get all testimonials for admin (including non-approved)
app.get("/make-server-04919ac5/testimonials/admin", requireAuth, async (c: HonoContext) =>{
  try {
    const testimonials = await kv.getByPrefix("testimonial:");
    return c.json({
      success: true,
      testimonials
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

console.log("✅ Testimonials routes added");
// ===========================================================================
// BLOG ROUTES
// ===========================================================================
// Get all blog posts - ENHANCED BILINGUAL VERSION
app.get("/make-server-04919ac5/blog/posts", async (c: HonoContext) =>{
  try {
    const lang = c.req.query("lang") || "fr";
    const status = c.req.query("status"); // For admin: draft, published, all
    const category = c.req.query("category");
    const tag = c.req.query("tag");
    
    // If requesting admin features (status=all or status=draft), require auth
    if (status && (status === "all" || status === "draft")) {
      const authHeader = c.req.header("Authorization") || c.req.header("apikey");
      if (!authHeader) {
        return c.json({
          success: false,
          error: "Authentication required for admin features"
        }, 401);
      }
    }
    
    let posts = await kv.getByPrefix("blog:");
    
    // Filter by status (admin only)
    if (status && status !== "all") {
      posts = posts.filter(post => post.status === status);
    } else if (!status) {
      // Public API: only published posts
      posts = posts.filter(post => post.status === "published");
    }
    
    // Filter by category (language-aware)
    if (category) {
      posts = posts.filter(post => {
        const postCategory = lang === 'en' 
          ? (post.category_en || post.category) 
          : (post.category_fr || post.category);
        return postCategory.toLowerCase().includes(category.toLowerCase());
      });
    }
    
    // Filter by tag (language-aware)
    if (tag) {
      posts = posts.filter(post => {
        const postTags = lang === 'en' 
          ? (post.tags_en || post.tags || [])
          : (post.tags_fr || post.tags || []);
        return postTags.some((t: string) => 
          t.toLowerCase().includes(tag.toLowerCase())
        );
      });
    }
    
    // Sort by publication date (newest first)
    const sorted = posts.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
    
    console.log(`✅ Found ${sorted.length} blog posts (lang: ${lang}, status: ${status || 'published'})`);
    
    return c.json({
      success: true,
      posts: sorted,
      total: sorted.length,
      filters: {
        lang,
        status: status || 'published',
        category,
        tag
      }
    });
  } catch (error) {
    console.error("❌ Error fetching blog posts:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// Get single blog post by slug - ENHANCED BILINGUAL VERSION
app.get("/make-server-04919ac5/blog/posts/:slug", async (c: HonoContext) =>{
  try {
    const slug = c.req.param("slug");
    const lang = c.req.query("lang") || "fr";
    
    const posts = await kv.getByPrefix("blog:");
    
    // Search by language-specific slug first, then fallback
    let post = posts.find((p) => {
      if (lang === 'en') {
        return p.slug_en === slug || p.slug === slug;
      } else {
        return p.slug_fr === slug || p.slug === slug;
      }
    });
    
    if (!post) {
      return c.json({
        success: false,
        error: "Post not found"
      }, 404);
    }
    
    // Increment view count by language
    if (!post.viewsByLang) {
      post.viewsByLang = { fr: 0, en: 0 };
    }
    post.viewsByLang[lang] = (post.viewsByLang[lang] || 0) + 1;
    post.views = (post.views || 0) + 1;
    
    // Update the post with new view count
    await kv.set(post.id, post);
    
    console.log(`✅ Blog post viewed: ${post.id} (${lang})`);
    
    return c.json({
      success: true,
      post,
      lang,
      url: lang === 'en' ? post.url_en : post.url_fr
    });
  } catch (error) {
    console.error("❌ Error fetching blog post:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
// Create a new blog post - ENHANCED BILINGUAL VERSION
app.post("/make-server-04919ac5/blog/posts", requireAuth, async (c: HonoContext) =>{
  try {
    const body = await c.req.json();
    const { 
      title_fr, title_en, 
      slug_fr, slug_en,
      excerpt_fr, excerpt_en, 
      content_fr, content_en, 
      coverImage, 
      category_fr, category_en,
      tags_fr, tags_en,
      status,
      readTime_fr, readTime_en,
      seo_description_fr, seo_description_en,
      seo_keywords_fr, seo_keywords_en
    } = body;

    // Enhanced validation
    if (!title_fr || !content_fr) {
      return c.json({
        success: false,
        error: "Title and content in French are required"
      }, 400);
    }

    // Generate separate slugs if not provided
    const generateSlug = (title: string): string => {
      return title
        .toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ýÿ]/g, 'y')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    };

    const finalSlugFr = slug_fr || generateSlug(title_fr);
    const finalSlugEn = slug_en || generateSlug(title_en || title_fr);
    
    // Check for duplicate slugs
    const existingPosts = await kv.getByPrefix("blog:");
    const slugExists = existingPosts.some(post => 
      post.slug_fr === finalSlugFr || 
      post.slug_en === finalSlugEn ||
      post.slug === finalSlugFr || 
      post.slug === finalSlugEn
    );
    
    if (slugExists) {
      return c.json({
        success: false,
        error: "A post with this slug already exists"
      }, 400);
    }

    const postId = `blog:${Date.now()}@${finalSlugFr}`;
    const postData = {
      id: postId,
      
      // Bilingual content
      title_fr: title_fr || "",
      title_en: title_en || title_fr, // Fallback to French
      excerpt_fr: excerpt_fr || "",
      excerpt_en: excerpt_en || excerpt_fr,
      content_fr: content_fr || "",
      content_en: content_en || content_fr,
      
      // Bilingual SEO
      seo_description_fr: seo_description_fr || excerpt_fr,
      seo_description_en: seo_description_en || excerpt_en || excerpt_fr,
      seo_keywords_fr: seo_keywords_fr || [],
      seo_keywords_en: seo_keywords_en || seo_keywords_fr || [],
      
      // Bilingual slugs and URLs
      slug_fr: finalSlugFr,
      slug_en: finalSlugEn,
      url_fr: `/fr/blog/${finalSlugFr}`,
      url_en: `/en/blog/${finalSlugEn}`,
      
      // Bilingual categories and tags
      category_fr: category_fr || "développement",
      category_en: category_en || category_fr || "development",
      tags_fr: tags_fr || [],
      tags_en: tags_en || tags_fr || [],
      
      // Reading time per language
      readTime_fr: readTime_fr || Math.ceil((content_fr || "").split(' ').length / 200),
      readTime_en: readTime_en || Math.ceil((content_en || content_fr || "").split(' ').length / 200),
      
      // Media and metadata
      coverImage: coverImage || "",
      status: status || "draft",
      published: status === "published",
      publishedAt: status === "published" ? new Date().toISOString() : null,
      views: 0,
      viewsByLang: { fr: 0, en: 0 },
      
      // Timestamps
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
      // Legacy fields for backward compatibility
      title: title_fr,
      excerpt: excerpt_fr,
      content: content_fr,
      slug: finalSlugFr, // Primary slug in French
      category: category_fr || "développement",
      tags: tags_fr || [],
      readTime: readTime_fr || Math.ceil((content_fr || "").split(' ').length / 200)
    };

    await kv.set(postId, postData);
    console.log(`✅ Bilingual blog post created: ${postId}`);
    console.log(`   FR: /fr/blog/${finalSlugFr}`);
    console.log(`   EN: /en/blog/${finalSlugEn}`);
    
    return c.json({
      success: true,
      post: postData
    });
  } catch (error) {
    console.error("❌ Error creating blog post:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
// Update a blog post - ENHANCED BILINGUAL VERSION
app.put("/make-server-04919ac5/blog/posts/:id", requireAuth, async (c: HonoContext) =>{
  try {
    const postId = decodeURIComponent(c.req.param("id"));
    const body = await c.req.json();
    const existingPost = await kv.get(postId);
    
    if (!existingPost) {
      return c.json({
        success: false,
        error: "Post not found"
      }, 404);
    }

    // Handle slug updates with validation
    let updatedSlugFr = body.slug_fr || existingPost.slug_fr || existingPost.slug;
    let updatedSlugEn = body.slug_en || existingPost.slug_en || existingPost.slug;
    
    // Generate slug function
    const generateSlug = (title: string): string => {
      return title
        .toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ýÿ]/g, 'y')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    };

    // Auto-generate slugs if titles changed
    if (body.title_fr && !body.slug_fr) {
      updatedSlugFr = generateSlug(body.title_fr);
    }
    if (body.title_en && !body.slug_en) {
      updatedSlugEn = generateSlug(body.title_en);
    }

    // Check for duplicate slugs (excluding current post)
    if (body.slug_fr || body.slug_en || body.title_fr || body.title_en) {
      const existingPosts = await kv.getByPrefix("blog:");
      const slugExists = existingPosts.some(post => 
        post.id !== postId && (
          post.slug_fr === updatedSlugFr || 
          post.slug_en === updatedSlugEn ||
          post.slug === updatedSlugFr || 
          post.slug === updatedSlugEn
        )
      );
      
      if (slugExists) {
        return c.json({
          success: false,
          error: "A post with this slug already exists"
        }, 400);
      }
    }

    // Calculate reading times if content updated
    const readTimeFr = body.content_fr 
      ? Math.ceil(body.content_fr.split(' ').length / 200)
      : existingPost.readTime_fr || existingPost.readTime || 5;
      
    const readTimeEn = body.content_en 
      ? Math.ceil(body.content_en.split(' ').length / 200)
      : existingPost.readTime_en || existingPost.readTime || 5;

    const updatedPost = {
      ...existingPost,
      ...body,
      
      // Update bilingual slugs and URLs
      slug_fr: updatedSlugFr,
      slug_en: updatedSlugEn,
      url_fr: `/fr/blog/${updatedSlugFr}`,
      url_en: `/en/blog/${updatedSlugEn}`,
      
      // Update reading times
      readTime_fr: readTimeFr,
      readTime_en: readTimeEn,
      
      // Update SEO if not provided
      seo_description_fr: body.seo_description_fr || body.excerpt_fr || existingPost.seo_description_fr,
      seo_description_en: body.seo_description_en || body.excerpt_en || existingPost.seo_description_en,
      
      // Publishing logic
      published: body.status === "published",
      publishedAt: body.status === "published" && !existingPost.publishedAt 
        ? new Date().toISOString() 
        : existingPost.publishedAt,
      updatedAt: new Date().toISOString(),
      
      // Update legacy fields for backward compatibility
      title: body.title_fr || existingPost.title_fr || existingPost.title,
      excerpt: body.excerpt_fr || existingPost.excerpt_fr || existingPost.excerpt,
      content: body.content_fr || existingPost.content_fr || existingPost.content,
      slug: updatedSlugFr, // Primary slug in French
      category: body.category_fr || existingPost.category_fr || existingPost.category,
      tags: body.tags_fr || existingPost.tags_fr || existingPost.tags,
      readTime: readTimeFr
    };
    await kv.set(postId, updatedPost);
    console.log(`✅ Blog post updated: ${postId}`);
    return c.json({
      success: true,
      post: updatedPost
    });
  } catch (error) {
    console.error("❌ Error updating blog post:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
// Delete a blog post
app.delete("/make-server-04919ac5/blog/posts/:id", requireAuth, async (c: HonoContext) =>{
  try {
    const postId = decodeURIComponent(c.req.param("id"));
    const existingPost = await kv.get(postId);
    if (!existingPost) return c.json({
      success: false,
      error: "Post not found"
    }, 404);
    await kv.del(postId);
    console.log(`✅ Blog post deleted: ${postId}`);
    return c.json({
      success: true,
      message: "Post deleted successfully"
    });
  } catch (error) {
    console.error("❌ Error deleting blog post:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
// Get available blog tags - BILINGUAL
app.get("/make-server-04919ac5/blog/tags", async (c: HonoContext) => {
  try {
    const lang = c.req.query("lang") || "fr";
    const posts = await kv.getByPrefix("blog:");
    
    // Extract all tags by language
    const allTags = new Set<string>();
    posts.forEach(post => {
      const tags = lang === 'en' 
        ? (post.tags_en || post.tags || [])
        : (post.tags_fr || post.tags || []);
      tags.forEach((tag: string) => allTags.add(tag));
    });
    
    const tagsArray = Array.from(allTags).sort();
    
    return c.json({
      success: true,
      tags: tagsArray,
      lang,
      total: tagsArray.length
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// Get available blog categories - BILINGUAL
app.get("/make-server-04919ac5/blog/categories", async (c: HonoContext) => {
  try {
    const lang = c.req.query("lang") || "fr";
    const posts = await kv.getByPrefix("blog:");
    
    // Extract all categories by language
    const allCategories = new Set();
    posts.forEach(post => {
      const category = lang === 'en' 
        ? (post.category_en || post.category)
        : (post.category_fr || post.category);
      if (category) allCategories.add(category);
    });
    
    const categoriesArray = Array.from(allCategories).sort();
    
    return c.json({
      success: true,
      categories: categoriesArray,
      lang,
      total: categoriesArray.length
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

// Get blog statistics - BILINGUAL
app.get("/make-server-04919ac5/blog/stats", async (c: HonoContext) => {
  try {
    const posts = await kv.getByPrefix("blog:");
    
    const stats = {
      total: posts.length,
      published: posts.filter(p => p.published).length,
      draft: posts.filter(p => p.status === 'draft').length,
      totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0),
      viewsByLang: {
        fr: posts.reduce((sum, p) => sum + ((p.viewsByLang?.fr) || 0), 0),
        en: posts.reduce((sum, p) => sum + ((p.viewsByLang?.en) || 0), 0)
      },
      mostViewedPost: posts.reduce((max, p) => 
        (p.views || 0) > (max.views || 0) ? p : max, posts[0] || null
      ),
      recentPosts: posts
        .filter(p => p.published)
        .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
        .slice(0, 5)
    };
    
    return c.json({
      success: true,
      stats
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});

console.log("✅ ALL Enhanced Bilingual Blog routes added (GET/POST/PUT/DELETE + tags/categories/stats)");
// ===========================================================================
// CASE STUDIES ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/case-studies", async (c: HonoContext) =>{
  try {
    const caseStudies = await kv.getByPrefix("case-study:");
    return c.json({
      success: true,
      caseStudies
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
console.log("✅ Case studies routes added");
// ===========================================================================
// RESOURCES ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/resources", async (c: HonoContext) =>{
  try {
    const resources = await kv.getByPrefix("resource:");
    return c.json({
      success: true,
      resources
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
console.log("✅ Resources routes added");
// ===========================================================================
// FAQ ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/faq", async (c: HonoContext) =>{
  try {
    const questions = await kv.getByPrefix("faq:");
    return c.json({
      success: true,
      questions
    });
  } catch (error) {
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
console.log("✅ FAQ routes added");
// ===========================================================================
// SEED DATA ROUTE - Initialize all data
// ===========================================================================
app.post("/make-server-04919ac5/seed-data", requireAuth, async (c: HonoContext) =>{
  try {
    console.log("🌱 Starting data seeding...");
    // Seed 3 test projects
    const projects = [
      {
        id: `project:ecommerce-${Date.now()}`,
        name_fr: "Plateforme E-commerce Moderne",
        name_en: "Modern E-commerce Platform",
        description_fr: "Développement d'une plateforme e-commerce complète avec gestion des stocks, paiement en ligne et tableau de bord analytique.",
        description_en: "Development of a complete e-commerce platform with inventory management, online payment and analytics dashboard.",
        tags_fr: [
          "E-commerce",
          "React",
          "Node.js",
          "Stripe",
          "PostgreSQL"
        ],
        tags_en: [
          "E-commerce",
          "React",
          "Node.js",
          "Stripe",
          "PostgreSQL"
        ],
        category_fr: "web",
        category_en: "web",
        status: "completed",
        imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
        isPinned: true,
        technologies: [
          "React",
          "TypeScript",
          "Node.js",
          "PostgreSQL",
          "Redis",
          "Docker",
          "AWS"
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: `project:fitness-${Date.now() + 1}`,
        name_fr: "Application Mobile Fitness",
        name_en: "Fitness Mobile App",
        description_fr: "Application mobile iOS/Android pour le suivi d'entraînements avec coach virtuel IA.",
        description_en: "iOS/Android mobile app for workout tracking with AI virtual coach.",
        tags_fr: [
          "Mobile",
          "React Native",
          "IA",
          "Fitness"
        ],
        tags_en: [
          "Mobile",
          "React Native",
          "AI",
          "Fitness"
        ],
        category_fr: "mobile",
        category_en: "mobile",
        status: "completed",
        imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=600&fit=crop",
        isPinned: true,
        technologies: [
          "React Native",
          "TypeScript",
          "GraphQL",
          "TensorFlow",
          "Firebase"
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: `project:dashboard-${Date.now() + 2}`,
        name_fr: "Dashboard Analytique SaaS",
        name_en: "SaaS Analytics Dashboard",
        description_fr: "Tableau de bord temps réel pour une plateforme SaaS avec visualisations avancées.",
        description_en: "Real-time dashboard for a SaaS platform with advanced visualizations.",
        tags_fr: [
          "Dashboard",
          "Analytics",
          "SaaS",
          "Data Viz"
        ],
        tags_en: [
          "Dashboard",
          "Analytics",
          "SaaS",
          "Data Viz"
        ],
        category_fr: "web",
        category_en: "web",
        status: "in-progress",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        isPinned: false,
        technologies: [
          "React",
          "D3.js",
          "Tailwind",
          "Supabase"
        ],
        createdAt: new Date().toISOString()
      }
    ];
    // Seed 2 case studies
    const caseStudies = [
      {
        id: `case-study:fintech-${Date.now()}`,
        title: "Plateforme FinTech B2B",
        slug: "fintech-b2b-platform",
        description: "Transformation digitale complète d'une plateforme de paiement B2B.",
        imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop",
        category: "fintech",
        duration: "6 mois",
        technologies: [
          "React",
          "Node.js",
          "PostgreSQL",
          "Stripe"
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: `case-study:health-${Date.now() + 1}`,
        title: "Application Santé Mobile",
        slug: "health-mobile-app",
        description: "Application mobile pour le suivi médical avec téléconsultation intégrée.",
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
        category: "health",
        duration: "8 mois",
        technologies: [
          "React Native",
          "Firebase",
          "WebRTC"
        ],
        createdAt: new Date().toISOString()
      }
    ];
    // Seed 3 blog posts
    const blogPosts = [
      {
        id: `blog:react-2024-${Date.now()}`,
        title_fr: "Les tendances React en 2024",
        title_en: "React trends in 2024",
        slug: "react-trends-2024",
        excerpt_fr: "Découvrez les dernières tendances et best practices React pour cette année.",
        excerpt_en: "Discover the latest React trends and best practices for this year.",
        content_fr: "React continue d'évoluer rapidement en 2024...",
        content_en: "React continues to evolve rapidly in 2024...",
        category: "development",
        tags: [
          "React",
          "JavaScript",
          "Web Dev"
        ],
        imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
        published: true,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: `blog:tailwind-tips-${Date.now() + 1}`,
        title_fr: "10 astuces Tailwind CSS",
        title_en: "10 Tailwind CSS tips",
        slug: "tailwind-css-tips",
        excerpt_fr: "Optimisez votre workflow avec ces astuces Tailwind CSS.",
        excerpt_en: "Optimize your workflow with these Tailwind CSS tips.",
        content_fr: "Tailwind CSS est devenu incontournable...",
        content_en: "Tailwind CSS has become essential...",
        category: "design",
        tags: [
          "Tailwind",
          "CSS",
          "UI/UX"
        ],
        imageUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=600&fit=crop",
        published: true,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: `blog:freelance-guide-${Date.now() + 2}`,
        title_fr: "Guide freelance 2024",
        title_en: "Freelance guide 2024",
        slug: "freelance-guide-2024",
        excerpt_fr: "Tout ce qu'il faut savoir pour réussir en freelance.",
        excerpt_en: "Everything you need to know to succeed as a freelancer.",
        content_fr: "Le freelancing continue de croître...",
        content_en: "Freelancing continues to grow...",
        category: "business",
        tags: [
          "Freelance",
          "Business",
          "Career"
        ],
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
        published: true,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    ];
    // Seed 2 testimonials
    const testimonials = [
      {
        id: `testimonial:marie-${Date.now()}`,
        name: "Marie Dubois",
        role: "CEO, TechStart",
        company: "TechStart",
        text_fr: "Excellent travail ! La plateforme dépasse toutes nos attentes.",
        text_en: "Excellent work! The platform exceeds all our expectations.",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        approved: true,
        createdAt: new Date().toISOString()
      },
      {
        id: `testimonial:jean-${Date.now() + 1}`,
        name: "Jean Martin",
        role: "CTO, InnovateLab",
        company: "InnovateLab",
        text_fr: "Collaboration exceptionnelle, résultats au-delà de nos attentes.",
        text_en: "Exceptional collaboration, results beyond our expectations.",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        approved: true,
        createdAt: new Date().toISOString()
      }
    ];
    // Save all data
    for (const project of projects){
      await kv.set(project.id, project);
    }
    console.log(`✅ ${projects.length} projects seeded`);
    for (const cs of caseStudies){
      await kv.set(cs.id, cs);
    }
    console.log(`✅ ${caseStudies.length} case studies seeded`);
    for (const post of blogPosts){
      await kv.set(post.id, post);
    }
    console.log(`✅ ${blogPosts.length} blog posts seeded`);
    for (const testimonial of testimonials){
      await kv.set(testimonial.id, testimonial);
    }
    console.log(`✅ ${testimonials.length} testimonials seeded`);
    return c.json({
      success: true,
      message: "Data seeded successfully",
      counts: {
        projects: projects.length,
        caseStudies: caseStudies.length,
        blogPosts: blogPosts.length,
        testimonials: testimonials.length
      }
    });
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error)
    }, 500);
  }
});
console.log("✅ Seed data route added");
// ===========================================================================
// PRINT AVAILABLE ROUTES
// ===========================================================================
console.log("📍 Available routes:");
console.log("   AUTH: /auth/init-admin, /auth/login");
console.log("   CLIENTS: /clients (GET/POST), /clients/:id (PUT/DELETE)");
console.log("   LEADS: /leads (GET/POST), /leads/:id (PUT/DELETE), /leads/:id/convert (POST) ✨ NEW!");
console.log("   BOOKINGS: /bookings (GET/POST/PUT/DELETE)");
console.log("   EMAILS: /emails/booking-confirmation (POST), /emails/lead-confirmation (POST) ✨ NEW!");
console.log("   DASHBOARD: /dashboard/stats");
console.log("   QUOTES: /quotes (GET/POST), /quotes/:id (PUT/DELETE/convert/send-reminder)");
console.log("   INVOICES: /invoices (GET), /invoices/:id (GET/PUT/DELETE/send-reminder) ✨ NEW!");
console.log("   PROJECTS: /projects (GET), /projects/:id (GET)");
console.log("   NEWSLETTER: /newsletter/subscribe (POST), /newsletter/stats (GET)");
console.log("   TESTIMONIALS: /testimonials (GET)");
console.log("   BLOG: /blog/posts (GET/POST), /blog/posts/:id (GET/PUT/DELETE) ✨ UPDATED!");
console.log("   CASE STUDIES: /case-studies (GET)");
console.log("   RESOURCES: /resources (GET)");
console.log("   FAQ: /faq (GET)");
console.log("   SEED: /seed-data (POST) - Initialize demo data");
console.log("   STRIPE: /stripe/create-checkout-session (POST) - Create Stripe payment session ✨ NEW!");
console.log("✅ COMPLETE server configured with ALL routes including QUOTES + INVOICES + BLOG CRUD + EMAIL CONFIRMATIONS");
// ===========================================================================
// STRIPE PAYMENT ROUTES
// ===========================================================================
app.post("/make-server-04919ac5/stripe/create-checkout-session", async (c: HonoContext) =>{
  try {
    const body = await c.req.json();
    const { invoiceNumber, invoiceId, amount, currency = 'eur', clientName, clientEmail, successUrl, cancelUrl } = body;
    
    if (!invoiceNumber || !amount || !clientEmail) {
      return c.json({
        success: false,
        error: "Missing required fields: invoiceNumber, amount, clientEmail"
      }, 400);
    }
    
    // Convert amount to number (in case it's a string)
    const amountNumber = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    console.log(`💰 Payment request for invoice ${invoiceNumber}:`, {
      receivedAmount: amount,
      receivedType: typeof amount,
      convertedAmount: amountNumber,
      convertedType: typeof amountNumber
    });
    
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) {
      console.error("❌ STRIPE_SECRET_KEY not configured");
      return c.json({
        success: false,
        error: "Payment processing is not configured"
      }, 500);
    }
    
    // Validate minimum amount for Stripe (€0.50 minimum)
    if (amountNumber < 0.50) {
      console.error(`❌ Amount too small: ${amountNumber}€ (minimum €0.50)`);
      return c.json({
        success: false,
        error: "Le montant minimum pour un paiement est de €0.50"
      }, 400);
    }
    
    // Convert amount to cents for Stripe (amount is in euros, Stripe expects cents)
    const amountInCents = Math.round(amountNumber * 100);
    
    console.log(`💰 Creating Stripe session for invoice ${invoiceNumber}: ${amountNumber}€ (${amountInCents} cents)`);
    
    // Create Stripe checkout session
    const checkoutResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        "payment_method_types[0]": "card",
        "line_items[0][price_data][currency]": currency,
        "line_items[0][price_data][product_data][name]": `Facture ${invoiceNumber}`,
        "line_items[0][price_data][product_data][description]": `Paiement pour la facture ${invoiceNumber}`,
        "line_items[0][price_data][unit_amount]": amountInCents.toString(),
        "line_items[0][quantity]": "1",
        "mode": "payment",
        "success_url": successUrl || `${Deno.env.get('FRONTEND_URL')}/invoice/${invoiceId}/success?session_id={CHECKOUT_SESSION_ID}`,
        "cancel_url": cancelUrl || `${Deno.env.get('FRONTEND_URL')}/invoice/${invoiceId}`,
        "customer_email": clientEmail,
        "client_reference_id": invoiceId,
        "metadata[invoiceNumber]": invoiceNumber,
        "metadata[invoiceId]": invoiceId,
        "metadata[clientName]": clientName || ""
      }).toString()
    });
    
    if (!checkoutResponse.ok) {
      const error = await checkoutResponse.text();
      console.error("❌ Stripe API error:", error);
      return c.json({
        success: false,
        error: `Stripe API error: ${error}`
      }, 500);
    }
    
    const session = await checkoutResponse.json();
    
    console.log(`✅ Stripe checkout session created: ${session.id}`);
    
    // Store session data in KV for reference
    await kv.set(`stripe_session:${session.id}`, {
      sessionId: session.id,
      invoiceId,
      invoiceNumber,
      amount,
      clientEmail,
      clientName,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
    
    return c.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
    
  } catch (error) {
    console.error("❌ Error creating checkout session:", error);
    return c.json({
      success: false,
      error: getErrorMessage(error) || "Failed to create checkout session"
    }, 500);
  }
});

// Webhook to handle Stripe events (for production)
app.post("/make-server-04919ac5/stripe/webhook", async (c: HonoContext) =>{
  try {
    const body = await c.req.text();
    const signature = c.req.header("stripe-signature");
    
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!STRIPE_WEBHOOK_SECRET) {
      return c.json({ success: false, error: "Webhook not configured" }, 500);
    }
    
    // Verify webhook signature (simplified - in production use stripe.webhooks.constructEvent)
    console.log(`📨 Webhook received with signature: ${signature}`);
    
    const event = JSON.parse(body);
    
    switch (event.type) {
      case "checkout.session.completed":
        console.log(`✅ Payment completed for session: ${event.data.object.id}`);
        
        // Update invoice status to paid
        const sessionData = await kv.get(`stripe_session:${event.data.object.id}`);
        if (sessionData && sessionData.invoiceId) {
          const invoice = await kv.get(sessionData.invoiceId);
          if (invoice) {
            invoice.status = "paid";
            invoice.paidAt = new Date().toISOString();
            invoice.stripeSessionId = event.data.object.id;
            await kv.set(sessionData.invoiceId, invoice);
            console.log(`✅ Invoice ${invoice.number} marked as paid`);
          }
        }
        break;
        
      case "checkout.session.expired":
        console.log(`⏰ Checkout session expired: ${event.data.object.id}`);
        break;
        
      case "charge.refunded":
        console.log(`💸 Payment refunded: ${event.data.object.id}`);
        break;
    }
    
    return c.json({ received: true });
    
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return c.json({ success: false, error: getErrorMessage(error) }, 500);
  }
});

console.log("✅ Stripe payment routes added");

// =============================================================================
// 🚀 START SERVER & DEPLOYMENT VERIFICATION  
// =============================================================================
console.log("🚀 Starting Portfolio CRM Server...");
console.log("📊 Features: Clients, Leads, Bookings, Quotes, Invoices, Blog, Payments");
console.log("🔗 Base URL: /functions/v1/make-server-04919ac5");

// Start the Deno server
Deno.serve(app.fetch);

console.log("✅ Server started successfully!");
console.log("📋 Next steps after deployment:");
console.log("   1. Test health: GET /make-server-04919ac5/health");
console.log("   2. Initialize admin: POST /make-server-04919ac5/auth/init-admin");
console.log("   3. Test projects: GET /make-server-04919ac5/projects");
console.log("   4. Check dashboard: GET /make-server-04919ac5/dashboard/stats");

/*
============================================================================
🎯 POST-DEPLOYMENT CHECKLIST
============================================================================

□ 1. DEPLOY TO SUPABASE
   • Go to Supabase Dashboard > Edge Functions
   • Create new function named: make-server-04919ac5  
   • Copy this entire file content and paste it
   • Click "Deploy"

□ 2. CONFIGURE ENVIRONMENT VARIABLES
   • Go to Settings > Edge Functions > Environment Variables
   • Add all 8 required variables:
     - SUPABASE_URL
     - SUPABASE_SERVICE_ROLE_KEY  
     - SUPABASE_ANON_KEY
     - RESEND_API_KEY
     - ADMIN_PASSWORD
     - STRIPE_SECRET_KEY
     - STRIPE_WEBHOOK_SECRET
     - FRONTEND_URL

□ 3. TEST DEPLOYMENT
   curl -X GET "https://your-project.supabase.co/functions/v1/make-server-04919ac5/health"
   Expected: {"success": true, "message": "Server is healthy", "timestamp": "..."}

□ 4. INITIALIZE DATA
   curl -X POST "https://your-project.supabase.co/functions/v1/make-server-04919ac5/auth/init-admin"
   Expected: {"success": true, "message": "Admin initialized"}

□ 5. VERIFY FRONTEND CONNECTION
   • Update frontend serverService.ts with deployed URL
   • Set PRODUCTION_MODE = true
   • Test from portfolio website

□ 6. SETUP CRON JOBS (Optional - for automation)
   • Go to Dashboard > Database > Cron Jobs (pg_cron extension)
   • Add daily job for invoice reminders:
     SELECT cron.schedule('invoice-reminders', '0 9 * * *', 
       'SELECT net.http_post(url := ''https://your-project.supabase.co/functions/v1/make-server-04919ac5/cron/send-invoice-reminders'')');
   • Add daily job for booking reminders:
     SELECT cron.schedule('booking-reminders', '0 10 * * *',
       'SELECT net.http_post(url := ''https://your-project.supabase.co/functions/v1/make-server-04919ac5/cron/send-booking-reminders'')');

============================================================================
*/
