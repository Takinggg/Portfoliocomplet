#!/bin/bash

# 🧪 Script de test du backend déployé
# Teste toutes les routes principales pour vérifier que le serveur fonctionne

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 TEST DU BACKEND DÉPLOYÉ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_URL="https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5"

# Fonction pour tester une route
test_route() {
    local method=$1
    local route=$2
    local description=$3
    
    echo -n "Testing $description... "
    
    response=$(curl -s -X $method "$BASE_URL$route" -w "\n%{http_code}")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✅ OK ($http_code)${NC}"
        return 0
    elif [ "$http_code" = "401" ]; then
        echo -e "${YELLOW}🔒 Auth Required ($http_code)${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL ($http_code)${NC}"
        return 1
    fi
}

echo -e "${BLUE}📡 Testing Public Routes...${NC}"
echo ""

test_route "GET" "/health" "Health Check"
test_route "GET" "/projects" "Projects List"
test_route "GET" "/blog/posts" "Blog Posts"
test_route "GET" "/case-studies" "Case Studies"
test_route "GET" "/faq" "FAQ"
test_route "GET" "/testimonials" "Testimonials"
test_route "GET" "/resources" "Resources"

echo ""
echo -e "${BLUE}🔒 Testing Protected Routes (should require auth)...${NC}"
echo ""

test_route "GET" "/leads" "Leads (Protected)"
test_route "GET" "/clients" "Clients (Protected)"
test_route "GET" "/quotes" "Quotes (Protected)"
test_route "GET" "/invoices" "Invoices (Protected)"
test_route "GET" "/bookings" "Bookings (Protected)"
test_route "GET" "/newsletter/subscribers" "Newsletter Subscribers (Protected)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Tests terminés !${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Health Check détaillé:"
curl -s "$BASE_URL/health" | jq '.' 2>/dev/null || curl -s "$BASE_URL/health"
echo ""
