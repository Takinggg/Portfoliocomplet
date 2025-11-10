#!/bin/bash

# 🧪 Test rapide du backend déployé

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_URL="https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5"

echo ""
echo "🧪 Test rapide du backend..."
echo ""

# Test health check
echo -n "Testing health check... "
RESPONSE=$(curl -s "$BASE_URL/health")

if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ OK${NC}"
    echo ""
    echo "Réponse du serveur:"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
    echo ""
    echo -e "${GREEN}🎉 Le backend fonctionne parfaitement !${NC}"
else
    echo -e "${RED}❌ ERREUR${NC}"
    echo ""
    echo "Réponse reçue:"
    echo "$RESPONSE"
    echo ""
    echo -e "${RED}Le serveur ne répond pas correctement.${NC}"
    echo ""
    echo "Vérifiez les logs:"
    echo "  supabase functions logs server"
fi

echo ""
