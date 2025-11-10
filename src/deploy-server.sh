#!/bin/bash

# 🚀 Script de déploiement COMPLET du serveur Supabase
# Ce script déploie le serveur backend avec TOUTES les fonctionnalités

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DÉPLOIEMENT DU SERVEUR BACKEND COMPLET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Vérifier si Supabase CLI est installé
echo "🔍 Vérification de Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI n'est pas installé${NC}"
    echo ""
    echo "Pour installer Supabase CLI :"
    echo ""
    echo -e "${CYAN}  npm install -g supabase${NC}"
    echo ""
    echo "Ou avec Homebrew (macOS) :"
    echo ""
    echo -e "${CYAN}  brew install supabase/tap/supabase${NC}"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Supabase CLI détecté${NC}"
echo ""

# Vérifier si on est connecté
echo "🔐 Vérification de la connexion Supabase..."
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vous n'êtes pas connecté à Supabase${NC}"
    echo ""
    echo "Pour vous connecter :"
    echo ""
    echo -e "${CYAN}  supabase login${NC}"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Connecté à Supabase${NC}"
echo ""

# Vérifier les fichiers du serveur
echo "📦 Vérification des fichiers du serveur..."
if [ ! -f "supabase/functions/server/index.tsx" ]; then
    echo -e "${RED}❌ Fichier serveur introuvable${NC}"
    exit 1
fi

if [ ! -f "supabase/functions/server/kv_store.tsx" ]; then
    echo -e "${RED}❌ Fichier kv_store.tsx introuvable${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Tous les fichiers sont présents${NC}"
echo ""

# Afficher les routes qui seront déployées
echo -e "${BLUE}📍 Routes qui seront disponibles :${NC}"
echo ""
echo "  ✅ AUTH: /auth/init-admin, /auth/login"
echo "  ✅ NEWSLETTER: /newsletter/subscribe, /newsletter/stats"
echo "  ✅ CONTACTS/LEADS: /contacts, /leads (CRUD)"
echo "  ✅ CLIENTS: /clients (CRUD)"
echo "  ✅ QUOTES: /quotes (CRUD + email)"
echo "  ✅ INVOICES: /invoices (CRUD + email)"
echo "  ✅ BOOKINGS: /bookings (CRUD + email)"
echo "  ✅ PROJECTS: /projects"
echo "  ✅ CASE STUDIES: /case-studies (CRUD)"
echo "  ✅ FAQ: /faq (CRUD)"
echo "  ✅ BLOG: /blog/posts (CRUD + comments)"
echo "  ✅ ANALYTICS: /analytics/*"
echo "  ✅ TESTIMONIALS: /testimonials (CRUD)"
echo "  ✅ RESOURCES: /resources (CRUD + downloads)"
echo ""

# Demander confirmation
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📦 Prêt à déployer le serveur COMPLET${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
read -p "Continuer le déploiement ? (y/n) " -n 1 -r
echo ""
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Déploiement annulé${NC}"
    exit 0
fi

# Déployer la fonction
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DÉPLOIEMENT EN COURS..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if supabase functions deploy server --no-verify-jwt; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}✅ ✅ ✅ DÉPLOIEMENT RÉUSSI ! ✅ ✅ ✅${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo -e "${BLUE}🌐 Votre serveur backend est maintenant en ligne !${NC}"
    echo ""
    echo "Health Check URL:"
    echo -e "${CYAN}  https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${YELLOW}📋 PROCHAINES ÉTAPES${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1️⃣  Tester le serveur:"
    echo -e "    ${CYAN}curl https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health${NC}"
    echo ""
    echo "2️⃣  Initialiser l'admin (première fois uniquement):"
    echo "    - Aller sur /dashboard"
    echo "    - Le compte admin sera créé automatiquement"
    echo "    - Email: contact@maxence.design"
    echo "    - Password: vbz657D9"
    echo ""
    echo "3️⃣  Peupler la base de données:"
    echo "    - Aller sur /dashboard"
    echo "    - Utiliser les boutons 'Seed' dans chaque onglet"
    echo "    - Ou importer vos propres données"
    echo ""
    echo "4️⃣  Vérifier que tout fonctionne:"
    echo "    - Blog: /blog"
    echo "    - Case Studies: /case-studies"
    echo "    - Resources: /resources"
    echo "    - FAQ: /faq"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}🎉 Votre backend CRM est maintenant opérationnel !${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Test automatique du serveur
    echo "🧪 Test automatique du serveur..."
    echo ""
    
    HEALTH_RESPONSE=$(curl -s https://ptcxeqtjlxittxayffgu.supabase.co/functions/v1/make-server-04919ac5/health)
    
    if echo "$HEALTH_RESPONSE" | grep -q "success"; then
        echo -e "${GREEN}✅ Le serveur répond correctement !${NC}"
        echo ""
        echo "Réponse du serveur:"
        echo "$HEALTH_RESPONSE" | jq '.' 2>/dev/null || echo "$HEALTH_RESPONSE"
    else
        echo -e "${YELLOW}⚠️  Le serveur ne répond pas comme prévu${NC}"
        echo ""
        echo "Réponse reçue:"
        echo "$HEALTH_RESPONSE"
    fi
    
    echo ""
    echo "Pour voir les logs en temps réel:"
    echo -e "${CYAN}  supabase functions logs server --follow${NC}"
    echo ""
else
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${RED}❌ ERREUR LORS DU DÉPLOIEMENT${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Pour voir les logs d'erreur:"
    echo -e "${CYAN}  supabase functions logs server${NC}"
    echo ""
    echo "Pour réessayer:"
    echo -e "${CYAN}  ./deploy-server.sh${NC}"
    echo ""
    exit 1
fi
