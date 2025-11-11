import { projectId, publicAnonKey } from './supabase/info';
import { createClient } from './supabase/client';

/**
 * Diagnostic complet des routes Devis
 * Vérifie si les routes backend sont accessibles
 */

const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5`;

export async function diagnosticQuotesRoutes() {
  console.log('🔍 DIAGNOSTIC DES ROUTES DEVIS');
  console.log('=====================================\n');

  const supabase = createClient();
  
  // Vérifier l'authentification
  console.log('1️⃣ Vérification de l\'authentification...');
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.error('❌ Vous n\'êtes pas authentifié !');
    console.log('💡 Veuillez vous connecter au dashboard avant de tester');
    return {
      success: false,
      error: 'Not authenticated',
      message: 'Veuillez vous connecter au dashboard'
    };
  }
  
  const accessToken = session.access_token;
  console.log('✅ Authentifié avec succès\n');

  // Test 1: Vérifier la route GET /quotes
  console.log('2️⃣ Test GET /quotes (Lister les devis)...');
  try {
    const response = await fetch(`${baseUrl}/quotes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 404) {
      console.error('❌ ERREUR 404 - La route n\'existe pas !');
      console.log('\n🚨 PROBLÈME DÉTECTÉ :');
      console.log('   Les routes n\'ont pas été déployées correctement sur Supabase.');
      console.log('\n📋 SOLUTION :');
      console.log('   1. Ouvrez Supabase Dashboard');
      console.log('   2. Allez dans Edge Functions → make-server-04919ac5');
      console.log('   3. Copiez TOUT le contenu de /supabase/functions/server/index.tsx');
      console.log('   4. Remplacez TOUT le code dans l\'éditeur Supabase');
      console.log('   5. Cliquez sur Deploy');
      console.log('   6. Attendez 30 secondes et réessayez\n');
      
      return {
        success: false,
        error: '404 Not Found',
        message: 'Les routes ne sont pas déployées. Voir la console pour les instructions.'
      };
    }

    const data = await response.json();
    console.log('   Réponse:', data);
    
    if (response.ok) {
      console.log('✅ Route GET /quotes fonctionne !\n');
    } else {
      console.log(`⚠️ Route accessible mais erreur: ${data.error || 'Unknown'}\n`);
    }
  } catch (error: unknown) {
    console.error('❌ Erreur lors du test:', error.message);
  }

  // Test 2: Tester la création d'un devis fictif
  console.log('3️⃣ Test POST /quotes (Créer un devis)...');
  try {
    const testQuote = {
      number: `TEST-${Date.now()}`,
      clientId: 'test-client-id',
      clientName: 'Test Client',
      clientEmail: 'test@example.com',
      amount: 1000,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Test Quote',
      status: 'draft',
      metadata: {}
    };

    const response = await fetch(`${baseUrl}/quotes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testQuote)
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 404) {
      console.error('❌ ERREUR 404 - La route POST n\'existe pas !');
      return {
        success: false,
        error: '404 Not Found on POST',
        message: 'La route POST /quotes n\'est pas déployée.'
      };
    }

    const data = await response.json();
    console.log('   Réponse:', data);
    
    if (response.ok) {
      console.log('✅ Route POST /quotes fonctionne !');
      
      // Nettoyer le devis de test
      if (data.quote?.id) {
        console.log('   🧹 Nettoyage du devis de test...');
        await fetch(`${baseUrl}/quotes/${encodeURIComponent(data.quote.id)}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        console.log('   ✅ Devis de test supprimé\n');
      }
    } else {
      console.log(`⚠️ Route accessible mais erreur: ${data.error || 'Unknown'}\n`);
    }
  } catch (error: unknown) {
    console.error('❌ Erreur lors du test:', error.message);
  }

  // Test 3: Vérifier l'URL exacte
  console.log('4️⃣ Informations de configuration...');
  console.log(`   Project ID: ${projectId}`);
  console.log(`   Base URL: ${baseUrl}`);
  console.log(`   Quotes URL: ${baseUrl}/quotes`);
  console.log('');

  // Résumé
  console.log('=====================================');
  console.log('📊 RÉSUMÉ DU DIAGNOSTIC');
  console.log('=====================================\n');
  console.log('✅ Authentification : OK');
  console.log('⏳ Routes Devis : En cours de vérification...\n');
  console.log('💡 Consultez les logs ci-dessus pour les détails\n');

  return {
    success: true,
    message: 'Diagnostic terminé. Consultez la console pour les détails.'
  };
}

// Export pour utilisation dans la console du navigateur
if (typeof window !== 'undefined') {
  (window as any).diagnosticQuotesRoutes = diagnosticQuotesRoutes;
  console.log('💡 Pour lancer le diagnostic, tapez dans la console :');
  console.log('   diagnosticQuotesRoutes()');
}

