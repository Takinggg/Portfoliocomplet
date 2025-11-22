/**
 * Shields the app from browsers where the Web Storage APIs (localStorage/sessionStorage)
 * are disabled (Safari private browsing, strict tracking prevention, etc.).
 *
 * On those browsers, calling storage methods throws a synchronous DOMException which
 * bubbles up to React and triggers the ErrorBoundary. We patch the Storage prototype
 * once so every get/set/remove/clear call is wrapped in a try/catch and gracefully
 * degrades instead of crashing the UI.
 */
let storagePatched = false;

const STORAGE_METHODS = [
  "getItem",
  "setItem",
  "removeItem",
  "clear",
  "key",
] as const;

type StorageMethod = (typeof STORAGE_METHODS)[number];
const warnedMethods = new Set<StorageMethod>();

export function initSafeStorage() {
  if (storagePatched || typeof window === "undefined" || typeof Storage === "undefined") {
    storagePatched = true;
    return;
  }

  STORAGE_METHODS.forEach((method) => {
    const original = Storage.prototype[method] as (...args: any[]) => any;
    if (typeof original !== "function") {
      return;
    }

    const safeWrapper = function (this: Storage, ...args: any[]) {
      try {
        return original.apply(this, args);
      } catch (error) {
        if (import.meta.env.DEV && !warnedMethods.has(method)) {
          warnedMethods.add(method);
          console.warn(`[safeStorage] ${method} is unavailable, falling back to noop.`, error);
        }
        // Match native signatures: getters return null, setters return void.
        if (method === "getItem" || method === "key") {
          return null;
        }
        return undefined;
      }
    };

    Object.defineProperty(Storage.prototype, method, {
      value: safeWrapper,
      configurable: true,
      enumerable: false,
      writable: true,
    });
  });

  storagePatched = true;
}
