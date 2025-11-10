import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

/**
 * Visual indicator for URL migration status
 * Shows if bilingual URLs are active
 */
export function URLMigrationStatus() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [hasLanguagePrefix, setHasLanguagePrefix] = useState(false);

  useEffect(() => {
    const pathname = location.pathname;
    const hasPrefix = pathname.match(/^\/(en|fr)(\/|$)/) !== null;
    setHasLanguagePrefix(hasPrefix);

    // Auto-hide after 10 seconds if everything is OK
    if (hasPrefix) {
      const timer = setTimeout(() => setIsVisible(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // Don't show on protected routes
  const protectedRoutes = ['/dashboard', '/login', '/newsletter-debug', '/server-diagnostic', '/sync-dashboard'];
  if (protectedRoutes.some(route => location.pathname.startsWith(route))) {
    return null;
  }

  // Don't show if not visible
  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 max-w-sm"
      style={{ 
        animation: 'slideInRight 0.3s ease-out',
        backgroundColor: hasLanguagePrefix ? 'rgba(0, 255, 194, 0.1)' : 'rgba(255, 87, 87, 0.1)',
        border: hasLanguagePrefix ? '1px solid rgba(0, 255, 194, 0.3)' : '1px solid rgba(255, 87, 87, 0.3)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="p-4 rounded-lg">
        <div className="flex items-start gap-3">
          {hasLanguagePrefix ? (
            <CheckCircle className="h-5 w-5 text-[#00FFC2] flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-[#FF5757] flex-shrink-0 mt-0.5" />
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm mb-1" style={{ color: hasLanguagePrefix ? '#00FFC2' : '#FF5757' }}>
              {hasLanguagePrefix ? '✅ URLs bilingues actives' : '⚠️ Ancienne URL détectée'}
            </h3>
            
            <p className="text-xs text-[#F4F4F4]/70 mb-2">
              URL actuelle: <code className="text-[#00FFC2]">{location.pathname}</code>
            </p>
            
            {hasLanguagePrefix ? (
              <p className="text-xs text-[#F4F4F4]/60">
                Les URLs bilingues fonctionnent correctement ! 🎉
              </p>
            ) : (
              <div className="text-xs text-[#F4F4F4]/60 space-y-1">
                <p>Recharge la page pour voir les nouvelles URLs :</p>
                <ul className="list-disc list-inside ml-2 space-y-0.5">
                  <li>/fr/blog, /fr/services, etc.</li>
                  <li>/en/blog, /en/services, etc.</li>
                </ul>
                <p className="mt-2 text-[#00FFC2]">
                  Appuie sur Ctrl+Shift+R (Win) ou Cmd+Shift+R (Mac)
                </p>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="text-[#F4F4F4]/40 hover:text-[#F4F4F4] transition-colors flex-shrink-0"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
