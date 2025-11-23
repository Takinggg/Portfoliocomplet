// Service Worker pour Portfolio Freelance Pro
// Version: 1.0.0

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `portfolio-pro-${CACHE_VERSION}`;
const OFFLINE_CACHE = `portfolio-pro-offline-${CACHE_VERSION}`;
const RUNTIME_CACHE = `portfolio-pro-runtime-${CACHE_VERSION}`;
const EXTERNAL_BYPASS_DOMAINS = [
  'istockphoto.com',
  'unsplash.com',
  'pexels.com',
  'pixabay.com',
];

// Ressources critiques Ã  mettre en cache lors de l'installation
// Note: La liste est vide pour Ã©viter les erreurs 404 dans l'environnement Figma preview
// Les ressources seront mises en cache dynamiquement lors de leur utilisation
const CRITICAL_ASSETS = [];

// StratÃ©gie de cache par type de ressource
const CACHE_STRATEGIES = {
  // Cache First - pour assets statiques (images, fonts, CSS, JS)
  cacheFirst: [
    /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
    /\.(?:woff|woff2|ttf|eot)$/,
    /\.(?:css|js)$/,
  ],
  
  // Network First - pour API et contenus dynamiques
  networkFirst: [
    /\/api\//,
    /supabase\.co/,
    /\/dashboard/,
  ],
  
  // Stale While Revalidate - pour pages HTML
  staleWhileRevalidate: [
    /\.html$/,
    /\//,
  ],
};

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Mise en cache des ressources critiques');
        return cache.addAll(CRITICAL_ASSETS).catch((err) => {
          console.warn('[SW] Certaines ressources n\'ont pas pu Ãªtre mises en cache:', err);
          // Ne pas Ã©chouer l'installation si certaines ressources ne sont pas disponibles
        });
      })
      .then(() => {
        console.log('[SW] Installation terminÃ©e');
        return self.skipWaiting(); // Active immÃ©diatement le nouveau SW
      })
      .catch((error) => {
        console.error('[SW] Erreur lors de l\'installation:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        // Supprimer les anciens caches
        return Promise.all(
          cacheNames
            .filter((name) => {
              return name.startsWith('portfolio-pro-') && 
                     name !== CACHE_NAME && 
                     name !== OFFLINE_CACHE &&
                     name !== RUNTIME_CACHE;
            })
            .map((name) => {
              console.log('[SW] Suppression du cache obsolÃ¨te:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation terminÃ©e');
        return self.clients.claim(); // Prend le contrÃ´le immÃ©diatement
      })
  );
});

// Interception des requÃªtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ne rien intercepter pour les mÃ©thodes non-GET (POST/PUT/etc.)
  if (request.method !== 'GET') {
    return;
  }
  
  // Ignorer les requÃªtes non-HTTP
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Ignorer les requÃªtes Chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Laisser le navigateur gÃ©rer certaines ressources externes pour Ã©viter des blocages CSP
  if (shouldBypassRequest(url)) {
    return;
  }

  // DÃ©terminer la stratÃ©gie de cache
  const strategy = determineStrategy(request);
  
  event.respondWith(
    strategy(request)
      .catch(() => {
        // Si tout Ã©choue, afficher la page offline pour les navigations
        if (request.mode === 'navigate') {
          return caches.match('/offline.html').then((response) => {
            if (response) {
              return response;
            }
            // Fallback si offline.html n'est pas dans le cache
            return new Response(
              `<!DOCTYPE html>
              <html lang="fr">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Hors ligne</title>
                <style>
                  body {
                    font-family: system-ui, -apple-system, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    background: #0C0C0C;
                    color: #F4F4F4;
                    text-align: center;
                    padding: 20px;
                  }
                  h1 { color: #CCFF00; margin-bottom: 16px; }
                  button {
                    background: #CCFF00;
                    color: #0C0C0C;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    margin-top: 20px;
                  }
                </style>
              </head>
              <body>
                <div>
                  <h1>Mode Hors Ligne</h1>
                  <p>Vous Ãªtes actuellement hors ligne.</p>
                  <button onclick="window.location.reload()">RÃ©essayer</button>
                </div>
              </body>
              </html>`,
              {
                headers: { 'Content-Type': 'text/html' }
              }
            );
          });
        }
        
        // Pour les autres ressources, retourner une rÃ©ponse vide
        return new Response('', {
          status: 408,
          statusText: 'Request Timeout',
        });
      })
  );
});

// DÃ©terminer la stratÃ©gie de cache appropriÃ©e
function determineStrategy(request) {
  const url = new URL(request.url);
  
  // Network First pour les API
  for (const pattern of CACHE_STRATEGIES.networkFirst) {
    if (pattern.test(url.href)) {
      return networkFirst;
    }
  }
  
  // Cache First pour les assets statiques
  for (const pattern of CACHE_STRATEGIES.cacheFirst) {
    if (pattern.test(url.href)) {
      return cacheFirst;
    }
  }
  
  // Stale While Revalidate pour le reste
  return staleWhileRevalidate;
}

function shouldBypassRequest(url) {
  const isSameOrigin = url.origin === self.location.origin;
  if (isSameOrigin) {
    return false;
  }

  return EXTERNAL_BYPASS_DOMAINS.some((domain) => {
    return url.hostname === domain || url.hostname.endsWith(`.${domain}`);
  });
}

// StratÃ©gie Cache First
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  const response = await fetch(request);
  
  // Mettre en cache si la rÃ©ponse est valide
  if (response && response.status === 200) {
    cache.put(request, response.clone());
  }
  
  return response;
}

// StratÃ©gie Network First
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const response = await fetch(request);
    
    // Mettre en cache si la rÃ©ponse est valide
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Si le rÃ©seau Ã©choue, utiliser le cache
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    throw error;
  }
}

// StratÃ©gie Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  
  // Toujours essayer de rÃ©cupÃ©rer une version fraÃ®che
  const fetchPromise = fetch(request).then((response) => {
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Si le fetch Ã©choue, retourner le cache
    return cached;
  });
  
  // Retourner le cache immÃ©diatement s'il existe, sinon attendre le rÃ©seau
  return cached || fetchPromise;
}

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        );
      })
    );
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_VERSION,
    });
  }
});

// Synchronisation en arriÃ¨re-plan (Background Sync)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('[SW] Synchronisation des donnÃ©es...');
  
  try {
    console.log('[SW] Synchronisation rÃ©ussie');
  } catch (error) {
    console.error('[SW] Erreur de synchronisation:', error);
    throw error;
  }
}

// Notifications Push
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification reÃ§ue');
  
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification',
    vibrate: [200, 100, 200],
    tag: 'portfolio-notification',
    requireInteraction: false,
  };
  
  event.waitUntil(
    self.registration.showNotification('Portfolio Pro', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification cliquÃ©e:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[SW] Service Worker chargÃ© - Version:', CACHE_VERSION);
