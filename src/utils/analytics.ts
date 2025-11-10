/**
 * Complete Analytics System
 * - Google Analytics 4 (GA4) for general analytics
 * - Microsoft Clarity for heatmaps and session recordings
 * - Sentry for error tracking
 * - Custom event tracking for conversions
 */

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface AnalyticsConfig {
  ga4Id?: string;
  clarityId?: string;
  sentryDsn?: string;
  plausibleDomain?: string;
  enabled?: boolean;
}

// Analytics Configuration
// Add your IDs here or use environment variables
const config: AnalyticsConfig = {
  // Google Analytics 4 - Get your ID from https://analytics.google.com
  ga4Id: typeof window !== 'undefined' ? (window as any).__GA4_ID__ || "G-XXXXXXXXXX" : undefined,
  
  // Microsoft Clarity - Get your ID from https://clarity.microsoft.com
  clarityId: typeof window !== 'undefined' ? (window as any).__CLARITY_ID__ || undefined : undefined,
  
  // Sentry DSN - Get from https://sentry.io
  sentryDsn: typeof window !== 'undefined' ? (window as any).__SENTRY_DSN__ || undefined : undefined,
  
  // Plausible (optional privacy-friendly alternative)
  plausibleDomain: typeof window !== 'undefined' ? (window as any).__PLAUSIBLE_DOMAIN__ || undefined : undefined,
  
  enabled: true,
};

// Initialize Google Analytics 4
function initGA4(measurementId: string) {
  if (typeof window === "undefined" || (window as any).gtag) return;
  
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).gtag = function() { (window as any).dataLayer.push(arguments); };
  (window as any).gtag("js", new Date());
  (window as any).gtag("config", measurementId, {
    send_page_view: true,
    anonymize_ip: true, // GDPR compliance
  });

  console.log("✅ Google Analytics 4 initialized:", measurementId);
}

