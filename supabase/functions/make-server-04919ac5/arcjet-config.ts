// Arcjet Configuration pour le backend
// Protection avancée: Rate limiting, Bot detection, Shield
import arcjet, { shield, tokenBucket, detectBot, validateEmail } from "@arcjet/node";

// Récupération de la clé Arcjet depuis les variables d'environnement Deno
const ARCJET_KEY = Deno.env.get("ARCJET_KEY");

if (!ARCJET_KEY) {
  console.warn("⚠️  ARCJET_KEY non configurée - Protection désactivée");
  console.warn("   Ajoutez la clé dans Supabase Dashboard → Edge Functions → Secrets");
} else {
  console.log(`✅ Arcjet configuré avec clé: ${ARCJET_KEY.substring(0, 15)}...`);
}

// Initialisation Arcjet
// Note: La clé ARCJET_KEY doit être ajoutée aux secrets Supabase Edge Function
const aj = arcjet({
  key: ARCJET_KEY || "ajkey_test_disabled",
  rules: [
    // Shield - Protection DDoS et attaques réseau
    shield({
      mode: "LIVE", // "LIVE" en production, "DRY_RUN" pour tester
    }),
    
    // Rate limiting global - Token bucket algorithm
    tokenBucket({
      mode: "LIVE",
      characteristics: ["ip"], // Limite par IP
      refillRate: 60, // 60 tokens par intervalle
      interval: "1m", // Par minute
      capacity: 120, // Capacité max du bucket
    }),
  ],
});

// Rate limiter spécifique pour authentification (plus strict)
export const authRateLimiter = arcjet({
  key: ARCJET_KEY || "ajkey_test_disabled",
  rules: [
    tokenBucket({
      mode: "LIVE",
      characteristics: ["ip"],
      refillRate: 5, // Seulement 5 tentatives
      interval: "5m", // Par 5 minutes
      capacity: 10,
    }),
  ],
});

// Rate limiter pour API publiques (modéré)
export const apiRateLimiter = arcjet({
  key: ARCJET_KEY || "ajkey_test_disabled",
  rules: [
    tokenBucket({
      mode: "LIVE",
      characteristics: ["ip"],
      refillRate: 100,
      interval: "1m",
      capacity: 200,
    }),
  ],
});

// Bot detector pour formulaires
export const botDetector = arcjet({
  key: ARCJET_KEY || "ajkey_test_disabled",
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [], // Pas de bots autorisés par défaut
    }),
  ],
});

// Email validator avancé
export const emailValidator = arcjet({
  key: ARCJET_KEY || "ajkey_test_disabled",
  rules: [
    validateEmail({
      mode: "LIVE",
      block: ["DISPOSABLE", "NO_MX_RECORDS"], // Bloquer emails jetables et sans MX
    }),
  ],
});

export default aj;

// Type helpers pour Deno/Supabase Edge Functions
export interface ArcjetRequest {
  ip?: string;
  method?: string;
  protocol?: string;
  host?: string;
  path?: string;
  headers?: Record<string, string>;
  cookies?: string;
  query?: string;
  email?: string;
}

/**
 * Middleware Arcjet pour Hono
 * Usage: app.use(arcjetMiddleware(aj))
 */
export function arcjetMiddleware(arcjetInstance: any) {
  return async (c: any, next: any) => {
    try {
      // Extraire les infos de la requête
      const request: ArcjetRequest = {
        ip: c.req.header("x-forwarded-for") || c.req.header("cf-connecting-ip") || "unknown",
        method: c.req.method,
        host: c.req.header("host"),
        path: c.req.path,
        headers: Object.fromEntries(c.req.raw.headers.entries()),
      };

      // Vérifier avec Arcjet
      const decision = await arcjetInstance.protect(c.req, request);

      // Loguer la décision
      console.log("Arcjet decision:", {
        id: decision.id,
        conclusion: decision.conclusion,
        reason: decision.reason,
        ip: request.ip,
      });

      // Bloquer si nécessaire
      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
          return c.json(
            {
              error: "Too many requests",
              message: "Vous avez atteint la limite de requêtes. Veuillez réessayer plus tard.",
              retryAfter: Math.ceil(decision.reason.resetTime / 1000),
            },
            429
          );
        }

        if (decision.reason.isBot()) {
          return c.json(
            {
              error: "Bot detected",
              message: "Activité bot détectée. Accès refusé.",
            },
            403
          );
        }

        if (decision.reason.isShield()) {
          return c.json(
            {
              error: "Security shield",
              message: "Requête suspecte bloquée par le shield de sécurité.",
            },
            403
          );
        }

        // Autre raison
        return c.json(
          {
            error: "Access denied",
            message: "Accès refusé pour raisons de sécurité.",
          },
          403
        );
      }

      // Ajouter les infos Arcjet au contexte
      c.set("arcjetDecision", decision);

      await next();
    } catch (error) {
      // En cas d'erreur Arcjet, loguer mais continuer (fail open)
      console.error("Arcjet error:", error);
      await next();
    }
  };
}

/**
 * Protection spécifique pour les routes d'authentification
 */
export async function protectAuthRoute(c: any): Promise<boolean> {
  const request: ArcjetRequest = {
    ip: c.req.header("x-forwarded-for") || c.req.header("cf-connecting-ip") || "unknown",
    method: c.req.method,
    path: c.req.path,
  };

  const decision = await authRateLimiter.protect(c.req, request);

  if (decision.isDenied()) {
    console.warn("Auth rate limit exceeded:", request.ip);
    return false;
  }

  return true;
}

/**
 * Validation d'email avec Arcjet
 */
export async function validateEmailWithArcjet(email: string): Promise<{
  valid: boolean;
  reason?: string;
}> {
  try {
    const decision = await emailValidator.protect({} as any, { email });

    if (decision.isDenied()) {
      return {
        valid: false,
        reason: decision.reason.message || "Email invalide",
      };
    }

    return { valid: true };
  } catch (error) {
    console.error("Arcjet email validation error:", error);
    // Fail open - si Arcjet ne répond pas, accepter l'email
    return { valid: true };
  }
}

/**
 * Détection de bot pour formulaires
 */
export async function checkForBot(c: any): Promise<boolean> {
  try {
    const request: ArcjetRequest = {
      ip: c.req.header("x-forwarded-for") || c.req.header("cf-connecting-ip") || "unknown",
      headers: Object.fromEntries(c.req.raw.headers.entries()),
    };

    const decision = await botDetector.protect(c.req, request);

    if (decision.isDenied() && decision.reason.isBot()) {
      console.warn("Bot detected:", request.ip);
      return true; // C'est un bot
    }

    return false; // Pas un bot
  } catch (error) {
    console.error("Bot detection error:", error);
    return false; // Fail open
  }
}
