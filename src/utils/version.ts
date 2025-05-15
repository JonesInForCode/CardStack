// src/utils/version.ts
import { useState, useEffect } from 'react';

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
  
  // Function to check for new version
  const checkForUpdates = async () => {
    try {
      // Add cache-busting query parameter
      const timestamp = new Date().getTime();
      const response = await fetch(`/version.json?t=${timestamp}`);
      
      if (!response.ok) {
        console.error('Failed to fetch version info');
        return;
      }
      
      const latestVersionInfo: VersionInfo = await response.json();
      setVersionInfo(latestVersionInfo);
      
      // Compare versions
      if (isNewerVersion(currentVersion, latestVersionInfo.version) || latestVersionInfo.requiredUpdate) {
        setUpdateAvailable(true);
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };
  
  // Check for updates on component mount and periodically
  useEffect(() => {
    // Initial check
    checkForUpdates();
    
    // Set up interval for periodic checks
    const intervalId = setInterval(checkForUpdates, checkInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [currentVersion, checkInterval]);
  
  // Function to force refresh the app
  const refreshApp = () => {
    // Clear any caches if needed
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    
    // Reload the page
    window.location.reload();
  };
  
  return { updateAvailable, versionInfo, refreshApp, checkForUpdates };
};