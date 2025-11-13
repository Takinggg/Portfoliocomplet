import { useEffect, useState } from 'react';
import { sanitizeEmail, sanitizeName, sanitizeText, rateLimiter } from '@/utils/security';

/**
 * Hook de validation sécurisée des formulaires
 */
export function useSecureForm() {
  const [csrfToken, setCSRFToken] = useState<string>('');
  
  useEffect(() => {
    // Générer un token CSRF unique pour ce formulaire
    const token = crypto.randomUUID();
    setCSRFToken(token);
    sessionStorage.setItem(`form_csrf_${token}`, 'valid');
  }, []);
  
  const validateSubmission = (formId: string): boolean => {
    // Rate limiting - max 5 soumissions par minute
    if (!rateLimiter.check(`form_${formId}`, 5, 60000)) {
      throw new Error('Trop de tentatives. Veuillez patienter.');
    }
    
    // Valider le token CSRF
    const storedToken = sessionStorage.getItem(`form_csrf_${csrfToken}`);
    if (storedToken !== 'valid') {
      throw new Error('Token CSRF invalide');
    }
    
    return true;
  };
  
  const sanitizeFormData = (data: Record<string, any>): Record<string, any> => {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        // Déterminer le type de champ et appliquer la sanitization appropriée
        if (key.includes('email')) {
          sanitized[key] = sanitizeEmail(value);
        } else if (key.includes('name') || key.includes('nom') || key.includes('prenom')) {
          sanitized[key] = sanitizeName(value);
        } else {
          sanitized[key] = sanitizeText(value);
        }
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  };
  
  return {
    csrfToken,
    validateSubmission,
    sanitizeFormData
  };
}

/**
 * Hook de détection d'attaques
 */
export function useSecurityMonitoring() {
  useEffect(() => {
    // Détecter les tentatives d'injection de scripts
    const detectXSS = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.value && /<script|javascript:|onerror|onload/i.test(target.value)) {
        console.warn('⚠️ Tentative XSS détectée:', target.name);
        target.value = target.value.replace(/<script|javascript:|onerror|onload/gi, '');
      }
    };
    
    // Surveiller tous les inputs
    document.addEventListener('input', detectXSS);
    
    // Détecter les tentatives de devtools
    let devtoolsOpen = false;
    const detectDevTools = () => {
      const threshold = 160;
      if (window.outerWidth - window.innerWidth > threshold || 
          window.outerHeight - window.innerHeight > threshold) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          console.warn('🔍 DevTools détecté - Mode développement');
        }
      } else {
        devtoolsOpen = false;
      }
    };
    
    if (import.meta.env.PROD) {
      const interval = setInterval(detectDevTools, 1000);
      return () => {
        document.removeEventListener('input', detectXSS);
        clearInterval(interval);
      };
    }
    
    return () => {
      document.removeEventListener('input', detectXSS);
    };
  }, []);
}

/**
 * Hook de protection contre le clickjacking
 */
export function useClickjackingProtection() {
  useEffect(() => {
    // Vérifier si le site est dans un iframe
    if (window.self !== window.top) {
      // Empêcher l'affichage dans un iframe
      document.body.style.display = 'none';
      console.error('🚨 Clickjacking détecté - Site chargé dans un iframe');
      
      // Tenter de sortir de l'iframe
      try {
        window.top!.location.href = window.self.location.href;
      } catch {
        // Bloqué par CORS - c'est normal et sécurisé
      }
    }
  }, []);
}

/**
 * Hook de session sécurisée
 */
export function useSecureSession() {
  const [sessionValid, setSessionValid] = useState(true);
  
  useEffect(() => {
    // Vérifier l'intégrité de la session
    const checkSession = () => {
      const sessionStart = sessionStorage.getItem('session_start');
      const sessionToken = sessionStorage.getItem('session_token');
      
      if (!sessionStart || !sessionToken) {
        setSessionValid(false);
        return;
      }
      
      // Session expire après 24h d'inactivité
      const startTime = parseInt(sessionStart);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24h
      
      if (now - startTime > maxAge) {
        sessionStorage.clear();
        setSessionValid(false);
        console.warn('⏰ Session expirée');
      }
    };
    
    // Initialiser la session si nécessaire
    if (!sessionStorage.getItem('session_start')) {
      sessionStorage.setItem('session_start', Date.now().toString());
      sessionStorage.setItem('session_token', crypto.randomUUID());
    }
    
    // Vérifier toutes les 5 minutes
    checkSession();
    const interval = setInterval(checkSession, 5 * 60 * 1000);
    
    // Mettre à jour le timestamp lors de l'activité
    const updateActivity = () => {
      sessionStorage.setItem('last_activity', Date.now().toString());
    };
    
    document.addEventListener('click', updateActivity);
    document.addEventListener('keypress', updateActivity);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('click', updateActivity);
      document.removeEventListener('keypress', updateActivity);
    };
  }, []);
  
  return { sessionValid };
}
