import { publicAnonKey, projectId } from './supabase/info';

export async function testQuotesRoute() {
  console.log('🧪 Testing Quotes Route...');
  console.log('📍 Project ID:', projectId);
  
  const url = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/quotes`;
  console.log('🌐 Testing URL:', url);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);
    console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('📄 Raw Response:', text);
    
    if (response.status === 404) {
      console.error('❌ 404 ERROR - Route not found or server not started correctly');
      console.log('🔍 Possible causes:');
      console.log('   1. Server has an error at startup');
      console.log('   2. Propagation still in progress (wait 5 min)');
      console.log('   3. Edge function not deployed correctly');
      return {
        success: false,
        error: '404 Not Found',
        status: 404,
        rawResponse: text
      };
    }
    
    if (response.status === 401) {
      console.error('❌ 401 UNAUTHORIZED - Auth issue');
      console.log('🔍 Possible causes:');
      console.log('   1. requireAuth middleware blocking the request');
      console.log('   2. Need to be logged in first');
      return {
        success: false,
        error: '401 Unauthorized',
        status: 401,
        rawResponse: text
      };
    }
    
    try {
      const json = JSON.parse(text);
      console.log('✅ Parsed JSON:', json);
      
      if (response.ok) {
        console.log('✅ SUCCESS - Quotes route is working!');
        return {
          success: true,
          data: json,
          status: response.status
        };
      } else {
        console.error('⚠️ Request failed:', json);
        return {
          success: false,
          error: json,
          status: response.status
        };
      }
    } catch (e) {
      console.log('⚠️ Response is not JSON');
      return {
        success: false,
        error: 'Response is not JSON',
        status: response.status,
        rawResponse: text
      };
    }
  } catch (error: unknown) {
    console.error('❌ Network Error:', error);
    return {
      success: false,
      error: error.message,
      type: 'network'
    };
  }
}

// Rendre disponible dans la console
if (typeof window !== 'undefined') {
  (window as any).testQuotesRoute = testQuotesRoute;
}

