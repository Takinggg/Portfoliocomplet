# Script de deploiement du serveur Supabase Edge Function
# Copie les fichiers du dossier src/supabase/functions/server vers supabase/functions/make-server-04919ac5

Write-Host "Deploiement du serveur Supabase..." -ForegroundColor Cyan

# Creer le dossier de destination si necessaire
$destDir = "supabase\functions\make-server-04919ac5"
if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    Write-Host "Dossier cree: $destDir" -ForegroundColor Green
}

# Copier index.tsx comme index.ts (Supabase prefere .ts)
Copy-Item "src\supabase\functions\server\index.tsx" "$destDir\index.ts" -Force
Write-Host "Copie: index.ts" -ForegroundColor Green

# Copier email_service.tsx
Copy-Item "src\supabase\functions\server\email_service.tsx" "$destDir\email_service.tsx" -Force
Write-Host "Copie: email_service.tsx" -ForegroundColor Green

# Copier les autres fichiers necessaires
$filesToCopy = @(
    "security_middleware.tsx",
    "kv_store.tsx",
    "pdf_service.tsx"
)

foreach ($file in $filesToCopy) {
    $sourcePath = "src\supabase\functions\server\$file"
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath "$destDir\$file" -Force
        Write-Host "Copie: $file" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Deploiement vers Supabase..." -ForegroundColor Cyan

# Déployer
Set-Location supabase\functions
npx supabase functions deploy make-server-04919ac5 --no-verify-jwt

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Deploiement reussi!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Erreur lors du deploiement" -ForegroundColor Red
}

# Retour au dossier racine
Set-Location ..\..
