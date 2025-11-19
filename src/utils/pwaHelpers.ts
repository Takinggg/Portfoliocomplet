// Utilitaires PWA pour Portfolio Freelance Pro

/**
 * Détecte si l'application est dans un environnement de preview (Figma Make) ou développement local
 */
function isPreviewEnvironment(): boolean {
  // Détecter l'environnement de développement local
  const isDevelopment = import.meta.env.DEV || 
                        window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' ||
                        window.location.port === '3000' ||
                        window.location.port === '5173';
  
  // Détecter l'environnement Figma Make iframe
  const isFigmaPreview = window.location.hostname.includes('figmaiframepreview') || 
                         window.location.hostname.includes('figma.site');
  
  // Détecter si on est dans un iframe
  const isInIframe = window.self !== window.top;
  
  return isDevelopment || isFigmaPreview || isInIframe;
}

/**
 * Enregistre le Service Worker
 * Note: Désactivé en développement local et dans l'environnement de preview Figma Make
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  // Vérifier si on est dans un environnement de preview ou développement
  if (isPreviewEnvironment()) {
    console.log(
      '%c[PWA] Service Worker désactivé en mode développement/preview',
      'color: #00FFC2; font-weight: bold;',
      '\n📱 Les PWA ne sont pas supportées en développement local ou dans les iframes.',
      '\n✅ Le Service Worker sera actif après déploiement en production.',
      '\n📦 Fichiers PWA prêts: /public/service-worker.js, /public/manifest.json, /public/offline.html'
    );
    return null;
  }
  
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });
      
      console.log('[PWA] Service Worker enregistré:', registration.scope);
      
      // Gérer les mises à jour du Service Worker
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Un nouveau Service Worker est disponible
              console.log('[PWA] Nouvelle version disponible');
              
              // Afficher une notification à l'utilisateur
              showUpdateNotification(newWorker);
            }
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.error('[PWA] Erreur lors de l\'enregistrement du Service Worker:', error);
      return null;
    }
  }
  
  console.warn('[PWA] Service Worker non supporté par ce navigateur');
  return null;
}

/**
 * Affiche une notification de mise à jour
 */
function showUpdateNotification(newWorker: ServiceWorker): void {
  const shouldUpdate = window.confirm(
    'Une nouvelle version de l\'application est disponible. Voulez-vous actualiser maintenant ?'
  );
  
  if (shouldUpdate) {
    newWorker.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }
}

/**
 * Vérifie si l'application est installée (mode standalone)
 */
export function isInstalled(): boolean {
  // Mode standalone (installé sur l'appareil)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // iOS Safari
  const isIOSStandalone = (window.navigator as any).standalone === true;
  
  return isStandalone || isIOSStandalone;
}

/**
 * Vérifie si le navigateur supporte les PWA
 */
import type { BeforeInstallPromptEvent } from './types/shared';

export function isPWASupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Gère l'événement beforeinstallprompt pour Android/Desktop
 */
export function setupInstallPrompt(): void {
  let deferredPrompt: BeforeInstallPromptEvent | null = null;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Empêcher le mini-infobar par défaut
    e.preventDefault();
    
    // Stocker l'événement pour l'utiliser plus tard
    deferredPrompt = e as BeforeInstallPromptEvent;
    
    console.log('[PWA] L\'application peut être installée');
    
    // Afficher un bouton/bannière personnalisé pour l'installation
    showInstallBanner(deferredPrompt);
  });
  
  // Écouter l'événement d'installation
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] Application installée avec succès');
    deferredPrompt = null;
    
    // Analytics: tracker l'installation
    if (typeof window !== 'undefined' && (window as Window & { gtag?: Function }).gtag) {
      (window as Window & { gtag: Function }).gtag('event', 'pwa_install', {
        event_category: 'engagement',
        event_label: 'PWA Installation',
      });
    }
  });
}

/**
 * Affiche une bannière d'installation personnalisée
 */
