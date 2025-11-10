import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";

const app = new Hono();

// Enable CORS
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "OPTIONS"],
  credentials: true,
}));

// Health check
app.get("/make-server-04919ac5/health", (c) => {
  return c.json({ 
    success: true, 
    message: "Test server is running",
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get("/make-server-04919ac5/test", (c) => {
  return c.json({ 
    success: true,
    message: "Test endpoint works!"
  });
});

console.log("🚀 Test server starting...");
Deno.serve(app.fetch);
