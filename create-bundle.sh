#!/usr/bin/env bash

# Script de création d'un bundle pour déploiement manuel
# Supabase Dashboard ne supporte pas npm install -g

echo "📦 Création du bundle Supabase..."

# Créer le dossier de build
mkdir -p build-edge-function

# Copier les fichiers
cp supabase/functions/make-server-04919ac5/index.ts build-edge-function/
cp supabase/functions/make-server-04919ac5/arcjet-config.ts build-edge-function/
cp supabase/functions/make-server-04919ac5/deno.json build-edge-function/

# Autres fichiers si présents
cp supabase/functions/make-server-04919ac5/*.tsx build-edge-function/ 2>/dev/null || true

echo "✅ Bundle créé dans build-edge-function/"
echo ""
echo "📋 Instructions de déploiement manuel:"
echo "1. Aller sur: https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/functions"
echo "2. Cliquer sur make-server-04919ac5"
echo "3. Upload les fichiers de build-edge-function/"
echo "4. Vérifier que ARCJET_KEY est dans les secrets"
echo "5. Déployer"
