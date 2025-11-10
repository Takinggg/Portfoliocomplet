// ============================================================================
// CONSOLIDATED EDGE FUNCTION - ALL CODE IN ONE FILE
// This version eliminates relative imports for successful Supabase deployment
// ============================================================================

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// ===========================================================================
// SUPABASE CLIENT
// ===========================================================================
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

console.log("🚀 Starting CONSOLIDATED server with ALL routes...");

// ===========================================================================
// KV STORE - Integrated directly (no relative import)
// ===========================================================================
const kvClient = () => createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
);

const kv = {
  set: async (key: string, value: any): Promise<void> => {
    const supabaseKv = kvClient();
    const { error } = await supabaseKv.from("kv_store_04919ac5").upsert({
      key,
      value
    });
    if (error) {
      throw new Error(error.message);
    }
  },

  get: async (key: string): Promise<any> => {
    const supabaseKv = kvClient();
    const { data, error } = await supabaseKv.from("kv_store_04919ac5").select("value").eq("key", key).maybeSingle();
    if (error) {
      throw new Error(error.message);
    }
    return data?.value;
  },

  del: async (key: string): Promise<void> => {
    const supabaseKv = kvClient();
    const { error } = await supabaseKv.from("kv_store_04919ac5").delete().eq("key", key);
    if (error) {
      throw new Error(error.message);
    }
  },

  mset: async (keys: string[], values: any[]): Promise<void> => {
    const supabaseKv = kvClient();
    const { error } = await supabaseKv.from("kv_store_04919ac5").upsert(keys.map((k, i) => ({ key: k, value: values[i] })));
    if (error) {
      throw new Error(error.message);
    }
  },

  mget: async (keys: string[]): Promise<any[]> => {
    const supabaseKv = kvClient();
    const { data, error } = await supabaseKv.from("kv_store_04919ac5").select("value").in("key", keys);
    if (error) {
      throw new Error(error.message);
    }
    return data?.map((d) => d.value) ?? [];
  },

  mdel: async (keys: string[]): Promise<void> => {
    const supabaseKv = kvClient();
    const { error } = await supabaseKv.from("kv_store_04919ac5").delete().in("key", keys);
    if (error) {
      throw new Error(error.message);
    }
  },

  getByPrefix: async (prefix: string): Promise<any[]> => {
    const supabaseKv = kvClient();
    const { data, error } = await supabaseKv.from("kv_store_04919ac5").select("key, value").like("key", prefix + "%");
    if (error) {
      throw new Error(error.message);
    }
    return data?.map((d) => d.value) ?? [];
  }
};

// ===========================================================================
// EMAIL SERVICE - Integrated directly (no relative import)
// ===========================================================================
async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}): Promise<{ success: boolean; error?: string }> {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: params.from || "Maxence - Portfolio Freelance <contact@maxence.design>",
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend API error:", error);
      return { success: false, error: `Failed to send email: ${error}` };
    }

    const data = await response.json();
    console.log("Email sent successfully:", data);
    return { success: true };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

// ===========================================================================
// MIDDLEWARE
// ===========================================================================
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

// Auth middleware
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  const token = authHeader.replace("Bearer ", "");
  
  // For public anon key, allow through
  const publicAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (token === publicAnonKey) {
    await next();
    return;
  }
  
  // Verify JWT token
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  c.set("user", user);
  await next();
};

// ===========================================================================
// HEALTH CHECK
// ===========================================================================
app.get("/make-server-04919ac5/health", (c) => {
  console.log("✅ Health check OK");
  return c.json({ 
    success: true, 
    message: "Server is running - CONSOLIDATED VERSION",
    timestamp: new Date().toISOString(),
    version: "consolidated-v1"
  });
});

// ===========================================================================
// AUTH ROUTES
// ===========================================================================
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

