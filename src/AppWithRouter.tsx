import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, useLocation } from "react-router-dom";
import "./styles/globals.css";
import { Home, Briefcase, User, Mail, Calendar, LayoutDashboard } from "lucide-react";
import ProjectsPage from "./components/pages/ProjectsPage";
import ProjectDetailPage from "./components/pages/ProjectDetailPage";
import ServicesPage from "./components/pages/ServicesRedesignPage";
import AboutPage from "./components/pages/AboutPage";
import ContactPage from "./components/pages/ContactPage";
import BookingPage from "./components/pages/BookingPage";
import ModernDashboard from "./components/dashboard/ModernDashboard";
import LoginPage from "./components/pages/LoginPage";
import { BlogPage } from "./components/pages/BlogPage";
import { BlogPostPage } from "./components/pages/BlogPostPage";
import { CaseStudiesPage } from "./components/pages/CaseStudiesPage";
import { CaseStudyDetailPage } from "./components/pages/CaseStudyDetailPage";
import FAQPage from "./components/pages/FAQPage";
import { NewsletterConfirmPage } from "./components/pages/NewsletterConfirmPage";
import NewsletterDebugPage from "./components/pages/NewsletterDebugPage";
import ResourcesPage from "./components/pages/ResourcesPage";
import TestimonialsPage from "./components/pages/TestimonialsPage";
import SyncDashboardPage from "./components/pages/SyncDashboardPage";
import InvoiceViewPage from "./components/pages/InvoiceViewPage";
import InvoiceSuccessPage from "./components/pages/InvoiceSuccessPage";
import LegalPage from "./components/pages/LegalPage";
import HomeRedesignPage from "./components/pages/HomeRedesignPage";
import { SkipNavigation } from "./components/layout/SkipNavigation";
import { Navbar as RedesignNavbar } from "./redesign/components/Navbar";
import { Footer as RedesignFooter } from "./redesign/components/Footer";
import { CustomCursor } from "./redesign/components/CustomCursor";
import { RedesignNewsletterPopup } from "./redesign/components/NewsletterPopup";
import type { PageView } from "./redesign/types";
import { BackToTop } from "./components/BackToTop";
import { ScrollProgress } from "./components/ScrollProgress";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LanguageProvider } from "./utils/i18n/LanguageContext";
// ❌ Désactivé avec Hash Routing (incompatible)
// import { LanguageRouteSync } from "./components/routing/LanguageRouteSync";
// import { LegacyRouteRedirect } from "./components/routing/LegacyRouteRedirect";
import { initAnalytics, trackPageView, trackPagePerformance, initScrollTracking, initEngagementTracking } from "./utils/analytics";
import { getAnalyticsConfig, validateAnalyticsConfig } from "./utils/analyticsConfig";
import { ServerStatusAlert } from "./components/ServerStatusAlert";
import { ServerStatusBanner } from "./components/ServerStatusBanner";
import { FirstTimeSetupModal } from "./components/FirstTimeSetupModal";
import { BackendSetupWizard } from "./components/BackendSetupWizard";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { PWAUpdatePrompt } from "./components/PWAUpdatePrompt";
import { NetworkStatus } from "./components/NetworkStatus";
import { PWADebugPanel } from "./components/PWADebugPanel";
import { AutoServerDiagnostic } from "./components/AutoServerDiagnostic";
import { CORSFixAlert } from "./components/CORSFixAlert";
import { DeploymentNeededBanner } from "./components/DeploymentNeededBanner";
import { HashRedirectHandler } from "./components/routing/HashRedirectHandler";
import { registerServiceWorker } from "./utils/pwaHelpers";
import { PageLoaderOverlay } from "./redesign/components/PageLoaderOverlay";
// ⚠️ IMPORTS COMMENTÉS TEMPORAIREMENT - Trop de scripts ralentissent le chargement
// import "./utils/testDatabase";
// import "./utils/fixedErrorsMessage";
// ... (tous les autres imports de messages commentés)
import { initAdminAccount } from "./utils/initAdmin"; // Initialize admin account
import { createClient } from "./utils/supabase/client"; // Supabase client

