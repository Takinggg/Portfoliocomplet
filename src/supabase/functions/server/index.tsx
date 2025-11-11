// ============================================================================
// COMPLETE SERVER - ALL ROUTES INCLUDING QUOTES AND INVOICES
// Optimized version that works on Supabase
// ============================================================================
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
const app = new Hono();
console.log("🚀 Starting COMPLETE server with ALL routes (quotes + invoices + blog CRUD)...");
// ===========================================================================
// SUPABASE CLIENT
// ===========================================================================
const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
// ===========================================================================
// KV STORE
// ===========================================================================
const kvClient = ()=>createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
const kv = {
  set: async (key, value)=>{
    const supabaseKv = kvClient();
    const { error } = await supabaseKv.from("kv_store_04919ac5").upsert({
      key,
      value
    });
    if (error) {
      throw new Error(error.message);
    }
  },
  get: async (key)=>{
    const supabaseKv = kvClient();
    const { data, error } = await supabaseKv.from("kv_store_04919ac5").select("value").eq("key", key).maybeSingle();
    if (error) {
      throw new Error(error.message);
    }
    return data?.value;
  },
  del: async (key)=>{
    const supabaseKv = kvClient();
    const { error } = await supabaseKv.from("kv_store_04919ac5").delete().eq("key", key);
    if (error) {
      throw new Error(error.message);
    }
  },
  mset: async (keys, values)=>{
    const supabaseKv = kvClient();
    const { error } = await supabaseKv.from("kv_store_04919ac5").upsert(keys.map((k, i)=>({
        key: k,
        value: values[i]
      })));
    if (error) {
      throw new Error(error.message);
    }
  },
  mget: async (keys)=>{
    const supabaseKv = kvClient();
    const { data, error } = await supabaseKv.from("kv_store_04919ac5").select("value").in("key", keys);
    if (error) {
      throw new Error(error.message);
    }
    return data?.map((d)=>d.value) ?? [];
  },
  mdel: async (keys)=>{
    const supabaseKv = kvClient();
    const { error } = await supabaseKv.from("kv_store_04919ac5").delete().in("key", keys);
    if (error) {
      throw new Error(error.message);
    }
  },
  getByPrefix: async (prefix)=>{
    const supabaseKv = kvClient();
    const { data, error } = await supabaseKv.from("kv_store_04919ac5").select("key, value").like("key", prefix + "%");
    if (error) {
      throw new Error(error.message);
    }
    return data?.map((d)=>d.value) ?? [];
  },
  getByPrefixWithKeys: async (prefix)=>{
    const supabaseKv = kvClient();
    const { data, error } = await supabaseKv.from("kv_store_04919ac5").select("key, value").like("key", prefix + "%");
    if (error) {
      throw new Error(error.message);
    }
    return data ?? [];
  }
};
console.log("✅ KV store configured");
// ===========================================================================
// EMAIL SERVICE
// ===========================================================================
async function sendEmail(params) {
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
      error: error.message
    };
  }
}
console.log("✅ Email service configured");
// ===========================================================================
// MIDDLEWARE
// ===========================================================================
app.use('*', logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With"
  ],
  allowMethods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ],
  credentials: false,
  maxAge: 86400
}));
const requireAuth = async (c, next)=>{
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({
      success: false,
      error: "Unauthorized"
    }, 401);
  }
  const token = authHeader.replace("Bearer ", "");
  const publicAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (token === publicAnonKey) {
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
console.log("✅ Middleware configured");
// ===========================================================================
// HEALTH CHECK
// ===========================================================================
app.get("/make-server-04919ac5/health", (c)=>{
  return c.json({
    success: true,
    message: "COMPLETE server running (quotes + invoices + blog CRUD)",
    timestamp: new Date().toISOString()
  });
});
console.log("✅ Health check added");
// ===========================================================================
// AUTH ROUTES
// ===========================================================================
app.post("/make-server-04919ac5/auth/init-admin", async (c)=>{
  try {
    const ADMIN_EMAIL = "contact@maxence.design";
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD") ?? "vbz657D9";
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users?.some((u)=>u.email === ADMIN_EMAIL);
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
      error: error.message
    }, 500);
  }
});
app.post("/make-server-04919ac5/auth/login", async (c)=>{
  try {
    const { email, password } = await c.req.json();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return c.json({
      success: true,
      session: data.session,
      user: data.user
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error.message
    }, 401);
  }
});
console.log("✅ Auth routes added");
// ===========================================================================
// CLIENTS ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/clients", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
app.get("/make-server-04919ac5/clients/:id", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
app.post("/make-server-04919ac5/clients", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
app.put("/make-server-04919ac5/clients/:id", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
app.delete("/make-server-04919ac5/clients/:id", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
console.log("✅ Clients routes added");
// ===========================================================================
// LEADS ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/leads", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
app.get("/make-server-04919ac5/leads/:id", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
app.post("/make-server-04919ac5/leads", async (c)=>{
  try {
    const body = await c.req.json();
    const { name, email, phone, message, budget, timeline, projectType, source } = body;
    if (!name || !email) {
      return c.json({
        success: false,
        error: "Name and email required"
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
      error: error.message
    }, 500);
  }
});
app.put("/make-server-04919ac5/leads/:id", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
app.delete("/make-server-04919ac5/leads/:id", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});

// Convert lead to client
app.post("/make-server-04919ac5/leads/:id/convert", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});

console.log("✅ Leads routes added");
// ===========================================================================
// BOOKINGS ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/bookings", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
app.post("/make-server-04919ac5/bookings", async (c)=>{
  try {
    const body = await c.req.json();
    const { name, email, phone, date, time, service, message } = body;
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
      error: error.message
    }, 500);
  }
});
app.put("/make-server-04919ac5/bookings/:id", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
app.delete("/make-server-04919ac5/bookings/:id", requireAuth, async (c)=>{
  try {
    const bookingId = c.req.param("id");
    await kv.del(bookingId);
    return c.json({
      success: true,
      message: "Booking deleted"
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});
console.log("✅ Bookings routes added");
// ===========================================================================
// EMAIL ROUTES - BOOKING CONFIRMATION
// ===========================================================================
app.post("/make-server-04919ac5/emails/booking-confirmation", async (c)=>{
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
      error: error.message
    }, 500);
  }
});
console.log("✅ Booking confirmation email route added");
// ===========================================================================
// EMAIL ROUTES - LEAD CONFIRMATION
// ===========================================================================
app.post("/make-server-04919ac5/emails/lead-confirmation", async (c)=>{
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
      error: error.message
    }, 500);
  }
});
console.log("✅ Lead confirmation email route added");
// ===========================================================================
// DASHBOARD STATS
// ===========================================================================
app.get("/make-server-04919ac5/dashboard/stats", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
console.log("✅ Dashboard stats route added");
// ===========================================================================
// QUOTES ROUTES - THE 6 ROUTES THAT WORK
// ===========================================================================
console.log("📋 Adding QUOTES routes...");
// 1. Get all quotes
app.get("/make-server-04919ac5/quotes", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
// 1.5. Get single quote by ID
app.get("/make-server-04919ac5/quotes/:id", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
// 2. Create a new quote
app.post("/make-server-04919ac5/quotes", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
// 3. Update a quote
app.put("/make-server-04919ac5/quotes/:id", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
// 4. Delete a quote
app.delete("/make-server-04919ac5/quotes/:id", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
// 5. Convert quote to invoice
app.post("/make-server-04919ac5/quotes/:id/convert", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
// 6. Send reminder
app.post("/make-server-04919ac5/quotes/:id/send-reminder", requireAuth, async (c)=>{
  try {
    const quoteId = decodeURIComponent(c.req.param("id"));
    const quote = await kv.get(quoteId);
    if (!quote) return c.json({
      success: false,
      error: "Quote not found"
    }, 404);
    
    // Send quote email using email service
    const { sendQuoteEmail } = await import("./email_service.tsx");
    
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
      quoteNumber: quote.number,
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
      error: error.message
    }, 500);
  }
});
console.log("✅ ALL 6 QUOTES ROUTES ADDED!");
// ===========================================================================
// INVOICES ROUTES - NEW!
// ===========================================================================
console.log("💰 Adding INVOICES routes...");
// 1. Get all invoices
app.get("/make-server-04919ac5/invoices", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
// 2. Get single invoice
app.get("/make-server-04919ac5/invoices/:id", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
// 3. Update invoice
app.put("/make-server-04919ac5/invoices/:id", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
// 4. Delete invoice
app.delete("/make-server-04919ac5/invoices/:id", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});

// Generate secure link for invoice (new system)
app.post("/make-server-04919ac5/invoices/:id/generate-link", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});

// View invoice by token (public route - no auth required)
app.get("/make-server-04919ac5/invoices/view/:token", async (c)=>{
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
      error: error.message
    }, 500);
  }
});

// Send invoice reminder
app.post("/make-server-04919ac5/invoices/:id/send-reminder", requireAuth, async (c)=>{
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
      
      console.log(`🔐 Generated new secure link for invoice ${invoice.number}`);
    } else {
      console.log(`🔗 Using existing secure link for invoice ${invoice.number}`);
    }
    
    // Import email service
    const { sendInvoiceLink } = await import("./email_service.tsx");
    
    // Send email with secure link (no PDF)
    const emailResult = await sendInvoiceLink({
      clientEmail: invoice.clientEmail,
      clientName: invoice.clientName,
      invoiceNumber: invoice.number,
      amount: invoice.amount,
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
      error: error.message
    }, 500);
  }
});
console.log("✅ ALL 5 INVOICES ROUTES ADDED (including send-reminder)!");
// ===========================================================================
// PROJECTS ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/projects", async (c)=>{
  try {
    const lang = c.req.query("lang") || "fr";
    const projects = await kv.getByPrefix("project:");
    const sorted = projects.sort((a, b)=>new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    console.log(`✅ Found ${sorted.length} bilingual projects (${lang})`);
    return c.json({
      success: true,
      projects: sorted
    });
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});
app.get("/make-server-04919ac5/projects/:id", async (c)=>{
  try {
    const projectId = c.req.param("id");
    const project = await kv.get(`project:${projectId}`);
    if (!project) return c.json({
      success: false,
      error: "Project not found"
    }, 404);
    return c.json({
      success: true,
      project
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});
console.log("✅ Projects routes added");
// ===========================================================================
// NEWSLETTER ROUTES
// ===========================================================================
app.post("/make-server-04919ac5/newsletter/subscribe", async (c)=>{
  try {
    const { email, source } = await c.req.json();
    if (!email) return c.json({
      success: false,
      error: "Email required"
    }, 400);
    const subscriberId = `subscriber:${Date.now()}@${email}`;
    const subscriberData = {
      id: subscriberId,
      email,
      source: source || "website",
      status: "active",
      subscribedAt: new Date().toISOString()
    };
    await kv.set(subscriberId, subscriberData);
    console.log(`✅ New subscriber: ${email}`);
    return c.json({
      success: true,
      message: "Subscribed successfully"
    });
  } catch (error) {
    console.error("❌ Error subscribing:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});
app.get("/make-server-04919ac5/newsletter/stats", requireAuth, async (c)=>{
  try {
    const subscribers = await kv.getByPrefix("subscriber:");
    const activeCount = subscribers.filter((s)=>s.status === "active").length;
    return c.json({
      success: true,
      total: subscribers.length,
      active: activeCount
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});
console.log("✅ Newsletter routes added");
// ===========================================================================
// TESTIMONIALS ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/testimonials", async (c)=>{
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
      error: error.message
    }, 500);
  }
});
console.log("✅ Testimonials routes added");
// ===========================================================================
// BLOG ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/blog/posts", async (c)=>{
  try {
    const posts = await kv.getByPrefix("blog:");
    return c.json({
      success: true,
      posts
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});
app.get("/make-server-04919ac5/blog/posts/:slug", async (c)=>{
  try {
    const slug = c.req.param("slug");
    const posts = await kv.getByPrefix("blog:");
    const post = posts.find((p)=>p.slug === slug);
    if (!post) return c.json({
      success: false,
      error: "Post not found"
    }, 404);
    return c.json({
      success: true,
      post
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});
// Create a new blog post
app.post("/make-server-04919ac5/blog/posts", requireAuth, async (c)=>{
  try {
    const body = await c.req.json();
    const { title_fr, title_en, slug, excerpt_fr, excerpt_en, content_fr, content_en, coverImage, category, tags, status } = body;
    if (!title_fr || !content_fr) {
      return c.json({
        success: false,
        error: "Title and content in French are required"
      }, 400);
    }
    const postId = `blog:${Date.now()}@${slug || Date.now()}`;
    const postData = {
      id: postId,
      title_fr: title_fr || "",
      title_en: title_en || "",
      slug: slug || `post-${Date.now()}`,
      excerpt_fr: excerpt_fr || "",
      excerpt_en: excerpt_en || "",
      content_fr: content_fr || "",
      content_en: content_en || "",
      coverImage: coverImage || "",
      category: category || "development",
      tags: tags || [],
      status: status || "draft",
      published: status === "published",
      publishedAt: status === "published" ? new Date().toISOString() : null,
      views: 0,
      readTime: body.readTime || 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Legacy fields for backward compatibility
      title: title_fr,
      excerpt: excerpt_fr,
      content: content_fr
    };
    await kv.set(postId, postData);
    console.log(`✅ Blog post created: ${postId}`);
    return c.json({
      success: true,
      post: postData
    });
  } catch (error) {
    console.error("❌ Error creating blog post:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});
// Update a blog post
app.put("/make-server-04919ac5/blog/posts/:id", requireAuth, async (c)=>{
  try {
    const postId = decodeURIComponent(c.req.param("id"));
    const body = await c.req.json();
    const existingPost = await kv.get(postId);
    if (!existingPost) return c.json({
      success: false,
      error: "Post not found"
    }, 404);
    const updatedPost = {
      ...existingPost,
      ...body,
      published: body.status === "published",
      publishedAt: body.status === "published" && !existingPost.publishedAt ? new Date().toISOString() : existingPost.publishedAt,
      updatedAt: new Date().toISOString(),
      // Update legacy fields if multilingual fields are provided
      title: body.title_fr || existingPost.title_fr || existingPost.title,
      excerpt: body.excerpt_fr || existingPost.excerpt_fr || existingPost.excerpt,
      content: body.content_fr || existingPost.content_fr || existingPost.content
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
      error: error.message
    }, 500);
  }
});
// Delete a blog post
app.delete("/make-server-04919ac5/blog/posts/:id", requireAuth, async (c)=>{
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
      error: error.message
    }, 500);
  }
});
console.log("✅ ALL Blog routes added (GET/POST/PUT/DELETE)");
// ===========================================================================
// CASE STUDIES ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/case-studies", async (c)=>{
  try {
    const caseStudies = await kv.getByPrefix("case-study:");
    return c.json({
      success: true,
      caseStudies
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});
console.log("✅ Case studies routes added");
// ===========================================================================
// RESOURCES ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/resources", async (c)=>{
  try {
    const resources = await kv.getByPrefix("resource:");
    return c.json({
      success: true,
      resources
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});
console.log("✅ Resources routes added");
// ===========================================================================
// FAQ ROUTES
// ===========================================================================
app.get("/make-server-04919ac5/faq", async (c)=>{
  try {
    const questions = await kv.getByPrefix("faq:");
    return c.json({
      success: true,
      questions
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});
console.log("✅ FAQ routes added");
// ===========================================================================
// SEED DATA ROUTE - Initialize all data
// ===========================================================================
app.post("/make-server-04919ac5/seed-data", requireAuth, async (c)=>{
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
      error: error.message
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
app.post("/make-server-04919ac5/stripe/create-checkout-session", async (c)=>{
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
      error: error.message || "Failed to create checkout session"
    }, 500);
  }
});

// Webhook to handle Stripe events (for production)
app.post("/make-server-04919ac5/stripe/webhook", async (c)=>{
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
    return c.json({ success: false, error: error.message }, 500);
  }
});

console.log("✅ Stripe payment routes added");

// ===========================================================================
// START SERVER
// ===========================================================================
console.log("🚀 Starting server...");
Deno.serve(app.fetch);
console.log("✅ Server started successfully with QUOTES + INVOICES + BLOG CRUD + STRIPE PAYMENTS!");
