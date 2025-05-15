// src/registerServiceWorker.ts
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered: ', registration);
          
          // Check for updates on page load
          registration.update();
          
          // When the app is updated, handle the new service worker
          registration.addEventListener('updatefound', () => {
            // An updated service worker has appeared in registration.installing!
            const newWorker = registration.installing;
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                // Has service worker state changed?
                switch (newWorker.state) {
                  case 'installed':
                    // There is a new service worker available, show the notification
                    if (navigator.serviceWorker.controller) {
                      console.log('New content is available; please refresh.');
                      // At this point, the version check in the app will handle the update UI
                    } else {
                      // At this point, everything has been precached
                      console.log('Content is cached for offline use.');
                    }
                    break;
                }
              });
            }
          });
        })
        .catch(error => {
          console.error('Service Worker registration failed: ', error);
        });
      
      // Handle updates when the service worker has skipWaiting()
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    });
  }
}

// This function can be used to tell the service worker to skip waiting
export function promptUserToRefresh(registration: ServiceWorkerRegistration) {
  // Send message to service worker to skip waiting and activate new service worker
  registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
}