// Route wrapper components that handle navigation
function RouteWrapper({ 
  component: Component, 
  currentPage,
  ...props 
}: any) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  // Get current language from URL (Hash Router)
  const getLanguageFromPath = (): string => {
    const match = window.location.pathname.match(/^\/(en|fr)(\/|$)/);
    return match ? match[1] : 'fr';
  };

  // Determine current page from path
  const getCurrentPageFromPath = (): string => {
    const path = location.pathname;
    if (path.includes('/projects')) return 'projects';
    if (path.includes('/services')) return 'services';
    if (path.includes('/about')) return 'about';
    if (path.includes('/contact')) return 'contact';
    if (path.includes('/booking')) return 'booking';
    if (path.includes('/blog')) return 'blog';
    if (path.includes('/case-studies')) return 'case-studies';
    if (path.includes('/faq')) return 'faq';
    if (path.includes('/resources')) return 'resources';
    if (path.includes('/testimonials')) return 'testimonials';
    if (path.includes('/dashboard')) return 'dashboard';
    return 'home';
  };

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
      currentPage={currentPage || getCurrentPageFromPath()}
      {...params}
      {...props}
    />
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();
  const navigate = useNavigate();

  // Initialize admin account and analytics on app startup
  useEffect(() => {
    initAdminAccount();
    
    // Initialize analytics with config
    const config = getAnalyticsConfig();
    initAnalytics(config);
    
    // Validate configuration (shows warnings in console if not properly configured)
    validateAnalyticsConfig();
    
    // Initialize automatic tracking features
    trackPagePerformance(); // Track page load performance
    initScrollTracking(); // Track scroll depth automatically
    initEngagementTracking(); // Track time spent on page
    
    // Register PWA Service Worker
    registerServiceWorker().then((registration) => {
      if (registration) {
        console.log("✅ PWA activée: Service Worker enregistré");
      }
    });
    
    // Add debug helpers
    (window as any).newsletterDebug = () => {
      navigate('/newsletter-debug');
      console.log("🔧 Opening Newsletter Debug page...");
    };
    console.log("💡 Newsletter debug helper loaded! Run: newsletterDebug()");
    
    // Server diagnostic - DEV only
    if (import.meta.env.DEV) {
      (window as any).serverDiagnostic = () => {
        navigate('/server-diagnostic');
        console.log("🔧 Opening Server Diagnostic page...");
      };
      console.log("💡 Server diagnostic helper loaded! Run: serverDiagnostic()");
    }
    
    (window as any).syncDashboard = () => {
      navigate('/sync-dashboard');
      console.log("🔧 Opening Sync Dashboard page...");
    };
    console.log("💡 Sync dashboard helper loaded! Run: syncDashboard()");
    
    // Add blog info helper (only in dev)
    if (window.location.hostname === "localhost") {
      (window as any).blogInfo = () => {
        console.log("\n📝 BLOG SUPABASE - INFORMATIONS");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📚 Documentation:");
        console.log("  → Guide Express: /LIRE_MOI_BLOG.md");
        console.log("  → Activer Supabase: /ACTIVER_BLOG_SUPABASE.md");
        console.log("  → Doc Complète: /BLOG_SUPABASE_READY.md");
        console.log("  → Index Guides: /GUIDES_BLOG_SUPABASE.md");
        console.log("  → Commandes: /COMMANDES_RAPIDES_BLOG.md");
        console.log("\n🎯 État actuel:");
        import("./utils/blogService").then(({ getCurrentMode }) => {
          const mode = getCurrentMode();
          console.log(`  Mode: ${mode === "server" ? "� SERVEUR" : mode === "unavailable" ? "� INDISPONIBLE" : "⏳ Vérification..."}`);
          if (mode === "unavailable") {
            console.log("\n⚠️  Le serveur Supabase est indisponible");
            console.log("💡 Vérifiez votre connexion et les clés API");
          }
        });
      };
      console.log("💡 Blog info helper loaded! Run: blogInfo()");
    }

    // Optional: Check server after 30 seconds (silent background check)
    const serverCheckTimer = setTimeout(async () => {
      const { forceCheckServer } = await import("./utils/serverService");
      const available = await forceCheckServer();
      if (available && window.location.hostname === "localhost") {
        console.log("✅ Serveur Supabase détecté ! Rechargez pour activer.");
      }
    }, 30000);

    return () => clearTimeout(serverCheckTimer);
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

  // ✅ Check authentication with Supabase Session
  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      console.log("🔐 Initial session check:", session ? "Authenticated" : "Not authenticated");
    };
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔐 Auth state changed:", event, session ? "Authenticated" : "Not authenticated");
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
        alert("✅ Vous avez été désabonné de la newsletter avec succès.");
      } else {
        alert("❌ Une erreur s'est produite lors du désabonnement.");
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
      alert("❌ Impossible de se désabonner. Veuillez réessayer.");
    }
  };

  // ✅ Handle logout with Supabase Session
  const handleLogout = async () => {
    await supabase.auth.signOut();
    console.log("🔐 User signed out");
    setIsAuthenticated(false);
    navigate('/');
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PageLoaderOverlay />
      {/* Hash URL Redirect Handler - Converts /#/path to /path */}
      <HashRedirectHandler />
      
      {/* Deployment Needed Banner - Top of page */}
      <DeploymentNeededBanner />
      
      {/* CORS Fix Alert - Bottom right corner */}
      <CORSFixAlert />
      
      {/* Server Status Banner */}
      <ServerStatusBanner />
      
      {/* Skip to main content - Accessibility */}
      <SkipNavigation />
      

      
      <Routes>
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <>
                {/* Spacer for deployment banner */}
                <div className="h-[72px]" aria-hidden="true" />
                <main id="main-content" className="flex-1" tabIndex={-1}>
                  <ModernDashboard onLogout={handleLogout} onNavigate={(page) => navigate(`/${page}`)} />
                </main>
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Login page */}
        <Route 
          path="/login" 
          element={
            <>
              {/* Spacer for deployment banner */}
              <div className="h-[72px]" aria-hidden="true" />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={(page) => navigate(`/${page}`)} />
              </main>
            </>
          } 
        />
        
        {/* Special pages without navigation */}
        {import.meta.env.DEV && <Route path="/newsletter-debug" element={<><div className="h-[72px]" aria-hidden="true" /><main id="main-content" className="flex-1" tabIndex={-1}><NewsletterDebugPage /></main></>} />}
        {import.meta.env.DEV && <Route path="/server-diagnostic" element={<><div className="h-[72px]" aria-hidden="true" /><main id="main-content" className="flex-1" tabIndex={-1}><AutoServerDiagnostic /></main></>} />}
        <Route path="/sync-dashboard" element={<><div className="h-[72px]" aria-hidden="true" /><main id="main-content" className="flex-1" tabIndex={-1}><SyncDashboardPage /></main></>} />
        
        {/* Invoice routes - Public (no auth required, secured by token) */}
        {/* IMPORTANT: More specific routes must come BEFORE less specific ones */}
        {/* TEST: Hardcoded success route to debug */}
        <Route 
          path="/invoice/test/success" 
          element={
            <>
              <div className="h-[72px]" aria-hidden="true" />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                <InvoiceSuccessPage />
              </main>
            </>
          } 
        />
        <Route 
          path="/invoice/:token/success" 
          element={
            <>
              <div className="h-[72px]" aria-hidden="true" />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                <InvoiceSuccessPage />
              </main>
            </>
          } 
        />
        <Route 
          path="/invoice/:token" 
          element={
            <>
              <div className="h-[72px]" aria-hidden="true" />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                <InvoiceViewPage />
              </main>
            </>
          } 
        />
        
        <Route 
          path="/newsletter/confirm/:token" 
          element={
            <>
              {/* Spacer for deployment banner */}
              <div className="h-[72px]" aria-hidden="true" />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                <RouteWrapper component={NewsletterConfirmPage} currentPage="newsletter-confirm" />
              </main>
            </>
          } 
        />
        
        {/* Redirect root to French home */}
        <Route path="/" element={<Navigate to="/fr" replace />} />
        
        {/* Public routes with navigation and footer - French */}
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
        
        {/* Public routes with navigation and footer - English */}
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
      </Routes>
      
      {/* PWA Components */}
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
      <NetworkStatus />
      {import.meta.env.DEV && <PWADebugPanel />}
      
      {/* Server Status Alert - Always show to inform about deployment status */}
      <ServerStatusAlert />
      
      {/* First Time Setup Modal - Guide users through deployment */}
      <FirstTimeSetupModal />
      
      {/* Backend Setup Wizard - Guide users to connect blog to backend */}
      <BackendSetupWizard />
    </div>
  );
}

// Public page layout with redesigned shell
function PublicLayout({ children }: { children: React.ReactNode; currentPage: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const match = location.pathname.match(/^\/(en|fr)(\/|$)/);
  const lang = (match ? (match[1] as 'fr' | 'en') : 'fr');

  const getCurrentView = (): PageView => {
    const path = location.pathname;
    if (path.includes('/services')) return 'services';
    if (path.includes('/projects')) return 'portfolio';
    if (path.includes('/case-studies')) return 'casestudies';
    if (path.includes('/testimonials')) return 'reviews';
    if (path.includes('/contact') || path.includes('/booking')) return 'contact';
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
      case 'reviews':
        return `/${lang}/testimonials`;
      case 'contact':
        return `/${lang}/contact`;
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
          <AppContent />
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
