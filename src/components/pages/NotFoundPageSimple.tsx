/**
 * NotFoundPageSimple - Version ultra-simple garantie de fonctionner
 */

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NotFoundPageSimple() {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(10);

  // DÃ©tecter la langue
  const lang = location.pathname.startsWith('/en') ? 'en' : 'fr';

  // Countdown et redirection
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate(`/${lang}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, lang]);

  // Textes
  const text = lang === 'fr' ? {
    title: '404',
    subtitle: 'Page non trouvÃ©e',
    message: 'La page que vous recherchez n\'existe pas.',
    home: 'Retour Ã  l\'accueil',
    back: 'Retour',
    projects: 'Projets',
    contact: 'Contact',
    redirect: `Redirection automatique dans ${countdown} secondes...`
  } : {
    title: '404',
    subtitle: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    home: 'Back to Home',
    back: 'Go Back',
    projects: 'Projects',
    contact: 'Contact',
    redirect: `Automatic redirect in ${countdown} seconds...`
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 50%, #0C0C0C 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Code 404 */}
        <div style={{
          fontSize: 'clamp(100px, 20vw, 180px)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #CCFF00 0%, #00CC99 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: '1',
          marginBottom: '30px'
        }}>
          {text.title}
        </div>

        {/* Titre */}
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: 700,
          color: '#F4F4F4',
          marginBottom: '20px'
        }}>
          {text.subtitle}
        </h1>

        {/* Message */}
        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 20px)',
          color: 'rgba(244, 244, 244, 0.7)',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          {text.message}
        </p>

        {/* Boutons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          <button
            onClick={() => navigate(`/${lang}`)}
            style={{
              background: '#CCFF00',
              color: '#0C0C0C',
              border: 'none',
              padding: '15px 30px',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: '160px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#00CC99';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#CCFF00';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ðŸ  {text.home}
          </button>

          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'transparent',
              color: '#CCFF00',
              border: '2px solid #CCFF00',
              padding: '15px 30px',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: '160px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(204, 255, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            â† {text.back}
          </button>

          <button
            onClick={() => navigate(`/${lang}/projects`)}
            style={{
              background: 'transparent',
              color: '#F4F4F4',
              border: '2px solid rgba(244, 244, 244, 0.2)',
              padding: '15px 30px',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: '160px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(244, 244, 244, 0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(244, 244, 244, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ðŸ“ {text.projects}
          </button>

          <button
            onClick={() => navigate(`/${lang}/contact`)}
            style={{
              background: 'transparent',
              color: '#F4F4F4',
              border: '2px solid rgba(244, 244, 244, 0.2)',
              padding: '15px 30px',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: '160px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(244, 244, 244, 0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(244, 244, 244, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            âœ‰ï¸ {text.contact}
          </button>
        </div>

        {/* Suggestions rapides */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          {[
            { label: 'Services', path: '/services' },
            { label: 'About', path: '/about' },
            { label: 'Blog', path: '/blog' }
          ].map(item => (
            <button
              key={item.path}
              onClick={() => navigate(`/${lang}${item.path}`)}
              style={{
                background: 'rgba(204, 255, 0, 0.1)',
                color: '#CCFF00',
                border: '1px solid rgba(204, 255, 0, 0.2)',
                padding: '8px 16px',
                fontSize: '14px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(204, 255, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(204, 255, 0, 0.1)';
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Countdown */}
        <div style={{
          marginTop: '40px',
          paddingTop: '30px',
          borderTop: '1px solid rgba(244, 244, 244, 0.1)'
        }}>
          <p style={{
            color: 'rgba(244, 244, 244, 0.4)',
            fontSize: '14px'
          }}>
            â±ï¸ {text.redirect}
          </p>
        </div>

        {/* URL actuelle pour debug */}
        <div style={{
          marginTop: '20px',
          padding: '10px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '6px',
          fontSize: '12px',
          color: 'rgba(244, 244, 244, 0.3)',
          fontFamily: 'monospace'
        }}>
          URL: {location.pathname}
        </div>
      </div>
    </div>
  );
}
