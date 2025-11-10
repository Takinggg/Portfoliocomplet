/**
 * Test All URLs
 * Verify that all routes are properly configured
 */

export interface RouteTest {
  path: string;
  language: 'fr' | 'en' | 'neutral';
  type: 'static' | 'dynamic' | 'protected' | 'technical';
  description: string;
  requiresAuth?: boolean;
  exampleDynamic?: string;
}

export const allRoutes: RouteTest[] = [
  // ========================================
  // ROOT REDIRECT
  // ========================================
  {
    path: '/',
    language: 'neutral',
    type: 'static',
    description: 'Root → Redirects to /fr',
  },
  
  // ========================================
  // FRENCH ROUTES (/fr/...)
  // ========================================
  {
    path: '/fr',
    language: 'fr',
    type: 'static',
    description: 'Page d\'accueil française',
  },
  {
    path: '/fr/projects',
    language: 'fr',
    type: 'static',
    description: 'Liste des projets (FR)',
  },
  {
    path: '/fr/projects/:projectId',
    language: 'fr',
    type: 'dynamic',
    description: 'Détail d\'un projet (FR)',
    exampleDynamic: '/fr/projects/taskflow-2024',
  },
  {
    path: '/fr/services',
    language: 'fr',
    type: 'static',
    description: 'Page services (FR)',
  },
  {
    path: '/fr/about',
    language: 'fr',
    type: 'static',
    description: 'Page à propos (FR)',
  },
  {
    path: '/fr/contact',
    language: 'fr',
    type: 'static',
    description: 'Page contact (FR)',
  },
  {
    path: '/fr/booking',
    language: 'fr',
    type: 'static',
    description: 'Page réservation (FR)',
  },
  {
    path: '/fr/blog',
    language: 'fr',
    type: 'static',
    description: 'Liste des articles de blog (FR)',
  },
  {
    path: '/fr/blog/:slug',
    language: 'fr',
    type: 'dynamic',
    description: 'Article de blog (FR)',
    exampleDynamic: '/fr/blog/optimiser-seo-react-2024',
  },
  {
    path: '/fr/case-studies',
    language: 'fr',
    type: 'static',
    description: 'Liste des études de cas (FR)',
  },
  {
    path: '/fr/case-studies/:caseStudyId',
    language: 'fr',
    type: 'dynamic',
    description: 'Détail d\'une étude de cas (FR)',
    exampleDynamic: '/fr/case-studies/refonte-ecommerce',
  },
  {
    path: '/fr/faq',
    language: 'fr',
    type: 'static',
    description: 'Page FAQ (FR)',
  },
  {
    path: '/fr/resources',
    language: 'fr',
    type: 'static',
    description: 'Ressources professionnelles (FR)',
  },
  {
    path: '/fr/testimonials',
    language: 'fr',
    type: 'static',
    description: 'Témoignages clients (FR)',
  },

  // ========================================
  // ENGLISH ROUTES (/en/...)
  // ========================================
  {
    path: '/en',
    language: 'en',
    type: 'static',
    description: 'English home page',
  },
  {
    path: '/en/projects',
    language: 'en',
    type: 'static',
    description: 'Projects list (EN)',
  },
  {
    path: '/en/projects/:projectId',
    language: 'en',
    type: 'dynamic',
    description: 'Project detail (EN)',
    exampleDynamic: '/en/projects/taskflow-2024',
  },
  {
    path: '/en/services',
    language: 'en',
    type: 'static',
    description: 'Services page (EN)',
  },
  {
    path: '/en/about',
    language: 'en',
    type: 'static',
    description: 'About page (EN)',
  },
  {
    path: '/en/contact',
    language: 'en',
    type: 'static',
    description: 'Contact page (EN)',
  },
  {
    path: '/en/booking',
    language: 'en',
    type: 'static',
    description: 'Booking page (EN)',
  },
  {
    path: '/en/blog',
    language: 'en',
    type: 'static',
    description: 'Blog posts list (EN)',
  },
  {
    path: '/en/blog/:slug',
    language: 'en',
    type: 'dynamic',
    description: 'Blog post (EN)',
    exampleDynamic: '/en/blog/optimize-seo-react-2024',
  },
  {
    path: '/en/case-studies',
    language: 'en',
    type: 'static',
    description: 'Case studies list (EN)',
  },
  {
    path: '/en/case-studies/:caseStudyId',
    language: 'en',
    type: 'dynamic',
    description: 'Case study detail (EN)',
    exampleDynamic: '/en/case-studies/ecommerce-redesign',
  },
  {
    path: '/en/faq',
    language: 'en',
    type: 'static',
    description: 'FAQ page (EN)',
  },
  {
    path: '/en/resources',
    language: 'en',
    type: 'static',
    description: 'Professional resources (EN)',
  },
  {
    path: '/en/testimonials',
    language: 'en',
    type: 'static',
    description: 'Client testimonials (EN)',
  },

  // ========================================
  // PROTECTED ROUTES
  // ========================================
  {
    path: '/login',
    language: 'neutral',
    type: 'protected',
    description: 'Login page',
  },
  {
    path: '/dashboard',
    language: 'neutral',
    type: 'protected',
    description: 'CRM Dashboard (requires authentication)',
    requiresAuth: true,
  },

  // ========================================
  // TECHNICAL ROUTES
  // ========================================
  {
    path: '/newsletter-debug',
    language: 'neutral',
    type: 'technical',
    description: 'Newsletter debugging page',
  },
  {
    path: '/server-diagnostic',
    language: 'neutral',
    type: 'technical',
    description: 'Server diagnostic page',
  },
  {
    path: '/sync-dashboard',
    language: 'neutral',
    type: 'technical',
    description: 'Data synchronization dashboard',
  },
  {
    path: '/newsletter/confirm/:token',
    language: 'neutral',
    type: 'dynamic',
    description: 'Newsletter confirmation',
    exampleDynamic: '/newsletter/confirm/abc123xyz',
  },
];

