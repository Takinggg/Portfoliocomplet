/**
 * 🔒 SECURITY MIDDLEWARE
 * 
 * Implements:
 * - Rate Limiting (in-memory with sliding window)
 * - CSRF Protection (token-based)
 * - Input Validation
 * - Security Headers
 */

import { Context } from "npm:hono";
import * as kv from "./kv_store.tsx";

// ============================================
// 1. RATE LIMITING
// ============================================

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

interface RateLimitEntry {
  requests: number[];
  blocked: boolean;
  blockedUntil?: number;
}

// In-memory store for rate limiting (resets on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Different limits for different endpoints
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Form submissions - strict
  'POST:/leads': { windowMs: 60000, maxRequests: 3 }, // 3 per minute
  'POST:/bookings': { windowMs: 60000, maxRequests: 3 },
  'POST:/newsletter/subscribe': { windowMs: 60000, maxRequests: 2 },
  
  // Authentication - very strict
  'POST:/auth/login': { windowMs: 300000, maxRequests: 5 }, // 5 per 5 min
  
  // General API - moderate
  'GET:*': { windowMs: 60000, maxRequests: 60 }, // 60 per minute
  'POST:*': { windowMs: 60000, maxRequests: 20 }, // 20 per minute
  
  // Analytics - lenient (high volume expected)
  'POST:/analytics/pageview': { windowMs: 60000, maxRequests: 100 },
  'POST:/analytics/session/start': { windowMs: 60000, maxRequests: 50 },
};

/**
 * Rate limiting middleware using sliding window algorithm
 */
