#!/bin/bash
# Keep only the first 1958 lines and add Deno.serve line
head -n 1958 /supabase/functions/server/index.tsx > /tmp/index_clean.tsx
echo "Deno.serve(app.fetch);" >> /tmp/index_clean.tsx
mv /tmp/index_clean.tsx /supabase/functions/server/index.tsx
echo "✅ Server file cleaned - kept 1959 lines, removed duplicate code"
