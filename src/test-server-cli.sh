#!/bin/bash

# Script de test rapide du serveur Supabase Edge Function
# Usage: ./test-server-cli.sh

# Couleurs pour le terminal
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
PROJECT_ID="ptcxeqtjlxittxayffgu"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y3hlcXRqbHhpdHR4YXlmZmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY1MjYsImV4cCI6MjA3Nzg4MjUyNn0.4xmzyoXUxas6587ZFWWc95p10bNSa2MdaipYI7RHmZc"
BASE_URL="https://${PROJECT_ID}.supabase.co/functions/v1/make-server-04919ac5"

echo -e "${BOLD}🚀 Test du serveur Supabase Edge Function${NC}\n"
echo -e "${BLUE}Project ID:${NC} ${PROJECT_ID}"
echo -e "${BLUE}Base URL:${NC} ${BASE_URL}\n"

# Compteurs
SUCCESS=0
ERROR=0
WARNING=0

echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Test 1: Health Check
echo -e "${BOLD}1️⃣  Test Health Check...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET \
  "${BASE_URL}/health" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  --max-time 10 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ Health Check OK${NC}"
  echo -e "   ${BODY}" | head -n 3
  ((SUCCESS++))
else
  echo -e "${RED}❌ Health Check échoué (HTTP ${HTTP_CODE})${NC}"
  echo -e "   ${RED}${BODY}${NC}" | head -n 2
  ((ERROR++))
fi
echo ""

# Test 2: Blog Posts
echo -e "${BOLD}2️⃣  Test Blog Posts...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET \
  "${BASE_URL}/blog/posts?lang=fr" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  --max-time 10 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  COUNT=$(echo "$BODY" | grep -o '"id"' | wc -l)
  if [ "$COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Blog Posts OK (${COUNT} articles)${NC}"
    ((SUCCESS++))
  else
    echo -e "${YELLOW}⚠️  Blog Posts OK mais aucun article${NC}"
    ((WARNING++))
  fi
else
  echo -e "${RED}❌ Blog Posts échoué (HTTP ${HTTP_CODE})${NC}"
  ((ERROR++))
fi
echo ""

# Test 3: Newsletter Stats
echo -e "${BOLD}3️⃣  Test Newsletter Stats...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET \
  "${BASE_URL}/newsletter/stats" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  --max-time 10 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ Newsletter Stats OK${NC}"
  echo -e "   ${BODY}" | head -n 3
  ((SUCCESS++))
else
  echo -e "${RED}❌ Newsletter Stats échoué (HTTP ${HTTP_CODE})${NC}"
  ((ERROR++))
fi
echo ""

# Test 4: Projects
echo -e "${BOLD}4️⃣  Test Projects...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET \
  "${BASE_URL}/projects" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  --max-time 10 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  COUNT=$(echo "$BODY" | grep -o '"id"' | wc -l)
  if [ "$COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Projects OK (${COUNT} projets)${NC}"
    ((SUCCESS++))
  else
    echo -e "${YELLOW}⚠️  Projects OK mais aucun projet${NC}"
    ((WARNING++))
  fi
else
  echo -e "${RED}❌ Projects échoué (HTTP ${HTTP_CODE})${NC}"
  ((ERROR++))
fi
echo ""

# Résumé
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
echo -e "${BOLD}📊 RÉSUMÉ${NC}\n"
echo -e "   ${GREEN}✅ Réussis: ${SUCCESS}${NC}"
echo -e "   ${YELLOW}⚠️  Avertissements: ${WARNING}${NC}"
echo -e "   ${RED}❌ Erreurs: ${ERROR}${NC}\n"

# Message final
if [ $ERROR -eq 0 ] && [ $WARNING -eq 0 ]; then
  echo -e "${GREEN}${BOLD}🎉 Tous les tests sont passés avec succès !${NC}"
  echo -e "${GREEN}Le serveur fonctionne parfaitement.${NC}\n"
  exit 0
elif [ $ERROR -gt 0 ]; then
  echo -e "${RED}${BOLD}⚠️  Des erreurs ont été détectées.${NC}"
  echo -e "${YELLOW}Actions recommandées :${NC}"
  echo -e "  1. Vérifiez les logs: supabase functions logs server --tail"
  echo -e "  2. Vérifiez le déploiement: supabase functions list"
  echo -e "  3. Redéployez si nécessaire: supabase functions deploy server --no-verify-jwt\n"
  echo -e "${BLUE}Liens utiles :${NC}"
  echo -e "  • Logs: https://supabase.com/dashboard/project/${PROJECT_ID}/logs/edge-functions"
  echo -e "  • Dashboard: https://supabase.com/dashboard/project/${PROJECT_ID}\n"
  exit 1
else
  echo -e "${YELLOW}${BOLD}⚠️  Le serveur fonctionne mais certaines données manquent.${NC}"
  echo -e "${YELLOW}Utilisez les boutons d'initialisation dans le dashboard.${NC}\n"
  exit 0
fi
