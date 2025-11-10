/**
 * Analytics Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. GOOGLE ANALYTICS 4 (GA4)
 *    - Go to: https://analytics.google.com
 *    - Create a new property (GA4)
 *    - Copy your Measurement ID (format: G-XXXXXXXXXX)
 *    - Paste it in GA4_MEASUREMENT_ID below
 * 
 * 2. MICROSOFT CLARITY
 *    - Go to: https://clarity.microsoft.com
 *    - Create a new project
 *    - Copy your Project ID
 *    - Paste it in CLARITY_PROJECT_ID below
 *    - This gives you FREE heatmaps and session recordings!
 * 
 * 3. SENTRY (Error Tracking)
 *    - Go to: https://sentry.io
 *    - Create a new project (JavaScript)
 *    - Copy your DSN
 *    - Paste it in SENTRY_DSN below
 *    - Free tier includes 5,000 errors/month
 * 
 * 4. PLAUSIBLE (Optional - Privacy-friendly alternative to GA)
 *    - Go to: https://plausible.io
 *    - Add your site
 *    - Use your domain name in PLAUSIBLE_DOMAIN
 *    - Leave empty if not using Plausible
 */

export const analyticsConfig = {
  // Google Analytics 4 (GA4)
  // Get your ID from: https://analytics.google.com
  GA4_MEASUREMENT_ID: "G-XXXXXXXXXX", // REPLACE WITH YOUR GA4 ID
  
  // Microsoft Clarity (FREE heatmaps & session recordings)
  // Get your ID from: https://clarity.microsoft.com
  CLARITY_PROJECT_ID: "", // REPLACE WITH YOUR CLARITY PROJECT ID
  
  // Sentry Error Tracking
  // Get your DSN from: https://sentry.io
  SENTRY_DSN: "", // REPLACE WITH YOUR SENTRY DSN
  
  // Plausible Analytics (Optional - privacy-friendly alternative)
  // Only fill if you're using Plausible instead of GA4
  PLAUSIBLE_DOMAIN: "", // e.g., "yourdomain.com"
  
  // Feature flags
  ENABLE_GA4: true,
  ENABLE_CLARITY: true,
  ENABLE_SENTRY: true,
  ENABLE_PLAUSIBLE: false, // Set to true if using Plausible
  
  // Privacy settings
  RESPECT_DO_NOT_TRACK: true, // Respect browser's Do Not Track setting
  ANONYMIZE_IP: true, // Anonymize IP addresses (GDPR compliance)
  
  // Performance tracking
  TRACK_PAGE_PERFORMANCE: true,
  TRACK_SCROLL_DEPTH: true,
  TRACK_ENGAGEMENT_TIME: true,
  
  // Debug mode (shows console logs)
  DEBUG: typeof window !== 'undefined' && window.location.hostname === 'localhost',
};

/**
 * Validation function to check if analytics is properly configured
 */
export function validateAnalyticsConfig() {
  const warnings: string[] = [];
  
  if (!analyticsConfig.GA4_MEASUREMENT_ID || analyticsConfig.GA4_MEASUREMENT_ID === "G-XXXXXXXXXX") {
    warnings.push("⚠️ Google Analytics 4: No valid Measurement ID configured");
  }
  
  if (!analyticsConfig.CLARITY_PROJECT_ID) {
    warnings.push("⚠️ Microsoft Clarity: No Project ID configured (FREE heatmaps available!)");
  }
  
  if (!analyticsConfig.SENTRY_DSN) {
    warnings.push("⚠️ Sentry: No DSN configured (error tracking disabled)");
  }
  
  if (warnings.length > 0 && analyticsConfig.DEBUG) {
    console.group("📊 Analytics Configuration Status");
    warnings.forEach(warning => console.warn(warning));
    console.log("\n📚 Setup Guide: See /utils/analyticsConfig.ts for instructions");
    console.groupEnd();
  }
  
  return warnings.length === 0;
}

/**
 * Get analytics config for initialization
 */
export function getAnalyticsConfig() {
  return {
    ga4Id: analyticsConfig.ENABLE_GA4 ? analyticsConfig.GA4_MEASUREMENT_ID : undefined,
    clarityId: analyticsConfig.ENABLE_CLARITY ? analyticsConfig.CLARITY_PROJECT_ID : undefined,
    sentryDsn: analyticsConfig.ENABLE_SENTRY ? analyticsConfig.SENTRY_DSN : undefined,
    plausibleDomain: analyticsConfig.ENABLE_PLAUSIBLE ? analyticsConfig.PLAUSIBLE_DOMAIN : undefined,
    enabled: true,
  };
}
