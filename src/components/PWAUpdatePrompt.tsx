import React, { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export const PWAUpdatePrompt: React.FC = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    // Vérifier les mises à jour
    navigator.serviceWorker.ready.then((registration) => {
      // Vérifier s'il y a déjà un worker en attente
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setShowUpdatePrompt(true);
      }

      // Écouter les nouvelles mises à jour
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Un nouveau Service Worker est disponible
              setWaitingWorker(newWorker);
              setShowUpdatePrompt(true);

              console.log('[PWA] Nouvelle version disponible');

              // Analytics
              if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'pwa_update_available', {
                  event_category: 'engagement',
                  event_label: 'New version available',
                });
              }
            }
          });
        }
      });
    });

    // Écouter le message du Service Worker pour recharger
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[PWA] Nouveau Service Worker actif, rechargement...');
      window.location.reload();
    });
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });

      // Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pwa_update_accepted', {
          event_category: 'engagement',
          event_label: 'User accepted update',
        });
      }
    }
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);

    // Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pwa_update_dismissed', {
        event_category: 'engagement',
        event_label: 'User dismissed update',
      });
    }
  };

  if (!showUpdatePrompt) {
    return null;
  }

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md animate-in slide-in-from-top duration-300">
      <Card className="bg-[#0C0C0C] border-[#00FFC2] shadow-[0_10px_40px_rgba(0,255,194,0.3)]">
        <div className="p-4 flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#00FFC2] to-[#00CC9A] rounded-full flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-[#0C0C0C]" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-[#00FFC2] mb-1">
              Nouvelle version disponible
            </h3>
            <p className="text-sm text-gray-400">
              Actualisez pour obtenir les dernières fonctionnalités et améliorations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleUpdate}
              className="bg-[#00FFC2] hover:bg-[#00CC9A] text-[#0C0C0C]"
              size="sm"
            >
              Actualiser
            </Button>

            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
