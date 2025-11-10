/**
 * Force Load Test URLs
 * AGGRESSIVE loading of test utilities
 */

import { allRoutes, type RouteTest } from './testAllURLs';

// Test function
function printAllRoutes() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║           📋 TOUTES LES URLS DU SITE (36+)                    ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log('');

  const frenchRoutes = allRoutes.filter(r => r.language === 'fr');
  const englishRoutes = allRoutes.filter(r => r.language === 'en');
  const neutralRoutes = allRoutes.filter(r => r.language === 'neutral');

  console.log('🇫🇷 ROUTES FRANÇAISES (' + frenchRoutes.length + '):');
  console.log('─────────────────────────────────');
  frenchRoutes.forEach(route => {
    const icon = route.type === 'dynamic' ? '📝' : 
                 route.type === 'protected' ? '🔐' : 
                 route.type === 'technical' ? '🛠️' : '📄';
    console.log(`  ${icon} ${route.path} → ${route.description}`);
    if (route.exampleDynamic) {
      console.log(`     Exemple: ${route.exampleDynamic}`);
    }
  });

  console.log('');
  console.log('🇬🇧 ROUTES ANGLAISES (' + englishRoutes.length + '):');
  console.log('─────────────────────────────────');
  englishRoutes.forEach(route => {
    const icon = route.type === 'dynamic' ? '📝' : 
                 route.type === 'protected' ? '🔐' : 
                 route.type === 'technical' ? '🛠️' : '📄';
    console.log(`  ${icon} ${route.path} → ${route.description}`);
    if (route.exampleDynamic) {
      console.log(`     Example: ${route.exampleDynamic}`);
    }
  });

  if (neutralRoutes.length > 0) {
    console.log('');
    console.log('🌐 ROUTES NEUTRES (' + neutralRoutes.length + '):');
    console.log('─────────────────────────────────');
    neutralRoutes.forEach(route => {
      const icon = route.type === 'dynamic' ? '📝' : 
                   route.type === 'protected' ? '🔐' : 
                   route.type === 'technical' ? '🛠️' : '📄';
      console.log(`  ${icon} ${route.path} → ${route.description}`);
    });
  }

  console.log('');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log('║  TOTAL: ' + allRoutes.length + ' routes configurées                                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
}

function showURLStructure() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║           🌳 STRUCTURE ARBORESCENTE DES URLS                   ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log('');
  console.log('📱 SITE PORTFOLIO BILINGUE');
  console.log('│');
  console.log('├── 🇫🇷 FRANÇAIS (Racine /)');
  console.log('│   ├── / (Accueil)');
  console.log('│   ├── /projects (Portfolio)');
  console.log('│   │   └── /projects/:id (Détail projet)');
  console.log('│   ├── /services');
  console.log('│   ├── /about');
  console.log('│   ├── /contact');
  console.log('│   ├── /booking');
  console.log('│   ├── /blog');
  console.log('│   │   └── /blog/:slug');
  console.log('│   ├── /case-studies');
  console.log('│   │   └── /case-studies/:id');
  console.log('│   ├── /faq');
  console.log('│   ├── /resources');
  console.log('│   └── /testimonials');
  console.log('│');
  console.log('├── 🇬🇧 ENGLISH (/en/)');
  console.log('│   ├── /en/ (Homepage)');
  console.log('│   ├── /en/projects (Portfolio)');
  console.log('│   │   └── /en/projects/:id (Project detail)');
  console.log('│   ├── /en/services');
  console.log('│   ├── /en/about');
  console.log('│   ├── /en/contact');
  console.log('│   ├── /en/booking');
  console.log('│   ├── /en/blog');
  console.log('│   │   └── /en/blog/:slug');
  console.log('│   ├── /en/case-studies');
  console.log('│   │   └── /en/case-studies/:id');
  console.log('│   ├── /en/faq');
  console.log('│   ├── /en/resources');
  console.log('│   └── /en/testimonials');
  console.log('│');
  console.log('├── 🔐 AUTHENTIFICATION');
  console.log('│   ├── /login');
  console.log('│   └── /dashboard (CRM)');
  console.log('│');
  console.log('└── 🛠️ TECHNIQUE');
  console.log('    ├── /newsletter-debug');
  console.log('    ├── /server-diagnostic');
  console.log('    ├── /sync-dashboard');
  console.log('    └── /newsletter/confirm/:token');
  console.log('');
  console.log('╚════════════════════════════════════════════════════════════════╝');
}

// FORCE initialization immediately
const initTestURLs = () => {
  if (typeof window !== 'undefined') {
    // Create namespace
    (window as any).testAllURLs = {
      printAllRoutes,
      showURLStructure,
      allRoutes,
    };
    
    console.log('✅ Test URLs utilities loaded successfully!');
    console.log('💡 Try: window.testAllURLs.printAllRoutes()');
  }
};

// Execute immediately
initTestURLs();

// Also try after DOM load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestURLs);
  }
  
  // And after full load
  window.addEventListener('load', initTestURLs);
}

export { printAllRoutes, showURLStructure };