// Initialize Microsoft Clarity
function initClarity(clarityId: string) {
  if (typeof window === "undefined" || (window as any).clarity) return;

  (window as any).clarity = (window as any).clarity || function() {
    ((window as any).clarity.q = (window as any).clarity.q || []).push(arguments);
  };

  const script = document.createElement("script");
  script.innerHTML = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${clarityId}");
  `;
  document.head.appendChild(script);

  console.log("✅ Microsoft Clarity initialized:", clarityId);
}

// Initialize Sentry
function initSentry(dsn: string) {
  if (typeof window === "undefined" || (window as any).Sentry) return;

  const script = document.createElement("script");
  script.src = "https://browser.sentry-cdn.com/7.x/bundle.min.js";
  script.integrity = "sha384-xxx"; // Add integrity hash in production
  script.crossOrigin = "anonymous";
  script.onload = () => {
    if ((window as any).Sentry) {
      (window as any).Sentry.init({
        dsn: dsn,
        environment: window.location.hostname === "localhost" ? "development" : "production",
        tracesSampleRate: 0.1, // 10% of transactions for performance monitoring
        replaysSessionSampleRate: 0.1, // 10% of sessions
        replaysOnErrorSampleRate: 1.0, // 100% when errors occur
        integrations: [
          new (window as any).Sentry.BrowserTracing(),
          new (window as any).Sentry.Replay(),
        ],
      });
      console.log("✅ Sentry initialized");
    }
  };
  document.head.appendChild(script);
}

// Initialize Plausible Analytics (privacy-friendly alternative)
function initPlausible(domain: string) {
  if (typeof window === "undefined" || (window as any).plausible) return;
  
  const script = document.createElement("script");
  script.src = "https://plausible.io/js/script.js";
  script.defer = true;
  script.setAttribute("data-domain", domain);
  document.head.appendChild(script);

  console.log("✅ Plausible Analytics initialized:", domain);
}

// Initialize analytics session
async function initSession() {
  if (typeof window === "undefined") return;
  
  const sessionId = getSessionId();
  const sessionStart = sessionStorage.getItem("analytics_session_start");
  
  // Check server availability first
  const isAvailable = await checkServerAvailability();
  if (!isAvailable) {
    return; // Skip server-side session tracking if server is not available
  }
  
  // If it's a new session, track session start
  if (sessionStart) {
    const startTime = parseInt(sessionStart);
    const now = Date.now();
    
    // If session is older than 30 minutes, it's a new session
    if (now - startTime > 30 * 60 * 1000) {
      // Start new session
      sessionStorage.removeItem("analytics_session_id");
      sessionStorage.removeItem("analytics_session_start");
      const newSessionId = getSessionId();
      
      sendToServer("session/start", {
        sessionId: newSessionId,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      });
    }
  } else {
    // First time - track session start
    sendToServer("session/start", {
      sessionId,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    });
  }
  
  // Track session end on page unload
  window.addEventListener("beforeunload", () => {
    const sessionStart = sessionStorage.getItem("analytics_session_start");
    if (sessionStart && serverAvailable !== false) {
      const duration = Math.floor((Date.now() - parseInt(sessionStart)) / 1000);
      
      // Use sendBeacon for reliable tracking on page unload
      const projectId = (window as any).__SUPABASE_PROJECT_ID__;
      const anonKey = (window as any).__SUPABASE_ANON_KEY__;
      
      if (projectId && anonKey) {
        const data = JSON.stringify({ sessionId, duration });
        // Only send if server was previously available
        try {
          navigator.sendBeacon(
            `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/analytics/session/end`,
            new Blob([data], { type: "application/json" })
          );
        } catch (e) {
          // Silent fail
        }
      }
    }
  });
}

// Main initialization function
export function initAnalytics(customConfig?: Partial<AnalyticsConfig>) {
  const finalConfig = { ...config, ...customConfig };
  
  // Check if analytics should be enabled (respecting user privacy)
  const analyticsEnabled = finalConfig.enabled && 
    (!navigator.doNotTrack || navigator.doNotTrack !== "1");
  
  if (!analyticsEnabled) {
    console.log("📊 Analytics disabled by user preference (Do Not Track)");
    return;
  }

  // Initialize Google Analytics 4
  if (finalConfig.ga4Id && finalConfig.ga4Id !== "G-XXXXXXXXXX") {
    initGA4(finalConfig.ga4Id);
  } else {
    console.log("⚠️ Google Analytics: Add your GA4 Measurement ID");
    console.log("   Get it from: https://analytics.google.com");
    console.log("   Set window.__GA4_ID__ or update analytics.ts");
  }

  // Initialize Microsoft Clarity
  if (finalConfig.clarityId) {
    initClarity(finalConfig.clarityId);
  } else {
    console.log("⚠️ Microsoft Clarity: Add your Project ID");
    console.log("   Get it from: https://clarity.microsoft.com");
    console.log("   Set window.__CLARITY_ID__ or update analytics.ts");
  }

  // Initialize Sentry
  if (finalConfig.sentryDsn) {
    initSentry(finalConfig.sentryDsn);
  } else {
    console.log("⚠️ Sentry: Add your DSN");
    console.log("   Get it from: https://sentry.io");
    console.log("   Set window.__SENTRY_DSN__ or update analytics.ts");
  }

  // Initialize Plausible (optional)
  if (finalConfig.plausibleDomain) {
    initPlausible(finalConfig.plausibleDomain);
  }
  
  // Initialize session tracking for our server analytics
  initSession();

  console.log("📊 Analytics system initialized");
}

// Get or create session ID
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
    sessionStorage.setItem("analytics_session_start", Date.now().toString());
  }
  return sessionId;
}

// Check if server is available (cached result)
let serverAvailable: boolean | null = null;
let lastServerCheck = 0;
const SERVER_CHECK_INTERVAL = 60000; // 1 minute

async function checkServerAvailability(): Promise<boolean> {
  // Use cached result if check was recent
  const now = Date.now();
  if (serverAvailable !== null && now - lastServerCheck < SERVER_CHECK_INTERVAL) {
    return serverAvailable;
  }

  try {
    const projectId = (window as any).__SUPABASE_PROJECT_ID__;
    const anonKey = (window as any).__SUPABASE_ANON_KEY__;
    
    if (!projectId || !anonKey) {
      serverAvailable = false;
      lastServerCheck = now;
      return false;
    }

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/health`,
      {
        method: "GET",
        headers: { "Authorization": `Bearer ${anonKey}` },
        signal: AbortSignal.timeout(3000), // 3 second timeout
      }
    );

    serverAvailable = response.ok;
    lastServerCheck = now;
    return response.ok;
  } catch (error) {
    serverAvailable = false;
    lastServerCheck = now;
    return false;
  }
}

