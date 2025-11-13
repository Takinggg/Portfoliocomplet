# Déploiement Supabase via CLI avec token
param(
    [Parameter(Mandatory=$true)]
    [string]$AccessToken
)

Write-Host "Deploying Edge Function with Arcjet..." -ForegroundColor Cyan

# Sauvegarder le token temporairement
$env:SUPABASE_ACCESS_TOKEN = $AccessToken

# Créer le dossier .supabase s'il n'existe pas
$supabaseDir = "$env:USERPROFILE\.supabase"
if (-not (Test-Path $supabaseDir)) {
    New-Item -ItemType Directory -Path $supabaseDir -Force | Out-Null
}

# Sauvegarder le token
Set-Content -Path "$supabaseDir\access-token" -Value $AccessToken

Write-Host "Token saved. Attempting deployment..." -ForegroundColor Yellow

# Lier le projet
try {
    npx supabase link --project-ref ptcxeqtjlxittxayffgu 2>&1 | Out-Null
    Write-Host "Project linked successfully" -ForegroundColor Green
} catch {
    Write-Host "Warning: Link failed, continuing..." -ForegroundColor Yellow
}

# Déployer
Write-Host "Deploying function..." -ForegroundColor Cyan
npx supabase functions deploy make-server-04919ac5 --project-ref ptcxeqtjlxittxayffgu --no-verify-jwt

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Function deployed with Arcjet" -ForegroundColor Green
    Write-Host "Test now with test-arcjet.html" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Deployment failed. Try manual deployment:" -ForegroundColor Red
    Write-Host "https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions" -ForegroundColor White
}
