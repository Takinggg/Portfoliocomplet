// ============================================================================
// MINIMAL SERVER - QUOTES ROUTES ONLY FOR TESTING
// ============================================================================

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

console.log("🧪 Starting MINIMAL server - QUOTES ROUTES ONLY");

// ===========================================================================
// SUPABASE CLIENT
// ===========================================================================
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// ===========================================================================
// KV STORE
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
// MIDDLEWARE
// ===========================================================================
app.use('*', logger(console.log));

app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: false,
  maxAge: 86400,
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
  return c.json({ 
    success: true, 
    message: "QUOTES-ONLY server running",
    timestamp: new Date().toISOString()
  });
});

// ===========================================================================
// QUOTES ROUTES - ALL 6 ROUTES
// ===========================================================================

console.log("📋 Registering QUOTES routes...");

// 1. Get all quotes
app.get("/make-server-04919ac5/quotes", requireAuth, async (c) => {
  try {
    const quotes = await kv.getByPrefix("quote:");
    const sorted = quotes.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    console.log(`✅ Fetched ${quotes.length} quotes`);
    return c.json({ success: true, quotes: sorted });
  } catch (error: any) {
    console.error("❌ Error fetching quotes:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 2. Create a new quote
app.post("/make-server-04919ac5/quotes", requireAuth, async (c) => {
  try {
    const body = await c.req.json();
    const { 
      number, 
      clientId, 
      clientName, 
      clientEmail, 
      clientAddress,
      amount, 
      description, 
      validUntil, 
      status,
      metadata 
    } = body;
    
    if (!number || !clientId || !clientName || !amount || !validUntil) {
      return c.json({ 
        success: false, 
        error: "Number, clientId, clientName, amount and validUntil are required" 
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
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(quoteId, quoteData);
    console.log(`✅ Quote created: ${quoteId}`);
    
    return c.json({ success: true, quote: quoteData });
  } catch (error: any) {
    console.error("❌ Error creating quote:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 3. Update a quote
app.put("/make-server-04919ac5/quotes/:id", requireAuth, async (c) => {
  try {
    const quoteId = decodeURIComponent(c.req.param("id"));
    const body = await c.req.json();
    
    const existingQuote = await kv.get(quoteId);
    if (!existingQuote) {
      return c.json({ success: false, error: "Quote not found" }, 404);
    }
    
    const updatedQuote = {
      ...existingQuote,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(quoteId, updatedQuote);
    console.log(`✅ Quote updated: ${quoteId}`);
    
    return c.json({ success: true, quote: updatedQuote, emailSent: false });
  } catch (error: any) {
    console.error("❌ Error updating quote:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 4. Delete a quote
app.delete("/make-server-04919ac5/quotes/:id", requireAuth, async (c) => {
  try {
    const quoteId = decodeURIComponent(c.req.param("id"));
    console.log(`🗑️ Deleting quote: ${quoteId}`);
    
    const existingQuote = await kv.get(quoteId);
    if (!existingQuote) {
      return c.json({ success: false, error: "Quote not found" }, 404);
    }
    
    await kv.del(quoteId);
    console.log(`✅ Quote deleted: ${quoteId}`);
    
    return c.json({ success: true, message: "Quote deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error deleting quote:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 5. Convert quote to invoice
app.post("/make-server-04919ac5/quotes/:id/convert", requireAuth, async (c) => {
  try {
    const quoteId = decodeURIComponent(c.req.param("id"));
    
    const quote = await kv.get(quoteId);
    if (!quote) {
      return c.json({ success: false, error: "Quote not found" }, 404);
    }
    
    if (quote.status !== "accepted") {
      return c.json({ 
        success: false, 
        error: "Only accepted quotes can be converted to invoices" 
      }, 400);
    }
    
    if (quote.convertedToInvoice) {
      return c.json({ 
        success: false, 
        error: "This quote has already been converted to an invoice" 
      }, 400);
    }
    
    // Generate invoice number from quote number
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
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(invoiceId, invoiceData);
    
    // Update quote to mark as converted
    const updatedQuote = {
      ...quote,
      status: "converted",
      convertedToInvoice: invoiceId,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(quoteId, updatedQuote);
    
    console.log(`✅ Quote ${quoteId} converted to invoice ${invoiceId}`);
    
    return c.json({ 
      success: true, 
      invoice: invoiceData,
      quote: updatedQuote 
    });
  } catch (error: any) {
    console.error("❌ Error converting quote to invoice:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 6. Send reminder email for quote
app.post("/make-server-04919ac5/quotes/:id/send-reminder", requireAuth, async (c) => {
  try {
    const quoteId = decodeURIComponent(c.req.param("id"));
    
    const quote = await kv.get(quoteId);
    if (!quote) {
      return c.json({ success: false, error: "Quote not found" }, 404);
    }
    
    console.log(`📧 Would send reminder email for quote ${quoteId} to ${quote.clientEmail}`);
    
    return c.json({ 
      success: true, 
      message: "Reminder email sent successfully",
      note: "Email functionality not yet implemented" 
    });
  } catch (error: any) {
    console.error("❌ Error sending reminder:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

console.log("✅ ALL 6 QUOTES ROUTES REGISTERED!");
console.log("📍 Routes available:");
console.log("   GET    /make-server-04919ac5/quotes");
console.log("   POST   /make-server-04919ac5/quotes");
console.log("   PUT    /make-server-04919ac5/quotes/:id");
console.log("   DELETE /make-server-04919ac5/quotes/:id");
console.log("   POST   /make-server-04919ac5/quotes/:id/convert");
console.log("   POST   /make-server-04919ac5/quotes/:id/send-reminder");

// ===========================================================================
// START SERVER
// ===========================================================================
console.log("🚀 Starting server...");
Deno.serve(app.fetch);
console.log("✅ Server started successfully!");