function showInstallBanner(deferredPrompt: BeforeInstallPromptEvent): void {
  // Vérifier si l'utilisateur a déjà refusé l'installation
  const installDismissed = localStorage.getItem('pwa-install-dismissed');
  
  if (installDismissed) {
    return;
  }
  
  // Créer une bannière personnalisée
  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #0C0C0C;
      border: 1px solid #00FFC2;
      border-radius: 12px;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 10px 40px rgba(0, 255, 194, 0.3);
      z-index: 9999;
      max-width: 90%;
      animation: slideUp 0.3s ease-out;
    ">
      <div style="flex: 1; color: #F4F4F4;">
        <strong style="color: #00FFC2;">Installer l'application</strong>
        <p style="margin: 4px 0 0; font-size: 14px; color: #999;">
          Accédez rapidement à votre portfolio et CRM
        </p>
      </div>
      <button id="pwa-install-button" style="
        background: #00FFC2;
        color: #0C0C0C;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
      ">
        Installer
      </button>
      <button id="pwa-dismiss-button" style="
        background: transparent;
        color: #999;
        border: none;
        padding: 10px;
        cursor: pointer;
        font-size: 20px;
      ">
        ✕
      </button>
    </div>
    <style>
      @keyframes slideUp {
        from {
          transform: translateX(-50%) translateY(100px);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
    </style>
  `;
  
  document.body.appendChild(banner);
  
  // Gérer le clic sur le bouton Installer
  document.getElementById('pwa-install-button')?.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] Choix d\'installation:', outcome);
      
      banner.remove();
    }
  });
  
  // Gérer le clic sur le bouton Fermer
  document.getElementById('pwa-dismiss-button')?.addEventListener('click', () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    banner.remove();
  });
}

/**
 * Obtient la version du Service Worker actuel
 */
export async function getServiceWorkerVersion(): Promise<string | null> {
  if (!navigator.serviceWorker.controller) {
    return null;
  }
  
  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data.version || null);
    };
    
    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_VERSION' },
      [messageChannel.port2]
    );
  });
}

/**
 * Vide le cache du Service Worker
 */
export async function clearServiceWorkerCache(): Promise<void> {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
    console.log('[PWA] Cache vidé');
  }
}

/**
 * Enregistre les notifications push
 */
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  if (!('PushManager' in window)) {
    console.warn('[PWA] Push notifications non supportées');
    return null;
  }
  
  const permission = await Notification.requestPermission();
  
  if (permission !== 'granted') {
    console.warn('[PWA] Permission de notification refusée');
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Vérifier si déjà abonné
    const existingSubscription = await registration.pushManager.getSubscription();
    
    if (existingSubscription) {
      return existingSubscription;
    }
    
    // Créer un nouvel abonnement
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        // Remplacer par votre clé publique VAPID
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
      ),
    });
    
    console.log('[PWA] Abonné aux notifications push:', subscription);
    
    return subscription;
  } catch (error) {
    console.error('[PWA] Erreur lors de l\'abonnement aux notifications:', error);
    return null;
  }
}

/**
 * Convertit une clé VAPID base64 en Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

/**
 * Active la synchronisation en arrière-plan
 */
export async function registerBackgroundSync(tag: string): Promise<void> {
  if (!('sync' in registration)) {
    console.warn('[PWA] Background Sync non supporté');
    return;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    await (registration as any).sync.register(tag);
    console.log('[PWA] Background sync enregistré:', tag);
  } catch (error) {
    console.error('[PWA] Erreur lors de l\'enregistrement du background sync:', error);
  }
}

/**
 * Détecte le type d'appareil
 */
export function getDeviceType(): 'ios' | 'android' | 'desktop' {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  }
  
  if (/android/.test(userAgent)) {
    return 'android';
  }
  
  return 'desktop';
}

/**
 * Affiche les instructions d'installation pour iOS
 */
export function showIOSInstallInstructions(): void {
  const isIOS = getDeviceType() === 'ios';
  const isInStandaloneMode = (window.navigator as any).standalone;
  
  if (isIOS && !isInStandaloneMode) {
    const instructions = document.createElement('div');
    instructions.innerHTML = `
      <div style="
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #0C0C0C;
        border-top: 2px solid #00FFC2;
        padding: 20px;
        z-index: 9999;
        animation: slideUp 0.3s ease-out;
      ">
        <button onclick="this.parentElement.remove()" style="
          position: absolute;
          top: 10px;
          right: 10px;
          background: transparent;
          border: none;
          color: #999;
          font-size: 24px;
          cursor: pointer;
        ">✕</button>
        
        <h3 style="color: #00FFC2; margin-bottom: 12px;">
          Installer sur iOS
        </h3>
        
        <ol style="color: #F4F4F4; padding-left: 20px; line-height: 1.8;">
          <li>Touchez le bouton de partage <span style="font-size: 20px;">⎙</span></li>
          <li>Sélectionnez "Sur l'écran d'accueil"</li>
          <li>Touchez "Ajouter"</li>
        </ol>
      </div>
    `;
    
    document.body.appendChild(instructions);
    
    // Masquer après 10 secondes
    setTimeout(() => {
      instructions.remove();
    }, 10000);
  }
}

/**
 * Vérifie la connexion réseau
 */
export function checkNetworkStatus(): {
  online: boolean;
  type: string;
  effectiveType?: string;
} {
  const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
  
  return {
    online: navigator.onLine,
    type: connection?.type || 'unknown',
    effectiveType: connection?.effectiveType || 'unknown',
  };
}

/**
 * Écoute les changements de connexion réseau
 */
export function setupNetworkStatusListener(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  // Retourner une fonction de nettoyage
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}
