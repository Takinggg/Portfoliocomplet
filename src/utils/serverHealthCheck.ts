import { projectId, publicAnonKey } from './supabase/info';

/**
 * Check if the Supabase Edge Function server is healthy
 * This should be called before making any other API requests
 */
export async function checkServerHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        signal: controller.signal,
      }
    );
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

// Auto-run on import to provide early feedback
checkServerHealth().then(isHealthy => {
  // Store result for startup message
  if (!isHealthy) {
    (console as any).__serverOffline = true;
    // Silent by default - the modal and alert will handle UX
  } else {
    (console as any).__serverOffline = false;
    console.log("✅ Serveur Edge Function opérationnel");
  }
});
