#!/bin/bash

# 🚨 FIX URGENT : Remplace le DOSSIER _redirects par un FICHIER

echo "🔥 Fix _redirects : Dossier → Fichier"
echo ""

# 1. Supprime tout (dossier ou fichier)
echo "1. Suppression de _redirects (dossier ou fichier)..."
rm -rf public/_redirects

# 2. Crée le FICHIER _redirects
echo "2. Création du FICHIER _redirects..."
echo "/*    /index.html   200" > public/_redirects

# 3. Vérifie que c'est un fichier (pas un dossier)
echo "3. Vérification..."
file public/_redirects

# Devrait afficher : "public/_redirects: ASCII text"
# PAS "directory" !

echo ""
echo "4. Contenu du fichier :"
cat public/_redirects

echo ""
echo "✅ Fichier créé correctement !"
echo ""
echo "🚀 Prochaines étapes :"
echo "   git add public/_redirects vercel.json"
echo "   git commit -m 'fix: Create _redirects as file not folder'"
echo "   git push"
echo ""
echo "⏰ Puis attends 2-3 min que Vercel redéploie"
echo "✅ Teste : https://www.maxence.design/fr"
