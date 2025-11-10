#!/usr/bin/env python3
"""Script to fix the server index.tsx file by removing duplicate broken code."""

# Read the file
with open('/supabase/functions/server/index.tsx', 'r') as f:
    lines = f.readlines()

# Keep only lines up to and including line 1959 (Deno.serve)
# Line numbers in the file are 1-indexed, but list is 0-indexed
clean_lines = lines[:1959]

# Write the clean file
with open('/supabase/functions/server/index.tsx', 'w') as f:
    f.writelines(clean_lines)

print("✅ Server file cleaned successfully!")
print(f"Kept {len(clean_lines)} lines, removed {len(lines) - len(clean_lines)} lines")