// ===========================================================================
// NEWSLETTER ROUTES
// ===========================================================================
app.post("/make-server-04919ac5/newsletter/subscribe", async (c) => {
  try {
    const body = await c.req.json();
    const { email, name, source } = body;

    if (!email) {
      return c.json({ success: false, error: "Email is required" }, 400);
    }

    const subscriberKey = `newsletter:${email}`;
    const existing = await kv.get(subscriberKey);

    if (existing && existing.status === "confirmed") {
      return c.json({ 
        success: false, 
        error: "This email is already subscribed" 
      }, 400);
    }

    const confirmToken = crypto.randomUUID();
    const subscriber = {
      email,
      name: name || "",
      source: source || "website",
      status: "confirmed",
      confirmToken,
      subscribedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(subscriberKey, subscriber);

    console.log(`✅ Newsletter subscription confirmed: ${email}`);
    return c.json({ success: true, message: "Successfully subscribed!" });
  } catch (error: any) {
    console.error("❌ Error subscribing to newsletter:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

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

app.get("/make-server-04919ac5/newsletter/subscribers", requireAuth, async (c) => {
  try {
    const subscribers = await kv.getByPrefix("newsletter:");
    return c.json({ success: true, subscribers });
  } catch (error: any) {
    console.error("❌ Error fetching subscribers:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===========================================================================
// CONTACTS / LEADS ROUTES
// ===========================================================================
app.post("/make-server-04919ac5/contacts", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, company, message, service, budget, wantsAppointment } = body;

    if (!name || !email || !message) {
      return c.json({ 
        success: false, 
        error: "Name, email, and message are required" 
      }, 400);
    }

    const leadId = `lead:${email}:${Date.now()}`;
    const lead = {
      id: leadId,
      name,
      email,
      phone: phone || "",
      company: company || "",
      message,
      service: service || "",
      budget: budget || "",
      wantsAppointment: wantsAppointment || false,
      status: "new",
      source: "contact_form",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(leadId, lead);

    console.log(`✅ Lead created: ${name} (${email})`);
    return c.json({ success: true, message: "Contact form submitted successfully" });
  } catch (error: any) {
    console.error("❌ Error creating contact:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/make-server-04919ac5/leads", requireAuth, async (c) => {
  try {
    const leads = await kv.getByPrefix("lead:");
    const sorted = leads.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ success: true, leads: sorted });
  } catch (error: any) {
    console.error("❌ Error fetching leads:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-04919ac5/leads/:id", requireAuth, async (c) => {
  try {
    const leadId = c.req.param("id");
    const body = await c.req.json();

    const existing = await kv.get(leadId);
    if (!existing) {
      return c.json({ success: false, error: "Lead not found" }, 404);
    }

    const updated = {
      ...existing,
      ...body,
      id: leadId,
      updatedAt: new Date().toISOString()
    };

    await kv.set(leadId, updated);
    console.log(`✅ Lead updated: ${leadId}`);
    return c.json({ success: true, lead: updated });
  } catch (error: any) {
    console.error("❌ Error updating lead:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-04919ac5/leads/:id", requireAuth, async (c) => {
  try {
    const leadId = c.req.param("id");
    await kv.del(leadId);
    console.log(`✅ Lead deleted: ${leadId}`);
    return c.json({ success: true, message: "Lead deleted" });
  } catch (error: any) {
    console.error("❌ Error deleting lead:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===========================================================================
// BLOG ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/blog/posts", async (c) => {
  try {
    const lang = c.req.query("lang") || "fr";
    console.log(`📝 Fetching blog posts (lang: ${lang})...`);
    
    const posts = await kv.getByPrefix("blog_post_");
    const filteredPosts = posts.filter((p: any) => p.language === lang || !p.language);
    
    console.log(`✅ Found ${filteredPosts.length} blog posts`);
    return c.json(filteredPosts);
  } catch (error: any) {
    console.error("❌ Error fetching blog posts:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/make-server-04919ac5/blog/posts/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const lang = c.req.query("lang") || "fr";
    console.log(`📝 Fetching blog post: ${slug} (lang: ${lang})`);
    
    const posts = await kv.getByPrefix("blog_post_");
    const post = posts.find((p: any) => p.slug === slug && (p.language === lang || !p.language));
    
    if (!post) {
      return c.json({ success: false, error: "Post not found" }, 404);
    }
    
    // Get related posts
    const relatedPosts = posts
      .filter((p: any) => 
        p.id !== post.id && 
        (p.category === post.category || p.tags?.some((t: string) => post.tags?.includes(t)))
      )
      .slice(0, 3);
    
    console.log("✅ Blog post found with related posts");
    return c.json({ post, related: relatedPosts });
  } catch (error: any) {
    console.error("❌ Error fetching blog post:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-04919ac5/blog/posts/:slug/view", async (c) => {
  try {
    const slug = c.req.param("slug");
    console.log(`👁️ Incrementing views for: ${slug}`);
    
    const posts = await kv.getByPrefix("blog_post_");
    const post = posts.find((p: any) => p.slug === slug);
    
    if (post) {
      post.views = (post.views || 0) + 1;
      await kv.set(`blog_post_${post.id}`, post);
      console.log(`✅ Views incremented to ${post.views}`);
    }
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error("❌ Error incrementing views:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-04919ac5/blog/posts", requireAuth, async (c) => {
  try {
    const body = await c.req.json();
    const id = `blog_post_${crypto.randomUUID()}`;
    
    const post = {
      ...body,
      id,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(id, post);
    console.log(`✅ Blog post created: ${id}`);
    return c.json({ success: true, post });
  } catch (error: any) {
    console.error("❌ Error creating blog post:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-04919ac5/blog/posts/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    const existing = await kv.get(id);
    if (!existing) {
      return c.json({ success: false, error: "Post not found" }, 404);
    }

    const updated = {
      ...existing,
      ...body,
      id,
      updatedAt: new Date().toISOString()
    };

    await kv.set(id, updated);
    console.log(`✅ Blog post updated: ${id}`);
    return c.json({ success: true, post: updated });
  } catch (error: any) {
    console.error("❌ Error updating blog post:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-04919ac5/blog/posts/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(id);
    console.log(`✅ Blog post deleted: ${id}`);
    return c.json({ success: true, message: "Post deleted" });
  } catch (error: any) {
    console.error("❌ Error deleting blog post:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===========================================================================
// KV STORE (for seeding)
// ===========================================================================
app.post("/make-server-04919ac5/kv/set", async (c) => {
  try {
    const body = await c.req.json();
    const { key, value } = body;
    console.log(`💾 Setting KV: ${key}`);
    
    await kv.set(key, value);
    
    console.log("✅ KV set successful");
    return c.json({ success: true });
  } catch (error: any) {
    console.error("❌ Error setting KV:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ===========================================================================
// CATCH-ALL FOR DEBUGGING
// ===========================================================================
app.all("*", (c) => {
  console.log(`⚠️ Unhandled route: ${c.req.method} ${c.req.path}`);
  return c.json({ 
    success: false, 
    error: "Route not found",
    path: c.req.path,
    method: c.req.method,
    message: "This route does not exist"
  }, 404);
});

console.log("✅ CONSOLIDATED server configured");
console.log("📍 Available routes:");
console.log("   AUTH: /auth/init-admin, /auth/login");
console.log("   NEWSLETTER: /newsletter/subscribe, /newsletter/stats");
console.log("   CONTACTS/LEADS: /contacts, /leads");
console.log("   BLOG: /blog/posts, /blog/posts/:slug");
console.log("   KV: /kv/set");

// ===========================================================================
// START SERVER
// ===========================================================================
Deno.serve(app.fetch);