// Send analytics event to server (only if server is available)
async function sendToServer(endpoint: string, data: any) {
  try {
    const projectId = (window as any).__SUPABASE_PROJECT_ID__;
    const anonKey = (window as any).__SUPABASE_ANON_KEY__;
    
    if (!projectId || !anonKey) {
      return; // Silent fail - analytics is optional
    }

    // Check if server is available before sending
    const isAvailable = await checkServerAvailability();
    if (!isAvailable) {
      return; // Silent fail - server not available
    }

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/analytics/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${anonKey}`,
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      }
    );

    if (!response.ok) {
      // Mark server as unavailable if we get 404
      if (response.status === 404) {
        serverAvailable = false;
      }
    }
  } catch (error) {
    // Silent fail - analytics errors should not break the app
    // Only log in development
    if (window.location.hostname === "localhost") {
      console.debug("Analytics server unavailable:", endpoint);
    }
  }
}

// Track page view
export function trackPageView(pageName: string, pageTitle?: string) {
  try {
    // Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "page_view", {
        page_title: pageTitle || pageName,
        page_location: window.location.href,
        page_path: window.location.pathname,
      });
    }

    // Plausible
    if (typeof window !== "undefined" && (window as any).plausible) {
      (window as any).plausible("pageview");
    }

    // Send to our server for real-time tracking
    if (typeof window !== "undefined") {
      const sessionId = getSessionId();
      sendToServer("pageview", {
        sessionId,
        page: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      });
    }

    console.log(`📊 Page view tracked: ${pageName}`);
  } catch (error) {
    console.error("Analytics tracking error:", error);
  }
}

// Track custom event
export function trackEvent({ action, category, label, value }: AnalyticsEvent) {
  try {
    // Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }

    // Plausible custom events
    if (typeof window !== "undefined" && (window as any).plausible) {
      (window as any).plausible(action, {
        props: {
          category,
          label,
          value,
        },
      });
    }

    console.log(`📊 Event tracked: ${category} - ${action}`, { label, value });
  } catch (error) {
    console.error("Analytics event tracking error:", error);
  }
}

// Common tracking helpers
export const analytics = {
  // Track CTA clicks
  trackCTA: (ctaName: string, location: string) => {
    trackEvent({
      action: "click",
      category: "CTA",
      label: `${ctaName} - ${location}`,
    });
  },

  // Track form submissions
  trackFormSubmit: (formName: string) => {
    trackEvent({
      action: "submit",
      category: "Form",
      label: formName,
    });
  },

  // Track form errors
  trackFormError: (formName: string, errorType: string) => {
    trackEvent({
      action: "error",
      category: "Form",
      label: `${formName} - ${errorType}`,
    });
  },

  // Track downloads
  trackDownload: (fileName: string, fileType: string) => {
    trackEvent({
      action: "download",
      category: "Resource",
      label: `${fileName} (${fileType})`,
    });
  },

  // Track video plays
  trackVideoPlay: (videoTitle: string) => {
    trackEvent({
      action: "play",
      category: "Video",
      label: videoTitle,
    });
  },

  // Track outbound links
  trackOutboundLink: (url: string, linkText: string) => {
    trackEvent({
      action: "click",
      category: "Outbound Link",
      label: `${linkText} - ${url}`,
    });
  },

  // Track search
  trackSearch: (searchTerm: string, resultsCount: number) => {
    trackEvent({
      action: "search",
      category: "Search",
      label: searchTerm,
      value: resultsCount,
    });
  },

  // Track newsletter signup
  trackNewsletterSignup: (source: string) => {
    trackEvent({
      action: "signup",
      category: "Newsletter",
      label: source,
    });
  },

  // Track booking
  trackBooking: (bookingType: string) => {
    trackEvent({
      action: "book",
      category: "Booking",
      label: bookingType,
    });
  },

  // Track project view
  trackProjectView: (projectName: string) => {
    trackEvent({
      action: "view",
      category: "Project",
      label: projectName,
    });
  },

  // Track blog post read
  trackBlogRead: (postTitle: string, readingTime: number) => {
    trackEvent({
      action: "read",
      category: "Blog",
      label: postTitle,
      value: readingTime,
    });
  },

  // Track social share
  trackSocialShare: (platform: string, contentType: string, contentTitle: string) => {
    trackEvent({
      action: "share",
      category: "Social",
      label: `${platform} - ${contentType}: ${contentTitle}`,
    });
  },

  // Track errors
  trackError: (errorType: string, errorMessage: string, errorStack?: string) => {
    trackEvent({
      action: "error",
      category: "Error",
      label: `${errorType}: ${errorMessage}`,
    });

    // Send to Sentry if available
    if (typeof window !== "undefined" && (window as any).Sentry) {
      (window as any).Sentry.captureException(new Error(errorMessage), {
        tags: { errorType },
        extra: { stack: errorStack },
      });
    }
  },

  // CONVERSION TRACKING
  
  // Track successful contact form submission (conversion)
  trackContactConversion: (source: string) => {
    trackEvent({
      action: "conversion",
      category: "Contact",
      label: source,
      value: 1,
    });
    
    // GA4 conversion event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "generate_lead", {
        value: 1,
        currency: "EUR",
        source: source,
      });
    }
    
    // Send to server
    if (typeof window !== "undefined") {
      const sessionId = getSessionId();
      sendToServer("conversion", {
        sessionId,
        type: "contact_form",
        data: { source },
      });
    }
  },

  // Track booking conversion
  trackBookingConversion: (serviceType: string, value?: number) => {
    trackEvent({
      action: "conversion",
      category: "Booking",
      label: serviceType,
      value: value,
    });

    // GA4 conversion event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "begin_checkout", {
        value: value,
        currency: "EUR",
        items: [{ item_name: serviceType }],
      });
    }
    
    // Send to server
    if (typeof window !== "undefined") {
      const sessionId = getSessionId();
      sendToServer("conversion", {
        sessionId,
        type: "booking",
        data: { serviceType, value },
      });
    }
  },

  // Track quote request conversion
  trackQuoteConversion: (projectType: string, estimatedValue?: number) => {
    trackEvent({
      action: "conversion",
      category: "Quote",
      label: projectType,
      value: estimatedValue,
    });

    // GA4 conversion event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "generate_lead", {
        value: estimatedValue,
        currency: "EUR",
        lead_type: "quote_request",
      });
    }
  },

  // Track resource download conversion
  trackResourceConversion: (resourceName: string, resourceType: string) => {
    trackEvent({
      action: "conversion",
      category: "Resource Download",
      label: `${resourceName} (${resourceType})`,
      value: 1,
    });

    // GA4 conversion event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "file_download", {
        file_name: resourceName,
        file_extension: resourceType,
      });
    }
  },

  // Track newsletter signup conversion
  trackNewsletterConversion: (source: string) => {
    trackEvent({
      action: "conversion",
      category: "Newsletter",
      label: source,
      value: 1,
    });

    // GA4 conversion event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "sign_up", {
        method: "email",
        source: source,
      });
    }
    
    // Send to server
    if (typeof window !== "undefined") {
      const sessionId = getSessionId();
      sendToServer("conversion", {
        sessionId,
        type: "newsletter",
        data: { source },
      });
    }
  },

  // ADVANCED TRACKING

  // Track user engagement time
  trackEngagementTime: (pageName: string, timeInSeconds: number) => {
    trackEvent({
      action: "engagement",
      category: "Time on Page",
      label: pageName,
      value: timeInSeconds,
    });
  },

  // Track scroll depth
  trackScrollDepth: (pageName: string, depthPercentage: number) => {
    trackEvent({
      action: "scroll",
      category: "Engagement",
      label: `${pageName} - ${depthPercentage}%`,
      value: depthPercentage,
    });
  },

  // Track feature usage
  trackFeatureUse: (featureName: string, location: string) => {
    trackEvent({
      action: "use",
      category: "Feature",
      label: `${featureName} - ${location}`,
    });
  },

  // Identify user (for Clarity and other tools)
  identifyUser: (userId: string, traits?: Record<string, any>) => {
    // Microsoft Clarity user identification
    if (typeof window !== "undefined" && (window as any).clarity) {
      (window as any).clarity("identify", userId, traits);
    }

    // Sentry user context
    if (typeof window !== "undefined" && (window as any).Sentry) {
      (window as any).Sentry.setUser({
        id: userId,
        ...traits,
      });
    }

    console.log(`👤 User identified: ${userId}`);
  },

  // Set custom user properties
  setUserProperty: (propertyName: string, value: any) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("set", "user_properties", {
        [propertyName]: value,
      });
    }
  },
};

// Utility to track page performance
export function trackPagePerformance() {
  if (typeof window === "undefined" || !window.performance) return;

  // Wait for page to be fully loaded
  window.addEventListener("load", () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;

      trackEvent({
        action: "performance",
        category: "Page Load",
        label: window.location.pathname,
        value: Math.round(pageLoadTime / 1000), // Convert to seconds
      });

      // Send to GA4
      if ((window as any).gtag) {
        (window as any).gtag("event", "page_performance", {
          page_load_time: pageLoadTime,
          connection_time: connectTime,
          render_time: renderTime,
          page_path: window.location.pathname,
        });
      }

      console.log(`⚡ Page performance: ${pageLoadTime}ms`);
    }, 0);
  });
}

// Automatic scroll depth tracking
export function initScrollTracking() {
  if (typeof window === "undefined") return;

  let maxScrollDepth = 0;
  const scrollThresholds = [25, 50, 75, 90, 100];
  const triggeredThresholds = new Set<number>();

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent;
    }

    // Track threshold milestones
    scrollThresholds.forEach((threshold) => {
      if (scrollPercent >= threshold && !triggeredThresholds.has(threshold)) {
        triggeredThresholds.add(threshold);
        analytics.trackScrollDepth(window.location.pathname, threshold);
      }
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Track on page unload
  window.addEventListener("beforeunload", () => {
    if (maxScrollDepth > 0) {
      analytics.trackScrollDepth(window.location.pathname, maxScrollDepth);
    }
  });
}

// Automatic engagement time tracking
export function initEngagementTracking() {
  if (typeof window === "undefined") return;

  let startTime = Date.now();
  let isActive = true;
  let totalActiveTime = 0;

  // Track if user is active (not idle)
  const events = ["mousedown", "keydown", "scroll", "touchstart"];
  
  const resetIdleTimer = () => {
    isActive = true;
  };

  events.forEach((event) => {
    window.addEventListener(event, resetIdleTimer, { passive: true });
  });

  // Check every 5 seconds if user is still active
  setInterval(() => {
    if (isActive) {
      totalActiveTime += 5;
      isActive = false; // Reset, will be set to true if user is active
    }
  }, 5000);

  // Send engagement time on page unload
  window.addEventListener("beforeunload", () => {
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    analytics.trackEngagementTime(window.location.pathname, totalActiveTime);
  });
}

// TypeScript declarations for global analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    plausible?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
    Sentry?: any;
    __GA4_ID__?: string;
    __CLARITY_ID__?: string;
    __SENTRY_DSN__?: string;
    __PLAUSIBLE_DOMAIN__?: string;
  }
}
