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
  // Ensure clean strings by trimming
  const cleanCurrent = current.trim();
  const cleanLatest = latest.trim();
  
  // String equality check - should catch exact matches
  if (cleanCurrent === cleanLatest) {
    console.log('Version strings match exactly:', cleanCurrent, cleanLatest);
    return false;
  }
  
  // Parse into numbers for reliable comparison
  const currentParts = cleanCurrent.split('.').map(part => parseInt(part, 10));
  const latestParts = cleanLatest.split('.').map(part => parseInt(part, 10));
  
  // Log the parsed versions for debugging
  console.log('Comparing versions:', {
    current: cleanCurrent,
    latest: cleanLatest,
    currentParts,
    latestParts
  });
  
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
      
      // Force requiredUpdate to false if versions match
      if (currentVersion.trim() === latestVersionInfo.version.trim()) {
        console.log('Version match detected, forcing requiredUpdate to false');
        latestVersionInfo.requiredUpdate = false;
      }
      
      // Log the raw version data to help debugging
      console.log('Version check:', {
        current: currentVersion,
        latest: latestVersionInfo.version,
        requiredUpdate: latestVersionInfo.requiredUpdate
      });
      
      // Compare versions
      const hasNewerVersion = isNewerVersion(currentVersion, latestVersionInfo.version);
      
      // Double check - if versions are exactly the same, there's no new version regardless
      // This is a safety check in case isNewerVersion has an issue
      const isSameVersion = currentVersion.trim() === latestVersionInfo.version.trim();
      
      // Only show update if there's a newer version OR required update AND not the same version
      const needsUpdate = (hasNewerVersion || latestVersionInfo.requiredUpdate) && !isSameVersion;
      
      console.log('Update needed?', needsUpdate, {
        hasNewerVersion,
        requiredUpdate: latestVersionInfo.requiredUpdate,
        isSameVersion
      });
      
      // Set updateAvailable based on condition
      setUpdateAvailable(needsUpdate);
      
      if (needsUpdate) {
        console.log(`Update available: Current ${currentVersion}, Latest ${latestVersionInfo.version}`);
      } else {
        console.log(`No update needed: Current ${currentVersion}, Latest ${latestVersionInfo.version}`);
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