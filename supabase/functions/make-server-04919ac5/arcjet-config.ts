// Configuration de sécurité avancée pour Deno Edge Functions
// Solution native compatible Deno avec rate limiting en mémoire

const ARCJET_KEY = Deno.env.get("ARCJET_KEY");

if (!ARCJET_KEY) {
  console.warn("⚠️  ARCJET_KEY non configurée - Utilisation rate limiting natif");
} else {
  console.log(`✅ Clé configurée: ${ARCJET_KEY.substring(0, 15)}...`);
}

// Store en mémoire pour rate limiting (simple mais efficace pour instance unique)
const rateLimitStore = new Map<string, { count: number; firstRequest: number; windowMs: number }>();

// Nettoyage automatique des entrées expirées toutes les minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.firstRequest > entry.windowMs) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

// ===== RATE LIMITING EN MÉMOIRE =====
export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  
  const entry = rateLimitStore.get(key);
  
  if (!entry || now - entry.firstRequest > windowMs) {
    // Nouvelle fenêtre
    rateLimitStore.set(key, {
      count: 1,
      firstRequest: now,
      windowMs: windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    console.warn(`🚫 Rate limit exceeded: ${identifier} (${entry.count}/${maxRequests})`);
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  rateLimitStore.set(key, entry);
  return { allowed: true, remaining: maxRequests - entry.count };
}

// ===== VALIDATION EMAIL =====
const DISPOSABLE_DOMAINS = new Set([
  'yopmail.com', 'tempmail.com', 'guerrillamail.com', 'mailinator.com',
  '10minutemail.com', 'trashmail.com', 'throwaway.email', 'temp-mail.org',
  'getnada.com', 'emailondeck.com', 'maildrop.cc', 'fakeinbox.com'
]);

export function validateEmail(email: string): { valid: boolean; reason?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'FORMAT_INVALIDE' };
  }

  const domain = email.split('@')[1]?.toLowerCase();
  if (domain && DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, reason: 'EMAIL_JETABLE' };
  }

  return { valid: true };
}

// ===== BOT DETECTION =====
export function detectBot(userAgent: string): boolean {
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /curl/i, /wget/i, /python/i, /java/i
  ];
  return botPatterns.some(pattern => pattern.test(userAgent));
}

// ===== MIDDLEWARE HONO =====
export function arcjetMiddleware(aj: any) {
  return async (c: any, next: any) => {
    const ip = c.req.header('x-forwarded-for') || 'unknown';
    const globalLimit = checkRateLimit(`global:${ip}`, 60, 60 * 1000);
    
    if (!globalLimit.allowed) {
      console.warn(`🚫 Global rate limit: ${ip}`);
      return c.json({ error: "Trop de requêtes" }, 429);
    }

    await next();
  };
}

// ===== PROTECTION AUTH =====
export function protectAuthRoute(c: any): boolean {
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
  
  const authLimit = checkRateLimit(`auth:${ip}`, 5, 5 * 60 * 1000);
  
  if (!authLimit.allowed) {
    console.warn(`🚫 Auth rate limit: ${ip} - BLOCKED`);
    return false;
  }
  
  console.log(`✅ Auth allowed: ${ip} (${authLimit.remaining} remaining)`);
  return true;
}

// ===== VALIDATION EMAIL =====
export async function validateEmailWithArcjet(email: string) {
  const result = validateEmail(email);
  if (!result.valid) {
    console.warn(`📧 Email rejeté: ${email} (${result.reason})`);
  }
  return result;
}

// ===== DETECTION BOT =====
export async function checkForBot(c: any): Promise<boolean> {
  const userAgent = c.req.header('user-agent') || '';
  const isBot = detectBot(userAgent);
  if (isBot) console.warn(`🤖 Bot: ${userAgent}`);
  return isBot;
}

const aj = { protect: async () => ({ conclusion: "ALLOW" }) };
export default aj;

console.log("✅ Sécurité Deno native: Rate limiting + Email validation + Bot detection");
