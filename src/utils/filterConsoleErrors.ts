/**
 * Filter Console Errors - Hide third-party errors (Gravatar, Figma, etc.)
 * This filters out errors that don't come from your application
 */

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Patterns to filter out (third-party services)
const ignoredPatterns = [
  /gravatar\.com/i,
  /figma\.com.*gravatar/i,
  /Access-Control-Allow-Origin.*gravatar/i,
  /Failed to load resource.*gravatar/i,
];

/**
 * Override console.error to filter third-party messages
 * Note: Using any[] for args is intentional - console methods accept any types
 */
console.error = (...args: any[]) => {
  const message = args.join(' ');
  
  // Check if this is a third-party error we want to ignore
  const shouldIgnore = ignoredPatterns.some(pattern => pattern.test(message));
  
  if (!shouldIgnore) {
    originalConsoleError.apply(console, args);
  }
};

/**
 * Override console.warn to filter third-party messages
 * Note: Using any[] for args is intentional - console methods accept any types
 */
console.warn = (...args: any[]) => {
  const message = args.join(' ');
  
  const shouldIgnore = ignoredPatterns.some(pattern => pattern.test(message));
  
  if (!shouldIgnore) {
    originalConsoleWarn.apply(console, args);
  }
};

// Log that the filter is active
console.log("🧹 Console filter active - Third-party errors (Gravatar, Figma) hidden");
