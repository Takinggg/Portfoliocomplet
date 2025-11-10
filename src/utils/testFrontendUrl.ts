/**
 * Test utility to check if FRONTEND_URL is correctly configured
 * Run this in the browser console to verify the configuration
 */

import { projectId, publicAnonKey } from './supabase/info';

export async function testFrontendUrl() {
  console.log('🧪 Testing FRONTEND_URL configuration...\n');

  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/test-frontend-url`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      }
    );

    const data = await response.json();
    
    console.log('📋 FRONTEND_URL Configuration:');
    console.log('═══════════════════════════════\n');
    
    console.log(`Raw value: ${data.raw || '(not set)'}`);
    console.log(`Fixed value: ${data.fixed || '(not set)'}`);
    console.log(`Is valid: ${data.isValid ? '✅' : '❌'}`);
    console.log(`Has protocol: ${data.hasProtocol ? '✅' : '❌'}\n`);
    
    if (data.testUrl) {
      console.log(`Test confirmation URL:\n${data.testUrl}\n`);
    }
    
    if (!data.isValid) {
      console.warn('⚠️ WARNING: FRONTEND_URL is not correctly configured!');
      console.warn('Please set it in Supabase Dashboard → Edge Functions → Secrets');
      console.warn('Expected format: https://your-domain.com\n');
    } else {
      console.log('✅ FRONTEND_URL is correctly configured!\n');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error testing FRONTEND_URL:', error);
    return null;
  }
}

// Allow running from console
if (typeof window !== 'undefined') {
  (window as any).testFrontendUrl = testFrontendUrl;
  console.log('💡 Test function loaded! Run: testFrontendUrl()');
}
