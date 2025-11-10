/**
 * NotFoundPage - Page 404 personnalisée
 * 
 * Affichée quand l'utilisateur essaie d'accéder à une route qui n'existe pas.
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Détecter la langue depuis l'URL
  const getLanguage = (): 'fr' | 'en' => {
    const pathname = location.pathname;
    if (pathname.startsWith('/en')) return 'en';
    return 'fr';
  };

  const lang = getLanguage();

  // Textes bilingues
  const t = {
    fr: {
      title: '404',
      subtitle: 'Page non trouvée',
      message: 'Désolé, la page que vous recherchez n\'existe pas ou a été déplacée.',
      suggestions: 'Suggestions :',
      goHome: 'Retour à l\'accueil',
      goBack: 'Retour en arrière',
      viewProjects: 'Voir les projets',
      contact: 'Nous contacter',
      hint: 'Astuce : Vérifiez l\'URL ou utilisez le menu de navigation ci-dessus.'
    },
    en: {
      title: '404',
      subtitle: 'Page Not Found',
      message: 'Sorry, the page you are looking for does not exist or has been moved.',
      suggestions: 'Suggestions:',
      goHome: 'Back to Home',
      goBack: 'Go Back',
      viewProjects: 'View Projects',
      contact: 'Contact Us',
      hint: 'Hint: Check the URL or use the navigation menu above.'
    }
  };

  const text = t[lang];

  // Redirection automatique après 10 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('⏰ Auto-redirect to home after 10s');
      navigate(`/${lang}`);
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate, lang]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#0C0C0C] via-[#1a1a1a] to-[#0C0C0C]">
      <div className="max-w-2xl w-full text-center">
        {/* Code 404 animé */}
        <div className="mb-8 relative">
          <h1 
            className="text-[150px] md:text-[200px] leading-none tracking-tighter opacity-10 select-none"
            style={{ 
              fontWeight: 900,
              background: 'linear-gradient(135deg, #00FFC2 0%, #00CC99 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {text.title}
          </h1>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl md:text-8xl" style={{ fontWeight: 800, color: '#00FFC2' }}>
              {text.title}
            </div>
          </div>
        </div>

        {/* Texte principal */}
        <div className="space-y-6 mb-12">
          <h2 className="text-3xl md:text-4xl" style={{ fontWeight: 700, color: '#F4F4F4' }}>
            {text.subtitle}
          </h2>
          
          <p className="text-lg md:text-xl" style={{ color: 'rgba(244, 244, 244, 0.7)' }}>
            {text.message}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            onClick={() => navigate(`/${lang}`)}
            size="lg"
            className="w-full sm:w-auto"
            style={{
              background: '#00FFC2',
              color: '#0C0C0C',
            }}
          >
            <Home className="mr-2 h-5 w-5" />
            {text.goHome}
          </Button>

          <Button
            onClick={() => navigate(-1)}
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
            style={{
              borderColor: '#00FFC2',
              color: '#00FFC2',
            }}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {text.goBack}
          </Button>

          <Button
            onClick={() => navigate(`/${lang}/projects`)}
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
            style={{
              borderColor: 'rgba(244, 244, 244, 0.2)',
              color: '#F4F4F4',
            }}
          >
            <Search className="mr-2 h-5 w-5" />
            {text.viewProjects}
          </Button>
        </div>

        {/* Suggestions */}
        <div className="space-y-4">
          <p style={{ color: 'rgba(244, 244, 244, 0.5)' }}>
            {text.suggestions}
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate(`/${lang}/services`)}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{
                background: 'rgba(0, 255, 194, 0.1)',
                color: '#00FFC2',
                border: '1px solid rgba(0, 255, 194, 0.2)',
              }}
            >
              Services
            </button>
            
            <button
              onClick={() => navigate(`/${lang}/about`)}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{
                background: 'rgba(0, 255, 194, 0.1)',
                color: '#00FFC2',
                border: '1px solid rgba(0, 255, 194, 0.2)',
              }}
            >
              About
            </button>
            
            <button
              onClick={() => navigate(`/${lang}/contact`)}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{
                background: 'rgba(0, 255, 194, 0.1)',
                color: '#00FFC2',
                border: '1px solid rgba(0, 255, 194, 0.2)',
              }}
            >
              Contact
            </button>
            
            <button
              onClick={() => navigate(`/${lang}/blog`)}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{
                background: 'rgba(0, 255, 194, 0.1)',
                color: '#00FFC2',
                border: '1px solid rgba(0, 255, 194, 0.2)',
              }}
            >
              Blog
            </button>
          </div>
        </div>

        {/* Hint */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: 'rgba(244, 244, 244, 0.1)' }}>
          <p className="text-sm" style={{ color: 'rgba(244, 244, 244, 0.4)' }}>
            💡 {text.hint}
          </p>
          
          <p className="text-xs mt-4" style={{ color: 'rgba(244, 244, 244, 0.3)' }}>
            {lang === 'fr' 
              ? 'Redirection automatique vers l\'accueil dans 10 secondes...'
              : 'Automatic redirect to home in 10 seconds...'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
