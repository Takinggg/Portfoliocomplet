// Utilitaire de validation et sanitization des inputs
// Protection contre XSS, injection SQL, et autres attaques

/**
 * Valide et nettoie une adresse email
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  
  // Trim et lowercase
  email = email.trim().toLowerCase();
  
  // Regex stricte pour email
  const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  
  if (!emailRegex.test(email)) {
    throw new Error('Email invalide');
  }
  
  // Limite de longueur
  if (email.length > 254) {
    throw new Error('Email trop long');
  }
  
  return email;
}

/**
 * Valide et nettoie un nom/prénom
 */
export function sanitizeName(name: string): string {
  if (!name || typeof name !== 'string') return '';
  
  // Trim
  name = name.trim();
  
  // Supprimer les caractères dangereux
  name = name.replace(/[<>\"'`]/g, '');
  
  // Limite de longueur
  if (name.length > 100) {
    name = name.substring(0, 100);
  }
  
  // Au moins 1 caractère
  if (name.length === 0) {
    throw new Error('Nom invalide');
  }
  
  return name;
}

/**
 * Valide et nettoie un numéro de téléphone
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  
  // Supprimer tout sauf chiffres, +, -, (, ), espace
  phone = phone.replace(/[^0-9+\-() ]/g, '');
  
  // Trim
  phone = phone.trim();
  
  // Limite de longueur
  if (phone.length > 20) {
    phone = phone.substring(0, 20);
  }
  
  return phone;
}

/**
 * Valide et nettoie une URL
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  try {
    const parsed = new URL(url);
    
    // Autoriser seulement HTTP(S)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Protocole non autorisé');
    }
    
    // Limite de longueur
    if (url.length > 2048) {
      throw new Error('URL trop longue');
    }
    
    return parsed.toString();
  } catch {
    throw new Error('URL invalide');
  }
}

/**
 * Nettoie le HTML pour éviter XSS
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  // Supprimer les balises script
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Supprimer les événements inline (onclick, onerror, etc.)
  html = html.replace(/\s*on\w+\s*=\s*['""][^'""]*['""]|on\w+\s*=\s*\S+/gi, '');
  
  // Supprimer javascript: dans les URLs
  html = html.replace(/javascript:/gi, '');
  
  // Supprimer data: URLs (sauf images)
  html = html.replace(/data:(?!image)[^,]*,/gi, '');
  
  return html;
}

/**
 * Valide un token JWT/UUID
 */
export function sanitizeToken(token: string): string {
  if (!token || typeof token !== 'string') {
    throw new Error('Token invalide');
  }
  
  token = token.trim();
  
  // UUID regex
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  // JWT regex (simplifié)
  const jwtRegex = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
  
  if (!uuidRegex.test(token) && !jwtRegex.test(token)) {
    throw new Error('Format de token invalide');
  }
  
  if (token.length > 1000) {
    throw new Error('Token trop long');
  }
  
  return token;
}

/**
 * Valide un montant (prix, facture, etc.)
 */
export function sanitizeAmount(amount: any): number {
  const parsed = parseFloat(amount);
  
  if (isNaN(parsed) || !isFinite(parsed)) {
    throw new Error('Montant invalide');
  }
  
  if (parsed < 0) {
    throw new Error('Montant négatif non autorisé');
  }
  
  if (parsed > 1000000) {
    throw new Error('Montant trop élevé');
  }
  
  // Arrondir à 2 décimales
  return Math.round(parsed * 100) / 100;
}

/**
 * Valide et nettoie un texte général
 */
export function sanitizeText(text: string, maxLength: number = 5000): string {
  if (!text || typeof text !== 'string') return '';
  
  // Trim
  text = text.trim();
  
  // Limiter la longueur
  if (text.length > maxLength) {
    text = text.substring(0, maxLength);
  }
  
  // Supprimer les balises HTML
  text = text.replace(/<[^>]*>/g, '');
  
  // Échapper les caractères spéciaux
  text = text.replace(/[<>\"'`]/g, (char) => {
    const entities: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;'
    };
    return entities[char] || char;
  });
  
  return text;
}

/**
 * Rate limiting côté client
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  /**
   * Vérifie si une action est autorisée
   * @param key - Identifiant unique de l'action (ex: 'login:user@email.com')
   * @param maxAttempts - Nombre max de tentatives
   * @param windowMs - Fenêtre de temps en millisecondes
   */
  check(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Nettoyer les anciennes tentatives
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    // Ajouter la nouvelle tentative
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }
  
  /**
   * Réinitialise les tentatives pour une clé
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Vérifie la force d'un mot de passe
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
  score: number;
} {
  const errors: string[] = [];
  let score = 0;
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  } else {
    score += 1;
  }
  
  if (password.length >= 12) {
    score += 1;
  }
  
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  } else {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }
  
  // Vérifier les mots de passe communs
  const commonPasswords = ['password', '12345678', 'qwerty', 'azerty', 'admin'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Le mot de passe est trop commun');
    score = 0;
  }
  
  return {
    isValid: errors.length === 0 && score >= 4,
    errors,
    score
  };
}

/**
 * Protection CSRF - Génère un token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Stockage sécurisé du token CSRF
 */
export function setCSRFToken(): string {
  const token = generateCSRFToken();
  sessionStorage.setItem('csrf_token', token);
  return token;
}

/**
 * Validation du token CSRF
 */
export function validateCSRFToken(token: string): boolean {
  const storedToken = sessionStorage.getItem('csrf_token');
  return storedToken === token;
}
