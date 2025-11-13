# Script de déploiement de la fonction Supabase avec Arcjet

Write-Host "🚀 Déploiement de l'Edge Function avec Arcjet" -ForegroundColor Cyan
Write-Host "=" * 50

# Vérifier si supabase CLI est installé
if (!(Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Supabase CLI n'est pas installé" -ForegroundColor Red
    Write-Host ""
    Write-Host "📦 Installation requise:" -ForegroundColor Yellow
    Write-Host "   npm install -g supabase" -ForegroundColor White
    Write-Host ""
    Write-Host "Ou via Chocolatey:" -ForegroundColor Yellow
    Write-Host "   choco install supabase" -ForegroundColor White
    exit 1
}

Write-Host "✅ Supabase CLI détecté" -ForegroundColor Green

# Login si nécessaire
Write-Host ""
Write-Host "🔐 Vérification de l'authentification..." -ForegroundColor Cyan
$loginStatus = supabase projects list 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Non authentifié" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pour vous connecter:" -ForegroundColor Yellow
    Write-Host "   supabase login" -ForegroundColor White
    Write-Host ""
    Write-Host "Puis configurez votre projet:" -ForegroundColor Yellow
    Write-Host "   supabase link --project-ref ptcxeqtjlxittxayffgu" -ForegroundColor White
    exit 1
}

Write-Host "✅ Authentifié" -ForegroundColor Green

# Déployer la fonction
Write-Host ""
Write-Host "📤 Déploiement de make-server-04919ac5..." -ForegroundColor Cyan

supabase functions deploy make-server-04919ac5 --no-verify-jwt

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Déploiement réussi!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔍 Vérifiez les logs:" -ForegroundColor Cyan
    Write-Host "   supabase functions logs make-server-04919ac5" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Vérifiez les secrets:" -ForegroundColor Cyan
    Write-Host "   supabase secrets list" -ForegroundColor White
    Write-Host ""
    Write-Host "🧪 Testez avec test-arcjet.html" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Erreur de déploiement" -ForegroundColor Red
    Write-Host "Consultez les logs ci-dessus pour plus de détails" -ForegroundColor Yellow
}