/**
 * Test if a route exists in the defined routes
 */
export function testRoute(path: string): boolean {
  return allRoutes.some(route => {
    // Exact match for static routes
    if (route.path === path) return true;
    
    // Pattern match for dynamic routes
    const pattern = route.path.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(path);
  });
}

/**
 * Get route information
 */
export function getRouteInfo(path: string): RouteTest | null {
  return allRoutes.find(route => {
    if (route.path === path) return true;
    const pattern = route.path.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(path);
  }) || null;
}

/**
 * Get all routes by type
 */
export function getRoutesByType(type: RouteTest['type']): RouteTest[] {
  return allRoutes.filter(route => route.type === type);
}

/**
 * Get all routes by language
 */
export function getRoutesByLanguage(language: RouteTest['language']): RouteTest[] {
  return allRoutes.filter(route => route.language === language);
}

/**
 * Print all routes to console (organized)
 */
export function printAllRoutes(): void {
  console.log('\n🗺️ TOUTES LES ROUTES DU SITE\n');
  console.log('════════════════════════════════════════════════════════════');
  
  // French routes
  console.log('\n🇫🇷 ROUTES FRANÇAISES (11 pages statiques)\n');
  const frenchRoutes = getRoutesByLanguage('fr');
  frenchRoutes.forEach(route => {
    const icon = route.type === 'dynamic' ? '📝' : '📄';
    const example = route.exampleDynamic ? ` (ex: ${route.exampleDynamic})` : '';
    console.log(`  ${icon} ${route.path}${example}`);
    console.log(`     ${route.description}`);
  });
  
  // English routes
  console.log('\n🇬🇧 ROUTES ANGLAISES (11 pages statiques)\n');
  const englishRoutes = getRoutesByLanguage('en');
  englishRoutes.forEach(route => {
    const icon = route.type === 'dynamic' ? '📝' : '📄';
    const example = route.exampleDynamic ? ` (ex: ${route.exampleDynamic})` : '';
    console.log(`  ${icon} ${route.path}${example}`);
    console.log(`     ${route.description}`);
  });
  
  // Protected routes
  console.log('\n🔐 ROUTES PROTÉGÉES\n');
  const protectedRoutes = getRoutesByType('protected');
  protectedRoutes.forEach(route => {
    const authIcon = route.requiresAuth ? '🔒' : '🔓';
    console.log(`  ${authIcon} ${route.path}`);
    console.log(`     ${route.description}`);
  });
  
  // Technical routes
  console.log('\n🛠️ ROUTES TECHNIQUES\n');
  const technicalRoutes = getRoutesByType('technical');
  technicalRoutes.forEach(route => {
    const icon = route.type === 'dynamic' ? '📝' : '🔧';
    const example = route.exampleDynamic ? ` (ex: ${route.exampleDynamic})` : '';
    console.log(`  ${icon} ${route.path}${example}`);
    console.log(`     ${route.description}`);
  });
  
  // Statistics
  console.log('\n📊 STATISTIQUES\n');
  console.log(`  Total routes définies: ${allRoutes.length}`);
  console.log(`  - Routes FR: ${frenchRoutes.length}`);
  console.log(`  - Routes EN: ${englishRoutes.length}`);
  console.log(`  - Routes protégées: ${protectedRoutes.length}`);
  console.log(`  - Routes techniques: ${technicalRoutes.length}`);
  console.log(`  - Routes statiques: ${getRoutesByType('static').length}`);
  console.log(`  - Routes dynamiques: ${getRoutesByType('dynamic').length}`);
  
  console.log('\n════════════════════════════════════════════════════════════\n');
}

