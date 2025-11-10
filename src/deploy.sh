#!/bin/bash

# Script de déploiement rapide du serveur Edge Function
# Usage: ./deploy.sh

set -e

echo "🚀 Déploiement du serveur Edge Function"
echo ""

# Vérifier si Supabase CLI est installé
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI n'est pas installé"
    echo ""
    echo "Installation:"
    echo "  npm install -g supabase"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI détecté"
echo ""

# Vérifier si le projet est lié
if [ ! -f ".supabase/config.toml" ]; then
    echo "⚠️  Projet non lié"
    echo ""
    echo "Liaison du projet..."
    supabase link --project-ref ptcxeqtjlxittxayffgu
    echo ""
fi

echo "📦 Déploiement de la fonction 'server'..."
echo ""

supabase functions deploy server

echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "🧪 Vérification..."
echo ""

# Tester le health check
HEALTH_URL="https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health"

if command -v curl &> /dev/null; then
    echo "Testing: $HEALTH_URL"
    echo ""
    
    RESPONSE=$(curl -s -w "\n%{http_code}" "$HEALTH_URL" \
        -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y3hlcXRqbHhpdHR4YXlmZmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY1MjYsImV4cCI6MjA3Nzg4MjUyNn0.4xmzyoXUxas6587ZFWWc95p10bNSa2MdaipYI7RHmZc")
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n-1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ Serveur opérationnel!"
        echo ""
        echo "Réponse:"
        echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
    else
        echo "❌ Erreur HTTP $HTTP_CODE"
        echo ""
        echo "Réponse:"
        echo "$BODY"
    fi
else
    echo "⚠️  curl non disponible, test manuel requis"
    echo ""
    echo "Testez dans votre navigateur:"
    echo "$HEALTH_URL"
fi

echo ""
echo "📋 Prochaines étapes:"
echo "  1. Rechargez l'application"
echo "  2. Ouvrez la console du navigateur"
echo "  3. Exécutez: testServerConnection()"
echo ""
echo "📊 Logs: https://supabase.com/dashboard/project/ptcxeqtjlxittxayffgu/logs/edge-functions"
echo ""
