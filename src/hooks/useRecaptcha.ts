import { useCallback } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

/**
 * Hook pour générer des tokens reCAPTCHA v3
 * 
 * Usage:
 * ```tsx
 * const { executeRecaptcha } = useRecaptcha();
 * 
 * const handleSubmit = async () => {
 *   const token = await executeRecaptcha('login');
 *   // Envoyer token au backend
 * };
 * ```
 */
export function useRecaptcha() {
  const executeRecaptcha = useCallback(async (action: string = 'submit'): Promise<string> => {
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('⚠️  reCAPTCHA not configured - skipping verification');
      return '';
    }

    if (!window.grecaptcha) {
      console.error('❌ reCAPTCHA script not loaded');
      return '';
    }

    try {
      return await new Promise<string>((resolve) => {
        window.grecaptcha.ready(async () => {
          try {
            const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
            console.log('✅ reCAPTCHA token generated for action:', action);
            resolve(token);
          } catch (error) {
            console.error('❌ reCAPTCHA execute failed:', error);
            resolve('');
          }
        });
      });
    } catch (error) {
      console.error('❌ reCAPTCHA error:', error);
      return '';
    }
  }, []);

  return { executeRecaptcha };
}

/**
 * Composant à ajouter dans index.html:
 * 
 * <script src="https://www.google.com/recaptcha/api.js?render=VOTRE_SITE_KEY"></script>
 * 
 * Remplacez VOTRE_SITE_KEY par la clé publique reCAPTCHA.
 */
