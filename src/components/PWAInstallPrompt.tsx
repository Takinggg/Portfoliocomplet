import React, { useEffect, useState } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { getDeviceType, isInstalled } from '../utils/pwaHelpers';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const deviceType = getDeviceType();

  useEffect(() => {
    // Ne pas afficher si dÃ©jÃ  installÃ©
    if (isInstalled()) {
      return;
    }

    // VÃ©rifier si l'utilisateur a dÃ©jÃ  fermÃ© la banniÃ¨re
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedDate = dismissed ? new Date(dismissed) : null;
    const daysSinceDismissed = dismissedDate 
      ? (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      : Infinity;

    // RÃ©afficher aprÃ¨s 7 jours
    if (dismissedDate && daysSinceDismissed < 7) {
      return;
    }

    // Android/Desktop: Ã‰couter beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Afficher aprÃ¨s un dÃ©lai pour ne pas Ãªtre intrusif
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // iOS: Afficher les instructions si Safari
    if (deviceType === 'ios' && !(window.navigator as any).standalone) {
      setTimeout(() => {
        setShowIOSInstructions(true);
      }, 5000);
    }

    // Ã‰couter l'installation
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] Application installÃ©e');
      setShowPrompt(false);
      setShowIOSInstructions(false);
      
      // Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pwa_install', {
          event_category: 'engagement',
          event_label: 'PWA Installation Success',
        });
      }
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [deviceType]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('[PWA] Installation outcome:', outcome);
      
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pwa_install_prompt', {
          event_category: 'engagement',
          event_label: outcome,
        });
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('[PWA] Erreur lors de l\'installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pwa_install_dismissed', {
        event_category: 'engagement',
        event_label: 'User dismissed install prompt',
      });
    }
  };

  // BanniÃ¨re Android/Desktop
  if (showPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md animate-in slide-in-from-bottom duration-300">
        <Card className="bg-[#0C0C0C] border-[#CCFF00] shadow-[0_10px_40px_rgba(204, 255, 0,0.3)]">
          <div className="p-4 flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#CCFF00] to-[#C6FF1A] rounded-full flex items-center justify-center">
              <Download className="w-6 h-6 text-[#0C0C0C]" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-[#CCFF00] mb-1">
                Installer l'application
              </h3>
              <p className="text-sm text-gray-400">
                AccÃ©dez rapidement Ã  votre portfolio et CRM
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleInstallClick}
                className="bg-[#CCFF00] hover:bg-[#C6FF1A] text-[#0C0C0C]"
                size="sm"
              >
                Installer
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
  }

  // Instructions iOS
  if (showIOSInstructions) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
        <Card className="bg-[#0C0C0C] border-t-2 border-[#CCFF00] rounded-none rounded-t-xl">
          <div className="p-6 relative">
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#CCFF00] to-[#C6FF1A] rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-[#0C0C0C]" />
              </div>
              
              <div>
                <h3 className="text-[#CCFF00] mb-2">
                  Installer sur iOS
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Ajoutez cette app Ã  votre Ã©cran d'accueil pour un accÃ¨s rapide
                </p>
              </div>
            </div>

            <ol className="space-y-3 text-sm text-gray-300 pl-4">
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#CCFF00]/20 text-[#CCFF00] rounded-full flex items-center justify-center text-xs">
                  1
                </span>
                <span>
                  Touchez le bouton de partage 
                  <span className="inline-flex items-center justify-center w-6 h-6 mx-1 bg-gray-700 rounded text-lg">
                    âŽ™
                  </span>
                  en bas de l'Ã©cran
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#CCFF00]/20 text-[#CCFF00] rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                <span>SÃ©lectionnez "Sur l'Ã©cran d'accueil"</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#CCFF00]/20 text-[#CCFF00] rounded-full flex items-center justify-center text-xs">
                  3
                </span>
                <span>Touchez "Ajouter"</span>
              </li>
            </ol>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};
