# Script de déploiement automatique via API Supabase
# Nécessite un Access Token

param(
    [Parameter(Mandatory=$true)]
    [string]$AccessToken
)

$PROJECT_REF = "ptcxeqtjlxittxayffgu"
$FUNCTION_NAME = "make-server-04919ac5"

Write-Host "🚀 Déploiement de $FUNCTION_NAME via API Supabase" -ForegroundColor Cyan
Write-Host "=" * 60

# Créer un bundle des fichiers
Write-Host "📦 Création du bundle..." -ForegroundColor Yellow

$files = @(
    "supabase/functions/$FUNCTION_NAME/index.ts",
    "supabase/functions/$FUNCTION_NAME/arcjet-config.ts",
    "supabase/functions/$FUNCTION_NAME/deno.json",
    "supabase/functions/$FUNCTION_NAME/email_service.tsx",
    "supabase/functions/$FUNCTION_NAME/kv_store.tsx",
    "supabase/functions/$FUNCTION_NAME/pdf_service.tsx",
    "supabase/functions/$FUNCTION_NAME/security_middleware.tsx"
)

# Vérifier que tous les fichiers existent
$allExist = $true
foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        Write-Host "❌ Fichier manquant: $file" -ForegroundColor Red
        $allExist = $false
    }
}

if (-not $allExist) {
    Write-Host "❌ Déploiement annulé - fichiers manquants" -ForegroundColor Red
    exit 1
}

# Créer un fichier tar.gz pour le déploiement
$tempDir = "temp-deploy-$FUNCTION_NAME"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

foreach ($file in $files) {
    $fileName = Split-Path $file -Leaf
    Copy-Item $file "$tempDir/$fileName"
}

Write-Host "✅ Bundle créé" -ForegroundColor Green

# Déployer via API
Write-Host "📤 Déploiement via API Management..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $AccessToken"
    "Content-Type" = "application/json"
}

# API endpoint pour déployer depuis GitHub
$deployUrl = "https://api.supabase.com/v1/projects/$PROJECT_REF/functions/$FUNCTION_NAME/deploy"

$body = @{
    "verify_jwt" = $false
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $deployUrl -Method POST -Headers $headers -Body $body
    
    Write-Host "✅ Déploiement déclenché!" -ForegroundColor Green
    Write-Host "Job ID: $($response.id)" -ForegroundColor Cyan
    
    # Attendre la fin du déploiement
    Write-Host "⏳ Attente de la fin du déploiement..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    Write-Host "✅ Déploiement terminé!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🧪 Testez maintenant avec test-arcjet.html" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Erreur de déploiement" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Vérifiez:" -ForegroundColor Yellow
    Write-Host "   1. Access Token valide" -ForegroundColor White
    Write-Host "   2. Permissions sur le projet" -ForegroundColor White
    Write-Host "   3. Nom de la fonction correct" -ForegroundColor White
}

# Cleanup
Remove-Item -Recurse -Force $tempDir

Write-Host ""
Write-Host "Pour obtenir un Access Token:" -ForegroundColor Yellow
Write-Host "   1. https://supabase.com/dashboard/account/tokens" -ForegroundColor White
Write-Host "   2. Generate new token" -ForegroundColor White
Write-Host "   3. Copier le token" -ForegroundColor White
