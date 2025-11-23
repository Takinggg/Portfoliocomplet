import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Trash2, 
  Download,
  Wifi,
  Bell,
  HardDrive,
  Smartphone,
  Info
} from 'lucide-react';

interface PWAStatus {
  serviceWorkerActive: boolean;
  isInstalled: boolean;
  cacheCount: number;
  networkStatus: 'online' | 'offline';
  deviceType: 'ios' | 'android' | 'desktop';
  swVersion: string | null;
  manifestValid: boolean;
  notificationPermission: NotificationPermission;
}

export const PWADebugPanel: React.FC = () => {
  const [status, setStatus] = useState<PWAStatus>({
    serviceWorkerActive: false,
    isInstalled: false,
    cacheCount: 0,
    networkStatus: 'online',
    deviceType: 'desktop',
    swVersion: null,
    manifestValid: false,
    notificationPermission: 'default',
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Ajouter un helper global pour ouvrir le debug panel
    (window as any).pwaDebug = () => {
      setIsVisible(true);
      console.log('ðŸ”§ PWA Debug Panel ouvert');
    };

    console.log('ðŸ’¡ PWA Debug helper loaded! Run: pwaDebug()');

    // Mettre Ã  jour le statut initial
    updateStatus();

    // Mettre Ã  jour toutes les 2 secondes
    const interval = setInterval(updateStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  const updateStatus = async () => {
    const newStatus: PWAStatus = {
      serviceWorkerActive: !!navigator.serviceWorker.controller,
      isInstalled: window.matchMedia('(display-mode: standalone)').matches || 
                   (window.navigator as any).standalone === true,
      cacheCount: 0,
      networkStatus: navigator.onLine ? 'online' : 'offline',
      deviceType: getDeviceType(),
      swVersion: null,
      manifestValid: false,
      notificationPermission: 'default',
    };

    // Compter les caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      newStatus.cacheCount = cacheNames.length;
    }

    // Obtenir la version du SW
    if (navigator.serviceWorker.controller) {
      try {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          setStatus(prev => ({ ...prev, swVersion: event.data.version }));
        };
        navigator.serviceWorker.controller.postMessage(
          { type: 'GET_VERSION' },
          [messageChannel.port2]
        );
      } catch (e) {
        console.error('Erreur obtention version SW:', e);
      }
    }

    // VÃ©rifier le manifest (dÃ©sactivÃ© dans Figma Make car /public/ n'est pas servi)
    try {
      // Dans Figma Make, les fichiers publics ne sont pas accessibles
      // On considÃ¨re le manifest comme valide si on est en production
      const isProduction = window.location.hostname !== 'localhost';
      newStatus.manifestValid = isProduction ? null : false;
    } catch (e) {
      newStatus.manifestValid = false;
    }

    // Permission de notification
    if ('Notification' in window) {
      newStatus.notificationPermission = Notification.permission;
    }

    setStatus(newStatus);
  };

  const getDeviceType = (): 'ios' | 'android' | 'desktop' => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
    if (/android/.test(userAgent)) return 'android';
    return 'desktop';
  };

  const handleForceUpdate = async () => {
    if (navigator.serviceWorker.controller) {
      const registration = await navigator.serviceWorker.getRegistration();
      await registration?.update();
      console.log('âœ… Mise Ã  jour forcÃ©e du Service Worker');
      alert('âœ… Mise Ã  jour forcÃ©e. Rechargement...');
      window.location.reload();
    }
  };

  const handleClearCache = async () => {
    const confirmed = window.confirm(
      'âš ï¸ ÃŠtes-vous sÃ»r de vouloir vider tous les caches ?\n\nCela supprimera toutes les donnÃ©es mises en cache.'
    );

    if (confirmed) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('âœ… Tous les caches ont Ã©tÃ© vidÃ©s');
      alert('âœ… Cache vidÃ©. Rechargement...');
      window.location.reload();
    }
  };

  const handleUnregisterSW = async () => {
    const confirmed = window.confirm(
      'âš ï¸ ÃŠtes-vous sÃ»r de vouloir dÃ©senregistrer le Service Worker ?\n\nCela dÃ©sactivera le mode offline.'
    );

    if (confirmed) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
      console.log('âœ… Service Worker dÃ©senregistrÃ©');
      alert('âœ… Service Worker dÃ©senregistrÃ©. Rechargement...');
      window.location.reload();
    }
  };

  const handleTestNotification = async () => {
    if (!('Notification' in window)) {
      alert('âŒ Les notifications ne sont pas supportÃ©es par ce navigateur');
      return;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      new Notification('Portfolio Pro - Test', {
        body: 'Les notifications fonctionnent correctement !',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
      });
      console.log('âœ… Notification test envoyÃ©e');
    } else {
      alert('âŒ Permission de notification refusÃ©e');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="bg-[#0C0C0C] border-[#CCFF00] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#CCFF00] to-[#C6FF1A] rounded-full flex items-center justify-center">
                <Info className="w-5 h-5 text-[#0C0C0C]" />
              </div>
              <div>
                <h2 className="text-[#CCFF00]">PWA Debug Panel</h2>
                <p className="text-sm text-gray-400">Diagnostics et contrÃ´les</p>
              </div>
            </div>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              Fermer
            </Button>
          </div>

          {/* Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Service Worker */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Service Worker</span>
                {status.serviceWorkerActive ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
              <p className="text-white">
                {status.serviceWorkerActive ? 'Actif' : 'Inactif'}
              </p>
              {status.swVersion && (
                <p className="text-xs text-gray-500 mt-1">Version: {status.swVersion}</p>
              )}
            </div>

            {/* Installation */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Application</span>
                {status.isInstalled ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <p className="text-white">
                {status.isInstalled ? 'InstallÃ©e' : 'Non installÃ©e'}
              </p>
            </div>

            {/* Cache */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Cache</span>
                <HardDrive className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-white">
                {status.cacheCount} cache{status.cacheCount > 1 ? 's' : ''}
              </p>
            </div>

            {/* RÃ©seau */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">RÃ©seau</span>
                <Wifi className={`w-5 h-5 ${status.networkStatus === 'online' ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <p className="text-white capitalize">{status.networkStatus}</p>
            </div>

            {/* Appareil */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Appareil</span>
                <Smartphone className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-white capitalize">{status.deviceType}</p>
            </div>

            {/* Notifications */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Notifications</span>
                <Bell className="w-5 h-5 text-yellow-400" />
              </div>
              <Badge 
                variant={
                  status.notificationPermission === 'granted' ? 'default' :
                  status.notificationPermission === 'denied' ? 'destructive' :
                  'secondary'
                }
              >
                {status.notificationPermission === 'granted' ? 'AutorisÃ©es' :
                 status.notificationPermission === 'denied' ? 'RefusÃ©es' :
                 'Non demandÃ©es'}
              </Badge>
            </div>

            {/* Manifest */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Manifest</span>
                {status.manifestValid ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
              <p className="text-white">
                {status.manifestValid ? 'Valide' : 'Invalide'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <h3 className="text-white mb-3">Actions</h3>

            <Button
              onClick={updateStatus}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              RafraÃ®chir le statut
            </Button>

            <Button
              onClick={handleForceUpdate}
              className="w-full bg-[#CCFF00] hover:bg-[#C6FF1A] text-[#0C0C0C]"
              disabled={!status.serviceWorkerActive}
            >
              <Download className="w-4 h-4 mr-2" />
              Forcer la mise Ã  jour
            </Button>

            <Button
              onClick={handleTestNotification}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Bell className="w-4 h-4 mr-2" />
              Tester les notifications
            </Button>

            <Button
              onClick={handleClearCache}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              disabled={status.cacheCount === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Vider le cache
            </Button>

            <Button
              onClick={handleUnregisterSW}
              variant="destructive"
              className="w-full"
              disabled={!status.serviceWorkerActive}
            >
              <XCircle className="w-4 h-4 mr-2" />
              DÃ©senregistrer le SW
            </Button>
          </div>

          {/* Console Commands */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-[#CCFF00] text-sm mb-2">Commandes Console</h4>
            <div className="space-y-1 text-xs font-mono text-gray-400">
              <p>â€¢ pwaDebug() - Ouvrir ce panel</p>
              <p>â€¢ caches.keys() - Lister les caches</p>
              <p>â€¢ navigator.serviceWorker.controller - Info SW</p>
              <p>â€¢ Notification.requestPermission() - Demander permissions</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
