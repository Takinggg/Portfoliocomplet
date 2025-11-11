/**
 * React Hook for Analytics
 * Provides easy-to-use analytics functions in React components
 */

import { useEffect, useCallback } from "react";
import { analytics, trackPageView } from "../analytics";

export function useAnalytics() {
  return {
    // Page tracking
    trackPage: useCallback((pageName: string, pageTitle?: string) => {
      trackPageView(pageName, pageTitle);
    }, []),

    // Event tracking
    track: useCallback(analytics.trackCTA, []),
    trackCTA: useCallback(analytics.trackCTA, []),
    trackFormSubmit: useCallback(analytics.trackFormSubmit, []),
    trackFormError: useCallback(analytics.trackFormError, []),
    trackDownload: useCallback(analytics.trackDownload, []),
    trackVideoPlay: useCallback(analytics.trackVideoPlay, []),
    trackOutboundLink: useCallback(analytics.trackOutboundLink, []),
    trackSearch: useCallback(analytics.trackSearch, []),
    trackNewsletterSignup: useCallback(analytics.trackNewsletterSignup, []),
    trackBooking: useCallback(analytics.trackBooking, []),
    trackProjectView: useCallback(analytics.trackProjectView, []),
    trackBlogRead: useCallback(analytics.trackBlogRead, []),
    trackSocialShare: useCallback(analytics.trackSocialShare, []),
    trackError: useCallback(analytics.trackError, []),

    // Conversion tracking
    trackContactConversion: useCallback(analytics.trackContactConversion, []),
    trackBookingConversion: useCallback(analytics.trackBookingConversion, []),
    trackQuoteConversion: useCallback(analytics.trackQuoteConversion, []),
    trackResourceConversion: useCallback(analytics.trackResourceConversion, []),
    trackNewsletterConversion: useCallback(analytics.trackNewsletterConversion, []),

    // Advanced tracking
    trackEngagementTime: useCallback(analytics.trackEngagementTime, []),
    trackScrollDepth: useCallback(analytics.trackScrollDepth, []),
    trackFeatureUse: useCallback(analytics.trackFeatureUse, []),
    identifyUser: useCallback(analytics.identifyUser, []),
    setUserProperty: useCallback(analytics.setUserProperty, []),
  };
}

/**
 * Hook to automatically track page views
 * Use this in page components to automatically track when they mount
 */
export function usePageTracking(pageName: string, pageTitle?: string) {
  useEffect(() => {
    trackPageView(pageName, pageTitle);
  }, [pageName, pageTitle]);
}

/**
 * Hook to track component mount/unmount (for feature usage analytics)
 */
export function useComponentTracking(componentName: string, location: string) {
  const { trackFeatureUse } = useAnalytics();

  useEffect(() => {
    trackFeatureUse(componentName, location);
  }, [componentName, location, trackFeatureUse]);
}

/**
 * Hook to track time spent on a page/component
 */
export function useTimeTracking(pageName: string) {
  const { trackEngagementTime } = useAnalytics();

  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 3) { // Only track if more than 3 seconds
        trackEngagementTime(pageName, timeSpent);
      }
    };
  }, [pageName, trackEngagementTime]);
}

/**
 * Hook to track errors in components
 */
export function useErrorTracking() {
  const { trackError } = useAnalytics();

  return useCallback((error: Error, errorInfo?: React.ErrorInfo | Record<string, unknown>) => {
    trackError(
      error.name || "UnknownError",
      error.message,
      error.stack
    );
  }, [trackError]);
}
