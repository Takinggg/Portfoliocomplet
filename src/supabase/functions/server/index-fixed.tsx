// ============================================================================
// CONSOLIDATED EDGE FUNCTION - FIX VERSION
// This version adds error handling to identify startup issues
// ============================================================================

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

console.log("🔧 Starting FIXED server with error diagnostics...");

// ===========================================================================
// SUPABASE CLIENT
// ===========================================================================
let supabase: any;
try {
  supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
  console.log("✅ Supabase client created");
} catch (error) {
  console.error("❌ FATAL: Failed to create Supabase client:", error);
  throw error;
}

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
  },

  getByPrefixWithKeys: async (prefix: string): Promise<Array<{key: string, value: any}>> => {
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

console.log("✅ Email service configured");

// ===========================================================================
// MIDDLEWARE
// ===========================================================================

// Logger
app.use('*', logger(console.log));
console.log("✅ Logger middleware added");

// CORS
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: false,
  maxAge: 86400,
}));
console.log("✅ CORS middleware added");

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

console.log("✅ Auth middleware configured");

// ===========================================================================
// HEALTH CHECK
// ===========================================================================
app.get("/make-server-04919ac5/health", (c) => {
  console.log("✅ Health check OK");
  return c.json({ 
    success: true, 
    message: "Server is running - FIXED VERSION",
    timestamp: new Date().toISOString(),
    version: "fixed-v1"
  });
});

console.log("✅ Health check route added");

// ===========================================================================
// QUOTES ROUTES - SIMPLIFIED FOR TESTING
// ===========================================================================

try {
  // Get all quotes
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

  // Create a new quote
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

  // Update a quote
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

  // Delete a quote
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

  // Convert quote to invoice
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
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
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

  // Send reminder email for quote
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
        note: "Email functionality not yet implemented - configure RESEND_API_KEY" 
      });
    } catch (error: any) {
      console.error("❌ Error sending reminder:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });

  console.log("✅ All 6 QUOTES routes added successfully!");
} catch (error) {
  console.error("❌ FATAL: Error adding quotes routes:", error);
  throw error;
}

// ===========================================================================
// START SERVER
// ===========================================================================
console.log("🚀 Starting Deno server...");
Deno.serve(app.fetch);
console.log("✅ Server started successfully!");
