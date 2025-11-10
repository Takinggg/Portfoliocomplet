/**
 * URL Language Synchronization
 * Syncs language from URL parameter (?lang=en) to context
 * Works with current system without React Router
 */

import { useLangFromURL } from '../../utils/seo/useLangFromURL';

export function URLLanguageSync() {
  useLangFromURL();
  return null; // This component doesn't render anything
}
