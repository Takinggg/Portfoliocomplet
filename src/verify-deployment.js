#!/usr/bin/env node

/**
 * Script de vérification du déploiement serveur
 * Usage: node verify-deployment.js
 */

const https = require('https');

// Lire le project ID depuis le fichier info.tsx
const fs = require('fs');
const path = require('path');

function getProjectId() {
  try {
    const infoPath = path.join(__dirname, 'utils', 'supabase', 'info.tsx');
    const content = fs.readFileSync(infoPath, 'utf8');
    const match = content.match(/export const projectId = ["']([^"']+)["']/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('❌ Impossible de lire le project ID:', error.message);
    return null;
  }
}

const projectId = getProjectId();

if (!projectId) {
  console.error('❌ Project ID non trouvé dans utils/supabase/info.tsx');
  process.exit(1);
}

console.log(`🔍 Vérification du serveur pour le projet: ${projectId}\n`);

// Routes à vérifier
const routes = [
  { 
    path: '/health', 
    method: 'GET', 
    description: 'Health check',
    requiresAuth: false 
  },
  { 
    path: '/clients', 
    method: 'GET', 
    description: 'Liste des clients',
    requiresAuth: true,
    expectedError: 401 // On s'attend à une erreur 401 (Unauthorized) au lieu de 404
  },
];

function checkRoute(route) {
  return new Promise((resolve) => {
    const url = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5${route.path}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const status = res.statusCode;
        let result = {
          route: route.path,
          description: route.description,
          status,
          success: false,
          message: ''
        };

        if (route.requiresAuth) {
          // Pour les routes protégées, 401 (Unauthorized) est bon signe = route existe
          // 404 (Not Found) = route n'existe pas
          if (status === 401 || status === 403) {
            result.success = true;
            result.message = '✅ Route existe (protection auth active)';
          } else if (status === 404) {
            result.success = false;
            result.message = '❌ Route non trouvée (404) - DÉPLOIEMENT REQUIS';
          } else {
            result.success = false;
            result.message = `⚠️  Status inattendu: ${status}`;
          }
        } else {
          // Pour les routes publiques, 200 ou 2xx est bon
          if (status >= 200 && status < 300) {
            result.success = true;
            result.message = '✅ Route accessible';
          } else {
            result.success = false;
            result.message = `❌ Erreur ${status}`;
          }
        }

        resolve(result);
      });
    }).on('error', (err) => {
      resolve({
        route: route.path,
        description: route.description,
        status: 0,
        success: false,
        message: `❌ Erreur réseau: ${err.message}`
      });
    });
  });
}

async function verifyAll() {
  console.log('🔄 Vérification des routes...\n');
  
  const results = [];
  
  for (const route of routes) {
    const result = await checkRoute(route);
    results.push(result);
    
    console.log(`${result.message}`);
    console.log(`   ${route.method} ${route.path} - ${route.description}`);
    console.log(`   Status: ${result.status}\n`);
  }
  
  const allSuccess = results.every(r => r.success);
  
  console.log('\n' + '='.repeat(60));
  
  if (allSuccess) {
    console.log('✅ SUCCÈS - Toutes les routes sont déployées correctement!');
    console.log('\nVous pouvez maintenant utiliser le dashboard CRM.');
    process.exit(0);
  } else {
    console.log('❌ ÉCHEC - Certaines routes sont manquantes\n');
    console.log('🚨 ACTION REQUISE:');
    console.log('   Exécutez cette commande pour déployer le serveur:\n');
    console.log('   supabase functions deploy make-server-04919ac5\n');
    console.log('📖 Documentation: URGENT_DEPLOIEMENT_REQUIS.md');
    process.exit(1);
  }
}

verifyAll();
