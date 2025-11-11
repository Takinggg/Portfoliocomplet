// 🚀 PORTFOLIO CRM SERVER - TEST VERSION
// Simple server to test Edge Function deployment

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";

const app = new Hono();

// Enable CORS
app.use("*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// Health check
app.get("/health", (c) => {
  return c.json({
    success: true,
    message: "Test server working!",
    timestamp: new Date().toISOString()
  });
});

// Projects endpoint
app.get("/projects", (c) => {
  return c.json({
    success: true,
    data: [
      {
        id: 1,
        title: "Test Project",
        description: "This is a test project",
        status: "completed"
      }
    ]
  });
});

app.post("/projects", async (c) => {
  try {
    const body = await c.req.json();
    return c.json({
      success: true,
      data: {
        id: Date.now(),
        ...body,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    return c.json({ success: false, error: "Invalid JSON" }, 400);
  }
});

// Catch all
app.all("*", (c) => {
  return c.json({
    success: false,
    error: "Route not found",
    path: c.req.url
  }, 404);
});

Deno.serve(app.fetch);