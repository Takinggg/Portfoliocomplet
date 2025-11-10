import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { checkNetworkStatus, setupNetworkStatusListener } from '../utils/pwaHelpers';

export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const [showReconnectedAlert, setShowReconnectedAlert] = useState(false);

  useEffect(() => {
    // État initial
    const status = checkNetworkStatus();
    setIsOnline(status.online);

    // Gérer les changements de connexion
    const cleanup = setupNetworkStatusListener(
      // Online
      () => {
        console.log('[Network] Connexion rétablie');
        setIsOnline(true);
        setShowOfflineAlert(false);
        setShowReconnectedAlert(true);

        // Masquer l'alerte de reconnexion après 3 secondes
        setTimeout(() => {
          setShowReconnectedAlert(false);
        }, 3000);

        // Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'network_online', {
            event_category: 'network',
            event_label: 'Connection restored',
          });
        }
      },
      // Offline
      () => {
        console.log('[Network] Connexion perdue');
        setIsOnline(false);
        setShowOfflineAlert(true);
        setShowReconnectedAlert(false);

        // Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'network_offline', {
            event_category: 'network',
            event_label: 'Connection lost',
          });
        }
      }
    );

    return cleanup;
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  // Alerte hors ligne
  if (showOfflineAlert) {
    return (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md animate-in slide-in-from-top duration-300">
        <Alert className="bg-red-950 border-red-500 text-white shadow-lg">
          <WifiOff className="h-4 w-4 text-red-400" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex-1">
              <strong className="block mb-1">Connexion perdue</strong>
              <span className="text-sm text-red-200">
                Vous êtes en mode hors ligne. Certaines fonctionnalités peuvent être limitées.
              </span>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="ml-4 flex-shrink-0 border-red-400 text-red-400 hover:bg-red-900 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Alerte de reconnexion
  if (showReconnectedAlert) {
    return (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md animate-in slide-in-from-top duration-300">
        <Alert className="bg-green-950 border-green-500 text-white shadow-lg">
          <Wifi className="h-4 w-4 text-green-400" />
          <AlertDescription>
            <strong className="block mb-1">Connexion rétablie</strong>
            <span className="text-sm text-green-200">
              Vous êtes de nouveau en ligne.
            </span>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
};
