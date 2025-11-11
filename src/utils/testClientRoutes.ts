/**
 * Test script for Client Routes
 * 
 * This file helps verify that all client routes are working correctly
 * on the deployed Supabase Edge Function.
 * 
 * Usage: Call these functions from browser console after logging in
 */

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;

/**
 * Get the access token from localStorage (set after login)
 */
function getAccessToken(): string | null {
  const sessionData = localStorage.getItem('supabase.auth.token');
  if (sessionData) {
    try {
      const parsed = JSON.parse(sessionData);
      return parsed.access_token || parsed.currentSession?.access_token || null;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Test: Get all clients
 */
export async function testGetAllClients() {
  console.log('🧪 Testing GET /clients...');
  
  const token = getAccessToken();
  if (!token) {
    console.error('❌ No access token found. Please login first.');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ GET /clients succeeded');
      console.log(`📊 Found ${data.clients?.length || 0} clients:`, data);
      return data;
    } else {
      console.error('❌ GET /clients failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return null;
  }
}

import type { Client } from './types/shared';

/**
 * Test: Create a new client
 */
export async function testCreateClient(clientData?: Partial<Client>) {
  console.log('🧪 Testing POST /clients...');
  
  const token = getAccessToken();
  if (!token) {
    console.error('❌ No access token found. Please login first.');
    return;
  }
  
  const defaultData = {
    name: 'Test Client',
    email: `test-${Date.now()}@example.com`,
    phone: '+33 6 12 34 56 78',
    company: 'Test Company SAS',
    companySize: '10-50',
    industry: 'Technology',
    website: 'https://example.com',
    address: '123 rue de Test',
    city: 'Paris',
    country: 'France',
    notes: 'This is a test client created via API',
    tags: ['test', 'api'],
    status: 'active',
    leadSource: 'api_test',
    estimatedBudget: 5000,
    preferredLanguage: 'fr'
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData || defaultData),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ POST /clients succeeded');
      console.log('📝 Created client:', data.client);
      return data.client;
    } else {
      console.error('❌ POST /clients failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return null;
  }
}

/**
 * Test: Get a specific client
 */
export async function testGetClient(clientId: string) {
  console.log(`🧪 Testing GET /clients/${clientId}...`);
  
  const token = getAccessToken();
  if (!token) {
    console.error('❌ No access token found. Please login first.');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ GET /clients/:id succeeded');
      console.log('👤 Client details:', data.client);
      return data.client;
    } else {
      console.error('❌ GET /clients/:id failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return null;
  }
}

/**
 * Test: Update a client
 */
export async function testUpdateClient(clientId: string, updates: Partial<Client>) {
  console.log(`🧪 Testing PUT /clients/${clientId}...`);
  
  const token = getAccessToken();
  if (!token) {
    console.error('❌ No access token found. Please login first.');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ PUT /clients/:id succeeded');
      console.log('📝 Updated client:', data.client);
      return data.client;
    } else {
      console.error('❌ PUT /clients/:id failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return null;
  }
}

/**
 * Test: Delete a client
 */
export async function testDeleteClient(clientId: string) {
  console.log(`🧪 Testing DELETE /clients/${clientId}...`);
  
  const token = getAccessToken();
  if (!token) {
    console.error('❌ No access token found. Please login first.');
    return;
  }
  
  const confirmed = confirm(`Are you sure you want to delete client ${clientId}?`);
  if (!confirmed) {
    console.log('❌ Deletion cancelled by user');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ DELETE /clients/:id succeeded');
      console.log('🗑️ Client deleted:', data.message);
      return true;
    } else {
      console.error('❌ DELETE /clients/:id failed:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return false;
  }
}

/**
 * Test: Convert lead to client
 */
export async function testConvertLead(leadId: string) {
  console.log(`🧪 Testing POST /clients/convert-lead/${leadId}...`);
  
  const token = getAccessToken();
  if (!token) {
    console.error('❌ No access token found. Please login first.');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/clients/convert-lead/${leadId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ POST /clients/convert-lead/:leadId succeeded');
      console.log('🔄 Lead converted to client:', data.client);
      return data.client;
    } else {
      console.error('❌ POST /clients/convert-lead/:leadId failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return null;
  }
}

/**
 * Test: Get client statistics
 */
export async function testGetClientStats() {
  console.log('🧪 Testing GET /clients/stats...');
  
  const token = getAccessToken();
  if (!token) {
    console.error('❌ No access token found. Please login first.');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/clients/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ GET /clients/stats succeeded');
      console.log('📊 Client statistics:', data.stats);
      return data.stats;
    } else {
      console.error('❌ GET /clients/stats failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return null;
  }
}

/**
 * Run all client route tests in sequence
 */
export async function runAllClientTests() {
  console.log('🚀 Running all client route tests...\n');
  
  // 1. Get all clients
  const allClients = await testGetAllClients();
  console.log('\n---\n');
  
  // 2. Create a test client
  const newClient = await testCreateClient();
  console.log('\n---\n');
  
  if (newClient) {
    // 3. Get the specific client
    await testGetClient(newClient.id);
    console.log('\n---\n');
    
    // 4. Update the client
    await testUpdateClient(newClient.id, {
      notes: 'Updated via test script',
      tags: ['test', 'api', 'updated']
    });
    console.log('\n---\n');
    
    // 5. Get statistics
    await testGetClientStats();
    console.log('\n---\n');
    
    // 6. Clean up - delete the test client
    console.log('⏳ Waiting 2 seconds before cleanup...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await testDeleteClient(newClient.id);
  }
  
  console.log('\n✅ All tests completed!');
}

// Export test functions for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testClientRoutes = {
    getAll: testGetAllClients,
    create: testCreateClient,
    get: testGetClient,
    update: testUpdateClient,
    delete: testDeleteClient,
    convertLead: testConvertLead,
    stats: testGetClientStats,
    runAll: runAllClientTests
  };
  
  console.log('✅ Client route tests loaded!');
  console.log('📝 Use window.testClientRoutes to access test functions:');
  console.log('   - testClientRoutes.getAll()');
  console.log('   - testClientRoutes.create()');
  console.log('   - testClientRoutes.get(clientId)');
  console.log('   - testClientRoutes.update(clientId, updates)');
  console.log('   - testClientRoutes.delete(clientId)');
  console.log('   - testClientRoutes.convertLead(leadId)');
  console.log('   - testClientRoutes.stats()');
  console.log('   - testClientRoutes.runAll()');
}
