-- Create KV Store table for rate limiting persistence
CREATE TABLE IF NOT EXISTS kv_store_04919ac5 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_kv_store_key ON kv_store_04919ac5(key);

-- Enable Row Level Security (optional, for security)
ALTER TABLE kv_store_04919ac5 ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything (needed for Edge Functions)
CREATE POLICY IF NOT EXISTS "Service role can manage kv_store" 
ON kv_store_04919ac5 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Test insertion
INSERT INTO kv_store_04919ac5 (key, value) VALUES ('test', '{"status": "ready"}') 
ON CONFLICT (key) DO UPDATE SET value = '{"status": "ready"}', updated_at = NOW();

SELECT 'KV Store table created successfully!' as message;
