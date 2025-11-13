param(
    [Parameter(Mandatory=$true)]
    [string]$AccessToken
)

Write-Host "Creating KV Store table in Supabase..." -ForegroundColor Cyan

# Save token
$tokenDir = "$env:USERPROFILE\.supabase"
if (-not (Test-Path $tokenDir)) {
    New-Item -ItemType Directory -Path $tokenDir | Out-Null
}
$AccessToken | Out-File "$tokenDir\access-token" -NoNewline

# Link project
Write-Host "Linking project..."
npx supabase link --project-ref ptcxeqtjlxittxayffgu

# Execute SQL
Write-Host "Executing SQL..."
$sqlContent = Get-Content "create-kv-table.sql" -Raw
$sqlContent | npx supabase db query

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS! KV Store table created" -ForegroundColor Green
    Write-Host "Table: kv_store_04919ac5" -ForegroundColor Yellow
    Write-Host "View at: https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/database/tables"
} else {
    Write-Host "FAILED - Execute SQL manually at:" -ForegroundColor Red
    Write-Host "https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/sql/new"
    exit 1
}
