import { useState, useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, useLocation } from "react-router-dom";
import "./styles/globals.css";
import { lazyRetry } from "./utils/lazyRetry";

// ==========================================
// DEPLOYMENT CHECK MESSAGE
// ==========================================
if (window.location.hostname !== 'localhost') {
  console.log(
    '%cðŸš¨ ERREUR 404 SUR /CLIENTS ?',
    'font-size: 24px; font-weight: bold; color: #ff4444; background: #000; padding: 10px;'
  );
  console.log(
    '%cSolution: supabase functions deploy make-server-04919ac5',
    'font-size: 16px; color: #CCFF00; background: #0C0C0C; padding: 8px; font-family: monospace;'
  );
  console.log(
    '%cðŸ“– Guide complet: Ouvrir /LIRE_MAINTENANT.txt ou /INDEX_GUIDES.md',
    'font-size: 14px; color: #999;'
  );
}

// ==========================================
// PAGES - LAZY LOADED FOR CODE SPLITTING
// ==========================================
// Critical pages (loaded immediately for first render)
import HomeRedesignPage from "./components/pages/HomeRedesignPage";
import { LoadingSpinner } from "./components/LoadingSpinner";

// Non-critical pages (lazy loaded on demand with retry on failure)
const ProjectsPage = lazyRetry(() => import("./components/pages/ProjectsPage"));
const ProjectDetailPage = lazyRetry(() => import("./components/pages/ProjectDetailPage"));
const ServicesPage = lazyRetry(() => import("./components/pages/ServicesRedesignPage"));
const AboutPage = lazyRetry(() => import("./components/pages/AboutPage"));
const ContactPage = lazyRetry(() => import("./components/pages/ContactPage"));
const BookingPage = lazyRetry(() => import("./components/pages/BookingPage"));
const ModernDashboard = lazyRetry(() => import("./components/dashboard/ModernDashboard"));
const LoginPage = lazyRetry(() => import("./components/pages/LoginPage"));
const BlogPage = lazyRetry(() => import("./components/pages/BlogPage").then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazyRetry(() => import("./components/pages/BlogPostPage").then(m => ({ default: m.BlogPostPage })));
const CaseStudiesPage = lazyRetry(() => import("./components/pages/CaseStudiesPage").then(m => ({ default: m.CaseStudiesPage })));
const CaseStudyDetailPage = lazyRetry(() => import("./components/pages/CaseStudyDetailPage").then(m => ({ default: m.CaseStudyDetailPage })));
const FAQPage = lazyRetry(() => import("./components/pages/FAQPage"));
const NewsletterConfirmPage = lazyRetry(() => import("./components/pages/NewsletterConfirmPage").then(m => ({ default: m.NewsletterConfirmPage })));
const ResourcesPage = lazyRetry(() => import("./components/pages/ResourcesPage"));
const TestimonialsPage = lazyRetry(() => import("./components/pages/TestimonialsPage"));
const LegalPage = lazyRetry(() => import("./components/pages/LegalPage"));
const ExampleDatabasePage = lazyRetry(() => import("./components/pages/ExampleDatabasePage"));
const SeedDataPage = lazyRetry(() => import("./components/pages/SeedDataPage"));
const NotFoundPage = lazyRetry(() => import("./components/pages/NotFoundPage"));
const NotFoundPageSimple = lazyRetry(() => import("./components/pages/NotFoundPageSimple"));
const NotFoundPageUltraSimple = lazyRetry(() => import("./components/pages/NotFoundPageUltraSimple"));
const InvoiceViewPage = lazyRetry(() => import("./components/pages/InvoiceViewPage"));
const InvoiceSuccessPage = lazyRetry(() => import("./components/pages/InvoiceSuccessPage"));

// ==========================================
// LAYOUT COMPONENTS
// ==========================================
import { SkipNavigation } from "./components/layout/SkipNavigation";
import { Navbar as RedesignNavbar } from "./redesign/components/Navbar";
import { Footer as RedesignFooter } from "./redesign/components/Footer";
import { CustomCursor } from "./redesign/components/CustomCursor";
import { RedesignNewsletterPopup } from "./redesign/components/NewsletterPopup";
import type { PageView } from "./redesign/types";

// ==========================================
// FEATURE COMPONENTS
// ==========================================
import { BackToTop } from "./components/BackToTop";
import { ScrollProgress } from "./components/ScrollProgress";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/sonner";

// ==========================================
// ROUTING COMPONENTS
// ==========================================
import { LanguageRouteSync } from "./components/routing/LanguageRouteSync";
import { GeoRedirect } from "./components/routing/GeoRedirect";
import { ClientSideFallback } from "./components/routing/ClientSideFallback";
import { ScrollToTop } from "./components/routing/ScrollToTop";

// ==========================================
// PWA COMPONENTS
// ==========================================
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { PWAUpdatePrompt } from "./components/PWAUpdatePrompt";

// ==========================================
// PROVIDERS & CONTEXT
// ==========================================
import { LanguageProvider } from "./utils/i18n/LanguageContext";

// ==========================================
// ANALYTICS
// ==========================================
import { 
  initAnalytics, 
  trackPageView, 
  trackPagePerformance, 
  initScrollTracking, 
  initEngagementTracking 
} from "./utils/analytics";
import { getAnalyticsConfig, validateAnalyticsConfig } from "./utils/analyticsConfig";

// ==========================================
// SUPABASE
// ==========================================
import { createClient } from "./utils/supabase/client";

// ==========================================
// PWA HELPERS
// ==========================================
import { registerServiceWorker } from "./utils/pwaHelpers";

// ==========================================
// SERVER DIAGNOSTICS (DEV ONLY)
// ==========================================
if (typeof import.meta !== "undefined" && (import.meta as any).env?.DEV) {
  import("./utils/testServerRoutes").then((module) => {
    console.log("ðŸ”§ Server diagnostics loaded. Run testServer.quickTest() in console.");
  }).catch((err) => {
    console.warn("Failed to load server diagnostics:", err);
  });
}

// Helper: Get current language from path
function getLanguageFromPath(): string {
  const pathname = window.location.pathname;
  const match = pathname.match(/^\/(en|fr)(\/|$)/);
  return match ? match[1] : 'fr';
}

// Route wrapper components that handle navigation
function RouteWrapper({ 
  component: Component, 
  currentPage,
  ...props 
}: any) {
  const navigate = useNavigate();
  const params = useParams();

  const navigateTo = (page: string) => {
    const lang = getLanguageFromPath();
    const routes: Record<string, string> = {
      'home': `/${lang}`,
      'projects': `/${lang}/projects`,
      'services': `/${lang}/services`,
      'about': `/${lang}/about`,
      'contact': `/${lang}/contact`,
      'booking': `/${lang}/booking`,
      'blog': `/${lang}/blog`,
      'case-studies': `/${lang}/case-studies`,
      'faq': `/${lang}/faq`,
      'resources': `/${lang}/resources`,
      'testimonials': `/${lang}/testimonials`,
      'legal': `/${lang}/legal/${lang === 'en' ? 'privacy' : 'confidentialite'}`,
      'dashboard': '/dashboard',
      'login': '/login',
    };
    navigate(routes[page] || `/${lang}`);
  };

  const onProjectClick = (projectId: string) => {
    const lang = getLanguageFromPath();
    navigate(`/${lang}/projects/${projectId}`);
  };

  const onBlogPostClick = (slug: string) => {
    const lang = getLanguageFromPath();
    navigate(`/${lang}/blog/${slug}`);
  };

  const handleNavigate = (page: string, id?: string) => {
    const lang = getLanguageFromPath();
    if (page === 'case-study' && id) {
      navigate(`/${lang}/case-studies/${id}`);
    } else if (page === 'blog-post' && id) {
      navigate(`/${lang}/blog/${id}`);
    } else if (page === 'project-detail' && id) {
      navigate(`/${lang}/projects/${id}`);
    } else {
      navigateTo(page);
    }
  };

  return (
    <Component
      onNavigate={navigateTo}
      onProjectClick={onProjectClick}
      onBlogPostClick={onBlogPostClick}
      handleNavigate={handleNavigate}
      currentPage={currentPage}
      {...params}
      {...props}
    />
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();
  const navigate = useNavigate();

  // Initialize analytics on app startup
  useEffect(() => {
    const config = getAnalyticsConfig();
    initAnalytics(config);
    validateAnalyticsConfig();
    trackPagePerformance();
    initScrollTracking();
    initEngagementTracking();
    
    registerServiceWorker().then((registration) => {
      if (registration) {
        console.log("âœ… PWA activÃ©e: Service Worker enregistrÃ©");
      }
    });
    
    const initAdminTimer = setTimeout(async () => {
      const { initAdminAccount } = await import("./utils/initAdmin");
      await initAdminAccount();
    }, 2000);
    
    const serverCheckTimer = setTimeout(async () => {
      const { forceCheckServer } = await import("./utils/serverService");
      const available = await forceCheckServer();
      if (available && window.location.hostname === "localhost") {
        console.log("âœ… Serveur Supabase dÃ©tectÃ© ! Rechargez pour activer.");
      }
    }, 30000);

    return () => {
      clearTimeout(initAdminTimer);
      clearTimeout(serverCheckTimer);
    };
  }, []);

  // Check for newsletter confirmation token in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromQuery = urlParams.get('newsletter_confirm');
    const unsubscribeEmail = urlParams.get('newsletter_unsubscribe');
    
    if (tokenFromQuery) {
      navigate(`/newsletter/confirm/${tokenFromQuery}`);
      return;
    }

    if (unsubscribeEmail) {
      handleNewsletterUnsubscribe(unsubscribeEmail);
      window.history.replaceState({}, '', '/');
      return;
    }
  }, []);

  // Check authentication with Supabase Session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        if (event === 'SIGNED_OUT') {
          navigate('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Track page views on route change
  useEffect(() => {
    const pathname = window.location.pathname;
    const pageTitle = pathname.split('/').filter(Boolean).pop() || 'home';
    trackPageView(pathname, pageTitle);
  }, [window.location.pathname]);

  // Handle newsletter unsubscribe
  const handleNewsletterUnsubscribe = async (email: string) => {
    try {
      const projectId = (window as any).SUPABASE_PROJECT_ID || "ptcxeqtjlxittxayffgu";
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/newsletter/unsubscribe/${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${(window as any).SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y3hlcXRqbHhpdHR4YXlmZmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDY1MjYsImV4cCI6MjA3Nzg4MjUyNn0.4xmzyoXUxas6587ZFWWc95p10bNSa2MdaipYI7RHmZc"}`,
          },
        }
      );

      if (response.ok) {
        alert("âœ… Vous avez Ã©tÃ© dÃ©sabonnÃ© de la newsletter avec succÃ¨s.");
      } else {
        alert("âŒ Une erreur s'est produite lors du dÃ©sabonnement.");
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
      alert("âŒ Impossible de se dÃ©sabonner. Veuillez rÃ©essayer.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SkipNavigation />
      <ScrollToTop />
      <LanguageRouteSync />
      <ClientSideFallback />
      
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0C0C0C]">
          <LoadingSpinner />
        </div>
      }>
        <Routes>
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <main id="main-content" className="flex-1" tabIndex={-1}>
                  <ModernDashboard onLogout={handleLogout} onNavigate={(page) => navigate(page)} />
                </main>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        
        <Route 
          path="/login" 
          element={
            <main id="main-content" className="flex-1" tabIndex={-1}>
              <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={(page) => navigate(page)} />
            </main>
          } 
        />
        
        <Route 
          path="/newsletter/confirm/:token" 
          element={
            <main id="main-content" className="flex-1" tabIndex={-1}>
              <RouteWrapper component={NewsletterConfirmPage} currentPage="newsletter-confirm" />
            </main>
          } 
        />
        
        {/* Invoice routes - IMPORTANT: More specific routes BEFORE less specific */}
        <Route 
          path="/invoice/:token/success" 
          element={
            <main id="main-content" className="flex-1" tabIndex={-1}>
              <InvoiceSuccessPage />
            </main>
          } 
        />
        <Route 
          path="/invoice/:token" 
          element={
            <main id="main-content" className="flex-1" tabIndex={-1}>
              <InvoiceViewPage />
            </main>
          } 
        />
        
        {/* Redirect root based on geo-location */}
        <Route path="/" element={<GeoRedirect />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        
        {/* Public routes - French */}
        <Route path="/fr" element={<PublicLayout currentPage="home"><RouteWrapper component={HomeRedesignPage} currentPage="home" /></PublicLayout>} />
        <Route path="/fr/projects" element={<PublicLayout currentPage="projects"><RouteWrapper component={ProjectsPage} currentPage="projects" /></PublicLayout>} />
        <Route path="/fr/projects/:projectId" element={<PublicLayout currentPage="projects"><RouteWrapper component={ProjectDetailPage} currentPage="project-detail" /></PublicLayout>} />
        <Route path="/fr/services" element={<PublicLayout currentPage="services"><RouteWrapper component={ServicesPage} currentPage="services" /></PublicLayout>} />
        <Route path="/fr/about" element={<PublicLayout currentPage="about"><RouteWrapper component={AboutPage} currentPage="about" /></PublicLayout>} />
        <Route path="/fr/contact" element={<PublicLayout currentPage="contact"><RouteWrapper component={ContactPage} currentPage="contact" /></PublicLayout>} />
        <Route path="/fr/booking" element={<PublicLayout currentPage="booking"><RouteWrapper component={BookingPage} currentPage="booking" /></PublicLayout>} />
        <Route path="/fr/blog" element={<PublicLayout currentPage="blog"><RouteWrapper component={BlogPage} currentPage="blog" /></PublicLayout>} />
        <Route path="/fr/blog/:slug" element={<PublicLayout currentPage="blog"><RouteWrapper component={BlogPostPage} currentPage="blog-post" /></PublicLayout>} />
        <Route path="/fr/case-studies" element={<PublicLayout currentPage="case-studies"><RouteWrapper component={CaseStudiesPage} currentPage="case-studies" /></PublicLayout>} />
        <Route path="/fr/case-studies/:caseStudyId" element={<PublicLayout currentPage="case-studies"><RouteWrapper component={CaseStudyDetailPage} currentPage="case-study" /></PublicLayout>} />
        <Route path="/fr/faq" element={<PublicLayout currentPage="faq"><RouteWrapper component={FAQPage} currentPage="faq" /></PublicLayout>} />
        <Route path="/fr/resources" element={<PublicLayout currentPage="resources"><RouteWrapper component={ResourcesPage} currentPage="resources" /></PublicLayout>} />
        <Route path="/fr/testimonials" element={<PublicLayout currentPage="testimonials"><RouteWrapper component={TestimonialsPage} currentPage="testimonials" /></PublicLayout>} />
        <Route path="/fr/legal/:section" element={<PublicLayout currentPage="legal"><RouteWrapper component={LegalPage} currentPage="legal" /></PublicLayout>} />
        <Route path="/fr/example" element={<PublicLayout currentPage="example"><RouteWrapper component={ExampleDatabasePage} currentPage="example" /></PublicLayout>} />
        <Route path="/fr/seed-data" element={<PublicLayout currentPage="seed-data"><RouteWrapper component={SeedDataPage} currentPage="seed-data" /></PublicLayout>} />
        
        {/* Public routes - English */}
        <Route path="/en" element={<PublicLayout currentPage="home"><RouteWrapper component={HomeRedesignPage} currentPage="home" /></PublicLayout>} />
        <Route path="/en/projects" element={<PublicLayout currentPage="projects"><RouteWrapper component={ProjectsPage} currentPage="projects" /></PublicLayout>} />
        <Route path="/en/projects/:projectId" element={<PublicLayout currentPage="projects"><RouteWrapper component={ProjectDetailPage} currentPage="project-detail" /></PublicLayout>} />
        <Route path="/en/services" element={<PublicLayout currentPage="services"><RouteWrapper component={ServicesPage} currentPage="services" /></PublicLayout>} />
        <Route path="/en/about" element={<PublicLayout currentPage="about"><RouteWrapper component={AboutPage} currentPage="about" /></PublicLayout>} />
        <Route path="/en/contact" element={<PublicLayout currentPage="contact"><RouteWrapper component={ContactPage} currentPage="contact" /></PublicLayout>} />
        <Route path="/en/booking" element={<PublicLayout currentPage="booking"><RouteWrapper component={BookingPage} currentPage="booking" /></PublicLayout>} />
        <Route path="/en/blog" element={<PublicLayout currentPage="blog"><RouteWrapper component={BlogPage} currentPage="blog" /></PublicLayout>} />
        <Route path="/en/blog/:slug" element={<PublicLayout currentPage="blog"><RouteWrapper component={BlogPostPage} currentPage="blog-post" /></PublicLayout>} />
        <Route path="/en/case-studies" element={<PublicLayout currentPage="case-studies"><RouteWrapper component={CaseStudiesPage} currentPage="case-studies" /></PublicLayout>} />
        <Route path="/en/case-studies/:caseStudyId" element={<PublicLayout currentPage="case-studies"><RouteWrapper component={CaseStudyDetailPage} currentPage="case-study" /></PublicLayout>} />
        <Route path="/en/faq" element={<PublicLayout currentPage="faq"><RouteWrapper component={FAQPage} currentPage="faq" /></PublicLayout>} />
        <Route path="/en/resources" element={<PublicLayout currentPage="resources"><RouteWrapper component={ResourcesPage} currentPage="resources" /></PublicLayout>} />
        <Route path="/en/testimonials" element={<PublicLayout currentPage="testimonials"><RouteWrapper component={TestimonialsPage} currentPage="testimonials" /></PublicLayout>} />
        <Route path="/en/legal/:section" element={<PublicLayout currentPage="legal"><RouteWrapper component={LegalPage} currentPage="legal" /></PublicLayout>} />
        <Route path="/en/example" element={<PublicLayout currentPage="example"><RouteWrapper component={ExampleDatabasePage} currentPage="example" /></PublicLayout>} />
        <Route path="/en/seed-data" element={<PublicLayout currentPage="seed-data"><RouteWrapper component={SeedDataPage} currentPage="seed-data" /></PublicLayout>} />
        
        {/* Catch-all routes for 404 */}
        <Route path="/fr/*" element={<NotFoundPageUltraSimple />} />
        <Route path="/en/*" element={<NotFoundPageUltraSimple />} />
        <Route path="*" element={<NotFoundPageUltraSimple />} />
      </Routes>
      </Suspense>
      
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
    </div>
  );
}

// Public page layout with redesigned shell
function PublicLayout({ children }: { children: React.ReactNode; currentPage: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const lang = (getLanguageFromPath() === 'en' ? 'en' : 'fr');

  const getCurrentView = (): PageView => {
    const path = location.pathname;
    if (path.includes('/services')) return 'services';
    if (path.includes('/projects')) return 'portfolio';
    if (path.includes('/case-studies')) return 'casestudies';
    if (path.includes('/blog')) return 'blog';
    if (path.includes('/contact') || path.includes('/booking')) return 'contact';
    if (path.includes('/legal')) return 'legal';
    return 'home';
  };

  const getPathForView = (view: PageView): string => {
    switch (view) {
      case 'services':
        return `/${lang}/services`;
      case 'portfolio':
        return `/${lang}/projects`;
      case 'casestudies':
        return `/${lang}/case-studies`;
      case 'blog':
        return `/${lang}/blog`;
      case 'contact':
        return `/${lang}/contact`;
      case 'legal':
        return `/${lang}/legal/${lang === 'en' ? 'privacy' : 'confidentialite'}`;
      case 'admin':
        return '/dashboard';
      case 'home':
      default:
        return `/${lang}`;
    }
  };

  const handleNavigate = (view: PageView) => {
    navigate(getPathForView(view));
  };

  const currentView = getCurrentView();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="bg-noise" aria-hidden="true" />
      <CustomCursor />
      <ScrollProgress />
      <RedesignNavbar currentPage={currentView} onNavigate={handleNavigate} />
      <main id="main-content" className="flex-1 pt-24" tabIndex={-1}>
        {children}
      </main>
      <RedesignFooter onNavigate={handleNavigate} language={lang} />
      <RedesignNewsletterPopup />
      <BackToTop />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <LanguageProvider>
          <Toaster position="top-right" richColors />
          <AppContent />
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}