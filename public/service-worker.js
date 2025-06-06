// public/service-worker.js
const CACHE_NAME = 'cardstack-v1.5.5';
const VERSION_CHECK_INTERVAL = 60 * 60 * 1000; // Check version every hour (in milliseconds)

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/cardstack-favicon.svg',
  '/pwa-icons/icon-192x192.png',
  '/pwa-icons/icon-512x512.png'
];

// Never cache version.json - we always want to get the latest version from the server
const EXCLUDED_FROM_CACHE = [
  '/version.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => {
          return name !== CACHE_NAME;
        }).map((name) => {
          return caches.delete(name);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // For excluded URLs, always go to network
  const url = new URL(event.request.url);
  if (EXCLUDED_FROM_CACHE.some(path => url.pathname.includes(path))) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise try the network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response - one to return, one to cache
            const responseToCache = response.clone();

            // Add response to cache for future use
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

// Listen for message events (for example, when the app wants to force an update)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Automatically check for updates periodically (for PWA users)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => {
          return name !== CACHE_NAME;
        }).map((name) => {
          return caches.delete(name);
        })
      );
    }).then(() => self.clients.claim())
  );
  
  // Set up periodic version check for PWA
  setInterval(() => {
    console.log('Checking for app updates...');
    // Fetch version.json to check for updates
    fetch('/version.json?t=' + Date.now(), { cache: 'no-store' })
      .then(response => response.json())
      .then(versionInfo => {
        const currentVersion = CACHE_NAME.replace('cardstack-v', '');
        if (versionInfo.version !== currentVersion) {
          console.log('New version available:', versionInfo.version);
          // The app will handle showing the update notification next time it's opened
          self.registration.update();
        }
      })
      .catch(error => {
        console.error('Error checking for updates:', error);
      });
  }, VERSION_CHECK_INTERVAL);
});