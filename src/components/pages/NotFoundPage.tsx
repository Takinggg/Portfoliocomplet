/**
 * NotFoundPage - Page 404 personnalisÃ©e
 * 
 * AffichÃ©e quand l'utilisateur essaie d'accÃ©der Ã  une route qui n'existe pas.
 */

import { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useTranslation } from '../../utils/i18n/useTranslation';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useTranslation();
  const notFoundTexts = (t as any)?.notFound ?? {};

  const lang = useMemo(() => {
    const pathname = location.pathname;
    if (pathname.startsWith('/en')) return 'en';
    if (pathname.startsWith('/fr')) return 'fr';
    return language ?? 'fr';
  }, [location.pathname, language]);

  // Redirection automatique aprÃ¨s 10 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('â° Auto-redirect to home after 10s');
      navigate(`/${lang}`);
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate, lang]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#0C0C0C] via-[#1a1a1a] to-[#0C0C0C]">
      <div className="max-w-2xl w-full text-center">
        {/* Code 404 animÃ© */}
        <div className="mb-8 relative">
          <h1 
            className="text-[150px] md:text-[200px] leading-none tracking-tighter opacity-10 select-none"
            style={{ 
              fontWeight: 900,
              background: 'linear-gradient(135deg, #CCFF00 0%, #00CC99 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {notFoundTexts.title}
          </h1>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl md:text-8xl" style={{ fontWeight: 800, color: '#CCFF00' }}>
              {notFoundTexts.title}
            </div>
          </div>
        </div>

        {/* Texte principal */}
        <div className="space-y-6 mb-12">
          <h2 className="text-3xl md:text-4xl" style={{ fontWeight: 700, color: '#F4F4F4' }}>
            {notFoundTexts.subtitle}
          </h2>
          
          <p className="text-lg md:text-xl" style={{ color: 'rgba(244, 244, 244, 0.7)' }}>
            {notFoundTexts.message}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            onClick={() => navigate(`/${lang}`)}
            size="lg"
            className="w-full sm:w-auto"
            style={{
              background: '#CCFF00',
              color: '#0C0C0C',
            }}
          >
            <Home className="mr-2 h-5 w-5" />
            {notFoundTexts.actions?.home}
          </Button>

          <Button
            onClick={() => navigate(-1)}
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
            style={{
              borderColor: '#CCFF00',
              color: '#CCFF00',
            }}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {notFoundTexts.actions?.back}
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
            {notFoundTexts.actions?.projects}
          </Button>
        </div>

        {/* Suggestions */}
        <div className="space-y-4">
          <p style={{ color: 'rgba(244, 244, 244, 0.5)' }}>
            {notFoundTexts.suggestions}
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate(`/${lang}/services`)}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{
                background: 'rgba(204, 255, 0, 0.1)',
                color: '#CCFF00',
                border: '1px solid rgba(204, 255, 0, 0.2)',
              }}
            >
              {notFoundTexts.actions?.services}
            </button>
            
            <button
              onClick={() => navigate(`/${lang}/about`)}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{
                background: 'rgba(204, 255, 0, 0.1)',
                color: '#CCFF00',
                border: '1px solid rgba(204, 255, 0, 0.2)',
              }}
            >
              {notFoundTexts.actions?.about}
            </button>
            
            <button
              onClick={() => navigate(`/${lang}/contact`)}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{
                background: 'rgba(204, 255, 0, 0.1)',
                color: '#CCFF00',
                border: '1px solid rgba(204, 255, 0, 0.2)',
              }}
            >
              {notFoundTexts.actions?.contact}
            </button>
            
            <button
              onClick={() => navigate(`/${lang}/blog`)}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{
                background: 'rgba(204, 255, 0, 0.1)',
                color: '#CCFF00',
                border: '1px solid rgba(204, 255, 0, 0.2)',
              }}
            >
              {notFoundTexts.actions?.blog}
            </button>
          </div>
        </div>

        {/* Hint */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: 'rgba(244, 244, 244, 0.1)' }}>
          <p className="text-sm" style={{ color: 'rgba(244, 244, 244, 0.4)' }}>
            ðŸ’¡ {notFoundTexts.hint}
          </p>
          
          <p className="text-xs mt-4" style={{ color: 'rgba(244, 244, 244, 0.3)' }}>
            {notFoundTexts.redirect}
          </p>
        </div>
      </div>
    </div>
  );
}
