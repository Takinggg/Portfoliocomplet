/**
 * Analytics Testing Utilities
 * 
 * Test your analytics configuration and tracking
 * 
 * Usage in browser console:
 * - (window as any).testAnalytics()
 * - (window as any).testAnalyticsEvent('test_conversion')
 */

import { analytics, trackPageView } from './analytics';
import { analyticsConfig } from './analyticsConfig';

// Test analytics configuration
export function testAnalyticsConfig() {
  console.group('📊 Analytics Configuration Test');
  
  console.log('Configuration:', {
    GA4: analyticsConfig.GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX' ? '✅ Configured' : '❌ Not configured',
    Clarity: analyticsConfig.CLARITY_PROJECT_ID ? '✅ Configured' : '❌ Not configured',
    Sentry: analyticsConfig.SENTRY_DSN ? '✅ Configured' : '❌ Not configured',
    Plausible: analyticsConfig.PLAUSIBLE_DOMAIN ? '✅ Configured' : '❌ Not configured',
  });

  // Check if analytics objects are loaded
  const loaded = {
    GA4: typeof (window as any).gtag !== 'undefined',
    Clarity: typeof (window as any).clarity !== 'undefined',
    Sentry: typeof (window as any).Sentry !== 'undefined',
    Plausible: typeof (window as any).plausible !== 'undefined',
  };

  console.log('\nLoaded Scripts:', loaded);

  // Privacy settings
  console.log('\nPrivacy Settings:', {
    'Do Not Track': navigator.doNotTrack === '1' ? 'Enabled (tracking disabled)' : 'Disabled',
    'Respect DNT': analyticsConfig.RESPECT_DO_NOT_TRACK ? 'Yes' : 'No',
    'Anonymize IP': analyticsConfig.ANONYMIZE_IP ? 'Yes' : 'No',
  });

  console.groupEnd();

  return {
    configured: analyticsConfig.GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX',
    loaded,
  };
}

// Test page view tracking
export function testPageView() {
  console.log('📊 Testing page view tracking...');
  trackPageView('test-page', 'Test Page');
  console.log('✅ Page view tracked. Check your analytics dashboard.');
}

// Test event tracking
export function testEvent(eventName = 'test_event') {
  console.log(`📊 Testing event tracking: ${eventName}`);
  
  // Test all event types
  const tests = [
    {
      name: 'CTA Click',
      fn: () => analytics.trackCTA('Test Button', 'Console Test'),
    },
    {
      name: 'Form Submit',
      fn: () => analytics.trackFormSubmit('Test Form'),
    },
    {
      name: 'Conversion',
      fn: () => analytics.trackContactConversion('Console Test'),
    },
    {
      name: 'Download',
      fn: () => analytics.trackDownload('test.pdf', 'pdf'),
    },
    {
      name: 'Social Share',
      fn: () => analytics.trackSocialShare('twitter', 'test', 'Test Content'),
    },
  ];

  tests.forEach(test => {
    try {
      test.fn();
      console.log(`  ✅ ${test.name} - OK`);
    } catch (error) {
      console.error(`  ❌ ${test.name} - Error:`, error);
    }
  });

  console.log('✅ All event tests completed. Check console for results.');
}

// Test conversion tracking
export function testConversions() {
  console.log('📊 Testing conversion tracking...');
  
  const conversions = [
    { name: 'Contact', fn: () => analytics.trackContactConversion('Test') },
    { name: 'Booking', fn: () => analytics.trackBookingConversion('Test Service', 100) },
    { name: 'Quote', fn: () => analytics.trackQuoteConversion('Test Project', 5000) },
    { name: 'Newsletter', fn: () => analytics.trackNewsletterConversion('Test') },
    { name: 'Resource', fn: () => analytics.trackResourceConversion('Test PDF', 'pdf') },
  ];

  conversions.forEach(conv => {
    try {
      conv.fn();
      console.log(`  ✅ ${conv.name} conversion - OK`);
    } catch (error) {
      console.error(`  ❌ ${conv.name} conversion - Error:`, error);
    }
  });

  console.log('✅ Conversion tracking tested. Check GA4 Events dashboard.');
}

// Test error tracking
export function testErrorTracking() {
  console.log('📊 Testing error tracking...');
  
  try {
    analytics.trackError('TestError', 'This is a test error', 'Test stack trace');
    console.log('✅ Error tracked. Check Sentry dashboard.');
  } catch (error) {
    console.error('❌ Error tracking failed:', error);
  }
}

// Test performance tracking
export function testPerformanceTracking() {
  console.log('📊 Testing performance tracking...');
  
  if (window.performance && window.performance.timing) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    console.log('Performance Data:', {
      'Page Load Time': `${pageLoadTime}ms`,
      'DOM Ready': `${perfData.domContentLoadedEventEnd - perfData.navigationStart}ms`,
      'First Paint': perfData.responseEnd - perfData.navigationStart,
    });
    
    console.log('✅ Performance tracking available');
  } else {
    console.warn('⚠️ Performance API not available');
  }
}

// Comprehensive test
export function testAnalytics() {
  console.clear();
  console.log('🚀 Starting comprehensive analytics test...\n');
  
  const config = testAnalyticsConfig();
  console.log('');
  
  if (!config.configured) {
    console.warn('⚠️ Analytics not fully configured. See /utils/analyticsConfig.ts');
    console.log('Quick fix:');
    console.log('1. Open /utils/analyticsConfig.ts');
    console.log('2. Replace GA4_MEASUREMENT_ID with your Google Analytics ID');
    console.log('3. Add CLARITY_PROJECT_ID from Microsoft Clarity');
    console.log('4. Add SENTRY_DSN from Sentry.io\n');
  }

  testPageView();
  console.log('');
  
  testEvent();
  console.log('');
  
  testConversions();
  console.log('');
  
  testErrorTracking();
  console.log('');
  
  testPerformanceTracking();
  console.log('');
  
  console.log('🎉 Analytics test complete!');
  console.log('\n📚 Next steps:');
  console.log('1. Check browser DevTools > Network tab for analytics requests');
  console.log('2. Visit https://analytics.google.com (Realtime report)');
  console.log('3. Visit https://clarity.microsoft.com (Sessions)');
  console.log('4. Visit https://sentry.io (Issues)');
  console.log('\n💡 Wait 24-48 hours for full data processing in GA4');
}

// Quick event test for specific actions
export function trackTestConversion() {
  console.log('🎯 Tracking test conversion...');
  analytics.trackContactConversion('Browser Console Test');
  console.log('✅ Done! Check GA4 > Events > Conversions in 5 minutes');
}

// Export test functions to window for easy access
if (typeof window !== 'undefined') {
  (window as any).testAnalytics = testAnalytics;
  (window as any).testAnalyticsConfig = testAnalyticsConfig;
  (window as any).testAnalyticsEvent = testEvent;
  (window as any).testAnalyticsConversions = testConversions;
  (window as any).trackTestConversion = trackTestConversion;
  
  console.log('📊 Analytics test utilities loaded!');
  console.log('Available commands:');
  console.log('  - testAnalytics()              // Run all tests');
  console.log('  - testAnalyticsConfig()        // Check configuration');
  console.log('  - testAnalyticsEvent()         // Test event tracking');
  console.log('  - testAnalyticsConversions()   // Test conversion tracking');
  console.log('  - trackTestConversion()        // Quick conversion test');
}

// Auto-export for debugging
export default {
  testAnalytics,
  testAnalyticsConfig,
  testPageView,
  testEvent,
  testConversions,
  testErrorTracking,
  testPerformanceTracking,
  trackTestConversion,
};
