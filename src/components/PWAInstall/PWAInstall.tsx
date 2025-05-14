// src/components/PWAInstall/PWAInstall.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import IOSInstallGuide from './IOSInstallGuide';

// BeforeInstallPromptEvent is not in the standard DOM types
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const InstallContainer = styled(motion.div)`
  position: fixed;
  bottom: 80px; // Above the Footer
  left: 16px;
  right: 16px;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.large};
  padding: ${({ theme }) => theme.spacing.md};
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InstallTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const InstallDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const InstallButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const DismissButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const PWAInstall: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // For non-iOS devices, listen for the beforeinstallprompt event
    if (!isIOSDevice) {
      const handleBeforeInstallPrompt = (e: Event) => {
        // Prevent the default behavior
        e.preventDefault();
        // Store the event for later use
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        // Show our install prompt
        setShowInstallPrompt(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
      // Check if the app is already installed
      const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
      if (isAppInstalled) {
        setShowInstallPrompt(false);
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    } else {
      // For iOS, check if the app is in standalone mode
      // navigator.standalone is only available in Safari iOS
      const isInStandaloneMode = (window.navigator as any).standalone === true;
      
      // Show the iOS install prompt if not in standalone mode
      // and if the user hasn't dismissed it before
      const hasIOSPromptBeenShown = localStorage.getItem('iosInstallPromptShown');
      if (!isInStandaloneMode && hasIOSPromptBeenShown !== 'true') {
        setShowInstallPrompt(true);
      }
    }
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      // For iOS, show the guide
      setShowIOSGuide(true);
      // Hide the main prompt
      setShowInstallPrompt(false);
    } else if (deferredPrompt) {
      // For other devices, use the actual install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice;
      
      // Hide our custom prompt regardless of the outcome
      setShowInstallPrompt(false);
      
      // Clear the deferred prompt to capture future events
      setDeferredPrompt(null);
      
      // Optionally track the outcome for analytics
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    }
  };

  const handleDismiss = () => {
    // Hide the prompt
    setShowInstallPrompt(false);
    
    // For iOS, remember the user's choice to not show the prompt again
    if (isIOS) {
      localStorage.setItem('iosInstallPromptShown', 'true');
    }
  };

  return (
    <>
      {showInstallPrompt && (
        <InstallContainer
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <InstallTitle>Install CardStack</InstallTitle>
          <InstallDescription>
            {isIOS 
              ? 'Get the full app experience by adding CardStack to your home screen.'
              : 'Install CardStack as an app for the best experience'}
          </InstallDescription>
          
          <ButtonContainer>
            <InstallButton 
              whileTap={{ scale: 0.95 }}
              onClick={handleInstall}
            >
              {isIOS ? 'Show Me How' : 'Install'}
            </InstallButton>
            <DismissButton
              whileTap={{ scale: 0.95 }}
              onClick={handleDismiss}
            >
              Not Now
            </DismissButton>
          </ButtonContainer>
        </InstallContainer>
      )}

      <AnimatePresence>
        {showIOSGuide && (
          <IOSInstallGuide 
            onClose={() => {
              setShowIOSGuide(false);
              localStorage.setItem('iosInstallPromptShown', 'true');
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PWAInstall;