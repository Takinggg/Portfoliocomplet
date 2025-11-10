import { projectId, publicAnonKey } from "./supabase/info";

/**
 * Test utility for newsletter functionality
 * Available in browser console as window.testNewsletter
 */

// Test newsletter subscription
async function testSubscribe(email: string) {
  console.log(`🧪 Testing newsletter subscription for: ${email}`);
  
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/newsletter/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();
    console.log("✅ Subscribe response:", data);
    return data;
  } catch (error) {
    console.error("❌ Subscribe error:", error);
    return null;
  }
}

// Get all subscribers
async function getSubscribers() {
  console.log("🧪 Fetching all subscribers");
  
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/newsletter/subscribers`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );

    const data = await response.json();
    console.log(`✅ Found ${data.subscribers?.length || 0} subscribers:`, data.subscribers);
    return data.subscribers;
  } catch (error) {
    console.error("❌ Error fetching subscribers:", error);
    return null;
  }
}

// Get stats
async function getStats() {
  console.log("🧪 Fetching newsletter stats");
  
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/newsletter/stats`,
      {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );

    const data = await response.json();
    console.log("✅ Newsletter stats:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
    return null;
  }
}

// Test confirmation manually (admin only)
async function testConfirm(token: string) {
  console.log(`🧪 Testing confirmation with token: ${token}`);
  
  try {
    // Use the redirect endpoint
    const url = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/newsletter/confirm-redirect/${token}`;
    console.log(`📍 Confirmation redirect URL: ${url}`);
    console.log(`📍 Frontend URL will be: ${window.location.origin}/newsletter/confirm/${token}`);
    window.open(url, '_blank');
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Get confirmation URL for an email
async function getConfirmUrl(email: string) {
  console.log(`🧪 Getting confirmation URL for: ${email}`);
  
  try {
    const subscribers = await getSubscribers();
    const subscriber = subscribers?.find((s: any) => s.email === email);
    
    if (!subscriber) {
      console.error(`❌ Subscriber not found: ${email}`);
      return null;
    }
    
    if (!subscriber.confirmationToken) {
      console.error(`❌ No confirmation token for: ${email}`);
      return null;
    }
    
    const url = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/newsletter/confirm-redirect/${subscriber.confirmationToken}`;
    console.log(`✅ Confirmation URL: ${url}`);
    return url;
  } catch (error) {
    console.error("❌ Error:", error);
    return null;
  }
}

// Delete subscriber
async function deleteSubscriber(email: string) {
  console.log(`🧪 Deleting subscriber: ${email}`);
  
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/newsletter/subscriber/${encodeURIComponent(email)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      }
    );

    const data = await response.json();
    console.log("✅ Delete response:", data);
    return data;
  } catch (error) {
    console.error("❌ Delete error:", error);
    return null;
  }
}

// Clear local storage
function clearNewsletterData() {
  localStorage.removeItem('newsletter_popup_closed');
  localStorage.removeItem('newsletter_subscribed');
  console.log("✅ Newsletter local storage cleared");
}

// Seed demo subscribers
async function seedDemo() {
  console.log("🌱 Seeding demo newsletter subscribers...");
  
  const demoEmails = [
    "maxence@example.com",
    "client1@startup.com",
    "designer@agency.fr",
    "developer@tech.io",
    "manager@business.com"
  ];
  
  for (const email of demoEmails) {
    await testSubscribe(email);
    await new Promise(r => setTimeout(r, 1000)); // Wait 1s between each
  }
  
  console.log("✅ Demo subscribers created! Check the Dashboard > Newsletter");
}

// Export for browser console
const testNewsletter = {
  subscribe: testSubscribe,
  getSubscribers,
  getStats,
  testConfirm,
  getConfirmUrl,
  deleteSubscriber,
  clearStorage: clearNewsletterData,
  seedDemo,
  help() {
    console.log(`
📧 Newsletter Test Utilities
=============================

Available commands:
- testNewsletter.subscribe("email@example.com") - Test subscription
- testNewsletter.getSubscribers() - Get all subscribers
- testNewsletter.getStats() - Get statistics
- testNewsletter.testConfirm("token") - Test confirmation link
- testNewsletter.getConfirmUrl("email") - Get confirmation URL for email
- testNewsletter.deleteSubscriber("email") - Delete a subscriber
- testNewsletter.clearStorage() - Clear local storage
- testNewsletter.seedDemo() - Create 5 demo subscribers
- testNewsletter.help() - Show this help

Examples:
  testNewsletter.subscribe("test@example.com")
  testNewsletter.getConfirmUrl("test@example.com")
  testNewsletter.getSubscribers()
  testNewsletter.getStats()
  testNewsletter.seedDemo()
  testNewsletter.clearStorage()
    `);
  }
};

// Make available globally
if (typeof window !== "undefined") {
  (window as any).testNewsletter = testNewsletter;
  console.log("✅ Newsletter test utilities loaded. Type 'testNewsletter.help()' for commands.");
}

export default testNewsletter;
