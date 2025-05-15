// src/utils/version.ts
import { useState, useEffect, useCallback } from 'react';

// Define Safari-specific navigator interface
interface SafariNavigator extends Navigator {
  standalone?: boolean;
}

export interface VersionInfo {
  version: string;
  buildDate: string;
  requiredUpdate: boolean;
  updateMessage: string;
}

// Function to compare versions (semantic versioning)
export const isNewerVersion = (current: string, latest: string): boolean => {
  if (current === latest) return false;
  
  const currentParts = current.split('.').map(Number);
  const latestParts = latest.split('.').map(Number);
  
  // Compare major, minor, patch versions
  for (let i = 0; i < 3; i++) {
    if (latestParts[i] > currentParts[i]) return true;
    if (latestParts[i] < currentParts[i]) return false;
  }
  
  return false;
};

// Custom hook to check for application updates
export const useAppVersionCheck = (currentVersion: string, checkInterval = 3600000) => {
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [isPWA, setIsPWA] = useState<boolean>(false);
  
  // Check if app is running as PWA
  useEffect(() => {
    // Check if running as installed PWA
    const isPWAInstalled = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as SafariNavigator).standalone === true;
      
    setIsPWA(isPWAInstalled);
    
    // For PWAs, also check URL parameters (start_url may include source=pwa)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('source') === 'pwa') {
      setIsPWA(true);
    }
  }, []);
  
  // Function to check for new version - memoized with useCallback
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const checkForUpdates = useCallback(async (_?: unknown) => {
    try {
      // Add cache-busting query parameter
      const timestamp = new Date().getTime();
      const response = await fetch(`/version.json?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch version info');
        return;
      }
      
      const latestVersionInfo: VersionInfo = await response.json();
      setVersionInfo(latestVersionInfo);
      
      // Compare versions
      if (isNewerVersion(currentVersion, latestVersionInfo.version) || latestVersionInfo.requiredUpdate) {
        console.log(`Update available: Current ${currentVersion}, Latest ${latestVersionInfo.version}`);
        setUpdateAvailable(true);
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }, [currentVersion]); // Only depends on currentVersion
  
  // Check for updates on component mount and periodically
  useEffect(() => {
    // Initial check
    checkForUpdates();
    
    // If running as PWA, check more frequently
    const interval = isPWA ? checkInterval / 2 : checkInterval;
    
    // Set up interval for periodic checks
    const intervalId = setInterval(checkForUpdates, interval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [currentVersion, checkInterval, isPWA, checkForUpdates]);
  
  // Function to force refresh the app
  const refreshApp = () => {
    // For PWA, need to notify service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Get the service worker registration
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
          // Tell the service worker to skipWaiting
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          // If the service worker doesn't trigger a refresh, force one after a short delay
          setTimeout(() => {
            hardRefresh();
          }, 1000);
        } else {
          // If no waiting worker, just hard refresh
          hardRefresh();
        }
      }).catch(() => {
        // If there's any error with the service worker, fall back to hard refresh
        hardRefresh();
      });
    } else {
      // For regular web app, just hard refresh
      hardRefresh();
    }
  };
  
  // Hard refresh function
  const hardRefresh = () => {
    // Set a flag in sessionStorage to indicate we're purposely refreshing
    // This prevents an infinite refresh loop
    sessionStorage.setItem('app_refreshing', 'true');
    
    // Make sure to clear caches synchronously when possible
    try {
      // For modern browsers, immediately reload with cache busting
      window.location.href = window.location.pathname + '?refresh=' + Date.now();
    } catch (error) {
      console.error('Error during refresh:', error);
      // Fallback to standard reload - modern approach without the deprecated boolean
      window.location.reload();
    }
  };
  
  return { updateAvailable, versionInfo, refreshApp, checkForUpdates, isPWA };
};