/**
 * Test URL accessibility (basic check)
 */
export async function testURLAccessibility(url: string): Promise<boolean> {
  try {
    const fullURL = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    const response = await fetch(fullURL, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Error testing URL ${url}:`, error);
    return false;
  }
}

/**
 * Test all static routes
 */
export async function testAllStaticRoutes(): Promise<void> {
  console.log('\n🧪 TEST DE TOUTES LES ROUTES STATIQUES\n');
  console.log('════════════════════════════════════════════════════════════');
  
  const staticRoutes = getRoutesByType('static');
  let passed = 0;
  let failed = 0;
  
  for (const route of staticRoutes) {
    const accessible = await testURLAccessibility(route.path);
    const icon = accessible ? '✅' : '❌';
    console.log(`  ${icon} ${route.path} - ${route.description}`);
    
    if (accessible) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n════════════════════════════════════════════════════════════');
  console.log(`  Résultat: ${passed} ✅ / ${failed} ❌ (Total: ${staticRoutes.length})`);
  console.log('════════════════════════════════════════════════════════════\n');
}

/**
 * Quick URL structure overview
 */
export function showURLStructure(): void {
  console.log('\n📐 STRUCTURE DES URLs\n');
  console.log('votredomaine.com/');
  console.log('│');
  console.log('├── 🇫🇷 FRANÇAIS (default)');
  console.log('│   ├── /');
  console.log('│   ├── /projects');
  console.log('│   │   └── /projects/:id');
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
  console.log('├── 🇬🇧 ANGLAIS (/en)');
  console.log('│   ├── /en/');
  console.log('│   ├── /en/projects');
  console.log('│   │   └── /en/projects/:id');
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
  console.log('│   └── /dashboard (protégé)');
  console.log('│');
  console.log('└── 🛠️ OUTILS TECHNIQUES');
  console.log('    ├── /newsletter-debug');
  console.log('    ├── /server-diagnostic');
  console.log('    ├── /sync-dashboard');
  console.log('    └── /newsletter/confirm/:token');
  console.log('\n');
}

// Expose functions to window for console access
declare global {
  interface Window {
    testAllURLs: {
      printAllRoutes: () => void;
      showURLStructure: () => void;
      testAllStaticRoutes: () => Promise<void>;
      testRoute: (path: string) => boolean;
      getRouteInfo: (path: string) => RouteTest | null;
      getRoutesByType: (type: RouteTest['type']) => RouteTest[];
      getRoutesByLanguage: (language: RouteTest['language']) => RouteTest[];
      allRoutes: RouteTest[];
    };
  }
}

// Initialize only in browser
if (typeof window !== 'undefined') {
  window.testAllURLs = {
    printAllRoutes,
    showURLStructure,
    testAllStaticRoutes,
    testRoute,
    getRouteInfo,
    getRoutesByType,
    getRoutesByLanguage,
    allRoutes,
  };

  // Show help message after a short delay
  setTimeout(() => {
    console.log('✅ URL testing utilities loaded!');
    console.log('💡 Type window.testAllURLs.printAllRoutes() to see all routes');
    console.log('💡 Type window.testAllURLs.showURLStructure() to see structure');
    console.log('💡 Type window.testAllURLs.testAllStaticRoutes() to test all routes');
  }, 1000);
}
