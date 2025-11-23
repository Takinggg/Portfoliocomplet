/**
 * URL Test Initializer Component
 * Initializes window.testAllURLs utilities
 * MUST be mounted in the app to work
 */

import { useEffect } from 'react';
import { allRoutes } from '../utils/testAllURLs';

export const URLTestInitializer = () => {
  useEffect(() => {
    // Function to print all routes
    const printAllRoutes = () => {
      console.log('â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—');
      console.log('â•‘           ðŸ“‹ TOUTES LES URLS DU SITE (36+)                    â•‘');
      console.log('â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£');
      console.log('');

      const frenchRoutes = allRoutes.filter(r => r.language === 'fr');
      const englishRoutes = allRoutes.filter(r => r.language === 'en');
      const neutralRoutes = allRoutes.filter(r => r.language === 'neutral');

      console.log(`ðŸ‡«ðŸ‡· ROUTES FRANÃ‡AISES (${frenchRoutes.length}):`);
      console.log('â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€');
      frenchRoutes.forEach(route => {
        const icon = route.type === 'dynamic' ? 'ðŸ“' : 
                     route.type === 'protected' ? 'ðŸ”' : 
                     route.type === 'technical' ? 'ðŸ› ï¸' : 'ðŸ“„';
        console.log(`  ${icon} ${route.path} â†’ ${route.description}`);
        if (route.exampleDynamic) {
          console.log(`     Exemple: ${route.exampleDynamic}`);
        }
      });

      console.log('');
      console.log(`ðŸ‡¬ðŸ‡§ ROUTES ANGLAISES (${englishRoutes.length}):`);
      console.log('â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€');
      englishRoutes.forEach(route => {
        const icon = route.type === 'dynamic' ? 'ðŸ“' : 
                     route.type === 'protected' ? 'ðŸ”' : 
                     route.type === 'technical' ? 'ðŸ› ï¸' : 'ðŸ“„';
        console.log(`  ${icon} ${route.path} â†’ ${route.description}`);
        if (route.exampleDynamic) {
          console.log(`     Example: ${route.exampleDynamic}`);
        }
      });

      if (neutralRoutes.length > 0) {
        console.log('');
        console.log(`ðŸŒ ROUTES NEUTRES (${neutralRoutes.length}):`);
        console.log('â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€');
        neutralRoutes.forEach(route => {
          const icon = route.type === 'dynamic' ? 'ðŸ“' : 
                       route.type === 'protected' ? 'ðŸ”' : 
                       route.type === 'technical' ? 'ðŸ› ï¸' : 'ðŸ“„';
          console.log(`  ${icon} ${route.path} â†’ ${route.description}`);
        });
      }

      console.log('');
      console.log('â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£');
      console.log(`â•‘  TOTAL: ${allRoutes.length} routes configurÃ©es                                â•‘`);
      console.log('â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    };

    // Function to show URL structure
    const showURLStructure = () => {
      console.log('â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—');
      console.log('â•‘           ðŸŒ³ STRUCTURE ARBORESCENTE DES URLS                   â•‘');
      console.log('â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£');
      console.log('');
      console.log('ðŸ“± SITE PORTFOLIO BILINGUE');
      console.log('â”‚');
      console.log('â”œâ”€â”€ ðŸ‡«ðŸ‡· FRANÃ‡AIS (Racine /)');
      console.log('â”‚   â”œâ”€â”€ / (Accueil)');
      console.log('â”‚   â”œâ”€â”€ /projects (Portfolio)');
      console.log('â”‚   â”‚   â””â”€â”€ /projects/:id (DÃ©tail projet)');
      console.log('â”‚   â”œâ”€â”€ /services');
      console.log('â”‚   â”œâ”€â”€ /about');
      console.log('â”‚   â”œâ”€â”€ /contact');
      console.log('â”‚   â”œâ”€â”€ /booking');
      console.log('â”‚   â”œâ”€â”€ /blog');
      console.log('â”‚   â”‚   â””â”€â”€ /blog/:slug');
      console.log('â”‚   â”œâ”€â”€ /case-studies');
      console.log('â”‚   â”‚   â””â”€â”€ /case-studies/:id');
      console.log('â”‚   â”œâ”€â”€ /faq');
      console.log('â”‚   â”œâ”€â”€ /resources');
      console.log('â”‚   â””â”€â”€ /testimonials');
      console.log('â”‚');
      console.log('â”œâ”€â”€ ðŸ‡¬ðŸ‡§ ENGLISH (/en/)');
      console.log('â”‚   â”œâ”€â”€ /en/ (Homepage)');
      console.log('â”‚   â”œâ”€â”€ /en/projects (Portfolio)');
      console.log('â”‚   â”‚   â””â”€â”€ /en/projects/:id (Project detail)');
      console.log('â”‚   â”œâ”€â”€ /en/services');
      console.log('â”‚   â”œâ”€â”€ /en/about');
      console.log('â”‚   â”œâ”€â”€ /en/contact');
      console.log('â”‚   â”œâ”€â”€ /en/booking');
      console.log('â”‚   â”œâ”€â”€ /en/blog');
      console.log('â”‚   â”‚   â””â”€â”€ /en/blog/:slug');
      console.log('â”‚   â”œâ”€â”€ /en/case-studies');
      console.log('â”‚   â”‚   â””â”€â”€ /en/case-studies/:id');
      console.log('â”‚   â”œâ”€â”€ /en/faq');
      console.log('â”‚   â”œâ”€â”€ /en/resources');
      console.log('â”‚   â””â”€â”€ /en/testimonials');
      console.log('â”‚');
      console.log('â”œâ”€â”€ ðŸ” AUTHENTIFICATION');
      console.log('â”‚   â”œâ”€â”€ /login');
      console.log('â”‚   â””â”€â”€ /dashboard (CRM)');
      console.log('â”‚');
      console.log('â””â”€â”€ ðŸ› ï¸ TECHNIQUE');
      console.log('    â”œâ”€â”€ /newsletter-debug');
      console.log('    â”œâ”€â”€ /server-diagnostic');
      console.log('    â”œâ”€â”€ /sync-dashboard');
      console.log('    â””â”€â”€ /newsletter/confirm/:token');
      console.log('');
      console.log('â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
    };

    // Initialize window.testAllURLs
    (window as any).testAllURLs = {
      printAllRoutes,
      showURLStructure,
      allRoutes,
    };

    // Display success message with styled console
    console.log('%câ•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—', 'color: #CCFF00; font-weight: bold;');
    console.log('%câ•‘      âœ… UTILITAIRES URLS CHARGÃ‰S AVEC SUCCÃˆS                  â•‘', 'color: #CCFF00; font-weight: bold;');
    console.log('%câ•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•', 'color: #CCFF00; font-weight: bold;');
    console.log('');
    console.log('%cðŸŽ® Commandes disponibles:', 'color: #F4F4F4; font-weight: bold; font-size: 14px;');
    console.log('');
    console.log('%cwindow.testAllURLs.printAllRoutes()', 'color: #CCFF00; font-size: 13px; font-family: monospace; background: #0C0C0C; padding: 4px 8px;');
    console.log('   âžœ Affiche toutes les URLs (FR + EN)');
    console.log('');
    console.log('%cwindow.testAllURLs.showURLStructure()', 'color: #CCFF00; font-size: 13px; font-family: monospace; background: #0C0C0C; padding: 4px 8px;');
    console.log('   âžœ Vue arborescente des URLs');
    console.log('');
    console.log('%cwindow.testAllURLs.allRoutes', 'color: #CCFF00; font-size: 13px; font-family: monospace; background: #0C0C0C; padding: 4px 8px;');
    console.log('   âžœ Tableau de toutes les routes');
    console.log('');
    console.log('â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');

    // Cleanup on unmount
    return () => {
      // Don't remove on unmount to keep utilities available
    };
  }, []);

  // This component doesn't render anything
  return null;
};
