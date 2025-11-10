# 📊 Analytics Quick Reference Card

## 🚀 Setup (2 minutes)

```typescript
// 1. Configure IDs in /utils/analyticsConfig.ts
export const analyticsConfig = {
  GA4_MEASUREMENT_ID: "G-ABC123DEF4",      // From analytics.google.com
  CLARITY_PROJECT_ID: "abc123",             // From clarity.microsoft.com
  SENTRY_DSN: "https://xxx@sentry.io/123", // From sentry.io
};

// 2. That's it! Auto-initialized in App.tsx
```

---

## 📝 Common Usage Patterns

### Page Tracking

```tsx
import { usePageTracking } from '../utils/hooks/useAnalytics';

function MyPage() {
  // Automatic page view tracking
  usePageTracking('my-page', 'My Page Title');
  
  return <div>...</div>;
}
```

### Event Tracking

```tsx
import { useAnalytics } from '../utils/hooks/useAnalytics';

function MyComponent() {
  const analytics = useAnalytics();
  
  return (
    <button onClick={() => 
      analytics.trackCTA('Button Name', 'Section Name')
    }>
      Click me
    </button>
  );
}
```

---

## 🎯 All Tracking Functions

### Conversions (IMPORTANT for ROI)

```typescript
// Contact form submission
analytics.trackContactConversion('Contact Form');

// Booking/appointment
analytics.trackBookingConversion('Consultation', 150); // optional price

// Quote request
analytics.trackQuoteConversion('E-commerce Site', 5000); // optional value

// Newsletter signup
analytics.trackNewsletterConversion('Homepage Popup');

// Resource download
analytics.trackResourceConversion('PDF Guide', 'pdf');
```

### User Interactions

```typescript
// CTA click
analytics.trackCTA('Button Text', 'Location');

// Form submission
analytics.trackFormSubmit('Form Name');

// Form error
analytics.trackFormError('Form Name', 'Error Type');

// Download
analytics.trackDownload('filename.pdf', 'pdf');

// Video play
analytics.trackVideoPlay('Video Title');

// Outbound link
analytics.trackOutboundLink('https://example.com', 'Link Text');

// Search
analytics.trackSearch('search term', 10); // results count

// Social share
analytics.trackSocialShare('twitter', 'blog', 'Post Title');

// Project view
analytics.trackProjectView('Project Name');

// Blog post read
analytics.trackBlogRead('Post Title', 180); // reading time in seconds
```

### Advanced

```typescript
// Feature usage
analytics.trackFeatureUse('Feature Name', 'Location');

// Engagement time
analytics.trackEngagementTime('page-name', 120); // seconds

// Scroll depth
analytics.trackScrollDepth('page-name', 75); // percentage

// User identification (for logged-in users)
analytics.identifyUser('user-123', { name: 'John', plan: 'premium' });

// Custom user property
analytics.setUserProperty('subscription_tier', 'pro');

// Error tracking
analytics.trackError('ErrorType', 'Error message', 'stack trace');
```

---

## 🎨 React Hooks

### useAnalytics()
Main hook with all tracking functions

```tsx
const analytics = useAnalytics();
analytics.trackCTA('Button', 'Hero');
```

### usePageTracking()
Automatic page view tracking

```tsx
usePageTracking('page-name', 'Page Title');
```

### useTimeTracking()
Track time spent on page/component

```tsx
useTimeTracking('article-slug');
```

### useComponentTracking()
Track component mount (feature usage)

```tsx
useComponentTracking('ComponentName', 'Location');
```

### useErrorTracking()
Error tracking helper

```tsx
const trackError = useErrorTracking();
try {
  // ...
} catch (error) {
  trackError(error);
}
```

---

## 📊 What's Tracked Automatically

✅ Page views on navigation  
✅ Page load performance  
✅ Scroll depth (25%, 50%, 75%, 100%)  
✅ Time spent on page  
✅ Errors caught by ErrorBoundary  
✅ Core Web Vitals

---

## 🔍 Where to See Data

