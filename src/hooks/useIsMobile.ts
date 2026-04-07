// src/hooks/useIsMobile.ts
import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the user is on a mobile device or a screen width typically considered mobile.
 * It checks for coarse pointers (touch screens) and viewport width <= 768px.
 *
 * @returns {boolean} true if the device is detected as mobile
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check for touch capability or typical mobile pointer
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      // Also fallback to a hover media query which some environments use to detect touch vs mouse
      const hasHoverCapability = window.matchMedia('(hover: hover)').matches;
      // Check screen width for standard responsive behavior
      const isSmallScreen = window.innerWidth <= 768;

      setIsMobile(hasCoarsePointer || !hasHoverCapability || isSmallScreen);
    };

    // Initial check
    checkMobile();

    // Add listener for screen resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};
