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

    // VÃ©rifier les mises Ã  jour
    navigator.serviceWorker.ready.then((registration) => {
      // VÃ©rifier s'il y a dÃ©jÃ  un worker en attente
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setShowUpdatePrompt(true);
      }

      // Ã‰couter les nouvelles mises Ã  jour
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

    // Ã‰couter le message du Service Worker pour recharger
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
      <Card className="bg-[#0C0C0C] border-[#CCFF00] shadow-[0_10px_40px_rgba(204, 255, 0,0.3)]">
        <div className="p-4 flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#CCFF00] to-[#C6FF1A] rounded-full flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-[#0C0C0C]" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-[#CCFF00] mb-1">
              Nouvelle version disponible
            </h3>
            <p className="text-sm text-gray-400">
              Actualisez pour obtenir les derniÃ¨res fonctionnalitÃ©s et amÃ©liorations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleUpdate}
              className="bg-[#CCFF00] hover:bg-[#C6FF1A] text-[#0C0C0C]"
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