| Tool | Dashboard URL | What You See |
|------|--------------|--------------|
| **GA4** | [analytics.google.com](https://analytics.google.com) | Traffic, conversions, user flow |
| **Clarity** | [clarity.microsoft.com](https://clarity.microsoft.com) | Heatmaps, session recordings |
| **Sentry** | [sentry.io](https://sentry.io) | Errors, stack traces, performance |

---

## 🎯 Priority Events for Freelance Portfolio

### MUST Track (Critical for Business)
1. ✅ Contact form submissions → `trackContactConversion()`
2. ✅ Booking appointments → `trackBookingConversion()`
3. ✅ Quote requests → `trackQuoteConversion()`
4. ✅ Newsletter signups → `trackNewsletterConversion()`

### SHOULD Track (Important for Optimization)
5. ✅ CTA clicks → `trackCTA()`
6. ✅ Project views → `trackProjectView()`
7. ✅ Resource downloads → `trackResourceConversion()`
8. ✅ Page performance → Automatic

### NICE TO HAVE (Insights)
9. ✅ Blog reads → `trackBlogRead()`
10. ✅ Social shares → `trackSocialShare()`
11. ✅ Search queries → `trackSearch()`
12. ✅ Video plays → `trackVideoPlay()`

---

## 💡 Pro Tips

### For Better Conversion Tracking
```typescript
// Always include source/location context
analytics.trackContactConversion('Homepage Hero CTA'); // ✅ Good
analytics.trackContactConversion('contact'); // ❌ Too vague

// Track the full funnel
analytics.trackCTA('Get Quote', 'Services Page');
// ... user fills form ...
analytics.trackQuoteConversion('Website Development', 3000);
```

### For Better User Insights
```typescript
// Identify users after login
analytics.identifyUser(userId, {
  email: user.email,
  name: user.name,
  signup_date: user.createdAt,
  plan: 'free', // or 'pro', 'enterprise'
});

// Track feature adoption
analytics.trackFeatureUse('Live Chat', 'Contact Page');
analytics.trackFeatureUse('Calendar Booking', 'Services Page');
```

### For Debugging
```typescript
// Check console for confirmation
// You should see: "📊 Event tracked: Category - Action"

// Test in browser console:
window.gtag('event', 'test');
```

---

## 🐛 Troubleshooting

### Events not showing in GA4?
- Wait 24-48 hours for processing
- Check "Realtime" report for immediate feedback
- Verify GA4_MEASUREMENT_ID is correct

### Heatmaps not appearing in Clarity?
- Need 100+ page views minimum
- Wait 30 minutes after installation
- Check Project ID is correct

### Errors not in Sentry?
- Verify SENTRY_DSN is correct
- Check Sentry project settings
- Errors only sent in production by default

### No data at all?
```javascript
// Check initialization in browser console
// Should see:
// ✅ Google Analytics 4 initialized: G-XXX
// ✅ Microsoft Clarity initialized: xxx
// ✅ Sentry initialized
// 📊 Analytics system initialized
```

---

## 📚 Full Documentation

- **Setup Guide**: `/ANALYTICS_SETUP_GUIDE.md`
- **Source Code**: `/utils/analytics.ts`
- **Configuration**: `/utils/analyticsConfig.ts`
- **React Hooks**: `/utils/hooks/useAnalytics.ts`

---

## ✅ Implementation Checklist

- [ ] Configure IDs in `/utils/analyticsConfig.ts`
- [ ] Add `usePageTracking()` to all pages
- [ ] Add `trackContactConversion()` to contact form
- [ ] Add `trackBookingConversion()` to booking flow
- [ ] Add `trackQuoteConversion()` to quote requests
- [ ] Add `trackNewsletterConversion()` to newsletter signups
- [ ] Add `trackCTA()` to important buttons
- [ ] Test in browser console
- [ ] Verify in dashboards after 24h
- [ ] Set up GA4 conversion goals
- [ ] Configure Sentry alerts

---

**💚 Happy Tracking!**

*Questions? See ANALYTICS_SETUP_GUIDE.md or check the code comments.*
