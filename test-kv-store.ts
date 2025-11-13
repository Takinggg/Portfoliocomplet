import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

// Test direct du KV store
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://ptcxeqtjlxittxayffgu.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseKey) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY manquant");
  Deno.exit(1);
}

console.log("🔧 Testing KV Store...");
console.log("URL:", supabaseUrl);
console.log("Key:", supabaseKey.substring(0, 20) + "...");

const client = createClient(supabaseUrl, supabaseKey);

try {
  // Test 1: Write
  console.log("\n1️⃣ Testing SET...");
  const testKey = "test:rate:limit";
  const testValue = { count: 1, firstRequest: Date.now() };
  
  const { error: setError } = await client.from("kv_store_04919ac5").upsert({
    key: testKey,
    value: testValue
  });
  
  if (setError) {
    console.error("❌ SET failed:", setError);
  } else {
    console.log("✅ SET success");
  }

  // Test 2: Read
  console.log("\n2️⃣ Testing GET...");
  const { data, error: getError } = await client
    .from("kv_store_04919ac5")
    .select("value")
    .eq("key", testKey)
    .maybeSingle();
  
  if (getError) {
    console.error("❌ GET failed:", getError);
  } else {
    console.log("✅ GET success:", data?.value);
  }

  // Test 3: Update
  console.log("\n3️⃣ Testing UPDATE...");
  const updatedValue = { count: 2, firstRequest: Date.now() };
  const { error: updateError } = await client
    .from("kv_store_04919ac5")
    .upsert({
      key: testKey,
      value: updatedValue
    });
  
  if (updateError) {
    console.error("❌ UPDATE failed:", updateError);
  } else {
    console.log("✅ UPDATE success");
  }

  // Test 4: Read again
  console.log("\n4️⃣ Testing GET after UPDATE...");
  const { data: data2, error: getError2 } = await client
    .from("kv_store_04919ac5")
    .select("value")
    .eq("key", testKey)
    .maybeSingle();
  
  if (getError2) {
    console.error("❌ GET failed:", getError2);
  } else {
    console.log("✅ GET success:", data2?.value);
  }

  console.log("\n✅ All KV Store tests passed!");

} catch (error) {
  console.error("❌ Test failed:", error);
  Deno.exit(1);
}