export function rateLimiter() {
  return async (c: Context, next: any) => {
    try {
      // Get client identifier (IP or session)
      const clientIp = c.req.header('x-forwarded-for') || 
                       c.req.header('x-real-ip') || 
                       'unknown';
      
      // Get endpoint key
      const method = c.req.method;
      const path = c.req.path.replace('/make-server-04919ac5', '');
      const endpointKey = `${method}:${path}`;
      
      // Find matching rate limit config
      let config = RATE_LIMITS[endpointKey];
      if (!config) {
        // Fallback to wildcard rules
        config = RATE_LIMITS[`${method}:*`] || { windowMs: 60000, maxRequests: 30 };
      }
      
      // Create unique key for this client + endpoint
      const rateLimitKey = `${clientIp}:${endpointKey}`;
      
      // Get or create rate limit entry
      let entry = rateLimitStore.get(rateLimitKey);
      if (!entry) {
        entry = { requests: [], blocked: false };
        rateLimitStore.set(rateLimitKey, entry);
      }
      
      const now = Date.now();
      
      // Check if client is blocked
      if (entry.blocked && entry.blockedUntil && now < entry.blockedUntil) {
        const remainingTime = Math.ceil((entry.blockedUntil - now) / 1000);
        return c.json({
          success: false,
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Please try again in ${remainingTime} seconds.`,
          retryAfter: remainingTime
        }, 429);
      }
      
      // Remove old requests outside the window
      entry.requests = entry.requests.filter(
        timestamp => now - timestamp < config.windowMs
      );
      
      // Check if limit exceeded
      if (entry.requests.length >= config.maxRequests) {
        // Block for 5 minutes
        entry.blocked = true;
        entry.blockedUntil = now + 300000; // 5 minutes
        
        console.warn(`🚨 Rate limit exceeded for ${clientIp} on ${endpointKey}`);
        
        return c.json({
          success: false,
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. You have been temporarily blocked.',
          retryAfter: 300
        }, 429);
      }
      
      // Add current request
      entry.requests.push(now);
      entry.blocked = false;
      entry.blockedUntil = undefined;
      
      // Add rate limit headers
      c.header('X-RateLimit-Limit', config.maxRequests.toString());
      c.header('X-RateLimit-Remaining', (config.maxRequests - entry.requests.length).toString());
      c.header('X-RateLimit-Reset', new Date(now + config.windowMs).toISOString());
      
      await next();
    } catch (error) {
      // If rate limiting fails, log but don't block the request
      console.error('⚠️ Rate limiting error (bypassing):', error);
      await next();
    }
  };
}

/**
 * Cleanup old rate limit entries (call periodically)
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  const maxAge = 3600000; // 1 hour
  
  for (const [key, entry] of rateLimitStore.entries()) {
    const lastRequest = entry.requests[entry.requests.length - 1] || 0;
    if (now - lastRequest > maxAge) {
      rateLimitStore.delete(key);
    }
  }
  
  console.log(`🧹 Rate limit store cleaned. Size: ${rateLimitStore.size}`);
}

// ============================================
// 2. CSRF PROTECTION
// ============================================

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * CSRF protection middleware
 * Only applies to state-changing methods (POST, PUT, PATCH, DELETE)
 */
export function csrfProtection() {
  return async (c: Context, next: any) => {
    const method = c.req.method;
    
    // Only check CSRF for state-changing requests
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      await next();
      return;
    }
    
    // Skip CSRF for these public endpoints (they use CAPTCHA instead)
    const path = c.req.path;
    const skipCsrfPaths = [
      '/make-server-04919ac5/auth/login',
      '/make-server-04919ac5/auth/init-admin',
      '/make-server-04919ac5/newsletter/subscribe',
      '/make-server-04919ac5/leads',
      '/make-server-04919ac5/bookings',
    ];
    
    if (skipCsrfPaths.some(p => path.includes(p))) {
      // For public forms, we rely on CAPTCHA + rate limiting
      await next();
      return;
    }
    
    // Get CSRF token from header
    const csrfToken = c.req.header('X-CSRF-Token');
    
    if (!csrfToken) {
      return c.json({
        success: false,
        error: 'CSRF token missing'
      }, 403);
    }
    
    // Verify token exists in KV store and is valid
    const storedToken = await kv.get(`csrf_token_${csrfToken}`);
    
    if (!storedToken) {
      return c.json({
        success: false,
        error: 'Invalid CSRF token'
      }, 403);
    }
    
    // Check token expiration (tokens valid for 1 hour)
    const tokenAge = Date.now() - (storedToken.createdAt || 0);
    if (tokenAge > 3600000) { // 1 hour
      await kv.del(`csrf_token_${csrfToken}`);
      return c.json({
        success: false,
        error: 'CSRF token expired'
      }, 403);
    }
    
    await next();
  };
}

/**
 * Endpoint to get a new CSRF token
 */
export async function getCsrfToken(c: Context) {
  const token = generateCsrfToken();
  
  // Store token in KV with creation timestamp
  await kv.set(`csrf_token_${token}`, {
    token,
    createdAt: Date.now()
  });
  
  return c.json({
    success: true,
    csrfToken: token
  });
}

// ============================================
// 3. SECURITY HEADERS
// ============================================

/**
 * Add security headers to all responses
 */
export function securityHeaders() {
  return async (c: Context, next: any) => {
    try {
      await next();
      
      // Content Security Policy
      c.header(
        'Content-Security-Policy',
        [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://browser.sentry-cdn.com https://js.sentry-cdn.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://www.clarity.ms https://*.sentry.io",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests"
      ].join('; ')
    );
    
    // Prevent clickjacking
    c.header('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    c.header('X-Content-Type-Options', 'nosniff');
    
    // XSS Protection (legacy but still useful)
    c.header('X-XSS-Protection', '1; mode=block');
    
    // Referrer Policy
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions Policy (restrict features)
    c.header(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    );
    
    // Strict Transport Security (HTTPS only)
    // Only enable if using HTTPS
    c.header(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
    } catch (error) {
      // If security headers fail, log but don't block the request
      console.error('⚠️ Security headers error (bypassing):', error);
    }
  };
}

// ============================================
// 4. INPUT VALIDATION
// ============================================

/**
 * Validate and sanitize email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate string length
 */
export function isValidLength(str: string, min: number, max: number): boolean {
  return str.length >= min && str.length <= max;
}

/**
 * Sanitize HTML (remove script tags and dangerous content)
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove inline event handlers
    .trim();
}

/**
 * Validate request body size
 */
export function bodySizeLimit(maxBytes: number) {
  return async (c: Context, next: any) => {
    const contentLength = c.req.header('content-length');
    
    if (contentLength && parseInt(contentLength) > maxBytes) {
      return c.json({
        success: false,
        error: 'Request body too large',
        maxSize: `${maxBytes / 1024}KB`
      }, 413);
    }
    
    await next();
  };
}

// ============================================
// 5. HONEYPOT VALIDATION
// ============================================

/**
 * Check if honeypot field is filled (bot detection)
 */
export function validateHoneypot(honeypotValue: string): boolean {
  return honeypotValue === '' || honeypotValue === undefined || honeypotValue === null;
}

/**
 * Middleware to validate honeypot in request body
 */
export function honeypotMiddleware(fieldName: string = 'website') {
  return async (c: Context, next: any) => {
    try {
      const body = await c.req.json();
      
      if (body[fieldName] && body[fieldName] !== '') {
        console.warn(`🤖 Bot detected via honeypot field: ${fieldName}`);
        
        // Return success to fool bots, but don't process
        return c.json({
          success: true,
          message: 'Request received'
        });
      }
      
      await next();
    } catch (error) {
      await next();
    }
  };
}

// ============================================
// 6. IP BLOCKING
// ============================================

const BLOCKED_IPS = new Set<string>();

/**
 * Block an IP address
 */
export function blockIp(ip: string, durationMs: number = 86400000) {
  BLOCKED_IPS.add(ip);
  
  // Auto-unblock after duration
  setTimeout(() => {
    BLOCKED_IPS.delete(ip);
    console.log(`🔓 IP unblocked: ${ip}`);
  }, durationMs);
  
  console.log(`🚫 IP blocked: ${ip}`);
}

/**
 * Check if IP is blocked
 */
export function ipBlockingMiddleware() {
  return async (c: Context, next: any) => {
    const clientIp = c.req.header('x-forwarded-for') || 
                     c.req.header('x-real-ip') || 
                     'unknown';
    
    if (BLOCKED_IPS.has(clientIp)) {
      return c.json({
        success: false,
        error: 'Access Denied',
        message: 'Your IP has been blocked due to suspicious activity'
      }, 403);
    }
    
    await next();
  };
}

// ============================================
// 7. EXPORTS & UTILITIES
// ============================================

/**
 * Initialize security middleware (call on server start)
 */
export function initializeSecurity() {
  console.log('🔒 Security middleware initialized');
  
  // Cleanup rate limit store every 10 minutes
  setInterval(cleanupRateLimitStore, 600000);
  
  // Cleanup old CSRF tokens every hour
  setInterval(async () => {
    try {
      const tokens = await kv.getByPrefix('csrf_token_');
      const now = Date.now();
      let cleaned = 0;
      
      for (const token of tokens) {
        const age = now - (token.createdAt || 0);
        if (age > 3600000) { // 1 hour
          await kv.del(`csrf_token_${token.token}`);
          cleaned++;
        }
      }
      
      if (cleaned > 0) {
        console.log(`🧹 Cleaned ${cleaned} expired CSRF tokens`);
      }
    } catch (error) {
      console.error('Error cleaning CSRF tokens:', error);
    }
  }, 3600000); // 1 hour
}
