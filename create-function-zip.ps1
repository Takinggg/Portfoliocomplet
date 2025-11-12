# Script pour créer un ZIP de la edge function pour Supabase
$functionName = "make-server-04919ac5"
$sourcePath = "supabase\functions\$functionName"
$zipPath = "$functionName.zip"

# Supprimer l'ancien ZIP s'il existe
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Créer le ZIP avec la bonne structure
Compress-Archive -Path "$sourcePath\*" -DestinationPath $zipPath -CompressionLevel Optimal

Write-Host "✅ ZIP créé : $zipPath" -ForegroundColor Green
Write-Host "📦 Contenu :" -ForegroundColor Cyan
Get-ChildItem $sourcePath | ForEach-Object { Write-Host "   - $($_.Name)" }
Write-Host ""
Write-Host "🚀 Tu peux maintenant uploader ce ZIP dans le dashboard Supabase" -ForegroundColor Yellow
