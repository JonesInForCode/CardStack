// src/components/PWAInstall/IOSInstallGuide.tsx
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface IOSInstallGuideProps {
  onClose: () => void;
}

const GuideOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  z-index: ${({ theme }) => theme.zIndices.modal};
`;

const GuideContent = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const GuideTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StepContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StepNumber = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const StepTitle = styled.h3`
  display: inline;
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StepDescription = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  margin-left: 40px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const ShareIcon = styled.div`
  background-color: #f0f0f0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

// Simple share icon SVG
const ShareIconSVG = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" 
      stroke="#000000" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M16 6l-4-4-4 4" 
      stroke="#000000" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 2v13" 
      stroke="#000000" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Plus icon SVG
const PlusIconSVG = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 5v14M5 12h14" 
      stroke="#000000" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const IOSInstallGuide = ({ onClose }: IOSInstallGuideProps) => {
  return (
    <GuideOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <GuideContent
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <GuideTitle>How to Install CardStack on iOS</GuideTitle>
        
        <StepContainer>
          <StepNumber>1</StepNumber>
          <StepTitle>Tap the Share Button</StepTitle>
          <StepDescription>
            Tap the "Share" button at the bottom of your browser.
          </StepDescription>
          <IconContainer>
            <ShareIcon>
              <ShareIconSVG />
            </ShareIcon>
          </IconContainer>
        </StepContainer>
        
        <StepContainer>
          <StepNumber>2</StepNumber>
          <StepTitle>Tap "Add to Home Screen"</StepTitle>
          <StepDescription>
            Scroll down in the share menu until you see "Add to Home Screen" and tap it.
          </StepDescription>
          <IconContainer>
            <ShareIcon>
              <PlusIconSVG />
            </ShareIcon>
          </IconContainer>
        </StepContainer>
        
        <StepContainer>
          <StepNumber>3</StepNumber>
          <StepTitle>Tap "Add"</StepTitle>
          <StepDescription>
            You can edit the name if you want, then tap "Add" in the top right corner.
          </StepDescription>
        </StepContainer>
        
        <StepContainer>
          <StepNumber>4</StepNumber>
          <StepTitle>Enjoy CardStack as an App!</StepTitle>
          <StepDescription>
            CardStack will now appear on your home screen as a standalone app!
          </StepDescription>
        </StepContainer>
        
        <CloseButton
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
        >
          Got It
        </CloseButton>
      </GuideContent>
    </GuideOverlay>
  );
};

export default IOSInstallGuide;