#!/bin/bash

# Supabase Stripe Configuration Script
# This script helps configure Stripe keys in Supabase

echo "🔑 Stripe Configuration for Supabase"
echo "===================================="
echo ""
echo "This script will help you add Stripe keys to your Supabase Edge Function"
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install it with:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "📋 You need the following information from Stripe:"
echo "   1. STRIPE_SECRET_KEY (sk_live_... or sk_test_...)"
echo "   2. STRIPE_WEBHOOK_SECRET (whsec_...)"
echo ""

read -p "Enter your STRIPE_SECRET_KEY: " STRIPE_SECRET_KEY
read -p "Enter your STRIPE_WEBHOOK_SECRET: " STRIPE_WEBHOOK_SECRET

echo ""
echo "⏳ Setting Stripe secrets in Supabase..."

# Set the secrets
supabase secrets set STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY"
supabase secrets set STRIPE_WEBHOOK_SECRET="$STRIPE_WEBHOOK_SECRET"

echo ""
echo "✅ Stripe secrets configured!"
echo ""
echo "📝 Next steps:"
echo "   1. Verify in Supabase Dashboard → Functions → Settings"
echo "   2. Deploy the function: supabase functions deploy make-server-04919ac5"
echo "   3. Test payments with Stripe test keys"
echo ""
echo "🔗 Resources:"
echo "   - Stripe Dashboard: https://dashboard.stripe.com"
echo "   - Setup Guide: ./STRIPE_SETUP.md"
